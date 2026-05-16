import Link from "next/link";

export default function EtapasPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "56px",
        paddingBottom: "88px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px 0" }}>
        <ServiceCard />
        <Gap h={20} />
        <StagesSection />
        <Gap h={20} />
        <Updates />
        <Gap h={20} />
        <QuickContact />
        <Gap h={80} />
      </div>
      <FloatingButton />
      <BottomNav active="Pedidos" />
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
        backgroundColor: "#0E0E0E",
        borderBottom: "1px solid #222222",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <Link
        href="/pedidos"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#FFFFFF", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </Link>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF" }}>Acompanhamento</span>
      <Link
        href="/chat"
        aria-label="Chat"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#888888", textDecoration: "none" }}
      >
        <ChatIcon />
      </Link>
    </header>
  );
}

/* ─── Service Card ────────────────────────────────────────── */
function ServiceCard() {
  return (
    <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", padding: "16px" }}>
      <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", marginBottom: "12px" }}>
        Pintura completa de apartamento 80m²
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <SmallAvatar letter="M" bg="#2A2A2A" />
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF" }}>Marina Costa</span>
        <VerifiedBadge />
        <span style={{ fontSize: "13px", color: "#888888" }}>· Pintora</span>
      </div>

      <p style={{ fontSize: "12px", color: "#555555", marginBottom: "14px" }}>
        Iniciado em 15 mai 2026 · Prazo: 30 mai 2026
      </p>

      <div style={{ height: "6px", backgroundColor: "#2A2A2A", borderRadius: "999px", overflow: "hidden", marginBottom: "8px" }}>
        <div style={{ width: "50%", height: "100%", backgroundColor: "#FFFFFF", borderRadius: "999px" }} />
      </div>
      <p style={{ fontSize: "12px", color: "#888888" }}>2 de 4 etapas concluídas</p>
    </div>
  );
}

/* ─── Stages Section ──────────────────────────────────────── */
function StagesSection() {
  return (
    <div>
      <SectionLabel text="Etapas do serviço" />
      <div style={{ position: "relative" }}>
        {/* Vertical connector */}
        <div style={{ position: "absolute", left: "15px", top: "16px", bottom: "16px", width: "2px", backgroundColor: "#222222", zIndex: 0 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <StageComplete
            n={1}
            title="Limpeza e preparo"
            date="Concluída em 16 mai 2026"
            payBadge="R$ 800 liberado"
            photos={3}
            review="★★★★★ Excelente trabalho"
          />
          <StageComplete
            n={2}
            title="Massa corrida"
            date="Concluída em 19 mai 2026"
            payBadge="R$ 700 liberado"
            photos={2}
            review="★★★★★ Perfeito"
          />
          <StageActive />
          <StagePending />
        </div>
      </div>
    </div>
  );
}

/* ─── Stage: Complete ─────────────────────────────────────── */
function StageComplete({ n, title, date, payBadge, photos, review }: {
  n: number; title: string; date: string; payBadge: string; photos: number; review: string;
}) {
  return (
    <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", padding: "16px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <StepCircle type="done" label={String(n)} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>{title}</p>
          <p style={{ fontSize: "12px", color: "#555555" }}>{date}</p>
        </div>
        <GreenBadge label={payBadge} />
      </div>

      {/* Photos grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${photos}, 1fr)`, gap: "6px", marginBottom: "10px" }}>
        {Array.from({ length: photos }).map((_, i) => (
          <div key={i} style={{ height: "70px", backgroundColor: "#1A1A1A", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", color: "#333333", fontWeight: 500, letterSpacing: "0.06em" }}>FOTO</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: "13px", color: "#888888" }}>{review}</p>
    </div>
  );
}

/* ─── Stage: Active ───────────────────────────────────────── */
function StageActive() {
  return (
    <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", padding: "16px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <StepCircle type="active" label="3" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>Aplicação de tinta</p>
          <p style={{ fontSize: "12px", color: "#555555" }}>Previsão: 24 mai 2026</p>
        </div>
        <span style={{ backgroundColor: "#3A3A1A", color: "#FFB800", fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
          Em andamento
        </span>
      </div>

      {/* No photos yet */}
      <div style={{
        backgroundColor: "#1A1A1A",
        border: "1px dashed #333333",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        marginBottom: "14px",
      }}>
        <p style={{ fontSize: "13px", color: "#555555" }}>Marina ainda não enviou fotos desta etapa</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button style={{
          width: "100%", height: "42px", backgroundColor: "#FFFFFF", color: "#0E0E0E", border: "none",
          borderRadius: "999px", fontSize: "14px", fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer",
        }}>
          Aprovar etapa
        </button>
        <button style={{
          width: "100%", height: "42px", backgroundColor: "transparent", color: "#FFFFFF",
          border: "1px solid #333333", borderRadius: "999px", fontSize: "14px", fontWeight: 400,
          fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer",
        }}>
          Solicitar correção
        </button>
      </div>
    </div>
  );
}

/* ─── Stage: Pending ──────────────────────────────────────── */
function StagePending() {
  return (
    <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", padding: "16px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <StepCircle type="pending" label="4" />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "14px", color: "#888888" }}>Acabamento final</p>
          <p style={{ fontSize: "12px", color: "#555555" }}>R$ 500 · Aguardando etapa 3</p>
        </div>
        <span style={{ backgroundColor: "#2A2A2A", color: "#555555", fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
          Aguardando
        </span>
      </div>
    </div>
  );
}

/* ─── Step Circle ─────────────────────────────────────────── */
function StepCircle({ type, label }: { type: "done" | "active" | "pending"; label: string }) {
  const styles: Record<string, { bg: string; border: string; color: string }> = {
    done:    { bg: "#FFFFFF",  border: "#FFFFFF",  color: "#0E0E0E" },
    active:  { bg: "#3A3A1A", border: "#FFB800",  color: "#FFB800" },
    pending: { bg: "#1A1A1A", border: "#222222",  color: "#333333" },
  };
  const s = styles[type];
  return (
    <div style={{
      width: "32px", height: "32px", borderRadius: "50%",
      backgroundColor: s.bg, border: `2px solid ${s.border}`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {type === "done"
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0E0E0E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        : <span style={{ fontSize: "13px", fontWeight: 500, color: s.color }}>{label}</span>
      }
    </div>
  );
}

/* ─── Updates ─────────────────────────────────────────────── */
const UPDATE_ITEMS = [
  { text: "Marina enviou 3 fotos da etapa 2", time: "há 2 dias" },
  { text: "Etapa 1 aprovada por você",         time: "há 4 dias" },
  { text: "Serviço iniciado",                   time: "há 5 dias" },
];

function Updates() {
  return (
    <div>
      <SectionLabel text="Atualizações" />
      <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", overflow: "hidden" }}>
        {UPDATE_ITEMS.map(({ text, time }, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px",
              borderBottom: i < UPDATE_ITEMS.length - 1 ? "1px solid #222222" : "none",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#333333", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "13px", color: "#888888" }}>{text}</span>
            </div>
            <span style={{ fontSize: "12px", color: "#555555", flexShrink: 0 }}>{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Quick Contact ───────────────────────────────────────── */
function QuickContact() {
  return (
    <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SmallAvatar letter="M" bg="#2A2A2A" />
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>Marina Costa</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Mensagem", "Ligar"].map((label) => (
            <button key={label} style={{
              height: "34px", padding: "0 14px", borderRadius: "999px",
              backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid #333333",
              fontSize: "13px", fontWeight: 400, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer",
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Floating Button ─────────────────────────────────────── */
function FloatingButton() {
  return (
    <button
      style={{
        position: "fixed",
        bottom: "80px",
        right: "16px",
        zIndex: 40,
        height: "40px",
        padding: "0 16px",
        borderRadius: "999px",
        backgroundColor: "transparent",
        color: "#FF4444",
        border: "1px solid #FF4444",
        fontSize: "13px",
        fontWeight: 400,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      Reportar problema
    </button>
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
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "64px", backgroundColor: "#0E0E0E", borderTop: "1px solid #222222", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px", zIndex: 50 }}>
      {NAV_ITEMS.map(({ label, href, icon, special }) => {
        const isActive = label === active;
        return (
          <Link key={label} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", color: isActive ? "#FFFFFF" : "#555555", minWidth: "48px" }}>
            {special ? (
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "-2px" }}>
                <span style={{ color: "#0E0E0E" }}>{icon}</span>
              </div>
            ) : (
              <>
                <span style={{ color: isActive ? "#FFFFFF" : "#555555" }}>{icon}</span>
                <span style={{ fontSize: "11px", fontWeight: isActive ? 500 : 400 }}>{label}</span>
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

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>
      {text}
    </p>
  );
}

function SmallAvatar({ letter, bg }: { letter: string; bg: string }) {
  return (
    <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: "12px", fontWeight: 500, color: "#FFFFFF" }}>{letter}</span>
    </div>
  );
}

function GreenBadge({ label }: { label: string }) {
  return (
    <span style={{ backgroundColor: "#1A3A1A", color: "#4CAF50", fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
      {label}
    </span>
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

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" />
      <path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
