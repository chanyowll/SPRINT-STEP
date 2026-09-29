-- =====================================================================
-- STEP Hub — Mentors' weekly accomplishment reports
-- Run in the Supabase SQL Editor. Safe to run more than once.
--
-- One row = one team's report for one week (week_code, team_id).
-- The planned activities themselves live in the site (mock-data.js →
-- faculty.mentorPlans), carried over from the STEP 2 mentors' reports;
-- this table keeps what the mentor fills in against them:
--   tasks  {"0": {"done": true, "remark": "…"}, "1": {…}}
-- plus the signed copy they upload (bucket "mentor-reports").
--
-- Mentors and admins read every report. A mentor edits the reports they
-- started (mentor_id = their account); an admin edits any.
-- Needs public.has_role() from panel_sheets.sql.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.mentor_reports (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_code      TEXT NOT NULL,                 -- 'M2', 'M3A', 'CU', 'DDP', …
  week_no        INT,
  team_id        TEXT NOT NULL,
  team_name      TEXT NOT NULL DEFAULT '',
  mentor_id      UUID REFERENCES public.profiles(id),
  mentor_name    TEXT NOT NULL DEFAULT '',
  period         TEXT NOT NULL DEFAULT '',
  tasks          JSONB NOT NULL DEFAULT '{}'::jsonb,
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  signed_path    TEXT,
  signed_name    TEXT,
  signed_size    BIGINT,
  submitted_at   TIMESTAMPTZ,
  updated_by     UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (week_code, team_id)
);

CREATE INDEX IF NOT EXISTS mentor_reports_week ON public.mentor_reports (week_code);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_reports TO authenticated;
ALTER TABLE public.mentor_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mentor_reports_select ON public.mentor_reports;
CREATE POLICY mentor_reports_select ON public.mentor_reports
  FOR SELECT TO authenticated
  USING (public.has_role('mentor') OR public.has_role('admin'));

DROP POLICY IF EXISTS mentor_reports_insert ON public.mentor_reports;
CREATE POLICY mentor_reports_insert ON public.mentor_reports
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role('admin')
              OR (public.has_role('mentor') AND mentor_id = auth.uid()));

DROP POLICY IF EXISTS mentor_reports_update ON public.mentor_reports;
CREATE POLICY mentor_reports_update ON public.mentor_reports
  FOR UPDATE TO authenticated
  USING (public.has_role('admin')
         OR (public.has_role('mentor') AND (mentor_id = auth.uid() OR mentor_id IS NULL)))
  WITH CHECK (public.has_role('admin')
              OR (public.has_role('mentor') AND mentor_id = auth.uid()));

DROP POLICY IF EXISTS mentor_reports_delete ON public.mentor_reports;
CREATE POLICY mentor_reports_delete ON public.mentor_reports
  FOR DELETE TO authenticated
  USING (public.has_role('admin'));

-- ── the signed copies ────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('mentor-reports', 'mentor-reports', false, 26214400)          -- 25 MB
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 26214400;

DROP POLICY IF EXISTS "mentor_reports_files_select" ON storage.objects;
CREATE POLICY "mentor_reports_files_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'mentor-reports' AND (public.has_role('mentor') OR public.has_role('admin')));

DROP POLICY IF EXISTS "mentor_reports_files_insert" ON storage.objects;
CREATE POLICY "mentor_reports_files_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'mentor-reports' AND (public.has_role('mentor') OR public.has_role('admin')));

DROP POLICY IF EXISTS "mentor_reports_files_update" ON storage.objects;
CREATE POLICY "mentor_reports_files_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'mentor-reports' AND (owner_id = auth.uid()::text OR public.has_role('admin')));

DROP POLICY IF EXISTS "mentor_reports_files_delete" ON storage.objects;
CREATE POLICY "mentor_reports_files_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'mentor-reports' AND (owner_id = auth.uid()::text OR public.has_role('admin')));
