-- STEP Hub: Directory shows who the project leaders are
-- Run once in the Supabase SQL Editor (after member_directory.sql). Safe to run again.
-- Adds each person's team role (Project Leader, Member ...) to the Directory list,
-- so the tab can tint project leaders yellow.

DROP FUNCTION IF EXISTS public.directory_list();

CREATE OR REPLACE FUNCTION public.directory_list()
RETURNS TABLE (ref text, name text, email text, role text, roles text[], role_label text,
               team_ids text[], institution text, has_account boolean, member_role text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_step_team() THEN RAISE EXCEPTION 'Directory is for the STEP Team only'; END IF;
  RETURN QUERY
  SELECT lower(i.email), i.full_name, lower(i.email), i.role,
         coalesce(i.roles, ARRAY[i.role]), i.role_label,
         (SELECT coalesce(array_agg(DISTINCT x), '{}') FROM unnest(ARRAY[i.team_id] || coalesce(i.teams, '{}')) x WHERE x IS NOT NULL),
         i.institution,
         EXISTS (SELECT 1 FROM public.profiles p WHERE lower(p.email) = lower(i.email)),
         (SELECT m.role FROM public.team_members m
           WHERE public.directory_norm(m.name) = public.directory_norm(i.full_name)
             AND (m.team_id = i.team_id OR m.team_id = ANY (coalesce(i.teams, '{}')))
           ORDER BY (m.role ILIKE '%project leader%') DESC LIMIT 1)
  FROM public.role_invites i
  UNION ALL
  SELECT 'tm:' || m.id::text, m.name, ''::text, 'participant', ARRAY['participant'], 'Participant (' || t.short || ')',
         ARRAY[m.team_id], t.institution, false, m.role
  FROM public.team_members m
  JOIN public.teams t ON t.id = m.team_id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.role_invites i
    WHERE (i.team_id = m.team_id OR m.team_id = ANY (coalesce(i.teams, '{}')))
      AND public.directory_norm(i.full_name) = public.directory_norm(m.name));
END $$;
REVOKE ALL ON FUNCTION public.directory_list() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.directory_list() TO authenticated;
NOTIFY pgrst, 'reload schema';
