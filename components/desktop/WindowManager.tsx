"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type WinId =
  | "main"
  | "projects"
  | "links"
  | "spotify"
  | "chess"
  | "terminal"
  | "pavlok"
  | "slingshot"
  | "magic-eden";

export type WinState = {
  open: boolean;
  minimized: boolean;
  x: number;
  y: number;
};

type WinMap = Record<WinId, WinState>;

const ALL_IDS: WinId[] = [
  "main",
  "projects",
  "links",
  "spotify",
  "chess",
  "terminal",
  "pavlok",
  "slingshot",
  "magic-eden",
];

// Windows open on first load. Chess and terminal live in the dock.
const DEFAULT_OPEN: WinId[] = ["main", "projects", "links", "spotify"];

// Floating windows are fixed-positioned; the rest sit in the page flow.
export const FLOATING: WinId[] = ["terminal", "pavlok", "slingshot", "magic-eden"];

function initialState(extraOpen?: WinId): WinMap {
  const map = {} as WinMap;
  for (const id of ALL_IDS) {
    map[id] = {
      open: DEFAULT_OPEN.includes(id) || id === extraOpen,
      minimized: false,
      x: 0,
      y: 0,
    };
  }
  return map;
}

type Ctx = {
  wins: WinMap;
  zOrder: WinId[];
  openWin: (id: WinId) => void;
  closeWin: (id: WinId) => void;
  minimizeWin: (id: WinId) => void;
  focusWin: (id: WinId) => void;
  moveWin: (id: WinId, x: number, y: number) => void;
  zIndexOf: (id: WinId) => number;
  focused: WinId | null;
};

const WindowContext = createContext<Ctx | null>(null);

const POS_KEY = "ss:v2:positions";

export function WindowProvider({
  children,
  initialOpen,
}: {
  children: ReactNode;
  initialOpen?: WinId;
}) {
  const [wins, setWins] = useState<WinMap>(() => initialState(initialOpen));
  const [zOrder, setZOrder] = useState<WinId[]>(() => {
    const base = [...DEFAULT_OPEN];
    if (initialOpen && !base.includes(initialOpen)) base.push(initialOpen);
    return base;
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore saved drag offsets after mount (SSR renders defaults).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<Record<WinId, { x: number; y: number }>>;
      setWins((prev) => {
        const next = { ...prev };
        for (const id of ALL_IDS) {
          const p = saved[id];
          if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
            next[id] = { ...next[id], x: p.x, y: p.y };
          }
        }
        return next;
      });
    } catch {}
  }, []);

  const persist = useCallback((map: WinMap) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const out: Partial<Record<WinId, { x: number; y: number }>> = {};
        for (const id of ALL_IDS) {
          if (map[id].x !== 0 || map[id].y !== 0) out[id] = { x: map[id].x, y: map[id].y };
        }
        localStorage.setItem(POS_KEY, JSON.stringify(out));
      } catch {}
    }, 400);
  }, []);

  const focusWin = useCallback((id: WinId) => {
    setZOrder((prev) => {
      if (prev[prev.length - 1] === id) return prev;
      return [...prev.filter((w) => w !== id), id];
    });
  }, []);

  const openWin = useCallback(
    (id: WinId) => {
      setWins((prev) => ({ ...prev, [id]: { ...prev[id], open: true, minimized: false } }));
      focusWin(id);
    },
    [focusWin],
  );

  const closeWin = useCallback((id: WinId) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], open: false, minimized: false } }));
    setZOrder((prev) => prev.filter((w) => w !== id));
  }, []);

  const minimizeWin = useCallback((id: WinId) => {
    setWins((prev) => ({ ...prev, [id]: { ...prev[id], minimized: true } }));
    setZOrder((prev) => prev.filter((w) => w !== id));
  }, []);

  const moveWin = useCallback(
    (id: WinId, x: number, y: number) => {
      setWins((prev) => {
        const next = { ...prev, [id]: { ...prev[id], x, y } };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const zIndexOf = useCallback(
    (id: WinId) => 20 + Math.max(0, zOrder.indexOf(id)),
    [zOrder],
  );

  const focused = zOrder.length > 0 ? zOrder[zOrder.length - 1] : null;

  // Esc closes the topmost floating window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const topFloating = [...zOrder].reverse().find((id) => FLOATING.includes(id));
      if (topFloating && wins[topFloating].open) closeWin(topFloating);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zOrder, wins, closeWin]);

  const value = useMemo(
    () => ({ wins, zOrder, openWin, closeWin, minimizeWin, focusWin, moveWin, zIndexOf, focused }),
    [wins, zOrder, openWin, closeWin, minimizeWin, focusWin, moveWin, zIndexOf, focused],
  );

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used inside WindowProvider");
  return ctx;
}

// Null outside a provider — for chrome shared with pages that have no desktop (404).
export function useWindowsOptional() {
  return useContext(WindowContext);
}
