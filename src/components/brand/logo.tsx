import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Official tower icon — USFS lookout on pine. */
export function LookoutIcon({
  className,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      className={cn("size-7 shrink-0", className)}
      aria-hidden="true"
    />
  );
}

/** Official circular tower mark. */
export function LookoutMark({
  className,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      className={cn("size-9 shrink-0", className)}
      aria-hidden="true"
    />
  );
}

/** Official header lockup. Footer uses the tower + cream type on pine. */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center text-foreground", onDark && "text-primary-foreground", className)}
      aria-label="Lookout home"
    >
      {onDark ? (
        <span className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="size-10 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[1.35rem] font-medium tracking-[0.12em]">LOOKOUT</span>
            <span className="text-[0.62rem] font-medium tracking-[0.14em] uppercase text-primary-foreground/70">
              A local car. At the trailhead.
            </span>
          </span>
        </span>
      ) : (
        <img
          src="/brand/header-lockup.jpg"
          alt="Lookout — A local car. At the trailhead."
          className="h-10 w-auto max-w-[210px] object-contain md:h-12 md:max-w-[260px]"
        />
      )}
    </Link>
  );
}
