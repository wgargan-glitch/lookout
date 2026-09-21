export const LOCALE_IDS = ["en", "es", "pt", "fr", "de", "it", "nl"] as const;
export type LocaleId = (typeof LOCALE_IDS)[number];

export function isLocaleId(value: string): value is LocaleId {
  return (LOCALE_IDS as readonly string[]).includes(value);
}

const INTL: Record<LocaleId, string> = {
  en: "en-US",
  es: "es-419",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  nl: "nl-NL",
};

export function intlTag(id: LocaleId) {
  return INTL[id] ?? "en-US";
}

export function htmlLang(id: LocaleId) {
  return id;
}

const SPAIN_TZ = ["Europe/Madrid", "Africa/Ceuta", "Atlantic/Canary"];

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

const PORTUGUESE_TZ = [
  "America/Sao_Paulo",
  "America/Fortaleza",
  "America/Recife",
  "America/Bahia",
  "America/Belem",
  "America/Manaus",
  "America/Cuiaba",
  "America/Campo_Grande",
  "America/Porto_Velho",
  "America/Rio_Branco",
  "America/Santarem",
  "America/Araguaina",
  "America/Maceio",
  "America/Noronha",
  "Europe/Lisbon",
  "Atlantic/Madeira",
  "Atlantic/Azores",
];

const FRENCH_TZ = [
  "Europe/Paris",
  "Europe/Monaco",
  "America/Cayenne",
  "America/Martinique",
  "America/Guadeloupe",
  "America/Miquelon",
  "Indian/Reunion",
  "Indian/Mayotte",
  "Pacific/Noumea",
  "Pacific/Tahiti",
];

const GERMAN_TZ = ["Europe/Berlin", "Europe/Vienna", "Europe/Zurich", "Europe/Vaduz"];

const ITALIAN_TZ = ["Europe/Rome", "Europe/Vatican", "Europe/San_Marino"];

const DUTCH_TZ = ["Europe/Amsterdam"];

function tzHits(tz: string, needles: readonly string[]) {
  return needles.some((p) => (p.endsWith("/") ? tz.startsWith(p) : tz === p || tz.startsWith(`${p}/`)));
}

function langsOf(): string[] {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? [...navigator.languages] : navigator.language ? [navigator.language] : [];
}

function langPrefix(langs: readonly string[], prefix: string) {
  return langs.some((l) => {
    const x = l.toLowerCase();
    return x === prefix || x.startsWith(`${prefix}-`);
  });
}

/** First visit. Timezone of a country, then browser language. Manual switch always wins. */
export function detectLocale(): LocaleId {
  const tz = typeof Intl !== "undefined" ? (Intl.DateTimeFormat().resolvedOptions().timeZone ?? "") : "";
  const langs = langsOf();

  if (tz === "Europe/Zurich") {
    if (langPrefix(langs, "fr")) return "fr";
    if (langPrefix(langs, "it")) return "it";
    return "de";
  }
  if (tz === "Europe/Brussels") {
    if (langPrefix(langs, "nl")) return "nl";
    if (langPrefix(langs, "de")) return "de";
    return "fr";
  }
  if (tzHits(tz, SPAIN_TZ) || tzHits(tz, SPANISH_AMERICAS_TZ)) return "es";
  if (tzHits(tz, PORTUGUESE_TZ)) return "pt";
  if (tzHits(tz, FRENCH_TZ)) return "fr";
  if (tzHits(tz, GERMAN_TZ)) return "de";
  if (tzHits(tz, ITALIAN_TZ)) return "it";
  if (tzHits(tz, DUTCH_TZ)) return "nl";

  if (langPrefix(langs, "es")) return "es";
  if (langPrefix(langs, "pt")) return "pt";
  if (langPrefix(langs, "fr")) return "fr";
  if (langPrefix(langs, "de")) return "de";
  if (langPrefix(langs, "it")) return "it";
  if (langPrefix(langs, "nl")) return "nl";
  return "en";
}
