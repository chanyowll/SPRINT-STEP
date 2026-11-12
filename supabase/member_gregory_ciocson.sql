-- =====================================================================
-- STEP Hub — Gregory Ciocson, LASER (g10) participant
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- =====================================================================

-- on the LASER roster (attendance, My Team's Work)
INSERT INTO public.team_members (team_id, name, role, initials, sort_order)
SELECT 'g10', 'Gregory Ciocson', 'Member', 'GC',
       1 + COALESCE((SELECT max(sort_order) FROM public.team_members WHERE team_id = 'g10'), 0)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members
                  WHERE team_id = 'g10' AND lower(name) = lower('Gregory Ciocson'));

-- sign-up access, on his team
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, institution)
SELECT 'gciocson.pnri@gmail.com', 'participant', 'Participant (' || t.short || ')',
       'Gregory Ciocson', 'GC', 'g10', t.institution
FROM public.teams t WHERE t.id = 'g10'
ON CONFLICT (email) DO UPDATE
  SET role = 'participant', role_label = EXCLUDED.role_label, full_name = EXCLUDED.full_name,
      initials = EXCLUDED.initials, team_id = 'g10', institution = EXCLUDED.institution;

-- if he has already signed up, put the account on LASER now
UPDATE public.profiles p
   SET role = 'participant', role_label = i.role_label, team_id = 'g10',
       full_name = i.full_name, initials = i.initials, institution = i.institution
  FROM public.role_invites i
 WHERE lower(i.email) = 'gciocson.pnri@gmail.com' AND lower(p.email) = lower(i.email);

-- check
SELECT 'roster' AS what, name AS who, team_id FROM public.team_members WHERE team_id = 'g10' AND lower(name) = lower('Gregory Ciocson')
UNION ALL
SELECT 'invite', email, team_id FROM public.role_invites WHERE lower(email) = 'gciocson.pnri@gmail.com'
UNION ALL
SELECT 'account', email, team_id FROM public.profiles WHERE lower(email) = 'gciocson.pnri@gmail.com';
