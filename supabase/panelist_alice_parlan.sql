-- STEP Hub — panelist: Ms. Alice Parlan (amparlan@ateneo.edu), Panel A
-- Run once in the Supabase SQL Editor. Safe to run again, before or after
-- panel_groups_final_2026-11.sql.
--
-- 1. lets her create her STEP Hub account with this email (invite-only sign-up)
--    and gives that account the Panel page
-- 2. links the "Ms. Alice" seat on Panel A to her email and full name, so her
--    score sheet opens for her once she signs in

-- ── 1. the invite, and the account if it already exists ──────────────
INSERT INTO public.role_invites (email, role, roles, role_label, full_name, initials, team_id, institution)
VALUES ('amparlan@ateneo.edu', 'panel', ARRAY['panel'], 'Panelist', 'Ms. Alice Parlan', 'AP', NULL, 'Ateneo de Manila University')
ON CONFLICT (email) DO UPDATE
  SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(public.role_invites.roles, ARRAY[public.role_invites.role]) || ARRAY['panel'])),
      role_label = CASE WHEN public.role_invites.role = 'panel' THEN EXCLUDED.role_label ELSE public.role_invites.role_label END,
      full_name = EXCLUDED.full_name, initials = EXCLUDED.initials;

UPDATE public.profiles
   SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(roles, ARRAY[role]) || ARRAY['panel'])),
       role  = CASE WHEN role = 'guest' THEN 'panel' ELSE role END
 WHERE lower(email) = 'amparlan@ateneo.edu';

-- ── 2. her seat: the one with her email, else the "Ms. Alice" placeholder, else a new one ──
DO $$
DECLARE s INT;
BEGIN
  SELECT seat INTO s FROM public.panel_seats
   WHERE lower(email) = 'amparlan@ateneo.edu' OR display_name IN ('Ms. Alice', 'Ms. Alice Parlan')
   ORDER BY (email IS NULL) LIMIT 1;
  IF s IS NULL THEN
    SELECT COALESCE(MAX(seat), 0) + 1 INTO s FROM public.panel_seats;
    INSERT INTO public.panel_seats (seat, panel_letter, display_name) VALUES (s, 'A', 'Ms. Alice Parlan');
  END IF;
  UPDATE public.panel_seats
     SET display_name = 'Ms. Alice Parlan', email = 'amparlan@ateneo.edu',
         profile_id = (SELECT id FROM public.profiles WHERE lower(email) = 'amparlan@ateneo.edu'),
         updated_at = now()
   WHERE seat = s;
END $$;

-- ── check ────────────────────────────────────────────────────────────
SELECT 'invite' AS what, i.email, i.roles::text AS roles, i.full_name, NULL::int AS seat, NULL AS panel
  FROM public.role_invites i WHERE lower(i.email) = 'amparlan@ateneo.edu'
UNION ALL
SELECT 'seat', s.email, NULL, s.display_name, s.seat, NULLIF(s.panel_letter, '')
  FROM public.panel_seats s WHERE lower(s.email) = 'amparlan@ateneo.edu';
