"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Menubar } from "@/components/Menubar";
import { DesktopIcon } from "@/components/DesktopIcon";
import { MusicWindow } from "@/components/MusicWindow";
import { ChessWindow } from "@/components/ChessWindow";
import { CompanyRow } from "@/components/CompanyRow";
import { WindowProvider, useWindows, type WinId } from "./WindowManager";
import { ManagedWindow } from "./ManagedWindow";
import { Dock } from "./Dock";
import { Spotlight } from "./Spotlight";
import { TerminalContent } from "./TerminalWindow";
import { CaseStudyContent } from "./CaseStudyContent";
import {
  availability,
  bio,
  caseStudies,
  companies,
  headline,
  links,
  projects,
} from "@/lib/content";

const STUDY_IDS = caseStudies.map((c) => c.slug) as WinId[];

function UrlSync() {
  const { wins, zOrder } = useWindows();
  useEffect(() => {
    const topStudy = [...zOrder]
      .reverse()
      .find((id) => STUDY_IDS.includes(id) && wins[id].open && !wins[id].minimized);
    const path = topStudy ? `/${topStudy}` : "/";
    if (window.location.pathname !== path) {
      window.history.replaceState(null, "", path);
    }
  }, [wins, zOrder]);
  return null;
}

function DesktopInner() {
  const { openWin } = useWindows();

  return (
    <main className="theme-fade relative min-h-screen w-full overflow-x-hidden pt-7">
      <Menubar />
      <UrlSync />

      <div className="hidden lg:flex absolute top-10 left-6 z-10 flex-col gap-4">
        <DesktopIcon
          href="https://ats.fyi"
          label="ats.fyi"
          src="/assets/ats-fyi.svg"
          alt="ats.fyi"
        />
      </div>

      {/* Window cluster */}
      <div className="relative min-h-screen flex flex-col items-center justify-center max-w-[980px] mx-auto px-4 sm:px-8 py-10 lg:py-16 pb-28 lg:pb-32">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center w-full">
          {/* Left column: main + side projects */}
          <div className="w-full lg:w-[640px] space-y-6">
            <ManagedWindow id="main" title="sundaysociety.xyz">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-rule shrink-0 ring-1 ring-black/10">
                  <Image
                    src="/assets/pfp-pixel-32.png"
                    alt="Luke Woodhatch"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-serif text-2xl leading-tight">Luke Woodhatch</h1>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mt-1">
                    Tulum · US hours
                  </p>
                  <p className="font-mono text-[11px] tracking-[0.02em] text-ink-muted mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#28c840] shrink-0" aria-hidden />
                    {availability}
                  </p>
                </div>
              </div>

              <p className="font-serif text-lg text-ink mt-5 leading-snug">{headline}</p>
              <p className="font-serif text-base text-ink-muted mt-3 leading-relaxed">{bio}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm">
                <a
                  href="mailto:luke@sundaysociety.xyz"
                  className="bg-ink text-cream px-3.5 py-1.5 rounded-md hover:bg-ink-muted hover:text-cream transition-colors"
                >
                  email me <span aria-hidden>↗</span>
                </a>
                <a href="/resume.pdf" className="hover:underline underline-offset-4">
                  resume <span aria-hidden>↗</span>
                </a>
                <a
                  href="https://linkedin.com/in/lukewoodhatch"
                  className="hover:underline underline-offset-4"
                >
                  linkedin <span aria-hidden>↗</span>
                </a>
              </div>

              <hr className="border-rule my-5" />

              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mb-3">
                previously — click a role for the full story
              </div>
              <div className="-mx-2">
                {companies.map((c) => (
                  <CompanyRow
                    key={c.name}
                    c={c}
                    onOpen={c.slug ? () => openWin(c.slug as WinId) : undefined}
                  />
                ))}
              </div>
            </ManagedWindow>

            <ManagedWindow id="projects" title="side projects — building since late 2025">
              <div className="divide-y divide-rule">
                {projects.map((p) => (
                  <div key={p.name} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="font-serif text-base">
                      {p.href ? (
                        <a
                          href={p.href}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline underline-offset-4"
                        >
                          {p.name} <span aria-hidden>↗</span>
                        </a>
                      ) : (
                        p.name
                      )}
                    </h3>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mt-1">
                      {p.meta}
                    </p>
                    <p className="font-serif text-sm text-ink-muted mt-3 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                ))}
              </div>
            </ManagedWindow>
          </div>

          {/* Right column */}
          <div className="w-full lg:w-[300px] space-y-6">
            <ManagedWindow id="links" title="links">
              <ul className="space-y-2 font-mono text-sm">
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:underline underline-offset-4">
                      {l.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
                <li className="pt-2 mt-2 border-t border-rule text-[11px] text-ink-tertiary hidden lg:block">
                  press <kbd className="border border-black/15 rounded px-1">⌘K</kbd> to
                  search
                </li>
              </ul>
            </ManagedWindow>

            <ManagedWindow id="spotify" title="spotify">
              <MusicWindow />
            </ManagedWindow>

            <ManagedWindow id="chess" title="chess">
              <ChessWindow />
            </ManagedWindow>
          </div>
        </div>

        <footer className="mt-16 text-center font-mono text-[11px] mix-blend-difference text-white/80">
          luke@sundaysociety.xyz · Tulum, Mexico · hand-built, window by window
        </footer>
      </div>

      {/* Floating windows */}
      {caseStudies.map((cs, i) => (
        <ManagedWindow
          key={cs.slug}
          id={cs.slug as WinId}
          title={`${cs.slug}.md`}
          mode="floating"
          cascade={i}
        >
          <CaseStudyContent cs={cs} />
        </ManagedWindow>
      ))}

      <ManagedWindow
        id="terminal"
        title="terminal — zsh"
        mode="floating"
        variant="dark"
        bodyClassName="p-0 flex-1 flex flex-col"
        cascade={1}
      >
        <TerminalContent />
      </ManagedWindow>

      <Dock />
      <Spotlight />
    </main>
  );
}

export function Desktop({ initialOpen }: { initialOpen?: WinId }) {
  return (
    <WindowProvider initialOpen={initialOpen}>
      <DesktopInner />
    </WindowProvider>
  );
}
