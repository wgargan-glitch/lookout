import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LookoutMark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7 shrink-0", className)} aria-hidden="true">
      <rect width="32" height="32" rx="6" className={onDark ? "fill-primary-foreground" : "fill-primary"} />
      <polygon points="16,4 8,13 24,13" className={onDark ? "fill-primary" : "fill-primary-foreground"} />
      <rect x="10" y="13" width="12" height="7" className={onDark ? "fill-primary" : "fill-primary-foreground"} />
      <rect x="14" y="15" width="4" height="3.2" className={onDark ? "fill-primary-foreground" : "fill-primary"} />
      <rect x="7.5" y="20" width="17" height="1.6" className="fill-stone" />
      <rect x="11" y="21.6" width="2.2" height="6.8" className={onDark ? "fill-primary" : "fill-primary-foreground"} />
      <rect x="18.8" y="21.6" width="2.2" height="6.8" className={onDark ? "fill-primary" : "fill-primary-foreground"} />
      <rect x="12.4" y="24.2" width="7.2" height="1.2" className="fill-stone" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 text-foreground", className)} aria-label="Lookout home">
      <LookoutMark />
      <span className="font-display text-xl font-medium tracking-tight">Lookout</span>
    </Link>
  );
}
