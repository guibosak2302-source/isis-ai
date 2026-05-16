export default function FeedPage() {
  return (
    <div style={{ backgroundColor: "#0E0E0E", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <Navbar />
      <main style={{ paddingTop: "64px", paddingBottom: "32px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
          <SearchBar />
          <Filters />
          <Section />
        </div>
      </main>
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar() {
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
        padding: "0 20px",
      }}
    >
      <span
        style={{
          fontWeight: 500,
          fontSize: "20px",
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
        }}
      >
        Ísis AI
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          aria-label="Notificações"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center" }}
        >
          <BellIcon />
        </button>
        <Avatar letter="G" size={34} />
      </div>
    </header>
  );
}

/* ─── Search ──────────────────────────────────────────────── */
function SearchBar() {
  return (
    <div style={{ marginTop: "20px", marginBottom: "16px" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "16px",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Buscar serviços, prestadores..."
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: "#161616",
            border: "1px solid #222222",
            borderRadius: "999px",
            paddingLeft: "46px",
            paddingRight: "16px",
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            color: "#FFFFFF",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Filters ─────────────────────────────────────────────── */
const CATEGORIES = ["Todos", "Reformas", "Faxina", "Aulas", "Beleza", "Elétrica", "Pintura"];

function Filters() {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "4px",
        marginBottom: "28px",
        scrollbarWidth: "none",
      }}
    >
      {CATEGORIES.map((cat) => {
        const active = cat === "Todos";
        return (
          <button
            key={cat}
            style={{
              flexShrink: 0,
              height: "34px",
              padding: "0 16px",
              borderRadius: "999px",
              border: active ? "none" : "1px solid #222222",
              backgroundColor: active ? "#FFFFFF" : "transparent",
              color: active ? "#0E0E0E" : "#888888",
              fontSize: "13px",
              fontWeight: active ? 500 : 400,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────── */
function Section() {
  return (
    <section>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 500, color: "#FFFFFF", lineHeight: 1.3 }}>
          Perto de você
        </h2>
        <p style={{ fontSize: "13px", fontWeight: 400, color: "#555555", marginTop: "2px" }}>
          Taubaté, SP · 2km
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <PostCard
          avatarLetter="M"
          avatarBg="#2A2A2A"
          name="Marina Costa"
          verified
          meta="Pintora · Reformas · há 12 min"
          body="Disponível esta semana para pintura de apartamentos até 80m². Faço orçamento na hora, sem compromisso. Materiais inclusos ou por conta do cliente, você escolhe."
          tags={["Pintura", "Reformas", "Taubaté"]}
          price="A partir de R$ 350"
          stats={{ replies: 4, interested: 18 }}
          replyLabel="Responder"
          interestLabel="Tenho interesse"
        />

        <PostCard
          avatarLetter="R"
          avatarBg="#1E3A2A"
          name="Ricardo Alves"
          verified={false}
          meta="Eletricista · há 38 min"
          body="Instalações elétricas residenciais e comerciais. Atendo emergências no mesmo dia. CREA ativo, trabalho com nota."
          tags={["Elétrica", "Emergência", "Taubaté"]}
          price="A partir de R$ 120/h"
          stats={{ replies: 7, interested: 31 }}
          replyLabel="Responder"
          interestLabel="Tenho interesse"
        />
      </div>
    </section>
  );
}

/* ─── PostCard ────────────────────────────────────────────── */
interface PostCardProps {
  avatarLetter: string;
  avatarBg: string;
  name: string;
  verified: boolean;
  meta: string;
  body: string;
  tags: string[];
  price: string;
  stats: { replies: number; interested: number };
  replyLabel: string;
  interestLabel: string;
}

function PostCard({ avatarLetter, avatarBg, name, verified, meta, body, tags, price, stats, replyLabel, interestLabel }: PostCardProps) {
  return (
    <article
      style={{
        backgroundColor: "#161616",
        border: "1px solid #222222",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <Avatar letter={avatarLetter} size={42} bg={avatarBg} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF" }}>{name}</span>
            {verified && <VerifiedBadge />}
          </div>
          <p style={{ fontSize: "12px", color: "#555555", marginTop: "1px" }}>{meta}</p>
        </div>
        <button
          aria-label="Mais opções"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#555555" }}
        >
          <DotsIcon />
        </button>
      </div>

      {/* Body */}
      <p style={{ fontSize: "14px", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.65, marginBottom: "14px" }}>
        {body}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "12px",
              color: "#888888",
              backgroundColor: "#1E1E1E",
              border: "1px solid #2A2A2A",
              borderRadius: "999px",
              padding: "3px 10px",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Price */}
      <p style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF", marginBottom: "16px" }}>
        {price}
      </p>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#222222", marginBottom: "14px" }} />

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          <StatButton icon={<ReplyIcon />} count={stats.replies} label={replyLabel} />
          <StatButton icon={<StarIcon />} count={stats.interested} label={`${stats.interested} interesse`} />
        </div>
        <button
          style={{
            height: "36px",
            padding: "0 18px",
            borderRadius: "999px",
            backgroundColor: "#FFFFFF",
            color: "#0E0E0E",
            border: "none",
            fontSize: "13px",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          {interestLabel}
        </button>
      </div>
    </article>
  );
}

/* ─── Stat button ─────────────────────────────────────────── */
function StatButton({ icon, count, label }: { icon: React.ReactNode; count: number; label: string }) {
  return (
    <button
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#555555",
        fontSize: "13px",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        padding: 0,
      }}
    >
      {icon}
      <span>{count}</span>
    </button>
  );
}

/* ─── Avatar ──────────────────────────────────────────────── */
function Avatar({ letter, size, bg = "#2A2A2A" }: { letter: string; size: number; bg?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: size * 0.4, fontWeight: 500, color: "#FFFFFF" }}>{letter}</span>
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────────────── */
function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#3B82F6">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#555555">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
