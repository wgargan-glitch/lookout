import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CLAIMS_GAPS,
  COMMERCIAL_HOST_WAIVER,
  HOST_OFF_TRIP,
  INSURANCE_PARTNER,
  REJECTED_PROOF,
  STATE_TRAPS,
  VERIFICATION_CHECKS,
} from "@/lib/insurance";
import { formatMoney } from "@/lib/format";
import { OWN_INSURANCE_PLAN, PROTECTION_PLANS, TRIP_LIABILITY, planDailyCents } from "@/lib/pricing";

export const Route = createFileRoute("/protection")({ component: ProtectionPage });

const EXAMPLE_DAILY = 15_000;

function ProtectionPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Cover on every trip</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">The renter pays. The host’s personal policy stays off-trip.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Lookout follows the Turo / Getaround model: trip-period cover sits on the platform, the guest pays for it at checkout, and a photo of an insurance card is not proof. A licensed carrier is not bound yet — the checkout still collects the same line items so the product is ready when a producer is.
      </p>

      <Card className="mt-10 p-6">
        <p className="text-sm font-medium tracking-wide text-sage uppercase">1 · Required on every trip</p>
        <h2 className="mt-1 font-display text-2xl">{TRIP_LIABILITY.name}</h2>
        <p className="mt-2 font-display text-3xl tabular-nums">
          {formatMoney(TRIP_LIABILITY.dailyCents)}
          <span className="text-base font-sans text-muted-foreground"> / day</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{TRIP_LIABILITY.summary}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          In many states this should be primary, or first-dollar if a host or renter policy lapses or excludes P2P. New York and Maryland are stricter. Ordinary hosts cannot opt out.
        </p>
      </Card>

      <h2 className="mt-12 font-display text-2xl">2 · Guest protection (you pick one)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Caps what you owe if you damage the host’s car. Priced as a share of the trip daily rate (example below is a $150/day listing). Default is Standard. This is a contract, not a policy, until a carrier is bound.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {PROTECTION_PLANS.map((plan) => {
          const daily = planDailyCents(plan, EXAMPLE_DAILY);
          return (
            <Card key={plan.id} className="flex flex-col p-6">
              <Shield className="size-5 text-primary" />
              <h3 className="mt-3 font-display text-2xl">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.summary}</p>
              <p className="mt-4 font-display text-3xl tabular-nums">
                {formatMoney(daily)}
                <span className="text-base font-sans text-muted-foreground"> / day</span>
              </p>
              <p className="text-xs text-muted-foreground">On a $150/day car · {Math.round(plan.tripRate * 100)}% of trip, floor {formatMoney(plan.floorDailyCents)}</p>
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
          );
        })}
      </div>

      <Card className="mt-10 p-6">
        <h2 className="font-display text-2xl">3 · {OWN_INSURANCE_PLAN.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{OWN_INSURANCE_PLAN.summary}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {INSURANCE_PARTNER.note}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Check</th>
                <th className="py-2 font-medium">Pass rule</th>
              </tr>
            </thead>
            <tbody>
              {VERIFICATION_CHECKS.map((row) => (
                <tr key={row.check} className="border-b border-border/60">
                  <td className="py-2 pr-4 align-top">{row.check}</td>
                  <td className="py-2 align-top text-muted-foreground">{row.pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm font-medium">Not accepted</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {REJECTED_PROOF.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Card>

      <Card className="mt-10 p-6">
        <h2 className="font-display text-2xl">Hosts</h2>
        <p className="mt-3 text-sm text-muted-foreground">{HOST_OFF_TRIP}</p>
        <p className="mt-3 text-sm text-muted-foreground">{COMMERCIAL_HOST_WAIVER}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Host reimbursement for a covered incident is funded from the renter-paid protection line, not by taking a larger share of host earnings. The platform fee between Lookout and hosts is in the{" "}
          <Link to="/host-agreement" className="underline">
            Host agreement
          </Link>
          .
        </p>
      </Card>

      <Card className="mt-10 p-6">
        <h2 className="font-display text-2xl">What this is — and is not</h2>
        <div className="mt-3 space-y-3 text-sm text-muted-foreground">
          <p>
            Do not read “protection” as “fully insured.” Trip liability is meant to be a real policy issued to Lookout. Guest plans are a damage-responsibility cap until a carrier is on the paper.
          </p>
          <p>
            A live admitted or surplus-lines program needs an appointed insurance agency, a surplus-lines broker, or a fronting carrier (Travelers-style). That cannot be completed from this product.
          </p>
          <p className="font-medium text-foreground">State-law traps</p>
          <ul className="list-disc space-y-1 pl-5">
            {STATE_TRAPS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="font-medium text-foreground">Claims gaps</p>
          <ul className="list-disc space-y-1 pl-5">
            {CLAIMS_GAPS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
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
