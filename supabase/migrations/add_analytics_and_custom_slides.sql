-- ============================================
-- ANALYTICS EVENTS TABLE
-- Tracks user interactions for product analytics
-- ============================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying by event name and date
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- RLS: Anyone can insert (for tracking), only admins can read all
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Admins can read all analytics" ON analytics_events;
DROP POLICY IF EXISTS "Users can read own analytics" ON analytics_events;

-- Allow anyone to insert events (for anonymous tracking)
CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Only admins can read all events
CREATE POLICY "Admins can read all analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Users can read their own events
CREATE POLICY "Users can read own analytics" ON analytics_events
  FOR SELECT USING (user_id = auth.uid());


-- ============================================
-- CUSTOM SLIDES TABLE
-- User-saved slide templates
-- ============================================

CREATE TABLE IF NOT EXISTS custom_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slide_data JSONB NOT NULL,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user queries
CREATE INDEX IF NOT EXISTS idx_custom_slides_user ON custom_slides(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_slides_created ON custom_slides(created_at DESC);

-- RLS: Users can only manage their own slides
ALTER TABLE custom_slides ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own slides" ON custom_slides;
DROP POLICY IF EXISTS "Users can insert own slides" ON custom_slides;
DROP POLICY IF EXISTS "Users can update own slides" ON custom_slides;
DROP POLICY IF EXISTS "Users can delete own slides" ON custom_slides;

CREATE POLICY "Users can read own slides" ON custom_slides
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own slides" ON custom_slides
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own slides" ON custom_slides
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own slides" ON custom_slides
  FOR DELETE USING (user_id = auth.uid());


-- ============================================
-- ANALYTICS HELPER FUNCTIONS
-- ============================================

-- Function to get event counts by name (for admin dashboard)
CREATE OR REPLACE FUNCTION get_event_stats(days_back INT DEFAULT 30)
RETURNS TABLE (
  event_name VARCHAR(100),
  event_count BIGINT,
  unique_users BIGINT,
  unique_sessions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.event_name,
    COUNT(*)::BIGINT as event_count,
    COUNT(DISTINCT ae.user_id)::BIGINT as unique_users,
    COUNT(DISTINCT ae.session_id)::BIGINT as unique_sessions
  FROM analytics_events ae
  WHERE ae.created_at > NOW() - (days_back || ' days')::INTERVAL
  GROUP BY ae.event_name
  ORDER BY event_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get daily event counts (for charts)
CREATE OR REPLACE FUNCTION get_daily_events(event_name_filter VARCHAR DEFAULT NULL, days_back INT DEFAULT 30)
RETURNS TABLE (
  date DATE,
  event_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(ae.created_at) as date,
    COUNT(*)::BIGINT as event_count
  FROM analytics_events ae
  WHERE ae.created_at > NOW() - (days_back || ' days')::INTERVAL
    AND (event_name_filter IS NULL OR ae.event_name = event_name_filter)
  GROUP BY DATE(ae.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- CONVERSION FUNNEL FUNCTION
-- Tracks: Visit → Editor → Create → Export → Register
-- ============================================

CREATE OR REPLACE FUNCTION get_conversion_funnel(days_back INT DEFAULT 30)
RETURNS TABLE (
  step_name TEXT,
  step_order INT,
  total_sessions BIGINT,
  unique_users BIGINT,
  conversion_rate NUMERIC
) AS $$
DECLARE
  first_step_sessions BIGINT;
BEGIN
  -- Get total sessions for first step (for conversion rate calculation)
  SELECT COUNT(DISTINCT session_id) INTO first_step_sessions
  FROM analytics_events
  WHERE event_name = 'page_view'
    AND created_at > NOW() - (days_back || ' days')::INTERVAL;

  IF first_step_sessions = 0 THEN
    first_step_sessions := 1; -- Avoid division by zero
  END IF;

  RETURN QUERY
  WITH funnel_steps AS (
    -- Step 1: Page Views (Visitors)
    SELECT
      'Besucher'::TEXT as step_name,
      1 as step_order,
      COUNT(DISTINCT session_id) as sessions,
      COUNT(DISTINCT user_id) as users
    FROM analytics_events
    WHERE event_name = 'page_view'
      AND created_at > NOW() - (days_back || ' days')::INTERVAL

    UNION ALL

    -- Step 2: Editor Opened
    SELECT
      'Editor geöffnet'::TEXT,
      2,
      COUNT(DISTINCT session_id),
      COUNT(DISTINCT user_id)
    FROM analytics_events
    WHERE event_name IN ('template_used', 'editor_opened')
      AND created_at > NOW() - (days_back || ' days')::INTERVAL

    UNION ALL

    -- Step 3: Carousel Created (template selected or AI generated)
    SELECT
      'Carousel erstellt'::TEXT,
      3,
      COUNT(DISTINCT session_id),
      COUNT(DISTINCT user_id)
    FROM analytics_events
    WHERE event_name IN ('carousel_created', 'ai_carousel_generated', 'template_used')
      AND created_at > NOW() - (days_back || ' days')::INTERVAL

    UNION ALL

    -- Step 4: PDF Exported
    SELECT
      'PDF exportiert'::TEXT,
      4,
      COUNT(DISTINCT session_id),
      COUNT(DISTINCT user_id)
    FROM analytics_events
    WHERE event_name = 'carousel_exported'
      AND created_at > NOW() - (days_back || ' days')::INTERVAL

    UNION ALL

    -- Step 5: Registered (has user_id and signed_up event)
    SELECT
      'Registriert'::TEXT,
      5,
      COUNT(DISTINCT session_id),
      COUNT(DISTINCT user_id)
    FROM analytics_events
    WHERE event_name = 'user_signed_up'
      AND created_at > NOW() - (days_back || ' days')::INTERVAL
  )
  SELECT
    fs.step_name,
    fs.step_order,
    fs.sessions as total_sessions,
    fs.users as unique_users,
    ROUND((fs.sessions::NUMERIC / first_step_sessions) * 100, 2) as conversion_rate
  FROM funnel_steps fs
  ORDER BY fs.step_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DAILY STATS SUMMARY FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION get_daily_stats(days_back INT DEFAULT 30)
RETURNS TABLE (
  date DATE,
  visitors BIGINT,
  carousels_created BIGINT,
  carousels_exported BIGINT,
  registrations BIGINT,
  conversion_to_export NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH daily_data AS (
    SELECT
      DATE(created_at) as day,
      event_name,
      session_id,
      user_id
    FROM analytics_events
    WHERE created_at > NOW() - (days_back || ' days')::INTERVAL
  )
  SELECT
    d.day as date,
    COUNT(DISTINCT CASE WHEN event_name = 'page_view' THEN session_id END)::BIGINT as visitors,
    COUNT(DISTINCT CASE WHEN event_name IN ('template_used', 'ai_carousel_generated') THEN session_id END)::BIGINT as carousels_created,
    COUNT(DISTINCT CASE WHEN event_name = 'carousel_exported' THEN session_id END)::BIGINT as carousels_exported,
    COUNT(DISTINCT CASE WHEN event_name = 'user_signed_up' THEN user_id END)::BIGINT as registrations,
    CASE
      WHEN COUNT(DISTINCT CASE WHEN event_name = 'page_view' THEN session_id END) > 0
      THEN ROUND(
        (COUNT(DISTINCT CASE WHEN event_name = 'carousel_exported' THEN session_id END)::NUMERIC /
         COUNT(DISTINCT CASE WHEN event_name = 'page_view' THEN session_id END)) * 100, 2
      )
      ELSE 0
    END as conversion_to_export
  FROM daily_data d
  GROUP BY d.day
  ORDER BY d.day DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
