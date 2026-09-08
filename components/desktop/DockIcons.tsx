// Hand-drawn terminal-style line icons, 20×20, stroke-only.
export function DockIcon({ name }: { name: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path {...p} d="M3.5 9.5 L10 3.5 L16.5 9.5" />
          <path {...p} d="M5.5 8.5 V16 H14.5 V8.5" />
          <path {...p} d="M8.5 16 V12 H11.5 V16" />
        </svg>
      );
    case "folder":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path {...p} d="M3 15.5 V5.5 H8 L10 7.5 H17 V15.5 Z" />
        </svg>
      );
    case "prompt":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path {...p} d="M4.5 6 L9 10 L4.5 14" />
          <path {...p} d="M11 14.5 H16" />
        </svg>
      );
    case "music":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path {...p} d="M8 14.5 V5.5 L16 4 V13" />
          <circle {...p} cx="6" cy="14.5" r="2" />
          <circle {...p} cx="14" cy="13" r="2" />
        </svg>
      );
    case "rook":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path
            {...p}
            d="M6 3.5 V6 H8 V3.5 H12 V6 H14 V3.5 H15 V7.5 L13.5 9 V13.5 L15 16.5 H5 L6.5 13.5 V9 L5 7.5 V3.5 Z"
          />
        </svg>
      );
    case "link":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path {...p} d="M5.5 14.5 L14.5 5.5" />
          <path {...p} d="M8 5.5 H14.5 V12" />
        </svg>
      );
    case "mail":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <rect {...p} x="3" y="5" width="14" height="10" rx="1" />
          <path {...p} d="M3.5 6 L10 11 L16.5 6" />
        </svg>
      );
    case "doc":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <path {...p} d="M5.5 3.5 H11.5 L14.5 6.5 V16.5 H5.5 Z" />
          <path {...p} d="M11.5 3.5 V6.5 H14.5" />
          <path {...p} d="M8 10 H12 M8 12.5 H12" />
        </svg>
      );
    default:
      return null;
  }
}
