import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { OwnInsurancePanel, ProtectionPicker } from "@/components/booking/protection-picker";
import { TripQuoteLines } from "@/components/booking/trip-quote";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { carTitle, isCatalogListing, parkBookingsOpen } from "@/lib/catalog";
import { formatDateRange, formatMoney } from "@/lib/format";
import { carBundle } from "@/lib/lookout-store";
import {
  DEFAULT_PROTECTION,
  getPlan,
  isGuestPlanId,
  parseProtection,
  quoteTrip,
  TRIP_LIABILITY,
  type GuestPlanId,
} from "@/lib/pricing";
import { useFleet } from "@/lib/use-fleet";

function validateBookSearch(search: Record<string, unknown>) {
  const from = typeof search.from === "string" ? search.from : "";
  const to = typeof search.to === "string" ? search.to : "";
  const parsed = parseProtection(search.protection);
  const protection: GuestPlanId = isGuestPlanId(parsed) ? parsed : DEFAULT_PROTECTION;
  return { from, to, protection };
}

export const Route = createFileRoute("/book/$carId")({
  validateSearch: validateBookSearch,
  loader: ({ params }) => {
    if (!params.carId) throw notFound();
    return { carId: params.carId };
  },
  component: BookPage,
});

function BookPage() {
  const { user, isPending } = useCurrentUserState();
  const { carId } = Route.useLoaderData();
  const search = Route.useSearch();
  const { extraCars, extraHosts } = useFleet();
  const bundle = carBundle(carId, extraCars, extraHosts);
  const [protection, setProtection] = useState<GuestPlanId>(search.protection);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ id: string; confirmation: string; totalCents: number } | null>(null);

  const { from, to } = search;

  if (!bundle) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">That car is no longer listed.</h1>
        <Button asChild className="mt-6">
          <Link to="/cars">Browse cars</Link>
        </Button>
      </main>
    );
  }

  const { car, park } = bundle;
  if (isCatalogListing(car.id)) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Those dates are already spoken for.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This car is booked out. Nearby listings may still have dates.
        </p>
        <Button asChild className="mt-6">
          <Link to="/cars/$carId" params={{ carId: car.id }}>
            Back to the car
          </Link>
        </Button>
      </main>
    );
  }

  if (isPending) {
    return <main className="mx-auto max-w-xl px-4 py-16 text-sm text-muted-foreground">Checking your account…</main>;
  }
  if (!user) return <RedirectToSignIn />;
  if (!parkBookingsOpen(park)) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">This car isn’t available to book right now.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If you live in the gateway town, you can list yours.
        </p>
        <Button asChild className="mt-6">
          <Link to="/host">List a car</Link>
        </Button>
      </main>
    );
  }
  const quote =
    from && to && to > from
      ? quoteTrip({ dailyCents: car.dailyCents, fromISO: from, toISO: to, protection })
      : null;
  const plan = getPlan(protection);

  async function confirm() {
    if (!quote) return;
    setPending(true);
    try {
      const result = await createBooking({
        data: { carId: car.id, startDate: from, endDate: to, protection },
      });
      setDone({ id: result.id, confirmation: result.confirmation, totalCents: result.totalCents });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not complete the booking.");
    } finally {
      setPending(false);
    }
  }

  if (!quote) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Dates are missing.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Go back to the listing and choose pickup and return.</p>
        <Button asChild className="mt-6">
          <Link to="/cars/$carId" params={{ carId: car.id }}>
            Back to the car
          </Link>
        </Button>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-sm font-medium tracking-wide text-sage uppercase">Confirmed</p>
        <h1 className="mt-2 font-display text-4xl">Trip is booked.</h1>
        <p className="mt-3 text-muted-foreground">
          {carTitle(car)} in {park?.pickupTown}. {formatDateRange(from, to)}. Check in on your phone when you pick up the keys.
        </p>
        <Card className="mt-8 p-6 text-left">
          <p className="text-sm text-muted-foreground">Confirmation</p>
          <p className="font-display text-2xl tracking-wide">{done.confirmation}</p>
          <p className="mt-3 text-sm">
            Total <span className="tabular-nums font-medium">{formatMoney(done.totalCents)}</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {TRIP_LIABILITY.name} and {plan.name} protection are on this trip. Walk the car and photograph it at pickup before you drive.
          </p>
        </Card>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/trips/$tripId" params={{ tripId: done.id }}>
              Check in at pickup
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/trips">All trips</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Checkout</p>
      <h1 className="mt-1 font-display text-4xl">Confirm this trip</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <img src={car.images[0]} alt="" className="aspect-[16/10] w-full object-cover" />
            <div className="p-5">
              <p className="font-medium">{carTitle(car)}</p>
              <p className="text-sm text-muted-foreground">
                {park?.name} · Pickup in {park?.pickupTown}
              </p>
              <p className="mt-3 text-sm">{formatDateRange(from, to)}</p>
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-medium">Protection for this trip</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose what you might owe if the car is damaged. Standard is the usual pick.
            </p>
            <div className="mt-3">
              <ProtectionPicker value={protection} onChange={setProtection} tripDailyCents={car.dailyCents} />
            </div>
            <div className="mt-3">
              <OwnInsurancePanel protection={protection} />
            </div>
          </Card>
        </div>
        <Card className="h-fit p-5">
          <TripQuoteLines quote={quote} />
          <p className="mt-3 text-xs text-muted-foreground">{TRIP_LIABILITY.summary}</p>
          <Button className="mt-5 w-full" size="lg" disabled={pending} onClick={() => void confirm()}>
            {pending ? "Booking…" : "Confirm booking"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            No card is charged yet. We’ll save the reservation on your account.
          </p>
        </Card>
      </div>
    </main>
  );
}

