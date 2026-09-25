-- Create prayer_requests table
create table if not exists public.prayer_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  request text not null,
  is_private boolean default false,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.prayer_requests enable row level security;

-- Create policies
-- Allow anyone to insert (submit prayer request)
create policy "Anyone can submit prayer requests"
  on public.prayer_requests for insert
  with check (true);

-- Allow anyone to view approved public requests
create policy "Anyone can view approved public requests"
  on public.prayer_requests for select
  using (status = 'approved' and is_private = false);

-- Allow admins to view all requests
create policy "Admins can view all requests"
  on public.prayer_requests for select
  using (auth.role() = 'authenticated');

-- Allow admins to update requests (approve/reject)
create policy "Admins can update requests"
  on public.prayer_requests for update
  using (auth.role() = 'authenticated');

-- Allow admins to delete requests
create policy "Admins can delete requests"
  on public.prayer_requests for delete
  using (auth.role() = 'authenticated');
