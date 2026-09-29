-- =====================================================================
-- STEP Hub — Panel seats: who sits on which panel, and whose sheet is whose
-- Run in the Supabase SQL Editor after panel_sheets.sql. Safe to re-run.
--
-- Nine seats, three per panel (A: 1–3, B: 4–6, C: 7–9). Each seat has a
-- display name ("Panel 1" … "Panel 9" until the final list is in) and, once the
-- STEP team assigns it, the account of the person sitting in it.
--
-- A panel score sheet belongs to a seat. The database enforces it:
--   * a panel account reads and writes only the sheets of its own seat
--   * an admin reads and writes every sheet, and assigns the seats
-- =====================================================================

-- ── 1. the seats ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.panel_seats (
  seat          INT PRIMARY KEY CHECK (seat BETWEEN 1 AND 99),
  panel_letter  TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  profile_id    UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.panel_seats (seat, panel_letter, display_name) VALUES
  (1, 'A', 'Panel 1'), (2, 'A', 'Panel 2'), (3, 'A', 'Panel 3'),
  (4, 'B', 'Panel 4'), (5, 'B', 'Panel 5'), (6, 'B', 'Panel 6'),
  (7, 'C', 'Panel 7'), (8, 'C', 'Panel 8'), (9, 'C', 'Panel 9')
ON CONFLICT (seat) DO NOTHING;

GRANT SELECT ON public.panel_seats TO authenticated;
ALTER TABLE public.panel_seats ENABLE ROW LEVEL SECURITY;

-- names are shown to every signed-in user (This Week lists the panels)
DROP POLICY IF EXISTS panel_seats_select ON public.panel_seats;
CREATE POLICY panel_seats_select ON public.panel_seats
  FOR SELECT TO authenticated USING (true);
-- changes go through assign_panel_seat() below, admins only

-- ── 2. helpers ───────────────────────────────────────────────────────
-- the seat(s) held by the signed-in account
CREATE OR REPLACE FUNCTION public.my_panel_seats()
RETURNS SETOF INT
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT seat FROM public.panel_seats WHERE profile_id = auth.uid();
$$;
GRANT EXECUTE ON FUNCTION public.my_panel_seats() TO authenticated;

-- rename a seat and/or link it to an account by email (admins only).
-- p_email: NULL leaves the link as it is, '' clears it.
CREATE OR REPLACE FUNCTION public.assign_panel_seat(p_seat INT, p_name TEXT, p_email TEXT)
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  pid UUID;
BEGIN
  IF NOT public.has_role('admin') THEN
    RAISE EXCEPTION 'Only the STEP team can assign panel seats.';
  END IF;
  IF p_name IS NOT NULL AND btrim(p_name) <> '' THEN
    UPDATE public.panel_seats SET display_name = btrim(p_name), updated_at = now() WHERE seat = p_seat;
  END IF;
  IF p_email IS NOT NULL THEN
    IF btrim(p_email) = '' THEN
      UPDATE public.panel_seats SET profile_id = NULL, updated_at = now() WHERE seat = p_seat;
    ELSE
      SELECT id INTO pid FROM public.profiles WHERE lower(email) = lower(btrim(p_email));
      IF pid IS NULL THEN
        RAISE EXCEPTION 'No STEP Hub account uses %. The person has to sign up first.', btrim(p_email);
      END IF;
      -- one seat per person: free any seat this account held before
      UPDATE public.panel_seats SET profile_id = NULL, updated_at = now()
        WHERE profile_id = pid AND seat <> p_seat;
      UPDATE public.panel_seats SET profile_id = pid, updated_at = now() WHERE seat = p_seat;
      -- and make sure the account can open the Panel page
      UPDATE public.profiles
         SET roles = CASE
               WHEN role = 'panel' OR 'panel' = ANY (COALESCE(roles, ARRAY[]::TEXT[])) THEN roles
               WHEN role IN ('guest', 'participant') THEN roles
               ELSE ARRAY(SELECT DISTINCT unnest(COALESCE(roles, ARRAY[role]) || ARRAY['panel']))
             END,
             role = CASE WHEN role IN ('guest') THEN 'panel' ELSE role END,
             role_label = CASE WHEN role IN ('guest') THEN 'Panelist' ELSE role_label END
       WHERE id = pid;
    END IF;
  END IF;
  RETURN (SELECT row_to_json(s) FROM (
    SELECT ps.seat, ps.panel_letter, ps.display_name, p.email
      FROM public.panel_seats ps LEFT JOIN public.profiles p ON p.id = ps.profile_id
     WHERE ps.seat = p_seat) s);
END;
$$;
GRANT EXECUTE ON FUNCTION public.assign_panel_seat(INT, TEXT, TEXT) TO authenticated;

-- the seats with the linked email, for the admin's roster card
CREATE OR REPLACE FUNCTION public.panel_roster()
RETURNS TABLE (seat INT, panel_letter TEXT, display_name TEXT, email TEXT, is_me BOOLEAN)
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT ps.seat, ps.panel_letter, ps.display_name,
         CASE WHEN public.has_role('admin') THEN p.email ELSE NULL END,
         ps.profile_id = auth.uid()
    FROM public.panel_seats ps LEFT JOIN public.profiles p ON p.id = ps.profile_id
   ORDER BY ps.seat;
$$;
GRANT EXECUTE ON FUNCTION public.panel_roster() TO authenticated;

-- ── 3. score sheets belong to a seat ─────────────────────────────────
ALTER TABLE public.panel_sheets ADD COLUMN IF NOT EXISTS seat INT REFERENCES public.panel_seats(seat);

-- sheets written before seats existed: match them to seat 1–9 by panel
-- and the old sample panelist order (first name on the panel = first seat)
UPDATE public.panel_sheets SET seat = CASE panel_letter WHEN 'A' THEN 1 WHEN 'B' THEN 4 ELSE 7 END
 WHERE seat IS NULL;

ALTER TABLE public.panel_sheets ALTER COLUMN seat SET NOT NULL;
ALTER TABLE public.panel_sheets DROP CONSTRAINT IF EXISTS panel_sheets_session_code_panel_letter_panelist_team_id_key;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'panel_sheets_session_seat_team_key') THEN
    ALTER TABLE public.panel_sheets ADD CONSTRAINT panel_sheets_session_seat_team_key UNIQUE (session_code, seat, team_id);
  END IF;
END $$;
ALTER TABLE public.panel_sheets ALTER COLUMN panelist SET DEFAULT '';

-- ── 4. who may read and write which sheet ────────────────────────────
DROP POLICY IF EXISTS panel_sheets_select ON public.panel_sheets;
CREATE POLICY panel_sheets_select ON public.panel_sheets FOR SELECT TO authenticated
  USING (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()));
DROP POLICY IF EXISTS panel_sheets_insert ON public.panel_sheets;
CREATE POLICY panel_sheets_insert ON public.panel_sheets FOR INSERT TO authenticated
  WITH CHECK (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()));
DROP POLICY IF EXISTS panel_sheets_update ON public.panel_sheets;
CREATE POLICY panel_sheets_update ON public.panel_sheets FOR UPDATE TO authenticated
  USING (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()))
  WITH CHECK (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()));
DROP POLICY IF EXISTS panel_sheets_delete ON public.panel_sheets;
CREATE POLICY panel_sheets_delete ON public.panel_sheets FOR DELETE TO authenticated
  USING (public.has_role('admin') OR seat IN (SELECT public.my_panel_seats()));

-- ── 5. team outputs: a second role counts too ─────────────────────────
-- (a mentor given the panel seat keeps "mentor" as the main role)
DROP POLICY IF EXISTS submissions_select ON public.submissions;
CREATE POLICY submissions_select ON public.submissions FOR SELECT TO authenticated USING (
  team_id = get_user_team_id()
  OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
);
DROP POLICY IF EXISTS submissions_files_select ON storage.objects;
CREATE POLICY submissions_files_select ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'submissions' AND (
    (storage.foldername(name))[1] = get_user_team_id()
    OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
  )
);
