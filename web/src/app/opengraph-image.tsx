import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mileora — Astrology, Numerology, Vasthu, Jothisyam & Puja";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(800px 400px at 80% 0%, rgba(91,58,160,0.55), transparent 60%), radial-gradient(800px 400px at 0% 0%, rgba(212,160,23,0.35), transparent 60%), #0b0a14",
          color: "#f5f1e8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36, color: "#f1cb5b" }}>
          ✦ Mileora
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -1 }}>
            The cosmos has answers.
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              letterSpacing: -1,
              background: "linear-gradient(135deg, #fbeec0, #d4a017)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Mileora connects you to them.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a9a3b8" }}>
          <span>Astrology · Numerology · Vasthu · Jothisyam · Puja</span>
          <span>mileora.com</span>
        </div>
      </div>
    ),
    size
  );
}
