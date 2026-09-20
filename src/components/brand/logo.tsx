import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function Tower({ className }: { className?: string }) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      className={cn("size-9 shrink-0 rounded-full", className)}
      aria-hidden="true"
    />
  );
}

/** Official tower icon — USFS lookout on pine. */
export function LookoutIcon({
  className,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return <Tower className={cn("size-7", className)} />;
}

/** Official circular tower mark. */
export function LookoutMark({
  className,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return <Tower className={className} />;
}

/** Tower + LOOKOUT. No JPEG plate — sits on whatever color the chrome is. */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2.5 text-foreground", onDark && "text-primary-foreground", className)}
      aria-label="Lookout home"
    >
      <Tower className="size-9 md:size-10" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-display text-[1.35rem] font-medium tracking-[0.12em]">LOOKOUT</span>
        {onDark ? (
          <span className="mt-1 text-[0.62rem] font-medium tracking-[0.14em] uppercase text-primary-foreground/70">
            A local car. At the trailhead.
          </span>
        ) : null}
      </span>
    </Link>
  );
}
