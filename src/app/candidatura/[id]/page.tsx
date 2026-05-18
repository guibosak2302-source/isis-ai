"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { BottomNav, displayName } from "@/app/feed/page";

interface Post {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  city: string | null;
  budget_min: number | null;
  profiles: {
    id: string;
    full_name: string | null;
    email: string | null;
    city: string | null;
    verified: boolean | null;
  } | null;
}

export default function CandidaturaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [proposta, setProposta] = useState("");
  const [preco, setPreco] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: { user } }, { data }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("posts").select(`id, user_id, title, description, category, city, budget_min, profiles (id, full_name, email, city, verified)`).eq("id", id).single(),
      ]);
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      if (!data) { setLoading(false); return; }
      setPost(data as unknown as Post);

      const { data: existing } = await supabase.from("candidaturas").select("id, status, proposta, preco")
        .eq("post_id", id).eq("prestador_id", user.id).maybeSingle();
      if (existing && existing.status !== "interesse") {
        setSent(true);
        if (existing.proposta) setProposta(existing.proposta);
        if (existing.preco) setPreco(String(existing.preco));
      }

      setLoading(false);
    }
    load();
  }, [id]);

  async function submit() {
    if (!userId || !post) return;
    if (!proposta.trim()) { setError("Escreva sua proposta"); return; }
    if (!preco) { setError("Informe seu preço"); return; }
    setSending(true);
    setError("");
    const supabase = createClient();

    const { data: existing } = await supabase.from("candidaturas").select("id, status")
      .eq("post_id", id).eq("prestador_id", userId).maybeSingle();

    if (existing && existing.status !== "interesse") {
      setError("Você já enviou uma proposta para este pedido"); setSending(false); return;
    }

    const op = existing
      ? supabase.from("candidaturas").update({ proposta: proposta.trim(), preco: parseFloat(preco), status: "pendente" }).eq("id", existing.id)
      : supabase.from("candidaturas").insert({ post_id: id, prestador_id: userId, proposta: proposta.trim(), preco: parseFloat(preco), status: "pendente" });

    const { error: dbError } = await op;
    if (dbError) { setError("Erro ao enviar. Tente novamente."); setSending(false); return; }

    setSent(true);
    setSending(false);
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        <div style={{ height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E" }} />
        <div style={{ padding: "24px 16px", maxWidth: "600px", margin: "0 auto" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: "20px", borderRadius: "4px", backgroundColor: "#1A1A1A", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        <p style={{ color: "#888888", fontSize: "16px" }}>Post não encontrado</p>
        <button onClick={() => router.back()} style={{ color: "#FFD11A", background: "none", border: "none", fontSize: "14px", cursor: "pointer" }}>← Voltar</button>
      </div>
    );
  }

  const name = displayName(post.profiles);

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#F0F0F0", display: "flex", alignItems: "center", padding: "4px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Enviar proposta</span>
      </header>

      <main style={{ paddingTop: "72px", paddingBottom: "88px", maxWidth: "600px", margin: "0 auto", padding: "72px 16px 88px" }}>
        {/* Post summary */}
        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <p style={{ fontSize: "12px", color: "#555555", marginBottom: "4px" }}>{name}</p>
          {post.category && (
            <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 500, color: "#0F0F0F", backgroundColor: "#FFD11A", borderRadius: "6px", padding: "2px 8px", marginBottom: "8px" }}>
              {post.category}
            </span>
          )}
          {post.title && <p style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0", marginBottom: "6px" }}>{post.title}</p>}
          {post.budget_min != null && (
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#FFD11A", letterSpacing: "-0.02em" }}>
              R$ {post.budget_min.toLocaleString("pt-BR")}
            </p>
          )}
        </div>

        {sent ? (
          <div style={{ backgroundColor: "#1A2E1A", border: "1px solid #2E5E2E", borderRadius: "14px", padding: "24px 20px", textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6FCF97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "12px" }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#6FCF97", marginBottom: "8px" }}>Proposta enviada!</p>
            <p style={{ fontSize: "13px", color: "#888888", marginBottom: "20px" }}>O contratante será notificado e poderá aceitar sua proposta.</p>
            <button onClick={() => router.push("/feed")} style={{ height: "44px", padding: "0 28px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}>
              Voltar ao feed
            </button>
          </div>
        ) : (
          <>
            <label style={{ display: "block", fontSize: "11px", color: "#888888", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Sua proposta *</label>
            <textarea
              value={proposta}
              onChange={(e) => setProposta(e.target.value)}
              placeholder="Descreva como você pode ajudar, sua experiência, disponibilidade..."
              rows={5}
              disabled={sending}
              style={{ width: "100%", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "14px 16px", fontSize: "14px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" as const, marginBottom: "16px" }}
            />

            <label style={{ display: "block", fontSize: "11px", color: "#888888", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Seu preço R$ *</label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="Ex: 350"
              min={0}
              disabled={sending}
              style={{ width: "100%", height: "52px", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "0 16px", fontSize: "16px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", boxSizing: "border-box" as const, marginBottom: "20px" }}
            />

            {error && <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "14px" }}>{error}</p>}

            <button
              onClick={submit}
              disabled={sending}
              style={{ width: "100%", height: "52px", backgroundColor: sending ? "#3A3A3A" : "#FFD11A", color: sending ? "#888888" : "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: sending ? "not-allowed" : "pointer" }}
            >
              {sending ? "Enviando…" : "Enviar proposta"}
            </button>
          </>
        )}
      </main>

      <BottomNav active="" />
    </div>
  );
}
