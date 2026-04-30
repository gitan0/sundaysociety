const links = [
  { label: "x", href: "https://x.com/" },
  { label: "linkedin", href: "https://linkedin.com/in/lukewoodhatch" },
  { label: "github", href: "https://github.com/" },
  { label: "email", href: "mailto:luke@sundaysociety.xyz" },
];

export function LinksRail() {
  return (
    <aside>
      <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink-tertiary mb-3">
        links
      </div>
      <ul className="space-y-2 font-mono text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="underline-offset-4 hover:underline">
              {l.label} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
