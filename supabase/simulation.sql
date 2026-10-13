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

-- ---------------------------------------------------------------------
-- Panel groupings for the simulation weeks
-- panel_plans only accepted real week numbers, so saving the Week S1
-- board failed (panel_plans_week_from_check). Widen the range to include
-- the two simulation weeks (-2, -1); real weeks 0–12 are unaffected.
-- ---------------------------------------------------------------------
ALTER TABLE public.panel_plans DROP CONSTRAINT IF EXISTS panel_plans_week_from_check;
ALTER TABLE public.panel_plans ADD CONSTRAINT panel_plans_week_from_check
  CHECK (week_from BETWEEN -2 AND 12);
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panel_plans_week_to_check'
               AND conrelid = 'public.panel_plans'::regclass) THEN
    ALTER TABLE public.panel_plans DROP CONSTRAINT panel_plans_week_to_check;
    ALTER TABLE public.panel_plans ADD CONSTRAINT panel_plans_week_to_check
      CHECK (week_to IS NULL OR week_to BETWEEN -2 AND 12);
  END IF;
END $$;

-- any other week checks that could block the simulation weeks
SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS rule
FROM pg_constraint
WHERE contype = 'c' AND connamespace = 'public'::regnamespace
  AND pg_get_constraintdef(oid) ILIKE '%week%'
ORDER BY 1, 2;
