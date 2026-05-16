import Link from "next/link";

export default function BuscaPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "64px",
        paddingBottom: "80px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 0" }}>
        <QuickFilters />
        <AdvancedFilters />
        <ResultsLabel />
        <Results />
        <Gap h={24} />
        <RecentSearches />
        <Gap h={20} />
        <PopularSuggestions />
      </div>
      <BottomNav active="Buscar" />
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
        gap: "12px",
        padding: "0 16px",
      }}
    >
      <Link
        href="/feed"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#FFFFFF", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </Link>

      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", left: "14px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <SearchIcon color="#555555" />
        </span>
        <input
          type="text"
          placeholder="Buscar serviços, prestadores..."
          autoFocus
          style={{
            width: "100%",
            height: "42px",
            backgroundColor: "#161616",
            border: "1px solid #222222",
            borderRadius: "999px",
            paddingLeft: "42px",
            paddingRight: "42px",
            fontSize: "14px",
            color: "#FFFFFF",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
          }}
        />
        <button
          aria-label="Limpar"
          style={{
            position: "absolute",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "4px",
            color: "#555555",
          }}
        >
          <XIcon />
        </button>
      </div>
    </header>
  );
}

/* ─── Quick Filters ───────────────────────────────────────── */
const QUICK = ["Perto de mim", "Melhor avaliados", "Menor preço", "Verificados", "Disponível agora"];

function QuickFilters() {
  return (
    <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", marginBottom: "14px", paddingBottom: "2px" }}>
      {QUICK.map((f, i) => {
        const active = i === 0;
        return (
          <button
            key={f}
            style={{
              flexShrink: 0,
              height: "34px",
              padding: "0 14px",
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
            {f}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Advanced Filters ────────────────────────────────────── */
const CATEGORIES = ["Reformas", "Pintura", "Faxina", "Elétrica", "Aulas", "Beleza", "Jardinagem", "TI", "Outros"];

function AdvancedFilters() {
  return (
    <div style={{ marginBottom: "20px" }}>
      {/* Toggle button */}
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          height: "34px",
          padding: "0 14px",
          borderRadius: "999px",
          border: "1px solid #222222",
          backgroundColor: "transparent",
          color: "#888888",
          fontSize: "13px",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
          marginBottom: "14px",
        }}
      >
        <AdjustIcon />
        Filtros
      </button>

      {/* Expanded filter card */}
      <div
        style={{
          backgroundColor: "#161616",
          border: "1px solid #222222",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Category */}
        <div>
          <p style={labelStyle}>Categoria</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {CATEGORIES.map((cat) => {
              const sel = cat === "Pintura";
              return (
                <button
                  key={cat}
                  style={{
                    height: "30px",
                    padding: "0 12px",
                    borderRadius: "999px",
                    border: sel ? "none" : "1px solid #222222",
                    backgroundColor: sel ? "#FFFFFF" : "transparent",
                    color: sel ? "#0E0E0E" : "#888888",
                    fontSize: "12px",
                    fontWeight: sel ? 500 : 400,
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div>
          <p style={labelStyle}>Localização</p>
          <input
            type="text"
            placeholder="Cidade ou bairro"
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: "#0E0E0E",
              border: "1px solid #222222",
              borderRadius: "10px",
              padding: "0 14px",
              fontSize: "14px",
              color: "#FFFFFF",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "12px",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#888888" }}>Distância</span>
            <span style={{ fontSize: "13px", color: "#FFFFFF", fontWeight: 500 }}>Até 5km</span>
          </div>
          <div style={{ height: "4px", backgroundColor: "#2A2A2A", borderRadius: "999px", position: "relative" }}>
            <div style={{ width: "40%", height: "100%", backgroundColor: "#FFFFFF", borderRadius: "999px" }} />
            <div style={{
              position: "absolute",
              left: "calc(40% - 8px)",
              top: "-6px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              border: "2px solid #0E0E0E",
              boxShadow: "0 0 0 2px #FFFFFF",
            }} />
          </div>
        </div>

        {/* Rating */}
        <div>
          <p style={labelStyle}>Avaliação mínima</p>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} style={{ fontSize: "24px", color: s <= 4 ? "#FFFFFF" : "#333333", cursor: "pointer" }}>★</span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <p style={labelStyle}>Faixa de preço</p>
          <div style={{ display: "flex", gap: "10px" }}>
            {["De R$", "Até R$"].map((ph) => (
              <input
                key={ph}
                type="number"
                placeholder={ph}
                style={{
                  flex: 1,
                  height: "44px",
                  backgroundColor: "#0E0E0E",
                  border: "1px solid #222222",
                  borderRadius: "10px",
                  padding: "0 14px",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  outline: "none",
                  minWidth: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Verified toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", color: "#FFFFFF" }}>Somente prestadores verificados</span>
          <Toggle active />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ flex: 1, height: "42px", backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid #333333", borderRadius: "999px", fontSize: "13px", fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}>
            Limpar filtros
          </button>
          <button style={{ flex: 1, height: "42px", backgroundColor: "#FFFFFF", color: "#0E0E0E", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Toggle ──────────────────────────────────────────────── */
function Toggle({ active }: { active: boolean }) {
  return (
    <div
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "999px",
        backgroundColor: active ? "#FFFFFF" : "#333333",
        position: "relative",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "3px",
          left: active ? "23px" : "3px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          backgroundColor: active ? "#0E0E0E" : "#888888",
          transition: "left 0.15s",
        }}
      />
    </div>
  );
}

/* ─── Results ─────────────────────────────────────────────── */
function ResultsLabel() {
  return (
    <p style={{ fontSize: "13px", color: "#555555", marginBottom: "12px" }}>
      23 resultados para <span style={{ color: "#FFFFFF" }}>Pintura</span> em Taubaté
    </p>
  );
}

const RESULTS = [
  { letter: "M", bg: "#2A2A2A", name: "Marina Costa",    verified: true,  rating: "4.9", jobs: "128 serviços", location: "Taubaté, SP · 1.2km",           price: "A partir de R$ 350", tags: ["Pintura", "Reformas", "Disponível"] },
  { letter: "C", bg: "#1A2A3A", name: "Carlos Pintor",   verified: false, rating: "4.7", jobs: "89 serviços",  location: "São José dos Campos · 8km",      price: "A partir de R$ 280", tags: ["Pintura", "Comercial"] },
  { letter: "F", bg: "#2A1A3A", name: "Frechal Pinturas", verified: true, rating: "4.8", jobs: "312 serviços", location: "Taubaté · 2.1km",                price: "A partir de R$ 500", tags: ["Pintura", "Empresa", "CNPJ verificado"] },
];

function Results() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {RESULTS.map(({ letter, bg, name, verified, rating, jobs, location, price, tags }) => (
        <div key={name} style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", padding: "16px" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <SmallAvatar letter={letter} bg={bg} />
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#FFFFFF" }}>{name}</span>
              {verified && <VerifiedBadge />}
            </div>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", flexShrink: 0 }}>{rating} ★</span>
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", paddingLeft: "38px" }}>
            <span style={{ fontSize: "13px", color: "#888888" }}>{jobs.split("·")[0] ?? jobs}</span>
            <span style={{ fontSize: "13px", color: "#555555" }}>· {jobs}</span>
          </div>

          {/* Row 3 */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px", paddingLeft: "38px" }}>
            <PinIcon />
            <span style={{ fontSize: "13px", color: "#555555" }}>{location}</span>
          </div>

          {/* Row 4 + tags + button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "38px" }}>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", marginBottom: "6px" }}>{price}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {tags.map((t) => (
                  <span key={t} style={{ fontSize: "11px", color: "#888888", backgroundColor: "#1E1E1E", border: "1px solid #2A2A2A", borderRadius: "999px", padding: "2px 8px" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/perfil"
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
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                marginLeft: "12px",
              }}
            >
              Ver perfil
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Recent Searches ─────────────────────────────────────── */
const RECENTS = ["Pintura Taubaté", "Eletricista Vale do Paraíba", "Faxina São José"];

function RecentSearches() {
  return (
    <div>
      <SectionLabel text="Buscas recentes" />
      <div style={{ backgroundColor: "#161616", border: "1px solid #222222", borderRadius: "12px", overflow: "hidden" }}>
        {RECENTS.map((item, i) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 16px",
              borderBottom: i < RECENTS.length - 1 ? "1px solid #222222" : "none",
            }}
          >
            <ClockIcon />
            <span style={{ flex: 1, fontSize: "14px", color: "#888888" }}>{item}</span>
            <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#555555", padding: "2px" }}>
              <XIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Popular Suggestions ─────────────────────────────────── */
const POPULAR = ["Reformas", "Pintura", "Faxina", "Elétrica"];

function PopularSuggestions() {
  return (
    <div>
      <SectionLabel text="Popular na sua região" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {POPULAR.map((item) => (
          <div
            key={item}
            style={{
              backgroundColor: "#161616",
              border: "1px solid #222222",
              borderRadius: "10px",
              padding: "14px 16px",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",       icon: <HomeIcon /> },
  { label: "Buscar",  href: "/busca",      icon: <SearchIcon color="currentColor" />, },
  { label: "Criar",   href: "/criar-post", icon: <CreateIcon />, special: true },
  { label: "Pedidos", href: "/pedidos",    icon: <ClipboardIcon /> },
  { label: "Perfil",  href: "/meu-perfil", icon: <UserIcon /> },
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

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#888888",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function SmallAvatar({ letter, bg }: { letter: string; bg: string }) {
  return (
    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: "13px", fontWeight: 500, color: "#FFFFFF" }}>{letter}</span>
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

function SearchIcon({ color = "#FFFFFF" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function AdjustIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="20" y2="12" />
      <line x1="12" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" />
      <path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
