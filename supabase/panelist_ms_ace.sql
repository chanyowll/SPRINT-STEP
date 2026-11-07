-- STEP Hub — panelist: Ms. Ace (ace@blogapalooza.ph), Panel C
-- Run once in the Supabase SQL Editor. Safe to run again.
--
-- 1. lets her create her STEP Hub account with this email (invite-only sign-up)
--    and gives that account the Panel page
-- 2. links the "Ms. Ace" seat on Panel C to her email, so her score sheet opens
--    for her once she signs in (the panel and teams stay as saved)

INSERT INTO public.role_invites (email, role, roles, role_label, full_name, initials, team_id, institution)
VALUES ('ace@blogapalooza.ph', 'panel', ARRAY['panel'], 'Panelist', 'Ms. Ace', 'A', NULL, '')
ON CONFLICT (email) DO UPDATE
  SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(public.role_invites.roles, ARRAY[public.role_invites.role]) || ARRAY['panel'])),
      role_label = CASE WHEN public.role_invites.role = 'panel' THEN EXCLUDED.role_label ELSE public.role_invites.role_label END,
      full_name = EXCLUDED.full_name, initials = EXCLUDED.initials;

UPDATE public.profiles
   SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(roles, ARRAY[role]) || ARRAY['panel'])),
       role  = CASE WHEN role = 'guest' THEN 'panel' ELSE role END
 WHERE lower(email) = 'ace@blogapalooza.ph';

UPDATE public.panel_seats
   SET email = 'ace@blogapalooza.ph',
       profile_id = (SELECT id FROM public.profiles WHERE lower(email) = 'ace@blogapalooza.ph'),
       updated_at = now()
 WHERE display_name = 'Ms. Ace';

-- check: her invite and her seat
SELECT 'invite' AS what, i.email, i.roles::text AS roles, NULL::int AS seat, NULL AS panel
  FROM public.role_invites i WHERE lower(i.email) = 'ace@blogapalooza.ph'
UNION ALL
SELECT 'seat', s.email, NULL, s.seat, NULLIF(s.panel_letter, '')
  FROM public.panel_seats s WHERE lower(s.email) = 'ace@blogapalooza.ph';
