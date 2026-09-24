-- =====================================================================
-- STEP Hub — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =====================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. PROFILES — extends Supabase Auth users with role & team info
-- =====================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL DEFAULT '',
  initials    TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'guest'
                CHECK (role IN ('admin','participant','mentor','panel','trainer','guest')),
  role_label  TEXT NOT NULL DEFAULT 'Guest',
  team_id     TEXT,                        -- FK to teams.id, nullable (admins/trainers have no single team)
  institution TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create a profile row when a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================================
-- 2. TEAMS — the 10 STEP groups
-- =====================================================================
CREATE TABLE IF NOT EXISTS teams (
  id                  TEXT PRIMARY KEY,          -- e.g. 'g1', 'g2', ...
  name                TEXT NOT NULL,             -- e.g. 'POSTE (USC)'
  short               TEXT NOT NULL,             -- e.g. 'POSTE'
  abbr                TEXT NOT NULL,             -- e.g. 'USC'
  institution         TEXT NOT NULL,
  city                TEXT NOT NULL,
  region              TEXT NOT NULL,
  about               TEXT NOT NULL DEFAULT '',
  technology_title    TEXT NOT NULL DEFAULT '',
  implementing_agency TEXT NOT NULL DEFAULT '',
  mentor_id           TEXT,                      -- FK to faculty mentors
  mentor_name         TEXT,
  panel_letter        TEXT,                      -- 'A', 'B', or 'C'
  logo                TEXT,                      -- path to logo
  mark                TEXT,                      -- path to small mark
  initials            TEXT NOT NULL DEFAULT '',
  accent              TEXT,                      -- HSL color
  glow                TEXT,                      -- HSLA glow
  is_public           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 3. TEAM_MEMBERS — people on each team
-- =====================================================================
CREATE TABLE IF NOT EXISTS team_members (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id    TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'Researcher',   -- 'Entrepreneurial lead', 'Technical lead', etc.
  initials   TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  profile_id UUID REFERENCES profiles(id),         -- nullable, links to auth user if they have an account
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 4. MODULES — the 14 curriculum modules
-- =====================================================================
CREATE TABLE IF NOT EXISTS modules (
  code            TEXT PRIMARY KEY,               -- e.g. 'M1E', 'M2', ...
  week_no         INT NOT NULL,
  title           TEXT NOT NULL,
  session_hours   NUMERIC(4,1) NOT NULL DEFAULT 0,
  off_session_hrs NUMERIC(4,1) NOT NULL DEFAULT 0,
  trainer         TEXT NOT NULL DEFAULT '',
  coverage        TEXT,
  deliverable     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 5. SCORES — panel scores per team per module week
-- =====================================================================
CREATE TABLE IF NOT EXISTS scores (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id      TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  module_code  TEXT NOT NULL REFERENCES modules(code),
  week_no      INT NOT NULL,
  score        NUMERIC(4,2) NOT NULL,            -- weighted average, e.g. 3.55
  panel_letter TEXT NOT NULL,                     -- 'A', 'B', 'C'
  scored_on    DATE,
  axis_label   TEXT,                              -- short label for radar chart
  full_label   TEXT,                              -- full output name
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, module_code)
);

-- =====================================================================
-- 6. ATTENDANCE — per-member per-session
-- =====================================================================
CREATE TABLE IF NOT EXISTS attendance (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id       TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  member_name   TEXT NOT NULL,
  session_code  TEXT NOT NULL,                    -- e.g. 'M2', 'M3A', 'FB1', etc.
  session_label TEXT NOT NULL,                    -- 'Wk 1 · Learning', etc.
  session_type  TEXT NOT NULL DEFAULT 'learning', -- 'learning' or 'feedback'
  present       BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, member_name, session_code)
);

-- =====================================================================
-- 7. SUBMISSIONS — video/slide uploads per team per week
-- =====================================================================
CREATE TABLE IF NOT EXISTS submissions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id      TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  week_no      INT NOT NULL,
  module_code  TEXT NOT NULL,
  module_title TEXT NOT NULL DEFAULT '',
  kind         TEXT NOT NULL DEFAULT 'video',     -- 'video', 'slide', 'document'
  status       TEXT NOT NULL DEFAULT 'pending',   -- 'submitted', 'pending', 'late', 'missing'
  submitted_at TIMESTAMPTZ,
  deadline_at  TIMESTAMPTZ,
  hours_early  NUMERIC(6,1),                      -- positive = early, negative = late
  file_url     TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, week_no, kind)
);

-- =====================================================================
-- 8. PANEL_COMMENTS — qualitative feedback from panelists
-- =====================================================================
CREATE TABLE IF NOT EXISTS panel_comments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id      TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  week_no      INT NOT NULL,
  panelist     TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  code         TEXT,                              -- thematic code, e.g. 'market_sizing'
  theme        TEXT,                              -- theme group, e.g. 'strength', 'gap', 'watch'
  sentiment    TEXT DEFAULT 'neutral',            -- 'positive', 'negative', 'neutral'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 9. COHORT — program-level settings
-- =====================================================================
CREATE TABLE IF NOT EXISTS cohort (
  code          TEXT PRIMARY KEY,                 -- e.g. 'STEP3'
  name          TEXT NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'Asia/Manila',
  starts_on     DATE NOT NULL,
  ends_on       DATE NOT NULL,
  current_week  INT NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- Indexes for common queries
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_scores_team ON scores(team_id);
CREATE INDEX IF NOT EXISTS idx_attendance_team ON attendance(team_id);
CREATE INDEX IF NOT EXISTS idx_submissions_team ON submissions(team_id);
CREATE INDEX IF NOT EXISTS idx_panel_comments_team ON panel_comments(team_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_team ON profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);

-- =====================================================================
-- Updated-at trigger
-- =====================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
