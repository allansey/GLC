-- ==========================================
-- 6. CMS Tables (Site Settings & Staff)
-- ==========================================

-- Table for general site-wide text settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table for church staff/leadership
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

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 1. Site Settings Policies
DROP POLICY IF EXISTS "Public can view settings" ON public.site_settings;
CREATE POLICY "Public can view settings"
  ON public.site_settings FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Staff Policies
DROP POLICY IF EXISTS "Public can view active staff" ON public.staff;
CREATE POLICY "Public can view active staff"
  ON public.staff FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage staff" ON public.staff;
CREATE POLICY "Admins can manage staff"
  ON public.staff FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial data
INSERT INTO public.site_settings (key, value, description)
VALUES 
  ('welcome_heading', 'Welcome to Gracelove Chapel', 'Heading for the welcome section on homepage'),
  ('welcome_text', 'We are a vibrant community of believers dedicated to experiencing and sharing the transforming love of God. Whether you are new to faith or have been walking with Jesus for years, there is a place for you here. Join us as we grow in grace and love together.', 'Text for the welcome section on homepage'),
  ('mission_text', 'The vision of Gracelove is to reap souls for Christ through the gospel of grace and love, bringing many into the knowledge of salvation. It also seeks to raise relevant and excellent Christians in this generation—believers who live out their faith in ways that influence society positively.', 'Mission statement text'),
  ('vision_text', 'The mission of Gracelove is simple yet profound: reaping souls for Christ. Everything we do is directed toward sharing the good news and leading people into a personal relationship with Him.', 'Vision statement text')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value;

-- Populate initial staff from existing hardcoded data
INSERT INTO public.staff (name, role, image_url, bio, display_order)
VALUES
  ('Dr. Richard Osei Akoto', 'Head Pastor', '/assets/images/pastor2.jpeg', 'Leading Gracelove Chapel with a passion for the Word and a heart for people.', 0),
  ('Mrs. Theophilia Antwi-Bekoe', 'Administrator', '/assets/images/leader2.jpg', 'Managing church operations with excellence and dedication to God''s work.', 1),
  ('Pastor Godwin Wumpini', 'Branch Pastor', '/assets/images/leader3.jpg', 'Leading our worship ministry with creativity and heart, helping us connect with God.', 2)
ON CONFLICT (name) DO NOTHING;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
