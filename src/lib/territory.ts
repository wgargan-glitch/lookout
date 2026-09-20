export const TERRITORY_IDS = ["us", "europe"] as const;
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
];

export function territoryById(id: TerritoryId): Territory {
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

/** First visit only. Timezone first, then language. Manual switch always wins. */
export function detectTerritory(): TerritoryId {
  if (typeof Intl === "undefined") return "us";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  if (EUROPE_TZ.some((p) => tz.startsWith(p) || tz === p.replace(/\/$/, ""))) return "europe";
  if (typeof navigator !== "undefined") {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const lang of langs) {
      const l = lang.toLowerCase();
      if (EUROPE_LANG.some((p) => l === p.toLowerCase() || l.startsWith(`${p.toLowerCase()}-`))) return "europe";
      if (l === "pt-br") continue;
    }
  }
  return "us";
}
