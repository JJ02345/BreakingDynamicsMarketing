-- ============================================
-- ADMIN CHECK FUNCTION
-- Bypasses RLS to check admin status
-- ============================================

CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  target_user_id UUID;
  admin_exists BOOLEAN;
BEGIN
  -- Use provided user_id or current authenticated user
  target_user_id := COALESCE(check_user_id, auth.uid());

  -- Return false if no user
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if user exists in admin_users table
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = target_user_id
  ) INTO admin_exists;

  RETURN admin_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
