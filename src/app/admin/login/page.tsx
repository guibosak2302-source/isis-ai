"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (password === "guilherme2024") {
      document.cookie = `bico_admin=guilherme2024; path=/; max-age=${60 * 60 * 24 * 30}`;
      router.push("/admin");
    } else {
      setError("Senha incorreta");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#F0F0F0", letterSpacing: "-0.02em" }}>Bico AI</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#E24B4A", backgroundColor: "rgba(226,75,74,0.12)", border: "1px solid rgba(226,75,74,0.3)", borderRadius: "4px", padding: "2px 6px", letterSpacing: "0.06em" }}>ADMIN</span>
          </div>
          <p style={{ fontSize: "13px", color: "#888888" }}>Acesso restrito — equipe interna</p>
        </div>

        {/* Password card */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "16px", padding: "28px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: "8px" }}>
            Senha de administrador
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Digite a senha"
            autoFocus
            style={{
              width: "100%",
              height: "48px",
              backgroundColor: "#0A0A0A",
              border: `1px solid ${error ? "#E24B4A" : "#1E1E1E"}`,
              borderRadius: "10px",
              padding: "0 14px",
              fontSize: "14px",
              color: "#F0F0F0",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "8px",
            }}
          />
          {error && (
            <p style={{ fontSize: "12px", color: "#E24B4A", marginBottom: "8px" }}>{error}</p>
          )}
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              height: "46px",
              backgroundColor: "#FFD11A",
              color: "#000000",
              border: "none",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
              marginTop: "4px",
            }}
          >
            Entrar no Admin
          </button>
        </div>

        <p style={{ fontSize: "11px", color: "#444444", textAlign: "center", marginTop: "20px" }}>
          Bico AI Admin · Acesso exclusivo para administradores
        </p>
      </div>
    </main>
  );
}
