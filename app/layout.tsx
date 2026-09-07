import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Wallpaper } from "@/components/desktop/Wallpaper";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteDescription =
  "I build and run support orgs for AI and crypto companies. 8 years, solo IC to 24/7 teams, 95%+ CSAT, Tier 3 escalations and incident response. Open to remote support / CX lead roles.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sundaysociety.xyz"),
  title: "Luke Woodhatch — Support & CX Lead · AI + Crypto",
  description: siteDescription,
  openGraph: {
    title: "Luke Woodhatch — Support & CX Lead · AI + Crypto",
    description: siteDescription,
    url: "https://sundaysociety.xyz",
    siteName: "sundaysociety",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luke Woodhatch — Support & CX Lead · AI + Crypto",
    description: siteDescription,
  },
  icons: {
    icon: [
      { url: "/assets/favicon.svg", media: "(prefers-color-scheme: light)" },
      { url: "/assets/favicon-inverted.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${jetbrainsMono.variable} ${inter.variable}`}>
      <body>
        {/* Dynamic wallpaper — GLSL scene driven by the real sun over Tulum */}
        <Wallpaper />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
