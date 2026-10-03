-- =====================================================================
-- STEP Hub: rooms in STEP GC
-- Run once in the Supabase SQL Editor (after chat_images.sql). Safe to re-run.
--
-- Every chat message belongs to one room:
--   'fam'           STEP Fam, the whole cohort (everyone signed in)
--   'team:<id>'     a team's room, e.g. 'team:g1' for POSTE
--   'group:mentors' all mentors      'group:panels' all panelists
--   'group:dost'    DOST-PCIEERD (role 'dost' or a pcieerd.dost.gov.ph email)
-- Admins and the tech team are in every room. A team room is open to the
-- people whose profile carries that team (team_id or teams): its
-- participants and its mentor.
--
-- The rule is added as RESTRICTIVE policies, so the chat's existing
-- policies (who may post, edit, pin and remove) keep working unchanged and
-- this only narrows them to the rooms a person belongs to.
-- =====================================================================

ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS room text NOT NULL DEFAULT 'fam';
CREATE INDEX IF NOT EXISTS chat_messages_room_idx ON public.chat_messages (room, created_at DESC);
GRANT INSERT (room) ON public.chat_messages TO authenticated;

CREATE OR REPLACE FUNCTION public.can_use_room(p_room text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL THEN false
    WHEN p_room = 'fam' THEN true
    WHEN public.has_role('admin') OR public.is_tech() THEN true
    WHEN p_room LIKE 'team:%' THEN EXISTS (
      SELECT 1 FROM public.profiles p
       WHERE p.id = auth.uid()
         AND (p.team_id = substr(p_room, 6) OR substr(p_room, 6) = ANY (COALESCE(p.teams, ARRAY[]::text[]))))
    WHEN p_room = 'group:mentors' THEN public.has_role('mentor')
    WHEN p_room = 'group:panels'  THEN public.has_role('panel')
    WHEN p_room = 'group:dost'    THEN public.has_role('dost')
      OR lower(coalesce(auth.jwt() ->> 'email', '')) LIKE '%@pcieerd.dost.gov.ph'
    ELSE false
  END
$$;
GRANT EXECUTE ON FUNCTION public.can_use_room(text) TO authenticated;

DROP POLICY IF EXISTS chat_room_read ON public.chat_messages;
CREATE POLICY chat_room_read ON public.chat_messages AS RESTRICTIVE FOR SELECT TO authenticated
  USING (public.can_use_room(room));
DROP POLICY IF EXISTS chat_room_post ON public.chat_messages;
CREATE POLICY chat_room_post ON public.chat_messages AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (public.can_use_room(room));
DROP POLICY IF EXISTS chat_room_change ON public.chat_messages;
CREATE POLICY chat_room_change ON public.chat_messages AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (public.can_use_room(room)) WITH CHECK (public.can_use_room(room));
DROP POLICY IF EXISTS chat_room_remove ON public.chat_messages;
CREATE POLICY chat_room_remove ON public.chat_messages AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.can_use_room(room));

NOTIFY pgrst, 'reload schema';
