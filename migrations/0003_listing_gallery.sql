alter table listings add column if not exists images_json text not null default '[]';
alter table listings add column if not exists plate text not null default '';
alter table listings add column if not exists vin text not null default '';
alter table listings add column if not exists mileage integer;
alter table listings add column if not exists pickup_notes text not null default '';
alter table listings add column if not exists insurer text not null default '';
alter table listings add column if not exists policy_number text not null default '';
