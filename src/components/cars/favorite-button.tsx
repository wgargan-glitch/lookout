import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const on = useFavorites((s) => s.ids.includes(id));
  const toggle = useFavorites((s) => s.toggle);

  return (
    <button
      type="button"
      aria-label={on ? "Remove from saved" : "Save this car"}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-soft backdrop-blur-sm hover:bg-card",
        className,
      )}
    >
      <Heart className={cn("size-4", on && "fill-primary text-primary")} />
    </button>
  );
}
