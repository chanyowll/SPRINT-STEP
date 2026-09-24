-- =====================================================================
-- STEP Hub — Create get_my_profile() function
-- This function bypasses RLS to return the calling user's own profile.
-- Run this in SQL Editor ONCE.
-- =====================================================================

CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS json AS $$
  SELECT row_to_json(p) FROM profiles p WHERE p.id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Test it (should return null if not logged in via API, that's fine)
SELECT get_my_profile();
