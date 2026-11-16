-- STEP Hub — "Week 1.1 · Market Research" (Nov 9–15) and "Week 2 · Value Proposition" (Nov 16–22)
-- Everything saved for the Nov 9–15 week under "Week 2" moves to "Week 1.1", so Week 2 is
-- free for the Value Proposition week. One block: it all happens or nothing does. Runs once.
-- A backup copy of every table it touches is kept in the "backup" schema first.
-- Kept under Week 2 on purpose: the session materials and recording of the Nov 10 learning
-- session (it was on the value proposition), so teams see them this week.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'backup' and table_name = 'week_1_1_split_done') then
    raise notice 'Week 1.1 was already set up. Nothing changed.'; return;
  end if;
  create schema if not exists backup;
  create table if not exists backup.attendance_w2_2026_11_16       as select * from public.attendance       where session_code like 'W2-%';
  create table if not exists backup.panel_sheets_w2_2026_11_16     as select * from public.panel_sheets     where session_code = 'W2';
  create table if not exists backup.panel_reports_w2_2026_11_16    as select * from public.panel_reports    where session_code = 'W2';
  create table if not exists backup.score_sheets_w2_2026_11_16     as select * from public.score_sheets     where code = 'W2';
  create table if not exists backup.mentor_reports_w2_2026_11_16   as select * from public.mentor_reports   where week_code = 'W2';
  create table if not exists backup.submissions_w2_2026_11_16      as select * from public.submissions      where week_no = 2;
  create table if not exists backup.assignments_w2_2026_11_16      as select * from public.assignments      where week_no = 2;
  create table if not exists backup.session_trainers_w2_2026_11_16 as select * from public.session_trainers where session_code = 'W2';

  -- the modules list (other tables point to it) gets a Week 1.1 entry, copied from Week 2
  alter table public.modules alter column week_no type numeric;
  insert into public.modules
    select (jsonb_populate_record(null::public.modules,
             to_jsonb(m) || '{"code": "W1.1", "week_no": 1.1, "title": "Market Research"}'::jsonb)).*
      from public.modules m where m.code = 'W2'
    on conflict (code) do nothing;
  update public.modules set title = 'Value Proposition' where code = 'W2';

  -- week numbers can now be 1.1
  alter table public.assignments    alter column week_no type numeric;
  alter table public.submissions    alter column week_no type numeric;
  alter table public.mentor_reports alter column week_no type numeric;
  alter table public.panel_reports  alter column week_no type numeric;

  update public.attendance
     set session_code = 'W1.1' || substr(session_code, 3),
         session_label = regexp_replace(session_label, '^W2\M', 'W1.1')
   where session_code like 'W2-%';
  update public.panel_sheets   set session_code = 'W1.1' where session_code = 'W2';
  update public.panel_reports  set session_code = 'W1.1', week_no = 1.1 where session_code = 'W2';
  update public.score_sheets   set code = 'W1.1' where code = 'W2';
  update public.mentor_reports set week_code = 'W1.1', week_no = 1.1 where week_code = 'W2';
  update public.submissions    set week_no = 1.1, module_code = case when module_code = 'W2' then 'W1.1' else module_code end where week_no = 2;
  update public.assignments    set week_no = 1.1 where week_no = 2;

  -- criteria editing: Sir Bien keeps Market Research (now W1.1); Sir Tony has the Value Proposition week
  update public.session_trainers set session_code = 'W1.1'
   where session_code = 'W2' and lower(trainer_email) = 'bgarcia@ateneo.edu';
  update public.session_trainers set week_starts = '2026-11-16', week_ends = '2026-11-22'
   where session_code = 'W2';

  create table backup.week_1_1_split_done (done_at timestamptz default now());
  insert into backup.week_1_1_split_done default values;
  alter table backup.attendance_w2_2026_11_16 enable row level security;
  alter table backup.panel_sheets_w2_2026_11_16 enable row level security;
  alter table backup.panel_reports_w2_2026_11_16 enable row level security;
  alter table backup.score_sheets_w2_2026_11_16 enable row level security;
  alter table backup.mentor_reports_w2_2026_11_16 enable row level security;
  alter table backup.submissions_w2_2026_11_16 enable row level security;
  alter table backup.assignments_w2_2026_11_16 enable row level security;
  alter table backup.session_trainers_w2_2026_11_16 enable row level security;
  alter table backup.week_1_1_split_done enable row level security;
end $$;

-- check: what is now saved under Week 1.1 and Week 2
select 'attendance' as what, session_code as week, count(*)::text as rows from public.attendance where session_code like 'W1.1-%' or session_code like 'W2-%' group by session_code
union all select 'panel sheets', session_code, count(*)::text from public.panel_sheets where session_code in ('W1.1','W2') group by session_code
union all select 'mentor reports', week_code, count(*)::text from public.mentor_reports where week_code in ('W1.1','W2') group by week_code
union all select 'submissions', week_no::text, count(*)::text from public.submissions where week_no in (1.1, 2) group by week_no
union all select 'assignment', week_no::text, coalesce(left(instructions, 40), '') from public.assignments where week_no in (1.1, 2, 3)
union all select 'criteria editor', session_code, trainer_email from public.session_trainers where session_code in ('W1.1','W2')
order by 1, 2;
