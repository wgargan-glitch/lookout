import { TERRITORIES, isTerritoryId, localizedTerritory } from "@/lib/territory";
import { useLocale, useT } from "@/lib/use-locale";
import { useTerritory } from "@/lib/use-territory";
import { cn } from "@/lib/utils";

export function TerritorySwitcher({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const id = useTerritory((s) => s.id);
  const setTerritory = useTerritory((s) => s.setTerritory);
  const locale = useLocale((s) => s.id);
  const t = useT();

  return (
    <label className="inline-flex items-center gap-2 text-xs">
      <span className={cn("hidden sm:inline", tone === "dark" ? "text-primary-foreground/70" : "text-muted-foreground")}>
        {t("region")}
      </span>
      <select
        aria-label={t("region")}
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
        {TERRITORIES.map((item) => {
          const label = localizedTerritory(item, locale);
          return (
            <option key={item.id} value={item.id}>
              {label.shortLabel}
              {item.published ? "" : ` · ${t("preview")}`}
            </option>
          );
        })}
      </select>
    </label>
  );
}
