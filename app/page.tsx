import Image from "next/image";
import { Window } from "@/components/Window";
import { MusicWindow } from "@/components/MusicWindow";
import { ChessWindow } from "@/components/ChessWindow";
import { CompanyRow, type Company } from "@/components/CompanyRow";
import { Menubar } from "@/components/Menubar";

const companies: Company[] = [
  {
    name: "Pavlok",
    title: "Head of Customer Support",
    dates: "Jul 2016 — Sep 2023",
    logo: "/logos/pavlok.png",
    oneLiner:
      "Built support from solo IC to a team of 6 running 24/7 at 95%+ CSAT.",
  },
  {
    name: "Slingshot",
    title: "Community Manager",
    dates: "Mar 2023 — May 2025",
    logo: "/logos/slingshot.jpeg",
    oneLiner:
      "Tier 3 escalation and community ops for a multi-chain trading app.",
    note: "Acquired by Magic Eden",
  },
  {
    name: "Magic Eden",
    title: "BD Manager",
    dates: "May 2025 — Nov 2025",
    logo: "/logos/magic-eden.png",
    oneLiner:
      "Owned escalations and user migration during the Slingshot acquisition.",
  },
  {
    name: "Casa Selva",
    title: "Co-Founder",
    dates: "Jul 2017 — Mar 2022",
    logo: "/logos/casa-selva.png",
    oneLiner:
      "Co-founded a D2C skincare brand in Tulum. Featured in Vogue and Harper's Bazaar.",
  },
];

const projects: {
  name: string;
  meta: string;
  body: React.ReactNode;
}[] = [
  {
    name: "Pixietiers",
    meta: "Onchain data · live",
    body: (
      <>
        Onchain stats and tier lists, powered by Dune.{" "}
        <a
          href="https://pixietiers.com"
          target="_blank"
          rel="noreferrer"
          className="underline-offset-4 hover:underline text-accent"
        >
          pixietiers.com
        </a>
        .
      </>
    ),
  },
  {
    name: "Touchline",
    meta: "Chrome extension · in progress",
    body: "Overlays FPL analytics on the official Fantasy Premier League site. Built to replace the four tabs I opened every gameweek.",
  },
  {
    name: "Untitled",
    meta: "RTS game · early",
    body: "An RTS where the players are LLMs writing YAML scripts. 24/7 battles, no humans.",
  },
];

const links = [
  { label: "linkedin", href: "https://linkedin.com/in/lukewoodhatch" },
  { label: "email", href: "mailto:luke@sundaysociety.xyz" },
];

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden pt-7">
      <Menubar />

      {/* Window grid — centered cluster */}
      <div className="relative min-h-screen flex flex-col items-center justify-center max-w-[980px] mx-auto px-4 sm:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
          {/* Left column: main + currently */}
          <div className="w-full lg:w-[640px] space-y-6">
          <Window title="sundaysociety.xyz">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-rule shrink-0 ring-1 ring-black/10">
                <Image
                  src="/assets/pfp-pixel-32.png"
                  alt="Luke Woodhatch"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="font-serif text-xl leading-tight">
                  Luke Woodhatch
                </h1>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mt-1">
                  @sundaysociety · Tulum / Online
                </p>
              </div>
            </div>

            <p className="font-serif text-base text-ink mt-5 leading-relaxed">
              Support and ops at startups for eight years. Crypto, hardware,
              a skincare brand along the way. Always building something with
              AI on the side.
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
              <a href="mailto:luke@sundaysociety.xyz" className="hover:underline underline-offset-4">
                email <span aria-hidden>↗</span>
              </a>
              <a href="https://linkedin.com/in/lukewoodhatch" className="hover:underline underline-offset-4">
                linkedin <span aria-hidden>↗</span>
              </a>
            </div>

            <hr className="border-rule my-5" />

            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mb-3">
              previously
            </div>
            <div className="-mx-2">
              {companies.map((c) => (
                <CompanyRow key={c.name} c={c} />
              ))}
            </div>

          </Window>

            <Window title="currently">
              <div className="divide-y divide-rule">
                {projects.map((p) => (
                  <div key={p.name} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="font-serif text-base">{p.name}</h3>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mt-1">
                      {p.meta}
                    </p>
                    <p className="font-serif text-sm text-ink-muted mt-3 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                ))}
              </div>
            </Window>
          </div>

          {/* Right column: spotify + links */}
          <div className="w-full lg:w-[300px] space-y-6">
            <Window title="spotify">
              <MusicWindow />
            </Window>

            <Window title="links">
              <ul className="space-y-2 font-mono text-sm">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="hover:underline underline-offset-4"
                    >
                      {l.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Window>

            <Window title="chess">
              <ChessWindow />
            </Window>
          </div>
        </div>

        <footer className="mt-16 text-center font-mono text-[11px] text-ink-tertiary mix-blend-difference text-white/80">
          luke@sundaysociety.xyz · Tulum, Mexico
        </footer>
      </div>
    </main>
  );
}
