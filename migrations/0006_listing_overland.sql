alter table listings add column if not exists overland boolean not null default false;
update listings set overland = true where category = 'overland';
update listings set category = 'suv' where category = 'overland';
