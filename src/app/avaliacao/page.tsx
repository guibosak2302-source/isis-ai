"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const CRITERIA: { key: "qualidade" | "pontualidade" | "comunicacao" | "preco"; label: string }[] = [
  { key: "qualidade",    label: "Qualidade do serviço" },
  { key: "pontualidade", label: "Pontualidade" },
  { key: "comunicacao",  label: "Comunicação" },
  { key: "preco",        label: "Custo-benefício" },
];

function AvaliacaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prestador_id = searchParams.get("prestador_id") ?? "";
  const contrato_id  = searchParams.get("contrato_id")  ?? "";

  const [stars, setStars] = useState<Record<string, number>>({
    qualidade: 5, pontualidade: 5, comunicacao: 5, preco: 5,
  });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const mediaGeral = Math.round(
    Object.values(stars).reduce((a, b) => a + b, 0) / 4
  );

  const STAR_LABELS = ["", "Ruim", "Regular", "Bom", "Ótimo", "Excelente"];

  async function handleSubmit() {
    if (submitting || submitted) return;
    if (!prestador_id) { setError("Prestador não identificado. Volte ao contrato."); return; }
    setSubmitting(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/"); return; }

    const { error: dbError } = await supabase.from("avaliacoes").insert({
      contrato_id: contrato_id || null,
      avaliador_id: user.id,
      avaliado_id: prestador_id,
      qualidade:   stars.qualidade,
      pontualidade: stars.pontualidade,
      comunicacao: stars.comunicacao,
      preco:       stars.preco,
      comentario:  comment.trim() || null,
    });

    if (dbError) {
      setError("Erro ao salvar avaliação. Tente novamente.");
      setSubmitting(false);
      return;
    }

    // Trigger score recalculation
    void fetch("/api/calcular-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prestador_id }),
    });

    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingTop: "56px", paddingBottom: "96px" }}>
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px 0" }}>
        {/* Status */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <span style={{ display: "inline-block", backgroundColor: "#1A3A1A", color: "#4CAF50", fontSize: "12px", fontWeight: 500, padding: "4px 10px", borderRadius: "999px", marginBottom: "12px" }}>
            Serviço concluído
          </span>
          <p style={{ fontSize: "13px", color: "#888888" }}>Avalie o prestador de serviço</p>
        </div>

        {/* Overall stars */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <p style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0", marginBottom: "6px" }}>Como foi o serviço?</p>
          <p style={{ fontSize: "14px", color: "#555555", marginBottom: "20px" }}>Sua avaliação ajuda outros usuários</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStars({ qualidade: s, pontualidade: s, comunicacao: s, preco: s })}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", fontSize: "48px", color: s <= mediaGeral ? "#FFD11A" : "#3A3A3A", lineHeight: 1 }}
              >
                ★
              </button>
            ))}
          </div>
          <p style={{ fontSize: "15px", color: "#F0F0F0" }}>{STAR_LABELS[mediaGeral] ?? ""}</p>
        </div>

        {/* Per-criterion */}
        <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>Avalie cada critério</p>
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
          {CRITERIA.map(({ key, label }, i) => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: i < CRITERIA.length - 1 ? "1px solid #2E2E2E" : "none" }}>
              <span style={{ fontSize: "14px", color: "#888888" }}>{label}</span>
              <div style={{ display: "flex", gap: "3px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStars((prev) => ({ ...prev, [key]: s }))}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "18px", color: s <= stars[key] ? "#FFD11A" : "#3A3A3A" }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comment */}
        <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>Conte sua experiência</p>
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            placeholder="Descreva como foi o serviço. Seu comentário ajuda outros usuários."
            style={{ width: "100%", minHeight: "120px", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px", paddingBottom: "32px", fontSize: "14px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", resize: "none", boxSizing: "border-box" }}
          />
          <span style={{ position: "absolute", bottom: "12px", right: "14px", fontSize: "12px", color: "#555555" }}>
            {comment.length}/500
          </span>
        </div>

        {error && <p style={{ fontSize: "13px", color: "#E24B4A", textAlign: "center", marginBottom: "12px" }}>{error}</p>}

        {submitted && (
          <div style={{ backgroundColor: "#0D2E1E", border: "1px solid #1D9E75", borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "24px", marginBottom: "6px" }}>✓</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#1D9E75" }}>Avaliação enviada!</p>
            <p style={{ fontSize: "13px", color: "#888888", marginTop: "4px" }}>Obrigado pelo seu feedback.</p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#0F0F0F", borderTop: "1px solid #2E2E2E", padding: "16px", zIndex: 50 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "10px" }}>
          <Link
            href="/pedidos"
            style={{ flex: 1, height: "48px", backgroundColor: "transparent", color: "#F0F0F0", border: "1px solid #3A3A3A", borderRadius: "999px", fontSize: "14px", fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
          >
            Agora não
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting || submitted}
            style={{ flex: 1, height: "48px", backgroundColor: submitted ? "#1D9E75" : submitting ? "#3A3A3A" : "#FFD11A", color: submitted ? "#FFFFFF" : submitting ? "#888888" : "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: submitting || submitted ? "not-allowed" : "pointer" }}
          >
            {submitted ? "✓ Enviado!" : submitting ? "Enviando…" : "Enviar avaliação"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
      <Link href="/pedidos" aria-label="Voltar" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
      </Link>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Avaliar serviço</span>
      <div style={{ width: "36px" }} />
    </header>
  );
}

export default function AvaliacaoPageWrapper() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>Carregando…</p>
      </div>
    }>
      <AvaliacaoPage />
    </Suspense>
  );
}
