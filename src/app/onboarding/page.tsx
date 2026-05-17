"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"contratante" | "prestador" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
    }
    check();
  }, [router]);

  async function handleSelect(type: "contratante" | "prestador") {
    setSelected(type);
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ type }).eq("id", userId);
    router.push("/feed");
  }

  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        paddingTop: "80px",
        textAlign: "center",
      }}
    >
      {/* Duck icon */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
        <SmallDuckSVG />
      </div>

      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#F0F0F0",
          marginBottom: "8px",
        }}
      >
        Bem-vindo ao Bico AI!
      </h1>

      <p
        style={{
          fontSize: "14px",
          color: "#888888",
          marginBottom: "40px",
        }}
      >
        Como você vai usar o app?
      </p>

      {/* Role cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          maxWidth: "360px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Contratante */}
        <div
          onClick={() => handleSelect("contratante")}
          style={{
            backgroundColor: "#1A1A1A",
            border: `1px solid ${selected === "contratante" ? "#FFD11A" : "#2E2E2E"}`,
            borderRadius: "16px",
            padding: "24px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#FFD11A20",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              🔧
            </div>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#F0F0F0",
                marginLeft: "12px",
              }}
            >
              Preciso de serviços
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#888888",
              lineHeight: 1.5,
              marginTop: "10px",
            }}
          >
            Publico pedidos, contrato prestadores e pago com segurança.
          </p>
        </div>

        {/* Prestador */}
        <div
          onClick={() => handleSelect("prestador")}
          style={{
            backgroundColor: "#1A1A1A",
            border: `1px solid ${selected === "prestador" ? "#FFD11A" : "#2E2E2E"}`,
            borderRadius: "16px",
            padding: "24px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#FFD11A20",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              ⭐
            </div>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#F0F0F0",
                marginLeft: "12px",
              }}
            >
              Ofereço serviços
            </span>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "#888888",
              lineHeight: 1.5,
              marginTop: "10px",
            }}
          >
            Recebo pedidos, envio propostas e construo meu Score.
          </p>
        </div>
      </div>

      {saving && (
        <p
          style={{
            fontSize: "13px",
            color: "#888888",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          Salvando…
        </p>
      )}
    </div>
  );
}

function SmallDuckSVG() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="40" cy="52" rx="26" ry="20" fill="#FFD11A" />
      {/* Head */}
      <circle cx="54" cy="32" r="14" fill="#FFD11A" />
      {/* Eye */}
      <circle cx="59" cy="29" r="2.5" fill="#0F0F0F" />
      {/* Beak */}
      <path d="M66 33 L74 31 L66 36 Z" fill="#FF9900" />
      {/* Wing */}
      <ellipse cx="36" cy="52" rx="14" ry="9" fill="#FFBA00" transform="rotate(-10 36 52)" />
    </svg>
  );
}
