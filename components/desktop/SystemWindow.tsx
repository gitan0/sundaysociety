"use client";

import { useEffect, useRef, useState } from "react";
import { phaseOf, solarNow } from "./Wallpaper";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-ink-tertiary">{k}</span>
      <span className="text-ink tabular-nums">{v}</span>
    </div>
  );
}

export function SystemWindow() {
  const [sun, setSun] = useState("—");
  const [phase, setPhase] = useState("—");
  const [fps, setFps] = useState("—");
  const [temp, setTemp] = useState("—");
  const [up, setUp] = useState("0s");
  const [res, setRes] = useState("—");
  const t0 = useRef(Date.now());
  const override = useRef<number | null>(null);

  // sun + uptime + viewport, every second (respects the appearance override)
  useEffect(() => {
    const onTime = (e: Event) => {
      override.current = (e as CustomEvent<{ hour: number | null }>).detail.hour;
      tick();
    };
    const tick = () => {
      const { elev, solarTime } = solarNow(override.current);
      setSun(`${elev.toFixed(1)}°`);
      setPhase(phaseOf(elev, solarTime));
      const s = Math.floor((Date.now() - t0.current) / 1000);
      setUp(s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);
      setRes(`${window.innerWidth}×${window.innerHeight}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    window.addEventListener("ss:time", onTime);
    return () => {
      clearInterval(id);
      window.removeEventListener("ss:time", onTime);
    };
  }, []);

  // fps via rAF deltas
  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      frames++;
      if (t - last >= 500) {
        setFps(String(Math.round((frames * 1000) / (t - last))));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Tulum temperature
  useEffect(() => {
    let alive = true;
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=20.21&longitude=-87.46&current=temperature_2m",
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const t = d?.current?.temperature_2m;
        if (alive && typeof t === "number") setTemp(`${Math.round(t)}°c`);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="font-mono text-[11px] space-y-1.5">
      <Row k="sun elevation" v={sun} />
      <Row k="sky" v={phase} />
      <Row k="tulum temp" v={temp} />
      <Row k="render" v={`${fps} fps · webgl`} />
      <Row k="viewport" v={res} />
      <Row k="uptime" v={up} />
      <p className="pt-2 mt-1 border-t border-rule text-ink-tertiary leading-relaxed">
        the wallpaper is a live shader driven by these numbers.
      </p>
    </div>
  );
}
