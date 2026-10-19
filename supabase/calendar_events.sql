-- =====================================================================
-- STEP Hub — STEP Calendar: events that are not a team's mentoring
-- Run this in the Supabase SQL Editor. Safe to run more than once.
--
-- The STEP Team (admins and the tech team) adds, edits and deletes
-- events. Anyone who is signed in can read them.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.cal_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 120),
  on_date    date NOT NULL,
  start_time time,
  end_time   time,
  place      text NOT NULL DEFAULT '' CHECK (length(place) <= 120),
  link_url   text CHECK (link_url IS NULL OR (link_url ~* '^https?://\S+$' AND length(link_url) <= 600)),
  notes      text NOT NULL DEFAULT '' CHECK (length(notes) <= 600),
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((start_time IS NULL AND end_time IS NULL) OR (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time))
);
CREATE INDEX IF NOT EXISTS cal_events_date_idx ON public.cal_events (on_date);
ALTER TABLE public.cal_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cal_events_select ON public.cal_events;
CREATE POLICY cal_events_select ON public.cal_events FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS cal_events_write ON public.cal_events;
CREATE POLICY cal_events_write ON public.cal_events FOR ALL TO authenticated
  USING (public.is_step_team()) WITH CHECK (public.is_step_team());

SELECT 'cal_events' AS made, count(*) FROM public.cal_events;
