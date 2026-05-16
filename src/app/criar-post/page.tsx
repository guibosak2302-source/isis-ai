import Link from "next/link";

export default function CriarPostPage() {
  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingBottom: "88px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px", paddingTop: "80px" }}>
        <PostTypePills />
        <Divider />
        <TextArea />
        <Divider />
        <PhotoSection />
        <Divider />
        <CategoryField />
        <Divider />
        <LocationField />
        <Divider />
        <PriceField />
        <Divider />
        <AISuggestion />
      </div>
      <BottomNav active="Criar" />
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
        href="/feed"
        style={{
          fontSize: "15px",
          fontWeight: 400,
          color: "#888888",
          textDecoration: "none",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        Cancelar
      </Link>

      <span style={{ fontSize: "16px", fontWeight: 500, color: "#FFFFFF" }}>Novo post</span>

      <button
        style={{
          fontSize: "15px",
          fontWeight: 500,
          color: "#FFFFFF",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        Publicar
      </button>
    </header>
  );
}

/* ─── Post Type Pills ─────────────────────────────────────── */
function PostTypePills() {
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", padding: "20px 0 4px" }}>
      {[
        { label: "Ofereço serviço", active: true },
        { label: "Preciso de serviço", active: false },
      ].map(({ label, active }) => (
        <button
          key={label}
          style={{
            height: "38px",
            padding: "0 20px",
            borderRadius: "999px",
            border: active ? "none" : "1px solid #333333",
            backgroundColor: active ? "#FFFFFF" : "transparent",
            color: active ? "#0E0E0E" : "#888888",
            fontSize: "14px",
            fontWeight: active ? 500 : 400,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─── Divider ─────────────────────────────────────────────── */
function Divider() {
  return <div style={{ height: "1px", backgroundColor: "#222222", margin: "20px 0" }} />;
}

/* ─── Text Area ───────────────────────────────────────────── */
function TextArea() {
  return (
    <textarea
      placeholder="Descreva o serviço que você oferece ou precisa... seja específico sobre localização, prazo e detalhes."
      style={{
        width: "100%",
        minHeight: "120px",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: "15px",
        fontWeight: 400,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        color: "#FFFFFF",
        lineHeight: 1.65,
      }}
    />
  );
}

/* ─── Photo Section ───────────────────────────────────────── */
function PhotoSection() {
  return (
    <div>
      <p style={{ fontSize: "12px", color: "#888888", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Fotos e vídeos
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        {/* Add button */}
        <button
          aria-label="Adicionar foto"
          style={{
            height: "80px",
            backgroundColor: "#161616",
            border: "1px dashed #222222",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <PlusIcon />
        </button>
        {/* Empty slots */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: "80px",
              backgroundColor: "#161616",
              border: "1px dashed #222222",
              borderRadius: "10px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Category Field ──────────────────────────────────────── */
function CategoryField() {
  return (
    <div>
      <p style={{ fontSize: "12px", color: "#888888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Categoria
      </p>
      <select
        defaultValue=""
        style={{
          width: "100%",
          height: "48px",
          backgroundColor: "#161616",
          border: "1px solid #222222",
          borderRadius: "10px",
          padding: "0 14px",
          fontSize: "14px",
          color: "#FFFFFF",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23555555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          cursor: "pointer",
        }}
      >
        <option value="" disabled style={{ color: "#555555", backgroundColor: "#161616" }}>
          Selecione uma categoria
        </option>
        {["Reformas", "Pintura", "Faxina", "Elétrica", "Aulas", "Beleza", "Jardinagem", "TI", "Outros"].map((cat) => (
          <option key={cat} value={cat} style={{ backgroundColor: "#161616" }}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── Location Field ──────────────────────────────────────── */
function LocationField() {
  return (
    <div>
      <p style={{ fontSize: "12px", color: "#888888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Localização
      </p>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", left: "14px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <PinIcon />
        </span>
        <input
          type="text"
          placeholder="Sua cidade, bairro ou região"
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: "#161616",
            border: "1px solid #222222",
            borderRadius: "10px",
            paddingLeft: "40px",
            paddingRight: "14px",
            fontSize: "14px",
            color: "#FFFFFF",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Price Field ─────────────────────────────────────────── */
function PriceField() {
  return (
    <div>
      <p style={{ fontSize: "12px", color: "#888888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Valor
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        {[
          { placeholder: "A partir de R$" },
          { placeholder: "Até R$" },
        ].map(({ placeholder }) => (
          <input
            key={placeholder}
            type="number"
            placeholder={placeholder}
            style={{
              flex: 1,
              height: "48px",
              backgroundColor: "#161616",
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
  );
}

/* ─── AI Suggestion ───────────────────────────────────────── */
function AISuggestion() {
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
          <StarIcon />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF", marginBottom: "2px" }}>
            Sugestão da Ísis AI
          </p>
          <p style={{ fontSize: "12px", color: "#555555" }}>Melhore sua descrição com IA</p>
        </div>
      </div>
      <button
        style={{
          flexShrink: 0,
          height: "34px",
          padding: "0 16px",
          borderRadius: "999px",
          backgroundColor: "transparent",
          color: "#FFFFFF",
          border: "1px solid #333333",
          fontSize: "13px",
          fontWeight: 400,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Usar IA
      </button>
    </div>
  );
}

/* ─── Bottom Nav ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Feed",    href: "/feed",        icon: <HomeIcon /> },
  { label: "Buscar",  href: "/feed",        icon: <SearchIcon /> },
  { label: "Criar",   href: "/criar-post",  icon: <CreateIcon />, special: true },
  { label: "Pedidos", href: "/pedidos",     icon: <ClipboardIcon /> },
  { label: "Perfil",  href: "/meu-perfil",  icon: <UserIcon /> },
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
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "-2px",
                }}
              >
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

/* ─── Icons ───────────────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
