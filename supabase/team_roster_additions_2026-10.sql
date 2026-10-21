-- =====================================================================
-- STEP Hub: members from the Master Tracker (Research Groups) who were
-- not on the website yet. Run once in the Supabase SQL Editor. Safe to re-run.
--   CAPPS (g6): Stephen Fajardo, Leaniel Silva
--   SPArC (g7): Alec Paolo Dy Pico
--   meSHM (g8): Lessandro Estelito Garciano, Frances Danielle Solis (no email yet)
-- 1. adds them to their team rosters (console attendance, My Team's Work)
-- 2. lets the three with emails create their own account, on their team
-- =====================================================================

INSERT INTO public.team_members (team_id, name, role, initials, sort_order)
SELECT v.team_id, v.name, 'Member', v.initials,
       v.n + COALESCE((SELECT max(m.sort_order) FROM public.team_members m WHERE m.team_id = v.team_id), 0)
FROM (VALUES
  ('g6', 'Stephen Fajardo', 'SF', 1),
  ('g6', 'Leaniel Silva', 'LS', 2),
  ('g7', 'Alec Paolo Dy Pico', 'AP', 1),
  ('g8', 'Lessandro Estelito Garciano', 'LG', 1),
  ('g8', 'Frances Danielle Solis', 'FS', 2)
) AS v(team_id, name, initials, n)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members m
                  WHERE m.team_id = v.team_id AND lower(m.name) = lower(v.name));

INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, institution)
SELECT lower(v.email), 'participant', 'Participant (' || t.short || ')', v.full_name, v.initials, v.team_id, t.institution
FROM (VALUES
  ('stephen.fajardo@g.msuiit.edu.ph', 'Stephen Fajardo', 'SF', 'g6'),
  ('leaniel.silva@g.msuiit.edu.ph', 'Leaniel Silva', 'LS', 'g6'),
  ('alecpaolo.dypico@g.msuiit.edu.ph', 'Alec Paolo Dy Pico', 'AP', 'g7')
) AS v(email, full_name, initials, team_id)
JOIN public.teams t ON t.id = v.team_id
ON CONFLICT (email) DO UPDATE
  SET role_label = EXCLUDED.role_label, full_name = EXCLUDED.full_name, initials = EXCLUDED.initials,
      team_id = EXCLUDED.team_id, institution = EXCLUDED.institution
  WHERE public.role_invites.role = 'participant';

-- check
SELECT t.short, m.name FROM public.team_members m JOIN public.teams t ON t.id = m.team_id
WHERE m.team_id IN ('g6','g7','g8') ORDER BY t.short, m.sort_order;
SELECT email, full_name, team_id FROM public.role_invites
WHERE email IN ('stephen.fajardo@g.msuiit.edu.ph','leaniel.silva@g.msuiit.edu.ph','alecpaolo.dypico@g.msuiit.edu.ph');
