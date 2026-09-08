"use client";

import { useEffect, useRef, useState } from "react";
import { phaseOf, solarNow } from "./Wallpaper";

const IDLE_MS = 120_000;

export function LockScreen() {
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState(new Date());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockedAt = useRef(0);

  useEffect(() => {
    const arm = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        lockedAt.current = Date.now();
        setLocked(true);
      }, IDLE_MS);
    };
    const activity = () => {
      // grace period so the wake gesture itself doesn't instantly re-lock-unlock
      if (lockedAt.current && Date.now() - lockedAt.current < 400) return;
      if (lockedAt.current) {
        lockedAt.current = 0;
        setLocked(false);
      }
      arm();
    };
    const onLock = () => {
      lockedAt.current = Date.now();
      setLocked(true);
    };
    arm();
    window.addEventListener("pointermove", activity, { passive: true });
    window.addEventListener("pointerdown", activity, { passive: true });
    window.addEventListener("keydown", activity);
    window.addEventListener("ss:lock", onLock);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("pointermove", activity);
      window.removeEventListener("pointerdown", activity);
      window.removeEventListener("keydown", activity);
      window.removeEventListener("ss:lock", onLock);
    };
  }, []);

  useEffect(() => {
    if (!locked) return;
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [locked]);

  if (!locked) return null;

  const { elev, solarTime } = solarNow(null);
  let h = now.getHours();
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  const mm = now.getMinutes().toString().padStart(2, "0");
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

  return (
    <div className="lock-screen" role="presentation" aria-label="Lock screen — click to wake">
      <div className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-70">
        sundaysociety os
      </div>
      <div className="lock-clock">
        {h}:{mm}
        <span className="font-mono text-[0.22em] align-top opacity-70"> {ampm}</span>
      </div>
      <div className="font-mono text-[12px] opacity-80">
        {days[now.getDay()]} {now.getDate()} {months[now.getMonth()]} · sun {elev.toFixed(0)}° ·{" "}
        {phaseOf(elev, solarTime)}
      </div>
      <div className="font-mono text-[11px] opacity-50 mt-6">click anywhere to wake</div>
    </div>
  );
}
