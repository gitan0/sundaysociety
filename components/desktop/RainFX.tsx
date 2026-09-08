"use client";

import { useEffect, useRef, useState } from "react";

// Rain codes per WMO: drizzle, rain, showers, thunderstorms.
const RAINY = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);

export function RainFX() {
  const [active, setActive] = useState(false);
  const manual = useRef<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // real Tulum weather decides; terminal `rain` overrides
  useEffect(() => {
    let alive = true;
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=20.21&longitude=-87.46&current=weather_code",
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const code = d?.current?.weather_code;
        if (alive && manual.current === null && typeof code === "number") {
          setActive(RAINY.has(code));
        }
      })
      .catch(() => {});
    const onToggle = () => {
      manual.current = manual.current === null ? !active : !manual.current;
      setActive(manual.current);
    };
    window.addEventListener("ss:rain", onToggle);
    return () => {
      alive = false;
      window.removeEventListener("ss:rain", onToggle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const N = Math.min(110, Math.floor(w / 12));
    const drops = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      l: 8 + Math.random() * 14,
      v: 7 + Math.random() * 9,
    }));
    let raf = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of drops) {
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.l);
        d.y += d.v;
        d.x -= 0.6;
        if (d.y > h) {
          d.y = -d.l;
          d.x = Math.random() * (w + 40);
        }
      }
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="rain-fx" aria-hidden />;
}
