/* =====================================================================
   STEP Hub: Articles (Home tab · "Articles and publications")
   Rows live in the Supabase table public.articles. Anyone can read the
   rows that are shown; only the tech team can read a link's preview
   (article_preview) or add, change and remove rows. See
   supabase/articles.sql.
   ===================================================================== */
(function () {
  "use strict";
  const client = () => (window.STEP_SUPABASE && window.STEP_SUPABASE.getClient ? window.STEP_SUPABASE.getClient() : null);
  const need = () => { const sb = client(); if (!sb) throw new Error("Can't reach the STEP database right now. Check your connection and reload."); return sb; };
  const clean = msg => String(msg || "Something went wrong.").replace(/^.*?ERROR:\s*/, "");

  /* The tech team sets the order by hand (sort_order, 1 = the big one on the left of Home).
     If the column isn't in the database yet, fall back to newest first so nothing breaks. */
  async function query(onlyShown) {
    const sb = need();
    const run = withOrder => {
      let q = sb.from("articles").select("*");
      if (onlyShown) q = q.eq("shown", true);
      if (withOrder) q = q.order("sort_order", { ascending: true, nullsFirst: false });
      return q.order("published_at", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
    };
    let r = await run(true);
    if (r.error && /sort_order/i.test(r.error.message)) r = await run(false);
    return r;
  }
  /** Articles shown on Home, in the order the tech team set. */
  async function list() {
    if (!client()) return [];
    const { data, error } = await query(true);
    if (error) { console.warn("[STEP] articles:", error.message); return []; }
    return data || [];
  }
  /** Every article, shown or hidden (tech team only). */
  async function listAll() {
    const { data, error } = await query(false);
    if (error) throw new Error(clean(error.message));
    return data || [];
  }
  /** Save a new order: ids from first (the big one) to last. */
  async function reorder(ids) {
    const sb = need();
    const res = await Promise.all(ids.map((id, i) => sb.from("articles").update({ sort_order: i + 1 }).eq("id", id)));
    const bad = res.find(r => r.error);
    if (bad) throw new Error(/sort_order/i.test(bad.error.message) ? "The ordering column isn't set up yet. Run the latest supabase/articles.sql in Supabase first." : clean(bad.error.message));
  }
  /** Read a published page: { url, title, excerpt, image_url, site_name, author, published_at } */
  async function preview(url) {
    const { data, error } = await need().rpc("article_preview", { p_url: url });
    if (error) throw new Error(clean(error.message));
    return data || {};
  }
  async function add(row) {
    const { data, error } = await need().from("articles").insert(row).select("*").single();
    if (error) {
      if (/duplicate key|articles_url_key/i.test(error.message)) throw new Error("That article is already on Home.");
      throw new Error(clean(error.message));
    }
    return data;
  }
  async function update(id, patch) {
    const { data, error } = await need().from("articles").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
    if (error) throw new Error(clean(error.message));
    return data;
  }
  async function remove(id) {
    const { error } = await need().from("articles").delete().eq("id", id);
    if (error) throw new Error(clean(error.message));
  }
  window.STEP_ARTICLES = { list, listAll, reorder, preview, add, update, remove };
})();
