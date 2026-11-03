import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { leadLink, site } from "@/lib/config";
import { faqs, problems, report, results, resultsNote, solutions } from "@/lib/content";
import { AboutVideo } from "./AboutVideo";
import { Icon } from "./Icons";
import { NAV_LINKS } from "@/lib/nav";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="top">
      <div className="wrap">
        <Link className="logo" href="/">
          SUDO<span>.</span>
        </Link>
        <nav className="nav" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <a
          className="btn sm"
          href={leadLink({ origem: "menu", abertura: "Olá! Vim pelo site da SUDO." })}
          target="_blank"
          rel="noopener noreferrer"
        >
          Falar no WhatsApp
        </a>
        <MobileNav />
      </div>
    </header>
  );
}

const marks = [
  { slug: "flor-da-pele", name: "Na Flor da Pele" },
  { slug: "carlito-botecaria", name: "Carlito Botecaria" },
  { slug: "espaco-granjear", name: "Espaço Granjear" },
];

// Procura o logo em public/logos/<slug>.(svg|png|webp|jpg). Sem arquivo, mostra o nome.
function findLogo(slug: string) {
  const dir = path.join(process.cwd(), "public", "logos");
  for (const ext of ["svg", "png", "webp", "jpg", "jpeg"]) {
    if (fs.existsSync(path.join(dir, `${slug}.${ext}`))) return `/logos/${slug}.${ext}`;
  }
  return null;
}

export function ClientMarks() {
  return (
    <div className="clients">
      <p>Quem já roda com a SUDO</p>
      {marks.map((m) => {
        const src = findLogo(m.slug);
        return src ? (
          // Logo de cliente: arquivo enviado pelo próprio cliente, de dimensão
          // desconhecida. O CSS fixa a altura, então não usamos next/image aqui.
          // eslint-disable-next-line @next/next/no-img-element
          <img key={m.slug} className="logo-img" src={src} alt={m.name} decoding="async" />
        ) : (
          <span key={m.slug} className="mark">
            {m.name}
          </span>
        );
      })}
    </div>
  );
}

export function Problems() {
  return (
    <section className="problems-band band">
      <div className="wrap">
        <h2>Onde o seu negócio perde dinheiro sem perceber</h2>
        <ul className="problems">
          {problems.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Solutions() {
  return (
    <section className="band" id="solucoes">
      <div className="wrap">
        <h2>O que a SUDO já fez e está fazendo</h2>
        <p className="sub">Cada solução aparece com o problema que resolve e com o status real.</p>
        <div className="sol-grid">
          {solutions.map((s) => (
            <article className="sol" key={s.title}>
              <div className="sol-head">
                <div>
                  <h3>{s.title}</h3>
                  <p className="who">{s.who}</p>
                </div>
                <span className={`tag ${s.status}`}>{s.tag}</span>
              </div>
              <p>
                <b>Problema.</b> {s.problem}
              </p>
              <p>
                <b>Entrega.</b> {s.delivery}
              </p>
              {s.case && (
                <Link className="more" href={`/cases/${s.case}`}>
                  Ver o case
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Results() {
  return (
    <section className="results band" id="resultados">
      <div className="wrap">
        <h2>Resultados de clientes reais, como aparecem no relatório</h2>
        <p className="sub">Todo cliente de anúncios recebe um relatório por fase, com o custo de cada conversa.</p>
        <div className="res-grid">
          {results.map((r) => (
            <article className="res" key={r.slug}>
              <h3>{r.name}</h3>
              <p className="where">{r.where}</p>
              <div className="big">
                {r.big}
                <small>{r.bigLabel}</small>
              </div>
              <div className="trio">
                {r.trio.map(([v, l]) => (
                  <div key={l}>
                    <strong>{v}</strong>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
              <div className="ba">
                <p>
                  <b>Antes.</b> {r.before}
                </p>
                <p>
                  <b>Depois.</b> {r.after}
                </p>
              </div>
              <Link className="more" href={`/cases/${r.slug}`}>
                Ver o case completo
              </Link>
            </article>
          ))}
        </div>
        <p className="fine">{resultsNote}</p>
      </div>
    </section>
  );
}

export function DataSection() {
  return (
    <section className="data-band band">
      <div className="wrap data-grid">
        <div>
          <h2>Seus números num lugar só</h2>
          <p className="sub">
            Hoje a informação mora no WhatsApp, na planilha e na cabeça de quem atende. A SUDO junta tudo
            numa base que é sua, para você ver o que vende, o que custa e onde perde cliente.
          </p>
        </div>
        <div
          className="diagram"
          role="img"
          aria-label="Atendimentos, anúncios, agenda e planilhas alimentam uma base do negócio, que gera relatório, painel de controle e IA com números reais."
        >
          <ul>
            <li>Conversas do WhatsApp</li>
            <li>Anúncios</li>
            <li>Agenda e sistema</li>
            <li>Planilhas antigas</li>
          </ul>
          <div className="arr">
            <Icon name="arrow" />
          </div>
          <div className="core">
            Base do negócio<small>sua e sempre atualizada</small>
          </div>
          <div className="arr">
            <Icon name="arrow" />
          </div>
          <ul>
            <li>Relatório do mês</li>
            <li>Painel de controle</li>
            <li>IA que responde com seus números</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ReportSection() {
  return (
    <section className="report-band band" id="relatorio">
      <div className="wrap report-grid">
        <div>
          <h2>Todo mês você recebe o relatório, não um palpite</h2>
          <p className="sub">
            Depois que o fluxo está rodando, o trabalho vira manutenção e acompanhamento. O relatório
            mensal é onde você vê se o custo por cliente caiu, qual anúncio cansou e o que muda no mês
            seguinte.
          </p>
          <a
            className="btn"
            href={leadLink({
              origem: "fluxo",
              abertura: "Olá! Quero ver um exemplo do relatório mensal da SUDO.",
              dados: { interesse: "exemplo de relatorio mensal" },
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver um exemplo de relatório
          </a>
        </div>
        <ul className="report">
          {report.map(([title, text]) => (
            <li key={title}>
              <Icon name="check" />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="band" id="sobre">
      <div className="wrap about">
        <AboutVideo />
        <div>
          <h2>Quem faz</h2>
          <p>
            Sou o Leonardo Brito, fundador da SUDO. Sou desenvolvedor e cuido do começo ao fim: conversa
            com o dono, sistema, anúncio e relatório. Venho de redes e infraestrutura, então entendo o
            negócio por baixo da tela.
          </p>
          <p>
            Atendo clínicas, estética, bares e comércio no Rio e na Baixada, e já entreguei vídeos com IA
            para uma marca nos Estados Unidos. Estudo Ciência da Computação e Gestão Comercial.
          </p>
          <a className="link" href={site.technicalPortfolio} target="_blank" rel="noopener noreferrer">
            Ver meu portfólio técnico
          </a>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="faq-band band">
      <div className="wrap">
        <h2>Perguntas frequentes</h2>
        <div className="faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <Link className="logo" href="/">
          SUDO<span>.</span>
        </Link>
        <p>
          Tecnologia e IA para negócios. {site.city}. © {new Date().getFullYear()} SUDO
        </p>
        <nav aria-label="Rodapé">
          <Link href="/privacidade">Privacidade</Link>
          <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={site.technicalPortfolio} target="_blank" rel="noopener noreferrer">
            Portfólio técnico
          </a>
        </nav>
      </div>
    </footer>
  );
}
