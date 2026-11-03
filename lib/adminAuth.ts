// Acesso ao painel /admin.
//
// Uma senha só, guardada em ADMIN_PASSWORD. O cookie não carrega a senha:
// guarda uma assinatura dela, então quem tem o cookie não descobre a senha, e
// trocar a senha derruba as sessões abertas.
//
// É proteção para um painel de uma pessoa. Se um dia mais gente precisar
// acessar, troque por contas de verdade.

import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "sudo_admin";
export const VALIDADE_S = 60 * 60 * 24 * 7; // 7 dias

const senha = () => process.env.ADMIN_PASSWORD || "";

export const senhaConfigurada = () => senha().length >= 8;

/** Compara sem vazar o tamanho da parte correta pelo tempo de resposta. */
function igual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Assinatura que vai no cookie. Derivada da senha, nunca a senha em si. */
function assinatura() {
  return createHmac("sha256", senha()).update("sudo-admin-v1").digest("hex");
}

export function senhaCorreta(tentativa: string) {
  if (!senhaConfigurada()) return false;
  return igual(tentativa, senha());
}

export function cookieValido(valor: string | undefined) {
  if (!valor || !senhaConfigurada()) return false;
  return igual(valor, assinatura());
}

export function valorDoCookie() {
  return assinatura();
}
