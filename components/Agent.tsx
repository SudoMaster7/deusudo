"use client";

import { useEffect, useRef, useState } from "react";
import { minuscula, waNatural } from "@/lib/config";
import { AGENT_HELLO, AGENT_SHORTCUTS } from "@/lib/agentPrompt";
import { activityLines, useActivity } from "./Activity";
import { Icon } from "./Icons";

type Turno = { role: "user" | "assistant"; content: string };

export function Agent() {
  const [aberto, setAberto] = useState(false);
  const [conversa, setConversa] = useState<Turno[]>([]);
  const [rascunho, setRascunho] = useState("");
  const [pensando, setPensando] = useState(false);
  const [erro, setErro] = useState("");
  const [quente, setQuente] = useState(false);
  // O que a IA entendeu do negócio da pessoa, para a mensagem do WhatsApp.
  const [perfil, setPerfil] = useState<{
    nome?: string;
    negocio?: string;
    ramo?: string;
    cidade?: string;
    dor?: string;
  }>({});

  const { sessionId, activity, entrada, gancho } = useActivity();
  const fim = useRef<HTMLDivElement | null>(null);
  const campo = useRef<HTMLInputElement | null>(null);
  const painel = useRef<HTMLDivElement | null>(null);

  // Rola para a última mensagem e põe o cursor no campo ao abrir.
  useEffect(() => {
    if (aberto) campo.current?.focus();
  }, [aberto]);

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" });
  }, [conversa, pensando]);

  // Esc fecha o painel.
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  async function enviar(texto: string) {
    const limpo = texto.trim();
    if (!limpo || pensando) return;

    const comPergunta: Turno[] = [...conversa, { role: "user", content: limpo }];
    setConversa(comPergunta);
    setRascunho("");
    setErro("");
    setPensando(true);

    try {
      const r = await fetch("/api/agente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessao: sessionId,
          pagina: typeof window !== "undefined" ? window.location.pathname : "",
          atividade: activityLines(activity),
          origem: entrada?.origem,
          campanha: entrada?.campanha,
          chegou_em: entrada?.chegou_em,
          gancho,
          conversa: comPergunta,
        }),
      });

      const dados = await r.json().catch(() => null);

      if (!r.ok && r.status !== 429) throw new Error("falhou");
      if (!dados?.reply) throw new Error("vazio");

      setConversa([...comPergunta, { role: "assistant", content: dados.reply }]);
      if (dados.quente) setQuente(true);
      if (dados.dados) {
        // Mantém o que já sabia: a extração de um turno pode vir mais pobre.
        setPerfil((p) => ({
          nome: dados.dados.nome_pessoa || p.nome,
          negocio: dados.dados.nome_negocio || p.negocio,
          ramo: dados.dados.segmento || p.ramo,
          cidade: dados.dados.cidade || p.cidade,
          dor: dados.dados.dor_principal || p.dor,
        }));
      }
    } catch {
      setErro(
        "Não consegui responder agora. Tente de novo em instantes, ou fale no WhatsApp pelo botão abaixo.",
      );
    } finally {
      setPensando(false);
    }
  }

  // A mensagem do WhatsApp resume a conversa em duas ou três frases, com o que
  // a pessoa contou. O detalhe completo (conversa e interações) fica no painel
  // em /admin, então aqui não vai transcrição nenhuma.
  const link = waNatural([
    perfil.nome ? `Oi! Sou o ${perfil.nome}.` : "Oi!",
    perfil.negocio && perfil.cidade
      ? `Tenho o ${perfil.negocio}, em ${perfil.cidade}.`
      : perfil.negocio
        ? `Tenho o ${perfil.negocio}.`
        : perfil.ramo && perfil.cidade
          ? `Trabalho com ${minuscula(perfil.ramo)}, em ${perfil.cidade}.`
          : perfil.ramo
            ? `Trabalho com ${minuscula(perfil.ramo)}.`
            : perfil.cidade
              ? `Meu negócio é em ${perfil.cidade}.`
              : "",
    "Acabei de falar com o assistente aí no site.",
    perfil.dor && `Meu problema é ${minuscula(perfil.dor)}.`,
    "Podemos continuar por aqui?",
  ]);

  return (
    <>
      <button
        type="button"
        className="agent-fab"
        aria-expanded={aberto}
        aria-controls="agent-panel"
        onClick={() => setAberto((v) => !v)}
      >
        {aberto ? (
          <Icon name="close" />
        ) : (
          <>
            <span className="agent-s" aria-hidden="true">
              S
            </span>
            <span className="agent-fab-label">Dúvidas? Fale com o S</span>
          </>
        )}
        <span className="sr">{aberto ? "Fechar o assistente" : "Abrir o assistente da SUDO"}</span>
      </button>

      <div
        className="agent-panel"
        id="agent-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Assistente de IA da SUDO"
        hidden={!aberto}
        ref={painel}
      >
        <div className="agent-head">
          <span className="agent-s" aria-hidden="true">
            S
          </span>
          <div>
            <strong>Assistente da SUDO</strong>
            <span>{pensando ? "escrevendo..." : "IA, responde na hora"}</span>
          </div>
          <button type="button" className="agent-x" onClick={() => setAberto(false)}>
            <Icon name="close" />
            <span className="sr">Fechar</span>
          </button>
        </div>

        <div className="agent-log">
          <div className="b out">{AGENT_HELLO}</div>
          {conversa.map((m, i) => (
            <div key={i} className={`b ${m.role === "user" ? "in" : "out"}`}>
              {m.content}
            </div>
          ))}
          {pensando && (
            <div className="b out agent-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          )}
          {erro && <p className="agent-erro">{erro}</p>}
          <div ref={fim} />
        </div>

        {conversa.length === 0 && (
          <div className="agent-atalhos">
            {AGENT_SHORTCUTS.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => enviar(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {(quente || conversa.length >= 4) && (
          <a className="agent-wa" href={link} target="_blank" rel="noopener noreferrer">
            <Icon name="check" />
            Continuar no WhatsApp com o Leonardo
          </a>
        )}

        <form
          className="agent-send"
          onSubmit={(e) => {
            e.preventDefault();
            enviar(rascunho);
          }}
        >
          <label className="sr" htmlFor="agent-draft">
            Escreva sua dúvida
          </label>
          <input
            id="agent-draft"
            ref={campo}
            type="text"
            autoComplete="off"
            maxLength={1000}
            placeholder="Escreva sua dúvida"
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            disabled={pensando}
          />
          <button className="btn sm" type="submit" disabled={pensando || !rascunho.trim()}>
            Enviar
          </button>
        </form>

        <p className="agent-nota">
          Assistente de IA. A conversa e o que você testou no site ficam registrados para a SUDO
          preparar o seu diagnóstico. Não escreva senha, cartão ou documento.
        </p>
      </div>
    </>
  );
}
