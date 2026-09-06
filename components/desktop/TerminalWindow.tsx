"use client";

import { useEffect, useRef, useState } from "react";
import { useWindows, type WinId } from "./WindowManager";
import { bio, headline } from "@/lib/content";

type Line = { text: string; kind: "in" | "out" };

const OPENABLE: Record<string, WinId> = {
  pavlok: "pavlok",
  slingshot: "slingshot",
  "magic-eden": "magic-eden",
  magiceden: "magic-eden",
  chess: "chess",
  spotify: "spotify",
  projects: "projects",
  links: "links",
  main: "main",
};

const HELP = [
  "available commands:",
  "  help              this",
  "  whoami            who is luke",
  "  ls                what's here",
  "  open <name>       open a window (pavlok, slingshot, magic-eden, chess...)",
  "  cat bio           the short version",
  "  resume            open the pdf",
  "  hire              the important one",
  "  clear             clean up",
];

export function TerminalContent() {
  const { openWin } = useWindows();
  const [lines, setLines] = useState<Line[]>([
    { text: "sundaysociety os 2.0 — type `help` to get started", kind: "out" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (out: string[]) =>
    setLines((prev) => [...prev, ...out.map((t) => ({ text: t, kind: "out" as const }))]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((prev) => [...prev, { text: `$ ${cmd}`, kind: "in" }]);
    if (!cmd) return;
    setHistory((prev) => [cmd, ...prev]);
    setHistIdx(-1);
    const [head, ...rest] = cmd.toLowerCase().split(/\s+/);
    const arg = rest.join(" ").replace(/^--/, "");

    switch (head) {
      case "help":
        print(HELP);
        break;
      case "whoami":
        print(["luke woodhatch", headline.toLowerCase(), "tulum · us hours · open to work"]);
        break;
      case "ls":
        print([
          "pavlok/        slingshot/     magic-eden/",
          "ats.fyi        touchline      chess",
          "resume.pdf     bio.txt",
        ]);
        break;
      case "cat":
        if (arg.startsWith("bio")) print([bio.toLowerCase()]);
        else if (arg.startsWith("resume")) print(["binary file. try `resume`."]);
        else print([`cat: ${arg || "?"}: no such file`]);
        break;
      case "open": {
        const target = OPENABLE[arg];
        if (target) {
          openWin(target);
          print([`opening ${arg}...`]);
        } else {
          print([`open: ${arg || "?"}: not found. try \`ls\`.`]);
        }
        break;
      }
      case "resume":
        window.open("/resume.pdf", "_blank");
        print(["opening resume.pdf..."]);
        break;
      case "hire":
      case "email":
        print(["drafting email to luke@sundaysociety.xyz..."]);
        window.location.href =
          "mailto:luke@sundaysociety.xyz?subject=saw%20the%20terminal";
        break;
      case "sudo":
        print(["luke is already root here. try `hire` instead."]);
        break;
      case "pwd":
        print(["/users/luke/tulum"]);
        break;
      case "date":
        print([new Date().toString().toLowerCase()]);
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        print(["nice try. red button, top left."]);
        break;
      default:
        print([`command not found: ${head}. try \`help\`.`]);
    }
  };

  return (
    <div
      className="h-full min-h-[260px] lg:h-[340px] flex flex-col font-mono text-[13px] leading-relaxed text-[#c8f5c8] bg-[#141416]"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} className={l.kind === "in" ? "text-white/85" : "text-[#c8f5c8]/90"}>
            <pre className="whitespace-pre-wrap font-mono">{l.text}</pre>
          </div>
        ))}
      </div>
      <form
        className="flex items-center gap-2 px-4 pb-3"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
          setInput("");
        }}
      >
        <span className="text-white/60 select-none">$</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const next = Math.min(histIdx + 1, history.length - 1);
              if (history[next]) {
                setHistIdx(next);
                setInput(history[next]);
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const next = histIdx - 1;
              setHistIdx(next);
              setInput(next >= 0 ? history[next] : "");
            }
          }}
          className="flex-1 bg-transparent text-white focus:outline-none caret-[#c8f5c8]"
          aria-label="Terminal input"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
