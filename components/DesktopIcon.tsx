import Image from "next/image";

export function DesktopIcon({
  href,
  label,
  src,
  alt,
}: {
  href: string;
  label: string;
  src: string;
  alt: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col items-center gap-1.5 w-20 select-none"
    >
      <span className="block w-16 h-16 rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition duration-150 group-hover:scale-[1.04] group-hover:brightness-110">
        <Image
          src={src}
          alt={alt}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </span>
      <span
        className="font-mono text-[11px] text-cream tracking-tight"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
      >
        {label}
      </span>
    </a>
  );
}
