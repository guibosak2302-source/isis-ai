"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface Etapa {
  descricao: string;
  valor: number;
  status: "pendente" | "liberado";
}

interface PagamentoData {
  id: string;
  valor: number | null;
  status: string;
  etapas: Etapa[] | null;
  etapa_atual: number;
  valor_liberado: number;
  contrato_id: string;
}

interface ContratoData {
  id: string;
  valor_total: number | null;
  etapas: Etapa[] | null;
  contratante_id: string;
  prestador: { full_name: string | null } | null;
}

export default function EtapasPage() {
  const params = useParams();
  const router = useRouter();
  const pagamentoId = params.id as string;

  const [pagamento, setPagamento] = useState<PagamentoData | null>(null);
  const [contrato, setContrato] = useState<ContratoData | null>(null);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [isContratante, setIsContratante] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liberando, setLiberando] = useState<number | null>(null);
  const [msgs, setMsgs] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const { data: pag } = await supabase
        .from("pagamentos")
        .select("id, valor, status, etapas, etapa_atual, valor_liberado, contrato_id")
        .eq("id", pagamentoId)
        .single();

      if (!pag) { setLoading(false); return; }
      setPagamento(pag as PagamentoData);

      const { data: cont } = await supabase
        .from("contratos")
        .select(`id, valor_total, etapas, contratante_id, prestador:prestador_id ( full_name )`)
        .eq("id", (pag as PagamentoData).contrato_id)
        .single();

      const c = cont as unknown as ContratoData | null;
      setContrato(c);
      setIsContratante(c?.contratante_id === user.id);

      // Resolve stages: pagamento.etapas > contrato.etapas > default single stage
      const pagEtapas = (pag as PagamentoData).etapas;
      const contEtapas = c?.etapas ?? null;
      const valorTotal = (pag as PagamentoData).valor ?? c?.valor_total ?? 0;

      if (pagEtapas && pagEtapas.length > 0) {
        setEtapas(pagEtapas);
      } else if (contEtapas && contEtapas.length > 0) {
        // Mark stages as liberado based on etapa_atual
        const etapaAtual = (pag as PagamentoData).etapa_atual ?? 0;
        setEtapas(
          contEtapas.map((e, i) => ({
            ...e,
            status: i < etapaAtual ? "liberado" : "pendente",
          }))
        );
      } else {
        // Default: 3 equal stages
        const part = Math.round((valorTotal / 3) * 100) / 100;
        const etapaAtual = (pag as PagamentoData).etapa_atual ?? 0;
        setEtapas([
          { descricao: "Início do serviço", valor: part, status: etapaAtual > 0 ? "liberado" : "pendente" },
          { descricao: "Metade do serviço concluída", valor: part, status: etapaAtual > 1 ? "liberado" : "pendente" },
          { descricao: "Serviço finalizado", valor: valorTotal - part * 2, status: etapaAtual > 2 ? "liberado" : "pendente" },
        ]);
      }

      setLoading(false);
    }
    load();
  }, [pagamentoId, router]);

  async function liberarEtapa(index: number) {
    if (liberando !== null) return;
    setLiberando(index);
    setMsgs((prev) => ({ ...prev, [index]: "" }));
    setError("");

    try {
      const res = await fetch("/api/liberar-etapa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagamento_id: pagamentoId, etapa_index: index }),
      });
      const json = await res.json() as {
        etapas?: Etapa[];
        etapa_atual?: number;
        valor_liberado?: number;
        concluido?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Erro desconhecido");

      setEtapas(json.etapas ?? etapas);
      setPagamento((prev) =>
        prev
          ? {
              ...prev,
              etapa_atual: json.etapa_atual ?? prev.etapa_atual,
              valor_liberado: json.valor_liberado ?? prev.valor_liberado,
              status: json.concluido ? "liberado" : prev.status,
            }
          : prev
      );
      setMsgs((prev) => ({ ...prev, [index]: "Etapa liberada com sucesso!" }));
    } catch (e) {
      setError((e as Error).message);
    }
    setLiberando(null);
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555", fontFamily: "var(--font-inter), Inter, sans-serif" }}>Carregando etapas…</p>
      </div>
    );
  }

  if (!pagamento) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#E24B4A", fontFamily: "var(--font-inter), Inter, sans-serif" }}>Pagamento não encontrado.</p>
      </div>
    );
  }

  const valorTotal = pagamento.valor ?? contrato?.valor_total ?? 0;
  const valorLiberado = pagamento.valor_liberado ?? 0;
  const progressPct = valorTotal > 0 ? Math.round((valorLiberado / valorTotal) * 100) : 0;
  const totalLiberadas = etapas.filter((e) => e.status === "liberado").length;
  const prestadorNome = contrato?.prestador?.full_name ?? "Prestador";

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "48px" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href={`/pagamento/${pagamentoId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
          <ArrowLeftIcon />
        </Link>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Etapas do pagamento</span>
        <div style={{ width: "36px" }} />
      </header>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "72px 16px 0" }}>
        {/* Prestador badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#F0F0F0" }}>{prestadorNome.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#555555" }}>Prestador</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>{prestadorNome}</p>
          </div>
        </div>

        {/* Progress summary */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "18px 16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "12px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Valor liberado</p>
              <p style={{ fontSize: "22px", fontWeight: 700, color: "#FFD11A" }}>
                R$ {valorLiberado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "11px", color: "#555555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Total</p>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#888888" }}>
                R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: "6px", borderRadius: "999px", backgroundColor: "#2E2E2E", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, backgroundColor: "#FFD11A", borderRadius: "999px", transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            <p style={{ fontSize: "11px", color: "#FFD11A" }}>{progressPct}% liberado</p>
            <p style={{ fontSize: "11px", color: "#555555" }}>{totalLiberadas}/{etapas.length} etapas</p>
          </div>
        </div>

        {error && (
          <p style={{ fontSize: "13px", color: "#E24B4A", textAlign: "center", marginBottom: "16px" }}>{error}</p>
        )}

        {/* Etapas list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {etapas.map((etapa, i) => {
            const isLiberado = etapa.status === "liberado";
            const isNext = !isLiberado && (i === 0 || etapas[i - 1].status === "liberado");
            const isLoading = liberando === i;

            return (
              <div
                key={i}
                style={{
                  backgroundColor: isLiberado ? "#0D2E1E" : "#111111",
                  border: `1px solid ${isLiberado ? "#1D9E7540" : isNext ? "#FFD11A30" : "#2E2E2E"}`,
                  borderRadius: "14px",
                  padding: "16px",
                }}
              >
                {/* Etapa header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: isContratante && isNext ? "14px" : "0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      backgroundColor: isLiberado ? "#1D9E75" : isNext ? "#FFD11A20" : "#1A1A1A",
                      border: `1px solid ${isLiberado ? "#1D9E75" : isNext ? "#FFD11A" : "#3A3A3A"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isLiberado
                        ? <CheckIcon />
                        : <span style={{ fontSize: "11px", fontWeight: 600, color: isNext ? "#FFD11A" : "#555555" }}>{i + 1}</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: isLiberado ? "#1D9E75" : "#F0F0F0", marginBottom: "2px" }}>
                        Etapa {i + 1}
                      </p>
                      <p style={{ fontSize: "12px", color: "#888888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {etapa.descricao}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: isLiberado ? "#1D9E75" : "#FFD11A" }}>
                      R$ {etapa.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p style={{ fontSize: "11px", color: isLiberado ? "#1D9E7580" : "#555555", marginTop: "2px" }}>
                      {isLiberado ? "Liberado" : isNext ? "Próxima" : "Pendente"}
                    </p>
                  </div>
                </div>

                {/* Release button — only for contratante on next unlockable stage */}
                {isContratante && isNext && !isLiberado && (
                  <button
                    onClick={() => liberarEtapa(i)}
                    disabled={isLoading}
                    style={{
                      width: "100%", height: "42px",
                      backgroundColor: isLoading ? "#3A3A3A" : "#FFD11A",
                      color: isLoading ? "#888888" : "#0F0F0F",
                      border: "none", borderRadius: "999px",
                      fontSize: "13px", fontWeight: 600,
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Liberando…" : "Liberar pagamento desta etapa"}
                  </button>
                )}

                {msgs[i] && (
                  <p style={{ fontSize: "12px", color: "#1D9E75", textAlign: "center", marginTop: "8px" }}>{msgs[i]}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* All done */}
        {etapas.length > 0 && etapas.every((e) => e.status === "liberado") && (
          <div style={{ backgroundColor: "#0D2E1E", border: "1px solid #1D9E75", borderRadius: "14px", padding: "20px", marginTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "24px", marginBottom: "8px" }}>✓</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#1D9E75" }}>Todos os pagamentos liberados!</p>
            <p style={{ fontSize: "12px", color: "#888888", marginTop: "4px" }}>O serviço foi concluído com sucesso.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>;
}
function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
