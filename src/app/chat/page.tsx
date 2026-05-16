import Link from "next/link";

export default function ChatPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      {/* Scrollable area between fixed header and fixed footer */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "64px", paddingBottom: "148px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
          <ContextBanner />
          <Messages />
          <ActionBanner />
        </div>
      </div>

      <ChatInput />
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
        height: "64px",
        backgroundColor: "#0E0E0E",
        borderBottom: "1px solid #222222",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <Link
        href="/perfil"
        aria-label="Voltar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          color: "#FFFFFF",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <ArrowLeftIcon />
      </Link>

      {/* Center: avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#2A2A2A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>M</span>
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF", lineHeight: 1.2 }}>Marina Costa</p>
          <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.2 }}>Pintora</p>
        </div>
      </div>

      <button
        aria-label="Informações"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          flexShrink: 0,
        }}
      >
        <InfoIcon />
      </button>
    </header>
  );
}

/* ─── Context Banner ──────────────────────────────────────── */
function ContextBanner() {
  return (
    <div
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "10px",
        padding: "12px 14px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: "11px", color: "#555555", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Serviço solicitado
        </p>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Pintura de apartamento 80m²
        </p>
      </div>
      <button
        style={{
          flexShrink: 0,
          height: "32px",
          padding: "0 14px",
          borderRadius: "999px",
          backgroundColor: "transparent",
          color: "#FFFFFF",
          border: "1px solid #333333",
          fontSize: "12px",
          fontWeight: 400,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Ver proposta
      </button>
    </div>
  );
}

/* ─── Messages ────────────────────────────────────────────── */
const MESSAGES = [
  { from: "marina", text: "Olá! Vi seu post sobre pintura. Posso fazer uma visita técnica ainda essa semana sem custo.", time: "14:02" },
  { from: "user",   text: "Oi Marina! Que ótimo. Tenho disponibilidade quinta ou sexta.", time: "14:05" },
  { from: "marina", text: "Quinta às 14h fica bom para mim. Confirma o endereço?", time: "14:07" },
  { from: "user",   text: "Rua das Flores, 123 - Taubaté. Apartamento 42.", time: "14:09" },
];

function Messages() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
      {MESSAGES.map((msg, i) => {
        const received = msg.from === "marina";
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: received ? "flex-start" : "flex-end",
            }}
          >
            <div
              style={{
                maxWidth: "78%",
                backgroundColor: received ? "#161616" : "#FFFFFF",
                border: received ? "1px solid #222222" : "none",
                borderRadius: received ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                padding: "10px 14px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: received ? "#FFFFFF" : "#0E0E0E",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {msg.text}
              </p>
            </div>
            <span style={{ fontSize: "11px", color: "#555555", marginTop: "4px" }}>{msg.time}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Action Banner ───────────────────────────────────────── */
function ActionBanner() {
  return (
    <div
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "10px",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: "#222222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <DocumentIcon />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", marginBottom: "2px" }}>
            Gerar contrato com IA
          </p>
          <p style={{ fontSize: "12px", color: "#555555" }}>Formalize o serviço acordado</p>
        </div>
      </div>
      <Link
        href="/contrato"
        style={{
          flexShrink: 0,
          height: "34px",
          padding: "0 16px",
          borderRadius: "999px",
          backgroundColor: "#FFFFFF",
          color: "#0E0E0E",
          border: "none",
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        Gerar agora
      </Link>
    </div>
  );
}

/* ─── Chat Input ──────────────────────────────────────────── */
function ChatInput() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0E0E0E",
        borderTop: "1px solid #222222",
        padding: "12px 16px",
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          style={{
            flex: 1,
            height: "48px",
            backgroundColor: "#161616",
            border: "1px solid #222222",
            borderRadius: "999px",
            padding: "0 18px",
            fontSize: "14px",
            color: "#FFFFFF",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
          }}
        />
        <button
          aria-label="Enviar"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SendIcon />
        </button>
      </div>
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

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E0E0E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
