-- =====================================================================
-- STEP Hub — STEP 2.5 Master Timeline update (October 2026)
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- The site's schedule now follows the updated Master Timeline:
--   W1  Program Launch (Oct 29–30), site visits (Nov 4–6), Market Mapping review (Nov 7)
--   W2  Value Proposition (Nov 10) · Market Research presentation (Nov 14)       — Sir Tony
--   W3  Measuring Value / VP Refinement (Nov 17) · Refined VP (Nov 21)          — Sir Tony
--   W4  Competitive Advantage (Nov 24 / Nov 28)                                  — Sir GQ
--   W5  Business Model Validation (Dec 1 / Dec 5)                                — Sir GQ
--   W6  Mid-Program Checkpoint, on site (Dec 10–11)                              — Doc Jon
--   W7  Go-to-Market & Lean Canvas (Dec 15 / Dec 19)                             — Sir GQ
--   W8  Selling Skill (Wed Dec 23 / Dec 26)                                      — Sir GQ
--   break Dec 27 – Jan 4; W9–W12 unchanged
-- =====================================================================

-- 1. Who teaches which week (decides which trainer may edit that week's score sheet)
DELETE FROM public.session_trainers WHERE session_code IN ('W1','W2','W3','W4','W5','W6','W7','W8');
INSERT INTO public.session_trainers (session_code, trainer_email, week_starts, week_ends) VALUES
  ('W2',  'aferia@ateneo.edu',      '2026-11-09', '2026-11-15'),
  ('W3',  'aferia@ateneo.edu',      '2026-11-16', '2026-11-22'),
  ('W4',  'gquitoriano@ateneo.edu', '2026-11-23', '2026-11-29'),
  ('W5',  'gquitoriano@ateneo.edu', '2026-11-30', '2026-12-06'),
  ('W6',  'pfernandez@ateneo.edu',  '2026-12-07', '2026-12-13'),
  ('W7',  'gquitoriano@ateneo.edu', '2026-12-14', '2026-12-20'),
  ('W8',  'gquitoriano@ateneo.edu', '2026-12-21', '2026-12-27')
ON CONFLICT (session_code, trainer_email) DO UPDATE
  SET week_starts = EXCLUDED.week_starts, week_ends = EXCLUDED.week_ends;

-- 2. Week titles in the modules table (only rows that use the week codes W0–W12)
UPDATE public.modules m SET week_no = v.wk, title = v.title, trainer = v.trainer
FROM (VALUES
  ('W0', 0,  'Pre-Program: STEP Onboarding',          'STEP Team'),
  ('W1', 1,  'Program Launch & Market Mapping',        ''),
  ('W2', 2,  'Value Proposition',                      'Sir Tony'),
  ('W3', 3,  'Value Proposition Refinement',           'Sir Tony'),
  ('W4', 4,  'Competitive Advantage',                  'Sir GQ'),
  ('W5', 5,  'Business Model Validation',              'Sir GQ'),
  ('W6', 6,  'Mid-Program Checkpoint: IP & Finance',   'Doc Jon (IP) · finance trainer to be announced'),
  ('W7', 7,  'Go-to-Market & Lean Canvas',             'Sir GQ'),
  ('W8', 8,  'Selling Skills',                         'Sir GQ'),
  ('W9', 9,  'Pitching Skills',                        'Sir GQ'),
  ('W10', 10, 'Technology Roadmapping',                'Sir Benjie'),
  ('W11', 11, 'FASTRAC Proposal',                      'Sir Steve'),
  ('W12', 12, 'Demo Day',                              '')
) AS v(code, wk, title, trainer)
WHERE m.code = v.code;

-- 3. Check: anything already saved against Weeks 1–8 that was made for the OLD
--    schedule. Each row listed here should be looked at (send the list to the tech team).
SELECT 'score sheet edited by a trainer' AS check_item, code AS week, updated_at::text AS detail
  FROM public.score_sheets WHERE code IN ('W1','W2','W3','W4','W5','W6','W7','W8')
UNION ALL
SELECT 'material or recording posted', 'W' || week_no, title || ' · ' || file_name
  FROM public.session_materials WHERE week_no BETWEEN 1 AND 8
UNION ALL
SELECT 'session trainer now set', session_code, trainer_email || ' · ' || week_starts || ' to ' || week_ends
  FROM public.session_trainers
ORDER BY 1, 2;
