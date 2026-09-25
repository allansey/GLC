-- ==========================================
-- 11. Recreate CMS Tables (Fixing Missing Tables)
-- ==========================================

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  time TEXT NOT NULL,
  description TEXT,
  image_url TEXT, -- Included from 009
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- Enable RLS
-- ==========================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Policies (Drop first to avoid errors)
-- ==========================================

-- Site Settings
DROP POLICY IF EXISTS "Public can view settings" ON public.site_settings;
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Staff
DROP POLICY IF EXISTS "Public can view active staff" ON public.staff;
CREATE POLICY "Public can view active staff" ON public.staff FOR SELECT TO public USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage staff" ON public.staff;
CREATE POLICY "Admins can manage staff" ON public.staff FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Services
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services" ON public.services FOR SELECT TO public USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==========================================
-- Insert Default Data (Using ON CONFLICT DO NOTHING)
-- ==========================================

INSERT INTO public.site_settings (key, value, description)
VALUES 
  ('welcome_heading', 'Welcome to Gracelove Chapel', 'Heading for the welcome section on homepage'),
  ('welcome_text', 'We are a vibrant community of believers dedicated to experiencing and sharing the transforming love of God.', 'Text for the welcome section on homepage'),
  ('mission_text', 'The vision of Gracelove is to reap souls for Christ through the gospel of grace and love.', 'Mission statement text'),
  ('vision_text', 'The mission of Gracelove is simple yet profound: reaping souls for Christ.', 'Vision statement text'),
  ('church_address', '123 Church Street, City, ST 12345', 'Physical address of the church'),
  ('church_phone', '(555) 123-4567', 'Contact phone number'),
  ('church_email', 'info@gracelovechapel.com', 'Official church email'),
  ('office_hours', 'Monday - Friday: 9:00 AM - 5:00 PM', 'Church office opening hours'),
  ('facebook_url', 'https://www.facebook.com/gracelovechapel', 'Church Facebook page'),
  ('instagram_url', 'https://www.instagram.com/gracelovechapelgh', 'Church Instagram profile'),
  ('youtube_url', 'https://youtube.com/@gracelovechapel', 'Church YouTube channel'),
  ('about_image_url', '/assets/images/faith.jpg', 'Image for the About/Mission section')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.staff (name, role, image_url, bio, display_order)
VALUES
  ('Dr. Richard Osei Akoto', 'Head Pastor', '/assets/images/pastor2.jpeg', 'Leading Gracelove Chapel with a passion for the Word.', 0),
  ('Mrs. Theophilia Antwi-Bekoe', 'Administrator', '/assets/images/leader2.jpg', 'Managing church operations with excellence.', 1),
  ('Pastor Godwin Wumpini', 'Branch Pastor', '/assets/images/leader3.jpg', 'Leading our worship ministry with creativity.', 2)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.services (name, time, description, display_order)
VALUES
  ('Sunday Service', '9:00 AM - 11:30 AM', 'Powerful worship and the Word', 0),
  ('Midweek Bible Study', 'Wednesday 7:00 PM', 'Diving deeper into God''s Word', 1),
  ('Prophetic Night', 'First Friday 8:00 PM', 'A night of encounter and prophecy', 2)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- Triggers for updated_at
-- ==========================================

-- Function must exist (assuming it was created in 001 or we create it here if needed, but usually it exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
