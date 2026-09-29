import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AppTabs } from "@/components/layout/app-tabs";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TerritorySwitcher } from "@/components/layout/territory-switcher";
import { useDetectLocale } from "@/lib/use-locale";
import { useDetectTerritory } from "@/lib/use-territory";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: ReactNode }) {
  useDetectTerritory();
  useDetectLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const rove = pathname === "/rove" || pathname.startsWith("/rove/");

  return (
    <div className={cn("flex flex-col", rove ? "h-svh overflow-hidden" : "min-h-svh pb-tab")}>
      <SiteHeader />
      {!rove ? (
        <div className="flex items-center justify-end gap-3 border-b border-border bg-card px-4 py-2 md:hidden">
          <TerritorySwitcher />
          <LanguageSwitcher />
        </div>
      ) : null}
      <div className={cn("flex-1", rove && "min-h-0")}>{children}</div>
      {!rove ? (
        <div className="hidden md:block">
          <SiteFooter />
        </div>
      ) : null}
      {!rove ? <AppTabs /> : null}
    </div>
  );
}
