/** Product rules for trip-period cover. Not a bound insurance policy. */

export const INSURANCE_PARTNER = {
  name: "Axle",
  status: "not_connected" as const,
  note: "Getaround-style live carrier connection. Not wired. Until it is, guests cannot decline physical-damage cover.",
};

export const VERIFICATION_CHECKS = [
  { check: "Policy status", pass: "Active, not cancelled" },
  { check: "Named insured", pass: "Matches the booked driver" },
  { check: "Dates", pass: "Effective through trip end, plus a buffer" },
  { check: "Liability limits", pass: "At least the trip state’s minimums; better 100/300/50 or $300k CSL" },
  { check: "Collision / comprehensive", pass: "Present if they want to skip the damage plan" },
  { check: "P2P / rental transfer", pass: "Policy actually extends to a peer-to-peer rental" },
  { check: "VIN", pass: "The renter’s own car VIN does not insure the host’s car" },
] as const;

export const REJECTED_PROOF = [
  "Phone photos of insurance cards",
  "Expired PDFs or declarations pages",
  "“My cousin is on my policy”",
  "Credit-card rental benefits as primary (they often exclude P2P)",
] as const;

export const STATE_TRAPS = [
  "New York and Maryland can require platform liability to be primary during the sharing period.",
  "NCOIL-style P2P statutes: the program must ensure owner and driver are insured while the car is shared. Cover may come from host, driver, or platform — but if the renter’s policy lapses or excludes P2P, the platform often has to respond from the first dollar.",
  "You cannot contract out of that by saying the guest showed a card.",
] as const;

export const CLAIMS_GAPS = [
  "Interior (burns, stains, pet damage) unless a plan rider says otherwise",
  "Mechanical / wear (tires, brakes, undercarriage) not caused by a covered collision",
  "Late return, lost keys, lockout, fuel",
  "The delivery / pickup window before check-in is complete",
  "Closed park roads, racing, DUI, commercial use",
] as const;

export const HOST_OFF_TRIP =
  "Hosts keep personal or commercial auto insurance for when the car is not on a Lookout trip. Personal policies usually exclude car-sharing. That policy is not the trip cover.";

export const COMMERCIAL_HOST_WAIVER =
  "Only a licensed commercial rental operator with a commercial rental policy that covers guest use, meets minimum limits, and names Lookout as additional insured can waive platform trip cover. Ordinary hosts cannot opt out.";
