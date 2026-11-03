import type { ReactNode } from "react";

export type IconName =
  | "odonto"
  | "harmonizacao"
  | "capilar"
  | "estetica"
  | "check"
  | "arrow"
  | "play"
  | "menu"
  | "close";

const paths: Record<Exclude<IconName, "play">, ReactNode> = {
  odonto: (
    <path d="M12 4.6c-1.9 0-2.5-1.1-4.3-1.1C5.8 3.5 4.3 5.2 4.3 8c0 3 1 4.4 1.6 7 .4 2 .6 4.5 1.9 4.5 1.4 0 1.2-3.3 2.3-3.3h3.8c1.1 0 .9 3.3 2.3 3.3 1.3 0 1.5-2.5 1.9-4.5.6-2.6 1.6-4 1.6-7 0-2.8-1.5-4.5-3.4-4.5-1.8 0-2.4 1.1-4.3 1.1z" />
  ),
  harmonizacao: (
    <>
      <circle cx="11" cy="12.5" r="7.5" />
      <path d="M8.8 11h.01M13.2 11h.01" />
      <path d="M8.9 15.3c1.4 1 3.2 1 4.6 0" />
      <path d="M19.3 2.8l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  capilar: (
    <>
      <path d="M5 13.5a7 7 0 0 1 14 0V16a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z" />
      <path d="M6.9 9.6C8.2 8 9.9 7.2 12 7.2s3.8.8 5.1 2.4" />
      <path d="M9.2 7C9.8 5.3 10.8 4.4 12 4.4s2.2.9 2.8 2.6" />
    </>
  ),
  estetica: (
    <>
      <path d="M12 3.4c3 3.7 5 6.4 5 9a5 5 0 0 1-10 0c0-2.6 2-5.3 5-9z" />
      <path d="M9.6 12.6c0 1.9 1.1 3.3 2.6 3.7" />
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
