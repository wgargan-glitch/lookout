import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, MapPinned, Shield } from "lucide-react";
import { TripSearch } from "@/components/booking/trip-search";
import { CarCard } from "@/components/cars/car-card";
import { ParkCard } from "@/components/parks/park-card";
import { PhoneFrame } from "@/components/layout/phone-frame";
import { Button } from "@/components/ui/button";
import { carTitle, isOverlandCar } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { useTerritoryCatalog } from "@/lib/use-territory-catalog";
import { useStandalone } from "@/lib/use-install-prompt";
import { useT } from "@/lib/use-locale";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { parks, cars, featured: homeParks, territory } = useTerritoryCatalog();
  const t = useT();
  const featuredIds = [
    "bronco-yosemite",
    "wrangler-grand-canyon",
    "landcruiser-denali",
    "rav4-haleakala",
    "outback-rainier",
    "tacoma-big-bend",
  ];
  const featured = featuredIds
    .map((id) => cars.find((c) => c.id === id))
    .filter((c): c is (typeof cars)[number] => Boolean(c));
  const parkCounts = new Map<string, number>();
  for (const car of cars) parkCounts.set(car.parkSlug, (parkCounts.get(car.parkSlug) ?? 0) + 1);
  const overland = cars.filter((c) => isOverlandCar(c) || c.camping).slice(0, 4);

  return (
    <main>
      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src={territory.heroImage}
          alt={territory.heroAlt}
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/15" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end gap-8 px-4 pt-24 pb-12">
          <div className="max-w-2xl text-primary-foreground">
            <p className="text-sm font-medium tracking-[0.18em] uppercase text-primary-foreground/75">
              {territory.kicker}
            </p>
            <h1 className="mt-3 font-display text-5xl font-medium tracking-tight md:text-6xl">
              {territory.headline}
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/80 md:text-lg">
              {territory.intro}
            </p>
          </div>
          <TripSearch parks={parks} />
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-3">
          {[
            { icon: MapPinned, title: t("home.parksCount", { n: parks.length }), body: territory.parksIntro },
            { icon: KeyRound, title: t("home.keysTitle"), body: t("home.keysBody") },
            { icon: Shield, title: t("home.meetTitle"), body: t("home.meetBody") },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-wide text-sage uppercase">{t("home.mapKicker")}</p>
            <h2 className="mt-1 font-display text-3xl md:text-4xl">{t("home.mapTitle")}</h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/parks">
              {t("home.allParks")} <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeParks.map((park) => (
            <ParkCard key={park.slug} park={park} count={parkCounts.get(park.slug) ?? 0} />
          ))}
        </div>
      </section>

      {featured.length ? (
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium tracking-wide text-sage uppercase">{t("home.lotKicker")}</p>
              <h2 className="mt-1 font-display text-3xl md:text-4xl">{t("home.lotTitle")}</h2>
            </div>
            <Button asChild variant="ghost">
              <Link to="/cars">
                {t("home.browseAll")} <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                park={parks.find((p) => p.slug === car.parkSlug)}
              />
            ))}
          </div>
        </div>
      </section>
      ) : (
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-medium tracking-wide text-sage uppercase">{t("home.lotKicker")}</p>
          <h2 className="mt-1 font-display text-3xl md:text-4xl">{t("home.hostsTitle")}</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">{territory.emptyCars}</p>
          <Button asChild className="mt-6">
            <Link to="/host">{territory.hostCta}</Link>
          </Button>
        </div>
      </section>
      )}

      {overland.length >= 2 ? (
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-medium tracking-wide text-sage uppercase">{t("home.overlandKicker")}</p>
        <h2 className="mt-1 font-display text-3xl md:text-4xl">{t("home.overlandTitle")}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {overland.slice(0, 2).map((car) => {
            const park = parks.find((p) => p.slug === car.parkSlug);
            return (
              <Link
                key={car.id}
                to="/cars/$carId"
                params={{ carId: car.id }}
                className="group relative min-h-72 overflow-hidden rounded-xl"
              >
                <img
                  src={car.images[0]}
                  alt={carTitle(car)}
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                  <p className="font-display text-2xl">{carTitle(car)}</p>
                  <p className="text-sm text-primary-foreground/80">
                    {park?.name} · {formatMoney(car.dailyCents)} {t("home.day")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      ) : null}

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3">
          {[
            { n: "01", t: t("home.step1t"), d: t("home.step1d", { n: parks.length }) },
            { n: "02", t: t("home.step2t"), d: territory.published ? t("home.step2open") : t("home.step2closed") },
            { n: "03", t: t("home.step3t"), d: t("home.step3d") },
          ].map((step) => (
            <div key={step.n}>
              <p className="font-display text-4xl text-sage">{step.n}</p>
              <h3 className="mt-3 font-display text-2xl">{step.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      <AppPromo />

      <section className="relative overflow-hidden">
        <img src="/images/cars/transit-yosemite.jpg" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-primary-foreground">
          <p className="text-sm font-medium tracking-wide uppercase text-primary-foreground/70">{t("home.hostsKicker")}</p>
          <h2 className="mt-2 max-w-xl font-display text-4xl md:text-5xl">{t("home.hostsHeadline")}</h2>
          <p className="mt-4 max-w-lg text-primary-foreground/80">{t("home.hostsBody")}</p>
          <Button asChild size="lg" className="mt-8 bg-card text-foreground hover:bg-secondary">
            <Link to="/host">{territory.hostCta}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function AppPromo() {
  const standalone = useStandalone();
  const t = useT();
  if (standalone) return null;
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <p className="text-sm font-medium tracking-wide text-sage uppercase">{t("home.appKicker")}</p>
        <h2 className="mt-1 font-display text-3xl md:text-4xl">{t("home.appTitle")}</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">{t("home.appBody")}</p>
        <Button asChild className="mt-6">
          <Link to="/get-the-app">{t("home.appCta")}</Link>
        </Button>
      </div>
      <div className="mx-auto w-full max-w-xs">
        <PhoneFrame os="ios" src="/images/app/phone-home.png" />
      </div>
    </section>
  );
}
