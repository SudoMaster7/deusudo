import type { ReactNode } from "react";

export type IconName =
  | "doces"
  | "roupas"
  | "mecanica"
  | "clinica"
  | "check"
  | "arrow"
  | "play"
  | "menu"
  | "close";

const paths: Record<Exclude<IconName, "play">, ReactNode> = {
  doces: (
    <>
      <path d="M4 20h16" />
      <path d="M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
      <path d="M5 16c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0" />
      <path d="M12 12V9" />
      <path d="M12 7c-1-1-1-2 0-3 1 1 1 2 0 3z" />
    </>
  ),
  roupas: <path d="M8 3 3 6l2 4 3-1v11h8V9l3 1 2-4-5-3c-.6 1.6-1.9 2.5-4 2.5S8.6 4.6 8 3z" />,
  mecanica: (
    <path d="M14.5 5.5a4 4 0 0 0-5.2 5.2l-5.8 5.8a1.8 1.8 0 0 0 2.6 2.6l5.8-5.8a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.2-.6-.6-2.2z" />
  ),
  clinica: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  check: <path d="M5 12l5 5 9-10" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};

export function Icon({ name }: { name: IconName }) {
  if (name === "play") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4l13 8-13 8z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "check" || name === "arrow" || name === "menu" || name === "close" ? 2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
