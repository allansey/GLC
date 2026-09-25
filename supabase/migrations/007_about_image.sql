-- Add about_image_url to site_settings
INSERT INTO public.site_settings (key, value, description)
VALUES 
  ('about_image_url', '/assets/images/faith.jpg', 'Image URL for the Mission and Vision section')
ON CONFLICT (key) DO NOTHING;
