/* =====================================================================
   STEP Hub — refresh everyone's site

   The tech console's "Refresh everyone's site" adds a row to the
   site_signals table (supabase/live.sql). Every open STEP Hub page hears
   it through Supabase Realtime and reloads itself quietly at the next
   safe moment, so new materials, announcements and a newly pushed version
   of the site reach everyone without anyone pressing refresh.

   It reloads at once, with a thin bar sliding across the top of the page,
   unless something is uploading or the person is typing in a field right
   now; then it waits until they stop for a few seconds. Score sheets and
   FASTRAC items save as they are typed, so a reload never loses work.

   A page that missed the signal (phone asleep, connection dropped) checks
   for a newer one whenever it comes back into view.
   ===================================================================== */
(function () {
  'use strict';

  const client = () => (window.STEP_SUPABASE && window.STEP_SUPABASE.getClient ? window.STEP_SUPABASE.getClient() : null);
  let baseline = null;                            // the newest signal when this page opened (its id)
  const TYPE_MS = 6000;                           // someone typing: wait until they pause this long
  let due = false, lastType = 0, sentAt = 0, channel = null;

  /* ---- uploads in flight: a reload must never cut one off ---- */
  let uploads = 0;
  const isUpload = (url, method) => /\/storage\/v1\/(object|upload)/.test(String(url || '')) && /^(POST|PUT|PATCH)$/i.test(method || 'GET');
  try {
    const open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, u) { this.__stepUp = isUpload(u, m); return open.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function () {
      if (this.__stepUp) { uploads++; this.addEventListener('loadend', () => { uploads = Math.max(0, uploads - 1); }, { once: true }); }
      return send.apply(this, arguments);
    };
  } catch (e) {}
  try {
    const f = window.fetch;
    if (f) window.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : (input && input.url);
      const method = (init && init.method) || (input && input.method) || 'GET';
      if (!isUpload(url, method)) return f.apply(this, arguments);
      uploads++;
      return f.apply(this, arguments).finally(() => { uploads = Math.max(0, uploads - 1); });
    };
  } catch (e) {}

  /* ---- typing: only a person typing in a field holds the reload back ---- */
  ['keydown', 'input'].forEach(ev =>
    document.addEventListener(ev, () => { lastType = Date.now(); }, { capture: true, passive: true }));
  function typing() {
    const a = document.activeElement;
    const field = a && (a.tagName === 'TEXTAREA' || a.isContentEditable ||
      (a.tagName === 'INPUT' && !/^(button|submit|checkbox|radio|file|range|color)$/i.test(a.type || '')));
    return !!field && Date.now() - lastType < TYPE_MS;
  }
  const safe = () => uploads === 0 && !typing();

  /* the thin bar across the top, so the refresh is seen */
  function showBar() {
    try {
      const bar = document.createElement('div');
      bar.setAttribute('aria-hidden', 'true');
      bar.style.cssText = 'position:fixed;left:0;top:0;height:3px;width:0;z-index:2147483647;background:#1f6fb2;' +
        'box-shadow:0 0 8px rgba(31,111,178,.6);transition:width .55s ease-out;';
      document.body.appendChild(bar);
      requestAnimationFrame(() => { bar.style.width = '100%'; });
    } catch (e) {}
  }
  function reloadWhenSafe() {
    if (!due) return;
    if (!safe()) return;
    due = false;
    try { window.dispatchEvent(new CustomEvent('stephub_before_reload')); } catch (e) {}
    if (!document.hidden) showBar();
    setTimeout(() => location.reload(), 650);    // the bar runs, and any last save goes out
  }
  setInterval(reloadWhenSafe, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reloadWhenSafe(); else catchUp(); });

  function heard(row) {
    if (!row) return;
    if (baseline != null && row.id != null && row.id <= baseline) return;   // already in this page
    if (row.id != null) baseline = Math.max(baseline || 0, row.id);
    if (Date.now() - sentAt < 15000) return;     // the console that sent it stays put
    due = true;
    reloadWhenSafe();
  }

  /* the newest signal id; the first answer only sets the starting point */
  async function latest() {
    const sb = client(); if (!sb) return null;
    try {
      const { data, error } = await sb.from('site_signals').select('id').order('id', { ascending: false }).limit(1);
      if (error) return null;
      return data && data[0] ? data[0] : { id: 0 };
    } catch (e) { return null; }
  }
  /* missed while away? compare with the newest signal */
  async function catchUp() {
    const row = await latest(); if (!row) return;
    if (baseline == null) { baseline = row.id; return; }
    if (row.id > baseline) heard(row);
  }

  function listen() {
    const sb = client(); if (!sb || channel) return;
    if (baseline == null) catchUp();
    try {
      channel = sb.channel('stephub-site-signals')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'site_signals' }, p => heard(p.new))
        .subscribe();
    } catch (e) { channel = null; }
  }
  /* the signed-in session gives the live link its access; listen once it is known */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', listen); else listen();
  window.addEventListener('stephub_auth_settled', () => { if (!channel) listen(); });
  window.addEventListener('stephub_auth_changed', () => {
    const sb = client();
    if (channel && sb) { try { sb.removeChannel(channel); } catch (e) {} channel = null; }
    listen();
  });
  /* safety net if the live link is down: a tiny check every 15 seconds */
  setInterval(() => { if (!document.hidden) catchUp(); }, 15000);

  /* for the tech console's button */
  async function sendRefresh() {
    const sb = client(); if (!sb) throw new Error('Not connected to the database.');
    sentAt = Date.now();
    const { error } = await sb.from('site_signals').insert({ kind: 'refresh' });
    if (error) { sentAt = 0; throw new Error(error.message); }
  }
  window.STEP_LIVE = { sendRefresh, get pending() { return due; } };
})();
