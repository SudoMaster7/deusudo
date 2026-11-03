import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    // O painel e a rota do assistente não entram em buscador.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
