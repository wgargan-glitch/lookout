import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function Rig({
  fill,
  cut,
}: {
  fill: string;
  cut: string;
}) {
  return (
    <g>
      <polygon points="16,2.2 7.6,11.8 24.4,11.8" fill={fill} />
      <rect x="10.6" y="11.8" width="10.8" height="5.8" fill={fill} />
      <rect x="14" y="13.2" width="4" height="3" fill={cut} />
      <rect x="8.2" y="17.4" width="15.6" height="1.3" fill={fill} />
      <rect x="11.4" y="18.6" width="2.2" height="3.2" fill={fill} />
      <rect x="18.4" y="18.6" width="2.2" height="3.2" fill={fill} />
      <rect x="8" y="20.8" width="8.8" height="4" rx="0.5" fill={fill} />
      <rect x="10.2" y="21.6" width="4.2" height="2.2" fill={cut} />
      <rect x="7.2" y="24.4" width="17.6" height="3.8" rx="0.7" fill={fill} />
      <circle cx="11.2" cy="28.4" r="1.85" fill={fill === "#f4efe4" ? "#1a1915" : "#f4efe4"} />
      <circle cx="20.8" cy="28.4" r="1.85" fill={fill === "#f4efe4" ? "#1a1915" : "#f4efe4"} />
    </g>
  );
}

/** Concept A — square tower-over-4x4, used as the app/tab glyph. */
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
      <Rig fill={fill} cut={cut} />
    </svg>
  );
}

/** Concept B — circular trailhead seal. */
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
        <Rig fill={fill} cut={cut} />
      </g>
    </svg>
  );
}

/** Official lockup (concept B): LOOKOUT wordmark + circular seal. */
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
