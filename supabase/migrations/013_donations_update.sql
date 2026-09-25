-- Update donations table to support Paystack integration

-- Add email and reference_id
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS reference_id text;

-- Update the check constraint to support more types
ALTER TABLE public.donations DROP CONSTRAINT IF EXISTS donations_type_check;
ALTER TABLE public.donations ADD CONSTRAINT donations_type_check CHECK (type IN ('tithe', 'offering', 'thanksgiving', 'project', 'other'));

-- Since donor_name was NOT NULL, and we may have anonymous donors or just blank names,
-- we should probably alter donor_name to drop NOT NULL
ALTER TABLE public.donations ALTER COLUMN donor_name DROP NOT NULL;
