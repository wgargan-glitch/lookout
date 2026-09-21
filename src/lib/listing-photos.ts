export type PhotoKind = "required" | "suggested";

export type PhotoAngle = {
  id: string;
  kind: PhotoKind;
  label: string;
  hint: string;
};

export const PHOTO_ANGLES: PhotoAngle[] = [
  {
    id: "front-quarter",
    kind: "required",
    label: "Front 3/4",
    hint: "The hero. Whole car, daylight, three-quarter — then place it at the park.",
  },
  {
    id: "rear-quarter",
    kind: "required",
    label: "Rear 3/4",
    hint: "Same distance as the front. Bumper and taillights in frame.",
  },
  {
    id: "driver-side",
    kind: "required",
    label: "Driver side",
    hint: "Straight on. Doors closed, mirrors out.",
  },
  {
    id: "passenger-side",
    kind: "required",
    label: "Passenger side",
    hint: "The other flank. Crouch if you have to — show the rocker.",
  },
  {
    id: "cabin",
    kind: "required",
    label: "Cabin",
    hint: "Dash and front seats. Interior lights on if it’s dim.",
  },
  {
    id: "cargo",
    kind: "required",
    label: "Cargo / bed",
    hint: "Trunk, boot, or bed empty so guests see the space.",
  },
  {
    id: "wheels",
    kind: "suggested",
    label: "Tires & wheels",
    hint: "One corner close. Tread and rim. Guests notice curb rash.",
  },
  {
    id: "odometer",
    kind: "suggested",
    label: "Odometer",
    hint: "Readable mileage. No dash clutter.",
  },
  {
    id: "roof",
    kind: "suggested",
    label: "Roof / rack",
    hint: "Tent, basket, or just the roofline.",
  },
  {
    id: "wear",
    kind: "suggested",
    label: "Existing wear",
    hint: "Every scratch you already know about. Saves a claim later.",
  },
  {
    id: "pickup",
    kind: "suggested",
    label: "Pickup spot",
    hint: "Where they will find you. No house numbers.",
  },
  {
    id: "extra",
    kind: "suggested",
    label: "Anything else",
    hint: "Camping kit, seats folded, snow tires — whatever you’d want to know.",
  },
];

export const REQUIRED_PHOTO_IDS = PHOTO_ANGLES.filter((a) => a.kind === "required").map((a) => a.id);
export const SUGGESTED_PHOTO_IDS = PHOTO_ANGLES.filter((a) => a.kind === "suggested").map((a) => a.id);
export const PHOTO_ANGLE_IDS = PHOTO_ANGLES.map((a) => a.id);

export type GalleryShot = { id: string; src: string };

export function parseGallery(raw: unknown): GalleryShot[] {
  if (!raw) return [];
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
    if (!PHOTO_ANGLE_IDS.includes(id) || !src.startsWith("data:image/")) return [];
    return [{ id, src }];
  });
}

export function orderedGallerySrcs(shots: GalleryShot[]): string[] {
  const byId = new Map(shots.map((s) => [s.id, s.src]));
  return PHOTO_ANGLE_IDS.map((id) => byId.get(id)).filter((src): src is string => Boolean(src));
}

export function missingRequiredPhotos(shots: GalleryShot[]): string[] {
  const have = new Set(shots.filter((s) => s.src).map((s) => s.id));
  return REQUIRED_PHOTO_IDS.filter((id) => !have.has(id)).map(
    (id) => PHOTO_ANGLES.find((a) => a.id === id)?.label ?? id,
  );
}

export function listingLiveGaps(input: {
  shots: GalleryShot[];
  plate: string;
  pickupNotes: string;
  insurer: string;
  policyNumber: string;
  mileage: number | null | undefined;
  phone: string;
  insuranceAttested: boolean;
}): string[] {
  const gaps: string[] = [];
  gaps.push(...missingRequiredPhotos(input.shots).map((label) => `${label} photo`));
  if (!input.plate.trim()) gaps.push("license plate");
  if ((input.mileage ?? -1) < 0) gaps.push("current mileage");
  if (input.pickupNotes.trim().length < 10) gaps.push("pickup notes");
  if (input.insurer.trim().length < 2) gaps.push("insurance carrier");
  if (input.policyNumber.trim().length < 2) gaps.push("policy number");
  if (input.phone.trim().length < 7) gaps.push("host phone");
  if (!input.insuranceAttested) gaps.push("insurance attestation");
  return gaps;
}
