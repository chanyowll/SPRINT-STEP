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

  /* rooms (supabase/chat_rooms.sql): 'fam', 'team:g1', 'group:mentors' …
     Until that file has been run there is no room column, and everything
     is STEP Fam, as before. */
  let roomsReady = null;                      // null = not checked yet
  async function hasRooms() {
    if (roomsReady !== null) return roomsReady;
    const { error } = await client().from('chat_messages').select('room').limit(1);
    roomsReady = !error;
    return roomsReady;
  }

  /** The latest messages in a room, oldest first. */
  async function list(limit, room) {
    const ready = await hasRooms();
    let q = client().from('chat_messages').select('*');
    if (ready) q = q.eq('room', room || 'fam');
    else if (room && room !== 'fam') return [];
    const { data, error } = await q.order('created_at', { ascending: false }).limit(limit || 200);
    if (error) throw new Error(error.message);
    return (data || []).reverse();
  }

  /** The newest message of each room you can read: { room: row } */
  async function latest(rooms) {
    if (!(await hasRooms())) return {};
    const out = {};
    await Promise.all(rooms.map(async r => {
      const { data } = await client().from('chat_messages').select('*').eq('room', r)
        .order('created_at', { ascending: false }).limit(1);
      if (data && data[0]) out[r] = data[0];
    }));
    return out;
  }

  const roomRow = (row, room) => (roomsReady && room ? Object.assign(row, { room }) : row);

  async function send(body, room) {
    const text = String(body || '').trim();
    if (!text) throw new Error('Write a message first.');
    if (text.length > 2000) throw new Error('That message is too long — keep it under 2,000 characters.');
    await hasRooms();
    const { data, error } = await client().from('chat_messages').insert(roomRow({ body: text }, room)).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  /* ---- pictures: pasted or attached screenshots ---- */
  const BUCKET = 'chat-images';
  const urlCache = {};
  const extOf = t => (String(t).split('/')[1] || 'png').replace('jpeg', 'jpg').replace(/[^a-z0-9]/g, '') || 'png';

  /** Shrink a big screenshot (longest side 1600 px) so it sends quickly. */
  async function prepare(file) {
    if (!file || !/^image\//.test(file.type)) throw new Error('Only pictures can be sent here.');
    if (file.size > 20e6) throw new Error('That picture is too large. Crop it and try again.');
    let bmp = null;
    try { bmp = await createImageBitmap(file); } catch (e) {}
    if (!bmp) {
      if (file.size > 5.5e6) throw new Error('That picture is too large. Crop it and try again.');
      return { blob: file, ext: extOf(file.type) };
    }
    const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    if (k === 1 && file.size < 1.5e6 && file.type !== 'image/bmp') { bmp.close && bmp.close(); return { blob: file, ext: extOf(file.type) }; }
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close && bmp.close();
    const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.88));
    if (!blob) throw new Error('Could not read that picture.');
    return { blob, ext: 'jpg' };
  }

  /** Send a picture with an optional caption. */
  async function sendImage(file, caption, room) {
    const text = String(caption || '').trim();
    if (text.length > 2000) throw new Error('That caption is too long. Keep it under 2,000 characters.');
    const user = await me(); if (!user) throw new Error('Sign in to send pictures.');
    const { blob, ext } = await prepare(file);
    const path = user.id + '/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
    const up = await client().storage.from(BUCKET).upload(path, blob, { contentType: blob.type || 'image/' + ext, cacheControl: '3600' });
    if (up.error) throw new Error(/bucket not found/i.test(up.error.message) ? 'Pictures are not set up yet. Ask the tech team to run chat_images.sql.' : up.error.message);
    await hasRooms();
    const { data, error } = await client().from('chat_messages').insert(roomRow({ body: text || '\uD83D\uDCF7 Photo', image_path: path }, room)).select().single();
    if (error) {
      client().storage.from(BUCKET).remove([path]).catch(() => {});
      throw new Error(/image_path/i.test(error.message) ? 'Pictures are not set up yet. Ask the tech team to run chat_images.sql.' : error.message);
    }
    return data;
  }

  /** Short-lived links for pictures: { path: url } (kept for 50 minutes). */
  async function imageUrls(paths) {
    const need = paths.filter(p => !urlCache[p] || urlCache[p].exp < Date.now());
    if (need.length) {
      const { data, error } = await client().storage.from(BUCKET).createSignedUrls(need, 3600);
      if (!error && data) data.forEach(d => { if (d.signedUrl && d.path) urlCache[d.path] = { url: d.signedUrl, exp: Date.now() + 50 * 60000 }; });
    }
    const out = {}; paths.forEach(p => { if (urlCache[p]) out[p] = urlCache[p].url; });
    return out;
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

  async function remove(id, imagePath) {
    const { error } = await client().from('chat_messages').delete().eq('id', id);
    if (error) throw new Error(error.message);
    if (imagePath) client().storage.from(BUCKET).remove([imagePath]).catch(() => {});
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

  window.STEP_CHAT = { available, me, hasRooms, list, latest, send, sendImage, imageUrls, edit, setPinned, remove, info, subscribe };
})();
