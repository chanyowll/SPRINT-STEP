/* =====================================================================
   STEP Hub — Session materials (the trainers' slide decks)

   A trainer posts a deck against a session; it lands in the private
   "materials" bucket, is recorded in session_materials, and comes back
   through short-lived signed URLs. Every signed-in STEP user may read,
   which is what puts the deck on This Week and on the Program page for
   the participants.

   Upload goes through XMLHttpRequest rather than supabase-js so the
   page can show real progress on a large deck over a slow connection.
   ===================================================================== */

(function () {
  'use strict';

  const BUCKET = 'materials';
  const SIGNED_SECONDS = 60 * 60 * 4;      // four hours

  const SB = () => window.STEP_SUPABASE;
  const client = () => (SB() && SB().getClient ? SB().getClient() : null);

  /** Is there a configured Supabase project AND a signed-in user? */
  async function isLive() {
    const sb = client();
    if (!sb) return false;
    try {
      const { data } = await sb.auth.getSession();
      return !!(data && data.session);
    } catch (e) { return false; }
  }

  function slug(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /** materials/w6/1723534000-competitive-advantage.pdf */
  function pathFor(moduleCode, file) {
    return `${slug(moduleCode) || 'session'}/${Date.now()}-${slug(file.name).slice(-60)}`;
  }

  /* ── Post a deck ────────────────────────────────────────────────── */

  /**
   * opts: { moduleCode, week, title, file, kind, onProgress(fraction) }
   * kind is 'deck' (the session's slide deck, the default) or 'material'
   * (anything else the trainer adds — a worksheet, a template, a reading;
   * its title is the name participants see on This Week).
   * Resolves { path, row } or throws.
   */
  async function putDeck(opts) {
    const sb = client();
    if (!sb) throw new Error('Supabase is not configured on this page.');

    const { data: sess } = await sb.auth.getSession();
    const token = sess && sess.session && sess.session.access_token;
    if (!token) throw new Error('You are signed out. Sign in again and retry.');

    const path = pathFor(opts.moduleCode, opts.file);
    const url = sb.storageUrl
      ? `${sb.storageUrl}/object/${BUCKET}/${path}`
      : `${sb.supabaseUrl}/storage/v1/object/${BUCKET}/${path}`;

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.setRequestHeader('x-upsert', 'true');
      if (opts.file.type) xhr.setRequestHeader('Content-Type', opts.file.type);
      xhr.upload.onprogress = e => {
        if (e.lengthComputable && typeof opts.onProgress === 'function') {
          opts.onProgress(e.loaded / e.total);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) return resolve();
        let msg = 'Upload failed (' + xhr.status + ')';
        try { const j = JSON.parse(xhr.responseText); if (j.message) msg = j.message; } catch (e) {}
        if (xhr.status === 413) msg = 'The file is larger than this project allows. ' +
          'Raise the global file size limit in Supabase → Storage → Settings.';
        if (xhr.status === 403) msg = 'Your account is not allowed to post materials. ' +
          'Only trainers and admins can.';
        reject(new Error(msg));
      };
      xhr.onerror = () => reject(new Error('Network error while uploading.'));
      xhr.send(opts.file);
    });

    const { data: { user } } = await sb.auth.getUser();
    const row = {
      module_code: opts.moduleCode,
      week_no: opts.week == null ? null : opts.week,
      title: opts.title || '',
      kind: ['material', 'recording'].includes(opts.kind) ? opts.kind : 'deck',
      storage_path: path,
      file_name: opts.file.name,
      file_size: opts.file.size,
      mime_type: opts.file.type || '',
      posted_by: user ? user.id : null,
    };
    if (row.kind === 'recording') Object.assign(row, recMeta(opts));
    const { data, error } = await sb.from('session_materials').insert(row).select().single();
    if (error) throw new Error('Saved the file but could not record it: ' + error.message);
    return { path, row: data };
  }

  /* a recording also carries: draft or published, who may watch it, its length */
  function recMeta(opts) {
    return {
      status: opts.status === 'draft' ? 'draft' : 'published',
      visibility: opts.visibility === 'staff' ? 'staff' : 'all',
      duration: String(opts.duration || '').trim() || null,
    };
  }

  /* ── Read back ──────────────────────────────────────────────────── */

  function shape(r, signedUrl) {
    return {
      id: r.id,
      url: signedUrl || null,
      code: r.module_code,
      week: r.week_no,
      title: r.title,
      kind: r.kind || 'deck',
      name: r.file_name,
      size: r.file_size,
      type: r.mime_type,
      path: r.storage_path,
      posted_by: r.posted_by,
      posted_at: r.posted_at,
      link: r.link_url || null,
      duration: r.duration || '',
      visibility: r.visibility || 'all',
      status: r.status || 'published',
    };
  }

  async function sign(path) {
    const sb = client();
    if (!sb || !path) return null;
    try {
      const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(path, SIGNED_SECONDS);
      return s ? s.signedUrl : null;
    } catch (e) { return null; }
  }

  /** Every posted deck, newest first, each with a signed URL. */
  async function listAll() {
    const sb = client();
    if (!sb) return [];
    const { data, error } = await sb.from('session_materials')
      .select('*').order('posted_at', { ascending: false });
    if (error || !data) return [];
    const out = [];
    for (const r of data) {
      let signed = null;
      try {
        const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(r.storage_path, SIGNED_SECONDS);
        signed = s ? s.signedUrl : null;
      } catch (e) {}
      out.push(shape(r, signed));
    }
    return out;
  }

  /** The newest deck (or, with kind 'recording', the session video) posted
      against one session, or null. */
  async function forModule(code, kind) {
    const sb = client();
    if (!sb) return null;
    let q = sb.from('session_materials')
      .select('*').eq('module_code', code).eq('kind', kind || 'deck');
    /* This Week only ever plays a published recording */
    if (kind === 'recording') q = q.eq('status', 'published');
    const { data, error } = await q.order('posted_at', { ascending: false }).limit(1);
    if (error || !data || !data.length) return null;
    const r = data[0];
    return shape(r, await sign(r.storage_path));
  }

  /** The other materials posted against one session, oldest first, each signed. */
  async function materialsFor(code) {
    const sb = client();
    if (!sb) return [];
    const { data, error } = await sb.from('session_materials')
      .select('*').eq('module_code', code).eq('kind', 'material')
      .order('posted_at', { ascending: true });
    if (error || !data) return [];
    const out = [];
    for (const r of data) {
      let signed = null;
      try {
        const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(r.storage_path, SIGNED_SECONDS);
        signed = s ? s.signedUrl : null;
      } catch (e) {}
      out.push(shape(r, signed));
    }
    return out;
  }

  /** Post one extra material; opts as putDeck, title required. */
  function putMaterial(opts) {
    if (!String(opts.title || '').trim()) return Promise.reject(new Error('Give the material a name first.'));
    return putDeck(Object.assign({}, opts, { kind: 'material', title: String(opts.title).trim() }));
  }

  /** The session recording (video) for one session, or null. */
  function recordingFor(code) { return forModule(code, 'recording'); }

  /** Post the session recording file. Admins and the tech team only
      (the database refuses anyone else).
      opts as putDeck, plus status ('draft'|'published'), visibility
      ('all'|'staff') and duration ("2:58:10"). */
  function putRecording(opts) {
    return putDeck(Object.assign({}, opts, { kind: 'recording' }));
  }

  /** Post the session recording as a link (Drive, YouTube, Vimeo) — no upload. */
  async function putRecordingLink(opts) {
    const sb = client();
    if (!sb) throw new Error('Supabase is not configured on this page.');
    const link = String(opts.link || '').trim();
    if (!/^https?:\/\/\S+$/i.test(link)) throw new Error('That link does not look right — it should start with https://');
    const { data: { user } } = await sb.auth.getUser();
    const row = Object.assign({
      module_code: opts.moduleCode, week_no: opts.week == null ? null : opts.week,
      title: opts.title || '', kind: 'recording', storage_path: null, link_url: link,
      file_name: '', mime_type: '', posted_by: user ? user.id : null,
    }, recMeta(opts));
    const { data, error } = await sb.from('session_materials').insert(row).select().single();
    if (error) throw new Error('Could not save the recording: ' + error.message);
    return { row: data };
  }

  /** Every recording, newest first — drafts too for those allowed to see them. */
  async function listRecordings() {
    const sb = client();
    if (!sb) return [];
    const { data, error } = await sb.from('session_materials')
      .select('*').eq('kind', 'recording').order('posted_at', { ascending: false });
    if (error || !data) return [];
    return data.map(r => shape(r, null));
  }

  /** Signed address for one stored recording, for a preview. */
  function signedUrl(path) { return sign(path); }

  /** Change a recording's status, visibility, title or length in place. */
  async function updateRecording(id, patch) {
    const sb = client();
    const row = {};
    if (patch.title != null) row.title = patch.title;
    if (patch.status) row.status = patch.status === 'draft' ? 'draft' : 'published';
    if (patch.visibility) row.visibility = patch.visibility === 'staff' ? 'staff' : 'all';
    if (patch.duration != null) row.duration = String(patch.duration).trim() || null;
    const { error } = await sb.from('session_materials').update(row).eq('id', id);
    if (error) throw new Error('Could not update it: ' + error.message);
  }

  /** Remove one deck or material: the file and its row. */
  async function remove(id, path) {
    const sb = client();
    if (!sb) return;
    if (path) { try { await sb.storage.from(BUCKET).remove([path]); } catch (e) {} }
    const { error } = await sb.from('session_materials').delete().eq('id', id);
    if (error) throw new Error('Could not remove it: ' + error.message);
  }

  window.STEP_MATERIALS = { isLive, putDeck, putMaterial, putRecording, putRecordingLink, listRecordings,
    updateRecording, signedUrl, listAll, forModule, materialsFor, recordingFor, remove, BUCKET };
})();
