-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  avatar_url text,
  role text not null default 'jemaat' check (role in ('jemaat', 'moderator', 'admin')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Campaigns (Galang Dana)
create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  description text not null,
  story text not null,
  category text not null,
  target_amount bigint not null,
  collected_amount bigint not null default 0,
  donor_count int not null default 0,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'active', 'completed', 'rejected')),
  rejection_reason text,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Donations
create table donations (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns(id) on delete cascade not null,
  donor_id uuid references profiles(id) on delete set null,
  donor_name text not null,
  amount bigint not null,
  message text,
  is_anonymous boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  payment_token text,
  midtrans_order_id text unique,
  created_at timestamptz not null default now()
);

-- Businesses (UMKM)
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text not null,
  category text not null,
  whatsapp text not null,
  address text,
  image_urls text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'active', 'rejected')),
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Jobs (Lowongan Kerja)
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  poster_id uuid references profiles(id) on delete cascade not null,
  business_id uuid references businesses(id) on delete set null,
  title text not null,
  slug text unique not null,
  description text not null,
  requirements text not null,
  category text not null,
  job_type text not null check (job_type in ('full-time', 'part-time', 'freelance', 'internship')),
  location text not null,
  salary_min bigint,
  salary_max bigint,
  contact_info text not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'closed', 'rejected')),
  rejection_reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger campaigns_updated_at before update on campaigns
  for each row execute function update_updated_at();
create trigger businesses_updated_at before update on businesses
  for each row execute function update_updated_at();
create trigger jobs_updated_at before update on jobs
  for each row execute function update_updated_at();

-- Update campaign collected_amount & donor_count when donation is paid
create or replace function update_campaign_on_donation()
returns trigger as $$
begin
  if new.status = 'paid' and (old.status is null or old.status != 'paid') then
    update campaigns
    set
      collected_amount = collected_amount + new.amount,
      donor_count = donor_count + 1
    where id = new.campaign_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger donations_update_campaign after insert or update on donations
  for each row execute function update_campaign_on_donation();

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Jemaat'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Row Level Security
alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table donations enable row level security;
alter table businesses enable row level security;
alter table jobs enable row level security;

-- Profiles policies
create policy "Public profiles viewable" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Campaigns policies
create policy "Active campaigns viewable" on campaigns for select
  using (status = 'active' or auth.uid() = creator_id);
create policy "Verified jemaat can create campaigns" on campaigns for insert
  with check (auth.uid() = creator_id and exists (
    select 1 from profiles where id = auth.uid() and is_verified = true
  ));
create policy "Creators can update own campaigns" on campaigns for update
  using (auth.uid() = creator_id);

-- Donations policies
create policy "Paid donations viewable" on donations for select
  using (status = 'paid' or auth.uid() = donor_id);
create policy "Anyone can create donation" on donations for insert with check (true);
create policy "Donors update own donation" on donations for update
  using (auth.uid() = donor_id);

-- Businesses policies
create policy "Active businesses viewable" on businesses for select
  using (status = 'active' or auth.uid() = owner_id);
create policy "Verified jemaat can create business" on businesses for insert
  with check (auth.uid() = owner_id and exists (
    select 1 from profiles where id = auth.uid() and is_verified = true
  ));
create policy "Owners update own business" on businesses for update
  using (auth.uid() = owner_id);

-- Jobs policies
create policy "Active jobs viewable" on jobs for select
  using (status = 'active' or auth.uid() = poster_id);
create policy "Verified jemaat can post jobs" on jobs for insert
  with check (auth.uid() = poster_id and exists (
    select 1 from profiles where id = auth.uid() and is_verified = true
  ));
create policy "Posters update own jobs" on jobs for update
  using (auth.uid() = poster_id);

-- Indexes
create index campaigns_status_idx on campaigns(status);
create index campaigns_category_idx on campaigns(category);
create index businesses_status_idx on businesses(status);
create index businesses_category_idx on businesses(category);
create index jobs_status_idx on jobs(status);
create index jobs_category_idx on jobs(category);
create index jobs_type_idx on jobs(job_type);
create index donations_campaign_idx on donations(campaign_id);
