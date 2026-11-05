-- =====================================================================
-- STEP Hub — STEP 2.5 Master Timeline update (November 2026)
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- The latter part of the schedule moved (the site's dates are in schedule-data.js;
-- this updates the database tables that carry week dates or trainers):
--   Christmas break  Dec 21 – Jan 3 (right after Week 7)
--   W8  Selling Skill          Tue Jan 5  · Sat Jan 9   — Sir GQ
--   W9  Pitching Skill         Tue Jan 12 · Sat Jan 16  — Sir Dom (email to follow)
--   W10 Technology Roadmapping Tue Jan 19 · Sat Jan 23  — Sir Benjie
--   W11 FASTRAC Proposal Wkshp Tue Jan 26 · Sat Jan 30  — Sir Steve
--   W12 Demo Day Thu Feb 11 · Graduation Fri Feb 12
-- =====================================================================

-- 1. Who teaches which week, and that week's dates (decides which trainer may
--    edit that week's score sheet). Sir GQ no longer teaches Week 9.
DELETE FROM public.session_trainers WHERE session_code IN ('W8','W9','W10','W11');
INSERT INTO public.session_trainers (session_code, trainer_email, week_starts, week_ends) VALUES
  ('W8',  'gquitoriano@ateneo.edu', '2027-01-04', '2027-01-10'),
  ('W10', 'bmirasol@ateneo.edu',    '2027-01-18', '2027-01-24'),
  ('W11', 'schaves@ateneo.edu',     '2027-01-25', '2027-01-31')
ON CONFLICT (session_code, trainer_email) DO UPDATE
  SET week_starts = EXCLUDED.week_starts, week_ends = EXCLUDED.week_ends;
-- Week 9 (Sir Dom, 2027-01-11 to 2027-01-17) is added once his email is known.

-- 2. Week 9's trainer in the modules table
UPDATE public.modules SET trainer = 'Sir Dom' WHERE code = 'W9';

-- 3. Check
SELECT session_code, trainer_email, week_starts, week_ends
  FROM public.session_trainers WHERE session_code IN ('W7','W8','W9','W10','W11')
 ORDER BY length(session_code), session_code;
