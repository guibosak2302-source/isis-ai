import Link from "next/link";

export default function CadastroPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingBottom: "40px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 20px", paddingTop: "72px" }}>
        <TypeSelector />
        <Form />
        <LocationField />
        <ProfilePhoto />
        <TermsRow />
        <SubmitButton />
        <Footer />
      </div>
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
        href="/"
        aria-label="Voltar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          color: "#FFFFFF",
          textDecoration: "none",
        }}
      >
        <ArrowLeftIcon />
      </Link>

      <span style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF" }}>Criar conta</span>

      {/* Spacer to keep title centered */}
      <div style={{ width: "36px" }} />
    </header>
  );
}

/* ─── Type Selector ───────────────────────────────────────── */
function TypeSelector() {
  return (
    <div style={{ marginTop: "24px", marginBottom: "28px" }}>
      <p style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF", marginBottom: "14px" }}>
        Você é:
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        {/* Pessoa física — active */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#161616",
            border: "1px solid #FFFFFF",
            borderRadius: "12px",
            padding: "16px",
            cursor: "pointer",
          }}
        >
          <PersonIcon />
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", marginTop: "10px", marginBottom: "4px" }}>
            Pessoa física
          </p>
          <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>
            Quero contratar ou oferecer serviços
          </p>
        </div>

        {/* Empresa — inactive */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#161616",
            border: "1px solid #222222",
            borderRadius: "12px",
            padding: "16px",
            cursor: "pointer",
          }}
        >
          <BuildingIcon />
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", marginTop: "10px", marginBottom: "4px" }}>
            Empresa
          </p>
          <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>
            Represento um negócio
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Form ────────────────────────────────────────────────── */
const FIELDS = [
  { label: "Nome completo",       placeholder: "Seu nome completo",    type: "text",     autoComplete: "name" },
  { label: "CPF",                 placeholder: "000.000.000-00",        type: "text",     autoComplete: "off" },
  { label: "Email",               placeholder: "seu@email.com",         type: "email",    autoComplete: "email" },
  { label: "Telefone (WhatsApp)", placeholder: "(11) 90000-0000",       type: "tel",      autoComplete: "tel" },
  { label: "Senha",               placeholder: "Mínimo 8 caracteres",   type: "password", autoComplete: "new-password" },
  { label: "Confirmar senha",     placeholder: "Repita a senha",        type: "password", autoComplete: "new-password" },
];

function Form() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
      {FIELDS.map(({ label, placeholder, type, autoComplete }) => (
        <div key={label}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              color: "#888888",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </label>
          <input
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            style={{
              width: "100%",
              height: "52px",
              backgroundColor: "#161616",
              border: "1px solid #222222",
              borderRadius: "10px",
              padding: "0 16px",
              fontSize: "15px",
              color: "#FFFFFF",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Location Field ──────────────────────────────────────── */
function LocationField() {
  return (
    <div style={{ marginBottom: "28px" }}>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          color: "#888888",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Onde você está?
      </label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", left: "14px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <PinIcon />
        </span>
        <input
          type="text"
          placeholder="Cidade, bairro ou região"
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#161616",
            border: "1px solid #222222",
            borderRadius: "10px",
            paddingLeft: "42px",
            paddingRight: "16px",
            fontSize: "15px",
            color: "#FFFFFF",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Profile Photo ───────────────────────────────────────── */
function ProfilePhoto() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#2A2A2A",
          border: "1px dashed #333333",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginBottom: "8px",
        }}
      >
        <CameraIcon />
      </div>
      <span style={{ fontSize: "12px", color: "#555555" }}>Adicionar foto</span>
    </div>
  );
}

/* ─── Terms Row ───────────────────────────────────────────── */
function TermsRow() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "24px" }}>
      <input
        type="checkbox"
        id="terms"
        style={{
          width: "18px",
          height: "18px",
          marginTop: "1px",
          accentColor: "#FFFFFF",
          flexShrink: 0,
          cursor: "pointer",
        }}
      />
      <label htmlFor="terms" style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6, cursor: "pointer" }}>
        Concordo com os{" "}
        <span style={{ color: "#FFFFFF", textDecoration: "underline", cursor: "pointer" }}>
          Termos de Uso
        </span>{" "}
        e{" "}
        <span style={{ color: "#FFFFFF", textDecoration: "underline", cursor: "pointer" }}>
          Política de Privacidade
        </span>
      </label>
    </div>
  );
}

/* ─── Submit Button ───────────────────────────────────────── */
function SubmitButton() {
  return (
    <button
      style={{
        width: "100%",
        height: "52px",
        backgroundColor: "#FFFFFF",
        color: "#0E0E0E",
        border: "none",
        borderRadius: "999px",
        fontSize: "15px",
        fontWeight: 500,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        cursor: "pointer",
        marginBottom: "24px",
      }}
    >
      Criar minha conta
    </button>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <p style={{ textAlign: "center", fontSize: "14px", color: "#888888" }}>
      Já tem conta?{" "}
      <Link
        href="/"
        style={{ color: "#FFFFFF", textDecoration: "none", fontWeight: 500 }}
      >
        Entrar
      </Link>
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

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
      <rect x="13" y="13" width="3" height="3" />
      <rect x="13" y="17" width="3" height="2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
