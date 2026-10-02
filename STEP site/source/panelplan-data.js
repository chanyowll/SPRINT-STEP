/* =====================================================================
   STEP Hub — Saturday panel groupings

   The tech console saves the whole board (save_panel_plan): for each
   panel its letter, start time, the teams it hears in order and the
   panelists by seat. A save covers one week or a week onward; for any
   week the newest save that covers it is the grouping in force.

   The Panel tab and This Week read it through here. With no saved
   grouping (or offline), the programme's built-in panels stand.
   ===================================================================== */

(function () {
  'use strict';

  const SB = () => window.STEP_SUPABASE;
  const client = () => (SB() && SB().getClient ? SB().getClient() : null);
  const cache = {};                       // week -> Promise<plan|null>

  async function signedIn() {
    const sb = client(); if (!sb) return false;
    try { const { data } = await sb.auth.getSession(); return !!(data && data.session); }
    catch (e) { return false; }
  }

  /** The grouping in force for week w, or null. */
  function forWeek(w) {
    w = Number(w);
    if (!cache[w]) cache[w] = (async () => {
      if (!(await signedIn())) return null;
      const { data, error } = await client().from('panel_plans').select('*')
        .lte('week_from', w).or('week_to.is.null,week_to.gte.' + w)
        .order('saved_at', { ascending: false }).limit(1);
      if (error || !data || !data.length) return null;
      return data[0];
    })().catch(() => null);
    return cache[w];
  }
  function invalidate() { Object.keys(cache).forEach(k => delete cache[k]); }

  /** Save the board. scope: { from, to } (to null = onward). Resolves the saved plan. */
  async function save(from, to, panels) {
    const { data, error } = await client().rpc('save_panel_plan',
      { p_from: from, p_to: to == null ? null : to, p_panels: panels });
    if (error) throw new Error(error.message);
    invalidate();
    return data;
  }

  /* "09:00" + i × 35 minutes, in the same 24-hour form the programme uses */
  function slotAt(start, i) {
    const [h, m] = String(start || '09:00').split(':').map(Number);
    const t = h * 60 + m + i * 35;
    return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
  }

  /** A saved plan in the shape the pages draw from (MOCK.faculty.panels).
      roster (optional): [{ seat, display_name }] for the seats' current names. */
  function build(plan, roster) {
    const groups = (window.MOCK && window.MOCK.groups) || [];
    const shortOf = id => { const g = groups.find(x => x.id === id); return g ? (g.short || g.name) : id; };
    const nameOfSeat = (seat, fallback) => {
      const r = (roster || []).find(x => x.seat === seat);
      return (r && r.display_name) || fallback || ('Seat ' + seat);
    };
    return (plan.panels || []).map(p => ({
      letter: p.letter,
      seats: (p.panelists || []).map(x => x.seat),
      panelists: (p.panelists || []).map(x => nameOfSeat(x.seat, x.name)),
      teams: (p.teams || []).map((id, i) => ({ team: shortOf(id), team_id: id, at: slotAt(p.at, i) })),
    }));
  }

  /** Put the plan onto the page's panel list in place, so every reference holds. */
  function applyTo(F, plan, roster) {
    if (!F || !F.panels || !plan) return false;
    const next = build(plan, roster);
    F.panels.length = 0;
    next.forEach(p => F.panels.push(p));
    return true;
  }

  const currentWeek = () => {
    const M = window.MOCK || {};
    return (M.thisWeek && M.thisWeek.week_no) || (M.cohort && M.cohort.current_week) || 1;
  };

  window.STEP_PANELPLAN = { forWeek, save, build, applyTo, invalidate, slotAt, currentWeek };
})();
