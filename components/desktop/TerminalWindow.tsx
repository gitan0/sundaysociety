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

const NEOFETCH = [
  "      \\   |   /        luke@sundaysociety",
  "       .-----.         ------------------",
  "  --- (  ~/ss ) ---    os        sunday os 2.0 (tulum build)",
  "       '-----'         host      luke woodhatch",
  "      /   |   \\        shell     zsh · serif · silk",
  "                       uptime    8 years in support",
  "                       csat      95%+ held for years",
  "                       tickets   thousands weekly, 24/7",
  "                       stack     intercom · discord · telegram · claude",
  "                       status    open to support / cx lead roles",
  "                       contact   luke@sundaysociety.xyz",
];

const HISTORY = [
  "  496  2016  cd ~/pavlok && ./build_support_team.sh --from solo --to 24/7",
  "  497  2017  intercom automate --triggers --macros --escalation-rules",
  "  498  2017  git init casa-selva && ./scale.sh --to sephora-mexico",
  "  499  2019  csat --hold 95 --volume thousands-weekly",
  "  500  2023  ssh slingshot && tail -f tier3_escalations.log",
  "  501  2024  ./incident_response.sh --phishing --exec-compromise --calm",
  "  502  2025  ssh magic-eden  # connection upgraded: acquired",
  "  503  2025  ./migrate_users.sh --churn 0 --noise 0",
  "  504  2026  mkdir ~/ats.fyi && claude code .",
  "  505  2026  ./ship_daily.sh --with ai",
  "  506  now   mail -s 'hello' luke@sundaysociety.xyz",
];

const HELP = [
  "available commands:",
  "  help              this",
  "  whoami            who is luke",
  "  neofetch          system info, the pretty kind",
  "  history           how we got here",
  "  ls                what's here",
  "  open <name>       open a window (pavlok, slingshot, magic-eden, chess...)",
  "  cat bio           the short version",
  "  resume            open the pdf",
  "  hire              the important one",
  "  time <0-24|now>   move the sun (try `time 19.5`)",
  "  lock              lock the screen",
  "  reboot            replay the boot sequence",
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
      case "neofetch":
        print(NEOFETCH);
        break;
      case "history":
        print(HISTORY);
        break;
      case "rain":
        window.dispatchEvent(new Event("ss:rain"));
        print(["toggling rain. (it rains here for real when it rains in tulum.)"]);
        break;
      case "rm":
        if (arg.includes("-rf")) {
          print(["rm: permission denied. try sudo. (don't try sudo.)"]);
        } else {
          print([`rm: ${arg || "?"}: no such file`]);
        }
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
        if (arg.includes("rm") && arg.includes("-rf")) {
          print([
            "removing /windows ...",
            "removing /users/luke ...",
            "critical: hiring_daemon killed",
            "no. NO. wait —",
          ]);
          setTimeout(() => window.dispatchEvent(new Event("ss:meltdown")), 700);
        } else {
          print(["luke is already root here. try `hire` instead."]);
        }
        break;
      case "time": {
        if (arg === "now" || arg === "") {
          window.dispatchEvent(new CustomEvent("ss:time", { detail: { hour: null } }));
          print(["sun restored to tulum time."]);
        } else {
          const h = parseFloat(arg);
          if (Number.isFinite(h) && h >= 0 && h <= 24) {
            window.dispatchEvent(new CustomEvent("ss:time", { detail: { hour: h } }));
            print([`sun moved to ${h}:00 solar time. \`time now\` to reset.`]);
          } else {
            print(["usage: time <0-24|now>"]);
          }
        }
        break;
      }
      case "lock":
        print(["locking..."]);
        window.dispatchEvent(new Event("ss:lock"));
        break;
      case "reboot":
        print(["rebooting..."]);
        window.dispatchEvent(new Event("ss:boot"));
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
