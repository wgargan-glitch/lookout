import type { Park } from "@/lib/catalog";

const I = {
  rockies: "/images/territories/canada/rockies.jpg",
  pacific: "/images/territories/canada/pacific.jpg",
  atlantic: "/images/territories/canada/atlantic.jpg",
  prairies: "/images/territories/canada/prairies.jpg",
};

function row(p: Omit<Park, "territoryId" | "areaUnit">): Park {
  return { ...p, territoryId: "canada", areaUnit: "ha" };
}

/** Parks Canada drive-to parks with a town for keys. Fly-in parks stay off the list. */
export const CANADA_PARKS: Park[] = [
  row({ slug: "banff", name: "Banff", state: "Alberta", region: "Rockies", tagline: "The first national park in Canada, a town inside it, a lake everyone already knows.", description: "Banff town is the porch. Lake Louise and the Icefields Parkway are the rest of the day. Hosts leave a car that can sit in a viewpoint queue and still make a trailhead before 8.", pickupTown: "Banff, Alberta", image: I.rockies, established: 1885, acres: "664,100" }),
  row({ slug: "jasper", name: "Jasper", state: "Alberta", region: "Rockies", tagline: "The bigger Rockies park, a town that still feels like a railroad stop.", description: "Jasper. Maligne and the Parkway south. You want something that likes elk in the road and a frost in September.", pickupTown: "Jasper, Alberta", image: I.rockies, established: 1907, acres: "1,087,800" }),
  row({ slug: "yoho", name: "Yoho", state: "British Columbia", region: "Rockies", tagline: "A name that means awe, Emerald Lake, a spiral tunnel.", description: "Field, B.C. The Takakkaw road is the trip. Hosts know which lot still has a space when Banff does not.", pickupTown: "Field, British Columbia", image: I.rockies, established: 1886, acres: "131,300" }),
  row({ slug: "kootenay", name: "Kootenay", state: "British Columbia", region: "Rockies", tagline: "Hot springs, a canyon, the quieter side of the divide.", description: "Radium Hot Springs. The Banff–Windermere road is the park. A car for the canyon and the soak after.", pickupTown: "Radium Hot Springs, British Columbia", image: I.rockies, established: 1920, acres: "140,600" }),
  row({ slug: "glacier-bc", name: "Glacier", state: "British Columbia", region: "Rockies", tagline: "Rogers Pass, avalanche sheds, a park that is a highway.", description: "Revelstoke or Golden. The pass is the product. Hosts leave a layer that is not a fashion choice.", pickupTown: "Revelstoke, British Columbia", image: I.rockies, established: 1886, acres: "134,900" }),
  row({ slug: "waterton", name: "Waterton Lakes", state: "Alberta", region: "Rockies", tagline: "Where the prairie hits the Rockies, a boat that is a tradition.", description: "Waterton. The Prince of Wales is the postcard. A car for the Red Rock Parkway and the days the wind owns the lake.", pickupTown: "Waterton, Alberta", image: I.rockies, established: 1895, acres: "50,500" }),
  row({ slug: "pacific-rim", name: "Pacific Rim", state: "British Columbia", region: "Pacific", tagline: "Long Beach, rainforest, a west coast that is always a little wet.", description: "Tofino or Ucluelet. The park is beach and boardwalk. Hosts expect sand and a tide table.", pickupTown: "Tofino, British Columbia", image: I.pacific, established: 1970, acres: "51,000" }),
  row({ slug: "gulf-islands", name: "Gulf Islands", state: "British Columbia", region: "Pacific", tagline: "A park that is a ferry schedule.", description: "Sidney or a listed island. You do not drive every islet. The car is for the island you are on and the ferry you already booked.", pickupTown: "Sidney, British Columbia", image: I.pacific, established: 2003, acres: "3,600" }),

  row({ slug: "grasslands", name: "Grasslands", state: "Saskatchewan", region: "Prairies", tagline: "Mixed-grass, badlands, a dark sky that is the point.", description: "Val Marie. The west block is the drive. Hosts leave a full tank; the next pump is a decision.", pickupTown: "Val Marie, Saskatchewan", image: I.prairies, established: 1981, acres: "73,000" }),
  row({ slug: "riding-mountain", name: "Riding Mountain", state: "Manitoba", region: "Prairies", tagline: "An escarpment island of forest in the prairie.", description: "Wasagaming. The bison paddock and the lakes. A car for the parkway and the town that is inside the park.", pickupTown: "Wasagaming, Manitoba", image: I.prairies, established: 1933, acres: "297,000" }),
  row({ slug: "prince-albert", name: "Prince Albert", state: "Saskatchewan", region: "Prairies", tagline: "Lakes, boreal, a park Grey Owl already advertised.", description: "Waskesiu. The town is the gate. Hosts know which lake still has a canoe at 4.", pickupTown: "Waskesiu, Saskatchewan", image: I.prairies, established: 1927, acres: "387,500" }),
  row({ slug: "elk-island", name: "Elk Island", state: "Alberta", region: "Prairies", tagline: "Bison twenty minutes from Edmonton, a fence that is the park.", description: "Fort Saskatchewan or Edmonton’s east side. The park is a loop. A car for the dawn bison and the ice-cream after.", pickupTown: "Fort Saskatchewan, Alberta", image: I.prairies, established: 1913, acres: "19,400" }),
  row({ slug: "wood-buffalo", name: "Wood Buffalo", state: "Alberta", region: "Prairies", tagline: "The largest park in Canada, whooping cranes, a road that is a rumour in April.", description: "Fort Smith. Distances lie. Hosts leave a spare and a sense that this is not Banff.", pickupTown: "Fort Smith, Northwest Territories", image: I.prairies, established: 1922, acres: "4,480,700" }),

  row({ slug: "gros-morne", name: "Gros Morne", state: "Newfoundland and Labrador", region: "Atlantic", tagline: "Tablelands you can touch, a fjord that is a boat.", description: "Rocky Harbour or Norris Point. The park is a geology lesson with a trail. You want something that likes fog and a moose.", pickupTown: "Rocky Harbour, Newfoundland", image: I.atlantic, established: 1973, acres: "180,500" }),
  row({ slug: "cape-breton-highlands", name: "Cape Breton Highlands", state: "Nova Scotia", region: "Atlantic", tagline: "The Cabot Trail, if you still have the nerve for the headlands.", description: "Ingonish or Chéticamp. The trail is the park road. Hosts know which overlook still has a pulloff in October.", pickupTown: "Ingonish, Nova Scotia", image: I.atlantic, established: 1936, acres: "94,800" }),
  row({ slug: "fundy", name: "Fundy", state: "New Brunswick", region: "Atlantic", tagline: "The highest tides, a flowerpot, a town called Alma.", description: "Alma. The tide timetable is the product. A car for the point and the hour the ocean is a mudflat.", pickupTown: "Alma, New Brunswick", image: I.atlantic, established: 1948, acres: "20,600" }),
  row({ slug: "forillon", name: "Forillon", state: "Quebec", region: "Atlantic", tagline: "The Gaspé’s end, whales if the gulf agrees.", description: "Gaspé. The park is a peninsula. Hosts leave a wind layer that has already been used.", pickupTown: "Gaspé, Quebec", image: I.atlantic, established: 1970, acres: "24,400" }),
  row({ slug: "pei", name: "Prince Edward Island", state: "Prince Edward Island", region: "Atlantic", tagline: "Green Gables, dunes, a park that is a shore.", description: "Cavendish. The park is beach and a story. A car for the dunes and the rest of the island after.", pickupTown: "Cavendish, Prince Edward Island", image: I.atlantic, established: 1937, acres: "2,200" }),
  row({ slug: "kejimkujik", name: "Kejimkujik", state: "Nova Scotia", region: "Atlantic", tagline: "Interior lakes, petroglyphs, a dark-sky preserve.", description: "Maitland Bridge. The seaside adjunct is a different drive. Hosts expect a canoe and blackflies in June.", pickupTown: "Maitland Bridge, Nova Scotia", image: I.atlantic, established: 1967, acres: "40,400" }),
  row({ slug: "terra-nova", name: "Terra Nova", state: "Newfoundland and Labrador", region: "Atlantic", tagline: "The first national park in Newfoundland, boreal meeting the sea.", description: "Glovertown. The Trans-Canada is the neighbour. A car for the inlets and the icebergs if the season came.", pickupTown: "Glovertown, Newfoundland", image: I.atlantic, established: 1957, acres: "40,000" }),
  row({ slug: "kouchibouguac", name: "Kouchibouguac", state: "New Brunswick", region: "Atlantic", tagline: "Barrier islands, piping plover, a name you will practise.", description: "Richibucto or Saint-Louis-de-Kent. The park is boardwalk and dune. Hosts leave sand on purpose.", pickupTown: "Richibucto, New Brunswick", image: I.atlantic, established: 1969, acres: "23,800" }),

  row({ slug: "bruce-peninsula", name: "Bruce Peninsula", state: "Ontario", region: "Great Lakes", tagline: "Grotto, Georgian Bay, a ferry if you kept going.", description: "Tobermory. The Grotto fills at dawn. A car for the gate and the shipwrecks you snorkel after.", pickupTown: "Tobermory, Ontario", image: I.atlantic, established: 1987, acres: "15,600" }),
  row({ slug: "thousand-islands", name: "Thousand Islands", state: "Ontario", region: "Great Lakes", tagline: "A park that is a river, a boat, a castle someone built.", description: "Gananoque. Most of the park is water. The car is for the mainland lots and the Mallorytown stretch.", pickupTown: "Gananoque, Ontario", image: I.atlantic, established: 1904, acres: "2,400" }),
  row({ slug: "pukaskwa", name: "Pukaskwa", state: "Ontario", region: "Great Lakes", tagline: "The wild shore of Superior, a road that ends.", description: "Marathon or Heron Bay. The coastal trail is walking. Hosts leave bugsense and a full tank.", pickupTown: "Marathon, Ontario", image: I.atlantic, established: 1978, acres: "187,800" }),
  row({ slug: "point-pelee", name: "Point Pelee", state: "Ontario", region: "Great Lakes", tagline: "The southernmost tip, birds in May, a tram to the point.", description: "Leamington. The point is a spit. A car for the visitor centre; the last bit is the tram.", pickupTown: "Leamington, Ontario", image: I.prairies, established: 1918, acres: "1,500" }),
  row({ slug: "la-mauricie", name: "La Mauricie", state: "Quebec", region: "Great Lakes", tagline: "Laurentian lakes, a parkway, Shawinigan as the town.", description: "Shawinigan or Saint-Mathieu-du-Parc. The parkway is the trip. Hosts know which lake still has a canoe.", pickupTown: "Shawinigan, Quebec", image: I.atlantic, established: 1970, acres: "53,600" }),

  row({ slug: "kluane", name: "Kluane", state: "Yukon", region: "North", tagline: "Icefields, the highest peak in Canada, a highway along the edge.", description: "Haines Junction. You do not drive the ice. The car is for the Alaska Highway and the days the mountain is out.", pickupTown: "Haines Junction, Yukon", image: I.rockies, established: 1976, acres: "2,201,700" }),
];

export const CANADA_FEATURED_SLUGS = [
  "banff",
  "jasper",
  "pacific-rim",
  "gros-morne",
  "cape-breton-highlands",
  "waterton",
  "bruce-peninsula",
  "kluane",
] as const;

export const CANADA_REGION_FILTERS = [
  { id: "rockies", label: "Rockies", match: ["Rockies"] },
  { id: "pacific", label: "Pacific", match: ["Pacific"] },
  { id: "prairies", label: "Prairies", match: ["Prairies"] },
  { id: "atlantic", label: "Atlantic", match: ["Atlantic"] },
  { id: "lakes", label: "Great Lakes", match: ["Great Lakes"] },
  { id: "north", label: "North", match: ["North"] },
] as const;
