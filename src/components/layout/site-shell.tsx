import type { ReactNode } from "react";
import { AppTabs } from "@/components/layout/app-tabs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TerritorySwitcher } from "@/components/layout/territory-switcher";
import { territoryById } from "@/lib/territory";
import { useDetectTerritory, useTerritory } from "@/lib/use-territory";

export function SiteShell({ children }: { children: ReactNode }) {
  useDetectTerritory();
  const id = useTerritory((s) => s.id);
  const territory = territoryById(id);

  return (
    <div className="flex min-h-svh flex-col pb-tab">
      <SiteHeader />
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2 md:hidden">
        <p className="text-xs text-muted-foreground">Planning for</p>
        <TerritorySwitcher />
      </div>
      {territory.published ? null : (
        <p className="border-b border-border bg-secondary px-4 py-2 text-center text-xs text-muted-foreground">
          {territory.name} is in preview — parks are listed, guest trips are not open yet. Switch region anytime to plan.
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
