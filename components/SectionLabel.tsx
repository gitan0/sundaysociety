export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-tertiary">
        {children}
      </div>
      <hr className="border-rule mt-2 mb-6" />
    </div>
  );
}
