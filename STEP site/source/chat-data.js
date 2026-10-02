/* =====================================================================
   STEP Hub — STEP Family group chat

   One room for the whole cohort. Messages are kept in the database and
   arrive on everyone's screen as they are posted (Supabase Realtime, with
   a quiet re-check every 20 seconds in case the live link drops). The
   sender's name and badge are stamped by the database from their own
   account, so nobody can post as someone else.
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

  /** The latest messages, oldest first. */
  async function list(limit) {
    const { data, error } = await client().from('chat_messages').select('*')
      .order('created_at', { ascending: false }).limit(limit || 200);
    if (error) throw new Error(error.message);
    return (data || []).reverse();
  }

  async function send(body) {
    const text = String(body || '').trim();
    if (!text) throw new Error('Write a message first.');
    if (text.length > 2000) throw new Error('That message is too long — keep it under 2,000 characters.');
    const { data, error } = await client().from('chat_messages').insert({ body: text }).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  /** Change the words of your own message (it shows as edited). */
  async function edit(id, body) {
    const text = String(body || '').trim();
    if (!text) throw new Error('A message can\'t be empty — remove it instead.');
    if (text.length > 2000) throw new Error('That message is too long — keep it under 2,000 characters.');
    const { data, error } = await client().from('chat_messages').update({ body: text }).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  /** Pin one message to the top of the room, or unpin it (STEP team only). */
  async function setPinned(id, on) {
    const { error } = await client().from('chat_messages').update({ pinned: !!on }).eq('id', id);
    if (error) throw new Error(error.message);
  }

  async function remove(id) {
    const { error } = await client().from('chat_messages').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async function info() {
    try { const { data } = await client().rpc('chat_room_info'); return data || null; }
    catch (e) { return null; }
  }

  /** Live updates. onChange({ type: 'insert'|'delete', row }) ; returns a stop function. */
  function subscribe(onChange) {
    const sb = client();
    let ch = null, timer = null, stopped = false;
    try {
      ch = sb.channel('step-family-chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' },
            p => onChange({ type: 'insert', row: p.new }))
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_messages' },
            p => onChange({ type: 'update', row: p.new }))
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages' },
            p => onChange({ type: 'delete', row: p.old }))
        .subscribe();
    } catch (e) { ch = null; }
    /* belt and braces: a quiet re-check in case the live link drops */
    timer = setInterval(() => { if (!stopped && document.visibilityState !== 'hidden') onChange({ type: 'resync' }); }, 20000);
    return () => {
      stopped = true; clearInterval(timer);
      if (ch) { try { sb.removeChannel(ch); } catch (e) {} }
    };
  }

  window.STEP_CHAT = { available, me, list, send, edit, setPinned, remove, info, subscribe };
})();
