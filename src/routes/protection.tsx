import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { PROTECTION_PLANS } from "@/lib/pricing";

export const Route = createFileRoute("/protection")({ component: ProtectionPage });

function ProtectionPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Lookout Protection</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">Cover for the miles between the gate and camp.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Trail, Ridge, and Summit are contractual damage waivers administered by Lookout — not insurance policies issued by a licensed carrier. Hosts still carry their own auto insurance. Guests pick a plan on every trip.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PROTECTION_PLANS.map((plan) => (
          <Card key={plan.id} className="flex flex-col p-6">
            <Shield className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-2xl">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{plan.summary}</p>
            <p className="mt-4 font-display text-3xl tabular-nums">
              {plan.dailyCents === 0 ? "Included" : `${formatMoney(plan.dailyCents)}`}
              {plan.dailyCents > 0 ? <span className="text-base font-sans text-muted-foreground"> / day</span> : null}
            </p>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Guest responsibility</dt>
                <dd>{plan.guestResponsibility}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Vehicle cap</dt>
                <dd>{plan.vehicleCap}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Park roadside</dt>
                <dd>{plan.roadside ? "Yes" : "No"}</dd>
              </div>
            </dl>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
              {plan.details.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-10 p-6">
        <h2 className="font-display text-2xl">What this is — and is not</h2>
        <div className="mt-3 space-y-3 text-sm text-muted-foreground">
          <p>
            Lookout Protection is a waiver in the trip contract. If you buy Ridge or Summit and a covered incident happens during the booked dates, Lookout applies the guest responsibility first, then the waiver up to the vehicle cap.
          </p>
          <p>
            It does not replace the host’s state-required auto insurance, does not cover guests’ medical bills, and does not bind a policy with Allstate, Liberty Mutual, or any other carrier. A live admitted or surplus-lines program needs a licensed producer and a signed program agreement — that cannot be completed from this product.
          </p>
          <p>File incidents from Claims within 48 hours. The ranger desk reviews every file.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/claims">File a claim</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/help/$slug" params={{ slug: "protection" }}>
              Protection FAQ
            </Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
