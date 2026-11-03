// Dados estruturados (JSON-LD). É o que o Google usa para entender o site
// e o que faz a SUDO aparecer melhor na busca local e com as perguntas frequentes.

import { site } from "./config";
import { faqs, type CaseStudy } from "./content";

const LOGO = `${site.url}/icon.svg`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organizacao`,
  name: "SUDO",
  alternateName: "SUDO Tecnologia",
  url: site.url,
  logo: LOGO,
  image: `${site.url}/opengraph-image`,
  email: site.email,
  telephone: `+${site.whatsapp}`,
  description:
    "Fluxo completo de aquisição: tráfego pago direcionado, landing page que qualifica, atendente de IA no WhatsApp que responde em segundos, reunião de diagnóstico, desenvolvimento sob medida e relatório mensal.",
  priceRange: "$$",
  founder: { "@type": "Person", name: "Leonardo Brito", url: site.technicalPortfolio },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Duque de Caxias",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  areaServed: [
    { "@type": "City", name: "Rio de Janeiro" },
    { "@type": "City", name: "Duque de Caxias" },
    { "@type": "AdministrativeArea", name: "Baixada Fluminense" },
  ],
  sameAs: [`https://instagram.com/${site.instagram}`, site.technicalPortfolio],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: `+${site.whatsapp}`,
    email: site.email,
    availableLanguage: ["Portuguese"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Soluções SUDO",
    itemListElement: [
      "Atendente de IA no WhatsApp",
      "Fluxo completo: tráfego pago, landing page, atendente de IA e relatório mensal",
      "Tráfego pago com relatório por fase",
      "Sistemas sob medida",
      "Landing pages",
      "Vitrine com pedido no WhatsApp",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#site`,
  url: site.url,
  name: "SUDO",
  inLanguage: "pt-BR",
  publisher: { "@id": `${site.url}/#organizacao` },
};

export function caseSchema(slug: string, c: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${c.name} — case da SUDO`,
        description: c.intro,
        url: `${site.url}/cases/${slug}`,
        inLanguage: "pt-BR",
        author: { "@id": `${site.url}/#organizacao` },
        publisher: { "@id": `${site.url}/#organizacao` },
        about: { "@type": "Organization", name: c.name },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: site.url },
          { "@type": "ListItem", position: 2, name: "Cases", item: `${site.url}/#resultados` },
          { "@type": "ListItem", position: 3, name: c.name, item: `${site.url}/cases/${slug}` },
        ],
      },
    ],
  };
}

// Atalho usado nas páginas para injetar o JSON-LD numa tag <script>.
export function jsonLdProps(data: unknown) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  } as const;
}
