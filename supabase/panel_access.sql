-- STEP Hub — Panel access for six mentors (applied live as "panel_access_for_mentors")
UPDATE public.role_invites SET roles = ARRAY['mentor','trainer','panel'],
  role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor, Trainer & Panelist (')
WHERE email IN ('pfernandez@ateneo.edu','gquitoriano@ateneo.edu','bmirasol@ateneo.edu','aferia@ateneo.edu');

UPDATE public.role_invites SET roles = ARRAY['mentor','panel'],
  role_label = regexp_replace(role_label, '^[^(]*\(', 'Mentor & Panelist (')
WHERE email IN ('bgarcia@ateneo.edu','jchiong@ateneo.edu');

UPDATE public.profiles p SET roles = i.roles, role_label = i.role_label
FROM public.role_invites i WHERE lower(p.email) = lower(i.email) AND i.roles IS NOT NULL;
