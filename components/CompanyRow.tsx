import Image from "next/image";

export type Company = {
  name: string;
  title: string;
  dates: string;
  logo?: string;
  oneLiner: string;
  note?: string;
};

export function CompanyRow({ c }: { c: Company }) {
  return (
    <div className="py-4 border-b border-rule last:border-b-0 hover:bg-[rgba(0,0,0,0.015)] -mx-3 px-3 transition-colors">
      <div className="flex items-baseline gap-3">
        {c.logo ? (
          <span className="relative w-6 h-6 inline-block shrink-0 self-center">
            <Image src={c.logo} alt="" fill className="object-contain" />
          </span>
        ) : (
          <span className="w-6 h-6 inline-block bg-rule rounded-sm shrink-0 self-center" />
        )}
        <h3 className="font-serif text-lg leading-tight">
          {c.name}
          <span className="text-ink-tertiary font-normal"> · {c.title}</span>
        </h3>
        <span className="ml-auto font-mono text-xs text-ink-tertiary whitespace-nowrap">
          {c.dates}
        </span>
      </div>
      <p className="font-serif text-base text-ink-muted mt-2 ml-9">{c.oneLiner}</p>
      {c.note && (
        <p className="font-mono text-xs text-ink-tertiary mt-1 ml-9">{c.note}</p>
      )}
    </div>
  );
}
