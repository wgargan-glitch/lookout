import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { carTitle } from "@/lib/catalog";
import { formatDateRange, formatMoney } from "@/lib/format";
import { carBundle } from "@/lib/lookout-store";
import { PROTECTION_PLANS, quoteTrip, type ProtectionId } from "@/lib/pricing";
import { useFleet } from "@/lib/use-fleet";

function validateBookSearch(search: Record<string, unknown>) {
  const from = typeof search.from === "string" ? search.from : "";
  const to = typeof search.to === "string" ? search.to : "";
  const protection =
    search.protection === "trail" || search.protection === "ridge" || search.protection === "summit"
      ? (search.protection as ProtectionId)
      : "ridge";
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
  const { from, to, protection } = Route.useSearch();
  const { extraCars, extraHosts } = useFleet();
  const bundle = carBundle(carId, extraCars, extraHosts);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ id: string; confirmation: string; totalCents: number } | null>(null);

  if (isPending) {
    return <main className="mx-auto max-w-xl px-4 py-16 text-sm text-muted-foreground">Checking your account…</main>;
  }
  if (!user) return <RedirectToSignIn />;

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
  const quote =
    from && to && to > from
      ? quoteTrip({ dailyCents: car.dailyCents, fromISO: from, toISO: to, protection })
      : null;
  const plan = PROTECTION_PLANS.find((p) => p.id === protection);

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
            {plan?.name} protection is on this trip. Walk the car and photograph it at pickup before you drive.
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
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_280px]">
        <Card className="overflow-hidden">
          <img src={car.images[0]} alt="" className="aspect-[16/10] w-full object-cover" />
          <div className="p-5">
            <p className="font-medium">{carTitle(car)}</p>
            <p className="text-sm text-muted-foreground">
              {park?.name} · Pickup in {park?.pickupTown}
            </p>
            <p className="mt-3 text-sm">{formatDateRange(from, to)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {plan?.name} protection · {quote.days} days
            </p>
          </div>
        </Card>
        <Card className="h-fit p-5">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt>Trip</dt>
              <dd className="tabular-nums">{formatMoney(quote.tripCents)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Service fee</dt>
              <dd className="tabular-nums">{formatMoney(quote.serviceCents)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Protection</dt>
              <dd className="tabular-nums">{formatMoney(quote.protectionCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatMoney(quote.totalCents)}</dd>
            </div>
          </dl>
          <Button className="mt-5 w-full" size="lg" disabled={pending} onClick={() => void confirm()}>
            {pending ? "Booking…" : "Confirm booking"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            No card is charged in this build. The trip, waiver, and confirmation are stored on your account.{" "}
            <Link to="/protection" className="underline">
              Coverage terms
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  );
}
