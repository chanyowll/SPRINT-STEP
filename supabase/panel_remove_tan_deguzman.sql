-- STEP Hub — remove Panel access: Mr. Michael Tan and Ms. Bunnie De Guzman
-- Run once in the Supabase SQL Editor. Safe to run again.
-- They keep their other pages (Mentors for both, Trainers for Mr. Tan); only the Panel page and score sheet go.

UPDATE public.role_invites SET roles = ARRAY['mentor','trainer'],
  role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor & Trainer (')
WHERE email = 'mctan@ateneo.edu';

UPDATE public.role_invites SET roles = ARRAY['mentor'],
  role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor (')
WHERE email = 'mcbdeguzman@ateneo.edu';

UPDATE public.profiles p SET roles = i.roles, role_label = i.role_label
FROM public.role_invites i
WHERE lower(p.email) = lower(i.email)
  AND i.email IN ('mctan@ateneo.edu','mcbdeguzman@ateneo.edu');

-- their panel seats
DELETE FROM public.panel_seats WHERE lower(email) IN ('mctan@ateneo.edu','mcbdeguzman@ateneo.edu');

-- check: no Panel page, no seat
SELECT p.email, COALESCE(p.roles, ARRAY[p.role]) AS opens_pages_for,
       (SELECT count(*) FROM public.panel_seats s WHERE lower(s.email) = lower(p.email)) AS seats
FROM public.profiles p WHERE lower(p.email) IN ('mctan@ateneo.edu','mcbdeguzman@ateneo.edu');
