-- Create donations table
create table if not exists public.donations (
  id uuid default gen_random_uuid() primary key,
  donor_name text not null,
  amount decimal(10, 2) not null,
  type text check (type in ('tithe', 'offering', 'other')),
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.donations enable row level security;

-- Create policies
-- Allow anyone to insert (record donation - for now, this might be restricted later)
create policy "Anyone can record donations"
  on public.donations for insert
  with check (true);

-- Allow admins to view all donations
create policy "Admins can view all donations"
  on public.donations for select
  using (auth.role() = 'authenticated');

-- Allow admins to update donations
create policy "Admins can update donations"
  on public.donations for update
  using (auth.role() = 'authenticated');

-- Allow admins to delete donations
create policy "Admins can delete donations"
  on public.donations for delete
  using (auth.role() = 'authenticated');
