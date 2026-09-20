import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { parkBySlug } from "@/lib/catalog";
import { parkBundle } from "@/lib/lookout-store";
import { useFleet } from "@/lib/use-fleet";

export const Route = createFileRoute("/parks/$parkSlug")({
  loader: ({ params }) => {
    if (!parkBySlug(params.parkSlug)) throw notFound();
    return { slug: params.parkSlug };
  },
  component: ParkPage,
});

function ParkPage() {
  const { slug } = Route.useLoaderData();
  const { extraCars } = useFleet();
  const bundle = parkBundle(slug, extraCars);
  if (!bundle) throw notFound();
  const { park, cars } = bundle;

  return (
    <main>
      <section className="relative min-h-[48vh] overflow-hidden">
        <img src={park.image} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-ink/15" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-6xl flex-col justify-end px-4 py-12 text-primary-foreground">
          <p className="text-sm font-medium tracking-wide uppercase text-primary-foreground/75">
            {park.region} · est. {park.established}
          </p>
          <h1 className="mt-2 font-display text-5xl">{park.name}</h1>
          <p className="mt-2 text-primary-foreground/80">{park.state} · {park.acres} {park.areaUnit ?? "acres"}</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="max-w-2xl text-lg">{park.tagline}</p>
        <p className="mt-4 max-w-2xl text-muted-foreground">{park.description}</p>
        <p className="mt-4 text-sm">
          Pickup in <span className="font-medium">{park.pickupTown}</span>
        </p>

        <div className="mt-12 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl">
            {cars.length} {cars.length === 1 ? "car" : "cars"} at the gate
          </h2>
          <Button asChild variant="outline">
            <Link to="/cars" search={{ park: park.slug }}>
              Filter this park
            </Link>
          </Button>
        </div>
        {cars.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            No listings here yet. If you live in {park.pickupTown}, you can list a car while this region opens.
          </p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} park={park} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
