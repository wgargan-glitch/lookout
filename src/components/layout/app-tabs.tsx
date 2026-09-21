import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Car, House, MapPinned, User } from "lucide-react";
import { useT } from "@/lib/use-locale";
import { cn } from "@/lib/utils";

export function AppTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useT();
  const tabs = [
    { to: "/", label: t("nav.home"), icon: House, active: (path: string) => path === "/" },
    { to: "/parks", label: t("nav.parks"), icon: MapPinned, active: (path: string) => path.startsWith("/parks") },
    { to: "/cars", label: t("nav.cars"), icon: Car, active: (path: string) => path.startsWith("/cars") || path.startsWith("/book") },
    { to: "/trips", label: t("nav.trips"), icon: CalendarDays, active: (path: string) => path.startsWith("/trips") },
    {
      to: "/account",
      label: t("nav.you"),
      icon: User,
      active: (path: string) =>
        path.startsWith("/account") || path.startsWith("/login") || path.startsWith("/host") || path.startsWith("/claims") || path.startsWith("/partners"),
    },
  ] as const;

  return (
    <nav
      aria-label={t("nav.home")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pt-1 pb-safe backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map((tab) => {
          const on = tab.active(pathname);
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-xs font-medium",
                  on ? "text-primary" : "text-muted-foreground",
                )}
              >
                <tab.icon className="size-5" strokeWidth={on ? 2.4 : 1.8} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
