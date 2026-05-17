import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
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

  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get("latitude") ?? "");
  const lng = parseFloat(url.searchParams.get("longitude") ?? "");
  const categoria = url.searchParams.get("categoria") ?? "";
  const raio = parseFloat(url.searchParams.get("raio") ?? "50");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "latitude e longitude são obrigatórios" }, { status: 400 });
  }

  let query = supabase
    .from("profiles")
    .select("id, full_name, avatar_url, city, state, category, score, seal, verified, latitude, longitude")
    .eq("type", "prestador")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (categoria) {
    query = query.eq("category", categoria);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  interface Prestador {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    state: string | null;
    category: string | null;
    score: number | null;
    seal: string | null;
    verified: boolean | null;
    latitude: number | null;
    longitude: number | null;
    distancia_km?: number;
  }

  const prestadores = (data as Prestador[])
    .map((p) => ({
      ...p,
      distancia_km: haversine(lat, lng, p.latitude!, p.longitude!),
    }))
    .filter((p) => p.distancia_km <= raio)
    .sort((a, b) => {
      const distDiff = a.distancia_km - b.distancia_km;
      if (Math.abs(distDiff) > 5) return distDiff;
      return (b.score ?? 0) - (a.score ?? 0);
    });

  return NextResponse.json({ prestadores, total: prestadores.length });
}
