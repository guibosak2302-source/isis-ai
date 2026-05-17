"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface ChatRow {
  id: string;
  post_id: string;
  contratante_id: string;
  prestador_id: string;
  updated_at: string | null;
  created_at: string;
  last_message: string | null;
  other_name: string | null;
  other_id: string;
}

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

export default function ConversasPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatRow[] | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      // Fetch chats where user is contratante or prestador
      const { data: rawChats } = await supabase
        .from("chats")
        .select("id, post_id, contratante_id, prestador_id, created_at")
        .or(`contratante_id.eq.${user.id},prestador_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!rawChats) { setChats([]); return; }

      // For each chat, get last message and other user's name
      const enriched = await Promise.all(
        rawChats.map(async (chat) => {
          const otherId = chat.contratante_id === user.id ? chat.prestador_id : chat.contratante_id;

          const [{ data: lastMsg }, { data: profile }] = await Promise.all([
            supabase
              .from("mensagens")
              .select("content, created_at")
              .eq("chat_id", chat.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", otherId)
              .single(),
          ]);

          return {
            ...chat,
            last_message: lastMsg?.content ?? null,
            updated_at: lastMsg?.created_at ?? chat.created_at,
            other_name: profile?.full_name ?? null,
            other_id: otherId,
          } as ChatRow;
        })
      );

      // Sort by most recent message
      enriched.sort((a, b) => new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime());
      setChats(enriched);
    }
    load();
  }, [router]);

  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", fontFamily: "var(--font-inter), Inter, sans-serif", paddingBottom: "40px" }}>
      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px", backgroundColor: "#0F0F0F", borderBottom: "1px solid #2E2E2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <div style={{ width: "36px" }} />
        <span style={{ fontSize: "17px", fontWeight: 500, color: "#F0F0F0" }}>Conversas</span>
        <div style={{ width: "36px" }} />
      </header>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "68px 0 0" }}>
        {chats === null ? (
          <LoadingSkeleton />
        ) : chats.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {chats.map((chat) => {
              const name = chat.other_name ?? "Usuário";
              const initial = name.charAt(0).toUpperCase();
              const time = relativeTime(chat.updated_at ?? chat.created_at);
              const href = `/chat?post_id=${chat.post_id}&prestador_id=${chat.prestador_id}`;
              return (
                <Link
                  key={chat.id}
                  href={href}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "14px 16px", borderBottom: "1px solid #1A1A1A",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#2A2A2A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "18px", fontWeight: 500, color: "#F0F0F0" }}>{initial}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 500, color: "#F0F0F0" }}>{name}</span>
                      <span style={{ fontSize: "11px", color: "#555555", flexShrink: 0, marginLeft: "8px" }}>{time}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#555555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {chat.last_message ?? "Nenhuma mensagem ainda"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderBottom: "1px solid #1A1A1A" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#1A1A1A", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: "40%", height: 14, borderRadius: 4, backgroundColor: "#1A1A1A", marginBottom: 6 }} />
            <div style={{ width: "70%", height: 11, borderRadius: 4, backgroundColor: "#161616" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────── */
function EmptyState() {
  return (
    <div style={{ textAlign: "center", paddingTop: "80px", padding: "80px 24px 0" }}>
      <ChatBubbleIcon />
      <p style={{ fontSize: "16px", color: "#888888", marginTop: "16px", marginBottom: "8px" }}>Nenhuma conversa ainda</p>
      <p style={{ fontSize: "13px", color: "#555555", marginBottom: "24px" }}>Responda a um pedido no feed para iniciar uma conversa</p>
      <Link href="/feed" style={{ height: "44px", padding: "0 28px", borderRadius: "999px", backgroundColor: "#FFD11A", color: "#0F0F0F", fontSize: "14px", fontWeight: 500, fontFamily: "var(--font-inter), Inter, sans-serif", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
        Ver feed
      </Link>
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────────────── */
function ChatBubbleIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3A3A3A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
