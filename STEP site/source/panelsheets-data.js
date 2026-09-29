/* =====================================================================
   STEP Hub — Panel score sheets

   Each panelist keeps their own sheet: one row per team, keyed by
   (session, panel, panelist, team). Scores, the comment on each
   criterion and the general comment are saved as the panelist types;
   "Submit scores" marks the sheet submitted and leaves everything on it.

   Signed in to the Supabase project → the panel_sheets table.
   Otherwise (the offline mockup) → this browser's localStorage, with the
   same keys and shape, so the page behaves the same either way.
   ===================================================================== */

(function () {
  'use strict';

  const TABLE = 'panel_sheets';
  const LS = 'stephub_panelsheet::';
  const SB = () => window.STEP_SUPABASE;
  const client = () => (SB() && SB().getClient ? SB().getClient() : null);

  async function isLive() {
    const sb = client();
    if (!sb) return false;
    try {
      const { data } = await sb.auth.getSession();
      return !!(data && data.session);
    } catch (e) { return false; }
  }

  /* a sheet is (session, seat); the seat fixes the panel and the person */
  const sheetKey = k => LS + [k.session, 'seat' + k.seat].join('::');
  function lsRead(k) {
    try { return JSON.parse(localStorage.getItem(sheetKey(k)) || '{}') || {}; } catch (e) { return {}; }
  }
  function lsWrite(k, obj) {
    try { localStorage.setItem(sheetKey(k), JSON.stringify(obj)); } catch (e) {}
  }

  /* one team's entry, in the shape the page works with */
  const blank = () => ({ scores: {}, notes: {}, comment: '', status: 'draft',
                         submitted_at: null, updated_at: null });
  const fromRow = r => ({
    scores: r.scores || {}, notes: r.point_notes || {}, comment: r.general_comment || '',
    status: r.status || 'draft', submitted_at: r.submitted_at, updated_at: r.updated_at,
  });

  /**
   * k = { session, panel, seat, panelist (display name) }
   * Resolves { live, teams: { [team_id]: entry } }
   */
  async function load(k) {
    if (await isLive()) {
      const { data, error } = await client().from(TABLE).select('*')
        .eq('session_code', k.session).eq('seat', k.seat);
      if (error) throw new Error(error.message);
      const teams = {};
      (data || []).forEach(r => { teams[r.team_id] = fromRow(r); });
      return { live: true, teams };
    }
    return { live: false, teams: lsRead(k) };
  }

  /**
   * Save one team's entry (draft). e = { team_id, team_name, scores, notes,
   * comment, total, complete, status? }. Resolves the saved entry.
   */
  async function save(k, e) {
    const now = new Date().toISOString();
    if (await isLive()) {
      const sb = client();
      const { data: { user } } = await sb.auth.getUser();
      const row = {
        session_code: k.session, panel_letter: k.panel, seat: k.seat, panelist: k.panelist || '',
        team_id: e.team_id, team_name: e.team_name || '',
        scores: e.scores || {}, point_notes: e.notes || {}, general_comment: e.comment || '',
        total: e.complete ? Number(e.total.toFixed(2)) : null, complete: !!e.complete,
        updated_by: user ? user.id : null, updated_at: now,
      };
      const { data, error } = await sb.from(TABLE)
        .upsert(row, { onConflict: 'session_code,seat,team_id' })
        .select().single();
      if (error) throw new Error(error.message);
      return fromRow(data);
    }
    const all = lsRead(k);
    const prev = all[e.team_id] || blank();
    all[e.team_id] = Object.assign(prev, {
      scores: e.scores || {}, notes: e.notes || {}, comment: e.comment || '', updated_at: now,
    });
    lsWrite(k, all);
    return all[e.team_id];
  }

  /** Mark every team on this sheet submitted. Resolves the submit time. */
  async function submit(k, teamIds) {
    const now = new Date().toISOString();
    if (await isLive()) {
      const { error } = await client().from(TABLE)
        .update({ status: 'submitted', submitted_at: now, updated_at: now })
        .eq('session_code', k.session).eq('seat', k.seat)
        .in('team_id', teamIds);
      if (error) throw new Error(error.message);
      return now;
    }
    const all = lsRead(k);
    teamIds.forEach(id => {
      all[id] = Object.assign(all[id] || blank(), { status: 'submitted', submitted_at: now, updated_at: now });
    });
    lsWrite(k, all);
    return now;
  }

  /** Wipe this panelist's sheet for this session and panel. */
  async function clear(k) {
    if (await isLive()) {
      const { error } = await client().from(TABLE).delete()
        .eq('session_code', k.session).eq('seat', k.seat);
      if (error) throw new Error(error.message);
      return;
    }
    try { localStorage.removeItem(sheetKey(k)); } catch (e) {}
  }

  /* ── panel seats ────────────────────────────────────────────────────
     Nine seats, three per panel. Live: names and who sits where come from
     the database; the page's panel list is updated in place and a
     "stephub_roster" event tells the pages to redraw. */
  let roster = null;          // [{ seat, panel_letter, display_name, email, is_me }] or null

  async function loadRoster() {
    if (!(await isLive())) { roster = null; return null; }
    const { data, error } = await client().rpc('panel_roster');
    if (error || !data) { roster = null; return null; }
    roster = data;
    const F = window.MOCK && window.MOCK.faculty;
    if (F && F.panels) {
      F.panels.forEach(p => {
        const mine = data.filter(r => r.panel_letter === p.letter).sort((a, b) => a.seat - b.seat);
        if (mine.length) { p.seats = mine.map(r => r.seat); p.panelists = mine.map(r => r.display_name); }
      });
    }
    window.dispatchEvent(new CustomEvent('stephub_roster', { detail: { roster: data } }));
    return data;
  }
  const getRoster = () => roster;
  /** the seat the signed-in account holds, or null */
  const mySeat = () => (roster && roster.find(r => r.is_me)) || null;

  /** Rename a seat and/or link it to an account by email (admins only). */
  async function assignSeat(seat, name, email) {
    const { data, error } = await client().rpc('assign_panel_seat',
      { p_seat: seat, p_name: name, p_email: email });
    if (error) throw new Error(error.message);
    await loadRoster();
    return data;
  }

  /* after every script on the page has run, and whenever the account changes */
  setTimeout(loadRoster, 0);
  window.addEventListener('stephub_auth_changed', () => { loadRoster(); });

  window.STEP_PANELSHEETS = { isLive, load, save, submit, clear, loadRoster, getRoster, mySeat, assignSeat };
})();
