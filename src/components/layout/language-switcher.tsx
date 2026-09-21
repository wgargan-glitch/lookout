import { LOCALE_IDS, isLocaleId } from "@/lib/locale";
import { messages } from "@/lib/i18n";
import { useLocale } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const id = useLocale((s) => s.id);
  const setLocale = useLocale((s) => s.setLocale);
  const t = messages(id);

  return (
    <label className="inline-flex items-center gap-2 text-xs">
      <span className={cn("hidden sm:inline", tone === "dark" ? "text-primary-foreground/70" : "text-muted-foreground")}>
        {t.language}
      </span>
      <select
        aria-label={t.language}
        value={id}
        onChange={(e) => {
          const next = e.target.value;
          if (isLocaleId(next)) setLocale(next);
        }}
        className={cn(
          "min-h-8 rounded-md border bg-transparent px-2 py-1 font-medium",
          tone === "dark"
            ? "border-primary-foreground/25 text-primary-foreground"
            : "border-border text-foreground",
        )}
      >
        {LOCALE_IDS.map((loc) => (
          <option key={loc} value={loc}>
            {messages(loc).langName}
          </option>
        ))}
      </select>
    </label>
  );
}
