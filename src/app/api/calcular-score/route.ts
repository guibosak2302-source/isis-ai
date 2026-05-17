import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { recalcularScore } from "@/lib/scoreCalculator";

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

  const { prestador_id } = await request.json() as { prestador_id: string };
  if (!prestador_id) return NextResponse.json({ error: "prestador_id obrigatório" }, { status: 400 });

  const result = await recalcularScore(prestador_id);
  return NextResponse.json(result);
}
