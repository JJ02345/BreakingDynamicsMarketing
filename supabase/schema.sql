-- ============================================
-- Breaking Dynamics - Supabase Database Schema
-- ============================================
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SURVEYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS surveys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Survey Content
    title VARCHAR(255) NOT NULL,
    question TEXT,
    blocks INTEGER DEFAULT 0,
    text TEXT,
    block_data JSONB DEFAULT '[]'::jsonb,
    validation_challenge TEXT,
    
    -- Scheduling
    scheduled_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX IF NOT EXISTS idx_surveys_user_id ON surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);

-- ============================================
-- FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Feedback Content
    type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature', 'general')),
    message TEXT NOT NULL,
    email VARCHAR(255),
    
    -- Metadata
    page_url TEXT,
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Surveys: Users can only access their own surveys
CREATE POLICY "Users can view own surveys" ON surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys" ON surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys" ON surveys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own surveys" ON surveys
    FOR DELETE USING (auth.uid() = user_id);

-- Feedback: Anyone can insert, but only view own or if admin
CREATE POLICY "Anyone can submit feedback" ON feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own feedback" ON feedback
    FOR SELECT USING (
        auth.uid() = user_id 
        OR auth.uid() IN (
            SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_surveys_updated_at
    BEFORE UPDATE ON surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- OPTIONAL: Admin View for Feedback
-- ============================================
-- Uncomment this if you want a view for admin dashboards

-- CREATE VIEW feedback_with_user AS
-- SELECT 
--     f.*,
--     u.email as user_email
-- FROM feedback f
-- LEFT JOIN auth.users u ON f.user_id = u.id;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to insert test data after creating a user

-- INSERT INTO surveys (user_id, title, question, blocks, text, validation_challenge)
-- VALUES (
--     'YOUR-USER-UUID-HERE',
--     'Problem-Solution Fit Test',
--     'Was ist euer größtes Problem bei der Marktvalidierung?',
--     5,
--     '🎯 Was ist euer größtes Problem bei der Marktvalidierung?

-- 👉 Kommentiert eure Erfahrungen!

-- #Startup #MVP #Validation',
--     'Wir glauben, dass Startups Schwierigkeiten haben, schnelles Marktfeedback zu erhalten.'
-- );
