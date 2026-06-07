create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references organizations(id) on delete set null,
  full_name text,
  role text default 'user',
  created_at timestamptz default now()
);

create table if not exists vrio6g_index (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  v float default 8.5,
  r float default 8.7,
  i float default 8.3,
  o float default 8.5,
  g_growth float default 8.2,
  g_gravity float default 8.8,
  vrio6g_score float default 8.5,
  created_at timestamptz default now()
);

create table if not exists simulation_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  f_ide float default 10432,
  k_viral float default 1.35,
  churn_lambda float default 0.018,
  created_at timestamptz default now()
);

create table if not exists strategy_event_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  step_id int,
  action text,
  created_at timestamptz default now()
);

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table vrio6g_index enable row level security;
alter table simulation_log enable row level security;
alter table strategy_event_log enable row level security;

create policy "profiles self read" on profiles
for select using (id = auth.uid());

create policy "profiles self update" on profiles
for update using (id = auth.uid());

create policy "tenant read vrio" on vrio6g_index
for select using (
  org_id in (select org_id from profiles where id = auth.uid())
);

create policy "tenant read sim" on simulation_log
for select using (
  org_id in (select org_id from profiles where id = auth.uid())
);

create policy "tenant insert events" on strategy_event_log
for insert with check (
  org_id in (select org_id from profiles where id = auth.uid())
);

create policy "tenant read events" on strategy_event_log
for select using (
  org_id in (select org_id from profiles where id = auth.uid())
);
