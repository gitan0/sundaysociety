"use client";

import { useEffect, useRef } from "react";

// Tulum, MX
const LAT = 20.21;
const LON = -87.46;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_elev;   // sun elevation in degrees
uniform float u_sunX;   // 0..1 across the sky
uniform vec2 u_par;     // mouse parallax, -1..1

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
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time;

  float day = smoothstep(-8.0, 12.0, u_elev);
  float gold = smoothstep(-7.0, 1.0, u_elev) * (1.0 - smoothstep(4.0, 18.0, u_elev));
  float night = 1.0 - smoothstep(-12.0, -2.0, u_elev);

  // sky
  vec3 dayTop = vec3(0.42, 0.63, 0.77);
  vec3 dayBot = vec3(0.84, 0.87, 0.82);
  vec3 goldTop = vec3(0.32, 0.28, 0.47);
  vec3 goldBot = vec3(0.99, 0.60, 0.33);
  vec3 nightTop = vec3(0.045, 0.055, 0.12);
  vec3 nightBot = vec3(0.10, 0.12, 0.20);

  float sk = pow(1.0 - uv.y, 1.5);
  vec3 sky = mix(mix(nightTop, nightBot, sk), mix(dayTop, dayBot, sk), day);
  sky = mix(sky, mix(goldTop, goldBot, sk), gold * 0.85);

  float horizon = 0.44;

  // sun
  float sunY = horizon + (u_elev / 90.0) * 0.52;
  vec2 sunP = vec2(u_sunX * aspect, sunY);
  float sd = length(p - sunP);
  vec3 sunCol = mix(vec3(1.0, 0.5, 0.22), vec3(1.0, 0.96, 0.82), smoothstep(0.0, 28.0, u_elev));
  float sunDisc = smoothstep(0.036, 0.028, sd);
  float sunGlow = exp(-sd * 3.5) * 0.55 + exp(-sd * 11.0) * 0.4;
  float sunVis = smoothstep(-7.0, 0.0, u_elev);
  sky += sunCol * (sunDisc + sunGlow) * sunVis;

  // moon, roughly opposite the sun
  float melev = -u_elev;
  vec2 moonP = vec2((1.0 - u_sunX) * aspect, horizon + (melev / 90.0) * 0.52);
  float md = length(p - moonP);
  float moonVis = smoothstep(-2.0, 5.0, melev) * night;
  float moonDisc = smoothstep(0.026, 0.021, md);
  float bite = smoothstep(0.026, 0.021, length(p - moonP - vec2(0.009, 0.004)));
  float moon = max(moonDisc - bite * 0.8, 0.0);
  sky += vec3(0.88, 0.92, 1.0) * (moon + exp(-md * 9.0) * 0.22) * moonVis;

  // stars
  vec2 sg = p * 110.0;
  vec2 sid = floor(sg);
  float sr = hash(sid);
  float star = smoothstep(0.988, 1.0, sr) * smoothstep(0.35, 0.05, length(fract(sg) - 0.5));
  float tw = 0.55 + 0.45 * sin(t * (1.0 + sr * 3.0) + sr * 40.0);
  sky += vec3(0.9, 0.95, 1.0) * star * tw * night * smoothstep(horizon, 0.75, uv.y);

  // clouds
  float cl = fbm(vec2(uv.x * 2.8 + t * 0.012, uv.y * 6.0));
  float cmask = smoothstep(0.55, 0.78, cl) * smoothstep(horizon, 0.65, uv.y) * 0.55;
  vec3 cloudCol = mix(vec3(0.16, 0.17, 0.24), vec3(0.96, 0.93, 0.88), day);
  cloudCol = mix(cloudCol, vec3(1.0, 0.68, 0.5), gold * 0.8);
  vec3 col = mix(sky, cloudCol, cmask);

  // sea
  if (uv.y < horizon) {
    float depth = (horizon - uv.y) / horizon;
    vec3 seaDay = mix(vec3(0.22, 0.64, 0.62), vec3(0.07, 0.36, 0.46), depth);
    vec3 seaNight = mix(vec3(0.05, 0.08, 0.14), vec3(0.02, 0.04, 0.08), depth);
    vec3 sea = mix(seaNight, seaDay, day);
    sea = mix(sea, sea + vec3(0.35, 0.12, 0.02), gold * 0.45);

    float lightX = mix((1.0 - u_sunX) * aspect, sunP.x, step(0.01, sunVis));
    float band = exp(-abs(p.x - lightX) * 2.6);
    float shim = noise(vec2(uv.x * 150.0, uv.y * 80.0 - t * 1.4));
    float sparkle = smoothstep(0.7, 0.95, shim) * band * (sunVis * 0.75 + moonVis * 0.5);
    vec3 lcol = mix(vec3(0.8, 0.85, 1.0), sunCol, step(0.01, sunVis));
    sea += lcol * sparkle * 0.85;

    // gentle horizontal swell lines
    float swell = sin(uv.y * 160.0 + noise(vec2(uv.x * 8.0, t * 0.3)) * 6.0) * 0.02 * depth;
    sea += swell * day * 0.4;
    col = sea;
  }

  // jungle silhouettes with parallax
  float h1 = 0.26 + 0.075 * fbm(vec2(uv.x * 3.6 + u_par.x * 0.012 + 2.0, 3.7));
  float h2 = 0.175 + 0.06 * fbm(vec2(uv.x * 5.5 + u_par.x * 0.026 + 9.3, 1.3));
  float leaf1 = 0.8 + 0.45 * noise(vec2(uv.x * 42.0, uv.y * 34.0));
  float leaf2 = 0.8 + 0.4 * noise(vec2(uv.x * 30.0 + 5.0, uv.y * 26.0));
  vec3 fol1 = mix(vec3(0.05, 0.09, 0.065), vec3(0.20, 0.34, 0.20) * leaf1, day);
  vec3 fol2 = mix(vec3(0.028, 0.055, 0.042), vec3(0.11, 0.22, 0.13) * leaf2, day);
  fol1 = mix(fol1, fol1 + vec3(0.22, 0.09, 0.02), gold * 0.5);
  fol2 = mix(fol2, fol2 + vec3(0.12, 0.05, 0.01), gold * 0.4);
  float e1 = smoothstep(h1 + 0.003, h1 - 0.003, uv.y);
  float e2 = smoothstep(h2 + 0.003, h2 - 0.003, uv.y);
  col = mix(col, fol1, e1);
  col = mix(col, fol2, e2);

  // fireflies at night, low over the canopy
  if (night > 0.3) {
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      vec2 fp = vec2(
        fract(hash(vec2(fi, 1.0)) + t * 0.006 * (1.0 + fi * 0.25)),
        0.2 + 0.13 * hash(vec2(fi, 7.0)) + 0.018 * sin(t * 0.6 + fi * 2.1)
      );
      float fd = length((uv - fp) * vec2(aspect, 1.0));
      float pulse = 0.45 + 0.55 * sin(t * 1.8 + fi * 9.0);
      col += vec3(0.85, 1.0, 0.45) * exp(-fd * 320.0) * night * pulse;
    }
  }

  // warm cream cast, grain, vignette — keeps the illustrated feel
  col = mix(col, col * vec3(1.045, 1.0, 0.94), 0.5);
  col += hash(uv * u_res + fract(t) * 7.0) * 0.05 - 0.025;
  float vg = smoothstep(1.3, 0.4, length(uv - 0.5));
  col *= mix(0.9, 1.0, vg);

  gl_FragColor = vec4(col, 1.0);
}
`;

export type Phase = "dawn" | "day" | "dusk" | "night";

function solarNow(overrideHour: number | null) {
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
  // Map morning→evening across the sky, clamped so the disc stays on screen.
  const sunX = Math.min(0.92, Math.max(0.08, (solarTime - 5.5) / 13));
  return { elev, solarTime, sunX };
}

function phaseOf(elev: number, solarTime: number): Phase {
  if (elev > 8) return "day";
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
    if (!gl) return; // CSS fallback stays visible

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
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      elev: gl.getUniformLocation(prog, "u_elev"),
      sunX: gl.getUniformLocation(prog, "u_sunX"),
      par: gl.getUniformLocation(prog, "u_par"),
    };

    let overrideHour: number | null = null;
    let raf = 0;
    let running = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    let lastPhase = "";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const draw = (ms: number) => {
      const { elev, solarTime, sunX } = solarNow(overrideHour);
      const phase = phaseOf(elev, solarTime);
      if (phase !== lastPhase) {
        lastPhase = phase;
        document.documentElement.dataset.phase = phase;
      }
      mouse.sx += (mouse.x - mouse.sx) * 0.04;
      mouse.sy += (mouse.y - mouse.sy) * 0.04;
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, ms / 1000);
      gl.uniform1f(u.elev, elev);
      gl.uniform1f(u.sunX, sunX);
      gl.uniform2f(u.par, mouse.sx, mouse.sy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (ms: number) => {
      if (!running) return;
      draw(ms);
      raf = requestAnimationFrame(loop);
    };

    if (reduced) {
      draw(0); // one static frame — the scene, not the motion
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running && !reduced) raf = requestAnimationFrame(loop);
    };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
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
    window.addEventListener("ss:time", onTime);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
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
