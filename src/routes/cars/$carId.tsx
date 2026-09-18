import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DayPicker, type DateRange } from "react-day-picker";
import { Star, MapPin, Gauge, Users, Cog, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ProtectionPicker } from "@/components/booking/protection-picker";
import { TripQuoteLines } from "@/components/booking/trip-quote";
import { FavoriteButton } from "@/components/cars/favorite-button";
import { CarCard } from "@/components/cars/car-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listBookedRanges } from "@/lib/api";
import { carTitle, isOverlandCar } from "@/lib/catalog";
import { bodyTypeLabel } from "@/lib/us-vehicles";
import { formatDate, formatMoney, parseISODate, toISODate } from "@/lib/format";
import { blockedRanges, carBundle } from "@/lib/lookout-store";
import { DEFAULT_PROTECTION, quoteTrip, type GuestPlanId } from "@/lib/pricing";
import { useFleet } from "@/lib/use-fleet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cars/$carId")({
  loader: ({ params }) => ({ carId: params.carId }),
  component: CarDetail,
});

function CarDetail() {
  const { carId } = Route.useLoaderData();
  const { extraCars, extraHosts } = useFleet();
  const bundle = carBundle(carId, extraCars, extraHosts);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(0);
  const [range, setRange] = useState<DateRange | undefined>();
  const [protection, setProtection] = useState<GuestPlanId>(DEFAULT_PROTECTION);
  const [remoteBlocked, setRemoteBlocked] = useState<{ startDate: string; endDate: string }[]>([]);

  useEffect(() => {
    void listBookedRanges({ data: { carId } })
      .then(setRemoteBlocked)
      .catch(() => undefined);
  }, [carId]);

  if (!bundle) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">That car is no longer listed.</h1>
        <p className="mt-2 text-sm text-muted-foreground">It may have been taken down, or it is still loading.</p>
        <Link
          to="/cars"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Browse cars
        </Link>
      </main>
    );
  }

  const { car, park, host, reviews, nearby } = bundle;
  const booked = remoteBlocked.length ? remoteBlocked : blockedRanges(car.id, []);

  const bookedMatchers = useMemo(
    () =>
      booked.map((b) => ({
        from: parseISODate(b.startDate),
        to: new Date(parseISODate(b.endDate).getTime() - 86400000),
      })),
    [booked],
  );

  const fromISO = range?.from ? toISODate(range.from) : undefined;
  const toISO = range?.to ? toISODate(range.to) : undefined;
  const quote =
    fromISO && toISO && toISO > fromISO
      ? quoteTrip({ dailyCents: car.dailyCents, fromISO, toISO, protection })
      : null;

  function book() {
    if (!fromISO || !toISO || !quote) {
      toast("Choose pickup and return dates first.");
      return;
    }
    void navigate({
      to: "/book/$carId",
      params: { carId: car.id },
      search: { from: fromISO, to: toISO, protection },
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link to="/parks" className="hover:text-foreground">
          Parks
        </Link>
        <span>/</span>
        {park ? (
          <Link to="/parks/$parkSlug" params={{ parkSlug: park.slug }} className="hover:text-foreground">
            {park.name}
          </Link>
        ) : (
          "Park"
        )}
        <span>/</span>
        <span className="text-foreground">{carTitle(car)}</span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-xl">
          <img src={car.images[photo] ?? car.images[0]} alt="" className="aspect-[16/10] w-full object-cover" />
        </div>
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:max-h-[28rem] lg:overflow-y-auto">
          {car.images.map((src, i) => (
            <button
              key={src.slice(0, 48) + i}
              type="button"
              onClick={() => setPhoto(i)}
              className={cn("overflow-hidden rounded-xl", photo === i && "ring-2 ring-primary")}
            >
              <img src={src} alt="" className="aspect-[16/10] h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                {car.instantBook ? <Badge tone="pine">Instant book</Badge> : <Badge>Host approval</Badge>}
                {isOverlandCar(car) ? <Badge>Overland</Badge> : null}
                {car.camping ? <Badge>Camping</Badge> : null}
                {car.petFriendly ? <Badge>Pets</Badge> : null}
                {car.electric ? <Badge>Electric</Badge> : null}
              </div>
              <h1 className="mt-3 font-display text-4xl">{carTitle(car)}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="size-4 fill-primary text-primary" /> {car.ratingAvg} · {car.tripCount} trips
                </span>
                {park ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-4" /> {park.pickupTown}
                  </span>
                ) : null}
              </p>
            </div>
            <FavoriteButton id={car.id} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Users, label: `${car.seats} seats` },
              { icon: Cog, label: car.transmission },
              { icon: Gauge, label: car.mpg === "n/a" ? car.drivetrain : `${car.mpg} mpg` },
              { icon: MapPin, label: `${car.drivetrain} · ${bodyTypeLabel(car.category)}` },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border bg-card px-3 py-3 text-sm">
                <item.icon className="size-4 text-primary" />
                <p className="mt-2">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-foreground/90">{car.description}</p>

          {car.pickupNotes ? (
            <Card className="mt-6 p-5">
              <p className="text-sm font-medium">Pickup</p>
              <p className="mt-1 text-sm text-muted-foreground">{car.pickupNotes}</p>
            </Card>
          ) : null}

          <h2 className="mt-10 font-display text-2xl">On board</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {car.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          {host ? (
            <Card className="mt-10 flex gap-4 p-5">
              <img src={host.image} alt="" className="size-16 rounded-full object-cover" />
              <div>
                <p className="font-medium">{host.alias}</p>
                <p className="text-sm text-muted-foreground">
                  Host since {host.sinceYear} · {host.hometown} · {host.responseTime}
                </p>
                <p className="mt-2 text-sm">{host.bio}</p>
              </div>
            </Card>
          ) : null}

          {reviews.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-2xl">From the trail</h2>
              <div className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <Card key={r.id} className="p-5">
                    <p className="text-sm font-medium">
                      {r.authorAlias} · {r.rating}★
                    </p>
                    <p className="mt-1 font-display text-lg">{r.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}

          {nearby.length > 0 ? (
            <section className="mt-10">
              <h2 className="font-display text-2xl">Also at this park</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {nearby.map((c) => (
                  <CarCard key={c.id} car={c} park={park} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <p className="font-display text-3xl tabular-nums">
              {formatMoney(car.dailyCents)}
              <span className="text-base font-sans text-muted-foreground"> / day</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Plus 10% service, trip liability, and a protection plan.</p>

            <div className="rdp-root mt-4">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                disabled={[{ before: new Date() }, ...bookedMatchers]}
                numberOfMonths={1}
              />
            </div>
            {fromISO && toISO ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {formatDate(fromISO)} → {formatDate(toISO)}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Choose pickup and return.</p>
            )}

            <div className="mt-4">
              <ProtectionPicker value={protection} onChange={setProtection} tripDailyCents={car.dailyCents} />
            </div>

            {quote ? <div className="mt-4"><TripQuoteLines quote={quote} /></div> : null}

            <Button className="mt-4 w-full" size="lg" onClick={book}>
              Continue to book
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Sign in is required at checkout.{" "}
              <Link to="/protection" className="underline">
                Coverage terms
              </Link>
              .
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}
