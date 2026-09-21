import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { BOOKING_SEEDS, CARS, CATALOG_BOOKED_RANGE, HOSTS, PARKS, isCatalogListing, type Car, type Host } from "@/lib/catalog";
import { getSql } from "@/lib/db";
import { listingLiveGaps, orderedGallerySrcs, parseGallery, PHOTO_ANGLE_IDS, type GalleryShot } from "@/lib/listing-photos";
import {
  inspectionLiveGaps,
  parseDamage,
  parseInspectionShots,
  type CleanlinessId,
  type DamageItem,
} from "@/lib/inspection";
import { quoteTrip, rangesOverlap, parseProtection, type ProtectionId } from "@/lib/pricing";
import { BODY_TYPES, FUELS, isListedVehicle, parseFuel, resolvedBodyType, type BodyTypeId, type FuelId } from "@/lib/us-vehicles";

export type Profile = {
  userId: string;
  displayName: string;
  phone: string | null;
  hometown: string | null;
  bio: string | null;
  role: "guest" | "host" | "admin";
};

export type BookingRow = {
  id: string;
  userId: string;
  hostUserId: string | null;
  carId: string;
  startDate: string;
  endDate: string;
  days: number;
  totalCents: number;
  protection: ProtectionId;
  status: "confirmed" | "cancelled";
  confirmation: string;
  createdAt: string;
  checkinComplete?: boolean;
  checkoutComplete?: boolean;
};

export type TicketRow = {
  id: string;
  userId: string;
  topic: string;
  subject: string;
  body: string;
  status: "open" | "pending" | "resolved";
  createdAt: string;
};

export type ClaimRow = {
  id: string;
  userId: string;
  bookingId: string;
  kind: string;
  description: string;
  status: "filed" | "reviewing" | "approved" | "denied";
  createdAt: string;
};

type ListingRow = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  category: Car["category"];
  park_slug: string;
  daily_cents: number;
  seats: number;
  doors: number;
  mpg: string;
  transmission: string;
  drivetrain: string;
  description: string;
  features_json: string;
  image: string | null;
  images_json?: string | null;
  plate?: string | null;
  vin?: string | null;
  mileage?: number | null;
  pickup_notes?: string | null;
  insurer?: string | null;
  policy_number?: string | null;
  camping: boolean;
  pet_friendly: boolean;
  instant_book: boolean;
  electric: boolean;
  overland?: boolean;
  insurance_attested: boolean;
  fuel?: string | null;
  status: string;
  host_name: string | null;
  host_hometown: string | null;
  host_bio: string | null;
};

const CATEGORY_FALLBACK: Record<Car["category"], string> = {
  overland: "/images/cars/4runner-zion.jpg",
  suv: "/images/cars/xc90-rocky.jpg",
  truck: "/images/cars/tacoma-arches.jpg",
  van: "/images/cars/sprinter-joshua.jpg",
  sports: "/images/cars/mini-acadia.jpg",
  car: "/images/cars/mini-acadia.jpg",
};

function asDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function asBodyType(value: string): BodyTypeId {
  return BODY_TYPES.some((t) => t.id === value) ? (value as BodyTypeId) : "suv";
}

function listingToCar(row: ListingRow): Car {
  const overland = Boolean(row.overland) || row.category === "overland";
  const category =
    row.category === "overland"
      ? resolvedBodyType(Number(row.year), row.make, row.model)
      : asBodyType(row.category);
  let features: string[] = [];
  try {
    features = JSON.parse(row.features_json) as string[];
  } catch {
    features = [];
  }
  const hero = row.image || CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK.suv;
  const gallery = orderedGallerySrcs(parseGallery(row.images_json));
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: Number(row.year),
    trim: row.trim,
    category,
    parkSlug: row.park_slug,
    hostId: row.user_id,
    dailyCents: Number(row.daily_cents),
    seats: Number(row.seats),
    doors: Number(row.doors),
    mpg: row.mpg,
    transmission: row.transmission,
    drivetrain: row.drivetrain,
    description: row.description,
    features,
    images: gallery.length ? gallery : [hero],
    featured: false,
    petFriendly: Boolean(row.pet_friendly),
    camping: Boolean(row.camping),
    instantBook: Boolean(row.instant_book),
    electric: parseFuel({ fuel: row.fuel, electric: Boolean(row.electric) }) === "Electric",
    overland,
    ratingAvg: 5,
    tripCount: 0,
    pickupNotes: row.pickup_notes || undefined,
  };
}

function listingToHost(row: ListingRow): Host {
  return {
    id: row.user_id,
    alias: row.host_name || "Lookout host",
    sinceYear: 2026,
    hometown: row.host_hometown || "",
    bio: row.host_bio || "Host on Lookout.",
    image: "/images/hosts/wren.jpg",
    trips: 0,
    rating: 5,
    responseTime: "within a day",
  };
}

async function ensureProfileRow(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  seed?: { displayName?: string },
) {
  const existing = await sql<{ user_id: string; role: string }>`
    select user_id, role from profiles where user_id = ${userId}
  `;
  if (existing[0]) return existing[0];
  const admins = await sql`select user_id from profiles where role = 'admin' limit 1`;
  const role = admins.length === 0 ? "admin" : "guest";
  const name = seed?.displayName?.trim() || "Lookout guest";
  await sql`
    insert into profiles (user_id, display_name, role)
    values (${userId}, ${name}, ${role})
  `;
  return { user_id: userId, role };
}

async function requireAdmin(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const rows = await sql<{ role: string }>`select role from profiles where user_id = ${userId}`;
  if (rows[0]?.role !== "admin") {
    throw new Error("Ranger desk only.");
  }
}

function mapProfile(row: {
  user_id: string;
  display_name: string;
  phone: string | null;
  hometown: string | null;
  bio: string | null;
  role: string;
}): Profile {
  const role = row.role === "admin" || row.role === "host" ? row.role : "guest";
  return {
    userId: row.user_id,
    displayName: row.display_name,
    phone: row.phone,
    hometown: row.hometown,
    bio: row.bio,
    role,
  };
}

function mapBooking(row: {
  id: string;
  user_id: string;
  host_user_id: string | null;
  car_id: string;
  start_date: unknown;
  end_date: unknown;
  days: number;
  total_cents: number;
  protection: string;
  status: string;
  confirmation: string;
  created_at: unknown;
}): BookingRow {
  const protection = parseProtection(row.protection);
  return {
    id: row.id,
    userId: row.user_id,
    hostUserId: row.host_user_id,
    carId: row.car_id,
    startDate: asDate(row.start_date),
    endDate: asDate(row.end_date),
    days: Number(row.days),
    totalCents: Number(row.total_cents),
    protection,
    status: row.status === "cancelled" ? "cancelled" : "confirmed",
    confirmation: row.confirmation,
    createdAt: String(row.created_at),
  };
}

function mapTicket(row: {
  id: string;
  user_id: string;
  topic: string;
  subject: string;
  body: string;
  status: string;
  created_at: unknown;
}): TicketRow {
  return {
    id: row.id,
    userId: row.user_id,
    topic: row.topic,
    subject: row.subject,
    body: row.body,
    status: row.status === "resolved" ? "resolved" : row.status === "pending" ? "pending" : "open",
    createdAt: String(row.created_at),
  };
}

function mapClaim(row: {
  id: string;
  user_id: string;
  booking_id: string;
  kind: string;
  description: string;
  status: string;
  created_at: unknown;
}): ClaimRow {
  return {
    id: row.id,
    userId: row.user_id,
    bookingId: row.booking_id,
    kind: row.kind,
    description: row.description,
    status:
      row.status === "approved" || row.status === "denied" || row.status === "reviewing"
        ? row.status
        : "filed",
    createdAt: String(row.created_at),
  };
}

export const listLiveListings = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<ListingRow>`
    select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
    from listings l
    left join profiles p on p.user_id = l.user_id
    where l.status = 'live'
    order by l.created_at desc
  `;
  const cars = rows.map(listingToCar);
  const hosts = rows.map(listingToHost);
  return { cars, hosts };
});

export const listBookedRanges = createServerFn({ method: "GET" })
  .validator(z.object({ carId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<{ start_date: unknown; end_date: unknown }>`
      select start_date, end_date from bookings
      where car_id = ${data.carId} and status = 'confirmed'
    `;
    const live = rows.map((r) => ({ startDate: asDate(r.start_date), endDate: asDate(r.end_date) }));
    if (isCatalogListing(data.carId)) {
      return [{ startDate: CATALOG_BOOKED_RANGE.startDate, endDate: CATALOG_BOOKED_RANGE.endDate }, ...live];
    }
    const seeds = BOOKING_SEEDS.filter((b) => b.carId === data.carId).map((b) => ({
      startDate: b.startDate,
      endDate: b.endDate,
    }));
    return [...seeds, ...live];
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureProfileRow(sql, context.userId);
    const rows = await sql<{
      user_id: string;
      display_name: string;
      phone: string | null;
      hometown: string | null;
      bio: string | null;
      role: string;
    }>`select user_id, display_name, phone, hometown, bio, role from profiles where user_id = ${context.userId}`;
    return mapProfile(rows[0]!);
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      displayName: z.string().min(1).max(80),
      phone: z.string().max(40).optional(),
      hometown: z.string().max(80).optional(),
      bio: z.string().max(600).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfileRow(sql, context.userId, { displayName: data.displayName });
    await sql`
      update profiles
      set display_name = ${data.displayName},
          phone = ${data.phone ?? null},
          hometown = ${data.hometown ?? null},
          bio = ${data.bio ?? null}
      where user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const createBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      carId: z.string().min(1),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      protection: z.enum(["trail", "ridge", "summit", "own"]),
    }),
  )
  .handler(async ({ context, data }) => {
    if (data.protection === "own") {
      throw new Error(
        "Pick a Lookout protection plan to finish this booking. We can’t verify a personal policy yet.",
      );
    }
    if (data.endDate <= data.startDate) throw new Error("Return date must be after pickup.");
    const sql = await getSql();
    await ensureProfileRow(sql, context.userId);
    const extra = await sql<ListingRow>`
      select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
      from listings l
      left join profiles p on p.user_id = l.user_id
      where l.id = ${data.carId}
    `;
    const catalogCar = CARS.find((c) => c.id === data.carId);
    const car = extra[0] ? listingToCar(extra[0]) : catalogCar;
    if (!car) throw new Error("That car is no longer listed.");
    if (!extra[0] && isCatalogListing(data.carId)) {
      throw new Error("Those dates are already spoken for.");
    }
    const hostUserId = extra[0]?.user_id ?? HOSTS.find((h) => h.id === car.hostId)?.id ?? null;
    const existing = await sql<{ start_date: unknown; end_date: unknown }>`
      select start_date, end_date from bookings
      where car_id = ${data.carId} and status = 'confirmed'
    `;
    const blocked = [
      ...BOOKING_SEEDS.filter((b) => b.carId === data.carId),
      ...existing.map((r) => ({ startDate: asDate(r.start_date), endDate: asDate(r.end_date) })),
    ];
    if (blocked.some((b) => rangesOverlap(data.startDate, data.endDate, b.startDate, b.endDate))) {
      throw new Error("Those dates are already spoken for.");
    }
    const quote = quoteTrip({
      dailyCents: car.dailyCents,
      fromISO: data.startDate,
      toISO: data.endDate,
      protection: data.protection,
    });
    const id = crypto.randomUUID();
    const confirmation = `LK-${id.slice(0, 8).toUpperCase()}`;
    await sql`
      insert into bookings (
        id, user_id, host_user_id, car_id, start_date, end_date, days, total_cents, protection, status, confirmation
      ) values (
        ${id}, ${context.userId}, ${hostUserId}, ${data.carId}, ${data.startDate}, ${data.endDate},
        ${quote.days}, ${quote.totalCents}, ${data.protection}, 'confirmed', ${confirmation}
      )
    `;
    return {
      id,
      confirmation,
      days: quote.days,
      totalCents: quote.totalCents,
      startDate: data.startDate,
      endDate: data.endDate,
      protection: data.protection,
    };
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapBooking>[0]>`
      select * from bookings where user_id = ${context.userId} or host_user_id = ${context.userId}
      order by start_date desc
    `;
    const flags = await sql<{ booking_id: string; kind: string; status: string }>`
      select booking_id, kind, status from trip_inspections
      where user_id = ${context.userId} or booking_id in (select id from bookings where user_id = ${context.userId} or host_user_id = ${context.userId})
    `.catch(() => [] as { booking_id: string; kind: string; status: string }[]);
    return rows.map((row) => {
      const booking = mapBooking(row);
      const related = flags.filter((f) => f.booking_id === row.id && f.status === "complete");
      return {
        ...booking,
        checkinComplete: related.some((f) => f.kind === "checkin"),
        checkoutComplete: related.some((f) => f.kind === "checkout"),
      };
    });
  });

export const cancelMyBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const checked = await sql<{ n: number }>`
      select count(*)::int as n from trip_inspections
      where booking_id = ${data.id} and kind = 'checkin' and status = 'complete'
    `.catch(() => [{ n: 0 }]);
    if (Number(checked[0]?.n ?? 0) > 0) {
      throw new Error("This trip already checked in. File a claim if you need to unwind it.");
    }
    await sql`
      update bookings set status = 'cancelled'
      where id = ${data.id} and user_id = ${context.userId} and status = 'confirmed'
    `;
    return { ok: true as const };
  });

export type InspectionRecord = {
  id: string;
  bookingId: string;
  kind: "checkin" | "checkout";
  status: "draft" | "complete";
  cleanliness: CleanlinessId | "";
  fuelEighths: number | null;
  odometer: number | null;
  keysOk: boolean;
  noDamage: boolean;
  notes: string;
  damage: DamageItem[];
  shots: GalleryShot[];
  submittedAt: string | null;
};

type InspectionRow = {
  id: string;
  booking_id: string;
  user_id: string;
  kind: string;
  status: string;
  cleanliness: string;
  fuel_eighths: number | null;
  odometer: number | null;
  keys_ok: boolean;
  no_damage: boolean;
  notes: string;
  damage_json: string;
  photos_json: string;
  submitted_at: unknown;
};

function mapInspection(row: InspectionRow): InspectionRecord {
  const cleanliness = (["trail-ready", "lived-in", "dusty", "needs-work"] as const).includes(
    row.cleanliness as CleanlinessId,
  )
    ? (row.cleanliness as CleanlinessId)
    : "";
  return {
    id: row.id,
    bookingId: row.booking_id,
    kind: row.kind === "checkout" ? "checkout" : "checkin",
    status: row.status === "complete" ? "complete" : "draft",
    cleanliness,
    fuelEighths: row.fuel_eighths == null ? null : Number(row.fuel_eighths),
    odometer: row.odometer == null ? null : Number(row.odometer),
    keysOk: Boolean(row.keys_ok),
    noDamage: Boolean(row.no_damage),
    notes: row.notes ?? "",
    damage: parseDamage(row.damage_json),
    shots: parseInspectionShots(row.photos_json),
    submittedAt: row.submitted_at ? String(row.submitted_at) : null,
  };
}

async function loadCarForTrip(sql: Awaited<ReturnType<typeof getSql>>, carId: string): Promise<Car | null> {
  const extra = await sql<ListingRow>`
    select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
    from listings l
    left join profiles p on p.user_id = l.user_id
    where l.id = ${carId}
  `;
  if (extra[0]) return listingToCar(extra[0]);
  return CARS.find((c) => c.id === carId) ?? null;
}

export const getMyTrip = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapBooking>[0]>`
      select * from bookings where id = ${data.id}
    `;
    const booking = rows[0] ? mapBooking(rows[0]) : null;
    if (!booking) throw new Error("That trip is not on your account.");
    const profile = await sql<{ role: string }>`select role from profiles where user_id = ${context.userId}`;
    const isAdmin = profile[0]?.role === "admin";
    const isGuest = booking.userId === context.userId;
    const isHost = booking.hostUserId === context.userId;
    if (!isGuest && !isHost && !isAdmin) throw new Error("That trip is not on your account.");
    const car = await loadCarForTrip(sql, booking.carId);
    const park = car ? PARKS.find((p) => p.slug === car.parkSlug) : undefined;
    let pickupNotes = car?.pickupNotes || park?.pickupTown || "";
    if (car) {
      const listing = await sql<{ pickup_notes: string | null }>`
        select pickup_notes from listings where id = ${car.id}
      `.catch(() => [] as { pickup_notes: string | null }[]);
      if (listing[0]?.pickup_notes) pickupNotes = listing[0].pickup_notes;
    }
    const inspections = await sql<InspectionRow>`
      select * from trip_inspections where booking_id = ${booking.id}
    `.catch(() => [] as InspectionRow[]);
    const mapped = inspections.map(mapInspection);
    return {
      booking: {
        ...booking,
        checkinComplete: mapped.some((i) => i.kind === "checkin" && i.status === "complete"),
        checkoutComplete: mapped.some((i) => i.kind === "checkout" && i.status === "complete"),
      },
      car,
      park: park ?? null,
      pickupNotes,
      role: isAdmin ? ("admin" as const) : isHost && !isGuest ? ("host" as const) : ("guest" as const),
      checkin: mapped.find((i) => i.kind === "checkin") ?? null,
      checkout: mapped.find((i) => i.kind === "checkout") ?? null,
    };
  });

export const startInspection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ bookingId: z.string().min(1), kind: z.enum(["checkin", "checkout"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapBooking>[0]>`
      select * from bookings where id = ${data.bookingId} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("That trip is not on your account.");
    const booking = mapBooking(rows[0]);
    if (booking.status !== "confirmed") throw new Error("Only a confirmed trip can be inspected.");
    if (data.kind === "checkout") {
      const cin = await sql<{ status: string }>`
        select status from trip_inspections
        where booking_id = ${data.bookingId} and kind = 'checkin' and status = 'complete'
      `;
      if (!cin[0]) throw new Error("Check in before you check out.");
    }
    const existing = await sql<InspectionRow>`
      select * from trip_inspections where booking_id = ${data.bookingId} and kind = ${data.kind}
    `;
    if (existing[0]?.status === "complete") return mapInspection(existing[0]);
    if (existing[0]) return mapInspection(existing[0]);
    const id = crypto.randomUUID();
    await sql`
      insert into trip_inspections (id, booking_id, user_id, kind, status)
      values (${id}, ${data.bookingId}, ${context.userId}, ${data.kind}, 'draft')
    `;
    const created = await sql<InspectionRow>`select * from trip_inspections where id = ${id}`;
    return mapInspection(created[0]!);
  });

export const upsertInspectionPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().min(1),
      angleId: z.string().min(1).max(40),
      src: z.string().min(20).max(500_000),
    }),
  )
  .handler(async ({ context, data }) => {
    assertPhotoDataUrl(data.src);
    const sql = await getSql();
    const rows = await sql<InspectionRow>`
      select * from trip_inspections where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("That inspection is not on your account.");
    if (rows[0].status === "complete") throw new Error("This inspection is locked.");
    const listingShots = parseInspectionShots(rows[0].photos_json);
    const shots = listingShots.filter((s) => s.id !== data.angleId);
    shots.push({ id: data.angleId, src: data.src });
    await sql`
      update trip_inspections set photos_json = ${JSON.stringify(shots)}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const, count: shots.length };
  });

export const completeInspection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().min(1),
      cleanliness: z.enum(["trail-ready", "lived-in", "dusty", "needs-work"]),
      fuelEighths: z.number().int().min(0).max(8),
      odometer: z.number().int().min(0).max(800000),
      keys: z.boolean(),
      noDamage: z.boolean(),
      notes: z.string().max(1200),
      damage: z.array(
        z.object({
          id: z.string().min(1),
          area: z.string().min(1).max(40),
          severity: z.enum(["cosmetic", "moderate", "heavy"]),
          notes: z.string().max(300),
        }),
      ),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<InspectionRow>`
      select * from trip_inspections where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("That inspection is not on your account.");
    if (rows[0].status === "complete") return mapInspection(rows[0]);
    const shots = parseInspectionShots(rows[0].photos_json);
    const gaps = inspectionLiveGaps({
      kind: rows[0].kind === "checkout" ? "checkout" : "checkin",
      shots,
      cleanliness: data.cleanliness,
      fuelEighths: data.fuelEighths,
      odometer: data.odometer,
      keys: data.keys,
      noDamage: data.noDamage,
      damage: data.damage,
      notes: data.notes,
    });
    if (gaps.length) throw new Error(`Still needed: ${gaps.join(", ")}.`);
    await sql`
      update trip_inspections set
        cleanliness = ${data.cleanliness},
        fuel_eighths = ${data.fuelEighths},
        odometer = ${data.odometer},
        keys_ok = ${data.keys},
        no_damage = ${data.noDamage},
        notes = ${data.notes},
        damage_json = ${JSON.stringify(data.damage)},
        status = 'complete',
        submitted_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
    const saved = await sql<InspectionRow>`select * from trip_inspections where id = ${data.id}`;
    return mapInspection(saved[0]!);
  });

export type HostListing = {
  car: Car;
  status: string;
  insuranceAttested: boolean;
  plate: string;
  vin: string;
  mileage: number | null;
  pickupNotes: string;
  insurer: string;
  policyNumber: string;
  fuel: FuelId;
  shots: GalleryShot[];
  gaps: string[];
};

const listingFields = z.object({
  make: z.string().min(1).max(80),
  model: z.string().min(1).max(80),
  year: z.number().int().min(2000).max(2027),
  trim: z.string().max(40).optional(),
  category: z.enum(["suv", "truck", "van", "sports", "overland", "car"]).optional(),
  parkSlug: z.string().min(1),
  daily: z.number().min(20).max(2000),
  seats: z.number().int().min(2).max(15),
  doors: z.number().int().min(2).max(5).optional(),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  drivetrain: z.enum(["2WD", "4x4", "AWD"]),
  fuel: z.enum(FUELS),
  description: z.string().min(40).max(1200),
  camping: z.boolean(),
  petFriendly: z.boolean(),
  instantBook: z.boolean(),
  overland: z.boolean().optional(),
  electric: z.boolean(),
  insuranceAttested: z.literal(true),
  plate: z.string().min(1).max(20),
  vin: z.string().max(17).optional(),
  mileage: z.number().int().min(0).max(800000),
  pickupNotes: z.string().min(10).max(600),
  insurer: z.string().min(2).max(80),
  policyNumber: z.string().min(2).max(40),
  phone: z.string().min(7).max(40),
  hometown: z.string().max(80).optional(),
}).superRefine((data, ctx) => {
  if (!isListedVehicle(data.year, data.make, data.model)) {
    ctx.addIssue({
      code: "custom",
      message: "Choose a year, make, and model from the list.",
      path: ["model"],
    });
  }
});

function mapHostListing(row: ListingRow, phone: string): HostListing {
  const shots = parseGallery(row.images_json);
  return {
    car: listingToCar(row),
    status: row.status,
    insuranceAttested: Boolean(row.insurance_attested),
    plate: row.plate ?? "",
    vin: row.vin ?? "",
    mileage: row.mileage == null ? null : Number(row.mileage),
    pickupNotes: row.pickup_notes ?? "",
    insurer: row.insurer ?? "",
    policyNumber: row.policy_number ?? "",
    fuel: parseFuel({ fuel: row.fuel, electric: Boolean(row.electric) }),
    shots,
    gaps: listingLiveGaps({
      shots,
      plate: row.plate ?? "",
      pickupNotes: row.pickup_notes ?? "",
      insurer: row.insurer ?? "",
      policyNumber: row.policy_number ?? "",
      mileage: row.mileage == null ? null : Number(row.mileage),
      phone,
      insuranceAttested: Boolean(row.insurance_attested),
    }),
  };
}

function assertPhotoDataUrl(src: string) {
  if (!src.startsWith("data:image/jpeg;base64,") && !src.startsWith("data:image/webp;base64,")) {
    throw new Error("Photos must be JPEG or WebP.");
  }
  if (src.length > 500_000) throw new Error("That photo is too large. Compress it and try again.");
}

export const createListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(listingFields)
  .handler(async ({ context, data }) => {
    if (!PARKS.some((p) => p.slug === data.parkSlug)) throw new Error("Choose a park.");
    const sql = await getSql();
    await ensureProfileRow(sql, context.userId);
    await sql`
      update profiles
      set role = case when role = 'admin' then 'admin' else 'host' end,
          phone = coalesce(nullif(${data.phone}, ''), phone),
          hometown = coalesce(nullif(${data.hometown ?? ""}, ''), hometown)
      where user_id = ${context.userId}
    `;
    const id = `car-${crypto.randomUUID().slice(0, 8)}`;
    const features = JSON.stringify(["Unlimited miles", "Host off-trip insurance on file"]);
    const category = resolvedBodyType(data.year, data.make, data.model);
    await sql`
      insert into listings (
        id, user_id, make, model, year, trim, category, park_slug, daily_cents, seats, doors,
        transmission, drivetrain, description, features_json, camping, pet_friendly, instant_book,
        electric, insurance_attested, status, plate, vin, mileage, pickup_notes, insurer, policy_number,
        images_json, fuel, overland
      ) values (
        ${id}, ${context.userId}, ${data.make}, ${data.model}, ${data.year}, ${data.trim ?? ""},
        ${category}, ${data.parkSlug}, ${Math.round(data.daily * 100)}, ${data.seats},
        ${data.doors ?? 4}, ${data.transmission ?? "Automatic"}, ${data.drivetrain},
        ${data.description}, ${features}, ${data.camping}, ${data.petFriendly}, ${data.instantBook},
        ${data.fuel === "Electric"}, true, 'draft', ${data.plate.trim().toUpperCase()}, ${data.vin ?? ""},
        ${data.mileage}, ${data.pickupNotes}, ${data.insurer}, ${data.policyNumber}, '[]', ${data.fuel},
        ${Boolean(data.overland)}
      )
    `;
    return { id, status: "draft" as const };
  });

export const updateListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(listingFields.extend({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    if (!PARKS.some((p) => p.slug === data.parkSlug)) throw new Error("Choose a park.");
    const sql = await getSql();
    const owned = await sql<{ id: string; status: string }>`
      select id, status from listings where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!owned[0]) throw new Error("That listing is not on your account.");
    await sql`
      update profiles
      set phone = coalesce(nullif(${data.phone}, ''), phone),
          hometown = coalesce(nullif(${data.hometown ?? ""}, ''), hometown)
      where user_id = ${context.userId}
    `;
    const nextStatus = owned[0].status === "rejected" ? "draft" : owned[0].status;
    const category = resolvedBodyType(data.year, data.make, data.model);
    await sql`
      update listings set
        make = ${data.make},
        model = ${data.model},
        year = ${data.year},
        trim = ${data.trim ?? ""},
        category = ${category},
        park_slug = ${data.parkSlug},
        daily_cents = ${Math.round(data.daily * 100)},
        seats = ${data.seats},
        doors = ${data.doors ?? 4},
        transmission = ${data.transmission ?? "Automatic"},
        drivetrain = ${data.drivetrain},
        fuel = ${data.fuel},
        description = ${data.description},
        camping = ${data.camping},
        pet_friendly = ${data.petFriendly},
        instant_book = ${data.instantBook},
        electric = ${data.fuel === "Electric"},
        overland = ${Boolean(data.overland)},
        insurance_attested = true,
        plate = ${data.plate.trim().toUpperCase()},
        vin = ${data.vin ?? ""},
        mileage = ${data.mileage},
        pickup_notes = ${data.pickupNotes},
        insurer = ${data.insurer},
        policy_number = ${data.policyNumber},
        status = ${nextStatus}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { id: data.id, status: nextStatus };
  });

export const upsertListingPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().min(1),
      angleId: z.string().min(1),
      src: z.string().min(20).max(500_000),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!PHOTO_ANGLE_IDS.includes(data.angleId)) throw new Error("Unknown photo angle.");
    assertPhotoDataUrl(data.src);
    const sql = await getSql();
    const rows = await sql<{ images_json: string | null; status: string }>`
      select images_json, status from listings where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("That listing is not on your account.");
    const shots = parseGallery(rows[0].images_json).filter((s) => s.id !== data.angleId);
    shots.push({ id: data.angleId, src: data.src });
    const hero = orderedGallerySrcs(shots)[0] ?? data.src;
    await sql`
      update listings
      set images_json = ${JSON.stringify(shots)}, image = ${hero}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const, count: shots.length };
  });

export const removeListingPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1), angleId: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ images_json: string | null }>`
      select images_json from listings where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("That listing is not on your account.");
    const shots = parseGallery(rows[0].images_json).filter((s) => s.id !== data.angleId);
    const hero = orderedGallerySrcs(shots)[0] ?? null;
    await sql`
      update listings set images_json = ${JSON.stringify(shots)}, image = ${hero}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const, count: shots.length };
  });

export const getMyListing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<ListingRow>`
      select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
      from listings l
      left join profiles p on p.user_id = l.user_id
      where l.id = ${data.id} and l.user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("That listing is not on your account.");
    const profile = await sql<{ phone: string | null }>`
      select phone from profiles where user_id = ${context.userId}
    `;
    return mapHostListing(rows[0], profile[0]?.phone ?? "");
  });

export const publishListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<ListingRow>`
      select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
      from listings l
      left join profiles p on p.user_id = l.user_id
      where l.id = ${data.id} and l.user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("That listing is not on your account.");
    const profile = await sql<{ phone: string | null }>`
      select phone from profiles where user_id = ${context.userId}
    `;
    const mapped = mapHostListing(rows[0], profile[0]?.phone ?? "");
    if (mapped.gaps.length) {
      throw new Error(`Still needed: ${mapped.gaps.join(", ")}.`);
    }
    await sql`
      update listings set status = 'live' where id = ${data.id} and user_id = ${context.userId}
    `;
    return { id: data.id, status: "live" as const };
  });

export const listMyListings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ListingRow>`
      select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
      from listings l
      left join profiles p on p.user_id = l.user_id
      where l.user_id = ${context.userId}
      order by l.created_at desc
    `;
    const profile = await sql<{ phone: string | null }>`
      select phone from profiles where user_id = ${context.userId}
    `;
    const phone = profile[0]?.phone ?? "";
    return rows.map((row) => mapHostListing(row, phone));
  });

export const setMyListingStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1), status: z.enum(["live", "paused", "draft"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.status === "live") {
      const rows = await sql<ListingRow>`
        select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
        from listings l
        left join profiles p on p.user_id = l.user_id
        where l.id = ${data.id} and l.user_id = ${context.userId}
      `;
      if (!rows[0]) throw new Error("That listing is not on your account.");
      const profile = await sql<{ phone: string | null }>`
        select phone from profiles where user_id = ${context.userId}
      `;
      const mapped = mapHostListing(rows[0], profile[0]?.phone ?? "");
      if (mapped.gaps.length) throw new Error(`Still needed: ${mapped.gaps.join(", ")}.`);
    }
    await sql`
      update listings set status = ${data.status}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const createTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      topic: z.string().min(1).max(40),
      subject: z.string().min(3).max(120),
      body: z.string().min(10).max(2000),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfileRow(sql, context.userId);
    const id = crypto.randomUUID();
    await sql`
      insert into tickets (id, user_id, topic, subject, body, status)
      values (${id}, ${context.userId}, ${data.topic}, ${data.subject}, ${data.body}, 'open')
    `;
    return { id };
  });

export const listMyTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapTicket>[0]>`
      select * from tickets where user_id = ${context.userId} order by created_at desc
    `;
    return rows.map(mapTicket);
  });

export const fileClaim = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      bookingId: z.string().min(1),
      kind: z.enum(["damage", "theft", "roadside", "other"]),
      description: z.string().min(10).max(2000),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`
      select id from bookings where id = ${data.bookingId} and user_id = ${context.userId}
    `;
    if (!owned[0]) throw new Error("That trip is not on your account.");
    const id = crypto.randomUUID();
    await sql`
      insert into claims (id, user_id, booking_id, kind, description, status)
      values (${id}, ${context.userId}, ${data.bookingId}, ${data.kind}, ${data.description}, 'filed')
    `;
    return { id };
  });

export const listMyClaims = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapClaim>[0]>`
      select * from claims where user_id = ${context.userId} order by created_at desc
    `;
    return rows.map(mapClaim);
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const users = await sql<{ n: number }>`select count(*)::int as n from profiles`;
    const listings = await sql<{ n: number }>`select count(*)::int as n from listings`;
    const live = await sql<{ n: number }>`select count(*)::int as n from listings where status = 'live'`;
    const bookings = await sql<{ n: number }>`select count(*)::int as n from bookings`;
    const openTickets = await sql<{ n: number }>`select count(*)::int as n from tickets where status <> 'resolved'`;
    const openClaims = await sql<{ n: number }>`
      select count(*)::int as n from claims where status in ('filed', 'reviewing')
    `;
    return {
      users: Number(users[0]?.n ?? 0),
      listings: Number(listings[0]?.n ?? 0),
      live: Number(live[0]?.n ?? 0),
      bookings: Number(bookings[0]?.n ?? 0),
      openTickets: Number(openTickets[0]?.n ?? 0),
      openClaims: Number(openClaims[0]?.n ?? 0),
    };
  });

export const adminLists = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const bookings = await sql<Parameters<typeof mapBooking>[0]>`select * from bookings order by created_at desc limit 40`;
    const listings = await sql<ListingRow>`
      select l.*, p.display_name as host_name, p.hometown as host_hometown, p.bio as host_bio
      from listings l
      left join profiles p on p.user_id = l.user_id
      order by l.created_at desc limit 40
    `;
    const tickets = await sql<Parameters<typeof mapTicket>[0]>`select * from tickets order by created_at desc limit 40`;
    const claims = await sql<Parameters<typeof mapClaim>[0]>`select * from claims order by created_at desc limit 40`;
    const people = await sql<{
      user_id: string;
      display_name: string;
      phone: string | null;
      hometown: string | null;
      bio: string | null;
      role: string;
    }>`select user_id, display_name, phone, hometown, bio, role from profiles order by created_at desc limit 40`;
    return {
      bookings: bookings.map(mapBooking),
      listings: listings.map((row) => ({
        car: listingToCar(row),
        status: row.status,
        hostName: row.host_name,
        userId: row.user_id,
        photoCount: parseGallery(row.images_json).length,
        gaps: listingLiveGaps({
          shots: parseGallery(row.images_json),
          plate: row.plate ?? "",
          pickupNotes: row.pickup_notes ?? "",
          insurer: row.insurer ?? "",
          policyNumber: row.policy_number ?? "",
          mileage: row.mileage == null ? null : Number(row.mileage),
          phone: "0000000",
          insuranceAttested: Boolean(row.insurance_attested),
        }).filter((g) => g !== "host phone"),
      })),
      tickets: tickets.map(mapTicket),
      claims: claims.map(mapClaim),
      people: people.map(mapProfile),
    };
  });

export const adminSetListingStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1), status: z.enum(["live", "paused", "rejected"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`update listings set status = ${data.status} where id = ${data.id}`;
    return { ok: true as const };
  });

export const adminSetTicketStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1), status: z.enum(["open", "pending", "resolved"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`update tickets set status = ${data.status} where id = ${data.id}`;
    return { ok: true as const };
  });

export const adminSetClaimStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1), status: z.enum(["filed", "reviewing", "approved", "denied"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    await sql`update claims set status = ${data.status} where id = ${data.id}`;
    return { ok: true as const };
  });

export const adminReplyTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ ticketId: z.string().min(1), body: z.string().min(2).max(2000) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireAdmin(sql, context.userId);
    const id = crypto.randomUUID();
    await sql`
      insert into ticket_replies (id, ticket_id, user_id, body, from_admin)
      values (${id}, ${data.ticketId}, ${context.userId}, ${data.body}, true)
    `;
    await sql`update tickets set status = 'pending' where id = ${data.ticketId}`;
    return { ok: true as const };
  });

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ confirm: z.literal("DELETE") }))
  .handler(async ({ context }) => {
    const sql = await getSql();
    const userId = context.userId;
    await sql`delete from trip_inspections where user_id = ${userId} or booking_id in (select id from bookings where user_id = ${userId} or host_user_id = ${userId})`;
    await sql`delete from ticket_replies where user_id = ${userId} or ticket_id in (select id from tickets where user_id = ${userId})`;
    await sql`delete from tickets where user_id = ${userId}`;
    await sql`delete from claims where user_id = ${userId}`;
    await sql`update bookings set status = 'cancelled' where (user_id = ${userId} or host_user_id = ${userId}) and status = 'confirmed'`;
    await sql`delete from bookings where user_id = ${userId} or host_user_id = ${userId}`;
    await sql`delete from listings where user_id = ${userId}`;
    await sql`delete from profiles where user_id = ${userId}`;
    try {
      await sql.query(`delete from "session" where "userId" = $1`, [userId]);
      await sql.query(`delete from "account" where "userId" = $1`, [userId]);
      await sql.query(`delete from "user" where "id" = $1`, [userId]);
    } catch {
      /* Gate-only identities may not have Better Auth rows. Marketplace data is already gone. */
    }
    return { ok: true as const };
  });
