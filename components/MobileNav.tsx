"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import { Icon } from "./Icons";

// No celular a navegação do topo não cabe. Este botão abre a lista de seções.
export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Fecha com Esc e evita a página rolar atrás do menu aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="burger"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>

      <div id="menu-mobile" className="drawer" hidden={!open}>
        <nav aria-label="Seções do site">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/privacidade" onClick={() => setOpen(false)}>
            Privacidade
          </Link>
        </nav>
      </div>
    </>
  );
}
