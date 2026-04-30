import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 30;

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

async function getAccessToken() {
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
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json(
      { isPlaying: false },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } },
    );
  }

  const res = await fetch(NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 204 || res.status > 400) {
    return NextResponse.json(
      { isPlaying: false },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } },
    );
  }
  const song = await res.json();
  if (!song?.item) {
    return NextResponse.json({ isPlaying: false });
  }
  return NextResponse.json(
    {
      isPlaying: !!song.is_playing,
      title: song.item.name as string,
      artist: (song.item.artists ?? [])
        .map((a: { name: string }) => a.name)
        .join(", "),
      albumArt: song.item.album?.images?.[0]?.url as string | undefined,
      songUrl: song.item.external_urls?.spotify as string | undefined,
    },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } },
  );
}
