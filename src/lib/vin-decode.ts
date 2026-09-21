import {
  VEHICLE_MAX_YEAR,
  VEHICLE_MIN_YEAR,
  matchMakeForYear,
  matchModelForYearMake,
  parseDrivetrain,
  parseFuel,
  bodyTypeFor,
  type BodyTypeId,
  type DrivetrainId,
  type FuelId,
  type TransmissionId,
} from "@/lib/us-vehicles";

export type VehicleSpec = {
  year: number;
  make: string;
  model: string;
  trim: string;
  category: BodyTypeId;
  drivetrain: DrivetrainId;
  fuel: FuelId;
  transmission: TransmissionId;
  doors: number;
  seats: number;
  vin: string;
  summary: string;
};

export type VehicleQuery =
  | { kind: "vin"; value: string }
  | { kind: "plate"; value: string };

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
const PLATE_RE = /^[A-Z0-9][A-Z0-9 -]{1,9}$/;

export function classifyVehicleQuery(raw: string): VehicleQuery | null {
  const compact = raw.toUpperCase().replace(/\s+/g, "");
  if (!compact) return null;
  if (VIN_RE.test(compact)) return { kind: "vin", value: compact };
  const plate = raw.toUpperCase().trim().replace(/\s+/g, " ");
  if (PLATE_RE.test(plate) && compact.length < 17) return { kind: "plate", value: plate };
  return null;
}

type NhtsaRow = Record<string, string | undefined>;

export function specFromNhtsa(row: NhtsaRow, vin: string): VehicleSpec | null {
  const year = Number.parseInt(String(row.ModelYear ?? ""), 10);
  const makeRaw = String(row.Make ?? "").trim();
  const modelRaw = String(row.Model ?? "").trim();
  if (!Number.isFinite(year) || !makeRaw || !modelRaw) return null;
  if (year < VEHICLE_MIN_YEAR || year > VEHICLE_MAX_YEAR) return null;

  const make = matchMakeForYear(year, makeRaw) ?? titleVehicle(makeRaw);
  const trim = firstTrim(row.Trim, row.Series);
  const model =
    matchModelForYearMake(year, make, modelRaw, trim) ?? titleVehicle(modelRaw);
  const fuel = fuelFromNhtsa(row);
  const drivetrain = parseDrivetrain(row.DriveType);
  const transmission: TransmissionId = /manual/i.test(row.TransmissionStyle ?? "")
    ? "Manual"
    : "Automatic";
  const category = bodyFromNhtsa(row, year, make, model);
  const doors = clampInt(row.Doors, 2, 5, category === "sports" ? 2 : 4);
  const seats = clampInt(row.Seats, 2, 12, defaultSeats(category));

  const bits = [`${year} ${make} ${model}`];
  if (trim) bits.push(trim);
  bits.push(drivetrain, fuel);
  if (doors) bits.push(`${doors} doors`);

  return {
    year,
    make,
    model,
    trim,
    category,
    drivetrain,
    fuel,
    transmission,
    doors,
    seats,
    vin,
    summary: bits.join(" · "),
  };
}

export function nhtsaDecodeOk(row: NhtsaRow): boolean {
  const code = String(row.ErrorCode ?? "");
  const first = code.split(",")[0]?.trim() ?? "";
  // 0 = clean. 1 = check digit — still usable when make/model/year are present.
  if (first === "0" || first === "1") return Boolean(row.Make && row.Model && row.ModelYear);
  return Boolean(row.Make && row.Model && row.ModelYear) && !/invalid vin|incomplete vin/i.test(row.ErrorText ?? "");
}

function fuelFromNhtsa(row: NhtsaRow): FuelId {
  const level = (row.ElectrificationLevel ?? "").toLowerCase();
  if (level.includes("bev") || level.includes("battery electric")) return "Electric";
  if (level.includes("phev") || level.includes("plug-in") || level.includes("hybrid") || /\bhev\b/.test(level)) {
    return "Hybrid";
  }
  const primary = (row.FuelTypePrimary ?? "").toLowerCase();
  const secondary = (row.FuelTypeSecondary ?? "").toLowerCase();
  if (primary.includes("electric") && !primary.includes("gasoline") && !primary.includes("diesel")) {
    return "Electric";
  }
  if (primary.includes("diesel")) return "Diesel";
  if (primary.includes("electric") || secondary.includes("electric") || primary.includes("hybrid")) {
    return "Hybrid";
  }
  return parseFuel({ fuel: row.FuelTypePrimary });
}

function bodyFromNhtsa(row: NhtsaRow, year: number, make: string, model: string): BodyTypeId {
  const listed = bodyTypeFor(year, make, model);
  if (listed) return listed;
  const body = `${row.BodyClass ?? ""} ${row.VehicleType ?? ""}`.toLowerCase();
  if (body.includes("pickup") || body.includes("truck")) return "truck";
  if (body.includes("van") || body.includes("minivan")) return "van";
  if (body.includes("convertible") || body.includes("coupe")) return "sports";
  if (body.includes("sport utility") || body.includes("mpv") || body.includes("crossover")) return "suv";
  if (body.includes("sedan") || body.includes("hatch") || body.includes("wagon")) return "car";
  return "suv";
}

function firstTrim(...parts: Array<string | undefined>) {
  for (const part of parts) {
    const value = String(part ?? "").trim();
    if (!value) continue;
    return value.split("/")[0]?.trim() ?? value;
  }
  return "";
}

function clampInt(raw: string | undefined, min: number, max: number, fallback: number) {
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function defaultSeats(category: BodyTypeId) {
  if (category === "van") return 7;
  if (category === "sports") return 4;
  return 5;
}

function titleVehicle(value: string) {
  return value
    .toLowerCase()
    .split(/([\s/-]+)/)
    .map((part) => (/^[\s/-]+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}
