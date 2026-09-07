"use client";

import { useEffect, useState } from "react";
import { useWindows } from "./WindowManager";

type Rect = { x0: number; y0: number; x1: number; y1: number };
type Ctx = { x: number; y: number };

const APPEARANCES = [
  { label: "auto (tulum sky)", hour: null as number | null },
  { label: "day", hour: 12 },
  { label: "dusk", hour: 18.4 },
  { label: "night", hour: 22 },
];

function onDesktopItself(e: Event) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  return !t.closest("[data-win], .menubar, .dock, a, button, input, [role='dialog'], [role='menu']");
}

export function DesktopSurface() {
  const { openWin } = useWindows();
  const [sel, setSel] = useState<Rect | null>(null);
  const [ctx, setCtx] = useState<Ctx | null>(null);

  useEffect(() => {
    let dragging = false;

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType !== "mouse") return;
      if (!onDesktopItself(e)) return;
      dragging = true;
      setCtx(null);
      setSel({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      setSel((r) => (r ? { ...r, x1: e.clientX, y1: e.clientY } : r));
    };
    const up = () => {
      dragging = false;
      setSel(null);
    };
    const context = (e: MouseEvent) => {
      if (!onDesktopItself(e)) return;
      e.preventDefault();
      setSel(null);
      setCtx({
        x: Math.min(e.clientX, window.innerWidth - 230),
        y: Math.min(e.clientY, window.innerHeight - 260),
      });
    };
    const dismiss = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(".ctx-menu")) return;
      setCtx(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCtx(null);
    };

    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("contextmenu", context);
    window.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("contextmenu", context);
      window.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("keydown", esc);
    };
  }, []);

  const items: { label: string; run: () => void }[] = [
    ...APPEARANCES.map((a) => ({
      label: `appearance: ${a.label}`,
      run: () =>
        window.dispatchEvent(new CustomEvent("ss:time", { detail: { hour: a.hour } })),
    })),
    { label: "open terminal", run: () => openWin("terminal") },
    { label: "search (⌘k)", run: () => window.dispatchEvent(new Event("ss:spotlight")) },
    {
      label: "email luke",
      run: () => (window.location.href = "mailto:luke@sundaysociety.xyz"),
    },
  ];

  return (
    <>
      {sel && (
        <div
          className="marquee"
          style={{
            left: Math.min(sel.x0, sel.x1),
            top: Math.min(sel.y0, sel.y1),
            width: Math.abs(sel.x1 - sel.x0),
            height: Math.abs(sel.y1 - sel.y0),
          }}
          aria-hidden
        />
      )}
      {ctx && (
        <div
          role="menu"
          className="ctx-menu glass fixed z-[65] min-w-[210px] rounded-lg py-1.5 font-mono text-[11px] text-ink"
          style={{ left: ctx.x, top: ctx.y }}
        >
          {items.map((it, i) => (
            <span key={it.label}>
              {(i === 4 || i === 5) && i === 4 && <hr className="border-rule my-1.5 mx-2" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  it.run();
                  setCtx(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-ink hover:text-cream transition-colors"
              >
                {it.label}
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
