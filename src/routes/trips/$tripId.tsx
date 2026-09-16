import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cancelMyBooking, getMyTrip, type InspectionRecord } from "@/lib/api";
import { InspectionForm } from "@/components/trips/inspection-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { carTitle } from "@/lib/catalog";
import { formatDateRange, formatMoney } from "@/lib/format";
import { CLEANLINESS, fuelLabel } from "@/lib/inspection";

export const Route = createFileRoute("/trips/$tripId")({
  loader: ({ params }) => {
    if (!params.tripId) throw notFound();
    return { tripId: params.tripId };
  },
  component: TripDetailPage,
});

function TripDetailPage() {
  const { user, isPending } = useCurrentUserState();
  const { tripId } = Route.useLoaderData();
  const [trip, setTrip] = useState<Awaited<ReturnType<typeof getMyTrip>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const next = await getMyTrip({ data: { id: tripId } });
    setTrip(next);
  }

  useEffect(() => {
    if (!user) return;
    void reload().catch((err) => setError(err instanceof Error ? err.message : "Could not load the trip."));
  }, [user, tripId]);

  if (isPending || (user && !trip && !error)) {
    return <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Opening the trip…</main>;
  }
  if (!user) return <RedirectToSignIn />;
  if (error || !trip) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">That trip is not here.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button asChild className="mt-6">
          <Link to="/trips">Back to trips</Link>
        </Button>
      </main>
    );
  }

  const { booking, car, park, pickupNotes, role, checkin, checkout } = trip;
  const guest = role === "guest";
  const canInspect = guest && booking.status === "confirmed";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/trips" className="text-sm text-muted-foreground hover:text-foreground">
        ← Trips
      </Link>
      <div className="mt-4 overflow-hidden rounded-xl">
        {car ? <img src={car.images[0]} alt="" className="aspect-[16/8] w-full object-cover" /> : null}
      </div>
      <p className="mt-6 text-sm font-medium tracking-wide text-sage uppercase">
        {booking.confirmation} · {booking.protection}
      </p>
      <h1 className="mt-1 font-display text-4xl">{car ? carTitle(car) : "Trip"}</h1>
      <p className="mt-2 text-muted-foreground">
        {park?.name ?? "Park"} · {formatDateRange(booking.startDate, booking.endDate)} · {formatMoney(booking.totalCents)}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {booking.checkinComplete ? <Badge tone="pine">Checked in</Badge> : <Badge tone="outline">Check-in due</Badge>}
        {booking.checkoutComplete ? <Badge tone="pine">Checked out</Badge> : booking.checkinComplete ? <Badge tone="outline">Check-out due</Badge> : null}
        {role === "host" ? <Badge>Host view</Badge> : null}
      </div>

      {pickupNotes ? (
        <Card className="mt-6 p-5">
          <p className="text-sm font-medium">Pickup</p>
          <p className="mt-1 text-sm text-muted-foreground">{pickupNotes}</p>
        </Card>
      ) : null}

      <Card className="mt-6 p-5">
        {canInspect || checkin ? (
          <InspectionForm
            key={checkin?.id ?? "checkin"}
            bookingId={booking.id}
            kind="checkin"
            electric={Boolean(car?.electric)}
            existing={checkin}
            readOnly={!canInspect}
            onDone={() => void reload()}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Check-in opens for the guest on a confirmed trip.</p>
        )}
      </Card>

      {checkin?.status === "complete" ? (
        <Card className="mt-6 p-5">
          {canInspect || checkout ? (
            <InspectionForm
              key={checkout?.id ?? "checkout"}
              bookingId={booking.id}
              kind="checkout"
              electric={Boolean(car?.electric)}
              existing={checkout}
              readOnly={!canInspect}
              onDone={() => void reload()}
            />
          ) : (
            <InspectionSnapshot title="Check-out" record={checkout} electric={Boolean(car?.electric)} />
          )}
        </Card>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-2">
        {guest && booking.status === "confirmed" && !booking.checkinComplete ? (
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await cancelMyBooking({ data: { id: booking.id } });
                toast("Trip cancelled.");
                setTrip(await getMyTrip({ data: { id: tripId } }));
              } catch (err) {
                toast(err instanceof Error ? err.message : "Could not cancel.");
              }
            }}
          >
            Cancel trip
          </Button>
        ) : null}
        <Button asChild variant="outline">
          <Link to="/claims">File a claim</Link>
        </Button>
        {car ? (
          <Button asChild variant="ghost">
            <Link to="/cars/$carId" params={{ carId: car.id }}>
              Listing
            </Link>
          </Button>
        ) : null}
      </div>
    </main>
  );
}

function InspectionSnapshot({
  title,
  record,
  electric,
}: {
  title: string;
  record: InspectionRecord | null;
  electric: boolean;
}) {
  if (!record || record.status !== "complete") return null;
  const clean = CLEANLINESS.find((c) => c.id === record.cleanliness);
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {clean?.label ?? "Cleanliness noted"} · {fuelLabel(record.fuelEighths ?? 0, electric)} · {record.odometer?.toLocaleString()} mi
        {record.noDamage ? " · no damage noted" : ` · ${record.damage.length} mark(s)`}
      </p>
    </div>
  );
}
