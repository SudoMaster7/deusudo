import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";

// Imagem que aparece quando o link do site é colado no WhatsApp, no Instagram
// ou no LinkedIn. É gerada no build, não precisa de arquivo em /public.
// Para ver depois de mudar algo: http://localhost:3000/opengraph-image

export const alt = "SUDO — atendimento com IA, anúncios e sistemas para o seu negócio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1B4D",
          padding: "72px 80px",
          color: "#FFFFFF",
          fontFamily: "Figtree",
        }}
      >
        <div style={{ display: "flex", fontSize: 56, fontWeight: 800, letterSpacing: "-0.03em" }}>
          SUDO<span style={{ color: "#5B86FF" }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 940,
            }}
          >
            Menos tarefa repetitiva. Mais lucro e controle.
          </div>
          <div style={{ fontSize: 32, color: "#CBD6F2", maxWidth: 900, lineHeight: 1.35 }}>
            Atendimento com IA no WhatsApp, anúncios e sistemas sob medida.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {["442 conversas em 92 dias", "R$ 4,13 por conversa", "Rio de Janeiro"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 23,
                  fontWeight: 600,
                  padding: "13px 22px",
                  borderRadius: 999,
                  background: "#2457F5",
                  color: "#FFFFFF",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#AFC4FF", marginLeft: 28 }}>
            deusudo.com
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: ogFonts() },
  );
}
