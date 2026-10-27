/* =====================================================================
   STEP Hub — STEP Calendar (data + the quick-look popover)

   The program dates come from schedule-data.js, so they are never out
   of step with the rest of the site. On top of them the STEP Team adds
   (supabase/calendar.sql):
     · one Zoom link per program session  (cal_links)
     · each team's mentoring sessions     (cal_mentoring)
   Links and mentoring are read only by people who are signed in, and a
   team's mentoring only by that team and the STEP Team (database rules).

   The calendar button in the header opens a small month with the next
   few items; "Open full calendar" leads to the Calendar page.
   ===================================================================== */
(function () {
  'use strict';

  const SB = () => window.STEP_SUPABASE;
  const client = () => (SB() && SB().getClient ? SB().getClient() : null);
  const live = () => !!(client() && (!SB().isOnline || SB().isOnline()));
  const DEMO = /[?&]demo=1(&|$)/.test(location.search || "");
  const esc = t => String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------- dates ---------- */
  const TZ = "Asia/Manila";
  const today = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  const add = (d, n) => { const x = new Date(d + "T00:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  const daysTo = d => Math.round((new Date(d + "T00:00:00Z") - new Date(today() + "T00:00:00Z")) / 864e5);
  const fmt = (d, o) => new Date(d + "T00:00:00Z").toLocaleDateString("en-PH",
    Object.assign({ timeZone: "UTC", weekday: "short", month: "short", day: "numeric" }, o || {}));
  const t12 = hm => { if (!hm) return ""; let [h, m] = String(hm).split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return h + ":" + String(m).padStart(2, "0") + " " + ap; };

  const KIND = {
    learning:    { name: "Learning session", chip: "Learning",   zoom: true },
    feedback:    { name: "Feedback session", chip: "Feedback",   zoom: true },
    orientation: { name: "Onboarding",       chip: "Onboarding", zoom: true },
    mentoring:   { name: "Mentoring",        chip: "Mentoring",  zoom: true },
    event:       { name: "Event",            chip: "Event",      zoom: true },   /* anything the STEP Team adds that is not a team's mentoring */
    onsite:      { name: "On site",          chip: "On site",    zoom: true },   /* a link too: map, livestream or sign-up */
    deadline:    { name: "Output due",       chip: "Due 12 NN" },
    holiday:     { name: "No session",       chip: "No session" }
  };

  /* ---------- teams (names and their mentor, from the site's own list) ---------- */
  function teams() {
    const g = (window.MOCK && (window.MOCK.groups || window.MOCK.teams)) || [];
    return g.map(t => ({ id: t.id, short: t.short || t.name, name: t.name, mentor: t.mentor_name || "" }));
  }
  const teamName = id => { const t = teams().find(x => x.id === id); return t ? t.short : id; };

  /* ---------- the program, as calendar events ---------- */
  function programEvents() {
    const S = window.STEP_SCHEDULE; if (!S) return [];
    const out = [];
    S.weeks.forEach(w => {
      w.sessions.forEach(s => {
        const days = [s.date];
        if (s.end && s.end > s.date) for (let d = add(s.date, 1); d <= s.end; d = add(d, 1)) days.push(d);
        days.forEach((d, i) => {
          let title;
          if (s.kind === "learning") title = "Learning: " + w.short;
          else if (s.kind === "feedback") title = "Feedback: " + w.short;
          else if (s.kind === "holiday") title = "No session: " + s.title.replace(/^No Session\s*[-—]\s*/i, "");
          else if (s.kind === "onsite") title = (s.rail || s.title.split(/:| — /)[0]) + (days.length > 1 && !s.spread ? " · Day " + (i + 1) : "");
          else title = s.title;
          out.push({ key: d + ":" + s.kind, d, k: s.kind, w: w.code, weekTitle: w.short, title, full: s.title,
                     time: s.time || "", where: s.kind === "onsite" ? "On site" : s.kind === "holiday" ? "" : "Zoom" });
        });
      });
      if (w.output && S.dueOf) {
        const due = S.dueOf(w.week);
        if (due) out.push({ key: due.slice(0, 10) + ":deadline", d: due.slice(0, 10), k: "deadline", w: w.code, weekTitle: w.short,
                            title: "Output due: " + w.short, time: "12:00 NN", where: "My Team's Work" });
      }
    });
    return out;
  }
  const weekOf = d => { const S = window.STEP_SCHEDULE; return S ? S.weeks.find(w => d >= w.starts && d <= w.ends) || null : null; };
  const inBreak = d => { const B = window.STEP_SCHEDULE && window.STEP_SCHEDULE.BREAK; return !!B && d >= B.starts && d <= B.ends; };

  /* ---------- who is looking ---------- */
  function user() { const u = window.MOCK && window.MOCK.auth && window.MOCK.auth.getCurrentUser(); return u && u.role !== "guest" ? u : null; }
  let teamFor = null, teamAns = false;
  async function isTeam() {
    const u = user(); if (!u) return false;
    if (DEMO || !live()) return window.MOCK.auth.rolesOf(u).indexOf("admin") > -1;
    if (teamFor === u.id) return teamAns;
    const { data, error } = await client().rpc("is_step_team");
    teamFor = u.id; teamAns = !error && data === true;
    return teamAns;
  }

  /* ---------- the stored part: links and mentoring ---------- */
  const fail = e => new Error(/cal_links|cal_mentoring|cal_events|does not exist|schema cache/i.test((e && e.message) || "")
    ? "The calendar's Zoom links are not set up yet. Ask the tech team to run calendar.sql." : (e && e.message) || "Something went wrong.");

  /* sample store for ?demo=1 */
  const demo = { links: null, ment: null, evts: [] };
  function demoStore() {
    if (demo.links) return demo;
    demo.links = {}; demo.ment = [];
    programEvents().forEach(e => { if (KIND[e.k].zoom && e.d < "2026-12-01") demo.links[e.key] = "https://zoom.us/j/8551234" + e.d.replace(/-/g, "").slice(4) + "?pwd=STEP"; });
    const S = window.STEP_SCHEDULE;
    teams().slice(0, 10).forEach((t, i) => S.weeks.filter(w => w.output && w.week >= 3).forEach(w => {
      const off = i < 2 ? 2 : 3, start = ["14:00", "16:00", "09:00", "11:00", "14:00", "17:00", "09:00", "10:30", "13:00", "15:00"][i];
      const [h, m] = start.split(":").map(Number), endM = h * 60 + m + 90;
      demo.ment.push({ id: "dm" + t.id + w.code, team_id: t.id, on_date: add(w.starts, off), start_time: start,
        end_time: String(Math.floor(endM / 60)).padStart(2, "0") + ":" + String(endM % 60).padStart(2, "0"),
        mentor: t.mentor, zoom_url: w.week < 6 ? "https://zoom.us/j/9" + i + "00112233" : null });
    }));
    return demo;
  }

  async function loadExtras() {
    if (!user()) return { links: {}, ment: [], evts: [] };
    if (DEMO || !live()) { const s = demoStore(); return { links: Object.assign({}, s.links), ment: s.ment.slice(), evts: s.evts.slice() }; }
    const sb = client();
    const [l, m, v] = await Promise.all([
      sb.from("cal_links").select("session_key, zoom_url"),
      sb.from("cal_mentoring").select("*").order("on_date").order("start_time"),
      sb.from("cal_events").select("*").order("on_date").order("start_time")
    ]);
    if (l.error) throw fail(l.error);
    const links = {}; (l.data || []).forEach(r => { links[r.session_key] = r.zoom_url; });
    return { links, ment: m.error ? [] : (m.data || []), evts: v.error ? [] : (v.data || []) };
  }

  async function saveLinks(keys, url) {
    url = String(url || "").trim();
    if (url && !/^https?:\/\/\S+$/i.test(url)) throw new Error("That doesn't look like a link. It should start with https://");
    if (DEMO || !live()) { const s = demoStore(); keys.forEach(k => { if (url) s.links[k] = url; else delete s.links[k]; }); bust(); return; }
    const sb = client();
    const r = url ? await sb.from("cal_links").upsert(keys.map(k => ({ session_key: k, zoom_url: url, updated_at: new Date().toISOString() })))
                  : await sb.from("cal_links").delete().in("session_key", keys);
    if (r.error) throw fail(r.error);
    bust();
  }
  function checkMent(r) {
    if (!r.team_id) throw new Error("Pick a team.");
    if (!r.on_date) throw new Error("Pick a date.");
    if (!r.start_time || !r.end_time || r.end_time <= r.start_time) throw new Error("The end time must be after the start time.");
    if (r.zoom_url && !/^https?:\/\/\S+$/i.test(r.zoom_url)) throw new Error("The Zoom link should start with https://");
  }
  async function addMentoring(rows) {
    rows.forEach(checkMent);
    if (DEMO || !live()) { const s = demoStore(); rows.forEach((r, i) => s.ment.push(Object.assign({ id: "dn" + Date.now() + i }, r))); bust(); return; }
    const r = await client().from("cal_mentoring").insert(rows);
    if (r.error) throw fail(r.error);
    bust();
  }
  async function updateMentoring(id, row) {
    checkMent(row);
    if (DEMO || !live()) { const s = demoStore(); const x = s.ment.find(m => m.id === id); if (x) Object.assign(x, row); bust(); return; }
    const r = await client().from("cal_mentoring").update(row).eq("id", id);
    if (r.error) throw fail(r.error);
    bust();
  }
  async function deleteMentoring(id) {
    if (DEMO || !live()) { const s = demoStore(); s.ment = s.ment.filter(m => m.id !== id); bust(); return; }
    const r = await client().from("cal_mentoring").delete().eq("id", id);
    if (r.error) throw fail(r.error);
    bust();
  }

  /* ---- events that are not a team's mentoring (STEP Team adds them; everyone signed in sees them) ---- */
  function checkEvt(r) {
    if (!String(r.title || "").trim()) throw new Error("Give the event a title.");
    if (String(r.title).length > 120) throw new Error("Keep the title under 120 characters.");
    if (!r.on_date) throw new Error("Pick a date.");
    if ((r.start_time && !r.end_time) || (!r.start_time && r.end_time)) throw new Error("Set both the start and the end time, or leave both empty for an all-day event.");
    if (r.start_time && r.end_time <= r.start_time) throw new Error("The end time must be after the start time.");
    if (r.link_url && !/^https?:\/\/\S+$/i.test(r.link_url)) throw new Error("The link should start with https://");
    if (String(r.notes || "").length > 600) throw new Error("Keep the notes under 600 characters.");
  }
  async function addEvents(rows) {
    rows.forEach(checkEvt);
    if (DEMO || !live()) { const s = demoStore(); rows.forEach((r, i) => s.evts.push(Object.assign({ id: "de" + Date.now() + i }, r))); bust(); return; }
    const r = await client().from("cal_events").insert(rows);
    if (r.error) throw fail(r.error);
    bust();
  }
  async function updateEvent(id, row) {
    checkEvt(row);
    if (DEMO || !live()) { const s = demoStore(); const x = s.evts.find(m => m.id === id); if (x) Object.assign(x, row); bust(); return; }
    const r = await client().from("cal_events").update(row).eq("id", id);
    if (r.error) throw fail(r.error);
    bust();
  }
  async function deleteEvent(id) {
    if (DEMO || !live()) { const s = demoStore(); s.evts = s.evts.filter(m => m.id !== id); bust(); return; }
    const r = await client().from("cal_events").delete().eq("id", id);
    if (r.error) throw fail(r.error);
    bust();
  }

  /* everything one person sees, merged and sorted; cached briefly */
  let cache = null, cacheAt = 0, cacheWho = null, pending = null;
  function bust() { cache = null; window.dispatchEvent(new CustomEvent("stephub_cal_changed")); }
  async function load(force) {
    const u = user(), who = u ? u.id : "guest";
    if (!force && cache && cacheWho === who && Date.now() - cacheAt < 60000) return cache;
    if (pending) return pending;
    pending = (async () => {
      let ex = { links: {}, ment: [], evts: [] }, err = "";
      try { ex = await loadExtras(); } catch (e) { err = e.message; }
      const team = await isTeam().catch(() => false);
      const ev = programEvents().map(e => Object.assign(e, { zoom: ex.links[e.key] || "" }));
      ex.ment.forEach(m => ev.push({ key: "m:" + m.id, id: m.id, d: m.on_date, k: "mentoring", team_id: m.team_id, teamName: teamName(m.team_id),
        mentor: m.mentor || "", start: String(m.start_time).slice(0, 5), end: String(m.end_time).slice(0, 5),
        time: t12(m.start_time) + " – " + t12(m.end_time), where: "Zoom", zoom: m.zoom_url || "",
        title: "Mentoring · " + teamName(m.team_id), w: (weekOf(m.on_date) || {}).code || "" }));
      (ex.evts || []).forEach(m => { const st = m.start_time ? String(m.start_time).slice(0, 5) : "", en = m.end_time ? String(m.end_time).slice(0, 5) : "";
        ev.push({ key: "e:" + m.id, id: m.id, d: m.on_date, k: "event", title: m.title, start: st, end: en, hasTimes: !!(st && en),
          time: st && en ? t12(st) + " – " + t12(en) : "All day", where: m.place || "", zoom: m.link_url || "", full: m.notes || "",
          w: (weekOf(m.on_date) || {}).code || "", weekTitle: (weekOf(m.on_date) || {}).short || "" }); });
      ev.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : (a.start || a.time || "") < (b.start || b.time || "") ? -1 : 1));
      const mine = u ? [u.team_id].concat(Array.isArray(u.teams) ? u.teams : []).filter(Boolean) : [];
      cache = { events: ev, team, signedIn: !!u, myTeam: u ? u.team_id || "" : "", myTeams: mine, error: err };
      cacheAt = Date.now(); cacheWho = who; pending = null;
      return cache;
    })();
    return pending;
  }

  /* the next things coming, for "up next" and the badge */
  const upcoming = (ev, n) => ev.filter(e => e.d >= today() && e.k !== "holiday").slice(0, n);

  /* ---------- download: the whole program for Google / Outlook / Apple ---------- */
  function hm(t) {
    const m = /(\d{1,2}):(\d{2})\s*(AM|PM|NN)/i.exec(t || ""); if (!m) return null;
    let h = +m[1] % 12; if (/PM|NN/i.test(m[3])) h += 12; return [h, +m[2]];
  }
  function ics(events) {
    const z = n => String(n).padStart(2, "0");
    const utc = (d, h, m) => { const x = new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10), h - 8, m)); /* Manila is UTC+8 */
      return x.getUTCFullYear() + z(x.getUTCMonth() + 1) + z(x.getUTCDate()) + "T" + z(x.getUTCHours()) + z(x.getUTCMinutes()) + "00Z"; };
    const txt = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SPRINT-STEP//STEP Hub//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:STEP 2.5", "X-WR-TIMEZONE:Asia/Manila"];
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    events.filter(e => e.k !== "holiday").forEach(e => {
      L.push("BEGIN:VEVENT", "UID:" + e.key.replace(/[^\w-]/g, "-") + "@stephub", "DTSTAMP:" + stamp);
      let a = null, b = null;
      if (e.k === "mentoring" || (e.k === "event" && e.hasTimes)) { a = e.start.split(":").map(Number); b = e.end.split(":").map(Number); }
      else if (e.time && e.k !== "deadline") { const p = e.time.split(/[–-]/); a = hm(p[0]); b = hm(p[1]); }
      if (a && b) L.push("DTSTART:" + utc(e.d, a[0], a[1]), "DTEND:" + utc(e.d, b[0], b[1]));
      else L.push("DTSTART;VALUE=DATE:" + e.d.replace(/-/g, ""), "DTEND;VALUE=DATE:" + add(e.d, 1).replace(/-/g, ""));
      L.push("SUMMARY:" + txt((e.k === "deadline" ? "STEP: Output due 12:00 NN · " + e.weekTitle : "STEP: " + e.title)));
      const desc = [e.w ? e.w + (e.weekTitle ? " · " + e.weekTitle : "") : "", e.mentor ? "Mentor: " + e.mentor : "", e.k === "event" ? e.full : "", e.zoom ? (e.k === "event" ? "Link: " : "Zoom: ") + e.zoom : ""].filter(Boolean).join("\n");
      if (desc) L.push("DESCRIPTION:" + txt(desc));
      L.push("LOCATION:" + txt(e.zoom || e.where || ""));
      if (e.zoom) L.push("URL:" + e.zoom);
      L.push("END:VEVENT");
    });
    L.push("END:VCALENDAR");
    return L.join("\r\n");
  }
  function download(events) {
    const blob = new Blob([ics(events)], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "STEP-2.5-calendar.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  /* what one person should see: the program, plus their team's mentoring
     (the STEP Team chooses a team, or all). The database already limits
     what a participant receives; this keeps the page honest in demo mode too. */
  function visibleFor(data, pick) {
    return data.events.filter(e => e.k !== "mentoring"
      || (data.team ? (pick === "all" || e.team_id === pick) : (data.myTeams || []).indexOf(e.team_id) > -1));
  }

  /* ---------- the quick look ---------- */
  const ZOOM = '<img class="cq-z" src="assets/zoom-logo.png" alt="">';
  const LINK = '<svg class="cq-z cq-lk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>';
  /* on-site days carry a plain link (venue map, livestream, sign-up), not a Zoom room */
  const isZoom = e => e.k !== "onsite" && !(e.k === "event" && !/zoom\./i.test(e.zoom || ""));
  const fullHref = () => (document.getElementById("route-calendar") ? "#calendar" : "calendar.html");
  let pop = null, popMonth = null, popDay = null, popData = null, openBtn = null;

  function miniMonth(ym, evs) {
    const first = ym + "-01", dow = (new Date(first + "T00:00:00Z").getUTCDay()), start = add(first, -dow), now = today();
    let h = ["S", "M", "T", "W", "T", "F", "S"].map(x => '<span class="cq-h">' + x + "</span>").join("");
    for (let i = 0; i < 42; i++) {
      const d = add(start, i), on = evs.filter(e => e.d === d && e.k !== "holiday");
      const kinds = [...new Set(on.map(e => e.k))].slice(0, 3);
      h += '<button type="button" class="cq-d' + (d.slice(0, 7) !== ym ? " o" : "") + (d === now ? " t" : "") + (d === popDay ? " sel" : "") + (inBreak(d) ? " brk" : "")
        + '" data-cqd="' + d + '" aria-label="' + esc(fmt(d, { weekday: "long", month: "long" }) + (on.length ? ", " + on.length + " on this day" : "")) + '">' + (+d.slice(8))
        + (kinds.length ? '<span class="cq-dots">' + kinds.map(k => '<s class="k-' + k + '"></s>').join("") + "</span>" : "") + "</button>";
    }
    return h;
  }
  function item(e) {
    return '<a class="cq-i k-' + e.k + '" href="' + fullHref() + '" data-cqe="' + esc(e.key) + '"><span class="cq-bar"></span><span class="cq-tx"><em>' + esc(KIND[e.k].name + (e.w ? " · " + e.w : "")) + "</em><b>" + esc(e.title) + "</b><small>"
      + esc((e.time ? e.time + " · " : "") + (e.where || "")) + "</small></span>"
      + (e.zoom ? '<span class="cq-join" data-join="' + esc(e.zoom) + '" role="link" tabindex="0">' + (isZoom(e) ? ZOOM + "Join" : LINK + "Open") + "</span>" : "") + "</a>";
  }
  function paintPop() {
    if (!pop) return;
    const evs = popData ? visibleFor(popData, popData.team ? "all" : "") : [];
    const ym = popMonth;
    let list = "", head;
    if (popDay) { head = fmt(popDay, { weekday: "long", month: "long" }); const on = evs.filter(e => e.d === popDay); list = on.length ? on.map(item).join("") : '<p class="cq-none">Nothing on this day.</p>'; }
    else {
      head = "Coming up"; const up = upcoming(evs, 4); let g = "";
      up.forEach(e => { const lab = e.d === today() ? "Today" : daysTo(e.d) === 1 ? "Tomorrow" : fmt(e.d); if (lab !== g) list += '<div class="cq-day">' + esc(g = lab) + "</div>"; list += item(e); });
      if (!up.length) list = '<p class="cq-none">' + (popData ? "Nothing coming up. The program has ended." : "Loading…") + "</p>";
    }
    pop.innerHTML = '<div class="cq-hd"><b>' + esc(new Date(ym + "-01T00:00:00Z").toLocaleDateString("en-PH", { timeZone: "UTC", month: "long", year: "numeric" })) + '</b>'
      + '<span><button type="button" class="cq-nb" data-cqm="-1" aria-label="Previous month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg></button>'
      + '<button type="button" class="cq-nb" data-cqm="1" aria-label="Next month"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg></button></span></div>'
      + '<div class="cq-mini">' + miniMonth(ym, evs) + "</div>"
      + '<div class="cq-list"><div class="cq-day cq-lh">' + esc(head) + (popDay ? ' <button type="button" class="cq-clear" data-cqclear>Back to coming up</button>' : "") + "</div>" + list + "</div>"
      + '<div class="cq-ft"><button type="button" class="cq-dl" data-cqdl>Add to my calendar</button><a class="cq-full" href="' + fullHref() + '">Open full calendar</a></div>';
  }
  /* the popover hangs from the header, under the calendar button (the
     rightmost thing in it), so it scrolls and zooms with the header */
  function place() {
    if (!pop || !openBtn) return;
    const hd = openBtn.closest(".site-header") || document.body, wrap = hd.querySelector(".wrap") || hd;
    pop.style.right = Math.max(8, hd.clientWidth - (wrap.offsetLeft + wrap.offsetWidth) - 4) + "px";
  }
  function closePop() {
    if (!pop) return;
    pop.remove(); pop = null;
    document.querySelectorAll(".nav-cal").forEach(b => b.setAttribute("aria-expanded", "false"));
    if (openBtn) try { openBtn.focus({ preventScroll: true }); } catch (e) {}
    openBtn = null;
  }
  async function openPop(btn) {
    if (pop) { closePop(); return; }
    openBtn = btn; popDay = null; popMonth = null;
    pop = document.createElement("div"); pop.className = "cq-pop"; pop.id = "cq-pop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "STEP Calendar");
    (btn.closest(".site-header") || document.body).appendChild(pop);
    const nav = document.getElementById("nav"); if (nav) nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "true");
    const S = window.STEP_SCHEDULE, now = today();
    popMonth = (now < S.cohort.starts_on ? S.cohort.starts_on : now > S.cohort.ends_on ? S.cohort.ends_on : now).slice(0, 7);
    popData = cache; paintPop(); place();
    popData = await load(); paintPop(); place();
  }
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest(".nav-cal");
    if (b) { e.preventDefault(); openPop(b); return; }
    if (!pop) return;
    if (!pop.contains(e.target)) { closePop(); return; }
    const j = e.target.closest("[data-join]");
    if (j) { e.preventDefault(); e.stopPropagation(); window.open(j.dataset.join, "_blank", "noopener"); return; }
    const m = e.target.closest("[data-cqm]");
    if (m) { const d = new Date(popMonth + "-01T00:00:00Z"); d.setUTCMonth(d.getUTCMonth() + +m.dataset.cqm); popMonth = d.toISOString().slice(0, 7); paintPop(); return; }
    const d = e.target.closest("[data-cqd]");
    if (d) { popDay = popDay === d.dataset.cqd ? null : d.dataset.cqd; if (popDay) popMonth = popDay.slice(0, 7); paintPop(); return; }
    if (e.target.closest("[data-cqclear]")) { popDay = null; paintPop(); return; }
    if (e.target.closest("[data-cqdl]")) { if (popData) download(visibleFor(popData, popData.team ? "all" : "")); return; }
    const it = e.target.closest("[data-cqe]");
    const routed = !!document.getElementById("route-calendar"), here = routed && /^#calendar$/.test(location.hash);
    if (it) {
      window.__calFocus = it.dataset.cqe;
      if (!routed) it.href = "calendar.html#" + encodeURIComponent(it.dataset.cqe);
      closePop();
      if (here || (!routed && /calendar\.html$/.test(location.pathname))) { e.preventDefault(); if (window.__renderCalendar) window.__renderCalendar(); }
      return;
    }
    if (e.target.closest(".cq-full")) { window.__calFocus = null; closePop(); if (here) e.preventDefault(); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && pop) { closePop(); return; }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("[data-join]")) { e.preventDefault(); window.open(e.target.dataset.join, "_blank", "noopener"); }
  });
  window.addEventListener("resize", place);
  window.addEventListener("hashchange", closePop);

  /* ---------- the button's label says what's next (for screen readers and the hover tip) ---------- */
  async function paintBadge() {
    let label = "STEP Calendar";
    try {
      const data = await load();
      const next = upcoming(visibleFor(data, data.team ? "all" : "").filter(e => e.k !== "deadline"), 1)[0];
      if (next) { const n = daysTo(next.d); label = "STEP Calendar. Next: " + next.title + (n === 0 ? ", today" : n === 1 ? ", tomorrow" : ", in " + n + " days"); }
    } catch (e) {}
    document.querySelectorAll(".nav-cal").forEach(b => { b.setAttribute("aria-label", label); b.title = label; });
  }
  window.addEventListener("stephub_auth_changed", () => { teamFor = null; cache = null; paintBadge(); if (pop) load(true).then(d => { popData = d; paintPop(); }); });
  window.addEventListener("stephub_cal_changed", paintBadge);
  setInterval(() => { if (!document.hidden) { cache = null; paintBadge(); } }, 10 * 60 * 1000);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintBadge); else paintBadge();

  window.STEP_CAL = {
    KIND, isZoom, teams, teamName, programEvents, weekOf, inBreak, today, add, daysTo, fmt, t12, esc,
    load, isTeam, visibleFor, upcoming, saveLinks, addMentoring, updateMentoring, deleteMentoring, addEvents, updateEvent, deleteEvent, download, refresh: () => load(true)
  };
})();
