import Link from "next/link";

/* ─── Data ────────────────────────────────────────────────── */
const FILTERS = ["Todos", "Melhor score", "Menor preço", "Mais perto", "Verificados"];

const CANDIDATES = [
  {
    id: "carlos",
    top: true,
    avatarLetter: "C",
    avatarBg: "#2A2A2A",
    seal: { emoji: "🥇", label: "Ouro", bg: "#1E1800", color: "#FFD11A", border: "#FFD11A" },
    name: "Carlos Mendes",
    role: "Pintor · 8 anos de experiência",
    location: "Taubaté · 1.2km",
    score: 94,
    bars: [
      { label: "Qualidade",    value: 92 },
      { label: "Pontualidade", value: 96 },
      { label: "Comunicação",  value: 91 },
      { label: "Preço",        value: 88 },
    ],
    price: "R$ 480",
    days: "3 dias",
    pitch: "Faço pintura completa com tinta premium, acabamento impecável. Materiais inclusos.",
  },
  {
    id: "marina",
    top: false,
    avatarLetter: "M",
    avatarBg: "#1E2A2A",
    seal: { emoji: "🥈", label: "Prata", bg: "#1A1A1F", color: "#A0A8BF", border: "#4A5270" },
    name: "Marina Silva",
    role: "Pintora · 5 anos de experiência",
    location: "Taubaté · 2.1km",
    score: 87,
    bars: [
      { label: "Qualidade",    value: 88 },
      { label: "Pontualidade", value: 85 },
      { label: "Comunicação",  value: 90 },
      { label: "Preço",        value: 85 },
    ],
    price: "R$ 380",
    days: "5 dias",
    pitch: "Pintura com qualidade garantida e materiais negociáveis. Atendo fins de semana.",
  },
  {
    id: "joao",
    top: false,
    avatarLetter: "J",
    avatarBg: "#2A1E18",
    seal: { emoji: "🥉", label: "Bronze", bg: "#1E1610", color: "#C87941", border: "#6B3E1A" },
    name: "João Pintor",
    role: "Pintor · 2 anos de experiência",
    location: "Taubaté · 3.5km",
    score: 71,
    bars: [
      { label: "Qualidade",    value: 72 },
      { label: "Pontualidade", value: 68 },
      { label: "Comunicação",  value: 75 },
      { label: "Preço",        value: 70 },
    ],
    price: "R$ 320",
    days: "7 dias",
    pitch: "Serviço de pintura simples e rápido. Tinta por conta do cliente.",
  },
] as const;

/* ─── Page ────────────────────────────────────────────────── */
export default function CandidatosPage() {
  return (
    <>
      <style>{`
        @keyframes scan {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .scanning-bar {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          backgroundColor: "#0F0F0F",
          minHeight: "100vh",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          paddingTop: "56px",
          paddingBottom: "80px",
        }}
      >
        <Header />

        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 0" }}>
          <OrderSummary />
          <Gap h={12} />
          <Filters />
          <Gap h={16} />

          {CANDIDATES.map((c) => (
            <div key={c.id} style={{ marginBottom: "12px" }}>
              <CandidateCard c={c} />
            </div>
          ))}

          <SearchBanner />
          <Gap h={8} />
        </div>

        <BottomNav active="Pedidos" />
      </div>
    </>
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
      <Link
        href="/pedidos"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </Link>

      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>
        Candidatos (24)
      </span>

      <span
        style={{
          backgroundColor: "#0D2E1E",
          color: "#1D9E75",
          border: "1px solid #1D9E75",
          borderRadius: "999px",
          fontSize: "11px",
          fontWeight: 600,
          padding: "3px 10px",
          letterSpacing: "0.02em",
        }}
      >
        3 novos
      </span>
    </header>
  );
}

/* ─── Order Summary ───────────────────────────────────────── */
function OrderSummary() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "12px",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "16px" }}>🎨</span>
      <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>
        <span style={{ color: "#F0F0F0", fontWeight: 500 }}>Pintura</span>
        {" · "}Taubaté{" · "}
        <span style={{ color: "#FF7A1A" }}>Urgente</span>
        {" · "}24 avisados{" · "}
        <span style={{ color: "#1D9E75", fontWeight: 500 }}>3 candidaturas</span>
      </p>
    </div>
  );
}

/* ─── Filters ─────────────────────────────────────────────── */
function Filters() {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        scrollbarWidth: "none",
        paddingBottom: "2px",
      }}
    >
      {FILTERS.map((f) => {
        const active = f === "Todos";
        return (
          <button
            key={f}
            style={{
              flexShrink: 0,
              height: "34px",
              padding: "0 16px",
              borderRadius: "999px",
              border: active ? "none" : "1px solid #2E2E2E",
              backgroundColor: active ? "#FFD11A" : "transparent",
              color: active ? "#000000" : "#888888",
              fontSize: "13px",
              fontWeight: active ? 600 : 400,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Candidate Card ──────────────────────────────────────── */
type Candidate = typeof CANDIDATES[number];

function CandidateCard({ c }: { c: Candidate }) {
  return (
    <div
      style={{
        backgroundColor: c.top ? "rgba(255,209,26,0.03)" : "#1A1A1A",
        border: `1px solid ${c.top ? "#FFD11A" : "#2E2E2E"}`,
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top recommended badge */}
      {c.top && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "#FFD11A",
            color: "#000000",
            fontSize: "10px",
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: "999px",
            letterSpacing: "0.02em",
          }}
        >
          ⭐ Recomendado
        </div>
      )}

      <div style={{ padding: "16px" }}>
        {/* Avatar + info row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px", paddingRight: c.top ? "110px" : "0" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: c.avatarBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#F0F0F0" }}>{c.avatarLetter}</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F0F0F0" }}>{c.name}</span>
              <span
                style={{
                  backgroundColor: c.seal.bg,
                  color: c.seal.color,
                  border: `1px solid ${c.seal.border}`,
                  borderRadius: "999px",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  whiteSpace: "nowrap",
                }}
              >
                {c.seal.emoji} {c.seal.label}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#888888", marginBottom: "2px" }}>{c.role}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: "11px", color: "#555555" }}>{c.location}</span>
            </div>
          </div>
        </div>

        {/* Score section */}
        <div
          style={{
            backgroundColor: "#0F0F0F",
            borderRadius: "12px",
            padding: "12px 14px",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "32px", fontWeight: 700, color: "#FFD11A", lineHeight: 1 }}>
              {c.score}
            </span>
            <div>
              <p style={{ fontSize: "11px", color: "#888888", marginBottom: "1px" }}>Score Bico</p>
              <ScoreStars score={c.score} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {c.bars.map(({ label, value }) => (
              <ScoreBar key={label} label={label} value={value} />
            ))}
          </div>
        </div>

        {/* Proposal box */}
        <div
          style={{
            backgroundColor: "#0F0F0F",
            borderRadius: "12px",
            padding: "12px 14px",
            marginBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#FFD11A" }}>{c.price}</span>
            <span style={{ fontSize: "12px", color: "#888888" }}>· {c.days}</span>
          </div>
          <p style={{ fontSize: "11px", color: "#888888", lineHeight: 1.55 }}>{c.pitch}</p>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            href="/perfil"
            style={{
              flex: 1,
              height: "42px",
              backgroundColor: "transparent",
              color: "#F0F0F0",
              border: "1px solid #2E2E2E",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 400,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            Ver perfil
          </Link>
          <Link
            href="/chat"
            style={{
              flex: 1,
              height: "42px",
              backgroundColor: "#FFD11A",
              color: "#000000",
              border: "none",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            Contratar
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Score stars ─────────────────────────────────────────── */
function ScoreStars({ score }: { score: number }) {
  const filled = Math.round((score / 100) * 5);
  return (
    <div style={{ display: "flex", gap: "1px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: "10px", color: i <= filled ? "#FFD11A" : "#3A3A3A" }}>★</span>
      ))}
    </div>
  );
}

/* ─── Score bar ───────────────────────────────────────────── */
function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "10px", color: "#888888", width: "72px", flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: "4px", backgroundColor: "#2E2E2E", borderRadius: "999px", overflow: "hidden" }}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: value >= 90 ? "#1D9E75" : value >= 80 ? "#FFD11A" : "#FF7A1A",
            borderRadius: "999px",
          }}
        />
      </div>
      <span style={{ fontSize: "10px", color: "#888888", width: "22px", textAlign: "right", flexShrink: 0 }}>{value}</span>
    </div>
  );
}

/* ─── Search banner ───────────────────────────────────────── */
function SearchBanner() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px dashed #FFD11A",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <span style={{ fontSize: "18px" }}>🔍</span>
        <div>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", marginBottom: "2px" }}>
            Busca ainda ativa
          </p>
          <p style={{ fontSize: "12px", color: "#888888" }}>
            21 profissionais sendo analisados...
          </p>
        </div>
      </div>

      {/* Animated scan bar */}
      <div
        style={{
          height: "4px",
          backgroundColor: "#2E2E2E",
          borderRadius: "999px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="scanning-bar"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "30%",
            height: "100%",
            backgroundColor: "#FFD11A",
            borderRadius: "999px",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeIcon /> },
  { label: "Buscar",  href: "/busca",       icon: <SearchIcon /> },
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
      {NAV_ITEMS.map(({ label, href, icon }) => {
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
              minWidth: "56px",
            }}
          >
            <span style={{ color: isActive ? "#FFD11A" : "#555555" }}>{icon}</span>
            <span style={{ fontSize: "11px", fontWeight: isActive ? 600 : 400, color: isActive ? "#F0F0F0" : "#555555" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Shared ──────────────────────────────────────────────── */
function Gap({ h }: { h: number }) {
  return <div style={{ height: `${h}px` }} />;
}

/* ─── Icons ───────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
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
