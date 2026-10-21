-- Family Reconnect — cơ sở dữ liệu cho form tư vấn và ví dùng thử.
-- Chạy trong Supabase → SQL Editor. Máy chủ Next.js dùng khóa service role
-- (chỉ đặt ở biến môi trường phía máy chủ), nên các bảng bật RLS và không mở quyền cho anon.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  phone text not null check (char_length(phone) between 9 and 15),
  email text not null check (char_length(email) <= 200),
  father_age smallint check (father_age between 25 and 40),
  mother_age smallint check (mother_age between 25 and 40),
  youngest_child_age smallint check (youngest_child_age between 0 and 11),
  city text not null default 'other',
  locale text not null default 'vi',
  consent_version text not null,
  consent_at timestamptz not null
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  youngest_child_age smallint not null check (youngest_child_age between 0 and 11)
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  parent text not null check (parent in ('father','mother')),
  pathway text not null check (pathway in ('A','B')),
  reason text not null,
  admission_date date,
  discharge_date date,
  icu_hours integer,
  ratings jsonb,
  restricted_days integer,
  inpatient_days integer,
  cis_score numeric(6,4),
  hours_awarded integer not null default 0,
  cash_days integer not null default 0,
  cash_amount bigint not null default 0,
  status text not null check (status in ('approved','review','rejected')),
  reasons text[] not null default '{}',
  flags text[] not null default '{}'
);

create table if not exists public.grants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  claim_id uuid references public.claims(id) on delete cascade,
  parent text check (parent in ('father','mother')),
  kind text not null check (kind in ('claim','gift')),
  hours integer not null check (hours >= 0),
  services text[] not null,
  used integer not null default 0 check (used >= 0 and used <= hours),
  housekeeping_used integer not null default 0 check (housekeeping_used >= 0),
  expires_on date not null
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  service text not null check (service in ('childcare','meals','transport','housekeeping')),
  service_hours integer not null check (service_hours between 1 and 24), -- giờ, hoặc số chuyến với đưa đón
  credits integer not null,
  service_date date not null,
  allocation jsonb not null
);

create index if not exists claims_wallet_idx on public.claims(wallet_id);
create index if not exists grants_wallet_idx on public.grants(wallet_id);
create index if not exists bookings_wallet_idx on public.bookings(wallet_id);

alter table public.leads enable row level security;
alter table public.wallets enable row level security;
alter table public.claims enable row level security;
alter table public.grants enable row level security;
alter table public.bookings enable row level security;
