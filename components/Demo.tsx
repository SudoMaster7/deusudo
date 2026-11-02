"use client";

import { useState } from "react";
import { NICHES, type NicheKey } from "@/lib/niches";
import { waLink } from "@/lib/config";
import { Icon } from "./Icons";
import { NicheChips, useNiche } from "./NicheContext";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function Demo() {
  const { niche } = useNiche();
  return (
    <section className="demo-band band" id="demo">
      <div className="wrap">
        <h2>A mesma vitrine serve para qualquer ramo</h2>
        <p className="sub">
          Escolha um ramo, monte o carrinho e veja o pedido chegar escrito no WhatsApp. É uma
          demonstração com um negócio fictício.
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

  const change = (i: number, d: number) =>
    setCart((c) => c.map((q, j) => (j === i ? Math.min(20, Math.max(0, q + d)) : q)));

  const lines = n.items.flatMap((it, i) =>
    cart[i] ? [`${cart[i]}x ${it.name} (${brl(it.price * cart[i])})`] : [],
  );
  const total = n.items.reduce((s, it, i) => s + it.price * cart[i], 0);
  const message = lines.length
    ? `[Demonstração do site deusudo.com - ${n.biz}]\n${n.hello}\n${lines.join("\n")}\nTotal: ${brl(total)}`
    : null;

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
            href={message ? waLink(message) : "#demo"}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!message}
            onClick={(e) => {
              if (!message) e.preventDefault();
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
          Mesma estrutura, outro ramo. Só mudam os itens, os textos e as respostas. Neste teste, o
          pedido chega para a SUDO.
        </p>
      </div>
    </div>
  );
}
