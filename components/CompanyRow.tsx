import Image from "next/image";

export type Company = {
  name: string;
  title: string;
  dates: string;
  logo?: string;
  oneLiner: string;
  note?: string;
  slug?: string;
};

export function CompanyRow({ c, onOpen }: { c: Company; onOpen?: () => void }) {
  const body = (
    <>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        {c.logo ? (
          <span className="relative w-6 h-6 inline-block shrink-0 self-center">
            <Image src={c.logo} alt="" fill sizes="24px" className="object-contain" />
          </span>
        ) : (
          <span className="w-6 h-6 inline-block bg-rule rounded-sm shrink-0 self-center" />
        )}
        <h3 className="font-serif text-lg leading-tight">
          {c.name}
          <span className="text-ink-tertiary font-normal"> · {c.title}</span>
        </h3>
        <span className="w-full ml-9 sm:w-auto sm:ml-auto font-mono text-xs text-ink-tertiary whitespace-nowrap flex items-center gap-2">
          {c.dates}
          {onOpen && (
            <span
              aria-hidden
              className="text-ink-tertiary/70 group-hover:text-accent transition-colors"
            >
              ↗
            </span>
          )}
        </span>
      </div>
      <p className="font-serif text-base text-ink-muted mt-2 ml-9">{c.oneLiner}</p>
      {c.note && (
        <p className="font-mono text-xs text-ink-tertiary mt-1 ml-9">{c.note}</p>
      )}
    </>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${c.name} case study`}
        className="group block w-full text-left py-4 border-b border-rule last:border-b-0 hover:bg-[rgba(0,0,0,0.03)] -mx-3 px-3 transition-colors"
      >
        {body}
      </button>
    );
  }

  return (
    <div className="py-4 border-b border-rule last:border-b-0 -mx-3 px-3">
      {body}
    </div>
  );
}
