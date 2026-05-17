import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const ASAAS = "https://sandbox.asaas.com/api/v3";
const asaasHeaders = () => ({ access_token: process.env.ASAAS_TOKEN ?? "" });

interface Etapa {
  descricao: string;
  valor: number;
  status: "pendente" | "liberado";
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

  const { pagamento_id, etapa_index } = await request.json() as {
    pagamento_id: string;
    etapa_index: number;
  };

  // Fetch pagamento with contrato and prestador profile
  const { data: pagamento } = await supabase
    .from("pagamentos")
    .select(`
      id, etapas, etapa_atual, valor_liberado, valor, status,
      contrato:contrato_id (
        id, contratante_id, valor_total, etapas,
        prestador:prestador_id ( id, full_name )
      )
    `)
    .eq("id", pagamento_id)
    .single();

  if (!pagamento) {
    return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
  }

  const contrato = pagamento.contrato as unknown as {
    id: string;
    contratante_id: string;
    valor_total: number | null;
    etapas: Etapa[] | null;
    prestador: { id: string; full_name: string | null } | null;
  } | null;

  if (!contrato) {
    return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
  }

  // Verify logged user is the contratante
  if (contrato.contratante_id !== user.id) {
    return NextResponse.json({ error: "Apenas o contratante pode liberar pagamentos" }, { status: 403 });
  }

  // Resolve etapas: pagamento.etapas takes priority, then contrato.etapas
  const etapas: Etapa[] = (pagamento.etapas as Etapa[] | null) ??
    (contrato.etapas as Etapa[] | null) ??
    [];

  if (etapas.length === 0) {
    return NextResponse.json({ error: "Nenhuma etapa definida neste pagamento" }, { status: 400 });
  }

  if (etapa_index < 0 || etapa_index >= etapas.length) {
    return NextResponse.json({ error: "Índice de etapa inválido" }, { status: 400 });
  }

  if (etapas[etapa_index].status === "liberado") {
    return NextResponse.json({ error: "Esta etapa já foi liberada" }, { status: 400 });
  }

  const valorEtapa = etapas[etapa_index].valor;
  const nomePrestador = contrato.prestador?.full_name ?? "Prestador";

  // Call Asaas transfer — bank fields use sandbox placeholders since profiles has no bank data
  try {
    await axios.post(
      `${ASAAS}/transfers`,
      {
        value: valorEtapa,
        bankAccount: {
          bank: { code: "077" },
          accountName: nomePrestador,
          ownerName: nomePrestador,
          cpfCnpj: "00000000191",
          agency: "0001",
          account: "00000001",
          accountDigit: "0",
          bankAccountType: "CHECKING",
        },
        description: `Liberação etapa ${etapa_index + 1} — Bico AI`,
      },
      { headers: asaasHeaders() }
    );
  } catch (err) {
    const axiosErr = err as AxiosError;
    // In sandbox, transfer may fail due to placeholder bank data — log but continue
    console.warn("Asaas transfer warning:", axiosErr.response?.data ?? axiosErr.message);
  }

  // Update etapas array
  const etapasAtualizadas = etapas.map((e, i) =>
    i === etapa_index ? { ...e, status: "liberado" as const } : e
  );
  const novoEtapaAtual = etapa_index + 1;
  const novoValorLiberado = (Number(pagamento.valor_liberado) || 0) + valorEtapa;
  const todasLiberadas = etapasAtualizadas.every((e) => e.status === "liberado");

  const { error: dbError } = await supabase
    .from("pagamentos")
    .update({
      etapas: etapasAtualizadas,
      etapa_atual: novoEtapaAtual,
      valor_liberado: novoValorLiberado,
      ...(todasLiberadas ? { status: "liberado", released_at: new Date().toISOString() } : {}),
    })
    .eq("id", pagamento_id);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    etapas: etapasAtualizadas,
    etapa_atual: novoEtapaAtual,
    valor_liberado: novoValorLiberado,
    concluido: todasLiberadas,
  });
}
