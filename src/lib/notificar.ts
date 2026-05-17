import axios from "axios";
import { createClient } from "@supabase/supabase-js";

export async function notificarWhatsApp(userId: string, mensagem: string): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, notificacoes_whatsapp")
    .eq("id", userId)
    .single();

  if (!profile?.phone || !profile.notificacoes_whatsapp) return;

  const { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;
  if (!ZAPI_INSTANCE || !ZAPI_TOKEN || !ZAPI_CLIENT_TOKEN) return;

  try {
    await axios.post(
      `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
      { phone: profile.phone, message: mensagem },
      { headers: { "Client-Token": ZAPI_CLIENT_TOKEN } }
    );
  } catch {
    // Silent — notification failure must not break the main flow
  }
}
