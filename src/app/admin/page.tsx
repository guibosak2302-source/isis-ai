import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/* ─── Auth guard ──────────────────────────────────────────── */
export default async function AdminPage() {
  const store = await cookies();
  if (store.get("bico_admin")?.value !== "guilherme2024") {
    redirect("/admin/login");
  }
  return <Dashboard />;
}

/* ─── Dashboard ───────────────────────────────────────────── */
function Dashboard() {
  return (
    <div style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <Topbar />
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 24px 48px" }}>
        <KpiGrid />
        <Gap h={28} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
          <GrowthChart />
          <RegionMap />
        </div>
        <Gap h={28} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <NewUsers />
          <RecentOrders />
        </div>
        <Gap h={28} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <Alerts />
          <ConversionFunnel />
          <TopCategories />
        </div>
        <Gap h={28} />
        <QuickActions />
        <Gap h={28} />
        <Footer />
      </div>
    </div>
  );
}

/* ─── Topbar ──────────────────────────────────────────────── */
function Topbar() {
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
        <span style={{ fontSize: "10px", fontWeight: 700, color: "#E24B4A", backgroundColor: "rgba(226,75,74,0.12)", border: "1px solid rgba(226,75,74,0.3)", borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.06em" }}>ADMIN</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "13px", color: "#888888" }}>Olá, <span style={{ color: "#F0F0F0", fontWeight: 500 }}>Guilherme</span></span>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "34px",
            padding: "0 14px",
            backgroundColor: "#111111",
            border: "1px solid #1E1E1E",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 500,
            color: "#F0F0F0",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          <RefreshIcon /> Atualizar
        </button>
      </div>
    </header>
  );
}

/* ─── KPI Grid ────────────────────────────────────────────── */
const KPIS = [
  { value: "1.247",    valueColor: "#F0F0F0", label: "Usuários cadastrados", delta: "+12%", icon: <UserKpiIcon /> },
  { value: "384",      valueColor: "#F0F0F0", label: "Pedidos criados",      delta: "+8%",  icon: <OrderKpiIcon /> },
  { value: "127",      valueColor: "#F0F0F0", label: "Contratos assinados",  delta: "+23%", icon: <ContractKpiIcon /> },
  { value: "R$ 48.200",valueColor: "#FFD11A", label: "Volume Bico Pay",      delta: "+31%", icon: <PayKpiIcon /> },
];

function KpiGrid() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
      {KPIS.map(({ value, valueColor, label, delta, icon }) => (
        <div key={label} style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "14px", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ width: "38px", height: "38px", backgroundColor: "#1A1A1A", border: "1px solid #222222", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {icon}
            </div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#1D9E75", backgroundColor: "rgba(29,158,117,0.1)", border: "1px solid rgba(29,158,117,0.2)", borderRadius: "999px", padding: "3px 8px" }}>
              {delta}
            </span>
          </div>
          <p style={{ fontSize: "28px", fontWeight: 700, color: valueColor, letterSpacing: "-0.02em", marginBottom: "4px" }}>{value}</p>
          <p style={{ fontSize: "12px", color: "#888888" }}>{label}</p>
          <p style={{ fontSize: "11px", color: "#555555", marginTop: "4px" }}>esta semana</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Growth Chart ────────────────────────────────────────── */
const CHART_DATA = [820, 860, 910, 965, 1020, 1080, 1150, 1200, 1247];
const CHART_LABELS = ["01", "05", "09", "13", "17", "21", "24", "27", "Hoje"];

function GrowthChart() {
  const W = 680; const H = 160; const PX = 40; const PY = 16;
  const innerW = W - PX * 2; const innerH = H - PY * 2;
  const minV = Math.min(...CHART_DATA); const maxV = Math.max(...CHART_DATA);
  const range = maxV - minV || 1;
  const pts = CHART_DATA.map((v, i) => ({
    x: PX + (i / (CHART_DATA.length - 1)) * innerW,
    y: PY + (1 - (v - minV) / range) * innerH,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L ${pts[pts.length - 1].x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`;

  return (
    <Card title="Crescimento de usuários — últimos 30 dias">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "160px", overflow: "visible" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD11A" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFD11A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={PX} y1={PY + t * innerH} x2={W - PX} y2={PY + t * innerH} stroke="#1E1E1E" strokeWidth="1" />
        ))}
        {/* Area */}
        <path d={areaPath} fill="url(#areaGrad)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#FFD11A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#FFD11A" stroke="#0A0A0A" strokeWidth="1.5" />
        ))}
        {/* X labels */}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H + 4} textAnchor="middle" fontSize="10" fill="#555555" fontFamily="Inter, sans-serif">{CHART_LABELS[i]}</text>
        ))}
        {/* Y labels */}
        {[minV, Math.round((minV + maxV) / 2), maxV].map((v, i) => (
          <text key={i} x={PX - 8} y={PY + (1 - (v - minV) / range) * innerH + 4} textAnchor="end" fontSize="10" fill="#555555" fontFamily="Inter, sans-serif">{v}</text>
        ))}
      </svg>
    </Card>
  );
}

/* ─── Region Map ──────────────────────────────────────────── */
const REGIONS = [
  { city: "Taubaté",              orders: 142, hot: true  },
  { city: "São José dos Campos",  orders: 98,  hot: false },
  { city: "Guaratinguetá",        orders: 67,  hot: false },
  { city: "Lorena",               orders: 43,  hot: false },
  { city: "Jacareí",              orders: 38,  hot: false },
];

function RegionMap() {
  const max = 142;
  return (
    <Card title="Pedidos por região">
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {REGIONS.map(({ city, orders, hot }) => (
          <div key={city}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#F0F0F0" }}>{city}</span>
                {hot && <span style={{ fontSize: "10px" }}>🔥</span>}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0" }}>{orders}</span>
            </div>
            <div style={{ height: "4px", backgroundColor: "#1E1E1E", borderRadius: "999px", overflow: "hidden" }}>
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
  { name: "Lucas Ferreira",   email: "lucas@email.com",    type: "Contratante", city: "Taubaté",             time: "14:32" },
  { name: "Ana Paula Silva",  email: "anapaula@email.com", type: "Prestador",   city: "SJC",                 time: "13:18" },
  { name: "Roberto Nunes",    email: "roberto@email.com",  type: "Prestador",   city: "Guaratinguetá",        time: "12:05" },
  { name: "Carla Mendonça",   email: "carla@email.com",    type: "Contratante", city: "Taubaté",             time: "10:47" },
  { name: "Felipe Torres",    email: "felipe@email.com",   type: "Prestador",   city: "Lorena",              time: "09:21" },
];

function NewUsers() {
  return (
    <Card title="Novos usuários hoje">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {NEW_USERS.map(({ name, email, type, city, time }, i) => (
          <div
            key={email}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 0",
              borderBottom: i < NEW_USERS.length - 1 ? "1px solid #1E1E1E" : "none",
            }}
          >
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E1E1E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0" }}>{name[0]}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", marginBottom: "1px" }}>{name}</p>
              <p style={{ fontSize: "11px", color: "#555555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email} · {city}</p>
            </div>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "999px",
                backgroundColor: type === "Contratante" ? "rgba(55,138,221,0.12)" : "rgba(29,158,117,0.12)",
                color: type === "Contratante" ? "#378ADD" : "#1D9E75",
                border: `1px solid ${type === "Contratante" ? "rgba(55,138,221,0.25)" : "rgba(29,158,117,0.25)"}`,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {type}
            </span>
            <span style={{ fontSize: "11px", color: "#555555", flexShrink: 0 }}>{time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Recent Orders ───────────────────────────────────────── */
const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  "Buscando":        { bg: "rgba(255,209,26,0.1)",  color: "#FFD11A", border: "rgba(255,209,26,0.25)"  },
  "Com candidatos":  { bg: "rgba(55,138,221,0.1)",  color: "#378ADD", border: "rgba(55,138,221,0.25)"  },
  "Contratado":      { bg: "rgba(29,158,117,0.1)",  color: "#1D9E75", border: "rgba(29,158,117,0.25)"  },
  "Concluído":       { bg: "rgba(136,136,136,0.1)", color: "#888888", border: "rgba(136,136,136,0.25)" },
};

const RECENT_ORDERS = [
  { cat: "🎨 Pintura",   desc: "3 cômodos · apartamento",  city: "Taubaté",       status: "Com candidatos", value: "R$ 480", time: "14:55" },
  { cat: "⚡ Elétrica",  desc: "Instalação de tomadas",     city: "SJC",           status: "Buscando",       value: "—",      time: "14:30" },
  { cat: "🧹 Faxina",    desc: "Casa 120m²",                city: "Taubaté",       status: "Contratado",     value: "R$ 280", time: "13:10" },
  { cat: "🔧 Hidráulica",desc: "Vazamento banheiro",        city: "Guaratinguetá", status: "Concluído",      value: "R$ 320", time: "11:42" },
  { cat: "🌿 Jardinagem",desc: "Poda e limpeza quintal",    city: "Lorena",        status: "Buscando",       value: "—",      time: "10:00" },
];

function RecentOrders() {
  return (
    <Card title="Pedidos recentes">
      <div style={{ display: "flex", flexDirection: "column" }}>
        {RECENT_ORDERS.map(({ cat, desc, city, status, value, time }, i) => {
          const s = STATUS_STYLE[status] ?? STATUS_STYLE["Concluído"];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: i < RECENT_ORDERS.length - 1 ? "1px solid #1E1E1E" : "none" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#F0F0F0", marginBottom: "1px" }}>{cat}</p>
                <p style={{ fontSize: "11px", color: "#555555" }}>{desc} · {city}</p>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, flexShrink: 0, whiteSpace: "nowrap" }}>
                {status}
              </span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0", flexShrink: 0, minWidth: "48px", textAlign: "right" }}>{value}</span>
              <span style={{ fontSize: "11px", color: "#555555", flexShrink: 0 }}>{time}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ─── Alerts ──────────────────────────────────────────────── */
const ALERTS = [
  { icon: "⚠️", text: "3 contratos aguardando assinatura há mais de 24h",   color: "#FFD11A" },
  { icon: "🔴", text: "2 pagamentos com erro de processamento",               color: "#E24B4A" },
  { icon: "✅", text: "Servidor Supabase: Healthy",                           color: "#1D9E75" },
  { icon: "✅", text: "Vercel Deploy: OK",                                    color: "#1D9E75" },
  { icon: "⚠️", text: "5 prestadores com Score abaixo de 60",                color: "#FFD11A" },
];

function Alerts() {
  return (
    <Card title="Alertas do sistema">
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {ALERTS.map(({ icon, text, color }, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              padding: "10px 12px",
              backgroundColor: "#0A0A0A",
              border: "1px solid #1E1E1E",
              borderLeft: `3px solid ${color}`,
              borderRadius: "8px",
            }}
          >
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
  { label: "Cadastros",   value: 1247, pct: 100,  color: "#378ADD" },
  { label: "Pedidos",     value: 384,  pct: 31,   color: "#FFD11A" },
  { label: "Contratos",   value: 127,  pct: 33,   color: "#FF7A1A" },
  { label: "Pagamentos",  value: 98,   pct: 77,   color: "#1D9E75" },
];

function ConversionFunnel() {
  return (
    <Card title="Funil de conversão">
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {FUNNEL.map(({ label, value, pct, color }, i) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <span style={{ fontSize: "10px", color: "#555555" }}>→</span>}
                <span style={{ fontSize: "12px", color: "#F0F0F0" }}>{label}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#F0F0F0" }}>{value.toLocaleString("pt-BR")}</span>
                {i > 0 && <span style={{ fontSize: "10px", color: "#555555" }}>({pct}%)</span>}
              </div>
            </div>
            <div style={{ height: "4px", backgroundColor: "#1E1E1E", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: `${i === 0 ? 100 : pct}%`, height: "100%", backgroundColor: color, borderRadius: "999px" }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Top Categories ──────────────────────────────────────── */
const CATS = [
  { name: "Pintura",   pct: 28 },
  { name: "Elétrica",  pct: 19 },
  { name: "Faxina",    pct: 15 },
  { name: "Reformas",  pct: 12 },
  { name: "Outros",    pct: 26 },
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
            <div style={{ height: "4px", backgroundColor: "#1E1E1E", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#FFD11A", borderRadius: "999px" }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Quick Actions ───────────────────────────────────────── */
const ACTIONS = [
  { label: "Enviar notificação para todos", bg: "#378ADD", color: "#FFFFFF", border: "transparent" },
  { label: "Exportar relatório CSV",        bg: "#1D9E75", color: "#FFFFFF", border: "transparent" },
  { label: "Ver logs do sistema",           bg: "transparent", color: "#888888", border: "#1E1E1E" },
  { label: "Banir usuário",                 bg: "transparent", color: "#E24B4A", border: "#E24B4A" },
];

function QuickActions() {
  return (
    <div style={{ backgroundColor: "#111111", border: "1px solid #1E1E1E", borderRadius: "14px", padding: "20px" }}>
      <p style={{ fontSize: "13px", fontWeight: 600, color: "#F0F0F0", marginBottom: "14px" }}>Ações rápidas</p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {ACTIONS.map(({ label, bg, color, border }) => (
          <button
            key={label}
            style={{
              height: "38px",
              padding: "0 18px",
              borderRadius: "999px",
              backgroundColor: bg,
              color,
              border: `1px solid ${border}`,
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <div style={{ borderTop: "1px solid #1E1E1E", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ fontSize: "11px", color: "#444444" }}>Bico AI Admin · v1.0 · Atualizado há 2 min</p>
      <div style={{ display: "flex", gap: "16px" }}>
        <span style={{ fontSize: "11px", color: "#444444" }}>Supabase ✅</span>
        <span style={{ fontSize: "11px", color: "#444444" }}>Vercel ✅</span>
      </div>
    </div>
  );
}

/* ─── Shared Card ─────────────────────────────────────────── */
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
function UserKpiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function OrderKpiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}
function ContractKpiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function PayKpiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD11A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
