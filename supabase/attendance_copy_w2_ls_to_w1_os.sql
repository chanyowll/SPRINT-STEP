-- Copy the attendance saved under Week 2 Learning (W2-LS) to Week 1 On-site (W1-OS).
-- The W2-LS rows are left in place; delete them on the site afterwards.
-- Run in the Supabase SQL Editor.

insert into public.attendance
  (team_id, member_name, session_code, session_label, session_type,
   status, present, note, session_date, recorded_by, updated_at)
select team_id, member_name, 'W1-OS', 'W1 On-site', 'onsite',
       status, present, note, date '2026-10-29', recorded_by, now()
from public.attendance
where session_code = 'W2-LS'
on conflict (team_id, session_code, member_name) do update
  set status = excluded.status,
      present = excluded.present,
      note = excluded.note,
      session_date = excluded.session_date,
      updated_at = now();

-- check: both sessions should show the same number of rows
select session_code, count(*) as rows, min(session_date) as date
from public.attendance
where session_code in ('W2-LS', 'W1-OS')
group by session_code
order by session_code;
