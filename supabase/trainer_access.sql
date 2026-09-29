-- =====================================================================
-- STEP Hub — Trainer access for five mentors (applied to the live project
-- as migration "trainer_access_for_mentors")
--   Dr. Jon Fernandez, Mr. Michael Tan, Mr. George Quitoriano,
--   Engr. Benjamin N. Mirasol, Mr. Tony Feria → roles {mentor, trainer}
-- Also: a team's own submission files answer to its participants only —
-- a mentor's team_id names the team they mentor, it does not let them
-- hand in or delete that team's work.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.get_user_team_id()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT team_id FROM public.profiles WHERE id = auth.uid() AND role = 'participant';
$$;

ALTER TABLE public.role_invites ADD COLUMN IF NOT EXISTS roles TEXT[];

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE inv public.role_invites%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.role_invites WHERE lower(email) = lower(NEW.email);
  INSERT INTO public.profiles (id, email, full_name, role, role_label, initials, team_id, institution, roles)
  VALUES (NEW.id, NEW.email,
          COALESCE(NULLIF(inv.full_name, ''), NEW.raw_user_meta_data->>'full_name', ''),
          COALESCE(inv.role, 'participant'),
          COALESCE(NULLIF(inv.role_label, ''), 'Participant'),
          NULLIF(inv.initials, ''), inv.team_id, NULLIF(inv.institution, ''), inv.roles)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

UPDATE public.role_invites SET roles = ARRAY['mentor','trainer'],
  role_label = replace(role_label, 'Mentor (', 'Mentor & Trainer (')
WHERE email IN ('pfernandez@ateneo.edu','mctan@ateneo.edu','gquitoriano@ateneo.edu','bmirasol@ateneo.edu','aferia@ateneo.edu');

UPDATE public.profiles p SET roles = i.roles, role_label = i.role_label
FROM public.role_invites i WHERE lower(p.email) = lower(i.email) AND i.roles IS NOT NULL;

DROP POLICY IF EXISTS session_materials_insert ON public.session_materials;
CREATE POLICY session_materials_insert ON public.session_materials FOR INSERT TO authenticated
  WITH CHECK ((public.has_role('trainer') OR public.has_role('admin'))
              AND (kind <> 'recording' OR public.has_role('admin')));
DROP POLICY IF EXISTS session_materials_update ON public.session_materials;
CREATE POLICY session_materials_update ON public.session_materials FOR UPDATE TO authenticated
  USING (public.has_role('trainer') OR public.has_role('admin'))
  WITH CHECK (public.has_role('trainer') OR public.has_role('admin'));
DROP POLICY IF EXISTS session_materials_delete ON public.session_materials;
CREATE POLICY session_materials_delete ON public.session_materials FOR DELETE TO authenticated
  USING (public.has_role('admin') OR (public.has_role('trainer') AND posted_by = auth.uid()));

DROP POLICY IF EXISTS "materials_files_insert" ON storage.objects;
CREATE POLICY "materials_files_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'materials' AND (public.has_role('trainer') OR public.has_role('admin')));
DROP POLICY IF EXISTS "materials_files_update" ON storage.objects;
CREATE POLICY "materials_files_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'materials' AND (public.has_role('trainer') OR public.has_role('admin')));
DROP POLICY IF EXISTS "materials_files_delete" ON storage.objects;
CREATE POLICY "materials_files_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'materials' AND (public.has_role('trainer') OR public.has_role('admin')));
