import { TERRITORIES, isTerritoryId } from "@/lib/territory";
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
    <label className="inline-flex items-center gap-2 text-xs">
      <span className={cn("hidden sm:inline", tone === "dark" ? "text-primary-foreground/70" : "text-muted-foreground")}>
        Region
      </span>
      <select
        aria-label="Park region"
        value={id}
        onChange={(e) => {
          const next = e.target.value;
          if (isTerritoryId(next)) setTerritory(next);
        }}
        className={cn(
          "min-h-8 rounded-md border bg-transparent px-2 py-1 font-medium",
          tone === "dark"
            ? "border-primary-foreground/25 text-primary-foreground"
            : "border-border text-foreground",
        )}
      >
        {TERRITORIES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.shortLabel}
            {t.published ? "" : " · preview"}
          </option>
        ))}
      </select>
    </label>
  );
}
