// Dados das duas seções em que o visitante mexe: o simulador de perdas
// (#diagnostico) e o laboratório do atendente (#testar).

// ── Simulador ────────────────────────────────────────────────────

/** Dores que o visitante marca. Cada uma puxa uma solução. */
export const pains = [
  { key: "resposta", label: "Mensagem que fica sem resposta", solves: "ia" },
  { key: "horario", label: "Cliente chega fora do horário", solves: "ia" },
  { key: "repetida", label: "Respondo a mesma pergunta o dia inteiro", solves: "ia" },
  { key: "poucos", label: "Chega pouca gente nova", solves: "ads" },
  { key: "errado", label: "Chega gente que não é meu cliente", solves: "ads" },
  { key: "manual", label: "Anoto pedido e agenda à mão", solves: "sis" },
  { key: "dados", label: "Não sei quanto custa cada cliente", solves: "rel" },
  { key: "faltou", label: "Cliente marca e não aparece", solves: "ia" },
] as const;

export type PainKey = (typeof pains)[number]["key"];

export const painFixes: Record<string, { title: string; text: string }> = {
  ia: {
    title: "Atendente de IA no WhatsApp",
    text: "Responde em segundos, 24h, com os seus serviços e preços, e lembra o cliente antes do horário marcado.",
  },
  ads: {
    title: "Tráfego pago direcionado",
    text: "Anúncio para o público que compra de você, com destino direto no WhatsApp e custo por conversa medido.",
  },
  sis: {
    title: "Sistema sob medida",
    text: "Pedido, agenda e cadastro num lugar só, do jeito que o seu negócio já funciona.",
  },
  rel: {
    title: "Relatório mensal",
    text: "Quanto custou cada cliente interessado, qual anúncio ainda vende e o que mudar no mês seguinte.",
  },
};

/** Valores iniciais do simulador. O visitante muda todos. */
export const simDefaults = {
  mensagens: 60, // por semana
  rapidas: 40, // % respondidas no mesmo dia
  ticket: 180, // R$
  fechamento: 25, // % que fecha quando é bem atendida
};

export const simRanges = {
  mensagens: { min: 10, max: 400, step: 10 },
  rapidas: { min: 0, max: 100, step: 5 },
  ticket: { min: 40, max: 2000, step: 20 },
  fechamento: { min: 5, max: 60, step: 5 },
};

// ── Laboratório do atendente ─────────────────────────────────────

export const tones = [
  { key: "direto", label: "Direto", hint: "Curto e objetivo." },
  { key: "caloroso", label: "Caloroso", hint: "Acolhedor, com simpatia." },
  { key: "formal", label: "Formal", hint: "Tratamento mais sério." },
] as const;

export type ToneKey = (typeof tones)[number]["key"];

export type BotRules = {
  biz: string;
  sells: string;
  tone: ToneKey;
  hours: "24h" | "comercial";
  price: string;
  tellsPrice: boolean;
  books: boolean;
  never: string;
};

/** Pré-ajuste por ramo, para a pessoa já ver algo parecido com o negócio dela. */
export const labPresets: Record<string, BotRules> = {
  doces: {
    biz: "Doce Ateliê",
    sells: "bolos e doces por encomenda",
    tone: "caloroso",
    hours: "24h",
    price: "R$ 68,00",
    tellsPrice: true,
    books: true,
    never: "prometer entrega para o mesmo dia",
  },
  roupas: {
    biz: "Ateliê Linho",
    sells: "roupas de linho e alfaiataria",
    tone: "direto",
    hours: "24h",
    price: "R$ 189,00",
    tellsPrice: true,
    books: false,
    never: "prometer desconto sem a dona autorizar",
  },
  mecanica: {
    biz: "Oficina Prime",
    sells: "revisão, freios e diagnóstico",
    tone: "direto",
    hours: "comercial",
    price: "R$ 320,00",
    tellsPrice: true,
    books: true,
    never: "fechar orçamento sem ver o carro",
  },
  clinica: {
    biz: "Clínica Aurora",
    sells: "estética e bem-estar",
    tone: "formal",
    hours: "24h",
    price: "R$ 180,00",
    tellsPrice: false,
    books: true,
    never: "falar de resultado de tratamento por mensagem",
  },
};

/** Perguntas que o visitante pode disparar com um toque. */
export const labQuestions = [
  { key: "preco", text: "Quanto custa?" },
  { key: "horario", text: "Vocês atendem agora?" },
  { key: "agendar", text: "Consigo marcar para amanhã?" },
  { key: "robo", text: "Você é um robô?" },
  { key: "endereco", text: "Onde vocês ficam?" },
  { key: "humano", text: "Quero falar com uma pessoa" },
] as const;

export type Intent = (typeof labQuestions)[number]["key"] | "outro";

/** Classifica o que o visitante digitou. Sem IA: o site não chama modelo nenhum. */
export function detectIntent(text: string): Intent {
  const t = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/(preco|valor|quanto|custa|orcamento|mensalidade|caro)/.test(t)) return "preco";
  if (/(agora|aberto|hoje|funciona|atende|horario|que horas)/.test(t)) return "horario";
  if (/(marcar|agendar|reservar|encomendar|amanha|vaga|horario livre)/.test(t)) return "agendar";
  if (/(robo|bot|ia|inteligencia|humano de verdade|automatic)/.test(t)) return "robo";
  if (/(onde|endereco|local|fica|chegar|bairro)/.test(t)) return "endereco";
  if (/(pessoa|atendente|dono|responsavel|falar com alguem|humano)/.test(t)) return "humano";
  return "outro";
}

const openers: Record<ToneKey, string> = {
  direto: "",
  caloroso: "Oi! Que bom te ver por aqui. ",
  formal: "Olá, tudo bem? ",
};

/** Monta a resposta do atendente com as regras que o visitante definiu. */
export function labReply(intent: Intent, r: BotRules): string {
  const abre = openers[r.tone];
  const aberto = r.hours === "24h" ? "Atendemos por aqui a qualquer hora" : "Atendemos de segunda a sábado, das 9h às 19h";

  switch (intent) {
    case "preco":
      return r.tellsPrice
        ? `${abre}O valor começa em ${r.price || "um valor que a gente combina"}. Depende do que você precisa — me conta o que tem em mente que eu já te passo o certo.`
        : `${abre}O valor varia conforme o caso, então eu prefiro não chutar por aqui. Me conta o que você procura e eu já chamo a equipe do ${r.biz} para te passar o exato.`;
    case "horario":
      return `${abre}${aberto}. ${r.biz} trabalha com ${r.sells}, então me diz o que você precisa que eu já resolvo por aqui.`;
    case "agendar":
      return r.books
        ? `${abre}Consigo sim. Me diz o melhor turno para você — manhã ou tarde — que eu já reservo e te confirmo por aqui.`
        : `${abre}Quem fecha o horário é a equipe do ${r.biz}. Já deixei o seu pedido anotado e eles te chamam por aqui para confirmar.`;
    case "robo":
      return `${abre}Sou o atendente de IA do ${r.biz}. Respondo na hora, a qualquer momento, e quando é algo que precisa de gente eu chamo a equipe.`;
    case "endereco":
      return `${abre}Te mando a localização aqui mesmo em seguida. Antes, me conta o que você procura em ${r.sells} que eu já adianto.`;
    case "humano":
      return `${abre}Claro. Já avisei a equipe do ${r.biz} e eles te respondem por aqui. Enquanto isso, posso adiantar alguma dúvida?`;
    default:
      return `${abre}Entendi. O ${r.biz} trabalha com ${r.sells} — me conta um pouco mais do que você precisa que eu te ajudo na hora.`;
  }
}

/** Resumo legível das regras, usado na prévia e na mensagem do WhatsApp. */
export function rulesSummary(r: BotRules) {
  const linhas = [
    `negócio: ${r.biz}`,
    `vende: ${r.sells}`,
    `tom: ${tones.find((t) => t.key === r.tone)?.label ?? r.tone}`,
    `atende: ${r.hours === "24h" ? "24 horas" : "horário comercial"}`,
    `fala preço: ${r.tellsPrice ? `sim, a partir de ${r.price || "valor a definir"}` : "não, chama a equipe"}`,
    `marca horário: ${r.books ? "sim" : "não, só anota e repassa"}`,
  ];
  if (r.never.trim()) linhas.push(`nunca pode: ${r.never.trim()}`);
  return linhas;
}
