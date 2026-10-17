-- =====================================================================
-- STEP Hub — trainers edit the panel scoring criteria of their own topic,
-- for that topic's week. Admins can edit any week.
-- Safe to run more than once.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.score_sheets (
  code       text PRIMARY KEY,
  criteria   jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.score_sheets ENABLE ROW LEVEL SECURITY;

-- who teaches which week, and when that week runs (Manila dates)
CREATE TABLE IF NOT EXISTS public.session_trainers (
  session_code  text NOT NULL,
  trainer_email text NOT NULL,
  week_starts   date NOT NULL,
  week_ends     date NOT NULL,
  PRIMARY KEY (session_code, trainer_email)
);
ALTER TABLE public.session_trainers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS session_trainers_read ON public.session_trainers;
CREATE POLICY session_trainers_read ON public.session_trainers FOR SELECT TO authenticated USING (true);

INSERT INTO public.session_trainers (session_code, trainer_email, week_starts, week_ends) VALUES
  ('W3',  'aferia@ateneo.edu',      '2026-11-09', '2026-11-15'),
  ('W4',  'gquitoriano@ateneo.edu', '2026-11-16', '2026-11-22'),
  ('W6',  'pfernandez@ateneo.edu',  '2026-11-30', '2026-12-06'),
  ('W7',  'gquitoriano@ateneo.edu', '2026-12-07', '2026-12-13'),
  ('W8',  'gquitoriano@ateneo.edu', '2026-12-14', '2026-12-20'),
  ('W9',  'gquitoriano@ateneo.edu', '2027-01-04', '2027-01-10'),
  ('W10', 'bmirasol@ateneo.edu',    '2027-01-11', '2027-01-17'),
  ('W11', 'schaves@ateneo.edu',      '2027-01-18', '2027-01-24')
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.can_edit_score_sheet(p_code text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT public.has_role('admin')
      OR (public.has_role('trainer') AND EXISTS (
            SELECT 1 FROM public.session_trainers st
            WHERE st.session_code = p_code
              AND lower(st.trainer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))));
$$;

DROP POLICY IF EXISTS score_sheets_read_all ON public.score_sheets;
CREATE POLICY score_sheets_read_all ON public.score_sheets FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS score_sheets_trainer_insert ON public.score_sheets;
CREATE POLICY score_sheets_trainer_insert ON public.score_sheets FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_score_sheet(code));
DROP POLICY IF EXISTS score_sheets_trainer_update ON public.score_sheets;
CREATE POLICY score_sheets_trainer_update ON public.score_sheets FOR UPDATE TO authenticated
  USING (public.can_edit_score_sheet(code)) WITH CHECK (public.can_edit_score_sheet(code));
DROP POLICY IF EXISTS score_sheets_trainer_delete ON public.score_sheets;
CREATE POLICY score_sheets_trainer_delete ON public.score_sheets FOR DELETE TO authenticated
  USING (public.can_edit_score_sheet(code));
