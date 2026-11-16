do $$
declare r record;
begin
  if exists (select 1 from information_schema.tables where table_schema = 'backup' and table_name = 'schedule_shift_w11_done') then
    raise notice 'Week 11 was already moved. Nothing changed.'; return;
  end if;
  -- Week 11: Feb 1–7 → Feb 8–14 (Zoom links, mentoring, criteria-editing window)
  for r in select session_key from public.cal_links
            where substr(session_key,1,10)::date between '2027-02-01' and '2027-02-07' order by session_key desc loop
    update public.cal_links set session_key = (substr(r.session_key,1,10)::date + 7)::text || substr(r.session_key,11)
     where session_key = r.session_key;
  end loop;
  update public.cal_mentoring set on_date = on_date + 7 where on_date between '2027-02-01' and '2027-02-07';
  update public.session_trainers set week_starts = '2027-02-08', week_ends = '2027-02-14'
   where session_code = 'W11' and week_starts = '2027-02-01';
  create table backup.schedule_shift_w11_done (done_at timestamptz default now());
  insert into backup.schedule_shift_w11_done default values;
  alter table backup.schedule_shift_w11_done enable row level security;
end $$;

select 'link' as what, session_key as item, '' as extra from public.cal_links where session_key >= '2027-02-01'
union all select 'mentoring', on_date::text, team_id from public.cal_mentoring where on_date >= '2027-02-01'
union all select 'editor window', session_code, week_starts::text || ' – ' || week_ends::text from public.session_trainers where session_code in ('W11','W12')
order by 1, 2;
