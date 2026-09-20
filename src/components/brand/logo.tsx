import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function Tower({
  fill,
  cut,
}: {
  fill: string;
  cut: string;
}) {
  return (
    <g>
      <rect x="13.2" y="2.4" width="1.1" height="4.2" fill={fill} />
      <rect x="17.7" y="1.6" width="1.1" height="5" fill={fill} />
      <rect x="10.4" y="6.4" width="11.2" height="1.3" fill={fill} />
      <rect x="11.2" y="7.7" width="9.6" height="6.2" fill={fill} />
      <rect x="13.7" y="9" width="4.6" height="3.2" fill={cut} />
      <rect x="10.4" y="13.9" width="11.2" height="0.9" fill={fill} />
      <polygon points="12.2,14.8 13.6,14.8 14.4,24.2 12.8,24.2" fill={fill} />
      <polygon points="19.8,14.8 18.4,14.8 17.6,24.2 19.2,24.2" fill={fill} />
      <polygon points="13.4,16.2 18.8,22.8 17.8,23.2 12.4,16.6" fill={fill} />
      <polygon points="18.6,16.2 13.2,22.8 14.2,23.2 19.6,16.6" fill={fill} />
      <rect x="13" y="18.4" width="6" height="0.8" fill={fill} />
      <polygon points="4,27.6 10.4,22.2 16,26.2 22.2,20.4 28,27.6" fill={fill} />
    </g>
  );
}

/** App / tab glyph — tower only on a rounded square. */
export function LookoutIcon({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const fill = onDark ? "#2f4a38" : "#f4efe4";
  const cut = onDark ? "#f4efe4" : "#2f4a38";
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7 shrink-0", className)} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill={onDark ? "#f4efe4" : "#2f4a38"} />
      <g transform="translate(16 16) scale(0.92) translate(-16 -16)">
        <Tower fill={fill} cut={cut} />
      </g>
    </svg>
  );
}

/** Circular trailhead seal — tower on a peak. */
export function LookoutMark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const fill = onDark ? "#2f4a38" : "#f4efe4";
  const cut = onDark ? "#f4efe4" : "#2f4a38";
  return (
    <svg viewBox="0 0 32 32" className={cn("size-9 shrink-0", className)} aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill={onDark ? "#f4efe4" : "#2f4a38"} />
      <g transform="translate(16 16) scale(0.86) translate(-16 -16)">
        <Tower fill={fill} cut={cut} />
      </g>
    </svg>
  );
}

/** Official lockup: LOOKOUT wordmark + circular seal. */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 text-foreground", onDark && "text-primary-foreground", className)}
      aria-label="Lookout home"
    >
      <span className="font-display text-[1.35rem] font-medium tracking-[0.08em]">LOOKOUT</span>
      <LookoutMark onDark={onDark} />
    </Link>
  );
}
