import type { Park } from "@/lib/catalog";

const I = {
  kruger: "/images/territories/southern-africa/kruger.jpg",
  cape: "/images/territories/southern-africa/cape.jpg",
  namib: "/images/territories/southern-africa/namib.jpg",
  kalahari: "/images/territories/southern-africa/kalahari.jpg",
};

function row(p: Omit<Park, "territoryId" | "areaUnit">): Park {
  return { ...p, territoryId: "southern-africa", areaUnit: "ha" };
}

/** Self-drive parks on the southern African loop. Camps stay put; a local car does the gravel. */
export const SOUTHERN_AFRICA_PARKS: Park[] = [
  row({ slug: "kruger", name: "Kruger", state: "South Africa", region: "Lowveld", tagline: "The self-drive park, a tar road and a dirt one, gates that close.", description: "Hazyview, Phalaborwa, or Malelane. The rest camp is not the motorhome. Hosts leave a car that already knows a speed bump and a buffalo in the road.", pickupTown: "Hazyview, South Africa", image: I.kruger, established: 1926, acres: "1,962,362" }),
  row({ slug: "addo", name: "Addo Elephant", state: "South Africa", region: "Cape", tagline: "Elephants in thicket, a hop from Gqeberha.", description: "Addo village or Gqeberha. The main camp is the loop. A car for the matriarchs and the dung beetles that have right of way.", pickupTown: "Addo, South Africa", image: I.cape, established: 1931, acres: "164,000" }),
  row({ slug: "garden-route", name: "Garden Route", state: "South Africa", region: "Cape", tagline: "Forest, lagoon, a park that is a coastline with a name.", description: "Knysna or Wilderness. The park is sections. The car is for the forest and the day the pass is clear.", pickupTown: "Knysna, South Africa", image: I.cape, established: 2009, acres: "121,000" }),
  row({ slug: "tsitsikamma", name: "Tsitsikamma", state: "South Africa", region: "Cape", tagline: "A mouth of a river, a suspension bridge, indigenous forest.", description: "Storms River. The Storms River Mouth is the postcard. Hosts leave a rain shell and a booking for the Otter if you walked it.", pickupTown: "Storms River, South Africa", image: I.cape, established: 1964, acres: "29,000" }),
  row({ slug: "golden-gate", name: "Golden Gate Highlands", state: "South Africa", region: "Highveld", tagline: "Sandstone that turns at dusk, vultures, Clarens as the town.", description: "Clarens. The park road is the loop. A car for the brandwag and the village that already has the coffee.", pickupTown: "Clarens, South Africa", image: I.cape, established: 1963, acres: "34,000" }),
  row({ slug: "drakensberg", name: "uKhahlamba–Drakensberg", state: "South Africa", region: "Highveld", tagline: "The barrier of spears, rock art, a wall you walk under.", description: "Winterton or Bergville. The amphitheatre is a day. Hosts know which gate still has a space in December.", pickupTown: "Winterton, South Africa", image: I.cape, established: 1993, acres: "242,813" }),
  row({ slug: "mapungubwe", name: "Mapungubwe", state: "South Africa", region: "Lowveld", tagline: "A sandstone citadel, the Limpopo, a park that is a kingdom’s leftover.", description: "Musina. The confluence is the view. A car for the plateau and a heat that is not a suggestion.", pickupTown: "Musina, South Africa", image: I.kruger, established: 1995, acres: "28,000" }),
  row({ slug: "marakele", name: "Marakele", state: "South Africa", region: "Lowveld", tagline: "Waterberg, vultures, a tar road to a view.", description: "Thabazimbi. The mountain is the park. Hosts leave a car that likes a steep last kilometre.", pickupTown: "Thabazimbi, South Africa", image: I.kruger, established: 1994, acres: "67,000" }),
  row({ slug: "camdeboo", name: "Camdeboo", state: "South Africa", region: "Cape", tagline: "The Valley of Desolation, a town of white gables.", description: "Graaff-Reinet. The valley is a loop. A car for the dolerite and the heat that sits in the basin.", pickupTown: "Graaff-Reinet, South Africa", image: I.cape, established: 2005, acres: "19,400" }),
  row({ slug: "mountain-zebra", name: "Mountain Zebra", state: "South Africa", region: "Cape", tagline: "Cape mountain zebra, Karoo ridges, a camp that is a village.", description: "Cradock. The loop is the product. Hosts expect dust and a black eagle.", pickupTown: "Cradock, South Africa", image: I.cape, established: 1937, acres: "28,400" }),
  row({ slug: "tankwa", name: "Tankwa Karoo", state: "South Africa", region: "Cape", tagline: "A desert that is a park, dark skies, a road that is a corrugation.", description: "Sutherland or Calvinia. Distances lie. You want a full tank and a spare.", pickupTown: "Sutherland, South Africa", image: I.namib, established: 1986, acres: "143,600" }),
  row({ slug: "augrabies", name: "Augrabies Falls", state: "South Africa", region: "Kalahari", tagline: "The Orange in a granite gorge, a name that means place of great noise.", description: "Kakamas. The falls are the loop. A car for the moon rock and a heat that is the story.", pickupTown: "Kakamas, South Africa", image: I.kalahari, established: 1966, acres: "55,600" }),
  row({ slug: "isimangaliso", name: "iSimangaliso", state: "South Africa", region: "Lowveld", tagline: "A wetland park, a lake, turtles if the season came.", description: "St Lucia. The cape is a dirt road with a tide. Hosts leave a 4x4 sense for the eastern shores.", pickupTown: "St Lucia, South Africa", image: I.kruger, established: 1999, acres: "328,000" }),

  row({ slug: "namib-naukluft", name: "Namib-Naukluft", state: "Namibia", region: "Namib", tagline: "Sossusvlei, dunes that are a colour, a gate at Sesriem.", description: "Sesriem or Solitaire. The vlei is a dawn start. Hosts leave water and a car that can take corrugations without shedding a bumper.", pickupTown: "Sesriem, Namibia", image: I.namib, established: 1907, acres: "4,976,800" }),
  row({ slug: "etosha", name: "Etosha", state: "Namibia", region: "Namib", tagline: "A pan the size of a rumour, waterholes, rest camps as the towns.", description: "Okaukuejo, Halali, or Namutoni. The pan is the park. A car for the waterhole and the gate that closes at sunset.", pickupTown: "Okaukuejo, Namibia", image: I.kalahari, established: 1907, acres: "2,227,000" }),
  row({ slug: "fish-river", name: "|Ai-|Ais / Richtersveld", state: "Namibia", region: "Namib", tagline: "Fish River Canyon, a gorge you look into, a spa at the bottom.", description: "Hobas or Ai-Ais. The canyon is the viewpoint. Hosts know the heat and the border if you came from the Richtersveld.", pickupTown: "Hobas, Namibia", image: I.namib, established: 1968, acres: "610,000" }),
  row({ slug: "skeleton-coast", name: "Skeleton Coast", state: "Namibia", region: "Namib", tagline: "A park that is a fog, wrecks, a permit that is a plan.", description: "Swakopmund or Terrace Bay. Most of the park is restricted. The car is for the salt road and the days you are allowed.", pickupTown: "Swakopmund, Namibia", image: I.namib, established: 1971, acres: "1,640,000" }),
  row({ slug: "waterberg-na", name: "Waterberg", state: "Namibia", region: "Namib", tagline: "A plateau, rare game, a camp at the foot.", description: "Otjiwarongo. The plateau is walking. A car for the camp and the dirt from town.", pickupTown: "Otjiwarongo, Namibia", image: I.kalahari, established: 1972, acres: "40,500" }),

  row({ slug: "chobe", name: "Chobe", state: "Botswana", region: "Kalahari", tagline: "Elephants at the river, Kasane as the porch, a boat that is half the trip.", description: "Kasane. The river road is the self-drive. Hosts leave a car that has already seen an elephant in the parking lot.", pickupTown: "Kasane, Botswana", image: I.kruger, established: 1968, acres: "1,170,000" }),
  row({ slug: "moremi", name: "Moremi", state: "Botswana", region: "Kalahari", tagline: "The Okavango’s park, a 4x4 that is not a suggestion.", description: "Maun. The reserve is sand and water. Hosts expect a high-clearance listing or an honest no.", pickupTown: "Maun, Botswana", image: I.kalahari, established: 1963, acres: "487,700" }),
  row({ slug: "makgadikgadi", name: "Makgadikgadi Pans", state: "Botswana", region: "Kalahari", tagline: "A pan that was a lake, zebras if the rain came.", description: "Nata or Gweta. The pans are a horizon. A car for the salt and the baobabs at Kubu if the track is open.", pickupTown: "Nata, Botswana", image: I.kalahari, established: 1970, acres: "390,000" }),
  row({ slug: "kgalagadi", name: "Kgalagadi Transfrontier", state: "South Africa", region: "Kalahari", tagline: "Red dunes, two countries, a riverbed that is a road.", description: "Twee Rivieren or Askham. The Botswana side is the same sand. Hosts leave a spare and a cooler that works.", pickupTown: "Twee Rivieren, South Africa", image: I.kalahari, established: 1931, acres: "3,800,000" }),

  row({ slug: "hwange", name: "Hwange", state: "Zimbabwe", region: "Lowveld", tagline: "Zimbabwe’s big park, pumped pans, a town that is a siding.", description: "Hwange or Dete. The main camp is the loop. A car for the pans and a fuel plan that is not optional.", pickupTown: "Hwange, Zimbabwe", image: I.kruger, established: 1928, acres: "1,465,000" }),
  row({ slug: "zambezi", name: "Zambezi", state: "Zimbabwe", region: "Lowveld", tagline: "The river above the Falls, a park that is a rain forest and a gorge.", description: "Victoria Falls town. The rain forest walk is the spray. The car is for the park gates and the day you skip the bungee.", pickupTown: "Victoria Falls, Zimbabwe", image: I.kruger, established: 1952, acres: "56,000" }),
  row({ slug: "mosi-oa-tunya", name: "Mosi-oa-Tunya", state: "Zambia", region: "Lowveld", tagline: "The smoke that thunders, the Zambian walkway, a park that is the Falls.", description: "Livingstone. The gorge is the view. The car is for the gate, the river road, and the day you do not cross to Zimbabwe.", pickupTown: "Livingstone, Zambia", image: I.kruger, established: 1972, acres: "6,600" }),
  row({ slug: "south-luangwa", name: "South Luangwa", state: "Zambia", region: "Lowveld", tagline: "Walking safari country, a river, a camp that is the town.", description: "Mfuwe. The park is loops and a river. Hosts leave a car that already knows a pothole and a crossing that is seasonal.", pickupTown: "Mfuwe, Zambia", image: I.kruger, established: 1972, acres: "905,000" }),
  row({ slug: "gorongosa", name: "Gorongosa", state: "Mozambique", region: "Lowveld", tagline: "A mountain, a floodplain, a park that came back.", description: "Vila Gorongosa or Chitengo. The park road is the trip. A car for the gate and a heat that sits in the valley.", pickupTown: "Vila Gorongosa, Mozambique", image: I.kruger, established: 1960, acres: "406,000" }),
];

export const SOUTHERN_AFRICA_FEATURED_SLUGS = [
  "kruger",
  "namib-naukluft",
  "etosha",
  "chobe",
  "garden-route",
  "drakensberg",
  "kgalagadi",
  "tsitsikamma",
] as const;

export const SOUTHERN_AFRICA_REGION_FILTERS = [
  { id: "lowveld", label: "Lowveld", match: ["Lowveld"] },
  { id: "cape", label: "Cape", match: ["Cape"] },
  { id: "highveld", label: "Highveld", match: ["Highveld"] },
  { id: "namib", label: "Namib", match: ["Namib"] },
  { id: "kalahari", label: "Kalahari", match: ["Kalahari"] },
] as const;
