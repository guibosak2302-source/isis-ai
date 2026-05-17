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
}

interface ModalState {
  post: Post;
  descricao: string;
  valor: string;
  sending: boolean;
  error: string;
}

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

    // Notify the post owner (contratante) about the new candidatura
    const postTitle = modal.post.title ?? "seu pedido";
    void fetch("/api/notificar-whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: modal.post.user_id,
        mensagem: `🔔 Bico AI: Você recebeu uma nova proposta para seu pedido '${postTitle}'! Acesse o app para ver.`,
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
        setFilterCity(""); // show all posts but with distances
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  }

  const filteredPosts = useMemo(() => {
    if (!posts) return null;
    if (!filterCity) return posts;
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return posts.filter((p) => p.city && norm(p.city).includes(norm(filterCity)));
  }, [posts, filterCity]);

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <Navbar />
      <main style={{ paddingTop: "64px", paddingBottom: "88px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
          {/* Location filter */}
          <div style={{ marginTop: "20px", marginBottom: "12px" }}>
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
                <span style={{ fontSize: "12px", color: userLat ? "#FFD11A" : "#888888", fontFamily: "var(--font-inter), Inter, sans-serif", whiteSpace: "nowrap" }}>Perto de mim</span>
              </button>
            </div>
            {(locationLabel || filterCity) && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                <span style={{ fontSize: "12px", color: "#FFD11A" }}>📍 {locationLabel || filterCity}</span>
                <button onClick={() => { setFilterCity(""); setLocationLabel(""); setUserLat(null); setUserLng(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif", padding: "0" }}>Limpar</button>
              </div>
            )}
          </div>

          <Filters />

          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0", lineHeight: 1.3 }}>
              {filterCity ? `Pedidos em ${filterCity}` : "Perto de você"}
            </h2>
            {filteredPosts && (
              <p style={{ fontSize: "13px", color: "#555555", marginTop: "2px" }}>
                {filteredPosts.length} pedido{filteredPosts.length !== 1 ? "s" : ""} encontrado{filteredPosts.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {filteredPosts === null ? (
            <LoadingSkeleton />
          ) : filteredPosts.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredPosts.map((post) => {
                const distKm =
                  userLat != null && userLng != null && post.latitude != null && post.longitude != null
                    ? haversine(userLat, userLng, post.latitude, post.longitude)
                    : undefined;
                return <PostCard key={post.id} post={post} onResponder={() => openModal(post)} distKm={distKm} />;
              })}
            </div>
          )}
        </div>
      </main>
      <BottomNav active="Feed" />

      {/* Modal */}
      {modal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => !modal.sending && setModal(null)}
            style={{
              position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)",
              zIndex: 100, backdropFilter: "blur(2px)",
            }}
          />
          {/* Sheet */}
          <div
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              backgroundColor: "#111111",
              border: "1px solid #2E2E2E",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: "24px 20px 40px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {/* Handle */}
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
              style={{
                width: "100%", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E",
                borderRadius: "10px", padding: "12px 14px", fontSize: "14px", color: "#F0F0F0",
                fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none",
                resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", marginBottom: "14px",
              }}
            />

            <label style={labelStyle}>Seu preço R$ *</label>
            <input
              type="number"
              value={modal.valor}
              onChange={(e) => setModal((m) => m && ({ ...m, valor: e.target.value }))}
              placeholder="Ex: 350"
              min={0}
              disabled={modal.sending}
              style={{
                width: "100%", height: "50px", backgroundColor: "#1A1A1A",
                border: "1px solid #2E2E2E", borderRadius: "10px", padding: "0 14px",
                fontSize: "15px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif",
                outline: "none", boxSizing: "border-box", marginBottom: "16px",
              }}
            />

            {modal.error && (
              <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "12px" }}>{modal.error}</p>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setModal(null)}
                disabled={modal.sending}
                style={{
                  flex: 1, height: "48px", backgroundColor: "transparent", color: "#888888",
                  border: "1px solid #2E2E2E", borderRadius: "999px", fontSize: "14px",
                  fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={submitProposta}
                disabled={modal.sending}
                style={{
                  flex: 2, height: "48px",
                  backgroundColor: modal.sending ? "#3A3A3A" : "#FFD11A",
                  color: modal.sending ? "#888888" : "#0F0F0F",
                  border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600,
                  fontFamily: "var(--font-inter), Inter, sans-serif", cursor: modal.sending ? "not-allowed" : "pointer",
                }}
              >
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

/* ─── Loading Skeleton ────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", backgroundColor: "#2A2A2A" }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: "40%", height: 14, borderRadius: 4, backgroundColor: "#2A2A2A", marginBottom: 6 }} />
              <div style={{ width: "60%", height: 11, borderRadius: 4, backgroundColor: "#222222" }} />
            </div>
          </div>
          <div style={{ width: "100%", height: 12, borderRadius: 4, backgroundColor: "#222222", marginBottom: 8 }} />
          <div style={{ width: "80%", height: 12, borderRadius: 4, backgroundColor: "#222222", marginBottom: 8 }} />
          <div style={{ width: "50%", height: 12, borderRadius: 4, backgroundColor: "#222222" }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "60px", gap: "12px", textAlign: "center" }}>
      <EmptyIcon />
      <p style={{ fontSize: "16px", fontWeight: 500, color: "#888888" }}>Nenhum pedido ainda</p>
      <p style={{ fontSize: "13px", color: "#555555" }}>Seja o primeiro a postar!</p>
      <Link
        href="/novo-pedido"
        style={{
          marginTop: "8px", height: "44px", padding: "0 28px", borderRadius: "999px",
          backgroundColor: "#FFD11A", color: "#0F0F0F", fontSize: "14px", fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", textDecoration: "none",
        }}
      >
        Criar pedido
      </Link>
    </div>
  );
}

/* ─── PostCard ────────────────────────────────────────────── */
function PostCard({ post, onResponder, distKm }: { post: Post; onResponder: () => void; distKm?: number }) {
  const profile = post.profiles;
  const name = profile?.full_name ?? "Usuário";
  const initial = name.charAt(0).toUpperCase();
  const seal = profile?.seal ?? "bronze";
  const verified = profile?.verified ?? false;
  const location = post.city ?? profile?.city ?? "";
  const tags: string[] = [post.category, location].filter(Boolean) as string[];
  const time = relativeTime(post.created_at);
  const sealColor: Record<string, string> = { bronze: "#CD7F32", prata: "#A8A9AD", ouro: "#FFD11A" };

  return (
    <article style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <Avatar letter={initial} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>{name}</span>
            {verified && <VerifiedBadge />}
            {seal && (
              <span style={{
                fontSize: "10px", fontWeight: 700, color: sealColor[seal] ?? "#CD7F32",
                backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${sealColor[seal] ?? "#CD7F32"}40`,
                borderRadius: "4px", padding: "1px 5px", textTransform: "capitalize",
              }}>
                {seal}
              </span>
            )}
          </div>
          <p style={{ fontSize: "12px", color: "#555555", marginTop: "1px" }}>
            {[post.category, location, distKm != null ? `${distKm < 1 ? "<1" : distKm.toFixed(1)} km` : null, time].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button aria-label="Mais opções" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#555555" }}>
          <DotsIcon />
        </button>
      </div>

      <p style={{ fontSize: "14px", fontWeight: 400, color: "#F0F0F0", lineHeight: 1.65, marginBottom: "14px" }}>
        {post.description ?? post.title ?? ""}
      </p>

      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {tags.map((tag) => (
            <span key={tag} style={{ fontSize: "12px", color: "#888888", backgroundColor: "#1E1E1E", border: "1px solid #2A2A2A", borderRadius: "999px", padding: "3px 10px" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {post.budget_min != null && (
        <p style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", marginBottom: "16px" }}>
          A partir de R$ {post.budget_min.toLocaleString("pt-BR")}
        </p>
      )}

      <div style={{ height: "1px", backgroundColor: "#2E2E2E", marginBottom: "14px" }} />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onResponder}
          style={{
            height: "36px", padding: "0 18px", borderRadius: "999px", backgroundColor: "#FFD11A",
            color: "#0F0F0F", border: "none", fontSize: "13px", fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer",
          }}
        >
          Responder
        </button>
      </div>
    </article>
  );
}

/* ─── Avatar ──────────────────────────────────────────────── */
function Avatar({ letter, size, bg = "#2A2A2A" }: { letter: string; size: number; bg?: string }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.4, fontWeight: 500, color: "#F0F0F0" }}>{letter}</span>
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeNavIcon /> },
  { label: "Buscar",  href: "/busca",      icon: <SearchNavIcon2 /> },
  { label: "Criar",   href: "/criar-post", icon: <CreateNavIcon />, special: true },
  { label: "Pedidos", href: "/pedidos",    icon: <ClipboardNavIcon /> },
  { label: "Perfil",  href: "/meu-perfil", icon: <UserNavIcon /> },
];

function BottomNav({ active }: { active: string }) {
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "64px", backgroundColor: "#0F0F0F", borderTop: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px", zIndex: 50 }}>
      {NAV_ITEMS.map(({ label, href, icon, special }) => {
        const isActive = label === active;
        return (
          <Link key={label} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", color: isActive ? "#F0F0F0" : "#555555", minWidth: "48px" }}>
            {special ? (
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "-2px" }}>
                <span style={{ color: "#0F0F0F" }}>{icon}</span>
              </div>
            ) : (
              <>
                <span style={{ color: isActive ? "#F0F0F0" : "#555555" }}>{icon}</span>
                <span style={{ fontSize: "11px", fontWeight: isActive ? 500 : 400 }}>{label}</span>
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
        <Avatar letter="B" size={34} />
      </div>
    </header>
  );
}

/* ─── Search ──────────────────────────────────────────────── */
function SearchBar() {
  return (
    <div style={{ marginTop: "20px", marginBottom: "16px" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", left: "16px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <SearchIcon />
        </span>
        <input type="text" placeholder="Buscar serviços, prestadores..." style={{ width: "100%", height: "48px", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "999px", paddingLeft: "46px", paddingRight: "16px", fontSize: "14px", fontFamily: "var(--font-inter), Inter, sans-serif", color: "#F0F0F0", outline: "none" }} />
      </div>
    </div>
  );
}

/* ─── Filters ─────────────────────────────────────────────── */
const CATEGORIES = ["Todos", "Reformas", "Faxina", "Aulas", "Beleza", "Elétrica", "Pintura"];

function Filters() {
  return (
    <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginBottom: "28px", scrollbarWidth: "none" }}>
      {CATEGORIES.map((cat) => {
        const active = cat === "Todos";
        return (
          <button key={cat} style={{ flexShrink: 0, height: "34px", padding: "0 16px", borderRadius: "999px", border: active ? "none" : "1px solid #2E2E2E", backgroundColor: active ? "#FFD11A" : "transparent", color: active ? "#0F0F0F" : "#888888", fontSize: "13px", fontWeight: active ? 500 : 400, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer", whiteSpace: "nowrap" }}>
            {cat}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────────────── */
function LocateIcon({ active }: { active: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFD11A" : "#888888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>;
}
function SpinnerIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" style={{ animation: "spin 1s linear infinite", transformOrigin: "center" }} /></svg>;
}
function EmptyIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function BellIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}
function VerifiedBadge() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function DotsIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="#555555"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>;
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
