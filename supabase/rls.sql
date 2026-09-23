-- =====================================================================
-- STEP Hub — Row-Level Security Policies
-- Run AFTER schema.sql in your Supabase SQL Editor
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE panel_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- Helper: get current user's role
-- =====================================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM profiles WHERE id = auth.uid()),
    'guest'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get current user's team_id
CREATE OR REPLACE FUNCTION get_user_team_id()
RETURNS TEXT AS $$
  SELECT team_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================================
-- PROFILES
-- =====================================================================
-- Users can read their own profile
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY profiles_select_admin ON profiles
  FOR SELECT USING (get_user_role() = 'admin');

-- Users can update their own profile (name, avatar)
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any profile (assign roles, teams)
CREATE POLICY profiles_update_admin ON profiles
  FOR UPDATE USING (get_user_role() = 'admin');

-- Admins can insert profiles
CREATE POLICY profiles_insert_admin ON profiles
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

-- =====================================================================
-- TEAMS — public read, admin write
-- =====================================================================
CREATE POLICY teams_select_public ON teams
  FOR SELECT USING (true);  -- anyone can see team names/info

CREATE POLICY teams_insert_admin ON teams
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

CREATE POLICY teams_update_admin ON teams
  FOR UPDATE USING (get_user_role() = 'admin');

-- =====================================================================
-- TEAM_MEMBERS — team members visible to same team + admin
-- =====================================================================
CREATE POLICY team_members_select ON team_members
  FOR SELECT USING (
    get_user_role() = 'admin'
    OR team_id = get_user_team_id()
    OR get_user_role() IN ('mentor', 'panel', 'trainer')
  );

CREATE POLICY team_members_insert_admin ON team_members
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

CREATE POLICY team_members_update_admin ON team_members
  FOR UPDATE USING (get_user_role() = 'admin');

-- =====================================================================
-- MODULES — public read, admin write
-- =====================================================================
CREATE POLICY modules_select_public ON modules
  FOR SELECT USING (true);

CREATE POLICY modules_insert_admin ON modules
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

CREATE POLICY modules_update_admin ON modules
  FOR UPDATE USING (get_user_role() = 'admin');

-- =====================================================================
-- SCORES — own team or admin/mentor/panel
-- =====================================================================
CREATE POLICY scores_select ON scores
  FOR SELECT USING (
    get_user_role() = 'admin'
    OR team_id = get_user_team_id()
    OR get_user_role() IN ('mentor', 'panel', 'trainer')
  );

CREATE POLICY scores_insert ON scores
  FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'panel'));

CREATE POLICY scores_update ON scores
  FOR UPDATE USING (get_user_role() IN ('admin', 'panel'));

-- =====================================================================
-- ATTENDANCE — own team or admin/trainer
-- =====================================================================
CREATE POLICY attendance_select ON attendance
  FOR SELECT USING (
    get_user_role() = 'admin'
    OR team_id = get_user_team_id()
    OR get_user_role() IN ('mentor', 'panel', 'trainer')
  );

CREATE POLICY attendance_insert ON attendance
  FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'trainer'));

CREATE POLICY attendance_update ON attendance
  FOR UPDATE USING (get_user_role() IN ('admin', 'trainer'));

-- =====================================================================
-- SUBMISSIONS — own team can read + submit, admin full access
-- =====================================================================
CREATE POLICY submissions_select ON submissions
  FOR SELECT USING (
    get_user_role() = 'admin'
    OR team_id = get_user_team_id()
    OR get_user_role() IN ('mentor', 'panel', 'trainer')
  );

CREATE POLICY submissions_insert ON submissions
  FOR INSERT WITH CHECK (
    get_user_role() = 'admin'
    OR team_id = get_user_team_id()
  );

CREATE POLICY submissions_update ON submissions
  FOR UPDATE USING (
    get_user_role() = 'admin'
    OR team_id = get_user_team_id()
  );

-- =====================================================================
-- PANEL_COMMENTS — own team can read, panel/admin can write
-- =====================================================================
CREATE POLICY panel_comments_select ON panel_comments
  FOR SELECT USING (
    get_user_role() = 'admin'
    OR team_id = get_user_team_id()
    OR get_user_role() IN ('mentor', 'panel', 'trainer')
  );

CREATE POLICY panel_comments_insert ON panel_comments
  FOR INSERT WITH CHECK (get_user_role() IN ('admin', 'panel'));

-- =====================================================================
-- COHORT — public read, admin write
-- =====================================================================
CREATE POLICY cohort_select_public ON cohort
  FOR SELECT USING (true);

CREATE POLICY cohort_insert_admin ON cohort
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

CREATE POLICY cohort_update_admin ON cohort
  FOR UPDATE USING (get_user_role() = 'admin');
