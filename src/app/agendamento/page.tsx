"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Calendar constants for May 2026 ────────────────────── */
// May 1, 2026 = Friday → startCol = 5 (Sun=0)
const MONTH_LABEL = "Maio 2026";
const START_COL = 5;
const DAYS_IN_MONTH = 31;
const TODAY = 16;
const OCCUPIED_DAYS = new Set([20, 27, 29]);
const WEEK_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const TIMES = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const OCCUPIED_TIMES = new Set(["11:00", "15:00"]);

/* ─── Page ────────────────────────────────────────────────── */
export default function AgendamentoPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(18);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [visitType, setVisitType] = useState<"presencial" | "video">("presencial");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const dayName = DAY_NAMES[dayOfWeek(selectedDay)];
  const canConfirm = selectedDay > TODAY && selectedTime !== "";

  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "56px",
        paddingBottom: "104px",
      }}
    >
      <Header />
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px 0" }}>
        <ProfessionalCard />
        <Gap h={24} />
        <CalendarSection selectedDay={selectedDay} onSelect={setSelectedDay} />
        <Gap h={24} />
        <TimesSection selectedTime={selectedTime} onSelect={setSelectedTime} />
        <Gap h={24} />
        <VisitTypeSection type={visitType} onSelect={setVisitType} />
        <Gap h={24} />
        <AddressSection value={address} onChange={setAddress} />
        <Gap h={16} />
        <NotesSection value={notes} onChange={setNotes} />
        <Gap h={24} />
        <SummaryCard day={selectedDay} dayName={dayName} time={selectedTime} />
      </div>
      <Footer canConfirm={canConfirm} onConfirm={() => router.push("/chat")} />
    </div>
  );
}

/* ─── Header ──────────────────────────────────────────────── */
function Header() {
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
      <a
        href="/chat"
        aria-label="Voltar"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}
      >
        <ArrowLeftIcon />
      </a>
      <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Agendar visita</span>
      <div style={{ width: "36px" }} />
    </header>
  );
}

/* ─── Professional Card ───────────────────────────────────── */
function ProfessionalCard() {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "12px",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: "#2A2A2A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "17px", fontWeight: 700, color: "#F0F0F0" }}>C</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#F0F0F0", marginBottom: "2px" }}>Carlos Mendes</p>
        <p style={{ fontSize: "12px", color: "#888888", marginBottom: "4px" }}>Pintor · 🥇 Ouro · 4.9 ★</p>
        <p style={{ fontSize: "12px", color: "#1D9E75", fontWeight: 500 }}>Visita técnica gratuita · sem taxa</p>
      </div>
    </div>
  );
}

/* ─── Calendar ────────────────────────────────────────────── */
function CalendarSection({
  selectedDay,
  onSelect,
}: {
  selectedDay: number;
  onSelect: (d: number) => void;
}) {
  // Build grid: START_COL empty cells, then days 1..DAYS_IN_MONTH, pad to multiple of 7
  const cells: (number | null)[] = [
    ...Array(START_COL).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <SectionLabel text="Escolha a data" />

      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <button style={navBtnStyle}>
          <ChevronLeftIcon />
        </button>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#F0F0F0" }}>{MONTH_LABEL}</span>
        <button style={navBtnStyle}>
          <ChevronRightIcon />
        </button>
      </div>

      {/* Week day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "6px" }}>
        {WEEK_LABELS.map((w) => (
          <div key={w} style={{ textAlign: "center", fontSize: "9px", color: "#555555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em", padding: "4px 0" }}>
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;

          const isPast = day < TODAY;
          const isToday = day === TODAY;
          const isOccupied = OCCUPIED_DAYS.has(day);
          const isSelected = day === selectedDay;

          let bg = "transparent";
          let color = "#F0F0F0";
          let fontWeight: number = 400;
          let border = "1px solid transparent";
          let opacity = 1;
          let cursor: string = "pointer";
          let textDecoration = "none";

          if (isPast) {
            color = "#444444";
            cursor = "default";
          } else if (isOccupied) {
            color = "#E24B4A";
            bg = "rgba(226,75,74,0.1)";
            textDecoration = "line-through";
            cursor = "default";
          } else if (isSelected) {
            bg = "#FFD11A";
            color = "#000000";
            fontWeight = 700;
          } else if (isToday) {
            border = "1px solid #2E2E2E";
            fontWeight = 700;
          }

          return (
            <button
              key={day}
              onClick={() => !isPast && !isOccupied && onSelect(day)}
              style={{
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight,
                color,
                backgroundColor: bg,
                border,
                borderRadius: "8px",
                cursor,
                opacity,
                textDecoration,
                fontFamily: "var(--font-inter), Inter, sans-serif",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "12px", justifyContent: "center" }}>
        {[
          { dot: "#FFD11A", label: "Selecionado" },
          { dot: "#E24B4A", label: "Ocupado" },
          { dot: "#2E2E2E", label: "Disponível", border: "1px solid #3A3A3A" },
        ].map(({ dot, label, border }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: dot, border: border ?? undefined, flexShrink: 0 }} />
            <span style={{ fontSize: "10px", color: "#555555" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Times ───────────────────────────────────────────────── */
function TimesSection({
  selectedTime,
  onSelect,
}: {
  selectedTime: string;
  onSelect: (t: string) => void;
}) {
  return (
    <div>
      <SectionLabel text="Escolha o horário" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {TIMES.map((t) => {
          const occupied = OCCUPIED_TIMES.has(t);
          const active = t === selectedTime && !occupied;
          return (
            <button
              key={t}
              onClick={() => !occupied && onSelect(t)}
              style={{
                height: "40px",
                padding: "0 18px",
                borderRadius: "999px",
                border: `1px solid ${active ? "#FFD11A" : "#2E2E2E"}`,
                backgroundColor: active ? "rgba(255,209,26,0.07)" : "#1A1A1A",
                color: active ? "#FFD11A" : occupied ? "#555555" : "#888888",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                cursor: occupied ? "not-allowed" : "pointer",
                opacity: occupied ? 0.35 : 1,
                textDecoration: occupied ? "line-through" : "none",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Visit type ──────────────────────────────────────────── */
function VisitTypeSection({
  type,
  onSelect,
}: {
  type: "presencial" | "video";
  onSelect: (t: "presencial" | "video") => void;
}) {
  return (
    <div>
      <SectionLabel text="Tipo de visita" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {(
          [
            { id: "presencial", emoji: "📍", label: "Presencial", sub: "Profissional vai até você" },
            { id: "video",      emoji: "📱", label: "Video chamada", sub: "Avaliação remota pelo app" },
          ] as const
        ).map(({ id, emoji, label, sub }) => {
          const active = type === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              style={{
                backgroundColor: active ? "rgba(255,209,26,0.05)" : "#1A1A1A",
                border: `1px solid ${active ? "#FFD11A" : "#2E2E2E"}`,
                borderRadius: "12px",
                padding: "14px 12px",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-inter), Inter, sans-serif",
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{emoji}</div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: active ? "#FFD11A" : "#F0F0F0", marginBottom: "3px" }}>
                {label}
              </p>
              <p style={{ fontSize: "10px", color: "#888888", lineHeight: 1.4 }}>{sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Address ─────────────────────────────────────────────── */
function AddressSection({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "8px" }}>
        Endereço da visita
      </p>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", pointerEvents: "none" }}>
          <PinIcon />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rua, número, bairro, cidade"
          style={{
            width: "100%",
            height: "48px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "10px",
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
    </div>
  );
}

/* ─── Notes ───────────────────────────────────────────────── */
function NotesSection({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: "8px" }}>
        Observações
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Alguma informação adicional para o profissional?"
        rows={3}
        style={{
          width: "100%",
          backgroundColor: "#1A1A1A",
          border: "1px solid #2E2E2E",
          borderRadius: "10px",
          padding: "12px 14px",
          fontSize: "14px",
          color: "#F0F0F0",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          outline: "none",
          resize: "none",
          boxSizing: "border-box",
          lineHeight: 1.5,
        }}
      />
    </div>
  );
}

/* ─── Summary ─────────────────────────────────────────────── */
function SummaryCard({ day, dayName, time }: { day: number; dayName: string; time: string }) {
  return (
    <div
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid #FFD11A",
        borderRadius: "12px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <p style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: "2px" }}>
        Resumo
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>📅</span>
        <span style={{ fontSize: "13px", color: "#F0F0F0" }}>
          {dayName}, {day} de Maio · {time}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>📍</span>
        <span style={{ fontSize: "13px", color: "#888888" }}>Rua das Flores, 123 — Taubaté</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>👤</span>
        <span style={{ fontSize: "13px", color: "#888888" }}>Carlos Mendes · Pintor</span>
      </div>
    </div>
  );
}

/* ─── Footer ──────────────────────────────────────────────── */
function Footer({ canConfirm, onConfirm }: { canConfirm: boolean; onConfirm: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0F0F0F",
        borderTop: "1px solid #2E2E2E",
        padding: "14px 16px 20px",
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <button
          onClick={onConfirm}
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#FFD11A",
            color: "#000000",
            border: "none",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            marginBottom: "8px",
          }}
        >
          Confirmar agendamento
        </button>
        <p style={{ fontSize: "12px", color: "#555555", textAlign: "center" }}>
          Você receberá confirmação via WhatsApp
        </p>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────── */
function dayOfWeek(day: number): number {
  // May 1 = Friday (5). Return 0-6 (Sun-Sat)
  return (START_COL + day - 1) % 7;
}

const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function Gap({ h }: { h: number }) {
  return <div style={{ height: `${h}px` }} />;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0F0", marginBottom: "14px" }}>{text}</p>
  );
}

const navBtnStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A1A1A",
  border: "1px solid #2E2E2E",
  borderRadius: "8px",
  cursor: "pointer",
  color: "#888888",
};

/* ─── Icons ───────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
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
