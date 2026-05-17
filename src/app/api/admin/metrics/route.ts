import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token");
  if (token !== "guilherme2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date().toISOString().split("T")[0];

  const [
    { count: totalUsers },
    { count: totalPosts },
    { count: totalCandidaturas },
    { count: totalContratos },
    { count: totalPagamentos },
    { data: pagamentosData },
    { count: newUsersToday },
    { count: newPostsToday },
    { data: lastUsers },
    { data: crescimento },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("candidaturas").select("*", { count: "exact", head: true }),
    supabase.from("contratos").select("*", { count: "exact", head: true }),
    supabase.from("pagamentos").select("*", { count: "exact", head: true }),
    supabase.from("pagamentos").select("valor").eq("status", "pago"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today),
    supabase
      .from("profiles")
      .select("id, full_name, type, created_at, city, state")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("profiles")
      .select("created_at")
      .order("created_at", { ascending: true }),
  ]);

  const valorTotal = (pagamentosData ?? []).reduce(
    (sum: number, p: { valor: number | null }) => sum + (p.valor ?? 0),
    0
  );

  // Group crescimento by day (last 14 days)
  const dayCounts: Record<string, number> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayCounts[d.toISOString().split("T")[0]] = 0;
  }
  (crescimento ?? []).forEach((u: { created_at: string }) => {
    const day = u.created_at.split("T")[0];
    if (day in dayCounts) dayCounts[day]++;
  });

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalPosts: totalPosts ?? 0,
    totalCandidaturas: totalCandidaturas ?? 0,
    totalContratos: totalContratos ?? 0,
    totalPagamentos: totalPagamentos ?? 0,
    valorTotal,
    newUsersToday: newUsersToday ?? 0,
    newPostsToday: newPostsToday ?? 0,
    lastUsers: lastUsers ?? [],
    crescimento: Object.entries(dayCounts).map(([date, count]) => ({
      date,
      count,
    })),
  });
}
