import catalog from "@/lib/us-vehicles.json";

export const BODY_TYPES = [
  { id: "suv", label: "SUV" },
  { id: "truck", label: "Truck" },
  { id: "van", label: "Van" },
  { id: "car", label: "Car" },
  { id: "sports", label: "Sports" },
] as const;

export type BodyTypeId = (typeof BODY_TYPES)[number]["id"];

type Catalog = {
  minYear: number;
  maxYear: number;
  years: Record<string, Record<string, Record<string, string>>>;
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

export const OPTIONAL_BUILD_TAGS = [
  {
    id: "overland",
    label: "Overland build",
    hint: "Roof tent, recovery gear, or a serious off-pavement setup. Rare. Does not replace the vehicle type.",
  },
] as const;

export function makesForYear(year: number): string[] {
  const block = data.years[String(year)];
  return block ? Object.keys(block) : [];
}

export function modelsForYearMake(year: number, make: string, extra?: string): string[] {
  const models = Object.keys(data.years[String(year)]?.[make] ?? {});
  if (extra && extra.trim() && !models.includes(extra)) return [extra, ...models];
  return models;
}

export function isListedVehicle(year: number, make: string, model: string): boolean {
  return Boolean(data.years[String(year)]?.[make]?.[model]);
}

export function bodyTypeFor(year: number, make: string, model: string): BodyTypeId | null {
  const raw = data.years[String(year)]?.[make]?.[model];
  if (raw === "suv" || raw === "truck" || raw === "van" || raw === "car" || raw === "sports") return raw;
  return null;
}

export function resolvedBodyType(year: number, make: string, model: string): BodyTypeId {
  return bodyTypeFor(year, make, model) ?? "suv";
}

export function bodyTypeLabel(id: BodyTypeId | string | null | undefined): string {
  return BODY_TYPES.find((t) => t.id === id)?.label ?? "Vehicle";
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

export function matchMakeForYear(year: number, raw: string): string | null {
  const makes = makesForYear(year);
  const n = normToken(raw);
  if (!n) return null;
  const aliased = MAKE_ALIASES[n];
  if (aliased && makes.includes(aliased)) return aliased;
  const exact = makes.find((m) => normToken(m) === n);
  if (exact) return exact;
  const fuzzy = makes.filter((m) => {
    const t = normToken(m);
    return t.startsWith(n) || n.startsWith(t);
  });
  return fuzzy.length === 1 ? fuzzy[0]! : null;
}

export function matchModelForYearMake(year: number, make: string, raw: string, trim?: string): string | null {
  const models = Object.keys(data.years[String(year)]?.[make] ?? {});
  if (!models.length) return null;
  const candidates = [raw, trim ? `${raw} ${trim.split(/[/,]/)[0]?.trim()}` : ""].filter(
    (c): c is string => Boolean(c && c.trim()),
  );
  let best: { model: string; score: number } | null = null;
  for (const cand of candidates) {
    const n = normToken(cand);
    if (!n) continue;
    for (const model of models) {
      const m = normToken(model);
      let score = 0;
      if (m === n) score = 2000 + m.length;
      else if (n.startsWith(m) || m.startsWith(n)) score = 800 + Math.min(m.length, n.length);
      else if (n.includes(m) || m.includes(n)) score = 200 + Math.min(m.length, n.length);
      if (score && (!best || score > best.score)) best = { model, score };
    }
  }
  return best && best.score >= 200 ? best.model : null;
}

function normToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const MAKE_ALIASES: Record<string, string> = {
  chevy: "Chevrolet",
  chevrolet: "Chevrolet",
  mercedes: "Mercedes-Benz",
  mercedesbenz: "Mercedes-Benz",
  vw: "Volkswagen",
  volkswagen: "Volkswagen",
  landrover: "Land Rover",
  rangerover: "Land Rover",
  gmc: "GMC",
  bmw: "BMW",
  mini: "MINI",
};

const SELECT_CLASS =
  "flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50";

export { SELECT_CLASS as vehicleSelectClass };
