"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SLIDES = [
  {
    emoji: "🔍",
    title: "Encontre quem resolve",
    subtitle:
      "Descreva o serviço e o Bico busca nas melhores fontes da sua região.",
    pills: [
      "📍 Google Maps · CNPJ · Instagram",
      "💬 Profissionais avisados via WhatsApp",
      "🥇 Selos Bronze, Prata e Ouro verificados",
    ],
  },
  {
    emoji: "🔒",
    title: "Pagamento protegido",
    subtitle:
      "O dinheiro fica retido no Bico Pay e só é liberado quando você confirmar que o serviço ficou perfeito.",
    pills: [
      "🏦 Escrow — pagamento em garantia",
      "📝 Contrato jurídico automático",
      "⚡ PIX e cartão — rápido e seguro",
    ],
  },
  {
    emoji: "⭐",
    title: "Score Bico",
    subtitle:
      "Cada profissional tem um Score calculado por pontualidade, qualidade, comunicação e preço.",
    pills: [
      "🥉 Bronze — cadastrado na base Bico",
      "🥈 Prata — sem antecedentes criminais",
      "🥇 Ouro — verificação completa + Score alto",
    ],
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  function handleNext() {
    if (isLast) {
      router.push("/cadastro");
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function handleSkip() {
    router.push("/cadastro");
  }

  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 20px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleSkip}
          style={{
            background: "none",
            border: "none",
            color: "#888888",
            fontSize: "14px",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
            padding: "8px 0",
          }}
        >
          Pular
        </button>
      </header>

      {/* Slide content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 24px 0",
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Emoji */}
        <div
          style={{
            width: "120px",
            height: "120px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            fontSize: "56px",
            lineHeight: 1,
          }}
        >
          {slide.emoji}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "#F0F0F0",
            textAlign: "center",
            lineHeight: 1.25,
            marginBottom: "14px",
          }}
        >
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "15px",
            color: "#888888",
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: "32px",
            maxWidth: "340px",
          }}
        >
          {slide.subtitle}
        </p>

        {/* Pills */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {slide.pills.map((pill) => (
            <div
              key={pill}
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2E2E2E",
                borderRadius: "12px",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#888888",
                lineHeight: 1.5,
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav area */}
      <div
        style={{
          padding: "32px 24px 48px",
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
        }}
      >
        {/* Dots */}
        <div style={{ display: "flex", gap: "8px" }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: i === current ? "#FFD11A" : "#2E2E2E",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.2s ease, background-color 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={handleNext}
          style={{
            width: "100%",
            height: "52px",
            backgroundColor: "#FFD11A",
            color: "#000000",
            border: "none",
            borderRadius: "999px",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          {isLast ? "Começar" : "Próximo"}
        </button>
      </div>
    </div>
  );
}
