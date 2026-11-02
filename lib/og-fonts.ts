import fs from "node:fs";
import path from "node:path";

// A fonte das imagens de pré-visualização vem de arquivos dentro do projeto,
// em assets/fonts. Assim o build não depende de baixar nada da internet.
const dir = path.join(process.cwd(), "assets", "fonts");

function load(file: string) {
  return fs.readFileSync(path.join(dir, file));
}

export function ogFonts() {
  return [
    { name: "Figtree", data: load("figtree-600.woff"), weight: 600 as const, style: "normal" as const },
    { name: "Figtree", data: load("figtree-800.woff"), weight: 800 as const, style: "normal" as const },
  ];
}
