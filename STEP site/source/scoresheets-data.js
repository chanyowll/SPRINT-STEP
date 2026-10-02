/* =====================================================================
   STEP Hub — panel score sheets, editable from the tech console

   Every scored week ships with a built-in score sheet (SCORE_SHEETS in
   mock-data.js). The STEP team can replace any week's sheet from the
   Panels console; the replacement is saved in the score_sheets table
   and, once loaded, takes the place of the built-in one everywhere a
   sheet is used: the Panel page's score sheet, the Trainers curriculum
   list and the console's Team data report.

   A criterion is { label, weight, hint? }; weights add up to 100. Scores
   on a submitted sheet are stored by criterion position, so a week's
   sheet is locked once any panel sheet has been saved for it.
   ===================================================================== */
(function () {
  "use strict";

  const TABLE = "score_sheets";
  const client = () => (window.STEP_SUPABASE && window.STEP_SUPABASE.getClient ? window.STEP_SUPABASE.getClient() : null);
  let cache = null;                       // { code: criteria[] } once loaded

  async function isLive() {
    const sb = client(); if (!sb) return false;
    try { const { data: { user } } = await sb.auth.getUser(); return !!user; } catch (e) { return false; }
  }

  /* the rows that have been saved: { code: criteria[] } */
  async function load() {
    if (!(await isLive())) { cache = {}; return cache; }
    const { data, error } = await client().from(TABLE).select("code, criteria, updated_at, updated_by");
    if (error) throw new Error(error.message);
    cache = {};
    (data || []).forEach(r => { cache[r.code] = { criteria: Array.isArray(r.criteria) ? r.criteria : [], updated_at: r.updated_at, updated_by: r.updated_by }; });
    return cache;
  }

  /* put the saved sheets into the session list every page reads (M.faculty.sessions) */
  function apply(rows) {
    const M = window.MOCK; if (!M || !M.faculty) return 0;
    let n = 0;
    (M.faculty.sessions || []).forEach(s => {
      if (!s.__builtin) s.__builtin = (s.assess || []).slice();          // keep the shipped sheet
      const r = rows && rows[s.code];
      const next = r && r.criteria.length ? r.criteria : s.__builtin;
      if (JSON.stringify(next) !== JSON.stringify(s.assess)) n++;
      s.assess = next;
      s.criteria_pending = !next.length && s.criteria_pending;
      s.sheet_custom = !!(r && r.criteria.length);
    });
    if (n) window.dispatchEvent(new CustomEvent("stephub_scoresheets", { detail: { changed: n } }));
    return n;
  }

  async function refresh() { try { return apply(await load()); } catch (e) { console.warn("[STEP] score sheets:", e.message || e); return 0; } }

  /* the built-in sheet for a week, untouched by any edit */
  function builtin(code) {
    const M = window.MOCK, s = M && M.faculty && (M.faculty.sessions || []).find(x => x.code === code);
    return s ? (s.__builtin || s.assess || []).slice() : [];
  }

  /* checks before saving: labels present, weights whole numbers adding to 100 */
  function validate(criteria) {
    const problems = [];
    const rows = (criteria || []).filter(c => !c.group);
    if (!rows.length) problems.push("Add at least one criterion.");
    rows.forEach((c, i) => {
      if (!String(c.label || "").trim()) problems.push("Criterion " + (i + 1) + " has no definition.");
      const w = Number(c.weight);
      if (!Number.isInteger(w) || w <= 0) problems.push("Criterion " + (i + 1) + " needs a whole-number weight above 0.");
    });
    const sum = rows.reduce((t, c) => t + (Number(c.weight) || 0), 0);
    if (sum !== 100) problems.push("Weights add up to " + sum + "%, not 100%.");
    return problems;
  }

  async function save(code, criteria) {
    const problems = validate(criteria);
    if (problems.length) throw new Error(problems.join(" "));
    const sb = client();
    const { data: { user } } = await sb.auth.getUser();
    const clean = criteria.filter(c => !c.group).map(c => {
      const row = { label: String(c.label).trim(), weight: Number(c.weight) };
      if (String(c.hint || "").trim()) row.hint = String(c.hint).trim();
      return row;
    });
    const { error } = await sb.from(TABLE).upsert({ code, criteria: clean, updated_by: user ? user.id : null, updated_at: new Date().toISOString() }, { onConflict: "code" });
    if (error) throw new Error(error.message);
    await refresh();
    return clean;
  }

  /* back to the built-in sheet */
  async function reset(code) {
    const { error } = await client().from(TABLE).delete().eq("code", code);
    if (error) throw new Error(error.message);
    await refresh();
  }

  /* how many panel sheets (draft or submitted) already use this week's criteria */
  async function sheetsSaved(code) {
    const sb = client(); if (!sb) return 0;
    const { count, error } = await sb.from("panel_sheets").select("id", { count: "exact", head: true }).eq("session_code", code);
    if (error) return 0;
    return count || 0;
  }

  window.STEP_SCORESHEETS = { isLive, load, apply, refresh, builtin, validate, save, reset, sheetsSaved, get cache() { return cache; } };

  /* pages that show sheets pick up the saved ones as soon as the account is known */
  function start() { refresh(); }
  if (window.__authSettled) start();
  window.addEventListener("stephub_auth_settled", start);
  window.addEventListener("stephub_auth_changed", start);
})();
