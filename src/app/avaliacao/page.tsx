import Link from "next/link";

export default function AvaliacaoPage() {
  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "56px",
        paddingBottom: "96px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px 0" }}>
        <ServiceCard />
        <Gap h={24} />
        <OverallRating />
        <Gap h={24} />
        <CriteriaRatings />
        <Gap h={24} />
        <CommentField />
        <Gap h={24} />
        <PhotoSection />
        <Gap h={24} />
        <RecommendCard />
        <Gap h={24} />
        <TipCard />
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
      <Link href="/pedidos" aria-label="Voltar" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
        <ArrowLeftIcon />
      </Link>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Avaliar serviço</span>
      <div style={{ width: "36px" }} />
    </header>
  );
}

/* ─── Service Card ────────────────────────────────────────── */
function ServiceCard() {
  return (
    <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px" }}>
      <span style={{ display: "inline-block", backgroundColor: "#1A3A1A", color: "#4CAF50", fontSize: "12px", fontWeight: 500, padding: "4px 10px", borderRadius: "999px", marginBottom: "12px" }}>
        Serviço concluído
      </span>
      <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "12px" }}>
        Pintura completa de apartamento 80m²
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <SmallAvatar letter="M" bg="#2A2A2A" />
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>Marina Costa</span>
        <VerifiedBadge />
      </div>
      <p style={{ fontSize: "12px", color: "#555555" }}>Concluído em 30 mai 2026 · R$ 3.200</p>
    </div>
  );
}

/* ─── Overall Rating ──────────────────────────────────────── */
function OverallRating() {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0", marginBottom: "6px" }}>
        Como foi o serviço?
      </p>
      <p style={{ fontSize: "14px", color: "#555555", marginBottom: "20px" }}>
        Sua avaliação ajuda outros usuários
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} style={{ fontSize: "52px", color: s <= 5 ? "#FFD11A" : "#3A3A3A", cursor: "pointer", lineHeight: 1 }}>
            ★
          </span>
        ))}
      </div>
      <p style={{ fontSize: "16px", color: "#F0F0F0" }}>Excelente</p>
    </div>
  );
}

/* ─── Criteria Ratings ────────────────────────────────────── */
const CRITERIA = [
  { label: "Qualidade do serviço", stars: 5 },
  { label: "Pontualidade",          stars: 4 },
  { label: "Comunicação",           stars: 5 },
  { label: "Custo-benefício",       stars: 4 },
];

function CriteriaRatings() {
  return (
    <div>
      <SectionLabel text="Avalie cada critério" />
      <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", overflow: "hidden" }}>
        {CRITERIA.map(({ label, stars }, i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: i < CRITERIA.length - 1 ? "1px solid #2E2E2E" : "none",
            }}
          >
            <span style={{ fontSize: "14px", color: "#888888" }}>{label}</span>
            <div style={{ display: "flex", gap: "3px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} style={{ fontSize: "18px", color: s <= stars ? "#FFD11A" : "#3A3A3A", cursor: "pointer" }}>★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Comment Field ───────────────────────────────────────── */
function CommentField() {
  return (
    <div>
      <SectionLabel text="Conte sua experiência" />
      <div style={{ position: "relative" }}>
        <textarea
          placeholder="Descreva como foi trabalhar com Marina Costa. Seu comentário ajuda outros usuários a escolherem bem."
          style={{
            width: "100%",
            minHeight: "120px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            color: "#F0F0F0",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
            resize: "none",
            boxSizing: "border-box",
            paddingBottom: "32px",
          }}
        />
        <span style={{ position: "absolute", bottom: "12px", right: "14px", fontSize: "12px", color: "#555555" }}>
          0/500
        </span>
      </div>
    </div>
  );
}

/* ─── Photo Section ───────────────────────────────────────── */
function PhotoSection() {
  return (
    <div>
      <SectionLabel text="Adicionar fotos" />
      <p style={{ fontSize: "13px", color: "#555555", marginBottom: "10px" }}>Mostre o resultado do serviço</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        <button
          aria-label="Adicionar foto"
          style={{ height: "80px", backgroundColor: "#1A1A1A", border: "1px dashed #2E2E2E", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <PlusIcon />
        </button>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ height: "80px", backgroundColor: "#1A1A1A", border: "1px dashed #2E2E2E", borderRadius: "10px" }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Recommend Card ──────────────────────────────────────── */
function RecommendCard() {
  return (
    <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>Recomendo este prestador</span>
        <Toggle active />
      </div>
      <p style={{ fontSize: "13px", color: "#555555" }}>Sua recomendação aparece no perfil de Marina</p>
    </div>
  );
}

/* ─── Tip Card ────────────────────────────────────────────── */
const TIP_OPTIONS = ["R$ 10", "R$ 20", "R$ 50", "Outro valor"];

function TipCard() {
  return (
    <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
        <HeartIcon />
        <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>Deixar uma gorjeta?</span>
      </div>
      <p style={{ fontSize: "13px", color: "#555555", marginBottom: "14px" }}>Reconheça um trabalho excepcional</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {TIP_OPTIONS.map((opt) => {
          const active = opt === "R$ 20";
          return (
            <button
              key={opt}
              style={{
                height: "36px",
                padding: "0 16px",
                borderRadius: "999px",
                border: active ? "none" : "1px solid #2E2E2E",
                backgroundColor: active ? "#FFD11A" : "transparent",
                color: active ? "#0F0F0F" : "#888888",
                fontSize: "13px",
                fontWeight: active ? 500 : 400,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Footer Actions ──────────────────────────────────────── */
function FooterActions() {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#0F0F0F", borderTop: "1px solid #2E2E2E", padding: "16px", zIndex: 50 }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "10px" }}>
        <button
          style={{ flex: 1, height: "48px", backgroundColor: "transparent", color: "#F0F0F0", border: "1px solid #3A3A3A", borderRadius: "999px", fontSize: "14px", fontWeight: 400, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
        >
          Agora não
        </button>
        <Link
          href="/pedidos"
          style={{ flex: 1, height: "48px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
        >
          Enviar avaliação
        </Link>
      </div>
    </div>
  );
}

/* ─── Shared ──────────────────────────────────────────────── */
function Gap({ h }: { h: number }) {
  return <div style={{ height: `${h}px` }} />;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>
      {text}
    </p>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <div style={{ width: "44px", height: "24px", borderRadius: "999px", backgroundColor: active ? "#FFD11A" : "#3A3A3A", position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "3px", left: active ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: active ? "#0F0F0F" : "#888888" }} />
    </div>
  );
}

function SmallAvatar({ letter, bg }: { letter: string; bg: string }) {
  return (
    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0" }}>{letter}</span>
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

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" />
      <path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
