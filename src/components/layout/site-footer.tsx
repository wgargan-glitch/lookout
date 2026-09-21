import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { TerritorySwitcher } from "@/components/layout/territory-switcher";
import { useT } from "@/lib/use-locale";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo onDark />
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">{t("footer.blurb")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <TerritorySwitcher tone="dark" />
            <LanguageSwitcher tone="dark" />
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-primary-foreground/55">{t("footer.explore")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/parks" className="hover:underline">
              {t("nav.parks")}
            </Link>
            <Link to="/cars" className="hover:underline">
              {t("footer.allCars")}
            </Link>
            <Link to="/get-the-app" className="hover:underline">
              {t("nav.app")}
            </Link>
            <Link to="/how-it-works" className="hover:underline">
              {t("nav.how")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide uppercase text-primary-foreground/55">{t("footer.account")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/host" className="hover:underline">
              {t("nav.list")}
            </Link>
            <Link to="/partners" className="hover:underline">
              {t("footer.hotels")}
            </Link>
            <Link to="/trips" className="hover:underline">
              {t("footer.yourTrips")}
            </Link>
            <Link to="/help" className="hover:underline">
              {t("footer.help")}
            </Link>
            <Link to="/support" className="hover:underline">
              {t("footer.helpDesk")}
            </Link>
            <Link to="/claims" className="hover:underline">
              {t("footer.claims")}
            </Link>
            <Link to="/privacy" className="hover:underline">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms" className="hover:underline">
              {t("footer.terms")}
            </Link>
            <Link to="/host-agreement" className="hover:underline">
              {t("footer.hostAgreement")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-4 py-4 text-center text-xs text-primary-foreground/55">
        {t("footer.tag")}
      </div>
    </footer>
  );
}
