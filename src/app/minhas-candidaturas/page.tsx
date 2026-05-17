"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface Candidatura {
  id: string;
  prestador_id: string;
  descricao: string | null;
  valor: number | null;
  status: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}

interface Post {
  id: string;
  title: string | null;
  description: string | null;
  created_at: string;
  candidaturas: Candidatura[];
}

export default function MinhasCandidaturasPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }

      const { data } = await supabase
        .from("posts")
        .select(`
          id, title, description, created_at,
          candidaturas (
            id, prestador_id, descricao, valor, status, created_at,
            profiles ( full_name )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPosts((data as unknown as Post[]) ?? []);
    }
    load();
  }, [router]);

  async function updateStatus(candidaturaId: string, status: "aceito" | "recusado", prestadorId: string) {
    const supabase = createClient();
    await supabase.from("candidaturas").update({ status }).eq("id", candidaturaId);
    setPosts((prev) =>
      prev?.map((p) => ({
        ...p,
        candidaturas: p.candidaturas.map((c) =>
          c.id === candidaturaId ? { ...c, status } : c
        ),
      })) ?? null
    );

    if (status === "aceito") {
      void fetch("/api/notificar-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: prestadorId,
          mensagem: "✅ Bico AI: Sua proposta foi aceita! Acesse o app para iniciar o contrato.",
          tipo: "candidatura_aceita",
        }),
      });
    }
  }

  const selected = posts?.find((p) => p.id === selectedPost) ?? null;

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "40px" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        {selected ? (
          <button onClick={() => setSelectedPost(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", background: "none", border: "none", cursor: "pointer", color: "#F0F0F0" }}>
            <ArrowLeftIcon />
          </button>
        ) : (
          <Link href="/pedidos" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none" }}>
            <ArrowLeftIcon />
          </Link>
        )}
        <span style={{ fontSize: "16px", fontWeight: 500, color: "#F0F0F0" }}>
          {selected ? "Propostas recebidas" : "Minhas candidaturas"}
        </span>
        <div style={{ width: "36px" }} />
      </header>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "72px 16px 0" }}>
        {posts === null ? (
          <LoadingSkeleton />
        ) : selected ? (
          <ProposalList post={selected} onUpdateStatus={(id, status, prestadorId) => updateStatus(id, status, prestadorId)} />
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <PostList posts={posts} onSelect={setSelectedPost} />
        )}
      </div>
    </div>
  );
}

/* ─── Post List ───────────────────────────────────────────── */
function PostList({ posts, onSelect }: { posts: Post[]; onSelect: (id: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {posts.map((post) => {
        const count = post.candidaturas.length;
        const pending = post.candidaturas.filter((c) => c.status === "pendente").length;
        return (
          <button
            key={post.id}
            onClick={() => onSelect(post.id)}
            style={{
              width: "100%", backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E",
              borderRadius: "14px", padding: "16px", textAlign: "left", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {post.title ?? post.description?.slice(0, 50) ?? "Pedido sem título"}
              </p>
              <p style={{ fontSize: "12px", color: "#555555" }}>
                {count === 0 ? "Nenhuma proposta" : `${count} proposta${count > 1 ? "s" : ""}`}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              {pending > 0 && (
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "#FFD11A", color: "#0F0F0F", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {pending}
                </span>
              )}
              <ChevronIcon />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Proposal List ───────────────────────────────────────── */
function ProposalList({ post, onUpdateStatus }: { post: Post; onUpdateStatus: (id: string, status: "aceito" | "recusado", prestadorId: string) => void }) {
  if (post.candidaturas.length === 0) {
    return (
      <div style={{ textAlign: "center", paddingTop: "60px" }}>
        <p style={{ fontSize: "16px", color: "#888888", marginBottom: "8px" }}>Nenhuma proposta ainda</p>
        <p style={{ fontSize: "13px", color: "#555555" }}>Aguarde prestadores responderem ao seu pedido</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <p style={{ fontSize: "13px", color: "#555555", marginBottom: "4px" }}>
        {post.title ?? post.description?.slice(0, 60) ?? "Pedido"}
      </p>
      {post.candidaturas.map((c) => {
        const name = c.profiles?.full_name ?? "Prestador";
        const initial = name.charAt(0).toUpperCase();
        const isPending = c.status === "pendente";
        return (
          <div key={c.id} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "16px" }}>
            {/* Prestador */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>{initial}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0F0F0" }}>{name}</p>
                <StatusBadge status={c.status} />
              </div>
              {c.valor != null && (
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#FFD11A", flexShrink: 0 }}>
                  R$ {c.valor.toLocaleString("pt-BR")}
                </p>
              )}
            </div>

            {/* Proposta */}
            {c.descricao && (
              <p style={{ fontSize: "13px", color: "#C0C0C0", lineHeight: 1.6, marginBottom: isPending ? "14px" : 0 }}>
                {c.descricao}
              </p>
            )}

            {/* Actions */}
            {isPending && (
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => onUpdateStatus(c.id, "recusado", c.prestador_id)}
                  style={{ flex: 1, height: "38px", backgroundColor: "transparent", color: "#888888", border: "1px solid #2E2E2E", borderRadius: "999px", fontSize: "13px", fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
                >
                  Recusar
                </button>
                <button
                  onClick={() => onUpdateStatus(c.id, "aceito", c.prestador_id)}
                  style={{ flex: 1, height: "38px", backgroundColor: "#FFD11A", color: "#0F0F0F", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-inter), Inter, sans-serif", cursor: "pointer" }}
                >
                  Aceitar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Status Badge ────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    pendente: { label: "Pendente", color: "#888888" },
    aceito:   { label: "Aceito",   color: "#1D9E75" },
    recusado: { label: "Recusado", color: "#E24B4A" },
  };
  const s = map[status] ?? map.pendente;
  return <span style={{ fontSize: "11px", color: s.color }}>{s.label}</span>;
}

/* ─── Loading Skeleton ────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "14px", padding: "16px" }}>
          <div style={{ width: "60%", height: 14, borderRadius: 4, backgroundColor: "#2A2A2A", marginBottom: 8 }} />
          <div style={{ width: "30%", height: 11, borderRadius: 4, backgroundColor: "#222222" }} />
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ textAlign: "center", paddingTop: "80px" }}>
      <p style={{ fontSize: "16px", color: "#888888", marginBottom: "8px" }}>Nenhum pedido publicado</p>
      <p style={{ fontSize: "13px", color: "#555555", marginBottom: "24px" }}>Crie um pedido para receber propostas de prestadores</p>
      <Link href="/novo-pedido" style={{ height: "44px", padding: "0 28px", borderRadius: "999px", backgroundColor: "#FFD11A", color: "#0F0F0F", fontSize: "14px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
        Criar pedido
      </Link>
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>;
}
function ChevronIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}
