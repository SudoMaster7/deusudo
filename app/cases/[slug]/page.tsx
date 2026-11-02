import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/Sections";
import { Icon } from "@/components/Icons";
import { waLink } from "@/lib/config";
import { caseSlugs, cases } from "@/lib/content";
import { caseSchema, jsonLdProps } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = cases[slug];
  if (!c) return {};
  return {
    title: c.name,
    description: c.intro,
    alternates: { canonical: `/cases/${slug}` },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url: `/cases/${slug}`,
      siteName: "SUDO",
      title: `${c.name} | SUDO`,
      description: c.intro,
    },
    twitter: { card: "summary_large_image", title: `${c.name} | SUDO`, description: c.intro },
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const c = cases[slug];
  if (!c) notFound();

  return (
    <>
      <Header />
      <main>
        <section className="page-top band">
          <div className="wrap">
            <Link className="back" href="/#resultados">
              Voltar para o site
            </Link>
            <h1 className="case-h1">{c.name}</h1>
            <p className="case-who">
              {c.who}
              <span className={`tag ${c.status}`}>{c.tag}</span>
            </p>
            <p className="case-intro">{c.intro}</p>

            {c.stats.length > 0 && (
              <div className="stats">
                {c.stats.map(([v, l]) => (
                  <div className="stat" key={l}>
                    <strong>{v}</strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="case-cols">
              <div>
                <h2>Antes</h2>
                <ul>
                  {c.before.map((t) => (
                    <li key={t}>
                      <Icon name="check" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>O que a SUDO fez</h2>
                <ul>
                  {c.did.map((t) => (
                    <li key={t}>
                      <Icon name="check" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {c.learned && (
              <p className="learned">
                <b>O que aprendemos.</b> {c.learned}
              </p>
            )}

            <p className="tech">
              <b>Tecnologia:</b> {c.tech.join(", ")}.
            </p>
            {c.note && <p className="tech">{c.note}</p>}
          </div>
        </section>

        <section className="cta-band band">
          <div className="wrap">
            <h2>Quer um resultado assim no seu negócio?</h2>
            <div className="cta-row">
              <a
                className="btn white"
                href={waLink(`Olá! Vi o case ${c.name} no site da SUDO e quero um diagnóstico gratuito.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quero um diagnóstico gratuito
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script {...jsonLdProps(caseSchema(slug, c))} />
    </>
  );
}
