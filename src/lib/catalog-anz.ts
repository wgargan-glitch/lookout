import type { Park } from "@/lib/catalog";

const I = {
  red: "/images/territories/anz/red-centre.jpg",
  east: "/images/territories/anz/east.jpg",
  west: "/images/territories/anz/west.jpg",
  tas: "/images/territories/anz/tasmania.jpg",
  nzs: "/images/territories/anz/nz-south.jpg",
  nzn: "/images/territories/anz/nz-north.jpg",
};

function row(p: Omit<Park, "territoryId" | "areaUnit">): Park {
  return { ...p, territoryId: "anz", areaUnit: "ha" };
}

/** Drive-to parks for grey nomads and campervans. Not every park — the ones with a town for keys. */
export const ANZ_PARKS: Park[] = [
  row({ slug: "uluru", name: "Uluru–Kata Tjuta", state: "Australia", region: "Red centre & north", tagline: "The rock, the Olgas, a resort that is the town.", description: "Yulara. You do not climb. The car is for sunrise, Kata Tjuta, and the day the coach schedule is not yours.", pickupTown: "Yulara, Northern Territory", image: I.red, established: 1958, acres: "132,566" }),
  row({ slug: "kakadu", name: "Kakadu", state: "Australia", region: "Red centre & north", tagline: "Wetlands, escarpment, a park the size of a small country.", description: "Jabiru. Distances lie. Hosts leave a 4x4 sense and a crocodile briefing that is not a joke.", pickupTown: "Jabiru, Northern Territory", image: I.red, established: 1979, acres: "1,980,400" }),
  row({ slug: "nitmiluk", name: "Nitmiluk", state: "Australia", region: "Red centre & north", tagline: "Katherine Gorge, a boat or a paddle, a town that is the gate.", description: "Katherine. The gorge is the product. A car for the visitor centre and Edith Falls on the way out.", pickupTown: "Katherine, Northern Territory", image: I.red, established: 1989, acres: "292,800" }),
  row({ slug: "purnululu", name: "Purnululu", state: "Australia", region: "Red centre & north", tagline: "The Bungle Bungles, a track that is not a suggestion.", description: "Warmun or Halls Creek. High-clearance is the price of entry. Hosts know which month the creek is a creek.", pickupTown: "Warmun, Western Australia", image: I.west, established: 1987, acres: "239,723" }),
  row({ slug: "karijini", name: "Karijini", state: "Australia", region: "Red centre & north", tagline: "Red gorges, a swim that is a commitment, iron-ore country.", description: "Tom Price. The gorges have names. You want something that likes corrugations and a 40-degree day.", pickupTown: "Tom Price, Western Australia", image: I.west, established: 1969, acres: "627,422" }),
  row({ slug: "ningaloo", name: "Ningaloo", state: "Australia", region: "Red centre & north", tagline: "A reef you can walk to, whale sharks if the season is on.", description: "Exmouth or Coral Bay. The park is coast. Hosts leave sand and a snorkel that is not a rental.", pickupTown: "Exmouth, Western Australia", image: I.west, established: 1987, acres: "263,343" }),

  row({ slug: "blue-mountains", name: "Blue Mountains", state: "Australia", region: "East coast", tagline: "Eucalyptus haze, a valley, a town on the rim.", description: "Katoomba or Leura. The Three Sisters are the postcard. The car is for the overlook the coach will not wait at.", pickupTown: "Katoomba, New South Wales", image: I.east, established: 1959, acres: "267,954" }),
  row({ slug: "kosciuszko", name: "Kosciuszko", state: "Australia", region: "East coast", tagline: "The high country, a summit you walk, snow in July.", description: "Jindabyne. Thredbo and Perisher in winter. Hosts leave chains in the season that has them.", pickupTown: "Jindabyne, New South Wales", image: I.east, established: 1967, acres: "690,000" }),
  row({ slug: "daintree", name: "Daintree", state: "Australia", region: "East coast", tagline: "The oldest rainforest story, a ferry, Cape Tribulation.", description: "Port Douglas or Cape Tribulation. The ferry is part of the road. You want something that likes wet leaves and a cassowary sign.", pickupTown: "Port Douglas, Queensland", image: I.east, established: 1981, acres: "12,000" }),
  row({ slug: "lamington", name: "Lamington", state: "Australia", region: "East coast", tagline: "Gondwana rainforest, a rim, O’Reilly’s as the porch.", description: "Canungra. The park is walking. A car for the plateau road and the day the cloud sits in the canopy.", pickupTown: "Canungra, Queensland", image: I.east, established: 1915, acres: "20,590" }),
  row({ slug: "wilsons-prom", name: "Wilsons Promontory", state: "Australia", region: "East coast", tagline: "The southern tip of the mainland, granite, a tidal river.", description: "Yanake or Foster. Tidal River is the camp. Hosts know the gate hour in summer.", pickupTown: "Foster, Victoria", image: I.east, established: 1898, acres: "49,000" }),
  row({ slug: "grampians", name: "Grampians / Gariwerd", state: "Australia", region: "East coast", tagline: "Sandstone ranges, a lookout, Halls Gap as the town.", description: "Halls Gap. The ranges have Aboriginal names that are coming back. A car for the Grand Canyon walk’s car park and the kangaroos at dusk.", pickupTown: "Halls Gap, Victoria", image: I.east, established: 1984, acres: "167,219" }),
  row({ slug: "alpine-vic", name: "Alpine", state: "Australia", region: "East coast", tagline: "Victoria’s high country, cattlemen’s huts, a road that closes.", description: "Bright or Mount Beauty. The high plains are seasonal. Hosts leave a layer and a closed-gate plan.", pickupTown: "Bright, Victoria", image: I.east, established: 1989, acres: "646,000" }),
  row({ slug: "great-sandy", name: "Great Sandy", state: "Australia", region: "East coast", tagline: "K’gari if you took the ferry, Rainbow Beach if you did not.", description: "Rainbow Beach or Hervey Bay. The island is a barge. The car on the mainland is for the coloured sands.", pickupTown: "Rainbow Beach, Queensland", image: I.east, established: 1971, acres: "221,000" }),

  row({ slug: "stirling-range", name: "Stirling Range", state: "Australia", region: "West", tagline: "Wildflowers, a bluff, a range that rises out of wheat.", description: "Cranbrook or Gnowangerup. The peaks are walking. A car for the lookout road in spring.", pickupTown: "Cranbrook, Western Australia", image: I.west, established: 1957, acres: "115,920" }),
  row({ slug: "fitzgerald-river", name: "Fitzgerald River", state: "Australia", region: "West", tagline: "A botanic hotspot, a coast, a park the size of a rumour.", description: "Ravensthorpe or Hopetoun. The Point Ann road is the trip. Hosts leave a spare; the corrugations collect them.", pickupTown: "Hopetoun, Western Australia", image: I.west, established: 1973, acres: "329,039" }),

  row({ slug: "cradle-mountain", name: "Cradle Mountain–Lake St Clair", state: "Australia", region: "Tasmania", tagline: "The Overland Track’s two ends, pencil pines, a tarn.", description: "Cradle Mountain village or Derwent Bridge. Shuttle at the north. The car is for Dove Lake’s hour and the day you skip the walk.", pickupTown: "Cradle Mountain, Tasmania", image: I.tas, established: 1922, acres: "161,000" }),
  row({ slug: "freycinet", name: "Freycinet", state: "Australia", region: "Tasmania", tagline: "Wineglass Bay, granite, a peninsula.", description: "Coles Bay. The car park fills. Hosts know the dawn slot and the oyster after.", pickupTown: "Coles Bay, Tasmania", image: I.tas, established: 1916, acres: "16,900" }),

  row({ slug: "fiordland", name: "Fiordland", state: "New Zealand", region: "New Zealand South", tagline: "Milford, Doubtful, a road that is already the trip.", description: "Te Anau. Milford is a day’s drive and a tunnel. You want something that likes sandflies and a coach convoy.", pickupTown: "Te Anau, New Zealand", image: I.nzs, established: 1952, acres: "1,260,000" }),
  row({ slug: "aoraki", name: "Aoraki / Mount Cook", state: "New Zealand", region: "New Zealand South", tagline: "The mountain, a village under it, a glacier that is walking back.", description: "Mount Cook Village or Twizel. The Hooker Valley is the walk. The car is for the village and the day the Tasman road is open.", pickupTown: "Aoraki Mount Cook, New Zealand", image: I.nzs, established: 1953, acres: "70,728" }),
  row({ slug: "westland", name: "Westland Tai Poutini", state: "New Zealand", region: "New Zealand South", tagline: "Fox and Franz, ice almost to the rainforest.", description: "Franz Josef or Fox Glacier. The glaciers recede; the car parks move. Hosts leave a rain shell that has already been used.", pickupTown: "Franz Josef, New Zealand", image: I.nzs, established: 1960, acres: "132,000" }),
  row({ slug: "arthurs-pass", name: "Arthur’s Pass", state: "New Zealand", region: "New Zealand South", tagline: "The main divide, a village, a kea that will inspect the car.", description: "Arthur’s Pass village. The highway is the park. A car for the viaduct and the walk that starts at the pub.", pickupTown: "Arthur's Pass, New Zealand", image: I.nzs, established: 1929, acres: "118,000" }),
  row({ slug: "mount-aspiring", name: "Mount Aspiring", state: "New Zealand", region: "New Zealand South", tagline: "Tititea, Wanaka one side, Glenorchy the other.", description: "Wānaka or Glenorchy. The Matukituki is the valley. Hosts know which ford is a ford this week.", pickupTown: "Wānaka, New Zealand", image: I.nzs, established: 1964, acres: "355,531" }),
  row({ slug: "paparoa", name: "Paparoa", state: "New Zealand", region: "New Zealand South", tagline: "Pancake rocks, a gorge, a coast road.", description: "Punakaiki. The blowholes are the postcard. A car for the inland pack track’s car park.", pickupTown: "Punakaiki, New Zealand", image: I.nzs, established: 1987, acres: "43,000" }),
  row({ slug: "nelson-lakes", name: "Nelson Lakes", state: "New Zealand", region: "New Zealand South", tagline: "Rotoiti, a beech forest, a village called St Arnaud.", description: "St Arnaud. The lake is the gate. Hosts leave sandflies as a given.", pickupTown: "St Arnaud, New Zealand", image: I.nzs, established: 1956, acres: "102,000" }),
  row({ slug: "kahurangi", name: "Kahurangi", state: "New Zealand", region: "New Zealand South", tagline: "The biggest park in the north of the south, Heaphy if you walked it.", description: "Motueka or Karamea. Most of the park is trail. The car is for the Cobb and the coast ends.", pickupTown: "Motueka, New Zealand", image: I.nzs, established: 1996, acres: "452,002" }),

  row({ slug: "tongariro", name: "Tongariro", state: "New Zealand", region: "New Zealand North", tagline: "Three volcanoes, a crossing, a village called National Park.", description: "National Park Village or Tūrangi. The crossing fills. A car for the two ends of the day and the ski road in winter.", pickupTown: "National Park, New Zealand", image: I.nzn, established: 1887, acres: "79,598" }),
  row({ slug: "abel-tasman", name: "Abel Tasman", state: "New Zealand", region: "New Zealand North", tagline: "A coast track, golden sand, a water taxi that is the shuttle.", description: "Motueka or Mārāhau. You do not drive the beaches. The car is for the trailhead and Kaiteriteri after.", pickupTown: "Motueka, New Zealand", image: I.nzn, established: 1942, acres: "23,700" }),
  row({ slug: "egmont", name: "Egmont / Taranaki", state: "New Zealand", region: "New Zealand North", tagline: "A cone that is the province, a road that loops it.", description: "New Plymouth or Stratford. The mountain road is the trip. Hosts know which gate still has snow in October.", pickupTown: "Stratford, New Zealand", image: I.nzn, established: 1900, acres: "33,534" }),
];

export const ANZ_FEATURED_SLUGS = [
  "uluru",
  "fiordland",
  "kakadu",
  "tongariro",
  "cradle-mountain",
  "ningaloo",
  "aoraki",
  "blue-mountains",
] as const;

export const ANZ_REGION_FILTERS = [
  { id: "red", label: "Red centre & north", match: ["Red centre & north"] },
  { id: "east", label: "East coast", match: ["East coast"] },
  { id: "west", label: "West", match: ["West"] },
  { id: "tas", label: "Tasmania", match: ["Tasmania"] },
  { id: "nz-south", label: "New Zealand South", match: ["New Zealand South"] },
  { id: "nz-north", label: "New Zealand North", match: ["New Zealand North"] },
] as const;
