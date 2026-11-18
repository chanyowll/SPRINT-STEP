-- =====================================================================
-- STEP Hub — five new POSTe (g1) participants
--   Xavier Bacalla, Dexter Manalili, Rosana Ferolin, Angie Ceniza, Karen Gatos
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- =====================================================================

-- on the POSTe roster (attendance, My Team's Work)
INSERT INTO public.team_members (team_id, name, role, initials, sort_order)
SELECT 'g1', v.name, 'Member', v.initials,
       v.n + COALESCE((SELECT max(m.sort_order) FROM public.team_members m WHERE m.team_id = 'g1'), 0)
FROM (VALUES
  ('Xavier Bacalla',  'XB', 1),
  ('Dexter Manalili', 'DM', 2),
  ('Rosana Ferolin',  'RF', 3),
  ('Angie Ceniza',    'AC', 4),
  ('Karen Gatos',     'KG', 5)
) AS v(name, initials, n)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members m
                  WHERE m.team_id = 'g1' AND lower(m.name) = lower(v.name));

-- sign-up access (participant), on their team
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, institution)
SELECT lower(v.email), 'participant', 'Participant (' || t.short || ')', v.full_name, v.initials, 'g1', t.institution
FROM (VALUES
  ('xavier.bacalla@usc.edu.ph',  'Xavier Bacalla',  'XB'),
  ('dexter.manalili@usc.edu.ph', 'Dexter Manalili', 'DM'),
  ('rosana.ferolin@usc.edu.ph',  'Rosana Ferolin',  'RF'),
  ('angie.ceniza@usc.edu.ph',    'Angie Ceniza',    'AC'),
  ('gatus.karen@gmail.com',      'Karen Gatos',     'KG')
) AS v(email, full_name, initials)
JOIN public.teams t ON t.id = 'g1'
ON CONFLICT (email) DO UPDATE
  SET role = 'participant', role_label = EXCLUDED.role_label, full_name = EXCLUDED.full_name,
      initials = EXCLUDED.initials, team_id = 'g1', institution = EXCLUDED.institution;

-- anyone who has already signed up goes onto POSTe now
UPDATE public.profiles p
   SET role = 'participant', role_label = i.role_label, team_id = 'g1',
       full_name = i.full_name, initials = i.initials, institution = i.institution
  FROM public.role_invites i
 WHERE lower(p.email) = lower(i.email)
   AND lower(i.email) IN ('xavier.bacalla@usc.edu.ph', 'dexter.manalili@usc.edu.ph', 'rosana.ferolin@usc.edu.ph',
                          'angie.ceniza@usc.edu.ph', 'gatus.karen@gmail.com');

-- check: five rows on the roster, five invites
SELECT 'roster' AS what, name AS who, team_id FROM public.team_members
 WHERE team_id = 'g1' AND name IN ('Xavier Bacalla', 'Dexter Manalili', 'Rosana Ferolin', 'Angie Ceniza', 'Karen Gatos')
UNION ALL
SELECT 'invite', email, team_id FROM public.role_invites
 WHERE lower(email) IN ('xavier.bacalla@usc.edu.ph', 'dexter.manalili@usc.edu.ph', 'rosana.ferolin@usc.edu.ph',
                        'angie.ceniza@usc.edu.ph', 'gatus.karen@gmail.com')
ORDER BY 1, 2;
