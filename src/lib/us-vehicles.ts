import catalog from "@/lib/us-vehicles.json";

type Catalog = {
  minYear: number;
  maxYear: number;
  years: Record<string, Record<string, string[]>>;
};

const data = catalog as Catalog;

export const VEHICLE_MIN_YEAR = data.minYear;
export const VEHICLE_MAX_YEAR = data.maxYear;

export const VEHICLE_YEARS = Array.from(
  { length: VEHICLE_MAX_YEAR - VEHICLE_MIN_YEAR + 1 },
  (_, i) => VEHICLE_MAX_YEAR - i,
);

export const DRIVETRAINS = [
  { id: "2WD", label: "2WD (2x4)" },
  { id: "4x4", label: "4x4" },
  { id: "AWD", label: "All-wheel drive" },
] as const;

export type DrivetrainId = (typeof DRIVETRAINS)[number]["id"];

export const FUELS = ["Gas", "Diesel", "Hybrid", "Electric"] as const;
export type FuelId = (typeof FUELS)[number];

export const TRANSMISSIONS = ["Automatic", "Manual"] as const;
export type TransmissionId = (typeof TRANSMISSIONS)[number];

export function makesForYear(year: number): string[] {
  const block = data.years[String(year)];
  return block ? Object.keys(block) : [];
}

export function modelsForYearMake(year: number, make: string, extra?: string): string[] {
  const models = data.years[String(year)]?.[make] ?? [];
  if (extra && extra.trim() && !models.includes(extra)) return [extra, ...models];
  return models;
}

export function isListedVehicle(year: number, make: string, model: string): boolean {
  return (data.years[String(year)]?.[make] ?? []).includes(model);
}

export function parseDrivetrain(value: string | undefined): DrivetrainId {
  const s = (value ?? "").toLowerCase();
  if (s.includes("awd") || s.includes("all-wheel") || s.includes("all wheel")) return "AWD";
  if (s.includes("4x4") || s.includes("4wd") || s.includes("four-wheel") || s.includes("4-wheel")) return "4x4";
  return "2WD";
}

export function parseFuel(value: { fuel?: string | null; electric?: boolean }): FuelId {
  const raw = (value.fuel ?? "").toLowerCase();
  if (raw.startsWith("elec")) return "Electric";
  if (raw.startsWith("dies")) return "Diesel";
  if (raw.startsWith("hyb")) return "Hybrid";
  if (raw.startsWith("gas")) return "Gas";
  return value.electric ? "Electric" : "Gas";
}

const SELECT_CLASS =
  "flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50";

export { SELECT_CLASS as vehicleSelectClass };
