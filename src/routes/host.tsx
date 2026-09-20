import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyListing, getMyProfile, type HostListing, type Profile } from "@/lib/api";
import { ListingForm } from "@/components/host/listing-form";

type HostSearch = { edit?: string };

export const Route = createFileRoute("/host")({
  validateSearch: (search: Record<string, unknown>): HostSearch => ({
    edit: typeof search.edit === "string" && search.edit.length > 0 ? search.edit : undefined,
  }),
  component: HostPage,
});

function HostPage() {
  const { user, isPending } = useCurrentUserState();
  const { edit } = Route.useSearch();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [existing, setExisting] = useState<HostListing | null | undefined>(edit ? undefined : null);

  useEffect(() => {
    if (!user) return;
    void getMyProfile()
      .then(setProfile)
      .catch(() => toast("Could not load your account."));
  }, [user]);

  useEffect(() => {
    if (!user || !edit) {
      setExisting(null);
      return;
    }
    setExisting(undefined);
    void getMyListing({ data: { id: edit } })
      .then(setExisting)
      .catch((err) => {
        toast(err instanceof Error ? err.message : "Could not load that listing.");
        setExisting(null);
      });
  }, [user, edit]);

  if (isPending || (user && !profile) || existing === undefined) {
    return <main className="mx-auto max-w-xl px-4 py-16 text-sm text-muted-foreground">Opening the host desk…</main>;
  }
  if (!user) return <RedirectToSignIn />;
  if (!profile) return <RedirectToSignIn />;

  return (
    <main>
      <section className="relative min-h-[40vh] overflow-hidden">
        <img src="/images/cars/bronco-yosemite.jpg" alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-6xl flex-col justify-end px-4 py-12 text-primary-foreground">
          <p className="text-sm font-medium tracking-wide uppercase text-primary-foreground/75">Hosts</p>
          <h1 className="mt-2 font-display text-5xl">{edit ? "Update your listing" : "List a car at the gate"}</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">
            {edit
              ? "Guests book the car in the photos. Keep the gallery honest."
              : "If it already lives in a gateway town, it is more useful on Lookout than in the driveway."}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_280px]">
        <ListingForm key={edit ?? "new"} profile={profile} existing={existing ?? undefined} />
        <aside className="space-y-4 text-sm text-muted-foreground">
          <p>Year first, then make and model from the US-market list (2000 on). Type is set from that year and model — a 4Runner is an SUV, a Tacoma is a truck. Overland is an optional tag for the rare rigs that actually carry it. Trim is not required. Pick 2WD, 4x4 or AWD, fuel, and automatic or manual.</p>
          <p>
            Guests pay trip liability and a protection plan — that is the trip cover, not your personal policy. The fee between you and Lookout Parks is in the{" "}
            <Link to="/host-agreement" className="underline">
              Host agreement
            </Link>
            .
          </p>
          <p>Your personal auto policy is for when the car is not rented. Personal policies usually exclude car-sharing. Ordinary hosts cannot opt out of trip cover.</p>
          <p>
            Drafts stay on{" "}
            <Link to="/account" className="underline">
              your account
            </Link>{" "}
            until the gallery is complete.
          </p>
        </aside>
      </div>
    </main>
  );
}
