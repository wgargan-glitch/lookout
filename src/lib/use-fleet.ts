import { useEffect, useState } from "react";
import { listLiveListings } from "@/lib/api";
import type { Car, Host } from "@/lib/catalog";
import { allCars, allHosts } from "@/lib/lookout-store";

export function useFleet() {
  const [extra, setExtra] = useState<{ cars: Car[]; hosts: Host[] }>({ cars: [], hosts: [] });
  useEffect(() => {
    void listLiveListings()
      .then((data) => setExtra(data))
      .catch(() => {
        /* catalog still works */
      });
  }, []);
  return {
    cars: allCars(extra.cars),
    hosts: allHosts(extra.hosts),
    extraCars: extra.cars,
    extraHosts: extra.hosts,
  };
}
