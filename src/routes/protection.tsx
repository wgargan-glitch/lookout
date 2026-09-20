import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PROTECTION_PLANS } from "@/lib/pricing";

export const Route = createFileRoute("/protection")({ component: ProtectionPage });

function ProtectionPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">When you reserve</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">Pick protection at checkout.</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Browse parks and cars first. When you book, you’ll choose a plan that sets what you might
        owe if the car is damaged. That’s the moment for the details — not before.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PROTECTION_PLANS.map((plan) => (
          <Card key={plan.id} className="p-5">
            <Shield className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-2xl">{plan.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{plan.guestBlurb}</p>
            <p className="mt-4 text-sm">
              If the car is damaged, you may owe up to{" "}
              <span className="font-medium text-foreground">{plan.guestResponsibility}</span>.
            </p>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Exact prices show on the reservation for the car and dates you picked.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/cars">Find a car</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/how-it-works">How a trip works</Link>
        </Button>
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        Listing a car? Host coverage is in the{" "}
        <Link to="/host-agreement" className="underline">
          Host agreement
        </Link>
        .
      </p>
    </main>
  );
}
