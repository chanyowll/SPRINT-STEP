/* =====================================================================
   STEP Hub: tech team access
   The tech console (tech.html) is for these accounts only. On the site,
   double-clicking the STEP logo while signed in as one of them opens it.
   This check only decides what the browser shows; the console's data is
   protected by Supabase row-level security once it is wired up.
   ===================================================================== */
(function () {
  "use strict";
  var TECH = ["cperote@ateneo.edu", "joshguico@gmail.com"];
  function isTech(email) { return TECH.indexOf(String(email || "").trim().toLowerCase()) >= 0; }
  function myEmail() {
    try { var u = window.MOCK && window.MOCK.auth && window.MOCK.auth.getCurrentUser(); return (u && u.email) || ""; }
    catch (e) { return ""; }
  }
  window.STEP_TECH = { isTech: isTech, emails: TECH.slice() };

  if (/(^|\/)tech\.html$/.test(location.pathname)) return;     // the console itself needs no shortcut
  document.addEventListener("dblclick", function (e) {
    var brand = e.target && e.target.closest && e.target.closest(".site-header .brand");
    if (!brand || !isTech(myEmail())) return;
    e.preventDefault();
    if (window.getSelection) { try { window.getSelection().removeAllRanges(); } catch (err) {} }
    location.href = "tech.html";
  });
})();
