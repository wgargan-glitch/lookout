import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">The trail</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">How Lookout works</h1>
      <p className="mt-4 text-muted-foreground">
        Book a car from someone who already lives beside the park. They are not a counter. They will tell you if the pass is open.
      </p>

      <div className="mt-10 space-y-6">
        {[
          {
            t: "Find a park, then a car",
            d: "Search parks from the region switcher — US, Europe, Latin America, Canada, Australia & New Zealand, Southern Africa. Filter for camping kits, electric range, pets, or a 4x4. Dates matter — popular cars book out around holidays.",
          },
          {
            t: "Book, or request",
            d: "Sign in and pick dates. Instant-book cars confirm right away; others wait for the host. You’ll add trip protection on the reservation. Pickup is in the gateway town on the listing.",
          },
          {
            t: "Check in on your phone",
            d: "At the car, open the trip and walk it: six photos, odometer, fuel or charge, cleanliness, and any existing damage. Submit before you drive. Check out the same way when you return the keys.",
          },
          {
            t: "Drive it like a local",
            d: "Unlimited miles on every car in the catalog. Return it on time, with a reasonably full tank or charge, and without a new dent you do not mention. The host lives there. They will know.",
          },
          {
            t: "List your own",
            d: "Create an account, add six photos of the actual car, and list it in a gateway town. You set the daily rate. Host rules live in the Host agreement.",
          },
        ].map((block, i) => (
          <Card key={block.t} className="p-6">
            <p className="font-display text-sage">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-1 font-display text-2xl">{block.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{block.d}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/cars">Browse cars</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/host">List a car</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/get-the-app">Get the app</Link>
        </Button>
      </div>
    </main>
  );
}
