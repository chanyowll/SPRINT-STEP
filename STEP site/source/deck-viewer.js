/* Deck viewer: a PDF deck drawn slide by slide inside the preview box.
   Every slide is shown whole (scaled to fit, never cropped or stretched);
   scrolling inside the box moves to the next slide, one slide at a time.
   Used by My Team's Work and the Panel preview.

   StepDeck.mount(box, url, { title })  draw the deck into `box`
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
      return L.getDocument({ url: url, disableAutoFetch: true, disableStream: true }).promise;
    }).then(function (doc) {
      if (tok !== box.__deckTok) { try { doc.destroy(); } catch (e) {} return; }
      box.__deckDoc = doc;
      var n = doc.numPages;
      var width = Math.max(box.clientWidth || 600, 600);

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
          var vp = page.getViewport({ scale: Math.min(3, (width * 2) / base.width) });
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
          badge.textContent = cur + " / " + n;
        }, { passive: true });
      }
    }).catch(function () {
      if (tok !== box.__deckTok) return;
      /* last resort: the browser's own viewer */
      box.innerHTML = '<iframe src="' + esc(url) + '#toolbar=0&view=FitH" title="' + esc(opt.title || "Slide deck") + '"></iframe>';
    });
  }

  window.StepDeck = { mount: mount, stop: release };
})();
