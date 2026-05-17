"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [accountType, setAccountType] = useState<"contratante" | "prestador">("contratante");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setError("");
    if (senha !== confirmaSenha) {
      setError("As senhas não coincidem");
      return;
    }
    if (senha.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { full_name: nome, phone: telefone } },
    });
    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: nome,
        phone: telefone,
        type: accountType,
        city,
        state: "SP",
      });
    }
    setLoading(false);
    router.push("/onboarding");
  }

  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingBottom: "40px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 20px", paddingTop: "72px" }}>
        <TypeSelector accountType={accountType} setAccountType={setAccountType} />

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
          <Field label="Nome completo" placeholder="Seu nome completo" type="text" autoComplete="name" value={nome} onChange={setNome} />
          <Field label="CPF" placeholder="000.000.000-00" type="text" autoComplete="off" value="" onChange={() => {}} />
          <Field label="Email" placeholder="seu@email.com" type="email" autoComplete="email" value={email} onChange={setEmail} />
          <Field label="Telefone (WhatsApp)" placeholder="(11) 90000-0000" type="tel" autoComplete="tel" value={telefone} onChange={setTelefone} />
          <Field label="Senha" placeholder="Mínimo 8 caracteres" type="password" autoComplete="new-password" value={senha} onChange={setSenha} />
          <Field label="Confirmar senha" placeholder="Repita a senha" type="password" autoComplete="new-password" value={confirmaSenha} onChange={setConfirmaSenha} />
        </div>

        <LocationField city={city} setCity={setCity} />
        <ProfilePhoto />
        <TermsRow />

        {/* Error */}
        {error && (
          <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "12px", textAlign: "center", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
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
            marginBottom: "24px",
          }}
        >
          {loading ? "Criando conta…" : "Criar minha conta"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#888888" }}>
          Já tem conta?{" "}
          <Link href="/" style={{ color: "#F0F0F0", textDecoration: "none", fontWeight: 500 }}>
            Entrar
          </Link>
        </p>
      </div>
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
      <Link href="/" aria-label="Voltar" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
        <ArrowLeftIcon />
      </Link>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Criar conta</span>
      <div style={{ width: "36px" }} />
    </header>
  );
}

/* ─── Type Selector ───────────────────────────────────────── */
function TypeSelector({
  accountType,
  setAccountType,
}: {
  accountType: "contratante" | "prestador";
  setAccountType: (v: "contratante" | "prestador") => void;
}) {
  return (
    <div style={{ marginTop: "24px", marginBottom: "28px" }}>
      <p style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0", marginBottom: "14px" }}>Você é:</p>
      <div style={{ display: "flex", gap: "12px" }}>
        <div
          onClick={() => setAccountType("contratante")}
          style={{
            flex: 1,
            backgroundColor: "#1A1A1A",
            border: `1px solid ${accountType === "contratante" ? "#FFD11A" : "#2E2E2E"}`,
            borderRadius: "12px",
            padding: "16px",
            cursor: "pointer",
          }}
        >
          <PersonIcon active={accountType === "contratante"} />
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0", marginTop: "10px", marginBottom: "4px" }}>Pessoa física</p>
          <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>Quero contratar ou oferecer serviços</p>
        </div>
        <div
          onClick={() => setAccountType("prestador")}
          style={{
            flex: 1,
            backgroundColor: "#1A1A1A",
            border: `1px solid ${accountType === "prestador" ? "#FFD11A" : "#2E2E2E"}`,
            borderRadius: "12px",
            padding: "16px",
            cursor: "pointer",
          }}
        >
          <BuildingIcon active={accountType === "prestador"} />
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0", marginTop: "10px", marginBottom: "4px" }}>Empresa</p>
          <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>Represento um negócio</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Controlled field ────────────────────────────────────── */
function Field({ label, placeholder, type, autoComplete, value, onChange }: {
  label: string; placeholder: string; type: string; autoComplete: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", color: "#888888", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: "52px",
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "10px",
          padding: "0 16px",
          fontSize: "15px",
          color: "#F0F0F0",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

/* ─── Location Field ──────────────────────────────────────── */
function LocationField({ city, setCity }: { city: string; setCity: (v: string) => void }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <label style={{ display: "block", fontSize: "12px", color: "#888888", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Onde você está?
      </label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <span style={{ position: "absolute", left: "14px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <PinIcon />
        </span>
        <input
          type="text"
          placeholder="Cidade, bairro ou região"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: "100%", height: "52px", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "10px", paddingLeft: "42px", paddingRight: "16px", fontSize: "15px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
        />
      </div>
    </div>
  );
}

/* ─── Profile Photo ───────────────────────────────────────── */
function ProfilePhoto() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#2A2A2A", border: "1px dashed #3A3A3A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: "8px" }}>
        <CameraIcon />
      </div>
      <span style={{ fontSize: "12px", color: "#555555" }}>Adicionar foto</span>
    </div>
  );
}

/* ─── Terms Row ───────────────────────────────────────────── */
function TermsRow() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "24px" }}>
      <input type="checkbox" id="terms" style={{ width: "18px", height: "18px", marginTop: "1px", accentColor: "#FFD11A", flexShrink: 0, cursor: "pointer" }} />
      <label htmlFor="terms" style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6, cursor: "pointer" }}>
        Concordo com os{" "}
        <span style={{ color: "#F0F0F0", textDecoration: "underline", cursor: "pointer" }}>Termos de Uso</span>{" "}
        e{" "}
        <span style={{ color: "#F0F0F0", textDecoration: "underline", cursor: "pointer" }}>Política de Privacidade</span>
      </label>
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
function PersonIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFD11A" : "#888888"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function BuildingIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFD11A" : "#555555"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /><rect x="13" y="13" width="3" height="3" /><rect x="13" y="17" width="3" height="2" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  );
}
