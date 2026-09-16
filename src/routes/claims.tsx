import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { fileClaim, listMyBookings, listMyClaims, type BookingRow, type ClaimRow } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/claims")({ component: ClaimsPage });

function ClaimsPage() {
  const { user, isPending } = useCurrentUserState();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    void listMyBookings().then(setBookings);
    void listMyClaims().then(setClaims);
  }, [user]);

  if (isPending) return <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Loading claims…</main>;
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    try {
      await fileClaim({
        data: {
          bookingId: String(form.get("bookingId") ?? ""),
          kind: String(form.get("kind") ?? "damage") as "damage" | "theft" | "roadside" | "other",
          description: String(form.get("description") ?? ""),
        },
      });
      toast("Claim filed. The ranger desk will review it.");
      e.currentTarget.reset();
      setClaims(await listMyClaims());
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not file the claim.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Claims</p>
      <h1 className="mt-1 font-display text-4xl">Tell us what happened</h1>
      <p className="mt-2 text-muted-foreground">
        File against a confirmed trip. Ridge and Summit waivers are reviewed here. Trail incidents stay between you and the host.
      </p>

      <Card className="mt-8 p-6">
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No trips on this account yet.{" "}
            <Link to="/cars" className="underline">
              Book a car
            </Link>{" "}
            first.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bookingId">Trip</Label>
              <select id="bookingId" name="bookingId" required className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm">
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.confirmation} · {b.startDate} → {b.endDate} · {b.protection}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kind">Kind</Label>
              <select id="kind" name="kind" className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm">
                <option value="damage">Physical damage</option>
                <option value="theft">Theft</option>
                <option value="roadside">Roadside</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">What happened</Label>
              <Textarea id="description" name="description" rows={5} required minLength={10} placeholder="Where, when, and what you saw." />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Filing…" : "File claim"}
            </Button>
          </form>
        )}
      </Card>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Your files</h2>
        {claims.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No claims yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {claims.map((c) => (
              <Card key={c.id} className="p-4">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">{c.status}</p>
                <p className="font-medium">{c.kind}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
