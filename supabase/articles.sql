-- =====================================================================
-- STEP Hub: Articles (Home tab · "Articles and publications")
--   The tech team pastes the link to a published article in the Tech
--   console. article_preview() reads that page (its og:/twitter:/<title>
--   tags) and returns the title, summary, picture, site and date; the
--   console saves the result to public.articles. Home lists the rows
--   that are shown, newest first.
--   Only the tech team (is_tech()) can read the preview or change rows.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- ---------- who is the tech team ----------
CREATE OR REPLACE FUNCTION public.is_tech() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = ANY (ARRAY['cperote@ateneo.edu', 'joshguico@gmail.com'])
$$;
GRANT EXECUTE ON FUNCTION public.is_tech() TO anon, authenticated;

-- ---------- the articles ----------
CREATE TABLE IF NOT EXISTS public.articles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url          text NOT NULL UNIQUE CHECK (url ~* '^https?://'),
  title        text NOT NULL CHECK (length(btrim(title)) > 0),
  excerpt      text,
  image_url    text,
  site_name    text,
  author       text,
  kind         text NOT NULL DEFAULT 'article' CHECK (kind IN ('article', 'publication')),
  published_at date,
  shown        boolean NOT NULL DEFAULT true,
  sort_order   integer,
  added_by     uuid DEFAULT auth.uid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS articles_list_idx ON public.articles (shown, published_at DESC NULLS LAST, created_at DESC);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS articles_read_public ON public.articles;
CREATE POLICY articles_read_public ON public.articles FOR SELECT TO anon, authenticated
  USING (shown OR public.is_tech());
DROP POLICY IF EXISTS articles_insert_tech ON public.articles;
CREATE POLICY articles_insert_tech ON public.articles FOR INSERT TO authenticated WITH CHECK (public.is_tech());
DROP POLICY IF EXISTS articles_update_tech ON public.articles;
CREATE POLICY articles_update_tech ON public.articles FOR UPDATE TO authenticated USING (public.is_tech()) WITH CHECK (public.is_tech());
DROP POLICY IF EXISTS articles_delete_tech ON public.articles;
CREATE POLICY articles_delete_tech ON public.articles FOR DELETE TO authenticated USING (public.is_tech());
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;

-- ---------- reading a link ----------
CREATE OR REPLACE FUNCTION public._html_unescape(t text) RETURNS text
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE m text[];
BEGIN
  IF t IS NULL THEN RETURN NULL; END IF;
  t := replace(replace(replace(replace(replace(replace(replace(t,
         '&quot;', '"'), '&#39;', ''''), '&apos;', ''''), '&lt;', '<'), '&gt;', '>'), '&nbsp;', ' '), '&ndash;', '–');
  t := replace(replace(replace(replace(t, '&mdash;', '—'), '&rsquo;', '’'), '&lsquo;', '‘'), '&hellip;', '…');
  t := replace(replace(t, '&ldquo;', '“'), '&rdquo;', '”');
  LOOP
    m := regexp_match(t, '&#(x[0-9a-fA-F]+|[0-9]+);');
    EXIT WHEN m IS NULL;
    t := replace(t, '&#' || m[1] || ';',
                 chr(CASE WHEN m[1] ILIKE 'x%' THEN ('x' || lpad(substr(m[1], 2), 8, '0'))::bit(32)::int ELSE m[1]::int END));
  END LOOP;
  t := replace(t, '&amp;', '&');
  RETURN btrim(regexp_replace(t, '\s+', ' ', 'g'));
END $$;

CREATE OR REPLACE FUNCTION public._html_meta(html text, keys text[]) RETURNS text
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE k text; tag text; v text;
BEGIN
  FOREACH k IN ARRAY keys LOOP
    FOR tag IN SELECT (regexp_matches(html, '<meta\s[^>]*>', 'gi'))[1] LOOP
      IF tag ~* ('(property|name|itemprop)\s*=\s*["'']' || k || '["'']') THEN
        v := (regexp_match(tag, 'content\s*=\s*"([^"]*)"', 'i'))[1];
        IF v IS NULL THEN v := (regexp_match(tag, 'content\s*=\s*''([^'']*)''', 'i'))[1]; END IF;
        IF nullif(btrim(v), '') IS NOT NULL THEN RETURN public._html_unescape(v); END IF;
      END IF;
    END LOOP;
  END LOOP;
  RETURN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.article_preview(p_url text) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE
  res extensions.http_response; html text; base text; img text; pub text; host text;
  cur text; loc text; hops int := 0;
BEGIN
  IF NOT public.is_tech() THEN RAISE EXCEPTION 'Only the STEP tech team can add articles.'; END IF;
  p_url := btrim(coalesce(p_url, ''));
  IF p_url !~* '^https?://[^/\s]+\.[^/\s]+' THEN RAISE EXCEPTION 'Paste the full link, starting with https://'; END IF;

  PERFORM extensions.http_set_curlopt('CURLOPT_TIMEOUT', '8');
  cur := p_url;
  LOOP
    host := lower((regexp_match(cur, '^https?://([^/:?#]+)', 'i'))[1]);
    IF host IS NULL OR host !~ '\.' OR host ~ '^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[01])\.)' THEN
      RAISE EXCEPTION 'That link points to a private address.';
    END IF;

    SELECT * INTO res FROM extensions.http((
      'GET', cur,
      ARRAY[extensions.http_header('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'),
            extensions.http_header('Accept', 'text/html,application/xhtml+xml'),
            extensions.http_header('Accept-Language', 'en')],
      NULL, NULL)::extensions.http_request);

    EXIT WHEN res.status NOT IN (301, 302, 303, 307, 308) OR hops >= 5;
    SELECT value INTO loc FROM unnest(res.headers) WHERE lower(field) = 'location' LIMIT 1;
    EXIT WHEN loc IS NULL;
    base := (regexp_match(cur, '^(https?://[^/?#]+)', 'i'))[1];
    IF loc ~* '^https?://' THEN cur := loc;
    ELSIF loc LIKE '//%' THEN cur := 'https:' || loc;
    ELSIF loc LIKE '/%' THEN cur := base || loc;
    ELSE cur := base || '/' || loc; END IF;
    hops := hops + 1;
  END LOOP;
  PERFORM extensions.http_reset_curlopt();

  IF res.status >= 400 THEN RAISE EXCEPTION 'The site answered with error %. Check the link opens in a browser.', res.status; END IF;
  html := left(coalesce(res.content, ''), 600000);
  base := (regexp_match(cur, '^(https?://[^/?#]+)', 'i'))[1];

  img := public._html_meta(html, ARRAY['og:image:secure_url', 'og:image', 'twitter:image', 'twitter:image:src', 'image']);
  IF img IS NOT NULL THEN
    IF img LIKE '//%' THEN img := 'https:' || img;
    ELSIF img LIKE '/%' THEN img := base || img;
    ELSIF img !~* '^https?://' THEN img := base || '/' || img; END IF;
  END IF;
  pub := public._html_meta(html, ARRAY['article:published_time', 'og:published_time', 'datePublished', 'pubdate', 'date', 'dc.date', 'parsely-pub-date']);

  RETURN jsonb_build_object(
    'url', p_url,
    'title', coalesce(public._html_meta(html, ARRAY['og:title', 'twitter:title']),
                      public._html_unescape((regexp_match(html, '<title[^>]*>([^<]*)</title>', 'i'))[1])),
    'excerpt', public._html_meta(html, ARRAY['og:description', 'twitter:description', 'description']),
    'image_url', img,
    'site_name', coalesce(public._html_meta(html, ARRAY['og:site_name', 'application-name']), regexp_replace(host, '^www\.', '')),
    'author', public._html_meta(html, ARRAY['author', 'article:author', 'parsely-author']),
    'published_at', CASE WHEN pub ~ '^\d{4}-\d{2}-\d{2}' THEN left(pub, 10) ELSE NULL END
  );
END $$;
REVOKE ALL ON FUNCTION public.article_preview(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.article_preview(text) TO authenticated;


-- ---------- order set by hand (1 = the big article on Home) ----------
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS sort_order integer;
UPDATE public.articles a SET sort_order = r.rn
FROM (SELECT id, row_number() OVER (ORDER BY published_at DESC NULLS LAST, created_at DESC) AS rn FROM public.articles WHERE sort_order IS NULL) r
WHERE a.id = r.id AND a.sort_order IS NULL;

NOTIFY pgrst, 'reload schema';
