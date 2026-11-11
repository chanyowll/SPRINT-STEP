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
    /* the item's pictures (items 8–20): what is stored, never a page-only preview link.
       id ties a picture to its [[img:id]] line in the draft; pct is its width on the page. */
    if (Array.isArray(f.images)) data.images = f.images.filter(x => x && x.path)
      .map(x => ({ id: x.id || null, path: x.path, w: x.w || 0, h: x.h || 0, pct: x.pct || 100 }));
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

  /* ---------- pictures on a proposal item ----------
     Stored in the same private bucket under <team>/item-<n>/…, so the same
     people who read the item can see them. Links are signed for four hours
     and kept for the visit, so the editor and the preview share them. */
  const imgLinks = {};
  async function imageUrl(path) {
    if (!path) return null;
    const hit = imgLinks[path];
    if (hit && hit.until > Date.now()) return hit.url;
    const url = await sign(path);
    if (url) imgLinks[path] = { url, until: Date.now() + (SIGNED - 300) * 1000 };
    return url;
  }
  async function putImage(teamId, n, blob, name) {
    const sb = client();
    const ext = /png/.test(blob.type) ? 'png' : /gif/.test(blob.type) ? 'gif' : /webp/.test(blob.type) ? 'webp' : 'jpg';
    const base = slug(String(name || 'picture').replace(/\.[a-z0-9]+$/i, '')).slice(-40) || 'picture';
    const path = `${teamId}/item-${n}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base}.${ext}`;
    const up = await sb.storage.from(BUCKET).upload(path, blob, { upsert: false, contentType: blob.type || 'image/jpeg' });
    if (up.error) throw new Error(up.error.message);
    return path;
  }
  async function removeImage(path) {
    if (!path) return;
    delete imgLinks[path];
    try { await client().storage.from(BUCKET).remove([path]); } catch (e) {}
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

  window.STEP_CAPSTONE = { isLive, load, saveItem, putSlide, removeSlide, summary, imageUrl, putImage, removeImage, BUCKET };
})();
