/** Trip-period cover. Renter pays. Host personal policy is off-trip only. */

export const SERVICE_FEE_RATE = 0.1;

/** Mandatory motor liability on every booked trip. Renter-paid line item. */
export const TRIP_LIABILITY = {
  name: "Trip liability",
  dailyCents: 1200,
  summary:
    "Required. Platform motor liability during the booked trip — not the host’s personal policy. A licensed carrier is not bound yet; this line still collects on every trip so the product matches the Turo model.",
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
    summary: "Physical-damage protection. $3,000 guest responsibility if you damage the host’s car.",
    details: [
      "Contractual cap on what you owe for collision and comprehensive during the booked trip.",
      "$3,000 guest responsibility per incident, $75,000 vehicle cap.",
      "This is a Lookout contract, not a licensed insurance policy, until a carrier is bound.",
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
    summary: "Lower guest responsibility ($500). This is the default at checkout.",
    details: [
      "Same waiver structure as Minimum, with $500 guest responsibility and a $75,000 vehicle cap.",
      "About 40% of the trip daily rate, with a $19/day floor — Turo Standard is in this band.",
      "Still a Lookout-administered waiver until a physical-damage program is bound.",
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
    summary: "$0 guest responsibility, higher vehicle cap, park roadside.",
    details: [
      "$0 guest responsibility, $150,000 vehicle cap.",
      "Park roadside within 50 miles of the listed park: jump, spare, winch-out on a legal road.",
      "Still a Lookout-administered waiver — not a licensed insurance policy.",
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
  summary: "Decline physical-damage cover only after live carrier verification. Trip liability still applies.",
  details: [
    "Available only if a verifier (Axle or equivalent) confirms the policy is active, names you, lasts through the trip, meets state minimums, and actually extends to peer-to-peer rentals.",
    "Photos of insurance cards, declarations pages, and credit-card rental benefits are not accepted.",
    "Platform trip liability stays on the booking even if physical-damage cover is declined.",
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
