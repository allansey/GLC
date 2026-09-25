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
CREATE POLICY "Anyone can view published sermons"
  ON sermons
  FOR SELECT
  TO public
  USING (is_published = true);

-- Policy: Authenticated users can manage sermons
CREATE POLICY "Authenticated users can manage sermons"
  ON sermons
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_sermons_is_published ON sermons(is_published);
CREATE INDEX idx_sermons_date ON sermons(date DESC);
CREATE INDEX idx_sermons_series ON sermons(series);
CREATE INDEX idx_sermons_is_featured ON sermons(is_featured);

-- Create updated_at trigger
CREATE TRIGGER update_sermons_updated_at BEFORE UPDATE ON sermons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
