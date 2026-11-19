-- STEP Hub: a full name for the Directory only
-- Run once in the Supabase SQL Editor (after member_directory.sql). Safe to run again.
--
-- The Directory can show a different full name from the one on the account. Chat,
-- panel scoring and the sign-up record keep the name they already use.

ALTER TABLE public.directory_extra ADD COLUMN IF NOT EXISTS full_name text NOT NULL DEFAULT '';

-- Ms. Ace: "Hazel Bernadette Gapuz" in the Directory, "Ace Gapuz" everywhere else
INSERT INTO public.directory_extra (ref, full_name)
VALUES ('ace@blogapalooza.ph', 'Hazel Bernadette Gapuz')
ON CONFLICT (ref) DO UPDATE SET full_name = EXCLUDED.full_name;

NOTIFY pgrst, 'reload schema';

-- check
SELECT ref, full_name, title, phone FROM public.directory_extra WHERE full_name <> '';
