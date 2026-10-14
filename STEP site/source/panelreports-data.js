/* =====================================================================
   STEP Hub — Panelists' weekly accomplishment reports

   One report per panelist per session: (session_code, seat). The text is
   built from the panelist's own score sheet (see the Panel page) and
   then kept here so it can be edited, downloaded to sign, and the signed
   copy uploaded.

   Signed in to the Supabase project → the panel_reports table and the
   private "panel-reports" bucket (supabase/panel_reports.sql).
   Otherwise (the offline mockup) → this browser's localStorage, same
   shape; the signed copy is kept by name only.
   ===================================================================== */

(function () {
  'use strict';

  const TABLE = 'panel_reports';
  const BUCKET = 'panel-reports';
  const LS = 'stephub_panelreport::';
  const SIGNED_SECONDS = 60 * 60 * 4;
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

  const lsKey = k => LS + k.session + '::seat' + k.seat;
  function lsRead(k) {
    try { return JSON.parse(localStorage.getItem(lsKey(k)) || 'null'); } catch (e) { return null; }
  }
  function lsWrite(k, obj) {
    try { localStorage.setItem(lsKey(k), JSON.stringify(obj)); } catch (e) {}
  }

  function fromRow(r) {
    return {
      panelist: r.panelist || '', topic: r.topic || '', period: r.period || '',
      rows: Array.isArray(r.rows) ? r.rows : [], source_stamp: r.source_stamp || '',
      status: r.status || 'draft',
      signed: r.signed_path ? { path: r.signed_path, name: r.signed_name || 'signed report',
                                size: r.signed_size || 0, url: null } : null,
      submitted_at: r.submitted_at, updated_at: r.updated_at,
    };
  }

  /** k = { session, seat }. Resolves { live, report } — report is null until one is created. */
  async function load(k) {
    if (await isLive()) {
      const sb = client();
      const { data, error } = await sb.from(TABLE).select('*')
        .eq('session_code', k.session).eq('seat', k.seat).maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return { live: true, report: null };
      const rep = fromRow(data);
      if (rep.signed) {
        try {
          const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(rep.signed.path, SIGNED_SECONDS);
          rep.signed.url = s ? s.signedUrl : null;
        } catch (e) {}
      }
      return { live: true, report: rep };
    }
    return { live: false, report: lsRead(k) };
  }

  /**
   * Save the report. k = { session, seat, week_no, panel }; r = { panelist,
   * topic, period, rows, source_stamp }. Resolves the saved report.
   */
  async function save(k, r) {
    const now = new Date().toISOString();
    if (await isLive()) {
      const sb = client();
      const { data: { user } } = await sb.auth.getUser();
      const row = {
        session_code: k.session, week_no: k.week_no == null ? null : k.week_no,
        seat: k.seat, panel_letter: k.panel || '',
        panelist: r.panelist || '', topic: r.topic || '', period: r.period || '',
        rows: r.rows || [], source_stamp: r.source_stamp || '',
        updated_by: user ? user.id : null, updated_at: now,
      };
      const { data, error } = await sb.from(TABLE)
        .upsert(row, { onConflict: 'session_code,seat' }).select('*').single();
      if (error) throw new Error(error.message);
      return fromRow(data);
    }
    const cur = lsRead(k) || { status: 'draft', signed: null, submitted_at: null };
    const next = Object.assign(cur, { panelist: r.panelist || '', topic: r.topic || '', period: r.period || '',
      rows: r.rows || [], source_stamp: r.source_stamp || '', updated_at: now });
    lsWrite(k, next);
    return next;
  }

  const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');

  /**
   * Upload the signed copy and mark the report submitted.
   * opts = { key, report, file, onProgress }. Resolves the saved report.
   */
  async function submit(opts) {
    const k = opts.key, now = new Date().toISOString();
    if (await isLive()) {
      const sb = client();
      const saved = await save(k, opts.report);
      const { data: sess } = await sb.auth.getSession();
      const token = sess && sess.session && sess.session.access_token;
      if (!token) throw new Error('You are signed out. Sign in again and retry.');
      const path = `${slug(k.session)}/seat${k.seat}/${Date.now()}-${slug(opts.file.name).slice(-60)}`;
      const url = `${sb.storageUrl || (sb.supabaseUrl + '/storage/v1')}/object/${BUCKET}/${path}`;
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.setRequestHeader('x-upsert', 'true');
        if (opts.file.type) xhr.setRequestHeader('Content-Type', opts.file.type);
        xhr.upload.onprogress = e => {
          if (e.lengthComputable && typeof opts.onProgress === 'function') opts.onProgress(e.loaded / e.total);
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) return resolve();
          let msg = 'Upload failed (' + xhr.status + ')';
          try { const j = JSON.parse(xhr.responseText); if (j.message) msg = j.message; } catch (e) {}
          if (xhr.status === 413) msg = 'The file is over the 25 MB limit.';
          if (xhr.status === 403) msg = 'Your account is not allowed to submit this report.';
          reject(new Error(msg));
        };
        xhr.onerror = () => reject(new Error('Network error while uploading.'));
        xhr.send(opts.file);
      });
      const old = saved.signed && saved.signed.path;
      const { data, error } = await sb.from(TABLE).update({
        status: 'submitted', submitted_at: now, updated_at: now,
        signed_path: path, signed_name: opts.file.name, signed_size: opts.file.size,
      }).eq('session_code', k.session).eq('seat', k.seat).select('*').single();
      if (error) throw new Error(error.message);
      if (old && old !== path) { try { await sb.storage.from(BUCKET).remove([old]); } catch (e) {} }
      const rep = fromRow(data);
      try {
        const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(path, SIGNED_SECONDS);
        rep.signed.url = s ? s.signedUrl : null;
      } catch (e) {}
      return rep;
    }
    const cur = lsRead(k) || {};
    Object.assign(cur, {
      panelist: opts.report.panelist || '', topic: opts.report.topic || '', period: opts.report.period || '',
      rows: opts.report.rows || [], source_stamp: opts.report.source_stamp || '',
      status: 'submitted', submitted_at: now, updated_at: now,
      signed: { path: null, name: opts.file.name, size: opts.file.size, url: null },
    });
    if (typeof opts.onProgress === 'function') opts.onProgress(1);
    lsWrite(k, cur);
    return cur;
  }

  window.STEP_PANELREPORTS = { isLive, load, save, submit };
})();
