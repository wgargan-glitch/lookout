import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cancelMyBooking, listMyBookings, type BookingRow } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { carTitle } from "@/lib/catalog";
import { formatDateRange, formatMoney } from "@/lib/format";
import { parkMap } from "@/lib/lookout-store";
import { planLabel } from "@/lib/pricing";
import { useFleet } from "@/lib/use-fleet";

export const Route = createFileRoute("/trips/")({
  component: TripsPage,
});

function TripsPage() {
  const { user, isPending } = useCurrentUserState();
  const { cars } = useFleet();
  const parks = parkMap();
  const [trips, setTrips] = useState<BookingRow[]>([]);

  useEffect(() => {
    if (!user) return;
    void listMyBookings()
      .then(setTrips)
      .catch(() => toast("Could not load trips."));
  }, [user]);

  if (isPending) return <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Loading trips…</main>;
  if (!user) return <RedirectToSignIn />;

  const mine = trips.filter((r) => r.userId === user.id);
  const hosting = trips.filter((r) => r.hostUserId === user.id && r.userId !== user.id);
  const upcoming = mine.filter((r) => r.status === "confirmed");
  const past = mine.filter((r) => r.status !== "confirmed");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Your trips</h1>
      <p className="mt-2 text-muted-foreground">Check in at pickup. Check out at return. Photos from your phone are the record.</p>

      {mine.length === 0 && hosting.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="font-display text-2xl">No trips yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Pick a park, then a car, then the dates.</p>
          <Button asChild className="mt-5">
            <Link to="/cars">Find a car</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="font-display text-2xl">Upcoming</h2>
            <div className="mt-4 space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing on the calendar.</p>
              ) : (
                upcoming.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    car={cars.find((c) => c.id === trip.carId)}
                    parkName={(() => {
                      const car = cars.find((c) => c.id === trip.carId);
                      return car ? parks.get(car.parkSlug)?.name : undefined;
                    })()}
                    onCancel={async () => {
                      try {
                        await cancelMyBooking({ data: { id: trip.id } });
                        setTrips(await listMyBookings());
                        toast("Trip cancelled.");
                      } catch (err) {
                        toast(err instanceof Error ? err.message : "Could not cancel.");
                      }
                    }}
                  />
                ))
              )}
            </div>
          </section>
          {hosting.filter((t) => t.status === "confirmed").length > 0 ? (
            <section>
              <h2 className="font-display text-2xl">Guests on your cars</h2>
              <div className="mt-4 space-y-3">
                {hosting
                  .filter((t) => t.status === "confirmed")
                  .map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      car={cars.find((c) => c.id === trip.carId)}
                      parkName={undefined}
                      hostView
                    />
                  ))}
              </div>
            </section>
          ) : null}
          {past.length > 0 ? (
            <section>
              <h2 className="font-display text-2xl">Cancelled</h2>
              <div className="mt-4 space-y-3">
                {past.map((trip) => (
                  <Card key={trip.id} className="p-4 text-sm text-muted-foreground">
                    {trip.confirmation} · {formatDateRange(trip.startDate, trip.endDate)}
                  </Card>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </main>
  );
}

function TripCard({
  trip,
  car,
  parkName,
  onCancel,
  hostView,
}: {
  trip: BookingRow;
  car?: { id: string; images: string[]; make: string; model: string; year: number; trim: string } | undefined;
  parkName?: string;
  onCancel?: () => void;
  hostView?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row">
      {car ? (
        <img src={car.images[0]} alt="" className="h-32 w-full rounded-lg object-cover sm:h-28 sm:w-40" />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          {car ? carTitle(car) : "Car"}
          {parkName ? ` · ${parkName}` : ""}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDateRange(trip.startDate, trip.endDate)} · {trip.days} days
        </p>
        <p className="mt-1 text-sm tabular-nums">{formatMoney(trip.totalCents)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Confirmation {trip.confirmation} · {planLabel(trip.protection)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {trip.checkinComplete ? <Badge tone="pine">Checked in</Badge> : <Badge tone="outline">Check-in due</Badge>}
          {trip.checkoutComplete ? <Badge tone="pine">Checked out</Badge> : trip.checkinComplete ? <Badge tone="outline">Check-out due</Badge> : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/trips/$tripId" params={{ tripId: trip.id }}>
              {hostView ? "View inspection" : trip.checkinComplete ? "Open trip" : "Check in"}
            </Link>
          </Button>
          {onCancel && !trip.checkinComplete ? (
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel trip
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="sm">
            <Link to="/claims">File a claim</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
