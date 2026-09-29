-- =====================================================================
-- STEP Hub — Panel score sheets (one sheet per panelist)
-- Run in the Supabase SQL Editor. Safe to run more than once.
--
-- One row = one team on one panelist's sheet for one session:
--   (session_code, panel_letter, panelist, team_id)
-- so two panelists on the same panel never see or overwrite each other's
-- scores or comments. Every keystroke is saved as a draft; "Submit scores"
-- stamps status = 'submitted'. Nothing is thrown away on submit — the
-- sheet reopens exactly as it was left.
--
-- Panelists are still the names on the site's panel list (not accounts),
-- so the sheet is chosen by name. Reading and writing is open to accounts
-- holding the panel or admin role.
-- =====================================================================

-- ── helper: does the signed-in account hold this role? ───────────────
-- Looks at profiles.role and at the optional profiles.roles list
-- (roles.sql), so a mentor who also sits on a panel qualifies.
CREATE OR REPLACE FUNCTION public.has_role(r TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (p.role = r OR r = ANY (COALESCE(p.roles, ARRAY[]::TEXT[])))
  );
$$;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated;

-- ── the table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.panel_sheets (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code     TEXT NOT NULL,              -- 'M11', 'PDD', 'DD', …
  panel_letter     TEXT NOT NULL,              -- 'A', 'B', 'C'
  panelist         TEXT NOT NULL,              -- name as listed on the site
  team_id          TEXT NOT NULL,              -- 'g1' … (teams.id)
  team_name        TEXT NOT NULL DEFAULT '',
  scores           JSONB NOT NULL DEFAULT '{}'::jsonb,  -- {"0": 3.5, "1": 3}
  point_notes      JSONB NOT NULL DEFAULT '{}'::jsonb,  -- {"0": "comment on criterion 1"}
  general_comment  TEXT NOT NULL DEFAULT '',
  total            NUMERIC(4,2),               -- weighted total when every criterion is scored
  complete         BOOLEAN NOT NULL DEFAULT false,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  submitted_at     TIMESTAMPTZ,
  updated_by       UUID REFERENCES public.profiles(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_code, panel_letter, panelist, team_id)
);

CREATE INDEX IF NOT EXISTS panel_sheets_sheet
  ON public.panel_sheets (session_code, panel_letter, panelist);
CREATE INDEX IF NOT EXISTS panel_sheets_team
  ON public.panel_sheets (team_id, session_code);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.panel_sheets TO authenticated;

-- ── who may read and write ───────────────────────────────────────────
ALTER TABLE public.panel_sheets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS panel_sheets_select ON public.panel_sheets;
CREATE POLICY panel_sheets_select ON public.panel_sheets
  FOR SELECT TO authenticated
  USING (public.has_role('panel') OR public.has_role('admin'));

DROP POLICY IF EXISTS panel_sheets_insert ON public.panel_sheets;
CREATE POLICY panel_sheets_insert ON public.panel_sheets
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role('panel') OR public.has_role('admin'));

DROP POLICY IF EXISTS panel_sheets_update ON public.panel_sheets;
CREATE POLICY panel_sheets_update ON public.panel_sheets
  FOR UPDATE TO authenticated
  USING (public.has_role('panel') OR public.has_role('admin'))
  WITH CHECK (public.has_role('panel') OR public.has_role('admin'));

DROP POLICY IF EXISTS panel_sheets_delete ON public.panel_sheets;
CREATE POLICY panel_sheets_delete ON public.panel_sheets
  FOR DELETE TO authenticated
  USING (public.has_role('panel') OR public.has_role('admin'));

-- ── check it took ────────────────────────────────────────────────────
SELECT 'columns' AS item,
       (SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
          FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'panel_sheets') AS value
UNION ALL
SELECT 'policies', (SELECT count(*)::text FROM pg_policies
                     WHERE schemaname = 'public' AND tablename = 'panel_sheets');
