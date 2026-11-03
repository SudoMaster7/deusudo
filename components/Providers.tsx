"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ActivityProvider } from "./Activity";
import { NicheProvider } from "./NicheContext";
import { Agent } from "./Agent";

// Envolve todas as páginas: o ramo escolhido, o registro das interações e o
// agente suspenso no canto. Fica no layout para o agente existir em qualquer
// página, inclusive nos cases e na política de privacidade.
export function Providers({ children }: { children: ReactNode }) {
  // No painel de administração o agente não faz sentido: ali é você olhando
  // os registros, não um visitante tirando dúvidas.
  const noPainel = usePathname()?.startsWith("/admin") ?? false;

  return (
    <ActivityProvider>
      <NicheProvider>
        {children}
        {!noPainel && <Agent />}
      </NicheProvider>
    </ActivityProvider>
  );
}
