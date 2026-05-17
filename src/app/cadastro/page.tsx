"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setError("");

    if (!nome.trim()) { setError("Informe seu nome completo"); return; }
    if (!email.trim()) { setError("Informe seu email"); return; }
    if (senha.length < 6) { setError("A senha deve ter pelo menos 6 caracteres"); return; }
    if (senha !== confirmaSenha) { setError("As senhas não coincidem"); return; }

    setLoading(true);
    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: {
        data: { full_name: nome.trim() },
        emailRedirectTo: undefined,
      },
    });

    if (authError) {
      setLoading(false);
      const msg = authError.message.toLowerCase();
      console.error("[cadastro]", authError.message);
      if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("duplicate")) {
        setError("Email já cadastrado. Tente fazer login.");
      } else if (msg.includes("password") || msg.includes("6 characters")) {
        setError("A senha deve ter pelo menos 6 caracteres");
      } else if (msg.includes("invalid") && msg.includes("email")) {
        setError("Email inválido");
      } else {
        setError(authError.message);
      }
      return;
    }

    const user = data.user;
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: nome.trim(),
        email: email.trim().toLowerCase(),
      });
    }

    // Tenta login automático para contornar confirmação de email obrigatória
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    setLoading(false);

    if (!loginError) {
      router.push("/onboarding");
      return;
    }

    // Login falhou (email não confirmado) — informa o usuário
    setError("Conta criada! Verifique seu email para confirmar e depois faça login.");
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
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "12px" }}>
          <DuckLogo />
          <h1
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontWeight: 500,
              fontSize: "44px",
              letterSpacing: "-0.03em",
              color: "#F0F0F0",
              lineHeight: 1,
            }}
          >
            Bico AI
          </h1>
        </div>
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: "14px", color: "#555555" }}>
          Crie sua conta grátis
        </p>
      </div>

      {/* Form */}
      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          autoComplete="name"
          style={inputStyle}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          style={inputStyle}
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          autoComplete="new-password"
          style={inputStyle}
        />
        <input
          type="password"
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
          placeholder="Confirmar senha"
          autoComplete="new-password"
          onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
          style={{ ...inputStyle, marginBottom: "4px" }}
        />

        {error && (
          <p style={{ fontSize: "13px", color: "#E24B4A", textAlign: "center", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSignUp}
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
            marginTop: "8px",
          }}
        >
          {loading ? "Criando conta…" : "Criar conta"}
        </button>
      </div>

      <p style={{ marginTop: "24px", fontSize: "14px", color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        Já tem conta?{" "}
        <Link href="/login" style={{ color: "#F0F0F0", textDecoration: "none", fontWeight: 500 }}>
          Entrar
        </Link>
      </p>
    </main>
  );
}

function DuckLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="40" rx="18" ry="14" fill="#FFD11A" />
      <circle cx="44" cy="24" r="10" fill="#FFD11A" />
      <circle cx="47" cy="21" r="2" fill="#0F0F0F" />
      <circle cx="47.8" cy="20.2" r="0.6" fill="#fff" />
      <path d="M54 24 L60 22 L60 26 Z" fill="#FF9900" />
      <ellipse cx="26" cy="41" rx="8" ry="5" fill="#F0B800" transform="rotate(-15 26 41)" />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
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
};
