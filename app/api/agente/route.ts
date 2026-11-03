// Cérebro do agente "S" do canto do site.
//
// Recebe a conversa e o que a pessoa já fez no site, responde com o Groq e grava
// o registro de interesse no Supabase. Se o Groq falhar em todos os modelos, a
// resposta cai para uma frase de contingência e a conversa continua.
//
// Precisa de GROQ_API_KEY no ambiente. SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
// são opcionais: sem elas o agente responde, mas nada é gravado.

import { NextResponse } from "next/server";
import { AGENT_FALLBACK, AGENT_SYSTEM_PROMPT } from "@/lib/agentPrompt";
import { salvarInteresse, type Turno } from "@/lib/leadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROQ = "https://api.groq.com/openai/v1/chat/completions";

// Mesma cascata do bot do WhatsApp: se um modelo falha ou está no limite,
// tenta o seguinte.
const MODELOS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound",
  "groq/compound-mini",
];

// Limites: protegem a chave do Groq de abuso e o custo de ficar aberto.
const MAX_CARACTERES = 1000;
const MAX_TURNOS = 24;
const JANELA_MS = 60_000;
const MAX_POR_JANELA = 12;

// Controle de uso por IP. É best-effort: cada instância do servidor tem o seu
// mapa, e ele zera num novo deploy. Serve para conter abuso casual, não ataque.
const uso = new Map<string, { n: number; desde: number }>();

function excedeuUso(ip: string) {
  const agora = Date.now();
  const atual = uso.get(ip);
  if (!atual || agora - atual.desde > JANELA_MS) {
    uso.set(ip, { n: 1, desde: agora });
    return false;
  }
  atual.n += 1;
  if (uso.size > 5000) uso.clear(); // não deixa o mapa crescer sem limite
  return atual.n > MAX_POR_JANELA;
}

const texto = (v: unknown, max = MAX_CARACTERES) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function lerTurnos(bruto: unknown): Turno[] {
  if (!Array.isArray(bruto)) return [];
  return bruto
    .slice(-MAX_TURNOS)
    .map((m) => {
      const papel = (m as Turno)?.role === "assistant" ? "assistant" : "user";
      return { role: papel, content: texto((m as Turno)?.content) } as Turno;
    })
    .filter((m) => m.content);
}

/** Palavras que indicam que a conversa esquentou e merece seu contato. */
const GATILHOS =
  /(quanto custa|preco|preço|valor|mensalidade|orcamento|orçamento|proposta|contratar|fechar|reuniao|reunião|marcar|agendar|whatsapp|falar com|humano|atendente|leonardo)/i;

/**
 * O painel mostra texto cru. Se o modelo escapar e devolver markdown, tira a
 * formatação aqui em vez de exibir asteriscos e cerquilhas para o visitante.
 */
function limparResposta(bruto: string) {
  return bruto
    .replace(/```[\s\S]*?```/g, "") // bloco de código
    .replace(/^#{1,6}\s*/gm, "") // título
    .replace(/\*\*(.+?)\*\*/g, "$1") // negrito
    .replace(/(?<!\w)__(.+?)__(?!\w)/g, "$1")
    .replace(/(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])/g, "$1") // itálico
    .replace(/^\s*[*+]\s+/gm, "- ") // marcador de lista
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1") // link
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function perguntarAoGroq(messages: { role: string; content: string }[], chave: string) {
  for (const model of MODELOS) {
    try {
      const corpo: Record<string, unknown> = {
        model,
        temperature: 0.4,
        max_tokens: 400,
        messages,
      };
      if (model.startsWith("openai/gpt-oss")) corpo.reasoning_effort = "low";

      const r = await fetch(GROQ, {
        method: "POST",
        headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
        signal: AbortSignal.timeout(20_000),
        cache: "no-store",
      });
      if (!r.ok) continue;

      const dados = await r.json();
      const resposta = dados?.choices?.[0]?.message?.content;
      if (typeof resposta === "string" && resposta.trim()) {
        const limpa = limparResposta(resposta);
        if (limpa) return { texto: limpa, modelo: model };
      }
    } catch {
      // tenta o próximo modelo
    }
  }
  return null;
}

/**
 * Extração dos dados de qualificação, com as mesmas chaves que o bot do
 * WhatsApp grava. Só roda quando a conversa esquenta, para não gastar uma
 * chamada a cada mensagem.
 */
async function extrairDados(conversa: Turno[], chave: string) {
  const INSTRUCAO = [
    "Você extrai dados de qualificação de uma conversa comercial da SUDO.",
    "Responda SOMENTE com um JSON válido, sem nenhum texto antes ou depois:",
    '{"nome_pessoa":"","nome_negocio":"","segmento":"","cidade":"","dor_principal":"","solucao_interesse":""}',
    "",
    "REGRAS:",
    "- Preencha apenas o que a PESSOA afirmou de forma explícita. Nunca deduza, nunca invente.",
    "- O que não foi dito fica como string vazia.",
    "- segmento: o ramo do negócio em poucas palavras.",
    "- cidade: apenas a cidade e o estado do negócio da pessoa.",
    "- dor_principal: uma frase curta, nas palavras da pessoa.",
    '- solucao_interesse: exatamente um de "ia_whatsapp", "anuncios", "sistemas", ou vazio.',
  ].join("\n");

  const transcricao = conversa
    .map((m) => (m.role === "user" ? "PESSOA: " : "ASSISTENTE: ") + m.content)
    .join("\n");

  try {
    const r = await fetch(GROQ, {
      method: "POST",
      headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0,
        max_tokens: 300,
        reasoning_effort: "low",
        messages: [
          { role: "system", content: INSTRUCAO },
          { role: "user", content: transcricao },
        ],
      }),
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });
    if (!r.ok) return undefined;

    const bruto = (await r.json())?.choices?.[0]?.message?.content ?? "";
    const bloco = String(bruto).match(/\{[\s\S]*\}/);
    if (!bloco) return undefined;

    const lido = JSON.parse(bloco[0]) as Record<string, unknown>;
    const limpo: Record<string, string> = {};
    for (const [k, v] of Object.entries(lido)) {
      if (typeof v === "string" && v.trim()) limpo[k] = v.trim().slice(0, 200);
    }
    return Object.keys(limpo).length ? limpo : undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "desconhecido";

  if (excedeuUso(ip)) {
    return NextResponse.json(
      { reply: "Você mandou muitas mensagens seguidas. Espere um minutinho e eu volto a responder." },
      { status: 429 },
    );
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ error: "corpo inválido" }, { status: 400 });
  }

  const sessao = texto(corpo.sessao, 80);
  const pagina = texto(corpo.pagina, 300);
  const atividade = Array.isArray(corpo.atividade)
    ? corpo.atividade.map((a) => texto(a, 300)).filter(Boolean).slice(0, 20)
    : [];
  const conversa = lerTurnos(corpo.conversa);

  if (!conversa.length || conversa[conversa.length - 1].role !== "user") {
    return NextResponse.json({ error: "nada a responder" }, { status: 400 });
  }

  const chave = process.env.GROQ_API_KEY;
  if (!chave) {
    console.error("[agente] GROQ_API_KEY não configurada");
    return NextResponse.json({ reply: AGENT_FALLBACK, degradado: true });
  }

  const contexto = atividade.length
    ? `\n\nO QUE ESTA PESSOA JÁ FEZ NO SITE:\n${atividade.map((a) => `- ${a}`).join("\n")}` +
      (pagina ? `\nEstá lendo: ${pagina}` : "")
    : pagina
      ? `\n\nA pessoa está lendo: ${pagina}`
      : "";

  const resultado = await perguntarAoGroq(
    [{ role: "system", content: AGENT_SYSTEM_PROMPT + contexto }, ...conversa],
    chave,
  );

  const reply = resultado?.texto ?? AGENT_FALLBACK;
  const completa: Turno[] = [...conversa, { role: "assistant", content: reply }];

  // Esquentou: pediu preço, reunião ou falar com alguém, ou já trocou algumas mensagens.
  const perguntas = conversa.filter((m) => m.role === "user");
  const quente =
    perguntas.some((m) => GATILHOS.test(m.content)) || perguntas.length >= 4 || atividade.length >= 3;

  const dados = quente && perguntas.length >= 2 ? await extrairDados(completa, chave) : undefined;

  // Registro de interesse. Não bloqueia a resposta se falhar.
  const gravacao = sessao
    ? await salvarInteresse({
        sessao,
        pagina,
        atividade,
        conversa: completa,
        quente,
        dados,
        origem: texto(corpo.origem, 160),
        campanha: texto(corpo.campanha, 160),
        chegouEm: texto(corpo.chegou_em, 160),
        gancho: texto(corpo.gancho, 160),
      })
    : "desligado";

  return NextResponse.json({
    reply,
    quente,
    registro: gravacao,
    degradado: !resultado,
    // O painel usa isto para montar uma mensagem de WhatsApp curta e natural,
    // com o que a pessoa contou, em vez de colar a conversa inteira.
    dados: dados ?? null,
  });
}
