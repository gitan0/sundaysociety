import { ImageResponse } from "next/og";
import { caseStudies } from "@/lib/content";

export const alt = "Case study — Luke Woodhatch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  const company = cs?.company ?? "Case study";
  const hook = cs?.hook ?? "";
  const dates = cs?.dates ?? "";
  const stat = cs?.numbers[0];

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
              {`${slug}.md — sundaysociety.xyz`}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "48px 56px 56px" }}>
            <div style={{ fontSize: 28, color: "#7a6f5c" }}>
              {`${company} · ${dates}`}
            </div>
            <div style={{ fontSize: 56, color: "#111110", fontWeight: 700, marginTop: 14, lineHeight: 1.1 }}>
              {hook}
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 36, fontSize: 26, color: "#2a2520" }}>
              {stat ? `${stat.value} — ${stat.label}` : ""}
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 24, fontSize: 22, color: "#7a6f5c" }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: "#28c840",
                  marginRight: 12,
                }}
              />
              luke woodhatch · open to support / cx lead roles
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
