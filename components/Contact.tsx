"use client";

import { useEffect, useState } from "react";
import { emFrase, minuscula, site, waNatural } from "@/lib/config";
import { pains, type PainKey } from "@/lib/interactive";
import { useActivity } from "./Activity";
import { Icon } from "./Icons";

const ramos = [
  "Clínica ou consultório",
  "Estética ou spa",
  "Odontologia",
  "Bar ou restaurante",
  "Comércio ou delivery",
  "Oficina ou serviços",
  "Distribuidora ou logística",
  "Outro",
];

const needs = [
  "O fluxo completo, de anúncio a relatório",
  "Atendimento com IA no WhatsApp",
  "Anúncios para trazer clientes",
  "Landing page que qualifica",
  "Sistema sob medida",
  "Ainda não sei, quero o diagnóstico",
];

export function Contact() {
  const [f, setF] = useState({ nome: "", neg: "", ramo: "", cidade: "", need: "", msg: "" });
  const [dores, setDores] = useState<PainKey[]>([]);
  const { track } = useActivity();

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const toggleDor = (k: PainKey) =>
    setDores((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));

  // Registra o formulário conforme é preenchido, mesmo que a pessoa não envie.
  useEffect(() => {
    const preenchido = [
      f.nome && `nome: ${f.nome}`,
      f.neg && `negócio: ${f.neg}`,
      f.ramo && `ramo: ${f.ramo}`,
      f.cidade && `cidade: ${f.cidade}`,
      f.need && `precisa de: ${f.need}`,
      f.msg && `detalhes: ${f.msg}`,
    ].filter(Boolean);
    if (!preenchido.length) return;
    const t = setTimeout(
      () => track("formulario", `Preencheu no formulário — ${preenchido.join("; ")}.`),
      1200,
    );
    return () => clearTimeout(t);
  }, [f, track]);

  // Transforma o formulário numa apresentação curta, do jeito que ele falaria.
  const nome = f.nome.trim();
  const neg = f.neg.trim();
  const cidade = f.cidade.trim();
  const doresEmFrase = emFrase(
    dores.map((k) => minuscula(pains.find((p) => p.key === k)!.label)),
  );

  // Se nada foi preenchido, o botão ainda precisa gerar uma mensagem que faça
  // sentido sozinha, em vez de um "Oi! Podemos conversar?" solto.
  const contou = Boolean(neg || cidade || f.ramo || doresEmFrase || f.need || f.msg.trim());

  const link = waNatural(
    contou
      ? [
          nome ? `Oi! Sou o ${nome}.` : "Oi!",
          neg && cidade
            ? `Tenho o ${neg}, em ${cidade}.`
            : neg
              ? `Tenho o ${neg}.`
              : cidade
                ? `Meu negócio é em ${cidade}.`
                : "",
          !neg && f.ramo ? `Trabalho com ${minuscula(f.ramo)}.` : "",
          doresEmFrase && `Meu problema hoje é ${doresEmFrase}.`,
          f.need && `Estava vendo ${minuscula(f.need)}.`,
          f.msg.trim(),
          "Podemos conversar?",
        ]
      : [
          nome ? `Oi! Sou o ${nome}.` : "Oi!",
          "Vi o site de vocês e queria conversar sobre o meu negócio.",
          "Podemos marcar aquele diagnóstico de 20 minutos?",
        ],
  );

  return (
    <section className="contact band" id="contato">
      <div className="wrap contact-grid">
        <div>
          <h2>Descubra em 20 minutos onde seu negócio perde cliente</h2>
          <p className="sub">
            Uma conversa rápida, sem compromisso. O que você responder aqui chega junto no WhatsApp,
            então o atendente não te pergunta tudo de novo.
          </p>
          <ul className="bullets">
            {[
              "O atendente de IA responde em segundos, a qualquer hora.",
              "Você sai sabendo onde perde cliente e tempo.",
              "Sem jargão técnico e sem proposta empurrada.",
              "Quem marca a reunião é o Leonardo, por aqui mesmo.",
            ].map((t) => (
              <li key={t}>
                <Icon name="check" />
                {t}
              </li>
            ))}
          </ul>
          <div className="lines">
            <p>
              <b>WhatsApp</b> {site.whatsappDisplay}
            </p>
            <p>
              <b>E-mail</b> {site.email}
            </p>
            <p>
              <b>Instagram</b> @{site.instagram}
            </p>
            <p>
              <b>Base</b> {site.city}, atendendo o Rio e a Baixada
            </p>
          </div>
        </div>

        <form className="card" onSubmit={(e) => e.preventDefault()} autoComplete="off">
          <h3>Peça seu diagnóstico</h3>
          <div className="field">
            <label htmlFor="f-nome">Seu nome</label>
            <input id="f-nome" type="text" value={f.nome} onChange={set("nome")} />
          </div>
          <div className="field">
            <label htmlFor="f-neg">Nome do negócio</label>
            <input id="f-neg" type="text" value={f.neg} onChange={set("neg")} />
          </div>
          <div className="field">
            <label htmlFor="f-ramo">Ramo</label>
            <select id="f-ramo" value={f.ramo} onChange={set("ramo")}>
              <option value="">Selecione</option>
              {ramos.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-cidade">Cidade</label>
            <input id="f-cidade" type="text" value={f.cidade} onChange={set("cidade")} />
          </div>
          <div className="field">
            <label htmlFor="f-need">O que você precisa</label>
            <select id="f-need" value={f.need} onChange={set("need")}>
              <option value="">Selecione</option>
              {needs.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <span className="pseudo-label">Suas dores de hoje</span>
            <div className="chips" role="group" aria-label="Suas dores de hoje">
              {pains.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className="chip"
                  aria-pressed={dores.includes(p.key)}
                  onClick={() => toggleDor(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="f-msg">Quer contar mais alguma coisa? (opcional)</label>
            <textarea id="f-msg" value={f.msg} onChange={set("msg")} />
          </div>
          <a className="btn" href={link} target="_blank" rel="noopener noreferrer">
            Enviar pelo WhatsApp
          </a>
          <p className="small">
            O WhatsApp abre com a sua mensagem já escrita. Você revisa antes de enviar.
          </p>
        </form>
      </div>
    </section>
  );
}
