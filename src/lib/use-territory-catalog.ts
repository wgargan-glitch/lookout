import {
  featuredParks,
  parksForTerritory,
  parkTerritoryId,
  regionFiltersFor,
} from "@/lib/catalog";
import { territoryById } from "@/lib/territory";
import { useTerritory } from "@/lib/use-territory";
import { useFleet } from "@/lib/use-fleet";

export function useTerritoryCatalog() {
  const id = useTerritory((s) => s.id);
  const territory = territoryById(id);
  const parks = parksForTerritory(id);
  const slugs = new Set(parks.map((p) => p.slug));
  const fleet = useFleet();
  return {
    id,
    territory,
    parks,
    featured: featuredParks(id),
    regionFilters: regionFiltersFor(id),
    cars: fleet.cars.filter((c) => slugs.has(c.parkSlug)),
    hosts: fleet.hosts,
    extraCars: fleet.extraCars,
    extraHosts: fleet.extraHosts,
    parkSlugs: slugs,
    areaLabel: (unit?: "acres" | "ha") => unit ?? "acres",
    isParkHere: (slug: string) => slugs.has(slug),
    territoryOfSlug: (slug: string) => {
      const park = parks.find((p) => p.slug === slug);
      return park ? parkTerritoryId(park) : undefined;
    },
  };
}
