// Registro de interesse do cliente em potencial, no Supabase.
//
// Só roda no servidor (rota /api/agente). Grava por REST, com fetch, para o site
// não precisar de driver de banco. A tabela está em supabase/interesse-site.sql.
//
// Se as variáveis de ambiente não estiverem configuradas, nada é gravado e o
// agente continua respondendo normalmente: o registro é um bônus, não um
// requisito para a conversa funcionar.

const URL_BASE = process.env.SUPABASE_URL;
// Aceita a chave secreta (ignora o RLS, caminho recomendado) ou a publicável
// (respeita o RLS, exige o CAMINHO B do supabase/interesse-site.sql).
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const TABELA = "interesse_site";
const LIMITE_MS = 4000;

export const registroAtivo = Boolean(URL_BASE && CHAVE);

export type Turno = { role: "user" | "assistant"; content: string };

export type Registro = {
  sessao: string;
  pagina?: string;
  atividade: string[];
  conversa: Turno[];
  quente: boolean;
  dados?: Record<string, string>;
  /** De onde a pessoa veio: anúncio, campanha, Instagram, busca. */
  origem?: string;
  campanha?: string;
  chegouEm?: string;
  /** A primeira seção em que ela mexeu de verdade. */
  gancho?: string;
  /** A mensagem que ela mandou para o seu WhatsApp. */
  mensagem?: string;
};

/**
 * Grava ou atualiza o registro da visita. Nunca lança: uma falha de gravação
 * não pode derrubar a resposta do agente.
 */
export async function salvarInteresse(r: Registro): Promise<"gravado" | "desligado" | "erro"> {
  if (!registroAtivo) return "desligado";

  // A mesma sessão grava várias vezes: a cada mensagem ao agente e no clique
  // que leva ao WhatsApp. Como é um upsert, qualquer campo enviado vazio
  // apagaria o que uma gravação anterior já tinha descoberto. Então só vai para
  // o corpo o que está realmente preenchido.
  const preenchidos: Record<string, string> = {};
  const incluirSeTiver = (campos: Record<string, string | undefined>) => {
    for (const [chave, valor] of Object.entries(campos)) {
      const limpo = valor?.trim();
      if (limpo) preenchidos[chave] = limpo.slice(0, 300);
    }
  };

  incluirSeTiver({
    origem: r.origem,
    campanha: r.campanha,
    chegou_em: r.chegouEm,
    gancho: r.gancho,
    mensagem_enviada: r.mensagem,
    nome: r.dados?.nome_pessoa,
    negocio: r.dados?.nome_negocio,
    ramo: r.dados?.segmento,
    cidade: r.dados?.cidade,
    dor: r.dados?.dor_principal,
    interesse: r.dados?.solucao_interesse,
    pagina: r.pagina,
  });

  const corpo = {
    ...preenchidos,
    sessao: r.sessao,
    atividade: r.atividade,
    // O clique no WhatsApp não traz conversa. Enviar um array vazio apagaria a
    // conversa que a pessoa já teve com o agente.
    ...(r.conversa.length ? { conversa: r.conversa, mensagens: r.conversa.length } : {}),
    // Lead quente não volta a ser frio: só gravamos quando é verdade.
    ...(r.quente ? { quente: true } : {}),
    atualizado_em: new Date().toISOString(),
  };

  try {
    const resposta = await fetch(`${URL_BASE}/rest/v1/${TABELA}?on_conflict=sessao`, {
      method: "POST",
      headers: {
        apikey: CHAVE as string,
        Authorization: `Bearer ${CHAVE}`,
        "Content-Type": "application/json",
        // merge-duplicates = grava se é novo, atualiza se a sessão já existe.
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(LIMITE_MS),
      cache: "no-store",
    });

    if (!resposta.ok) {
      console.error("[interesse] Supabase recusou:", resposta.status, await resposta.text());
      return "erro";
    }
    return "gravado";
  } catch (e) {
    console.error("[interesse] falha ao gravar:", e instanceof Error ? e.message : e);
    return "erro";
  }
}

// ───────────────────────────────────────────────────────────────
// Leitura, para o painel em /admin
// ───────────────────────────────────────────────────────────────

export type Interessado = {
  sessao: string;
  pagina: string | null;
  origem: string | null;
  campanha: string | null;
  chegou_em: string | null;
  gancho: string | null;
  mensagem_enviada: string | null;
  atividade: string[];
  conversa: Turno[];
  mensagens: number;
  nome: string | null;
  negocio: string | null;
  ramo: string | null;
  cidade: string | null;
  dor: string | null;
  interesse: string | null;
  quente: boolean;
  criado_em: string;
  atualizado_em: string;
};

export type Listagem =
  | { ok: true; linhas: Interessado[] }
  | { ok: false; motivo: "desligado" | "sem-permissao" | "erro"; detalhe?: string };

/**
 * Lê os registros de interesse, mais recentes primeiro.
 *
 * A chave publicável não consegue ler: o RLS da tabela não tem política de
 * leitura, de propósito. Nesse caso devolve "sem-permissao" para o painel
 * explicar o que fazer, em vez de mostrar uma lista vazia como se não
 * houvesse ninguém.
 */
export async function listarInteresse(limite = 200): Promise<Listagem> {
  if (!registroAtivo) return { ok: false, motivo: "desligado" };

  const busca = new URLSearchParams({
    select: "*",
    order: "atualizado_em.desc",
    limit: String(limite),
  });

  try {
    const resposta = await fetch(`${URL_BASE}/rest/v1/${TABELA}?${busca}`, {
      headers: {
        apikey: CHAVE as string,
        Authorization: `Bearer ${CHAVE}`,
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (resposta.status === 401 || resposta.status === 403) {
      return { ok: false, motivo: "sem-permissao" };
    }
    if (!resposta.ok) {
      return { ok: false, motivo: "erro", detalhe: `${resposta.status} ${await resposta.text()}` };
    }

    const linhas = (await resposta.json()) as Interessado[];
    // Lista vazia com chave publicável é quase sempre o RLS bloqueando a leitura,
    // não ausência de visitas. Avisa em vez de enganar.
    if (!linhas.length && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { ok: false, motivo: "sem-permissao" };
    }
    return { ok: true, linhas };
  } catch (e) {
    return { ok: false, motivo: "erro", detalhe: e instanceof Error ? e.message : String(e) };
  }
}
