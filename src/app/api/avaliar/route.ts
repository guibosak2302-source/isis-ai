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

  const { contrato_id, avaliado_id, nota, comentario } = await request.json() as {
    contrato_id: string;
    avaliado_id: string;
    nota: number;
    comentario?: string;
  };

  if (!contrato_id || !avaliado_id || nota < 1 || nota > 5) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Verify contract is concluded
  const { data: contrato } = await supabase
    .from("contratos")
    .select("id, status")
    .eq("id", contrato_id)
    .single();

  if (!contrato) {
    return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
  }
  if (contrato.status !== "concluido") {
    return NextResponse.json({ error: "O contrato precisa estar concluído para avaliar" }, { status: 400 });
  }

  // Prevent duplicate evaluations
  const { data: existing } = await supabase
    .from("avaliacoes")
    .select("id")
    .eq("contrato_id", contrato_id)
    .eq("avaliador_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Você já avaliou este contrato" }, { status: 409 });
  }

  // Map single nota to all criteria columns
  const { error: dbError } = await supabase.from("avaliacoes").insert({
    contrato_id,
    avaliador_id: user.id,
    avaliado_id,
    qualidade:    nota,
    pontualidade: nota,
    comunicacao:  nota,
    preco:        nota,
    comentario:   comentario || null,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Recalculate score asynchronously — don't block the response
  void recalcularScore(avaliado_id).catch((e) =>
    console.warn("Score recalculation failed:", e)
  );

  return NextResponse.json({ ok: true });
}
