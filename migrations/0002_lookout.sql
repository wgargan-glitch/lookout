-- Lookout marketplace: profiles, listings, bookings, support, claims
create table if not exists profiles (
  user_id text primary key,
  display_name text not null default 'Lookout guest',
  phone text,
  hometown text,
  bio text,
  role text not null default 'guest',
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id text primary key,
  user_id text not null,
  make text not null,
  model text not null,
  year integer not null,
  trim text not null default '',
  category text not null,
  park_slug text not null,
  daily_cents integer not null,
  seats integer not null default 5,
  doors integer not null default 4,
  mpg text not null default 'n/a',
  transmission text not null default 'Automatic',
  drivetrain text not null default 'AWD',
  description text not null default '',
  features_json text not null default '[]',
  image text,
  camping boolean not null default false,
  pet_friendly boolean not null default false,
  instant_book boolean not null default true,
  electric boolean not null default false,
  insurance_attested boolean not null default false,
  status text not null default 'live',
  created_at timestamptz not null default now()
);
create index if not exists listings_user_id_idx on listings (user_id);
create index if not exists listings_status_idx on listings (status);

create table if not exists bookings (
  id text primary key,
  user_id text not null,
  host_user_id text,
  car_id text not null,
  start_date date not null,
  end_date date not null,
  days integer not null,
  total_cents integer not null,
  protection text not null,
  status text not null default 'confirmed',
  confirmation text not null,
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_id_idx on bookings (user_id);
create index if not exists bookings_car_id_idx on bookings (car_id);

create table if not exists tickets (
  id text primary key,
  user_id text not null,
  topic text not null,
  subject text not null,
  body text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create index if not exists tickets_user_id_idx on tickets (user_id);

create table if not exists ticket_replies (
  id text primary key,
  ticket_id text not null,
  user_id text not null,
  body text not null,
  from_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists claims (
  id text primary key,
  user_id text not null,
  booking_id text not null,
  kind text not null,
  description text not null,
  status text not null default 'filed',
  created_at timestamptz not null default now()
);
create index if not exists claims_user_id_idx on claims (user_id);
