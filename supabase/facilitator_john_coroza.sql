-- =====================================================================
-- STEP Hub — John Coroza (DOST-PCIEERD): facilitator for ALL ten teams
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- He can then create his account with this email (invite-only sign-up).
-- =====================================================================
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, teams, institution) VALUES
 ('john.coroza@pcieerd.dost.gov.ph', 'facilitator', 'Facilitator (All teams)', 'John Coroza', 'JC', NULL,
  ARRAY['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10'], 'DOST-PCIEERD')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, role_label = EXCLUDED.role_label,
  full_name = EXCLUDED.full_name, initials = EXCLUDED.initials, team_id = NULL,
  teams = EXCLUDED.teams, institution = EXCLUDED.institution;

-- if he has already signed up, give the account the same access now
UPDATE public.profiles
   SET role = 'facilitator', role_label = 'Facilitator (All teams)', team_id = NULL,
       teams = ARRAY['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10'], institution = 'DOST-PCIEERD'
 WHERE lower(email) = 'john.coroza@pcieerd.dost.gov.ph';

-- check
SELECT 'invite' AS what, email, role, role_label, teams FROM public.role_invites WHERE lower(email) = 'john.coroza@pcieerd.dost.gov.ph'
UNION ALL
SELECT 'account', email, role, role_label, teams FROM public.profiles WHERE lower(email) = 'john.coroza@pcieerd.dost.gov.ph';
