import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { chat_id: string; post_id: string; candidatura_id: string };
  const { chat_id, post_id, candidatura_id } = body;

  // Fetch all needed data in parallel
  const [{ data: post }, { data: candidatura }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", post_id).single(),
    supabase.from("candidaturas").select("*").eq("id", candidatura_id).single(),
  ]);

  if (!post || !candidatura) {
    return NextResponse.json({ error: "Dados não encontrados" }, { status: 404 });
  }

  const [{ data: contratante }, { data: prestador }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", post.user_id).single(),
    supabase.from("profiles").select("full_name").eq("id", candidatura.prestador_id).single(),
  ]);

  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  // Call Claude API
  const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Gere um contrato de prestação de serviço simples e objetivo em português brasileiro com os seguintes dados:
Contratante: ${contratante?.full_name ?? "Contratante"}
Prestador: ${prestador?.full_name ?? "Prestador"}
Serviço: ${post.title ?? ""} — ${post.description ?? ""}
Valor: R$ ${candidatura.valor ?? 0}
Cidade: ${post.city ?? ""}
Data: ${hoje}

O contrato deve ter: identificação das partes, objeto do contrato, valor e forma de pagamento, prazo, obrigações de cada parte, rescisão e assinatura. Seja direto e use linguagem simples.`,
        },
      ],
    }),
  });

  if (!claudeRes.ok) {
    const err = await claudeRes.text();
    return NextResponse.json({ error: `Erro na API Claude: ${err}` }, { status: 502 });
  }

  const claudeData = await claudeRes.json() as { content: { text: string }[] };
  const textoContrato = claudeData.content[0]?.text ?? "";

  // Save to contratos table
  const { data: contrato, error: insertError } = await supabase
    .from("contratos")
    .insert({
      chat_id,
      contratante_id: post.user_id,
      prestador_id: candidatura.prestador_id,
      descricao: textoContrato,
      valor_total: candidatura.valor ?? null,
      status: "rascunho",
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ contrato });
}
