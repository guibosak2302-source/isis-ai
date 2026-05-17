"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      const msg = authError.message.toLowerCase();
      if (msg.includes("invalid") || msg.includes("credentials") || msg.includes("password")) {
        setError("Email ou senha incorretos");
      } else if (msg.includes("email not confirmed") || msg.includes("confirm")) {
        setError("Confirme seu email antes de entrar");
      } else {
        setError("Erro ao entrar. Tente novamente.");
      }
    } else {
      router.push("/feed");
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0F0F0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Wordmark + Slogan */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" width="56" height="56" alt="" style={{ display: "block" }} />
          <h1
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 500,
              fontSize: "52px",
              letterSpacing: "-0.03em",
              color: "#F0F0F0",
              lineHeight: 1,
            }}
          >
            Bico AI
          </h1>
        </div>
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

      {/* Form */}
      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "0" }}>
        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          autoComplete="email"
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "12px",
            padding: "0 16px",
            fontSize: "15px",
            color: "#F0F0F0",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "10px",
          }}
        />

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          autoComplete="current-password"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "12px",
            padding: "0 16px",
            fontSize: "15px",
            color: "#F0F0F0",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "12px",
          }}
        />

        {/* Error */}
        {error && (
          <p
            style={{
              fontSize: "13px",
              color: "#E24B4A",
              marginBottom: "10px",
              textAlign: "center",
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            {error}
          </p>
        )}

        {/* Entrar */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: loading ? "#3A3A3A" : "#FFD11A",
            color: loading ? "#888888" : "#0F0F0F",
            border: "none",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "12px",
          }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>

        {/* Criar conta */}
        <Link
          href="/onboarding"
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "transparent",
            color: "#F0F0F0",
            border: "1px solid #3A3A3A",
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

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#3A3A3A" }} />
          <span style={{ color: "#3A3A3A", fontSize: "12px", fontFamily: "var(--font-inter), Inter, sans-serif", fontWeight: 400 }}>
            ou
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#3A3A3A" }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#1A1A1A",
            color: "#F0F0F0",
            border: "1px solid #2E2E2E",
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
          color: "#3A3A3A",
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
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}
