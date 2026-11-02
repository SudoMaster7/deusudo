"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { NICHES, NICHE_KEYS, type NicheKey } from "@/lib/niches";
import { Icon } from "./Icons";

type Ctx = { niche: NicheKey; setNiche: (k: NicheKey) => void };

const NicheCtx = createContext<Ctx>({ niche: "doces", setNiche: () => {} });

export function NicheProvider({ children }: { children: ReactNode }) {
  const [niche, setNiche] = useState<NicheKey>("doces");
  return <NicheCtx.Provider value={{ niche, setNiche }}>{children}</NicheCtx.Provider>;
}

export function useNiche() {
  return useContext(NicheCtx);
}

export function NicheChips({ label }: { label: string }) {
  const { niche, setNiche } = useNiche();
  return (
    <div className="chips" role="group" aria-label={label}>
      {NICHE_KEYS.map((k) => (
        <button
          key={k}
          type="button"
          className="chip"
          aria-pressed={niche === k}
          onClick={() => setNiche(k)}
        >
          <Icon name={k} />
          {NICHES[k].label}
        </button>
      ))}
    </div>
  );
}
