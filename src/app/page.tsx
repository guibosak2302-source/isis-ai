"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        color: "#F0F0F0",
        fontFamily: "var(--font-inter), Inter, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* A. Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "56px",
          backgroundColor: "#0F0F0F",
          borderBottom: "1px solid #2E2E2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 100,
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Outer wrapper to allow fixed to stretch full width but inner content max 600 */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "56px",
            backgroundColor: "#0F0F0F",
            borderBottom: "1px solid #2E2E2E",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DuckLogoSVG size={28} />
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 500,
                  color: "#F0F0F0",
                  lineHeight: 1,
                }}
              >
                Bico
              </span>
            </div>

            {/* Entrar ghost button */}
            <Link
              href="/login"
              style={{
                border: "1px solid #3A3A3A",
                height: "34px",
                padding: "0 16px",
                borderRadius: "999px",
                fontSize: "14px",
                color: "#F0F0F0",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      {/* Page content — max 600px centered */}
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* B. Hero */}
        <section
          style={{
            paddingTop: "96px",
            paddingBottom: "80px",
            textAlign: "center",
            padding: "96px 24px 80px",
          }}
        >
          {/* Big duck icon */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
            }}
          >
            <DuckLogoSVG size={80} />
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#F0F0F0",
              lineHeight: 1.2,
              marginBottom: "16px",
              whiteSpace: "pre-line",
            }}
          >
            {"Resolve rápido,\nsempre perto de você."}
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "#888888",
              lineHeight: 1.6,
              maxWidth: "340px",
              margin: "0 auto 32px",
            }}
          >
            O marketplace de serviços com contrato digital, pagamento seguro e
            prestadores verificados.
          </p>

          {/* CTA buttons */}
          <div style={{ maxWidth: "320px", margin: "0 auto" }}>
            <Link
              href="/cadastro"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "52px",
                backgroundColor: "#FFD11A",
                color: "#0F0F0F",
                borderRadius: "999px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              Garantir minha vaga →
            </Link>

            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "52px",
                backgroundColor: "transparent",
                color: "#F0F0F0",
                border: "1px solid #3A3A3A",
                borderRadius: "999px",
                fontSize: "15px",
                marginTop: "10px",
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        {/* C. Como funciona */}
        <section
          style={{
            padding: "64px 24px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#F0F0F0",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            Como funciona
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                num: 1,
                title: "Publique seu pedido",
                desc: "Descreva o serviço e a localização. Em minutos prestadores próximos serão notificados.",
              },
              {
                num: 2,
                title: "Escolha o prestador",
                desc: "Compare perfis, scores e preços. Aceite a proposta que preferir e gere o contrato automático.",
              },
              {
                num: 3,
                title: "Pague com segurança",
                desc: "O pagamento fica em garantia e só é liberado quando você confirmar que o serviço ficou perfeito.",
              },
            ].map((step) => (
              <div
                key={step.num}
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2E2E2E",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#FFD11A",
                    color: "#0F0F0F",
                    fontSize: "14px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>
                    {step.title}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#888888",
                      lineHeight: 1.5,
                      marginTop: "4px",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* D. Para quem é */}
        <section style={{ padding: "0 24px 64px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#F0F0F0",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Para quem é
          </h2>

          <div style={{ display: "flex", gap: "12px" }}>
            {/* Contratante */}
            <div
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2E2E2E",
                borderRadius: "14px",
                padding: "20px",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#FFD11A20",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HouseIcon />
              </div>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#F0F0F0",
                  marginBottom: "8px",
                }}
              >
                Contratante
              </h3>
              <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>
                Encontre prestadores verificados e pague com proteção total.
              </p>
            </div>

            {/* Prestador */}
            <div
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2E2E2E",
                borderRadius: "14px",
                padding: "20px",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#FFD11A20",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WrenchIcon />
              </div>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#F0F0F0",
                  marginBottom: "8px",
                }}
              >
                Prestador
              </h3>
              <p style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>
                Receba pedidos de serviço, construa seu Score e aumente sua renda.
              </p>
            </div>
          </div>
        </section>

        {/* E. Categorias */}
        <section style={{ padding: "0 24px 64px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#F0F0F0",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            Categorias de serviço
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            {[
              "🔧 Elétrica",
              "🚿 Hidráulica",
              "🎨 Pintura",
              "🧹 Limpeza",
              "🌿 Jardinagem",
              "📦 Montagem",
              "🚛 Mudança",
              "💻 Informática",
              "✨ Outros",
            ].map((cat) => (
              <div
                key={cat}
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2E2E2E",
                  borderRadius: "10px",
                  padding: "12px 8px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#888888",
                }}
              >
                {cat}
              </div>
            ))}
          </div>
        </section>

        {/* F. Depoimentos */}
        <section style={{ padding: "0 24px 64px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#F0F0F0",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            O que dizem
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                quote:
                  "Encontrei um eletricista em 20 minutos. Serviço excelente e pagamento muito seguro!",
                name: "Marcos Oliveira",
                role: "Contratante",
                initial: "M",
              },
              {
                quote:
                  "O Score Bico me ajudou a escolher com confiança. Contrato automático é incrível!",
                name: "Fernanda Costa",
                role: "Contratante",
                initial: "F",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2E2E2E",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                <div style={{ color: "#FFD11A", fontSize: "14px", marginBottom: "8px" }}>
                  ★★★★★
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#C0C0C0",
                    lineHeight: 1.5,
                    marginBottom: "12px",
                  }}
                >
                  {t.quote}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#2A2A2A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      color: "#888888",
                      flexShrink: 0,
                    }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#F0F0F0" }}>{t.name}</div>
                    <div style={{ fontSize: "11px", color: "#555555" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* G. CTA Final */}
        <section style={{ padding: "0 24px 80px", textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #FFD11A30",
              borderRadius: "20px",
              padding: "40px 24px",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#FFD11A",
                marginBottom: "8px",
              }}
            >
              500 vagas exclusivas
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#888888",
                lineHeight: 1.5,
                marginBottom: "28px",
              }}
            >
              Faça parte da primeira turma do Bico AI e ajude a moldar o futuro dos
              serviços no Brasil.
            </p>
            <Link
              href="/cadastro"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "52px",
                backgroundColor: "#FFD11A",
                color: "#0F0F0F",
                borderRadius: "999px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                padding: "0 32px",
              }}
            >
              Garantir minha vaga →
            </Link>
          </div>
        </section>

        {/* H. Footer */}
        <footer
          style={{
            padding: "32px 24px",
            borderTop: "1px solid #2E2E2E",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "12px", color: "#555555" }}>
            © 2025 Bico AI — Resolve rápido, sempre perto de você.
          </p>
        </footer>
      </div>
    </div>
  );
}

function DuckLogoSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
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

function HouseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD11A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD11A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
