-- STEP Hub — final panel arrangement (no industry panelists)
-- A: Mirasol, Garcia, Lagdameo   B: Fernandez, Quitoriano, De Guzman   C: Feria, Chiong, Tan
UPDATE public.panel_seats SET panel_letter = 'A', updated_at = now() WHERE seat IN (8, 5, 10);
UPDATE public.panel_seats SET panel_letter = 'B', updated_at = now() WHERE seat IN (1, 4, 11);
UPDATE public.panel_seats SET panel_letter = 'C', updated_at = now() WHERE seat IN (7, 2, 12);

-- retire the three industry placeholder seats
DELETE FROM public.panel_reports WHERE seat IN (3, 6, 9);
DELETE FROM public.panel_sheets  WHERE seat IN (3, 6, 9);
DELETE FROM public.panel_seats   WHERE seat IN (3, 6, 9);

SELECT seat, panel_letter, display_name FROM public.panel_seats ORDER BY panel_letter, seat;
