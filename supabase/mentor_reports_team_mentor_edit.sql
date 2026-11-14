-- STEP Hub — mentors' accomplishment reports: the team's own mentor and admins can always edit
-- Run in the Supabase SQL Editor. Safe to run again.

-- an admin may start or fill in any report without becoming its owner;
-- a mentor may start a report for their own team
drop policy if exists mentor_reports_insert on public.mentor_reports;
create policy mentor_reports_insert on public.mentor_reports
  for insert to authenticated
  with check (public.has_role('admin')
              or (public.has_role('mentor') and mentor_id = auth.uid()));

-- a team's own mentor can always change that team's reports, whoever saved first;
-- other mentors only the ones they own; admins any
drop policy if exists mentor_reports_update on public.mentor_reports;
create policy mentor_reports_update on public.mentor_reports
  for update to authenticated
  using (public.has_role('admin')
         or (public.has_role('mentor') and (mentor_id = auth.uid() or mentor_id is null
                                            or team_id = public.get_user_team_id())))
  with check (public.has_role('admin')
              or (public.has_role('mentor') and (mentor_id = auth.uid()
                                                 or team_id = public.get_user_team_id())));

-- reports that an admin or another account started: give each back to its team's mentor
update public.mentor_reports r
   set mentor_id = p.id
  from public.profiles p
 where p.team_id = r.team_id
   and (p.role = 'mentor' or 'mentor' = any(p.roles))
   and r.mentor_id is distinct from p.id
   and not exists (select 1 from public.profiles q where q.id = r.mentor_id and q.team_id = r.team_id
                   and (q.role = 'mentor' or 'mentor' = any(q.roles)));

-- check: every report and who owns it
select r.week_code, r.team_id, r.mentor_name, p.email as owner
from public.mentor_reports r left join public.profiles p on p.id = r.mentor_id
order by r.team_id, r.week_code;
