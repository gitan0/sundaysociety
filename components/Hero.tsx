import Image from "next/image";

export function Hero() {
  return (
    <section className="w-full">
      <div
        className="relative w-full aspect-[3/1] overflow-hidden rounded-sm"
        style={{
          background:
            "linear-gradient(120deg, #e8d8c4 0%, #c9b59a 35%, #8a6f55 70%, #4a3a2c 100%)",
        }}
        aria-hidden
      />
      {/* Drop banner.jpg in /public to replace the gradient. */}

      <div className="flex items-end gap-4 -mt-10 px-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-cream bg-rule shrink-0">
          <Image src="/pfp.jpg" alt="Luke Woodhatch" fill className="object-cover" />
        </div>
        <div className="pb-2">
          <h1 className="font-serif text-3xl leading-tight">Luke Woodhatch</h1>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-tertiary mt-1">
            Tulum / Online
          </p>
        </div>
      </div>

      <div className="mt-6 px-4 max-w-[640px]">
        <p className="font-serif text-xl leading-snug text-ink-muted">
          Support and ops for AI and crypto startups.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
          <a href="https://linkedin.com/in/lukewoodhatch" className="underline-offset-4 hover:underline">
            linkedin <span aria-hidden>↗</span>
          </a>
          <a href="mailto:luke@sundaysociety.xyz" className="underline-offset-4 hover:underline">
            email <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
