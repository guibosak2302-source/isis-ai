import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { notificarWhatsApp } from "@/lib/notificar";

const ASAAS = "https://sandbox.asaas.com/api/v3";
const asaasHeaders = () => ({ access_token: process.env.ASAAS_TOKEN ?? "" });

async function getOrCreateCustomer(name: string, email: string): Promise<string> {
  // Search existing customer by email
  const search = await axios.get(`${ASAAS}/customers`, {
    params: { email },
    headers: asaasHeaders(),
  });
  const existing = search.data?.data?.[0];
  if (existing?.id) return existing.id as string;

  // Create new customer with sandbox placeholder CPF
  const created = await axios.post(
    `${ASAAS}/customers`,
    { name, email, cpfCnpj: "00000000191" },
    { headers: asaasHeaders() }
  );
  return created.data.id as string;
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { contrato_id, valor, descricao } = await request.json() as {
    contrato_id: string;
    valor: number;
    descricao: string;
  };

  // Fetch contrato to get party IDs
  const { data: contrato } = await supabase
    .from("contratos")
    .select("id, contratante_id, prestador_id")
    .eq("id", contrato_id)
    .single();

  if (!contrato) return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });

  // Fetch contratante profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", contrato.contratante_id)
    .single();

  const contratanteName  = profile?.full_name ?? "Contratante";
  const contratanteEmail = user.email ?? `${contrato.contratante_id}@bico.ai`;

  try {
    // 1. Get or create Asaas customer
    const customerId = await getOrCreateCustomer(contratanteName, contratanteEmail);

    // 2. Create Pix payment
    const dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const resposta = await axios.post(
      `${ASAAS}/payments`,
      {
        customer: customerId,
        billingType: "PIX",
        value: valor,
        dueDate,
        description: descricao,
        externalReference: contrato_id,
      },
      { headers: asaasHeaders() }
    );
    const asaasId: string = resposta.data.id;

    // 3. Get Pix QR Code
    const qrcode = await axios.get(`${ASAAS}/payments/${asaasId}/pixQrCode`, {
      headers: asaasHeaders(),
    });
    const pixQrcode    = (qrcode.data.encodedImage as string) ?? "";
    const pixCopiaCola = (qrcode.data.payload      as string) ?? "";

    // 4. Save to pagamentos table
    const { data: pagamento, error: dbError } = await supabase
      .from("pagamentos")
      .insert({
        contrato_id,
        valor,
        asaas_id: asaasId,
        status: "pendente",
        pix_qrcode:    pixQrcode,
        pix_copia_cola: pixCopiaCola,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Notify prestador that a payment was initiated
    void notificarWhatsApp(
      contrato.prestador_id as string,
      `💰 Bico AI: Você recebeu um pagamento de R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}. Acesse o app para conferir.`
    ).catch(() => {});

    return NextResponse.json({
      id: pagamento.id,
      pix_copia_cola: pixCopiaCola,
      pix_qrcode: pixQrcode,
      asaas_id: asaasId,
    });

  } catch (err) {
    const axiosErr = err as AxiosError;
    const detail = axiosErr.response?.data ?? axiosErr.message;
    return NextResponse.json({ error: "Erro ao criar cobrança", detail }, { status: 502 });
  }
}
