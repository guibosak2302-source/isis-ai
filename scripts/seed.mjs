// @ts-check
/**
 * Seed script: cria 5 usuários + perfis + 2 posts cada no Supabase.
 * Executar: npm run seed
 * Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// ── Load .env.local ──────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
try {
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    process.env[key] = val;
  }
} catch {
  console.error("Não encontrei .env.local — certifique-se de que o arquivo existe.");
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Faltam variáveis de ambiente:\n" +
    "  NEXT_PUBLIC_SUPABASE_URL\n" +
    "  SUPABASE_SERVICE_ROLE_KEY\n" +
    "Adicione ambas ao .env.local e tente novamente."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Seed data ────────────────────────────────────────────────
const USERS = [
  { name: "Cristiano Ronaldo", email: "cr7@bicoai.com",     city: "Lisboa" },
  { name: "Lionel Messi",      email: "messi@bicoai.com",   city: "Barcelona" },
  { name: "Neymar Junior",     email: "neymar@bicoai.com",  city: "São Paulo" },
  { name: "Rogério Ceni",      email: "ceni@bicoai.com",    city: "São Paulo" },
  { name: "Jonatan Caleri",    email: "caleri@bicoai.com",  city: "Guarulhos" },
];
const PASSWORD = "Bico@2024";

const PHOTO = {
  Faxina:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  Elétrica:"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
  Pintura: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400",
  Reformas:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
  Aulas:   "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
};

/** 2 posts por usuário (categorias rotacionadas) */
function postsForUser(userId, userName, city, index) {
  const sets = [
    [
      { title: "Preciso de faxineira semanal", description: `Apartamento 2 quartos em ${city}. Faxina toda semana, preferencialmente às sextas. Materiais por minha conta.`, category: "Faxina", budget_min: 150, photo_url: PHOTO.Faxina },
      { title: "Instalação elétrica na cozinha", description: `Preciso de eletricista para instalar 3 tomadas novas e trocar o disjuntor da cozinha em ${city}.`, category: "Elétrica", budget_min: 220, photo_url: PHOTO.Elétrica },
    ],
    [
      { title: "Pintura de sala e quarto", description: `Sala e quarto para pintar em ${city}. Já tenho a tinta, preciso da mão de obra. Aproximadamente 40m².`, category: "Pintura", budget_min: 400, photo_url: PHOTO.Pintura },
      { title: "Reforma do banheiro", description: `Reforma completa do banheiro: troca de revestimentos, vaso e torneiras em ${city}.`, category: "Reformas", budget_min: 1800, photo_url: PHOTO.Reformas },
    ],
    [
      { title: "Aulas de inglês para iniciantes", description: `Procuro professor de inglês para aulas semanais em ${city}. Sou iniciante, foco em conversação.`, category: "Aulas", budget_min: 80, photo_url: PHOTO.Aulas },
      { title: "Faxina pós-obra", description: `Casa recém-reformada em ${city} precisa de limpeza completa pós-obra. 3 cômodos.`, category: "Faxina", budget_min: 300, photo_url: PHOTO.Faxina },
    ],
    [
      { title: "Instalação de ar-condicionado", description: `Preciso instalar 2 splits em ${city}. Aparelhos já comprados, só a mão de obra.`, category: "Elétrica", budget_min: 350, photo_url: PHOTO.Elétrica },
      { title: "Pintura fachada", description: `Fachada de sobrado em ${city} para pintar. Andaime já disponível.`, category: "Pintura", budget_min: 900, photo_url: PHOTO.Pintura },
    ],
    [
      { title: "Montagem de móveis", description: `Comprei móveis novos e preciso de ajuda para montar sofá, rack e estante em ${city}.`, category: "Reformas", budget_min: 120, photo_url: PHOTO.Reformas },
      { title: "Aulas de matemática ensino médio", description: `Procuro professor de matemática para meu filho em ${city}. 2x por semana.`, category: "Aulas", budget_min: 70, photo_url: PHOTO.Aulas },
    ],
  ];

  return sets[index % sets.length].map((p) => ({
    ...p,
    user_id: userId,
    city,
    status: "aberto",
  }));
}

// ── Main ─────────────────────────────────────────────────────
async function seed() {
  console.log("🌱  Iniciando seed...\n");
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < USERS.length; i++) {
    const { name, email, city } = USERS[i];
    process.stdout.write(`👤  ${name} (${email}) … `);

    // 1. Criar usuário via Admin API
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    let userId;

    if (authErr) {
      if (authErr.message.toLowerCase().includes("already")) {
        // Usuário já existe — busca o ID
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users?.find((u) => u.email === email);
        if (existing) {
          userId = existing.id;
          process.stdout.write("já existe, atualizando perfil… ");
          skipped++;
        } else {
          console.log(`❌  Erro: ${authErr.message}`);
          continue;
        }
      } else {
        console.log(`❌  Erro auth: ${authErr.message}`);
        continue;
      }
    } else {
      userId = authData.user.id;
      created++;
    }

    // 2. Upsert profile
    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: name,
      email,
      city,
      type: "contratante",
    });
    if (profileErr) {
      console.log(`⚠️  Perfil: ${profileErr.message}`);
    }

    // 3. Criar posts (skip se já existirem)
    const posts = postsForUser(userId, name, city, i);
    const { error: postsErr } = await supabase.from("posts").upsert(
      posts.map((p, j) => ({ ...p, id: `seed-${userId.slice(0, 8)}-${j}` })),
      { onConflict: "id" }
    );
    if (postsErr) {
      console.log(`⚠️  Posts: ${postsErr.message}`);
    } else {
      console.log(`✅  ${posts.length} posts`);
    }
  }

  console.log(`\n✅  Seed concluído: ${created} criado(s), ${skipped} já existia(m).`);
  console.log(`\n🔑  Login de teste:`);
  console.log(`    Email:  cr7@bicoai.com`);
  console.log(`    Senha:  Bico@2024`);
}

seed().catch((err) => {
  console.error("\n💥 Erro inesperado:", err);
  process.exit(1);
});
