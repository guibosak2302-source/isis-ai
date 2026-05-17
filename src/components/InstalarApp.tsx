"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstalarApp() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Don't show if user already dismissed
    if (sessionStorage.getItem("pwa-banner-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstalar() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
  }

  function handleFechar() {
    sessionStorage.setItem("pwa-banner-dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "72px",
        left: "12px",
        right: "12px",
        zIndex: 100,
        backgroundColor: "#1A1A1A",
        border: "1px solid #2E2E2E",
        borderRadius: "16px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          backgroundColor: "#FFD11A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <DuckIcon />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0", marginBottom: "2px" }}>
          Instale o Bico AI no seu celular!
        </p>
        <p style={{ fontSize: "12px", color: "#555555" }}>
          Acesso rápido, funciona offline
        </p>
      </div>

      {/* Install button */}
      <button
        onClick={handleInstalar}
        style={{
          height: "36px",
          padding: "0 14px",
          backgroundColor: "#FFD11A",
          color: "#0F0F0F",
          border: "none",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: 600,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          cursor: "pointer",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        Instalar
      </button>

      {/* Close button */}
      <button
        onClick={handleFechar}
        aria-label="Fechar"
        style={{
          width: "28px",
          height: "28px",
          backgroundColor: "transparent",
          border: "none",
          color: "#555555",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: 0,
        }}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function DuckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
      {/* Body */}
      <ellipse cx="32" cy="40" rx="20" ry="16" fill="#0F0F0F" />
      {/* Head */}
      <circle cx="44" cy="26" r="11" fill="#0F0F0F" />
      {/* Bill */}
      <ellipse cx="54" cy="28" rx="6" ry="3.5" fill="#0F0F0F" />
      {/* Eye */}
      <circle cx="47" cy="23" r="2" fill="#FFD11A" />
      <circle cx="47.8" cy="22.2" r="0.8" fill="#0F0F0F" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
