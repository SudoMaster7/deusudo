"use client";

import { NICHES } from "@/lib/niches";
import { waLink } from "@/lib/config";
import { Icon } from "./Icons";
import { NicheChips, useNiche } from "./NicheContext";

export function Hero() {
  const { niche } = useNiche();
  const n = NICHES[niche];

  return (
    <section className="hero band">
      <div className="wrap">
        <div>
          <h1>Menos tarefa repetitiva. Mais lucro e controle.</h1>
          <p className="lead">
            A SUDO monta atendimento com IA no WhatsApp, anúncios e sistemas sob medida para o seu
            negócio, e mostra em números o que mudou.
          </p>
          <div className="cta-row">
            <a
              className="btn"
              href={waLink("Olá! Vim pelo site da SUDO e quero um diagnóstico gratuito.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero um diagnóstico gratuito
            </a>
            <a className="btn ghost" href="#demo">
              Ver a demo
            </a>
          </div>
          <p className="pick">Escolha o seu ramo e veja o atendimento ao lado:</p>
          <NicheChips label="Ramo do negócio" />
        </div>
        <div className="stage">
          <div className="phone" aria-live="polite">
            <div className="phone-head">
              <div className="avatar">
                <Icon name={niche} />
              </div>
              <div>
                <strong>{n.biz}</strong>
                <span>online</span>
              </div>
            </div>
            <div className="chat" key={niche}>
              {n.chat.map((m, i) => (
                <div
                  key={i}
                  className={`b ${m.from}`}
                  style={{ animationDelay: `${(i * 0.4).toFixed(1)}s` }}
                >
                  {m.text}
                  <small>{m.time}</small>
                </div>
              ))}
            </div>
          </div>
          <p className="stage-note">Exemplo de atendimento fora do horário comercial.</p>
        </div>
      </div>
    </section>
  );
}
