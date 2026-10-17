-- SFRSCC (FEU Tech, team g9): participants + their sign-up emails
INSERT INTO public.role_invites (email, role, role_label, full_name, initials, team_id, institution) VALUES
('najimenez@feutech.edu.ph','participant','Participant (SFRSCC)','Norman Nicole Jimenez','NJ','g9','Far Eastern University – Institute of Technology'),
('scclemente@feutech.edu.ph','participant','Participant (SFRSCC)','Stephen John Clemente','SC','g9','Far Eastern University – Institute of Technology'),
('arnunez@feutech.edu.ph','participant','Participant (SFRSCC)','Angelou Nunez','AN','g9','Far Eastern University – Institute of Technology'),
('dddavid@feutech.edu.ph','participant','Participant (SFRSCC)','Daryl David','DD','g9','Far Eastern University – Institute of Technology')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, role_label = EXCLUDED.role_label,
  full_name = EXCLUDED.full_name, initials = EXCLUDED.initials, team_id = EXCLUDED.team_id, institution = EXCLUDED.institution;

INSERT INTO public.team_members (team_id, name, role, initials, sort_order) VALUES
('g9','Norman Nicole Jimenez','Member','NJ',1),
('g9','Stephen John Clemente','Member','SC',2),
('g9','Angelou Nunez','Member','AN',3),
('g9','Daryl David','Member','DD',4);
