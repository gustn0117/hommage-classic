import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "HOMMAGE CLASSIC";
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
          background: "linear-gradient(145deg, #1a2e24 0%, #1f3a2d 40%, #1a2e24 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "35%",
            width: "30%",
            height: "40%",
            background: "radial-gradient(ellipse, rgba(201, 169, 110, 0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            width: "60%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.4), transparent)",
          }}
        />
        <div
          style={{
            fontSize: "96px",
            fontWeight: 100,
            color: "#f0ebe3",
            letterSpacing: "24px",
            lineHeight: 1,
          }}
        >
          HOMMAGE
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 100,
            color: "#f0ebe3",
            letterSpacing: "18px",
            marginTop: "16px",
          }}
        >
          CLASSIC
        </div>
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(201, 169, 110, 0.6), transparent)",
            marginTop: "32px",
          }}
        />
        <div
          style={{
            fontSize: "16px",
            fontWeight: 300,
            color: "#c9a96e",
            letterSpacing: "8px",
            marginTop: "24px",
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          Crafted with Sincere Hands
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            width: "60%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.4), transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
