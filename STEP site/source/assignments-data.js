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

  async function shape(r) {
    if (!r) return null;
    let url = null;
    if (r.template_path) {
      try { const { data } = await client().storage.from(BUCKET).createSignedUrl(r.template_path, SIGNED, { download: r.template_name || true }); url = data ? data.signedUrl : null; } catch (e) {}
    }
    return { week: r.week_no, instructions: r.instructions || '', updated_at: r.updated_at,
             template: r.template_path ? { path: r.template_path, name: r.template_name || 'Template', size: r.template_size || 0, url } : null };
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

  /** Upload (or replace) a week's template deck. */
  async function uploadTemplate(week, file) {
    const sb = client();
    if (file.size > 100e6) throw new Error('That file is over 100 MB. Compress it or share a Drive link in the instructions.');
    const path = `w${week}/${Date.now()}-${slug(file.name).slice(-80)}`;
    const up = await sb.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type || undefined });
    if (up.error) throw new Error('Could not upload the template: ' + up.error.message);
    const { data: old } = await sb.from('assignments').select('template_path').eq('week_no', week).maybeSingle();
    const { error } = await sb.from('assignments').upsert({ week_no: week, template_path: path, template_name: file.name,
      template_size: file.size, updated_by: await me(), updated_at: new Date().toISOString() }, { onConflict: 'week_no' });
    if (error) { sb.storage.from(BUCKET).remove([path]).catch(() => {}); throw new Error(error.message); }
    if (old && old.template_path && old.template_path !== path) sb.storage.from(BUCKET).remove([old.template_path]).catch(() => {});
  }

  /** Take a week's template down. */
  async function removeTemplate(week) {
    const sb = client();
    const { data: old } = await sb.from('assignments').select('template_path').eq('week_no', week).maybeSingle();
    const { error } = await sb.from('assignments').update({ template_path: null, template_name: null, template_size: null,
      updated_by: await me(), updated_at: new Date().toISOString() }).eq('week_no', week);
    if (error) throw new Error(error.message);
    if (old && old.template_path) sb.storage.from(BUCKET).remove([old.template_path]).catch(() => {});
  }

  window.STEP_ASSIGN = { isLive, get, all, saveInstructions, uploadTemplate, removeTemplate };
})();
