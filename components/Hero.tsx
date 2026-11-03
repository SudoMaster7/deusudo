"use client";

import { NICHES } from "@/lib/niches";
import { waNatural } from "@/lib/config";
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
            Anúncio que traz quem tem perfil de fechar, página que
            qualifica antes de ocupar sua agenda, atendente de IA que responde em segundos e não deixa
            lead esfriar, e agenda cheia de consulta que vira tratamento. No fim do mês você vê quanto
            entrou de lead, quanto virou consulta, quanto virou contrato e quanto custou cada paciente
            novo.
          </p>
          <div className="cta-row">
            <a
              className="btn"
              href={waNatural([
                "Oi! Vi o site de vocês e queria entender o que daria para fazer no meu negócio.",
                "Podemos marcar aquele diagnóstico de 20 minutos?",
              ])}
              target="_blank"
              rel="noopener noreferrer"
            >
              Quero um diagnóstico gratuito
            </a>
            <a className="btn ghost" href="#capacidade">
              Cabe mais cliente?
            </a>
            <a className="btn ghost" href="#fluxo">
              Ver o fluxo completo
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
          <p className="stage-note">
            Exemplo de atendimento fora do horário comercial, com clínica fictícia.
          </p>
        </div>
      </div>
    </section>
  );
}
