-- =====================================================================
-- STEP Hub — Submission files (video + slide deck)
-- Run this in the Supabase SQL Editor. It is self-contained and safe to
-- run more than once: it creates what is missing and replaces what it
-- owns, so it does not matter whether rls.sql was ever run.
--
-- BEFORE real videos will upload:
--   Dashboard → Storage → Settings → "Global file size limit"
--   ships at 50 MB. Raise it (2 GB is a sensible ceiling). A bucket can
--   never exceed the global value.
-- =====================================================================

-- ── 0. helpers ───────────────────────────────────────────────────────
-- Both are SECURITY DEFINER: they read profiles with the definer's
-- rights, so a policy that calls them cannot recurse into RLS.

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()), 'guest');
$$;

CREATE OR REPLACE FUNCTION public.get_user_team_id()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT team_id FROM public.profiles WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role()    TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_user_team_id() TO authenticated, anon;

-- ── 1. columns the player needs ──────────────────────────────────────
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS storage_path TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS file_name    TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS file_size    BIGINT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS mime_type    TEXT;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS uploaded_by  UUID REFERENCES public.profiles(id);

-- the app upserts one row per team + week + kind
CREATE UNIQUE INDEX IF NOT EXISTS submissions_team_week_kind
  ON public.submissions (team_id, week_no, kind);

-- ── 2. who may read and write those rows ─────────────────────────────
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS submissions_select ON public.submissions;
CREATE POLICY submissions_select ON public.submissions
  FOR SELECT TO authenticated USING (
    public.get_user_role() = 'admin'
    OR team_id = public.get_user_team_id()
    OR public.get_user_role() IN ('mentor', 'panel', 'trainer')
  );

DROP POLICY IF EXISTS submissions_insert ON public.submissions;
CREATE POLICY submissions_insert ON public.submissions
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() = 'admin' OR team_id = public.get_user_team_id()
  );

DROP POLICY IF EXISTS submissions_update ON public.submissions;
CREATE POLICY submissions_update ON public.submissions
  FOR UPDATE TO authenticated USING (
    public.get_user_role() = 'admin' OR team_id = public.get_user_team_id()
  ) WITH CHECK (
    public.get_user_role() = 'admin' OR team_id = public.get_user_team_id()
  );

DROP POLICY IF EXISTS submissions_delete ON public.submissions;
CREATE POLICY submissions_delete ON public.submissions
  FOR DELETE TO authenticated USING (
    public.get_user_role() = 'admin' OR team_id = public.get_user_team_id()
  );

-- ── 3. the bucket ────────────────────────────────────────────────────
-- private: no public URL exists, every read goes through a signed URL
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('submissions', 'submissions', false, 2147483648)   -- 2 GB per file
ON CONFLICT (id) DO UPDATE
  SET public = false, file_size_limit = EXCLUDED.file_size_limit;

-- ── 4. who may do what with the files ────────────────────────────────
-- Paths look like  <team_id>/week-08/video-1723534000-pitch.mp4
-- so the first folder of the path names the team that owns the file.

DROP POLICY IF EXISTS "submissions_files_insert" ON storage.objects;
CREATE POLICY "submissions_files_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'submissions'
    AND ( (storage.foldername(name))[1] = public.get_user_team_id()
          OR public.get_user_role() = 'admin' )
  );

DROP POLICY IF EXISTS "submissions_files_update" ON storage.objects;
CREATE POLICY "submissions_files_update" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'submissions'
    AND ( (storage.foldername(name))[1] = public.get_user_team_id()
          OR public.get_user_role() = 'admin' )
  );

DROP POLICY IF EXISTS "submissions_files_delete" ON storage.objects;
CREATE POLICY "submissions_files_delete" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'submissions'
    AND ( (storage.foldername(name))[1] = public.get_user_team_id()
          OR public.get_user_role() = 'admin' )
  );

-- Reading is what makes the player work from another account: the team
-- itself, plus mentors, panelists, trainers and admins. Only someone this
-- policy lets read can mint a signed URL.
DROP POLICY IF EXISTS "submissions_files_select" ON storage.objects;
CREATE POLICY "submissions_files_select" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'submissions'
    AND ( (storage.foldername(name))[1] = public.get_user_team_id()
          OR public.get_user_role() IN ('admin', 'mentor', 'panel', 'trainer') )
  );

-- ── 5. check it took ─────────────────────────────────────────────────
SELECT 'role fn'  AS item, public.get_user_role()                    AS value
UNION ALL
SELECT 'bucket',  (SELECT id FROM storage.buckets WHERE id = 'submissions')
UNION ALL
SELECT 'columns', (SELECT string_agg(column_name, ', ' ORDER BY column_name)
                   FROM information_schema.columns
                   WHERE table_name = 'submissions'
                     AND column_name IN ('storage_path','file_name','file_size','mime_type','uploaded_by'))
UNION ALL
SELECT 'file policies', (SELECT count(*)::text FROM pg_policies
                         WHERE schemaname = 'storage' AND tablename = 'objects'
                           AND policyname LIKE 'submissions_files%');
