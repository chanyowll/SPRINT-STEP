-- STEP Hub — pictures on FASTRAC proposal items (Capstone)
-- Run in the Supabase SQL Editor. Safe to run again.
--
-- Pictures are stored in the private "capstone" bucket under
--   <team id>/item-<item number>/<file>
-- The same people who read a team's proposal can see its pictures; only the
-- team's own participants (and admins) can add or remove them.
-- These rules cover only the item-<n> folders, so the pitch-deck files in the
-- same bucket keep whatever rules they already have.

INSERT INTO storage.buckets (id, name, public) VALUES ('capstone', 'capstone', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS capstone_pictures_read   ON storage.objects;
DROP POLICY IF EXISTS capstone_pictures_add    ON storage.objects;
DROP POLICY IF EXISTS capstone_pictures_remove ON storage.objects;

CREATE POLICY capstone_pictures_read ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'capstone' AND (storage.foldername(name))[2] LIKE 'item-%' AND (
    (storage.foldername(name))[1] = public.get_user_team_id()
    OR public.has_role('admin') OR public.has_role('mentor') OR public.has_role('panel') OR public.has_role('trainer')
    OR (public.has_role('facilitator') AND (storage.foldername(name))[1] = ANY (public.my_teams()))
  )
);
CREATE POLICY capstone_pictures_add ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'capstone' AND (storage.foldername(name))[2] LIKE 'item-%' AND (
    public.has_role('admin')
    OR (public.get_user_role() = 'participant' AND (storage.foldername(name))[1] = public.get_user_team_id())
  )
);
CREATE POLICY capstone_pictures_remove ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'capstone' AND (storage.foldername(name))[2] LIKE 'item-%' AND (
    public.has_role('admin')
    OR (public.get_user_role() = 'participant' AND (storage.foldername(name))[1] = public.get_user_team_id())
  )
);

-- check: the three rules are in place
SELECT policyname, cmd FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE 'capstone_pictures_%'
ORDER BY policyname;
