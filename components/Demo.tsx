"use client";

import { useEffect, useState } from "react";
import { NICHES, type NicheKey } from "@/lib/niches";
import { emFrase, waNatural } from "@/lib/config";
import { useActivity } from "./Activity";
import { Icon } from "./Icons";
import { NicheChips, useNiche } from "./NicheContext";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function Demo() {
  const { niche } = useNiche();
  return (
    <section className="demo-band band" id="demo">
      <div className="wrap">
        <h2>O paciente monta o orçamento e ele chega escrito no WhatsApp</h2>
        <p className="sub">
          Escolha um ramo, marque os procedimentos de interesse e veja a mensagem chegar pronta. É
          uma demonstração com clínica fictícia: serve igual para plano de tratamento, pacote de
          sessões ou produto.
        </p>
        <div style={{ marginTop: 22 }}>
          <NicheChips label="Ramo da demonstração" />
        </div>
        <DemoBody key={niche} niche={niche} />
      </div>
    </section>
  );
}

function DemoBody({ niche }: { niche: NicheKey }) {
  const n = NICHES[niche];
  const [cart, setCart] = useState<number[]>(() => n.items.map(() => 0));
  const { track } = useActivity();

  const change = (i: number, d: number) =>
    setCart((c) => c.map((q, j) => (j === i ? Math.min(20, Math.max(0, q + d)) : q)));

  const lines = n.items.flatMap((it, i) =>
    cart[i] ? [`${cart[i]}x ${it.name} (${brl(it.price * cart[i])})`] : [],
  );
  const total = n.items.reduce((s, it, i) => s + it.price * cart[i], 0);
  const message = lines.length
    ? `[Demonstração do site deusudo.com - ${n.biz}]\n${n.hello}\n${lines.join("\n")}\nTotal: ${brl(total)}`
    : null;
  // A vitrine é demonstração: o pedido é de teste e a mensagem diz isso,
  // em vez de chegar como um pedido de verdade.
  const link = lines.length
    ? waNatural([
        `Oi! Testei a vitrine do site, a do ${n.biz}, e montei um pedido de ${brl(total)}`,
        `com ${emFrase(n.items.flatMap((it, i) => (cart[i] ? [it.name.toLowerCase()] : [])))}.`,
        "Gostei de o pedido já chegar escrito aqui. Dá para fazer isso para o meu negócio?",
      ])
    : null;

  useEffect(() => {
    if (!lines.length) return;
    track("vitrine", `Montou um carrinho de teste em ${n.biz}: ${lines.join(", ")}.`);
  }, [lines, n.biz, track]);

  return (
    <div className="demo">
      <div className="shop">
        <div className="shop-head">
          <div className="avatar">
            <Icon name={niche} />
          </div>
          <div>
            <strong>{n.biz}</strong>
            <span>{n.tag}</span>
          </div>
        </div>
        <ul className="items">
          {n.items.map((it, i) => (
            <li className="row" key={it.name}>
              <span className="tile">
                <Icon name={niche} />
              </span>
              <div className="info">
                <strong>{it.name}</strong>
                <span>{it.desc}</span>
              </div>
              <div className="side">
                <span className="price">{brl(it.price)}</span>
                <div className="step">
                  <button type="button" aria-label={`Tirar ${it.name}`} onClick={() => change(i, -1)}>
                    {"−"}
                  </button>
                  <output>{cart[i]}</output>
                  <button type="button" aria-label={`Adicionar ${it.name}`} onClick={() => change(i, 1)}>
                    +
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="shop-foot">
          <div className="total">
            <span>Total</span>
            <strong>{brl(total)}</strong>
          </div>
          <a
            className="btn"
            href={link ?? "#demo"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!link}
            onClick={(e) => {
              if (!link) e.preventDefault();
            }}
          >
            {n.cta}
          </a>
        </div>
      </div>

      <div className="flow">
        <h3>O pedido chega pronto</h3>
        <div className="arrive">
          {message ? (
            <div className="b in">{message}</div>
          ) : (
            <p className="empty">
              Adicione um item ao carrinho para ver a mensagem que chega no WhatsApp.
            </p>
          )}
        </div>
        <p className="after-title">Depois disso, o atendente de IA:</p>
        <ul className="after">
          {n.after.map((t) => (
            <li key={t}>
              <Icon name="check" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="same">
          Mesma estrutura, outro ramo. Só mudam os itens, os textos e as respostas. Em clínica
          regulada pelo CFO ou pelo CFM, a mesma vitrine roda sem valor na tela: o paciente marca os
          procedimentos de interesse e o valor é tratado na conversa privada. Neste teste, o pedido
          chega para a SUDO.
        </p>
      </div>
    </div>
  );
}
