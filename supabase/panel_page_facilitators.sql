-- STEP Hub — Panel page for the facilitators: Angelica Betasa and Jayron Gillamac
-- Run once in the Supabase SQL Editor. Safe to run again.
-- Adds the Panel page on top of whatever pages they already have. They get no panel seat,
-- so they can open the Panel page and watch team outputs but have no score sheet to fill.

UPDATE public.role_invites
   SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(roles, ARRAY[role]) || ARRAY['panel'])),
       role_label = CASE WHEN role = 'facilitator' AND role_label LIKE 'Facilitator (%'
                         THEN regexp_replace(role_label, '^[^(]*\(', 'Facilitator & Panelist (') ELSE role_label END
 WHERE lower(email) IN ('angelicabetasa0724@gmail.com','jayrongillamac@gmail.com');

UPDATE public.profiles
   SET roles = ARRAY(SELECT DISTINCT unnest(COALESCE(roles, ARRAY[role]) || ARRAY['panel'])),
       role_label = CASE WHEN role = 'facilitator' AND role_label LIKE 'Facilitator (%'
                         THEN regexp_replace(role_label, '^[^(]*\(', 'Facilitator & Panelist (') ELSE role_label END
 WHERE lower(email) IN ('angelicabetasa0724@gmail.com','jayrongillamac@gmail.com');

-- check
SELECT email, full_name, role, COALESCE(roles, ARRAY[role])::text AS opens_pages_for, role_label, teams::text
  FROM public.profiles
 WHERE lower(email) IN ('angelicabetasa0724@gmail.com','jayrongillamac@gmail.com');
