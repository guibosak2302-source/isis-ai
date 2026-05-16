import Link from "next/link";

export default function IsisPayPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "56px",
        paddingBottom: "100px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px 0" }}>
        <MainValueCard />
        <Gap />
        <PaymentMethod />
        <Gap />
        <StagesSection />
        <Gap />
        <TransactionHistory />
        <Gap />
        <SecurityCard />
      </div>
      <FooterAction />
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
        href="/assinatura"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#FFFFFF", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </Link>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF" }}>Ísis Pay</span>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px" }}>
        <LockIconSm color="#888888" />
      </div>
    </header>
  );
}

/* ─── Main Value Card ─────────────────────────────────────── */
function MainValueCard() {
  return (
    <div
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "16px",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "10px",
      }}
    >
      <LockIconLg />
      <p style={{ fontSize: "13px", color: "#888888" }}>Valor protegido</p>
      <p style={{ fontSize: "36px", fontWeight: 500, color: "#FFFFFF", lineHeight: 1.1 }}>
        R$ 3.200,00
      </p>
      <span
        style={{
          backgroundColor: "#1A3A1A",
          color: "#4CAF50",
          fontSize: "12px",
          fontWeight: 500,
          padding: "5px 14px",
          borderRadius: "999px",
        }}
      >
        Ísis Pay ativo
      </span>
      <p style={{ fontSize: "13px", color: "#555555", lineHeight: 1.65, maxWidth: "320px" }}>
        O valor está guardado com segurança e será liberado conforme você aprovar cada etapa.
      </p>
    </div>
  );
}

/* ─── Payment Method ──────────────────────────────────────── */
const PAYMENT_OPTIONS = [
  {
    icon: <PixIcon />,
    label: "Pix",
    sub: "Aprovação imediata",
    active: true,
  },
  {
    icon: <CardIcon />,
    label: "Cartão de crédito",
    sub: "Em até 12x sem juros",
    active: false,
  },
  {
    icon: <BoletoIcon />,
    label: "Boleto bancário",
    sub: "Vence em 3 dias úteis",
    active: false,
  },
];

function PaymentMethod() {
  return (
    <div>
      <SectionLabel text="Como deseja pagar?" />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {PAYMENT_OPTIONS.map(({ icon, label, sub, active }) => (
          <div
            key={label}
            style={{
              backgroundColor: "#161616",
              border: `1px solid ${active ? "#FFFFFF" : "#222222"}`,
              borderRadius: "10px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
          >
            <span style={{ color: active ? "#FFFFFF" : "#555555", display: "flex", flexShrink: 0 }}>{icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "14px", color: active ? "#FFFFFF" : "#888888" }}>{label}</p>
              <p style={{ fontSize: "12px", color: "#555555" }}>{sub}</p>
            </div>
            {active && (
              <div style={{ flexShrink: 0 }}>
                <CheckCircleIcon />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Stages Section ──────────────────────────────────────── */
const STAGES = [
  {
    n: 1,
    label: "Limpeza e preparo",
    value: "R$ 800,00",
    badgeBg: "#1A3A1A",
    badgeColor: "#4CAF50",
    badgeLabel: "Liberado",
    sub: "Aprovado em 15 mai 2026",
    cta: null,
  },
  {
    n: 2,
    label: "Massa corrida",
    value: "R$ 700,00",
    badgeBg: "#3A3A1A",
    badgeColor: "#FFB800",
    badgeLabel: "Em andamento",
    sub: null,
    cta: "Aprovar e liberar",
  },
  {
    n: 3,
    label: "Aplicação de tinta",
    value: "R$ 1.200,00",
    badgeBg: "#333333",
    badgeColor: "#888888",
    badgeLabel: "Aguardando",
    sub: "Aguardando conclusão da etapa 2",
    cta: null,
  },
  {
    n: 4,
    label: "Acabamento final",
    value: "R$ 500,00",
    badgeBg: "#333333",
    badgeColor: "#888888",
    badgeLabel: "Aguardando",
    sub: "Aguardando conclusão da etapa 3",
    cta: null,
  },
];

function StagesSection() {
  return (
    <div>
      <SectionLabel text="Liberação por etapas" />
      <div style={{ position: "relative" }}>
        {/* Vertical connector line */}
        <div
          style={{
            position: "absolute",
            left: "15px",
            top: "32px",
            bottom: "32px",
            width: "2px",
            backgroundColor: "#222222",
            zIndex: 0,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {STAGES.map(({ n, label, value, badgeBg, badgeColor, badgeLabel, sub, cta }) => (
            <div
              key={n}
              style={{
                backgroundColor: "#161616",
                border: "1px solid #222222",
                borderRadius: "10px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Step circle */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: n === 1 ? "#1A3A1A" : "#2A2A2A",
                  border: n === 1 ? "1px solid #4CAF50" : "1px solid #333333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 500, color: n === 1 ? "#4CAF50" : "#FFFFFF" }}>{n}</span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "4px" }}>
                  <p style={{ fontSize: "14px", color: "#FFFFFF" }}>{label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", flexShrink: 0 }}>{value}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <span
                    style={{
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      fontSize: "11px",
                      fontWeight: 500,
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    {badgeLabel}
                  </span>
                  {cta && (
                    <button
                      style={{
                        height: "30px",
                        padding: "0 14px",
                        borderRadius: "999px",
                        backgroundColor: "#FFFFFF",
                        color: "#0E0E0E",
                        border: "none",
                        fontSize: "12px",
                        fontWeight: 500,
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {cta}
                    </button>
                  )}
                </div>
                {sub && (
                  <p style={{ fontSize: "12px", color: "#555555", marginTop: "4px" }}>{sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Transaction History ─────────────────────────────────── */
const TRANSACTIONS = [
  { label: "Etapa 1 liberada → Marina Costa", value: "R$ 800,00", date: "17 mai 2026" },
  { label: "Depósito inicial",                value: "R$ 3.200,00", date: "15 mai 2026" },
];

function TransactionHistory() {
  return (
    <div>
      <SectionLabel text="Transações" />
      <div
        style={{
          backgroundColor: "#161616",
          border: "1px solid #222222",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {TRANSACTIONS.map(({ label, value, date }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid #222222" : "none",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "#222222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TxArrowIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "13px", color: "#888888", marginBottom: "2px" }}>{label}</p>
              <p style={{ fontSize: "12px", color: "#555555" }}>{date}</p>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", flexShrink: 0 }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Security Card ───────────────────────────────────────── */
const SECURITY_ITEMS = [
  "Dinheiro protegido até aprovação final",
  "Reembolso garantido em caso de cancelamento",
  "Transações criptografadas",
];

function SecurityCard() {
  return (
    <div
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {SECURITY_ITEMS.map((item) => (
        <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <GreenCheck />
          <span style={{ fontSize: "13px", color: "#888888" }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Footer Action ───────────────────────────────────────── */
function FooterAction() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0E0E0E",
        borderTop: "1px solid #222222",
        padding: "16px 16px 20px",
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
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
            marginBottom: "8px",
          }}
        >
          Pagar R$ 3.200,00 com Pix
        </button>
        <p style={{ fontSize: "12px", color: "#555555", textAlign: "center" }}>
          Pagamento seguro · Ísis Pay
        </p>
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

/* ─── Icons ───────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function LockIconSm({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function LockIconLg() {
  return (
    <div
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "#1A3A1A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>
  );
}

function PixIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5l3.5-3.5 4 4 4-4 3.5 3.5" />
      <path d="M4.5 11.5l3.5 3.5 4-4 4 4 3.5-3.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function BoletoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="7" y1="8" x2="7" y2="16" />
      <line x1="10" y1="8" x2="10" y2="16" />
      <line x1="13" y1="8" x2="13" y2="16" />
      <line x1="16" y1="8" x2="16" y2="16" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
      <path d="M8 12l3 3 5-5" stroke="#0E0E0E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TxArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function GreenCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1A3A1A" />
      <path d="M8 12l3 3 5-5" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
