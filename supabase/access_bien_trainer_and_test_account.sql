-- =====================================================================
-- STEP Hub — access changes (October 2026)
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--   1. Mr. Bienvenido Garcia (bgarcia@ateneo.edu) gets Trainer access,
--      on top of his Mentor (BRICKS) and Panelist access.
--   2. The test account perotechrystian@gmail.com leaves the SINAG team
--      and becomes a STEP Tech Team account (tech console + admin).
-- =====================================================================

-- 1. Sir Bien: mentor + trainer + panelist
UPDATE public.role_invites
   SET roles = ARRAY['mentor','trainer','panel'],
       role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor, Trainer & Panelist (')
 WHERE lower(email) = 'bgarcia@ateneo.edu';
UPDATE public.profiles
   SET roles = ARRAY['mentor','trainer','panel'],
       role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor, Trainer & Panelist (')
 WHERE lower(email) = 'bgarcia@ateneo.edu';

-- 2. Test account: off SINAG, onto the tech team
UPDATE public.role_invites
   SET role = 'admin', role_label = 'STEP Tech Team', team_id = NULL, roles = NULL,
       full_name = 'STEP Tech Team', initials = 'ST'
 WHERE lower(email) = 'perotechrystian@gmail.com';
UPDATE public.profiles
   SET role = 'admin', role_label = 'STEP Tech Team', team_id = NULL, teams = NULL, roles = NULL,
       full_name = 'STEP Tech Team', initials = 'ST', institution = 'AIPO'
 WHERE lower(email) = 'perotechrystian@gmail.com';
-- if the test account was ever added to SINAG's member list, take it off
DELETE FROM public.team_members WHERE team_id = 'g2' AND name ILIKE '%perote%';

-- the tech team, as the database checks it (tech console data, articles, work plan …)
CREATE OR REPLACE FUNCTION public.is_tech() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = ANY (ARRAY['cperote@ateneo.edu', 'joshguico@gmail.com', 'perotechrystian@gmail.com'])
$$;
GRANT EXECUTE ON FUNCTION public.is_tech() TO anon, authenticated;

-- check
SELECT email, full_name, role, role_label, team_id, roles
  FROM public.profiles
 WHERE lower(email) IN ('bgarcia@ateneo.edu', 'perotechrystian@gmail.com');
