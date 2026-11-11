/* Deck viewer: a PDF deck drawn slide by slide inside the preview box.
   Every slide is shown whole (scaled to fit, never cropped or stretched);
   scrolling inside the box moves to the next slide, one slide at a time.
   A portrait document is the exception: its pages fill the box's width and
   scroll as one continuous sheet.
   Used by My Team's Work and the Panel preview.

   StepDeck.mount(box, url, { title })  draw the deck into `box`
   StepDeck.mount(box, url, { title, continuous: true })
                                         full-size viewers: every page (slide or
                                         document) is as wide as the panel and the
                                         whole file scrolls as one sheet
   StepDeck.stop(box)                    forget a pending draw (call before
                                         writing something else into `box`) */
(function () {
  var BASE = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/";
  var ready = null;

  function lib() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (ready) return ready;
    ready = new Promise(function (res, rej) {
      var sc = document.createElement("script");
      sc.src = BASE + "pdf.min.js";
      sc.onload = function () {
        try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = BASE + "pdf.worker.min.js"; } catch (e) {}
        res(window.pdfjsLib);
      };
      sc.onerror = function () { ready = null; rej(new Error("pdf.js did not load")); };
      document.head.appendChild(sc);
    });
    return ready;
  }

  /* Fetch the PDF engine (and its worker) ahead of time, so the first deck
     is not waiting on two downloads. Best effort: nothing depends on it. */
  var warmed = false;
  function warm() {
    if (warmed) return;
    warmed = true;
    lib().catch(function () { warmed = false; });
    try { fetch(BASE + "pdf.worker.min.js", { mode: "no-cors" }).catch(function () {}); } catch (e) {}
  }
  function warmIfNeeded() {
    if (/(^|[#\/])(myteam|my-team|trainers)/.test((location.hash || "") + " " + (location.pathname || ""))) warm();
  }
  warmIfNeeded();
  window.addEventListener("hashchange", warmIfNeeded);

  function release(box) {
    box.__deckTok = (box.__deckTok || 0) + 1;
    if (box.__deckIO) { try { box.__deckIO.disconnect(); } catch (e) {} box.__deckIO = null; }
    if (box.__deckDoc) { try { box.__deckDoc.destroy(); } catch (e) {} box.__deckDoc = null; }
  }

  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function mount(box, url, opt) {
    opt = opt || {};
    release(box);
    var tok = box.__deckTok;
    box.innerHTML = '<div class="od-none"><span>Loading the slides…</span></div>';

    return lib().then(function (L) {
      var task = L.getDocument({ url: url, disableAutoFetch: true });
      task.onProgress = function (p) {
        if (tok !== box.__deckTok || !p || !p.total) return;
        var span = box.querySelector(".od-none span");
        if (span) span.textContent = "Loading the slides\u2026 " + Math.min(99, Math.round(p.loaded / p.total * 100)) + "%";
      };
      return task.promise;
    }).then(function (doc) {
      if (tok !== box.__deckTok) { try { doc.destroy(); } catch (e) {} return; }
      box.__deckDoc = doc;
      var n = doc.numPages;
      var width = box.clientWidth || 600;
      var dpr = Math.min(2, window.devicePixelRatio || 1);

      var sc = document.createElement("div");
      sc.className = "dk-scroll";
      sc.tabIndex = 0;
      sc.setAttribute("role", "group");
      sc.setAttribute("aria-label", (opt.title || "Slide deck") + ", " + n + (n === 1 ? " slide" : " slides") + ". Scroll for the next slide.");

      var pgs = [];
      for (var i = 1; i <= n; i++) {
        var pg = document.createElement("div");
        pg.className = "dk-pg";
        pg.dataset.n = i;
        sc.appendChild(pg);
        pgs.push(pg);
      }

      var badge = null;
      if (n > 1) {
        badge = document.createElement("div");
        badge.className = "dk-badge";
        badge.setAttribute("aria-hidden", "true");
        badge.textContent = "1 / " + n;
      }

      box.innerHTML = "";
      box.appendChild(sc);
      if (badge) box.appendChild(badge);

      var drawn = {};
      function draw(i) {
        if (drawn[i]) return;
        drawn[i] = true;
        doc.getPage(i).then(function (page) {
          if (tok !== box.__deckTok) return;
          var base = page.getViewport({ scale: 1 });
          /* a tall (portrait) document: pages fill the box edge to edge, stacked, and scroll as one */
          if (i === 1 && (opt.continuous || base.height > base.width * 1.05)) {
            sc.classList.add("dk-doc");
            pgs.forEach(function (q) { q.style.aspectRatio = base.width + " / " + base.height; });
          }
          var vp = page.getViewport({ scale: Math.max(1, Math.min(2.5, (width * dpr) / base.width)) });
          var c = document.createElement("canvas");
          c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
          c.setAttribute("role", "img");
          c.setAttribute("aria-label", "Slide " + i + " of " + n);
          return page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () {
            if (tok !== box.__deckTok) return;
            pgs[i - 1].innerHTML = "";
            pgs[i - 1].appendChild(c);
          });
        }).catch(function () { drawn[i] = false; });
      }

      /* the first slide at once, the others as they come near the window */
      draw(1);
      if (n > 1) {
        if (window.IntersectionObserver) {
          var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) draw(+e.target.dataset.n); });
          }, { root: sc, rootMargin: "120% 0px" });
          pgs.forEach(function (p) { io.observe(p); });
          box.__deckIO = io;
        } else {
          pgs.forEach(function (p, k) { draw(k + 1); });
        }
      }

      if (badge) {
        sc.addEventListener("scroll", function () {
          var h = sc.clientHeight || 1;
          var cur = Math.min(n, Math.max(1, Math.round(sc.scrollTop / h) + 1));
          if (sc.classList.contains("dk-doc")) {
            cur = 1;
            for (var k = 0; k < pgs.length; k++) { if (pgs[k].offsetTop <= sc.scrollTop + h / 3) cur = k + 1; else break; }
          }
          badge.textContent = cur + " / " + n;
        }, { passive: true });
      }
    }).catch(function () {
      if (tok !== box.__deckTok) return;
      /* last resort: the browser's own viewer */
      box.innerHTML = '<iframe src="' + esc(url) + '#toolbar=0&view=FitH" title="' + esc(opt.title || "Slide deck") + '"></iframe>';
    });
  }

  window.StepDeck = { mount: mount, stop: release, warm: warm, lib: lib };
})();
