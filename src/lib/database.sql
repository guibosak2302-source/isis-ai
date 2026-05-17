-- TABELA DE PERFIS
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  avatar_url text,
  type text check (type in ('contratante', 'prestador')),
  city text,
  state text,
  bio text,
  category text,
  score integer default 0,
  seal text default 'bronze' check (seal in ('bronze', 'prata', 'ouro')),
  verified boolean default false,
  latitude numeric,
  longitude numeric,
  notificacoes_whatsapp boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Migração: adicionar coordenadas em perfis existentes
-- alter table public.profiles add column if not exists latitude numeric;
-- alter table public.profiles add column if not exists longitude numeric;
-- alter table public.profiles add column if not exists notificacoes_whatsapp boolean default false;

-- TABELA DE POSTS
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  description text,
  category text,
  city text,
  state text,
  budget_min numeric,
  budget_max numeric,
  deadline text,
  status text default 'aberto' check (status in ('aberto', 'em_andamento', 'concluido', 'cancelado')),
  photos text[],
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Migração: adicionar coordenadas em instâncias existentes
-- alter table public.posts add column if not exists latitude numeric;
-- alter table public.posts add column if not exists longitude numeric;

-- TABELA DE CANDIDATURAS
create table public.candidaturas (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  prestador_id uuid references public.profiles(id) on delete cascade,
  valor numeric,
  prazo text,
  descricao text,
  status text default 'pendente' check (status in ('pendente', 'aceito', 'recusado')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TABELA DE CHATS
create table public.chats (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade,
  contratante_id uuid references public.profiles(id) on delete cascade,
  prestador_id uuid references public.profiles(id) on delete cascade,
  status text default 'ativo' check (status in ('ativo', 'arquivado')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TABELA DE MENSAGENS
create table public.mensagens (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  content text,
  type text default 'texto' check (type in ('texto', 'foto', 'contrato', 'pagamento')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TABELA DE CONTRATOS
create table public.contratos (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade,
  contratante_id uuid references public.profiles(id) on delete cascade,
  prestador_id uuid references public.profiles(id) on delete cascade,
  descricao text,
  valor_total numeric,
  prazo text,
  etapas jsonb,
  status text default 'rascunho' check (status in ('rascunho', 'aguardando_assinatura', 'assinado', 'em_andamento', 'concluido', 'cancelado')),
  pdf_url text,
  clicksign_key text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- TABELA DE PAGAMENTOS
create table public.pagamentos (
  id uuid default gen_random_uuid() primary key,
  contrato_id uuid references public.contratos(id) on delete cascade,
  etapa_numero integer,
  valor numeric,
  status text default 'pendente' check (status in ('pendente', 'aguardando', 'pago', 'liberado', 'cancelado')),
  asaas_id text,
  pix_qrcode text,
  pix_copia_cola text,
  etapas jsonb,
  etapa_atual integer default 0,
  valor_liberado numeric default 0,
  paid_at timestamp with time zone,
  released_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Migração: adicionar colunas de etapas em instâncias existentes
-- alter table public.pagamentos add column if not exists etapas jsonb;
-- alter table public.pagamentos add column if not exists etapa_atual integer default 0;
-- alter table public.pagamentos add column if not exists valor_liberado numeric default 0;

-- TABELA DE AVALIAÇÕES
create table public.avaliacoes (
  id uuid default gen_random_uuid() primary key,
  contrato_id uuid references public.contratos(id) on delete cascade,
  avaliador_id uuid references public.profiles(id) on delete cascade,
  avaliado_id uuid references public.profiles(id) on delete cascade,
  qualidade integer check (qualidade between 1 and 5),
  pontualidade integer check (pontualidade between 1 and 5),
  comunicacao integer check (comunicacao between 1 and 5),
  preco integer check (preco between 1 and 5),
  comentario text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- HABILITAR ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.candidaturas enable row level security;
alter table public.chats enable row level security;
alter table public.mensagens enable row level security;
alter table public.contratos enable row level security;
alter table public.pagamentos enable row level security;
alter table public.avaliacoes enable row level security;

-- POLÍTICAS DE ACESSO
create policy "Perfis públicos" on public.profiles for select using (true);
create policy "Usuário edita próprio perfil" on public.profiles for update using (auth.uid() = id);
create policy "Usuário insere próprio perfil" on public.profiles for insert with check (auth.uid() = id);
create policy "Posts públicos" on public.posts for select using (true);
create policy "Usuário cria post" on public.posts for insert with check (auth.uid() = user_id);
create policy "Usuário edita próprio post" on public.posts for update using (auth.uid() = user_id);
create policy "Candidaturas visíveis" on public.candidaturas for select using (true);
create policy "Prestador se candidata" on public.candidaturas for insert with check (auth.uid() = prestador_id);
create policy "Participantes veem chat" on public.chats for select using (auth.uid() = contratante_id or auth.uid() = prestador_id);
create policy "Criar chat" on public.chats for insert with check (auth.uid() = contratante_id or auth.uid() = prestador_id);
create policy "Participantes veem mensagens" on public.mensagens for select using (
  exists (select 1 from public.chats where id = chat_id and (contratante_id = auth.uid() or prestador_id = auth.uid()))
);
create policy "Enviar mensagem" on public.mensagens for insert with check (auth.uid() = sender_id);
create policy "Partes veem contrato" on public.contratos for select using (auth.uid() = contratante_id or auth.uid() = prestador_id);
create policy "Criar contrato" on public.contratos for insert with check (auth.uid() = contratante_id or auth.uid() = prestador_id);
create policy "Atualizar contrato" on public.contratos for update using (auth.uid() = contratante_id or auth.uid() = prestador_id);
create policy "Partes veem pagamentos" on public.pagamentos for select using (
  exists (select 1 from public.contratos where id = contrato_id and (contratante_id = auth.uid() or prestador_id = auth.uid()))
);
create policy "Contratante insere pagamento" on public.pagamentos for insert with check (
  exists (select 1 from public.contratos where id = contrato_id and contratante_id = auth.uid())
);
create policy "Contratante atualiza pagamento" on public.pagamentos for update using (
  exists (select 1 from public.contratos where id = contrato_id and contratante_id = auth.uid())
);
create policy "Avaliações públicas" on public.avaliacoes for select using (true);
create policy "Criar avaliação" on public.avaliacoes for insert with check (auth.uid() = avaliador_id);

-- TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE NO CADASTRO
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TABELA DE CONVITES
create table public.convites (
  id uuid default gen_random_uuid() primary key,
  email_indicado text not null unique,
  indicado_por uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create policy "Inserir convite" on public.convites for insert with check (true);
alter table public.convites enable row level security;
