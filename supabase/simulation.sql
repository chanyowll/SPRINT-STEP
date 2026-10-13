-- =====================================================================
-- STEP Hub — simulation weeks (Week S1 and Week S2)
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- The site's simulation (schedule-data.js, SIM_ACTIVE) adds two practice
-- weeks with their own week numbers and codes:
--   Week S1 = week_no -2, code 'W-2'      Week S2 = week_no -1, code 'W-1'
-- so hand-ins, panel sheets, attendance, materials and recordings made
-- during the simulation never land on a real week (W0–W12).
--
-- My Team's Work lists a week only if the modules table has it, so the
-- two practice weeks are added here.
-- =====================================================================

INSERT INTO public.modules (code, week_no, title, trainer) VALUES
  ('W-2', -2, 'Simulation: Customer Discovery Sprint', 'STEP Team'),
  ('W-1', -1, 'Simulation: Pricing & Pitch Practice',  'STEP Team')
ON CONFLICT (code) DO UPDATE SET week_no = EXCLUDED.week_no, title = EXCLUDED.title, trainer = EXCLUDED.trainer;

SELECT code, week_no, title FROM public.modules ORDER BY week_no;
