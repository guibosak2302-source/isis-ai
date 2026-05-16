"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Data ────────────────────────────────────────────────── */
const CATEGORIES = [
  { emoji: "🎨", name: "Pintura" },
  { emoji: "⚡", name: "Elétrica" },
  { emoji: "🔧", name: "Hidráulica" },
  { emoji: "🌿", name: "Jardinagem" },
  { emoji: "🏠", name: "Reformas" },
  { emoji: "🧹", name: "Faxina" },
  { emoji: "💻", name: "Tecnologia" },
  { emoji: "📦", name: "Mudança" },
  { emoji: "🎓", name: "Aulas" },
  { emoji: "✂️", name: "Beleza" },
  { emoji: "🐾", name: "Pets" },
  { emoji: "➕", name: "Outro" },
];

const DEADLINES = ["Urgente", "Esta semana", "Este mês", "Sem pressa"];

const STEP_LABELS = ["Categoria", "Descrição", "Local", "Confirmar"];

/* ─── Page ────────────────────────────────────────────────── */
export default function NovoPedidoPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState(5);
  const [deadline, setDeadline] = useState("Esta semana");

  const canNext =
    step === 0 ? !!category :
    step === 1 ? description.trim().length > 0 :
    true;

  function next() {
    if (step < 3) setStep((s) => s + 1);
    else router.push("/pedidos");
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "100px",
        paddingBottom: "100px",
      }}
    >
      <Header onCancel={() => router.push("/feed")} />
      <ProgressBar current={step} total={4} />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 16px 0" }}>
        {step === 0 && (
          <StepCategory selected={category} onSelect={setCategory} />
        )}
        {step === 1 && (
          <StepDescription value={description} onChange={setDescription} />
        )}
        {step === 2 && (
          <StepLocation
            location={location}
            onLocation={setLocation}
            distance={distance}
            onDistance={setDistance}
            deadline={deadline}
            onDeadline={setDeadline}
          />
        )}
        {step === 3 && (
          <StepConfirmation
            category={category}
            description={description}
            location={location}
            deadline={deadline}
          />
        )}
      </div>

      <Footer
        step={step}
        isLast={step === 3}
        canNext={canNext}
        onBack={back}
        onNext={next}
      />
    </div>
  );
}

/* ─── Header ──────────────────────────────────────────────── */
function Header({ onCancel }: { onCancel: () => void }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "56px",
        backgroundColor: "#0F0F0F",
        borderBottom: "1px solid #2E2E2E",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <button
        onClick={onCancel}
        style={{
          background: "none",
          border: "none",
          color: "#888888",
          fontSize: "14px",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
          padding: 0,
        }}
      >
        Cancelar
      </button>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>
        Novo pedido
      </span>
      <div style={{ width: "60px" }} />
    </header>
  );
}

/* ─── Progress bar ────────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "56px",
        left: 0,
        right: 0,
        zIndex: 49,
        backgroundColor: "#0F0F0F",
        padding: "10px 16px 10px",
        borderBottom: "1px solid #2E2E2E",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "6px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "999px",
              backgroundColor:
                i < current ? "#1D9E75" : i === current ? "#FFD11A" : "#2E2E2E",
            }}
          />
        ))}
      </div>
      <p
        style={{
          maxWidth: "600px",
          margin: "8px auto 0",
          fontSize: "11px",
          color: "#888888",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 500,
        }}
      >
        Etapa {current + 1} de {total} — {["Categoria", "Descrição", "Local e prazo", "Confirmar"][current]}
      </p>
    </div>
  );
}

/* ─── Step 1 — Category ───────────────────────────────────── */
function StepCategory({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0F0F0", marginBottom: "4px" }}>
        Qual serviço você precisa?
      </h2>
      <p style={{ fontSize: "14px", color: "#888888", marginBottom: "20px" }}>
        Escolha a categoria
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        {CATEGORIES.map(({ emoji, name }) => {
          const active = selected === name;
          return (
            <button
              key={name}
              onClick={() => onSelect(name)}
              style={{
                backgroundColor: active ? "rgba(255,209,26,0.07)" : "#1A1A1A",
                border: `1px solid ${active ? "#FFD11A" : "#2E2E2E"}`,
                borderRadius: "12px",
                padding: "12px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-inter), Inter, sans-serif",
              }}
            >
              <span style={{ fontSize: "24px", lineHeight: 1 }}>{emoji}</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: active ? "#FFD11A" : "#F0F0F0",
                  letterSpacing: "0.01em",
                }}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 2 — Description ────────────────────────────────── */
const MAX_CHARS = 300;

function StepDescription({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0F0F0", marginBottom: "4px" }}>
        Descreva o que precisa
      </h2>
      <p style={{ fontSize: "14px", color: "#888888", marginBottom: "20px" }}>
        Quanto mais detalhes, melhor o resultado
      </p>

      {/* Textarea */}
      <div style={{ position: "relative", marginBottom: "24px" }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Ex: Preciso pintar 3 cômodos, paredes e teto. Tinta por conta do profissional."
          style={{
            width: "100%",
            minHeight: "140px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "12px",
            padding: "14px 14px 36px",
            fontSize: "14px",
            color: "#F0F0F0",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
            resize: "none",
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: "12px",
            right: "14px",
            fontSize: "11px",
            color: value.length >= MAX_CHARS ? "#FF7A1A" : "#888888",
          }}
        >
          {value.length}/{MAX_CHARS}
        </span>
      </div>

      {/* Photo section */}
      <p
        style={{
          fontSize: "11px",
          color: "#888888",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          fontWeight: 500,
          marginBottom: "10px",
        }}
      >
        Adicionar fotos
      </p>
      <p style={{ fontSize: "13px", color: "#888888", marginBottom: "10px" }}>
        Mostre o local ou problema (opcional)
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        <button
          aria-label="Adicionar foto"
          style={{
            height: "80px",
            backgroundColor: "#1A1A1A",
            border: "1px dashed #2E2E2E",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <PlusIcon />
        </button>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              height: "80px",
              backgroundColor: "#1A1A1A",
              border: "1px dashed #2E2E2E",
              borderRadius: "10px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Step 3 — Location & deadline ───────────────────────── */
function StepLocation({
  location,
  onLocation,
  distance,
  onDistance,
  deadline,
  onDeadline,
}: {
  location: string;
  onLocation: (v: string) => void;
  distance: number;
  onDistance: (v: number) => void;
  deadline: string;
  onDeadline: (v: string) => void;
}) {
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0F0F0", marginBottom: "4px" }}>
        Onde e quando?
      </h2>
      <p style={{ fontSize: "14px", color: "#888888", marginBottom: "20px" }}>
        Localização e prazo do serviço
      </p>

      {/* Location input */}
      <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>
        Localização
      </p>
      <div style={{ position: "relative", marginBottom: "24px" }}>
        <span
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            pointerEvents: "none",
          }}
        >
          <PinIcon />
        </span>
        <input
          type="text"
          value={location}
          onChange={(e) => onLocation(e.target.value)}
          placeholder="Cidade ou bairro"
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "12px",
            paddingLeft: "42px",
            paddingRight: "14px",
            fontSize: "14px",
            color: "#F0F0F0",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Distance slider */}
      <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>
        Distância máxima
      </p>
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", color: "#F0F0F0" }}>Raio de busca</span>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#FFD11A" }}>
            Até {distance} km
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={50}
          value={distance}
          onChange={(e) => onDistance(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#FFD11A",
            cursor: "pointer",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "11px", color: "#888888" }}>1 km</span>
          <span style={{ fontSize: "11px", color: "#888888" }}>50 km</span>
        </div>
      </div>

      {/* Deadline chips */}
      <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "10px" }}>
        Prazo
      </p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {DEADLINES.map((d) => {
          const active = deadline === d;
          return (
            <button
              key={d}
              onClick={() => onDeadline(d)}
              style={{
                height: "38px",
                padding: "0 16px",
                borderRadius: "999px",
                border: `1px solid ${active ? "#FFD11A" : "#2E2E2E"}`,
                backgroundColor: active ? "rgba(255,209,26,0.07)" : "transparent",
                color: active ? "#FFD11A" : "#888888",
                fontSize: "13px",
                fontWeight: active ? 500 : 400,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 4 — Confirmation ───────────────────────────────── */
function StepConfirmation({
  category,
  description,
  location,
  deadline,
}: {
  category: string;
  description: string;
  location: string;
  deadline: string;
}) {
  const cat = CATEGORIES.find((c) => c.name === category);
  return (
    <div>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0F0F0", marginBottom: "4px" }}>
        Tudo certo?
      </h2>
      <p style={{ fontSize: "14px", color: "#888888", marginBottom: "20px" }}>
        Revise seu pedido antes de publicar
      </p>

      {/* Summary card */}
      <div
        style={{
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        {/* Category row */}
        <div style={{ padding: "16px", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,209,26,0.1)", border: "1px solid rgba(255,209,26,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
            {cat?.emoji ?? "📋"}
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#888888", marginBottom: "2px" }}>Categoria</p>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0" }}>{category || "—"}</p>
          </div>
        </div>

        {/* Description row */}
        <div style={{ padding: "16px", borderBottom: "1px solid #2E2E2E" }}>
          <p style={{ fontSize: "12px", color: "#888888", marginBottom: "6px" }}>Descrição</p>
          <p style={{ fontSize: "14px", color: "#F0F0F0", lineHeight: 1.55 }}>
            {description.trim().length > 0
              ? description.length > 120
                ? description.slice(0, 120) + "…"
                : description
              : "—"}
          </p>
        </div>

        {/* Location row */}
        <div style={{ padding: "16px", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", gap: "10px" }}>
          <PinIcon />
          <div>
            <p style={{ fontSize: "12px", color: "#888888", marginBottom: "2px" }}>Localização</p>
            <p style={{ fontSize: "14px", color: "#F0F0F0" }}>{location.trim() || "Não informado"}</p>
          </div>
        </div>

        {/* Deadline row */}
        <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <CalendarIcon />
          <div>
            <p style={{ fontSize: "12px", color: "#888888", marginBottom: "2px" }}>Prazo</p>
            <p style={{ fontSize: "14px", color: "#F0F0F0" }}>{deadline}</p>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div
        style={{
          backgroundColor: "rgba(255,209,26,0.06)",
          border: "1px solid rgba(255,209,26,0.25)",
          borderRadius: "12px",
          padding: "14px 16px",
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>🔍</span>
        <p style={{ fontSize: "13px", color: "#F0F0F0", lineHeight: 1.55 }}>
          O Bico vai buscar profissionais no{" "}
          <span style={{ color: "#FFD11A", fontWeight: 500 }}>Google Maps, CNPJ e Instagram</span>{" "}
          da sua região e avisar os melhores via WhatsApp.
        </p>
      </div>
    </div>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer({
  step,
  isLast,
  canNext,
  onBack,
  onNext,
}: {
  step: number;
  isLast: boolean;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0F0F0F",
        borderTop: "1px solid #2E2E2E",
        padding: "16px",
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          gap: "10px",
        }}
      >
        {step > 0 && (
          <button
            onClick={onBack}
            style={{
              flex: "0 0 auto",
              height: "52px",
              padding: "0 24px",
              backgroundColor: "transparent",
              color: "#F0F0F0",
              border: "1px solid #2E2E2E",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 400,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            Anterior
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canNext}
          style={{
            flex: 1,
            height: "52px",
            backgroundColor: canNext ? "#FFD11A" : "#2E2E2E",
            color: canNext ? "#000000" : "#888888",
            border: "none",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: canNext ? "pointer" : "not-allowed",
          }}
        >
          {isLast ? "Publicar pedido" : "Próximo"}
        </button>
      </div>
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────────────── */
function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
