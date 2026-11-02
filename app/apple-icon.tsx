import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";

// O Safari do iPhone não aceita ícone em SVG. Este PNG é o que aparece quando
// alguém salva o site na tela inicial do celular.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1B4D",
          color: "#FFFFFF",
          fontFamily: "Figtree",
          fontSize: 104,
          fontWeight: 800,
          letterSpacing: "-0.04em",
        }}
      >
        S<span style={{ color: "#2457F5" }}>.</span>
      </div>
    ),
    { ...size, fonts: ogFonts() },
  );
}
