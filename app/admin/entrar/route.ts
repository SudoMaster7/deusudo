// Entrar e sair do painel.

import { NextResponse } from "next/server";
import { COOKIE, VALIDADE_S, senhaCorreta, valorDoCookie } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Espera um instante a cada tentativa, para não dar para testar senha em massa.
const atraso = () => new Promise((r) => setTimeout(r, 700));

export async function POST(req: Request) {
  const form = await req.formData();
  const senha = String(form.get("senha") ?? "");
  const base = new URL(req.url);

  await atraso();

  if (!senhaCorreta(senha)) {
    return NextResponse.redirect(new URL("/admin?erro=1", base), { status: 303 });
  }

  const resposta = NextResponse.redirect(new URL("/admin", base), { status: 303 });
  resposta.cookies.set(COOKIE, valorDoCookie(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: VALIDADE_S,
  });
  return resposta;
}
