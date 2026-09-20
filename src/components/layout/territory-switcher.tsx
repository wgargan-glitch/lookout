import { TERRITORIES } from "@/lib/territory";
import { useTerritory } from "@/lib/use-territory";
import { cn } from "@/lib/utils";

export function TerritorySwitcher({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const id = useTerritory((s) => s.id);
  const setTerritory = useTerritory((s) => s.setTerritory);

  return (
    <div
      role="group"
      aria-label="Park region"
      className={cn(
        "inline-flex rounded-md border p-0.5 text-xs font-medium",
        tone === "dark" ? "border-primary-foreground/25" : "border-border",
      )}
    >
      {TERRITORIES.map((t) => {
        const on = t.id === id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTerritory(t.id)}
            className={cn(
              "min-h-8 rounded-[5px] px-2.5",
              on
                ? tone === "dark"
                  ? "bg-primary-foreground text-primary"
                  : "bg-primary text-primary-foreground"
                : tone === "dark"
                  ? "text-primary-foreground/75 hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.shortLabel}
            {t.published ? "" : " · preview"}
          </button>
        );
      })}
    </div>
  );
}
