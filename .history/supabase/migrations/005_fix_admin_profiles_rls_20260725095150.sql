-- Fix admin_profiles RLS policies - replace is_admin() with auth.role() check
-- This migration corrects the broken policies that were using a non-existent function

DROP POLICY IF EXISTS "admin_profiles_select_authenticated" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert_authenticated" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_update_authenticated" ON admin_profiles;

CREATE POLICY "admin_profiles_select_authenticated" ON admin_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_profiles_insert_authenticated" ON admin_profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "admin_profiles_update_authenticated" ON admin_profiles
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);
