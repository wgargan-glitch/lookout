import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  adminLists,
  adminOverview,
  adminSetClaimStatus,
  adminSetListingStatus,
  adminSetTicketStatus,
  type ClaimRow,
  type TicketRow,
} from "@/lib/api";
import { carTitle } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { planLabel } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof adminOverview>> | null>(null);
  const [lists, setLists] = useState<Awaited<ReturnType<typeof adminLists>> | null>(null);
  const [denied, setDenied] = useState(false);

  async function reload() {
    const [o, l] = await Promise.all([adminOverview(), adminLists()]);
    setOverview(o);
    setLists(l);
  }

  useEffect(() => {
    if (!user) return;
    void reload().catch(() => setDenied(true));
  }, [user]);

  if (isPending) return <main className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">Opening the ranger desk…</main>;
  if (!user) return <RedirectToSignIn />;
  if (denied) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Ranger desk is locked.</h1>
        <p className="mt-2 text-sm text-muted-foreground">This account is not admin. The first Lookout account on a fresh site is the desk.</p>
        <Button asChild className="mt-6">
          <Link to="/account">Back to account</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Ranger desk</p>
      <h1 className="mt-1 font-display text-4xl">Watch the mountain</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Bookings, listings, help tickets, and protection claims. Pause a car, close a ticket, or move a claim.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Accounts", overview?.users],
          ["Listings", overview?.listings],
          ["Live", overview?.live],
          ["Trips", overview?.bookings],
          ["Open tickets", overview?.openTickets],
          ["Open claims", overview?.openClaims],
        ].map(([label, n]) => (
          <Card key={String(label)} className="p-4">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
            <p className="mt-1 font-display text-3xl tabular-nums">{n ?? "—"}</p>
          </Card>
        ))}
      </div>

      <Section title="Trips">
        {(lists?.bookings ?? []).map((b) => (
          <Row key={b.id} kicker={b.confirmation} title={`${b.carId} · ${b.startDate} → ${b.endDate}`} meta={`${formatMoney(b.totalCents)} · ${planLabel(b.protection)} · ${b.status}`} />
        ))}
        {lists?.bookings.length === 0 ? <Empty /> : null}
      </Section>

      <Section title="Listings">
        {(lists?.listings ?? []).map((item) => (
          <div key={item.car.id} className="flex flex-col gap-2 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{carTitle(item.car)}</p>
              <p className="text-sm text-muted-foreground">
                {item.hostName} · {item.status} · {formatMoney(item.car.dailyCents)}/day · {item.photoCount} photos
                {item.gaps.length ? ` · missing ${item.gaps.join(", ")}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => act(() => adminSetListingStatus({ data: { id: item.car.id, status: "live" } }), reload)}>
                Live
              </Button>
              <Button size="sm" variant="outline" onClick={() => act(() => adminSetListingStatus({ data: { id: item.car.id, status: "paused" } }), reload)}>
                Pause
              </Button>
            </div>
          </div>
        ))}
        {lists?.listings.length === 0 ? <Empty /> : null}
      </Section>

      <Section title="Help tickets">
        {(lists?.tickets ?? []).map((t) => (
          <TicketAdmin key={t.id} ticket={t} onChange={reload} />
        ))}
        {lists?.tickets.length === 0 ? <Empty /> : null}
      </Section>

      <Section title="Claims">
        {(lists?.claims ?? []).map((c) => (
          <ClaimAdmin key={c.id} claim={c} onChange={reload} />
        ))}
        {lists?.claims.length === 0 ? <Empty /> : null}
      </Section>

      <Section title="People">
        {(lists?.people ?? []).map((p) => (
          <Row key={p.userId} kicker={p.role} title={p.displayName} meta={p.hometown || p.userId} />
        ))}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="mt-8 p-6">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-2">{children}</div>
    </Card>
  );
}

function Row({ kicker, title, meta }: { kicker: string; title: string; meta: string }) {
  return (
    <div className="border-b border-border py-3 last:border-0">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{kicker}</p>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{meta}</p>
    </div>
  );
}

function Empty() {
  return <p className="py-4 text-sm text-muted-foreground">Nothing in this queue.</p>;
}

function TicketAdmin({ ticket, onChange }: { ticket: TicketRow; onChange: () => Promise<void> }) {
  return (
    <div className="border-b border-border py-3 last:border-0">
      <p className="font-medium">{ticket.subject}</p>
      <p className="text-sm text-muted-foreground">
        {ticket.topic} · {ticket.status} — {ticket.body}
      </p>
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => act(() => adminSetTicketStatus({ data: { id: ticket.id, status: "pending" } }), onChange)}>
          Working
        </Button>
        <Button size="sm" variant="outline" onClick={() => act(() => adminSetTicketStatus({ data: { id: ticket.id, status: "resolved" } }), onChange)}>
          Resolve
        </Button>
      </div>
    </div>
  );
}

function ClaimAdmin({ claim, onChange }: { claim: ClaimRow; onChange: () => Promise<void> }) {
  return (
    <div className="border-b border-border py-3 last:border-0">
      <p className="font-medium">
        {claim.kind} · {claim.status}
      </p>
      <p className="text-sm text-muted-foreground">{claim.description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => act(() => adminSetClaimStatus({ data: { id: claim.id, status: "reviewing" } }), onChange)}>
          Review
        </Button>
        <Button size="sm" variant="outline" onClick={() => act(() => adminSetClaimStatus({ data: { id: claim.id, status: "approved" } }), onChange)}>
          Approve
        </Button>
        <Button size="sm" variant="outline" onClick={() => act(() => adminSetClaimStatus({ data: { id: claim.id, status: "denied" } }), onChange)}>
          Deny
        </Button>
      </div>
    </div>
  );
}

function act(run: () => Promise<unknown>, reload: () => Promise<void>) {
  void run()
    .then(() => reload())
    .catch((err) => toast(err instanceof Error ? err.message : "Could not update."));
}

