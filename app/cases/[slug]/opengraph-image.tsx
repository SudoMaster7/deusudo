import { ImageResponse } from "next/og";
import { caseSlugs, cases } from "@/lib/content";
import { ogFonts } from "@/lib/og-fonts";

// Cada case tem a própria imagem de pré-visualização, com os números do cliente.
// Assim, ao mandar o link de um case no WhatsApp, o resultado já aparece.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

export default async function CaseOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = cases[slug];
  const stats = (c?.stats ?? []).slice(0, 3);

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
          padding: "68px 80px",
          color: "#FFFFFF",
          fontFamily: "Figtree",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em" }}>
            SUDO<span style={{ color: "#5B86FF" }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              padding: "12px 22px",
              borderRadius: 999,
              background: "#2457F5",
            }}
          >
            {c?.tag ?? "Case"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            {c?.name ?? "Case da SUDO"}
          </div>
          <div style={{ fontSize: 30, color: "#CBD6F2", maxWidth: 900, lineHeight: 1.35 }}>
            {c?.who ?? "Resultado de cliente real"}
          </div>
        </div>

        {stats.length > 0 ? (
          <div style={{ display: "flex", gap: 28 }}>
            {stats.map(([value, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  flex: 1,
                  paddingTop: 24,
                  borderTop: "2px solid rgba(255,255,255,0.28)",
                }}
              >
                <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-0.02em" }}>{value}</div>
                <div style={{ fontSize: 22, color: "#AFC4FF", lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 28, fontWeight: 800, color: "#AFC4FF" }}>deusudo.com</div>
        )}
      </div>
    ),
    { ...size, fonts: ogFonts() },
  );
}
