"use client";

import { useState } from "react";
import { leadLink, site } from "@/lib/config";
import { pains, type PainKey } from "@/lib/interactive";
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

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const toggleDor = (k: PainKey) =>
    setDores((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]));

  const link = leadLink({
    origem: "formulario",
    abertura: "Olá! Vim pelo site da SUDO e quero um diagnóstico gratuito.",
    dados: {
      nome: f.nome,
      negocio: f.neg,
      ramo: f.ramo,
      cidade: f.cidade,
      preciso_de: f.need,
      dores: dores.map((k) => pains.find((p) => p.key === k)!.label),
      detalhes: f.msg,
    },
  });

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
