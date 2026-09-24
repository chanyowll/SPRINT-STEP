-- =====================================================================
-- STEP Hub — Assign Roles to Real Users
-- Run this AFTER both users have signed up via the app.
--
-- This script assigns:
--   cperote@ateneo.edu        → Admin
--   perotechrystian@gmail.com  → Participant (SINAG, team g2)
-- =====================================================================

-- Assign Admin role
UPDATE profiles
SET
  role       = 'admin',
  role_label = 'STEP Team / Admin',
  full_name  = 'C. Perote',
  initials   = 'CP',
  institution = 'AIPO'
WHERE email = 'cperote@ateneo.edu';

-- Assign SINAG Participant role
UPDATE profiles
SET
  role       = 'participant',
  role_label = 'Participant',
  team_id    = 'g2',
  full_name  = 'Chrystian Perote',
  initials   = 'CP',
  institution = 'University of Southern Mindanao'
WHERE email = 'perotechrystian@gmail.com';

-- Verify
SELECT email, full_name, role, role_label, team_id
FROM profiles
WHERE email IN ('cperote@ateneo.edu', 'perotechrystian@gmail.com');
