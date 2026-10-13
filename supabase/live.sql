-- =====================================================================
-- STEP Hub — live updates
-- Run once in the Supabase SQL Editor. Safe to run more than once.
--
-- 1. "Refresh everyone's site" (tech console): each press adds a row to
--    site_signals; every open page hears it and reloads quietly.
--    Anyone may read the signals (they carry nothing but a time);
--    only the tech team may send one.
-- 2. FASTRAC proposal: teammates' saves arrive live (capstone_items).
--    The existing access rules still decide who receives what — a team
--    only ever receives its own proposal.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.site_signals (
  id          BIGSERIAL PRIMARY KEY,
  kind        TEXT NOT NULL DEFAULT 'refresh' CHECK (kind IN ('refresh')),
  created_by  UUID DEFAULT auth.uid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_signals ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.site_signals TO anon, authenticated;
GRANT INSERT ON public.site_signals TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.site_signals_id_seq TO authenticated;

DROP POLICY IF EXISTS site_signals_read ON public.site_signals;
CREATE POLICY site_signals_read ON public.site_signals FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS site_signals_send ON public.site_signals;
CREATE POLICY site_signals_send ON public.site_signals FOR INSERT TO authenticated
  WITH CHECK (public.is_tech());

-- put the two tables on Supabase's live feed (skipped if already there)
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['site_signals', 'capstone_items'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
                   WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;

-- check
SELECT tablename FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND schemaname = 'public' ORDER BY tablename;
