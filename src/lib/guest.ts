const GUEST_KEY = "lookout-guest-key";
const LISTINGS_KEY = "lookout-my-listings";
const BOOKINGS_KEY = "lookout-my-bookings";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(ids));
}

export function getGuestKey() {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(GUEST_KEY);
  if (!key) {
    key = crypto.randomUUID();
    window.localStorage.setItem(GUEST_KEY, key);
  }
  return key;
}

export function rememberListing(id: string) {
  const ids = readList(LISTINGS_KEY);
  if (!ids.includes(id)) writeList(LISTINGS_KEY, [...ids, id]);
}

export function myListingIds() {
  return readList(LISTINGS_KEY);
}

export function rememberBooking(id: string) {
  const ids = readList(BOOKINGS_KEY);
  if (!ids.includes(id)) writeList(BOOKINGS_KEY, [...ids, id]);
}

export function myBookingIds() {
  return readList(BOOKINGS_KEY);
}
