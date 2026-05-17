"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import BuscaLocalizacao from "@/components/BuscaLocalizacao";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  score: number | null;
  seal: string | null;
  verified: boolean | null;
}

interface Post {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  city: string | null;
  budget_min: number | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  profiles: Profile | null;
  isMock?: boolean;
  mockInteresse?: number;
}

interface ModalState {
  post: Post;
  descricao: string;
  valor: string;
  sending: boolean;
  error: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: "mock-1", user_id: "mock", isMock: true, mockInteresse: 3,
    title: "Preciso de faxineira semanal",
    description: "Apartamento 2 quartos, preciso de faxina toda semana, preferencialmente às sextas.",
    category: "Faxina", city: "São Paulo", budget_min: 150,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    latitude: null, longitude: null,
    profiles: { id: "m1", full_name: "Maria Silva", avatar_url: null, city: "São Paulo", score: null, seal: null, verified: false },
  },
  {
    id: "mock-2", user_id: "mock", isMock: true, mockInteresse: 7,
    title: "Instalação de tomadas e disjuntor",
    description: "Preciso de eletricista para instalar 3 tomadas e trocar disjuntor da cozinha.",
    category: "Elétrica", city: "Guarulhos", budget_min: 200,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    latitude: null, longitude: null,
    profiles: { id: "m2", full_name: "João Pereira", avatar_url: null, city: "Guarulhos", score: null, seal: null, verified: false },
  },
  {
    id: "mock-3", user_id: "mock", isMock: true, mockInteresse: 4,
    title: "Pintura de sala e quarto",
    description: "Sala e quarto para pintar, já tenho a tinta. Preciso de mão de obra.",
    category: "Pintura", city: "Santo André", budget_min: 400,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    latitude: null, longitude: null,
    profiles: { id: "m3", full_name: "Ana Costa", avatar_url: null, city: "Santo André", score: null, seal: null, verified: false },
  },
  {
    id: "mock-4", user_id: "mock", isMock: true, mockInteresse: 2,
    title: "Aulas de inglês para iniciantes",
    description: "Procuro professor de inglês para aulas semanais, sou iniciante.",
    category: "Aulas", city: "Campinas", budget_min: 80,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    latitude: null, longitude: null,
    profiles: { id: "m4", full_name: "Carlos Mendes", avatar_url: null, city: "Campinas", score: null, seal: null, verified: false },
  },
  {
    id: "mock-5", user_id: "mock", isMock: true, mockInteresse: 6,
    title: "Montagem de móveis da sala",
    description: "Comprei móveis novos e preciso de ajuda para montar sofá, rack e estante.",
    category: "Reformas", city: "São Paulo", budget_min: 120,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    latitude: null, longitude: null,
    profiles: { id: "m5", full_name: "Fernanda Lima", avatar_url: null, city: "São Paulo", score: null, seal: null, verified: false },
  },
];

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [filterCity, setFilterCity] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: { user } }, { data }] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("posts")
          .select(`*, profiles (id, full_name, avatar_url, city, score, seal, verified)`)
          .eq("status", "aberto")
          .order("created_at", { ascending: false })
          .limit(50),
      ]);
      setUserId(user?.id ?? null);
      setPosts((data as Post[]) ?? []);
    }
    load();
  }, []);

  function openModal(post: Post) {
    if (!userId) { router.replace("/login"); return; }
    if (post.isMock) { return; }
    setModal({ post, descricao: "", valor: "", sending: false, error: "" });
  }

  async function submitProposta() {
    if (!modal || !userId) return;
    if (!modal.descricao.trim()) {
      setModal((m) => m && ({ ...m, error: "Escreva sua proposta" }));
      return;
    }
    if (!modal.valor) {
      setModal((m) => m && ({ ...m, error: "Informe seu preço" }));
      return;
    }
    setModal((m) => m && ({ ...m, sending: true, error: "" }));
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("candidaturas")
      .select("id")
      .eq("post_id", modal.post.id)
      .eq("prestador_id", userId)
      .maybeSingle();

    if (existing) {
      setModal((m) => m && ({ ...m, sending: false, error: "Você já enviou uma proposta para este pedido" }));
      return;
    }

    const { error } = await supabase.from("candidaturas").insert({
      post_id: modal.post.id,
      prestador_id: userId,
      descricao: modal.descricao.trim(),
      valor: parseFloat(modal.valor),
      status: "pendente",
    });

    if (error) {
      setModal((m) => m && ({ ...m, sending: false, error: "Erro ao enviar. Tente novamente." }));
      return;
    }

    const postTitle = modal.post.title ?? "seu pedido";
    void fetch("/api/notificar-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: modal.post.user_id,
        mensagem: `🔔 Bico AI: Você recebeu uma nova proposta para '${postTitle}'! Acesse o app para ver.`,
        tipo: "nova_candidatura",
      }),
    });

    setModal(null);
  }

  function pegarLocalizacao() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setLocationLabel("Sua localização");
        setFilterCity("");
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  }

  const filteredPosts = useMemo(() => {
    if (!posts) return null;
    let result = posts;
    if (filterCity) {
      const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      result = result.filter((p) => p.city && norm(p.city).includes(norm(filterCity)));
    }
    if (activeCategory !== "Todos") {
      result = result.filter((p) => p.category === activeCategory);
    }
    return result.length > 0 ? result : MOCK_POSTS;
  }, [posts, filterCity, activeCategory]);

  const showingMocks = filteredPosts !== null && filteredPosts.length > 0 && filteredPosts[0].isMock;

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <Navbar />
      <main style={{ paddingTop: "64px", paddingBottom: "88px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>

          {/* Categories strip */}
          <CategoryStrip active={activeCategory} onSelect={setActiveCategory} />

          {/* Location filter */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
              <div style={{ flex: 1 }}>
                <BuscaLocalizacao
                  placeholder="Filtrar por cidade ou bairro…"
                  height={46}
                  onSelect={(place) => {
                    setFilterCity(place.city || place.label);
                    setUserLat(place.lat);
                    setUserLng(place.lng);
                    setLocationLabel(place.label);
                  }}
                />
              </div>
              <button
                onClick={pegarLocalizacao}
                disabled={geoLoading}
                title="Usar minha localização"
                style={{ flexShrink: 0, height: "46px", padding: "0 14px", backgroundColor: geoLoading ? "#1A1A1A" : userLat ? "#FFD11A20" : "#1A1A1A", border: `1px solid ${userLat ? "#FFD11A60" : "#2E2E2E"}`, borderRadius: "10px", cursor: geoLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                {geoLoading ? <SpinnerIcon /> : <LocateIcon active={!!userLat} />}
                <span style={{ fontSize: "12px", color: userLat ? "#FFD11A" : "#888888", whiteSpace: "nowrap" }}>Perto de mim</span>
              </button>
            </div>
            {(locationLabel || filterCity) && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                <span style={{ fontSize: "12px", color: "#FFD11A" }}>📍 {locationLabel || filterCity}</span>
                <button onClick={() => { setFilterCity(""); setLocationLabel(""); setUserLat(null); setUserLng(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif", padding: "0" }}>Limpar</button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0", lineHeight: 1.3 }}>
                {filterCity ? `Pedidos em ${filterCity}` : activeCategory === "Todos" ? "Perto de você" : activeCategory}
              </h2>
              {filteredPosts && (
                <p style={{ fontSize: "13px", color: "#555555", marginTop: "2px" }}>
                  {showingMocks ? "Exemplos de pedidos" : `${filteredPosts.length} pedido${filteredPosts.length !== 1 ? "s" : ""} encontrado${filteredPosts.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>
          </div>

          {filteredPosts === null ? (
            <LoadingSkeleton />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredPosts.map((post) => {
                const distKm =
                  !post.isMock && userLat != null && userLng != null && post.latitude != null && post.longitude != null
                    ? haversine(userLat, userLng, post.latitude, post.longitude)
                    : undefined;
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    onResponder={() => openModal(post)}
                    distKm={distKm}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
      <BottomNav active="Feed" />

      {/* Modal */}
      {modal && (
        <>
          <div onClick={() => !modal.sending && setModal(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 100, backdropFilter: "blur(2px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101, backgroundColor: "#111111", border: "1px solid #2E2E2E", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", padding: "24px 20px 40px", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: "#3A3A3A", margin: "0 auto 20px" }} />
            <p style={{ fontSize: "13px", color: "#888888", marginBottom: "4px" }}>Respondendo ao pedido</p>
            <h3 style={{ fontSize: "17px", fontWeight: 500, color: "#F0F0F0", marginBottom: "20px", lineHeight: 1.4 }}>
              {modal.post.title ?? modal.post.description?.slice(0, 60) ?? "Pedido"}
            </h3>
            <label style={labelStyle}>Sua proposta *</label>
            <textarea
              value={modal.descricao}
              onChange={(e) => setModal((m) => m && ({ ...m, descricao: e.target.value }))}
              placeholder="Descreva como você pode ajudar, sua experiência, prazo..."
              rows={4}
              disabled={modal.sending}
              style={{ width: "100%", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", marginBottom: "14px" }}
            />
            <label style={labelStyle}>Seu preço R$ *</label>
            <input
              type="number"
              value={modal.valor}
              onChange={(e) => setModal((m) => m && ({ ...m, valor: e.target.value }))}
              placeholder="Ex: 350"
              min={0}
              disabled={modal.sending}
              style={{ width: "100%", height: "50px", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "10px", padding: "0 14px", fontSize: "15px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "16px" }}
            />
            {modal.error && <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "12px" }}>{modal.error}</p>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModal(null)} disabled={modal.sending} style={{ flex: 1, height: "48px", backgroundColor: "transparent", color: "#888888", border: "1px solid #2E2E2E", borderRadius: "999px", fontSize: "14px", fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={submitProposta} disabled={modal.sending} style={{ flex: 2, height: "48px", backgroundColor: modal.sending ? "#3A3A3A" : "#FFD11A", color: modal.sending ? "#888888" : "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: modal.sending ? "not-allowed" : "pointer" }}>
                {modal.sending ? "Enviando…" : "Enviar proposta"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", color: "#888888", marginBottom: "6px",
  textTransform: "uppercase", letterSpacing: "0.06em",
};

/* ─── Categories ──────────────────────────────────────────── */
const CATEGORY_LIST = [
  { emoji: "🔥", label: "Todos" },
  { emoji: "🧹", label: "Faxina" },
  { emoji: "⚡", label: "Elétrica" },
  { emoji: "🔧", label: "Reformas" },
  { emoji: "🎨", label: "Pintura" },
  { emoji: "📚", label: "Aulas" },
  { emoji: "💇", label: "Beleza" },
];

function CategoryStrip({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <div style={{ display: "flex", gap: "12px", overflowX: "auto", padding: "16px 0 12px", scrollbarWidth: "none" }}>
      {CATEGORY_LIST.map(({ emoji, label }) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            onClick={() => onSelect(label)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px",
              backgroundColor: isActive ? "#FFD11A20" : "#1A1A1A",
              border: `1px solid ${isActive ? "#FFD11A" : "#2E2E2E"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px", transition: "all 0.15s",
            }}>
              {emoji}
            </div>
            <span style={{ fontSize: "11px", color: isActive ? "#FFD11A" : "#888888", fontFamily: "var(--font-inter), Inter, sans-serif", whiteSpace: "nowrap" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#2A2A2A" }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "40%", height: 14, borderRadius: 4, backgroundColor: "#2A2A2A", marginBottom: 6 }} />
              <div style={{ width: "60%", height: 11, borderRadius: 4, backgroundColor: "#222222" }} />
            </div>
          </div>
          <div style={{ width: "30%", height: 22, borderRadius: 999, backgroundColor: "#2A2A2A", marginBottom: 12 }} />
          <div style={{ width: "100%", height: 12, borderRadius: 4, backgroundColor: "#222222", marginBottom: 8 }} />
          <div style={{ width: "80%", height: 12, borderRadius: 4, backgroundColor: "#222222", marginBottom: 8 }} />
          <div style={{ width: "30%", height: 24, borderRadius: 4, backgroundColor: "#2A2A2A", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 2, height: 40, borderRadius: 999, backgroundColor: "#2A2A2A" }} />
            <div style={{ flex: 1, height: 40, borderRadius: 999, backgroundColor: "#222222" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── PostCard ────────────────────────────────────────────── */
function PostCard({ post, onResponder, distKm }: { post: Post; onResponder: () => void; distKm?: number }) {
  const profile = post.profiles;
  const name = profile?.full_name ?? "Usuário";
  const initial = name.charAt(0).toUpperCase();
  const location = post.city ?? profile?.city ?? "";
  const time = relativeTime(post.created_at);
  const meta = [location, distKm != null ? `${distKm < 1 ? "<1" : distKm.toFixed(1)} km` : null, time].filter(Boolean).join(" · ");

  return (
    <article style={{ position: "relative", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", padding: "20px", overflow: "hidden" }}>
      {/* Mock badge */}
      {post.isMock && (
        <div style={{ position: "absolute", top: 14, right: 14, backgroundColor: "#2A2A2A", border: "1px solid #3A3A3A", borderRadius: "6px", padding: "2px 8px", fontSize: "10px", color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Exemplo
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#0F0F0F" }}>{initial}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>{name}</span>
            {profile?.verified && <VerifiedBadge />}
          </div>
          <p style={{ fontSize: "12px", color: "#555555", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {meta}
          </p>
        </div>
      </div>

      {/* Category badge */}
      {post.category && (
        <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 500, color: "#0F0F0F", backgroundColor: "#FFD11A", borderRadius: "6px", padding: "3px 10px", marginBottom: "10px" }}>
          {post.category}
        </span>
      )}

      {/* Description */}
      <p style={{ fontSize: "14px", color: "#D0D0D0", lineHeight: 1.65, marginBottom: "14px" }}>
        {post.description ?? post.title ?? ""}
      </p>

      {/* Price */}
      {post.budget_min != null && (
        <p style={{ fontSize: "22px", fontWeight: 600, color: "#FFD11A", marginBottom: "16px", letterSpacing: "-0.02em" }}>
          R$ {post.budget_min.toLocaleString("pt-BR")}
        </p>
      )}

      <div style={{ height: "1px", backgroundColor: "#2E2E2E", marginBottom: "14px" }} />

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onResponder}
          style={{
            flex: 2, height: "40px", borderRadius: "999px", backgroundColor: post.isMock ? "#3A3A3A" : "#FFD11A",
            color: post.isMock ? "#666666" : "#0F0F0F", border: "none", fontSize: "13px", fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif", cursor: post.isMock ? "default" : "pointer",
          }}
        >
          Tenho interesse
        </button>
        <button
          style={{
            flex: 1, height: "40px", borderRadius: "999px", backgroundColor: "transparent",
            color: "#888888", border: "1px solid #3A3A3A", fontSize: "13px",
            fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer",
          }}
        >
          Ver perfil
        </button>
      </div>

      {/* Interest count */}
      {(post.mockInteresse ?? 0) > 0 && (
        <p style={{ fontSize: "12px", color: "#555555", marginTop: "10px" }}>
          {post.mockInteresse} pessoa{post.mockInteresse !== 1 ? "s" : ""} com interesse
        </p>
      )}
    </article>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeNavIcon /> },
  { label: "Buscar",  href: "/busca",      icon: <SearchNavIcon2 /> },
  { label: "Publicar", href: "/criar-post", icon: <CreateNavIcon />, special: true },
  { label: "Pedidos", href: "/pedidos",    icon: <ClipboardNavIcon /> },
  { label: "Perfil",  href: "/meu-perfil", icon: <UserNavIcon /> },
];

function BottomNav({ active }: { active: string }) {
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
                <span style={{ color: isActive ? "#F0F0F0" : "#555555" }}>{icon}</span>
                <span style={{ fontSize: "10px", fontWeight: isActive ? 500 : 400, fontFamily: "var(--font-inter), Inter, sans-serif" }}>{label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "64px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={32} height={32} style={{ display: "block" }} />
        <span style={{ fontWeight: 500, fontSize: "20px", letterSpacing: "-0.03em", color: "#F0F0F0" }}>Bico AI</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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

/* ─── Icons ───────────────────────────────────────────────── */
function LocateIcon({ active }: { active: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFD11A" : "#888888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>;
}
function SpinnerIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>;
}
function BellIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function VerifiedBadge() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function HomeNavIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function SearchNavIcon2() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function CreateNavIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function ClipboardNavIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" ry="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>;
}
function UserNavIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
