import Image from "next/image";
import { type CaseStudy } from "@/lib/content";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mb-2.5">
      {children}
    </div>
  );
}

export function CaseStudyContent({ cs }: { cs: CaseStudy }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="relative w-8 h-8 inline-block shrink-0">
          <Image src={cs.logo} alt="" fill sizes="32px" className="object-contain" />
        </span>
        <div>
          <h2 className="font-serif text-lg leading-tight">
            {cs.company}
            <span className="text-ink-tertiary font-normal"> · {cs.role}</span>
          </h2>
          <p className="font-mono text-[11px] text-ink-tertiary mt-0.5">{cs.dates}</p>
        </div>
      </div>

      <p className="font-serif text-lg mt-4 leading-snug">{cs.hook}</p>

      <hr className="border-rule my-4" />

      <SectionLabel>the situation</SectionLabel>
      <p className="font-serif text-[15px] text-ink-muted leading-relaxed">{cs.situation}</p>

      <div className="mt-5">
        <SectionLabel>what i did</SectionLabel>
        <ul className="space-y-2">
          {cs.did.map((d) => (
            <li key={d} className="font-serif text-[15px] text-ink-muted leading-relaxed flex gap-2.5">
              <span className="text-ink-tertiary font-mono text-xs mt-1.5 shrink-0" aria-hidden>
                –
              </span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <SectionLabel>the numbers</SectionLabel>
        <div className="grid grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {cs.numbers.map((n) => (
            <div key={n.label} className="bg-cream px-3.5 py-3">
              <div className="font-mono text-lg text-ink">{n.value}</div>
              <div className="font-mono text-[11px] text-ink-tertiary mt-0.5">{n.label}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="font-serif text-[15px] text-ink mt-5 leading-relaxed italic">{cs.close}</p>

      <hr className="border-rule my-4" />
      <p className="font-mono text-xs text-ink-tertiary">
        sound relevant?{" "}
        <a
          href={`mailto:luke@sundaysociety.xyz?subject=re:%20${cs.company}`}
          className="underline underline-offset-4 hover:text-accent"
        >
          email me
        </a>{" "}
        ·{" "}
        <a href="/resume.pdf" className="underline underline-offset-4 hover:text-accent">
          resume
        </a>
      </p>
    </div>
  );
}
