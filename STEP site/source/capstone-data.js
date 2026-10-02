/* =====================================================================
   STEP Hub — Capstone (the FASTRAC proposal and the pitch deck)

   Each item of DOST Form 2 is saved as the team works — its draft, its
   fields, its checklist and whether it has been submitted — and each
   pitch-deck slide's file goes to the private "capstone" bucket. Only the
   team's own participants (and admins) can change them; their mentor,
   panel and the STEP team can read them.
   ===================================================================== */

(function () {
  'use strict';

  const BUCKET = 'capstone';
  const SIGNED = 60 * 60 * 4;
  const SB = () => window.STEP_SUPABASE;
  const client = () => (SB() && SB().getClient ? SB().getClient() : null);

  async function user() {
    const sb = client(); if (!sb) return null;
    try { const { data } = await sb.auth.getSession(); return data && data.session ? data.session.user : null; }
    catch (e) { return null; }
  }
  async function isLive() { return !!(await user()); }

  async function sign(path) {
    try { const { data } = await client().storage.from(BUCKET).createSignedUrl(path, SIGNED); return data ? data.signedUrl : null; }
    catch (e) { return null; }
  }

  /** Everything saved for one team: { items: {n: row}, slides: {n: {…, url}} } */
  async function load(teamId) {
    const sb = client();
    const [it, sl] = await Promise.all([
      sb.from('capstone_items').select('*').eq('team_id', teamId),
      sb.from('capstone_slides').select('*').eq('team_id', teamId),
    ]);
    if (it.error) throw new Error(it.error.message);
    const items = {}, slides = {};
    (it.data || []).forEach(r => { items[r.item_n] = r; });
    for (const r of (sl.data || [])) slides[r.slide_n] = Object.assign({}, r, { url: await sign(r.storage_path) });
    return { items, slides };
  }

  /** Save one item. f = the page's item; filled = has anything been written */
  async function saveItem(teamId, f, filled) {
    const u = await user();
    const data = {};
    ['draft', 'value', 'attachments', 'parts'].forEach(k => { if (f[k] !== undefined) data[k] = f[k]; });
    const row = {
      team_id: teamId, item_n: f.n, data, filled: !!filled,
      submitted: !!f.submitted, submitted_at: f.submitted ? (f.submitted_iso || new Date().toISOString()) : null,
      updated_by: u ? u.id : null, updated_at: new Date().toISOString(),
    };
    const { error } = await client().from('capstone_items').upsert(row, { onConflict: 'team_id,item_n' });
    if (error) throw new Error(error.message);
  }

  const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');

  /** Upload one slide's file and record it, replacing any earlier one. */
  async function putSlide(teamId, n, file) {
    const sb = client(), u = await user();
    const { data: old } = await sb.from('capstone_slides').select('storage_path').eq('team_id', teamId).eq('slide_n', n);
    const path = `${teamId}/slide-${n}-${Date.now()}-${slug(file.name).slice(-60)}`;
    const up = await sb.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type || undefined });
    if (up.error) throw new Error(up.error.message);
    const { error } = await sb.from('capstone_slides').upsert({
      team_id: teamId, slide_n: n, storage_path: path, file_name: file.name, file_size: file.size,
      mime_type: file.type || '', updated_by: u ? u.id : null, updated_at: new Date().toISOString(),
    }, { onConflict: 'team_id,slide_n' });
    if (error) throw new Error(error.message);
    const stale = (old || []).map(r => r.storage_path).filter(p => p && p !== path);
    if (stale.length) { try { await sb.storage.from(BUCKET).remove(stale); } catch (e) {} }
    return { path, url: await sign(path) };
  }

  async function removeSlide(teamId, n) {
    const sb = client();
    const { data } = await sb.from('capstone_slides').select('storage_path').eq('team_id', teamId).eq('slide_n', n);
    const { error } = await sb.from('capstone_slides').delete().eq('team_id', teamId).eq('slide_n', n);
    if (error) throw new Error(error.message);
    const paths = (data || []).map(r => r.storage_path).filter(Boolean);
    if (paths.length) { try { await sb.storage.from(BUCKET).remove(paths); } catch (e) {} }
  }

  /** For the console: every team's item states and slide count. */
  async function summary() {
    const sb = client();
    const [it, sl] = await Promise.all([
      sb.from('capstone_items').select('team_id, item_n, filled, submitted, submitted_at, updated_at'),
      sb.from('capstone_slides').select('team_id, slide_n, updated_at'),
    ]);
    return { items: it.data || [], slides: sl.data || [] };
  }

  window.STEP_CAPSTONE = { isLive, load, saveItem, putSlide, removeSlide, summary, BUCKET };
})();
