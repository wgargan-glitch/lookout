export const TERRITORY_IDS = ["us", "europe", "latam", "canada", "anz", "southern-africa"] as const;
export type TerritoryId = (typeof TERRITORY_IDS)[number];

export type Territory = {
  id: TerritoryId;
  name: string;
  shortLabel: string;
  published: boolean;
  kicker: string;
  headline: string;
  intro: string;
  parksIntro: string;
  heroImage: string;
  heroAlt: string;
  emptyCars: string;
  hostCta: string;
};

/** Add a row here when a new geography opens. The switcher and geo-detect pick it up. */
export const TERRITORIES: Territory[] = [
  {
    id: "us",
    name: "United States",
    shortLabel: "US",
    published: true,
    kicker: "Private cars at the park gate",
    headline: "A local car. At the trailhead.",
    intro: "Borrow a Bronco in Yosemite, a Sprinter in Joshua Tree, a 911 for the rim. Hosts live in the next town over.",
    parksIntro:
      "Every official U.S. National Park, with pickup in the gateway town — not the airport. Remote Alaska parks stage in Fairbanks, Healy, Seward.",
    heroImage: "/brand/hero.jpg",
    heroAlt: "A local 4x4 at a park trailhead, fire lookout on the ridge",
    emptyCars: "No cars match those filters.",
    hostCta: "List a car at the gate",
  },
  {
    id: "europe",
    name: "Europe",
    shortLabel: "Europe",
    published: false,
    kicker: "Opening across the parks of Europe",
    headline: "A local car. At the trailhead.",
    intro: "Keys in Aviemore, Torla, Bohinj, Lom. Europe has no single park service — each country names its own. We list the ones people actually drive to.",
    parksIntro:
      "Europe’s parks are national in name only: France, Spain, Norway, the UK and the rest each designate their own. Lookout maps the drive-to parks — IUCN-style national parks plus the lived-in UK landscapes — with a gateway town for the keys. Guest booking is not live yet.",
    heroImage: "/images/territories/europe/isles.jpg",
    heroAlt: "A Highland loch and a single-track road toward the park",
    emptyCars: "Hosts near these parks are still joining. Guest trips are not open yet — you can list a car if you live in a gateway town.",
    hostCta: "List a car in a gateway town",
  },
  {
    id: "latam",
    name: "Latin America",
    shortLabel: "LatAm",
    published: false,
    kicker: "Opening from Baja to Patagonia",
    headline: "A local car. At the trailhead.",
    intro: "Leave the motorhome in Creel, El Calafate, Puerto Natales, Quepos. Take a car that already knows the washboard.",
    parksIntro:
      "No single park service from Mexico to Tierra del Fuego. Lookout maps the drive-to parks — Baja, the Andes, the Brazilian chapadas, Patagonia — with a gateway town for the keys. Guest booking is not live yet.",
    heroImage: "/images/territories/latam/patagonia.jpg",
    heroAlt: "A gravel Patagonian road toward granite spires",
    emptyCars: "Hosts near these parks are still joining. Guest trips are not open yet — you can list a car if you live in a gateway town.",
    hostCta: "List a car in a gateway town",
  },
  {
    id: "canada",
    name: "Canada",
    shortLabel: "Canada",
    published: false,
    kicker: "Opening across Parks Canada",
    headline: "A local car. At the trailhead.",
    intro: "Banff, Tofino, Rocky Harbour. The coach stays on the pad. A local car does the Icefields and the coast road.",
    parksIntro:
      "Parks Canada is its own map. Lookout lists the drive-to parks with a town for keys — the Rockies, both coasts, the prairies. Guest booking is not live yet.",
    heroImage: "/images/territories/canada/rockies.jpg",
    heroAlt: "A parkway beside a turquoise lake in the Canadian Rockies",
    emptyCars: "Hosts near these parks are still joining. Guest trips are not open yet — you can list a car if you live in a gateway town.",
    hostCta: "List a car in a gateway town",
  },
  {
    id: "anz",
    name: "Australia & New Zealand",
    shortLabel: "Aus & NZ",
    published: false,
    kicker: "Opening for grey nomads and campervans",
    headline: "A local car. At the trailhead.",
    intro: "Park the van in Yulara, Te Anau, Exmouth. Borrow something smaller for the gorge road and the car park that is not built for a 7-metre rig.",
    parksIntro:
      "Australia and New Zealand are the other great motorhome countries. Lookout maps the drive-to parks — the red centre, both islands, Tasmania — with a town for keys. Guest booking is not live yet.",
    heroImage: "/images/territories/anz/red-centre.jpg",
    heroAlt: "An outback highway toward a sandstone monolith at dusk",
    emptyCars: "Hosts near these parks are still joining. Guest trips are not open yet — you can list a car if you live in a gateway town.",
    hostCta: "List a car in a gateway town",
  },
  {
    id: "southern-africa",
    name: "Southern Africa",
    shortLabel: "S. Africa",
    published: false,
    kicker: "Opening on the self-drive loop",
    headline: "A local car. At the trailhead.",
    intro: "Kruger, Sossusvlei, Chobe, the Garden Route. Leave the camper at camp. Take a car that already knows a gravel park road.",
    parksIntro:
      "Southern Africa is a self-drive circuit, not one park service. Lookout maps Kruger to the Cape, Namibia, Botswana, and the Falls — with a gateway town for the keys. Guest booking is not live yet.",
    heroImage: "/images/territories/southern-africa/kruger.jpg",
    heroAlt: "A red earth track through acacia bushveld",
    emptyCars: "Hosts near these parks are still joining. Guest trips are not open yet — you can list a car if you live in a gateway town.",
    hostCta: "List a car in a gateway town",
  },
];

export function territoryById(id: TerritoryId | string): Territory {
  return TERRITORIES.find((t) => t.id === id) ?? TERRITORIES[0]!;
}

export function isTerritoryId(value: string): value is TerritoryId {
  return (TERRITORY_IDS as readonly string[]).includes(value);
}

const EUROPE_TZ = [
  "Europe/",
  "Atlantic/Reykjavik",
  "Atlantic/Azores",
  "Atlantic/Canary",
  "Atlantic/Madeira",
  "Atlantic/Faroe",
  "Atlantic/Jan_Mayen",
  "Arctic/",
];

const CANADA_TZ = [
  "America/Toronto",
  "America/Vancouver",
  "America/Edmonton",
  "America/Winnipeg",
  "America/Halifax",
  "America/St_Johns",
  "America/Whitehorse",
  "America/Yellowknife",
  "America/Iqaluit",
  "America/Regina",
  "America/Moncton",
  "America/Goose_Bay",
  "America/Glace_Bay",
  "America/Blanc-Sablon",
  "America/Rankin_Inlet",
  "America/Cambridge_Bay",
  "America/Inuvik",
  "America/Dawson",
  "America/Creston",
  "America/Dawson_Creek",
  "America/Fort_Nelson",
  "America/Swift_Current",
  "America/Atikokan",
  "America/Thunder_Bay",
  "America/Rainy_River",
  "America/Pangnirtung",
  "America/Resolute",
  "America/Coral_Harbour",
];

const LATAM_TZ = [
  "America/Argentina/",
  "America/Santiago",
  "America/Punta_Arenas",
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
  "America/Bogota",
  "America/Lima",
  "America/Guayaquil",
  "America/La_Paz",
  "America/Montevideo",
  "America/Asuncion",
  "America/Caracas",
  "America/Cayenne",
  "America/Paramaribo",
  "America/Guyana",
  "America/Costa_Rica",
  "America/Panama",
  "America/Guatemala",
  "America/Belize",
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
];

const SOUTHERN_AFRICA_TZ = [
  "Africa/Johannesburg",
  "Africa/Windhoek",
  "Africa/Gaborone",
  "Africa/Harare",
  "Africa/Lusaka",
  "Africa/Maputo",
  "Africa/Maseru",
  "Africa/Mbabane",
  "Africa/Blantyre",
];

const EUROPE_LANG = [
  "en-GB",
  "en-IE",
  "en-GI",
  "cy",
  "gd",
  "ga",
  "fr",
  "de",
  "es",
  "it",
  "nl",
  "pl",
  "sv",
  "nb",
  "nn",
  "da",
  "fi",
  "pt-PT",
  "el",
  "cs",
  "sk",
  "hu",
  "ro",
  "hr",
  "sl",
  "bg",
  "et",
  "lv",
  "lt",
  "mt",
  "is",
  "lb",
  "uk",
  "sq",
  "sr",
  "bs",
  "mk",
  "tr",
];

const LATAM_LANG = [
  "pt-BR",
  "es-MX",
  "es-AR",
  "es-CL",
  "es-CO",
  "es-PE",
  "es-CR",
  "es-PA",
  "es-GT",
  "es-UY",
  "es-PY",
  "es-BO",
  "es-EC",
  "es-VE",
  "es-HN",
  "es-NI",
  "es-SV",
  "es-DO",
  "gn",
  "qu",
];

function tzHits(tz: string, needles: readonly string[]) {
  return needles.some((p) => (p.endsWith("/") ? tz.startsWith(p) : tz === p || tz.startsWith(`${p}/`)));
}

function langHits(langs: readonly string[], needles: readonly string[]) {
  for (const lang of langs) {
    const l = lang.toLowerCase();
    if (needles.some((p) => l === p.toLowerCase() || l.startsWith(`${p.toLowerCase()}-`))) return true;
  }
  return false;
}

/** First visit only. Timezone first, then language. Manual switch always wins. */
export function detectTerritory(): TerritoryId {
  if (typeof Intl === "undefined") return "us";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  if (tzHits(tz, EUROPE_TZ)) return "europe";
  if (tz.startsWith("Australia/") || tz === "Pacific/Auckland" || tz === "Pacific/Chatham") return "anz";
  if (tzHits(tz, SOUTHERN_AFRICA_TZ)) return "southern-africa";
  if (tzHits(tz, CANADA_TZ)) return "canada";
  if (tzHits(tz, LATAM_TZ)) return "latam";

  if (typeof navigator !== "undefined") {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    if (langHits(langs, LATAM_LANG)) return "latam";
    if (langHits(langs, ["en-AU", "en-NZ"])) return "anz";
    if (langHits(langs, ["en-CA", "fr-CA"])) return "canada";
    if (langHits(langs, ["en-ZA", "af", "en-NA", "en-BW", "en-ZW"])) return "southern-africa";
    if (langHits(langs, EUROPE_LANG) && !langs.some((l) => l.toLowerCase() === "pt-br")) return "europe";
  }
  return "us";
}
