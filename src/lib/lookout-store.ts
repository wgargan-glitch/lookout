import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BOOKING_SEEDS,
  CARS,
  HOSTS,
  PARKS,
  REVIEWS,
  type Car,
  type Host,
  type Park,
} from "@/lib/catalog";
import { quoteTrip, rangesOverlap, type ProtectionId } from "@/lib/pricing";

export type Trip = {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  days: number;
  totalCents: number;
  protection: ProtectionId;
  status: "confirmed" | "cancelled";
  confirmation: string;
};

type ListingsState = {
  cars: Car[];
  hosts: Host[];
  add: (car: Car, host: Host) => void;
};

type TripsState = {
  trips: Trip[];
  add: (trip: Trip) => void;
  cancel: (id: string) => void;
};

export const useListings = create<ListingsState>()(
  persist(
    (set) => ({
      cars: [],
      hosts: [],
      add: (car, host) =>
        set((s) => ({
          cars: [car, ...s.cars.filter((c) => c.id !== car.id)],
          hosts: [host, ...s.hosts.filter((h) => h.id !== host.id)],
        })),
    }),
    { name: "lookout-listings" },
  ),
);

export const useTrips = create<TripsState>()(
  persist(
    (set) => ({
      trips: [],
      add: (trip) => set((s) => ({ trips: [trip, ...s.trips] })),
      cancel: (id) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id === id ? { ...t, status: "cancelled" as const } : t,
          ),
        })),
    }),
    { name: "lookout-trips" },
  ),
);

export function allCars(extra: Car[] = []) {
  const ids = new Set(extra.map((c) => c.id));
  return [...extra, ...CARS.filter((c) => !ids.has(c.id))];
}

export function allHosts(extra: Host[] = []) {
  const ids = new Set(extra.map((h) => h.id));
  return [...extra, ...HOSTS.filter((h) => !ids.has(h.id))];
}

export function carBundle(id: string, extraCars: Car[] = [], extraHosts: Host[] = []) {
  const car = allCars(extraCars).find((c) => c.id === id);
  if (!car) return null;
  const park = PARKS.find((p) => p.slug === car.parkSlug) ?? null;
  const host = allHosts(extraHosts).find((h) => h.id === car.hostId) ?? null;
  const reviews = REVIEWS.filter((r) => r.carId === car.id).map((r, i) => ({
    ...r,
    id: i + 1,
  }));
  const nearby = allCars(extraCars)
    .filter((c) => c.parkSlug === car.parkSlug && c.id !== car.id)
    .slice(0, 3);
  return { car, park, host, reviews, nearby };
}

export function parkBundle(slug: string, extraCars: Car[] = []) {
  const park = PARKS.find((p) => p.slug === slug);
  if (!park) return null;
  const cars = allCars(extraCars).filter((c) => c.parkSlug === slug);
  return { park, cars };
}

export function blockedRanges(carId: string, trips: Trip[]) {
  const seeds = BOOKING_SEEDS.filter((b) => b.carId === carId).map((b) => ({
    startDate: b.startDate,
    endDate: b.endDate,
  }));
  const live = trips
    .filter((t) => t.carId === carId && t.status === "confirmed")
    .map((t) => ({ startDate: t.startDate, endDate: t.endDate }));
  return [...seeds, ...live];
}

export function placeBooking(input: {
  car: Car;
  startDate: string;
  endDate: string;
  protection: ProtectionId;
  trips: Trip[];
}) {
  if (input.endDate <= input.startDate) {
    throw new Error("Return date must be after pickup.");
  }
  const blocked = blockedRanges(input.car.id, input.trips);
  const clash = blocked.some((b) =>
    rangesOverlap(input.startDate, input.endDate, b.startDate, b.endDate),
  );
  if (clash) throw new Error("Those dates are already spoken for.");
  const quote = quoteTrip({
    dailyCents: input.car.dailyCents,
    fromISO: input.startDate,
    toISO: input.endDate,
    protection: input.protection,
  });
  const id = crypto.randomUUID();
  const trip: Trip = {
    id,
    carId: input.car.id,
    startDate: input.startDate,
    endDate: input.endDate,
    days: quote.days,
    totalCents: quote.totalCents,
    protection: input.protection,
    status: "confirmed",
    confirmation: `LK-${id.slice(0, 8).toUpperCase()}`,
  };
  return { trip, quote };
}

export { PARKS };

export function parkMap() {
  return new Map<string, Park>(PARKS.map((p) => [p.slug, p]));
}
