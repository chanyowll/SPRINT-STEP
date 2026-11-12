-- =====================================================================
-- STEP Hub — John Lloyd Tamse, SINAG (g2) participant
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- =====================================================================

-- on the SINAG roster (attendance, My Team's Work)
INSERT INTO public.team_members (team_id, name, role, initials, sort_order)
SELECT 'g2', 'John Lloyd Tamse', 'Member', 'JT',
       1 + COALESCE((SELECT max(sort_order) FROM public.team_members WHERE team_id = 'g2'), 0)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members
                  WHERE team_id = 'g2' AND lower(name) = lower('John Lloyd Tamse'));

-- sign-up access, on his team
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, institution)
SELECT 'jltamse@usm.edu.ph', 'participant', 'Participant (' || t.short || ')',
       'John Lloyd Tamse', 'JT', 'g2', t.institution
FROM public.teams t WHERE t.id = 'g2'
ON CONFLICT (email) DO UPDATE
  SET role = 'participant', role_label = EXCLUDED.role_label, full_name = EXCLUDED.full_name,
      initials = EXCLUDED.initials, team_id = 'g2', institution = EXCLUDED.institution;

-- if he has already signed up, put the account on SINAG now
UPDATE public.profiles p
   SET role = 'participant', role_label = i.role_label, team_id = 'g2',
       full_name = i.full_name, initials = i.initials, institution = i.institution
  FROM public.role_invites i
 WHERE lower(i.email) = 'jltamse@usm.edu.ph' AND lower(p.email) = lower(i.email);

-- check
SELECT 'roster' AS what, name AS who, team_id FROM public.team_members WHERE team_id = 'g2' AND lower(name) = lower('John Lloyd Tamse')
UNION ALL
SELECT 'invite', email, team_id FROM public.role_invites WHERE lower(email) = 'jltamse@usm.edu.ph'
UNION ALL
SELECT 'account', email, team_id FROM public.profiles WHERE lower(email) = 'jltamse@usm.edu.ph';
