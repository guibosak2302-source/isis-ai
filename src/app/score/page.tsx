import Link from "next/link";

/* ─── Page ────────────────────────────────────────────────── */
export default function ScorePage() {
  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "56px",
        paddingBottom: "96px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px 0" }}>
        <ScoreHero />
        <Gap h={24} />
        <CriteriaSection />
        <Gap h={24} />
        <SealsSection />
        <Gap h={24} />
        <HistorySection />
        <Gap h={24} />
        <TipsSection />
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
      <Link
        href="/meu-perfil"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </Link>

      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Score Bico</span>

      <Link
        href="/ranking"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "999px",
          padding: "6px 12px",
          fontSize: "12px",
          fontWeight: 500,
          color: "#F0F0F0",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}
      >
        🏆 Ranking
      </Link>
    </header>
  );
}

/* ─── Score Hero ──────────────────────────────────────────── */
function ScoreHero() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid rgba(255,209,26,0.3)",
        borderRadius: "16px",
        padding: "24px 20px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "10px",
          color: "#888888",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 500,
          marginBottom: "8px",
        }}
      >
        Seu Score Bico
      </p>

      {/* Big number */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px", marginBottom: "16px" }}>
        <span style={{ fontSize: "56px", fontWeight: 900, color: "#FFD11A", lineHeight: 1 }}>94</span>
        <span style={{ fontSize: "20px", color: "#555555", fontWeight: 400 }}>/100</span>
      </div>

      {/* Seal badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#1E1800", border: "1px solid rgba(255,209,26,0.4)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
        <span style={{ fontSize: "16px" }}>🥇</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFD11A" }}>Ouro</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: "8px", backgroundColor: "#2E2E2E", borderRadius: "999px", overflow: "hidden", marginBottom: "10px" }}>
        <div
          style={{
            width: "94%",
            height: "100%",
            background: "linear-gradient(90deg, #FF7A1A 0%, #FFD11A 100%)",
            borderRadius: "999px",
          }}
        />
      </div>

      <p style={{ fontSize: "12px", color: "#888888" }}>
        Top <span style={{ color: "#FFD11A", fontWeight: 600 }}>3%</span> dos prestadores de Taubaté
      </p>
    </div>
  );
}

/* ─── Criteria ────────────────────────────────────────────── */
const CRITERIA = [
  { label: "Qualidade",    value: 92, color: "#FFD11A" },
  { label: "Pontualidade", value: 96, color: "#1D9E75" },
  { label: "Comunicação",  value: 91, color: "#FFD11A" },
  { label: "Preço justo",  value: 88, color: "#FF7A1A" },
];

function CriteriaSection() {
  return (
    <div>
      <SectionTitle text="Como seu score é calculado" />
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", overflow: "hidden" }}>
        {CRITERIA.map(({ label, value, color }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderBottom: i < CRITERIA.length - 1 ? "1px solid #2E2E2E" : "none",
            }}
          >
            <span style={{ fontSize: "12px", color: "#888888", width: "72px", flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, height: "6px", backgroundColor: "#2E2E2E", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: `${value}%`, height: "100%", backgroundColor: color, borderRadius: "999px" }} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#F0F0F0", width: "28px", textAlign: "right", flexShrink: 0 }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Seals ───────────────────────────────────────────────── */
const SEALS = [
  {
    emoji: "🥉",
    label: "Bronze",
    description: "Cadastrado na base Bico",
    labelColor: "#CD7F32",
    bg: "#1E0E00",
    border: "rgba(205,127,50,0.4)",
    done: true,
  },
  {
    emoji: "🥈",
    label: "Prata",
    description: "Sem antecedentes criminais verificados",
    labelColor: "#A8B8C8",
    bg: "#141820",
    border: "rgba(168,184,200,0.4)",
    done: true,
  },
  {
    emoji: "🥇",
    label: "Ouro",
    description: "Verificação completa + Score alto",
    labelColor: "#FFD11A",
    bg: "#1E1800",
    border: "rgba(255,209,26,0.4)",
    done: true,
  },
];

function SealsSection() {
  return (
    <div>
      <SectionTitle text="Nível de verificação" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {SEALS.map(({ emoji, label, description, labelColor, bg, border, done }) => (
          <div
            key={label}
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "20px", flexShrink: 0 }}>{emoji}</span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: labelColor, marginBottom: "2px" }}>
                  {label}
                </p>
                <p style={{ fontSize: "12px", color: "#888888" }}>{description}</p>
              </div>
            </div>
            {done && (
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#0D2E1E",
                  border: "1px solid #1D9E75",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── History ─────────────────────────────────────────────── */
const HISTORY = [
  { date: "Mai 2026", score: 94, delta: +3,  note: "3 avaliações 5 estrelas recebidas" },
  { date: "Abr 2026", score: 91, delta: +4,  note: "Verificação Ouro concluída" },
  { date: "Mar 2026", score: 87, delta: +2,  note: "Pontualidade melhorada" },
  { date: "Fev 2026", score: 85, delta: -1,  note: "1 reclamação resolvida" },
];

function HistorySection() {
  return (
    <div>
      <SectionTitle text="Histórico do score" />
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", overflow: "hidden" }}>
        {HISTORY.map(({ date, score, delta, note }, i) => (
          <div
            key={date}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "13px 16px",
              borderBottom: i < HISTORY.length - 1 ? "1px solid #2E2E2E" : "none",
            }}
          >
            <span style={{ fontSize: "12px", color: "#555555", width: "60px", flexShrink: 0 }}>{date}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.4 }}>{note}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0, gap: "2px" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#F0F0F0" }}>{score}</span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: delta > 0 ? "#1D9E75" : "#FF7A1A",
                }}
              >
                {delta > 0 ? `+${delta}` : delta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tips ────────────────────────────────────────────────── */
const TIPS = [
  { icon: "💬", title: "Responda rápido", body: "Responder em menos de 1h aumenta sua nota de Comunicação." },
  { icon: "⏰", title: "Seja pontual", body: "Chegue no horário combinado para subir sua Pontualidade." },
  { icon: "⭐", title: "Peça avaliações", body: "Solicite avaliações após cada serviço concluído." },
  { icon: "📋", title: "Complete o perfil", body: "Perfis completos recebem 40% mais candidaturas." },
];

function TipsSection() {
  return (
    <div>
      <SectionTitle text="Como melhorar seu score" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {TIPS.map(({ icon, title, body }) => (
          <div
            key={title}
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2E2E2E",
              borderRadius: "12px",
              padding: "14px 16px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", marginBottom: "3px" }}>{title}</p>
              <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeIcon /> },
  { label: "Buscar",  href: "/busca",       icon: <SearchIcon /> },
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
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "-2px" }}>
                <span style={{ color: "#0F0F0F" }}>{icon}</span>
              </div>
            ) : (
              <>
                <span style={{ color: isActive ? "#FFD11A" : "#555555" }}>{icon}</span>
                <span style={{ fontSize: "11px", fontWeight: isActive ? 500 : 400, color: isActive ? "#F0F0F0" : "#555555" }}>{label}</span>
              </>
            )}
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

function SectionTitle({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0", marginBottom: "12px" }}>
      {text}
    </p>
  );
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
