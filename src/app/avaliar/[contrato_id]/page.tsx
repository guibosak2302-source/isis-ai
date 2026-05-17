"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface Party {
  id: string;
  full_name: string | null;
}

interface ContratoAvaliacao {
  id: string;
  status: string;
  contratante_id: string;
  prestador_id: string;
  contratante: Party | null;
  prestador: Party | null;
}

const STAR_LABELS = ["", "Ruim", "Regular", "Bom", "Ótimo", "Excelente"];

export default function AvaliarPage() {
  const params = useParams();
  const router = useRouter();
  const contratoId = params.contrato_id as string;

  const [contrato, setContrato] = useState<ContratoAvaliacao | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [nota, setNota] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("contratos")
        .select(`
          id, status, contratante_id, prestador_id,
          contratante:contratante_id ( id, full_name ),
          prestador:prestador_id ( id, full_name )
        `)
        .eq("id", contratoId)
        .single();

      setContrato(data as unknown as ContratoAvaliacao | null);
      setLoading(false);
    }
    load();
  }, [contratoId, router]);

  async function handleSubmit() {
    if (!contrato || !userId || submitting) return;
    setSubmitting(true);
    setError("");

    const avaliado_id = userId === contrato.contratante_id
      ? contrato.prestador_id
      : contrato.contratante_id;

    const res = await fetch("/api/avaliar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contrato_id: contratoId, avaliado_id, nota, comentario: comentario.trim() }),
    });
    const json = await res.json() as { error?: string };

    if (!res.ok) {
      setError(json.error ?? "Erro ao enviar avaliação");
      setSubmitting(false);
      return;
    }

    router.push("/feed");
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>Carregando…</p>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#E24B4A", fontFamily: "var(--font-inter), Inter, sans-serif" }}>Contrato não encontrado.</p>
      </div>
    );
  }

  const isContratante = userId === contrato.contratante_id;
  const avaliado = isContratante ? contrato.prestador : contrato.contratante;
  const role = isContratante ? "Prestador" : "Contratante";
  const avaliadoNome = avaliado?.full_name ?? role;
  const avaliadoInicial = avaliadoNome.charAt(0).toUpperCase();
  const displayNota = hovered || nota;

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "96px" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href={`/contrato/${contratoId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
          <ArrowLeftIcon />
        </Link>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Avaliar {role.toLowerCase()}</span>
        <div style={{ width: "36px" }} />
      </header>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "72px 16px 0" }}>
        {/* Avaliado card */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "20px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "22px", fontWeight: 500, color: "#F0F0F0" }}>{avaliadoInicial}</span>
          </div>
          <div>
            <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{role}</p>
            <p style={{ fontSize: "17px", fontWeight: 500, color: "#F0F0F0" }}>{avaliadoNome}</p>
          </div>
        </div>

        {/* Stars */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <p style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px" }}>Como foi o serviço?</p>
          <p style={{ fontSize: "13px", color: "#555555", marginBottom: "20px" }}>Toque nas estrelas para avaliar</p>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setNota(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", fontSize: "44px", color: s <= displayNota ? "#FFD11A" : "#2E2E2E", lineHeight: 1, transition: "color 0.1s, transform 0.1s", transform: s === displayNota ? "scale(1.15)" : "scale(1)" }}
              >
                ★
              </button>
            ))}
          </div>

          <p style={{ fontSize: "17px", fontWeight: 500, color: displayNota >= 4 ? "#FFD11A" : displayNota >= 3 ? "#F0F0F0" : "#888888" }}>
            {STAR_LABELS[displayNota] ?? ""}
          </p>
        </div>

        {/* Comment */}
        <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>Comentário (opcional)</p>
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value.slice(0, 500))}
            placeholder={`Conte como foi trabalhar com ${avaliadoNome}...`}
            rows={4}
            style={{ width: "100%", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "14px 14px 32px", fontSize: "14px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.6 }}
          />
          <span style={{ position: "absolute", bottom: "10px", right: "14px", fontSize: "11px", color: "#555555" }}>
            {comentario.length}/500
          </span>
        </div>

        {error && (
          <p style={{ fontSize: "13px", color: "#E24B4A", textAlign: "center", marginBottom: "16px" }}>{error}</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#0F0F0F", borderTop: "1px solid #2E2E2E", padding: "16px", zIndex: 50 }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", display: "flex", gap: "10px" }}>
          <Link
            href={`/contrato/${contratoId}`}
            style={{ flex: 1, height: "50px", backgroundColor: "transparent", color: "#888888", border: "1px solid #2E2E2E", borderRadius: "999px", fontSize: "14px", fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
          >
            Agora não
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ flex: 2, height: "50px", backgroundColor: submitting ? "#3A3A3A" : "#FFD11A", color: submitting ? "#888888" : "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: submitting ? "not-allowed" : "pointer" }}
          >
            {submitting ? "Enviando…" : "Enviar avaliação"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>;
}
