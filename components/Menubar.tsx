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

  useEffect(() => {
    const update = () => setNow(formatTime(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 inset-x-0 h-7 z-50 flex items-center px-3.5 gap-[18px] font-mono text-[11px] text-ink-tertiary border-b border-black/10"
      style={{
        background: "rgba(251,249,244,0.85)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/favicon.svg" alt="" width={14} height={14} />
        <span className="font-medium text-ink">sundaysociety</span>
      </div>

      <div className="hidden sm:flex gap-[18px]" style={{ color: "#3a3328" }}>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <span>Window</span>
        <span>Help</span>
      </div>

      <div className="ml-auto flex items-center gap-3.5">
        <span className="hidden sm:inline">○ ●</span>
        <span className="hidden sm:inline">tulum · 27°c</span>
        <span suppressHydrationWarning>{now}</span>
      </div>
    </div>
  );
}
