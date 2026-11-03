"use client";

import { useEffect, useRef, useState } from "react";
import { emFrase, waNatural } from "@/lib/config";
import {
  detectIntent,
  labPresets,
  labQuestions,
  labReply,
  rulesSummary,
  tones,
  type BotRules,
} from "@/lib/interactive";
import { useActivity } from "./Activity";
import { Icon } from "./Icons";
import { NicheChips, useNiche } from "./NicheContext";

type Msg = { from: "in" | "out"; text: string };

/** Encaixa o texto no meio da frase sem quebrar se vier vazio. */
const minusculaSegura = (t: string) => {
  const limpo = t.trim();
  return limpo ? limpo.charAt(0).toLowerCase() + limpo.slice(1) : "";
};

const firstHello = (r: BotRules) =>
  `Oi! Sou o atendente de IA do ${r.biz}. Trabalhamos com ${r.sells}. Como posso te ajudar?`;

export function BotLab() {
  const { niche } = useNiche();
  return (
    <section className="lab-band band" id="testar">
      <div className="wrap">
        <h2>Ajuste o atendente ao seu gosto e converse com ele</h2>
        <p className="sub">
          Mude o tom, o horário, se ele pode falar preço e o que ele nunca pode dizer. A conversa ao
          lado passa a seguir as suas regras na hora. É aqui que a maioria descobre o que quer, e o
          que não quer, antes de contratar.
        </p>
        <div style={{ marginTop: 22 }}>
          <NicheChips label="Ramo de partida" />
        </div>
        <LabBody key={niche} preset={labPresets[niche]} />
      </div>
    </section>
  );
}

function LabBody({ preset }: { preset: BotRules }) {
  const [r, setR] = useState<BotRules>(preset);
  const [log, setLog] = useState<Msg[]>([{ from: "out", text: firstHello(preset) }]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { track } = useActivity();

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const edit =
    <K extends keyof BotRules>(k: K) =>
    (v: BotRules[K]) =>
      setR((s) => ({ ...s, [k]: v }));

  function ask(text: string) {
    const limpo = text.trim();
    if (!limpo || typing) return;
    setDraft("");
    setLog((l) => [...l, { from: "in", text: limpo }]);
    setTyping(true);
    // Espera curta só para mostrar o "digitando". No WhatsApp o atendente
    // responde em segundos; aqui a simulação não chama modelo nenhum.
    timer.current = setTimeout(() => {
      setLog((l) => [...l, { from: "out", text: labReply(detectIntent(limpo), r) }]);
      setTyping(false);
    }, 700);
  }

  const resumo = rulesSummary(r);
  const comoQuer = emFrase(
    [
      r.hours === "24h" ? "atendendo a qualquer hora" : "no horário comercial",
      r.tellsPrice ? "podendo falar o valor" : "sem falar valor, me chamando antes",
      r.books ? "marcando horário" : "só anotando para eu confirmar",
    ].filter(Boolean),
  );

  // Registra as regras montadas e o que a pessoa perguntou ao atendente de teste.
  useEffect(() => {
    const t = setTimeout(
      () => track("laboratorio", `Montou um atendente no laboratório — ${resumo.join("; ")}.`),
      900,
    );
    return () => clearTimeout(t);
  }, [resumo, track]);

  useEffect(() => {
    const perguntas = log.filter((m) => m.from === "in").map((m) => m.text);
    if (perguntas.length) {
      track("perguntas_lab", `Perguntou ao atendente de teste: ${perguntas.join(" | ")}.`);
    }
  }, [log, track]);
  // Conta o que ele montou como um pedido, não como um formulário de configuração.
  const link = waNatural([
    "Oi! Mexi naquele teste do atendente no site e montei do jeito que eu queria:",
    `${comoQuer}.`,
    r.never.trim() && `E tem uma coisa que ele não pode fazer: ${minusculaSegura(r.never)}.`,
    "Dá para deixar assim no meu número?",
  ]);

  return (
    <div className="lab">
      <div className="lab-form card">
        <h3>As regras do seu atendente</h3>

        <div className="field">
          <label htmlFor="l-biz">Nome do negócio</label>
          <input id="l-biz" type="text" value={r.biz} onChange={(e) => edit("biz")(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="l-sells">O que você vende</label>
          <input
            id="l-sells"
            type="text"
            value={r.sells}
            onChange={(e) => edit("sells")(e.target.value)}
          />
        </div>

        <p className="lab-label">Tom de voz</p>
        <div className="chips" role="group" aria-label="Tom de voz">
          {tones.map((t) => (
            <button
              key={t.key}
              type="button"
              className="chip"
              aria-pressed={r.tone === t.key}
              title={t.hint}
              onClick={() => edit("tone")(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="lab-label">Horário de atendimento</p>
        <div className="chips" role="group" aria-label="Horário de atendimento">
          {(["24h", "comercial"] as const).map((h) => (
            <button
              key={h}
              type="button"
              className="chip"
              aria-pressed={r.hours === h}
              onClick={() => edit("hours")(h)}
            >
              {h === "24h" ? "24 horas" : "Horário comercial"}
            </button>
          ))}
        </div>

        <p className="lab-label">O atendente pode falar preço?</p>
        <div className="chips" role="group" aria-label="Pode falar preço">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              className="chip"
              aria-pressed={r.tellsPrice === v}
              onClick={() => edit("tellsPrice")(v)}
            >
              {v ? "Pode falar" : "Chama você"}
            </button>
          ))}
        </div>
        {r.tellsPrice && (
          <div className="field">
            <label htmlFor="l-price">Valor de partida</label>
            <input
              id="l-price"
              type="text"
              value={r.price}
              onChange={(e) => edit("price")(e.target.value)}
            />
          </div>
        )}

        <p className="lab-label">Ele pode marcar horário?</p>
        <div className="chips" role="group" aria-label="Pode marcar horário">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              type="button"
              className="chip"
              aria-pressed={r.books === v}
              onClick={() => edit("books")(v)}
            >
              {v ? "Pode marcar" : "Só anota e repassa"}
            </button>
          ))}
        </div>

        <div className="field" style={{ marginTop: 16 }}>
          <label htmlFor="l-never">O que ele nunca pode dizer</label>
          <input
            id="l-never"
            type="text"
            value={r.never}
            onChange={(e) => edit("never")(e.target.value)}
          />
        </div>
      </div>

      <div className="lab-chat">
        <div className="phone">
          <div className="phone-head">
            <div className="avatar">
              <Icon name="check" />
            </div>
            <div>
              <strong>{r.biz || "Seu negócio"}</strong>
              <span>
                {typing ? "digitando..." : r.hours === "24h" ? "online" : "horário comercial"}
              </span>
            </div>
          </div>
          <div className="chat lab-log" aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`b ${m.from}`}>
                {m.text}
              </div>
            ))}
            {typing && <div className="b out">digitando...</div>}
          </div>
        </div>

        <p className="lab-label">Pergunte como um cliente perguntaria</p>
        <div className="chips" role="group" aria-label="Perguntas prontas">
          {labQuestions.map((q) => (
            <button key={q.key} type="button" className="chip" onClick={() => ask(q.text)}>
              {q.text}
            </button>
          ))}
        </div>

        <form
          className="lab-send"
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <label className="sr" htmlFor="l-draft">
            Escreva uma pergunta
          </label>
          <input
            id="l-draft"
            type="text"
            placeholder="Ou escreva a sua pergunta aqui"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className="btn" type="submit">
            Enviar
          </button>
        </form>

        <div className="lab-rules">
          <p className="after-title">Resumo do que você montou:</p>
          <ul>
            {resumo.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <a className="btn" href={link} target="_blank" rel="noopener noreferrer">
          Quero esse atendente no meu número
        </a>
        <p className="small">
          Esta é uma simulação no seu navegador, com respostas prontas. No seu número, o atendente
          responde com os seus serviços, preços e agenda de verdade, e chama você quando precisa.
        </p>
      </div>
    </div>
  );
}
