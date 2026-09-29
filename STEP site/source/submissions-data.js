/* =====================================================================
   STEP Hub — Submission files (video + slide deck)

   Uploads a team's weekly output into the private "submissions" bucket,
   records it in the submissions table, and hands back short-lived signed
   URLs so the file can be played or opened by anyone the RLS policies
   allow — the team itself, its mentor, its panel, trainers, admins.

   Upload goes through XMLHttpRequest rather than supabase-js so the page
   can show real progress on a 200 MB video over a slow connection.
   ===================================================================== */

(function () {
  'use strict';

  const BUCKET = 'submissions';
  const SIGNED_SECONDS = 60 * 60 * 4;      // four hours: long enough to watch and seek

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

  /** submissions/<team>/week-08/video-1723534000-my-pitch.mp4 */
  function pathFor(teamId, week, kind, file) {
    const wk = String(week).padStart(2, '0');
    return `${teamId}/week-${wk}/${kind}-${Date.now()}-${slug(file.name).slice(-60)}`;
  }

  /* ── Upload ─────────────────────────────────────────────────────── */

  /**
   * Upload one file and record it.
   * opts: { teamId, week, moduleCode, moduleTitle, kind: 'video'|'slide',
   *         file, deadline, onProgress(fraction) }
   * Resolves { path, row } or throws.
   */
  async function putFile(opts) {
    const sb = client();
    if (!sb) throw new Error('Supabase is not configured on this page.');

    const { data: sess } = await sb.auth.getSession();
    const token = sess && sess.session && sess.session.access_token;
    if (!token) throw new Error('You are signed out. Sign in again and retry.');

    const path = pathFor(opts.teamId, opts.week, opts.kind, opts.file);
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
        reject(new Error(msg));
      };
      xhr.onerror = () => reject(new Error('Network error while uploading.'));
      xhr.send(opts.file);
    });

    /* record it — one row per team + week + kind */
    const { data: { user } } = await sb.auth.getUser();
    const now = new Date();
    const deadline = opts.deadline ? new Date(opts.deadline) : null;
    const row = {
      team_id: opts.teamId,
      week_no: opts.week,
      module_code: opts.moduleCode || '',
      module_title: opts.moduleTitle || '',
      kind: opts.kind,
      status: deadline && now > deadline ? 'late' : 'submitted',
      submitted_at: now.toISOString(),
      deadline_at: deadline ? deadline.toISOString() : null,
      storage_path: path,
      file_name: opts.file.name,
      file_size: opts.file.size,
      mime_type: opts.file.type || '',
      uploaded_by: user ? user.id : null,
    };
    const { data, error } = await sb.from('submissions')
      .upsert(row, { onConflict: 'team_id,week_no,kind' })
      .select()
      .single();
    if (error) throw new Error('Saved the file but could not record it: ' + error.message);
    return { path, row: data };
  }

  /* ── Read back ──────────────────────────────────────────────────── */

  /** Every recorded file for a team + week, keyed by kind, with signed URLs. */
  async function getWeek(teamId, week) {
    const sb = client();
    if (!sb) return null;
    const { data, error } = await sb.from('submissions')
      .select('*')
      .eq('team_id', teamId)
      .eq('week_no', week);
    if (error || !data || !data.length) return null;

    const out = {};
    for (const r of data) {
      if (!r.storage_path) continue;
      const { data: signed } = await sb.storage.from(BUCKET)
        .createSignedUrl(r.storage_path, SIGNED_SECONDS);
      out[r.kind] = {
        url: signed ? signed.signedUrl : null,
        name: r.file_name,
        size: r.file_size,
        type: r.mime_type,
        path: r.storage_path,
        status: r.status,
        submitted_at: r.submitted_at,
      };
    }
    return Object.keys(out).length ? out : null;
  }

  /** Remove both files and their rows for a team + week (used by Replace). */
  async function clearWeek(teamId, week) {
    const sb = client();
    if (!sb) return;
    const { data } = await sb.from('submissions').select('storage_path')
      .eq('team_id', teamId).eq('week_no', week);
    const paths = (data || []).map(r => r.storage_path).filter(Boolean);
    if (paths.length) await sb.storage.from(BUCKET).remove(paths);
    await sb.from('submissions').delete().eq('team_id', teamId).eq('week_no', week);
  }

  /** Who has handed in for one week: { team_id: { video, slide, late } }.
      One small query, no signed URLs — used to mark the team picker. */
  async function weekStatus(week) {
    const sb = client();
    if (!sb) return {};
    const { data, error } = await sb.from('submissions')
      .select('team_id, kind, status, storage_path').eq('week_no', week);
    if (error || !data) return {};
    const out = {};
    data.forEach(r => {
      if (!r.storage_path) return;
      const t = out[r.team_id] || (out[r.team_id] = { video: false, slide: false, late: false });
      if (r.kind === 'video') t.video = true;
      if (r.kind === 'slide') t.slide = true;
      if (r.status === 'late') t.late = true;
    });
    return out;
  }

  window.STEP_SUBMISSIONS = { isLive, putFile, getWeek, clearWeek, weekStatus, BUCKET };
})();
