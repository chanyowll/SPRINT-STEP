-- =====================================================================
-- STEP Hub — Seed Data
-- Run AFTER schema.sql and rls.sql in your Supabase SQL Editor.
--
-- NOTE: The two user profiles (admin + SINAG participant) will be
-- created AFTER you sign up those accounts via the app.
-- Use the "assign_roles.sql" script after sign-up to set their roles.
-- =====================================================================

-- =====================================================================
-- COHORT
-- =====================================================================
INSERT INTO cohort (code, name, timezone, starts_on, ends_on, current_week) VALUES
  ('STEP3', 'SPRINT-STEP 3', 'Asia/Manila', '2027-06-15', '2027-11-30', 8);

-- =====================================================================
-- TEAMS — the 10 official STEP groups
-- =====================================================================
INSERT INTO teams (id, name, short, abbr, institution, city, region, about, technology_title, implementing_agency, mentor_id, mentor_name, panel_letter, logo, mark, initials, accent, glow) VALUES
  ('g1',  'POSTE (USC)',           'POSTE',            'USC',      'University of San Carlos',
   'Cebu City', 'Visayas',
   'POSTE (Interconnected Poste Kits for Environmental Sensing)',
   'Interconnected Poste Kits for Environmental Sensing',
   'University of San Carlos',
   'mn1', 'Mr. Antonio Feria', 'A', 'assets/logos/wm/usc.png', 'assets/logos/sm/usc.png',
   'PO', 'hsl(206 56% 56%)', 'hsla(206, 56%, 56%, .30)'),

  ('g2',  'SINAG (USM)',           'SINAG',            'USM',      'University of Southern Mindanao',
   'Kabacan, Cotabato', 'Mindanao',
   'Optimization of Irrigation Flow through Conduit Micro Hydropower to Generate Electricity for Off-grid Barangay of Kabacan, Cotabato (SINAG)',
   'Conduit micro hydropower utilizing irrigation canal flow for off-grid communities',
   'University of Southern Mindanao',
   'mn2', 'Dr. Proceso "Jon" Fernandez', 'A', 'assets/logos/wm/usm.png', 'assets/logos/sm/usm.png',
   'SI', 'hsl(196 56% 56%)', 'hsla(196, 56%, 56%, .30)'),

  ('g3',  'BRICKS (USC)',          'BRICKS',           'USC',      'University of San Carlos',
   'Cebu City', 'Visayas',
   'Conversion of Quarry Waste (Silt) Into High Temperature Refractory Bricks',
   'High-temperature refractory bricks synthesized from quarry silt waste',
   'University of San Carlos',
   'mn3', 'Ms. Janine Chiong', 'A', 'assets/logos/wm/usc.png', 'assets/logos/sm/usc.png',
   'BR', 'hsl(186 56% 56%)', 'hsla(186, 56%, 56%, .30)'),

  ('g4',  'Halal Blockchain (USEP)', 'Halal Blockchain', 'USeP',  'University of Southeastern Philippines',
   'Davao City', 'Mindanao',
   'Blockchain-Based Novel System/Application for Transparent Traceability of Halal-and-Tayeb Cacao Products',
   'Distributed ledger traceability platform for farm-to-table Halal cacao certification',
   'University of Southeastern Philippines',
   'mn4', 'Mr. Bryan Erfe', 'A', 'assets/logos/wm/usep.png', 'assets/logos/sm/usep.png',
   'HB', 'hsl(172 56% 56%)', 'hsla(172, 56%, 56%, .30)'),

  ('g5',  'Zeoskin (SLU)',         'Zeoskin',          'SLU',      'Saint Louis University',
   'Baguio City', 'Luzon',
   'ZEOSKIN: A Green Indoor Air Filter',
   'Natural zeolite-enhanced breathable bio-composite filter for indoor air quality',
   'Saint Louis University',
   'mn5', 'Ms. Pamela Ann Da Silva', 'B', 'assets/logos/wm/slu.png', 'assets/logos/sm/slu.png',
   'ZS', 'hsl(158 56% 56%)', 'hsla(158, 56%, 56%, .30)'),

  ('g6',  'CAPPS (MSU IIT)',       'CAPPS',            'MSU-IIT',  'Mindanao State University – Iligan Institute of Technology',
   'Iligan City', 'Mindanao',
   'CAPPS: Development of Alternative Ceramic Armor Plates from Philippine Silicates for Philippine Armed Personnel',
   'Ballistic-grade ceramic armor insert plates synthesized from domestic silicates',
   'Mindanao State University – Iligan Institute of Technology',
   'mn6', 'Ms. M.C.B. de Guzman', 'B', 'assets/logos/wm/msu-iit.png', 'assets/logos/sm/msu-iit.png',
   'CA', 'hsl(142 56% 56%)', 'hsla(142, 56%, 56%, .30)'),

  ('g7',  'SPArC (MSU IIT)',       'SPArC',            'MSU-IIT',  'Mindanao State University – Iligan Institute of Technology',
   'Iligan City', 'Mindanao',
   'Synergy in Solid Fuel Production from Agri-Industrial Biomass for Boiler Combustion (SPArC)',
   'Densified high-calorific solid biofuel pellets from agricultural waste for industrial boilers',
   'Mindanao State University – Iligan Institute of Technology',
   'mn7', 'Ingco', 'B', 'assets/logos/wm/msu-iit.png', 'assets/logos/sm/msu-iit.png',
   'SP', 'hsl(118 56% 56%)', 'hsla(118, 56%, 56%, .30)'),

  ('g8',  'meSHM (DLSU)',          'meSHM',            'DLSU',     'De La Salle University',
   'Manila', 'Luzon',
   'Intelligent Structural Health Monitoring via Mesh of Tremor Sensors (meSHM)',
   'Wireless sensor mesh for rapid post-earthquake structural integrity assessment',
   'De La Salle University',
   'mn8', 'Oppus', 'C', 'assets/logos/wm/dlsu.png', 'assets/logos/sm/dlsu.png',
   'MS', 'hsl(92 56% 56%)', 'hsla(92, 56%, 56%, .30)'),

  ('g9',  'SFRSCC (FEU Tech)',     'SFRSCC',           'FEU Tech', 'Far Eastern University – Institute of Technology',
   'Manila', 'Luzon',
   'Development of Fiber-Reinforced Self-Compacting Concrete (SFRSCC) for corrosion reduction',
   'Corrosion-inhibiting fiber-reinforced self-compacting concrete for coastal structures',
   'FEU Institute of Technology',
   'mn9', 'Miclat', 'C', 'assets/logos/wm/feu-tech.png', 'assets/logos/sm/feu-tech.png',
   'SF', 'hsl(62 56% 56%)', 'hsla(62, 56%, 56%, .30)'),

  ('g10', 'LASER (DOST PNRI)',     'LASER',            'DOST-PNRI','Department of Science and Technology – Philippine Nuclear Research Institute',
   'Quezon City', 'Luzon',
   'Luzon Arsenic Source Tracing and Extent Mapping with Risk Mitigation and Engineering Intervention (LASER)',
   'Isotopic tracing and point-of-use adsorbent cartridges for groundwater arsenic remediation',
   'DOST - Philippine Nuclear Research Institute',
   'mn10', 'Mr. Antonio Feria', 'C', 'assets/logos/wm/dost-pnri.png', 'assets/logos/sm/dost-pnri.png',
   'LA', 'hsl(38 56% 56%)', 'hsla(38, 56%, 56%, .30)');

-- =====================================================================
-- MODULES — the 14 curriculum modules
-- =====================================================================
INSERT INTO modules (code, week_no, title, session_hours, off_session_hrs, trainer) VALUES
  ('M1E', 0,  'Pathway Ideation Workshop',                     2.5, 0,   'Engr. Benjamin N. Mirasol'),
  ('M2',  1,  'Beachhead Markets and Customer Segments',        3,   2,   'Mr. Antonio Feria'),
  ('M3A', 2,  'Market Size Estimation and Market Research',     3,   1.5, 'Mr. Antonio Feria'),
  ('M3B', 3,  'From Understanding Use to Measured Value',       3,   1.5, 'Mr. Antonio Feria'),
  ('M4',  4,  'Competitive Advantage (VRIO, CPM)',              3,   2,   'Mr. G. Quitoriano'),
  ('M5',  5,  'Go-to-Market Plan and Lean Canvas',              3,   3,   'Mr. G. Quitoriano'),
  ('M6',  6,  'Business Model Validation',                      3,   4,   'Mr. G. Quitoriano'),
  ('M8',  7,  'Overview of IP & Basics of Patents',             3,   0,   'Dr. Proceso "Jon" Fernandez, with IPOPHL'),
  ('M10', 9,  'Discounted Cash Flow, ROI, 5-year Projection',  3,   2,   'Mr. M. Santos'),
  ('M11', 8,  'Selling Skill',                                  3,   1.5, 'Mr. G. Quitoriano'),
  ('M12', 10, 'Pitching Skill',                                 3,   2,   'Ms. D. Reyes'),
  ('M14', 11, 'FASTRAC Proposal Writing Workshop',              2,   3,   'AIPO Ideation Support');

-- =====================================================================
-- SINAG TEAM MEMBERS (g2)
-- =====================================================================
INSERT INTO team_members (team_id, name, role, initials, sort_order) VALUES
  ('g2', 'Engr. Mark Anthony',     'Entrepreneurial lead', 'MA', 1),
  ('g2', 'Dr. Cheryl Pangilinan',  'Technical lead',       'CP', 2),
  ('g2', 'Mr. Alvin Mendoza',      'Business development', 'AM', 3),
  ('g2', 'Ms. Fatima Salik',       'Field engineer',       'FS', 4),
  ('g2', 'Mr. Ronilo Datu',        'Community liaison',    'RD', 5);

-- =====================================================================
-- SINAG SCORES — sample data for weeks 1-7 (matching mock-data.js)
-- =====================================================================
INSERT INTO scores (team_id, module_code, week_no, score, panel_letter, scored_on, axis_label, full_label) VALUES
  ('g2', 'M2',  1, 3.30, 'A', '2027-06-26', 'Beachhead\nmarkets',     'Beachhead markets and customer segments'),
  ('g2', 'M3A', 2, 3.40, 'A', '2027-07-03', 'Market\nsize',           'Market size estimation and market research'),
  ('g2', 'M3B', 3, 3.50, 'A', '2027-07-10', 'Measured\nvalue',        'From understanding use to measured value'),
  ('g2', 'M4',  4, 3.45, 'A', '2027-07-17', 'Competitive\nadvantage', 'Competitive advantage (VRIO, CPM)'),
  ('g2', 'M5',  5, 3.20, 'A', '2027-07-24', 'Go-to-\nmarket',        'Go-to-Market Plan and Lean Canvas'),
  ('g2', 'M6',  6, 3.35, 'A', '2027-07-31', 'Business\nmodel',        'Business Model Validation'),
  ('g2', 'M8',  7, 3.25, 'A', '2027-08-07', 'IP &\nPatents',         'Overview of IP & Basics of Patents');

-- =====================================================================
-- SINAG ATTENDANCE (sample for weeks 1-4)
-- =====================================================================
INSERT INTO attendance (team_id, member_name, session_code, session_label, session_type, present) VALUES
  -- Week 1 Learning
  ('g2', 'Engr. Mark Anthony',    'M2-L',  'Wk 1 · Learning',  'learning', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M2-L',  'Wk 1 · Learning',  'learning', true),
  ('g2', 'Mr. Alvin Mendoza',     'M2-L',  'Wk 1 · Learning',  'learning', true),
  ('g2', 'Ms. Fatima Salik',      'M2-L',  'Wk 1 · Learning',  'learning', true),
  ('g2', 'Mr. Ronilo Datu',       'M2-L',  'Wk 1 · Learning',  'learning', false),
  -- Week 1 Feedback
  ('g2', 'Engr. Mark Anthony',    'M2-F',  'Wk 1 · Feedback',  'feedback', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M2-F',  'Wk 1 · Feedback',  'feedback', true),
  ('g2', 'Mr. Alvin Mendoza',     'M2-F',  'Wk 1 · Feedback',  'feedback', false),
  ('g2', 'Ms. Fatima Salik',      'M2-F',  'Wk 1 · Feedback',  'feedback', true),
  ('g2', 'Mr. Ronilo Datu',       'M2-F',  'Wk 1 · Feedback',  'feedback', true),
  -- Week 2 Learning
  ('g2', 'Engr. Mark Anthony',    'M3A-L', 'Wk 2 · Learning',  'learning', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M3A-L', 'Wk 2 · Learning',  'learning', true),
  ('g2', 'Mr. Alvin Mendoza',     'M3A-L', 'Wk 2 · Learning',  'learning', true),
  ('g2', 'Ms. Fatima Salik',      'M3A-L', 'Wk 2 · Learning',  'learning', true),
  ('g2', 'Mr. Ronilo Datu',       'M3A-L', 'Wk 2 · Learning',  'learning', true),
  -- Week 2 Feedback
  ('g2', 'Engr. Mark Anthony',    'M3A-F', 'Wk 2 · Feedback',  'feedback', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M3A-F', 'Wk 2 · Feedback',  'feedback', true),
  ('g2', 'Mr. Alvin Mendoza',     'M3A-F', 'Wk 2 · Feedback',  'feedback', true),
  ('g2', 'Ms. Fatima Salik',      'M3A-F', 'Wk 2 · Feedback',  'feedback', false),
  ('g2', 'Mr. Ronilo Datu',       'M3A-F', 'Wk 2 · Feedback',  'feedback', true),
  -- Week 3 Learning
  ('g2', 'Engr. Mark Anthony',    'M3B-L', 'Wk 3 · Learning',  'learning', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M3B-L', 'Wk 3 · Learning',  'learning', true),
  ('g2', 'Mr. Alvin Mendoza',     'M3B-L', 'Wk 3 · Learning',  'learning', true),
  ('g2', 'Ms. Fatima Salik',      'M3B-L', 'Wk 3 · Learning',  'learning', true),
  ('g2', 'Mr. Ronilo Datu',       'M3B-L', 'Wk 3 · Learning',  'learning', true),
  -- Week 3 Feedback
  ('g2', 'Engr. Mark Anthony',    'M3B-F', 'Wk 3 · Feedback',  'feedback', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M3B-F', 'Wk 3 · Feedback',  'feedback', false),
  ('g2', 'Mr. Alvin Mendoza',     'M3B-F', 'Wk 3 · Feedback',  'feedback', true),
  ('g2', 'Ms. Fatima Salik',      'M3B-F', 'Wk 3 · Feedback',  'feedback', true),
  ('g2', 'Mr. Ronilo Datu',       'M3B-F', 'Wk 3 · Feedback',  'feedback', true),
  -- Week 4 Learning
  ('g2', 'Engr. Mark Anthony',    'M4-L',  'Wk 4 · Learning',  'learning', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M4-L',  'Wk 4 · Learning',  'learning', true),
  ('g2', 'Mr. Alvin Mendoza',     'M4-L',  'Wk 4 · Learning',  'learning', true),
  ('g2', 'Ms. Fatima Salik',      'M4-L',  'Wk 4 · Learning',  'learning', true),
  ('g2', 'Mr. Ronilo Datu',       'M4-L',  'Wk 4 · Learning',  'learning', false),
  -- Week 4 Feedback
  ('g2', 'Engr. Mark Anthony',    'M4-F',  'Wk 4 · Feedback',  'feedback', true),
  ('g2', 'Dr. Cheryl Pangilinan', 'M4-F',  'Wk 4 · Feedback',  'feedback', true),
  ('g2', 'Mr. Alvin Mendoza',     'M4-F',  'Wk 4 · Feedback',  'feedback', true),
  ('g2', 'Ms. Fatima Salik',      'M4-F',  'Wk 4 · Feedback',  'feedback', true),
  ('g2', 'Mr. Ronilo Datu',       'M4-F',  'Wk 4 · Feedback',  'feedback', true);

-- =====================================================================
-- SINAG SUBMISSIONS (sample video hand-ins)
-- =====================================================================
INSERT INTO submissions (team_id, week_no, module_code, module_title, kind, status, submitted_at, deadline_at, hours_early) VALUES
  ('g2', 1, 'M2',  'Beachhead Markets',   'video', 'submitted', '2027-06-19T09:30:00+08:00', '2027-06-20T12:00:00+08:00', 26.5),
  ('g2', 2, 'M3A', 'Market Size',         'video', 'submitted', '2027-06-26T22:15:00+08:00', '2027-06-27T12:00:00+08:00', 13.75),
  ('g2', 3, 'M3B', 'Measured Value',       'video', 'submitted', '2027-07-04T11:45:00+08:00', '2027-07-04T12:00:00+08:00', 0.25),
  ('g2', 4, 'M4',  'Competitive Advantage','video', 'submitted', '2027-07-11T08:00:00+08:00', '2027-07-11T12:00:00+08:00', 4.0);

-- =====================================================================
-- SINAG PANEL COMMENTS (sample qualitative feedback)
-- =====================================================================
INSERT INTO panel_comments (team_id, week_no, panelist, comment_text, code, theme, sentiment) VALUES
  ('g2', 1, 'Dr. Proceso "Jon" Fernandez', 'Good flow rate data. Now validate the maintenance cycle with the irrigators'' cooperative.', 'validation', 'gap', 'neutral'),
  ('g2', 1, 'Mr. Bryan Erfe', 'Strong local LGU alignment — the NIA connection is a real advantage.', 'stakeholder_alignment', 'strength', 'positive'),
  ('g2', 2, 'Ms. Janine Chiong', 'TAM estimation is reasonable but SAM needs tighter geographic scoping.', 'market_sizing', 'gap', 'neutral'),
  ('g2', 2, 'Dr. Proceso "Jon" Fernandez', 'The off-grid barangay count is compelling. Make sure the kWh per household figure comes from measured output.', 'quantified_value', 'watch', 'neutral'),
  ('g2', 3, 'Mr. Bryan Erfe', 'Excellent concept board — the irrigation canal visual really sells it.', 'pitch_quality', 'strength', 'positive'),
  ('g2', 3, 'Ms. Janine Chiong', 'Need formal off-grid power purchase agreement terms before the financial model will hold.', 'financials', 'gap', 'negative'),
  ('g2', 4, 'Dr. Proceso "Jon" Fernandez', 'VRIO analysis is solid. The patent on the conduit design gives real barrier to entry.', 'ip_strategy', 'strength', 'positive'),
  ('g2', 4, 'Mr. Bryan Erfe', 'CPM needs at least two more direct competitors. Include the solar microgrid providers.', 'competitive_analysis', 'gap', 'neutral');
