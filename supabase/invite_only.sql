-- =====================================================================
-- STEP Hub — invite-only accounts
-- Run in the Supabase SQL Editor. Safe to run more than once.
--
-- Only an email listed in public.role_invites can create an account,
-- whether through the site's sign-up form, "Continue with Google" or an
-- invite from the Supabase dashboard. Everyone else is refused before
-- the account exists. Accounts that already exist are not affected.
-- To give someone access: add their email to role_invites first.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.only_invited_signups() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.role_invites WHERE lower(email) = lower(NEW.email)) THEN
    RAISE EXCEPTION 'This email has not been given access to STEP Hub.';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS only_invited_signups ON auth.users;
CREATE TRIGGER only_invited_signups BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.only_invited_signups();

-- accounts that exist but were never invited: review these by hand
SELECT p.email, p.full_name, p.role, p.created_at
FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.role_invites i WHERE lower(i.email) = lower(p.email))
ORDER BY p.created_at;
