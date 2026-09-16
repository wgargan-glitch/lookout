import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createListing } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES, PARKS, groupedParks, type Car } from "@/lib/catalog";

export const Route = createFileRoute("/host")({
  component: HostPage,
});

function HostPage() {
  const { user, isPending } = useCurrentUserState();
  const parkGroups = groupedParks(PARKS);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  if (isPending) {
    return <main className="mx-auto max-w-xl px-4 py-16 text-sm text-muted-foreground">Checking your account…</main>;
  }
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (form.get("insuranceAttested") !== "on") {
      toast("Hosts must attest they carry current auto insurance.");
      return;
    }
    setPending(true);
    try {
      const result = await createListing({
        data: {
          make: String(form.get("make") ?? ""),
          model: String(form.get("model") ?? ""),
          year: Number(form.get("year")),
          trim: String(form.get("trim") ?? "") || undefined,
          category: String(form.get("category") ?? "suv") as Car["category"],
          parkSlug: String(form.get("parkSlug") ?? ""),
          daily: Number(form.get("daily")),
          seats: Number(form.get("seats")),
          drivetrain: String(form.get("drivetrain") ?? "AWD"),
          description: String(form.get("description") ?? ""),
          camping: form.get("camping") === "on",
          petFriendly: form.get("petFriendly") === "on",
          instantBook: form.get("instantBook") === "on",
          electric: form.get("electric") === "on",
          insuranceAttested: true as const,
        },
      });
      toast("Your car is on the map.");
      void navigate({ to: "/cars/$carId", params: { carId: result.id } });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not list the car.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main>
      <section className="relative min-h-[40vh] overflow-hidden">
        <img src="/images/cars/bronco-yosemite.jpg" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-6xl flex-col justify-end px-4 py-12 text-primary-foreground">
          <p className="text-sm font-medium tracking-wide uppercase text-primary-foreground/75">Hosts</p>
          <h1 className="mt-2 font-display text-5xl">List a car at the gate</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">
            If it already lives in a gateway town, it is more useful on Lookout than in the driveway.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_280px]">
        <Card className="p-6">
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="make">Make</Label>
              <Input id="make" name="make" required placeholder="Toyota" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" required placeholder="4Runner" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" type="number" required min={1990} max={2027} defaultValue={2021} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="trim">Trim</Label>
              <Input id="trim" name="trim" placeholder="TRD Off-Road" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="parkSlug">Park</Label>
              <select
                id="parkSlug"
                name="parkSlug"
                required
                className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
                defaultValue="yosemite"
              >
                {parkGroups.map((group) => (
                  <optgroup key={group.region} label={group.region}>
                    {group.parks.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}, {p.state}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Type</Label>
              <select
                id="category"
                name="category"
                className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
                defaultValue="overland"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="daily">Daily rate (USD)</Label>
              <Input id="daily" name="daily" type="number" required min={35} max={500} defaultValue={95} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seats">Seats</Label>
              <Input id="seats" name="seats" type="number" required min={2} max={12} defaultValue={5} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="drivetrain">Drivetrain</Label>
              <Input id="drivetrain" name="drivetrain" defaultValue="4x4" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">About this car</Label>
              <Textarea
                id="description"
                name="description"
                required
                minLength={20}
                placeholder="Where it lives, what it is good for, and what you expect back."
              />
            </div>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="instantBook" className="size-4 accent-primary" defaultChecked />
              Instant book
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="camping" className="size-4 accent-primary" />
              Camping kit
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="petFriendly" className="size-4 accent-primary" />
              Pet friendly
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" name="electric" className="size-4 accent-primary" />
              Electric
            </label>
            <label className="flex min-h-11 items-start gap-2 text-sm sm:col-span-2">
              <input type="checkbox" name="insuranceAttested" className="mt-1 size-4 accent-primary" required />
              <span>
                I carry current auto insurance on this car in the state where it is registered. Lookout Protection is a trip waiver, not a replacement for that policy.{" "}
                <Link to="/protection" className="underline">
                  Read coverage
                </Link>
                .
              </span>
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
                {pending ? "Publishing…" : "Publish listing"}
              </Button>
            </div>
          </form>
        </Card>
        <aside className="space-y-4 text-sm text-muted-foreground">
          <p>Lookout keeps 10% as a service fee on completed trips. You set the daily rate.</p>
          <p>Listings are tied to your account and appear on the ranger desk.</p>
          <p>
            A stock photo matching the vehicle type is used until a real gallery exists.{" "}
            <Link to="/account" className="underline">
              Manage listings
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}
