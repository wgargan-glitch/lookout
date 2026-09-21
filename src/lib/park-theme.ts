import type { PhotoAngle } from "@/lib/listing-photos";
import type { Park } from "@/lib/catalog";

export type ThemeKind = "hero" | "exterior" | "cabin";

export function themeKindFor(angleId: string): ThemeKind | null {
  switch (angleId) {
    case "front-quarter":
      return "hero";
    case "rear-quarter":
    case "driver-side":
    case "passenger-side":
    case "roof":
    case "extra":
    case "wheels":
      return "exterior";
    case "cabin":
    case "cargo":
      return "cabin";
    default:
      // odometer, wear, pickup — documentary; claims and meetup need the real photo
      return null;
  }
}

export function canThemeAngle(angle: PhotoAngle) {
  return themeKindFor(angle.id) !== null;
}

export function parkThemePrompt(park: Park, angleId: string): string {
  const kind = themeKindFor(angleId) ?? "exterior";
  const place = `${park.name} near ${park.pickupTown}`;
  const scene = `${park.tagline} ${park.description}`.replace(/\s+/g, " ").slice(0, 280);

  const refs =
    "The first reference is the exact car to keep. The second reference, if present, is the real park landscape — use that scenery as the place, not a generic studio.";
  const keepCar =
    "Keep this exact vehicle: same make, color, body shape, wheels, lights, plates, stickers, and every mark on the paint. Do not invent a different car or restyle it.";

  if (kind === "hero") {
    return [
      "Photoreal car-rental showcase photo, 4:3, sharp daylight.",
      refs,
      keepCar,
      `Place the car as the hero, three-quarter view, fully in frame, parked at ${place}.`,
      `Background is the park itself: ${scene}`,
      "Natural light, no people, no extra cars, no text, no logos, no studio sweep, no CGI glow.",
    ].join(" ");
  }
  if (kind === "cabin") {
    return [
      "Photoreal listing interior photo.",
      refs,
      "Keep this exact cabin or cargo area — seats, dash, trim, wear, and camera angle.",
      `Relight as if the car is parked at ${place}: natural park light, a glimpse of the landscape through glass only if windows are already visible.`,
      `Park character: ${scene}`,
      "Do not add people, do not hide existing wear, no text.",
    ].join(" ");
  }
  return [
    "Photoreal car-rental listing photo, matching this camera angle.",
    refs,
    keepCar,
    `Set the scene at ${place}. Background: ${scene}`,
    "Same side and crop of the car. Daylight, no people, no text, no studio.",
  ].join(" ");
}
