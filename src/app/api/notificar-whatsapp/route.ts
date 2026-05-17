import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

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

  const body = await request.json() as {
    user_id?: string;
    telefone?: string;
    mensagem: string;
    tipo: string;
  };

  const { user_id, mensagem, tipo } = body;
  let { telefone } = body;

  if (!mensagem) {
    return NextResponse.json({ error: "mensagem é obrigatória" }, { status: 400 });
  }

  // If user_id is provided, look up phone and check notification preference
  if (user_id) {
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await serviceSupabase
      .from("profiles")
      .select("phone, notificacoes_whatsapp")
      .eq("id", user_id)
      .single();

    if (!profile?.phone || !profile.notificacoes_whatsapp) {
      return NextResponse.json({ ok: true, skipped: true });
    }
    telefone = profile.phone as string;
  }

  if (!telefone) {
    return NextResponse.json({ error: "user_id ou telefone é obrigatório" }, { status: 400 });
  }

  const { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;
  if (!ZAPI_INSTANCE || !ZAPI_TOKEN || !ZAPI_CLIENT_TOKEN) {
    return NextResponse.json({ error: "Z-API não configurada" }, { status: 503 });
  }

  try {
    const resposta = await axios.post(
      `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
      { phone: telefone, message: mensagem },
      { headers: { "Client-Token": ZAPI_CLIENT_TOKEN } }
    );
    return NextResponse.json({ ok: true, tipo, zapiId: resposta.data?.id });
  } catch (err) {
    const axiosErr = err as AxiosError;
    const detail = axiosErr.response?.data ?? axiosErr.message;
    return NextResponse.json({ error: "Erro ao enviar notificação", detail }, { status: 502 });
  }
}
