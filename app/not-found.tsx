import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/Sections";
import { waLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="page-top band">
          <div className="wrap notfound">
            <p className="code">404</p>
            <h1>Esta página não existe (ou mudou de endereço)</h1>
            <p className="sub">
              Pode ter sido um link antigo. Volte para o começo ou fale com a gente no WhatsApp, que a
              gente te manda direto para o que você procura.
            </p>
            <div className="cta-row">
              <Link className="btn" href="/">
                Voltar para o início
              </Link>
              <a
                className="btn ghost"
                href={waLink("Olá! Caí numa página que não existe no site da SUDO.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
            <nav className="nf-links" aria-label="Seções do site">
              <Link href="/#solucoes">Soluções</Link>
              <Link href="/#resultados">Resultados</Link>
              <Link href="/#testar">Testar o atendente</Link>
              <Link href="/#contato">Contato</Link>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
