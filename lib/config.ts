export const site = {
  name: "SUDO",
  url: "https://deusudo.com",
  whatsapp: "5521995871999",
  whatsappDisplay: "+55 (21) 99587-1999",
  email: "contato@deusudo.com",
  instagram: "usesudo",
  city: "Duque de Caxias, RJ",
  technicalPortfolio: "https://portifolioleobrito.vercel.app/pt",
  // Vídeo de apresentação (seção "Quem faz"). Preencha UM dos dois:
  // youtubeId: código de um vídeo "não listado" do YouTube (ex.: "dQw4w9WgXcQ")
  // mp4: caminho de um arquivo dentro de /public (ex.: "/apresentacao.mp4")
  video: { youtubeId: "", mp4: "" },
};

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

// ───────────────────────────────────────────────────────────────
// Ponte entre o site e o atendente de IA que roda no WhatsApp.
//
// Tudo que o visitante responde aqui vai junto na mensagem, num bloco
// com o marcador abaixo. O bot lê esse bloco, já sabe quem chegou e
// não repete as perguntas que a landing page fez. O texto continua
// legível para humanos, porque a pessoa vê a mensagem antes de enviar.
// ───────────────────────────────────────────────────────────────

export const LEAD_MARK = "--- dados do site ---";

/** Origem da mensagem. Serve para o bot saber em que ponto do fluxo a pessoa estava. */
export type LeadOrigin =
  | "topo"
  | "menu"
  | "fluxo"
  | "diagnostico"
  | "vitrine"
  | "laboratorio"
  | "formulario"
  | "case";

export type LeadPayload = {
  origem: LeadOrigin;
  /** Primeira linha da mensagem, escrita como a pessoa falaria. */
  abertura: string;
  /** Pares rótulo/valor que o bot lê. Valor vazio é descartado. */
  dados?: Record<string, string | number | string[] | undefined | null>;
};

function linhaDeDado(chave: string, valor: unknown) {
  if (valor === undefined || valor === null) return null;
  const texto = Array.isArray(valor) ? valor.join("; ") : String(valor);
  return texto.trim() ? `${chave}: ${texto.trim()}` : null;
}

/** Monta o texto da mensagem: abertura + bloco de dados para o bot. */
export function leadMessage({ origem, abertura, dados = {} }: LeadPayload) {
  const linhas = Object.entries({ origem, ...dados })
    .map(([k, v]) => linhaDeDado(k, v))
    .filter((l): l is string => l !== null);
  return `${abertura}\n\n${LEAD_MARK}\n${linhas.join("\n")}`;
}

/** Link do WhatsApp já com a mensagem e o bloco de dados. */
export function leadLink(payload: LeadPayload) {
  return waLink(leadMessage(payload));
}
