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
      options: { data: { full_name: nome.trim() } },
    });

    if (authError) {
      setLoading(false);
      const msg = authError.message.toLowerCase();
      console.error("[cadastro]", authError.message);
      if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("duplicate")) {
        setError("Email já cadastrado. Tente fazer login.");
      } else if (msg.includes("password")) {
        setError("A senha deve ter pelo menos 6 caracteres");
      } else if (msg.includes("invalid") && msg.includes("email")) {
        setError("Email inválido");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: nome.trim(),
        email: email.trim().toLowerCase(),
      });
    }

    setLoading(false);
    router.push("/onboarding");
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" width="48" height="48" alt="" style={{ display: "block" }} />
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
