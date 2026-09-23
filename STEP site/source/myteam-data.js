/* =====================================================================
   STEP Hub — My Team's Work Data Layer
   Fetches team dashboard data from Supabase, with mock-data fallback.
   ===================================================================== */

(function () {
  'use strict';

  const SB = () => window.STEP_SUPABASE;

  /** Check if we can use Supabase */
  function isLive() {
    return SB() && SB().isOnline();
  }

  // ── Team Profile ──────────────────────────────────────────────────

  async function getTeamProfile(teamId) {
    if (!isLive()) return _mockTeamProfile(teamId);

    const sb = SB().getClient();
    const { data: team } = await sb.from('teams').select('*').eq('id', teamId).single();
    const { data: members } = await sb.from('team_members').select('*').eq('team_id', teamId).order('sort_order');

    if (!team) return _mockTeamProfile(teamId);

    return {
      ...team,
      members: (members || []).map(m => ({
        name: m.name,
        role: m.role,
        initials: m.initials
      }))
    };
  }

  // ── Scores ────────────────────────────────────────────────────────

  async function getTeamScores(teamId) {
    if (!isLive()) return _mockTeamScores(teamId);

    const sb = SB().getClient();
    const { data, error } = await sb
      .from('scores')
      .select('*')
      .eq('team_id', teamId)
      .order('week_no');

    if (error || !data || !data.length) return _mockTeamScores(teamId);

    return data.map(s => ({
      code: s.module_code,
      axis: s.axis_label,
      full: s.full_label,
      week: s.week_no,
      score: parseFloat(s.score),
      panel: s.panel_letter,
      scored_on: s.scored_on
    }));
  }

  // ── Attendance ────────────────────────────────────────────────────

  async function getTeamAttendance(teamId) {
    if (!isLive()) return _mockTeamAttendance(teamId);

    const sb = SB().getClient();
    const { data: members } = await sb.from('team_members').select('name, initials').eq('team_id', teamId).order('sort_order');
    const { data: records } = await sb.from('attendance').select('*').eq('team_id', teamId);

    if (!records || !records.length) return _mockTeamAttendance(teamId);

    // Group by session
    const sessionMap = {};
    records.forEach(r => {
      if (!sessionMap[r.session_code]) {
        sessionMap[r.session_code] = {
          code: r.session_code,
          label: r.session_label,
          type: r.session_type,
          present: {}
        };
      }
      sessionMap[r.session_code].present[r.member_name] = r.present;
    });

    const sessions = Object.values(sessionMap).sort((a, b) => a.code.localeCompare(b.code));
    const memberNames = (members || []).map(m => m.name);

    return {
      members: memberNames,
      sessions: sessions.map(s => ({
        code: s.code,
        label: s.label,
        type: s.type,
        attended: memberNames.map(name => s.present[name] || false),
        count: memberNames.filter(name => s.present[name]).length
      }))
    };
  }

  // ── Submissions ───────────────────────────────────────────────────

  async function getTeamSubmissions(teamId) {
    if (!isLive()) return _mockTeamSubmissions(teamId);

    const sb = SB().getClient();
    const { data, error } = await sb
      .from('submissions')
      .select('*')
      .eq('team_id', teamId)
      .order('week_no');

    if (error || !data) return _mockTeamSubmissions(teamId);

    return data.map(s => ({
      week: s.week_no,
      module: s.module_code,
      title: s.module_title,
      kind: s.kind,
      status: s.status,
      hours_early: s.hours_early ? parseFloat(s.hours_early) : null,
      submitted_at: s.submitted_at,
      deadline_at: s.deadline_at
    }));
  }

  // ── Panel Comments (thematic analysis) ────────────────────────────

  async function getTeamComments(teamId) {
    if (!isLive()) return _mockTeamComments(teamId);

    const sb = SB().getClient();
    const { data, error } = await sb
      .from('panel_comments')
      .select('*')
      .eq('team_id', teamId)
      .order('week_no');

    if (error || !data || !data.length) return _mockTeamComments(teamId);

    // Build thematic analysis structure
    const codeBook = {};
    data.forEach(c => {
      if (!c.code) return;
      if (!codeBook[c.code]) {
        codeBook[c.code] = { code: c.code, theme: c.theme || 'watch', count: 0, comments: [] };
      }
      codeBook[c.code].count++;
      codeBook[c.code].comments.push({
        week: c.week_no,
        panelist: c.panelist,
        text: c.comment_text,
        sentiment: c.sentiment
      });
    });

    return {
      codes: Object.values(codeBook).sort((a, b) => b.count - a.count),
      totalComments: data.length,
      raw: data
    };
  }

  // ── Mock data fallbacks ───────────────────────────────────────────
  // These use window.MOCK when Supabase is unavailable

  function _mockTeamProfile(teamId) {
    if (!window.MOCK) return null;
    const tw = window.MOCK.getTeamWork(teamId);
    return tw ? {
      ...window.MOCK.groups.find(g => g.id === (teamId || 'g1')),
      members: tw.members
    } : null;
  }

  function _mockTeamScores(teamId) {
    if (!window.MOCK) return [];
    const tw = window.MOCK.getTeamWork(teamId);
    return tw ? tw.outputs : [];
  }

  function _mockTeamAttendance(teamId) {
    if (!window.MOCK) return { members: [], sessions: [] };
    const tw = window.MOCK.getTeamWork(teamId);
    return tw ? tw.attendance : { members: [], sessions: [] };
  }

  function _mockTeamSubmissions(teamId) {
    if (!window.MOCK) return [];
    const tw = window.MOCK.getTeamWork(teamId);
    return tw ? tw.submissions : [];
  }

  function _mockTeamComments(teamId) {
    if (!window.MOCK) return { codes: [], totalComments: 0, raw: [] };
    const tw = window.MOCK.getTeamWork(teamId);
    return tw ? tw.thematic : { codes: [], totalComments: 0, raw: [] };
  }

  // ── Expose globally ───────────────────────────────────────────────
  window.STEP_MYTEAM = {
    getTeamProfile,
    getTeamScores,
    getTeamAttendance,
    getTeamSubmissions,
    getTeamComments,
    isLive,
  };

})();
