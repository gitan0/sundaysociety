"use client";

import { Chess, type Square, type Move } from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

const PIECE_GLYPH: Record<string, string> = {
  wK: "♔",
  wQ: "♕",
  wR: "♖",
  wB: "♗",
  wN: "♘",
  wP: "♙",
  bK: "♚",
  bQ: "♛",
  bR: "♜",
  bB: "♝",
  bN: "♞",
  bP: "♟",
};

const VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 200,
};

function evaluate(c: Chess): number {
  // positive = good for black (bot)
  let s = 0;
  const board = c.board();
  for (const row of board) {
    for (const sq of row) {
      if (!sq) continue;
      const v = VALUES[sq.type];
      s += sq.color === "b" ? v : -v;
    }
  }
  return s;
}

function pickBotMove(c: Chess): Move | null {
  const moves = c.moves({ verbose: true });
  if (moves.length === 0) return null;
  let best: Move | null = null;
  let bestScore = -Infinity;
  // shuffle to avoid deterministic openings
  const shuffled = [...moves].sort(() => Math.random() - 0.5);
  for (const m of shuffled) {
    try {
      c.move({ from: m.from, to: m.to, promotion: m.promotion });
    } catch {
      continue;
    }
    const replies = c.moves({ verbose: true });
    let worst: number;
    if (replies.length === 0) {
      worst = c.isCheck() ? 1000 : 0; // white mated by bot = great
    } else {
      worst = Infinity;
      for (const r of replies) {
        try {
          c.move({ from: r.from, to: r.to, promotion: r.promotion });
        } catch {
          continue;
        }
        const s = evaluate(c);
        if (s < worst) worst = s;
        c.undo();
      }
    }
    if (worst > bestScore) {
      bestScore = worst;
      best = m;
    }
    c.undo();
  }
  return best;
}

export function ChessWindow() {
  const chessRef = useRef(new Chess());
  const [, setTick] = useState(0);
  const [selected, setSelected] = useState<Square | null>(null);
  const [thinking, setThinking] = useState(false);

  const force = useCallback(() => setTick((t) => t + 1), []);

  const c = chessRef.current;
  const fen = c.fen();

  const status = useMemo(() => {
    if (c.isCheckmate()) return c.turn() === "w" ? "checkmate · bot wins" : "checkmate · you win";
    if (c.isStalemate()) return "stalemate";
    if (c.isInsufficientMaterial()) return "draw · insufficient material";
    if (c.isThreefoldRepetition()) return "draw · repetition";
    if (c.isDraw()) return "draw";
    if (thinking) return "bot thinking…";
    if (c.inCheck()) return c.turn() === "w" ? "check · your move" : "check · bot to move";
    return c.turn() === "w" ? "your move" : "bot to move";
  }, [thinking, fen, c]);

  const legalTargets = useMemo<Square[]>(() => {
    if (!selected) return [];
    return c
      .moves({ square: selected, verbose: true })
      .map((m) => m.to as Square);
  }, [selected, fen, c]);

  // Bot move when it's black's turn — keyed by fen so it re-fires after each move
  useEffect(() => {
    if (c.isGameOver()) return;
    if (c.turn() !== "b") return;
    setThinking(true);
    const id = setTimeout(() => {
      try {
        const m = pickBotMove(c);
        if (m) c.move({ from: m.from, to: m.to, promotion: m.promotion });
        else {
          // fallback: random legal move so we never freeze mid-game
          const moves = c.moves({ verbose: true });
          if (moves.length) {
            const r = moves[Math.floor(Math.random() * moves.length)];
            c.move({ from: r.from, to: r.to, promotion: r.promotion });
          }
        }
      } catch (e) {
        // last resort: try a random legal move
        try {
          const moves = c.moves({ verbose: true });
          if (moves.length) {
            const r = moves[Math.floor(Math.random() * moves.length)];
            c.move({ from: r.from, to: r.to, promotion: r.promotion });
          }
        } catch {}
        console.error("bot move error", e);
      }
      setThinking(false);
      force();
    }, 350);
    return () => clearTimeout(id);
  }, [fen, c, force]);

  const onSquareClick = (sq: Square) => {
    if (c.isGameOver() || thinking || c.turn() !== "w") return;
    const piece = c.get(sq);
    if (selected) {
      if (selected === sq) {
        setSelected(null);
        return;
      }
      // attempt move
      const moves = c.moves({ square: selected, verbose: true });
      const target = moves.find((m) => m.to === sq);
      if (target) {
        c.move({ from: selected, to: sq, promotion: "q" });
        setSelected(null);
        force();
        return;
      }
      // re-select if clicking own piece
      if (piece && piece.color === "w") {
        setSelected(sq);
      } else {
        setSelected(null);
      }
    } else if (piece && piece.color === "w") {
      setSelected(sq);
    }
  };

  const restart = () => {
    chessRef.current = new Chess();
    setSelected(null);
    setThinking(false);
    force();
  };

  // Auto-reset 60s after a game ends
  useEffect(() => {
    if (!c.isGameOver()) return;
    const id = setTimeout(restart, 60_000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);

  const board = c.board();

  return (
    <div>
      <div className="flex justify-between items-baseline font-mono text-[11px] text-ink-tertiary mb-2">
        <span>{status}</span>
        <button
          onClick={restart}
          className="font-mono text-[11px] text-ink-tertiary hover:text-accent"
        >
          restart
        </button>
      </div>
      <div className="relative grid grid-cols-8 border border-ink rounded-sm overflow-hidden select-none">
        {board.map((row, ri) =>
          row.map((cell, ci) => {
            const file = FILES[ci];
            const rank = RANKS[ri];
            const sq = `${file}${rank}` as Square;
            const isLight = (ri + ci) % 2 === 0;
            const isSelected = selected === sq;
            const isLegal = legalTargets.includes(sq);
            const hasOpponent = isLegal && !!cell;
            return (
              <button
                key={sq}
                onClick={() => onSquareClick(sq)}
                className="relative aspect-square flex items-center justify-center text-[22px] leading-none transition-colors"
                style={{
                  background: isSelected
                    ? "rgba(160,74,42,0.25)"
                    : isLight
                      ? "var(--color-cream)"
                      : "var(--color-rule-soft)",
                  color: "var(--color-ink)",
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                {cell && (
                  <span aria-hidden>
                    {PIECE_GLYPH[`${cell.color}${cell.type.toUpperCase()}`]}
                  </span>
                )}
                {isLegal && !hasOpponent && (
                  <span
                    aria-hidden
                    className="absolute w-2 h-2 rounded-full"
                    style={{ background: "rgba(160,74,42,0.55)" }}
                  />
                )}
                {hasOpponent && (
                  <span
                    aria-hidden
                    className="absolute inset-0.5 rounded-sm pointer-events-none"
                    style={{ boxShadow: "inset 0 0 0 2px rgba(160,74,42,0.7)" }}
                  />
                )}
              </button>
            );
          }),
        )}
        {c.isGameOver() && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: "rgba(251,249,244,0.85)" }}
          >
            <div className="font-serif text-lg text-ink">{status}</div>
            <button
              onClick={restart}
              className="font-mono text-xs px-3 py-1.5 border border-ink rounded-sm hover:bg-ink hover:text-cream transition-colors"
            >
              play again
            </button>
            <div className="font-mono text-[10px] text-ink-tertiary">
              auto-reset in 60s
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 font-mono text-[10px] text-ink-tertiary leading-snug">
        click a piece, then a target. you play white. promotions auto-queen.
      </div>
    </div>
  );
}
