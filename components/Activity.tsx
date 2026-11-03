"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Guarda três coisas sobre a visita:
//
// 1. DE ONDE VEIO — anúncio, campanha, Instagram ou busca, lido dos parâmetros
//    da URL e do site que encaminhou. Fica guardado na primeira página que a
//    pessoa abre, para não se perder quando ela navega.
// 2. O GANCHO — a primeira seção em que ela mexeu de verdade. É o que prendeu
//    a atenção dela, e normalmente é o assunto para começar a conversa.
// 3. O QUE FEZ — ramo escolhido, números do simulador, regras do laboratório,
//    carrinho, formulário.
//
// Nada sai do navegador por conta própria: só quando a pessoa fala com o agente
// ou toca num botão de WhatsApp.

export type Activity = { key: string; text: string; at: string };

export type Entrada = {
  /** Resumo legível de onde a pessoa veio. */
  origem: string;
  /** Campanha, conjunto e anúncio, quando vêm na URL. */
  campanha?: string;
  /** Primeira página que ela abriu no site. */
  chegou_em: string;
};

type Ctx = {
  sessionId: string;
  activity: Activity[];
  entrada: Entrada | null;
  /** O que engatou a pessoa: a primeira interação de verdade. */
  gancho: string;
  /** Registra ou atualiza uma interação. A mesma `key` sobrescreve a anterior. */
  track: (key: string, text: string) => void;
};

const ActivityCtx = createContext<Ctx>({
  sessionId: "",
  activity: [],
  entrada: null,
  gancho: "",
  track: () => {},
});

const CHAVE_ID = "sudo.sid";
const CHAVE_ENTRADA = "sudo.entrada";

/** Id da visita. Serve para juntar as interações e a conversa num registro só. */
function lerSessionId() {
  const novo = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    const salvo = window.localStorage.getItem(CHAVE_ID);
    if (salvo) return salvo;
    const id = novo();
    window.localStorage.setItem(CHAVE_ID, id);
    return id;
  } catch {
    // Navegação privada ou armazenamento bloqueado: id só desta página.
    return novo();
  }
}

/** Traduz os parâmetros de campanha para algo que se lê sem decorar sigla. */
const FONTES: Record<string, string> = {
  ig: "Instagram",
  instagram: "Instagram",
  fb: "Facebook",
  facebook: "Facebook",
  google: "Google",
  whatsapp: "WhatsApp",
  email: "e-mail",
};

function descreveOrigem(url: URL, referrer: string) {
  const p = (n: string) => (url.searchParams.get(n) || "").trim().slice(0, 120);

  const fonte = p("utm_source");
  const meio = p("utm_medium");
  const pago = Boolean(p("fbclid") || p("gclid") || /cpc|paid|ads?/i.test(meio));

  if (fonte) {
    const nome = FONTES[fonte.toLowerCase()] ?? fonte;
    return pago ? `anúncio no ${nome}` : `link no ${nome}${meio ? ` (${meio})` : ""}`;
  }
  if (p("fbclid")) return "anúncio no Instagram ou Facebook";
  if (p("gclid")) return "anúncio no Google";

  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      if (host && host !== window.location.hostname) {
        if (/instagram/.test(host)) return "Instagram";
        if (/facebook|fb\.com/.test(host)) return "Facebook";
        if (/google|bing|duckduckgo/.test(host)) return "busca no Google";
        if (/whatsapp/.test(host)) return "link no WhatsApp";
        return host;
      }
    } catch {
      // referrer estranho: ignora e cai no padrão
    }
  }
  return "digitou o endereço ou veio de um link salvo";
}

function descreveCampanha(url: URL) {
  const p = (n: string) => (url.searchParams.get(n) || "").trim().slice(0, 120);
  const partes = [
    p("utm_campaign") && `campanha ${p("utm_campaign")}`,
    p("utm_content") && `anúncio ${p("utm_content")}`,
    p("utm_term") && `termo ${p("utm_term")}`,
  ].filter(Boolean);
  return partes.length ? partes.join(", ") : undefined;
}

/**
 * Lê de onde a pessoa veio. Guarda o primeiro resultado: se ela chegou por um
 * anúncio e depois navegou pelo site, o que interessa é o anúncio, não a última
 * página.
 */
function lerEntrada(): Entrada {
  const url = new URL(window.location.href);
  const atual: Entrada = {
    origem: descreveOrigem(url, document.referrer || ""),
    campanha: descreveCampanha(url),
    chegou_em: url.pathname,
  };

  try {
    const salvo = window.localStorage.getItem(CHAVE_ENTRADA);
    if (salvo) return JSON.parse(salvo) as Entrada;
    window.localStorage.setItem(CHAVE_ENTRADA, JSON.stringify(atual));
  } catch {
    // Sem armazenamento: usa o que deu para ler agora.
  }
  return atual;
}

/** O que cada interação significa, em uma frase, para virar "gancho". */
const GANCHOS: Record<string, string> = {
  simulador: "fez a conta no simulador de perdas",
  dores: "marcou as dores do negócio dele",
  laboratorio: "montou um atendente do jeito dele",
  perguntas_lab: "testou perguntas no atendente de demonstração",
  vitrine: "montou um carrinho na vitrine de demonstração",
  etapa_fluxo: "foi ler uma etapa do fluxo",
  formulario: "preencheu o formulário de contato",
  ramo: "escolheu um ramo nas demonstrações",
  agente: "abriu o assistente para tirar dúvida",
};

// Escolher um ramo é quase um reflexo, então só conta como gancho se for a
// única coisa que a pessoa fez.
const FRACOS = new Set(["ramo"]);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<Activity[]>([]);
  const id = useRef<string>("");
  const entradaRef = useRef<Entrada | null>(null);

  // Em SSR não existe window. Tudo isso é lido na primeira passagem no navegador.
  const noNavegador = typeof window !== "undefined";
  if (noNavegador && !id.current) id.current = lerSessionId();
  if (noNavegador && !entradaRef.current) entradaRef.current = lerEntrada();

  const track = useCallback((key: string, text: string) => {
    setActivity((atual) => {
      const at = new Date().toISOString();
      const i = atual.findIndex((a) => a.key === key);
      if (i === -1) return [...atual, { key, text, at }];
      if (atual[i].text === text) return atual;
      const copia = [...atual];
      copia[i] = { key, text, at };
      return copia;
    });
  }, []);

  const gancho = useMemo(() => {
    const forte = activity.find((a) => !FRACOS.has(a.key));
    const escolhida = forte ?? activity[0];
    return escolhida ? GANCHOS[escolhida.key] ?? escolhida.key : "";
  }, [activity]);

  // Quem clica num botão de WhatsApp sai do site sem falar com o agente, e era
  // justamente essa pessoa que não ficava registrada. Um ouvinte só, em
  // qualquer link do wa.me, resolve para todos os botões de uma vez — inclusive
  // os que vierem depois.
  const ultimo = useRef({ activity, gancho, entrada: entradaRef.current, sessionId: id.current });
  ultimo.current = { activity, gancho, entrada: entradaRef.current, sessionId: id.current };

  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      const alvo = e.target as HTMLElement | null;
      const link = alvo?.closest?.("a");
      const href = link?.getAttribute("href") ?? "";
      if (!href.includes("wa.me/")) return;

      const atual = ultimo.current;
      if (!atual.sessionId) return;

      const corpo = JSON.stringify({
        sessao: atual.sessionId,
        pagina: window.location.pathname,
        atividade: activityLines(atual.activity),
        origem: atual.entrada?.origem,
        campanha: atual.entrada?.campanha,
        chegou_em: atual.entrada?.chegou_em,
        gancho: atual.gancho,
        // A mensagem que ele está mandando: é o que vai chegar no seu WhatsApp,
        // e serve para você achar essa pessoa no painel.
        mensagem: (() => {
          try {
            return decodeURIComponent(href.split("text=")[1] ?? "").slice(0, 900);
          } catch {
            return "";
          }
        })(),
      });

      // sendBeacon entrega mesmo com a aba saindo. Se não existir, tenta um
      // fetch solto: falhar aqui não pode travar o clique da pessoa.
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/interesse", new Blob([corpo], { type: "application/json" }));
        } else {
          void fetch("/api/interesse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: corpo,
            keepalive: true,
          });
        }
      } catch {
        // registro é bônus: nunca atrapalha a ida para o WhatsApp
      }
    }

    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, []);

  const value = useMemo(
    () => ({
      sessionId: id.current,
      activity,
      entrada: entradaRef.current,
      gancho,
      track,
    }),
    [activity, gancho, track],
  );

  return <ActivityCtx.Provider value={value}>{children}</ActivityCtx.Provider>;
}

export function useActivity() {
  return useContext(ActivityCtx);
}

/** As interações em texto corrido, do jeito que o agente e o registro recebem. */
export function activityLines(activity: Activity[]) {
  return activity.map((a) => a.text);
}
