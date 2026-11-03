"use client";

import { useEffect, useMemo, useState } from "react";
import { emFrase, minuscula, waNatural } from "@/lib/config";
import { painFixes, pains, simDefaults, simRanges, type PainKey } from "@/lib/interactive";
import { useActivity } from "./Activity";
import { Icon } from "./Icons";

const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

type Sim = typeof simDefaults;

export function Diagnostic() {
  const [sim, setSim] = useState<Sim>(simDefaults);
  const [marked, setMarked] = useState<PainKey[]>(["resposta", "horario"]);
  const { track } = useActivity();

  const set = (k: keyof Sim) => (e: { target: { value: string } }) =>
    setSim((s) => ({ ...s, [k]: Number(e.target.value) }));

  const toggle = (k: PainKey) =>
    setMarked((m) => (m.includes(k) ? m.filter((x) => x !== k) : [...m, k]));

  const calc = useMemo(() => {
    const mes = sim.mensagens * 4.3;
    const semResposta = mes * (1 - sim.rapidas / 100);
    const perdido = semResposta * (sim.fechamento / 100) * sim.ticket;
    return {
      mes: Math.round(mes),
      semResposta: Math.round(semResposta),
      perdido: Math.round(perdido),
      ano: Math.round(perdido * 12),
    };
  }, [sim]);

  const fixes = useMemo(() => {
    const keys = new Set(marked.map((k) => pains.find((p) => p.key === k)!.solves));
    if (marked.length) keys.add("rel");
    return [...keys].map((k) => painFixes[k]);
  }, [marked]);

  // Registra o retrato do simulador. Só o valor final de cada ajuste importa,
  // então uma pequena espera evita gravar cada passo do controle deslizante.
  useEffect(() => {
    const t = setTimeout(() => {
      track(
        "simulador",
        `No simulador: ${sim.mensagens} mensagens por semana, ${sim.rapidas}% respondidas no mesmo dia, ` +
          `ticket de ${brl(sim.ticket)}, ${sim.fechamento}% de fechamento. ` +
          `Concluiu que deixa ${brl(calc.perdido)} na mesa por mês.`,
      );
    }, 900);
    return () => clearTimeout(t);
  }, [sim, calc.perdido, track]);

  useEffect(() => {
    if (!marked.length) return;
    track(
      "dores",
      `Marcou como dor: ${marked.map((k) => pains.find((p) => p.key === k)!.label).join("; ")}.`,
    );
  }, [marked, track]);

  // Soa como ele contando a própria conta, com os números que digitou.
  const doresEmFrase = emFrase(
    marked.map((k) => minuscula(pains.find((p) => p.key === k)!.label)),
  );
  const link = waNatural([
    "Oi! Fiz aquela conta no site de vocês.",
    `Recebo umas ${sim.mensagens} mensagens por semana e só consigo responder ${sim.rapidas}% no mesmo dia,`,
    `então dá uns ${brl(calc.perdido)} por mês que escapa.`,
    doresEmFrase && `O que mais me pega é ${doresEmFrase}.`,
    "Como vocês resolveriam isso?",
  ]);

  return (
    <section className="diag-band band" id="diagnostico">
      <div className="wrap">
        <h2>Faça a conta com os seus números</h2>
        <p className="sub">
          Nada de média de mercado. Mexa nos quatro controles abaixo, marque as suas dores e veja o
          que está ficando na mesa todo mês. A conta aparece na hora e vai junto no WhatsApp.
        </p>

        <div className="diag">
          <div className="diag-form card">
            <h3>Os seus números</h3>

            <Range
              id="d-msg"
              label="Mensagens que você recebe por semana"
              value={sim.mensagens}
              display={String(sim.mensagens)}
              range={simRanges.mensagens}
              onChange={set("mensagens")}
            />
            <Range
              id="d-rap"
              label="Quantas você responde no mesmo dia"
              value={sim.rapidas}
              display={`${sim.rapidas}%`}
              range={simRanges.rapidas}
              onChange={set("rapidas")}
            />
            <Range
              id="d-tic"
              label="Ticket médio de um tratamento fechado"
              value={sim.ticket}
              display={brl(sim.ticket)}
              range={simRanges.ticket}
              onChange={set("ticket")}
            />
            <Range
              id="d-fec"
              label="De cada 100 bem atendidos, quantos fecham"
              value={sim.fechamento}
              display={`${sim.fechamento}%`}
              range={simRanges.fechamento}
              onChange={set("fechamento")}
            />

            <p className="diag-pains-title">O que mais te incomoda hoje</p>
            <div className="chips" role="group" aria-label="Suas dores">
              {pains.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className="chip"
                  aria-pressed={marked.includes(p.key)}
                  onClick={() => toggle(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="diag-out">
            <div className="diag-big">
              <span>Fica na mesa por mês</span>
              <strong>{brl(calc.perdido)}</strong>
              <small>{brl(calc.ano)} em doze meses, se nada mudar</small>
            </div>

            <ul className="diag-steps">
              <li>
                <b>{calc.mes}</b> mensagens chegam no mês
              </li>
              <li>
                <b>{calc.semResposta}</b> delas não recebem resposta rápida
              </li>
              <li>
                <b>{sim.fechamento}%</b> fechariam a {brl(sim.ticket)} cada
              </li>
            </ul>
            <p className="diag-math">
              Conta: mensagens por semana × 4,3 × as que ficam sem resposta rápida × taxa de
              fechamento × ticket médio. São os seus números, não os de uma pesquisa.
            </p>

            {fixes.length > 0 && (
              <div className="diag-fix">
                <p className="after-title">Pelo que você marcou, o fluxo entraria assim:</p>
                <ul className="after">
                  {fixes.map((f) => (
                    <li key={f.title}>
                      <Icon name="check" />
                      <span>
                        <b>{f.title}.</b> {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a className="btn" href={link} target="_blank" rel="noopener noreferrer">
              Levar esta conta para o diagnóstico
            </a>
            <p className="small">
              O WhatsApp abre com os seus números já escritos. O atendente de IA recebe tudo isso e
              não te pergunta de novo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Range({
  id,
  label,
  value,
  display,
  range,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  range: { min: number; max: number; step: number };
  onChange: (e: { target: { value: string } }) => void;
}) {
  return (
    <div className="range">
      <label htmlFor={id}>
        {label}
        <output htmlFor={id}>{display}</output>
      </label>
      <input
        id={id}
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
