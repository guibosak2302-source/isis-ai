import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  const total = count ?? 0;
  const restam = Math.max(0, 500 - total);
  return NextResponse.json({ total, restam, limite: 500 });
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Invites can be sent by unauthenticated users too (just track the email)

  const { email_indicado } = (await request.json()) as {
    email_indicado: string;
  };
  if (!email_indicado || !email_indicado.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await serviceSupabase.from("convites").insert({
    email_indicado: email_indicado.toLowerCase().trim(),
    indicado_por: user?.id ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Este email já foi indicado" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
