export const STORE_APP_ID = "app.lookout.parks";
export const STORE_APP_NAME = "Lookout";
export const STORE_CATEGORY = "Travel";

export const STORE_LISTING = {
  subtitle: "Cars at the park gate",
  shortDescription: "Peer-to-peer cars from locals at all 63 U.S. national parks.",
  fullDescription: [
    "Lookout is a peer-to-peer car marketplace for trips to America's national parks. Hosts keep a vehicle in the gateway town. Guests book dates, pay trip liability plus a protection plan, and meet at the gate — not at an airport counter.",
    "Browse all 63 parks, filter overland rigs, vans, trucks, and electric cars, and keep trips on the same account as the website.",
    "Trip liability is a required renter-paid line on every booking (a licensed carrier is not bound yet). Guest plans Minimum, Standard, and Premier are contractual damage waivers, not licensed insurance. Hosts keep personal auto insurance for off-trip use. Lookout is not affiliated with the National Park Service.",
    "Card charges are not live yet. Booking confirms the reservation and the waiver; payment processing ships when Stripe is connected.",
  ].join("\n\n"),
  keywords: "national parks,car rental,Turo,overland,road trip,Yosemite,camping",
  supportUrl: "/support",
  privacyUrl: "/privacy",
  termsUrl: "/terms",
  ageRating: "17+",
  ageReason: "Requires a valid driver's license. Marketplace for vehicle rentals.",
};

export const OWNER_CHECKLIST = [
  {
    id: "wrap",
    title: "Native wrap",
    done: true,
    detail: "iPhone and Android shells are in the Lookout project. They open the live site full-screen — same account, same trips.",
  },
  {
    id: "legal",
    title: "Privacy, terms, delete account",
    done: true,
    detail: "Required for both stores. Guests can wipe their Lookout from Account.",
  },
  {
    id: "cloud",
    title: "Cloud builds (no Mac)",
    done: true,
    detail: "A GitHub Action compiles the iPhone app on Apple's cloud runners and the Android app on Linux. You never need Xcode on your desk.",
  },
  {
    id: "publish",
    title: "Public Lookout URL",
    done: false,
    owner: true,
    detail: "Hit Publish in Grok so the store apps have a live HTTPS address to load. Then we point the wrap at it.",
  },
  {
    id: "apple",
    title: "Apple Developer Program",
    done: false,
    owner: true,
    detail: "$99 per year at developer.apple.com/programs. Individual enrollment is enough. After it is approved, send the Team ID.",
  },
  {
    id: "google",
    title: "Google Play Console",
    done: false,
    owner: true,
    detail: "$25 one-time at play.google.com/console. Identity check usually takes a day or two.",
  },
] as const;
