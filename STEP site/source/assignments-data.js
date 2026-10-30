/* =====================================================================
   STEP Hub — Weekly assignments (the team output each teaching week)

   The STEP team writes each week's instructions and posts the template
   deck on the tech console (Assignments). Participants read them on
   This Week, under Materials and session replay. One row per week in
   public.assignments; the template file sits in the private
   "assignments" bucket and comes back through a short-lived link.
   ===================================================================== */
(function () {
  'use strict';
  const BUCKET = 'assignments';
  const SIGNED = 60 * 60 * 4;
  const client = () => (window.STEP_SUPABASE && window.STEP_SUPABASE.getClient ? window.STEP_SUPABASE.getClient() : null);

  async function isLive() {
    const sb = client(); if (!sb) return false;
    try { const { data } = await sb.auth.getSession(); return !!(data && data.session); } catch (e) { return false; }
  }
  const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');

  async function link(path, name) {
    if (!path) return null;
    try { const { data } = await client().storage.from(BUCKET).createSignedUrl(path, SIGNED, { download: name || true }); return data ? data.signedUrl : null; } catch (e) { return null; }
  }
  /* view links have no download header, so viewers (PDF, Office) can open them in place */
  async function viewLink(path) {
    if (!path) return null;
    try { const { data } = await client().storage.from(BUCKET).createSignedUrl(path, SIGNED); return data ? data.signedUrl : null; } catch (e) { return null; }
  }
  async function file(path, name, size) {
    if (!path) return null;
    const [url, view] = await Promise.all([link(path, name), viewLink(path)]);
    return { path, name: name || 'File', size: size || 0, url, view };
  }
  async function shape(r) {
    if (!r) return null;
    return { week: r.week_no, instructions: r.instructions || '', updated_at: r.updated_at,
             guide: await file(r.guide_path, r.guide_name, r.guide_size),
             template: await file(r.template_path, r.template_name, r.template_size) };
  }

  /** One week's assignment, or null when nothing is posted (or the table is missing). */
  async function get(week) {
    const sb = client(); if (!sb) return null;
    const { data, error } = await sb.from('assignments').select('*').eq('week_no', week).maybeSingle();
    if (error) { if (/assignments|schema cache|does not exist/i.test(error.message)) return null; throw new Error(error.message); }
    return shape(data);
  }

  /** Every week's row: { week: {...} } (for the console). */
  async function all() {
    const sb = client(); if (!sb) return {};
    const { data, error } = await sb.from('assignments').select('*').order('week_no');
    if (error) throw new Error(/schema cache|does not exist/i.test(error.message)
      ? 'The assignments table is not set up yet. Run supabase/assignments.sql in Supabase.' : error.message);
    const out = {}; for (const r of data || []) out[r.week_no] = await shape(r);
    return out;
  }

  async function me() { try { const { data } = await client().auth.getUser(); return data && data.user ? data.user.email : null; } catch (e) { return null; } }

  /** Save the instructions for a week (keeps any template). */
  async function saveInstructions(week, text) {
    const sb = client();
    const { error } = await sb.from('assignments').upsert({ week_no: week, instructions: String(text || '').trim(),
      updated_by: await me(), updated_at: new Date().toISOString() }, { onConflict: 'week_no' });
    if (error) throw new Error(error.message);
  }

  /* kind: 'template' (the deck to start from) or 'guide' (the detailed instructions) */
  const COL = k => (k === 'guide' ? 'guide' : 'template');

  /** Upload (or replace) one of a week's two files. */
  async function uploadFile(week, kind, f) {
    const sb = client(), c = COL(kind);
    if (f.size > 100e6) throw new Error('That file is over 100 MB. Compress it and try again.');
    const path = `w${week}/${c}-${Date.now()}-${slug(f.name).slice(-80)}`;
    const up = await sb.storage.from(BUCKET).upload(path, f, { upsert: false, contentType: f.type || undefined });
    if (up.error) throw new Error('Could not upload the file: ' + up.error.message);
    const { data: old } = await sb.from('assignments').select(c + '_path').eq('week_no', week).maybeSingle();
    const row = { week_no: week, updated_by: await me(), updated_at: new Date().toISOString() };
    row[c + '_path'] = path; row[c + '_name'] = f.name; row[c + '_size'] = f.size;
    const { error } = await sb.from('assignments').upsert(row, { onConflict: 'week_no' });
    if (error) { sb.storage.from(BUCKET).remove([path]).catch(() => {}); throw new Error(error.message); }
    const was = old && old[c + '_path'];
    if (was && was !== path) sb.storage.from(BUCKET).remove([was]).catch(() => {});
  }

  /** Take one of a week's files down. */
  async function removeFile(week, kind) {
    const sb = client(), c = COL(kind);
    const { data: old } = await sb.from('assignments').select(c + '_path').eq('week_no', week).maybeSingle();
    const row = { updated_by: await me(), updated_at: new Date().toISOString() };
    row[c + '_path'] = null; row[c + '_name'] = null; row[c + '_size'] = null;
    const { error } = await sb.from('assignments').update(row).eq('week_no', week);
    if (error) throw new Error(error.message);
    const was = old && old[c + '_path'];
    if (was) sb.storage.from(BUCKET).remove([was]).catch(() => {});
  }

  window.STEP_ASSIGN = { isLive, get, all, saveInstructions, uploadFile, removeFile,
    uploadTemplate: (w, f) => uploadFile(w, 'template', f), removeTemplate: w => removeFile(w, 'template') };
})();
