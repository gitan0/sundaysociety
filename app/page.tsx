import Image from "next/image";
import { Window } from "@/components/Window";
import { MusicWindow } from "@/components/MusicWindow";
import { ChessWindow } from "@/components/ChessWindow";
import { CompanyRow } from "@/components/CompanyRow";
import { Menubar } from "@/components/Menubar";
import { DesktopIcon } from "@/components/DesktopIcon";
import { availability, bio, companies, links, projects } from "@/lib/content";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden pt-7">
      <Menubar />

      <div className="hidden lg:flex absolute top-10 left-6 z-30 flex-col gap-4">
        <DesktopIcon
          href="https://ats.fyi"
          label="ats.fyi"
          src="/assets/ats-fyi.svg"
          alt="ats.fyi"
        />
      </div>

      {/* Window grid — centered cluster */}
      <div className="relative min-h-screen flex flex-col items-center justify-center max-w-[980px] mx-auto px-4 sm:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
          {/* Left column: main + side projects */}
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
                  Tulum · US hours
                </p>
                <p className="font-mono text-[11px] tracking-[0.02em] text-ink-muted mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#28c840] shrink-0" aria-hidden />
                  {availability}
                </p>
              </div>
            </div>

            <p className="font-serif text-base text-ink mt-5 leading-relaxed">
              {bio}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
              <a href="/resume.pdf" className="hover:underline underline-offset-4">
                resume <span aria-hidden>↗</span>
              </a>
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

            <Window title="side projects">
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
