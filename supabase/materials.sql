-- =====================================================================
-- STEP Hub — Session materials (the trainers' slide decks and other files)
-- Run this in the Supabase SQL Editor. It is self-contained and safe to
-- run more than once, exactly like storage.sql: it creates what is
-- missing and replaces what it owns.
--
-- What it sets up:
--   * a session_materials table — one row per posted deck
--   * a private "materials" bucket
--   * policies: trainers and admins post and remove; every signed-in
--     STEP user (participants included) can read, which is what lets a
--     deck appear on This Week and on the Program page.
-- =====================================================================

-- ── 0. helper ────────────────────────────────────────────────────────
-- Same SECURITY DEFINER helper storage.sql installs. Repeated here so
-- this file stands alone; CREATE OR REPLACE makes running both fine.

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()), 'guest');
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated, anon;

-- ── 1. the table ─────────────────────────────────────────────────────
-- module_code matches modules.code ('M11', 'M2', …). No foreign key, so
-- a deck can be posted for a session before the modules table is seeded.

CREATE TABLE IF NOT EXISTS public.session_materials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_code   TEXT NOT NULL,
  week_no       INT,
  title         TEXT NOT NULL DEFAULT '',
  storage_path  TEXT NOT NULL,
  file_name     TEXT NOT NULL DEFAULT '',
  file_size     BIGINT,
  mime_type     TEXT NOT NULL DEFAULT '',
  posted_by     UUID REFERENCES public.profiles(id),
  posted_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS session_materials_module ON public.session_materials (module_code);
CREATE INDEX IF NOT EXISTS session_materials_posted ON public.session_materials (posted_at DESC);

-- kind: 'deck' is the session's slide deck (This Week titles it after the
-- topic); 'material' is anything else the trainer adds — a worksheet, a
-- template, a reading — and its title is the name the trainer typed, which
-- is what participants see. Existing rows become decks.
ALTER TABLE public.session_materials ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'deck';
DO $$ BEGIN
  -- 'recording' is the session video, posted by the STEP team (admins) only
  ALTER TABLE public.session_materials DROP CONSTRAINT IF EXISTS session_materials_kind_check;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_materials_kind_check') THEN
    ALTER TABLE public.session_materials
      ADD CONSTRAINT session_materials_kind_check CHECK (kind IN ('deck', 'material', 'recording'));
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS session_materials_module_kind ON public.session_materials (module_code, kind);

-- several decks may be posted against one session, so no unique index:
-- the newest is the one the pages show.

-- Supabase grants these automatically to new tables in public; stated
-- here so the file also works on a project with tightened defaults.
-- RLS below is what actually decides who sees what.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_materials TO authenticated;

-- ── 2. who may read and write those rows ─────────────────────────────
ALTER TABLE public.session_materials ENABLE ROW LEVEL SECURITY;

-- read: anyone signed in. Course materials are for the whole programme.
DROP POLICY IF EXISTS session_materials_select ON public.session_materials;
CREATE POLICY session_materials_select ON public.session_materials
  FOR SELECT TO authenticated USING (true);

-- write: only the people who run sessions
DROP POLICY IF EXISTS session_materials_insert ON public.session_materials;
CREATE POLICY session_materials_insert ON public.session_materials
  FOR INSERT TO authenticated WITH CHECK (
    public.get_user_role() IN ('trainer', 'admin')
    AND (kind <> 'recording' OR public.get_user_role() = 'admin')   -- videos: admins only
  );

DROP POLICY IF EXISTS session_materials_update ON public.session_materials;
CREATE POLICY session_materials_update ON public.session_materials
  FOR UPDATE TO authenticated USING (
    public.get_user_role() IN ('trainer', 'admin')
  ) WITH CHECK (
    public.get_user_role() IN ('trainer', 'admin')
  );

-- a trainer removes their own; an admin removes any
DROP POLICY IF EXISTS session_materials_delete ON public.session_materials;
CREATE POLICY session_materials_delete ON public.session_materials
  FOR DELETE TO authenticated USING (
    public.get_user_role() = 'admin'
    OR (public.get_user_role() = 'trainer' AND posted_by = auth.uid())
  );

-- ── 3. the bucket ────────────────────────────────────────────────────
-- private: no public URL exists, every read goes through a signed URL
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('materials', 'materials', false, 2147483648)  -- 2 GB: session recordings live here too
ON CONFLICT (id) DO UPDATE
  SET public = false, file_size_limit = EXCLUDED.file_size_limit;

-- ── 4. who may do what with the files ────────────────────────────────
-- Paths look like  M11/1723534000-selling-skills.pdf
-- so the first folder of the path names the session.

DROP POLICY IF EXISTS "materials_files_select" ON storage.objects;
CREATE POLICY "materials_files_select" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'materials');

DROP POLICY IF EXISTS "materials_files_insert" ON storage.objects;
CREATE POLICY "materials_files_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'materials' AND public.get_user_role() IN ('trainer', 'admin')
  );

DROP POLICY IF EXISTS "materials_files_update" ON storage.objects;
CREATE POLICY "materials_files_update" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'materials' AND public.get_user_role() IN ('trainer', 'admin')
  );

DROP POLICY IF EXISTS "materials_files_delete" ON storage.objects;
CREATE POLICY "materials_files_delete" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'materials' AND public.get_user_role() IN ('trainer', 'admin')
  );

-- ── 5. check it took ─────────────────────────────────────────────────
SELECT 'role fn' AS item, public.get_user_role() AS value
UNION ALL
SELECT 'bucket', (SELECT id FROM storage.buckets WHERE id = 'materials')
UNION ALL
SELECT 'table', (SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
                 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'session_materials')
UNION ALL
SELECT 'row policies', (SELECT count(*)::text FROM pg_policies
                        WHERE schemaname = 'public' AND tablename = 'session_materials')
UNION ALL
SELECT 'file policies', (SELECT count(*)::text FROM pg_policies
                         WHERE schemaname = 'storage' AND tablename = 'objects'
                           AND policyname LIKE 'materials_files%');
