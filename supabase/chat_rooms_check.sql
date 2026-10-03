-- =====================================================================
-- STEP GC: who can open which room. A read-only check: it changes nothing.
-- Run in the Supabase SQL Editor after chat_rooms.sql. For every account
-- it asks the database's own rule (can_use_room) which rooms that person
-- may read and post in, and lists them.
-- =====================================================================
CREATE OR REPLACE FUNCTION pg_temp.gc_room_check()
RETURNS TABLE (person text, email text, role text, team text, rooms text)
LANGUAGE plpgsql AS $$
DECLARE p record; rs text;
BEGIN
  FOR p IN SELECT * FROM public.profiles ORDER BY role, team_id NULLS LAST, email LOOP
    PERFORM set_config('request.jwt.claims', json_build_object('sub', p.id, 'email', p.email, 'role', 'authenticated')::text, true);
    SELECT string_agg(r, ', ' ORDER BY o) INTO rs
      FROM (SELECT r, o FROM unnest(ARRAY['fam','group:dost','group:mentors','group:panels',
              'team:g1','team:g2','team:g3','team:g4','team:g5','team:g6','team:g7','team:g8','team:g9','team:g10']) WITH ORDINALITY AS t(r, o)) x
     WHERE public.can_use_room(r);
    person := coalesce(p.full_name, ''); email := p.email; role := array_to_string(coalesce(p.roles, ARRAY[p.role]), '+');
    team := array_to_string(array_remove(ARRAY[p.team_id] || coalesce(p.teams, ARRAY[]::text[]), NULL), ','); rooms := rs;
    RETURN NEXT;
  END LOOP;
END $$;
SELECT * FROM pg_temp.gc_room_check();
