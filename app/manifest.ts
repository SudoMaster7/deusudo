import type { MetadataRoute } from "next";

// Permite salvar o site na tela inicial do celular com ícone e cor próprios.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SUDO | Tecnologia e IA para negócios",
    short_name: "SUDO",
    description:
      "Atendimento com IA no WhatsApp, anúncios e sistemas sob medida para o seu negócio.",
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    background_color: "#F3F6FD",
    theme_color: "#2457F5",
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any", purpose: "any" }],
  };
}
