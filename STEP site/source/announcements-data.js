/* =====================================================================
   STEP Hub — Announcements (the This Week board)

   Written in the tech console, read on This Week by everyone. The
   database decides what is up: an announcement shows from its date
   (a future date schedules it) until its take-down date, or, with none,
   until the Sunday that ends its week. Only one is pinned at a time.
   The "new" dot stays until each signed-in person has seen it.
   ===================================================================== */

(function () {
  'use strict';

  const SB = () => window.STEP_SUPABASE;
  const client = () => (SB() && SB().getClient ? SB().getClient() : null);
  const available = () => !!(client() && (!SB().isOnline || SB().isOnline()));

  async function me() {
    const sb = client(); if (!sb) return null;
    try { const { data } = await sb.auth.getSession(); return data && data.session ? data.session.user : null; }
    catch (e) { return null; }
  }

  /* when an announcement comes down if no date was set: the Sunday that
     ends its week, Manila time (weeks run Monday to Sunday) */
  function endsOf(r) {
    if (r.until_at) return new Date(r.until_at);
    const d = new Date(new Date(r.shown_at).toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    const back = (d.getDay() + 6) % 7;
    const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - back);
    const nextMon = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + 7);
    const pad = n => String(n).padStart(2, '0');
    return new Date(`${nextMon.getFullYear()}-${pad(nextMon.getMonth() + 1)}-${pad(nextMon.getDate())}T00:00:00+08:00`);
  }

  /* a row in the shape the boards draw */
  function card(r, seen) {
    const now = Date.now();
    return {
      id: r.id, icon: r.icon || 'file', title: r.title, body: r.body || '',
      by: r.posted_by || 'STEP Team', at: r.shown_at, until: r.until_at || '',
      pinned: !!r.pinned, priority: r.important ? 'important' : 'normal',
      show_new: r.show_new !== false,
      read: r.show_new === false || !!(seen && seen.has(r.id)),
      scheduled: new Date(r.shown_at).getTime() > now,
      expired: endsOf(r).getTime() <= now,
      ends: endsOf(r).toISOString(),
    };
  }

  /** What is on the board. The STEP team also gets what is scheduled. */
  async function list() {
    const sb = client(); if (!sb) throw new Error('Not connected');
    const { data, error } = await sb.from('announcements').select('*').order('shown_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  /** Ids of the announcements the signed-in person has already seen. */
  async function seenIds() {
    const u = await me(); if (!u) return null;
    const { data } = await client().from('announcement_reads').select('announcement_id');
    return new Set((data || []).map(r => r.announcement_id));
  }

  /** Record that the signed-in person has now seen these. */
  async function markSeen(ids) {
    const u = await me(); if (!u || !ids.length) return;
    try {
      await client().from('announcement_reads')
        .upsert(ids.map(id => ({ announcement_id: id, user_id: u.id })),
                { onConflict: 'announcement_id,user_id', ignoreDuplicates: true });
    } catch (e) {}
  }

  /** Add (no id) or update one. a = { id?, icon, title, body, by, at, until, pinned, important, show_new } */
  async function save(a) {
    const u = await me();
    const row = {
      icon: a.icon || 'file', title: String(a.title || '').trim(), body: String(a.body || '').trim(),
      posted_by: String(a.by || '').trim() || 'STEP Team',
      shown_at: a.at || new Date().toISOString(), until_at: a.until || null,
      pinned: !!a.pinned, important: !!a.important, show_new: a.show_new !== false,
    };
    if (!row.title) throw new Error('Add a headline first.');
    let q;
    if (a.id) q = client().from('announcements').update(row).eq('id', a.id);
    else q = client().from('announcements').insert(Object.assign(row, { created_by: u ? u.id : null }));
    const { error } = await q;
    if (error) throw new Error(error.message);
  }

  async function setPinned(id, on) {
    const { error } = await client().from('announcements').update({ pinned: !!on }).eq('id', id);
    if (error) throw new Error(error.message);
  }

  async function remove(id) {
    const { error } = await client().from('announcements').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  window.STEP_ANN = { available, list, seenIds, markSeen, save, setPinned, remove, card, endsOf };
})();
