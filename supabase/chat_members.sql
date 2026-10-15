-- =====================================================================
-- STEP Hub: "Members" in STEP GC — who is in a room
-- Run once in the Supabase SQL Editor (after chat_rooms.sql). Safe to re-run.
--
-- chat_room_members('team:g3') lists the people a room admits, using the
-- same rule as can_use_room (chat_rooms.sql): the team's participants, its
-- facilitator and mentor (set on their accounts), and the STEP team.
-- People who are registered (role_invites) but have not created their
-- account yet are listed too, marked joined = false, so a team can see who
-- is still to come. Only someone who can use the room gets the list.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.chat_room_members(p_room text) RETURNS json
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH people AS (
    SELECT coalesce(nullif(trim(p.full_name), ''), split_part(p.email, '@', 1)) AS full_name, p.initials, p.role, p.role_label, p.roles, p.team_id, p.teams, lower(p.email) AS email, true AS joined
      FROM public.profiles p WHERE coalesce(p.role, '') <> 'guest'
    UNION ALL
    SELECT coalesce(nullif(trim(i.full_name), ''), split_part(i.email, '@', 1)), i.initials, i.role, i.role_label, i.roles, i.team_id, i.teams, lower(i.email), false
      FROM public.role_invites i
     WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE lower(p.email) = lower(i.email))
  ),
  tagged AS (
    SELECT *,
      (role = 'admin' OR email = ANY (ARRAY['cperote@ateneo.edu', 'joshguico@gmail.com'])) AS staff,
      ARRAY[role] || coalesce(roles, ARRAY[]::text[]) AS allroles
    FROM people
  ),
  members AS (
    SELECT * FROM tagged t WHERE
      CASE
        WHEN p_room = 'fam' THEN true
        WHEN t.staff THEN true
        WHEN p_room LIKE 'team:%' THEN (t.team_id = substr(p_room, 6) OR substr(p_room, 6) = ANY (coalesce(t.teams, ARRAY[]::text[])))
        WHEN p_room = 'group:mentors'  THEN 'mentor'  = ANY (t.allroles)
        WHEN p_room = 'group:trainers' THEN 'trainer' = ANY (t.allroles)
        WHEN p_room = 'group:panels'   THEN 'panel'   = ANY (t.allroles)
        WHEN p_room = 'group:dost'     THEN 'dost'    = ANY (t.allroles) OR t.email LIKE '%@pcieerd.dost.gov.ph'
        ELSE false
      END
  )
  SELECT coalesce(json_agg(json_build_object(
           'name', m.full_name, 'initials', m.initials, 'role', m.role, 'role_label', m.role_label,
           'roles', m.roles, 'team_id', m.team_id, 'teams', m.teams, 'staff', m.staff, 'joined', m.joined)
         ORDER BY m.staff DESC,
                  CASE m.role WHEN 'facilitator' THEN 1 WHEN 'mentor' THEN 2 WHEN 'trainer' THEN 3 WHEN 'panel' THEN 4 WHEN 'dost' THEN 5 WHEN 'participant' THEN 6 ELSE 7 END,
                  m.team_id, m.full_name), '[]'::json)
    FROM members m
   WHERE public.can_use_room(p_room);
$$;
GRANT EXECUTE ON FUNCTION public.chat_room_members(text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.chat_room_members(text) FROM anon;
NOTIFY pgrst, 'reload schema';
