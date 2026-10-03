-- =====================================================================
-- STEP Hub: pictures in the STEP Fam group chat
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- A participant pastes (or attaches) a screenshot in the chat box. The
-- picture is stored in the private "chat-images" bucket under the sender's
-- own folder, and the message row points to it with image_path. Anyone
-- signed in can see the picture (they all read the chat); only the sender
-- can add or delete theirs, and the STEP team can delete any.
-- =====================================================================

ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS image_path text;
GRANT INSERT (image_path) ON public.chat_messages TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('chat-images', 'chat-images', false, 6291456, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 6291456,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

DROP POLICY IF EXISTS chat_images_select ON storage.objects;
CREATE POLICY chat_images_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'chat-images');

DROP POLICY IF EXISTS chat_images_insert ON storage.objects;
CREATE POLICY chat_images_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'chat-images' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS chat_images_delete ON storage.objects;
CREATE POLICY chat_images_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'chat-images'
         AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role('admin')));

NOTIFY pgrst, 'reload schema';
