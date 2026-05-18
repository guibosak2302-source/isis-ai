"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BottomNav, displayName, HeartNavIcon } from "@/app/feed/page";

interface Post {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  city: string | null;
  budget_min: number | null;
  photo_url: string | null;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    city: string | null;
    verified: boolean | null;
  } | null;
}

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [interested, setInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0);
  const [interestLoading, setInterestLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: { user } }, { data }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("posts").select(`*, profiles (id, full_name, email, avatar_url, city, verified)`).eq("id", id).single(),
      ]);
      const uid = user?.id ?? null;
      setUserId(uid);
      if (!data) { setLoading(false); return; }
      setPost(data as Post);

      const [{ count }, { data: myInt }] = await Promise.all([
        supabase.from("candidaturas").select("id", { count: "exact", head: true }).eq("post_id", id).eq("status", "interesse"),
        uid ? supabase.from("candidaturas").select("id").eq("post_id", id).eq("prestador_id", uid).maybeSingle() : Promise.resolve({ data: null }),
      ]);
      setInterestCount(count ?? 0);
      if (myInt) { setInterested(true); setSent(true); }
      setLoading(false);
    }
    load();
  }, [id]);

  async function toggleInteresse() {
    if (!userId) { router.replace("/login"); return; }
    setInterestLoading(true);
    const supabase = createClient();

    if (interested) {
      await supabase.from("candidaturas").delete().eq("post_id", id).eq("prestador_id", userId).eq("status", "interesse");
      setInterested(false);
      setInterestCount((c) => Math.max(0, c - 1));
    } else {
      const { data: existing } = await supabase.from("candidaturas").select("id, status").eq("post_id", id).eq("prestador_id", userId).maybeSingle();
      if (!existing) {
        await supabase.from("candidaturas").insert({ post_id: id, prestador_id: userId, status: "interesse", proposta: "Tenho interesse neste serviço", preco: 0 });
        setInterested(true);
        setInterestCount((c) => c + 1);
      }
    }
    setInterestLoading(false);
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        <div style={{ height: "200px", backgroundColor: "#1A1A1A" }} />
        <div style={{ padding: "20px" }}>
          <div style={{ width: "60%", height: 20, borderRadius: 4, backgroundColor: "#2A2A2A", marginBottom: 12 }} />
          <div style={{ width: "100%", height: 12, borderRadius: 4, backgroundColor: "#1A1A1A", marginBottom: 8 }} />
          <div style={{ width: "80%", height: 12, borderRadius: 4, backgroundColor: "#1A1A1A" }} />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
        <p style={{ color: "#888888", fontSize: "16px" }}>Post não encontrado</p>
        <Link href="/feed" style={{ color: "#FFD11A", textDecoration: "none", fontSize: "14px" }}>← Voltar ao feed</Link>
      </div>
    );
  }

  const name = displayName(post.profiles);
  const initial = name.charAt(0).toUpperCase();
  const location = post.city ?? post.profiles?.city ?? "";

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#F0F0F0", display: "flex", alignItems: "center", padding: "4px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Pedido</span>
      </header>

      <main style={{ paddingTop: "56px", paddingBottom: "88px" }}>
        {/* Photo */}
        {post.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.photo_url} alt="" style={{ width: "100%", height: "260px", objectFit: "cover", display: "block" }} />
        )}

        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px 16px" }}>
          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: "#0F0F0F" }}>{initial}</span>
            </div>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>{name}</p>
              <p style={{ fontSize: "12px", color: "#555555", marginTop: "2px" }}>
                {[location, relativeTime(post.created_at)].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {/* Category */}
          {post.category && (
            <span style={{ display: "inline-block", fontSize: "12px", fontWeight: 500, color: "#0F0F0F", backgroundColor: "#FFD11A", borderRadius: "6px", padding: "3px 10px", marginBottom: "12px" }}>
              {post.category}
            </span>
          )}

          {/* Title */}
          {post.title && (
            <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#F0F0F0", marginBottom: "12px", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
              {post.title}
            </h1>
          )}

          {/* Description */}
          <p style={{ fontSize: "15px", color: "#A0A0A0", lineHeight: 1.7, marginBottom: "20px" }}>
            {post.description ?? ""}
          </p>

          {/* Price */}
          {post.budget_min != null && (
            <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#888888" }}>Orçamento estimado</span>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "#FFD11A", letterSpacing: "-0.03em" }}>
                R$ {post.budget_min.toLocaleString("pt-BR")}
              </span>
            </div>
          )}

          {/* Interest count */}
          {interestCount > 0 && (
            <p style={{ fontSize: "13px", color: "#555555", marginBottom: "20px" }}>
              {interestCount} pessoa{interestCount !== 1 ? "s" : ""} com interesse neste pedido
            </p>
          )}

          {sent && (
            <div style={{ backgroundColor: "#1A2E1A", border: "1px solid #2E5E2E", borderRadius: "12px", padding: "12px 16px", marginBottom: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#6FCF97" }}>✓ Proposta enviada com sucesso!</p>
            </div>
          )}

          {/* CTA buttons */}
          {!sent && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => { if (!userId) { router.replace("/login"); return; } router.push(`/candidatura/${id}`); }}
                style={{ width: "100%", height: "52px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
              >
                Enviar proposta
              </button>
              <button
                onClick={toggleInteresse}
                disabled={interestLoading}
                style={{
                  width: "100%", height: "52px",
                  backgroundColor: interested ? "#1A2E1A" : "transparent",
                  color: interested ? "#6FCF97" : "#888888",
                  border: `1px solid ${interested ? "#2E5E2E" : "#3A3A3A"}`,
                  borderRadius: "999px", fontSize: "15px", fontFamily: "var(--font-inter), Inter, sans-serif",
                  cursor: interestLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}
              >
                <HeartNavIcon />
                {interested ? "Salvo nos interesses" : "Salvar nos interesses"}
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="" />
    </div>
  );
}
