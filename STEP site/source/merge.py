#!/usr/bin/env python3
"""Merge index.html + program.html into one site file.

Keeps ONE header/utility bar/footer, puts each page's content into its own
<div class="route">, and swaps them with a tiny hash router. Each page's
inline script is wrapped in an IIFE so their local names cannot collide.
Also emits a single-file version with CSS/JS/images inlined.
"""
import base64, pathlib, re, sys

root = pathlib.Path(".")

PAGES = [
    ("home",    "index.html",   "Home"),
    ("week",    "this-week.html", "This Week"),
    ("program", "program.html", "Program"),
    ("groups",  "groups.html",  "STEP Groups"),
    ("myteam",  "my-team.html", "My Team's Work"),
    ("capstone","capstone.html","Capstone"),
    ("trainers","trainers.html","Trainers"),
]

def read(f):
    return (root / f).read_text()

def between(s, start_marker, end_marker):
    a = s.index(start_marker)
    b = s.index(end_marker, a)
    return s[a:b]

def page_parts(src):
    """Return (content_html, inline_scripts) for one page."""
    body = between(src, "<body>", "</body>")[len("<body>"):]
    # content = everything after the header block, before the footer
    after_header = body[body.index("</header>") + len("</header>"):]
    content = after_header[:after_header.index("<footer")]
    # inline scripts that sit after the footer
    tail = after_header[after_header.index("<footer"):]
    scripts = re.findall(r"<script>(.*?)</script>", tail, re.S)
    return content.strip(), scripts

home_src, prog_src = read(PAGES[0][1]), read(PAGES[1][1])

# shared chrome, taken from the home page
utility = between(home_src, '<div class="utility-bar">', "<!-- ===== Header")
header  = between(home_src, '<header class="site-header light">', "<!-- ===== Hero")
footer  = between(home_src, "<footer", "</body>")
footer  = footer[:footer.rindex("</footer>") + len("</footer>")]

# rewrite the nav so the two built pages route in-page, and mark the rest
def fix_nav(h):
    h = h.replace('<a href="index.html" class="active">', '<a href="#home" data-route="home">')
    h = h.replace('<a href="index.html">',   '<a href="#home" data-route="home">')
    h = h.replace('<a href="program.html">', '<a href="#program" data-route="program">')
    h = h.replace('<a href="program.html" class="active">', '<a href="#program" data-route="program">')
    h = h.replace('<a href="my-team.html" class="active">', '<a href="#myteam" data-route="myteam">')
    h = h.replace('<a href="my-team.html">', '<a href="#myteam" data-route="myteam">')
    h = h.replace('href="capstone.html#capstone-deck"', 'href="#capstone-deck"')
    h = h.replace('href="capstone.html#capstone"', 'href="#capstone"')
    h = h.replace('<a href="capstone.html" class="active"', '<a href="#capstone" data-route="capstone"')
    h = h.replace('<a href="capstone.html"', '<a href="#capstone" data-route="capstone"')
    h = h.replace('<a href="this-week.html" class="active">', '<a href="#week" data-route="week">')
    h = h.replace('<a href="groups.html" class="active">', '<a href="#groups" data-route="groups">')
    h = h.replace('<a href="groups.html">', '<a href="#groups" data-route="groups">')
    h = h.replace('href="trainers.html#trainers-mentors"', 'href="#trainers-mentors"')
    h = h.replace('href="trainers.html#trainers-panel"', 'href="#trainers-panel"')
    h = h.replace('href="trainers.html#trainers"', 'href="#trainers"')
    h = h.replace('<a href="trainers.html" class="active"', '<a href="#trainers" data-route="trainers"')
    h = h.replace('<a href="trainers.html"', '<a href="#trainers" data-route="trainers"')
    h = h.replace('<a href="this-week.html">', '<a href="#week" data-route="week">')
    return h

header = fix_nav(header)
footer = fix_nav(footer).replace('<a class="brand" href="index.html"', '<a class="brand" href="#home"')
header = header.replace('<a class="brand" href="index.html"', '<a class="brand" href="#home" data-route="home"')

# Links between the built pages become hash routes. This runs over the markup AND
# over each page's script, because several of these links are written by JS templates.
LINKS = [
    ('href="program.html#selection"', 'href="#program-selection"'),
    ('href="program.html#calendar"',  'href="#program-calendar"'),
    ('href="my-team.html#submit"',    'href="#myteam-submit"'),
    ('href="my-team.html"',           'href="#myteam"'),
    ('href="program.html"',           'href="#program"'),
    ('href="capstone.html#capstone-deck"', 'href="#capstone-deck"'),
    ('href="capstone.html#capstone"', 'href="#capstone"'),
    ('href="capstone.html"',          'href="#capstone"'),
    ('href="this-week.html"',         'href="#week"'),
    ('href="trainers.html"',          'href="#trainers"'),
    ('href="groups.html"',            'href="#groups"'),
    ('href="index.html"',             'href="#home"'),
]
def fix_links(t):
    for old, new in LINKS:
        t = t.replace(old, new)
    return t

routes, scripts = [], []
for key, fname, _label in PAGES:
    content, scr = page_parts(read(fname))
    is_home = (key == "home")
    hidden_attr = "" if is_home else " hidden"
    routes.append(f'<div class="route" id="route-{key}" data-route="{key}"{hidden_attr}>\n{fix_links(content)}\n</div>')
    scripts += [f"/* ---- {fname} ---- */\ntry {{\n(function(){{\n{fix_links(x.strip())}\n}})();\n}} catch(e) {{ console.error('[STEP] Error in {fname} script:', e); }}" for x in scr]

router = """
/* ---------- tiny hash router ---------- */
(function () {
  var routes = [].slice.call(document.querySelectorAll(".route"));
  var links  = [].slice.call(document.querySelectorAll("[data-route]"));
  var titles = { home: "SPRINT-STEP — Turning Filipino Researches into Business",
                 program: "Program · SPRINT-STEP",
                 myteam:  "My Team's Work · SPRINT-STEP",
                 capstone: "Capstone · SPRINT-STEP",
                 week:    "This Week · SPRINT-STEP",
                 groups:  "STEP Groups · SPRINT-STEP",
                 trainers: "Trainers · SPRINT-STEP" };

  function signInPending() {
    if (window.__authSettled) return false;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        if (/^sb-.*-auth-token$/.test(localStorage.key(i) || "")) return true;
      }
    } catch (e) {}
    return false;
  }

  function show(name, anchor) {
    if (!titles[name]) name = "home";
    // ── RBAC: block navigation to locked routes ──
    if (window.MOCK && window.MOCK.auth && !window.MOCK.auth.canAccess(name) && signInPending()) {
      /* A refresh starts as a guest for a moment while the saved sign-in is
         read back. Stay on the requested tab and decide once it is known,
         instead of bouncing to Home. */
      window.__pendingRoute = true;
      return;
    }
    if (window.MOCK && window.MOCK.auth && !window.MOCK.auth.canAccess(name)) {
      /* A page that explains its own lock is shown, so the person reads why
         they cannot open it. Anything else falls back to home. */
      var gated = document.getElementById("route-" + name)
        && document.getElementById("route-" + name).querySelector("[data-locked-gate]");
      if (!gated) {
        name = "home";
        location.hash = "#home";
        if (window.MOCK.openAuthModal) window.MOCK.openAuthModal();
        return;
      }
    }
    // the Capstone form panel is docked to the page; never let it follow you elsewhere
    if (name !== "capstone" && window.__closeSheet) window.__closeSheet();
    routes.forEach(function (r) { r.hidden = (r.dataset.route !== name); });
    links.forEach(function (a) {
      var on = a.dataset.route === name && a.classList.contains("nav-link");
      a.classList.toggle("active", on);
    });
    document.title = titles[name];
    document.getElementById("nav").classList.remove("open");
    document.querySelector(".nav-toggle").setAttribute("aria-expanded", "false");
    // Trigger dynamic renders if available
    if (name === "week" && typeof window.__renderThisWeek === "function") window.__renderThisWeek();
    if (name === "myteam" && typeof window.__renderMyTeam === "function") window.__renderMyTeam();
    if (name === "capstone" && typeof window.__renderCapstone === "function") window.__renderCapstone();
    if (name === "trainers" && typeof window.__renderTrainers === "function") window.__renderTrainers();
    // replay the scroll reveals for the page we just switched to
    var target = document.getElementById("route-" + name);
    target.querySelectorAll(".reveal").forEach(function (el) { el.classList.remove("in"); });
    if (window.__stepObserve) window.__stepObserve(target);
    if (anchor) {
      var el = document.getElementById(anchor);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    }
    window.scrollTo(0, 0);
  }

  function fromHash() {
    var h = (location.hash || "#home").slice(1);          // e.g. "program-selection"
    var name = h.split("-")[0];
    var anchor = h.indexOf("-") > -1 ? h.slice(h.indexOf("-") + 1) : "";
    show(name, anchor);
  }

  window.addEventListener("hashchange", fromHash);
  window.addEventListener("stephub_auth_settled", function () {
    if (window.__pendingRoute) { window.__pendingRoute = false; fromHash(); }
  });
  window.addEventListener("stephub_auth_changed", function () {
    if (window.__pendingRoute) { window.__pendingRoute = false; fromHash(); return; }
    var h = (location.hash || "#home").slice(1);
    var name = h.split("-")[0];
    if (name === "week" && typeof window.__renderThisWeek === "function") window.__renderThisWeek();
    if (name === "myteam" && typeof window.__renderMyTeam === "function") window.__renderMyTeam();
    if (name === "capstone" && typeof window.__renderCapstone === "function") window.__renderCapstone();
    if (name === "trainers" && typeof window.__renderTrainers === "function") window.__renderTrainers();
  });
  fromHash();
})();
"""

# one shared IntersectionObserver, exposed so the router can re-run it
observer = """
/* ---------- scroll reveal (shared by both pages) ---------- */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    window.__stepObserve = function (scope) {
      (scope || document).querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    };
    window.__stepObserve(document);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  window.__stepObserve = function (scope) {
    (scope || document).querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
  };
  window.__stepObserve(document);
})();
"""

# strip each page's own IntersectionObserver — the shared one above replaces it.
# Matches the comment line + the observer + the .forEach(...observe...) line, nothing else.
OBS = re.compile(
    r"[ \t]*(?://[^\n]*[Rr]eveal on scroll[^\n]*|/\* -+ reveal on scroll -+ \*/)\n"
    r"\s*const io = new IntersectionObserver\(.*?"
    r"document\.querySelectorAll\(\"\.reveal\"\)\.forEach\(el => io\.observe\(el\)\);",
    re.S)
stripped = []
for s in scripts:
    out, n = OBS.subn("", s)
    if n != 1:
        raise SystemExit("merge.py: expected exactly one observer block per page script, got %d" % n)
    stripped.append(out)
scripts = stripped

# tag nav links (inside <nav> only) so just those get the active class
nav_block = header[header.index("<nav"):header.index("</nav>")]
tagged = nav_block.replace('<a href="#home" data-route="home">',
                           '<a class="nav-link" href="#home" data-route="home">')
tagged = tagged.replace('<a href="#program" data-route="program">',
                        '<a class="nav-link" href="#program" data-route="program">')
tagged = tagged.replace('<a href="#myteam" data-route="myteam">',
                        '<a class="nav-link" href="#myteam" data-route="myteam">')
tagged = tagged.replace('<a href="#capstone" data-route="capstone" aria-haspopup',
                        '<a class="nav-link" href="#capstone" data-route="capstone" aria-haspopup')
tagged = tagged.replace('<a href="#week" data-route="week">',
                        '<a class="nav-link" href="#week" data-route="week">')
tagged = tagged.replace('<a href="#groups" data-route="groups">',
                        '<a class="nav-link" href="#groups" data-route="groups">')
tagged = tagged.replace('<a href="#trainers" data-route="trainers" aria-haspopup',
                        '<a class="nav-link" href="#trainers" data-route="trainers" aria-haspopup')
header = header.replace(nav_block, tagged)

page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SPRINT-STEP — Turning Filipino Researches into Business</title>
<meta name="description" content="SPRINT-STEP is a DOST-PCIEERD program run by the Ateneo Intellectual Property Office that turns Filipino research teams into businesses.">
<link rel="icon" href="assets/step-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap">
<link rel="stylesheet" href="stephub-ui.css">
<script>document.documentElement.classList.add("js")</script>
</head>
<body>

{utility.strip()}

{header.strip()}

{chr(10).join(routes)}

{footer.strip()}

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script src="supabase-client.js"></script>
<script src="myteam-data.js"></script>
<script src="submissions-data.js"></script>
<script src="site-clock.js"></script>
<script src="materials-data.js"></script>
<script src="panelsheets-data.js"></script>
<script src="mentorreports-data.js"></script>
<script src="mentorreport-pdf.js"></script>
<script src="mock-data.js"></script>
<script>
{observer}
{chr(10).join(scripts)}
{router}
</script>
</body>
</html>
"""

out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site.html")
out.write_text(page)
print(out, round(len(page) / 1024), "KB")
