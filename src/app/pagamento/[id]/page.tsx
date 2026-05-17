"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface Pagamento {
  id: string;
  valor: number | null;
  status: string;
  asaas_id: string | null;
  pix_qrcode: string | null;
  pix_copia_cola: string | null;
  created_at: string;
}

interface Contrato {
  id: string;
  valor_total: number | null;
  descricao: string | null;
}

const STATUS: Record<string, { label: string; color: string }> = {
  pendente:   { label: "Aguardando pagamento", color: "#FF7A1A" },
  aguardando: { label: "Aguardando confirmação", color: "#3B82F6" },
  pago:       { label: "Pago",                  color: "#1D9E75" },
  liberado:   { label: "Liberado",              color: "#1D9E75" },
  cancelado:  { label: "Cancelado",             color: "#E24B4A" },
};

export default function PagamentoPage() {
  const params  = useParams();
  const router  = useRouter();
  const contratoId = params.id as string;

  const [contrato,   setContrato]   = useState<Contrato | null>(null);
  const [pagamento,  setPagamento]  = useState<Pagamento | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [creating,   setCreating]   = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [verifying,  setVerifying]  = useState(false);
  const [verifyMsg,  setVerifyMsg]  = useState("");
  const [error,      setError]      = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }

      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from("contratos").select("id, valor_total, descricao").eq("id", contratoId).single(),
        supabase.from("pagamentos").select("*").eq("contrato_id", contratoId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);

      setContrato(c as Contrato | null);
      setPagamento(p as Pagamento | null);
      setLoading(false);
    }
    load();
  }, [contratoId, router]);

  async function criarCobranca() {
    if (!contrato || creating) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contrato_id: contratoId,
          valor: contrato.valor_total ?? 0,
          descricao: contrato.descricao?.slice(0, 100) ?? "Serviço Bico AI",
        }),
      });
      const json = await res.json() as { id?: string; pix_qrcode?: string; pix_copia_cola?: string; asaas_id?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Erro desconhecido");
      setPagamento({
        id: json.id!,
        valor: contrato.valor_total,
        status: "pendente",
        asaas_id: json.asaas_id ?? null,
        pix_qrcode: json.pix_qrcode ?? null,
        pix_copia_cola: json.pix_copia_cola ?? null,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      setError((e as Error).message);
    }
    setCreating(false);
  }

  async function verificarPagamento() {
    if (!pagamento?.asaas_id || verifying) return;
    setVerifying(true);
    setVerifyMsg("");
    try {
      const res = await fetch("/api/verificar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagamento_id: pagamento.id, asaas_id: pagamento.asaas_id }),
      });
      const json = await res.json() as { status?: string; pago?: boolean; error?: string };
      if (json.pago) {
        setPagamento((prev) => prev ? { ...prev, status: "pago" } : prev);
        setVerifyMsg("Pagamento confirmado!");
      } else {
        setPagamento((prev) => prev ? { ...prev, status: json.status ?? prev.status } : prev);
        setVerifyMsg("Pagamento ainda não confirmado. Tente novamente em instantes.");
      }
    } catch {
      setVerifyMsg("Erro ao verificar. Tente novamente.");
    }
    setVerifying(false);
  }

  function copiar() {
    if (!pagamento?.pix_copia_cola) return;
    navigator.clipboard.writeText(pagamento.pix_copia_cola);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>Carregando…</p>
      </div>
    );
  }

  const st = STATUS[pagamento?.status ?? "pendente"] ?? STATUS.pendente;

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "40px" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href={`/contrato/${contratoId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
          <ArrowLeftIcon />
        </Link>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Bico Pay</span>
        <div style={{ width: "36px" }} />
      </header>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "72px 16px 0" }}>
        {/* Logo badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PixIcon />
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0" }}>Pagamento Pix</p>
            <p style={{ fontSize: "12px", color: "#555555" }}>via Bico Pay · Asaas</p>
          </div>
        </div>

        {/* Valor */}
        {contrato?.valor_total != null && (
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#888888" }}>Valor</span>
            <span style={{ fontSize: "22px", fontWeight: 700, color: "#FFD11A" }}>
              R$ {contrato.valor_total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {/* Status */}
        {pagamento && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: st.color, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: "13px", color: st.color, fontWeight: 500 }}>{st.label}</span>
          </div>
        )}

        {!pagamento ? (
          /* No payment yet */
          <div style={{ textAlign: "center", paddingTop: "20px" }}>
            <p style={{ fontSize: "14px", color: "#888888", marginBottom: "24px", lineHeight: 1.6 }}>
              Gere a cobrança Pix para pagar com segurança via Bico Pay.
            </p>
            {error && <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "14px" }}>{error}</p>}
            <button
              onClick={criarCobranca}
              disabled={creating}
              style={{ width: "100%", height: "52px", backgroundColor: creating ? "#3A3A3A" : "#FFD11A", color: creating ? "#888888" : "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: creating ? "not-allowed" : "pointer" }}
            >
              {creating ? "Gerando cobrança…" : "Gerar cobrança Pix"}
            </button>
          </div>
        ) : (
          <>
            {/* QR Code */}
            {pagamento.pix_qrcode && pagamento.status !== "pago" && (
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${pagamento.pix_qrcode}`}
                  alt="QR Code Pix"
                  style={{ width: "100%", maxWidth: "240px", height: "auto", display: "block" }}
                />
              </div>
            )}

            {/* Pago state */}
            {pagamento.status === "pago" && (
              <div style={{ backgroundColor: "#0D2E1E", border: "1px solid #1D9E75", borderRadius: "14px", padding: "24px", marginBottom: "20px", textAlign: "center" }}>
                <p style={{ fontSize: "32px", marginBottom: "8px" }}>✓</p>
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#1D9E75" }}>Pagamento confirmado!</p>
                <p style={{ fontSize: "13px", color: "#888888", marginTop: "4px" }}>O valor será liberado ao prestador após conclusão do serviço.</p>
              </div>
            )}

            {/* Copia e cola */}
            {pagamento.pix_copia_cola && pagamento.status !== "pago" && (
              <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
                <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Pix Copia e Cola</p>
                <p style={{ fontSize: "11px", color: "#888888", wordBreak: "break-all", lineHeight: 1.6, marginBottom: "12px" }}>
                  {pagamento.pix_copia_cola}
                </p>
                <button
                  onClick={copiar}
                  style={{ width: "100%", height: "40px", backgroundColor: copied ? "#1D9E75" : "transparent", color: copied ? "#FFFFFF" : "#FFD11A", border: `1px solid ${copied ? "#1D9E75" : "#FFD11A"}`, borderRadius: "999px", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
                >
                  {copied ? "✓ Copiado!" : "Copiar código"}
                </button>
              </div>
            )}

            {/* Já paguei */}
            {pagamento.status !== "pago" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={verificarPagamento}
                  disabled={verifying}
                  style={{ width: "100%", height: "50px", backgroundColor: verifying ? "#3A3A3A" : "#FFD11A", color: verifying ? "#888888" : "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: verifying ? "not-allowed" : "pointer" }}
                >
                  {verifying ? "Verificando…" : "Já paguei"}
                </button>
                {verifyMsg && (
                  <p style={{ fontSize: "13px", color: verifyMsg.includes("confirmado") ? "#1D9E75" : "#888888", textAlign: "center" }}>
                    {verifyMsg}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>;
}
function PixIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}
