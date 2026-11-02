/** @type {import('next').NextConfig} */

// Cabeçalhos de segurança. Protegem contra o site ser carregado dentro de um
// iframe de terceiros, contra adivinhação de tipo de arquivo e limitam o que é
// enviado ao navegar para fora.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  // Mantém a raiz do projeto nesta pasta, mesmo que exista outro package-lock
  // mais acima no computador.
  outputFileTracingRoot: import.meta.dirname,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // O sitemap e o robots podem ficar em cache por 1 dia.
      {
        source: "/:file(sitemap.xml|robots.txt)",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=86400" }],
      },
    ];
  },
  // Endereços antigos continuam funcionando em vez de dar 404.
  async redirects() {
    return [
      { source: "/privacy", destination: "/privacidade", permanent: true },
      { source: "/contato", destination: "/#contato", permanent: true },
      { source: "/cases", destination: "/#resultados", permanent: true },
    ];
  },
};

export default nextConfig;
