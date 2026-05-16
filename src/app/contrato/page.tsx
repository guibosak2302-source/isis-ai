import Link from "next/link";

export default function ContratoPage() {
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
        <AIBanner />
        <SectionGap />
        <PartySection
          label="Contratante"
          content={<ContratanteCard />}
        />
        <SectionGap />
        <PartySection
          label="Prestador de Serviço"
          content={<PrestadorCard />}
        />
        <SectionGap />
        <ServiceSection />
        <SectionGap />
        <StagesSection />
        <SectionGap />
        <IsisPay />
        <SectionGap />
        <PrazoCard />
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
        href="/chat"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </Link>

      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Contrato Bico AI</span>

      <button
        aria-label="Baixar contrato"
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px" }}
      >
        <DownloadIcon />
      </button>
    </header>
  );
}

/* ─── AI Banner ───────────────────────────────────────────── */
function AIBanner() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", minWidth: 0 }}>
        <div style={{ marginTop: "2px", flexShrink: 0 }}>
          <StarIcon />
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px" }}>
            Gerado pela Bico AI
          </p>
          <p style={{ fontSize: "13px", color: "#555555" }}>
            Contrato baseado no serviço acordado no chat
          </p>
        </div>
      </div>
      <span
        style={{
          flexShrink: 0,
          backgroundColor: "#3A3A1A",
          color: "#FFB800",
          fontSize: "12px",
          fontWeight: 500,
          padding: "4px 10px",
          borderRadius: "999px",
          whiteSpace: "nowrap",
        }}
      >
        Rascunho
      </span>
    </div>
  );
}

/* ─── Section helpers ─────────────────────────────────────── */
function SectionGap() {
  return <div style={{ height: "20px" }} />;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p
      style={{
        fontSize: "11px",
        color: "#888888",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        marginBottom: "8px",
        fontWeight: 500,
      }}
    >
      {text}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "10px",
        padding: "16px",
      }}
    >
      {children}
    </div>
  );
}

function PartySection({ label, content }: { label: string; content: React.ReactNode }) {
  return (
    <div>
      <SectionLabel text={label} />
      {content}
    </div>
  );
}

/* ─── Contratante card ────────────────────────────────────── */
function ContratanteCard() {
  return (
    <Card>
      <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px" }}>Guilherme Bosak</p>
      <p style={{ fontSize: "13px", color: "#888888", marginBottom: "4px" }}>CPF: ***.456.789-**</p>
      <p style={{ fontSize: "13px", color: "#555555" }}>Taubaté, SP</p>
    </Card>
  );
}

/* ─── Prestador card ──────────────────────────────────────── */
function PrestadorCard() {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
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
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>M</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>Marina Costa</span>
          <VerifiedBadge />
        </div>
      </div>
      <p style={{ fontSize: "13px", color: "#888888", marginBottom: "4px" }}>Pintora · Reformas</p>
      <p style={{ fontSize: "13px", color: "#555555" }}>4.9 ★ · 128 serviços</p>
    </Card>
  );
}

/* ─── Service section ─────────────────────────────────────── */
function ServiceSection() {
  return (
    <div>
      <SectionLabel text="Serviço contratado" />
      <Card>
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "8px" }}>
          Pintura completa de apartamento 80m²
        </p>
        <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.65, marginBottom: "10px" }}>
          Inclui: limpeza e preparo das paredes, aplicação de massa corrida, 2 demãos de tinta premium, acabamento e limpeza pós-obra. Materiais inclusos.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <PinIcon />
          <p style={{ fontSize: "12px", color: "#555555" }}>Rua das Flores, 123 - Ap 42, Taubaté SP</p>
        </div>
      </Card>
    </div>
  );
}

/* ─── Stages section ──────────────────────────────────────── */
const STAGES = [
  { n: 1, label: "Limpeza e preparo",   value: "R$ 800",   condition: "Pagamento ao iniciar" },
  { n: 2, label: "Massa corrida",        value: "R$ 700",   condition: "Pagamento ao concluir" },
  { n: 3, label: "Aplicação de tinta",   value: "R$ 1.200", condition: "Pagamento ao concluir" },
  { n: 4, label: "Acabamento final",     value: "R$ 500",   condition: "Pagamento ao concluir" },
];

function StagesSection() {
  return (
    <div>
      <SectionLabel text="Etapas do serviço" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {STAGES.map(({ n, label, value, condition }) => (
          <div
            key={n}
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2E2E2E",
              borderRadius: "10px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#2A2A2A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0" }}>{n}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "14px", color: "#F0F0F0", marginBottom: "2px" }}>{label}</p>
              <p style={{ fontSize: "12px", color: "#555555" }}>{condition}</p>
            </div>
            <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", flexShrink: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "10px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#888888" }}>Valor total</span>
        <span style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0" }}>R$ 3.200</span>
      </div>
    </div>
  );
}

/* ─── Bico Pay ────────────────────────────────────────────── */
function IsisPay() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <LockIcon />
        <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>Protegido pelo Bico Pay</p>
      </div>
      <p style={{ fontSize: "13px", color: "#555555", lineHeight: 1.65, marginBottom: "12px" }}>
        O valor fica guardado na plataforma e é liberado conforme cada etapa for aprovada por você.
      </p>
      <span
        style={{
          display: "inline-block",
          backgroundColor: "#1A3A1A",
          color: "#4CAF50",
          fontSize: "12px",
          fontWeight: 500,
          padding: "4px 12px",
          borderRadius: "999px",
        }}
      >
        Pagamento seguro
      </span>
    </div>
  );
}

/* ─── Prazo card ──────────────────────────────────────────── */
function PrazoCard() {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <p style={{ fontSize: "14px", color: "#F0F0F0" }}>Data de início</p>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>15 mai 2026</p>
      </div>
      <div style={{ height: "1px", backgroundColor: "#2E2E2E", marginBottom: "8px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <p style={{ fontSize: "14px", color: "#F0F0F0" }}>Prazo de conclusão</p>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>30 mai 2026</p>
      </div>
      <div style={{ height: "1px", backgroundColor: "#2E2E2E", marginBottom: "8px" }} />
      <p style={{ fontSize: "13px", color: "#555555", textAlign: "right" }}>15 dias corridos</p>
    </Card>
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
          Solicitar ajuste
        </button>
        <Link
          href="/assinatura"
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
          Assinar contrato
        </Link>
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

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
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

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
