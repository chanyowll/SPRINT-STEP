-- =====================================================================
-- STEP Hub — STEP 2.5 mentor assignments (final list)
-- Applied to the live project as migration "mentor_assignments_step25".
--
-- role_invites: the role, name and team each invited email gets. The
-- moment an account with one of these emails is created (Supabase
-- Dashboard → Authentication → Add user, or sign-up on the site), the
-- handle_new_user() trigger writes it onto the profile — no manual step.
-- A mentor can only file reports for their own team (profiles.team_id).
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.role_invites (
  email       TEXT PRIMARY KEY,
  role        TEXT NOT NULL,
  role_label  TEXT NOT NULL DEFAULT '',
  full_name   TEXT NOT NULL DEFAULT '',
  initials    TEXT NOT NULL DEFAULT '',
  team_id     TEXT,
  institution TEXT NOT NULL DEFAULT 'AIPO',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.role_invites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS role_invites_admin ON public.role_invites;
CREATE POLICY role_invites_admin ON public.role_invites FOR ALL TO authenticated
  USING (public.has_role('admin')) WITH CHECK (public.has_role('admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE inv public.role_invites%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.role_invites WHERE lower(email) = lower(NEW.email);
  INSERT INTO public.profiles (id, email, full_name, role, role_label, initials, team_id, institution)
  VALUES (NEW.id, NEW.email,
          COALESCE(NULLIF(inv.full_name, ''), NEW.raw_user_meta_data->>'full_name', ''),
          COALESCE(inv.role, 'participant'),
          COALESCE(NULLIF(inv.role_label, ''), 'Participant'),
          NULLIF(inv.initials, ''), inv.team_id, NULLIF(inv.institution, ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id) VALUES
 ('pfernandez@ateneo.edu',  'mentor', 'Mentor (POSTE)',            'Dr. Jon Fernandez',         'JF', 'g1'),
 ('jlagdameo@ateneo.edu',   'mentor', 'Mentor (SINAG)',            'Dr. John Lagdameo',         'JL', 'g2'),
 ('bgarcia@ateneo.edu',     'mentor', 'Mentor (BRICKS)',           'Mr. Bienvenido Garcia',     'BG', 'g3'),
 ('mctan@ateneo.edu',       'mentor', 'Mentor (Halal Blockchain)', 'Mr. Michael Tan',           'MT', 'g4'),
 ('amiclat@ateneo.edu',     'mentor', 'Mentor (Zeoskin)',          'Mr. Armando Miclat',        'AM', 'g5'),
 ('gquitoriano@ateneo.edu', 'mentor', 'Mentor (CAPPS)',            'Mr. George Quitoriano',     'GQ', 'g6'),
 ('bmirasol@ateneo.edu',    'mentor', 'Mentor (SPArC)',            'Engr. Benjamin N. Mirasol', 'BM', 'g7'),
 ('jchiong@ateneo.edu',     'mentor', 'Mentor (meSHM)',            'Ms. Janine Chiong',         'JC', 'g8'),
 ('mcbdeguzman@ateneo.edu', 'mentor', 'Mentor (SFRSCC)',           'Ms. Bunnie De Guzman',      'BD', 'g9'),
 ('aferia@ateneo.edu',      'mentor', 'Mentor (LASER)',            'Mr. Tony Feria',            'TF', 'g10')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, role_label = EXCLUDED.role_label,
  full_name = EXCLUDED.full_name, initials = EXCLUDED.initials, team_id = EXCLUDED.team_id;

UPDATE public.profiles p SET role = i.role, role_label = i.role_label, full_name = i.full_name,
  initials = i.initials, team_id = i.team_id
FROM public.role_invites i WHERE lower(p.email) = lower(i.email);

UPDATE public.teams t SET mentor_name = i.full_name
FROM public.role_invites i WHERE i.role = 'mentor' AND i.team_id = t.id;

CREATE OR REPLACE FUNCTION public.my_team_id() RETURNS TEXT
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS
$$ SELECT team_id FROM public.profiles WHERE id = auth.uid() $$;
GRANT EXECUTE ON FUNCTION public.my_team_id() TO authenticated;

DROP POLICY IF EXISTS mentor_reports_insert ON public.mentor_reports;
CREATE POLICY mentor_reports_insert ON public.mentor_reports FOR INSERT TO authenticated
  WITH CHECK (public.has_role('admin')
    OR (public.has_role('mentor') AND mentor_id = auth.uid()
        AND (public.my_team_id() IS NULL OR team_id = public.my_team_id())));
DROP POLICY IF EXISTS mentor_reports_update ON public.mentor_reports;
CREATE POLICY mentor_reports_update ON public.mentor_reports FOR UPDATE TO authenticated
  USING (public.has_role('admin')
    OR (public.has_role('mentor') AND (mentor_id = auth.uid() OR mentor_id IS NULL)
        AND (public.my_team_id() IS NULL OR team_id = public.my_team_id())))
  WITH CHECK (public.has_role('admin')
    OR (public.has_role('mentor') AND mentor_id = auth.uid()
        AND (public.my_team_id() IS NULL OR team_id = public.my_team_id())));
