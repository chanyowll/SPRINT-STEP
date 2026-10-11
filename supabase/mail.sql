-- =====================================================================
-- STEP Hub — STEP Mail
-- Run this in the Supabase SQL Editor. Safe to run more than once.
--
-- Only the STEP Team (admins and the tech team) writes new messages.
-- A message to a group (a team, a role, everyone) gives each member
-- their own copy, with their own read/unread. Everyone else can only
-- reply, and a reply goes privately to the STEP Team, never to the
-- whole group. All writes go through the functions below; nobody can
-- insert or edit mail rows directly.
-- =====================================================================

-- ---------- who counts as the STEP Team ----------
CREATE OR REPLACE FUNCTION public.is_step_team() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role('admin') OR public.is_tech()
$$;
REVOKE ALL ON FUNCTION public.is_step_team() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_step_team() TO authenticated;

-- ---------- the messages ----------
CREATE TABLE IF NOT EXISTS public.mail_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id    uuid NOT NULL,                          -- id of the first message
  parent_id    uuid REFERENCES public.mail_messages(id) ON DELETE CASCADE,
  sender_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name  text NOT NULL,
  from_team    boolean NOT NULL,                       -- written by the STEP Team
  subject      text NOT NULL CHECK (length(btrim(subject)) BETWEEN 1 AND 200),
  body         text NOT NULL CHECK (length(btrim(body)) BETWEEN 1 AND 20000),
  to_label     text NOT NULL,                          -- 'Team SINAG', 'All mentors', 'STEP Team' …
  to_count     int  NOT NULL DEFAULT 0,
  attachments  jsonb NOT NULL DEFAULT '[]'::jsonb,     -- [{ "name", "path", "size" }]
  team_read_at timestamptz,                            -- a reply: when the STEP Team opened it
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mail_messages_thread_idx  ON public.mail_messages (thread_id, created_at);
CREATE INDEX IF NOT EXISTS mail_messages_created_idx ON public.mail_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS mail_messages_unread_idx  ON public.mail_messages (from_team, team_read_at);

-- ---------- one row per person a message was sent to ----------
CREATE TABLE IF NOT EXISTS public.mail_recipients (
  message_id uuid NOT NULL REFERENCES public.mail_messages(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at    timestamptz,
  PRIMARY KEY (message_id, user_id)
);
CREATE INDEX IF NOT EXISTS mail_recipients_user_idx ON public.mail_recipients (user_id, read_at);

ALTER TABLE public.mail_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mail_recipients ENABLE ROW LEVEL SECURITY;

-- Reading: the STEP Team sees everything; anyone else sees a message only
-- if it was sent to them or written by them.
DROP POLICY IF EXISTS mail_messages_select ON public.mail_messages;
CREATE POLICY mail_messages_select ON public.mail_messages FOR SELECT TO authenticated
  USING (public.is_step_team()
         OR sender_id = auth.uid()
         OR EXISTS (SELECT 1 FROM public.mail_recipients r
                    WHERE r.message_id = mail_messages.id AND r.user_id = auth.uid()));

DROP POLICY IF EXISTS mail_recipients_select ON public.mail_recipients;
CREATE POLICY mail_recipients_select ON public.mail_recipients FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_step_team());
-- (no insert / update / delete policies: every write goes through the functions)

-- ---------- send a new message (STEP Team only) ----------
CREATE OR REPLACE FUNCTION public.mail_send(
  p_subject     text,
  p_body        text,
  p_users       uuid[]  DEFAULT '{}',
  p_teams       text[]  DEFAULT '{}',
  p_roles       text[]  DEFAULT '{}',
  p_everyone    boolean DEFAULT false,
  p_attachments jsonb   DEFAULT '[]'::jsonb,
  p_id          uuid    DEFAULT NULL)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id uuid := coalesce(p_id, gen_random_uuid());
  v_me public.profiles;
  v_labels text[] := '{}';
  v_n int;
BEGIN
  IF NOT public.is_step_team() THEN RAISE EXCEPTION 'Only the STEP Team can write new messages.'; END IF;
  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  p_users := coalesce(p_users, '{}'); p_teams := coalesce(p_teams, '{}'); p_roles := coalesce(p_roles, '{}');

  -- the "To" line people see
  IF p_everyone THEN v_labels := ARRAY['Everyone'];
  ELSE
    v_labels := v_labels
      || ARRAY(SELECT 'Team ' || coalesce(nullif(t.short, ''), t.name) FROM public.teams t WHERE t.id = ANY (p_teams) ORDER BY t.id)
      || ARRAY(SELECT 'All ' || CASE r WHEN 'panel' THEN 'panelists' ELSE r || 's' END FROM unnest(p_roles) r)
      || ARRAY(SELECT coalesce(nullif(p.full_name, ''), p.email) FROM public.profiles p WHERE p.id = ANY (p_users) ORDER BY p.full_name);
  END IF;

  INSERT INTO public.mail_messages (id, thread_id, sender_id, sender_name, from_team, subject, body, to_label, attachments)
  VALUES (v_id, v_id, auth.uid(), coalesce(nullif(v_me.full_name, ''), 'STEP Team'), true,
          btrim(p_subject), btrim(p_body), coalesce(array_to_string(v_labels, ', '), ''), coalesce(p_attachments, '[]'::jsonb));

  INSERT INTO public.mail_recipients (message_id, user_id)
  SELECT v_id, p.id FROM public.profiles p
  WHERE p.id <> auth.uid() AND p.role <> 'guest'
    AND (p_everyone
         OR p.id = ANY (p_users)
         OR p.team_id = ANY (p_teams)
         OR coalesce(p.teams, '{}') && p_teams
         OR p.role = ANY (p_roles)
         OR coalesce(p.roles, '{}') && p_roles)
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS v_n = ROW_COUNT;

  IF v_n = 0 THEN RAISE EXCEPTION 'Nobody matches those recipients yet.'; END IF;
  UPDATE public.mail_messages SET to_count = v_n WHERE id = v_id;
  RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.mail_send(text, text, uuid[], text[], text[], boolean, jsonb, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.mail_send(text, text, uuid[], text[], text[], boolean, jsonb, uuid) TO authenticated;

-- ---------- reply ----------
-- Anyone else: the reply goes privately to the STEP Team.
-- The STEP Team: the reply goes to the one person whose message it answers.
CREATE OR REPLACE FUNCTION public.mail_reply(p_parent uuid, p_body text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_par  public.mail_messages;
  v_root public.mail_messages;
  v_me   public.profiles;
  v_team boolean := public.is_step_team();
  v_id   uuid := gen_random_uuid();
  v_subj text;
BEGIN
  SELECT * INTO v_par FROM public.mail_messages WHERE id = p_parent;
  IF NOT FOUND THEN RAISE EXCEPTION 'That message no longer exists.'; END IF;
  SELECT * INTO v_root FROM public.mail_messages WHERE id = v_par.thread_id;
  SELECT * INTO v_me FROM public.profiles WHERE id = auth.uid();
  v_subj := 'Re: ' || regexp_replace(coalesce(v_root.subject, v_par.subject), '^(Re:\s*)+', '', 'i');

  IF v_team THEN
    IF v_par.from_team OR v_par.sender_id IS NULL THEN
      RAISE EXCEPTION 'Pick the person''s message you are answering.';
    END IF;
    INSERT INTO public.mail_messages (id, thread_id, parent_id, sender_id, sender_name, from_team, subject, body, to_label, to_count)
    VALUES (v_id, v_par.thread_id, v_par.id, auth.uid(), coalesce(nullif(v_me.full_name, ''), 'STEP Team'), true,
            v_subj, btrim(p_body), v_par.sender_name, 1);
    INSERT INTO public.mail_recipients (message_id, user_id) VALUES (v_id, v_par.sender_id);
    -- answering a reply also marks it as seen by the team
    UPDATE public.mail_messages SET team_read_at = coalesce(team_read_at, now()) WHERE id = v_par.id;
  ELSE
    IF NOT (v_par.sender_id = auth.uid()
            OR EXISTS (SELECT 1 FROM public.mail_recipients r WHERE r.message_id = v_par.id AND r.user_id = auth.uid())) THEN
      RAISE EXCEPTION 'You can only reply to messages sent to you.';
    END IF;
    -- a light brake on floods: 20 replies per 10 minutes
    IF (SELECT count(*) FROM public.mail_messages
        WHERE sender_id = auth.uid() AND created_at > now() - interval '10 minutes') >= 20 THEN
      RAISE EXCEPTION 'You have sent a lot of replies just now. Please wait a few minutes.';
    END IF;
    INSERT INTO public.mail_messages (id, thread_id, parent_id, sender_id, sender_name, from_team, subject, body, to_label, to_count)
    VALUES (v_id, v_par.thread_id, v_par.id, auth.uid(), coalesce(nullif(v_me.full_name, ''), v_me.email), false,
            v_subj, btrim(p_body), 'STEP Team', 0);
  END IF;
  RETURN v_id;
END $$;
REVOKE ALL ON FUNCTION public.mail_reply(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.mail_reply(uuid, text) TO authenticated;

-- ---------- mark as read ----------
CREATE OR REPLACE FUNCTION public.mail_mark_read(p_ids uuid[])
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.mail_recipients SET read_at = now()
   WHERE user_id = auth.uid() AND message_id = ANY (p_ids) AND read_at IS NULL;
  IF public.is_step_team() THEN
    UPDATE public.mail_messages SET team_read_at = now()
     WHERE id = ANY (p_ids) AND NOT from_team AND team_read_at IS NULL;
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.mail_mark_read(uuid[]) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.mail_mark_read(uuid[]) TO authenticated;

-- ---------- delete a message sent by mistake (STEP Team only) ----------
-- (the site removes the message's files first, through the storage API)
CREATE OR REPLACE FUNCTION public.mail_delete(p_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_step_team() THEN RAISE EXCEPTION 'Only the STEP Team can delete messages.'; END IF;
  DELETE FROM public.mail_messages WHERE id = p_id;
END $$;
REVOKE ALL ON FUNCTION public.mail_delete(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.mail_delete(uuid) TO authenticated;

-- ---------- attachments: private "mail" bucket, 50 MB a file ----------
-- Files sit under <message id>/<file name>. The STEP Team uploads; a
-- person can open a file only if that message was sent to them.
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('mail', 'mail', false, 52428800)
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 52428800;

DROP POLICY IF EXISTS "mail_files_select" ON storage.objects;
CREATE POLICY "mail_files_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'mail' AND (public.is_step_team() OR EXISTS (
    SELECT 1 FROM public.mail_recipients r
    WHERE r.message_id::text = (storage.foldername(name))[1] AND r.user_id = auth.uid())));

DROP POLICY IF EXISTS "mail_files_insert" ON storage.objects;
CREATE POLICY "mail_files_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'mail' AND public.is_step_team());

DROP POLICY IF EXISTS "mail_files_delete" ON storage.objects;
CREATE POLICY "mail_files_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'mail' AND public.is_step_team());

-- ---------- check ----------
SELECT 'mail_messages' AS made, count(*) FROM public.mail_messages
UNION ALL SELECT 'mail_recipients', count(*) FROM public.mail_recipients
UNION ALL SELECT 'mail bucket', count(*) FROM storage.buckets WHERE id = 'mail';
