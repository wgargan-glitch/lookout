import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "default" | "pine" | "outline" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "default" && "bg-secondary text-secondary-foreground",
        tone === "pine" && "bg-primary text-primary-foreground",
        tone === "outline" && "border border-border bg-card text-foreground",
        className,
      )}
      {...props}
    />
  );
}
