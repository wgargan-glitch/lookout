import { FEDERAL_CARS, FEDERAL_HOSTS, FEDERAL_PARKS, FEDERAL_REVIEWS } from "@/lib/catalog-federal";

export type Park = {
  slug: string;
  name: string;
  state: string;
  region: string;
  tagline: string;
  description: string;
  pickupTown: string;
  image: string;
  established: number;
  acres: string;
};

export type Host = {
  id: string;
  alias: string;
  sinceYear: number;
  hometown: string;
  bio: string;
  image: string;
  trips: number;
  rating: number;
  responseTime: string;
};

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  category: "suv" | "truck" | "van" | "sports" | "overland" | "car";
  parkSlug: string;
  hostId: string;
  dailyCents: number;
  seats: number;
  doors: number;
  mpg: string;
  transmission: string;
  drivetrain: string;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  petFriendly: boolean;
  camping: boolean;
  instantBook: boolean;
  electric: boolean;
  overland?: boolean;
  ratingAvg: number;
  tripCount: number;
  pickupNotes?: string;
};

export type Review = {
  carId: string;
  authorAlias: string;
  rating: number;
  title: string;
  body: string;
  createdOn: string;
};

export type BookingSeed = {
  carId: string;
  startDate: string;
  endDate: string;
};

export const PARKS: Park[] = [
  {
    slug: "yosemite",
    name: "Yosemite",
    state: "California",
    region: "Sierra Nevada",
    tagline: "Granite, water, and a valley that still stops traffic.",
    description:
      "Keys change hands in El Portal, twenty minutes from the Valley floor. From there the road is yours: Tunnel View at dusk, Glacier Point if the gates are open, Tuolumne when you want the high country to yourself.",
    pickupTown: "El Portal, CA",
    image: "/images/parks/yosemite.jpg",
    established: 1890,
    acres: "759,620",
  },
  {
    slug: "grand-canyon",
    name: "Grand Canyon",
    state: "Arizona",
    region: "Colorado Plateau",
    tagline: "A hole in the ground, if the ground were a continent.",
    description:
      "Pick up in Tusayan and be on the South Rim before the first shuttle. Desert-rated rubber, extra water, and enough clearance for the forest roads that peel off toward the overlooks the buses skip.",
    pickupTown: "Tusayan, AZ",
    image: "/images/parks/grand-canyon.jpg",
    established: 1919,
    acres: "1,201,647",
  },
  {
    slug: "zion",
    name: "Zion",
    state: "Utah",
    region: "Colorado Plateau",
    tagline: "Red walls, a green river, and a canyon you drive into.",
    description:
      "Springdale is the gate. Hosts leave cars in shaded lots a short walk from the shuttle. Use them for Kolob, the east side, and the highway to Bryce — the canyon itself is better on foot.",
    pickupTown: "Springdale, UT",
    image: "/images/parks/zion.jpg",
    established: 1919,
    acres: "146,597",
  },
  {
    slug: "yellowstone",
    name: "Yellowstone",
    state: "Wyoming",
    region: "Northern Rockies",
    tagline: "A caldera with boardwalks, bison, and a speed limit.",
    description:
      "West Yellowstone puts you on the loop before the parking fills. You want something high enough to see over a bison jam and warm enough for a 6 a.m. geyser run.",
    pickupTown: "West Yellowstone, MT",
    image: "/images/parks/yellowstone.jpg",
    established: 1872,
    acres: "2,219,791",
  },
  {
    slug: "glacier",
    name: "Glacier",
    state: "Montana",
    region: "Northern Rockies",
    tagline: "Going-to-the-Sun, if the plows have finished.",
    description:
      "West Glacier hosts keep cars that can take a narrow alpine road without drama. Reserve early — the pass is short, the season shorter.",
    pickupTown: "West Glacier, MT",
    image: "/images/parks/glacier.jpg",
    established: 1910,
    acres: "1,013,126",
  },
  {
    slug: "acadia",
    name: "Acadia",
    state: "Maine",
    region: "Atlantic Coast",
    tagline: "Pink granite, cold water, and a loop road at dawn.",
    description:
      "Bar Harbor is the pickup. The Park Loop is the point. Convertibles in summer, something with heat in October, and a car that fits the carriage-road lots.",
    pickupTown: "Bar Harbor, ME",
    image: "/images/parks/acadia.jpg",
    established: 1916,
    acres: "49,075",
  },
  {
    slug: "olympic",
    name: "Olympic",
    state: "Washington",
    region: "Pacific Northwest",
    tagline: "Rain forest, alpine, and a wild beach in one loop.",
    description:
      "Port Angeles hosts know the Hoh will be wet and Hurricane Ridge might be closed. You want all-weather tires and a car you can leave sandy.",
    pickupTown: "Port Angeles, WA",
    image: "/images/parks/olympic.jpg",
    established: 1938,
    acres: "922,650",
  },
  {
    slug: "arches",
    name: "Arches",
    state: "Utah",
    region: "Colorado Plateau",
    tagline: "Slickrock, timed entry, and a town that still has a Main Street.",
    description:
      "Moab is the base for Arches and Canyonlands. Pickup is easy; parking at Delicate Arch at noon is not. Take a truck with clearance and go early.",
    pickupTown: "Moab, UT",
    image: "/images/parks/arches.jpg",
    established: 1971,
    acres: "76,679",
  },
  {
    slug: "joshua-tree",
    name: "Joshua Tree",
    state: "California",
    region: "Mojave & Colorado Deserts",
    tagline: "Two deserts, a sky full of stars, and a tree that is not a tree.",
    description:
      "Twentynine Palms and Joshua Tree village share the gates. Vans and overland trucks do well here — the camping is the trip.",
    pickupTown: "Twentynine Palms, CA",
    image: "/images/parks/joshua-tree.jpg",
    established: 1994,
    acres: "795,156",
  },
  {
    slug: "grand-teton",
    name: "Grand Teton",
    state: "Wyoming",
    region: "Northern Rockies",
    tagline: "A range that does not bother with foothills.",
    description:
      "Jackson hosts leave keys for the inner park road, Jenny Lake, and the dawn pullouts along the Snake. Four-wheel drive for the unpaved spurs; anything honest for the rest.",
    pickupTown: "Jackson, WY",
    image: "/images/parks/grand-teton.jpg",
    established: 1929,
    acres: "310,044",
  },
  {
    slug: "great-smoky",
    name: "Great Smoky Mountains",
    state: "Tennessee",
    region: "Southern Appalachians",
    tagline: "The busiest park, if you leave the main overlooks.",
    description:
      "Gatlinburg and Cherokee split the two sides. A quiet car for Cades Cove at opening, and enough room for wet dogs after a ridge walk.",
    pickupTown: "Gatlinburg, TN",
    image: "/images/parks/great-smoky.jpg",
    established: 1934,
    acres: "522,427",
  },
  {
    slug: "rocky-mountain",
    name: "Rocky Mountain",
    state: "Colorado",
    region: "Southern Rockies",
    tagline: "Trail Ridge Road, if you remember the altitude.",
    description:
      "Estes Park is the classic pickup. Hosts expect you to drive to 12,000 feet and back before lunch. Bring layers; the car should already have them.",
    pickupTown: "Estes Park, CO",
    image: "/images/parks/rocky-mountain.jpg",
    established: 1915,
    acres: "265,807",
  },
  ...FEDERAL_PARKS,
];

export const HOSTS: Host[] = [
  {
    id: "wren",
    alias: "Wren Holloway",
    sinceYear: 2019,
    hometown: "El Portal, CA",
    bio: "River guide in the off months. Keeps two overland vehicles at the El Portal house and a spare set of chains in the closet that never gets used until it does.",
    image: "/images/hosts/wren.jpg",
    trips: 214,
    rating: 4.97,
    responseTime: "within an hour",
  },
  {
    id: "elias",
    alias: "Elias Park",
    sinceYear: 2017,
    hometown: "Tusayan, AZ",
    bio: "Grew up on the rim. Leaves extra water, a paper map, and a note about which overlooks still have shade at 4 p.m.",
    image: "/images/hosts/elias.jpg",
    trips: 331,
    rating: 4.94,
    responseTime: "within an hour",
  },
  {
    id: "sienna",
    alias: "Sienna Ruiz",
    sinceYear: 2020,
    hometown: "Springdale, UT",
    bio: "Climbs on her days off and treats the east-side highway like a driveway. Cars are always washed, never perfumed.",
    image: "/images/hosts/sienna.jpg",
    trips: 168,
    rating: 4.99,
    responseTime: "within 30 minutes",
  },
  {
    id: "kenji",
    alias: "Kenji Mori",
    sinceYear: 2018,
    hometown: "West Yellowstone, MT",
    bio: "Former park concession mechanic. The Land Cruiser is the one he learned on. He will tell you which geyser parking is a trap.",
    image: "/images/hosts/kenji.jpg",
    trips: 247,
    rating: 4.96,
    responseTime: "within two hours",
  },
  {
    id: "naomi",
    alias: "Naomi Hale",
    sinceYear: 2016,
    hometown: "West Glacier, MT",
    bio: "Retired district ranger. Books fill the week Going-to-the-Sun opens. She still packs a wool blanket in every car.",
    image: "/images/hosts/naomi.jpg",
    trips: 402,
    rating: 5,
    responseTime: "within an hour",
  },
  {
    id: "cole",
    alias: "Cole Brennan",
    sinceYear: 2021,
    hometown: "Bar Harbor, ME",
    bio: "Runs a small boat in summer and parks the Model Y where the Loop Road begins. Knows every foggy sunrise pullout.",
    image: "/images/hosts/cole.jpg",
    trips: 121,
    rating: 4.92,
    responseTime: "within an hour",
  },
  {
    id: "ivy",
    alias: "Ivy Marsh",
    sinceYear: 2019,
    hometown: "Port Angeles, WA",
    bio: "Hoh volunteer in the shoulder seasons. The Outback has mud in the wheel wells on purpose.",
    image: "/images/hosts/ivy.jpg",
    trips: 176,
    rating: 4.95,
    responseTime: "within two hours",
  },
  {
    id: "hank",
    alias: "Hank Mercer",
    sinceYear: 2015,
    hometown: "Moab, UT",
    bio: "Slickrock before it was a brand. The Tacoma has a locker, a full-size spare, and a cooler that actually stays cold.",
    image: "/images/hosts/hank.jpg",
    trips: 389,
    rating: 4.93,
    responseTime: "within an hour",
  },
  {
    id: "lila",
    alias: "Lila Soto",
    sinceYear: 2022,
    hometown: "Twentynine Palms, CA",
    bio: "Built out the Sprinter herself. Stargazing is the product; the van is just the darkroom.",
    image: "/images/hosts/lila.jpg",
    trips: 94,
    rating: 4.98,
    responseTime: "within 30 minutes",
  },
  {
    id: "barrett",
    alias: "Barrett Quinn",
    sinceYear: 2018,
    hometown: "Jackson, WY",
    bio: "Ex-guide on the Snake. The Defender lives in a barn and comes out looking like it never left the meadow.",
    image: "/images/hosts/barrett.jpg",
    trips: 210,
    rating: 4.97,
    responseTime: "within an hour",
  },
  {
    id: "june",
    alias: "June Reed",
    sinceYear: 2020,
    hometown: "Gatlinburg, TN",
    bio: "Family still has a cabin on the Tennessee side. She stocks the Buzz with a paper atlas because the hollows eat signal.",
    image: "/images/hosts/june.jpg",
    trips: 143,
    rating: 4.91,
    responseTime: "within two hours",
  },
  {
    id: "amara",
    alias: "Amara Singh",
    sinceYear: 2021,
    hometown: "Estes Park, CO",
    bio: "Works in town and keeps the XC90 ready for Trail Ridge. Altitude snacks in the console, snow brush year-round.",
    image: "/images/hosts/amara.jpg",
    trips: 118,
    rating: 4.96,
    responseTime: "within an hour",
  },
  ...FEDERAL_HOSTS,
];

const F = {
  awd: "All-wheel drive",
  four: "4x4 with low range",
  tent: "Rooftop tent",
  camp: "Camping kit",
  pet: "Pet friendly",
  bike: "Bike rack",
  snow: "Snow tires on call",
  mile: "Unlimited miles",
  apple: "Apple CarPlay",
  cool: "Cooler included",
  rec: "Recovery boards",
  ev: "Home charging included",
  camper: "Built-in camper",
  kitchen: "Kitchenette",
  solar: "Roof solar",
  invert: "Inverter",
};

export const CARS: Car[] = [
  {
    id: "bronco-yosemite",
    make: "Ford",
    model: "Bronco",
    year: 2022,
    trim: "Outer Banks",
    category: "suv",
    parkSlug: "yosemite",
    hostId: "wren",
    dailyCents: 12800,
    seats: 4,
    doors: 2,
    mpg: "18 city / 21 hwy",
    transmission: "Automatic",
    drivetrain: "4x4",
    description:
      "The two-door with a soft top and a roof tent that has slept through more Valley nights than I have. Good on Tioga when it opens, better on the forest laterals that the rentals from Fresno will not take. I leave a bear canister and a paper map of the Valley in the glovebox.",
    features: [F.four, F.tent, F.camp, F.pet, F.cool, F.mile],
    images: [
      "/images/cars/bronco-yosemite.jpg",
      "/images/parks/yosemite.jpg",
      "/images/details/rooftop.jpg",
    ],
    featured: true,
    petFriendly: true,
    camping: true,
    instantBook: true,
    electric: false,
    overland: true,
    ratingAvg: 4.97,
    tripCount: 86,
  },
  {
    id: "4runner-zion",
    make: "Toyota",
    model: "4Runner",
    year: 2021,
    trim: "TRD Pro",
    category: "suv",
    parkSlug: "zion",
    hostId: "sienna",
    dailyCents: 11500,
    seats: 5,
    doors: 4,
    mpg: "16 city / 19 hwy",
    transmission: "Automatic",
    drivetrain: "4x4",
    description:
      "Lifted just enough for the Kolob terrace roads, never enough to be a scene. I keep it in Springdale, topped off, with a full-size spare. Use it for the east entrance, the highway to Kanab, and the days you do not want the shuttle.",
    features: [F.four, F.rec, F.cool, F.apple, F.mile, F.pet],
    images: [
      "/images/cars/4runner-zion.jpg",
      "/images/parks/zion.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: true,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: false,
    overland: true,
    ratingAvg: 4.99,
    tripCount: 64,
  },
  {
    id: "wrangler-grand-canyon",
    make: "Jeep",
    model: "Wrangler",
    year: 2023,
    trim: "Rubicon",
    category: "suv",
    parkSlug: "grand-canyon",
    hostId: "elias",
    dailyCents: 14200,
    seats: 4,
    doors: 4,
    mpg: "17 city / 23 hwy",
    transmission: "Automatic",
    drivetrain: "4x4",
    description:
      "Doors off in May, heater on in January. I stock two gallons of water and a paper South Rim map because cell service is a rumor past the village. The forest roads toward Point Sublime are why this exists.",
    features: [F.four, F.rec, F.cool, F.mile, F.pet],
    images: [
      "/images/cars/wrangler-grand-canyon.jpg",
      "/images/parks/grand-canyon.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: true,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: false,
    overland: true,
    ratingAvg: 4.94,
    tripCount: 112,
  },
  {
    id: "rivian-glacier",
    make: "Rivian",
    model: "R1S",
    year: 2024,
    trim: "Adventure",
    category: "suv",
    parkSlug: "glacier",
    hostId: "naomi",
    dailyCents: 18900,
    seats: 5,
    doors: 4,
    mpg: "300 mi range",
    transmission: "Automatic",
    drivetrain: "AWD",
    description:
      "Quiet enough that you hear the river. I charge it at the house in West Glacier overnight; you leave with a full pack and a list of the few stalls that actually work toward St. Mary. Camp mode is the point after a day on the pass.",
    features: [F.awd, F.ev, F.camp, F.apple, F.mile, F.pet],
    images: [
      "/images/cars/rivian-glacier.jpg",
      "/images/parks/glacier.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: true,
    petFriendly: true,
    camping: true,
    instantBook: true,
    electric: true,
    ratingAvg: 4.98,
    tripCount: 41,
  },
  {
    id: "outback-olympic",
    make: "Subaru",
    model: "Outback",
    year: 2020,
    trim: "Wilderness",
    category: "suv",
    parkSlug: "olympic",
    hostId: "ivy",
    dailyCents: 7800,
    seats: 5,
    doors: 4,
    mpg: "22 city / 26 hwy",
    transmission: "Automatic",
    drivetrain: "AWD",
    description:
      "The correct car for a peninsula that cannot decide between moss and beach. All-weather mats, a wet-dog towel, and clearance for the Hoh road after rain. I do not mind sand in the carpets.",
    features: [F.awd, F.pet, F.bike, F.mile, F.apple],
    images: [
      "/images/cars/outback-olympic.jpg",
      "/images/parks/olympic.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: false,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: false,
    ratingAvg: 4.95,
    tripCount: 73,
  },
  {
    id: "tacoma-arches",
    make: "Toyota",
    model: "Tacoma",
    year: 2022,
    trim: "TRD Off-Road",
    category: "truck",
    parkSlug: "arches",
    hostId: "hank",
    dailyCents: 9800,
    seats: 5,
    doors: 4,
    mpg: "18 city / 22 hwy",
    transmission: "Automatic",
    drivetrain: "4x4",
    description:
      "A working truck that happens to live in Moab. Locker, snorkel-adjacent attitude, and a bed you can sleep in if you bring a pad. Good for the Gemini Bridges spur and the Canyonlands neck.",
    features: [F.four, F.rec, F.cool, F.camp, F.mile],
    images: [
      "/images/cars/tacoma-arches.jpg",
      "/images/parks/arches.jpg",
      "/images/details/rooftop.jpg",
    ],
    featured: true,
    petFriendly: false,
    camping: true,
    instantBook: false,
    electric: false,
    ratingAvg: 4.93,
    tripCount: 101,
  },
  {
    id: "defender-teton",
    make: "Land Rover",
    model: "Defender",
    year: 2023,
    trim: "110 X-Dynamic",
    category: "suv",
    parkSlug: "grand-teton",
    hostId: "barrett",
    dailyCents: 21000,
    seats: 5,
    doors: 4,
    mpg: "17 city / 20 hwy",
    transmission: "Automatic",
    drivetrain: "AWD",
    description:
      "The barn-kept 110. Heated everything, because Jackson in June is still a coin flip. I leave binoculars in the door for the sage flats and ask that you rinse the undercarriage if you take the unpaved spur to Two Ocean.",
    features: [F.awd, F.apple, F.cool, F.mile, F.pet, F.snow],
    images: [
      "/images/cars/defender-teton.jpg",
      "/images/parks/grand-teton.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: true,
    petFriendly: true,
    camping: false,
    instantBook: false,
    electric: false,
    ratingAvg: 4.97,
    tripCount: 58,
  },
  {
    id: "sprinter-joshua",
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2019,
    trim: "144 Camper",
    category: "van",
    parkSlug: "joshua-tree",
    hostId: "lila",
    dailyCents: 16500,
    seats: 2,
    doors: 3,
    mpg: "18 hwy",
    transmission: "Automatic",
    drivetrain: "RWD",
    description:
      "A 144-inch van I built for the desert. Queen bed, two-burner, 200 watts of solar, and blackout for the Perseids. Park it at Jumbo Rocks and the night does the rest. Not a party bus.",
    features: [F.camper, F.kitchen, F.solar, F.invert, F.mile],
    images: [
      "/images/cars/sprinter-joshua.jpg",
      "/images/parks/joshua-tree.jpg",
      "/images/details/van-interior.jpg",
    ],
    featured: true,
    petFriendly: false,
    camping: true,
    instantBook: true,
    electric: false,
    ratingAvg: 4.98,
    tripCount: 47,
  },
  {
    id: "model-y-acadia",
    make: "Tesla",
    model: "Model Y",
    year: 2023,
    trim: "Long Range",
    category: "suv",
    parkSlug: "acadia",
    hostId: "cole",
    dailyCents: 9500,
    seats: 5,
    doors: 4,
    mpg: "310 mi range",
    transmission: "Automatic",
    drivetrain: "AWD",
    description:
      "Silent on the Park Loop, which is the whole idea at 5 a.m. I charge it at the house in Bar Harbor. Superchargers in Ellsworth cover a coastal day trip. Please do not take it down the carriage roads.",
    features: [F.awd, F.ev, F.apple, F.mile, F.pet],
    images: [
      "/images/cars/model-y-acadia.jpg",
      "/images/parks/acadia.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: false,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: true,
    ratingAvg: 4.92,
    tripCount: 55,
  },
  {
    id: "911-grand-canyon",
    make: "Porsche",
    model: "911 Carrera",
    year: 2021,
    trim: "Carrera",
    category: "sports",
    parkSlug: "grand-canyon",
    hostId: "elias",
    dailyCents: 24500,
    seats: 4,
    doors: 2,
    mpg: "18 city / 24 hwy",
    transmission: "PDK",
    drivetrain: "RWD",
    description:
      "Not a trail car. It is the 64 from Flagstaff to the rim, and the Desert View drive when you want the canyon in a windscreen instead of a windshield sticker. Street tires, no dirt, no excuses.",
    features: [F.apple, F.mile],
    images: [
      "/images/cars/911-grand-canyon.jpg",
      "/images/parks/grand-canyon.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: false,
    petFriendly: false,
    camping: false,
    instantBook: false,
    electric: false,
    ratingAvg: 4.9,
    tripCount: 29,
  },
  {
    id: "id-buzz-smoky",
    make: "Volkswagen",
    model: "ID. Buzz",
    year: 2024,
    trim: "Pro S",
    category: "van",
    parkSlug: "great-smoky",
    hostId: "june",
    dailyCents: 13200,
    seats: 7,
    doors: 4,
    mpg: "234 mi range",
    transmission: "Automatic",
    drivetrain: "RWD",
    description:
      "A seven-seat electric van for a park that still believes in families. Quiet through Cades Cove, tall enough for coolers, and a charging plan taped to the visor because the hollows do not care about your app.",
    features: [F.ev, F.apple, F.pet, F.mile, F.bike],
    images: [
      "/images/cars/id-buzz-smoky.jpg",
      "/images/parks/great-smoky.jpg",
      "/images/details/van-interior.jpg",
    ],
    featured: true,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: true,
    ratingAvg: 4.91,
    tripCount: 36,
  },
  {
    id: "land-cruiser-yellowstone",
    make: "Toyota",
    model: "Land Cruiser",
    year: 1998,
    trim: "80-Series",
    category: "suv",
    parkSlug: "yellowstone",
    hostId: "kenji",
    dailyCents: 11000,
    seats: 5,
    doors: 4,
    mpg: "13 city / 16 hwy",
    transmission: "Automatic",
    drivetrain: "4x4",
    description:
      "An 80-series I keep honest. Locking diffs, a heater that could melt March, and enough patina that you will not flinch at a bison-adjacent parking job. Not fast. Extremely finished.",
    features: [F.four, F.camp, F.cool, F.rec, F.mile],
    images: [
      "/images/cars/land-cruiser-yellowstone.jpg",
      "/images/parks/yellowstone.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: true,
    petFriendly: false,
    camping: true,
    instantBook: false,
    electric: false,
    overland: true,
    ratingAvg: 4.96,
    tripCount: 77,
  },
  {
    id: "mini-acadia",
    make: "Mini",
    model: "Cooper",
    year: 2022,
    trim: "Convertible S",
    category: "sports",
    parkSlug: "acadia",
    hostId: "cole",
    dailyCents: 7200,
    seats: 4,
    doors: 2,
    mpg: "23 city / 32 hwy",
    transmission: "Automatic",
    drivetrain: "FWD",
    description:
      "Top down on the Park Loop is the reason people come in July. Small enough for the crowded lots, loud enough that you will not miss the foghorn. I ask that you put the top up if it actually rains, which it will.",
    features: [F.apple, F.mile, F.pet],
    images: [
      "/images/cars/mini-acadia.jpg",
      "/images/parks/acadia.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: false,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: false,
    ratingAvg: 4.88,
    tripCount: 44,
  },
  {
    id: "xc90-rocky",
    make: "Volvo",
    model: "XC90",
    year: 2021,
    trim: "Recharge",
    category: "suv",
    parkSlug: "rocky-mountain",
    hostId: "amara",
    dailyCents: 11800,
    seats: 7,
    doors: 4,
    mpg: "55 MPGe",
    transmission: "Automatic",
    drivetrain: "AWD",
    description:
      "A plug-in seven-seater for Trail Ridge. Electric around Estes, gasoline when the road climbs. Child-seat anchors, a wool blanket, and a snow brush that I have needed in June.",
    features: [F.awd, F.ev, F.apple, F.pet, F.snow, F.mile],
    images: [
      "/images/cars/xc90-rocky.jpg",
      "/images/parks/rocky-mountain.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: false,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: true,
    ratingAvg: 4.96,
    tripCount: 52,
  },
  {
    id: "gwagon-zion",
    make: "Mercedes-Benz",
    model: "G 550",
    year: 2020,
    trim: "G 550",
    category: "suv",
    parkSlug: "zion",
    hostId: "sienna",
    dailyCents: 28500,
    seats: 5,
    doors: 4,
    mpg: "13 city / 15 hwy",
    transmission: "Automatic",
    drivetrain: "4x4",
    description:
      "The G-Wagen I should probably not lend and do anyway. Three locking diffs, a ride height that makes the east-side pullouts feel civil, and a thirst you should budget for. No canyon crawling. Scenic, yes.",
    features: [F.four, F.apple, F.mile, F.cool],
    images: [
      "/images/cars/gwagon-zion.jpg",
      "/images/parks/zion.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: false,
    petFriendly: false,
    camping: false,
    instantBook: false,
    electric: false,
    ratingAvg: 4.95,
    tripCount: 22,
  },
  {
    id: "transit-yosemite",
    make: "Ford",
    model: "Transit Trail",
    year: 2022,
    trim: "Trail AWD",
    category: "van",
    parkSlug: "yosemite",
    hostId: "wren",
    dailyCents: 15500,
    seats: 2,
    doors: 3,
    mpg: "16 city / 18 hwy",
    transmission: "Automatic",
    drivetrain: "AWD",
    description:
      "A factory Trail van with a simple sleep platform, blackout, and a two-burner. Legal to park where vans are legal; I will tell you where that still is. Better than a tent when Tioga is cold.",
    features: [F.awd, F.camper, F.kitchen, F.invert, F.mile],
    images: [
      "/images/cars/transit-yosemite.jpg",
      "/images/parks/yosemite.jpg",
      "/images/details/van-interior.jpg",
    ],
    featured: false,
    petFriendly: false,
    camping: true,
    instantBook: true,
    electric: false,
    ratingAvg: 4.9,
    tripCount: 39,
  },
  {
    id: "grand-cherokee-glacier",
    make: "Jeep",
    model: "Grand Cherokee",
    year: 2018,
    trim: "Trailhawk",
    category: "suv",
    parkSlug: "glacier",
    hostId: "naomi",
    dailyCents: 9200,
    seats: 5,
    doors: 4,
    mpg: "18 city / 25 hwy",
    transmission: "Automatic",
    drivetrain: "4x4",
    description:
      "The Trailhawk I used on patrol roads. Quiet, air-suspension when it feels like it, and a set of all-terrains that still have bite. Going-to-the-Sun is paved; this is for the ones that are not.",
    features: [F.four, F.pet, F.apple, F.snow, F.mile],
    images: [
      "/images/cars/grand-cherokee-glacier.jpg",
      "/images/parks/glacier.jpg",
      "/images/details/cabin.jpg",
    ],
    featured: false,
    petFriendly: true,
    camping: false,
    instantBook: true,
    electric: false,
    ratingAvg: 4.89,
    tripCount: 88,
  },
  {
    id: "ridgeline-smoky",
    make: "Honda",
    model: "Ridgeline",
    year: 2023,
    trim: "TrailSport",
    category: "truck",
    parkSlug: "great-smoky",
    hostId: "june",
    dailyCents: 8800,
    seats: 5,
    doors: 4,
    mpg: "18 city / 24 hwy",
    transmission: "Automatic",
    drivetrain: "AWD",
    description:
      "A unibody truck with a bed tent and an in-bed trunk that actually keeps boots dry. The Smokies are wet. This is the honest answer. Dogs allowed; mud assumed.",
    features: [F.awd, F.camp, F.pet, F.cool, F.mile],
    images: [
      "/images/cars/ridgeline-smoky.jpg",
      "/images/parks/great-smoky.jpg",
      "/images/details/rooftop.jpg",
    ],
    featured: false,
    petFriendly: true,
    camping: true,
    instantBook: true,
    electric: false,
    ratingAvg: 4.87,
    tripCount: 31,
  },
  ...FEDERAL_CARS,
];

export const REVIEWS: Review[] = [
  {
    carId: "bronco-yosemite",
    authorAlias: "Cairn",
    rating: 5,
    title: "Slept on Glacier Point road",
    body: "The roof tent is the whole reason we booked. Wren left a note about which pullouts are actually quiet after 9. The Bronco felt planted on the granite laterals.",
    createdOn: "2026-08-14",
  },
  {
    carId: "bronco-yosemite",
    authorAlias: "Switchback",
    rating: 5,
    title: "Keys were where she said",
    body: "El Portal pickup took four minutes. Bear canister was already in the back. We did Valley, then Tioga, and never once wished for a sedan.",
    createdOn: "2026-07-02",
  },
  {
    carId: "4runner-zion",
    authorAlias: "Kolob",
    rating: 5,
    title: "East side, no shuttle",
    body: "Sienna's 4Runner is the way to do Zion if you also want Bryce in the same day. Clean, stocked, and the locker earned its keep on a sandy spur.",
    createdOn: "2026-06-21",
  },
  {
    carId: "4runner-zion",
    authorAlias: "Navajo",
    rating: 5,
    title: "Quiet host, serious truck",
    body: "Not a spa-scented rental. A tool. We put 400 miles on it between Springdale and Kanab and it asked for nothing.",
    createdOn: "2026-05-11",
  },
  {
    carId: "wrangler-grand-canyon",
    authorAlias: "Rimrock",
    rating: 5,
    title: "Doors off at Desert View",
    body: "Elias stocks water like a person who has watched tourists faint. The Jeep is the right height for the forest roads. We will book it again in January.",
    createdOn: "2026-04-18",
  },
  {
    carId: "rivian-glacier",
    authorAlias: "Logan",
    rating: 5,
    title: "Silent on the pass",
    body: "Naomi's charging notes were better than the official app. Camp mode at Rising Sun was the best night of the trip. Range anxiety never showed up.",
    createdOn: "2026-08-03",
  },
  {
    carId: "outback-olympic",
    authorAlias: "Hoh",
    rating: 5,
    title: "Made for rain",
    body: "We did Hoh, Hurricane Ridge, and Rialto in three days. The Outback came back saltier than it left. Ivy did not mind.",
    createdOn: "2026-07-19",
  },
  {
    carId: "tacoma-arches",
    authorAlias: "Fins",
    rating: 5,
    title: "Moab without the rental desk",
    body: "Hank's truck has a locker and a cooler that still had ice on day four. Delicate Arch at sunrise, Canyonlands after lunch. This is the setup.",
    createdOn: "2026-06-08",
  },
  {
    carId: "defender-teton",
    authorAlias: "Oxbow",
    rating: 5,
    title: "Jenny Lake at 5:40",
    body: "The Defender is overkill until it is not. Heated seats after a windy overlook. Barrett's binoculars spotted a moose we would have missed.",
    createdOn: "2026-08-22",
  },
  {
    carId: "sprinter-joshua",
    authorAlias: "Perseid",
    rating: 5,
    title: "Built, not decorated",
    body: "Lila's van is a serious desert camp. The solar kept up, the bed is actually flat, and Jumbo Rocks at 2 a.m. is why you come here.",
    createdOn: "2026-05-29",
  },
  {
    carId: "model-y-acadia",
    authorAlias: "Cadillac",
    rating: 5,
    title: "Dawn on the Loop",
    body: "Cole left it charged. We did the Park Loop before the buses and it was quiet enough to hear the swell. Supercharger in Ellsworth was easy.",
    createdOn: "2026-07-11",
  },
  {
    carId: "911-grand-canyon",
    authorAlias: "Flagstaff",
    rating: 5,
    title: "The drive is the park",
    body: "Elias was clear: pavement only. We treated it that way. Desert View Drive in a 911 is an argument for going the long way.",
    createdOn: "2026-03-14",
  },
  {
    carId: "id-buzz-smoky",
    authorAlias: "Cove",
    rating: 5,
    title: "Seven seats, one hollow",
    body: "June's charging sheet saved us. Cades Cove at opening with grandparents and kids, then a ridge walk. The Buzz is a family tool that does not feel like a minivan.",
    createdOn: "2026-06-30",
  },
  {
    carId: "land-cruiser-yellowstone",
    authorAlias: "Old Faithful",
    rating: 5,
    title: "The right vintage",
    body: "Kenji's 80-series is maintained, not cosseted. We sat through a bison jam without caring. Heater could defrost July.",
    createdOn: "2026-05-02",
  },
  {
    carId: "mini-acadia",
    authorAlias: "Otter",
    rating: 4,
    title: "Tiny, correct",
    body: "Top down until the fog rolled in, which was 9 a.m. Fits the lots. Not the car for a wet Labrador, which we learned.",
    createdOn: "2026-08-01",
  },
  {
    carId: "xc90-rocky",
    authorAlias: "Trail Ridge",
    rating: 5,
    title: "Altitude without the circus",
    body: "Amara's XC90 handled 12,000 feet like it was a commute. Seven seats for a family that still wanted one vehicle. Snow brush was not a joke.",
    createdOn: "2026-06-16",
  },
  {
    carId: "gwagon-zion",
    authorAlias: "Watchman",
    rating: 5,
    title: "A scene, on purpose",
    body: "We wanted the east-side highway to feel like an occasion. It did. Thirsty, tall, and not for the Zion shuttle crowd — which was the point.",
    createdOn: "2026-04-09",
  },
  {
    carId: "transit-yosemite",
    authorAlias: "Tioga",
    rating: 5,
    title: "Legal overnight, actual bed",
    body: "Wren's notes on where vans can stay were better than the forums. The platform is simple and the AWD mattered on a wet morning out of Tuolumne.",
    createdOn: "2026-07-28",
  },
  {
    carId: "grand-cherokee-glacier",
    authorAlias: "Many Glacier",
    rating: 4,
    title: "Patrol-road honest",
    body: "Not pretty. Extremely capable. Naomi's Trailhawk took us to a pullout the RVs cannot enter. Air suspension grumbled once and then behaved.",
    createdOn: "2026-08-09",
  },
  {
    carId: "ridgeline-smoky",
    authorAlias: "Chimney",
    rating: 5,
    title: "Bed tent in the rain",
    body: "The in-bed trunk kept the boots dry and the tent kept us off the soaked ground. June's truck is the Smokies in object form.",
    createdOn: "2026-05-20",
  },
  ...FEDERAL_REVIEWS,
];

export const BOOKING_SEEDS: BookingSeed[] = [
  { carId: "bronco-yosemite", startDate: "2026-09-20", endDate: "2026-09-24" },
  { carId: "rivian-glacier", startDate: "2026-09-18", endDate: "2026-09-22" },
  { carId: "sprinter-joshua", startDate: "2026-09-25", endDate: "2026-09-29" },
  { carId: "defender-teton", startDate: "2026-10-02", endDate: "2026-10-06" },
  { carId: "4runner-zion", startDate: "2026-09-17", endDate: "2026-09-19" },
];

export const CATEGORIES = [
  { id: "suv", label: "SUVs" },
  { id: "truck", label: "Trucks" },
  { id: "van", label: "Vans" },
  { id: "car", label: "Cars" },
  { id: "sports", label: "Sports" },
] as const;

export const EXTRA_CATEGORIES = [{ id: "overland", label: "Overland" }] as const;

export function isOverlandCar(car: Car) {
  return Boolean(car.overland) || car.category === "overland";
}

export function carMatchesCategory(car: Car, category: string) {
  if (category === "overland") return isOverlandCar(car);
  if (car.category === category) return true;
  if (category === "suv" && car.category === "overland") return true;
  return false;
}

export const TRAIL_ALIASES = [
  "Juniper",
  "Lodgepole",
  "Switchback",
  "Cairn",
  "Rimrock",
  "Firelook",
  "Saddle",
  "Krummholz",
  "Talus",
  "Oxbow",
];

export function parkBySlug(slug: string) {
  return PARKS.find((p) => p.slug === slug);
}

export function hostById(id: string) {
  return HOSTS.find((h) => h.id === id);
}

export function carTitle(car: Pick<Car, "year" | "make" | "model">) {
  return `${car.year} ${car.make} ${car.model}`;
}

export const FEATURED_PARK_SLUGS = [
  "yosemite",
  "grand-canyon",
  "yellowstone",
  "zion",
  "denali",
  "acadia",
  "big-bend",
  "haleakala",
] as const;

export const PARK_REGION_FILTERS = [
  { id: "alaska", label: "Alaska", match: ["Alaska"] },
  { id: "pacific", label: "Pacific & islands", match: ["Pacific", "Hawaii", "Caribbean"] },
  { id: "west-coast", label: "West Coast", match: ["Pacific Coast", "Pacific Northwest", "California", "Sierra Nevada"] },
  { id: "southwest", label: "Southwest", match: ["Colorado Plateau", "Mojave & Colorado Deserts", "Sonoran Desert", "Chihuahuan Desert", "Great Basin"] },
  { id: "rockies", label: "Rockies", match: ["Northern Rockies", "Southern Rockies"] },
  { id: "plains", label: "Great Plains", match: ["Great Plains"] },
  { id: "midwest", label: "Midwest", match: ["Midwest"] },
  { id: "south", label: "South & Appalachians", match: ["South", "Southeast", "Southern Appalachians"] },
  { id: "atlantic", label: "Atlantic", match: ["Atlantic Coast"] },
] as const;

export function groupedParks(parks: Park[] = PARKS) {
  const map = new Map<string, Park[]>();
  for (const park of [...parks].sort((a, b) => a.name.localeCompare(b.name))) {
    const list = map.get(park.region) ?? [];
    list.push(park);
    map.set(park.region, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([region, list]) => ({ region, parks: list }));
}

export function featuredParks() {
  const bySlug = new Map(PARKS.map((p) => [p.slug, p]));
  return FEATURED_PARK_SLUGS.map((slug) => bySlug.get(slug)).filter((p): p is Park => Boolean(p));
}
