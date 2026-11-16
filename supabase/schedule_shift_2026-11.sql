-- STEP Hub — schedule moved one week later from Week 3 (no sessions Nov 16–22, 2026)
-- Run once in the Supabase SQL Editor. It moves what is stored by date, so it matches the site:
--   · the Zoom links saved on the calendar (keyed by date)
--   · the teams' mentoring sessions on the calendar
--   · the trainers' criteria-editing windows (Week 3 onward)
-- Events the STEP Team added by hand (cal_events) are left where they are.
-- A safety copy of each table is kept in the "backup" schema first.

create schema if not exists backup;
create table if not exists backup.cal_links_2026_11_16        as select * from public.cal_links;
create table if not exists backup.cal_mentoring_2026_11_16    as select * from public.cal_mentoring;
create table if not exists backup.session_trainers_2026_11_16 as select * from public.session_trainers;
alter table backup.cal_links_2026_11_16 enable row level security;
alter table backup.cal_mentoring_2026_11_16 enable row level security;
alter table backup.session_trainers_2026_11_16 enable row level security;

-- old program week → new program week (the Christmas break, Dec 21 – Jan 3, stays put)
create temp table wk_map (old_start date, old_end date, new_start date);
insert into wk_map values
  ('2026-11-16','2026-11-22','2026-11-23'),   -- W3
  ('2026-11-23','2026-11-29','2026-11-30'),   -- W4
  ('2026-11-30','2026-12-06','2026-12-07'),   -- W5
  ('2026-12-07','2026-12-13','2026-12-14'),   -- W6 checkpoint
  ('2026-12-14','2026-12-20','2027-01-04'),   -- W7 (now after the break)
  ('2027-01-04','2027-01-10','2027-01-11'),   -- W8
  ('2027-01-11','2027-01-17','2027-01-18'),   -- W9
  ('2027-01-18','2027-01-24','2027-01-25'),   -- W10
  ('2027-01-25','2027-01-31','2027-02-01'),   -- W11
  ('2027-02-08','2027-02-14','2027-02-15');   -- W12 Demo Day / Graduation

-- 1. Zoom links: rebuilt under their new dates in one go (old and new dates overlap)
create temp table links_new as
  select (m.new_start + (substr(l.session_key,1,10)::date - m.old_start))::text || substr(l.session_key,11) as session_key,
         l.zoom_url, l.updated_by, l.updated_at, l.session_key as old_key
  from public.cal_links l
  join wk_map m on substr(l.session_key,1,10)::date between m.old_start and m.old_end;
delete from public.cal_links where session_key in (select old_key from links_new);
insert into public.cal_links (session_key, zoom_url, updated_by, updated_at)
  select session_key, zoom_url, updated_by, updated_at from links_new
  on conflict (session_key) do update set zoom_url = excluded.zoom_url;

-- 2. mentoring sessions: same weekday, in the new week
update public.cal_mentoring c
   set on_date = m.new_start + (c.on_date - m.old_start)
  from wk_map m
 where c.on_date between m.old_start and m.old_end;

-- 3. criteria-editing windows for Week 3 onward
update public.session_trainers t
   set week_starts = m.new_start, week_ends = m.new_start + 6
  from wk_map m
 where t.week_starts = m.old_start
   and t.session_code in ('W3','W4','W5','W6','W7','W8','W9','W10','W11','W12');

-- check
select 'link' as what, session_key as item, '' as extra from public.cal_links where session_key >= '2026-11-16'
union all select 'mentoring', on_date::text, team_id from public.cal_mentoring where on_date >= '2026-11-16'
union all select 'editor window', session_code, week_starts::text || ' – ' || week_ends::text from public.session_trainers
order by 1, 2;

drop table if exists wk_map, links_new;
