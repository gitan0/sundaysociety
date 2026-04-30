import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

type SpotifyArtist = { name: string; external_urls?: { spotify?: string } };
type SpotifyTrack = {
  name: string;
  artists: SpotifyArtist[];
  album?: { name: string; images?: { url: string }[] };
  external_urls?: { spotify?: string };
};
type LastPlayed = {
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  songUrl?: string;
  isPlaying: boolean;
};
type TopArtist = { name: string; url?: string };

// Module-scoped cache survives between requests within a single server instance.
type CacheEntry<T> = { value: T; at: number };
const cache = {
  token: null as null | { value: string; expiresAt: number },
  nowPlaying: null as null | CacheEntry<LastPlayed | null>,
  recentlyPlayed: null as null | CacheEntry<LastPlayed | null>,
  topArtists: {} as Record<string, CacheEntry<TopArtist[]>>,
};

const TTL = {
  nowPlaying: 25_000,           // 25s
  recentlyPlayed: 5 * 60_000,   // 5 min
  topArtists: 30 * 60_000,      // 30 min
};

const RANGE_MAP: Record<string, string> = {
  "4w": "short_term",
  "6m": "medium_term",
  all: "long_term",
};

async function getAccessToken(): Promise<string | null> {
  if (cache.token && cache.token.expiresAt > Date.now() + 30_000) {
    return cache.token.value;
  }
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cache.token = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

function trackToLastPlayed(t: SpotifyTrack, isPlaying: boolean): LastPlayed {
  return {
    isPlaying,
    title: t.name,
    artist: (t.artists ?? []).map((a) => a.name).join(", "),
    album: t.album?.name,
    albumArt: t.album?.images?.[0]?.url,
    songUrl: t.external_urls?.spotify,
  };
}

async function fetchNowPlaying(token: string): Promise<LastPlayed | null> {
  if (cache.nowPlaying && Date.now() - cache.nowPlaying.at < TTL.nowPlaying) {
    return cache.nowPlaying.value;
  }
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  let value: LastPlayed | null = null;
  if (res.status === 200) {
    const j = await res.json();
    if (j?.item) value = trackToLastPlayed(j.item, !!j.is_playing);
  }
  // 204 = nothing playing, treat as null and fall through to recently-played in caller.
  // 429 = rate-limited — keep existing cache value if any so we don't churn.
  if (res.status === 429 && cache.nowPlaying) return cache.nowPlaying.value;
  cache.nowPlaying = { value, at: Date.now() };
  return value;
}

async function fetchRecentlyPlayed(token: string): Promise<LastPlayed | null> {
  if (
    cache.recentlyPlayed &&
    Date.now() - cache.recentlyPlayed.at < TTL.recentlyPlayed
  ) {
    return cache.recentlyPlayed.value;
  }
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  if (res.status === 429 && cache.recentlyPlayed) return cache.recentlyPlayed.value;
  let value: LastPlayed | null = null;
  if (res.ok) {
    const j = await res.json();
    const t: SpotifyTrack | undefined = j?.items?.[0]?.track;
    if (t) value = trackToLastPlayed(t, false);
  }
  cache.recentlyPlayed = { value, at: Date.now() };
  return value;
}

async function fetchTopArtists(token: string, range: string): Promise<TopArtist[]> {
  const time_range = RANGE_MAP[range] ?? "short_term";
  const cached = cache.topArtists[time_range];
  if (cached && Date.now() - cached.at < TTL.topArtists) {
    return cached.value;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${time_range}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );
  // On any non-success, prefer prior cache value over churning. Don't cache failures.
  if (!res.ok) return cached?.value ?? [];
  const j = await res.json();
  const value: TopArtist[] = (j?.items ?? []).map((a: SpotifyArtist) => ({
    name: a.name,
    url: a.external_urls?.spotify,
  }));
  // Only persist when we actually got data, so an empty response doesn't stick for 30min.
  if (value.length > 0) {
    cache.topArtists[time_range] = { value, at: Date.now() };
  }
  return value;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = url.searchParams.get("range") ?? "4w";

  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ ok: false, reason: "no_token" });
  }

  const [nowPlaying, topArtists] = await Promise.all([
    fetchNowPlaying(token),
    fetchTopArtists(token, range),
  ]);

  // If nothing currently playing, fall back to recently-played track.
  let lastPlayed = nowPlaying;
  if (!lastPlayed) {
    lastPlayed = await fetchRecentlyPlayed(token);
  }

  return NextResponse.json(
    { ok: true, range, lastPlayed, topArtists },
    {
      headers: {
        "Cache-Control": "public, s-maxage=20, stale-while-revalidate=300",
      },
    },
  );
}
