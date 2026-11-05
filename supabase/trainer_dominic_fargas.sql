-- =====================================================================
-- STEP Hub — Week 9 trainer: Mr. Dominic Fargas Jr. ("Sir Dom"), dcfargas@up.edu.ph
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--   1. lets him create his STEP Hub account with this email (invite-only
--      sign-up) and gives it Trainer access (the Trainers page)
--   2. makes him Week 9's trainer (Pitching Skill, Jan 11–17), so he can edit
--      that week's criteria and score sheet
-- =====================================================================

-- 1. the invite, and the account if it already exists
INSERT INTO public.role_invites (email, role, roles, role_label, full_name, initials, team_id, institution)
VALUES ('dcfargas@up.edu.ph', 'trainer', ARRAY['trainer'], 'Trainer (Pitching Skill)', 'Mr. Dominic Fargas Jr.', 'DF', NULL, 'University of the Philippines')
ON CONFLICT (email) DO UPDATE
  SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(public.role_invites.roles, ARRAY[public.role_invites.role]) || ARRAY['trainer'])),
      role_label = CASE WHEN public.role_invites.role = 'trainer' THEN EXCLUDED.role_label ELSE public.role_invites.role_label END,
      full_name = EXCLUDED.full_name, initials = EXCLUDED.initials, institution = EXCLUDED.institution;

UPDATE public.profiles
   SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(roles, ARRAY[role]) || ARRAY['trainer'])),
       role  = CASE WHEN role = 'guest' THEN 'trainer' ELSE role END
 WHERE lower(email) = 'dcfargas@up.edu.ph';

-- 2. Week 9's trainer
DELETE FROM public.session_trainers WHERE session_code = 'W9' AND lower(trainer_email) <> 'dcfargas@up.edu.ph';
INSERT INTO public.session_trainers (session_code, trainer_email, week_starts, week_ends)
VALUES ('W9', 'dcfargas@up.edu.ph', '2027-01-11', '2027-01-17')
ON CONFLICT (session_code, trainer_email) DO UPDATE
  SET week_starts = EXCLUDED.week_starts, week_ends = EXCLUDED.week_ends;
UPDATE public.modules SET trainer = 'Sir Dom' WHERE code = 'W9';

-- check
SELECT 'invite' AS what, email, role, roles::text AS roles, full_name, NULL::date AS week_starts, NULL::date AS week_ends
  FROM public.role_invites WHERE lower(email) = 'dcfargas@up.edu.ph'
UNION ALL
SELECT 'week 9', trainer_email, NULL, NULL, session_code, week_starts, week_ends
  FROM public.session_trainers WHERE session_code = 'W9';
