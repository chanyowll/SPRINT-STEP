-- STEP Hub — new panelist: Mr. Lorenzo Tiongson (lltiongson@ateneo.edu)
-- Run once in the Supabase SQL Editor. Safe to run again.
--
-- 1. lets him create his STEP Hub account with this email (invite-only sign-up)
--    and gives that account the Panel page
-- 2. gives him a panel seat tied to his email, so the console's Panel groups
--    recognise him by name and his score sheet opens for him once he signs in
-- The seat starts with no panel ('') — he joins a panel only when you place him
-- in the Panel groups (tech console) and press Save panels.

-- ── 1. the invite, and the account if it already exists ──────────────
INSERT INTO public.role_invites (email, role, roles, role_label, full_name, initials, team_id, institution)
VALUES ('lltiongson@ateneo.edu', 'panel', ARRAY['panel'], 'Panelist', 'Mr. Lorenzo Tiongson', 'LT', NULL, 'Ateneo de Manila University')
ON CONFLICT (email) DO UPDATE
  SET role = EXCLUDED.role,
      roles = ARRAY(SELECT DISTINCT unnest(COALESCE(public.role_invites.roles, ARRAY[public.role_invites.role]) || ARRAY['panel'])),
      role_label = CASE WHEN public.role_invites.role = 'panel' THEN EXCLUDED.role_label ELSE public.role_invites.role_label END,
      full_name = EXCLUDED.full_name, initials = EXCLUDED.initials;

UPDATE public.profiles
   SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(roles, ARRAY[role]) || ARRAY['panel'])),
       role  = CASE WHEN role = 'guest' THEN 'panel' ELSE role END
 WHERE lower(email) = 'lltiongson@ateneo.edu';

-- ── 2. his seat: the one already tied to his email, else the next free number ──
DO $$
DECLARE s INT;
BEGIN
  SELECT seat INTO s FROM public.panel_seats WHERE lower(email) = 'lltiongson@ateneo.edu' LIMIT 1;
  IF s IS NULL THEN
    SELECT COALESCE(MAX(seat), 0) + 1 INTO s FROM public.panel_seats;
    INSERT INTO public.panel_seats (seat, panel_letter, display_name, email, profile_id)
    VALUES (s, '', 'Mr. Lorenzo Tiongson', 'lltiongson@ateneo.edu',
            (SELECT id FROM public.profiles WHERE lower(email) = 'lltiongson@ateneo.edu'));
  ELSE
    UPDATE public.panel_seats
       SET display_name = 'Mr. Lorenzo Tiongson',
           profile_id = (SELECT id FROM public.profiles WHERE lower(email) = 'lltiongson@ateneo.edu'),
           updated_at = now()
     WHERE seat = s;
  END IF;
END $$;

-- ── check: the invite, and his seat ──────────────────────────────────
SELECT 'invite' AS what, i.email, i.role, i.roles::text AS roles, i.full_name, NULL::int AS seat, NULL AS panel
  FROM public.role_invites i WHERE lower(i.email) = 'lltiongson@ateneo.edu'
UNION ALL
SELECT 'seat', s.email, NULL, NULL, s.display_name, s.seat, NULLIF(s.panel_letter, '')
  FROM public.panel_seats s WHERE lower(s.email) = 'lltiongson@ateneo.edu';
