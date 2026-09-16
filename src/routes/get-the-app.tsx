import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Share, Smartphone } from "lucide-react";
import { PhoneDuo } from "@/components/layout/phone-frame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OWNER_CHECKLIST, STORE_APP_ID, STORE_LISTING } from "@/lib/store-kit";
import { useInstallPrompt } from "@/lib/use-install-prompt";
import { cn } from "@/lib/utils";

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
              Parks, cars, and trips as a home-screen app today. Store listings are wrapped and waiting
              on Apple and Google developer accounts — no Mac required to compile the iPhone app.
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
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/parks">Browse parks</Link>
              </Button>
              <Button asChild variant="ghost">
                <a href="#stores">Store wrap</a>
              </Button>
            </div>
          </div>
          <PhoneDuo iosSrc="/images/app/phone-home.png" androidSrc="/images/app/phone-parks.png" />
        </div>
      </section>

      <section id="install" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-medium tracking-wide text-sage uppercase">iPhone · today</p>
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
            <p className="text-sm font-medium tracking-wide text-sage uppercase">Android · today</p>
            <h2 className="mt-1 font-display text-2xl">Chrome, then Install app</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>1. Open Lookout in Chrome.</li>
              <li>2. If you see Install Lookout, tap it — that is the real Android install prompt.</li>
              <li>3. Otherwise: Chrome menu → Install app, or Add to Home screen.</li>
              <li>4. It installs with the Lookout icon. Same account, same trips.</li>
            </ol>
            {canInstall ? (
              <Button className="mt-6" onClick={() => void install()}>
                <Smartphone /> Install Lookout
              </Button>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                The Android install button appears in Chrome once Lookout is opened over a secure connection.
              </p>
            )}
          </Card>
        </div>
      </section>

      <section id="stores" className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-medium tracking-wide text-sage uppercase">App Store & Play Store</p>
        <h2 className="mt-1 font-display text-3xl md:text-4xl">The wrap is built. You enroll.</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Apple and Google will not take a website. Lookout now has native shells (bundle id{" "}
          <span className="font-medium text-foreground">{STORE_APP_ID}</span>
          ), store icons, screenshots, privacy, terms, and account deletion. iPhone compiles in the
          cloud — you do not need a Mac. The listings go live after your developer accounts are approved.
        </p>

        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {OWNER_CHECKLIST.map((item) => (
            <li key={item.id}>
              <Card className="flex h-full gap-3 p-5">
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
                    item.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {item.done ? <Check className="size-3.5" /> : <span className="text-xs font-medium">You</span>}
                </span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <p className="text-sm font-medium tracking-wide text-sage uppercase">iPhone</p>
            <h3 className="mt-1 font-display text-2xl">Apple Developer Program</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              $99 per year. Enroll as an individual at developer.apple.com/programs. After Apple
              approves, send the Team ID. Cloud Xcode (Xcode 26) archives the wrap; TestFlight is the
              first install on your phone.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <a href="https://developer.apple.com/programs/" target="_blank" rel="noreferrer">
                Open Apple enrollment
              </a>
            </Button>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium tracking-wide text-sage uppercase">Android</p>
            <h3 className="mt-1 font-display text-2xl">Google Play Console</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              $25 one-time. Identity check usually takes a day or two. We upload a signed Android App
              Bundle ({STORE_APP_ID}) to a testing track, then production.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <a href="https://play.google.com/console" target="_blank" rel="noreferrer">
                Open Play Console
              </a>
            </Button>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <h3 className="font-display text-2xl">What reviewers will see</h3>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">Lookout — {STORE_LISTING.subtitle}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Category / age</dt>
              <dd className="font-medium">Travel · {STORE_LISTING.ageRating}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Privacy</dt>
              <dd>
                <Link to="/privacy" className="underline">
                  Privacy policy
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Terms</dt>
              <dd>
                <Link to="/terms" className="underline">
                  Terms of service
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Demo login</dt>
              <dd className="font-medium">Create with email on Sign in — no special account required.</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">iPhone sign-in</dt>
              <dd className="font-medium">Email and password only (no Google/X), so Sign in with Apple is not required.</dd>
            </div>
          </dl>
        </Card>
      </section>
    </main>
  );
}
