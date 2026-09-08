"use client";

import { useEffect, useState } from "react";

// `sudo rm -rf /` — windows fall, screen dies, system reboots.
export function MeltdownFX() {
  const [black, setBlack] = useState(false);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const onMeltdown = () => {
      const main = document.querySelector("main");
      main?.classList.add("melting");
      t1 = setTimeout(() => setBlack(true), 1500);
      t2 = setTimeout(() => {
        main?.classList.remove("melting");
        setBlack(false);
        window.dispatchEvent(new Event("ss:boot"));
      }, 2400);
    };
    window.addEventListener("ss:meltdown", onMeltdown);
    return () => {
      window.removeEventListener("ss:meltdown", onMeltdown);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return <div className="meltdown-black" data-on={black ? "" : undefined} aria-hidden />;
}
