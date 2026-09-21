import {
  featuredParks,
  localizePark,
  localizeRegionFilters,
  parksForTerritory,
  parkTerritoryId,
} from "@/lib/catalog";
import { localizedTerritory, territoryById } from "@/lib/territory";
import { useLocale } from "@/lib/use-locale";
import { useTerritory } from "@/lib/use-territory";
import { useFleet } from "@/lib/use-fleet";

export function useTerritoryCatalog() {
  const id = useTerritory((s) => s.id);
  const locale = useLocale((s) => s.id);
  const territory = localizedTerritory(territoryById(id), locale);
  const parks = parksForTerritory(id).map((p) => localizePark(p, locale));
  const slugs = new Set(parks.map((p) => p.slug));
  const fleet = useFleet();
  return {
    id,
    locale,
    territory,
    parks,
    featured: featuredParks(id).map((p) => localizePark(p, locale)),
    regionFilters: localizeRegionFilters(id, locale),
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
