"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface Profile {
  full_name: string | null;
  city: string | null;
  state: string | null;
  score: number | null;
  seal: string | null;
  type: string | null;
  phone: string | null;
  notificacoes_whatsapp: boolean | null;
}

export default function MeuPerfilPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({ full_name: null, city: null, state: null, score: null, seal: null, type: null, phone: null, notificacoes_whatsapp: null });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setEmail(user.email ?? "");
      setUserId(user.id);
      const { data } = await supabase
        .from("profiles")
        .select("full_name, city, state, score, seal, type, phone, notificacoes_whatsapp")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data as Profile);
    }
    load();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const displayName = profile.full_name ?? email.split("@")[0] ?? "Usuário";
  const initial = displayName.charAt(0).toUpperCase();
  const location = [profile.city, profile.state].filter(Boolean).join(", ") || null;

  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingBottom: "80px",
      }}
    >
      <Header />
      <CoverAndAvatar initial={initial} name={displayName} location={location} />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
        <Stats />
        {profile.type === "prestador" && (
          <ScoreCard score={profile.score ?? 0} seal={profile.seal} userId={userId} />
        )}
        {userId && <AvaliacoesRecebidas userId={userId} />}
        {userId && (
          <NotificacoesWhatsApp
            userId={userId}
            phone={profile.phone}
            ativo={profile.notificacoes_whatsapp ?? false}
          />
        )}
        <ProviderCard />
        <MyPosts />
        <History />
        <SettingsList onSignOut={handleSignOut} />
      </div>
      <BottomNav active="Perfil" />
    </div>
  );
}

/* ─── Header ──────────────────────────────────────────────── */
function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "56px",
        backgroundColor: "#0F0F0F",
        borderBottom: "1px solid #2E2E2E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <div style={{ width: "36px" }} />
      <span style={{ fontSize: "17px", fontWeight: 500, color: "#F0F0F0" }}>Meu perfil</span>
      <Link
        href="/configuracoes"
        aria-label="Configurações"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          color: "#888888",
          textDecoration: "none",
        }}
      >
        <GearIcon />
      </Link>
    </header>
  );
}

/* ─── Cover + Avatar ──────────────────────────────────────── */
function CoverAndAvatar({ initial, name, location }: { initial: string; name: string; location: string | null }) {
  return (
    <div style={{ paddingTop: "56px" }}>
      <div style={{ height: "110px", backgroundColor: "#1A1A1A" }} />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ position: "relative", display: "inline-block", marginTop: "-40px", marginBottom: "12px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#2A2A2A",
              border: "3px solid #0F0F0F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: 500, color: "#F0F0F0" }}>{initial}</span>
          </div>
          <button
            aria-label="Editar foto"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "#FFD11A",
              border: "2px solid #0F0F0F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <CameraSmallIcon />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px" }}>
              {name}
            </h1>
            {location && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <PinIcon />
                <span style={{ fontSize: "13px", color: "#555555" }}>{location}</span>
              </div>
            )}
          </div>
          <button
            style={{
              height: "34px",
              padding: "0 16px",
              borderRadius: "999px",
              backgroundColor: "transparent",
              color: "#F0F0F0",
              border: "1px solid #3A3A3A",
              fontSize: "13px",
              fontWeight: 400,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Avaliações Recebidas ────────────────────────────────── */
interface AvaliacaoItem {
  id: string;
  qualidade: number;
  pontualidade: number;
  comunicacao: number;
  preco: number;
  comentario: string | null;
  created_at: string;
  avaliador: { full_name: string | null } | null;
}

function AvaliacoesRecebidas({ userId }: { userId: string }) {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("avaliacoes")
        .select("id, qualidade, pontualidade, comunicacao, preco, comentario, created_at, avaliador:avaliador_id ( full_name )")
        .eq("avaliado_id", userId)
        .order("created_at", { ascending: false });
      setAvaliacoes((data as unknown as AvaliacaoItem[]) ?? []);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading || avaliacoes.length === 0) return null;

  const total = avaliacoes.length;
  const mediaGeral =
    avaliacoes.reduce((acc, a) => acc + (a.qualidade + a.pontualidade + a.comunicacao + a.preco) / 4, 0) / total;
  const ultimas5 = avaliacoes.slice(0, 5);

  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Summary header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Avaliações recebidas</h2>
        <span style={{ fontSize: "13px", color: "#555555" }}>{total} no total</span>
      </div>

      {/* Average score card */}
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "#FFD11A", lineHeight: 1 }}>{mediaGeral.toFixed(1)}</p>
          <p style={{ fontSize: "11px", color: "#555555", marginTop: "4px" }}>de 5</p>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "3px", marginBottom: "6px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} style={{ fontSize: "18px", color: s <= Math.round(mediaGeral) ? "#FFD11A" : "#2E2E2E" }}>★</span>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#888888" }}>
            Baseado em {total} avaliação{total !== 1 ? "ões" : ""}
          </p>
        </div>
      </div>

      {/* Last 5 reviews */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {ultimas5.map((av) => {
          const notaMedia = (av.qualidade + av.pontualidade + av.comunicacao + av.preco) / 4;
          const nomeAvaliador = av.avaliador?.full_name ?? "Usuário";
          const inicial = nomeAvaliador.charAt(0).toUpperCase();
          const dataFormatada = new Date(av.created_at).toLocaleDateString("pt-BR");

          return (
            <div key={av.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: av.comentario ? "10px" : "0" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0" }}>{inicial}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>{nomeAvaliador}</span>
                    <span style={{ fontSize: "11px", color: "#555555", flexShrink: 0, marginLeft: "8px" }}>{dataFormatada}</span>
                  </div>
                  <div style={{ display: "flex", gap: "2px", marginTop: "2px" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ fontSize: "13px", color: s <= Math.round(notaMedia) ? "#FFD11A" : "#2E2E2E" }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              {av.comentario && (
                <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6, paddingLeft: "44px" }}>
                  {av.comentario}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Score Card ──────────────────────────────────────────── */
const SEAL_CONFIG: Record<string, { label: string; color: string }> = {
  bronze: { label: "Bronze",  color: "#CD7F32" },
  prata:  { label: "Prata",   color: "#A8A9AD" },
  ouro:   { label: "Ouro",    color: "#FFD11A" },
};

const SCORE_TIPS = [
  { icon: "★", text: "Receba avaliações dos contratantes (+40 pts × nota)" },
  { icon: "✓", text: "Conclua contratos com sucesso (+30 pts cada)" },
  { icon: "⚡", text: "Tenha candidaturas aceitas (+20 pts cada)" },
  { icon: "💰", text: "Receba pagamentos liberados (+10 pts cada)" },
];

function ScoreCard({ score, seal, userId }: { score: number; seal: string | null; userId: string | null }) {
  const [recalculating, setRecalculating] = useState(false);
  const [currentScore, setCurrentScore] = useState(score);
  const [currentSeal, setCurrentSeal] = useState(seal);

  async function handleRecalcular() {
    if (!userId || recalculating) return;
    setRecalculating(true);
    try {
      const res = await fetch("/api/calcular-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prestador_id: userId }),
      });
      const json = await res.json() as { score?: number; seal?: string | null };
      if (json.score !== undefined) setCurrentScore(json.score);
      if (json.seal !== undefined) setCurrentSeal(json.seal ?? null);
    } catch { /* silent */ }
    setRecalculating(false);
  }

  const pct = Math.min(Math.max((currentScore / 1000) * 100, 0), 100);
  const sealCfg = currentSeal ? (SEAL_CONFIG[currentSeal] ?? null) : null;

  return (
    <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "18px 16px", marginBottom: "20px" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Bico Score</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#FFD11A", lineHeight: 1 }}>{currentScore}</span>
            <span style={{ fontSize: "14px", color: "#555555" }}>/1000</span>
          </div>
        </div>
        {sealCfg && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <MedalIcon color={sealCfg.color} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: sealCfg.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {sealCfg.label}
            </span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div style={{ height: "8px", borderRadius: "999px", backgroundColor: "#2E2E2E", overflow: "hidden", marginBottom: "6px" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: "#FFD11A", borderRadius: "999px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <span style={{ fontSize: "11px", color: "#555555" }}>0</span>
        {!sealCfg && currentScore < 200 && <span style={{ fontSize: "11px", color: "#CD7F32" }}>Bronze: 200</span>}
        {sealCfg?.label === "Bronze" && <span style={{ fontSize: "11px", color: "#A8A9AD" }}>Prata: 500</span>}
        {sealCfg?.label === "Prata" && <span style={{ fontSize: "11px", color: "#FFD11A" }}>Ouro: 800</span>}
        <span style={{ fontSize: "11px", color: "#555555" }}>1000</span>
      </div>

      {/* Tips */}
      <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Como aumentar seu score</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {SCORE_TIPS.map((tip) => (
          <div key={tip.text} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <span style={{ fontSize: "14px", flexShrink: 0, lineHeight: 1.4 }}>{tip.icon}</span>
            <span style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Recalcular */}
      <button
        onClick={handleRecalcular}
        disabled={recalculating}
        style={{ width: "100%", height: "38px", backgroundColor: "transparent", color: recalculating ? "#555555" : "#FFD11A", border: `1px solid ${recalculating ? "#2A2A2A" : "#FFD11A40"}`, borderRadius: "999px", fontSize: "12px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: recalculating ? "not-allowed" : "pointer" }}
      >
        {recalculating ? "Calculando…" : "Atualizar score"}
      </button>
    </div>
  );
}

function MedalIcon({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="7" />
      <path d="M9 3h6l2 5H7z" />
      <polyline points="7 8 5 3 9 3" />
      <polyline points="17 8 19 3 15 3" />
      <text x="12" y="18" textAnchor="middle" fontSize="7" fill={color} stroke="none" fontWeight="bold">★</text>
    </svg>
  );
}

/* ─── Notificações WhatsApp ───────────────────────────────── */
function NotificacoesWhatsApp({ userId, phone, ativo }: { userId: string; phone: string | null; ativo: boolean }) {
  const [telefone, setTelefone] = useState(phone ?? "");
  const [habilitado, setHabilitado] = useState(ativo);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function salvar() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ phone: telefone.trim() || null, notificacoes_whatsapp: habilitado })
      .eq("id", userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "14px",
        padding: "18px 16px",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <WhatsAppIcon />
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>Notificações WhatsApp</p>
          <p style={{ fontSize: "12px", color: "#555555" }}>Receba alertas no seu WhatsApp</p>
        </div>
      </div>

      {/* Phone input */}
      <label style={{ display: "block", fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
        Número com DDD
      </label>
      <input
        type="tel"
        placeholder="Ex: 5511999999999"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        style={{
          width: "100%",
          height: "46px",
          backgroundColor: "#0F0F0F",
          border: "1px solid #2E2E2E",
          borderRadius: "10px",
          padding: "0 14px",
          fontSize: "14px",
          color: "#F0F0F0",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          outline: "none",
          boxSizing: "border-box",
          marginBottom: "14px",
        }}
      />

      {/* Toggle */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}
      >
        <span style={{ fontSize: "14px", color: "#C0C0C0" }}>Ativar notificações</span>
        <button
          onClick={() => setHabilitado((v) => !v)}
          style={{
            width: "46px",
            height: "26px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: habilitado ? "#FFD11A" : "#3A3A3A",
            position: "relative",
            cursor: "pointer",
            transition: "background-color 0.2s",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "3px",
              left: habilitado ? "23px" : "3px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#F0F0F0",
              transition: "left 0.2s",
            }}
          />
        </button>
      </div>

      {/* Save button */}
      <button
        onClick={salvar}
        disabled={saving}
        style={{
          width: "100%",
          height: "42px",
          backgroundColor: saved ? "#1D9E75" : saving ? "#3A3A3A" : "#FFD11A",
          color: saved ? "#F0F0F0" : saving ? "#888888" : "#0F0F0F",
          border: "none",
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: saving ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
      >
        {saved ? "Salvo ✓" : saving ? "Salvando…" : "Salvar configurações"}
      </button>
    </div>
  );
}

/* ─── Stats ───────────────────────────────────────────────── */
function Stats() {
  const items = [
    { value: "0", label: "posts" },
    { value: "0", label: "serviços" },
    { value: "0", label: "avaliações" },
  ];
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      {items.map(({ value, label }) => (
        <div
          key={label}
          style={{
            flex: 1,
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "10px",
            padding: "14px 10px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px" }}>{value}</p>
          <p style={{ fontSize: "12px", color: "#555555" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Provider Card ───────────────────────────────────────── */
function ProviderCard() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <StarIcon />
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>Ofereça seus serviços na Bico</p>
      </div>
      <p style={{ fontSize: "13px", color: "#555555", marginBottom: "14px", lineHeight: 1.6 }}>
        Cadastre seus serviços e comece a receber pedidos
      </p>
      <button
        style={{
          width: "100%",
          height: "42px",
          backgroundColor: "#FFD11A",
          color: "#0F0F0F",
          border: "none",
          borderRadius: "999px",
          fontSize: "14px",
          fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
        }}
      >
        Quero ser prestador
      </button>
    </div>
  );
}

/* ─── My Posts ────────────────────────────────────────────── */
function MyPosts() {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0", marginBottom: "16px" }}>Meus posts</h2>
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "12px",
          padding: "28px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <PostEmptyIcon />
        <p style={{ fontSize: "14px", color: "#555555" }}>Você ainda não fez nenhum post</p>
        <Link
          href="/criar-post"
          style={{
            marginTop: "4px",
            height: "36px",
            padding: "0 20px",
            borderRadius: "999px",
            backgroundColor: "transparent",
            color: "#F0F0F0",
            border: "1px solid #3A3A3A",
            fontSize: "13px",
            fontWeight: 400,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          Criar primeiro post
        </Link>
      </div>
    </div>
  );
}

/* ─── History ─────────────────────────────────────────────── */
function History() {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0", marginBottom: "16px" }}>Histórico</h2>
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "12px",
          padding: "28px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <ListEmptyIcon />
        <p style={{ fontSize: "14px", color: "#555555" }}>Nenhum serviço contratado ainda</p>
        <Link
          href="/feed"
          style={{
            marginTop: "4px",
            height: "36px",
            padding: "0 20px",
            borderRadius: "999px",
            backgroundColor: "#FFD11A",
            color: "#0F0F0F",
            border: "none",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          Explorar serviços
        </Link>
      </div>
    </div>
  );
}

/* ─── Settings List ───────────────────────────────────────── */
function SettingsList({ onSignOut }: { onSignOut: () => void }) {
  const items = [
    { label: "Dados pessoais",  icon: <PersonIcon />,  href: "/configuracoes", danger: false, action: undefined as (() => void) | undefined },
    { label: "Notificações",    icon: <BellIcon />,    href: "/notificacoes",  danger: false, action: undefined as (() => void) | undefined },
    { label: "Privacidade",     icon: <LockIcon />,    href: undefined,        danger: false, action: undefined as (() => void) | undefined },
    { label: "Ajuda e suporte", icon: <HelpIcon />,    href: undefined,        danger: false, action: undefined as (() => void) | undefined },
    { label: "Sair da conta",   icon: <LogoutIcon />,  href: undefined,        danger: true,  action: onSignOut },
  ];

  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {items.map(({ label, icon, href, danger, action }, i) => {
        const isLast = i === items.length - 1;
        const inner = (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderBottom: isLast ? "none" : "1px solid #2E2E2E",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: danger ? "#FF4444" : "#888888", display: "flex" }}>{icon}</span>
              <span style={{ fontSize: "15px", color: danger ? "#FF4444" : "#F0F0F0" }}>{label}</span>
            </div>
            {!danger && <ChevronIcon />}
          </div>
        );

        if (href) {
          return (
            <Link key={label} href={href} style={{ textDecoration: "none", display: "block" }}>
              {inner}
            </Link>
          );
        }
        return (
          <div key={label} onClick={action} role={action ? "button" : undefined}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeIcon /> },
  { label: "Buscar",  href: "/busca",      icon: <SearchIcon /> },
  { label: "Criar",   href: "/criar-post", icon: <CreateIcon />, special: true },
  { label: "Pedidos", href: "/pedidos",    icon: <ClipboardIcon /> },
  { label: "Perfil",  href: "/meu-perfil", icon: <UserIcon /> },
];

function BottomNav({ active }: { active: string }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "#0F0F0F",
        borderTop: "1px solid #2E2E2E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 8px",
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map(({ label, href, icon, special }) => {
        const isActive = label === active;
        return (
          <Link
            key={label}
            href={href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              textDecoration: "none",
              color: isActive ? "#F0F0F0" : "#555555",
              minWidth: "48px",
            }}
          >
            {special ? (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#FFD11A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "-2px",
                }}
              >
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

/* ─── Icons ───────────────────────────────────────────────── */
function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CameraSmallIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PostEmptyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="14" y2="13" />
    </svg>
  );
}

function ListEmptyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CreateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" ry="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
