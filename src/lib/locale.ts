export const LOCALE_IDS = ["en", "es"] as const;
export type LocaleId = (typeof LOCALE_IDS)[number];

export function isLocaleId(value: string): value is LocaleId {
  return (LOCALE_IDS as readonly string[]).includes(value);
}

/** BCP 47 tag used for dates and html lang. */
export function intlTag(id: LocaleId) {
  return id === "es" ? "es-419" : "en-US";
}

const SPAIN_TZ = ["Europe/Madrid", "Africa/Ceuta", "Atlantic/Canary"];

/** Spanish-speaking Americas. Brazil, Belize, Guyana, Suriname, French Guiana stay off this list. */
const SPANISH_AMERICAS_TZ = [
  "America/Argentina/",
  "America/Santiago",
  "America/Punta_Arenas",
  "America/Bogota",
  "America/Lima",
  "America/Guayaquil",
  "America/La_Paz",
  "America/Montevideo",
  "America/Asuncion",
  "America/Caracas",
  "America/Costa_Rica",
  "America/Panama",
  "America/Guatemala",
  "America/El_Salvador",
  "America/Tegucigalpa",
  "America/Managua",
  "America/Mexico_City",
  "America/Cancun",
  "America/Merida",
  "America/Monterrey",
  "America/Matamoros",
  "America/Mazatlan",
  "America/Chihuahua",
  "America/Ojinaga",
  "America/Hermosillo",
  "America/Tijuana",
  "America/Bahia_Banderas",
  "America/Ciudad_Juarez",
  "America/Havana",
  "America/Santo_Domingo",
  "America/Puerto_Rico",
];

function tzHits(tz: string, needles: readonly string[]) {
  return needles.some((p) => (p.endsWith("/") ? tz.startsWith(p) : tz === p || tz.startsWith(`${p}/`)));
}

function langsOf(): string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? [...navigator.languages] : navigator.language ? [navigator.language] : [];
}

/** First visit only. Timezone of a Spanish-speaking country first, then browser language. */
export function detectLocale(): LocaleId {
  const tz = typeof Intl !== "undefined" ? (Intl.DateTimeFormat().resolvedOptions().timeZone ?? "") : "";
  if (tzHits(tz, SPAIN_TZ) || tzHits(tz, SPANISH_AMERICAS_TZ)) return "es";
  for (const lang of langsOf()) {
    const l = lang.toLowerCase();
    if (l === "es" || l.startsWith("es-")) return "es";
  }
  return "en";
}
