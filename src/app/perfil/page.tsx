import Link from "next/link";


export default function PerfilPage() {
  return (
    <div style={{ backgroundColor: "#0E0E0E", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "80px" }}>
      <Header />
      <CoverAndAvatar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
        <ProfileInfo />
        <Stats />
        <About />
        <Portfolio />
        <Reviews />
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
        position: "sticky",
        top: 0,
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
        href="/feed"
        aria-label="Voltar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#FFFFFF",
          textDecoration: "none",
        }}
      >
        <ArrowLeftIcon />
      </Link>

      <span style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF" }}>Perfil</span>

      <button
        aria-label="Mais opções"
        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#888888", display: "flex", alignItems: "center" }}
      >
        <DotsIcon />
      </button>
    </header>
  );
}

/* ─── Cover + Avatar ──────────────────────────────────────── */
function CoverAndAvatar() {
  return (
    <div style={{ position: "relative", marginBottom: "48px" }}>
      {/* Cover */}
      <div style={{ height: "120px", backgroundColor: "#1A1A1A" }} />

      {/* Avatar */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "16px",
          display: "flex",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#2A2A2A",
            border: "3px solid #0E0E0E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: 500, color: "#FFFFFF" }}>M</span>
        </div>
        <div style={{ paddingBottom: "4px" }}>
          <VerifiedBadge />
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Info ────────────────────────────────────────── */
function ProfileInfo() {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#FFFFFF", marginBottom: "4px" }}>
        Marina Costa
      </h1>
      <p style={{ fontSize: "14px", color: "#888888", marginBottom: "8px" }}>
        Pintora · Reformas
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
        <PinIcon />
        <span style={{ fontSize: "13px", color: "#555555" }}>Taubaté, SP</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>4.9 ★</span>
        <span style={{ fontSize: "13px", color: "#555555" }}>128 serviços realizados</span>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            flex: 1,
            height: "44px",
            backgroundColor: "#FFFFFF",
            color: "#0E0E0E",
            border: "none",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          Contratar
        </button>
        <Link
          href="/chat"
          style={{
            flex: 1,
            height: "44px",
            backgroundColor: "transparent",
            color: "#FFFFFF",
            border: "1px solid #333333",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Mensagem
        </Link>
      </div>
    </div>
  );
}

/* ─── Stats ───────────────────────────────────────────────── */
function Stats() {
  const items = [
    { value: "128", label: "serviços" },
    { value: "4.9", label: "avaliação" },
    { value: "3 anos", label: "experiência" },
  ];

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
      {items.map(({ value, label }) => (
        <div
          key={label}
          style={{
            flex: 1,
            backgroundColor: "#161616",
            border: "1px solid #222222",
            borderRadius: "10px",
            padding: "14px 10px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: 500, color: "#FFFFFF", marginBottom: "4px" }}>{value}</p>
          <p style={{ fontSize: "12px", color: "#555555" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── About ───────────────────────────────────────────────── */
function About() {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF", marginBottom: "12px" }}>Sobre</h2>
      <p style={{ fontSize: "14px", color: "#888888", lineHeight: 1.7 }}>
        Especialista em pintura residencial e comercial. Trabalho com tintas de primeira linha, acabamento impecável e prazo garantido. Atendo Taubaté e região do Vale do Paraíba.
      </p>
    </div>
  );
}

/* ─── Portfolio ───────────────────────────────────────────── */
function Portfolio() {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF", marginBottom: "12px" }}>Portfólio</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #222222",
              borderRadius: "10px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "12px", color: "#333333", fontWeight: 500, letterSpacing: "0.08em" }}>FOTO</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Reviews ─────────────────────────────────────────────── */
function Reviews() {
  const data = [
    {
      letter: "J",
      bg: "#1E2A3A",
      name: "João Mendes",
      comment: "Serviço impecável! Marina foi super pontual, limpou tudo depois e o acabamento ficou perfeito. Recomendo demais.",
    },
    {
      letter: "A",
      bg: "#2A1E2A",
      name: "Ana Rodrigues",
      comment: "Contratei para pintar dois quartos e a sala. Ficou lindo, preço justo e entregou antes do prazo. Com certeza vou chamar de novo.",
    },
  ];

  return (
    <div style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF", marginBottom: "12px" }}>Avaliações</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {data.map(({ letter, bg, name, comment }) => (
          <div
            key={name}
            style={{
              backgroundColor: "#161616",
              border: "1px solid #222222",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <SmallAvatar letter={letter} bg={bg} />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>{name}</p>
                <p style={{ fontSize: "13px", color: "#F59E0B", letterSpacing: "0.05em" }}>★★★★★</p>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.65 }}>{comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed", href: "/feed", icon: <HomeIcon /> },
  { label: "Buscar", href: "/busca", icon: <SearchNavIcon /> },
  { label: "Pedidos", href: "/pedidos", icon: <ClipboardIcon /> },
  { label: "Perfil", href: "/meu-perfil", icon: <UserIcon /> },
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
              color: isActive ? "#FFFFFF" : "#555555",
              minWidth: "56px",
            }}
          >
            <span style={{ color: isActive ? "#FFFFFF" : "#555555" }}>{icon}</span>
            <span style={{ fontSize: "11px", fontWeight: isActive ? 500 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ─── Small Avatar ────────────────────────────────────────── */
function SmallAvatar({ letter, bg }: { letter: string; bg: string }) {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>{letter}</span>
    </div>
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

function DotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#888888">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" />
      <path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function SearchNavIcon() {
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
