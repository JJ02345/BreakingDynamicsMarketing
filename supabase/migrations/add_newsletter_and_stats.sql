-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  source VARCHAR(50) DEFAULT 'landing_page',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only admins can read all subscribers
CREATE POLICY "Admins can view subscribers" ON newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- SITE STATS TABLE (for carousel counter etc)
-- ============================================
CREATE TABLE IF NOT EXISTS site_stats (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Anyone can read stats
CREATE POLICY "Anyone can read stats" ON site_stats
  FOR SELECT USING (true);

-- Only service role can update (via RPC function)
-- No direct update policy for users

-- Insert initial carousel count
INSERT INTO site_stats (key, value) VALUES ('total_carousels', '0')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- RPC FUNCTION TO INCREMENT CAROUSEL COUNT
-- ============================================
CREATE OR REPLACE FUNCTION increment_carousel_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE site_stats
  SET value = (COALESCE(value::integer, 0) + 1)::text,
      updated_at = NOW()
  WHERE key = 'total_carousels';

  -- Insert if not exists
  IF NOT FOUND THEN
    INSERT INTO site_stats (key, value) VALUES ('total_carousels', '1');
  END IF;
END;
$$;

-- Grant execute permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION increment_carousel_count() TO anon;
GRANT EXECUTE ON FUNCTION increment_carousel_count() TO authenticated;
