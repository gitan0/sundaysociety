"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindows, type WinId } from "./WindowManager";
import { caseStudies } from "@/lib/content";

type Action = {
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
};

export function Spotlight() {
  const { openWin } = useWindows();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<Action[]>(() => {
    const winActions: { id: WinId; label: string; keywords: string }[] = [
      { id: "main", label: "sundaysociety.xyz", keywords: "home main about luke bio" },
      { id: "projects", label: "side projects", keywords: "ats.fyi touchline building" },
      { id: "terminal", label: "terminal", keywords: "shell console cli" },
      { id: "spotify", label: "spotify", keywords: "music now playing artists" },
      { id: "chess", label: "chess", keywords: "game play bot" },
      { id: "links", label: "links", keywords: "contact" },
      { id: "system", label: "system monitor", keywords: "stats fps sun weather uptime" },
    ];
    const studies = caseStudies.map((cs) => ({
      label: `${cs.company} — ${cs.hook.toLowerCase()}`,
      hint: "case study",
      keywords: `${cs.company} ${cs.role} case study work previously`.toLowerCase(),
      run: () => openWin(cs.slug as WinId),
    }));
    return [
      ...studies,
      ...winActions.map((w) => ({
        label: w.label,
        hint: "open window",
        keywords: `${w.label} ${w.keywords}`.toLowerCase(),
        run: () => openWin(w.id),
      })),
      {
        label: "email luke",
        hint: "luke@sundaysociety.xyz",
        keywords: "email contact hire mail say hi",
        run: () => {
          window.location.href = "mailto:luke@sundaysociety.xyz";
        },
      },
      {
        label: "resume",
        hint: "pdf",
        keywords: "resume cv pdf download",
        run: () => window.open("/resume.pdf", "_blank"),
      },
      {
        label: "linkedin",
        hint: "linkedin.com/in/lukewoodhatch",
        keywords: "linkedin profile social",
        run: () => window.open("https://linkedin.com/in/lukewoodhatch", "_blank"),
      },
      {
        label: "ats.fyi",
        hint: "job board, built solo",
        keywords: "ats fyi job board project",
        run: () => window.open("https://ats.fyi", "_blank"),
      },
    ];
  }, [openWin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.keywords.includes(q),
    );
  }, [actions, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setIndex(0);
      }
    };
    const onOpen = () => {
      setOpen(true);
      setQuery("");
      setIndex(0);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("ss:spotlight", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ss:spotlight", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh] px-4"
      onClick={close}
    >
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      <div
        role="dialog"
        aria-label="Spotlight search"
        onClick={(e) => e.stopPropagation()}
        className="win-enter relative w-full max-w-[560px] rounded-xl glass overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 h-13 border-b border-black/10 py-3">
          <span className="font-mono text-ink-tertiary text-base" aria-hidden>
            ⌕
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                close();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && filtered[index]) {
                filtered[index].run();
                close();
              }
            }}
            placeholder="search — try “pavlok”, “resume”, “chess”"
            className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-ink-tertiary/70 focus:outline-none"
            aria-label="Search commands"
          />
          <kbd className="font-mono text-[10px] text-ink-tertiary border border-black/15 rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>
        <ul className="max-h-[320px] overflow-y-auto py-1.5" role="listbox">
          {filtered.length === 0 && (
            <li className="px-4 py-3 font-mono text-sm text-ink-tertiary">
              nothing found. try “email”.
            </li>
          )}
          {filtered.map((a, i) => (
            <li key={a.label} role="option" aria-selected={i === index}>
              <button
                type="button"
                onMouseEnter={() => setIndex(i)}
                onClick={() => {
                  a.run();
                  close();
                }}
                className={`w-full flex items-baseline justify-between gap-4 px-4 py-2 text-left ${
                  i === index ? "bg-ink text-cream" : "text-ink"
                }`}
              >
                <span className="font-serif text-base truncate">{a.label}</span>
                <span
                  className={`font-mono text-[11px] shrink-0 ${
                    i === index ? "text-cream/70" : "text-ink-tertiary"
                  }`}
                >
                  {a.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
