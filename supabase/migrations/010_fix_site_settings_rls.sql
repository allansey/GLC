-- Ensure RLS is enabled on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Re-create the public select policy to ensure it exists and is correct
DROP POLICY IF EXISTS "Public can view settings" ON public.site_settings;

CREATE POLICY "Public can view settings"
  ON public.site_settings FOR SELECT
  TO public
  USING (true);

-- Ensure RLS is enabled on services (just in case)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active services" ON public.services;

CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  TO public
  USING (is_active = true);
