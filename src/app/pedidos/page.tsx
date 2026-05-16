import Link from "next/link";

export default function PedidosPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingBottom: "80px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px", paddingTop: "72px" }}>
        <StatusFilters />
        <Cards />
      </div>
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
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <span style={{ fontSize: "17px", fontWeight: 500, color: "#FFFFFF" }}>Meus pedidos</span>
    </header>
  );
}

/* ─── Status Filters ──────────────────────────────────────── */
const FILTERS = ["Todos", "Em andamento", "Aguardando", "Concluídos", "Cancelados"];

function StatusFilters() {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "4px",
        marginBottom: "20px",
        scrollbarWidth: "none",
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
              border: active ? "none" : "1px solid #222222",
              backgroundColor: active ? "#FFFFFF" : "transparent",
              color: active ? "#0E0E0E" : "#888888",
              fontSize: "13px",
              fontWeight: active ? 500 : 400,
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

/* ─── Cards ───────────────────────────────────────────────── */
function Cards() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <CardEmAndamento />
      <CardAguardando />
      <CardConcluido
        title="Faxina completa"
        avatarLetter="J"
        avatarBg="#1E2A3A"
        provider="Julia Faxina"
        verified={false}
        date="Concluído em 02 mai 2026"
        price="R$ 280"
        stars={5}
      />
      <CardConcluido
        title="Aula de inglês — pacote 10h"
        avatarLetter="P"
        avatarBg="#2A1A2A"
        provider="Prof. Paulo"
        verified={false}
        price="R$ 600"
        stars={4}
      />
    </div>
  );
}

/* ─── Card: Em andamento ──────────────────────────────────── */
function CardEmAndamento() {
  const steps = [
    { label: "Limpeza",     done: true,  current: false },
    { label: "Massa corrida", done: true, current: false },
    { label: "Pintura",     done: false, current: true  },
    { label: "Acabamento",  done: false, current: false },
  ];

  return (
    <article
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <Badge bg="#1A3A1A" color="#4CAF50" label="Em andamento" />
      </div>

      <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", marginBottom: "12px" }}>
        Pintura de apartamento 80m²
      </p>

      <ProviderRow letter="M" bg="#2A2A2A" name="Marina Costa" verified />

      <p style={{ fontSize: "12px", color: "#555555", marginTop: "10px", marginBottom: "10px" }}>
        Iniciado em 10 mai 2026
      </p>

      <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", marginBottom: "14px" }}>
        R$ 3.200
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#555555" }}>2 de 4 etapas concluídas</span>
        </div>
        <div style={{ height: "4px", backgroundColor: "#222222", borderRadius: "999px", overflow: "hidden" }}>
          <div style={{ width: "50%", height: "100%", backgroundColor: "#4CAF50", borderRadius: "999px" }} />
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {steps.map(({ label, done, current }) => (
          <span
            key={label}
            style={{
              fontSize: "12px",
              color: done ? "#4CAF50" : current ? "#FFFFFF" : "#555555",
              fontWeight: current ? 500 : 400,
            }}
          >
            {done ? `${label} ✓` : current ? `${label} →` : label}
            {label !== "Acabamento" && (
              <span style={{ color: "#333333", marginLeft: "6px" }}>·</span>
            )}
          </span>
        ))}
      </div>

      <Divider />
      <OutlineButton label="Ver detalhes" href="/etapas" />
    </article>
  );
}

/* ─── Card: Aguardando ────────────────────────────────────── */
function CardAguardando() {
  return (
    <article
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <Badge bg="#3A3A1A" color="#FFB800" label="Aguardando aprovação" />
      </div>

      <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", marginBottom: "12px" }}>
        Instalação elétrica residencial
      </p>

      <ProviderRow letter="R" bg="#1E3A2A" name="Ricardo Alves" verified={false} />

      <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", margin: "12px 0 16px" }}>
        R$ 850
      </p>

      <Divider />
      <SolidButton label="Aprovar proposta" />
    </article>
  );
}

/* ─── Card: Concluído ─────────────────────────────────────── */
interface ConcludedProps {
  title: string;
  avatarLetter: string;
  avatarBg: string;
  provider: string;
  verified: boolean;
  date?: string;
  price: string;
  stars: number;
}

function CardConcluido({ title, avatarLetter, avatarBg, provider, verified, date, price, stars }: ConcludedProps) {
  return (
    <article
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <Badge bg="#1A2A3A" color="#4A9EFF" label="Concluído" />
      </div>

      <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", marginBottom: "12px" }}>
        {title}
      </p>

      <ProviderRow letter={avatarLetter} bg={avatarBg} name={provider} verified={verified} />

      {date && (
        <p style={{ fontSize: "12px", color: "#555555", marginTop: "10px" }}>{date}</p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "10px 0 16px" }}>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF" }}>{price}</p>
        <Stars count={stars} />
      </div>

      <Divider />
      <div style={{ display: "flex", gap: "8px" }}>
        <OutlineButton label="Ver contrato" />
        <Link
          href="/avaliacao"
          style={{
            height: "38px",
            padding: "0 18px",
            borderRadius: "999px",
            backgroundColor: "#FFFFFF",
            color: "#0E0E0E",
            border: "none",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          Avaliar
        </Link>
      </div>
    </article>
  );
}

/* ─── Shared components ───────────────────────────────────── */
function Badge({ bg, color, label }: { bg: string; color: string; label: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: bg,
        color,
        fontSize: "12px",
        fontWeight: 500,
        padding: "4px 10px",
        borderRadius: "999px",
      }}
    >
      {label}
    </span>
  );
}

function ProviderRow({ letter, bg, name, verified }: { letter: string; bg: string; name: string; verified: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#FFFFFF" }}>{letter}</span>
      </div>
      <span style={{ fontSize: "13px", color: "#888888" }}>{name}</span>
      {verified && <VerifiedBadge />}
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span style={{ fontSize: "14px", color: "#F59E0B", letterSpacing: "1px" }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

function Divider() {
  return <div style={{ height: "1px", backgroundColor: "#222222", marginBottom: "14px" }} />;
}

function OutlineButton({ label, href }: { label: string; href?: string }) {
  const style = {
    height: "38px",
    padding: "0 18px",
    borderRadius: "999px",
    backgroundColor: "transparent",
    color: "#FFFFFF",
    border: "1px solid #333333",
    fontSize: "13px",
    fontWeight: 400 as const,
    fontFamily: "var(--font-inter), Inter, sans-serif",
    cursor: "pointer",
    display: "inline-flex" as const,
    alignItems: "center" as const,
    textDecoration: "none",
  };
  if (href) {
    return <Link href={href} style={style}>{label}</Link>;
  }
  return (
    <button
      style={{
        height: "38px",
        padding: "0 18px",
        borderRadius: "999px",
        backgroundColor: "transparent",
        color: "#FFFFFF",
        border: "1px solid #333333",
        fontSize: "13px",
        fontWeight: 400,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function SolidButton({ label }: { label: string }) {
  return (
    <button
      style={{
        height: "38px",
        padding: "0 18px",
        borderRadius: "999px",
        backgroundColor: "#FFFFFF",
        color: "#0E0E0E",
        border: "none",
        fontSize: "13px",
        fontWeight: 500,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        cursor: "pointer",
      }}
    >
      {label}
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
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "#0E0E0E",
        borderTop: "1px solid #222222",
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
              color: isActive ? "#FFFFFF" : "#555555",
              minWidth: "48px",
            }}
          >
            {special ? (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "-2px",
                }}
              >
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

/* ─── Icons ───────────────────────────────────────────────── */
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
