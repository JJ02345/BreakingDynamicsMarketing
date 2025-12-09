-- ============================================
-- FIX ADMIN_USERS RLS POLICY
-- Allow users to check if they are admin
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can check own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admins can read all admin users" ON admin_users;

-- Allow any authenticated user to check if THEY are an admin
-- This is safe because they can only see their own row (user_id = auth.uid())
CREATE POLICY "Users can check own admin status" ON admin_users
  FOR SELECT USING (user_id = auth.uid());

-- Admins can see all admin users (for admin management UI)
CREATE POLICY "Admins can read all admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );
