-- =====================================================================
-- STEP Hub — team names as the teams write them, the 25 registered
-- participants on their rosters, and their emails for team access.
-- Run in the Supabase SQL Editor. Safe to run more than once.
--
-- 1. Team names: POSTE -> POSTe, BRICKS -> Bricks, Halal Blockchain -> HATTS
-- 2. team_members: the participants from the travel & logistics form.
--    Nobody already on a roster is duplicated; the console's "+ Add
--    member" keeps working and can add or remove anyone afterwards.
-- 3. role_invites: each participant's email gives them access to their own
--    team when they sign in (invite-only sign-up). Accounts that already
--    exist are moved onto their team too. An email that already belongs to
--    a mentor, trainer, panelist, facilitator or admin is left as it is.
-- =====================================================================

-- 1. team names -------------------------------------------------------
UPDATE public.teams SET name = 'POSTe (USC)',   short = 'POSTe'   WHERE id = 'g1';
UPDATE public.teams SET name = 'Bricks (USC)',  short = 'Bricks'  WHERE id = 'g3';
UPDATE public.teams SET name = 'HATTS (USEP)',  short = 'HATTS'   WHERE id = 'g4';

-- the team name inside role labels such as "Mentor (POSTE)"
UPDATE public.role_invites SET role_label = replace(replace(replace(role_label, 'POSTE', 'POSTe'), 'BRICKS', 'Bricks'), 'Halal Blockchain', 'HATTS')
  WHERE role_label ~ 'POSTE|BRICKS|Halal Blockchain';
UPDATE public.profiles SET role_label = replace(replace(replace(role_label, 'POSTE', 'POSTe'), 'BRICKS', 'Bricks'), 'Halal Blockchain', 'HATTS')
  WHERE role_label ~ 'POSTE|BRICKS|Halal Blockchain';

-- 2. rosters ----------------------------------------------------------
INSERT INTO public.team_members (team_id, name, role, initials, sort_order)
SELECT v.team_id, v.name, v.role, v.initials,
       v.n + COALESCE((SELECT max(m.sort_order) FROM public.team_members m WHERE m.team_id = v.team_id), 0)
FROM (VALUES
  ('g1', 'Renante Violanda', 'Project Leader', 'RV', 1),
  ('g1', 'Roland Emerito Otadoy', 'Entrepreneurial Lead', 'RO', 2),
  ('g10', 'Kurt Louis Solis', 'Project Leader', 'KS', 1),
  ('g10', 'Jose Claro Monje', 'Entrepreneurial Lead', 'JM', 2),
  ('g2', 'Jessa Mae Amporias', 'Entrepreneurial Lead', 'JA', 1),
  ('g2', 'Jonnah Mae Casalan', 'Tech Transfer Officer', 'JC', 2),
  ('g2', 'Marilyn Calub', 'Member', 'MC', 3),
  ('g3', 'Michael Loretero', 'Member', 'ML', 1),
  ('g3', 'Rab Azel Barredo', 'Member', 'RB', 2),
  ('g3', 'Virgilio Abellana', 'Member', 'VA', 3),
  ('g4', 'Von Patrick Denorte', 'Entrepreneurial Lead', 'VD', 1),
  ('g4', 'Filmann Simpao', 'Tech Transfer Officer', 'FS', 2),
  ('g4', 'Eugene Bije', 'Member', 'EB', 3),
  ('g5', 'Alvin Tejada', 'Member', 'AT', 1),
  ('g5', 'Maria Corazon Ocampo', 'Member', 'MO', 2),
  ('g5', 'Melissa May Boado', 'Member', 'MB', 3),
  ('g6', 'Ivyleen Arugay', 'Member', 'IA', 1),
  ('g6', 'Liberty Lumasag', 'Member', 'LL', 2),
  ('g6', 'Raymond Virtudazo', 'Member', 'RV', 3),
  ('g6', 'Shiny Rose Narit', 'Member', 'SN', 4),
  ('g6', 'Vannie Joy Resabal', 'Member', 'VR', 5),
  ('g7', 'Alexander Mosqueda', 'Project Leader', 'AM', 1),
  ('g7', 'Irish Mae Hambre', 'Entrepreneurial Lead', 'IH', 2),
  ('g7', 'Mariane Fe Abesamis', 'Member', 'MA', 3),
  ('g8', 'Marnel Peradilla', 'Project Leader', 'MP', 1)
) AS v(team_id, name, role, initials, n)
WHERE NOT EXISTS (SELECT 1 FROM public.team_members m
                  WHERE m.team_id = v.team_id AND lower(m.name) = lower(v.name));

-- 3. email access -----------------------------------------------------
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, institution)
SELECT lower(v.email), 'participant', 'Participant (' || t.short || ')', v.full_name, v.initials, v.team_id, t.institution
FROM (VALUES
  ('renante.violanda@usc.edu.ph', 'Renante Violanda', 'RV', 'g1'),
  ('roland.otadoy@usc.edu.ph', 'Roland Emerito Otadoy', 'RO', 'g1'),
  ('klbsolis@pnri.dost.gov.ph', 'Kurt Louis Solis', 'KS', 'g10'),
  ('jcmonje@ateneo.edu', 'Jose Claro Monje', 'JM', 'g10'),
  ('jmcamporias24@gmail.com', 'Jessa Mae Amporias', 'JA', 'g2'),
  ('casalanjm11@gmail.com', 'Jonnah Mae Casalan', 'JC', 'g2'),
  ('mspainagan@usm.edu.ph', 'Marilyn Calub', 'MC', 'g2'),
  ('michael.loretero@usc.edu.ph', 'Michael Loretero', 'ML', 'g3'),
  ('rabazel.barredo@usc.edu.ph', 'Rab Azel Barredo', 'RB', 'g3'),
  ('virgilio.abellana@usc.edu.ph', 'Virgilio Abellana', 'VA', 'g3'),
  ('vpdenorte@gmail.com', 'Von Patrick Denorte', 'VD', 'g4'),
  ('filmann.simpao@usep.edu.ph', 'Filmann Simpao', 'FS', 'g4'),
  ('em.bije@usep.edu.ph', 'Eugene Bije', 'EB', 'g4'),
  ('alvin.tejada@gmail.com', 'Alvin Tejada', 'AT', 'g5'),
  ('mcdocampo@slu.edu.ph', 'Maria Corazon Ocampo', 'MO', 'g5'),
  ('mmboado@slu.edu.ph', 'Melissa May Boado', 'MB', 'g5'),
  ('ivyleen.arugay@g.msuiit.edu.ph', 'Ivyleen Arugay', 'IA', 'g6'),
  ('liberty.lumasag@g.msuiit.edu.ph', 'Liberty Lumasag', 'LL', 'g6'),
  ('raymondrivera.virtudazo@g.msuiit.edu.ph', 'Raymond Virtudazo', 'RV', 'g6'),
  ('shinyrose.salem@g.msuiit.edu.ph', 'Shiny Rose Narit', 'SN', 'g6'),
  ('vanniejoy.resabal@g.msuiit.edu.ph', 'Vannie Joy Resabal', 'VR', 'g6'),
  ('alexander.mosqueda@g.msuiit.edu.ph', 'Alexander Mosqueda', 'AM', 'g7'),
  ('irishmae.hambre@g.msuiit.edu.ph', 'Irish Mae Hambre', 'IH', 'g7'),
  ('marianefe.abesamis@g.msuiit.edu.ph', 'Mariane Fe Abesamis', 'MA', 'g7'),
  ('marnel.peradilla@dlsu.edu.ph', 'Marnel Peradilla', 'MP', 'g8'),
  ('kbsolis08@gmail.com', 'Kurt Louis Solis', 'KS', 'g10')
) AS v(email, full_name, initials, team_id)
JOIN public.teams t ON t.id = v.team_id
ON CONFLICT (email) DO UPDATE
  SET role_label = EXCLUDED.role_label, full_name = EXCLUDED.full_name, initials = EXCLUDED.initials,
      team_id = EXCLUDED.team_id, institution = EXCLUDED.institution
  WHERE public.role_invites.role = 'participant';

-- accounts that already exist: put them on their team
UPDATE public.profiles p
SET role_label = i.role_label, full_name = i.full_name, initials = i.initials,
    team_id = i.team_id, institution = i.institution
FROM public.role_invites i
WHERE lower(p.email) = lower(i.email) AND p.role = 'participant' AND i.role = 'participant'
  AND i.team_id IS NOT NULL;

-- check: people per team, and how many emails can sign in
SELECT t.id, t.short, count(m.id) AS members
FROM public.teams t LEFT JOIN public.team_members m ON m.team_id = t.id
GROUP BY t.id, t.short ORDER BY t.id;

SELECT count(*) AS participant_invites FROM public.role_invites WHERE role = 'participant' AND team_id IS NOT NULL;
