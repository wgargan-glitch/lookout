import type { ReactNode } from "react";
import { AppTabs } from "@/components/layout/app-tabs";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TerritorySwitcher } from "@/components/layout/territory-switcher";
import { territoryById, localizedTerritory } from "@/lib/territory";
import { useDetectLocale, useLocale, useT } from "@/lib/use-locale";
import { useDetectTerritory, useTerritory } from "@/lib/use-territory";

export function SiteShell({ children }: { children: ReactNode }) {
  useDetectTerritory();
  useDetectLocale();
  const id = useTerritory((s) => s.id);
  const locale = useLocale((s) => s.id);
  const territory = localizedTerritory(territoryById(id), locale);
  const t = useT();

  return (
    <div className="flex min-h-svh flex-col pb-tab">
      <SiteHeader />
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2 md:hidden">
        <p className="text-xs text-muted-foreground">{t("planningFor")}</p>
        <div className="flex items-center gap-2">
          <TerritorySwitcher />
          <LanguageSwitcher />
        </div>
      </div>
      {territory.published ? null : (
        <p className="border-b border-border bg-secondary px-4 py-2 text-center text-xs text-muted-foreground">
          {t("previewBanner", { name: territory.name })}
        </p>
      )}
      <div className="flex-1">{children}</div>
      <div className="hidden md:block">
        <SiteFooter />
      </div>
      <AppTabs />
    </div>
  );
}
