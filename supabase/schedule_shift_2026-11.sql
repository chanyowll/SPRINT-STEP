do $$
declare done_before boolean; r record;
begin
  -- run-once guard: if the shift has already been applied, do nothing
  select exists (select 1 from information_schema.tables
                  where table_schema = 'backup' and table_name = 'schedule_shift_2026_11_done') into done_before;
  if done_before then raise notice 'The schedule shift was already applied. Nothing changed.'; return; end if;

  create schema if not exists backup;
  create table if not exists backup.cal_links_2026_11_16        as select * from public.cal_links;
  create table if not exists backup.cal_mentoring_2026_11_16    as select * from public.cal_mentoring;
  create table if not exists backup.session_trainers_2026_11_16 as select * from public.session_trainers;

  -- 1. Zoom links: moved one at a time, latest first, so no new date collides with an old one
  for r in
    select l.session_key,
           (m.new_start + (substr(l.session_key,1,10)::date - m.old_start))::text || substr(l.session_key,11) as new_key
      from public.cal_links l
      join (values
        ('2026-11-16'::date,'2026-11-22'::date,'2026-11-23'::date), ('2026-11-23','2026-11-29','2026-11-30'),
        ('2026-11-30','2026-12-06','2026-12-07'), ('2026-12-07','2026-12-13','2026-12-14'),
        ('2026-12-14','2026-12-20','2027-01-04'), ('2027-01-04','2027-01-10','2027-01-11'),
        ('2027-01-11','2027-01-17','2027-01-18'), ('2027-01-18','2027-01-24','2027-01-25'),
        ('2027-01-25','2027-01-31','2027-02-01'), ('2027-02-08','2027-02-14','2027-02-15')) as m(old_start, old_end, new_start)
        on substr(l.session_key,1,10)::date between m.old_start and m.old_end
     order by l.session_key desc
  loop
    update public.cal_links set session_key = r.new_key where session_key = r.session_key;
  end loop;

  -- 2. mentoring sessions: same weekday, in the new week
  update public.cal_mentoring c set on_date = m.new_start + (c.on_date - m.old_start)
    from (values
    ('2026-11-16'::date,'2026-11-22'::date,'2026-11-23'::date), ('2026-11-23','2026-11-29','2026-11-30'),
    ('2026-11-30','2026-12-06','2026-12-07'), ('2026-12-07','2026-12-13','2026-12-14'),
    ('2026-12-14','2026-12-20','2027-01-04'), ('2027-01-04','2027-01-10','2027-01-11'),
    ('2027-01-11','2027-01-17','2027-01-18'), ('2027-01-18','2027-01-24','2027-01-25'),
    ('2027-01-25','2027-01-31','2027-02-01'), ('2027-02-08','2027-02-14','2027-02-15')) as m(old_start, old_end, new_start)
   where c.on_date between m.old_start and m.old_end;

  -- 3. trainers' criteria-editing windows, Week 3 onward
  update public.session_trainers t set week_starts = m.new_start, week_ends = m.new_start + 6
    from (values
    ('2026-11-16'::date,'2026-11-23'::date), ('2026-11-23','2026-11-30'), ('2026-11-30','2026-12-07'),
    ('2026-12-07','2026-12-14'), ('2026-12-14','2027-01-04'), ('2027-01-04','2027-01-11'),
    ('2027-01-11','2027-01-18'), ('2027-01-18','2027-01-25'), ('2027-01-25','2027-02-01'),
    ('2027-02-08','2027-02-15')) as m(old_start, new_start)
   where t.week_starts = m.old_start
     and t.session_code in ('W3','W4','W5','W6','W7','W8','W9','W10','W11','W12');

  create table backup.schedule_shift_2026_11_done (done_at timestamptz default now());
  insert into backup.schedule_shift_2026_11_done default values;
  alter table backup.cal_links_2026_11_16 enable row level security;
  alter table backup.cal_mentoring_2026_11_16 enable row level security;
  alter table backup.session_trainers_2026_11_16 enable row level security;
  alter table backup.schedule_shift_2026_11_done enable row level security;
end $$;

-- check
select 'link' as what, session_key as item, '' as extra from public.cal_links where session_key >= '2026-11-16'
union all select 'mentoring', on_date::text, team_id from public.cal_mentoring where on_date >= '2026-11-16'
union all select 'editor window', session_code, week_starts::text || ' – ' || week_ends::text from public.session_trainers
order by 1, 2;
