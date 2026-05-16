import Link from "next/link";

export default function ConfiguracoesPage() {
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
        <div style={{ padding: "16px" }}>
          <ProfileCard />
        </div>

        <Section label="Conta">
          <Item icon={<UserIcon />}    label="Dados pessoais"        sub="nome, CPF, telefone" />
          <Item icon={<MapPinIcon />}  label="Endereço"              sub="localização principal" />
          <Item icon={<ShieldIcon />}  label="Segurança"             sub="senha e autenticação" />
          <Item icon={<BadgeIcon />}   label="Documentos verificados" sub="CPF, CNPJ, RG" last />
        </Section>

        <Section label="Prestador">
          <Item icon={<BriefcaseIcon />} label="Meus serviços"       sub="categorias que ofereço" />
          <Item icon={<ImageIcon />}     label="Portfólio"           sub="fotos dos meus trabalhos" />
          <Item icon={<MapIcon />}       label="Área de atendimento" sub="regiões que atendo" />
          <Item icon={<CalendarIcon />}  label="Disponibilidade"     sub="dias e horários" last />
        </Section>

        <Section label="Pagamentos">
          <Item icon={<LockIcon />}   label="Ísis Pay"            sub="saldo e transações"      href="/isis-pay" />
          <Item icon={<CardIcon />}   label="Métodos de pagamento" sub="cartões e Pix" />
          <Item icon={<BankIcon />}   label="Dados bancários"     sub="para receber pagamentos" />
          <Item icon={<ReceiptIcon />} label="Extrato"            sub="histórico financeiro" last />
        </Section>

        <Section label="Notificações">
          <ToggleItem icon={<BellIcon />}  label="Push"       active />
          <ToggleItem icon={<MailIcon />}  label="Email"      active />
          <ToggleItem icon={<SmsIcon />}   label="SMS"        active={false} />
          <ToggleItem icon={<WaIcon />}    label="WhatsApp"   active last />
        </Section>

        <Section label="Privacidade">
          <Item icon={<EyeIcon />}     label="Visibilidade do perfil" sub="público" />
          <Item icon={<UsersIcon />}   label="Quem pode me contatar" />
          <Item icon={<BlockIcon />}   label="Bloquear usuários" />
          <Item icon={<FileIcon />}    label="Dados e privacidade" last />
        </Section>

        <Section label="Suporte">
          <Item icon={<HelpIcon />}    label="Central de ajuda" />
          <Item icon={<ChatIcon />}    label="Falar com suporte" sub="abre chat" />
          <Item icon={<FlagIcon />}    label="Reportar problema" />
          <Item icon={<ScrollIcon />}  label="Termos de uso" />
          <Item icon={<LockIcon />}    label="Política de privacidade" last />
        </Section>

        <Section label="Sobre">
          <Item icon={<InfoIcon />}    label="Versão do app"  valueRight="MVP v1.0" noChevron />
          <Item icon={<StarIcon />}    label="Novidades" />
          <Item icon={<ThumbIcon />}   label="Avaliar na loja" last />
        </Section>

        <DangerZone />
        <Footer />
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
      <Link href="/meu-perfil" aria-label="Voltar" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#FFFFFF", textDecoration: "none" }}>
        <ArrowLeftIcon />
      </Link>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF" }}>Configurações</span>
      <div style={{ width: "36px" }} />
    </header>
  );
}

/* ─── Profile Card ────────────────────────────────────────── */
function ProfileCard() {
  return (
    <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: "22px", fontWeight: 500, color: "#FFFFFF" }}>G</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF", marginBottom: "2px" }}>Guilherme Bosak</p>
        <p style={{ fontSize: "13px", color: "#888888", marginBottom: "2px" }}>guibosak@email.com</p>
        <p style={{ fontSize: "12px", color: "#555555" }}>Taubaté, SP</p>
      </div>
      <Link
        href="/meu-perfil"
        style={{
          flexShrink: 0,
          height: "32px",
          padding: "0 14px",
          borderRadius: "999px",
          backgroundColor: "transparent",
          color: "#FFFFFF",
          border: "1px solid #333333",
          fontSize: "12px",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        Editar
      </Link>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────── */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, padding: "16px 16px 8px" }}>
        {label}
      </p>
      <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", overflow: "hidden", marginLeft: "16px", marginRight: "16px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Item ────────────────────────────────────────────────── */
interface ItemProps {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  href?: string;
  valueRight?: string;
  noChevron?: boolean;
  last?: boolean;
}

function Item({ icon, label, sub, href, valueRight, noChevron, last }: ItemProps) {
  const inner = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px 16px",
        borderBottom: last ? "none" : "1px solid #222222",
        cursor: href ? "pointer" : "default",
      }}
    >
      <span style={{ color: "#888888", display: "flex", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "15px", color: "#FFFFFF" }}>{label}</p>
        {sub && <p style={{ fontSize: "13px", color: "#555555", marginTop: "1px" }}>{sub}</p>}
      </div>
      {valueRight && <span style={{ fontSize: "13px", color: "#555555" }}>{valueRight}</span>}
      {!noChevron && !valueRight && <ChevronIcon />}
    </div>
  );

  if (href) return <Link href={href} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>;
  return inner;
}

/* ─── Toggle Item ─────────────────────────────────────────── */
function ToggleItem({ icon, label, active, last }: { icon: React.ReactNode; label: string; active: boolean; last?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px 16px",
        borderBottom: last ? "none" : "1px solid #222222",
      }}
    >
      <span style={{ color: "#888888", display: "flex", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: "15px", color: "#FFFFFF" }}>{label}</span>
      <Toggle active={active} />
    </div>
  );
}

/* ─── Danger Zone ─────────────────────────────────────────── */
function DangerZone() {
  return (
    <div style={{ marginTop: "8px" }}>
      <p style={{ fontSize: "11px", color: "#FF4444", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, padding: "16px 16px 8px" }}>
        Zona de Perigo
      </p>
      <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", overflow: "hidden", marginLeft: "16px", marginRight: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "15px 16px", borderBottom: "1px solid #222222", cursor: "pointer" }}>
          <span style={{ color: "#FF4444", display: "flex" }}><PauseIcon /></span>
          <span style={{ flex: 1, fontSize: "15px", color: "#FF4444" }}>Desativar conta</span>
          <ChevronIcon color="#FF4444" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "15px 16px", cursor: "pointer" }}>
          <span style={{ color: "#FF4444", display: "flex" }}><TrashIcon /></span>
          <span style={{ flex: 1, fontSize: "15px", color: "#FF4444" }}>Excluir conta permanentemente</span>
          <ChevronIcon color="#FF4444" />
        </div>
      </div>
    </div>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px 24px" }}>
      <button
        style={{
          height: "44px",
          padding: "0 32px",
          borderRadius: "999px",
          backgroundColor: "transparent",
          color: "#FF4444",
          border: "1px solid #FF4444",
          fontSize: "14px",
          fontWeight: 400,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Sair da conta
      </button>
      <p style={{ fontSize: "12px", color: "#333333" }}>Ísis AI · MVP v1.0 · 2026</p>
    </div>
  );
}

/* ─── Toggle ──────────────────────────────────────────────── */
function Toggle({ active }: { active: boolean }) {
  return (
    <div style={{ width: "44px", height: "24px", borderRadius: "999px", backgroundColor: active ? "#FFFFFF" : "#333333", position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "3px", left: active ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: active ? "#0E0E0E" : "#888888" }} />
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeIcon /> },
  { label: "Buscar",  href: "/busca",      icon: <SearchIcon /> },
  { label: "Criar",   href: "/criar-post", icon: <PlusIcon />, special: true },
  { label: "Pedidos", href: "/pedidos",    icon: <ClipboardIcon /> },
  { label: "Perfil",  href: "/meu-perfil", icon: <PersonNavIcon /> },
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

/* ─── Icons (20×20 outline strokes) ──────────────────────── */
const ic = (d: string, extra?: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d + (extra ?? "") }} />
);

function ArrowLeftIcon() { return ic('<path d="M19 12H5M12 5l-7 7 7 7"/>'); }
function UserIcon()      { return ic('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'); }
function MapPinIcon()    { return ic('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>'); }
function ShieldIcon()    { return ic('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'); }
function BadgeIcon()     { return ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="10" r="2"/><path d="M8 20v-1a4 4 0 0 1 8 0v1"/>'); }
function BriefcaseIcon() { return ic('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>'); }
function ImageIcon()     { return ic('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'); }
function MapIcon()       { return ic('<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>'); }
function CalendarIcon()  { return ic('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'); }
function LockIcon()      { return ic('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'); }
function CardIcon()      { return ic('<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>'); }
function BankIcon()      { return ic('<line x1="3" y1="22" x2="21" y2="22"/><polyline points="5 22 5 12 12 7 19 12 19 22"/><rect x="9" y="16" width="6" height="6"/>'); }
function ReceiptIcon()   { return ic('<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/>'); }
function BellIcon()      { return ic('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'); }
function MailIcon()      { return ic('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'); }
function SmsIcon()       { return ic('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.72 17z"/>'); }
function WaIcon()        { return ic('<circle cx="12" cy="12" r="10"/><path d="M8 12s1 2 4 2 4-2 4-2"/>'); }
function EyeIcon()       { return ic('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'); }
function UsersIcon()     { return ic('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'); }
function BlockIcon()     { return ic('<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'); }
function FileIcon()      { return ic('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'); }
function HelpIcon()      { return ic('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'); }
function ChatIcon()      { return ic('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'); }
function FlagIcon()      { return ic('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'); }
function ScrollIcon()    { return ic('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>'); }
function InfoIcon()      { return ic('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'); }
function StarIcon()      { return ic('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'); }
function ThumbIcon()     { return ic('<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>'); }
function PauseIcon()     { return ic('<circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/>'); }
function TrashIcon()     { return ic('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>'); }

function ChevronIcon({ color = "#555555" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function HomeIcon() { return ic('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'); }
function SearchIcon() { return ic('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'); }
function PlusIcon() { return ic('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'); }
function ClipboardIcon() { return ic('<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>'); }
function PersonNavIcon() { return ic('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'); }
