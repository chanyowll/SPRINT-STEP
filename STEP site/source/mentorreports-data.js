/* =====================================================================
   STEP Hub — Mentors' weekly accomplishment reports

   One report per team per week: (week_code, team_id). The planned
   activities come from the site (MOCK.faculty.mentorPlans); a report
   holds what the mentor fills in against them — a tick and a remark per
   activity — and, once signed, the uploaded copy.

   Signed in to the Supabase project → the mentor_reports table and the
   private "mentor-reports" bucket. Otherwise (the offline mockup) → this
   browser's localStorage, same shape; the signed copy is kept by name
   only, since a browser cannot keep the file itself.
   ===================================================================== */

(function () {
  'use strict';

  const TABLE = 'mentor_reports';
  const BUCKET = 'mentor-reports';
  const LS = 'stephub_mentorreport::';
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

  const lsKey = (week, team) => LS + week + '::' + team;
  function lsRead(week, team) {
    try { return JSON.parse(localStorage.getItem(lsKey(week, team)) || 'null'); } catch (e) { return null; }
  }
  function lsWrite(week, team, obj) {
    try { localStorage.setItem(lsKey(week, team), JSON.stringify(obj)); } catch (e) {}
  }

  /* unsaved edits, per report, kept in this browser until the database confirms them */
  const PEND = 'stephub_mentorreport_pending::';
  function pendWrite(week, team, obj) { try { localStorage.setItem(PEND + week + '::' + team, JSON.stringify(obj)); } catch (e) {} }
  function pendRead(week, team) { try { return JSON.parse(localStorage.getItem(PEND + week + '::' + team) || 'null'); } catch (e) { return null; } }
  function pendClear(week, team) { try { localStorage.removeItem(PEND + week + '::' + team); } catch (e) {} }
  /* put unsaved ticks and remarks back on the loaded report; nothing the database has is dropped */
  function mergePending(rep, p) {
    if (!p || !p.tasks) return false;
    let changed = false;
    const T = Object.assign({}, rep.tasks || {});
    Object.keys(p.tasks).forEach(i => {
      const a = T[i] || {}, b = p.tasks[i] || {};
      const remark = String(b.remark || '').trim().length >= String(a.remark || '').trim().length ? (b.remark || '') : (a.remark || '');
      const done = !!(a.done || b.done);
      if (remark !== (a.remark || '') || done !== !!a.done) changed = true;
      T[i] = Object.assign({}, a, b, { remark, done });
    });
    rep.tasks = T;
    if (!rep.mentor_name && p.mentor_name) rep.mentor_name = p.mentor_name;
    if (!rep.period && p.period) rep.period = p.period;
    return changed;
  }

  const blank = () => ({ tasks: {}, mentor_name: '', period: '', status: 'draft', mentor_id: null,
                         signed: null, submitted_at: null, updated_at: null });
  function fromRow(r) {
    return {
      tasks: r.tasks || {}, mentor_name: r.mentor_name || '', period: r.period || '',
      status: r.status || 'draft', mentor_id: r.mentor_id || null,
      signed: r.signed_path ? { path: r.signed_path, name: r.signed_name || 'signed report',
                                size: r.signed_size || 0, url: null } : null,
      submitted_at: r.submitted_at, updated_at: r.updated_at,
    };
  }

  /** Resolves { live, report } for one team's week. */
  async function load(week, team) {
    if (await isLive()) {
      const sb = client();
      const { data, error } = await sb.from(TABLE).select('*')
        .eq('week_code', week).eq('team_id', team).maybeSingle();
      if (error) throw new Error(error.message);
      const rep = data ? fromRow(data) : blank();
      const restored = mergePending(rep, pendRead(week, team));
      if (rep.signed) {
        try {
          const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(rep.signed.path, SIGNED_SECONDS);
          rep.signed.url = s ? s.signedUrl : null;
        } catch (e) {}
      }
      return { live: true, report: rep, restored };
    }
    return { live: false, report: Object.assign(blank(), lsRead(week, team) || {}) };
  }

  /**
   * Save the draft. k = { week, week_no, team, team_name };
   * r = { tasks, mentor_name, period }. Resolves the saved report.
   */
  async function save(k, r, opt) {
    opt = opt || {};
    const now = new Date().toISOString();
    if (await isLive()) {
      /* a copy in this browser first, so nothing typed is lost if the save is refused */
      pendWrite(k.week, k.team, { tasks: r.tasks || {}, mentor_name: r.mentor_name || '', period: r.period || '', at: now });
      const sb = client();
      const { data: { user } } = await sb.auth.getUser();
      const row = {
        week_code: k.week, week_no: k.week_no == null ? null : k.week_no,
        team_id: k.team, team_name: k.team_name || '',
        mentor_name: r.mentor_name || '', period: r.period || '', tasks: r.tasks || {},
        updated_by: user ? user.id : null, updated_at: now,
      };
      /* mentor_id goes in every save. An upsert is checked against the "insert" rule even when
         the row already exists, and that rule needs a mentor's own id in mentor_id — leaving it
         out (as after the first save) made every later save fail and the remarks were lost.
         The team's own mentor (opt.claim) takes the report; an admin keeps whoever owns it. */
      row.mentor_id = user && opt.claim ? user.id : (r.mentor_id || null);
      const { data, error } = await sb.from(TABLE)
        .upsert(row, { onConflict: 'week_code,team_id' }).select('*').single();
      if (error) {
        if (/row-level security/i.test(error.message)) {
          throw new Error('Not saved to the STEP Hub yet — your remarks are kept in this browser. Reload and try again, or message the STEP Tech Team.');
        }
        throw new Error(error.message + ' — your remarks are kept in this browser.');
      }
      pendClear(k.week, k.team);
      return fromRow(data);
    }
    const cur = Object.assign(blank(), lsRead(k.week, k.team) || {});
    const next = Object.assign(cur, { tasks: r.tasks || {}, mentor_name: r.mentor_name || '',
                                      period: r.period || '', updated_at: now });
    lsWrite(k.week, k.team, next);
    return next;
  }

  const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '');

  /**
   * Upload the signed copy and mark the report submitted.
   * opts = { key: {week, week_no, team, team_name}, report, file, onProgress }
   * Resolves the saved report.
   */
  async function submit(opts) {
    const k = opts.key, now = new Date().toISOString();
    if (await isLive()) {
      const sb = client();
      /* the draft first, so the row exists and belongs to someone */
      const saved = await save(k, opts.report, { claim: !!opts.claim });
      const { data: sess } = await sb.auth.getSession();
      const token = sess && sess.session && sess.session.access_token;
      if (!token) throw new Error('You are signed out. Sign in again and retry.');
      const path = `${slug(k.week)}/${slug(k.team)}/${Date.now()}-${slug(opts.file.name).slice(-60)}`;
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
          if (xhr.status === 403) msg = 'Your account is not allowed to submit mentor reports.';
          reject(new Error(msg));
        };
        xhr.onerror = () => reject(new Error('Network error while uploading.'));
        xhr.send(opts.file);
      });
      const old = saved.signed && saved.signed.path;
      const { data, error } = await sb.from(TABLE).update({
        status: 'submitted', submitted_at: now, updated_at: now,
        signed_path: path, signed_name: opts.file.name, signed_size: opts.file.size,
      }).eq('week_code', k.week).eq('team_id', k.team).select('*').single();
      if (error) throw new Error(error.message);
      if (old && old !== path) { try { await sb.storage.from(BUCKET).remove([old]); } catch (e) {} }
      const rep = fromRow(data);
      try {
        const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(path, SIGNED_SECONDS);
        rep.signed.url = s ? s.signedUrl : null;
      } catch (e) {}
      return rep;
    }
    const cur = Object.assign(blank(), lsRead(k.week, k.team) || {});
    Object.assign(cur, {
      tasks: opts.report.tasks || {}, mentor_name: opts.report.mentor_name || '',
      period: opts.report.period || '', status: 'submitted', submitted_at: now, updated_at: now,
      signed: { path: null, name: opts.file.name, size: opts.file.size, url: null },
    });
    if (typeof opts.onProgress === 'function') opts.onProgress(1);
    lsWrite(k.week, k.team, cur);
    return cur;
  }

  /** Which teams have submitted a week: { team_id: { submitted_at } } */
  async function weekStatus(week) {
    const out = {};
    if (await isLive()) {
      const { data, error } = await client().from(TABLE)
        .select('team_id,status,submitted_at').eq('week_code', week);
      if (error) return out;
      (data || []).forEach(r => { if (r.status === 'submitted') out[r.team_id] = { submitted_at: r.submitted_at }; });
      return out;
    }
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || key.indexOf(LS + week + '::') !== 0) continue;
        const v = JSON.parse(localStorage.getItem(key) || 'null');
        if (v && v.status === 'submitted') out[key.slice((LS + week + '::').length)] = { submitted_at: v.submitted_at };
      }
    } catch (e) {}
    return out;
  }

  window.STEP_MENTORREPORTS = { isLive, load, save, submit, weekStatus };
})();
