-- =====================================================================
-- STEP Hub — Mark Joshua Halili (DOST-PCIEERD): facilitator for ALL ten teams
-- Run once in the Supabase SQL Editor. Safe to run more than once.
-- =====================================================================
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, teams, institution) VALUES
 ('markjoshua.halili@pcieerd.dost.gov.ph', 'facilitator', 'Facilitator (All teams)', 'Mark Joshua Halili', 'MH', NULL,
  ARRAY['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10'], 'DOST-PCIEERD')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, role_label = EXCLUDED.role_label,
  full_name = EXCLUDED.full_name, initials = EXCLUDED.initials, team_id = NULL,
  teams = EXCLUDED.teams, institution = EXCLUDED.institution;

UPDATE public.profiles
   SET role = 'facilitator', role_label = 'Facilitator (All teams)', team_id = NULL,
       teams = ARRAY['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10'], institution = 'DOST-PCIEERD'
 WHERE lower(email) = 'markjoshua.halili@pcieerd.dost.gov.ph';

SELECT 'invite' AS what, email, role, role_label, teams FROM public.role_invites WHERE lower(email) = 'markjoshua.halili@pcieerd.dost.gov.ph'
UNION ALL
SELECT 'account', email, role, role_label, teams FROM public.profiles WHERE lower(email) = 'markjoshua.halili@pcieerd.dost.gov.ph';
