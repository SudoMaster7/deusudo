// Painel de clientes em potencial.
//
// Mostra quem passou pelo site: o que a pessoa fez em cada seção, a conversa
// com o agente "S" e a qualificação que a IA extraiu. Fora do Google (noindex
// aqui e bloqueio em robots.ts) e atrás de senha.

import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { COOKIE, cookieValido, senhaConfigurada } from "@/lib/adminAuth";
import { listarInteresse, type Interessado } from "@/lib/leadStore";

export const metadata: Metadata = {
  title: "Painel de interesse",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const INTERESSES: Record<string, string> = {
  ia_whatsapp: "Atendente de IA no WhatsApp",
  anuncios: "Tráfego pago",
  sistemas: "Sistema sob medida",
};

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const autenticado = cookieValido((await cookies()).get(COOKIE)?.value);

  return (
    <main className="adm">
      <div className="adm-wrap">
        <header className="adm-top">
          <Link className="logo" href="/">
            SUDO<span>.</span>
          </Link>
          <strong>Painel de interesse</strong>
          {autenticado && (
            <form action="/admin/sair" method="post">
              <button type="submit" className="adm-sair">
                Sair
              </button>
            </form>
          )}
        </header>

        {!autenticado ? (
          <Entrar erro={Boolean(erro)} />
        ) : (
          <Lista />
        )}
      </div>
    </main>
  );
}

function Entrar({ erro }: { erro: boolean }) {
  if (!senhaConfigurada()) {
    return (
      <div className="adm-aviso">
        <h1>Falta configurar a senha</h1>
        <p>
          Defina a variável de ambiente <code>ADMIN_PASSWORD</code>, com pelo menos 8 caracteres, e
          publique de novo. Enquanto ela não existir, ninguém entra no painel — nem você.
        </p>
        <p>
          Localmente, é uma linha no arquivo <code>.env.local</code>. Na Vercel, fica em{" "}
          <b>Settings &gt; Environment Variables</b>.
        </p>
      </div>
    );
  }

  return (
    <form className="adm-login" action="/admin/entrar" method="post">
      <h1>Entrar</h1>
      <label htmlFor="senha">Senha do painel</label>
      <input id="senha" name="senha" type="password" autoComplete="current-password" required autoFocus />
      {erro && <p className="adm-erro">Senha incorreta.</p>}
      <button className="btn" type="submit">
        Entrar
      </button>
    </form>
  );
}

async function Lista() {
  const r = await listarInteresse();

  if (!r.ok) {
    return <Problema motivo={r.motivo} detalhe={r.detalhe} />;
  }

  const quentes = r.linhas.filter((l) => l.quente);
  const comConversa = r.linhas.filter((l) => l.mensagens > 0);

  return (
    <>
      <div className="adm-resumo">
        <div>
          <strong>{r.linhas.length}</strong>
          <span>visitas registradas</span>
        </div>
        <div>
          <strong>{comConversa.length}</strong>
          <span>conversaram com o S</span>
        </div>
        <div className="adm-destaque">
          <strong>{quentes.length}</strong>
          <span>pedindo seu contato</span>
        </div>
      </div>

      {r.linhas.length === 0 ? (
        <p className="adm-vazio">
          Ninguém registrado ainda. Assim que alguém conversar com o assistente do site, aparece
          aqui.
        </p>
      ) : (
        <ul className="adm-lista">
          {r.linhas.map((l) => (
            <Cartao key={l.sessao} l={l} />
          ))}
        </ul>
      )}
    </>
  );
}

function Problema({ motivo, detalhe }: { motivo: string; detalhe?: string }) {
  if (motivo === "desligado") {
    return (
      <div className="adm-aviso">
        <h1>Supabase não configurado</h1>
        <p>
          Preencha <code>SUPABASE_URL</code> e a chave de acesso nas variáveis de ambiente. Sem
          elas o assistente do site continua respondendo, mas nada é gravado.
        </p>
      </div>
    );
  }

  if (motivo === "sem-permissao") {
    return (
      <div className="adm-aviso">
        <h1>A chave atual não consegue ler a tabela</h1>
        <p>
          A tabela tem RLS ligado e nenhuma política de leitura, de propósito: a chave{" "}
          <code>sb_publishable_…</code> grava, mas não lê. Para o painel mostrar os registros, use a
          chave <b>secreta</b> do Supabase em <code>SUPABASE_SERVICE_ROLE_KEY</code>.
        </p>
        <p>
          Ela fica em <b>Project Settings &gt; API Keys</b>, começa com <code>sb_secret_</code> e
          nunca chega ao navegador: só a rota do servidor a usa.
        </p>
        <p>
          Se a tabela ainda não existe, rode <code>supabase/interesse-site.sql</code> no SQL Editor
          antes.
        </p>
      </div>
    );
  }

  return (
    <div className="adm-aviso">
      <h1>Não consegui ler os registros</h1>
      <p>O Supabase respondeu com erro. Se a tabela ainda não existe, rode o SQL do repositório.</p>
      {detalhe && <pre className="adm-detalhe">{detalhe}</pre>}
    </div>
  );
}

function Cartao({ l }: { l: Interessado }) {
  const vazio = "— a descobrir";
  return (
    <li className={`adm-card${l.quente ? " quente" : ""}`}>
      <div className="adm-card-top">
        <div>
          <h2>{l.nome || l.negocio || "Visitante sem nome"}</h2>
          <p className="adm-sub">
            {[l.negocio, l.ramo, l.cidade].filter(Boolean).join(" · ") || "ainda não se apresentou"}
          </p>
        </div>
        {l.quente && <span className="adm-tag">quer contato</span>}
      </div>

      <div className="adm-vinda">
        <p>
          <b>Veio de</b> {l.origem || "origem desconhecida"}
          {l.campanha && <span className="adm-campanha"> · {l.campanha}</span>}
        </p>
        <p>
          <b>Engatou em</b> {l.gancho || "nada ainda, só navegou"}
        </p>
      </div>

      {l.mensagem_enviada && (
        <blockquote className="adm-msg">
          <span>Mensagem que ele te mandou</span>
          {l.mensagem_enviada}
        </blockquote>
      )}

      <dl className="adm-campos">
        <div>
          <dt>Dor</dt>
          <dd>{l.dor || vazio}</dd>
        </div>
        <div>
          <dt>Interesse</dt>
          <dd>{l.interesse ? INTERESSES[l.interesse] ?? l.interesse : vazio}</dd>
        </div>
        <div>
          <dt>Mensagens</dt>
          <dd>{l.mensagens}</dd>
        </div>
        <div>
          <dt>Última vez</dt>
          <dd>{quando(l.atualizado_em)}</dd>
        </div>
      </dl>

      {l.atividade.length > 0 && (
        <details>
          <summary>O que fez no site ({l.atividade.length})</summary>
          <ul className="adm-atividade">
            {l.atividade.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </details>
      )}

      {l.conversa.length > 0 && (
        <details>
          <summary>
            Conversa com o S ({l.conversa.length}{" "}
            {l.conversa.length === 1 ? "mensagem" : "mensagens"})
          </summary>
          <div className="adm-conversa">
            {l.conversa.map((m, i) => (
              <p key={i} className={m.role === "user" ? "dele" : "bot"}>
                <b>{m.role === "user" ? "Ele" : "S"}</b> {m.content}
              </p>
            ))}
          </div>
        </details>
      )}

      <p className="adm-rodape">
        {l.chegou_em && <>Chegou em {l.chegou_em} · </>}
        {l.pagina && l.pagina !== l.chegou_em && <>estava em {l.pagina} · </>}
        Primeira visita em {quando(l.criado_em)} · sessão {l.sessao.slice(0, 8)}
      </p>
    </li>
  );
}

function quando(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
