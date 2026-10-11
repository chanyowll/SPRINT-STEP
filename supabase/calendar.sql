-- =====================================================================
-- STEP Hub — STEP Calendar: Zoom links and team mentoring
-- Run this in the Supabase SQL Editor. Safe to run more than once.
--
-- The program dates themselves live in schedule-data.js. The database
-- only keeps what the STEP Team adds on top:
--   cal_links      one Zoom link per program session (learning,
--                  feedback, onboarding), keyed '2026-11-10:learning'
--   cal_mentoring  each team's mentoring sessions, with their own link
-- Anyone signed in reads the session links; a team's mentoring is read
-- only by that team, its facilitators and the STEP Team. Only the STEP
-- Team (admins and the tech team) adds or changes anything.
-- =====================================================================

-- who counts as the STEP Team (same as in mail.sql)
CREATE OR REPLACE FUNCTION public.is_step_team() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role('admin') OR public.is_tech()
$$;
REVOKE ALL ON FUNCTION public.is_step_team() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_step_team() TO authenticated;

-- ---------- Zoom links for program sessions ----------
CREATE TABLE IF NOT EXISTS public.cal_links (
  session_key text PRIMARY KEY CHECK (session_key ~ '^\d{4}-\d{2}-\d{2}:[a-z]+$'),
  zoom_url    text NOT NULL CHECK (zoom_url ~* '^https?://\S+$' AND length(zoom_url) <= 600),
  updated_by  uuid DEFAULT auth.uid(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cal_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cal_links_select ON public.cal_links;
CREATE POLICY cal_links_select ON public.cal_links FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS cal_links_write ON public.cal_links;
CREATE POLICY cal_links_write ON public.cal_links FOR ALL TO authenticated
  USING (public.is_step_team()) WITH CHECK (public.is_step_team());

-- ---------- each team's mentoring sessions ----------
CREATE TABLE IF NOT EXISTS public.cal_mentoring (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    text NOT NULL,
  on_date    date NOT NULL,
  start_time time NOT NULL,
  end_time   time NOT NULL CHECK (end_time > start_time),
  mentor     text NOT NULL DEFAULT '' CHECK (length(mentor) <= 120),
  zoom_url   text CHECK (zoom_url IS NULL OR (zoom_url ~* '^https?://\S+$' AND length(zoom_url) <= 600)),
  created_by uuid DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cal_mentoring_team_idx ON public.cal_mentoring (team_id, on_date);
ALTER TABLE public.cal_mentoring ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cal_mentoring_select ON public.cal_mentoring;
CREATE POLICY cal_mentoring_select ON public.cal_mentoring FOR SELECT TO authenticated
  USING (public.is_step_team()
         OR team_id = public.get_user_team_id()
         OR team_id = ANY (public.my_teams()));
DROP POLICY IF EXISTS cal_mentoring_write ON public.cal_mentoring;
CREATE POLICY cal_mentoring_write ON public.cal_mentoring FOR ALL TO authenticated
  USING (public.is_step_team()) WITH CHECK (public.is_step_team());

-- ---------- check ----------
SELECT 'cal_links' AS made, count(*) FROM public.cal_links
UNION ALL SELECT 'cal_mentoring', count(*) FROM public.cal_mentoring;
