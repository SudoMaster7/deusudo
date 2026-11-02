"use client";

import { useState } from "react";
import { site, waLink } from "@/lib/config";
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
  "Atendimento com IA no WhatsApp",
  "Anúncios para trazer clientes",
  "Sistema sob medida",
  "Vitrine com pedido no WhatsApp",
  "Ainda não sei, quero o diagnóstico",
];

export function Contact() {
  const [f, setF] = useState({ nome: "", neg: "", ramo: "", need: "", msg: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const parts = ["Olá! Vim pelo site da SUDO e quero um diagnóstico gratuito."];
  if (f.nome.trim()) parts.push(`Nome: ${f.nome.trim()}`);
  if (f.neg.trim()) parts.push(`Negócio: ${f.neg.trim()}`);
  if (f.ramo) parts.push(`Ramo: ${f.ramo}`);
  if (f.need) parts.push(`Preciso de: ${f.need}`);
  if (f.msg.trim()) parts.push(`Detalhes: ${f.msg.trim()}`);

  return (
    <section className="contact band" id="contato">
      <div className="wrap contact-grid">
        <div>
          <h2>Descubra em 20 minutos onde seu negócio perde cliente</h2>
          <p className="sub">Uma conversa rápida, sem compromisso.</p>
          <ul className="bullets">
            {[
              "Você sai sabendo onde perde cliente e tempo.",
              "Sem jargão técnico e sem proposta empurrada.",
              "Resposta no mesmo dia.",
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
            <label htmlFor="f-need">O que você precisa</label>
            <select id="f-need" value={f.need} onChange={set("need")}>
              <option value="">Selecione</option>
              {needs.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-msg">Quer contar mais alguma coisa? (opcional)</label>
            <textarea id="f-msg" value={f.msg} onChange={set("msg")} />
          </div>
          <a className="btn" href={waLink(parts.join("\n"))} target="_blank" rel="noopener noreferrer">
            Enviar pelo WhatsApp
          </a>
          <p className="small">O WhatsApp abre com a sua mensagem já escrita. Você revisa antes de enviar.</p>
        </form>
      </div>
    </section>
  );
}
