import { Link, useRouterState } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AuthControls } from "@/components/auth/auth-controls";
import { Logo } from "@/components/brand/logo";
import { TerritorySwitcher } from "@/components/layout/territory-switcher";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/favorites";
import { useStandalone } from "@/lib/use-install-prompt";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/parks", label: "Parks" },
  { to: "/cars", label: "Cars" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/get-the-app", label: "Get the app" },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const saved = useFavorites((s) => s.ids.length);
  const standalone = useStandalone();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 pt-safe backdrop-blur-md">
      <div className="mx-auto flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:max-w-6xl">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.filter((item) => !(standalone && item.to === "/get-the-app")).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === item.to && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <TerritorySwitcher />
          </div>
          <Link
            to="/favorites"
            className="relative inline-flex size-11 items-center justify-center rounded-md text-foreground hover:bg-secondary"
            aria-label="Saved cars"
          >
            <Heart className="size-5" />
            {saved > 0 ? (
              <span className="absolute top-1.5 right-1.5 min-w-4 rounded-full bg-primary px-1 text-center text-xs leading-4 text-primary-foreground tabular-nums">
                {saved}
              </span>
            ) : null}
          </Link>
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/trips">Trips</Link>
          </Button>
          <Button asChild className="hidden md:inline-flex">
            <Link to="/host">List a car</Link>
          </Button>
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
