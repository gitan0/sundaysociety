import { type ReactNode } from "react";

export function Window({
  title,
  children,
  className = "",
  variant = "light",
  bodyClassName = "p-5",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  variant?: "light" | "dark";
  bodyClassName?: string;
}) {
  const dark = variant === "dark";
  return (
    <div
      className={`glass rounded-xl overflow-hidden ${className}`}
    >
      <div
        className={`relative h-9 flex items-center px-3 border-b ${
          "titlebar-term border-black/50"
        }`}
      >
        <div className="flex gap-1.5 absolute left-3">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/20" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/20" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/20" />
        </div>
        <div
          className="w-full text-center font-mono text-[10px] tracking-[0.08em] select-none"
          style={{ color: "var(--term-fg)" }}
        >
          {title}
        </div>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
