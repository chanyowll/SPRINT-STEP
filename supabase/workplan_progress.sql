-- =====================================================================
-- STEP Hub — Objectives and Tasks (tech console)
-- Progress on the DOST Form 5 work plan: one row per task.
-- Only the tech team can read or change it.
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.workplan_progress (
  task_id     TEXT PRIMARY KEY,
  done        BOOLEAN NOT NULL DEFAULT false,
  count       INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  note        TEXT NOT NULL DEFAULT '',
  done_at     TIMESTAMPTZ,
  updated_by  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.workplan_progress ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workplan_progress TO authenticated;

DROP POLICY IF EXISTS workplan_progress_tech ON public.workplan_progress;
CREATE POLICY workplan_progress_tech ON public.workplan_progress FOR ALL TO authenticated
  USING (public.is_tech()) WITH CHECK (public.is_tech());

NOTIFY pgrst, 'reload schema';

-- check
SELECT count(*) AS rows_so_far FROM public.workplan_progress;
