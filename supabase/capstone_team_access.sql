-- STEP Hub — one FASTRAC proposal per team (Capstone)
-- Run in the Supabase SQL Editor. Safe to run again.
--
-- Everyone on a team reads and edits the same proposal; their mentor, panel,
-- trainers, the team's facilitator and the STEP team can read it; only the
-- team's own participants (and admins) can change it. The pitch deck already
-- comes from the team's weekly slides on My Team's Work, which follow the
-- same team rule.

ALTER TABLE public.capstone_items ENABLE ROW LEVEL SECURITY;

-- replace whatever rules the table had with the four below
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'capstone_items' LOOP
    EXECUTE format('DROP POLICY %I ON public.capstone_items', p.policyname);
  END LOOP;
END $$;

CREATE POLICY capstone_items_select ON public.capstone_items FOR SELECT TO authenticated USING (
  team_id = public.get_user_team_id()
  OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
  OR (public.has_role('facilitator') AND team_id = ANY (public.my_teams()))
);
CREATE POLICY capstone_items_insert ON public.capstone_items FOR INSERT TO authenticated WITH CHECK (
  public.has_role('admin')
  OR (public.get_user_role() = 'participant' AND team_id = public.get_user_team_id())
);
CREATE POLICY capstone_items_update ON public.capstone_items FOR UPDATE TO authenticated
  USING (public.has_role('admin')
         OR (public.get_user_role() = 'participant' AND team_id = public.get_user_team_id()))
  WITH CHECK (public.has_role('admin')
         OR (public.get_user_role() = 'participant' AND team_id = public.get_user_team_id()));
CREATE POLICY capstone_items_delete ON public.capstone_items FOR DELETE TO authenticated
  USING (public.has_role('admin'));

-- check: every participant and the team they share a proposal with
-- (a blank team_id means that person sees no proposal until they are put on a team)
SELECT email, full_name, team_id FROM public.profiles
WHERE role = 'participant' ORDER BY team_id NULLS FIRST, email;
