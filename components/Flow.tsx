"use client";

import { useState } from "react";
import { funnel, funnelNote } from "@/lib/content";
import { leadLink } from "@/lib/config";
import { Icon } from "./Icons";

export function Flow() {
  const [open, setOpen] = useState(0);
  const stage = funnel[open];

  return (
    <section className="funnel-band band" id="fluxo">
      <div className="wrap">
        <h2>Como o cliente sai do anúncio e chega na sua agenda</h2>
        <p className="sub">
          É um fluxo só, em seis etapas. Toque em cada uma para ver o que acontece ali, o que você
          recebe e o número que a SUDO acompanha.
        </p>

        <ol className="rail" role="tablist" aria-label="Etapas do fluxo">
          {funnel.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                role="tab"
                id={`rail-${s.key}`}
                className="rail-step"
                aria-selected={i === open}
                aria-controls={`panel-${s.key}`}
                onClick={() => setOpen(i)}
              >
                <span className="rail-n">{i + 1}</span>
                <span className="rail-l">{s.short}</span>
              </button>
            </li>
          ))}
        </ol>

        <div
          className="stage-panel"
          role="tabpanel"
          id={`panel-${stage.key}`}
          aria-labelledby={`rail-${stage.key}`}
          key={stage.key}
        >
          <div className="stage-main">
            <span className="when">{stage.when}</span>
            <h3>{stage.title}</h3>
            <p className="stage-lead">{stage.lead}</p>
            <ul className="after">
              {stage.does.map((d) => (
                <li key={d}>
                  <Icon name="check" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="stage-side">
            <div className="stage-metric">
              <strong>{stage.metric[0]}</strong>
              <span>{stage.metric[1]}</span>
            </div>
            <p className="stage-gets">
              <b>Você sai com.</b> {stage.gets}
            </p>
            <a
              className="btn white"
              href={leadLink({
                origem: "fluxo",
                abertura: `Olá! Vim pelo site da SUDO e quero entender melhor a etapa "${stage.short}" do fluxo.`,
                dados: { etapa: stage.short },
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar sobre esta etapa
            </a>
          </aside>
        </div>

        <p className="fine">{funnelNote}</p>
      </div>
    </section>
  );
}
