export type NicheKey = "doces" | "roupas" | "mecanica" | "clinica";

export type Niche = {
  label: string;
  biz: string;
  tag: string;
  cta: string;
  hello: string;
  chat: { from: "in" | "out"; text: string; time: string }[];
  items: { name: string; desc: string; price: number }[];
  after: string[];
};

export const NICHE_KEYS: NicheKey[] = ["doces", "roupas", "mecanica", "clinica"];

// Negócios fictícios, só para a demonstração.
export const NICHES: Record<NicheKey, Niche> = {
  doces: {
    label: "Doces e bolos",
    biz: "Doce Ateliê",
    tag: "Bolos e doces por encomenda",
    cta: "Enviar pedido pelo WhatsApp",
    hello: "Olá! Quero fazer um pedido:",
    chat: [
      { from: "in", text: "Boa noite! Tem bolo de cenoura para amanhã? Quanto sai?", time: "23:47" },
      { from: "out", text: "Boa noite! Tem sim. O bolo de cenoura com chocolate sai R$ 68,00 e serve 10 fatias.", time: "23:47" },
      { from: "out", text: "Entrego amanhã entre 9h e 18h. Quer que eu já separe um para você?", time: "23:47" },
      { from: "in", text: "Quero! Pode ser às 15h.", time: "23:48" },
      { from: "out", text: "Reservado para 15h. Já te mando o Pix por aqui.", time: "23:48" },
    ],
    items: [
      { name: "Bolo de cenoura com chocolate", desc: "Serve 10 fatias", price: 68 },
      { name: "Caixa de brigadeiros gourmet", desc: "12 unidades", price: 54 },
      { name: "Torta de limão", desc: "Serve 8 fatias", price: 72 },
      { name: "Brownie recheado", desc: "4 unidades", price: 36 },
    ],
    after: [
      "Confirma os itens, o valor e o prazo de entrega.",
      "Manda a chave Pix e confirma o pagamento.",
      "Avisa o cliente quando o pedido sai para entrega.",
    ],
  },
  roupas: {
    label: "Roupas",
    biz: "Ateliê Linho",
    tag: "Moda em linho e alfaiataria",
    cta: "Enviar pedido pelo WhatsApp",
    hello: "Olá! Quero reservar estas peças:",
    chat: [
      { from: "in", text: "Oi! Vocês têm a camisa de linho no tamanho M?", time: "20:12" },
      { from: "out", text: "Oi! Temos sim, no M e no G. A camisa de linho sai R$ 189,00, com troca grátis em 7 dias.", time: "20:12" },
      { from: "out", text: "Posso separar o M e te enviar o link de pagamento?", time: "20:12" },
      { from: "in", text: "Pode separar!", time: "20:13" },
      { from: "out", text: "Separado. O link de pagamento chega em instantes.", time: "20:13" },
    ],
    items: [
      { name: "Camisa de linho", desc: "Tamanhos P ao GG", price: 189 },
      { name: "Calça de alfaiataria", desc: "Tamanhos 36 ao 46", price: 229 },
      { name: "Vestido midi", desc: "Tamanhos P ao G", price: 259 },
      { name: "Cinto de couro", desc: "Preto e caramelo", price: 99 },
    ],
    after: [
      "Confere tamanho e estoque de cada peça.",
      "Envia o link de pagamento.",
      "Manda o código de rastreio quando a peça é despachada.",
    ],
  },
  mecanica: {
    label: "Mecânica",
    biz: "Oficina Prime",
    tag: "Revisão, freios e diagnóstico",
    cta: "Pedir orçamento pelo WhatsApp",
    hello: "Olá! Quero um orçamento para:",
    chat: [
      { from: "in", text: "Meu carro está fazendo barulho ao frear. Quanto custa olhar?", time: "08:41" },
      { from: "out", text: "A revisão de freios sai a partir de R$ 320,00, com as peças à parte. Qual é o modelo e o ano do carro?", time: "08:41" },
      { from: "in", text: "Onix 2019.", time: "08:42" },
      { from: "out", text: "Tenho quinta às 8h ou sexta às 14h. Qual prefere?", time: "08:42" },
      { from: "in", text: "Quinta às 8h.", time: "08:43" },
      { from: "out", text: "Agendado. Te aviso aqui quando o carro estiver pronto.", time: "08:43" },
    ],
    items: [
      { name: "Troca de óleo e filtro", desc: "Até 5 litros", price: 180 },
      { name: "Revisão de freios", desc: "Mão de obra, peças à parte", price: 320 },
      { name: "Alinhamento e balanceamento", desc: "As 4 rodas", price: 140 },
      { name: "Diagnóstico com scanner", desc: "Laudo por escrito", price: 120 },
    ],
    after: [
      "Pergunta o modelo, o ano e o que o carro está apresentando.",
      "Envia o orçamento detalhado.",
      "Agenda o dia e avisa quando o carro estiver pronto.",
    ],
  },
  clinica: {
    label: "Clínica",
    biz: "Clínica Aurora",
    tag: "Estética e bem-estar",
    cta: "Agendar pelo WhatsApp",
    hello: "Olá! Quero agendar:",
    chat: [
      { from: "in", text: "Boa noite! Vocês atendem amanhã? Quanto custa a limpeza de pele?", time: "23:47" },
      { from: "out", text: "Boa noite! Atendemos sim, amanhã das 9h às 19h. A limpeza de pele profunda sai R$ 180,00 e dura cerca de 1h.", time: "23:47" },
      { from: "out", text: "Tenho 10h30 e 15h livres. Quer que eu já reserve um deles para você?", time: "23:47" },
      { from: "in", text: "Pode ser 10h30.", time: "23:48" },
      { from: "out", text: "Agendado! Vou te mandar um lembrete amanhã de manhã.", time: "23:48" },
    ],
    items: [
      { name: "Avaliação inicial", desc: "40 minutos", price: 220 },
      { name: "Limpeza de pele profunda", desc: "Cerca de 1 hora", price: 180 },
      { name: "Consulta de retorno", desc: "30 minutos", price: 150 },
      { name: "Pacote de 4 sessões", desc: "Para usar em até 60 dias", price: 560 },
    ],
    after: [
      "Confirma o horário e o profissional.",
      "Envia as orientações antes da consulta.",
      "Lembra o cliente no dia anterior.",
    ],
  },
};
