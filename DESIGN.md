# sundaysociety.xyz — Design Direction

## Route

[PICK ONE, delete the other:]

**Route A — Resume-aesthetic extension**
Coherent with my resume. Editorial, quiet, cream paper with near-black ink. If someone reads my resume and lands on my site, it should feel like the same person made both.

**Route B — PostHog-ish playful**
Cream background, bolder accent, looser type, hand-drawn SVG accents, more personality. Less coherent with the resume but more distinctive.

---

## Foundations

- **Background:** cream, `#fbf9f4`
- **Ink:** near-black, `#111110`
- **Muted ink:** `#2a2a28` for secondary text, `#55544f` for tertiary
- **Soft rule:** `#d9d6cd` for hairline dividers
- **Accent:** [PICK ONE after seeing first pass. Candidates: a warm rust, a deep blue, a deep green. Keep it muted, not neon.]

## Type

- **Serif (body + display):** Source Serif 4 (Google Fonts)
- **Mono (labels, dates, small caps):** JetBrains Mono
- **Sans fallback:** Inter

All via Google Fonts, same as the resume.

## Layout

- One page, no routing
- Single column, max-width around 720px for content blocks
- Generous whitespace, don't cram
- Large type in the hero, comfortable reading size elsewhere
- Editorial rhythm: section label in small caps mono, then content

## Section pattern

- Small-caps mono label (e.g. "PREVIOUSLY")
- Thin rule or just whitespace below
- Content

This is the same treatment as the resume. Reuse it.

## Company card treatment

- Uniform logo height (32px target)
- Consistent container: padding, maybe a subtle background tint on hover
- Title + company + dates in a row, dates right-aligned in mono
- One-liner below in body serif
- Subtle hover: slight background lift or underline

## What to avoid

- Dark mode
- Stock illustrations (undraw.co etc)
- Gradients
- Box shadows except very subtle
- Animations beyond simple hover states
- Icons for every section
- Decorative emoji

## Reference sites

[Paste 3-5 URLs of sites you've collected. Examples:]

- https://posthog.com
- https://linear.app
- https://anthropic.com
- [add yours]

Look at: type treatment, spacing rhythm, how they handle the "previously worked at" equivalent, footer style.

## Responsive

- Mobile first, but desktop is the primary target for recruiters
- Single column everywhere, just tighter spacing on mobile
- Logos scale down, don't stack weirdly

## Performance

- Google Fonts via `next/font` for zero layout shift
- SVG logos inline or as static assets
- No heavy JS, no client components unless needed
- Target Lighthouse 95+ across the board without trying

## Out of scope for MVP

- Blog
- CMS
- Contact form (mailto link is fine)
- Analytics (can add Plausible or Vercel Analytics later)
- Dark mode
- i18n
