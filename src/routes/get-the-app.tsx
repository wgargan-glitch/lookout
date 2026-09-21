import { createFileRoute, Link } from "@tanstack/react-router";
import { Share, Smartphone } from "lucide-react";
import { PhoneDuo } from "@/components/layout/phone-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInstallPrompt } from "@/lib/use-install-prompt";

export const Route = createFileRoute("/get-the-app")({
  component: GetTheAppPage,
});

function StoreBadge({
  kicker,
  title,
  href,
  onClick,
}: {
  kicker: string;
  title: string;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "inline-flex min-h-14 min-w-40 flex-col items-start justify-center rounded-lg bg-ink px-5 py-2 text-left text-paper";
  const label = `${kicker} ${title}`;
  const inner = (
    <>
      <span className="text-xs font-medium tracking-wide uppercase text-paper/70">{kicker}</span>
      <span className="font-display text-xl leading-tight">{title}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={className} aria-label={label}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      {inner}
    </button>
  );
}

function GetTheAppPage() {
  const { canInstall, installed, install } = useInstallPrompt();

  return (
    <main>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-12">
          <div>
            <p className="text-sm font-medium tracking-wide text-sage uppercase">iPhone & Android</p>
            <h1 className="mt-1 font-display text-4xl md:text-5xl">Lookout on your phone.</h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Parks, cars, and trips as a home-screen app. Same account as the website — your bookings
              and listings come with you.
            </p>
            {installed ? (
              <p className="mt-6 text-sm font-medium text-primary">Lookout is already on this phone.</p>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3">
                <StoreBadge kicker="Add to" title="iPhone" href="/?install=1&platform=ios" />
                {canInstall ? (
                  <StoreBadge kicker="Install on" title="Android" onClick={() => void install()} />
                ) : (
                  <StoreBadge kicker="Install on" title="Android" href="#install" />
                )}
              </div>
            )}
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link to="/parks">Browse parks</Link>
              </Button>
            </div>
          </div>
          <PhoneDuo iosSrc="/images/app/phone-home.png" androidSrc="/images/app/phone-parks.png" />
        </div>
      </section>

      <section id="install" className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-medium tracking-wide text-sage uppercase">iPhone</p>
            <h2 className="mt-1 font-display text-2xl">Safari, then the share sheet</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>1. Open Lookout in Safari (Chrome on iPhone cannot install it).</li>
              <li>
                2. Tap Share <Share className="mx-1 inline size-3.5 align-text-bottom" /> at the bottom of Safari.
              </li>
              <li>3. Scroll to Add to Home Screen, then Add.</li>
              <li>4. Lookout sits next to Messages. It opens full-screen, with tabs at the bottom.</li>
            </ol>
            <Button asChild className="mt-6">
              <a href="/?install=1&platform=ios">iPhone install walkthrough</a>
            </Button>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium tracking-wide text-sage uppercase">Android</p>
            <h2 className="mt-1 font-display text-2xl">Chrome, then Install app</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>1. Open Lookout in Chrome.</li>
              <li>2. If you see Install Lookout, tap it.</li>
              <li>3. Otherwise: Chrome menu → Install app, or Add to Home screen.</li>
              <li>4. It installs with the Lookout icon. Same account, same trips.</li>
            </ol>
            {canInstall ? (
              <Button className="mt-6" onClick={() => void install()}>
                <Smartphone /> Install Lookout
              </Button>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                Open Lookout in Chrome on Android to install it on your home screen.
              </p>
            )}
          </Card>
        </div>
      </section>
    </main>
  );
}
