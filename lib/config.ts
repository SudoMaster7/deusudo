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
