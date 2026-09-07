"use client";

import { useRef, useState, type ReactNode } from "react";
import { useWindows, type WinId } from "./WindowManager";

export function ManagedWindow({
  id,
  title,
  children,
  mode = "flow",
  cascade = 0,
  variant = "light",
  bodyClassName = "p-5",
  className = "",
}: {
  id: WinId;
  title: string;
  children: ReactNode;
  mode?: "flow" | "floating";
  cascade?: number;
  variant?: "light" | "dark";
  bodyClassName?: string;
  className?: string;
}) {
  const { wins, closeWin, minimizeWin, focusWin, moveWin, zIndexOf, focused } = useWindows();
  const ref = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const st = wins[id];
  const dark = variant === "dark";
  const [minimizing, setMinimizing] = useState(false);

  const doMinimize = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      minimizeWin(id);
      return;
    }
    setMinimizing(true);
    setTimeout(() => {
      setMinimizing(false);
      minimizeWin(id);
    }, 280);
  };

  if (!st.open || st.minimized) return null;

  const isFocused = focused === id;
  const idle = `[${id}]`;

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (window.innerWidth < 1024) return;
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: st.x, baseY: st.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !ref.current) return;
    const nx = drag.current.baseX + e.clientX - drag.current.startX;
    const ny = drag.current.baseY + e.clientY - drag.current.startY;
    ref.current.style.setProperty("--wx", `${nx}px`);
    ref.current.style.setProperty("--wy", `${ny}px`);
    if (metaRef.current) {
      metaRef.current.textContent = `x:${Math.round(nx)} y:${Math.round(ny)}`;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const nx = drag.current.baseX + e.clientX - drag.current.startX;
    const ny = drag.current.baseY + e.clientY - drag.current.startY;
    drag.current = null;
    if (metaRef.current) metaRef.current.textContent = idle;
    moveWin(id, nx, ny);
  };

  const positionClass =
    mode === "floating"
      ? "fixed z-30 inset-x-3 top-12 bottom-24 lg:inset-auto lg:top-[10vh] lg:left-1/2 lg:w-[600px] lg:max-w-[92vw] lg:bottom-auto flex flex-col"
      : "relative";

  return (
    <div
      ref={ref}
      onPointerDownCapture={() => focusWin(id)}
      className={`win-enter ${minimizing ? "win-minimizing" : ""} ${positionClass} ${className}`}
      style={
        {
          zIndex: zIndexOf(id),
          "--wx": `${st.x}px`,
          "--wy": `${st.y}px`,
          "--cascade": `${cascade * 28}px`,
        } as React.CSSProperties
      }
      data-win={mode}
      role={mode === "floating" ? "dialog" : undefined}
      aria-label={title}
    >
      <div
        className={`glass rounded-xl overflow-hidden flex flex-col max-h-full transition-opacity duration-200 ${
          isFocused ? "" : "opacity-[0.88]"
        }`}
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`relative h-8 shrink-0 flex items-center px-3 border-b select-none lg:cursor-grab lg:active:cursor-grabbing ${
            dark ? "bg-[#17171a]/90 border-black/50" : "titlebar-glass border-black/10"
          }`}
        >
          <div className="flex gap-1.5 absolute left-3 group">
            <button
              type="button"
              aria-label={`Close ${title}`}
              onClick={() => closeWin(id)}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/20 grid place-items-center text-[8px] leading-none text-black/0 group-hover:text-black/50 focus-visible:text-black/50"
            >
              ×
            </button>
            <button
              type="button"
              aria-label={`Minimize ${title}`}
              onClick={doMinimize}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/20 grid place-items-center text-[8px] leading-none text-black/0 group-hover:text-black/50 focus-visible:text-black/50"
            >
              −
            </button>
            <button
              type="button"
              aria-label={`Reset position of ${title}`}
              onClick={() => {
                moveWin(id, 0, 0);
                if (metaRef.current) metaRef.current.textContent = idle;
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-3 h-3 rounded-full bg-[#28c840] border border-black/20 grid place-items-center text-[8px] leading-none text-black/0 group-hover:text-black/50 focus-visible:text-black/50"
            >
              +
            </button>
          </div>
          <div
            className={`w-full text-center font-mono text-[10px] uppercase tracking-[0.16em] ${
              dark ? "text-white/85" : "text-ink-tertiary"
            }`}
          >
            {title}
          </div>
          <span
            ref={metaRef}
            aria-hidden
            className={`absolute right-3 font-mono text-[9px] tracking-tight hidden lg:block ${
              dark ? "text-white/40" : "text-ink-tertiary/70"
            }`}
          >
            {idle}
          </span>
          {isFocused && <div className="win-focus-line" aria-hidden />}
        </div>
        <div className={`overflow-y-auto ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  );
}
