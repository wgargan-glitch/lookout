import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Official tower icon — the supplied Lookout vector mark. */
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

/** Official header and footer lockup. */
export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("flex items-center text-foreground", onDark && "text-primary-foreground", className)}
      aria-label="Lookout home"
    >
      <img
        src="/brand/header-lockup.jpg"
        alt="Lookout — A local car. At the trailhead."
        className={cn(
          "h-10 w-auto max-w-[210px] object-contain md:h-12 md:max-w-[260px]",
          onDark && "rounded-sm",
        )}
      />
    </Link>
  );
}
