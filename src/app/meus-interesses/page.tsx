"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  photo_url: string | null;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    email: string | null;
    city: string | null;
    verified: boolean | null;
  } | null;
}

interface Candidatura {
  id: string;
  post_id: string;
  status: string;
  posts: Post | null;
}

interface ModalState {
  post: Post;
  descricao: string;
  valor: string;
  sending: boolean;
  error: string;
}

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

export default function MeusInteressesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Candidatura[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("candidaturas")
        .select(`id, post_id, status, posts (id, user_id, title, description, category, city, budget_min, photo_url, created_at, profiles (id, full_name, email, city, verified))`)
        .eq("prestador_id", user.id)
        .eq("status", "interesse")
        .order("id", { ascending: false });

      setItems((data as unknown as Candidatura[]) ?? []);
    }
    load();
  }, []);

  async function removeInteresse(candidaturaId: string, postId: string) {
    const supabase = createClient();
    await supabase.from("candidaturas").delete().eq("id", candidaturaId);
    setItems((prev) => prev?.filter((i) => i.id !== candidaturaId) ?? []);
  }

  function openModal(post: Post) {
    setModal({ post, descricao: "", valor: "", sending: false, error: "" });
  }

  async function submitProposta() {
    if (!modal || !userId) return;
    if (!modal.descricao.trim()) { setModal((m) => m && ({ ...m, error: "Escreva sua proposta" })); return; }
    if (!modal.valor) { setModal((m) => m && ({ ...m, error: "Informe seu preço" })); return; }
    setModal((m) => m && ({ ...m, sending: true, error: "" }));
    const supabase = createClient();

    const { data: existing } = await supabase.from("candidaturas").select("id, status")
      .eq("post_id", modal.post.id).eq("prestador_id", userId).maybeSingle();

    const op = existing
      ? supabase.from("candidaturas").update({ descricao: modal.descricao.trim(), valor: parseFloat(modal.valor), status: "pendente" }).eq("id", existing.id)
      : supabase.from("candidaturas").insert({ post_id: modal.post.id, prestador_id: userId, descricao: modal.descricao.trim(), valor: parseFloat(modal.valor), status: "pendente" });

    const { error } = await op;
    if (error) { setModal((m) => m && ({ ...m, sending: false, error: "Erro ao enviar." })); return; }

    // Remove from list (now it's a proposta, not interesse)
    setItems((prev) => prev?.filter((i) => i.post_id !== modal.post.id) ?? []);
    setModal(null);
  }

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: "none", cursor: "pointer", color: "#F0F0F0", display: "flex", alignItems: "center", padding: "4px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>Salvos</span>
      </header>

      <main style={{ paddingTop: "72px", paddingBottom: "88px", maxWidth: "600px", margin: "0 auto", padding: "72px 16px 88px" }}>
        {items === null ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", height: "200px" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#888888", marginBottom: "8px" }}>Nenhum post salvo</p>
            <p style={{ fontSize: "13px", color: "#555555", marginBottom: "20px" }}>Clique em "Tenho interesse" em posts do feed para salvá-los aqui.</p>
            <Link href="/feed" style={{ display: "inline-flex", alignItems: "center", height: "44px", padding: "0 24px", backgroundColor: "#FFD11A", color: "#0F0F0F", borderRadius: "999px", fontSize: "14px", fontWeight: 500, textDecoration: "none", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
              Ver feed
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((item) => {
              const post = item.posts;
              if (!post) return null;
              const name = displayName(post.profiles);
              const initial = name.charAt(0).toUpperCase();
              const location = post.city ?? post.profiles?.city ?? "";
              return (
                <article key={item.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "16px", overflow: "hidden" }}>
                  {post.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.photo_url} alt="" style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                  )}
                  <div style={{ padding: "16px 20px 20px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "#FFD11A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: "#0F0F0F" }}>{initial}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>{name}</p>
                        <p style={{ fontSize: "12px", color: "#555555" }}>{[location, relativeTime(post.created_at)].filter(Boolean).join(" · ")}</p>
                      </div>
                      <button onClick={() => removeInteresse(item.id, post.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#555555", fontSize: "18px" }}
                        title="Remover dos salvos"
                      >×</button>
                    </div>

                    {post.category && (
                      <span style={{ display: "inline-block", fontSize: "11px", fontWeight: 500, color: "#0F0F0F", backgroundColor: "#FFD11A", borderRadius: "6px", padding: "2px 8px", marginBottom: "8px" }}>
                        {post.category}
                      </span>
                    )}

                    {post.title && <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px" }}>{post.title}</p>}
                    <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.5, marginBottom: "12px" }}>{post.description ?? ""}</p>

                    {post.budget_min != null && (
                      <p style={{ fontSize: "20px", fontWeight: 600, color: "#FFD11A", marginBottom: "14px", letterSpacing: "-0.02em" }}>
                        R$ {post.budget_min.toLocaleString("pt-BR")}
                      </p>
                    )}

                    <div style={{ height: "1px", backgroundColor: "#2E2E2E", marginBottom: "14px" }} />

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => openModal(post)}
                        style={{ flex: 2, height: "40px", borderRadius: "999px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", fontSize: "13px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
                      >
                        Enviar proposta
                      </button>
                      <Link href={`/post/${post.id}`}
                        style={{ flex: 1, height: "40px", borderRadius: "999px", backgroundColor: "transparent", color: "#888888", border: "1px solid #3A3A3A", fontSize: "13px", fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                      >
                        Ver post
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav active="Salvos" />

      {/* Modal proposta */}
      {modal && (
        <>
          <div onClick={() => !modal.sending && setModal(null)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 100, backdropFilter: "blur(2px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101, backgroundColor: "#111111", border: "1px solid #2E2E2E", borderTopLeftRadius: "20px", borderTopRightRadius: "20px", padding: "24px 20px 40px", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: "#3A3A3A", margin: "0 auto 20px" }} />
            <h3 style={{ fontSize: "17px", fontWeight: 500, color: "#F0F0F0", marginBottom: "20px" }}>{modal.post.title ?? "Enviar proposta"}</h3>
            <label style={{ display: "block", fontSize: "11px", color: "#888888", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Sua proposta *</label>
            <textarea value={modal.descricao} onChange={(e) => setModal((m) => m && ({ ...m, descricao: e.target.value }))}
              placeholder="Descreva como você pode ajudar..." rows={4} disabled={modal.sending}
              style={{ width: "100%", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" as const, marginBottom: "14px" }}
            />
            <label style={{ display: "block", fontSize: "11px", color: "#888888", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Seu preço R$ *</label>
            <input type="number" value={modal.valor} onChange={(e) => setModal((m) => m && ({ ...m, valor: e.target.value }))}
              placeholder="Ex: 350" min={0} disabled={modal.sending}
              style={{ width: "100%", height: "50px", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "10px", padding: "0 14px", fontSize: "15px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif", outline: "none", boxSizing: "border-box" as const, marginBottom: "16px" }}
            />
            {modal.error && <p style={{ fontSize: "13px", color: "#E24B4A", marginBottom: "12px" }}>{modal.error}</p>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, height: "48px", backgroundColor: "transparent", color: "#888888", border: "1px solid #2E2E2E", borderRadius: "999px", fontSize: "14px", fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}>Cancelar</button>
              <button onClick={submitProposta} disabled={modal.sending} style={{ flex: 2, height: "48px", backgroundColor: modal.sending ? "#3A3A3A" : "#FFD11A", color: modal.sending ? "#888888" : "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: modal.sending ? "not-allowed" : "pointer" }}>
                {modal.sending ? "Enviando…" : "Enviar proposta"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
