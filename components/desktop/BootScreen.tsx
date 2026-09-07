"use client";

import { useEffect, useState } from "react";
import { solarNow } from "./Wallpaper";

const KEY = "ss:booted";

export function BootScreen() {
  const [lines, setLines] = useState<string[] | null>(null);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  // decide on mount; also replayable via ss:boot (terminal `reboot`)
  useEffect(() => {
    const start = () => {
      const { elev } = solarNow(null);
      setLines([
        "sunday os 2.0 — tulum build",
        "compositor ........... ok",
        "silk shader .......... compiled",
        `sun position ......... ${elev.toFixed(1)}° over tulum`,
        "windows .............. 5 restored",
        "hiring daemon ........ listening",
      ]);
      setShown(0);
      setDone(false);
      setGone(false);
    };
    try {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced && !sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, "1");
        start();
      }
    } catch {}
    window.addEventListener("ss:boot", start);
    return () => window.removeEventListener("ss:boot", start);
  }, []);

  useEffect(() => {
    if (!lines || done) return;
    if (shown >= lines.length) {
      const t = setTimeout(() => setDone(true), 380);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((n) => n + 1), 150);
    return () => clearTimeout(t);
  }, [lines, shown, done]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 400);
    return () => clearTimeout(t);
  }, [done]);

  if (!lines || gone) return null;

  return (
    <div
      className="boot-screen"
      data-done={done ? "" : undefined}
      onClick={() => setDone(true)}
      onKeyDown={() => setDone(true)}
      role="presentation"
    >
      <div>
        {lines.slice(0, shown).map((l, i) => (
          <div key={i}>
            {l.includes("....") ? (
              <>
                {l.split(/(?= ok$| compiled$| listening$| restored$)/)[0]}
                <span className="ok">{l.match(/ (ok|compiled|listening|restored)$/)?.[0] ?? ""}</span>
              </>
            ) : (
              l
            )}
          </div>
        ))}
        {shown < lines.length && <span className="ok">▌</span>}
      </div>
    </div>
  );
}
