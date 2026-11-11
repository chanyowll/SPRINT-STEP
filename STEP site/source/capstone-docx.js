/* =====================================================================
   STEP Hub — Capstone: "Save as DOCX"
   Turns the DOST Form 2 preview (the #sheet the page draws) into a real
   Word file, pictures included, right in the browser. Nothing is sent
   anywhere: the file is built here and downloaded.

   STEP_CAPDOCX.save(sheetEl, { fileName, imageUrl(img) })
     sheetEl   the filled-in preview (#sheet)
     imageUrl  async (img) => a link for an <img> that has no src yet
   The grey "not yet written" notes and the working-draft line are left
   out: the file is the proposal itself.
   ===================================================================== */
(function () {
  'use strict';

  const JSZIP = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';   // the same copy This Week uses
  let zipReady = null;
  function jszip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    if (zipReady) return zipReady;
    zipReady = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = JSZIP;
      s.onload = () => res(window.JSZip);
      s.onerror = () => { zipReady = null; rej(new Error('the Word file maker did not load — check the connection and try again')); };
      document.head.appendChild(s);
    });
    return zipReady;
  }

  /* A4, 2 cm margins; sizes in twips (1/20 pt) and EMU (images) */
  const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1134, CONTENT = PAGE_W - 2 * MARGIN;
  const EMU_PER_TWIP = 635, CELL_PAD = 100;
  const BLUE = '0B3C6B', RED = 'C00000', GREY = '555555';

  const x = s => String(s == null ? '' : s)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const BLOCK = /^(DIV|P|TABLE|FIGURE|OL|UL|LI|H[1-6]|SECTION)$/;
  const hasCls = (el, c) => el.classList && el.classList.contains(c);
  const isBlockEl = el => el.nodeType === 1 && BLOCK.test(el.tagName);

  function build(sheet, imageUrl) {
    const media = [];                    // { name, data, type, rid }
    let imgSeq = 0;
    const pending = [];                  // image loads to finish before zipping

    /* ---------- runs ---------- */
    function rPr(st) {
      let s = '';
      if (st.b) s += '<w:b/>';
      if (st.i) s += '<w:i/>';
      if (st.color) s += `<w:color w:val="${st.color}"/>`;
      if (st.size) s += `<w:sz w:val="${st.size}"/><w:szCs w:val="${st.size}"/>`;
      return s ? `<w:rPr>${s}</w:rPr>` : '';
    }
    function textRuns(text, st, keepLines) {
      if (!keepLines) text = text.replace(/\s+/g, ' ');
      const parts = text.split('\n');
      return parts.map((p, i) => (i ? `<w:r>${rPr(st)}<w:br/></w:r>` : '') +
        (p ? `<w:r>${rPr(st)}<w:t xml:space="preserve">${x(p)}</w:t></w:r>` : '')).join('');
    }
    function styleFor(el, st) {
      const s = Object.assign({}, st);
      if (el.tagName === 'STRONG' || el.tagName === 'B' || hasCls(el, 'no') || hasCls(el, 'sub')) s.b = true;
      if (el.tagName === 'EM' || el.tagName === 'I') s.i = true;
      if (hasCls(el, 'fine')) { s.size = 15; s.b = false; s.color = s.color === RED ? RED : null; }
      if (hasCls(el, 'hint') || hasCls(el, 'footnote')) s.size = 17;
      if (hasCls(el, 'red')) s.color = RED;
      if (hasCls(el, 'ans') || hasCls(el, 'inline')) { s.color = BLUE; s.keep = true; }
      if (el.style && el.style.color === 'rgb(0, 0, 0)') s.color = null;
      return s;
    }
    function inlineRuns(node, st) {
      if (node.nodeType === 3) return textRuns(node.nodeValue, st, st.keep);
      if (node.nodeType !== 1) return '';
      if (hasCls(node, 'todo') || hasCls(node, 'draftnote')) return '';
      if (node.tagName === 'BR') return `<w:r><w:br/></w:r>`;
      if (node.tagName === 'IMG') return imageRun(node, null, st.width);
      if (hasCls(node, 'rule')) return `<w:r>${rPr(st)}<w:t xml:space="preserve">______________________________</w:t></w:r>`;
      const s = styleFor(node, st);
      return Array.from(node.childNodes).map(k => inlineRuns(k, s)).join('');
    }

    /* ---------- pictures ---------- */
    function imageRun(img, pct, width) {
      const id = ++imgSeq, rid = 'rImg' + id;
      const nw = img.naturalWidth || 800, nh = img.naturalHeight || 600;
      const avail = (width || CONTENT) - 2 * CELL_PAD;
      let wTw = pct ? avail * pct / 100 : Math.min(avail, nw * 15);        // a picture with no size set: 96 dpi, never wider than the column
      if (hasCls(img.parentElement, 'dochead') || img.closest('.dochead')) wTw = 1300;
      const cx = Math.round(wTw * EMU_PER_TWIP), cy = Math.round(cx * nh / nw);
      const slot = { name: 'image' + id, rid, data: null, ext: 'png' };
      media.push(slot);
      pending.push(loadImage(img).then(r => { slot.data = r.data; slot.ext = r.ext; }).catch(() => { slot.data = null; }));
      return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/>` +
        `<wp:docPr id="${id}" name="Picture ${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>` +
        `<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic>` +
        `<pic:nvPicPr><pic:cNvPr id="${id}" name="Picture ${id}"/><pic:cNvPicPr/></pic:nvPicPr>` +
        `<pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
        `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>` +
        `</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    }
    async function loadImage(img) {
      let src = img.getAttribute('src');
      if (!src && imageUrl) src = await imageUrl(img);
      if (!src) throw new Error('no link');
      const blob = await (await fetch(src)).blob();
      if (/^image\/(png|jpeg|gif)$/.test(blob.type)) return { data: await blob.arrayBuffer(), ext: blob.type === 'image/jpeg' ? 'jpeg' : blob.type.slice(6) };
      /* anything Word cannot show (webp…) becomes a PNG */
      const bmp = await createImageBitmap(blob);
      const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height;
      c.getContext('2d').drawImage(bmp, 0, 0);
      const png = await new Promise(r => c.toBlob(r, 'image/png'));
      return { data: await png.arrayBuffer(), ext: 'png' };
    }

    /* ---------- paragraphs and tables ---------- */
    function para(runs, opt) {
      opt = opt || {};
      let p = '';
      /* Word wants these in this order */
      if (opt.keepNext) p += '<w:keepNext/>';
      if (opt.before || opt.after) p += `<w:spacing w:before="${opt.before || 0}" w:after="${opt.after || 0}"/>`;
      if (opt.indent) p += `<w:ind w:left="${opt.indent}"/>`;
      if (opt.jc) p += `<w:jc w:val="${opt.jc}"/>`;
      return `<w:p>${p ? `<w:pPr>${p}</w:pPr>` : ''}${runs}</w:p>`;
    }
    /* the block content of an element, as Word paragraphs/tables */
    function blocks(el, st, width) {
      const out = [];
      let line = '';
      const flush = () => {
        if (line.replace(/<[^>]+>/g, '').trim() || line.includes('<w:drawing>')) out.push(para(line, { indent: st.indent }));
        line = '';
      };
      Array.from(el.childNodes).forEach(n => {
        if (n.nodeType === 1 && (hasCls(n, 'todo') || hasCls(n, 'draftnote'))) return;
        if (n.nodeType === 1 && hasCls(n, 'pagebreak')) { flush(); out.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>'); return; }
        if (!isBlockEl(n)) { line += inlineRuns(n, st); return; }
        flush();
        out.push(...blockOf(n, st, width));
      });
      flush();
      return out;
    }
    function blockOf(n, st, width) {
      if (n.tagName === 'TABLE') return [table(n, width)];
      if (hasCls(n, 'frame')) return [frame(n)];
      if (hasCls(n, 'dochead')) return [dochead(n)];
      if (n.tagName === 'FIGURE' && hasCls(n, 'capfig')) {
        const img = n.querySelector('img'), span = n.querySelector('span');
        const pct = span && parseFloat(span.style.width) || 100;
        return img ? [para(imageRun(img, pct, width), { before: 60, after: 60 })] : [];
      }
      if (n.tagName === 'OL' || n.tagName === 'UL') {
        const s = styleFor(n, st);
        return Array.from(n.children).map((li, i) =>
          para(textRuns((n.tagName === 'OL' ? (i + 1) + '. ' : '• '), s) + inlineRuns(li, s), { indent: 360 }));
      }
      const s = styleFor(n, st);
      if (hasCls(n, 'idt')) s.indent = (st.indent || 0) + 360;
      if (hasCls(n, 'certify')) return [para(inlineRuns(n, s), { jc: 'both', before: 160, after: 120 })];
      const inner = Array.from(n.childNodes).some(isBlockEl);
      if (!inner) {
        const runs = inlineRuns(n, s);
        if (!runs.replace(/<[^>]+>/g, '').trim() && !runs.includes('<w:drawing>')) return [];
        return [para(runs, { indent: s.indent, jc: hasCls(n, 'ans') ? 'both' : null })];
      }
      return blocks(n, s, width);
    }
    const border = sz => `<w:top w:val="single" w:sz="${sz}" w:color="000000"/><w:left w:val="single" w:sz="${sz}" w:color="000000"/>` +
      `<w:bottom w:val="single" w:sz="${sz}" w:color="000000"/><w:right w:val="single" w:sz="${sz}" w:color="000000"/>`;
    const cellXml = (content, w, extra) =>
      `<w:tc><w:tcPr><w:tcW w:w="${Math.round(w)}" w:type="dxa"/>${extra || ''}</w:tcPr>${content.length ? content.join('') : '<w:p/>'}</w:tc>`;
    function tblXml(rows, widths, opt) {
      opt = opt || {};
      return `<w:tbl><w:tblPr><w:tblW w:w="${Math.round(widths.reduce((a, b) => a + b, 0))}" w:type="dxa"/>` +
        (opt.noBorders ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
          : `<w:tblBorders>${border(6)}<w:insideH w:val="single" w:sz="6" w:color="000000"/><w:insideV w:val="single" w:sz="6" w:color="000000"/></w:tblBorders>`) +
        `<w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="${CELL_PAD}" w:type="dxa"/><w:right w:w="${CELL_PAD}" w:type="dxa"/></w:tblCellMar></w:tblPr>` +
        `<w:tblGrid>${widths.map(w => `<w:gridCol w:w="${Math.round(w)}"/>`).join('')}</w:tblGrid>${rows.join('')}</w:tbl>` +
        '<w:p><w:pPr><w:spacing w:before="0" w:after="0"/><w:rPr><w:sz w:val="4"/></w:rPr></w:pPr></w:p>';
    }
    /* the form's ruled boxes: a .box spans the page; a .split is two cells side by side */
    function frame(el) {
      const half = CONTENT / 2, rows = [];
      Array.from(el.children).forEach(row => {
        if (hasCls(row, 'split')) {
          const cells = Array.from(row.children).slice(0, 2);
          rows.push(`<w:tr><w:trPr><w:cantSplit/></w:trPr>${cells.map(c => cellXml(blocks(c, {}, half), half)).join('')}</w:tr>`);
        } else {
          rows.push(`<w:tr>${cellXml(blocks(row, {}, CONTENT), CONTENT, '<w:gridSpan w:val="2"/>')}</w:tr>`);
        }
      });
      return tblXml(rows, [half, half]);
    }
    function table(el, width) {
      width = (width || CONTENT) - 2 * CELL_PAD;
      const trs = Array.from(el.querySelectorAll('tr'));
      const cols = Math.max(...trs.map(tr => Array.from(tr.children).reduce((a, c) => a + (c.colSpan || 1), 0)), 1);
      /* use the widths the form gives its first column, share the rest */
      const first = trs[0] ? Array.from(trs[0].children) : [];
      let widths = new Array(cols).fill(null);
      first.forEach((c, i) => { const m = /width:\s*(\d+)%/.exec(c.getAttribute('style') || ''); if (m && i < cols) widths[i] = width * (+m[1]) / 100; });
      const fixed = widths.reduce((a, w) => a + (w || 0), 0), free = widths.filter(w => w == null).length;
      widths = widths.map(w => w == null ? (width - fixed) / Math.max(free, 1) : w);
      const rows = trs.map(tr => {
        let ci = 0;
        const cells = Array.from(tr.children).map(c => {
          const span = c.colSpan || 1, w = widths.slice(ci, ci + span).reduce((a, b) => a + b, 0); ci += span;
          const head = c.tagName === 'TH';
          const st = styleFor(c, head ? { b: true, size: 16 } : { size: 18 });
          const content = blocks(c, st, w);
          const shade = head ? '<w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>' : '';
          return cellXml(content, w, (span > 1 ? `<w:gridSpan w:val="${span}"/>` : '') + shade + '<w:vAlign w:val="center"/>');
        }).join('');
        return `<w:tr><w:trPr><w:cantSplit/>${tr.parentElement.tagName === 'THEAD' ? '<w:tblHeader/>' : ''}</w:trPr>${cells}</w:tr>`;
      });
      return tblXml(rows, widths);
    }
    function dochead(el) {
      const img = el.querySelector('img'), ti = el.querySelector('.ti');
      const logo = img ? [para(imageRun(img, null, 1600))] : [];
      const title = ti ? Array.from(ti.children).map((d, i) =>
        para(textRuns(d.textContent.trim(), { b: true, size: i ? 26 : 20 }), { jc: 'center' })) : [];
      return tblXml([`<w:tr>${cellXml(logo, 1600)}${cellXml(title, CONTENT - 3200)}${cellXml([], 1600)}</w:tr>`], [1600, CONTENT - 3200, 1600], { noBorders: true });
    }

    const body = blocks(sheet, {}, CONTENT).join('');
    return { body, media, pending };
  }

  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
    'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
    'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
    'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';

  async function make(sheet, opt) {
    opt = opt || {};
    const Zip = await jszip();
    const { body, media, pending } = build(sheet, opt.imageUrl);
    await Promise.all(pending);
    let bodyXml = body;
    const ok = media.filter(m => m.data);
    media.filter(m => !m.data).forEach(m => {                  // a picture that could not be fetched leaves no broken box
      bodyXml = bodyXml.replace(new RegExp('<w:r><w:drawing>(?:(?!</w:drawing>).)*r:embed="' + m.rid + '"(?:(?!</w:drawing>).)*</w:drawing></w:r>', 's'), '');
    });
    const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}><w:body>${bodyXml}` +
      `<w:sectPr><w:pgSz w:w="${PAGE_W}" w:h="${PAGE_H}"/><w:pgMar w:top="${MARGIN}" w:right="${MARGIN}" w:bottom="${MARGIN}" w:left="${MARGIN}" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">` +
      `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="19"/><w:szCs w:val="19"/><w:lang w:val="en-PH"/></w:rPr></w:rPrDefault>` +
      `<w:pPrDefault><w:pPr><w:spacing w:before="20" w:after="40" w:line="252" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>` +
      `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>` +
      `<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="${CELL_PAD}" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="${CELL_PAD}" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
      ok.map(m => `<Relationship Id="${m.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name}.${m.ext}"/>`).join('') +
      `</Relationships>`;
    const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>` +
      `<Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="gif" ContentType="image/gif"/>` +
      `<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
      `<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>` +
      `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
    const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
      `<dc:title>${x(opt.title || 'DOST Form 2 — FASTRAC proposal')}</dc:title><dc:creator>STEP Hub</dc:creator>` +
      `<dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</dcterms:created></cp:coreProperties>`;
    const zip = new Zip();
    const add = (name, data) => zip.file(name, data, { createFolders: false });   // no folder entries: Word can refuse those
    add('[Content_Types].xml', types);
    add('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
      `<Relationship Id="rDoc" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>` +
      `<Relationship Id="rCore" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`);
    add('docProps/core.xml', core);
    add('word/document.xml', doc);
    add('word/styles.xml', styles);
    add('word/_rels/document.xml.rels', rels);
    ok.forEach(m => add(`word/media/${m.name}.${m.ext}`, m.data));
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }

  async function save(sheet, opt) {
    const blob = await make(sheet, opt);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (opt && opt.fileName) || 'FASTRAC proposal.docx';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
    return blob;
  }

  window.STEP_CAPDOCX = { make, save };
})();
