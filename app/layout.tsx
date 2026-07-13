import type { Metadata } from "next";
import Image from "next/image";
import { Source_Serif_4, JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
  "Support & community ops, crypto-native — 8+ years building 24/7 support orgs for hardware and crypto startups. Tier 3 escalations, incident response, AI-augmented workflows. Open to remote roles.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sundaysociety.xyz"),
  title: "Luke Woodhatch — Support & Community Ops · Crypto-native",
  description: siteDescription,
  openGraph: {
    title: "Luke Woodhatch — Support & Community Ops · Crypto-native",
    description: siteDescription,
    url: "https://sundaysociety.xyz",
    siteName: "sundaysociety",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luke Woodhatch — Support & Community Ops · Crypto-native",
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
        {/* Wallpaper — lifted from page.tsx so 404 also gets it */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/ssbg.webp"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
