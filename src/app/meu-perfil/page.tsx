import Link from "next/link";

export default function MeuPerfilPage() {
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
      <CoverAndAvatar />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
        <Stats />
        <ProviderCard />
        <MyPosts />
        <History />
        <SettingsList />
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
        backgroundColor: "#0E0E0E",
        borderBottom: "1px solid #222222",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <div style={{ width: "36px" }} />
      <span style={{ fontSize: "17px", fontWeight: 500, color: "#FFFFFF" }}>Meu perfil</span>
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
function CoverAndAvatar() {
  return (
    <div style={{ paddingTop: "56px" }}>
      {/* Cover */}
      <div style={{ height: "110px", backgroundColor: "#1A1A1A" }} />

      {/* Avatar row */}
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
        <div style={{ position: "relative", display: "inline-block", marginTop: "-40px", marginBottom: "12px" }}>
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
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: 500, color: "#FFFFFF" }}>G</span>
          </div>
          {/* Edit button */}
          <button
            aria-label="Editar foto"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              border: "2px solid #0E0E0E",
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
            <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#FFFFFF", marginBottom: "4px" }}>
              Guilherme
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <PinIcon />
              <span style={{ fontSize: "13px", color: "#555555" }}>Taubaté, SP</span>
            </div>
          </div>
          <button
            style={{
              height: "34px",
              padding: "0 16px",
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
            Editar perfil
          </button>
        </div>
      </div>
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

/* ─── Provider Card ───────────────────────────────────────── */
function ProviderCard() {
  return (
    <div
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <StarIcon />
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF" }}>Ofereça seus serviços na Ísis</p>
      </div>
      <p style={{ fontSize: "13px", color: "#555555", marginBottom: "14px", lineHeight: 1.6 }}>
        Cadastre seus serviços e comece a receber pedidos
      </p>
      <button
        style={{
          width: "100%",
          height: "42px",
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
        Quero ser prestador
      </button>
    </div>
  );
}

/* ─── My Posts ────────────────────────────────────────────── */
function MyPosts() {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF", marginBottom: "16px" }}>Meus posts</h2>
      <div
        style={{
          backgroundColor: "#161616",
          border: "1px solid #222222",
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
            color: "#FFFFFF",
            border: "1px solid #333333",
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
      <h2 style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF", marginBottom: "16px" }}>Histórico</h2>
      <div
        style={{
          backgroundColor: "#161616",
          border: "1px solid #222222",
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
            backgroundColor: "#FFFFFF",
            color: "#0E0E0E",
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
const SETTINGS = [
  { label: "Dados pessoais",   icon: <PersonIcon />,   href: "/configuracoes", danger: false },
  { label: "Notificações",     icon: <BellIcon />,     href: "/notificacoes",  danger: false },
  { label: "Privacidade",      icon: <LockIcon />,     href: undefined,        danger: false },
  { label: "Ajuda e suporte",  icon: <HelpIcon />,     href: undefined,        danger: false },
  { label: "Sair da conta",    icon: <LogoutIcon />,   href: undefined,        danger: true  },
];

function SettingsList() {
  return (
    <div
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {SETTINGS.map(({ label, icon, href, danger }, i) => {
        const isLast = i === SETTINGS.length - 1;
        const inner = (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderBottom: isLast ? "none" : "1px solid #222222",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ color: danger ? "#FF4444" : "#888888", display: "flex" }}>{icon}</span>
              <span style={{ fontSize: "15px", color: danger ? "#FF4444" : "#FFFFFF" }}>{label}</span>
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
        return <div key={label}>{inner}</div>;
      })}
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeIcon /> },
  { label: "Buscar",  href: "/feed",       icon: <SearchIcon /> },
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0E0E0E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="14" y2="13" />
    </svg>
  );
}

function ListEmptyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
