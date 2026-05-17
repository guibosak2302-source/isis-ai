import { createClient } from "@supabase/supabase-js";

export interface ScoreResult {
  score: number;
  seal: "bronze" | "prata" | "ouro" | null;
}

export async function recalcularScore(prestador_id: string): Promise<ScoreResult> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { count: contratosConcluidos },
    { data: avaliacoesData },
    { count: candidaturasAceitas },
    { data: contratosData },
  ] = await Promise.all([
    supabase
      .from("contratos")
      .select("id", { count: "exact", head: true })
      .eq("prestador_id", prestador_id)
      .eq("status", "concluido"),
    supabase
      .from("avaliacoes")
      .select("qualidade, pontualidade, comunicacao, preco")
      .eq("avaliado_id", prestador_id),
    supabase
      .from("candidaturas")
      .select("id", { count: "exact", head: true })
      .eq("prestador_id", prestador_id)
      .eq("status", "aceito"),
    supabase
      .from("contratos")
      .select("id")
      .eq("prestador_id", prestador_id),
  ]);

  let mediaAvaliacoes = 0;
  if (avaliacoesData && avaliacoesData.length > 0) {
    const soma = avaliacoesData.reduce((acc, av) => {
      const media = ((av.qualidade ?? 0) + (av.pontualidade ?? 0) + (av.comunicacao ?? 0) + (av.preco ?? 0)) / 4;
      return acc + media;
    }, 0);
    mediaAvaliacoes = soma / avaliacoesData.length;
  }

  const ids = contratosData?.map((c) => c.id) ?? [];
  let pagamentosRecebidos = 0;
  if (ids.length > 0) {
    const { count } = await supabase
      .from("pagamentos")
      .select("id", { count: "exact", head: true })
      .in("contrato_id", ids)
      .eq("status", "liberado");
    pagamentosRecebidos = count ?? 0;
  }

  const raw =
    mediaAvaliacoes * 40 +
    (contratosConcluidos ?? 0) * 30 +
    (candidaturasAceitas ?? 0) * 20 +
    pagamentosRecebidos * 10;

  const score = Math.min(Math.round(raw), 1000);

  const seal: "bronze" | "prata" | "ouro" | null =
    score >= 800 ? "ouro" :
    score >= 500 ? "prata" :
    score >= 200 ? "bronze" :
    null;

  await supabase
    .from("profiles")
    .update({ score, seal })
    .eq("id", prestador_id);

  return { score, seal };
}
