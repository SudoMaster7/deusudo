import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const resposta = NextResponse.redirect(new URL("/admin", new URL(req.url)), { status: 303 });
  resposta.cookies.delete({ name: COOKIE, path: "/admin" });
  return resposta;
}
