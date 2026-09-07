"use client";

import { useEffect, useState } from "react";

function formatTime(d: Date) {
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${day} ${date} ${month} · ${h}:${m}${ampm}`;
}

export function Menubar() {
  const [now, setNow] = useState<string>("");
  const [weather, setWeather] = useState<string>("tulum");

  useEffect(() => {
    const update = () => setNow(formatTime(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // Live Tulum weather (Open-Meteo, keyless)
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
        if (alive && typeof t === "number") {
          setWeather(`tulum · ${Math.round(t)}°c`);
        }
      } catch {}
    };
    load();
    const id = setInterval(load, 30 * 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="menubar fixed top-0 inset-x-0 h-7 z-50 flex items-center px-3.5 gap-[18px] font-mono text-[11px] border-b">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/favicon.svg" alt="" width={14} height={14} className="menubar-logo" />
        <span className="font-medium opacity-95">sundaysociety</span>
      </div>

      <div className="hidden sm:flex gap-[18px] opacity-80">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Window</span>
        <span>Help</span>
      </div>

      <div className="ml-auto flex items-center gap-3.5 opacity-90">
        <button
          type="button"
          aria-label="Open search"
          onClick={() => window.dispatchEvent(new Event("ss:spotlight"))}
          className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"
        >
          <span className="text-[13px] leading-none" aria-hidden>⌕</span>
          <span className="hidden sm:inline">⌘K</span>
        </button>
        <span className="hidden sm:inline" suppressHydrationWarning>{weather}</span>
        <span suppressHydrationWarning>{now}</span>
      </div>
    </div>
  );
}
