"use client";

import { useEffect, useState } from "react";

type Track = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string;
  songUrl?: string;
};

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Track;
        if (!cancelled) setTrack(data);
      } catch {
        // ignore
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      {track?.isPlaying ? (
        <a
          href={track.songUrl}
          target="_blank"
          rel="noreferrer"
          className="flex gap-3 items-center group"
        >
          {track.albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.albumArt}
              alt=""
              width={56}
              height={56}
              className="rounded-sm shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-sm bg-rule shrink-0" />
          )}
          <div className="min-w-0">
            <div className="font-serif text-sm leading-tight truncate group-hover:underline">
              {track.title}
            </div>
            <div className="font-mono text-xs text-ink-tertiary truncate mt-0.5">
              {track.artist}
            </div>
          </div>
        </a>
      ) : (
        <div className="flex gap-3 items-center">
          <div className="w-14 h-14 rounded-sm bg-rule shrink-0" />
          <div className="font-mono text-xs text-ink-tertiary">offline</div>
        </div>
      )}
    </div>
  );
}
