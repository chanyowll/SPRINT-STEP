-- =====================================================================
-- STEP Hub — Panelists' weekly accomplishment reports
-- Run in the Supabase SQL Editor. Safe to run more than once.
-- Needs panel_seats.sql (my_panel_seats) and panel_sheets.sql (has_role).
--
-- One row = one panelist's report for one session (session_code, seat).
-- The report is built from the panelist's own score sheet (panel_sheets)
-- when they press "Create accomplishment report", then edited on the site:
--   rows  [{"team_id":"g1","team":"POSTE","text":"…","remark":"…","done":true}, …]
-- plus the signed copy they upload (bucket "panel-reports").
--
-- A panelist reads and writes only the report of their own seat; an admin
-- reads and writes every report.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.panel_reports (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code   TEXT NOT NULL,                 -- 'M3', 'PDD', … (same as panel_sheets)
  week_no        INT,
  seat           INT NOT NULL REFERENCES public.panel_seats(seat),
  panel_letter   TEXT NOT NULL DEFAULT '',
  panelist       TEXT NOT NULL DEFAULT '',      -- name as it goes on the report
  topic          TEXT NOT NULL DEFAULT '',
  period         TEXT NOT NULL DEFAULT '',
  rows           JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_stamp   TEXT NOT NULL DEFAULT '',      -- score-sheet version the text was built from
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  signed_path    TEXT,
  signed_name    TEXT,
  signed_size    BIGINT,
  submitted_at   TIMESTAMPTZ,
  updated_by     UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_code, seat)
);

CREATE INDEX IF NOT EXISTS panel_reports_session ON public.panel_reports (session_code);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.panel_reports TO authenticated;
ALTER TABLE public.panel_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS panel_reports_select ON public.panel_reports;
CREATE POLICY panel_reports_select ON public.panel_reports FOR SELECT TO authenticated
  USING (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()));

DROP POLICY IF EXISTS panel_reports_insert ON public.panel_reports;
CREATE POLICY panel_reports_insert ON public.panel_reports FOR INSERT TO authenticated
  WITH CHECK (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()));

DROP POLICY IF EXISTS panel_reports_update ON public.panel_reports;
CREATE POLICY panel_reports_update ON public.panel_reports FOR UPDATE TO authenticated
  USING (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()))
  WITH CHECK (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()));

DROP POLICY IF EXISTS panel_reports_delete ON public.panel_reports;
CREATE POLICY panel_reports_delete ON public.panel_reports FOR DELETE TO authenticated
  USING (public.has_role('admin'));

-- ── the signed copies: <session>/seat<N>/<time>-<file name> ───────────
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('panel-reports', 'panel-reports', false, 26214400)            -- 25 MB
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 26214400;

DROP POLICY IF EXISTS "panel_reports_files_select" ON storage.objects;
CREATE POLICY "panel_reports_files_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'panel-reports' AND (
    public.has_role('admin')
    OR (storage.foldername(name))[2] IN (SELECT 'seat' || s FROM public.my_panel_seats() s)));

DROP POLICY IF EXISTS "panel_reports_files_insert" ON storage.objects;
CREATE POLICY "panel_reports_files_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'panel-reports' AND (
    public.has_role('admin')
    OR (storage.foldername(name))[2] IN (SELECT 'seat' || s FROM public.my_panel_seats() s)));

DROP POLICY IF EXISTS "panel_reports_files_update" ON storage.objects;
CREATE POLICY "panel_reports_files_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'panel-reports' AND (
    public.has_role('admin')
    OR (storage.foldername(name))[2] IN (SELECT 'seat' || s FROM public.my_panel_seats() s)));

DROP POLICY IF EXISTS "panel_reports_files_delete" ON storage.objects;
CREATE POLICY "panel_reports_files_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'panel-reports' AND (
    public.has_role('admin')
    OR (storage.foldername(name))[2] IN (SELECT 'seat' || s FROM public.my_panel_seats() s)));

-- ── check it took ────────────────────────────────────────────────────
SELECT 'columns' AS item,
       (SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
          FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'panel_reports') AS value
UNION ALL
SELECT 'policies', (SELECT count(*)::text FROM pg_policies
                     WHERE schemaname = 'public' AND tablename = 'panel_reports')
UNION ALL
SELECT 'bucket', (SELECT id FROM storage.buckets WHERE id = 'panel-reports');
