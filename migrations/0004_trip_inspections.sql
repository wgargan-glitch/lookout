create table if not exists trip_inspections (
  id text primary key,
  booking_id text not null,
  user_id text not null,
  kind text not null,
  status text not null default 'draft',
  cleanliness text not null default '',
  fuel_eighths integer,
  odometer integer,
  keys_ok boolean not null default false,
  no_damage boolean not null default false,
  notes text not null default '',
  damage_json text not null default '[]',
  photos_json text not null default '[]',
  created_at timestamptz not null default now(),
  submitted_at timestamptz
);
create unique index if not exists trip_inspections_booking_kind_idx on trip_inspections (booking_id, kind);
create index if not exists trip_inspections_user_id_idx on trip_inspections (user_id);
create index if not exists trip_inspections_booking_id_idx on trip_inspections (booking_id);
