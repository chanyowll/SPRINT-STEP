-- =====================================================================
-- STEP Hub: Directory tab (Tech console)
-- Run once in the Supabase SQL Editor. Safe to run again.
--
-- 1. public.directory_extra  contact numbers and titles typed in the
--                            Directory tab (STEP Team and tech team only)
-- 2. public.directory_list() everyone on the site in one list: every
--                            invited email, plus team members who have
--                            no email yet. STEP Team and tech team only.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.directory_extra (
  ref        text PRIMARY KEY,                 -- lower(email), or 'tm:' || team_members.id when there is no email
  title      text NOT NULL DEFAULT '',         -- Dr., Engr., Sir ... overrides the title found in the name
  phone      text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.directory_extra ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS directory_extra_team ON public.directory_extra;
CREATE POLICY directory_extra_team ON public.directory_extra FOR ALL TO authenticated
  USING (public.is_step_team()) WITH CHECK (public.is_step_team());

-- a name with its title, dots and spaces removed, so "Dr. Jon  Fernandez" matches "Jon Fernandez"
CREATE OR REPLACE FUNCTION public.directory_norm(n text) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT regexp_replace(
           regexp_replace(lower(coalesce(n, '')), '^(dr|doc|engr|engr\.|mr|ms|mrs|prof|atty|sir|ma''am)\.?\s+', ''),
           '[^a-z0-9]', '', 'g')
$$;

CREATE OR REPLACE FUNCTION public.directory_list()
RETURNS TABLE (ref text, name text, email text, role text, roles text[], role_label text,
               team_ids text[], institution text, has_account boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_step_team() THEN RAISE EXCEPTION 'Directory is for the STEP Team only'; END IF;
  RETURN QUERY
  -- everyone with an invite (participants, mentors, panel, trainers, facilitators, admins)
  SELECT lower(i.email), i.full_name, lower(i.email), i.role,
         coalesce(i.roles, ARRAY[i.role]), i.role_label,
         (SELECT coalesce(array_agg(DISTINCT x), '{}') FROM unnest(ARRAY[i.team_id] || coalesce(i.teams, '{}')) x WHERE x IS NOT NULL),
         i.institution,
         EXISTS (SELECT 1 FROM public.profiles p WHERE lower(p.email) = lower(i.email))
  FROM public.role_invites i
  UNION ALL
  -- team members listed on a roster who have no invite under that name (no email on file yet)
  SELECT 'tm:' || m.id::text, m.name, ''::text, 'participant', ARRAY['participant'], 'Participant (' || t.short || ')',
         ARRAY[m.team_id], t.institution, false
  FROM public.team_members m
  JOIN public.teams t ON t.id = m.team_id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.role_invites i
    WHERE (i.team_id = m.team_id OR m.team_id = ANY (coalesce(i.teams, '{}')))
      AND public.directory_norm(i.full_name) = public.directory_norm(m.name));
END $$;
REVOKE ALL ON FUNCTION public.directory_list() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.directory_list() TO authenticated;

-- contact numbers already in the Master Tracker
INSERT INTO public.directory_extra (ref, phone) VALUES
  ('marnel.peradilla@dlsu.edu.ph', '09171047601'),
  ('scclemente@feutech.edu.ph',    '09175893758')
ON CONFLICT (ref) DO UPDATE SET phone = EXCLUDED.phone WHERE public.directory_extra.phone = '';

-- check
SELECT ref, phone FROM public.directory_extra ORDER BY ref;
