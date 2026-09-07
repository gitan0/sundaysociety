"use client";

import { useEffect, useRef } from "react";

// Tulum, MX — the sun that drives the palette
const LAT = 20.21;
const LON = -87.46;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-warped silk. Four palette stops arrive pre-blended from JS,
// so the shader stays branch-light and the phase transitions are smooth.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_c0;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform float u_night;
uniform vec4 u_trail[8];

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.03;

  // fluid displacement from the pointer trail — a soft swirl at each sample
  vec2 disp = vec2(0.0);
  for (int i = 0; i < 8; i++) {
    vec4 tr = u_trail[i];
    vec2 d = p - tr.xy;
    float infl = exp(-dot(d, d) * 10.0) * tr.z;
    disp += vec2(-d.y, d.x) * infl * 0.9;
    disp -= d * infl * 0.35;
  }

  vec2 q = p * 1.15 + disp;
  float f1 = fbm(q + vec2(t * 0.7, -t * 0.4));
  vec2 w = vec2(
    fbm(q + f1 + vec2(1.7, 9.2) + t * 0.35),
    fbm(q + f1 + vec2(8.3, 2.8) - t * 0.25)
  );
  float f2 = fbm(q + 1.9 * w);

  vec3 col = mix(u_c0, u_c1, smoothstep(0.05, 0.62, f2));
  float band = fbm(q * 1.35 + w * 1.3 + 0.5);
  col = mix(col, u_c2, smoothstep(0.40, 0.86, band));

  // silk ridge highlight
  float ridge = pow(clamp(1.0 - abs(f2 - 0.55) * 3.4, 0.0, 1.0), 6.0);
  col += u_c3 * ridge * 0.30;

  // soft key light, upper left
  col += u_c3 * 0.09 * exp(-length(p - vec2(-0.6, 0.42)) * 1.5);

  // sparse night sparkle
  vec2 sg = frag / u_res.y * 90.0;
  vec2 sid = floor(sg);
  float sr = hash(sid);
  float star = smoothstep(0.992, 1.0, sr) * smoothstep(0.3, 0.05, length(fract(sg) - 0.5));
  float tw = 0.5 + 0.5 * sin(u_time * (0.8 + sr * 2.5) + sr * 40.0);
  col += vec3(0.85, 0.92, 1.0) * star * tw * u_night * 0.8;

  // grain + vignette
  col += hash(frag + fract(u_time) * 7.0) * 0.035 - 0.0175;
  vec2 uv = frag / u_res;
  float vg = smoothstep(1.35, 0.35, length(uv - 0.5));
  col *= mix(0.82, 1.04, vg);

  gl_FragColor = vec4(col, 1.0);
}
`;

export type Phase = "dawn" | "day" | "dusk" | "night";

type Palette = [number, number, number][];

const hex = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

// [base, mid, drift, highlight]
const PALETTES: Record<Phase, Palette> = {
  day: [hex("#0c4258"), hex("#127a92"), hex("#35b0a4"), hex("#dff0dd")],
  dawn: [hex("#131a3c"), hex("#565a9e"), hex("#e28a68"), hex("#ffe8c6")],
  dusk: [hex("#1c0d2e"), hex("#7c2144"), hex("#e2683c"), hex("#ffd8a0")],
  night: [hex("#04060d"), hex("#0b1226"), hex("#11383f"), hex("#79c7b6")],
};

export function solarNow(overrideHour: number | null) {
  const now = new Date();
  const rad = Math.PI / 180;
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const days = (now.getTime() - start) / 86400000;
  const decl = -23.44 * rad * Math.cos(((2 * Math.PI) / 365) * (days + 10));
  let solarTime =
    now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600 + LON / 15;
  solarTime = ((solarTime % 24) + 24) % 24;
  if (overrideHour != null) solarTime = overrideHour;
  const ha = (solarTime - 12) * 15 * rad;
  const latR = LAT * rad;
  const elev =
    Math.asin(
      Math.sin(latR) * Math.sin(decl) + Math.cos(latR) * Math.cos(decl) * Math.cos(ha),
    ) / rad;
  return { elev, solarTime };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Blend the four palettes by solar elevation; dawn vs dusk by time of day.
function blendPalettes(elev: number, solarTime: number) {
  const wDay = smooth(4, 14, elev);
  const wNight = 1 - smooth(-10, -3, elev);
  const twilight = Math.max(0, 1 - wDay - wNight);
  const morning = solarTime < 12 ? 1 : 0;
  const weights: Record<Phase, number> = {
    day: wDay,
    night: wNight,
    dawn: twilight * morning,
    dusk: twilight * (1 - morning),
  };
  const out: Palette = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (const ph of Object.keys(weights) as Phase[]) {
    const wt = weights[ph];
    if (wt <= 0) continue;
    const pal = PALETTES[ph];
    for (let i = 0; i < 4; i++) {
      out[i][0] += pal[i][0] * wt;
      out[i][1] += pal[i][1] * wt;
      out[i][2] += pal[i][2] * wt;
    }
  }
  return { out, wNight };
}

export function phaseOf(elev: number, solarTime: number): Phase {
  if (elev > 6) return "day";
  if (elev > -6) return solarTime < 12 ? "dawn" : "dusk";
  return "night";
}

export function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // CSS gradient fallback stays visible

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      c0: gl.getUniformLocation(prog, "u_c0"),
      c1: gl.getUniformLocation(prog, "u_c1"),
      c2: gl.getUniformLocation(prog, "u_c2"),
      c3: gl.getUniformLocation(prog, "u_c3"),
      night: gl.getUniformLocation(prog, "u_night"),
      trail: gl.getUniformLocation(prog, "u_trail"),
    };

    let overrideHour: number | null = null;
    let raf = 0;
    let running = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastPhase = "";

    // pointer trail ring buffer: x, y (shader space), strength, unused
    const TRAIL = 8;
    const trail = new Float32Array(TRAIL * 4);
    let trailIdx = 0;
    let lastMx = 0;
    let lastMy = 0;
    let lastPush = 0;

    const toShader = (cx: number, cy: number) => {
      const x = (cx - window.innerWidth / 2) / window.innerHeight;
      const y = -(cy - window.innerHeight / 2) / window.innerHeight;
      return [x, y] as const;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const draw = (ms: number) => {
      const { elev, solarTime } = solarNow(overrideHour);
      const phase = phaseOf(elev, solarTime);
      if (phase !== lastPhase) {
        lastPhase = phase;
        document.documentElement.dataset.phase = phase;
      }
      const { out, wNight } = blendPalettes(elev, solarTime);

      // decay trail
      for (let i = 0; i < TRAIL; i++) trail[i * 4 + 2] *= 0.96;

      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, ms / 1000);
      gl.uniform3f(u.c0, out[0][0], out[0][1], out[0][2]);
      gl.uniform3f(u.c1, out[1][0], out[1][1], out[1][2]);
      gl.uniform3f(u.c2, out[2][0], out[2][1], out[2][2]);
      gl.uniform3f(u.c3, out[3][0], out[3][1], out[3][2]);
      gl.uniform1f(u.night, wNight);
      gl.uniform4fv(u.trail, trail);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (ms: number) => {
      if (!running) return;
      draw(ms);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running && !reduced) raf = requestAnimationFrame(loop);
    };
    const onMouse = (e: MouseEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastMx;
      const dy = e.clientY - lastMy;
      const speed = Math.min(1, Math.hypot(dx, dy) / 40);
      lastMx = e.clientX;
      lastMy = e.clientY;
      if (now - lastPush < 40) return;
      lastPush = now;
      const [sx, sy] = toShader(e.clientX, e.clientY);
      const i = trailIdx * 4;
      trail[i] = sx;
      trail[i + 1] = sy;
      trail[i + 2] = 0.25 + speed * 0.75;
      trailIdx = (trailIdx + 1) % TRAIL;
    };
    const onClick = (e: PointerEvent) => {
      const [sx, sy] = toShader(e.clientX, e.clientY);
      const i = trailIdx * 4;
      trail[i] = sx;
      trail[i + 1] = sy;
      trail[i + 2] = 1.4;
      trailIdx = (trailIdx + 1) % TRAIL;
    };
    const onTime = (e: Event) => {
      overrideHour = (e as CustomEvent<{ hour: number | null }>).detail.hour;
      if (reduced) draw(0);
    };
    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    window.addEventListener("ss:time", onTime);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("ss:time", onTime);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div className="wallpaper fixed inset-0 -z-10" aria-hidden>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
