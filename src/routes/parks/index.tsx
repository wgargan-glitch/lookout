import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ParkCard } from "@/components/parks/park-card";
import { Input } from "@/components/ui/input";
import { PARKS, PARK_REGION_FILTERS } from "@/lib/catalog";
import { useFleet } from "@/lib/use-fleet";
import { cn } from "@/lib/utils";

type ParksSearch = {
  q?: string;
  region?: string;
};

export const Route = createFileRoute("/parks/")({
  validateSearch: (search: Record<string, unknown>): ParksSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    region: typeof search.region === "string" && search.region ? search.region : undefined,
  }),
  component: ParksPage,
});

function ParksPage() {
  const { cars } = useFleet();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  const counts = new Map<string, number>();
  for (const car of cars) counts.set(car.parkSlug, (counts.get(car.parkSlug) ?? 0) + 1);

  const regionFilter = PARK_REGION_FILTERS.find((r) => r.id === search.region);

  const parks = useMemo(() => {
    const query = (search.q ?? q).trim().toLowerCase();
    return [...PARKS]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((park) => {
        if (regionFilter && !(regionFilter.match as readonly string[]).includes(park.region)) return false;
        if (!query) return true;
        return `${park.name} ${park.state} ${park.region} ${park.pickupTown} ${park.tagline}`
          .toLowerCase()
          .includes(query);
      });
  }, [q, search.q, regionFilter]);

  function patch(next: ParksSearch) {
    void navigate({
      search: {
        q: next.q !== undefined ? next.q || undefined : search.q,
        region: next.region !== undefined ? next.region || undefined : search.region,
      },
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">The map</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">
        {PARKS.length} national parks. A car in the next town.
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every official U.S. National Park, with pickup in the gateway town — not the airport. Remote Alaska parks stage in Fairbanks, Healy, Seward. The car gets you to the plane, the ferry, or the gate.
      </p>

      <div className="mt-8 space-y-4">
        <Input
          value={q}
          placeholder="Search a park, state, or town"
          aria-label="Search parks"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") patch({ q });
          }}
          onBlur={() => {
            if (q !== (search.q ?? "")) patch({ q });
          }}
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => patch({ region: "" })}
            className={cn(
              "min-h-11 rounded-full border px-3 py-1.5 text-xs font-medium",
              !search.region
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card",
            )}
          >
            All regions
          </button>
          {PARK_REGION_FILTERS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => patch({ region: search.region === region.id ? "" : region.id })}
              className={cn(
                "min-h-11 rounded-full border px-3 py-1.5 text-xs font-medium",
                search.region === region.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card",
              )}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {parks.length} {parks.length === 1 ? "park" : "parks"}
        {regionFilter ? ` in ${regionFilter.label}` : ""}
      </p>

      {parks.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No parks match that search.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parks.map((park) => (
            <ParkCard key={park.slug} park={park} count={counts.get(park.slug) ?? 0} />
          ))}
        </div>
      )}
    </main>
  );
}