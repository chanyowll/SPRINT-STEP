-- =====================================================================
-- STEP Hub — Frances Danielle Solis, meSHM (g8) participant
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- She can then create her account with this email (invite-only sign-up).
-- =====================================================================

-- on the meSHM roster (already added in October; skipped if there)
INSERT INTO public.team_members (team_id, name, role, initials, sort_order)
SELECT 'g8', 'Frances Danielle Solis', 'Member', 'FS',
       1 + COALESCE((SELECT max(sort_order) FROM public.team_members WHERE team_id = 'g8'), 0)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members
                  WHERE team_id = 'g8' AND lower(name) = lower('Frances Danielle Solis'));

-- sign-up access, on her team
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, institution)
SELECT 'frances_danielle_b_solis@dlsu.edu.ph', 'participant', 'Participant (' || t.short || ')',
       'Frances Danielle Solis', 'FS', 'g8', t.institution
FROM public.teams t WHERE t.id = 'g8'
ON CONFLICT (email) DO UPDATE
  SET role = 'participant', role_label = EXCLUDED.role_label, full_name = EXCLUDED.full_name,
      initials = EXCLUDED.initials, team_id = 'g8', institution = EXCLUDED.institution;

-- if she has already signed up, put the account on meSHM now
UPDATE public.profiles p
   SET role = 'participant', role_label = i.role_label, team_id = 'g8',
       full_name = i.full_name, initials = i.initials, institution = i.institution
  FROM public.role_invites i
 WHERE lower(i.email) = 'frances_danielle_b_solis@dlsu.edu.ph' AND lower(p.email) = lower(i.email);

-- check
SELECT 'invite' AS what, email, role, role_label, team_id FROM public.role_invites WHERE lower(email) = 'frances_danielle_b_solis@dlsu.edu.ph'
UNION ALL
SELECT 'account', email, role, role_label, team_id FROM public.profiles WHERE lower(email) = 'frances_danielle_b_solis@dlsu.edu.ph';
