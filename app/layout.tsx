import type { Metadata } from "next";
import Image from "next/image";
import { Source_Serif_4, JetBrains_Mono, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Luke Woodhatch — sundaysociety",
  description: "Support and ops for AI and crypto startups.",
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
            src="/wallpaper.webp"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
