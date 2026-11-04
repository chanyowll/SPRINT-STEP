-- STEP Hub — final Saturday panels (from Week 1 onward)
-- Run once in the Supabase SQL Editor, AFTER panelist_lorenzo_tiongson.sql. Safe to run again
-- (a re-run just saves the same grouping again as the newest one).
--
--   Panel A: Mr. Tony Feria, Ms. Alice, Mr. Lorenzo Tiongson
--     9:00 BRICKS · 9:40 SINAG · 10:30 HATTS
--   Panel B: Mr. Bienvenido Garcia, Ms. Janine Chiong, Dr. Jon Fernandez
--     9:00 CAPPS · 9:40 ZEOSKIN · 10:30 SPArC
--   Panel C: Engr. Benjamin N. Mirasol, Mr. George Quitoriano, Ms. Ace
--     9:00 POSTe · 9:40 LASER · 10:30 meSHM · 11:00 SFRSCC
--
-- Ms. Alice and Ms. Ace get a seat now under these names, with no account linked.
-- Their full names and emails come later; linking them then keeps their seat and panel.

DO $$
DECLARE
  s_alice INT; s_ace INT; s_lorenzo INT;
  s_tony INT; s_bien INT; s_janine INT; s_jon INT; s_benjie INT; s_george INT;
BEGIN
  -- the two seats still waiting for a name and email
  SELECT seat INTO s_alice FROM public.panel_seats
   WHERE lower(email) = 'amparlan@ateneo.edu' OR display_name IN ('Ms. Alice', 'Ms. Alice Parlan') ORDER BY (email IS NULL) LIMIT 1;
  IF s_alice IS NULL THEN
    SELECT COALESCE(MAX(seat), 0) + 1 INTO s_alice FROM public.panel_seats;
    INSERT INTO public.panel_seats (seat, panel_letter, display_name) VALUES (s_alice, 'A', 'Ms. Alice');
  END IF;
  SELECT seat INTO s_ace FROM public.panel_seats WHERE display_name = 'Ms. Ace' LIMIT 1;
  IF s_ace IS NULL THEN
    SELECT COALESCE(MAX(seat), 0) + 1 INTO s_ace FROM public.panel_seats;
    INSERT INTO public.panel_seats (seat, panel_letter, display_name) VALUES (s_ace, 'C', 'Ms. Ace');
  END IF;

  -- everyone else, by the email on their seat
  SELECT seat INTO s_lorenzo FROM public.panel_seats WHERE lower(email) = 'lltiongson@ateneo.edu'  LIMIT 1;
  SELECT seat INTO s_tony    FROM public.panel_seats WHERE lower(email) = 'aferia@ateneo.edu'      LIMIT 1;
  SELECT seat INTO s_bien    FROM public.panel_seats WHERE lower(email) = 'bgarcia@ateneo.edu'     LIMIT 1;
  SELECT seat INTO s_janine  FROM public.panel_seats WHERE lower(email) = 'jchiong@ateneo.edu'     LIMIT 1;
  SELECT seat INTO s_jon     FROM public.panel_seats WHERE lower(email) = 'pfernandez@ateneo.edu'  LIMIT 1;
  SELECT seat INTO s_benjie  FROM public.panel_seats WHERE lower(email) = 'bmirasol@ateneo.edu'    LIMIT 1;
  SELECT seat INTO s_george  FROM public.panel_seats WHERE lower(email) = 'gquitoriano@ateneo.edu' LIMIT 1;
  IF s_lorenzo IS NULL THEN RAISE EXCEPTION 'Run panelist_lorenzo_tiongson.sql first (no seat for lltiongson@ateneo.edu).'; END IF;
  IF s_tony IS NULL OR s_bien IS NULL OR s_janine IS NULL OR s_jon IS NULL OR s_benjie IS NULL OR s_george IS NULL THEN
    RAISE EXCEPTION 'A panelist seat is missing an email: tony %, bien %, janine %, jon %, benjie %, george %',
      s_tony, s_bien, s_janine, s_jon, s_benjie, s_george;
  END IF;

  -- the grouping the Panel page, This Week and the score sheets read (Week 1 onward)
  INSERT INTO public.panel_plans (week_from, week_to, panels) VALUES (1, NULL, jsonb_build_array(
    jsonb_build_object('letter', 'A', 'at', '09:00',
      'teams', jsonb_build_array('g3', 'g2', 'g4'),
      'times', jsonb_build_array('09:00', '09:40', '10:30'),
      'panelists', jsonb_build_array(
        jsonb_build_object('seat', s_tony,    'name', 'Mr. Tony Feria'),
        jsonb_build_object('seat', s_alice,   'name', 'Ms. Alice Parlan'),
        jsonb_build_object('seat', s_lorenzo, 'name', 'Mr. Lorenzo Tiongson'))),
    jsonb_build_object('letter', 'B', 'at', '09:00',
      'teams', jsonb_build_array('g6', 'g5', 'g7'),
      'times', jsonb_build_array('09:00', '09:40', '10:30'),
      'panelists', jsonb_build_array(
        jsonb_build_object('seat', s_bien,   'name', 'Mr. Bienvenido Garcia'),
        jsonb_build_object('seat', s_janine, 'name', 'Ms. Janine Chiong'),
        jsonb_build_object('seat', s_jon,    'name', 'Dr. Jon Fernandez'))),
    jsonb_build_object('letter', 'C', 'at', '09:00',
      'teams', jsonb_build_array('g1', 'g10', 'g8', 'g9'),
      'times', jsonb_build_array('09:00', '09:40', '10:30', '11:00'),
      'panelists', jsonb_build_array(
        jsonb_build_object('seat', s_benjie, 'name', 'Engr. Benjamin N. Mirasol'),
        jsonb_build_object('seat', s_george, 'name', 'Mr. George Quitoriano'),
        jsonb_build_object('seat', s_ace,    'name', 'Ms. Ace')))
  ));

  -- each seat's own panel letter, to match (seats on no panel are left blank)
  UPDATE public.panel_seats SET panel_letter = '', updated_at = now();
  UPDATE public.panel_seats SET panel_letter = 'A', updated_at = now() WHERE seat IN (s_tony, s_alice, s_lorenzo);
  UPDATE public.panel_seats SET panel_letter = 'B', updated_at = now() WHERE seat IN (s_bien, s_janine, s_jon);
  UPDATE public.panel_seats SET panel_letter = 'C', updated_at = now() WHERE seat IN (s_benjie, s_george, s_ace);
END $$;

-- check: who sits where (Dr. Lagdameo, Ms. De Guzman and Mr. Tan show no panel)
SELECT NULLIF(panel_letter, '') AS panel, seat, display_name, email
FROM public.panel_seats ORDER BY (panel_letter = ''), panel_letter, seat;
