export type HelpArticle = {
  slug: string;
  title: string;
  blurb: string;
  topic: "guests" | "hosts" | "protection" | "account";
  body: string[];
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "booking-a-trip",
    title: "Booking a trip",
    blurb: "Dates, protection, pickup in the gateway town.",
    topic: "guests",
    body: [
      "Choose a park, then a car. Pickup and return dates are nights the car is yours — return on the morning of the end date.",
      "Instant-book listings confirm as soon as you sign in and accept a protection plan. Host-approval listings wait for the host.",
      "Pickup is always in the gateway town on the listing, not at a city airport counter. The host will share a pin after you book.",
      "Trip totals include the daily rate, a 10% Lookout service fee, and the protection plan you pick.",
      "You do not have the keys until you check in. Open the trip on your phone at pickup, photograph the car, and submit the inspection.",
    ],
  },
  {
    slug: "check-in",
    title: "Check-in at pickup",
    blurb: "Phone photos, damage, cleanliness, then you drive.",
    topic: "guests",
    body: [
      "Check in from Trips when you are standing at the car. Use the camera on this phone — six required angles (front 3/4, rear 3/4, both sides, cabin, odometer) plus fuel or charge, cleanliness, and any existing marks.",
      "Add a close-up of every scratch, dent, or stain you can see. If the car is clean and unmarked, check “no damage I can see.” That report is what the ranger desk compares to check-out.",
      "Cleanliness is four stops: trail ready, lived in, dusty, or needs work. Needs work requires a note.",
      "Submit before you drive. After check-in you cannot cancel the trip from the app — file a claim if something goes wrong.",
      "Check out the same way at return, same angles, so the host can match pickup to drop-off. Hosts can open the inspection on the trip but cannot edit it.",
    ],
  },
  {
    slug: "hosting",
    title: "Listing a car",
    blurb: "Photos, insurance, pickup notes, and going live.",
    topic: "hosts",
    body: [
      "You need an account with a phone number. List from List a car — vehicle details, park, pickup notes, insurance, and the photo gallery.",
      "Six photos are required before a listing can go live: front 3/4, rear 3/4, both sides, cabin, and cargo. Suggested shots (tires, odometer, roof, wear, pickup spot) help guests book and keep claims honest.",
      "Hosts must carry their own valid auto insurance in the state where the car is registered. You name the carrier and policy number when you list. Lookout Protection is a damage waiver for the trip, not a replacement for that policy.",
      "Incomplete listings save as drafts on your account. Publish when the gallery and insurance fields are complete. Admin can pause a listing if a claim is open.",
    ],
  },
  {
    slug: "host-photos",
    title: "Host photo checklist",
    blurb: "Required angles, suggested shots, and why stock photos are not enough.",
    topic: "hosts",
    body: [
      "Guests book the car in the photos. A catalog stand-in is not the car they will pick up. Lookout will not publish a listing until the six required angles are uploaded.",
      "Required: front three-quarter (the hero), rear three-quarter, driver side, passenger side, cabin, and cargo or truck bed. Daylight, whole vehicle, no heavy filters.",
      "Suggested: tires and wheels, odometer, roof or rack, existing scratches, the pickup spot without a house number, and anything else a guest should see (camping kit, seats folded).",
      "Shoot the actual car, uncluttered. Replace a photo from Photos & details on your account if you wash it, swap tires, or add a dent you want on record.",
      "Do not upload another car, screenshots, or dealer inventory. The ranger desk can pause a listing that does not match check-in.",
    ],
  },
  {
    slug: "protection",
    title: "Lookout Protection",
    blurb: "Trail, Ridge, and Summit — what each plan actually covers.",
    topic: "protection",
    body: [
      "Lookout Protection is a contractual damage waiver administered by Lookout. It is not an insurance policy issued by a licensed carrier.",
      "Trail is $0 extra: you are responsible for damage up to the vehicle value under the host’s own policy and the trip terms.",
      "Ridge ($19/day) is a physical-damage waiver with a $1,500 guest responsibility and a $75,000 vehicle cap for eligible collision and comprehensive events during the booked trip.",
      "Summit ($34/day) drops guest responsibility to $250, raises the vehicle cap to $150,000, and includes park-roadside (winch-out, jump, spare) within 50 miles of the listed park.",
      "Excluded: racing, off-list trails closed by the Park Service, driving under the influence, commercial use, and wear items (tires, brakes) unless caused by a covered event.",
      "A live admitted or surplus-lines program with a named carrier requires a licensed producer and a signed program agreement. That is not bound on this site.",
    ],
  },
  {
    slug: "claims",
    title: "Filing a claim",
    blurb: "How the claims desk works after a trip incident.",
    topic: "protection",
    body: [
      "Sign in, open Claims, and file against a confirmed booking. Photos from check-in and check-out are already on the trip — add a written description of what changed.",
      "Admin reviews every claim. Status moves from Filed → Reviewing → Approved or Denied.",
      "Approved Ridge and Summit claims apply the guest responsibility first, then Lookout’s waiver up to the plan cap. Trail claims are between you and the host.",
      "File within 48 hours of the incident, or before you return the car, whichever is sooner.",
    ],
  },
  {
    slug: "cancellations",
    title: "Cancellations",
    blurb: "How to cancel, and what happens to the calendar.",
    topic: "guests",
    body: [
      "Cancel from Trips. The dates free immediately so another guest can book.",
      "This demo does not collect card payments, so there is no refund to process. A live payments build would refund according to the host’s cancellation window.",
      "Hosts can pause a listing from Account if the car will be away.",
    ],
  },
  {
    slug: "accounts",
    title: "Your account",
    blurb: "Google, X, or email — and the first host on the mountain.",
    topic: "account",
    body: [
      "Sign in with Google, X, or an email and password. Your trips, listings, tickets, and claims follow that account across devices.",
      "The first account on a fresh Lookout is the ranger desk (admin). Later accounts start as guests and can host by listing a car.",
      "Update your trail name, hometown, and phone from Account. We do not sell that information.",
      "To leave Lookout, open Account, type DELETE, and confirm. That cancels open trips, removes listings, tickets, claims, and the profile. Privacy details live on the Privacy policy page.",
    ],
  },
  {
    slug: "pickup",
    title: "Pickup at the gate",
    blurb: "Where keys actually change hands.",
    topic: "guests",
    body: [
      "Every listing names a gateway town: El Portal, Springdale, Healy, Kula, Terlingua, and so on.",
      "Meet the host there. They know which entrance is open and which overlook still has shade.",
      "Return with a reasonably full tank or charge. Unlimited miles are included.",
    ],
  },
  {
    slug: "iphone-and-android",
    title: "iPhone and Android app",
    blurb: "Add Lookout to your home screen.",
    topic: "account",
    body: [
      "Lookout is a home-screen app on iPhone and Android today. The App Store and Play Store wrap is built and compiles in the cloud — listings go live after Apple and Google developer accounts are approved.",
      "On iPhone today: open Lookout in Safari, tap Share, then Add to Home Screen. Chrome on iPhone cannot install it. There is a step-by-step walkthrough on Get the app.",
      "On Android today: open Lookout in Chrome. Tap Install Lookout if you see it, or use the Chrome menu → Install app.",
      "After install it opens full-screen with tabs for Home, Parks, Cars, Trips, and You. Your account, trips, and listings are the same as the website.",
    ],
  },
  {
    slug: "safety",
    title: "Safety and parks",
    blurb: "Lookout is not the National Park Service.",
    topic: "account",
    body: [
      "Lookout is a private marketplace. It is not affiliated with the National Park Service.",
      "You still need a park pass, and you still follow park road closures.",
      "If something feels wrong on a trip, open a support ticket or a claim. Admin watches both queues.",
    ],
  },
];

export function helpBySlug(slug: string) {
  return HELP_ARTICLES.find((a) => a.slug === slug) ?? null;
}
