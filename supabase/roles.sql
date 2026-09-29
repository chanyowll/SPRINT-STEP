-- =====================================================================
-- STEP Hub — Accounts that hold more than one role
-- Run this in the Supabase SQL Editor. Safe to run more than once.
--
-- profiles.role stays the account's single, primary role. This adds an
-- optional profiles.roles list for the few people who genuinely hold two
-- — a mentor who also sits on a Saturday panel, say.
--
-- The rule the site follows: Trainers, Mentors and Panel are three
-- separate pages, and each opens only for the role named on it. Access
-- is never inferred from a neighbouring role. Leave `roles` empty and
-- the account holds exactly the one role in `role`.
-- =====================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS roles TEXT[];

COMMENT ON COLUMN public.profiles.roles IS
  'Optional. All roles this account holds, e.g. {mentor,panel}. When empty, the account holds only profiles.role.';

-- ── How to grant a second role ───────────────────────────────────────
-- Give one person both the Mentors and the Panel page:
--
--   UPDATE public.profiles
--      SET roles = ARRAY['mentor','panel']
--    WHERE email = 'name@example.com';
--
-- Take the extra role away again (back to profiles.role alone):
--
--   UPDATE public.profiles SET roles = NULL WHERE email = 'name@example.com';

-- ── Who currently holds what ─────────────────────────────────────────
SELECT email,
       role                                   AS primary_role,
       COALESCE(roles, ARRAY[role])           AS opens_pages_for
FROM public.profiles
WHERE role IN ('trainer', 'mentor', 'panel', 'admin')
   OR roles IS NOT NULL
ORDER BY role, email;
