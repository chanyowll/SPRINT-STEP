-- STEP Hub — three more panelists: Dr. John Lagdameo, Ms. Bunnie De Guzman, Mr. Michael Tan
-- Run once in the Supabase SQL Editor. Safe to run again.
--
-- 1. adds the Panel page to their accounts (they keep Mentors, and Trainers for Mr. Tan)
-- 2. gives each a panel seat tied to their email, so the console's Panel groups
--    recognise them by name and their score sheet opens for them
-- The seats start with no panel ('') — they join a panel only when you place them
-- in the Panel groups and press Save panels.

-- ── 1. the Panel page ────────────────────────────────────────────────
UPDATE public.role_invites SET roles = ARRAY['mentor','panel'],
  role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor & Panelist (')
WHERE email IN ('jlagdameo@ateneo.edu','mcbdeguzman@ateneo.edu');

UPDATE public.role_invites SET roles = ARRAY['mentor','trainer','panel'],
  role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor, Trainer & Panelist (')
WHERE email = 'mctan@ateneo.edu';

UPDATE public.profiles p SET roles = i.roles, role_label = i.role_label
FROM public.role_invites i
WHERE lower(p.email) = lower(i.email)
  AND i.email IN ('jlagdameo@ateneo.edu','mcbdeguzman@ateneo.edu','mctan@ateneo.edu');

-- ── 2. their seats ───────────────────────────────────────────────────
INSERT INTO public.panel_seats (seat, panel_letter, display_name, email, profile_id)
SELECT v.seat, '', v.name, v.email, (SELECT id FROM public.profiles WHERE lower(email) = lower(v.email))
FROM (VALUES
  (10, 'Dr. John Lagdameo',     'jlagdameo@ateneo.edu'),
  (11, 'Ms. Bunnie De Guzman',  'mcbdeguzman@ateneo.edu'),
  (12, 'Mr. Michael Tan',       'mctan@ateneo.edu')
) AS v(seat, name, email)
ON CONFLICT (seat) DO UPDATE
  SET display_name = EXCLUDED.display_name, email = EXCLUDED.email,
      profile_id = EXCLUDED.profile_id, updated_at = now();

-- ── check: three rows, each with the Panel page ──────────────────────
SELECT p.email, COALESCE(p.roles, ARRAY[p.role]) AS opens_pages_for, s.seat, s.display_name
FROM public.profiles p LEFT JOIN public.panel_seats s ON s.profile_id = p.id
WHERE lower(p.email) IN ('jlagdameo@ateneo.edu','mcbdeguzman@ateneo.edu','mctan@ateneo.edu')
ORDER BY s.seat;
