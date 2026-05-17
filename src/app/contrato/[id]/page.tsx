"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import jsPDF from "jspdf";

type SignState = "idle" | "loading" | "done" | "error";
type ConcluirState = "idle" | "loading" | "done";

interface Contrato {
  id: string;
  descricao: string | null;
  valor_total: number | null;
  status: string;
  created_at: string;
  contratante: { id: string; full_name: string | null } | null;
  prestador: { id: string; full_name: string | null } | null;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  rascunho:              { label: "Rascunho",               color: "#888888" },
  aguardando_assinatura: { label: "Aguardando assinatura",  color: "#FF7A1A" },
  assinado:              { label: "Assinado",               color: "#1D9E75" },
  em_andamento:          { label: "Em andamento",           color: "#3B82F6" },
  concluido:             { label: "Concluído",              color: "#1D9E75" },
  cancelado:             { label: "Cancelado",              color: "#E24B4A" },
};

export default function ContratoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [signState, setSignState] = useState<SignState>("idle");
  const [concluirState, setConcluirState] = useState<ConcluirState>("idle");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("contratos")
        .select(`
          id, descricao, valor_total, status, created_at,
          contratante:contratante_id ( id, full_name ),
          prestador:prestador_id ( id, full_name )
        `)
        .eq("id", id)
        .single();

      setContrato(data as unknown as Contrato);
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function gerarPDF() {
    if (!contrato || downloadingPdf) return;
    setDownloadingPdf(true);

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇO", 105, 20, { align: "center" });

    // Separator line
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Contract body
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const linhas = doc.splitTextToSize(contrato.descricao ?? "", 170);
    doc.text(linhas, 20, 35);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text("Gerado por Bico AI — bico.ai", 105, 285, { align: "center" });

    doc.save(`contrato-${contrato.id}.pdf`);

    // Update status in DB — use 'aguardando_assinatura' (valid schema value)
    const supabase = createClient();
    const { data: updated } = await supabase
      .from("contratos")
      .update({ status: "aguardando_assinatura" })
      .eq("id", contrato.id)
      .select("status")
      .single();

    if (updated) {
      setContrato((prev) => prev ? { ...prev, status: updated.status } : prev);
    }

    setDownloadingPdf(false);
  }

  async function handleAssinar() {
    if (!contrato || signState === "loading") return;
    setSignState("loading");
    try {
      const res = await fetch("/api/assinar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contrato_id: contrato.id }),
      });
      const json = await res.json() as { link?: string; error?: string };
      if (!res.ok || !json.link) throw new Error(json.error ?? "Erro desconhecido");
      window.open(json.link, "_blank", "noopener,noreferrer");
      setContrato((prev) => prev ? { ...prev, status: "aguardando_assinatura" } : prev);
      setSignState("done");
    } catch {
      setSignState("error");
    }
  }

  async function handleConcluir() {
    if (!contrato || concluirState !== "idle") return;
    setConcluirState("loading");
    const supabase = createClient();
    await supabase
      .from("contratos")
      .update({ status: "concluido" })
      .eq("id", contrato.id);
    setContrato((prev) => prev ? { ...prev, status: "concluido" } : prev);

    // Trigger score recalculation for the prestador
    const prestadorId = contrato.prestador?.id;
    if (prestadorId) {
      void fetch("/api/calcular-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prestador_id: prestadorId }),
      });
    }
    setConcluirState("done");
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>Carregando contrato…</p>
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

  const status = STATUS_LABEL[contrato.status] ?? STATUS_LABEL.rascunho;
  const dataFormatada = new Date(contrato.created_at).toLocaleDateString("pt-BR");

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "40px" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href="/conversas" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
          <ArrowLeftIcon />
        </Link>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Contrato</span>
        <div style={{ width: "36px" }} />
      </header>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "72px 16px 0" }}>
        {/* Status + date */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: status.color, backgroundColor: `${status.color}18`, border: `1px solid ${status.color}40`, borderRadius: "6px", padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {status.label}
          </span>
          <span style={{ fontSize: "12px", color: "#555555" }}>{dataFormatada}</span>
        </div>

        {/* Parties */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <PartyCard label="Contratante" name={contrato.contratante?.full_name ?? "—"} />
          <PartyCard label="Prestador" name={contrato.prestador?.full_name ?? "—"} />
        </div>

        {/* Value */}
        {contrato.valor_total != null && (
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", color: "#888888" }}>Valor total</span>
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#FFD11A" }}>
              R$ {contrato.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Contract body */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>Texto do contrato</p>
          <div style={{ fontSize: "13px", color: "#C0C0C0", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
            {contrato.descricao ?? "Sem conteúdo."}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href={`/pagamento/${contrato.id}`}
            style={{ width: "100%", height: "50px", backgroundColor: "#1A1A1A", color: "#FFD11A", border: "1px solid #FFD11A40", borderRadius: "999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
          >
            <PixIcon /> Pagar com Pix
          </Link>
          <button
            onClick={gerarPDF}
            disabled={downloadingPdf}
            style={{
              width: "100%", height: "50px", backgroundColor: "transparent",
              color: downloadingPdf ? "#555555" : "#F0F0F0",
              border: `1px solid ${downloadingPdf ? "#2A2A2A" : "#3A3A3A"}`,
              borderRadius: "999px", fontSize: "14px", fontWeight: 500,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: downloadingPdf ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <DownloadIcon />
            {downloadingPdf ? "Gerando PDF…" : "Baixar PDF"}
          </button>
          <button
            onClick={handleAssinar}
            disabled={signState === "loading" || signState === "done"}
            style={{
              width: "100%", height: "50px",
              backgroundColor: signState === "done" ? "#1D9E75" : signState === "loading" ? "#3A3A3A" : "#FFD11A",
              color: signState === "loading" ? "#888888" : signState === "done" ? "#FFFFFF" : "#0F0F0F",
              border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: signState === "loading" || signState === "done" ? "not-allowed" : "pointer",
            }}
          >
            {signState === "loading" ? "Enviando para assinatura…"
              : signState === "done" ? "✓ Contrato enviado para assinatura!"
              : "Assinar contrato"}
          </button>
          {signState === "error" && (
            <p style={{ fontSize: "12px", color: "#E24B4A", textAlign: "center", marginTop: "4px" }}>
              Erro ao enviar. Verifique o token do Clicksign e tente novamente.
            </p>
          )}

          {/* Marcar como concluído — only visible to contratante when contract is not already done */}
          {userId && contrato.status !== "concluido" && contrato.status !== "cancelado" && (
            <button
              onClick={handleConcluir}
              disabled={concluirState !== "idle"}
              style={{
                width: "100%", height: "50px",
                backgroundColor: concluirState === "done" ? "#1D9E75" : "transparent",
                color: concluirState === "done" ? "#FFFFFF" : concluirState === "loading" ? "#555555" : "#1D9E75",
                border: `1px solid ${concluirState === "done" ? "#1D9E75" : concluirState === "loading" ? "#2A2A2A" : "#1D9E7540"}`,
                borderRadius: "999px", fontSize: "14px", fontWeight: 500,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                cursor: concluirState !== "idle" ? "not-allowed" : "pointer",
              }}
            >
              {concluirState === "loading" ? "Concluindo…"
                : concluirState === "done" ? "✓ Contrato concluído!"
                : "Marcar como concluído"}
            </button>
          )}

          {/* Avaliar — shown to both parties once contract is concluded */}
          {userId && contrato.status === "concluido" && (
            <>
              {userId === contrato.contratante?.id && (
                <Link
                  href={`/avaliar/${contrato.id}`}
                  style={{ width: "100%", height: "50px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
                >
                  <StarIcon /> Avaliar prestador
                </Link>
              )}
              {userId === contrato.prestador?.id && (
                <Link
                  href={`/avaliar/${contrato.id}`}
                  style={{ width: "100%", height: "50px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
                >
                  <StarIcon /> Avaliar contratante
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PartyCard({ label, name }: { label: string; name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div style={{ flex: 1, backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "14px" }}>
      <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0" }}>{initial}</span>
        </div>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>;
}
function PixIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>;
}
function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
}
function StarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
