"use client";

import { useRef, useState } from "react";
import { useWindows, type WinId } from "./WindowManager";

type DockApp = {
  id?: WinId;
  label: string;
  glyph: string;
  href?: string;
  dark?: boolean;
};

const APPS: DockApp[] = [
  { id: "main", label: "sundaysociety", glyph: "ss" },
  { id: "projects", label: "side projects", glyph: "⌂" },
  { id: "terminal", label: "terminal", glyph: ">_", dark: true },
  { id: "spotify", label: "spotify", glyph: "♫" },
  { id: "chess", label: "chess", glyph: "♞" },
  { id: "links", label: "links", glyph: "↗" },
  { label: "email", glyph: "✉", href: "mailto:luke@sundaysociety.xyz" },
  { label: "resume", glyph: "cv", href: "/resume.pdf" },
];

export function Dock() {
  const { wins, openWin } = useWindows();
  const dockRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scaleFor = (i: number) => {
    if (mouseX === null) return 1;
    const el = itemRefs.current[i];
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(mouseX - center);
    const range = 96;
    if (dist > range) return 1;
    return 1 + 0.45 * Math.cos((dist / range) * (Math.PI / 2));
  };

  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-2 sm:bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none"
    >
      <div
        ref={dockRef}
        onMouseMove={(e) => setMouseX(e.clientX)}
        onMouseLeave={() => setMouseX(null)}
        className="dock pointer-events-auto flex items-end gap-1.5 sm:gap-2 px-2.5 sm:px-3 pb-1.5 pt-2 rounded-2xl border backdrop-blur-md shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)]"
      >
        {APPS.map((app, i) => {
          const open = app.id ? wins[app.id].open : false;
          const scale = scaleFor(i);
          const inner = (
            <>
              <span
                className={`dock-tile grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border font-mono text-base sm:text-lg shadow-[0_3px_10px_rgba(0,0,0,0.18)] ${
                  app.dark
                    ? "bg-[#17181c] border-black/40 text-[#c8f5c8]"
                    : "dock-tile-glass border-black/10 text-ink-muted"
                }`}
              >
                {app.glyph}
              </span>
              <span
                className="dock-dot mt-1 block h-[3px] w-4 rounded-full bg-accent"
                style={{ opacity: open ? 0.9 : 0 }}
              />
              <span className="dock-label glass pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 font-mono text-[11px] text-ink-muted opacity-0 transition-opacity">
                {app.label}
              </span>
            </>
          );
          return (
            <div
              key={app.label}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="dock-item relative flex flex-col items-center origin-bottom"
              style={{ transform: `scale(${scale})`, transition: mouseX === null ? "transform 200ms ease" : "transform 60ms ease-out" }}
            >
              {app.href ? (
                <a
                  href={app.href}
                  target={app.href.startsWith("/") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={app.label}
                  className="flex flex-col items-center"
                >
                  {inner}
                </a>
              ) : (
                <button
                  type="button"
                  aria-label={`Open ${app.label}`}
                  onClick={() => app.id && openWin(app.id)}
                  className="flex flex-col items-center"
                >
                  {inner}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
