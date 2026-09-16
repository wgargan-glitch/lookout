import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { BOOKING_SEEDS, CARS, HOSTS, PARKS, type Car, type Host } from "@/lib/catalog";
import { getSql } from "@/lib/db";
import { quoteTrip, rangesOverlap, type ProtectionId } from "@/lib/pricing";

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
  camping: boolean;
  pet_friendly: boolean;
  instant_book: boolean;
  electric: boolean;
  insurance_attested: boolean;
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
};

function asDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function listingToCar(row: ListingRow): Car {
  const category = (["suv", "truck", "van", "sports", "overland"] as const).includes(row.category)
    ? row.category
    : "suv";
  const park = PARKS.find((p) => p.slug === row.park_slug);
  let features: string[] = [];
  try {
    features = JSON.parse(row.features_json) as string[];
  } catch {
    features = [];
  }
  const hero = row.image || CATEGORY_FALLBACK[category];
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
    images: [hero, park?.image ?? hero, "/images/details/cabin.jpg"],
    featured: false,
    petFriendly: Boolean(row.pet_friendly),
    camping: Boolean(row.camping),
    instantBook: Boolean(row.instant_book),
    electric: Boolean(row.electric),
    ratingAvg: 5,
    tripCount: 0,
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
  const protection: ProtectionId =
    row.protection === "trail" || row.protection === "summit" ? row.protection : "ridge";
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
      protection: z.enum(["trail", "ridge", "summit"]),
    }),
  )
  .handler(async ({ context, data }) => {
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
      select * from bookings where user_id = ${context.userId} order by start_date desc
    `;
    return rows.map(mapBooking);
  });

export const cancelMyBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update bookings set status = 'cancelled'
      where id = ${data.id} and user_id = ${context.userId} and status = 'confirmed'
    `;
    return { ok: true as const };
  });

export const createListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      make: z.string().min(1).max(40),
      model: z.string().min(1).max(40),
      year: z.number().int().min(1990).max(2027),
      trim: z.string().max(40).optional(),
      category: z.enum(["suv", "truck", "van", "sports", "overland"]),
      parkSlug: z.string().min(1),
      daily: z.number().min(20).max(2000),
      seats: z.number().int().min(2).max(15),
      drivetrain: z.string().min(1).max(20),
      description: z.string().max(800),
      camping: z.boolean(),
      petFriendly: z.boolean(),
      instantBook: z.boolean(),
      electric: z.boolean(),
      insuranceAttested: z.literal(true),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!PARKS.some((p) => p.slug === data.parkSlug)) throw new Error("Choose a park.");
    const sql = await getSql();
    await ensureProfileRow(sql, context.userId);
    await sql`update profiles set role = case when role = 'admin' then 'admin' else 'host' end where user_id = ${context.userId}`;
    const id = `car-${crypto.randomUUID().slice(0, 8)}`;
    const features = JSON.stringify(["Unlimited miles", "Host-attested auto insurance"]);
    await sql`
      insert into listings (
        id, user_id, make, model, year, trim, category, park_slug, daily_cents, seats, drivetrain,
        description, features_json, camping, pet_friendly, instant_book, electric, insurance_attested, status
      ) values (
        ${id}, ${context.userId}, ${data.make}, ${data.model}, ${data.year}, ${data.trim ?? ""},
        ${data.category}, ${data.parkSlug}, ${Math.round(data.daily * 100)}, ${data.seats}, ${data.drivetrain},
        ${data.description}, ${features}, ${data.camping}, ${data.petFriendly}, ${data.instantBook},
        ${data.electric}, true, 'live'
      )
    `;
    return { id };
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
    return rows.map((row) => ({
      car: listingToCar(row),
      status: row.status,
      insuranceAttested: Boolean(row.insurance_attested),
    }));
  });

export const setMyListingStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1), status: z.enum(["live", "paused"]) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
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
