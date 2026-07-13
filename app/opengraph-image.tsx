import { ImageResponse } from "next/og";

export const alt = "Luke Woodhatch — Support & CX Lead · AI + Crypto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Cream macOS window on a dark backdrop — mirrors the site's desktop aesthetic.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #1a1a1c 0%, #2e2a24 100%)",
        }}
      >
        <div
          style={{
            width: 980,
            display: "flex",
            flexDirection: "column",
            borderRadius: 16,
            overflow: "hidden",
            background: "#fbf9f4",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              background: "#f1ede4",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, background: "#ff5f57" }} />
              <div style={{ width: 18, height: 18, borderRadius: 9, background: "#febc2e" }} />
              <div style={{ width: 18, height: 18, borderRadius: 9, background: "#28c840" }} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                fontSize: 22,
                color: "#7a6f5c",
              }}
            >
              sundaysociety.xyz
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "48px 56px 56px" }}>
            <div style={{ fontSize: 64, color: "#111110", fontWeight: 700 }}>
              Luke Woodhatch
            </div>
            <div style={{ fontSize: 32, color: "#2a2520", marginTop: 16 }}>
              Support &amp; CX Lead · AI + Crypto
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 36, fontSize: 24, color: "#7a6f5c" }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: "#28c840",
                  marginRight: 14,
                }}
              />
              open to remote roles · tulum · us hours
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
