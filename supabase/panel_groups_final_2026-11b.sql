-- STEP Hub — final Saturday panels, as confirmed on the Panel groups board (Week 1 onward)
-- Run once in the Supabase SQL Editor. Safe to run again (a re-run just saves the same grouping as the newest one).
--
--   Panel A: Mr. Tony Feria, Ms. Alice Parlan, Mr. Lorenzo Tiongson
--     9:00 BRICKS · 9:40 SINAG · 10:20 HATTS
--   Panel B: Mr. Bienvenido Garcia, Ms. Janine Chiong, Engr. Benjamin N. Mirasol
--     9:00 CAPPS · 9:40 ZEOSKIN · 10:20 POSTe
--   Panel C: Dr. Jon Fernandez, Mr. George Quitoriano, Ms. Ace
--     9:00 SPArC · 9:40 LASER · 10:20 meSHM · 11:00 SFRSCC

DO $$
DECLARE
  s_tony INT; s_alice INT; s_lorenzo INT; s_bien INT; s_janine INT; s_benjie INT; s_jon INT; s_george INT; s_ace INT;
BEGIN
  SELECT seat INTO s_tony    FROM public.panel_seats WHERE lower(email) = 'aferia@ateneo.edu'      LIMIT 1;
  SELECT seat INTO s_alice   FROM public.panel_seats WHERE lower(email) = 'amparlan@ateneo.edu'    LIMIT 1;
  SELECT seat INTO s_lorenzo FROM public.panel_seats WHERE lower(email) = 'lltiongson@ateneo.edu'  LIMIT 1;
  SELECT seat INTO s_bien    FROM public.panel_seats WHERE lower(email) = 'bgarcia@ateneo.edu'     LIMIT 1;
  SELECT seat INTO s_janine  FROM public.panel_seats WHERE lower(email) = 'jchiong@ateneo.edu'     LIMIT 1;
  SELECT seat INTO s_benjie  FROM public.panel_seats WHERE lower(email) = 'bmirasol@ateneo.edu'    LIMIT 1;
  SELECT seat INTO s_jon     FROM public.panel_seats WHERE lower(email) = 'pfernandez@ateneo.edu'  LIMIT 1;
  SELECT seat INTO s_george  FROM public.panel_seats WHERE lower(email) = 'gquitoriano@ateneo.edu' LIMIT 1;
  SELECT seat INTO s_ace     FROM public.panel_seats WHERE display_name = 'Ms. Ace' LIMIT 1;
  IF s_tony IS NULL OR s_alice IS NULL OR s_lorenzo IS NULL OR s_bien IS NULL OR s_janine IS NULL
     OR s_benjie IS NULL OR s_jon IS NULL OR s_george IS NULL OR s_ace IS NULL THEN
    RAISE EXCEPTION 'A panelist seat is missing: tony %, alice %, lorenzo %, bien %, janine %, benjie %, jon %, george %, ace %',
      s_tony, s_alice, s_lorenzo, s_bien, s_janine, s_benjie, s_jon, s_george, s_ace;
  END IF;

  INSERT INTO public.panel_plans (week_from, week_to, panels) VALUES (1, NULL, jsonb_build_array(
    jsonb_build_object('letter', 'A', 'at', '09:00',
      'teams', jsonb_build_array('g3', 'g2', 'g4'),
      'times', jsonb_build_array('09:00', '09:40', '10:20'),
      'panelists', jsonb_build_array(
        jsonb_build_object('seat', s_tony,    'name', 'Mr. Tony Feria'),
        jsonb_build_object('seat', s_alice,   'name', 'Ms. Alice Parlan'),
        jsonb_build_object('seat', s_lorenzo, 'name', 'Mr. Lorenzo Tiongson'))),
    jsonb_build_object('letter', 'B', 'at', '09:00',
      'teams', jsonb_build_array('g6', 'g5', 'g1'),
      'times', jsonb_build_array('09:00', '09:40', '10:20'),
      'panelists', jsonb_build_array(
        jsonb_build_object('seat', s_bien,   'name', 'Mr. Bienvenido Garcia'),
        jsonb_build_object('seat', s_janine, 'name', 'Ms. Janine Chiong'),
        jsonb_build_object('seat', s_benjie, 'name', 'Engr. Benjamin N. Mirasol'))),
    jsonb_build_object('letter', 'C', 'at', '09:00',
      'teams', jsonb_build_array('g7', 'g10', 'g8', 'g9'),
      'times', jsonb_build_array('09:00', '09:40', '10:20', '11:00'),
      'panelists', jsonb_build_array(
        jsonb_build_object('seat', s_jon,    'name', 'Dr. Jon Fernandez'),
        jsonb_build_object('seat', s_george, 'name', 'Mr. George Quitoriano'),
        jsonb_build_object('seat', s_ace,    'name', 'Ms. Ace')))
  ));

  UPDATE public.panel_seats SET panel_letter = '', updated_at = now();
  UPDATE public.panel_seats SET panel_letter = 'A', updated_at = now() WHERE seat IN (s_tony, s_alice, s_lorenzo);
  UPDATE public.panel_seats SET panel_letter = 'B', updated_at = now() WHERE seat IN (s_bien, s_janine, s_benjie);
  UPDATE public.panel_seats SET panel_letter = 'C', updated_at = now() WHERE seat IN (s_jon, s_george, s_ace);
END $$;

-- check: who sits where
SELECT NULLIF(panel_letter, '') AS panel, seat, display_name, email
  FROM public.panel_seats ORDER BY COALESCE(NULLIF(panel_letter, ''), 'Z'), seat;
