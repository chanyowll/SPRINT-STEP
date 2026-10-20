-- =====================================================================
-- STEP Hub: reactions in STEP GC
-- Run once in the Supabase SQL Editor (after chat_rooms.sql). Safe to re-run.
--
-- One reaction per person per message: like, haha, heart, fire, sad or step (the STEP logo).
-- Everyone who can read a message's room sees its reactions and who gave
-- them; you can only add or take off your own. The name shown is stamped
-- from the reactor's own profile, so nobody can react as someone else.
-- Reactions go away with their message.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.chat_reactions (
  message_id text        NOT NULL,
  user_id    uuid        NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji      text        NOT NULL CHECK (emoji IN ('like','haha','heart','fire','sad','step')),
  name       text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);
ALTER TABLE public.chat_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_reactions REPLICA IDENTITY FULL;

-- stamp who reacted from their own account
CREATE OR REPLACE FUNCTION public.chat_reaction_stamp() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.user_id := auth.uid();
  NEW.created_at := now();
  SELECT COALESCE(NULLIF(p.full_name, ''), p.email, '') INTO NEW.name
    FROM public.profiles p WHERE p.id = auth.uid();
  NEW.name := COALESCE(NEW.name, '');
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS chat_reaction_stamp ON public.chat_reactions;
CREATE TRIGGER chat_reaction_stamp BEFORE INSERT ON public.chat_reactions
  FOR EACH ROW EXECUTE FUNCTION public.chat_reaction_stamp();

-- a reaction is visible (and allowed) only on a message you can read;
-- the chat's own room rules decide that
DROP POLICY IF EXISTS chat_reactions_read ON public.chat_reactions;
CREATE POLICY chat_reactions_read ON public.chat_reactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.chat_messages m WHERE m.id::text = chat_reactions.message_id));
DROP POLICY IF EXISTS chat_reactions_add ON public.chat_reactions;
CREATE POLICY chat_reactions_add ON public.chat_reactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.chat_messages m WHERE m.id::text = chat_reactions.message_id));
DROP POLICY IF EXISTS chat_reactions_remove ON public.chat_reactions;
CREATE POLICY chat_reactions_remove ON public.chat_reactions FOR DELETE TO authenticated
  USING (user_id = auth.uid());
GRANT SELECT, INSERT, DELETE ON public.chat_reactions TO authenticated;

-- reactions leave with their message
CREATE OR REPLACE FUNCTION public.chat_reactions_cleanup() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.chat_reactions WHERE message_id = OLD.id::text;
  RETURN OLD;
END $$;
DROP TRIGGER IF EXISTS chat_reactions_cleanup ON public.chat_messages;
CREATE TRIGGER chat_reactions_cleanup AFTER DELETE ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.chat_reactions_cleanup();

-- live updates, so a reaction shows on everyone's screen right away
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
                  WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_reactions') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_reactions;
  END IF;
END $$;

-- already ran an earlier version of this file? this lets the STEP reaction through
ALTER TABLE public.chat_reactions DROP CONSTRAINT IF EXISTS chat_reactions_emoji_check;
ALTER TABLE public.chat_reactions ADD CONSTRAINT chat_reactions_emoji_check
  CHECK (emoji IN ('like','haha','heart','fire','sad','step'));

NOTIFY pgrst, 'reload schema';
