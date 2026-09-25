-- ==========================================
-- 1. Contact Submissions
-- ==========================================
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (submit contact form)
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated users can view (for admin dashboard)
DROP POLICY IF EXISTS "Authenticated users can view submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update status
DROP POLICY IF EXISTS "Authenticated users can update status" ON contact_submissions;
CREATE POLICY "Authenticated users can update status"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);


-- ==========================================
-- 2. Events
-- ==========================================
-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  recurring BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active events
DROP POLICY IF EXISTS "Anyone can view active events" ON events;
CREATE POLICY "Anyone can view active events"
  ON events
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policy: Authenticated users can manage events
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_display_order ON events(display_order);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==========================================
-- 3. Sermons
-- ==========================================
-- Create sermons table
CREATE TABLE IF NOT EXISTS sermons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  scripture_reference TEXT,
  series TEXT,
  video_url TEXT,
  audio_url TEXT,
  thumbnail_url TEXT,
  notes_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published sermons
DROP POLICY IF EXISTS "Anyone can view published sermons" ON sermons;
CREATE POLICY "Anyone can view published sermons"
  ON sermons
  FOR SELECT
  TO public
  USING (is_published = true);

-- Policy: Authenticated users can manage sermons
DROP POLICY IF EXISTS "Authenticated users can manage sermons" ON sermons;
CREATE POLICY "Authenticated users can manage sermons"
  ON sermons
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sermons_is_published ON sermons(is_published);
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_series ON sermons(series);
CREATE INDEX IF NOT EXISTS idx_sermons_is_featured ON sermons(is_featured);

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_sermons_updated_at ON sermons;
CREATE TRIGGER update_sermons_updated_at BEFORE UPDATE ON sermons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==========================================
-- 4. Newsletter
-- ==========================================
-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (subscribe)
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Allow admins to view all subscribers
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view all subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow admins to update subscribers
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can update subscribers"
  ON public.newsletter_subscribers FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow admins to delete subscribers
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can delete subscribers"
  ON public.newsletter_subscribers FOR DELETE
  USING (auth.role() = 'authenticated');


-- ==========================================
-- 5. Prayer Requests
-- ==========================================
-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  request text not null,
  is_private boolean default false,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (submit prayer request)
DROP POLICY IF EXISTS "Anyone can submit prayer requests" ON public.prayer_requests;
CREATE POLICY "Anyone can submit prayer requests"
  ON public.prayer_requests FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view approved public requests
DROP POLICY IF EXISTS "Anyone can view approved public requests" ON public.prayer_requests;
CREATE POLICY "Anyone can view approved public requests"
  ON public.prayer_requests FOR SELECT
  USING (status = 'approved' and is_private = false);

-- Allow admins to view all requests
DROP POLICY IF EXISTS "Admins can view all requests" ON public.prayer_requests;
CREATE POLICY "Admins can view all requests"
  ON public.prayer_requests FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow admins to update requests (approve/reject)
DROP POLICY IF EXISTS "Admins can update requests" ON public.prayer_requests;
CREATE POLICY "Admins can update requests"
  ON public.prayer_requests FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow admins to delete requests
DROP POLICY IF EXISTS "Admins can delete requests" ON public.prayer_requests;
CREATE POLICY "Admins can delete requests"
  ON public.prayer_requests FOR DELETE
  USING (auth.role() = 'authenticated');


-- ==========================================
-- 6. Donations
-- ==========================================
-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id uuid default gen_random_uuid() primary key,
  donor_name text not null,
  amount decimal(10, 2) not null,
  type text check (type in ('tithe', 'offering', 'other')),
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anyone to insert (record donation - for now, this might be restricted later)
DROP POLICY IF EXISTS "Anyone can record donations" ON public.donations;
CREATE POLICY "Anyone can record donations"
  ON public.donations FOR INSERT
  WITH CHECK (true);

-- Allow admins to view all donations
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow admins to update donations
DROP POLICY IF EXISTS "Admins can update donations" ON public.donations;
CREATE POLICY "Admins can update donations"
  ON public.donations FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow admins to delete donations
DROP POLICY IF EXISTS "Admins can delete donations" ON public.donations;
CREATE POLICY "Admins can delete donations"
  ON public.donations FOR DELETE
  USING (auth.role() = 'authenticated');


-- ==========================================
-- 7. STORAGE BUCKETS
-- ==========================================
-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('event-images', 'event-images', true, 5242880, ARRAY['image/*']),
  ('sermon-media', 'sermon-media', true, 524288000, ARRAY['video/*', 'audio/*', 'image/*']),
  ('sermon-notes', 'sermon-notes', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies
-- We drop then create to be safe and idempotent.

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('event-images', 'sermon-media', 'sermon-notes') );

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id IN ('event-images', 'sermon-media', 'sermon-notes') );

DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id IN ('event-images', 'sermon-media', 'sermon-notes') );

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id IN ('event-images', 'sermon-media', 'sermon-notes') );
