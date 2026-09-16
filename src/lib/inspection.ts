import { PHOTO_ANGLES, type GalleryShot, type PhotoAngle } from "@/lib/listing-photos";

export const INSPECTION_REQUIRED_IDS = [
  "front-quarter",
  "rear-quarter",
  "driver-side",
  "passenger-side",
  "cabin",
  "odometer",
] as const;

export const INSPECTION_SUGGESTED_IDS = ["cargo", "wheels", "fuel-gauge"] as const;

const EXTRA_ANGLES: PhotoAngle[] = [
  {
    id: "odometer",
    kind: "required",
    label: "Odometer",
    hint: "Readable miles. Lights on if you have to.",
  },
  {
    id: "fuel-gauge",
    kind: "suggested",
    label: "Fuel / charge",
    hint: "The gauge or the battery percent on the dash.",
  },
];

const byId = new Map([...PHOTO_ANGLES, ...EXTRA_ANGLES].map((a) => [a.id, a]));

export function inspectionAngle(id: string): PhotoAngle {
  return (
    byId.get(id) ?? {
      id,
      kind: "suggested",
      label: "Damage close-up",
      hint: "Fill the frame with the scratch, dent, or stain.",
    }
  );
}

export const INSPECTION_REQUIRED: PhotoAngle[] = INSPECTION_REQUIRED_IDS.map(inspectionAngle);
export const INSPECTION_SUGGESTED: PhotoAngle[] = INSPECTION_SUGGESTED_IDS.map(inspectionAngle);
export const INSPECTION_PHOTO_IDS = [...INSPECTION_REQUIRED_IDS, ...INSPECTION_SUGGESTED_IDS];

export function parseInspectionShots(raw: unknown): GalleryShot[] {
  let value: unknown = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const id = String((item as { id?: unknown }).id ?? "");
    const src = String((item as { src?: unknown }).src ?? "");
    const allowed = (INSPECTION_PHOTO_IDS as readonly string[]).includes(id) || id.startsWith("damage-");
    if (!id || !allowed || !src.startsWith("data:image/")) return [];
    return [{ id, src }];
  });
}

export const CLEANLINESS = [
  { id: "trail-ready", label: "Trail ready", hint: "Swept, no trash, seats you’d sit on in trail clothes." },
  { id: "lived-in", label: "Lived in", hint: "A little dust or sand. Fine for a park car." },
  { id: "dusty", label: "Dusty", hint: "Needs a wipe. Note it so return isn’t a fight." },
  { id: "needs-work", label: "Needs work", hint: "Trash, mud, or odor. Photograph it." },
] as const;

export type CleanlinessId = (typeof CLEANLINESS)[number]["id"];

export const DAMAGE_AREAS = [
  "Front bumper",
  "Rear bumper",
  "Driver door",
  "Passenger door",
  "Hood",
  "Windshield",
  "Wheel / tire",
  "Interior",
  "Other",
] as const;

export const DAMAGE_SEVERITY = [
  { id: "cosmetic", label: "Cosmetic" },
  { id: "moderate", label: "Moderate" },
  { id: "heavy", label: "Heavy" },
] as const;

export type DamageItem = {
  id: string;
  area: string;
  severity: "cosmetic" | "moderate" | "heavy";
  notes: string;
};

export const FUEL_LABELS = ["E", "1/8", "1/4", "3/8", "1/2", "5/8", "3/4", "7/8", "F"] as const;

export function fuelLabel(eighths: number, electric: boolean) {
  const n = Math.min(8, Math.max(0, Math.round(eighths)));
  if (electric) return `${Math.round((n / 8) * 100)}% charge`;
  return FUEL_LABELS[n] ?? "—";
}

export function parseDamage(raw: unknown): DamageItem[] {
  let value: unknown = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const severity = row.severity === "moderate" || row.severity === "heavy" ? row.severity : "cosmetic";
    return [
      {
        id: String(row.id ?? crypto.randomUUID()),
        area: String(row.area ?? "Other"),
        severity,
        notes: String(row.notes ?? "").slice(0, 300),
      },
    ];
  });
}

export function inspectionPhotoGaps(shots: GalleryShot[]): string[] {
  const have = new Set(shots.filter((s) => s.src).map((s) => s.id));
  return INSPECTION_REQUIRED.filter((a) => !have.has(a.id)).map((a) => `${a.label} photo`);
}

export function inspectionLiveGaps(input: {
  kind: "checkin" | "checkout";
  shots: GalleryShot[];
  cleanliness: string;
  fuelEighths: number | null;
  odometer: number | null;
  keys: boolean;
  noDamage: boolean;
  damage: DamageItem[];
  notes: string;
}): string[] {
  const gaps = inspectionPhotoGaps(input.shots);
  if (!CLEANLINESS.some((c) => c.id === input.cleanliness)) gaps.push("cleanliness");
  if (input.fuelEighths == null || input.fuelEighths < 0 || input.fuelEighths > 8) gaps.push("fuel or charge");
  if (input.odometer == null || input.odometer < 0) gaps.push("odometer reading");
  if (!input.keys) gaps.push(input.kind === "checkin" ? "keys received" : "keys returned");
  if (!input.noDamage && input.damage.length === 0) gaps.push("damage report or none found");
  if (input.cleanliness === "needs-work" && input.notes.trim().length < 8) gaps.push("notes on cleanliness");
  return gaps;
}
