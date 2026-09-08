"use client";

import { useWindows, type WinId } from "./WindowManager";
import { DockIcon } from "./DockIcons";

type DockApp = {
  id?: WinId;
  label: string;
  icon: string;
  href?: string;
};

const APPS: DockApp[] = [
  { id: "main", label: "~/main", icon: "home" },
  { id: "projects", label: "~/side-projects", icon: "folder" },
  { id: "terminal", label: "~/terminal", icon: "prompt" },
  { id: "spotify", label: "~/music", icon: "music" },
  { id: "chess", label: "~/chess", icon: "rook" },
  { id: "links", label: "~/links", icon: "link" },
  { label: "mailto:luke", icon: "mail", href: "mailto:luke@sundaysociety.xyz" },
  { label: "resume.pdf", icon: "doc", href: "/resume.pdf" },
];

export function Dock() {
  const { wins, openWin } = useWindows();

  return (
    <nav
      aria-label="Dock"
      className="fixed bottom-2 sm:bottom-3 inset-x-0 z-40 flex justify-center pointer-events-none"
    >
      <div className="dock pointer-events-auto flex items-end gap-1 sm:gap-1.5 px-2.5 sm:px-3 pb-1.5 pt-2 rounded-xl border backdrop-blur-md shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]">
        {APPS.map((app) => {
          const open = app.id ? wins[app.id].open : false;
          const inner = (
            <>
              <span className="dock-tile grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-white/10 bg-white/[0.04] text-[#9fe8b0] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <DockIcon name={app.icon} />
              </span>
              <span
                className="dock-dot mt-1 block h-[2px] w-4 rounded-full"
                style={{ opacity: open ? 0.95 : 0, background: "var(--term-green)" }}
              />
              <span className="dock-label term-panel pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 font-mono text-[10px] opacity-0 transition-opacity">
                {app.id && !open ? `open ${app.label}` : app.label}
              </span>
            </>
          );
          return (
            <div key={app.label} className="dock-item relative flex flex-col items-center">
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
