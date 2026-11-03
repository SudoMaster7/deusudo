-- ═══════════════════════════════════════════════════════════════
-- Registro de interesse do cliente em potencial, vindo do site.
--
-- Rode este arquivo uma vez no SQL Editor do Supabase.
-- Cada visita é uma linha, identificada pela sessão do navegador.
-- As interações no site e a conversa com o agente "S" ficam em jsonb.
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.interesse_site (
    id            uuid primary key default gen_random_uuid(),
    sessao        text not null unique,

    -- De onde a pessoa veio
    origem        text,          -- "anúncio no Instagram", "busca no Google"...
    campanha      text,          -- campanha, conjunto e anúncio, quando vêm na URL
    chegou_em     text,          -- primeira página que ela abriu

    -- O que a prendeu e o que ela fez
    gancho        text,          -- primeira seção em que mexeu de verdade
    pagina        text,          -- onde estava na última interação
    atividade     jsonb not null default '[]'::jsonb,

    -- A mensagem que ela mandou para o seu WhatsApp
    mensagem_enviada text,

    -- A conversa com o agente, na ordem
    conversa      jsonb not null default '[]'::jsonb,
    mensagens     int   not null default 0,

    -- Qualificação extraída da conversa (mesmas chaves que sudo.leads no bot)
    nome          text,
    negocio       text,
    ramo          text,
    cidade        text,
    dor           text,
    interesse     text,

    -- true quando pediu preço, reunião ou falar com alguém
    quente        boolean not null default false,

    criado_em     timestamptz not null default now(),
    atualizado_em timestamptz not null default now()
);

create index if not exists idx_interesse_quente
    on public.interesse_site (quente, atualizado_em desc);
create index if not exists idx_interesse_origem
    on public.interesse_site (origem);

-- Se a tabela já existia antes destas colunas, isto a atualiza sem perder dados.
alter table public.interesse_site add column if not exists origem           text;
alter table public.interesse_site add column if not exists campanha         text;
alter table public.interesse_site add column if not exists chegou_em        text;
alter table public.interesse_site add column if not exists gancho           text;
alter table public.interesse_site add column if not exists mensagem_enviada text;
create index if not exists idx_interesse_recente
    on public.interesse_site (atualizado_em desc);

-- ───────────────────────────────────────────────────────────────
-- Segurança
--
-- RLS ligado e NENHUMA política de leitura: ninguém lê esta tabela pelo
-- REST, nem com a chave publicável. Você lê pelo painel do Supabase,
-- que usa outro caminho.
-- ───────────────────────────────────────────────────────────────
alter table public.interesse_site enable row level security;

-- ⚠️ ESCOLHA UM DOS DOIS CAMINHOS

-- CAMINHO A (recomendado) — chave secreta (sb_secret_... ou service_role).
-- Ela ignora o RLS, então não precisa de política nenhuma. Se você usar
-- esse caminho, NÃO rode o bloco do caminho B.

-- CAMINHO B — chave publicável (sb_publishable_...).
-- Ela respeita o RLS, então precisa de permissão explícita para gravar.
-- Libera só escrever, nunca ler. Quem tiver a chave publicável consegue
-- inserir linhas (a chave é pública por definição); como `sessao` é um uuid
-- impossível de adivinhar, ninguém sobrescreve o registro de outra pessoa.
-- Descomente as quatro linhas abaixo se for usar a chave publicável:

-- create policy "site grava interesse" on public.interesse_site
--     for insert to anon with check (true);
-- create policy "site atualiza a propria sessao" on public.interesse_site
--     for update to anon using (true) with check (true);

-- ───────────────────────────────────────────────────────────────
-- Painel de leitura: os leads mais quentes primeiro.
--   select * from public.v_interesse;
-- ───────────────────────────────────────────────────────────────
create or replace view public.v_interesse as
select
    sessao,
    coalesce(origem, '— desconhecida')  as veio_de,
    campanha,
    coalesce(gancho, '— só navegou')    as gancho,
    coalesce(nome, '— a descobrir')    as nome,
    coalesce(negocio, '— a descobrir') as negocio,
    coalesce(ramo, '— a descobrir')    as ramo,
    coalesce(cidade, '— a descobrir')  as cidade,
    dor,
    interesse,
    quente,
    mensagens,
    jsonb_array_length(atividade) as interacoes_no_site,
    pagina,
    chegou_em,
    mensagem_enviada,
    criado_em,
    atualizado_em,
    case
        when atualizado_em < now() - interval '7 days' then 'frio'
        when atualizado_em < now() - interval '2 days' then 'morno'
        else 'quente'
    end as temperatura,
    atividade,
    conversa
from public.interesse_site
order by quente desc, atualizado_em desc;
