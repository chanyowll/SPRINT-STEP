/* =====================================================================
   STEP Hub — STEP Mail (data)

   Each person has their own inbox. Only the STEP Team (admins and the
   tech team) writes new messages; a message to a group lands in every
   member's inbox with its own read/unread. Everyone else replies, and
   a reply goes privately to the STEP Team. The rules live in the
   database (supabase/mail.sql); this file only reads and calls them.
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

  const fail = (error, fallback) => {
    const m = (error && error.message) || fallback || 'Something went wrong.';
    if (/mail_messages|mail_send|mail_reply|is_step_team|does not exist|schema cache/i.test(m))
      return new Error('STEP Mail is not set up yet. Ask the tech team to run mail.sql.');
    return new Error(m);
  };

  /* is this account on the STEP Team? asked once per signed-in person */
  let teamFor = null, teamAns = false;
  async function isTeam() {
    const u = await me(); if (!u) return false;
    if (teamFor === u.id) return teamAns;
    const { data, error } = await client().rpc('is_step_team');
    teamFor = u.id; teamAns = !error && data === true;
    return teamAns;
  }

  /** Everything this person can see: messages, newest first, and their own read marks. */
  async function load() {
    const u = await me(); if (!u) return { me: null, team: false, messages: [], readAt: {} };
    const sb = client();
    const [team, msgs, mine] = await Promise.all([
      isTeam(),
      sb.from('mail_messages').select('*').order('created_at', { ascending: false }).limit(600),
      sb.from('mail_recipients').select('message_id, read_at').eq('user_id', u.id)
    ]);
    if (msgs.error) throw fail(msgs.error);
    const readAt = {};
    (mine.data || []).forEach(r => { readAt[r.message_id] = r.read_at || null; });
    return { me: u, team, messages: msgs.data || [], readAt };
  }

  /** How many unread messages wait for this person (the number on the envelope). */
  async function unread() {
    const u = await me(); if (!u) return 0;
    const sb = client();
    const own = await sb.from('mail_recipients').select('message_id', { count: 'exact', head: true })
      .eq('user_id', u.id).is('read_at', null);
    let n = own.error ? 0 : (own.count || 0);
    if (await isTeam()) {
      const rep = await sb.from('mail_messages').select('id', { count: 'exact', head: true })
        .eq('from_team', false).is('team_read_at', null);
      if (!rep.error) n += rep.count || 0;
    }
    return n;
  }

  const safeName = n => String(n || 'file').replace(/[^\w.\- ()]+/g, '_').slice(-120);
  const newId = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));

  /** Send a new message (STEP Team only). to = { users:[], teams:[], roles:[], everyone } */
  async function send(o) {
    const sb = client(); if (!sb) throw new Error('You are offline.');
    const id = newId(), files = o.files || [], att = [];
    for (const f of files) {
      if (f.size > 50 * 1024 * 1024) throw new Error(f.name + ' is over 50 MB.');
      const path = id + '/' + safeName(f.name);
      const up = await sb.storage.from('mail').upload(path, f, { upsert: false, contentType: f.type || undefined });
      if (up.error) throw fail(up.error, 'Could not upload ' + f.name + '.');
      att.push({ name: f.name, path, size: f.size });
    }
    const to = o.to || {};
    const { data, error } = await sb.rpc('mail_send', {
      p_subject: o.subject, p_body: o.body,
      p_users: to.users || [], p_teams: to.teams || [], p_roles: to.roles || [],
      p_everyone: !!to.everyone, p_attachments: att, p_id: id
    });
    if (error) {
      if (att.length) sb.storage.from('mail').remove(att.map(a => a.path)).catch(() => {});
      throw fail(error);
    }
    nudge();
    return data;
  }

  async function reply(parentId, body) {
    const { data, error } = await client().rpc('mail_reply', { p_parent: parentId, p_body: body });
    if (error) throw fail(error);
    nudge();
    return data;
  }

  async function markRead(ids) {
    if (!ids || !ids.length) return;
    const { error } = await client().rpc('mail_mark_read', { p_ids: ids });
    if (!error) nudge();
  }

  /** Remove a message sent by mistake, with its files (STEP Team only). */
  async function remove(msg) {
    const sb = client();
    const paths = (msg.attachments || []).map(a => a.path).filter(Boolean);
    if (paths.length) await sb.storage.from('mail').remove(paths);
    const { error } = await sb.rpc('mail_delete', { p_id: msg.id });
    if (error) throw fail(error);
    nudge();
  }

  /** People and teams for the "To" field (STEP Team only). */
  async function directory() {
    const sb = client();
    const [p, t] = await Promise.all([
      sb.from('profiles').select('id, full_name, email, role, roles, team_id').neq('role', 'guest').order('full_name'),
      sb.from('teams').select('id, name, short').order('id')
    ]);
    if (p.error) throw fail(p.error);
    return { people: p.data || [], teams: t.data || [] };
  }

  /** Who a message went to and who has opened it (STEP Team only). */
  async function readers(messageId) {
    const sb = client();
    const { data, error } = await sb.from('mail_recipients').select('user_id, read_at').eq('message_id', messageId);
    if (error) throw fail(error);
    const ids = (data || []).map(r => r.user_id);
    const names = {};
    if (ids.length) {
      const p = await sb.from('profiles').select('id, full_name, email').in('id', ids);
      (p.data || []).forEach(x => { names[x.id] = x.full_name || x.email; });
    }
    return (data || []).map(r => ({ name: names[r.user_id] || 'Someone', read_at: r.read_at }))
      .sort((a, b) => (!!b.read_at - !!a.read_at) || a.name.localeCompare(b.name));
  }

  async function fileUrl(att) {
    const { data, error } = await client().storage.from('mail').createSignedUrl(att.path, 3600, { download: att.name });
    if (error) throw fail(error, 'Could not open the file.');
    return data.signedUrl;
  }

  /* ---------- the number on the envelope, on every page ---------- */
  let timer = null, busy = false;
  async function paintBadge() {
    if (busy) return; busy = true;
    let n = 0;
    try { if (available() && (await me())) n = await unread(); } catch (e) { n = 0; }
    busy = false;
    document.querySelectorAll('.nav-mail-n').forEach(el => {
      el.textContent = n > 99 ? '99+' : String(n);
      el.hidden = !n;
    });
    document.querySelectorAll('.nav-mail').forEach(a =>
      a.setAttribute('aria-label', n ? 'STEP Mail, ' + n + ' unread' : 'STEP Mail'));
    window.dispatchEvent(new CustomEvent('stephub_mail_unread', { detail: { count: n } }));
  }
  function nudge() { paintBadge(); }
  function start() {
    if (timer) return;
    paintBadge();
    timer = setInterval(() => { if (!document.hidden) paintBadge(); }, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) paintBadge(); });
  }
  window.addEventListener('stephub_auth_changed', () => { teamFor = null; paintBadge(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  window.STEP_MAIL = { available, isTeam, load, unread, send, reply, markRead, remove, directory, readers, fileUrl, refreshBadge: paintBadge };
})();
