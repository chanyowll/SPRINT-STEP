-- =====================================================================
-- STEP Hub — Facilitator role + new admins (applied live as
-- "facilitator_role_and_new_admins"; Josh Guico's admin invite was added
-- the same way just before).
--   Facilitators work alongside their assigned teams (profiles.teams) —
--   they can see those teams' work and submissions, but are not team
--   members and do not appear in the team's composition.
-- =====================================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role = ANY (ARRAY['admin','participant','mentor','panel','trainer','facilitator','guest']));

ALTER TABLE public.profiles     ADD COLUMN IF NOT EXISTS teams TEXT[];
ALTER TABLE public.role_invites ADD COLUMN IF NOT EXISTS teams TEXT[];

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE inv public.role_invites%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.role_invites WHERE lower(email) = lower(NEW.email);
  INSERT INTO public.profiles (id, email, full_name, role, role_label, initials, team_id, institution, roles, teams)
  VALUES (NEW.id, NEW.email,
          COALESCE(NULLIF(inv.full_name, ''), NEW.raw_user_meta_data->>'full_name', ''),
          COALESCE(inv.role, 'participant'),
          COALESCE(NULLIF(inv.role_label, ''), 'Participant'),
          NULLIF(inv.initials, ''), inv.team_id, NULLIF(inv.institution, ''), inv.roles, inv.teams)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.my_teams() RETURNS TEXT[]
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS
$$ SELECT COALESCE(teams, ARRAY[]::TEXT[]) FROM public.profiles WHERE id = auth.uid() $$;
GRANT EXECUTE ON FUNCTION public.my_teams() TO authenticated;

DROP POLICY IF EXISTS submissions_select ON public.submissions;
CREATE POLICY submissions_select ON public.submissions FOR SELECT TO authenticated
  USING (team_id = public.get_user_team_id() OR public.has_role('admin') OR public.has_role('mentor')
         OR public.has_role('panel') OR public.has_role('trainer')
         OR (public.has_role('facilitator') AND team_id = ANY (public.my_teams())));
DROP POLICY IF EXISTS "submissions_files_select" ON storage.objects;
CREATE POLICY "submissions_files_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND (
         (storage.foldername(name))[1] = public.get_user_team_id()
         OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel')
         OR public.has_role('trainer')
         OR (public.has_role('facilitator') AND (storage.foldername(name))[1] = ANY (public.my_teams()))));

INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, teams, institution) VALUES
 ('joshguico@gmail.com',            'admin',       'STEP Team / Admin', 'Josh Guico', 'JG', NULL, NULL, 'AIPO'),
 ('mudtojan@ateneo.edu',            'admin',       'STEP Team / Admin', 'May Ann A. Udtojan-Albis', 'MU', NULL, NULL, 'AIPO'),
 ('mapiladas@ateneo.edu',           'admin',       'STEP Team / Admin', '', 'MA', NULL, NULL, 'AIPO'),
 ('angelicabetasa0724@gmail.com',   'facilitator', 'Facilitator (SPArC & SFRSCC)', 'Angelica Betasa', 'AB', NULL, ARRAY['g7','g9'], 'AIPO'),
 ('jayrongillamac@gmail.com',       'facilitator', 'Facilitator (BRICKS & Halal Blockchain)', 'Jayron Gillamac', 'JG', NULL, ARRAY['g3','g4'], 'AIPO')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, role_label = EXCLUDED.role_label,
  full_name = EXCLUDED.full_name, initials = EXCLUDED.initials, teams = EXCLUDED.teams;
