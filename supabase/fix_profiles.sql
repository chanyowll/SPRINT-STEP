-- =====================================================================
-- STEP Hub — Fix Missing Profiles
-- The auto-create trigger doesn't fire for users created via the
-- Supabase Dashboard. This script manually inserts the profile rows.
--
-- Run this in SQL Editor ONCE.
-- =====================================================================

-- Insert profile for cperote@ateneo.edu (Admin)
INSERT INTO profiles (id, email, full_name, initials, role, role_label, team_id, institution)
SELECT
  id,
  email,
  'C. Perote',
  'CP',
  'admin',
  'STEP Team / Admin',
  NULL,
  'AIPO'
FROM auth.users
WHERE email = 'cperote@ateneo.edu'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  role_label = 'STEP Team / Admin',
  full_name = 'C. Perote',
  initials = 'CP',
  institution = 'AIPO';

-- Insert profile for perotechrystian@gmail.com (SINAG Participant)
INSERT INTO profiles (id, email, full_name, initials, role, role_label, team_id, institution)
SELECT
  id,
  email,
  'Chrystian Perote',
  'CP',
  'participant',
  'Participant',
  'g2',
  'University of Southern Mindanao'
FROM auth.users
WHERE email = 'perotechrystian@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'participant',
  role_label = 'Participant',
  team_id = 'g2',
  full_name = 'Chrystian Perote',
  initials = 'CP',
  institution = 'University of Southern Mindanao';

-- Verify both profiles exist
SELECT id, email, full_name, role, role_label, team_id
FROM profiles
WHERE email IN ('cperote@ateneo.edu', 'perotechrystian@gmail.com');
