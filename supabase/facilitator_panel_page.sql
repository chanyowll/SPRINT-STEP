-- STEP Hub: facilitators open the Panel page, but are not panelists
-- Run once in the Supabase SQL Editor. Safe to run again.
--
-- Angelica Betasa and Jayron Gillamac keep the Panel page (the site now opens it
-- for the Facilitator role itself). This takes the "panel" role off them, so they
-- stop counting as panelists in the Directory, "All panelists" emails and the
-- panel lists. Their label goes back to plain "Facilitator (...)". Read access to
-- team outputs and capstone items stays the same as before, for any facilitator.

UPDATE public.role_invites
   SET roles = CASE WHEN array_remove(COALESCE(roles, ARRAY[role]), 'panel') IN (ARRAY[role], ARRAY[]::text[])
                    THEN NULL ELSE array_remove(roles, 'panel') END,
       role_label = replace(role_label, 'Facilitator & Panelist (', 'Facilitator (')
 WHERE role = 'facilitator';

UPDATE public.profiles
   SET roles = CASE WHEN array_remove(COALESCE(roles, ARRAY[role]), 'panel') IN (ARRAY[role], ARRAY[]::text[])
                    THEN NULL ELSE array_remove(roles, 'panel') END,
       role_label = replace(role_label, 'Facilitator & Panelist (', 'Facilitator (')
 WHERE role = 'facilitator';

-- facilitators read team outputs and capstone items, as they could while holding the panel role
DROP POLICY IF EXISTS submissions_select ON public.submissions;
CREATE POLICY submissions_select ON public.submissions FOR SELECT TO authenticated USING (
  team_id = public.get_user_team_id()
  OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
  OR public.has_role('facilitator')
);
DROP POLICY IF EXISTS submissions_files_select ON storage.objects;
CREATE POLICY submissions_files_select ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'submissions' AND (
    (storage.foldername(name))[1] = public.get_user_team_id()
    OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
    OR public.has_role('facilitator')
  )
);
DROP POLICY IF EXISTS capstone_items_select ON public.capstone_items;
CREATE POLICY capstone_items_select ON public.capstone_items FOR SELECT TO authenticated USING (
  team_id = public.get_user_team_id()
  OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
  OR public.has_role('facilitator')
);
DROP POLICY IF EXISTS capstone_pictures_read ON storage.objects;
CREATE POLICY capstone_pictures_read ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'capstone' AND (storage.foldername(name))[2] LIKE 'item-%' AND (
    (storage.foldername(name))[1] = public.get_user_team_id()
    OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
    OR public.has_role('facilitator')
  )
);

-- check
SELECT email, full_name, role, COALESCE(roles, ARRAY[role])::text AS roles, role_label
  FROM public.profiles WHERE role = 'facilitator';
