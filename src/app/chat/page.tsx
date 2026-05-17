"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";

interface Mensagem {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface OtherUser {
  id: string;
  full_name: string | null;
}

function ChatInner() {
  const router = useRouter();
  const params = useSearchParams();
  const postId = params.get("post_id");
  const prestadorId = params.get("prestador_id");

  const [userId, setUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);
  const [isContratante, setIsContratante] = useState(false);
  const [candidaturaId, setCandidaturaId] = useState<string | null>(null);
  const [generatingContract, setGeneratingContract] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }
      setUserId(user.id);

      if (!postId || !prestadorId) { setReady(true); return; }

      // Determine contratante: fetch post owner
      const { data: post } = await supabase
        .from("posts")
        .select("user_id")
        .eq("id", postId)
        .single();

      if (!post) { setReady(true); return; }

      const contratanteId = post.user_id as string;
      const userIsContratante = user.id === contratanteId;
      setIsContratante(userIsContratante);
      const otherUserId = userIsContratante ? prestadorId : contratanteId;

      // Check for an accepted candidatura
      if (userIsContratante) {
        const { data: cand } = await supabase
          .from("candidaturas")
          .select("id")
          .eq("post_id", postId)
          .eq("prestador_id", prestadorId)
          .eq("status", "aceito")
          .maybeSingle();
        if (cand) setCandidaturaId(cand.id);
      }

      // Fetch other user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", otherUserId)
        .single();
      setOtherUser(profile);

      // Find or create chat
      let { data: existing } = await supabase
        .from("chats")
        .select("id")
        .eq("post_id", postId)
        .eq("contratante_id", contratanteId)
        .eq("prestador_id", prestadorId)
        .maybeSingle();

      if (!existing) {
        const { data: created } = await supabase
          .from("chats")
          .insert({ post_id: postId, contratante_id: contratanteId, prestador_id: prestadorId, status: "ativo" })
          .select("id")
          .single();
        existing = created;
      }

      if (!existing) { setReady(true); return; }
      setChatId(existing.id);

      // Load existing messages
      const { data: msgs } = await supabase
        .from("mensagens")
        .select("*")
        .eq("chat_id", existing.id)
        .order("created_at", { ascending: true });
      setMensagens((msgs as Mensagem[]) ?? []);
      setReady(true);
    }
    init();
  }, [router, postId, prestadorId]);

  // Realtime subscription
  useEffect(() => {
    if (!chatId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensagens", filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMensagens((prev) => {
            const msg = payload.new as Mensagem;
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  async function sendMessage() {
    if (!text.trim() || !chatId || !userId || sending) return;
    const content = text.trim();
    setText("");
    setSending(true);
    const supabase = createClient();
    await supabase.from("mensagens").insert({
      chat_id: chatId,
      sender_id: userId,
      content,
      type: "texto",
    });
    setSending(false);
  }

  async function gerarContrato() {
    if (!chatId || !postId || !candidaturaId || generatingContract) return;
    setGeneratingContract(true);
    try {
      const res = await fetch("/api/gerar-contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, post_id: postId, candidatura_id: candidaturaId }),
      });
      const json = await res.json() as { contrato?: { id: string }; error?: string };
      if (json.contrato) {
        router.push(`/contrato/${json.contrato.id}`);
      }
    } finally {
      setGeneratingContract(false);
    }
  }

  const otherName = otherUser?.full_name ?? "Usuário";
  const otherInitial = otherName.charAt(0).toUpperCase();

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "60px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px" }}>
        <Link href="/conversas" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", color: "#F0F0F0", textDecoration: "none", flexShrink: 0 }}>
          <ArrowLeftIcon />
        </Link>
        <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>{otherInitial}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{otherName}</p>
          <p style={{ fontSize: "11px", color: "#1D9E75" }}>online</p>
        </div>
        {isContratante && candidaturaId && (
          <button
            onClick={gerarContrato}
            disabled={generatingContract}
            style={{
              height: "32px", padding: "0 12px", borderRadius: "999px", flexShrink: 0,
              backgroundColor: generatingContract ? "#3A3A3A" : "#FFD11A",
              color: generatingContract ? "#888888" : "#0F0F0F",
              border: "none", fontSize: "12px", fontWeight: 600,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              cursor: generatingContract ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {generatingContract ? "Gerando…" : "Gerar Contrato"}
          </button>
        )}
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "72px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {!ready ? (
            <p style={{ textAlign: "center", color: "#555555", fontSize: "13px", marginTop: "40px" }}>Carregando…</p>
          ) : mensagens.length === 0 ? (
            <p style={{ textAlign: "center", color: "#555555", fontSize: "13px", marginTop: "40px" }}>Nenhuma mensagem ainda. Diga olá!</p>
          ) : (
            mensagens.map((m) => {
              const isMe = m.sender_id === userId;
              return (
                <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "75%",
                      backgroundColor: isMe ? "#FFD11A" : "#1A1A1A",
                      color: isMe ? "#0F0F0F" : "#F0F0F0",
                      border: isMe ? "none" : "1px solid #2E2E2E",
                      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding: "10px 14px",
                      fontSize: "14px",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#0F0F0F", borderTop: "1px solid #2E2E2E", padding: "10px 16px", display: "flex", gap: "10px", alignItems: "flex-end", zIndex: 50 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Digite uma mensagem…"
          rows={1}
          style={{
            flex: 1, backgroundColor: "#1A1A1A", border: "1px solid #2E2E2E", borderRadius: "20px",
            padding: "10px 16px", fontSize: "14px", color: "#F0F0F0", fontFamily: "var(--font-inter), Inter, sans-serif",
            outline: "none", resize: "none", lineHeight: 1.5, maxHeight: "120px", overflowY: "auto",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || sending}
          style={{
            width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
            backgroundColor: text.trim() ? "#FFD11A" : "#2A2A2A",
            border: "none", cursor: text.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background-color 0.15s",
          }}
        >
          <SendIcon active={!!text.trim()} />
        </button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh" }} />}>
      <ChatInner />
    </Suspense>
  );
}

/* ─── Icons ───────────────────────────────────────────────── */
function ArrowLeftIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>;
}
function SendIcon({ active }: { active: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#0F0F0F" : "#555555"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}
