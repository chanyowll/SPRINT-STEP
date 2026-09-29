/* =====================================================================
   STEP Hub — the mentors' accomplishment report as a PDF

   Draws the STEP 2 "SPRINT-STEP MENTORS ACCOMPLISHMENTS REPORT" form —
   the header box, the three-column activities table and the
   Prepared by / Endorsed by lines — filled with what the mentor entered,
   ready to be signed and uploaded back.

   Self-contained: a small PDF writer using the built-in Helvetica faces,
   so the download works without any outside library.

   STEP_REPORTPDF.build(d) → Blob, where d = {
     mentor, team, topic, topicLines: [..], period,
     rows: [{ text, lead?, done?, remark? }],   // **bold** allowed in text
     endorsedBy, endorsedRole, stamp }
   ===================================================================== */

(function () {
  'use strict';

  const PW = 595.28, PH = 841.89;               // A4, points

  /* Helvetica / Helvetica-Bold advance widths, ASCII 32–126 (per 1000) */
  const W_REG = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
  const W_BOLD = [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];
  /* WinAnsi extras: code, regular width, bold width */
  const EXTRA = { '–': [0x96, 556, 556], '—': [0x97, 1000, 1000], '‘': [0x91, 222, 278],
                  '’': [0x92, 222, 278], '“': [0x93, 333, 500], '”': [0x94, 333, 500],
                  '•': [0x95, 350, 350], '…': [0x85, 1000, 1000], '₱': [0x50, 667, 667] };

  function code(ch) {
    const c = ch.charCodeAt(0);
    if (c >= 32 && c <= 126) return c;
    if (EXTRA[ch]) return EXTRA[ch][0];
    if (c >= 0xA0 && c <= 0xFF) return c;
    return 63;                                   // '?'
  }
  function cw(ch, bold) {
    const c = ch.charCodeAt(0);
    if (c >= 32 && c <= 126) return (bold ? W_BOLD : W_REG)[c - 32];
    if (EXTRA[ch]) return EXTRA[ch][bold ? 2 : 1];
    return 556;
  }
  const textW = (s, size, bold) => { let w = 0; for (const ch of s) w += cw(ch, bold); return w * size / 1000; };
  const clean = s => String(s == null ? '' : s).replace(/\r/g, '').replace(/\t/g, ' ').replace(/\u00A0/g, ' ').replace(/\u20B1\s?/g, 'PHP ');

  function pdfStr(s) {
    let o = '(';
    for (const ch of s) {
      const c = code(ch);
      if (c === 40 || c === 41 || c === 92) o += '\\' + String.fromCharCode(c);
      else if (c < 32 || c > 126) o += '\\' + c.toString(8).padStart(3, '0');
      else o += String.fromCharCode(c);
    }
    return o + ')';
  }

  /* "plain **bold** plain" → [{t, b}] words, keeping spaces attached */
  function words(line) {
    const out = [];
    clean(line).split(/(\*\*[^*]*\*\*)/).forEach(seg => {
      if (!seg) return;
      const b = /^\*\*[^*]*\*\*$/.test(seg);
      const t = b ? seg.slice(2, -2) : seg;
      t.split(/(\s+)/).forEach(w => { if (w) out.push({ t: w.replace(/\s+/g, ' '), b }); });
    });
    return out;
  }

  /* wrap rich text into lines of runs that fit `width` */
  function wrap(text, width, size, forceBold) {
    const lines = [];
    clean(text).split('\n').forEach(para => {
      let line = [], lw = 0;
      const ws = words(para);
      if (!ws.length) { lines.push([]); return; }
      ws.forEach(w => {
        const b = forceBold || w.b;
        const isSp = /^\s+$/.test(w.t);
        const ww = textW(w.t, size, b);
        if (isSp) { if (line.length) { line.push({ t: ' ', b }); lw += ww; } return; }
        if (lw + ww > width && line.length) {
          while (line.length && line[line.length - 1].t === ' ') line.pop();
          lines.push(line); line = []; lw = 0;
        }
        /* a single word longer than the column: break it by characters */
        if (ww > width) {
          let chunk = '';
          for (const ch of w.t) {
            if (textW(chunk + ch, size, b) > width && chunk) {
              line.push({ t: chunk, b }); lines.push(line); line = []; chunk = '';
            }
            chunk += ch;
          }
          line.push({ t: chunk, b }); lw = textW(chunk, size, b);
          return;
        }
        line.push({ t: w.t, b }); lw += ww;
      });
      while (line.length && line[line.length - 1].t === ' ') line.pop();
      lines.push(line);
    });
    return lines;
  }
  const lineW = (runs, size) => runs.reduce((a, r) => a + textW(r.t, size, r.b), 0);

  /* ── the page painter ──────────────────────────────────────────────── */
  function Doc() {
    this.pages = [];
    this.newPage();
  }
  Doc.prototype.newPage = function () { this.ops = []; this.pages.push(this.ops); };
  Doc.prototype.runs = function (runs, x, y, size) {       // y = baseline, from the top
    let cx = x;
    runs.forEach(r => {
      if (!r.t) return;
      this.ops.push(`BT /${r.b ? 'F2' : 'F1'} ${size} Tf ${cx.toFixed(2)} ${(PH - y).toFixed(2)} Td ${pdfStr(r.t)} Tj ET`);
      cx += textW(r.t, size, r.b);
    });
    return cx;
  };
  Doc.prototype.text = function (s, x, y, size, bold) { return this.runs([{ t: clean(s), b: !!bold }], x, y, size); };
  Doc.prototype.rect = function (x, y, w, h, lw) {
    this.ops.push(`${lw || 0.9} w ${x.toFixed(2)} ${(PH - y - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
  };
  Doc.prototype.line = function (x1, y1, x2, y2, lw) {
    this.ops.push(`${lw || 0.9} w ${x1.toFixed(2)} ${(PH - y1).toFixed(2)} m ${x2.toFixed(2)} ${(PH - y2).toFixed(2)} l S`);
  };
  Doc.prototype.dot = function (cx, cy, r) {               // filled circle
    const k = 0.5523 * r, X = cx, Y = PH - cy;
    this.ops.push(`${(X + r).toFixed(2)} ${Y.toFixed(2)} m ` +
      `${(X + r).toFixed(2)} ${(Y + k).toFixed(2)} ${(X + k).toFixed(2)} ${(Y + r).toFixed(2)} ${X.toFixed(2)} ${(Y + r).toFixed(2)} c ` +
      `${(X - k).toFixed(2)} ${(Y + r).toFixed(2)} ${(X - r).toFixed(2)} ${(Y + k).toFixed(2)} ${(X - r).toFixed(2)} ${Y.toFixed(2)} c ` +
      `${(X - r).toFixed(2)} ${(Y - k).toFixed(2)} ${(X - k).toFixed(2)} ${(Y - r).toFixed(2)} ${X.toFixed(2)} ${(Y - r).toFixed(2)} c ` +
      `${(X + k).toFixed(2)} ${(Y - r).toFixed(2)} ${(X + r).toFixed(2)} ${(Y - k).toFixed(2)} ${(X + r).toFixed(2)} ${Y.toFixed(2)} c f`);
  };
  Doc.prototype.check = function (x, y, s) {               // ✓ with its box's top-left at (x, y)
    this.ops.push(`1.4 w 1 J 1 j ${(x).toFixed(2)} ${(PH - y - s * 0.55).toFixed(2)} m ` +
      `${(x + s * 0.32).toFixed(2)} ${(PH - y - s * 0.95).toFixed(2)} l ` +
      `${(x + s * 0.95).toFixed(2)} ${(PH - y - s * 0.05).toFixed(2)} l S 0 J 0 j`);
  };
  Doc.prototype.grey = function (on) { this.ops.push(on ? '0.45 g' : '0 g'); };

  Doc.prototype.bytes = function () {
    const objs = [];
    const add = s => { objs.push(s); return objs.length; };
    const cat = add(''), pages = add(''), f1 = add(''), f2 = add('');
    objs[f1 - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
    objs[f2 - 1] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
    const kids = [];
    this.pages.forEach(ops => {
      const body = ops.join('\n');
      const c = add(`<< /Length ${body.length} >>\nstream\n${body}\nendstream`);
      kids.push(add(`<< /Type /Page /Parent ${pages} 0 R /MediaBox [0 0 ${PW} ${PH}] ` +
        `/Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${c} 0 R >>`));
    });
    objs[cat - 1] = `<< /Type /Catalog /Pages ${pages} 0 R >>`;
    objs[pages - 1] = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
    let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const offs = [];
    objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xref = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` +
      offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') +
      `trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const u8 = new Uint8Array(out.length);
    for (let i = 0; i < out.length; i++) u8[i] = out.charCodeAt(i) & 0xFF;
    return u8;
  };

  /* ── the form ──────────────────────────────────────────────────────── */
  function build(d) {
    const doc = new Doc();
    const L = 70.6, R = 526.5, MID = 297.6;
    const C1 = L, C2 = 222.4, C3 = 325.6;                 // column edges
    const BOTTOM = PH - 56;

    /* title */
    const title = 'SPRINT-STEP MENTORS ACCOMPLISHMENTS REPORT';
    doc.text(title, (PW - textW(title, 10.5, true)) / 2, 88, 10.5, true);

    /* header box */
    const HS = 10, HL = 13.2, PAD = 9;
    const left = [];
    wrap('**Mentor Name:** ' + (d.mentor || ''), MID - L - 2 * PAD, HS).forEach(l => left.push(l));
    left.push([{ t: 'Learning Session Topic:', b: true }]);
    wrap(d.topic || '', MID - L - 2 * PAD, HS).forEach(l => left.push(l));
    (d.topicLines || []).forEach(t => wrap(t, MID - L - 2 * PAD, HS).forEach(l => left.push(l)));
    const right = [];
    wrap('**Mentee:** ' + (d.team || ''), R - MID - 2 * PAD, HS).forEach(l => right.push(l));
    right.push([]);
    wrap('**Period Covered:** ' + (d.period || ''), R - MID - 2 * PAD, HS).forEach(l => right.push(l));
    const hTop = 106;
    const hH = Math.max(76, Math.max(left.length, right.length) * HL + 2 * PAD + 6);
    doc.rect(L, hTop, R - L, hH);
    doc.line(MID, hTop, MID, hTop + hH);
    left.forEach((l, i) => doc.runs(l, L + PAD, hTop + PAD + 14 + i * HL, HS));
    right.forEach((l, i) => doc.runs(l, MID + PAD, hTop + PAD + 14 + i * HL, HS));

    /* table header */
    let y = hTop + hH + 16;
    const th = 74;
    doc.rect(L, y, R - L, th);
    doc.line(C2, y, C2, y + th); doc.line(C3, y, C3, y + th);
    wrap('PLANNED ACTIVITIES / OUTPUTS FOR THE PERIOD', C2 - C1 - 16, 10.5, true)
      .forEach((l, i) => doc.runs(l, C1 + 8, y + 22 + i * 14, 10.5));
    const ts = 'TASK STATUS';
    doc.text(ts, C2 + (C3 - C2 - textW(ts, 10.5, true)) / 2, y + 22, 10.5, true);
    const ic = 'if completed', icw = textW(ic, 10.5, true) + 14;
    const icx = C2 + (C3 - C2 - icw) / 2;
    doc.check(icx, y + 45, 9);
    doc.text(ic, icx + 14, y + 53, 10.5, true);
    const rm = 'REMARKS';
    doc.text(rm, C3 + (R - C3 - textW(rm, 10.5, true)) / 2, y + 22, 10.5, true);
    y += th;

    /* rows */
    const RS = 10, RL = 13.4, RP = 7;
    (d.rows || []).forEach(r => {
      const a = wrap(r.text, C2 - C1 - 2 * RP, RS);
      const c = r.lead ? [] : wrap(r.remark || '', R - C3 - 2 * RP, RS);
      const h = Math.max(a.length, c.length, 1) * RL + 2 * RP + 4;
      if (y + h > BOTTOM) { doc.newPage(); y = 72; }
      doc.rect(L, y, R - L, h);
      doc.line(C2, y, C2, y + h); doc.line(C3, y, C3, y + h);
      a.forEach((l, i) => doc.runs(l, C1 + RP, y + RP + 10 + i * RL, RS));
      if (!r.lead) {
        const mid = (C2 + C3) / 2;
        if (r.done) { doc.dot(mid - 9, y + RP + 6.5, 1.9); doc.check(mid + 1, y + RP + 1.5, 9); }
        else doc.dot(mid, y + RP + 6.5, 1.9);
        c.forEach((l, i) => doc.runs(l, C3 + RP, y + RP + 10 + i * RL, RS));
      }
      y += h;
    });

    /* sign-off */
    if (y + 110 > BOTTOM) { doc.newPage(); y = 72; }
    const sy = y + 62;
    doc.text('Prepared by:', L, sy, 10);
    doc.text((d.mentor || '').toUpperCase(), L + 64, sy, 10, true);
    doc.line(L + 60, sy - 12, MID - 14, sy - 12, 0.4);
    doc.text('Endorsed by:', 312, sy, 10);
    doc.text(d.endorsedBy || '', 380, sy, 10, true);
    doc.text(d.endorsedRole || '', 380, sy + 13, 10);
    doc.line(376, sy - 12, R, sy - 12, 0.4);
    doc.grey(true);
    doc.text('Signature over printed name', L + 64, sy + 13, 7.5);

    if (d.stamp) {
      doc.pages.forEach((ops, i) => {
        doc.ops = ops;
        doc.grey(true);
        doc.text(d.stamp + (doc.pages.length > 1 ? `  ·  page ${i + 1} of ${doc.pages.length}` : ''), L, PH - 30, 7);
        doc.grey(false);
      });
    }
    return new Blob([doc.bytes()], { type: 'application/pdf' });
  }

  window.STEP_REPORTPDF = { build, _wrap: wrap };
})();
