import type { ReactNode } from "react";
import { AppTabs } from "@/components/layout/app-tabs";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TerritorySwitcher } from "@/components/layout/territory-switcher";
import { useDetectLocale } from "@/lib/use-locale";
import { useDetectTerritory } from "@/lib/use-territory";

export function SiteShell({ children }: { children: ReactNode }) {
  useDetectTerritory();
  useDetectLocale();

  return (
    <div className="flex min-h-svh flex-col pb-tab">
      <SiteHeader />
      <div className="flex items-center justify-end gap-3 border-b border-border bg-card px-4 py-2 md:hidden">
        <TerritorySwitcher />
        <LanguageSwitcher />
      </div>
      <div className="flex-1">{children}</div>
      <div className="hidden md:block">
        <SiteFooter />
      </div>
      <AppTabs />
    </div>
  );
}
