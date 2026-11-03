// Registra a visita de quem clicou num botão de WhatsApp sem falar com o
// agente. É o caso mais comum: a pessoa lê, mexe numa seção e vai direto
// conversar. Sem isso ela chegaria no seu WhatsApp sem nenhum rastro de onde
// veio nem do que a engatou.
//
// Chamado por navigator.sendBeacon, então a resposta não importa: só o 204.

import { NextResponse } from "next/server";
import { salvarInteresse } from "@/lib/leadStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const texto = (v: unknown, max = 300) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const sessao = texto(corpo.sessao, 80);
  if (!sessao) return new NextResponse(null, { status: 204 });

  await salvarInteresse({
    sessao,
    pagina: texto(corpo.pagina),
    atividade: Array.isArray(corpo.atividade)
      ? corpo.atividade.map((a) => texto(a)).filter(Boolean).slice(0, 20)
      : [],
    // Quem clicou para conversar está, por definição, pedindo contato.
    conversa: [],
    quente: true,
    origem: texto(corpo.origem, 160),
    campanha: texto(corpo.campanha, 160),
    chegouEm: texto(corpo.chegou_em, 160),
    gancho: texto(corpo.gancho, 160),
    mensagem: texto(corpo.mensagem, 900),
  });

  return new NextResponse(null, { status: 204 });
}
