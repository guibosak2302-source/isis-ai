import Link from "next/link";

export default function AssinaturaPage() {
  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "56px",
        paddingBottom: "88px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px 0" }}>
        <ContractSummary />
        <Gap />
        <SignaturesStatus />
        <Gap />
        <SignatureArea />
        <Gap />
        <AuthMethod />
        <Gap />
        <LegalTerms />
      </div>
      <FooterActions />
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
        href="/contrato"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </Link>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Assinar contrato</span>
      <div style={{ width: "36px" }} />
    </header>
  );
}

/* ─── Contract Summary ────────────────────────────────────── */
function ContractSummary() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          backgroundColor: "#2E2E2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: "2px",
        }}
      >
        <DocumentIcon />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px" }}>
          Pintura completa de apartamento 80m²
        </p>
        <p style={{ fontSize: "13px", color: "#888888", marginBottom: "4px" }}>
          Marina Costa → Guilherme Bosak
        </p>
        <p style={{ fontSize: "12px", color: "#555555" }}>R$ 3.200 · 4 etapas · 15 dias</p>
      </div>
    </div>
  );
}

/* ─── Signatures Status ───────────────────────────────────── */
function SignaturesStatus() {
  return (
    <div>
      <SectionLabel text="Assinaturas" />
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Marina — signed */}
        <div style={{ padding: "16px", borderBottom: "1px solid #2E2E2E" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <SmallAvatar letter="M" bg="#2A2A2A" />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>Marina Costa</p>
                <p style={{ fontSize: "12px", color: "#888888" }}>Pintora</p>
              </div>
            </div>
            <Badge bg="#1A3A1A" color="#4CAF50" label="Assinado" />
          </div>
          <p style={{ fontSize: "12px", color: "#555555" }}>Assinado em 14 mai 2026 às 09:32</p>
        </div>

        {/* Guilherme — pending */}
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <SmallAvatar letter="G" bg="#1E2A3A" />
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>Guilherme Bosak</p>
                <p style={{ fontSize: "12px", color: "#888888" }}>Contratante</p>
              </div>
            </div>
            <Badge bg="#3A3A1A" color="#FFB800" label="Aguardando" />
          </div>
          <p style={{ fontSize: "12px", color: "#555555" }}>Sua assinatura está pendente</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Signature Area ──────────────────────────────────────── */
function SignatureArea() {
  return (
    <div>
      <p style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0", marginBottom: "12px" }}>
        Sua assinatura
      </p>
      <div
        style={{
          position: "relative",
          backgroundColor: "#1A1A1A",
          border: "1px dashed #2E2E2E",
          borderRadius: "12px",
          height: "180px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            fontSize: "12px",
            color: "#555555",
            cursor: "pointer",
            fontFamily: "var(--font-inter), Inter, sans-serif",
          }}
        >
          Limpar
        </button>
        <PenIcon />
        <p style={{ fontSize: "14px", color: "#3A3A3A" }}>Assine aqui com o dedo</p>
      </div>
    </div>
  );
}

/* ─── Auth Method ─────────────────────────────────────────── */
const AUTH_OPTIONS = [
  {
    icon: <PhoneIcon />,
    label: "SMS para (11) 9****-4521",
    active: true,
  },
  {
    icon: <EmailIcon />,
    label: "Email cadastrado",
    active: false,
  },
  {
    icon: <FingerprintIcon />,
    label: "Biometria",
    active: false,
  },
];

function AuthMethod() {
  return (
    <div>
      <SectionLabel text="Confirmar identidade" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {AUTH_OPTIONS.map(({ icon, label, active }) => (
          <div
            key={label}
            style={{
              backgroundColor: "#1A1A1A",
              border: `1px solid ${active ? "#FFD11A" : "#2E2E2E"}`,
              borderRadius: "10px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <span style={{ color: active ? "#F0F0F0" : "#555555", display: "flex", flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: "14px", color: active ? "#F0F0F0" : "#888888" }}>{label}</span>
            {active && (
              <div style={{ marginLeft: "auto" }}>
                <CheckCircleIcon />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Legal Terms ─────────────────────────────────────────── */
function LegalTerms() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "10px",
        padding: "14px",
      }}
    >
      <p style={{ fontSize: "12px", color: "#555555", lineHeight: 1.7, marginBottom: "14px" }}>
        Ao assinar, você confirma que leu e concorda com todos os termos do contrato. Esta assinatura tem validade jurídica conforme a MP 2.200/2001.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="checkbox"
          id="agree"
          style={{ width: "16px", height: "16px", accentColor: "#FFD11A", cursor: "pointer", flexShrink: 0 }}
        />
        <label htmlFor="agree" style={{ fontSize: "13px", color: "#888888", cursor: "pointer" }}>
          Li e concordo com os termos
        </label>
      </div>
    </div>
  );
}

/* ─── Footer Actions ──────────────────────────────────────── */
function FooterActions() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0F0F0F",
        borderTop: "1px solid #2E2E2E",
        padding: "16px",
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "10px" }}>
        <button
          style={{
            flex: 1,
            height: "48px",
            backgroundColor: "transparent",
            color: "#F0F0F0",
            border: "1px solid #3A3A3A",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
        <Link
          href="/isis-pay"
          style={{
            flex: 1,
            height: "48px",
            backgroundColor: "#FFD11A",
            color: "#0F0F0F",
            border: "none",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Confirmar assinatura
        </Link>
      </div>
    </div>
  );
}

/* ─── Shared ──────────────────────────────────────────────── */
function Gap() {
  return <div style={{ height: "20px" }} />;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>
      {text}
    </p>
  );
}

function Badge({ bg, color, label }: { bg: string; color: string; label: string }) {
  return (
    <span style={{ backgroundColor: bg, color, fontSize: "12px", fontWeight: 500, padding: "4px 10px", borderRadius: "999px", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

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
      <span style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>{letter}</span>
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

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function FingerprintIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
      <path d="M5 19.5C5.5 18 6 15 6 12c0-1.7.7-3.2 1.8-4.3" />
      <path d="M17.5 20.5c-.5-1.5-.5-3-.5-4.5 0-1.4-.5-2.7-1.3-3.7" />
      <path d="M12 12c0 3-1 5.5-3 7.5" />
      <path d="M12 7a5 5 0 0 1 5 5c0 1-.2 2-.5 2.8" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
      <path d="M8 12l3 3 5-5" stroke="#0F0F0F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
