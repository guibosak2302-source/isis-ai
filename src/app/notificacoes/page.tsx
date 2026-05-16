import Link from "next/link";

export default function NotificacoesPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "56px",
        paddingBottom: "80px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Section label="Hoje">
          <NotifItem
            unread
            href="/chat"
            icon={<AvatarIcon letter="M" bg="#2A2A2A" />}
            title="Marina Costa respondeu seu post"
            body="Olá! Posso fazer uma visita técnica ainda essa semana..."
            time="há 5 min"
          />
          <NotifItem
            unread
            href="/assinatura"
            icon={<IconBox><ContractIcon /></IconBox>}
            title="Contrato assinado por Marina Costa"
            body="O contrato de pintura foi assinado. Aguardando sua assinatura."
            time="há 32 min"
          />
          <NotifItem
            unread
            href="/etapas"
            icon={<IconBox color="#1A3A1A" stroke="#4CAF50"><PayIcon /></IconBox>}
            title="Ísis Pay: etapa 1 concluída"
            body="Marina marcou a etapa Limpeza e preparo como concluída. Aprove para liberar R$ 800."
            time="há 1h"
          />
        </Section>

        <Section label="Ontem">
          <NotifItem
            href="/feed"
            icon={<AvatarIcon letter="R" bg="#1E3A2A" />}
            title="Ricardo Alves comentou no seu post"
            body="Faço serviços elétricos na região, posso te atender!"
            time="há 1 dia"
          />
          <NotifItem
            icon={<IconBox><StarIcon /></IconBox>}
            title="Avaliação recebida"
            body="Julia deixou uma avaliação 5 estrelas para você."
            time="há 1 dia"
          />
          <NotifItem
            icon={<IconBox><PersonIcon /></IconBox>}
            title="Novo seguidor"
            body="Paulo Silva começou a seguir seu perfil."
            time="há 1 dia"
          />
        </Section>

        <Section label="Esta semana">
          <NotifItem
            href="/isis-pay"
            icon={<IconBox color="#1A3A1A" stroke="#4CAF50"><PayIcon /></IconBox>}
            title="Pagamento confirmado"
            body="R$ 3.200 depositado com sucesso no Ísis Pay."
            time="há 3 dias"
          />
          <NotifItem
            href="/contrato"
            icon={<IconBox><ContractIcon /></IconBox>}
            title="Contrato gerado pela IA"
            body="Seu contrato de pintura foi gerado com sucesso."
            time="há 5 dias"
          />
        </Section>
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
      <span style={{ fontSize: "17px", fontWeight: 500, color: "#FFFFFF" }}>Notificações</span>
      <button
        style={{
          background: "none",
          border: "none",
          fontSize: "12px",
          color: "#888888",
          cursor: "pointer",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          padding: 0,
        }}
      >
        Marcar todas como lidas
      </button>
    </header>
  );
}

/* ─── Section ─────────────────────────────────────────────── */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        style={{
          fontSize: "11px",
          color: "#555555",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          fontWeight: 500,
          padding: "16px 16px 8px",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

/* ─── Notification Item ───────────────────────────────────── */
interface NotifItemProps {
  unread?: boolean;
  href?: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  time: string;
}

function NotifItem({ unread, href, icon, title, body, time }: NotifItemProps) {
  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        backgroundColor: unread ? "#161616" : "transparent",
        borderLeft: unread ? "3px solid #FFFFFF" : "3px solid transparent",
        borderBottom: "1px solid #222222",
        cursor: href ? "pointer" : "default",
        position: "relative",
      }}
    >
      {/* Icon + unread dot */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {icon}
        {unread && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#3B82F6",
              border: "1.5px solid #0E0E0E",
            }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "14px", fontWeight: unread ? 500 : 400, color: unread ? "#FFFFFF" : "#888888", marginBottom: "3px" }}>
          {title}
        </p>
        <p style={{ fontSize: "13px", color: unread ? "#888888" : "#555555", lineHeight: 1.5, marginBottom: "5px" }}>
          {body}
        </p>
        <p style={{ fontSize: "12px", color: "#555555" }}>{time}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "block" }}>
        {inner}
      </Link>
    );
  }
  return inner;
}

/* ─── Icon helpers ────────────────────────────────────────── */
function AvatarIcon({ letter, bg }: { letter: string; bg: string }) {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF" }}>{letter}</span>
    </div>
  );
}

function IconBox({ children, color = "#222222", stroke: _stroke }: { children: React.ReactNode; color?: string; stroke?: string }) {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
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

/* ─── SVG Icons ───────────────────────────────────────────── */
function ContractIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function PayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
