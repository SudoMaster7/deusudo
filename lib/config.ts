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
// Mensagens do WhatsApp
//
// A mensagem tem que soar como a pessoa escrevendo: curta, direta e com
// as informações dela diluídas na frase, não um bloco de "campo: valor".
// Ela vê o texto antes de enviar, então nada aqui pode afirmar algo que
// ela não disse de verdade — clicar num ramo da demonstração não quer
// dizer que o negócio dela é daquele ramo.
//
// O detalhe exato de cada visita (números do simulador, conversa com o
// agente, carrinho, formulário) fica no painel em /admin. A mensagem é
// só o convite para a conversa.
// ───────────────────────────────────────────────────────────────

/**
 * Monta a mensagem a partir de pedaços de frase. O que for vazio, falso ou
 * nulo é descartado, então cada trecho pode ser condicional.
 */
export function waNatural(partes: (string | false | null | undefined)[]) {
  const texto = partes
    .filter((p): p is string => Boolean(p && p.trim()))
    .join(" ")
    .replace(/[ \t]+/g, " ")
    .replace(/ ([,.!?;])/g, "$1")
    .trim();
  return waLink(texto);
}

/** "a, b e c" — para listar dores ou itens dentro de uma frase. */
export function emFrase(itens: string[]) {
  const limpos = itens.map((i) => i.trim()).filter(Boolean);
  if (limpos.length <= 1) return limpos[0] ?? "";
  return `${limpos.slice(0, -1).join(", ")} e ${limpos[limpos.length - 1]}`;
}

/** Primeira letra minúscula, para encaixar um rótulo no meio de uma frase. */
export function minuscula(texto: string) {
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}
