-- Create newsletter_subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.newsletter_subscribers enable row level security;

-- Create policies
-- Allow anyone to insert (subscribe)
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

-- Allow admins to view all subscribers
create policy "Admins can view all subscribers"
  on public.newsletter_subscribers for select
  using (auth.role() = 'authenticated');

-- Allow admins to update subscribers
create policy "Admins can update subscribers"
  on public.newsletter_subscribers for update
  using (auth.role() = 'authenticated');

-- Allow admins to delete subscribers
create policy "Admins can delete subscribers"
  on public.newsletter_subscribers for delete
  using (auth.role() = 'authenticated');
