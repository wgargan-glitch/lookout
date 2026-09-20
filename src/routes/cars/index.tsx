import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TripSearch } from "@/components/booking/trip-search";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES, EXTRA_CATEGORIES, carMatchesCategory, type Car } from "@/lib/catalog";
import { useTerritoryCatalog } from "@/lib/use-territory-catalog";
import { validateCarsSearch } from "@/lib/search";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cars/")({
  validateSearch: validateCarsSearch,
  component: CarsPage,
});

function CarsPage() {
  const { cars, parks, territory } = useTerritoryCatalog();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  const filtered = useMemo(() => {
    let list: Car[] = cars;
    if (search.park) list = list.filter((c) => c.parkSlug === search.park);
    if (search.category) list = list.filter((c) => carMatchesCategory(c, search.category!));
    if (search.camping) list = list.filter((c) => c.camping);
    if (search.pet) list = list.filter((c) => c.petFriendly);
    if (search.electric) list = list.filter((c) => c.electric);
    if (search.instant) list = list.filter((c) => c.instantBook);
    const query = (search.q ?? q).trim().toLowerCase();
    if (query) {
      list = list.filter((c) =>
        `${c.year} ${c.make} ${c.model} ${c.trim}`.toLowerCase().includes(query),
      );
    }
    if (search.sort === "price-asc") list = [...list].sort((a, b) => a.dailyCents - b.dailyCents);
    else if (search.sort === "price-desc") list = [...list].sort((a, b) => b.dailyCents - a.dailyCents);
    else if (search.sort === "rating") list = [...list].sort((a, b) => b.ratingAvg - a.ratingAvg);
    else list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || b.ratingAvg - a.ratingAvg);
    return list;
  }, [cars, search, q]);

  function patch(next: Partial<typeof search>) {
    void navigate({
      search: {
        ...search,
        ...next,
      },
    });
  }

  const park = parks.find((p) => p.slug === search.park);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">The fleet</p>
      <h1 className="mt-1 font-display text-4xl">
        {park ? `Cars at ${park.name}` : "Cars at the parks"}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "listing" : "listings"} from hosts in the gateway towns.
      </p>

      <div className="mt-6">
        <TripSearch
          parks={parks}
          variant="bar"
          defaultPark={search.park}
          defaultFrom={search.from}
          defaultTo={search.to}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        <aside className="w-full shrink-0 space-y-5 rounded-xl border border-border bg-card p-4 lg:w-64">
          <div className="space-y-1.5">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              value={q}
              placeholder="Make or model"
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") patch({ q: q || undefined });
              }}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Type</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    patch({ category: search.category === cat.id ? undefined : cat.id })
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
                    search.category === cat.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="mt-3 mb-2 text-sm font-medium">Builds</p>
            <div className="flex flex-wrap gap-1.5">
              {EXTRA_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    patch({ category: search.category === cat.id ? undefined : cat.id })
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
                    search.category === cat.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { key: "instant" as const, label: "Instant book" },
              { key: "camping" as const, label: "Camping kit" },
              { key: "pet" as const, label: "Pet friendly" },
              { key: "electric" as const, label: "Electric" },
            ].map((f) => (
              <label key={f.key} className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(search[f.key])}
                  onChange={(e) => patch({ [f.key]: e.target.checked || undefined })}
                  className="size-4 accent-primary"
                />
                {f.label}
              </label>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sort">Sort</Label>
            <select
              id="sort"
              value={search.sort ?? "recommended"}
              onChange={(e) =>
                patch({ sort: e.target.value === "recommended" ? undefined : e.target.value })
              }
              className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="font-display text-2xl">Nothing on that trail.</p>
              <p className="mt-2 text-sm text-muted-foreground">{territory.emptyCars}</p>
              <Button asChild className="mt-5">
                <Link to="/cars" search={{}}>
                  Clear filters
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  park={parks.find((p) => p.slug === car.parkSlug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
