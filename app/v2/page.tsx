import Image from "next/image";
import Link from "next/link";
import { Window } from "@/components/Window";
import { CompanyRow } from "@/components/CompanyRow";
import { Menubar } from "@/components/Menubar";
import { availability, bio, companies, projects } from "@/lib/content";

// Variant C — hiring-manager-first layout. Same copy as "/", different hierarchy:
// pitch → experience → proof, with the desktop metaphor reduced to accents.
export default function PageV2() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden pt-7">
      <Menubar />

      <div className="relative max-w-[720px] mx-auto px-4 sm:px-8 py-10 lg:py-16 space-y-6">
        <Window title="readme.txt">
          <div className="flex items-start gap-5">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-rule shrink-0 ring-1 ring-black/10">
              <Image
                src="/assets/pfp-pixel-32.png"
                alt="Luke Woodhatch"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-3xl leading-tight">Luke Woodhatch</h1>
              <p className="font-serif text-lg text-ink-muted mt-1">
                Support &amp; CX lead for technical products
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mt-2">
                Tulum · US hours
              </p>
            </div>
          </div>

          <p className="font-mono text-xs text-ink-muted mt-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#28c840] shrink-0" aria-hidden />
            {availability}
          </p>

          <p className="font-serif text-base text-ink mt-4 leading-relaxed">
            {bio}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
            <a
              href="/resume.pdf"
              className="px-4 py-2 border border-ink rounded-md bg-ink text-cream! hover:bg-ink-muted transition-colors"
            >
              resume ↓
            </a>
            <a
              href="mailto:luke@sundaysociety.xyz"
              className="px-4 py-2 border border-ink/30 rounded-md hover:border-ink transition-colors"
            >
              email ↗
            </a>
            <a
              href="https://linkedin.com/in/lukewoodhatch"
              className="px-4 py-2 border border-ink/30 rounded-md hover:border-ink transition-colors"
            >
              linkedin ↗
            </a>
          </div>
        </Window>

        <Window title="experience">
          <div className="-mx-2">
            {companies.map((c) => (
              <CompanyRow key={c.name} c={c} />
            ))}
          </div>
        </Window>

        <Window title="proof of work">
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
          <p className="font-mono text-xs text-ink-tertiary mt-5">
            the fun version — live spotify + playable chess —{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-accent">
              on the desktop
            </Link>
          </p>
        </Window>

        <footer className="pt-6 text-center font-mono text-[11px] mix-blend-difference text-white/80">
          luke@sundaysociety.xyz · Tulum, Mexico
        </footer>
      </div>
    </main>
  );
}
