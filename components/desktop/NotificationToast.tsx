"use client";

import { useEffect, useState } from "react";

const KEY = "ss:notified";

export function NotificationToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {}
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      setShow(true);
    }, 14_000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 14_000);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div
      role="status"
      className="notif-enter glass fixed top-10 right-3 z-[80] w-[300px] rounded-xl p-3.5"
    >
      <div className="flex items-start gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/favicon.svg" alt="" width={18} height={18} className="menubar-logo mt-0.5" />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-tertiary">
            sundaysociety · now
          </p>
          <p className="font-serif text-sm text-ink mt-1 leading-snug">
            Luke is open to support / CX lead roles.
          </p>
          <div className="mt-2 flex gap-3 font-mono text-[11px]">
            <a
              href="mailto:luke@sundaysociety.xyz"
              className="underline underline-offset-4 hover:text-accent"
            >
              say hi
            </a>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="text-ink-tertiary hover:text-ink"
            >
              dismiss
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => setShow(false)}
          className="ml-auto text-ink-tertiary hover:text-ink font-mono text-xs"
        >
          ×
        </button>
      </div>
    </div>
  );
}
