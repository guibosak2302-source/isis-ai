"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

/* ── Password strength ───────────────────────────────────── */
function passwordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  const len = pw.length;
  if (len === 0) return { level: 0, label: "", color: "" };
  if (len <= 2) return { level: 1, label: "FRACA", color: "#EF4444" };
  if (len <= 5) return { level: 2, label: "MÉDIA", color: "#FF7A1A" };
  return { level: 3, label: "FORTE", color: "#FFD11A" };
}

function emailValid(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [aceito, setAceito] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const strength = passwordStrength(senha);
  const emailTouched = email.length > 0;
  const emailError = emailTouched && !emailValid(email);

  async function handleSignUp() {
    setError("");
    if (!nome.trim()) { setError("Como podem te chamar?"); return; }
    if (!emailValid(email)) { setError("Informe um email válido"); return; }
    if (senha.length < 8) { setError("A senha precisa ter pelo menos 8 caracteres"); return; }
    if (!aceito) { setError("Aceite os termos para continuar"); return; }

    setLoading(true);
    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: { data: { full_name: nome.trim() }, emailRedirectTo: undefined },
    });

    if (authError) {
      setLoading(false);
      const msg = authError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("duplicate")) {
        setError("Email já cadastrado. Tente fazer login.");
      } else if (msg.includes("password")) {
        setError("Senha muito fraca. Use pelo menos 8 caracteres.");
      } else if (msg.includes("invalid") && msg.includes("email")) {
        setError("Email inválido");
      } else {
        setError(authError.message);
      }
      return;
    }

    const user = data.user;
    if (user) {
      await supabase.from("profiles").upsert({ id: user.id, full_name: nome.trim(), email: email.trim().toLowerCase() });
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    setLoading(false);
    if (!loginError) { router.push("/onboarding"); return; }
    setError("Conta criada! Confirme seu email e faça login.");
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  function inputBorder(field: string) {
    if (focusedField === field) return "2px solid #FFD11A";
    return "1.5px solid #252525";
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F0F0F", fontFamily: "var(--font-inter), Inter, sans-serif", position: "relative", overflow: "hidden" }}>

      {/* Decorative duck background */}
      <div aria-hidden style={{ position: "fixed", top: "-40px", right: "-60px", opacity: 0.04, pointerEvents: "none", zIndex: 0, userSelect: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={340} height={340} style={{ display: "block" }} />
      </div>

      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Bico" width={26} height={26} style={{ display: "block" }} />
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0", letterSpacing: "-0.02em" }}>bico.com</span>
        </div>
        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#888888", textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          voltar
        </Link>
      </header>

      {/* Scrollable content */}
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", justifyContent: "center", padding: "88px 24px 48px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          {/* Title block */}
          <div style={{ marginBottom: "36px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#FFD11A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
              CRIAR CONTA · GRÁTIS
            </p>
            <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#F0F0F0", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "4px" }}>
              Bem-vindo
            </h1>
            <p style={{ fontSize: "36px", fontWeight: 700, fontStyle: "italic", color: "#FFD11A", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "16px" }}>
              ao bando.
            </p>
            <p style={{ fontSize: "14px", color: "#666666", lineHeight: 1.6 }}>
              Posta o que precisa. A IA acha quem resolve.<br />Em menos de 1 minuto.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* NOME */}
            <div>
              <label style={labelStyle}>NOME</label>
              <div style={iconWrap(focusedField === "nome")}>
                <span style={iconSpan}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onFocus={() => setFocusedField("nome")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="como podem te chamar?"
                  autoComplete="name"
                  style={{ ...bareInput, border: inputBorder("nome") }}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label style={labelStyle}>EMAIL</label>
              <div style={iconWrap(focusedField === "email")}>
                <span style={iconSpan}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="seuemail@dominio.com"
                  autoComplete="email"
                  style={{ ...bareInput, border: emailError ? "1.5px solid #FF7A1A" : inputBorder("email") }}
                />
              </div>
              {emailError && (
                <p style={{ fontSize: "12px", color: "#FF7A1A", marginTop: "6px" }}>parece que tá faltando o .com.br</p>
              )}
            </div>

            {/* SENHA */}
            <div>
              <label style={labelStyle}>SENHA</label>
              <div style={iconWrap(focusedField === "senha")}>
                <span style={iconSpan}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </span>
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onFocus={() => setFocusedField("senha")}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                  placeholder="mínimo 8 caracteres"
                  autoComplete="new-password"
                  style={{ ...bareInput, border: inputBorder("senha") }}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha((v) => !v)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#555555", fontSize: "11px", fontFamily: "var(--font-inter), Inter, sans-serif", padding: "0 4px", flexShrink: 0, letterSpacing: "0.04em" }}
                >
                  {showSenha ? "OCULTAR" : "MOSTRAR"}
                </button>
              </div>

              {/* Strength bar */}
              {senha.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        style={{
                          flex: 1, height: "3px", borderRadius: "2px",
                          backgroundColor: seg <= strength.level + (strength.level === 3 ? 1 : 0)
                            ? (seg === 1 && strength.level === 1 ? "#EF4444"
                              : seg <= 2 && strength.level === 2 ? "#FF7A1A"
                              : strength.level === 3 ? "#FFD11A"
                              : "#252525")
                            : "#252525",
                          transition: "background-color 0.2s",
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: "11px", color: strength.color, letterSpacing: "0.06em" }}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Checkbox */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
              <div
                onClick={() => setAceito((v) => !v)}
                style={{ width: "18px", height: "18px", borderRadius: "5px", border: `2px solid ${aceito ? "#FFD11A" : "#333333"}`, backgroundColor: aceito ? "#FFD11A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", transition: "all 0.15s", cursor: "pointer" }}
              >
                {aceito && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </div>
              <span style={{ fontSize: "13px", color: "#888888", lineHeight: 1.5 }}>
                aceito os{" "}
                <span style={{ color: "#FFD11A", cursor: "pointer" }}>termos de uso</span>
                {" "}e a{" "}
                <span style={{ color: "#FFD11A", cursor: "pointer" }}>política de privacidade</span>
                {" "}do Bico
              </span>
            </label>

            {/* Error */}
            {error && (
              <p style={{ fontSize: "13px", color: error.startsWith("Conta criada") ? "#6FCF97" : "#E24B4A", textAlign: "center" }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSignUp}
              disabled={loading}
              style={{ width: "100%", height: "54px", backgroundColor: loading ? "#2A2A2A" : "#FFD11A", color: loading ? "#666666" : "#0F0F0F", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "-0.01em", transition: "background-color 0.15s" }}
            >
              {loading ? "criando conta…" : "criar conta →"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#252525" }} />
              <span style={{ fontSize: "11px", color: "#444444", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>OU CONTINUE COM</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#252525" }} />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              style={{ width: "100%", height: "52px", backgroundColor: "#1A1A1A", color: "#E0E0E0", border: "1.5px solid #252525", borderRadius: "12px", fontSize: "14px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
            >
              <GoogleIcon />
              continuar com Google
            </button>

            {/* Footer */}
            <p style={{ fontSize: "11px", color: "#444444", textAlign: "center", letterSpacing: "0.04em", marginTop: "4px" }}>
              🔒 dados criptografados · LGPD
            </p>

            <p style={{ fontSize: "13px", color: "#555555", textAlign: "center", marginTop: "4px" }}>
              Já tem conta?{" "}
              <Link href="/login" style={{ color: "#F0F0F0", textDecoration: "none", fontWeight: 500 }}>
                entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared styles ───────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 600, color: "#555555",
  letterSpacing: "0.08em", marginBottom: "8px",
};

function iconWrap(focused: boolean): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", gap: "10px",
    backgroundColor: "#141414", border: focused ? "2px solid #FFD11A" : "1.5px solid #252525",
    borderRadius: "12px", padding: "0 14px", height: "54px",
    transition: "border-color 0.15s",
  };
}

const iconSpan: React.CSSProperties = { flexShrink: 0, display: "flex", alignItems: "center" };

const bareInput: React.CSSProperties = {
  flex: 1, background: "none", outline: "none",
  fontSize: "15px", color: "#F0F0F0",
  fontFamily: "var(--font-inter), Inter, sans-serif",
  border: "none", minWidth: 0,
};

/* ── Google icon ─────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
