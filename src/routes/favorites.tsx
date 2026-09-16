import { createFileRoute, Link } from "@tanstack/react-router";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { PARKS } from "@/lib/catalog";
import { useFavorites } from "@/lib/favorites";
import { useFleet } from "@/lib/use-fleet";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { cars } = useFleet();
  const ids = useFavorites((s) => s.ids);
  const saved = cars.filter((c) => ids.includes(c.id));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Saved cars</h1>
      <p className="mt-2 text-muted-foreground">Kept on this device. They are not a reservation.</p>
      {saved.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="font-display text-2xl">Nothing pinned yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Tap the heart on a listing to keep it here.</p>
          <Button asChild className="mt-5">
            <Link to="/cars">Browse cars</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((car) => (
            <CarCard key={car.id} car={car} park={PARKS.find((p) => p.slug === car.parkSlug)} />
          ))}
        </div>
      )}
    </main>
  );
}
