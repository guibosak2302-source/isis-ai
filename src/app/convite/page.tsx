"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function ConvitePage() {
  const router = useRouter();
  const [vagas, setVagas] = useState(500);
  const [emailIndicado, setEmailIndicado] = useState("");
  const [indicando, setIndicando] = useState(false);
  const [indicadoOk, setIndicadoOk] = useState(false);
  const [indicadoErro, setIndicadoErro] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    async function init() {
      const res = await fetch("/api/convite");
      if (res.ok) {
        const data = await res.json();
        setVagas(data.restam);
      }
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    }
    init();
  }, []);

  async function handleIndicar() {
    setIndicadoErro("");
    if (!emailIndicado || !emailIndicado.includes("@") || !emailIndicado.includes(".")) {
      setIndicadoErro("Digite um email válido.");
      return;
    }
    setIndicando(true);
    try {
      const res = await fetch("/api/convite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_indicado: emailIndicado }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIndicadoErro(data.error ?? "Erro ao enviar convite.");
      } else {
        setIndicadoOk(true);
        setEmailIndicado("");
      }
    } catch {
      setIndicadoErro("Erro de conexão. Tente novamente.");
    } finally {
      setIndicando(false);
    }
  }

  function handleCompartilharWhatsapp() {
    const texto = encodeURIComponent("Entrei para o Bico AI! Garanta sua vaga exclusiva: https://bicoai.com.br/convite");
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  }

  function handleCompartilharInstagram() {
    window.open("https://www.instagram.com/", "_blank");
    setToastMsg("Copie o link e cole no Stories!");
    setTimeout(() => setToastMsg(""), 3000);
  }

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "60px" }}>
      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, color: "#F0F0F0", textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Convite Exclusivo</span>
        <div style={{ width: "36px" }} />
      </header>

      {/* CONTENT */}
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "76px 24px 0" }}>

        {/* [1] VAGAS BADGE */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{ backgroundColor: "rgba(255,209,26,0.125)", border: "1px solid rgba(255,209,26,0.25)", borderRadius: "999px", padding: "6px 16px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", backgroundColor: "#FFD11A", borderRadius: "50%" }} />
            <span style={{ fontSize: "12px", color: "#FFD11A", fontWeight: 600 }}>Somente 500 vagas</span>
          </div>
        </div>

        {/* [2] DUCK ICON */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ width: "88px", height: "88px", backgroundColor: "#FFD11A", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
              <ellipse cx="32" cy="42" rx="22" ry="16" fill="#0F0F0F" />
              <circle cx="44" cy="26" r="13" fill="#0F0F0F" />
              <ellipse cx="55" cy="28" rx="7" ry="4" fill="#0F0F0F" />
              <circle cx="47" cy="22" r="2.5" fill="#FFD11A" />
            </svg>
          </div>
        </div>

        {/* [3] TITLE & SUBTITLE */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#F0F0F0", lineHeight: 1.2, marginBottom: "12px", whiteSpace: "pre-line" }}>
            {"Você foi convidado\npara o Bico AI!"}
          </h1>
          <p style={{ fontSize: "15px", color: "#888888", lineHeight: 1.5 }}>
            Resolve rápido, sempre perto de você.
          </p>
        </div>

        {/* [4] VAGAS COUNTER CARD */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "56px", fontWeight: 800, color: "#FFD11A", lineHeight: 1, marginBottom: "4px" }}>{vagas}</div>
          <div style={{ fontSize: "14px", color: "#888888" }}>vagas restantes</div>
          <div style={{ marginTop: "16px", width: "100%", height: "6px", backgroundColor: "#2E2E2E", borderRadius: "999px" }}>
            <div style={{ width: `${(vagas / 500) * 100}%`, height: "6px", backgroundColor: "#FFD11A", borderRadius: "999px", transition: "width 0.5s" }} />
          </div>
        </div>

        {/* [5] CTA BUTTON */}
        <div style={{ marginBottom: "32px" }}>
          <Link
            href="/cadastro"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "56px", backgroundColor: "#FFD11A", color: "#0F0F0F", borderRadius: "999px", fontSize: "16px", fontWeight: 700, textDecoration: "none" }}
          >
            Quero minha vaga →
          </Link>
        </div>

        {/* [6] INDICAR AMIGO */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "20px", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0", marginBottom: "4px" }}>Indique um amigo</h3>
          <p style={{ fontSize: "12px", color: "#555555", marginBottom: "14px" }}>Sua indicação reserva a vaga dele.</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="email"
              placeholder="email@amigo.com"
              value={emailIndicado}
              onChange={(e) => setEmailIndicado(e.target.value)}
              style={{ flex: 1, height: "44px", backgroundColor: "#0F0F0F", border: "1px solid #2E2E2E", borderRadius: "10px", padding: "0 12px", fontSize: "14px", color: "#F0F0F0", outline: "none", fontFamily: "var(--font-inter), Inter, sans-serif" }}
            />
            <button
              onClick={handleIndicar}
              disabled={indicando}
              style={{ height: "44px", padding: "0 16px", backgroundColor: "#FFD11A", color: "#0F0F0F", borderRadius: "10px", fontSize: "13px", fontWeight: 600, border: "none", cursor: indicando ? "not-allowed" : "pointer", flexShrink: 0, fontFamily: "var(--font-inter), Inter, sans-serif", opacity: indicando ? 0.7 : 1 }}
            >
              {indicando ? "Enviando…" : "Indicar"}
            </button>
          </div>
          {indicadoOk && (
            <p style={{ fontSize: "12px", color: "#1D9E75", marginTop: "8px" }}>✓ Convite enviado!</p>
          )}
          {indicadoErro && (
            <p style={{ fontSize: "12px", color: "#E24B4A", marginTop: "8px" }}>{indicadoErro}</p>
          )}
        </div>

        {/* [7] COMPARTILHAR */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleCompartilharWhatsapp}
            style={{ flex: 1, height: "48px", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#1A3A1E", color: "#25D366", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
          <button
            onClick={handleCompartilharInstagram}
            style={{ flex: 1, height: "48px", borderRadius: "12px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#1A1A2E", color: "#E1306C", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="#E1306C" stroke="none" />
            </svg>
            Stories
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toastMsg && (
        <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "12px 20px", fontSize: "13px", color: "#F0F0F0", zIndex: 100, whiteSpace: "nowrap" }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
