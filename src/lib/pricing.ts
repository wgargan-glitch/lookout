export const PROTECTION_PLANS = [
  {
    id: "trail",
    name: "Trail",
    dailyCents: 0,
    guestResponsibility: "Vehicle value",
    vehicleCap: "Host policy",
    roadside: false,
    summary: "Host terms only. You cover damage up to the vehicle value.",
    details: [
      "No Lookout waiver. The host’s personal auto policy is primary.",
      "You are responsible for physical damage up to the car’s value.",
      "Use this if you carry your own comprehensive coverage that extends to rentals.",
    ],
  },
  {
    id: "ridge",
    name: "Ridge",
    dailyCents: 1900,
    guestResponsibility: "$1,500",
    vehicleCap: "$75,000",
    roadside: false,
    summary: "Physical damage waiver with a $1,500 guest responsibility.",
    details: [
      "Contractual damage waiver for collision and comprehensive during the booked trip.",
      "$1,500 guest responsibility per incident, $75,000 vehicle cap.",
      "Does not replace the host’s required auto insurance.",
    ],
  },
  {
    id: "summit",
    name: "Summit",
    dailyCents: 3400,
    guestResponsibility: "$250",
    vehicleCap: "$150,000",
    roadside: true,
    summary: "Lowest guest responsibility ($250) plus roadside in the parks.",
    details: [
      "$250 guest responsibility, $150,000 vehicle cap.",
      "Park roadside within 50 miles of the listed park: jump, spare, winch-out on a legal road.",
      "Still a Lookout-administered waiver — not a licensed insurance policy.",
    ],
  },
] as const;

export type ProtectionId = (typeof PROTECTION_PLANS)[number]["id"];

export const SERVICE_FEE_RATE = 0.1;

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
  const plan = PROTECTION_PLANS.find((p) => p.id === input.protection) ?? PROTECTION_PLANS[0];
  const protectionCents = plan.dailyCents * days;
  return {
    days,
    tripCents,
    serviceCents,
    protectionCents,
    protectionName: plan.name,
    totalCents: tripCents + serviceCents + protectionCents,
  };
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) {
  return aStart < bEnd && bStart < aEnd;
}
