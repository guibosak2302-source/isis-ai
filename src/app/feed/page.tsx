"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import BuscaLocalizacao from "@/components/BuscaLocalizacao";

/* ── Types ───────────────────────────────────────────────────────── */
interface Profile {
  id: string; full_name: string | null; email: string | null;
  avatar_url: string | null; city: string | null; score: number | null;
  seal: string | null; verified: boolean | null;
}
interface Post {
  id: string; user_id: string; title: string | null; description: string | null;
  category: string | null; city: string | null; budget_min: number | null;
  photo_url: string | null; created_at: string;
  latitude: number | null; longitude: number | null;
  profiles: Profile | null;
}
interface FilterState {
  categories: string[];
  city: string; userLat: number | null; userLng: number | null; locationLabel: string; radius: number;
  budgetMin: string; budgetMax: string;
  serviceType: string;
  sortBy: string;
  availability: string[];
}

/* ── Constants ───────────────────────────────────────────────────── */
const CATEGORIES = ["Limpeza","Elétrica","Hidráulica","Pintura","Montagem","Mudança","Jardinagem","Informática","Outros"];
const RADIUS_OPTIONS = [5, 10, 25, 50];
const SORT_OPTIONS = [
  { value: "recent",    label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço"   },
  { value: "price_desc",label: "Maior preço"   },
  { value: "nearest",   label: "Mais próximos" },
];
const AVAILABILITY_OPTIONS = ["Urgente (hoje)", "Esta semana", "Flexível"];
const SERVICE_TYPES = ["Residencial", "Comercial", "Ambos"];
const DEFAULT_FILTERS: FilterState = {
  categories: [], city: "", userLat: null, userLng: null, locationLabel: "", radius: 25,
  budgetMin: "", budgetMax: "", serviceType: "Ambos", sortBy: "recent", availability: [],
};

/* ── Helpers ─────────────────────────────────────────────────────── */
function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── FeedPage ────────────────────────────────────────────────────── */
export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [myInterests, setMyInterests] = useState<Set<string>>(new Set());
  const [interestCounts, setInterestCounts] = useState<Record<string, number>>({});
  const [pending, setPending] = useState<FilterState>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<FilterState>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: { user } }, { data }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("posts")
          .select(`*, profiles (id, full_name, email, avatar_url, city, score, seal, verified)`)
          .eq("status", "aberto")
          .order("created_at", { ascending: false })
          .limit(100),
      ]);
      const uid = user?.id ?? null;
      setUserId(uid);
      const loaded = (data as Post[]) ?? [];
      setPosts(loaded);
      if (!loaded.length) return;
      const postIds = loaded.map((p) => p.id);
      const [{ data: allInts }, { data: myInts }] = await Promise.all([
        supabase.from("candidaturas").select("post_id").eq("status", "interesse").in("post_id", postIds),
        uid
          ? supabase.from("candidaturas").select("post_id").eq("prestador_id", uid).eq("status", "interesse").in("post_id", postIds)
          : Promise.resolve({ data: [] }),
      ]);
      const counts: Record<string, number> = {};
      for (const r of (allInts ?? [])) counts[r.post_id] = (counts[r.post_id] ?? 0) + 1;
      setInterestCounts(counts);
      setMyInterests(new Set((myInts ?? []).map((r: { post_id: string }) => r.post_id)));
    }
    load();
  }, []);

  async function toggleInteresse(post: Post) {
    if (!userId) { router.replace("/login"); return; }
    const supabase = createClient();
    if (myInterests.has(post.id)) {
      await supabase.from("candidaturas").delete().eq("post_id", post.id).eq("prestador_id", userId).eq("status", "interesse");
      setMyInterests((prev) => { const s = new Set(prev); s.delete(post.id); return s; });
      setInterestCounts((prev) => ({ ...prev, [post.id]: Math.max(0, (prev[post.id] ?? 1) - 1) }));
    } else {
      const { data: existing } = await supabase.from("candidaturas").select("id, status").eq("post_id", post.id).eq("prestador_id", userId).maybeSingle();
      if (existing) return;
      await supabase.from("candidaturas").insert({ post_id: post.id, prestador_id: userId, status: "interesse", proposta: "Tenho interesse neste serviço", preco: 0 });
      setMyInterests((prev) => new Set([...prev, post.id]));
      setInterestCounts((prev) => ({ ...prev, [post.id]: (prev[post.id] ?? 0) + 1 }));
    }
  }

  function pegarLocalizacao() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setPending((p) => ({ ...p, userLat: pos.coords.latitude, userLng: pos.coords.longitude, locationLabel: "Sua localização", city: "" })); setGeoLoading(false); },
      () => setGeoLoading(false),
    );
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of (posts ?? [])) if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return null;
    let r = [...posts];
    if (applied.categories.length > 0) r = r.filter((p) => p.category && applied.categories.includes(p.category));
    if (applied.city) {
      const n = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      r = r.filter((p) => p.city && n(p.city).includes(n(applied.city)));
    }
    if (applied.userLat !== null && applied.userLng !== null) {
      const lat = applied.userLat, lng = applied.userLng, rad = applied.radius;
      r = r.filter((p) => !p.latitude || !p.longitude || haversine(lat, lng, p.latitude, p.longitude) <= rad);
    }
    if (applied.budgetMin) r = r.filter((p) => p.budget_min == null || p.budget_min >= parseFloat(applied.budgetMin));
    if (applied.budgetMax) r = r.filter((p) => p.budget_min == null || p.budget_min <= parseFloat(applied.budgetMax));
    if (applied.availability.length > 0) {
      const now = Date.now();
      r = r.filter((p) => {
        const h = (now - new Date(p.created_at).getTime()) / 3600000;
        return (applied.availability.includes("Urgente (hoje)") && h <= 24)
          || (applied.availability.includes("Esta semana") && h <= 168)
          || applied.availability.includes("Flexível");
      });
    }
    if (applied.sortBy === "price_asc") r.sort((a, b) => (a.budget_min ?? 0) - (b.budget_min ?? 0));
    else if (applied.sortBy === "price_desc") r.sort((a, b) => (b.budget_min ?? 0) - (a.budget_min ?? 0));
    else if (applied.sortBy === "nearest" && applied.userLat !== null && applied.userLng !== null) {
      const lat = applied.userLat, lng = applied.userLng;
      r.sort((a, b) =>
        (a.latitude && a.longitude ? haversine(lat, lng, a.latitude, a.longitude) : 9999) -
        (b.latitude && b.longitude ? haversine(lat, lng, b.latitude, b.longitude) : 9999));
    }
    return r;
  }, [posts, applied]);

  const hasFilters = applied.categories.length > 0 || !!applied.city || applied.userLat !== null
    || !!applied.budgetMin || !!applied.budgetMax || applied.availability.length > 0
    || applied.serviceType !== "Ambos" || applied.sortBy !== "recent";

  function applyFilters() { setApplied({ ...pending }); setDrawerOpen(false); }
  function clearFilters() { setPending(DEFAULT_FILTERS); setApplied(DEFAULT_FILTERS); }

  const filterPanelProps = { pending, onChange: setPending, onApply: applyFilters, onClear: clearFilters, categoryCounts, geoLoading, onGeo: pegarLocalizacao };

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <style>{`
        .feed-layout { display: flex; align-items: flex-start; gap: 24px; max-width: 1280px; margin: 0 auto; padding: 20px 24px 0; }
        .filter-sidebar { width: 280px; flex-shrink: 0; position: sticky; top: 80px; max-height: calc(100vh - 96px); overflow-y: auto; scrollbar-width: none; }
        .posts-area { flex: 1; min-width: 0; }
        .filter-mobile-btn { display: none !important; }
        @media (max-width: 1023px) {
          .filter-sidebar { display: none; }
          .filter-mobile-btn { display: flex !important; }
          .feed-layout { padding: 12px 16px 0; }
        }
      `}</style>

      <Navbar onFilterOpen={() => setDrawerOpen(true)} hasFilters={hasFilters} />

      <main style={{ paddingTop: "64px", paddingBottom: "88px" }}>
        <div className="feed-layout">

          {/* ── Desktop sidebar ── */}
          <aside className="filter-sidebar">
            <div style={{ backgroundColor: "#141414", border: "1px solid #252525", borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid #1E1E1E", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0" }}>Filtros</span>
                {hasFilters && (
                  <button onClick={clearFilters} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#FFD11A", fontFamily: "var(--font-inter), Inter, sans-serif", padding: 0 }}>
                    Limpar
                  </button>
                )}
              </div>
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* ── Posts area ── */}
          <div className="posts-area">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0" }}>
                  {applied.city ? `Pedidos em ${applied.city}` : applied.categories.length === 1 ? applied.categories[0] : "Feed de pedidos"}
                </h2>
                {filteredPosts && filteredPosts.length > 0 && (
                  <p style={{ fontSize: "13px", color: "#555555", marginTop: "2px" }}>
                    {filteredPosts.length} pedido{filteredPosts.length !== 1 ? "s" : ""}{hasFilters ? " · filtrado" : ""}
                  </p>
                )}
              </div>
            </div>

            {filteredPosts === null ? (
              <LoadingSkeleton />
            ) : filteredPosts.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: "80px" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <p style={{ fontSize: "16px", fontWeight: 500, color: "#888888", marginBottom: "8px" }}>Nenhum pedido ainda</p>
                <p style={{ fontSize: "13px", color: "#555555", marginBottom: "24px" }}>
                  {hasFilters ? "Tente ajustar os filtros" : "Seja o primeiro a postar!"}
                </p>
                {!hasFilters && (
                  <Link href="/novo-pedido" style={{ display: "inline-flex", alignItems: "center", height: "44px", padding: "0 28px", backgroundColor: "#FFD11A", color: "#0F0F0F", borderRadius: "999px", fontSize: "14px", fontWeight: 500, textDecoration: "none", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                    Criar pedido
                  </Link>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredPosts.map((post) => {
                  const distKm = applied.userLat !== null && applied.userLng !== null && post.latitude !== null && post.longitude !== null
                    ? haversine(applied.userLat, applied.userLng, post.latitude, post.longitude)
                    : undefined;
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      interested={myInterests.has(post.id)}
                      interestCount={interestCounts[post.id] ?? 0}
                      onInteresse={() => toggleInteresse(post)}
                      distKm={distKm}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav active="Feed" />

      {/* ── Mobile filter drawer ── */}
      {drawerOpen && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", zIndex: 100, backdropFilter: "blur(2px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101, backgroundColor: "#111111", border: "1px solid #2E2E2E", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid #222222", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Filtros</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888888", fontSize: "22px", lineHeight: 1, padding: "2px 6px", fontFamily: "var(--font-inter), Inter, sans-serif" }}>×</button>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              <FilterPanel {...filterPanelProps} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── FilterPanel ─────────────────────────────────────────────────── */
function FilterPanel({
  pending, onChange, onApply, onClear, categoryCounts, geoLoading, onGeo,
}: {
  pending: FilterState;
  onChange: (f: FilterState) => void;
  onApply: () => void;
  onClear: () => void;
  categoryCounts: Record<string, number>;
  geoLoading: boolean;
  onGeo: () => void;
}) {
  const total = Object.values(categoryCounts).reduce((s, n) => s + n, 0);

  return (
    <div>
      {/* CATEGORIA */}
      <FilterSection title="Categoria">
        <label style={ckRow}>
          <input type="checkbox" checked={pending.categories.length === 0} onChange={() => onChange({ ...pending, categories: [] })} style={ckBox} />
          <span style={ckLabel}>Todos</span>
          {total > 0 && <span style={countBadge}>{total}</span>}
        </label>
        {CATEGORIES.map((cat) => (
          <label key={cat} style={ckRow}>
            <input
              type="checkbox"
              checked={pending.categories.includes(cat)}
              onChange={() => {
                const cats = pending.categories.includes(cat)
                  ? pending.categories.filter((c) => c !== cat)
                  : [...pending.categories, cat];
                onChange({ ...pending, categories: cats });
              }}
              style={ckBox}
            />
            <span style={{ ...ckLabel, flex: 1 }}>{cat}</span>
            {categoryCounts[cat] && <span style={countBadge}>{categoryCounts[cat]}</span>}
          </label>
        ))}
      </FilterSection>

      <FDivider />

      {/* LOCALIZAÇÃO */}
      <FilterSection title="Localização">
        <BuscaLocalizacao
          placeholder="Cidade ou bairro…"
          height={40}
          onSelect={(place) => onChange({ ...pending, city: place.city || place.label, userLat: place.lat, userLng: place.lng, locationLabel: place.label })}
        />
        <button
          onClick={onGeo} disabled={geoLoading}
          style={{ marginTop: "8px", width: "100%", height: "38px", backgroundColor: pending.userLat ? "#FFD11A10" : "#1A1A1A", border: `1px solid ${pending.userLat ? "#FFD11A40" : "#2E2E2E"}`, borderRadius: "8px", cursor: geoLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          {geoLoading ? <SpinnerIcon /> : <LocateIcon active={!!pending.userLat} />}
          <span style={{ fontSize: "12px", color: pending.userLat ? "#FFD11A" : "#888888" }}>Usar minha localização</span>
        </button>
        {pending.userLat !== null && (
          <>
            <p style={{ fontSize: "12px", color: "#FFD11A", marginTop: "8px" }}>📍 {pending.locationLabel || "Localização definida"}</p>
            <div style={{ marginTop: "12px" }}>
              <p style={{ fontSize: "11px", color: "#666666", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Raio de distância</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r} onClick={() => onChange({ ...pending, radius: r })}
                    style={{ height: "30px", padding: "0 12px", borderRadius: "999px", border: `1px solid ${pending.radius === r ? "#FFD11A" : "#2E2E2E"}`, backgroundColor: pending.radius === r ? "#FFD11A18" : "transparent", color: pending.radius === r ? "#FFD11A" : "#888888", fontSize: "12px", cursor: "pointer", fontFamily: "var(--font-inter), Inter, sans-serif" }}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </FilterSection>

      <FDivider />

      {/* ORÇAMENTO */}
      <FilterSection title="Orçamento (R$)">
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="number" placeholder="Mínimo" value={pending.budgetMin} min={0}
            onChange={(e) => onChange({ ...pending, budgetMin: e.target.value })}
            style={numInput}
          />
          <span style={{ color: "#555555", fontSize: "14px", flexShrink: 0 }}>–</span>
          <input
            type="number" placeholder="Máximo" value={pending.budgetMax} min={0}
            onChange={(e) => onChange({ ...pending, budgetMax: e.target.value })}
            style={numInput}
          />
        </div>
      </FilterSection>

      <FDivider />

      {/* TIPO DE SERVIÇO */}
      <FilterSection title="Tipo de serviço">
        {SERVICE_TYPES.map((t) => (
          <label key={t} style={ckRow}>
            <input type="radio" checked={pending.serviceType === t} onChange={() => onChange({ ...pending, serviceType: t })} style={ckBox} />
            <span style={ckLabel}>{t}</span>
          </label>
        ))}
      </FilterSection>

      <FDivider />

      {/* ORDENAR POR */}
      <FilterSection title="Ordenar por">
        {SORT_OPTIONS.map((opt) => (
          <label key={opt.value} style={ckRow}>
            <input type="radio" checked={pending.sortBy === opt.value} onChange={() => onChange({ ...pending, sortBy: opt.value })} style={ckBox} />
            <span style={ckLabel}>{opt.label}</span>
          </label>
        ))}
      </FilterSection>

      <FDivider />

      {/* DISPONIBILIDADE */}
      <FilterSection title="Disponibilidade">
        {AVAILABILITY_OPTIONS.map((opt) => (
          <label key={opt} style={ckRow}>
            <input
              type="checkbox"
              checked={pending.availability.includes(opt)}
              onChange={() => {
                const avail = pending.availability.includes(opt)
                  ? pending.availability.filter((a) => a !== opt)
                  : [...pending.availability, opt];
                onChange({ ...pending, availability: avail });
              }}
              style={ckBox}
            />
            <span style={ckLabel}>{opt}</span>
          </label>
        ))}
      </FilterSection>

      {/* Action buttons */}
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={onApply}
          style={{ width: "100%", height: "44px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
        >
          Aplicar filtros
        </button>
        <button
          onClick={onClear}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif", textAlign: "center", padding: "4px" }}
        >
          Limpar filtros
        </button>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: "14px 20px" }}>
      <p style={{ fontSize: "11px", fontWeight: 600, color: "#666666", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>{title}</p>
      {children}
    </section>
  );
}
function FDivider() { return <div style={{ height: "1px", backgroundColor: "#1E1E1E" }} />; }

/* filter shared styles */
const ckRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", cursor: "pointer", userSelect: "none" };
const ckLabel: React.CSSProperties = { fontSize: "13px", color: "#C0C0C0" };
const ckBox: React.CSSProperties = { width: "15px", height: "15px", accentColor: "#FFD11A", cursor: "pointer", flexShrink: 0 };
const countBadge: React.CSSProperties = { fontSize: "11px", color: "#555555", backgroundColor: "#1E1E1E", borderRadius: "4px", padding: "1px 6px" };
const numInput: React.CSSProperties = { flex: 1, height: "38px", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "8px", padding: "0 10px", fontSize: "13px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", minWidth: 0, boxSizing: "border-box" };

/* ── Loading Skeleton ────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ height: "180px", backgroundColor: "#222222" }} />
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#2A2A2A", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: "40%", height: 13, borderRadius: 4, backgroundColor: "#2A2A2A", marginBottom: 6 }} />
                <div style={{ width: "60%", height: 11, borderRadius: 4, backgroundColor: "#222222" }} />
              </div>
            </div>
            <div style={{ width: "100%", height: 12, borderRadius: 4, backgroundColor: "#222222", marginBottom: 8 }} />
            <div style={{ width: "70%", height: 12, borderRadius: 4, backgroundColor: "#222222" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PostCard ────────────────────────────────────────────────────── */
export function displayName(profile: { full_name?: string | null; email?: string | null } | null): string {
  if (profile?.full_name) return profile.full_name;
  if (profile?.email) return profile.email.split("@")[0];
  return "Usuário";
}

function PostCard({
  post, interested, interestCount, onInteresse, distKm,
}: {
  post: Post; interested: boolean; interestCount: number;
  onInteresse: () => void; distKm?: number;
}) {
  const name = displayName(post.profiles);
  const initial = name.charAt(0).toUpperCase();
  const location = post.city ?? post.profiles?.city ?? "";
  const meta = [location, distKm != null ? `${distKm < 1 ? "<1" : distKm.toFixed(1)} km` : null, relativeTime(post.created_at)].filter(Boolean).join(" · ");

  return (
    <article style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", overflow: "hidden" }}>
      {post.photo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.photo_url} alt="" style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
      )}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#0F0F0F" }}>{initial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>{name}</span>
              {post.profiles?.verified && <VerifiedBadge />}
            </div>
            <p style={{ fontSize: "12px", color: "#555555", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meta}</p>
          </div>
        </div>

        {post.category && (
          <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 500, color: "#0F0F0F", backgroundColor: "#FFD11A", borderRadius: "6px", padding: "3px 10px", marginBottom: "8px" }}>
            {post.category}
          </span>
        )}
        {post.title && <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "6px", lineHeight: 1.4 }}>{post.title}</p>}
        <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6, marginBottom: "14px" }}>{post.description ?? ""}</p>

        {post.budget_min != null && (
          <p style={{ fontSize: "22px", fontWeight: 600, color: "#FFD11A", marginBottom: "14px", letterSpacing: "-0.02em" }}>
            R$ {post.budget_min.toLocaleString("pt-BR")}
          </p>
        )}

        <div style={{ height: "1px", backgroundColor: "#2E2E2E", marginBottom: "14px" }} />

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onInteresse}
            style={{ flex: 2, height: "40px", borderRadius: "999px", backgroundColor: interested ? "#22c55e" : "#FFD11A", color: interested ? "#fff" : "#0F0F0F", border: "none", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
          >
            {interested ? "✓ Interessado" : "Tenho interesse"}
          </button>
          <Link
            href={`/post/${post.id}`}
            style={{ flex: 1, height: "40px", borderRadius: "999px", backgroundColor: "transparent", color: "#888888", border: "1px solid #3A3A3A", fontSize: "13px", fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
          >
            Ver post
          </Link>
        </div>

        {interestCount > 0 && (
          <p style={{ fontSize: "12px", color: "#555555", marginTop: "10px" }}>
            {interestCount} pessoa{interestCount !== 1 ? "s" : ""} com interesse
          </p>
        )}
      </div>
    </article>
  );
}

/* ── Bottom Nav ──────────────────────────────────────────────────── */
export const NAV_ITEMS = [
  { label: "Feed",     href: "/feed",            icon: <HomeNavIcon />   },
  { label: "Buscar",   href: "/busca",           icon: <SearchNavIcon /> },
  { label: "Publicar", href: "/criar-post",      icon: <CreateNavIcon />, special: true },
  { label: "Salvos",   href: "/meus-interesses", icon: <HeartNavIcon />  },
  { label: "Perfil",   href: "/meu-perfil",      icon: <UserNavIcon />   },
];

export function BottomNav({ active }: { active: string }) {
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "64px", backgroundColor: "#0F0F0F", borderTop: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 4px", zIndex: 50 }}>
      {NAV_ITEMS.map(({ label, href, icon, special }) => {
        const isActive = label === active;
        return (
          <Link key={label} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", color: isActive ? "#F0F0F0" : "#555555", flex: 1, padding: "4px 0" }}>
            {special ? (
              <>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#0F0F0F" }}>{icon}</span>
                </div>
                <span style={{ fontSize: "10px", color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>{label}</span>
              </>
            ) : (
              <>
                <span style={{ color: isActive ? "#FFD11A" : "#555555" }}>{icon}</span>
                <span style={{ fontSize: "10px", fontWeight: isActive ? 500 : 400, fontFamily: "var(--font-inter), Inter, sans-serif" }}>{label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────── */
function Navbar({ onFilterOpen, hasFilters }: { onFilterOpen: () => void; hasFilters: boolean }) {
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "64px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={32} height={32} style={{ display: "block" }} />
        <span style={{ fontWeight: 500, fontSize: "20px", letterSpacing: "-0.03em", color: "#F0F0F0" }}>Bico AI</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Mobile filter button */}
        <button
          className="filter-mobile-btn"
          onClick={onFilterOpen}
          style={{ display: "none", alignItems: "center", gap: "6px", height: "36px", padding: "0 14px", backgroundColor: hasFilters ? "#FFD11A18" : "#1A1A1A", border: `1px solid ${hasFilters ? "#FFD11A60" : "#2E2E2E"}`, borderRadius: "999px", cursor: "pointer", fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          <FilterIcon active={hasFilters} />
          <span style={{ fontSize: "13px", color: hasFilters ? "#FFD11A" : "#888888" }}>Filtros</span>
          {hasFilters && <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FFD11A", display: "inline-block" }} />}
        </button>
        <Link href="/notificacoes" aria-label="Notificações" style={{ display: "flex", alignItems: "center", padding: "4px", color: "inherit", textDecoration: "none" }}>
          <BellIcon />
        </Link>
        <Link href="/meu-perfil" style={{ textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F0F0F" }}>?</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

/* ── Icons ───────────────────────────────────────────────────────── */
function LocateIcon({ active }: { active: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFD11A" : "#888888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>;
}
function SpinnerIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
}
function BellIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function FilterIcon({ active }: { active: boolean }) {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFD11A" : "#888888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>;
}
function VerifiedBadge() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function HomeNavIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function SearchNavIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function CreateNavIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
export function HeartNavIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
}
function UserNavIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
