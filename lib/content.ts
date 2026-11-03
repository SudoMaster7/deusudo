// Todo o texto e todos os números do site ficam aqui.
// Para atualizar resultados de clientes, edite `results` e `cases`.

export type Status = "live" | "wip" | "demo";

export const problems = [
  {
    title: "Mensagem sem resposta",
    text: "Quem pergunta o preço às 22h não espera até amanhã. Vira cliente do concorrente.",
  },
  {
    title: "Tarefa manual repetida",
    text: "Pedido copiado do WhatsApp para a planilha, agenda no caderno, relatório feito à mão. Horas por semana que ninguém cobra.",
  },
  {
    title: "Dados espalhados",
    text: "Cada informação mora num lugar e nenhum número é confiável na hora de decidir.",
  },
];

export const solutions: {
  title: string;
  who: string;
  tag: string;
  status: Status;
  problem: string;
  delivery: string;
  case?: string;
}[] = [
  {
    title: "Atendente de IA no WhatsApp",
    who: "Espaço Granjear, clínica pediátrica",
    tag: "Em produção",
    status: "live",
    problem: "Atendimento manual pelo WhatsApp, com perguntas repetidas o dia inteiro.",
    delivery:
      "A Soraia entende texto e áudio, responde com os dados reais da clínica e chama a equipe quando não sabe.",
    case: "espaco-granjear",
  },
  {
    title: "Tráfego pago com relatório",
    who: "Spa na Tijuca e bar em São Paulo",
    tag: "Em andamento",
    status: "live",
    problem: "Anúncio impulsionado que traz curtida e não traz cliente.",
    delivery: "Campanhas que levam direto ao WhatsApp, com relatório do custo por conversa a cada fase.",
    case: "flor-da-pele",
  },
  {
    title: "Gestão de clínica",
    who: "Painel Granjear",
    tag: "Em implantação",
    status: "wip",
    problem: "Cadastro de pacientes em papel e planilha.",
    delivery:
      "Painel para cadastrar, consultar e atualizar pacientes, base para agenda, financeiro e novas unidades. O prontuário segue a LGPD.",
    case: "espaco-granjear",
  },
  {
    title: "Landing pages",
    who: "Clínicas, confeitaria e agência",
    tag: "Entregues",
    status: "live",
    problem: "Quem clica no anúncio cai num perfil de Instagram e desiste.",
    delivery: "Páginas feitas para uma ação só, falar no WhatsApp, com a cara de cada negócio.",
  },
  {
    title: "Vitrine que fecha no WhatsApp",
    who: "Teste na seção abaixo",
    tag: "Demonstração",
    status: "demo",
    problem: "Pedido anotado e copiado à mão do WhatsApp para a planilha.",
    delivery:
      "O cliente escolhe os itens, monta o carrinho e o pedido já chega escrito no WhatsApp, onde o atendente de IA fecha.",
  },
  {
    title: "Logística e frota",
    who: "Distribuidora de embalagens",
    tag: "MVP",
    status: "wip",
    problem: "Entrega sem rastreio e cliente ligando para saber onde está o caminhão.",
    delivery:
      "Importação de nota fiscal, avisos automáticos por WhatsApp, comprovante de entrega e mapa da frota.",
    case: "logistica-frota",
  },
  {
    title: "Comissionamento de vendas",
    who: "Equipe comercial",
    tag: "Em desenvolvimento",
    status: "wip",
    problem: "Comissão calculada à mão, com risco de erro e de discussão.",
    delivery:
      "Módulo que calcula por excedente de preço ou por percentual fixo, com telas de acompanhamento para os vendedores.",
  },
  {
    title: "Vídeos com IA para marcas",
    who: "Marca de bem-estar nos Estados Unidos",
    tag: "Entregue",
    status: "live",
    problem: "Vídeo de marca é caro e demorado para publicar toda semana.",
    delivery: "Reels cinematográficos, identidade visual e cortes por plataforma, com produção feita por IA.",
  },
];

export const results = [
  {
    slug: "flor-da-pele",
    name: "Na Flor da Pele",
    where: "Spa e estética, Tijuca, Rio de Janeiro",
    big: "442",
    bigLabel: "conversas no WhatsApp em 92 dias",
    trio: [
      ["R$ 4,13", "por conversa, em média"],
      ["R$ 1.826", "investidos no período"],
      ["+24%", "de alcance no Instagram nas últimas 4 semanas"],
    ] as [string, string][],
    before: "R$ 0 investidos nos 90 dias anteriores, Facebook com zero contatos e Instagram em queda.",
    after: "Campanhas direto para o WhatsApp. O melhor anúncio chegou a R$ 2,58 por conversa.",
  },
  {
    slug: "carlito-botecaria",
    name: "Carlito Botecaria",
    where: "Bar, Consolação, São Paulo",
    big: "267",
    bigLabel: "conversas no WhatsApp em 62 dias",
    trio: [
      ["R$ 5,70", "por conversa, em média"],
      ["R$ 1.521", "investidos no período"],
      ["+192%", "de alcance no Instagram nas últimas 4 semanas"],
    ] as [string, string][],
    before: "Posts impulsionados sem segmentação, com 32% do alcance fora de São Paulo.",
    after: "Público local, criativos novos por fase e relatório a cada ciclo.",
  },
];

export const resultsNote =
  "Dados do Gerenciador de Anúncios da Meta: spa de 21/07 a 23/10/2026 e bar de 03/08 a 23/10/2026. O custo por conversa sobe quando o mesmo anúncio roda sem pausa, por isso a SUDO renova os criativos e acompanha cada fase.";

// O fluxo que a SUDO roda de ponta a ponta. É a seção central do site:
// cada etapa abre num painel com o que acontece, o que o cliente recebe e
// o número que a SUDO acompanha naquela etapa.
export type Stage = {
  key: string;
  short: string;
  title: string;
  when: string;
  lead: string;
  does: string[];
  gets: string;
  metric: [string, string];
};

export const funnel: Stage[] = [
  {
    key: "trafego",
    short: "Tráfego pago",
    title: "Anúncio para quem já quer comprar",
    when: "Começa a rodar na primeira semana",
    lead:
      "Em vez de impulsionar post para quem passa na frente, a campanha é montada para o público que compra de você: a sua cidade, a sua faixa de idade, o seu tipo de serviço.",
    does: [
      "Público local e segmentado, não o botão de impulsionar.",
      "Vários criativos ao mesmo tempo, cada um com orçamento próprio.",
      "Criativo renovado por fase, antes do custo por conversa subir.",
    ],
    gets: "Clientes direcionados chegando todos os dias, com o custo de cada um na mão.",
    metric: ["R$ 4,13", "custo médio por conversa no spa da Tijuca"],
  },
  {
    key: "landing",
    short: "Landing page",
    title: "A página qualifica antes de você gastar tempo",
    when: "No mesmo clique do anúncio",
    lead:
      "Quem clica cai numa página com uma ação só: falar com você. Antes disso, ela pergunta o essencial — ramo, cidade, o que a pessoa precisa, qual é a dor de hoje.",
    does: [
      "Uma página por campanha, com a cara do negócio.",
      "Perguntas curtas, respondidas em toques, sem formulário longo.",
      "As respostas seguem junto na mensagem do WhatsApp.",
    ],
    gets: "Curioso separado de cliente antes de alguém digitar a primeira resposta.",
    metric: ["0 campos", "obrigatórios para falar com você"],
  },
  {
    key: "chatbot",
    short: "Atendente de IA",
    title: "Resposta em segundos, não em horas",
    when: "24h, inclusive fim de semana",
    lead:
      "O atendente recebe a pessoa já sabendo o que ela respondeu na página. Não repete pergunta: continua de onde a página parou, aprofunda a dor e levanta as características do negócio.",
    does: [
      "Responde texto e áudio com as informações reais do seu negócio.",
      "Puxa o resto da qualificação com naturalidade, uma pergunta por vez.",
      "Te avisa no WhatsApp quando o lead está pronto, com o resumo escrito.",
    ],
    gets: "Lead quente, com dor e contexto escritos, enquanto ainda está interessado.",
    metric: ["segundos", "entre a mensagem e a resposta"],
  },
  {
    key: "reuniao",
    short: "Reunião de diagnóstico",
    title: "Vinte minutos para decidir o que construir",
    when: "Marcada por você, com o lead já qualificado",
    lead:
      "Você entra na conversa com o histórico na mão e marca a reunião. Nela a gente separa o que dá retorno agora do que pode esperar.",
    does: [
      "Mapa de onde o negócio perde cliente e tempo hoje.",
      "Escopo do que será construído, em ordem de retorno.",
      "Proposta com prazo e valor, sem jargão.",
    ],
    gets: "Clareza do que vai ser feito, quanto custa e quando fica pronto.",
    metric: ["20 min", "sem compromisso e sem custo"],
  },
  {
    key: "desenvolvimento",
    short: "Desenvolvimento",
    title: "Só o que o negócio precisa",
    when: "30 a 45 dias para a solução completa",
    lead:
      "A construção é sob medida: atendente de IA, campanhas, páginas, sistema. Nada de pagar por mil funções que você nunca vai abrir.",
    does: [
      "Atendente treinado com os seus serviços, preços e regras.",
      "Sistema, painel ou vitrine quando o diagnóstico mostra que vale.",
      "Testes com você antes de qualquer coisa ir ao ar.",
    ],
    gets: "Tudo funcionando sem você mexer em nada técnico.",
    metric: ["30-45", "dias até estar rodando"],
  },
  {
    key: "manutencao",
    short: "Manutenção e relatório",
    title: "Depois é manutenção e relatório mensal",
    when: "Todo mês, enquanto estiver rodando",
    lead:
      "A obra grande acaba. O que continua é manutenção e o relatório mensal, para você acompanhar o processo com número e não com impressão.",
    does: [
      "Ajuste no atendente conforme chegam perguntas novas.",
      "Criativo renovado e campanha reequilibrada por fase.",
      "Relatório mensal com conversas, custo por conversa e recomendação.",
    ],
    gets: "O mesmo fluxo rodando, mais barato por cliente a cada ciclo.",
    metric: ["1 relatório", "por mês, com os números reais"],
  },
];

export const funnelNote =
  "É esse fluxo que roda hoje nos clientes da SUDO. Cada etapa pode ser contratada sozinha, mas é junto que o custo por cliente cai.";

// O que aparece no relatório mensal.
export const report = [
  ["Conversas abertas no WhatsApp", "quantas pessoas falaram com você no mês"],
  ["Custo por conversa", "quanto custou cada cliente interessado, por anúncio"],
  ["Desempenho por criativo", "qual anúncio ainda vende e qual já cansou"],
  ["Atendimento da IA", "quantas conversas ela fechou sozinha e quando chamou você"],
  ["Alcance e público", "quem está sendo atingido e onde"],
  ["Recomendação da fase", "o que pausar, o que renovar e o que testar no mês seguinte"],
] as [string, string][];

export const faqs = [
  {
    q: "Preciso entender de tecnologia?",
    a: "Não. A gente implanta, configura e ensina o básico. Você só acompanha os resultados.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "Entre 30 e 45 dias para a solução completa. Soluções avulsas, como uma página ou anúncios, podem ficar prontas antes.",
  },
  {
    q: "E se a IA responder algo errado?",
    a: "Ela é configurada só com as informações do seu negócio e, quando não sabe algo, chama você. Tudo é testado antes de ir ao ar.",
  },
  {
    q: "Já contratei um sistema que não funcionou. Por que seria diferente?",
    a: "Porque não entregamos um sistema e sumimos. Fazemos sob medida para o seu negócio, com acompanhamento e relatório mostrando o resultado.",
  },
  {
    q: "Meus dados e os dos meus clientes ficam seguros?",
    a: "Sim. Trabalhamos seguindo a LGPD, com acesso restrito e servidores protegidos.",
  },
  {
    q: "Preciso contratar o fluxo inteiro?",
    a: "Não. Cada etapa funciona sozinha: só os anúncios, só a página, só o atendente de IA. Junto o custo por cliente cai, porque o anúncio traz gente direcionada e o atendente responde antes de ela desistir.",
  },
  {
    q: "Em quanto tempo o atendente responde?",
    a: "Em segundos, a qualquer hora. É isso que muda o jogo: a maior parte das mensagens chega fora do horário comercial, e quem espera até o dia seguinte já comprou do concorrente.",
  },
  {
    q: "O atendente vai fingir que é uma pessoa?",
    a: "Não. Ele se apresenta como IA da SUDO quando perguntam, qualifica a conversa e chama você quando o lead está pronto. Quem marca reunião e fala de valor é você, não ele.",
  },
  {
    q: "Quanto preciso investir em anúncio?",
    a: "Os clientes atuais rodam com algo entre R$ 500 e R$ 700 por mês em mídia e trazem conversa a R$ 4 ou R$ 5 cada. O valor certo para o seu caso sai no diagnóstico, junto com a estimativa de conversas.",
  },
  {
    q: "O que vem no relatório mensal?",
    a: "Conversas abertas, custo por conversa, desempenho de cada criativo, o que a IA resolveu sozinha, alcance e a recomendação da fase: o que pausar, o que renovar e o que testar.",
  },
  {
    q: "Quanto custa?",
    a: "Depende do que o seu negócio precisa, e por isso o diagnóstico é gratuito.",
  },
];

export type CaseStudy = {
  name: string;
  who: string;
  tag: string;
  status: Status;
  intro: string;
  stats: [string, string][];
  before: string[];
  did: string[];
  learned?: string;
  tech: string[];
  note?: string;
};

export const cases: Record<string, CaseStudy> = {
  "flor-da-pele": {
    name: "Na Flor da Pele",
    who: "Spa e estética, Tijuca, Rio de Janeiro",
    tag: "Em andamento",
    status: "live",
    intro: "Anúncios que levam direto ao WhatsApp, com relatório do custo por conversa a cada fase.",
    stats: [
      ["442", "conversas no WhatsApp em 92 dias"],
      ["R$ 4,13", "por conversa, em média"],
      ["R$ 1.826", "investidos no período"],
      ["+24%", "de alcance no Instagram nas últimas 4 semanas"],
    ],
    before: [
      "Nenhum real investido em anúncios nos 90 dias anteriores.",
      "Facebook com zero contatos e Instagram com contatos em queda.",
    ],
    did: [
      "Diagnóstico de linha de base antes da primeira campanha.",
      "Campanhas de mensagem que abrem direto o WhatsApp.",
      "Vários criativos testados. O vídeo de Head Spa chegou a 100 conversas a R$ 3,20 cada.",
      "Relatório por fase, com custo por conversa, público atingido e recomendações.",
    ],
    learned:
      "O custo por conversa subiu quando o mesmo anúncio rodou sem pausa. A resposta foi trabalhar com vários criativos, cada um com orçamento próprio, e renovar a cada fase.",
    tech: ["Meta Ads (mensagem para o WhatsApp)", "Landing pages", "Relatórios por fase"],
    note: "Dados do Gerenciador de Anúncios da Meta, de 21/07 a 23/10/2026.",
  },
  "carlito-botecaria": {
    name: "Carlito Botecaria",
    who: "Bar, Consolação, São Paulo",
    tag: "Em andamento",
    status: "live",
    intro: "Campanhas focadas no público local, com destino ao WhatsApp e relatório por fase.",
    stats: [
      ["267", "conversas no WhatsApp em 62 dias"],
      ["R$ 5,70", "por conversa, em média"],
      ["R$ 1.521", "investidos no período"],
      ["+192%", "de alcance no Instagram nas últimas 4 semanas"],
    ],
    before: [
      "Posts impulsionados, sem segmentação.",
      "32% do alcance fora de São Paulo.",
      "R$ 571 gastos em 6 anúncios nos 90 dias anteriores.",
    ],
    did: [
      "Diagnóstico de linha de base antes de começar.",
      "Campanhas para o público local, com destino ao WhatsApp.",
      'Criativos novos a cada fase. O anúncio "Sair Hoje?" chegou a R$ 3,23 por conversa.',
      "Relatório por fase com alertas, como a fadiga de criativo.",
    ],
    learned:
      "Quando um criativo rodou sozinho, o custo subiu. O acompanhamento serve para pausar e trocar o anúncio a tempo.",
    tech: ["Meta Ads (mensagem para o WhatsApp)", "Relatórios por fase"],
    note: "Dados do Gerenciador de Anúncios da Meta, de 03/08 a 23/10/2026.",
  },
  "espaco-granjear": {
    name: "Espaço Granjear",
    who: "Clínica pediátrica, Duque de Caxias",
    tag: "Em produção e implantação",
    status: "live",
    intro:
      "Atendimento no WhatsApp com IA e um sistema para organizar pacientes, agenda e financeiro da clínica.",
    stats: [
      ["24h", "de atendimento no WhatsApp"],
      ["Texto e áudio", "a Soraia entende os dois"],
      ["LGPD", "prontuário com acesso por perfil"],
    ],
    before: ["Atendimento manual pelo WhatsApp e prontuário sem registro centralizado."],
    did: [
      "A Soraia, atendente de IA, responde texto e áudio com os dados reais da clínica.",
      "Prontuário eletrônico para celular, com acesso por perfil, evolução no formato SOAP e ditado por voz.",
      "Painel de cadastro de pacientes, base para agenda, financeiro e novas unidades.",
    ],
    tech: [
      "n8n",
      "Evolution API",
      "PostgreSQL",
      "Groq (LLaMA 3.3 70B)",
      "Whisper",
      "Next.js",
      "TypeScript",
      "Supabase",
    ],
  },
  "logistica-frota": {
    name: "Logística e gestão de frota",
    who: "Distribuidora de embalagens com frota própria",
    tag: "MVP em desenvolvimento",
    status: "wip",
    intro: "Sistema para acompanhar entregas e gerir a frota, hoje em fase de MVP.",
    stats: [],
    before: ["Acompanhar entregas e frota própria em um só lugar."],
    did: [
      "Importação de nota fiscal para criar as entregas.",
      "Rastreamento e avisos automáticos ao cliente por WhatsApp.",
      "Comprovante de entrega.",
      "Módulo de frota com mapa ao vivo, combustível, manutenção preventiva e jornada do motorista.",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Supabase", "Mapas"],
  },
};

export const caseSlugs = Object.keys(cases);
