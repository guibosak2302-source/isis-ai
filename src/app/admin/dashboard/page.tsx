"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserRow {
  id: string;
  full_name: string | null;
  type: string | null;
  created_at: string;
  city: string | null;
  state: string | null;
}

interface DayCount {
  date: string;
  count: number;
}

interface Metrics {
  totalUsers: number;
  totalPosts: number;
  totalCandidaturas: number;
  totalContratos: number;
  totalPagamentos: number;
  valorTotal: number;
  newUsersToday: number;
  newPostsToday: number;
  lastUsers: UserRow[];
  crescimento: DayCount[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  async function loadMetrics() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/metrics?token=guilherme2024");
      const data = await res.json();
      setMetrics(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("adminAuth") !== "guilherme2024") {
      router.replace("/admin/login");
    } else {
      setOk(true);
      loadMetrics();
    }
  }, [router]);

  function exportCSV() {
    if (!metrics?.lastUsers) return;
    const header = "Nome,Tipo,Cidade,Estado,Data\n";
    const rows = metrics.lastUsers
      .map(
        (u: UserRow) =>
          `"${u.full_name ?? ""}","${u.type ?? ""}","${u.city ?? ""}","${u.state ?? ""}","${new Date(u.created_at).toLocaleDateString("pt-BR")}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bico-ai-usuarios-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!ok) return null;

  const maxCount =
    metrics?.crescimento
      ? Math.max(...metrics.crescimento.map((d) => d.count), 1)
      : 1;

  const kpis = metrics
    ? [
        {
          label: "Usuários",
          value: metrics.totalUsers,
          color: "#F0F0F0",
          sub: "total cadastrados",
        },
        {
          label: "Posts",
          value: metrics.totalPosts,
          color: "#F0F0F0",
          sub: "pedidos publicados",
        },
        {
          label: "Candidaturas",
          value: metrics.totalCandidaturas,
          color: "#F0F0F0",
          sub: "propostas enviadas",
        },
        {
          label: "Contratos",
          value: metrics.totalContratos,
          color: "#1D9E75",
          sub: "gerados",
        },
        {
          label: "Pagamentos",
          value: metrics.totalPagamentos,
          color: "#1D9E75",
          sub: "realizados",
        },
        {
          label: "Valor total",
          value: `R$ ${metrics.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          color: "#FFD11A",
          sub: "transacionado",
        },
        {
          label: "Novos hoje",
          value: metrics.newUsersToday,
          color: "#FFD11A",
          sub: "usuários",
        },
        {
          label: "Posts hoje",
          value: metrics.newPostsToday,
          color: "#F0F0F0",
          sub: "novos pedidos",
        },
      ]
    : [];

  return (
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#0A0A0A",
          borderBottom: "1px solid #1E1E1E",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 50,
        }}
      >
        <Link
          href="/admin"
          style={{ fontSize: "14px", color: "#888888", textDecoration: "none" }}
        >
          ← Admin
        </Link>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>
          Dashboard em tempo real
        </span>
        <button
          onClick={exportCSV}
          style={{
            height: "34px",
            padding: "0 14px",
            backgroundColor: "#1A1A1A",
            color: "#F0F0F0",
            border: "1px solid #2E2E2E",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "var(--font-inter), Inter, sans-serif",
          }}
        >
          Exportar CSV
        </button>
      </header>

      {/* MAIN CONTENT */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "76px 24px 48px",
        }}
      >
        {loading && !metrics && (
          <p style={{ color: "#555555", fontSize: "14px", textAlign: "center", padding: "48px 0" }}>
            Carregando métricas…
          </p>
        )}

        {/* KPI GRID */}
        {metrics && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              {kpis.map(({ label, value, color, sub }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid #2E2E2E",
                    borderRadius: "12px",
                    padding: "16px 18px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#555555",
                      marginBottom: "6px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ fontSize: "11px", color: "#555555", marginTop: "4px" }}>
                    {sub}
                  </p>
                </div>
              ))}
            </div>

            {/* GROWTH CHART */}
            <div
              style={{
                marginBottom: "24px",
                backgroundColor: "#1A1A1A",
                border: "1px solid #2E2E2E",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#F0F0F0",
                  marginBottom: "20px",
                }}
              >
                Crescimento de usuários — últimos 14 dias
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "6px",
                  height: "120px",
                }}
              >
                {metrics.crescimento.map(({ date, count }) => (
                  <div
                    key={date}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                      height: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#FFD11A",
                        borderRadius: "4px 4px 0 0",
                        height: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                        minHeight: count > 0 ? "4px" : "0px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "9px",
                        color: "#555555",
                        marginTop: "4px",
                      }}
                    >
                      {date.slice(-2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LAST 10 USERS */}
            <div
              style={{
                marginBottom: "24px",
                backgroundColor: "#1A1A1A",
                border: "1px solid #2E2E2E",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#F0F0F0",
                  marginBottom: "16px",
                }}
              >
                Últimos cadastros
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {metrics.lastUsers.map((user, i) => (
                  <div
                    key={user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 0",
                      borderBottom:
                        i < metrics.lastUsers.length - 1
                          ? "1px solid #1E1E1E"
                          : "none",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        backgroundColor: "#2A2A2A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#F0F0F0" }}>
                        {(user.full_name ?? "?")[0].toUpperCase()}
                      </span>
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#F0F0F0",
                          marginBottom: "2px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.full_name ?? "—"}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#555555",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.type ?? "—"} · {user.city ?? "—"}
                      </p>
                    </div>
                    {/* Date */}
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#555555",
                        marginLeft: "auto",
                        flexShrink: 0,
                      }}
                    >
                      {new Date(user.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
