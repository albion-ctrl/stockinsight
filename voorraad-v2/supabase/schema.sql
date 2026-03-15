-- ============================================================
-- VoorraadInzicht — Den Engelsen Bedrijfswagens
-- Supabase Schema v2
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── profiles ──────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  role        text not null check (role in ('verkoper','manager')) default 'verkoper',
  branch      text check (branch in ('Duiven','Eindhoven','Nijmegen','Venlo','Stein','Tiel')),
  full_name   text,
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Users see own profile or managers see all"
  on public.profiles for select
  using (auth.uid() = id or auth.uid() in (select id from public.profiles where role = 'manager'));

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── vehicles ──────────────────────────────────────────────────────────────
create table public.vehicles (
  id          text primary key,
  name        text not null,
  type        text not null,
  brand       text not null,
  branch      text not null,
  year        integer not null,
  mileage     integer not null default 0,
  category    text not null,
  price       numeric(10,2) not null,
  date_added  date not null default current_date,
  color       text,
  fuel_type   text,
  transmission text,
  power       integer,
  days_in_stock integer,
  status      text,
  interest_cost numeric(10,2),
  urgency_score numeric(10,2),
  recommended_price numeric(10,2),
  discount_pct numeric(5,2),
  market_delta_pct numeric(5,2),
  pending_actions integer,
  created_at  timestamptz default now()
);

-- Disable RLS for demo purposes
alter table public.vehicles disable row level security;

-- ── action_items ──────────────────────────────────────────────────────────
create table public.action_items (
  id            text primary key,
  vehicle_id    text references public.vehicles(id) on delete cascade not null,
  action_type   text not null,
  completed     boolean default false,
  completed_by  text,
  completed_at  timestamptz,
  created_at    timestamptz default now()
);
alter table public.action_items disable row level security;

-- ── market_listings ─────────────────────────────────────────────────────────
create table public.market_listings (
  id            serial primary key,
  vehicle_id    text references public.vehicles(id) on delete cascade,
  source        text not null,
  url           text not null,
  title         text not null,
  price         integer not null,
  year          integer not null,
  mileage       integer not null,
  location      text not null,
  days_online   integer not null,
  dealer        text not null,
  created_at    timestamptz default now()
);
alter table public.market_listings disable row level security;

-- ── market_snapshots (optional — store scraped market data) ────────────────
create table public.market_snapshots (
  id          uuid default uuid_generate_v4() primary key,
  vehicle_id  text references public.vehicles(id) on delete cascade,
  source      text not null check (source in ('AutoScout24','Gaspedaal','Marktplaats')),
  title       text,
  price       numeric(10,2) not null,
  url         text,
  year        integer,
  mileage     integer,
  location    text,
  days_online integer,
  scraped_at  timestamptz default now()
);
alter table public.market_snapshots enable row level security;
create policy "Auth users read snapshots" on public.market_snapshots for select using (auth.uid() is not null);

-- ── Indexes ────────────────────────────────────────────────────────────────
create index if not exists vehicles_branch_idx       on public.vehicles(branch);
create index if not exists vehicles_date_added_idx   on public.vehicles(date_added);
create index if not exists action_items_vehicle_idx  on public.action_items(vehicle_id);
