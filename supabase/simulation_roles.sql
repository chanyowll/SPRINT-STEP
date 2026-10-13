-- =====================================================================
-- STEP Hub — simulation roles (Week S1 / S2). Run in the SQL Editor.
--   Jayron Gillamac   participant, BRICKS (g3)
--   Angelica Betasa   participant, SFRSCC (g9)
--   Josh Guico        facilitator of BRICKS and SFRSCC (still tech team by email)
--   May Ann Albis     trainer and mentor, not panel
--   Benjie Mirasol    mentor (SPArC), trainer and panel — mentors neither
--                     test team, so he can sit on their panel
-- The roles before the change are saved once in sim_role_backup and
-- sim_invite_backup, so they can be put back after the simulation.
-- =====================================================================

-- 0. save the current roles (only the first time this runs)
CREATE TABLE IF NOT EXISTS public.sim_role_backup AS
  SELECT id, email, role, roles, role_label, team_id, teams, now() AS saved_at
  FROM public.profiles
  WHERE lower(email) IN ('jayrongillamac@gmail.com','angelicabetasa0724@gmail.com','joshguico@gmail.com','mudtojan@ateneo.edu','bmirasol@ateneo.edu');
CREATE TABLE IF NOT EXISTS public.sim_invite_backup AS
  SELECT *, now() AS saved_at FROM public.role_invites
  WHERE lower(email) IN ('jayrongillamac@gmail.com','angelicabetasa0724@gmail.com','joshguico@gmail.com','mudtojan@ateneo.edu','bmirasol@ateneo.edu');
-- private: no policies = nobody reads them through the site
ALTER TABLE public.sim_role_backup   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sim_invite_backup ENABLE ROW LEVEL SECURITY;

-- 1. the invites (anyone not signed up yet gets this role when they do)
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, teams, institution, roles) VALUES
  ('jayrongillamac@gmail.com',     'participant', 'Participant (BRICKS)',            'Jayron Gillamac',           'JG', 'g3', NULL,               'AIPO', NULL),
  ('angelicabetasa0724@gmail.com', 'participant', 'Participant (SFRSCC)',            'Angelica Betasa',           'AB', 'g9', NULL,               'AIPO', NULL),
  ('joshguico@gmail.com',          'facilitator', 'Facilitator (BRICKS & SFRSCC)',   'Josh Guico',                'JG', NULL, ARRAY['g3','g9'],   'AIPO', NULL),
  ('mudtojan@ateneo.edu',          'trainer',     'Trainer & Mentor',                'May Ann A. Udtojan-Albis',  'MU', NULL, ARRAY['g3','g9'],   'AIPO', ARRAY['trainer','mentor']),
  ('bmirasol@ateneo.edu',          'mentor',      'Mentor, Trainer & Panelist (SPArC)', 'Engr. Benjamin N. Mirasol', 'BM', 'g7', NULL,             'AIPO', ARRAY['mentor','trainer','panel'])
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, role_label = EXCLUDED.role_label,
  team_id = EXCLUDED.team_id, teams = EXCLUDED.teams, roles = EXCLUDED.roles;

-- 2. the accounts that already exist
UPDATE public.profiles p SET role = i.role, role_label = i.role_label, team_id = i.team_id, teams = i.teams, roles = i.roles
FROM public.role_invites i
WHERE lower(p.email) = lower(i.email)
  AND lower(i.email) IN ('jayrongillamac@gmail.com','angelicabetasa0724@gmail.com','joshguico@gmail.com','mudtojan@ateneo.edu','bmirasol@ateneo.edu');

-- 3. check: everyone in the simulation, plus who holds each panel seat
SELECT email, full_name, role, roles, role_label, team_id, teams
FROM public.profiles
WHERE lower(email) IN ('jayrongillamac@gmail.com','angelicabetasa0724@gmail.com','joshguico@gmail.com','mudtojan@ateneo.edu','bmirasol@ateneo.edu','mapiladas@ateneo.edu','cperote@ateneo.edu')
ORDER BY role, email;
SELECT s.seat, s.panel_letter, s.display_name, p.email FROM public.panel_seats s
LEFT JOIN public.profiles p ON p.id = s.profile_id ORDER BY s.seat;

-- ---------------------------------------------------------------------
-- Mary Joy Piano — participant, meSHM (g8). Saves her current role first.
-- (May Ann was later narrowed to mentor of BRICKS only — see chat.)
-- ---------------------------------------------------------------------
INSERT INTO public.sim_role_backup
  SELECT id, email, role, roles, role_label, team_id, teams, now() FROM public.profiles
  WHERE lower(email) = 'cpiano@ateneo.edu'
    AND NOT EXISTS (SELECT 1 FROM public.sim_role_backup WHERE lower(email) = 'cpiano@ateneo.edu');
INSERT INTO public.sim_invite_backup
  SELECT *, now() FROM public.role_invites
  WHERE lower(email) = 'cpiano@ateneo.edu'
    AND NOT EXISTS (SELECT 1 FROM public.sim_invite_backup WHERE lower(email) = 'cpiano@ateneo.edu');

INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, teams, institution, roles)
VALUES ('cpiano@ateneo.edu', 'participant', 'Participant (meSHM)', 'Mary Joy Piano', 'MP', 'g8', NULL, 'AIPO', NULL)
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, role_label = EXCLUDED.role_label,
  team_id = EXCLUDED.team_id, teams = EXCLUDED.teams, roles = EXCLUDED.roles;

UPDATE public.profiles
SET role = 'participant', role_label = 'Participant (meSHM)', team_id = 'g8', teams = NULL, roles = NULL
WHERE lower(email) = 'cpiano@ateneo.edu';
