import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { TerritorySwitcher } from "@/components/layout/territory-switcher";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo onDark />
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">
            Peer-to-peer cars from people who live at the park gate. Switch region anytime — US is live; the others are maps you can plan against.
          </p>
          <div className="mt-4">
            <TerritorySwitcher tone="dark" />
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-primary-foreground/55">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/parks" className="hover:underline">
              Parks
            </Link>
            <Link to="/cars" className="hover:underline">
              All cars
            </Link>
            <Link to="/get-the-app" className="hover:underline">
              Get the app
            </Link>
            <Link to="/how-it-works" className="hover:underline">
              How it works
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-primary-foreground/55">Account</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/host" className="hover:underline">
              List a car
            </Link>
            <Link to="/partners" className="hover:underline">
              Hotels & campgrounds
            </Link>
            <Link to="/trips" className="hover:underline">
              Your trips
            </Link>
            <Link to="/help" className="hover:underline">
              Help
            </Link>
            <Link to="/support" className="hover:underline">
              Help desk
            </Link>
            <Link to="/claims" className="hover:underline">
              Claims
            </Link>
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
            <Link to="/host-agreement" className="hover:underline">
              Host agreement
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-4 py-4 text-center text-xs text-primary-foreground/55">
        Private cars. Public lands. Not affiliated with the National Park Service.
      </div>
    </footer>
  );
}
