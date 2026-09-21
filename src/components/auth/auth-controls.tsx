import { Link } from "@tanstack/react-router";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/use-locale";

export function AuthControls() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  if (isPending) {
    return <div className="h-11 w-24 animate-pulse rounded-md bg-secondary" aria-hidden />;
  }
  if (!user) {
    return (
      <Button asChild variant="ghost" className="hidden sm:inline-flex">
        <Link to="/login">{t("nav.signIn")}</Link>
      </Button>
    );
  }
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button asChild variant="ghost">
        <Link to="/account">{t("nav.account")}</Link>
      </Button>
      <UserButton />
    </div>
  );
}
