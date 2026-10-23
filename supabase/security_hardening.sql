-- =====================================================================
-- STEP Hub — security hardening
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- 1. Signed-in users could edit their OWN profile row freely, including
--    role, roles, team_id, teams and full_name. From the browser console a
--    participant could have made themselves 'admin' (and then read
--    everything admins can) or renamed themselves "STEP Tech Team".
--    From now on those fields only change through an admin, the tech team,
--    or the SQL Editor; everyone else's attempt is refused.
-- 2. A check that lists any public table still without row level security.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.guard_profile_fields() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- the SQL Editor, the service key and database functions run without a signed-in user
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  -- the tech team and admins may change anything
  IF public.is_tech() OR public.get_user_role() = 'admin' THEN RETURN NEW; END IF;
  IF NEW.role       IS DISTINCT FROM OLD.role
  OR NEW.roles      IS DISTINCT FROM OLD.roles
  OR NEW.role_label IS DISTINCT FROM OLD.role_label
  OR NEW.team_id    IS DISTINCT FROM OLD.team_id
  OR NEW.teams      IS DISTINCT FROM OLD.teams
  OR NEW.email      IS DISTINCT FROM OLD.email
  OR NEW.full_name  IS DISTINCT FROM OLD.full_name
  OR NEW.id         IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Only the STEP team can change roles, teams or names.';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS guard_profile_fields ON public.profiles;
CREATE TRIGGER guard_profile_fields BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_fields();

-- check: public tables WITHOUT row level security (should return no rows)
SELECT c.relname AS table_without_rls
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r' AND NOT c.relrowsecurity
ORDER BY 1;
