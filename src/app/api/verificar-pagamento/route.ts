import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const ASAAS = "https://sandbox.asaas.com/api/v3";
const asaasHeaders = () => ({ access_token: process.env.ASAAS_TOKEN ?? "" });

const ASAAS_TO_DB: Record<string, string> = {
  PENDING:    "pendente",
  AWAITING:   "aguardando",
  CONFIRMED:  "pago",
  RECEIVED:   "pago",
  OVERDUE:    "pendente",
  CANCELLED:  "cancelado",
};

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

  const { pagamento_id, asaas_id } = await request.json() as {
    pagamento_id: string;
    asaas_id: string;
  };

  try {
    const res = await axios.get(`${ASAAS}/payments/${asaas_id}`, {
      headers: asaasHeaders(),
    });

    const asaasStatus: string = res.data.status ?? "PENDING";
    const dbStatus = ASAAS_TO_DB[asaasStatus] ?? "pendente";
    const pago = dbStatus === "pago";

    await supabase
      .from("pagamentos")
      .update({
        status: dbStatus,
        ...(pago ? { paid_at: new Date().toISOString() } : {}),
      })
      .eq("id", pagamento_id);

    return NextResponse.json({ status: dbStatus, pago });

  } catch (err) {
    const axiosErr = err as AxiosError;
    const detail = axiosErr.response?.data ?? axiosErr.message;
    return NextResponse.json({ error: "Erro ao verificar pagamento", detail }, { status: 502 });
  }
}
