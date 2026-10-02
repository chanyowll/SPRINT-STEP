/* =====================================================================
   STEP Hub — My Team's Work: the real numbers

   For anyone signed in with a real STEP account, the dashboard is built
   from the database and nothing else:

     scores       panel sheets the panel has SUBMITTED, averaged per
                  session (team_panel_scores), plus any score the STEP
                  team enters directly in the scores table
     hand-ins     the team's uploads in the submissions table
     attendance   the attendance table
     roster       team_members
     themes       panel_comments, once the STEP team has coded them

   Nothing recorded yet → that part of the page says so. It never falls
   back to the sample cohort. The sample cohort only answers the offline
   preview (?demo=1), which does not use this file.
   ===================================================================== */

(function () {
  'use strict';

  const SB = () => window.STEP_SUPABASE;
  const client = () => (SB() && SB().getClient ? SB().getClient() : null);

  function isLive() {
    return !!(SB() && SB().isOnline && SB().isOnline());
  }

  const MS_DAY = 86400000;
  const pad = n => String(n).padStart(2, '0');
  const isoDate = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

  /* Monday that opens the week containing d */
  function weekStart(d) {
    if (window.STEP_CLOCK && window.STEP_CLOCK.weekStart) return window.STEP_CLOCK.weekStart(d);
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - (x.getDay() + 6) % 7);
    return x;
  }

  /* When week `wk`'s team output is due: 12:00 NN (Manila) on the day
     before that week's feedback session, from the STEP 2.5 schedule.
     Without the schedule, the Friday of that week counted back from the
     current week `cw`. */
  function dueOf(wk, cw, now) {
    const S = window.STEP_SCHEDULE;
    if (S && S.byWeek(wk)) return S.dueOf(wk) || (S.byWeek(wk).ends + 'T12:00:00+08:00');
    const mon = weekStart(now);
    const fri = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() - (cw - wk) * 7 + 4);
    return isoDate(fri) + 'T12:00:00+08:00';
  }

  /* "Beachhead markets and customer segments" → two short lines */
  function twoLines(title) {
    const w = String(title || '').split(/\s+/).filter(Boolean);
    if (w.length < 3) return w.join(' ');
    let best = 1, diff = Infinity;
    for (let i = 1; i < w.length; i++) {
      const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length);
      if (d < diff) { diff = d; best = i; }
    }
    return w.slice(0, best).join(' ') + '\n' + w.slice(best).join(' ');
  }

  function initialsOf(name) {
    return String(name || '?').replace(/^(Dr|Engr|Mr|Ms|Mrs|Prof|Atty)\.?\s+/i, '')
      .replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/).slice(0, 2)
      .map(s => s[0] ? s[0].toUpperCase() : '').join('') || '?';
  }

  async function q(p) {
    try { const { data, error } = await p; return error ? [] : (data || []); }
    catch (e) { return []; }
  }

  /**
   * Build the dashboard object for one team from the database.
   * opt = { team, weekNo, weeksTotal, now }
   * Resolves an object with the same shape the page draws from.
   */
  async function loadTeamWork(teamId, opt) {
    opt = opt || {};
    const sb = client();
    const now = opt.now || new Date();
    const cw = Number(opt.weekNo) || 1;
    const team = opt.team || {};

    const [members, mods, scoreRows, panelAvg, attRows, subRows, comments] = await Promise.all([
      q(sb.from('team_members').select('name, role, initials, sort_order').eq('team_id', teamId).order('sort_order')),
      q(sb.from('modules').select('code, week_no, title').order('week_no')),
      q(sb.from('scores').select('*').eq('team_id', teamId)),
      q(sb.rpc('team_panel_scores', { t: teamId })),
      q(sb.from('attendance').select('*').eq('team_id', teamId)),
      q(sb.from('submissions').select('week_no, module_code, kind, status, submitted_at, deadline_at').eq('team_id', teamId)),
      q(sb.from('panel_comments').select('*').eq('team_id', teamId).order('week_no')),
    ]);

    /* the weeks that have a team output and a feedback session (W2–W11
       in STEP 2.5), plus Demo Day (W12), which the panel also scores */
    const S = window.STEP_SCHEDULE;
    const scoredWeek = n => !S || !S.byWeek(n) ? n >= 1 : (S.byWeek(n).output || n === 12);
    const weekly = mods.filter(m => Number(m.week_no) >= 1 && scoredWeek(Number(m.week_no)))
      .map(m => Object.assign({}, m, S && S.byWeek(m.week_no) ? { short: S.byWeek(m.week_no).short, axis: S.byWeek(m.week_no).axis } : {}));
    const handinWeek = n => !S || !S.byWeek(n) ? true : !!S.byWeek(n).output;
    const modOfWeek = wk => weekly.find(m => Number(m.week_no) === wk);
    const modByCode = c => mods.find(m => m.code === c);

    /* ── roster ── */
    const seen = {};
    const uniq = ini => { let k = ini, n = 2; while (seen[k]) k = ini + (n++); seen[k] = 1; return k; };
    const roster = members.map(m => ({
      name: m.name, role: m.role || 'Member', initials: uniq(m.initials || initialsOf(m.name)),
    }));

    /* ── scores: a direct entry wins, else the panel's submitted average ── */
    const outputs = [];
    weekly.forEach(m => {
      const direct = scoreRows.find(s => s.module_code === m.code);
      const avg = panelAvg.find(p => p.session_code === m.code);
      if (!direct && !avg) return;
      outputs.push({
        code: m.code,
        axis: (direct && direct.axis_label) || m.axis || twoLines(m.title),
        full: (direct && direct.full_label) || m.title,
        week: Number(m.week_no),
        score: Number(direct ? direct.score : avg.score),
        panel: (direct && direct.panel_letter) || (avg && avg.panel_letter) || team.panel_letter || '—',
        scored_on: direct && direct.scored_on ? direct.scored_on
                 : avg && avg.last_at ? isoDate(new Date(avg.last_at)) : isoDate(now),
      });
    });
    outputs.sort((a, b) => a.week - b.week);

    /* ── attendance ── */
    const sesMap = {};
    attRows.forEach(r => {
      const k = r.session_code || r.session_label || 'S';
      if (!sesMap[k]) {
        /* the chart reads "W<n> <Type>" — make sure every label has both */
        let label = String(r.session_label || '').trim();
        if (!/^\S+\s+\S+/.test(label)) label = (r.session_code || 'S') + ' ' + (r.session_type || 'Session');
        sesMap[k] = { code: k, label, present: {} };
      }
      sesMap[k].present[String(r.member_name || '').trim()] = !!r.present;
    });
    /* week by week, in the order the sessions happen: orientation, the
       learning session, on-site days, the feedback session, Demo Day */
    const RANK = { OR: 0, LS: 1, OS: 2, FB: 3, DD: 4, GR: 5 };
    const sesOrder = x => {
      const wk = +((String(x.code).match(/W(\d+)/i) || [])[1] || 0);
      const k = (String(x.code).split('-')[1] || '').toUpperCase();
      return wk * 10 + (k in RANK ? RANK[k] : (/fb|feedback/i.test(x.code + ' ' + x.label) ? 3 : 1));
    };
    const sessions = Object.values(sesMap).sort((a, b) => sesOrder(a) - sesOrder(b));
    /* someone marked present who is not on the roster yet still counts */
    sessions.forEach(s => Object.keys(s.present).forEach(nm => {
      if (nm && !roster.some(m => m.name === nm)) roster.push({ name: nm, role: 'Member', initials: uniq(initialsOf(nm)) });
    }));
    const attendance_grid = {};
    roster.forEach(m => { attendance_grid[m.initials] = sessions.map(s => (s.present[m.name] ? 1 : 0)); });

    /* ── hand-ins: from the first week this team has anything, to now ── */
    const activeWeeks = subRows.map(s => Number(s.week_no)).concat(outputs.map(o => o.week)).filter(w => w >= 1);
    const firstWk = Math.min(cw, ...(activeWeeks.length ? activeWeeks : [cw]));
    const handins = [], submissions = [];
    for (let wk = firstWk; wk <= cw; wk++) {
      const m = modOfWeek(wk); if (!m || !handinWeek(wk)) continue;
      const due = dueOf(wk, cw, now), past = now > new Date(due);
      const KINDS = { video: ['video'], slides: ['slide', 'slides'] };
      const rowOf = kind => subRows.find(s => Number(s.week_no) === wk && KINDS[kind].includes(s.kind));
      const stateOf = kind => {
        const r = rowOf(kind);
        if (r) return { state: r.status === 'late' ? 'late' : 'on_time', at: r.submitted_at };
        return { state: past ? 'missed' : 'open' };
      };
      const video = stateOf('video'), slides = stateOf('slides');
      handins.push({ week: wk, code: m.code, due, video, slides });
      const both = !!(rowOf('video') && rowOf('slides'));
      const scored = outputs.find(o => o.week === wk);
      submissions.push({
        week: wk, code: m.code, module: m.title, due,
        status: both ? (scored ? 'scored' : 'submitted') : (past ? 'missing' : 'open'),
        score: scored ? scored.score : undefined, files: [],
      });
    }
    submissions.sort((a, b) => b.week - a.week);      // this week first

    /* ── what the panel keeps saying, once coded ── */
    let insight = null;
    const coded = comments.filter(c => c.comment_text);
    if (coded.length) {
      const POLE = s => /pos|strength/i.test(s || '') ? 'strength' : /neg|gap|weak/i.test(s || '') ? 'gap' : 'watch';
      const byTheme = {};
      coded.forEach(c => {
        const name = c.theme || c.code || 'Uncoded comments';
        const t = byTheme[name] || (byTheme[name] = { name, polarity: POLE(c.sentiment), mentions: 0, codes: {}, extracts: [] });
        t.mentions++;
        if (c.code) t.codes[c.code] = (t.codes[c.code] || 0) + 1;
        if (t.extracts.length < 2) t.extracts.push({ who: c.panelist || 'Panelist', week: c.week_no, text: c.comment_text });
      });
      const themes = Object.values(byTheme).sort((a, b) => b.mentions - a.mentions).map(t => ({
        name: t.name, polarity: t.polarity, mentions: t.mentions, detail: '',
        codes: Object.keys(t.codes).map(k => ({ label: k, n: t.codes[k] })), extracts: t.extracts,
      }));
      const wks = coded.map(c => c.week_no).filter(Boolean);
      insight = {
        live: true,
        method: 'Reflexive thematic analysis — every panel and mentor comment coded, codes grouped into themes',
        claim: '', next: [],
        based_on: coded.length,
        weeks: wks.length ? 'Weeks ' + Math.min(...wks) + '–' + Math.max(...wks) : '',
        corpus: {
          comments: coded.length,
          panelists: new Set(coded.map(c => c.panelist).filter(Boolean)).size,
          sessions: new Set(coded.map(c => c.week_no)).size,
          codes: new Set(coded.map(c => c.code).filter(Boolean)).size,
          themes: themes.length,
        },
        phases: [], themes, quotes: [],
      };
    }

    return {
      live: true,
      team_id: teamId,
      team_name: team.name,
      technology_title: team.technology_title,
      implementing_agency: team.implementing_agency,
      region: team.region,
      week_no: cw,
      weeks_total: Number(opt.weeksTotal) || 12,
      members: roster,
      outputs,
      trajectory: outputs.map(o => ({ week: o.week, code: o.code, score: o.score })),
      sessions_held: sessions.map((s, i) => ({ n: i + 1, label: s.label })),
      attendance_grid,
      submissions,
      handin_kinds: [
        { key: 'video', label: 'Five-minute video' },
        { key: 'slides', label: 'Slide deck' },
      ],
      handins,
      insight,
    };
  }

  /* ── Capstone: the real team starts from a blank proposal ──
     Keeps every item's structure (titles, guides, the week it opens) and
     clears what the sample team had written. */
  function blankValue(v) {
    if (Array.isArray(v)) {
      if (!v.length) return v;
      const keepAll = v.every(x => x && typeof x === 'object' && 'label' in x);
      return (keepAll ? v : v.slice(0, 1)).map(blankValue);
    }
    if (v && typeof v === 'object') {
      const o = {};
      Object.keys(v).forEach(k => { o[k] = k === 'label' ? v[k] : blankValue(v[k]); });
      return o;
    }
    if (typeof v === 'number') return 0;
    if (typeof v === 'boolean') return false;
    return '';
  }

  function blankCapstone(cap, cw) {
    if (!cap) return cap;
    cw = Number(cw) || cap.week_no;
    return Object.assign({}, cap, {
      live: true,
      week_no: cw,
      form: (cap.form || []).map(f => {
        const x = Object.assign({}, f);
        delete x.draft; delete x.submitted; delete x.submitted_at;
        if ('value' in f) x.value = blankValue(f.value);
        if (f.attachments) x.attachments = f.attachments.map(a => ({ label: a.label, have: false }));
        x.status = f.week <= cw ? 'open' : 'locked';
        return x;
      }),
      deck: (cap.deck || []).map(d => {
        const x = Object.assign({}, d);
        delete x.score; delete x.file;
        x.status = d.week <= cw ? 'due' : 'locked';
        x._st0 = x.status;
        return x;
      }),
    });
  }

  window.STEP_MYTEAM = { isLive, loadTeamWork, blankCapstone, dueOf };
})();
