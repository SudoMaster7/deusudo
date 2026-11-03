"use client";

import { useEffect, useState } from "react";
import { waNatural } from "@/lib/config";
import { capacity } from "@/lib/content";
import { useActivity } from "./Activity";
import { Icon } from "./Icons";

// O "chamado" do site: antes de falar de anúncio, a pessoa responde se a
// operação dela aguenta mais cliente. Cada resposta abre um caminho, e uma
// delas diz para não anunciar agora.
export function Capacity() {
  const [key, setKey] = useState<string | null>(null);
  const { track } = useActivity();
  const chosen = capacity.options.find((o) => o.key === key) ?? null;

  useEffect(() => {
    if (!chosen) return;
    track(
      "capacidade",
      `Sobre comportar mais cliente, respondeu "${chosen.label}". Leitura: ${chosen.verdict}`,
    );
  }, [chosen, track]);

  const link = chosen
    ? waNatural([
        "Oi! Respondi aquela pergunta no site de vocês, se o meu negócio comporta mais cliente.",
        chosen.wa,
        "Como vocês começariam no meu caso?",
      ])
    : null;

  return (
    <section className="cap-band band" id="capacidade">
      <div className="wrap">
        <h2>{capacity.title}</h2>
        <p className="sub">{capacity.lead}</p>

        <div className="cap">
          <div className="cap-ask">
            <p className="cap-q">{capacity.question}</p>
            <div className="cap-opts" role="group" aria-label={capacity.question}>
              {capacity.options.map((o) => (
                <button
                  key={o.key}
                  type="button"
                  className="cap-opt"
                  aria-pressed={key === o.key}
                  onClick={() => setKey(o.key)}
                >
                  <span className="cap-dot" aria-hidden="true" />
                  {o.label}
                </button>
              ))}
            </div>
            <p className="cap-note">{capacity.note}</p>
          </div>

          <div className="cap-out card" aria-live="polite">
            {chosen ? (
              <>
                <span className="cap-verdict">{chosen.verdict}</span>
                <p className="cap-text">{chosen.text}</p>
                <p className="after-title">O que entra primeiro:</p>
                <ul className="after">
                  {chosen.does.map((d) => (
                    <li key={d}>
                      <Icon name="check" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
                <a className="btn" href={link ?? "#capacidade"} target="_blank" rel="noopener noreferrer">
                  Levar esta resposta para o diagnóstico
                </a>
                <p className="small">
                  O WhatsApp abre com a sua resposta já escrita. A reunião de 20 minutos é gratuita.
                </p>
              </>
            ) : (
              <p className="cap-empty">
                Escolha uma das três respostas ao lado e veja por onde a SUDO começaria no seu caso.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
