"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Auth wrapper ────────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("adminAuth") === "guilherme2024") {
      setOk(true);
    } else {
      router.replace("/admin/login");
    }
  }, [router]);

  if (!ok) return null;
  return <Dashboard />;
}

/* ─── Dashboard shell ─────────────────────────────────────── */
function Dashboard() {
  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <Topbar />
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 24px 56px" }}>
        <KpiGrid />
        <Gap h={24} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
          <GrowthChart />
          <RegionMap />
        </div>
        <Gap h={24} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <NewUsers />
          <RecentOrders />
        </div>
        <Gap h={24} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <Alerts />
          <ConversionFunnel />
          <TopCategories />
        </div>
        <Gap h={24} />
        <AdminFooter />
      </div>
    </div>
  );
}

/* ─── Topbar ──────────────────────────────────────────────── */
function Topbar() {
  const router = useRouter();
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#0A0A0A",
        borderBottom: "1px solid #1E1E1E",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "18px", fontWeight: 700, color: "#F0F0F0", letterSpacing: "-0.02em" }}>Bico AI</span>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "#E24B4A", backgroundColor: "rgba(226,75,74,0.12)", border: "1px solid rgba(226,75,74,0.3)", borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.07em" }}>
          ADMIN
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "13px", color: "#888888" }}>
          Olá, <span style={{ color: "#F0F0F0", fontWeight: 500 }}>Guilherme</span>
        </span>
        <button
          onClick={() => { localStorage.removeItem("adminAuth"); router.push("/admin/login"); }}
          style={{ height: "32px", padding: "0 14px", backgroundColor: "transparent", border: "1px solid #1E1E1E", borderRadius: "8px", fontSize: "12px", color: "#888888", fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}

/* ─── KPI Grid ────────────────────────────────────────────── */
const KPIS = [
  { value: "1.247",     color: "#F0F0F0", label: "Usuários cadastrados", delta: "+12%", Icon: UserIcon },
  { value: "384",       color: "#F0F0F0", label: "Pedidos criados",      delta: "+8%",  Icon: OrderIcon },
  { value: "127",       color: "#F0F0F0", label: "Contratos assinados",  delta: "+23%", Icon: ContractIcon },
  { value: "R$ 48.200", color: "#FFD11A", label: "Volume Bico Pay",      delta: "+31%", Icon: PayIcon },
];

function KpiGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
      {KPIS.map(({ value, color, label, delta, Icon }) => (
        <div key={label} style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{ width: "36px", height: "36px", backgroundColor: "#1A1A1A", border: "1px solid #252525", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#1D9E75", backgroundColor: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "999px", padding: "2px 8px" }}>
              {delta}
            </span>
          </div>
          <p style={{ fontSize: "30px", fontWeight: 700, color, letterSpacing: "-0.02em", marginBottom: "4px" }}>{value}</p>
          <p style={{ fontSize: "12px", color: "#888888" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Growth Chart ────────────────────────────────────────── */
const CHART_VALUES = [180, 210, 195, 240, 280, 310, 350];
const CHART_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function GrowthChart() {
  const W = 640; const H = 150; const PX = 48; const PY = 20;
  const iW = W - PX * 2; const iH = H - PY * 2;
  const minV = Math.min(...CHART_VALUES); const maxV = Math.max(...CHART_VALUES);
  const range = maxV - minV;
  const pts = CHART_VALUES.map((v, i) => ({
    x: PX + (i / (CHART_VALUES.length - 1)) * iW,
    y: PY + (1 - (v - minV) / range) * iH,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L ${pts[pts.length-1].x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`;

  return (
    <Card title="Crescimento — últimos 7 dias">
      <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: "100%", height: "160px" }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD11A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFD11A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={PX} y1={PY + t * iH} x2={W - PX} y2={PY + t * iH} stroke="#1E1E1E" strokeWidth="1" />
        ))}
        <path d={area} fill="url(#g1)" />
        <path d={line} fill="none" stroke="#FFD11A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FFD11A" stroke="#0A0A0A" strokeWidth="2" />
        ))}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H + 14} textAnchor="middle" fontSize="11" fill="#555555" fontFamily="Inter,sans-serif">
            {CHART_LABELS[i]}
          </text>
        ))}
        {[minV, Math.round((minV + maxV) / 2), maxV].map((v, i, arr) => {
          const y = PY + (1 - (v - minV) / range) * iH;
          return (
            <text key={i} x={PX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#555555" fontFamily="Inter,sans-serif">
              {v}
            </text>
          );
        })}
      </svg>
    </Card>
  );
}

/* ─── Region Map ──────────────────────────────────────────── */
const REGIONS = [
  { city: "Taubaté",             orders: 142, hot: true },
  { city: "São José dos Campos", orders: 98,  hot: false },
  { city: "Guaratinguetá",       orders: 67,  hot: false },
  { city: "Lorena",              orders: 43,  hot: false },
  { city: "Jacareí",             orders: 38,  hot: false },
];

function RegionMap() {
  const max = 142;
  return (
    <Card title="Pedidos por região">
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {REGIONS.map(({ city, orders, hot }) => (
          <div key={city}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "12px", color: "#F0F0F0" }}>{city} {hot && "🔥"}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0" }}>{orders}</span>
            </div>
            <div style={{ height: "4px", backgroundColor: "#1E1E1E", borderRadius: "999px" }}>
              <div style={{ width: `${(orders / max) * 100}%`, height: "100%", backgroundColor: "#FFD11A", borderRadius: "999px" }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── New Users ───────────────────────────────────────────── */
const NEW_USERS = [
  { name: "Lucas Ferreira",  email: "lucas@email.com",    type: "Contratante", city: "Taubaté",        time: "14:32" },
  { name: "Ana Paula Silva", email: "ana@email.com",       type: "Prestador",   city: "SJC",            time: "13:18" },
  { name: "Roberto Nunes",   email: "roberto@email.com",   type: "Prestador",   city: "Guaratinguetá",  time: "12:05" },
  { name: "Carla Mendonça",  email: "carla@email.com",     type: "Contratante", city: "Taubaté",        time: "10:47" },
  { name: "Felipe Torres",   email: "felipe@email.com",    type: "Prestador",   city: "Lorena",         time: "09:21" },
];

function NewUsers() {
  return (
    <Card title="Novos usuários hoje">
      {NEW_USERS.map(({ name, email, type, city, time }, i) => (
        <div key={email} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < NEW_USERS.length - 1 ? "1px solid #1E1E1E" : "none" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E1E1E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0" }}>{name[0]}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", marginBottom: "1px" }}>{name}</p>
            <p style={{ fontSize: "11px", color: "#555555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email} · {city}</p>
          </div>
          <Badge type={type} />
          <span style={{ fontSize: "11px", color: "#555555", flexShrink: 0 }}>{time}</span>
        </div>
      ))}
    </Card>
  );
}

function Badge({ type }: { type: string }) {
  const isC = type === "Contratante";
  return (
    <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: isC ? "rgba(55,138,221,0.12)" : "rgba(29,158,117,0.12)", color: isC ? "#378ADD" : "#1D9E75", border: `1px solid ${isC ? "rgba(55,138,221,0.25)" : "rgba(29,158,117,0.25)"}`, flexShrink: 0, whiteSpace: "nowrap" }}>
      {type}
    </span>
  );
}

/* ─── Recent Orders ───────────────────────────────────────── */
const STATUS: Record<string, { bg: string; color: string }> = {
  "Buscando":       { bg: "rgba(255,209,26,0.1)",  color: "#FFD11A" },
  "Com candidatos": { bg: "rgba(55,138,221,0.1)",  color: "#378ADD" },
  "Contratado":     { bg: "rgba(29,158,117,0.1)",  color: "#1D9E75" },
  "Concluído":      { bg: "rgba(136,136,136,0.1)", color: "#888888" },
};

const ORDERS = [
  { cat: "🎨 Pintura",    desc: "3 cômodos · apartamento", city: "Taubaté",       status: "Com candidatos", value: "R$ 480", time: "14:55" },
  { cat: "⚡ Elétrica",   desc: "Instalação de tomadas",    city: "SJC",           status: "Buscando",       value: "—",      time: "14:30" },
  { cat: "🧹 Faxina",     desc: "Casa 120m²",               city: "Taubaté",       status: "Contratado",     value: "R$ 280", time: "13:10" },
  { cat: "🔧 Hidráulica", desc: "Vazamento banheiro",       city: "Guaratinguetá", status: "Concluído",      value: "R$ 320", time: "11:42" },
  { cat: "🌿 Jardinagem", desc: "Poda e limpeza quintal",   city: "Lorena",        status: "Buscando",       value: "—",      time: "10:00" },
];

function RecentOrders() {
  return (
    <Card title="Pedidos recentes">
      {ORDERS.map(({ cat, desc, city, status, value, time }, i) => {
        const s = STATUS[status];
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < ORDERS.length - 1 ? "1px solid #1E1E1E" : "none" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", marginBottom: "1px" }}>{cat}</p>
              <p style={{ fontSize: "11px", color: "#555555" }}>{desc} · {city}</p>
            </div>
            <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: s.bg, color: s.color, flexShrink: 0, whiteSpace: "nowrap" }}>{status}</span>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0", flexShrink: 0, minWidth: "48px", textAlign: "right" }}>{value}</span>
            <span style={{ fontSize: "11px", color: "#555555", flexShrink: 0 }}>{time}</span>
          </div>
        );
      })}
    </Card>
  );
}

/* ─── Alerts ──────────────────────────────────────────────── */
const ALERTS = [
  { icon: "⚠️", text: "3 contratos aguardando assinatura há mais de 24h", color: "#FFD11A" },
  { icon: "🔴", text: "2 pagamentos com erro de processamento",             color: "#E24B4A" },
  { icon: "✅", text: "Servidor Supabase: Healthy",                         color: "#1D9E75" },
  { icon: "✅", text: "Vercel Deploy: OK",                                  color: "#1D9E75" },
];

function Alerts() {
  return (
    <Card title="Alertas do sistema">
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {ALERTS.map(({ icon, text, color }, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", padding: "10px 12px", backgroundColor: "#0A0A0A", border: "1px solid #1E1E1E", borderLeft: `3px solid ${color}`, borderRadius: "8px" }}>
            <span style={{ fontSize: "13px", flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Conversion Funnel ───────────────────────────────────── */
const FUNNEL = [
  { label: "Cadastros",  value: "1.247", pct: 100, color: "#378ADD" },
  { label: "Pedidos",    value: "384",   pct: 31,  color: "#FFD11A" },
  { label: "Contratos",  value: "127",   pct: 33,  color: "#FF7A1A" },
  { label: "Pagamentos", value: "98",    pct: 77,  color: "#1D9E75" },
];

function ConversionFunnel() {
  return (
    <Card title="Funil de conversão">
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {FUNNEL.map(({ label, value, pct, color }, i) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {i > 0 && <span style={{ fontSize: "10px", color: "#555555" }}>→</span>}
                <span style={{ fontSize: "12px", color: "#F0F0F0" }}>{label}</span>
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0" }}>{value}</span>
                {i > 0 && <span style={{ fontSize: "10px", color: "#555555" }}>({pct}%)</span>}
              </div>
            </div>
            <div style={{ height: "4px", backgroundColor: "#1E1E1E", borderRadius: "999px" }}>
              <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: "999px" }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Top Categories ──────────────────────────────────────── */
const CATS = [
  { name: "Pintura",  pct: 28 },
  { name: "Elétrica", pct: 19 },
  { name: "Faxina",   pct: 15 },
  { name: "Reformas", pct: 12 },
  { name: "Outros",   pct: 26 },
];

function TopCategories() {
  return (
    <Card title="Categorias mais pedidas">
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {CATS.map(({ name, pct }) => (
          <div key={name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "12px", color: "#F0F0F0" }}>{name}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#FFD11A" }}>{pct}%</span>
            </div>
            <div style={{ height: "4px", backgroundColor: "#1E1E1E", borderRadius: "999px" }}>
              <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#FFD11A", borderRadius: "999px" }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function AdminFooter() {
  return (
    <div style={{ borderTop: "1px solid #1E1E1E", paddingTop: "16px", display: "flex", justifyContent: "space-between" }}>
      <p style={{ fontSize: "11px", color: "#333333" }}>Bico AI Admin · v1.0 · Atualizado há 2 min</p>
      <div style={{ display: "flex", gap: "16px" }}>
        <span style={{ fontSize: "11px", color: "#333333" }}>Supabase ✅</span>
        <span style={{ fontSize: "11px", color: "#333333" }}>Vercel ✅</span>
      </div>
    </div>
  );
}

/* ─── Shared ──────────────────────────────────────────────── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "14px", padding: "20px" }}>
      <p style={{ fontSize: "13px", fontWeight: 600, color: "#F0F0F0", marginBottom: "16px" }}>{title}</p>
      {children}
    </div>
  );
}

function Gap({ h }: { h: number }) {
  return <div style={{ height: `${h}px` }} />;
}

/* ─── KPI Icons ───────────────────────────────────────────── */
function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function OrderIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>;
}
function ContractIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
}
function PayIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFD11A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
}
