-- ============================================
-- CAROUSELS TABLE
-- Stores user-created LinkedIn carousels
-- ============================================

CREATE TABLE IF NOT EXISTS carousels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled Carousel',
  slides JSONB NOT NULL DEFAULT '[]',
  settings JSONB DEFAULT '{"width": 1080, "height": 1080}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user queries
CREATE INDEX IF NOT EXISTS idx_carousels_user ON carousels(user_id);
CREATE INDEX IF NOT EXISTS idx_carousels_created ON carousels(created_at DESC);

-- RLS: Users can only manage their own carousels
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can insert own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can update own carousels" ON carousels;
DROP POLICY IF EXISTS "Users can delete own carousels" ON carousels;

CREATE POLICY "Users can read own carousels" ON carousels
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own carousels" ON carousels
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own carousels" ON carousels
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own carousels" ON carousels
  FOR DELETE USING (user_id = auth.uid());
