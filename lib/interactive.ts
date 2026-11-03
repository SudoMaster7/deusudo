// Dados das duas seções em que o visitante mexe: o simulador de perdas
// (#diagnostico) e o laboratório do atendente (#testar).

// ── Simulador ────────────────────────────────────────────────────

/** Dores que o visitante marca. Cada uma puxa uma solução. */
export const pains = [
  { key: "resposta", label: "Mensagem que fica sem resposta", solves: "ia" },
  { key: "horario", label: "Chega de madrugada e no fim de semana", solves: "ia" },
  { key: "preco", label: "Pergunta o preço e desaparece", solves: "ia" },
  { key: "noshow", label: "Marca a avaliação e não aparece", solves: "ia" },
  { key: "poucos", label: "Chega pouca gente nova", solves: "ads" },
  { key: "errado", label: "Chega quem não paga o meu ticket", solves: "ads" },
  { key: "manual", label: "Agenda e ficha anotadas à mão", solves: "sis" },
  { key: "dados", label: "Não sei quanto custa cada paciente novo", solves: "rel" },
] as const;

export type PainKey = (typeof pains)[number]["key"];

export const painFixes: Record<string, { title: string; text: string }> = {
  ia: {
    title: "Atendente de IA no WhatsApp",
    text: "Responde em segundos, 24h, com os seus procedimentos e faixas de valor, puxa a avaliação e lembra o paciente antes do horário, para a cadeira não ficar vazia.",
  },
  ads: {
    title: "Tráfego pago direcionado",
    text: "Anúncio para quem tem perfil e condição de fechar o seu ticket, com destino direto no WhatsApp e custo por conversa medido.",
  },
  sis: {
    title: "Sistema sob medida",
    text: "Agenda, ficha e plano de tratamento num lugar só, com prontuário dentro da LGPD.",
  },
  rel: {
    title: "Relatório mensal",
    text: "Quanto custou cada paciente novo, qual anúncio ainda traz avaliação e o que mudar no mês seguinte.",
  },
};

/** Valores iniciais do simulador. O visitante muda todos. */
export const simDefaults = {
  mensagens: 80, // por semana
  rapidas: 40, // % respondidas no mesmo dia
  ticket: 2800, // R$ — ticket de tratamento, não de sessão avulsa
  fechamento: 20, // % que fecha quando é bem atendida
};

export const simRanges = {
  mensagens: { min: 10, max: 400, step: 10 },
  rapidas: { min: 0, max: 100, step: 5 },
  ticket: { min: 200, max: 30000, step: 100 },
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
  odonto: {
    biz: "Clínica Vértice Odontologia",
    sells: "implantes, lentes e alinhadores invisíveis",
    tone: "formal",
    hours: "24h",
    price: "R$ 350,00 a avaliação com tomografia",
    tellsPrice: true,
    books: true,
    never: "fechar valor de implante sem a tomografia da avaliação",
  },
  harmonizacao: {
    biz: "Clínica Lumière",
    sells: "toxina botulínica, preenchimento e bioestimulador",
    tone: "caloroso",
    hours: "24h",
    price: "R$ 250,00 a avaliação facial",
    tellsPrice: false,
    books: true,
    never: "prometer resultado ou falar do caso de outro paciente",
  },
  capilar: {
    biz: "Instituto Raiz",
    sells: "transplante capilar FUE e tratamento capilar",
    tone: "direto",
    hours: "24h",
    price: "R$ 400,00 a avaliação com tricoscopia",
    tellsPrice: true,
    books: true,
    never: "estimar número de fios sem a tricoscopia",
  },
  estetica: {
    biz: "Clínica Aurora",
    sells: "protocolos corporais e faciais",
    tone: "caloroso",
    hours: "24h",
    price: "R$ 200,00 a avaliação corporal",
    tellsPrice: true,
    books: true,
    never: "vender pacote antes da avaliação",
  },
};

/** Perguntas que o visitante pode disparar com um toque. */
export const labQuestions = [
  { key: "preco", text: "Quanto custa?" },
  { key: "horario", text: "Vocês atendem agora?" },
  { key: "agendar", text: "Consigo marcar uma avaliação?" },
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
  if (/(preco|valor|quanto|custa|orcamento|parcel|cartao|convenio|mensalidade|caro)/.test(t)) return "preco";
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
