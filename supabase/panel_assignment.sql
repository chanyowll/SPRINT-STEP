-- STEP Hub — STEP 2.5 panel seats (applied live as "panel_seats_final_assignment")
-- A seat is tied to an email, so it is the panelist's the moment their account exists.
ALTER TABLE public.panel_seats ADD COLUMN IF NOT EXISTS email TEXT;

CREATE OR REPLACE FUNCTION public.my_panel_seats()
RETURNS SETOF integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT ps.seat FROM public.panel_seats ps
   WHERE ps.profile_id = auth.uid()
      OR (ps.email IS NOT NULL AND lower(ps.email) =
          lower((SELECT email FROM public.profiles WHERE id = auth.uid())));
$$;

CREATE OR REPLACE FUNCTION public.panel_roster()
RETURNS TABLE(seat integer, panel_letter text, display_name text, email text, is_me boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT ps.seat, ps.panel_letter, ps.display_name,
         CASE WHEN public.has_role('admin') THEN COALESCE(p.email, ps.email) ELSE NULL END,
         ps.seat IN (SELECT public.my_panel_seats())
    FROM public.panel_seats ps LEFT JOIN public.profiles p ON p.id = ps.profile_id
   ORDER BY ps.seat;
$$;

UPDATE public.panel_seats s SET display_name = v.name, email = v.email,
  profile_id = (SELECT id FROM public.profiles WHERE lower(email) = lower(v.email)),
  updated_at = now()
FROM (VALUES
  (1, 'Dr. Jon Fernandez',         'pfernandez@ateneo.edu'),   -- Panel A
  (2, 'Ms. Janine Chiong',         'jchiong@ateneo.edu'),
  (3, 'Industry Panel 1',          NULL),
  (4, 'Mr. George Quitoriano',     'gquitoriano@ateneo.edu'),  -- Panel B
  (5, 'Mr. Bienvenido Garcia',     'bgarcia@ateneo.edu'),
  (6, 'Industry Panel 2',          NULL),
  (7, 'Mr. Tony Feria',            'aferia@ateneo.edu'),       -- Panel C
  (8, 'Engr. Benjamin N. Mirasol', 'bmirasol@ateneo.edu'),
  (9, 'Industry Panel 3',          NULL)
) AS v(seat, name, email)
WHERE s.seat = v.seat;
