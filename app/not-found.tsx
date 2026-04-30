import Image from "next/image";
import Link from "next/link";
import { Window } from "@/components/Window";
import { Menubar } from "@/components/Menubar";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full pt-7 flex items-center justify-center p-6">
      <Menubar />
      <Window
        title="404.txt — sundaysociety.xyz"
        className="w-full max-w-[640px]"
      >
        <Image
          src="/assets/404-illustration.svg"
          alt=""
          width={600}
          height={400}
          className="w-full h-auto"
        />
        <h1 className="font-serif text-3xl mt-6 leading-none">404 — not here</h1>
        <p className="font-mono text-[11px] text-ink-tertiary mt-2">
          the page you wanted is on a different beach.
        </p>
        <Link
          href="/"
          className="font-mono text-xs text-accent mt-6 inline-block"
        >
          ← back to sundaysociety.xyz
        </Link>
      </Window>
    </main>
  );
}
