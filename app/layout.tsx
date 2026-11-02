import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/config";
import { jsonLdProps, organizationSchema, websiteSchema } from "@/lib/schema";

// Fontes servidas pelo próprio domínio. Carregam mais rápido que o link do Google
// e não vazam o IP de quem visita para outro servidor.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});

const body = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const title = "SUDO | Atendimento com IA, anúncios e sistemas para o seu negócio";
const description =
  "Atendente de IA no WhatsApp, anúncios que trazem clientes e sistemas sob medida para clínicas, spas, restaurantes e comércio no Rio de Janeiro. Diagnóstico gratuito.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | SUDO" },
  description,
  applicationName: "SUDO",
  authors: [{ name: "Leonardo Brito", url: site.technicalPortfolio }],
  creator: "Leonardo Brito",
  publisher: "SUDO",
  keywords: [
    "atendimento com IA no WhatsApp",
    "chatbot WhatsApp",
    "tráfego pago Rio de Janeiro",
    "sistema sob medida",
    "automação para clínicas",
    "agência de tecnologia Duque de Caxias",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: "SUDO",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2457F5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#topo">
          Ir para o conteúdo
        </a>
        {children}
        <script {...jsonLdProps(organizationSchema)} />
        <script {...jsonLdProps(websiteSchema)} />
      </body>
    </html>
  );
}
