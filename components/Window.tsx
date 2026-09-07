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
          dark ? "bg-[#17171a]/90 border-black/50" : "titlebar-glass border-black/10"
        }`}
      >
        <div className="flex gap-1.5 absolute left-3">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/20" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/20" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/20" />
        </div>
        <div
          className={`w-full text-center font-mono text-sm select-none ${
            dark ? "text-white/90" : "text-ink-tertiary"
          }`}
        >
          {title}
        </div>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
