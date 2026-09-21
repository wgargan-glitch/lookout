/** Trip-period cover. Renter pays. Host personal policy is off-trip only. */

export const SERVICE_FEE_RATE = 0.1;

/** Mandatory motor liability on every booked trip. Renter-paid line item. */
export const TRIP_LIABILITY = {
  name: "Trip liability",
  dailyCents: 1200,
  summary: "Included on every trip. Covers other people and their cars while you’re driving.",
} as const;

export const PROTECTION_PLANS = [
  {
    id: "trail",
    name: "Minimum",
    tripRate: 0.2,
    floorDailyCents: 1400,
    guestResponsibility: "$3,000",
    vehicleCap: "$75,000",
    roadside: false,
    guestBlurb: "The lightest plan. You’ll see the daily price when you reserve.",
    summary: "You’ll owe up to $3,000 if the car is damaged.",
    details: [
      "Caps what you owe for collision and theft of the host’s car during the booked trip.",
      "$3,000 guest responsibility per incident, $75,000 vehicle cap.",
      "Does not replace trip liability. Does not cover the host’s off-trip personal policy.",
    ],
  },
  {
    id: "ridge",
    name: "Standard",
    tripRate: 0.4,
    floorDailyCents: 1900,
    guestResponsibility: "$500",
    vehicleCap: "$75,000",
    roadside: false,
    guestBlurb: "What most guests pick. Lower amount you’d owe if something happens.",
    summary: "You’ll owe up to $500 if the car is damaged. Most guests pick this.",
    details: [
      "Same structure as Minimum, with $500 guest responsibility and a $75,000 vehicle cap.",
      "Park roadside is not included. You’ll see the daily price at checkout.",
    ],
  },
  {
    id: "summit",
    name: "Premier",
    tripRate: 0.65,
    floorDailyCents: 3400,
    guestResponsibility: "$0",
    vehicleCap: "$150,000",
    roadside: true,
    guestBlurb: "Nothing extra to owe for covered damage, plus help if you get stuck near the park.",
    summary: "You owe $0 for covered damage, plus roadside near the park.",
    details: [
      "$0 guest responsibility, $150,000 vehicle cap.",
      "Park roadside within 50 miles of the listed park: jump, spare, winch-out on a legal road.",
    ],
  },
] as const;

export const OWN_INSURANCE_PLAN = {
  id: "own",
  name: "Verified own policy",
  tripRate: 0,
  floorDailyCents: 0,
  guestResponsibility: "Your policy",
  vehicleCap: "Your policy",
  roadside: false,
  summary: "Use your own policy for damage, if we can confirm it covers this trip. Trip liability still applies.",
  details: [
    "Available if we can confirm the policy is active, names you, lasts through the trip, and covers this kind of rental.",
    "Trip liability stays on the booking even if you skip a Lookout damage plan.",
  ],
} as const;

export type GuestPlanId = (typeof PROTECTION_PLANS)[number]["id"];
export type ProtectionId = GuestPlanId | typeof OWN_INSURANCE_PLAN.id;

export const DEFAULT_PROTECTION: GuestPlanId = "ridge";

export function parseProtection(value: unknown): ProtectionId {
  if (value === "trail" || value === "ridge" || value === "summit" || value === "own") return value;
  return DEFAULT_PROTECTION;
}

export function isGuestPlanId(id: ProtectionId): id is GuestPlanId {
  return id === "trail" || id === "ridge" || id === "summit";
}

export function planLabel(id: ProtectionId) {
  return getPlan(id).name;
}

export type AnyPlan = (typeof PROTECTION_PLANS)[number] | typeof OWN_INSURANCE_PLAN;

export function getPlan(id: ProtectionId): AnyPlan {
  if (id === "own") return OWN_INSURANCE_PLAN;
  return PROTECTION_PLANS.find((p) => p.id === id) ?? PROTECTION_PLANS[1];
}

export function planDailyCents(plan: AnyPlan, tripDailyCents: number) {
  if (plan.tripRate <= 0) return 0;
  return Math.max(plan.floorDailyCents, Math.round(tripDailyCents * plan.tripRate));
}

export function tripDays(fromISO: string, toISO: string) {
  const from = Date.parse(`${fromISO}T00:00:00`);
  const to = Date.parse(`${toISO}T00:00:00`);
  const days = Math.round((to - from) / 86_400_000);
  return Math.max(1, days);
}

export function quoteTrip(input: {
  dailyCents: number;
  fromISO: string;
  toISO: string;
  protection: ProtectionId;
}) {
  const days = tripDays(input.fromISO, input.toISO);
  const tripCents = input.dailyCents * days;
  const serviceCents = Math.round(tripCents * SERVICE_FEE_RATE);
  const liabilityCents = TRIP_LIABILITY.dailyCents * days;
  const plan = getPlan(input.protection);
  const protectionDaily = planDailyCents(plan, input.dailyCents);
  const protectionCents = protectionDaily * days;
  return {
    days,
    tripCents,
    serviceCents,
    liabilityCents,
    protectionCents,
    protectionDaily,
    protectionName: plan.name,
    protectionId: plan.id,
    totalCents: tripCents + serviceCents + liabilityCents + protectionCents,
  };
}

export type TripQuote = ReturnType<typeof quoteTrip>;

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) {
  return aStart < bEnd && bStart < aEnd;
}
