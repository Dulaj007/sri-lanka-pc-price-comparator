import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.12), transparent 60%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 28px",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 999,
            marginBottom: 36,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#FF9933" }} />
          <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#1B5E3F" }} />
          <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#8D153A" }} />
          <span style={{ fontSize: 22, color: "#d4d4d8" }}>Sri Lanka</span>
        </div>
        <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: -1.5 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 22 }}>
          Build a PC and compare live prices across 7 online stores
        </div>
      </div>
    ),
    { ...size },
  );
}
