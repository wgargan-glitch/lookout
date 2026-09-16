import type { ReactNode } from "react";
import { AppTabs } from "@/components/layout/app-tabs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col pb-tab">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <div className="hidden md:block">
        <SiteFooter />
      </div>
      <AppTabs />
    </div>
  );
}