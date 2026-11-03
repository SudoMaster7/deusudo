export type NicheKey = "odonto" | "harmonizacao" | "capilar" | "estetica";

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

export const NICHE_KEYS: NicheKey[] = ["odonto", "harmonizacao", "capilar", "estetica"];

// Clínicas fictícias, só para a demonstração. Os valores são de mercado,
// na faixa de ticket dos clientes que a SUDO atende.
export const NICHES: Record<NicheKey, Niche> = {
  odonto: {
    label: "Odontologia",
    biz: "Clínica Vértice Odontologia",
    tag: "Implantes, lentes e alinhadores",
    cta: "Pedir orçamento pelo WhatsApp",
    hello: "Olá! Tenho interesse neste plano de tratamento:",
    chat: [
      { from: "in", text: "Boa noite! Quanto fica um implante? Perdi um dente de baixo.", time: "23:41" },
      {
        from: "out",
        text: "Boa noite! O implante unitário com coroa de zircônia fica entre R$ 3.900 e R$ 4.600. O que muda o valor é o osso da região, e isso só a tomografia mostra.",
        time: "23:41",
      },
      {
        from: "out",
        text: "A avaliação com tomografia é R$ 350 e abate no tratamento. Tenho quinta às 9h ou sexta às 15h30. Qual fica melhor?",
        time: "23:42",
      },
      { from: "in", text: "Sexta 15h30. Dá para parcelar?", time: "23:44" },
      {
        from: "out",
        text: "Dá sim, em até 12x no cartão. Reservei sexta às 15h30 e te mando um lembrete na quinta.",
        time: "23:44",
      },
    ],
    items: [
      { name: "Avaliação com tomografia", desc: "Abate no valor do tratamento", price: 350 },
      { name: "Implante unitário com coroa", desc: "Cirurgia, pilar e coroa de zircônia", price: 4200 },
      { name: "Lente de contato dental", desc: "Por dente, em porcelana", price: 2300 },
      { name: "Alinhador invisível", desc: "Tratamento completo, até 24 meses", price: 16900 },
    ],
    after: [
      "Confirma o horário da avaliação e manda o endereço com ponto de referência.",
      "Explica as formas de parcelamento, sem inventar desconto.",
      "Lembra o paciente 24h antes, para a cadeira não ficar vazia.",
    ],
  },
  harmonizacao: {
    label: "Harmonização facial",
    biz: "Clínica Lumière",
    tag: "Toxina, preenchimento e bioestimulador",
    cta: "Falar com a clínica pelo WhatsApp",
    hello: "Olá! Quero avaliação para estes procedimentos:",
    chat: [
      { from: "in", text: "Oi! Vi o anúncio de vocês. Quanto custa o preenchimento labial?", time: "22:18" },
      {
        from: "out",
        text: "Oi! O preenchimento labial com 1ml fica R$ 2.200, aplicado pela responsável técnica, com retorno de 15 dias incluso.",
        time: "22:18",
      },
      {
        from: "out",
        text: "Antes fazemos uma avaliação de 30 minutos para ver o que o seu rosto pede: às vezes o resultado que você quer vem do bioestimulador. Prefere terça às 11h ou quinta às 18h?",
        time: "22:19",
      },
      { from: "in", text: "Quinta às 18h. É muito dolorido?", time: "22:21" },
      {
        from: "out",
        text: "Usamos anestesia tópica e bloqueio, então a maioria descreve como incômodo leve. Reservei quinta às 18h e te mando as orientações antes.",
        time: "22:21",
      },
    ],
    items: [
      { name: "Avaliação facial", desc: "30 minutos com a responsável técnica", price: 250 },
      { name: "Toxina botulínica, terço superior", desc: "Retorno de 15 dias incluso", price: 1900 },
      { name: "Preenchimento labial, 1ml", desc: "Ácido hialurônico, com retorno", price: 2200 },
      { name: "Protocolo full face", desc: "Toxina, preenchimento e bioestimulador", price: 8900 },
    ],
    after: [
      "Confirma o horário e envia as orientações de pré-procedimento.",
      "Nunca promete resultado nem comenta o caso de outro paciente.",
      "Chama a responsável técnica quando a dúvida é clínica.",
    ],
  },
  capilar: {
    label: "Transplante capilar",
    biz: "Instituto Raiz",
    tag: "Transplante FUE e tratamento capilar",
    cta: "Pedir avaliação pelo WhatsApp",
    hello: "Olá! Quero avaliação para:",
    chat: [
      { from: "in", text: "Boa tarde. Faço transplante capilar? Tenho calvície na frente.", time: "21:05" },
      {
        from: "out",
        text: "Boa tarde! Dá para avaliar sim. O transplante FUE de até 2.500 fios fica R$ 17.900, feito em um dia de procedimento.",
        time: "21:05",
      },
      {
        from: "out",
        text: "O número exato de fios sai na tricoscopia da avaliação, que é R$ 400 e abate no procedimento. Tenho sábado às 10h. Fica bom para você?",
        time: "21:06",
      },
      { from: "in", text: "Fica. Preciso raspar tudo?", time: "21:08" },
      {
        from: "out",
        text: "Na técnica que usamos raspamos só a área doadora, que fica coberta pelo cabelo de cima. Reservei sábado às 10h e te mando o preparo antes.",
        time: "21:08",
      },
    ],
    items: [
      { name: "Avaliação com tricoscopia", desc: "Abate no valor do procedimento", price: 400 },
      { name: "Transplante FUE até 2.500 fios", desc: "Um dia de procedimento", price: 17900 },
      { name: "Protocolo de manutenção, 6 meses", desc: "Medicação e acompanhamento", price: 3600 },
      { name: "Sessão de MMP capilar", desc: "Microinfusão na pele", price: 650 },
    ],
    after: [
      "Confirma a avaliação e manda o preparo do procedimento.",
      "Explica o parcelamento e o que está incluso no valor.",
      "Acompanha o pós e marca o retorno de 30 dias.",
    ],
  },
  estetica: {
    label: "Estética avançada",
    biz: "Clínica Aurora",
    tag: "Protocolos corporais e faciais",
    cta: "Agendar pelo WhatsApp",
    hello: "Olá! Quero agendar:",
    chat: [
      { from: "in", text: "Boa noite! Vocês atendem sábado? Quanto sai o protocolo corporal?", time: "23:47" },
      {
        from: "out",
        text: "Boa noite! Atendemos sábado, das 9h às 16h. O protocolo corporal de 10 sessões fica R$ 4.800, ou R$ 560 a sessão avulsa.",
        time: "23:47",
      },
      {
        from: "out",
        text: "Antes fazemos uma avaliação de 40 minutos com bioimpedância, R$ 200, que abate no pacote. Tenho sábado às 10h30 ou às 14h.",
        time: "23:48",
      },
      { from: "in", text: "Sábado às 10h30.", time: "23:49" },
      {
        from: "out",
        text: "Reservado para sábado às 10h30. Te mando as orientações e um lembrete na véspera.",
        time: "23:49",
      },
    ],
    items: [
      { name: "Avaliação corporal", desc: "40 minutos, com bioimpedância", price: 200 },
      { name: "Criolipólise, 2 áreas", desc: "Sessão única", price: 1800 },
      { name: "Protocolo corporal, 10 sessões", desc: "Para usar em até 90 dias", price: 4800 },
      { name: "Head spa com drenagem", desc: "60 minutos", price: 320 },
    ],
    after: [
      "Confirma o horário e o profissional que vai atender.",
      "Envia as orientações de pré e pós-sessão.",
      "Lembra o cliente na véspera e remarca quem não pode vir.",
    ],
  },
};
