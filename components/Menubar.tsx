"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowsOptional, type WinId } from "@/components/desktop/WindowManager";
import { solarNow } from "@/components/desktop/Wallpaper";

function formatTime(d: Date) {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${h}:${m}${ampm}`;
}

type Item = { label: string; action: () => void; checked?: boolean } | "sep";
type Menu = { name: string; items: Item[] };

type Appearance = "auto" | "day" | "dusk" | "night";
const APPEARANCE_HOURS: Record<Appearance, number | null> = {
  auto: null,
  day: 12,
  dusk: 18.4,
  night: 22,
};

function Sep() {
  return (
    <span aria-hidden style={{ color: "var(--term-dim)" }}>
      │
    </span>
  );
}

export function Menubar() {
  const [now, setNow] = useState<string>("");
  const [weather, setWeather] = useState<string>("…°c");
  const [sun, setSun] = useState<string>("…");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [appearance, setAppearance] = useState<Appearance>("auto");
  const barRef = useRef<HTMLDivElement>(null);
  const override = useRef<number | null>(null);
  const win = useWindowsOptional();

  useEffect(() => {
    const update = () => {
      setNow(formatTime(new Date()));
      const { elev } = solarNow(override.current);
      setSun(`${elev >= 0 ? "☼" : "☾"} ${elev.toFixed(0)}°`);
    };
    const onTime = (e: Event) => {
      override.current = (e as CustomEvent<{ hour: number | null }>).detail.hour;
      update();
    };
    update();
    const id = setInterval(update, 30_000);
    window.addEventListener("ss:time", onTime);
    return () => {
      clearInterval(id);
      window.removeEventListener("ss:time", onTime);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=20.21&longitude=-87.46&current=temperature_2m",
        );
        if (!res.ok) return;
        const data = await res.json();
        const t = data?.current?.temperature_2m;
        if (alive && typeof t === "number") setWeather(`${Math.round(t)}°c`);
      } catch {}
    };
    load();
    const id = setInterval(load, 30 * 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onDown = (e: PointerEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [openMenu]);

  const setSunOverride = (a: Appearance) => {
    setAppearance(a);
    window.dispatchEvent(
      new CustomEvent("ss:time", { detail: { hour: APPEARANCE_HOURS[a] } }),
    );
  };

  const menus = useMemo<Menu[]>(() => {
    if (!win) return [];
    const { wins, openWin, closeWin, minimizeWin, moveWin } = win;
    const allIds = Object.keys(wins) as WinId[];
    const studyItems: Item[] = (["pavlok", "slingshot", "magic-eden"] as WinId[]).map(
      (id) => ({ label: `~/work/${id}.md`, action: () => openWin(id) }),
    );
    return [
      {
        name: "file",
        items: [
          { label: "open resume.pdf", action: () => window.open("/resume.pdf", "_blank") },
          {
            label: "mailto:luke",
            action: () => (window.location.href = "mailto:luke@sundaysociety.xyz"),
          },
          "sep",
          {
            label: "close all windows",
            action: () => allIds.forEach((id) => wins[id].open && closeWin(id)),
          },
        ],
      },
      {
        name: "edit",
        items: [
          {
            label: "copy email address",
            action: () => navigator.clipboard?.writeText("luke@sundaysociety.xyz"),
          },
        ],
      },
      {
        name: "view",
        items: (Object.keys(APPEARANCE_HOURS) as Appearance[]).map((a) => ({
          label: a === "auto" ? "sky: auto (tulum)" : `sky: ${a}`,
          checked: appearance === a,
          action: () => setSunOverride(a),
        })),
      },
      {
        name: "go",
        items: [
          ...studyItems,
          "sep",
          { label: "ats.fyi ↗", action: () => window.open("https://ats.fyi", "_blank") },
          {
            label: "linkedin ↗",
            action: () => window.open("https://linkedin.com/in/lukewoodhatch", "_blank"),
          },
        ],
      },
      {
        name: "window",
        items: [
          {
            label: "minimize all",
            action: () => allIds.forEach((id) => wins[id].open && minimizeWin(id)),
          },
          {
            label: "reset positions",
            action: () => allIds.forEach((id) => moveWin(id, 0, 0)),
          },
          "sep",
          ...allIds
            .filter((id) => !["pavlok", "slingshot", "magic-eden"].includes(id))
            .map((id) => ({ label: `~/${id}`, action: () => openWin(id) })),
        ],
      },
      {
        name: "help",
        items: [
          {
            label: "search  ⌘k",
            action: () => window.dispatchEvent(new Event("ss:spotlight")),
          },
          { label: "open terminal", action: () => openWin("terminal") },
          { label: "lock screen", action: () => window.dispatchEvent(new Event("ss:lock")) },
          "sep",
          {
            label: "hire luke",
            action: () =>
              (window.location.href =
                "mailto:luke@sundaysociety.xyz?subject=found%20the%20menubar"),
          },
        ],
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win, appearance]);

  return (
    <div
      ref={barRef}
      className="menubar fixed top-0 inset-x-0 h-7 z-[70] flex items-center px-3 gap-3 font-mono text-[11px] border-b"
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: "var(--term-green)" }} aria-hidden>
          ❯
        </span>
        <span className="font-medium" style={{ color: "var(--term-bright)" }}>
          sundaysociety
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-0.5">
        {menus.length > 0
          ? menus.map((m) => (
              <div key={m.name} className="relative">
                <button
                  type="button"
                  className={`px-2 py-0.5 rounded transition-colors ${
                    openMenu === m.name ? "bg-white/10" : "hover:bg-white/[0.07]"
                  }`}
                  aria-expanded={openMenu === m.name}
                  onClick={() => setOpenMenu(openMenu === m.name ? null : m.name)}
                  onMouseEnter={() => openMenu && setOpenMenu(m.name)}
                >
                  {m.name}
                </button>
                {openMenu === m.name && (
                  <div
                    role="menu"
                    className="term-panel absolute left-0 top-full mt-1.5 min-w-[220px] rounded-lg py-1.5"
                  >
                    {m.items.map((it, i) =>
                      it === "sep" ? (
                        <hr key={i} className="border-white/10 my-1.5 mx-2" />
                      ) : (
                        <button
                          key={it.label}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            it.action();
                            setOpenMenu(null);
                          }}
                          className="term-sel w-full text-left px-3 py-1.5 flex items-center gap-2 transition-colors"
                        >
                          <span className="w-3 shrink-0" style={{ color: "var(--term-green)" }}>
                            {it.checked ? "•" : ""}
                          </span>
                          {it.label}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))
          : null}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <button
          type="button"
          aria-label="Open search"
          onClick={() => window.dispatchEvent(new Event("ss:spotlight"))}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <span className="text-[13px] leading-none" aria-hidden>⌕</span>
          <span className="hidden sm:inline">⌘k</span>
        </button>
        <Sep />
        <span className="hidden sm:inline" suppressHydrationWarning>
          tulum {weather}
        </span>
        <span className="hidden sm:inline" aria-hidden>
          <Sep />
        </span>
        <span suppressHydrationWarning style={{ color: "var(--term-green)" }}>
          {sun}
        </span>
        <Sep />
        <span suppressHydrationWarning>{now}</span>
      </div>
    </div>
  );
}
