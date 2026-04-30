"use client";

import { useEffect, useState } from "react";

type Range = "4w" | "6m" | "all";

type Data = {
  ok: boolean;
  lastPlayed?: {
    title: string;
    artist: string;
    album?: string;
    albumArt?: string;
    songUrl?: string;
    isPlaying: boolean;
  } | null;
  topArtists?: { name: string; url?: string }[];
};

const RANGES: { key: Range; label: string }[] = [
  { key: "4w", label: "4 weeks" },
  { key: "6m", label: "6 months" },
  { key: "all", label: "all time" },
];

export function MusicWindow() {
  const [range, setRange] = useState<Range>("4w");
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/music?range=${range}`, { cache: "no-store" });
        if (!res.ok) return;
        const j = (await res.json()) as Data;
        if (!cancelled) setData(j);
      } catch {}
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [range]);

  const lp = data?.lastPlayed;
  const top = data?.topArtists ?? [];

  return (
    <div className="font-mono">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-tertiary">
        {lp?.isPlaying ? "now playing" : "last played"}
      </div>
      <a
        href={lp?.songUrl ?? "#"}
        target="_blank"
        rel="noreferrer"
        className="mt-2 flex gap-3 group"
      >
        {lp?.albumArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lp.albumArt} alt="" width={64} height={64} className="rounded-sm shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-sm bg-rule shrink-0" />
        )}
        <div className="min-w-0 flex flex-col justify-center">
          <div className="text-sm font-bold text-ink truncate group-hover:underline">
            {lp?.title ?? "—"}
          </div>
          <div className="text-xs text-ink-muted truncate">{lp?.artist ?? ""}</div>
          {lp?.album && (
            <div className="text-[11px] text-ink-tertiary truncate">{lp.album}</div>
          )}
        </div>
      </a>

      <div className="mt-5 flex gap-1.5 text-xs">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              range === r.key
                ? "bg-ink text-cream"
                : "text-ink-tertiary hover:text-ink"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <hr className="border-rule my-4" />

      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mb-3">
        top artists
      </div>
      {top.length === 0 ? (
        <div className="text-xs text-ink-tertiary">
          {data?.ok === false ? "scope missing — re-auth" : "no data yet"}
        </div>
      ) : (
        <ol className="space-y-1.5 text-sm">
          {top.map((a, i) => (
            <li key={a.name} className="flex items-baseline gap-2">
              <span className="text-ink-tertiary w-5 text-right tabular-nums">
                {i + 1}
              </span>
              <a
                href={a.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="truncate hover:underline"
              >
                {a.name}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
