-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS for services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Services Policies
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial services
INSERT INTO public.services (name, time, description, display_order)
VALUES
  ('Sunday Service', '9:00 AM - 11:30 AM', 'Powerful worship and the Word', 0),
  ('Midweek Bible Study', 'Wednesday 7:00 PM', 'Diving deeper into God''s Word', 1),
  ('Prophetic Night', 'First Friday 8:00 PM', 'A night of encounter and prophecy', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert contact settings into site_settings
INSERT INTO public.site_settings (key, value, description)
VALUES 
  ('church_address', '123 Church Street, City, ST 12345', 'Physical address of the church'),
  ('church_phone', '(555) 123-4567', 'Contact phone number'),
  ('church_email', 'info@gracelovechapel.com', 'Official church email'),
  ('office_hours', 'Monday - Friday: 9:00 AM - 5:00 PM', 'Church office opening hours'),
  ('facebook_url', 'https://www.facebook.com/gracelovechapel', 'Church Facebook page'),
  ('instagram_url', 'https://www.instagram.com/gracelovechapelgh', 'Church Instagram profile'),
  ('youtube_url', 'https://youtube.com/@gracelovechapel', 'Church YouTube channel')
ON CONFLICT (key) DO NOTHING;

-- Trigger for services updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
