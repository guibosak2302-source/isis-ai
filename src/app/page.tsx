import Link from "next/link";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0E0E0E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Wordmark + Slogan */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 500,
            fontSize: "52px",
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1,
            marginBottom: "12px",
          }}
        >
          Ísis AI
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 400,
            fontSize: "15px",
            color: "#555555",
            lineHeight: 1.5,
          }}
        >
          Resolve rápido, sempre perto de você.
        </p>
      </div>

      {/* Buttons container */}
      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "0" }}>
        {/* Entrar */}
        <Link
          href="/feed"
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
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Entrar
        </Link>

        {/* Criar conta */}
        <Link
          href="/feed"
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "transparent",
            color: "#FFFFFF",
            border: "1px solid #333333",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 400,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          Criar conta
        </Link>

        {/* Divider "ou" */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#333333" }} />
          <span
            style={{
              color: "#333333",
              fontSize: "12px",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 400,
            }}
          >
            ou
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#333333" }} />
        </div>

        {/* Continuar com Google */}
        <button
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#161616",
            color: "#FFFFFF",
            border: "1px solid #222222",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 400,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <GoogleIcon />
          Continuar com Google
        </button>
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: "32px",
          color: "#333333",
          fontSize: "12px",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontWeight: 400,
          textAlign: "center",
          maxWidth: "360px",
          lineHeight: 1.6,
        }}
      >
        Ao continuar, você aceita os Termos e Política de Privacidade.
      </p>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
