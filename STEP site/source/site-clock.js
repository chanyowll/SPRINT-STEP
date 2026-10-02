/* =====================================================================
   STEP Hub — the site's clock

   The sample cohort is written around a fixed week (Week 8, Tue–Mon).
   Rather than let those dates go stale, every date in the sample data is
   shifted by a whole number of weeks so that the sample's "this week"
   always lands on the real calendar week you are looking at it in.

   Whole weeks, so a Tuesday session stays on a Tuesday and the Friday
   noon deadline stays on a Friday. Relative order is untouched: an
   announcement posted two days before a deadline still is.

   STEP 2.5 has real dates (schedule-data.js, from the Master Tracker),
   so FIXED_START is set and nothing is shifted any more: This Week is
   the program week the calendar is actually in.
   ===================================================================== */

(function () {
  'use strict';

  const FIXED_START = "2026-10-12";   // STEP 2.5 Week 0 (orientation); the schedule is real
  const MS_DAY = 86400000;

  /* The Monday that starts the week containing d (weeks run Mon→Sun). */
  function weekStart(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const back = (x.getDay() + 6) % 7;             // Mon=0, Tue=1 … Sun=6
    x.setDate(x.getDate() - back);
    return x;
  }

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
  const dateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

  const pad = n => String(n).padStart(2, '0');
  const isoDate = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

  /** Shift one date string by whole days, keeping its shape. */
  function shift(str, days) {
    if (dateOnly.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      return isoDate(new Date(y, m - 1, d + days));
    }
    return new Date(new Date(str).getTime() + days * MS_DAY).toISOString();
  }

  /** Walk anything and shift every date string inside it. */
  function shiftAll(node, days, seen) {
    seen = seen || new Set();
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    Object.keys(node).forEach(k => {
      /* getters build fresh objects on every read — leave them be, their
         source arrays are shifted in their own right */
      const desc = Object.getOwnPropertyDescriptor(node, k);
      if (!desc || desc.get) return;
      const v = node[k];
      if (typeof v === 'function') return;
      if (typeof v === 'string' && (dateOnly.test(v) || dateTime.test(v))) {
        node[k] = shift(v, days);
      } else if (v && typeof v === 'object') {
        shiftAll(v, days, seen);
      }
    });
  }

  /**
   * Move the sample cohort onto the real calendar.
   * Returns the number of days everything moved by.
   */
  function align(MOCK, now) {
    if (!MOCK || !MOCK.thisWeek || !MOCK.thisWeek.starts) return 0;
    now = now || new Date();
    /* real dates: leave everything where the schedule put it */
    if (FIXED_START) { MOCK.thisWeek.today = now.toISOString(); return 0; }

    const sampleStart = (() => {
      const [y, m, d] = String(MOCK.thisWeek.starts).split('-').map(Number);
      return new Date(y, m - 1, d);
    })();

    /* Whole weeks only, measured Monday to Monday, so every weekday keeps
       its meaning: the Tuesday session stays on a Tuesday. */
    const weeks = Math.round((weekStart(now) - weekStart(sampleStart)) / (7 * MS_DAY));
    const days = weeks * 7;

    if (days !== 0) shiftAll(MOCK, days);

    /* a couple of labels carry their own date — keep them in step */
    (MOCK.articles || []).forEach(a => {
      if (a.venue_from_date && a.published_at) {
        const d = new Date(a.published_at);
        a.venue = a.venue + ' ' + d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        a.venue_from_date = false;
      }
    });
    MOCK.thisWeek.today = now.toISOString();       // the clock is the real one
    reframeWeek(MOCK, now);
    return days;
  }

  /**
   * Lay the week out Monday → Sunday around today, keeping each day's
   * content on its own weekday: the Monday that used to close the sample
   * week now opens it.
   */
  function reframeWeek(MOCK, now) {
    const W = MOCK.thisWeek;
    if (!W) return;
    const mon = weekStart(now);
    const dayAt = i => new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);

    W.starts = isoDate(mon);
    W.ends = isoDate(dayAt(6));

    if (!Array.isArray(W.days)) return;
    const NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const byName = {};
    W.days.forEach(d => { if (d && d.label) byName[String(d.label).trim()] = d; });

    W.days = NAMES.map((name, i) => {
      const src = byName[name];
      const when = isoDate(dayAt(i));
      return src ? Object.assign({}, src, { d: when, label: name })
                 : { d: when, label: name, kind: 'rest', title: 'No session', note: 'Nothing scheduled.' };
    });
  }

  /** Footers and anywhere else that prints the year. */
  function stampYear() {
    const y = String(new Date().getFullYear());
    document.querySelectorAll('.yr').forEach(el => { el.textContent = y; });
  }

  window.STEP_CLOCK = { align, weekStart, shift, stampYear, reframeWeek, FIXED_START };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', stampYear);
  } else {
    stampYear();
  }
})();
