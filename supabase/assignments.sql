-- =====================================================================
-- STEP Hub — Weekly assignments (quick instructions, detailed instructions file, template deck)
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- Everyone signed in can read; the tech team and admins post them.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  week_no        INTEGER PRIMARY KEY,
  instructions   TEXT NOT NULL DEFAULT '',
  template_path  TEXT,
  template_name  TEXT,
  template_size  BIGINT,
  updated_by     TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- the detailed instructions file (added later; safe to re-run)
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS guide_path TEXT;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS guide_name TEXT;
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS guide_size BIGINT;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;

DROP POLICY IF EXISTS assignments_read ON public.assignments;
CREATE POLICY assignments_read ON public.assignments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS assignments_write ON public.assignments;
CREATE POLICY assignments_write ON public.assignments FOR ALL TO authenticated
  USING (public.is_tech() OR public.has_role('admin'))
  WITH CHECK (public.is_tech() OR public.has_role('admin'));

-- the template files: a private bucket, read by anyone signed in
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "assignments_files_read" ON storage.objects;
CREATE POLICY "assignments_files_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'assignments');
DROP POLICY IF EXISTS "assignments_files_write" ON storage.objects;
CREATE POLICY "assignments_files_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assignments' AND (public.is_tech() OR public.has_role('admin')));
DROP POLICY IF EXISTS "assignments_files_update" ON storage.objects;
CREATE POLICY "assignments_files_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'assignments' AND (public.is_tech() OR public.has_role('admin')));
DROP POLICY IF EXISTS "assignments_files_delete" ON storage.objects;
CREATE POLICY "assignments_files_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'assignments' AND (public.is_tech() OR public.has_role('admin')));

NOTIFY pgrst, 'reload schema';

SELECT 'assignments table ready' AS status, count(*) AS weeks_posted FROM public.assignments;
