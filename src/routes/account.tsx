import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, listMyListings, setMyListingStatus, updateMyProfile, deleteMyAccount, type HostListing, type Profile } from "@/lib/api";
import { signOut } from "@/lib/auth/client";
import { carTitle } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<HostListing[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getMyProfile().then(setProfile).catch(() => toast("Could not load your account."));
    void listMyListings().then(setListings).catch(() => undefined);
  }, [user]);

  if (isPending) return <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Loading your account…</main>;
  if (!user) return <RedirectToSignIn />;

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await updateMyProfile({
        data: {
          displayName: String(form.get("displayName") ?? ""),
          phone: String(form.get("phone") ?? "") || undefined,
          hometown: String(form.get("hometown") ?? "") || undefined,
          bio: String(form.get("bio") ?? "") || undefined,
        },
      });
      toast("Account saved.");
      setProfile(await getMyProfile());
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Account</p>
      <h1 className="mt-1 font-display text-4xl">{user.displayName || profile?.displayName || "Your Lookout"}</h1>
      <p className="mt-2 text-muted-foreground">
        {user.primaryEmail ?? "Signed in"} · {profile?.role === "admin" ? "Ranger desk" : profile?.role === "host" ? "Host" : "Guest"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/trips">Trips</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/claims">Claims</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/support">Help desk</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/get-the-app">Get the app</Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/partners">Hotels & campgrounds</Link>
        </Button>
        {profile?.role === "admin" ? (
          <Button asChild size="sm">
            <Link to="/admin">Ranger desk</Link>
          </Button>
        ) : null}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="font-display text-2xl">Profile</h2>
        <form onSubmit={onSave} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="displayName">Trail name</Label>
            <Input id="displayName" name="displayName" defaultValue={profile?.displayName ?? ""} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone {listings.length ? "(required for hosts)" : ""}</Label>
            <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hometown">Hometown</Label>
            <Input id="hometown" name="hometown" defaultValue={profile?.hometown ?? ""} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={4} defaultValue={profile?.bio ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </Card>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl">Your cars</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/host">List a car</Link>
          </Button>
        </div>
        {listings.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No listings yet. Hosts keep a car in a gateway town.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {listings.map((item) => (
              <Card key={item.car.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <img src={item.car.images[0]} alt="" className="h-24 w-full rounded-lg object-cover sm:h-20 sm:w-32" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{carTitle(item.car)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatMoney(item.car.dailyCents)} / day · {item.status} · {item.shots.length}/12 photos
                    {item.insuranceAttested ? " · insurance on file" : ""}
                  </p>
                  {item.gaps.length ? (
                    <p className="mt-1 text-xs text-destructive">Still needed: {item.gaps.join(", ")}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/host" search={{ edit: item.car.id }}>
                      Photos & details
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const next = item.status === "live" ? "paused" : "live";
                        await setMyListingStatus({ data: { id: item.car.id, status: next } });
                        setListings(await listMyListings());
                      } catch (err) {
                        toast(err instanceof Error ? err.message : "Could not update the listing.");
                      }
                    }}
                  >
                    {item.status === "live" ? "Pause" : "Go live"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Card className="mt-10 border-destructive/40 p-6">
        <h2 className="font-display text-2xl">Delete account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Apple and Google require a way to leave. This cancels open trips, removes your cars, tickets,
          claims, and profile, then signs you out. Type DELETE to confirm.
        </p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            if (confirmDelete !== "DELETE") {
              toast("Type DELETE to confirm.");
              return;
            }
            setDeleting(true);
            try {
              await deleteMyAccount({ data: { confirm: "DELETE" } });
              toast("Account deleted.");
              await signOut("/");
            } catch (err) {
              toast(err instanceof Error ? err.message : "Could not delete the account.");
              setDeleting(false);
            }
          }}
        >
          <div className="space-y-1.5 sm:max-w-xs">
            <Label htmlFor="confirmDelete">Confirm</Label>
            <Input
              id="confirmDelete"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>
          <Button type="submit" variant="destructive" disabled={deleting || confirmDelete !== "DELETE"}>
            {deleting ? "Deleting…" : "Delete my Lookout"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
