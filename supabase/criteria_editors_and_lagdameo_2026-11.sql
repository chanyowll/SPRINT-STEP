-- STEP Hub — panel criteria editors, and Dr. Lagdameo's panel access
-- Run once in the Supabase SQL Editor. Safe to run again.
--
-- 1. Mr. Tony Feria may edit the Week 1 panel scoring criteria, and Mr. Bienvenido Garcia
--    the Week 2 criteria (Mr. Feria keeps Weeks 2 and 3). Both already hold the Trainer role.
-- 2. Dr. John Lagdameo no longer has the Panel page (he keeps Mentors) and his panel seat is freed.

INSERT INTO public.session_trainers (session_code, trainer_email, week_starts, week_ends) VALUES
  ('W1', 'aferia@ateneo.edu',  '2026-10-26', '2026-11-08'),
  ('W2', 'bgarcia@ateneo.edu', '2026-11-09', '2026-11-15')
ON CONFLICT (session_code, trainer_email) DO UPDATE
  SET week_starts = EXCLUDED.week_starts, week_ends = EXCLUDED.week_ends;

UPDATE public.role_invites SET roles = ARRAY['mentor'],
  role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor (')
WHERE email = 'jlagdameo@ateneo.edu';

UPDATE public.profiles p SET roles = i.roles, role_label = i.role_label
FROM public.role_invites i
WHERE lower(p.email) = lower(i.email) AND i.email = 'jlagdameo@ateneo.edu';

DELETE FROM public.panel_seats s
 WHERE lower(s.email) = 'jlagdameo@ateneo.edu'
   AND NOT EXISTS (SELECT 1 FROM public.panel_sheets  x WHERE x.seat = s.seat)
   AND NOT EXISTS (SELECT 1 FROM public.panel_reports r WHERE r.seat = s.seat);
UPDATE public.panel_seats SET panel_letter = '', email = NULL, profile_id = NULL, updated_at = now()
 WHERE lower(email) = 'jlagdameo@ateneo.edu';

-- check
SELECT 'editor' AS what, session_code AS a, trainer_email AS b, '' AS c FROM public.session_trainers
 WHERE session_code IN ('W1','W2','W3') OR lower(trainer_email) IN ('aferia@ateneo.edu','bgarcia@ateneo.edu')
UNION ALL
SELECT 'jlagdameo', email, COALESCE(roles, ARRAY[role])::text,
       (SELECT count(*)::text FROM public.panel_seats s WHERE lower(s.email) = lower(p.email)) || ' seats'
  FROM public.profiles p WHERE lower(email) = 'jlagdameo@ateneo.edu'
ORDER BY 1, 2;
