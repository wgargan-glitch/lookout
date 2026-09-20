import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Car, House, MapPinned, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: House, active: (path: string) => path === "/" },
  { to: "/parks", label: "Parks", icon: MapPinned, active: (path: string) => path.startsWith("/parks") },
  { to: "/cars", label: "Cars", icon: Car, active: (path: string) => path.startsWith("/cars") || path.startsWith("/book") },
  { to: "/trips", label: "Trips", icon: CalendarDays, active: (path: string) => path.startsWith("/trips") },
  {
    to: "/account",
    label: "You",
    icon: User,
    active: (path: string) =>
      path.startsWith("/account") || path.startsWith("/login") || path.startsWith("/host") || path.startsWith("/claims") || path.startsWith("/partners"),
  },
] as const;

export function AppTabs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pt-1 pb-safe backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map((tab) => {
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
