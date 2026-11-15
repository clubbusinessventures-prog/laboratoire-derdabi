/* pdf.js — Générateur PDF vectoriel (jsPDF 2.5.1 vendu dans vendor/jspdf.umd.min.js).
   Remplace l'approche html2canvas : texte vectoriel sélectionnable, prêt pour impression A4.
   Langue : les documents sont TOUJOURS générés en français (usage des laboratoires marocains).
   Limitation assumée : les polices de base de jsPDF (helvetica/WinAnsi) ne contiennent pas les
   glyphes arabes ; si lang === 'ar' le document reste donc entièrement en français (aucune
   tentative de rendu arabe n'est faite, voir buildAppointmentVoucher / buildResultReport).
   Aucune donnée inventée : seules les valeurs réellement passées sont affichées ;
   chaque document porte un marquage « démonstration » explicite. */
(function () {
  'use strict';

  /* ---------- Palette & gabarit (mm) ---------- */
  var C = {
    teal: [14, 143, 138],      // titres, filets, en-têtes de tableau
    navy: [10, 37, 64],        // texte principal
    slate: [71, 85, 105],      // libellés / texte secondaire
    line: [215, 222, 230],     // filets clairs
    zebra: [244, 247, 250],    // lignes paires des tableaux
    boxBg: [248, 250, 251],    // fond des blocs d'information
    tealLight: [230, 244, 243],// fond du cadre « Référence »
    coral: [255, 122, 93],     // marquage DÉMONSTRATION uniquement
    red: [220, 38, 38],        // valeurs hors intervalle uniquement
    footerGray: [150, 158, 170],
    white: [255, 255, 255]
  };
  var PAGE = { w: 210, h: 297, margin: 15, right: 195, bottom: 282, footerY: 289, ruleY: 285.8 };
  var LH = 4.2; // hauteur de ligne (mm) — grille de base verticale
  var DOC_TYPE_REPORT = 'Compte rendu d\u2019analyses';
  var DOC_TYPE_VOUCHER = 'Bon de rendez-vous';
  var DEMO_FOOTER = 'Document de démonstration \u2014 projet universitaire \u2014 aucune donnée réelle';
  var DEMO_LINE = 'DÉMONSTRATION \u2014 document généré pour un projet universitaire ; aucune donnée réelle n\u2019y figure.';
  var FLAG_LABELS = { low: '(bas)', high: '(élevé)', abnormal: '(anormal)' };

  /* ---------- Assainissement texte (WinAnsi) ---------- */
  /* jsPDF + helvetica ne rendent que WinAnsi : on remplace les ponctuations
     typographiques par de l'ASCII et on supprime tout caractère hors Latin-1
     (accents français conservés : é è ê à ç ô û ï …). */
  function S(v) {
    var s = v == null ? '' : String(v);
    s = s
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
      .replace(/[\u201C\u201D\u201E]/g, '"')
      .replace(/[\u2013\u2014\u2015]/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/\u00A0/g, ' ')
      .replace(/\u2022/g, '-')
      .replace(/\t/g, ' ');
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c === 10 || c === 13 || (c >= 32 && c <= 126) || (c >= 160 && c <= 255)) out += s.charAt(i);
    }
    return out;
  }
  /* Valeur affichable : vide/absent → tiret (jamais de donnée inventée). */
  function val(v) { var s = S(v).trim(); return s === '' ? '-' : s; }
  function firstOf() {
    for (var i = 0; i < arguments.length; i++) {
      var v = arguments[i];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  }

  /* ---------- Dates ---------- */
  function toDate(v) {
    if (!v) return null;
    var d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  /* « 20/11/2026 » — parsing manuel pour YYYY-MM-DD afin d'éviter tout décalage fuseau. */
  function fmtShort(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v == null ? '' : v));
    if (m) return m[3] + '/' + m[2] + '/' + m[1];
    var d = toDate(v);
    return d ? d.toLocaleDateString('fr-FR') : (v ? S(v) : '-');
  }
  /* « vendredi 20 novembre 2026 » */
  function fmtLong(v) {
    var d = toDate(v);
    return d ? d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : (v ? S(v) : '-');
  }

  /* ---------- Chargement paresseux de jsPDF (motif extras.js) ---------- */
  var jspdfPromise = null;
  /* Base du module : les pages publiques (/) et l'administration (/admin/) n'ont pas
     la même racine relative — on résout tout par rapport à l'emplacement de pdf.js. */
  var MODULE_BASE = (function () {
    try {
      var tag = document.querySelector('script[src$="pdf.js"]') || document.querySelector('script[src*="pdf.js"]');
      if (tag && tag.src) return tag.src.replace(/pdf\.js.*$/, '');
    } catch (e) { /* ignore */ }
    return '';
  })();
  function assetPath(rel) { return MODULE_BASE ? MODULE_BASE + rel : rel; }
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      try {
        var s = document.createElement('script');
        var done = false;
        var timer = setTimeout(function () {
          if (done) return;
          done = true;
          reject(new Error('Délai dépassé lors du chargement de ' + src));
        }, 10000);
        s.onload = function () {
          if (done) return;
          done = true;
          clearTimeout(timer);
          resolve();
        };
        s.onerror = function () {
          if (done) return;
          done = true;
          clearTimeout(timer);
          reject(new Error('Impossible de charger la bibliothèque PDF (' + src + ').'));
        };
        s.src = src;
        s.async = true;
        document.head.appendChild(s);
      } catch (e) {
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });
  }
  function ensureJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (!jspdfPromise) {
      jspdfPromise = loadScript(assetPath('vendor/jspdf.umd.min.js')).then(function () {
        if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
        throw new Error('jsPDF absent après chargement de vendor/jspdf.umd.min.js.');
      });
      jspdfPromise.catch(function () { /* rejet géré par chaque appelant */ });
    }
    return jspdfPromise;
  }

  /* ---------- Logo (fetch → blob → dataURL, cache module, tolérant aux échecs) ---------- */
  var logoPromise = null;
  var logoCache = null; // { url: dataURL, ratio: largeur/hauteur } ou null
  function loadLogo() {
    if (logoPromise) return logoPromise;
    logoPromise = new Promise(function (resolve) {
      var finished = false;
      var done = function (v) { if (!finished) { finished = true; logoCache = v || null; resolve(logoCache); } };
      try {
        /* file:// ou environnement sans fetch/FileReader : en-tête 100 % texte, en silence. */
        if (typeof fetch !== 'function' || typeof FileReader === 'undefined') return done(null);
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timer = setTimeout(function () {
          if (controller) { try { controller.abort(); } catch (e) { /* noop */ } }
          done(null);
        }, 3000);
        fetch(assetPath('assets/logo/logo.png'), controller ? { signal: controller.signal } : undefined)
          .then(function (r) {
            if (!r.ok) throw new Error('logo indisponible');
            return r.blob();
          })
          .then(function (blob) {
            var reader = new FileReader();
            reader.onload = function () {
              clearTimeout(timer);
              var url = String(reader.result || '');
              if (!url) return done(null);
              /* Ratio via Image pour ne pas déformer le logo. */
              if (typeof Image === 'undefined') return done({ url: url, ratio: 1 });
              var img = new Image();
              img.onload = function () {
                var ratio = (img.naturalWidth && img.naturalHeight) ? (img.naturalWidth / img.naturalHeight) : 1;
                done({ url: url, ratio: ratio > 0 ? ratio : 1 });
              };
              img.onerror = function () { done({ url: url, ratio: 1 }); };
              img.src = url;
            };
            reader.onerror = function () { clearTimeout(timer); done(null); };
            reader.readAsDataURL(blob);
          })
          .catch(function () { clearTimeout(timer); done(null); });
      } catch (e) {
        done(null);
      }
    });
    return logoPromise;
  }

  /* ---------- En-tête / pied de page ---------- */
  function labText(lab) {
    lab = lab || {};
    return {
      name: S(firstOf(lab.labName, 'Laboratoire Derdabi')),
      address: S(firstOf(lab.address, 'Avenue des FAR, Tétouan')),
      phone: S(firstOf(lab.phone, '-')),
      whatsapp: S(firstOf(lab.whatsapp, '-'))
    };
  }
  /* En-tête fin identique sur chaque page (dessin synchrone : logo préchargé au préalable). */
  function drawHeader(doc, lab, docType) {
    var L = labText(lab);
    var topY = 12;
    var textX = PAGE.margin;
    var logo = logoCache;
    if (logo && logo.url) {
      try {
        var h = 16, w = h * (logo.ratio || 1);
        if (w > 40) { w = 40; h = w / (logo.ratio || 1); }
        doc.addImage(logo.url, 'PNG', PAGE.margin, topY - 1, w, h);
        textX = PAGE.margin + w + 5;
      } catch (e) { textX = PAGE.margin; }
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(C.teal[0], C.teal[1], C.teal[2]);
    doc.text(L.name, textX, topY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(C.slate[0], C.slate[1], C.slate[2]);
    doc.text(val(L.address) + ' - Tél. ' + val(L.phone) + ' - WhatsApp ' + val(L.whatsapp), textX, topY + 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(C.navy[0], C.navy[1], C.navy[2]);
    doc.text(S(docType), PAGE.right, topY + 5, { align: 'right' });
    doc.setDrawColor(C.teal[0], C.teal[1], C.teal[2]);
    doc.setLineWidth(0.4);
    doc.line(PAGE.margin, 29, PAGE.right, 29);
    return 36; // première ligne de contenu sous l'en-tête
  }
  /* Pied de page : marquage démo à gauche, pagination à droite (total connu en fin de build). */
  function drawFooters(doc) {
    var total = doc.getNumberOfPages();
    for (var i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
      doc.setLineWidth(0.2);
      doc.line(PAGE.margin, PAGE.ruleY, PAGE.right, PAGE.ruleY);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(C.footerGray[0], C.footerGray[1], C.footerGray[2]);
      doc.text(S(DEMO_FOOTER), PAGE.margin, PAGE.footerY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(C.slate[0], C.slate[1], C.slate[2]);
      doc.text('Page ' + i + ' / ' + total, PAGE.right, PAGE.footerY, { align: 'right' });
    }
  }

  /* ---------- Briques de mise en page ---------- */
  function newPageIfNeeded(doc, y, needed, ctx) {
    if (y + needed <= PAGE.bottom) return y;
    doc.addPage();
    return drawHeader(doc, ctx.lab, ctx.docType);
  }
  function docTitle(doc, y, txt) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(C.navy[0], C.navy[1], C.navy[2]);
    doc.text(S(txt), PAGE.w / 2, y + 6, { align: 'center' });
    return y + 10;
  }
  function demoMark(doc, y) {
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(8);
    doc.setTextColor(C.coral[0], C.coral[1], C.coral[2]);
    doc.text(S(DEMO_LINE), PAGE.margin, y);
    return y + 6;
  }
  function sectionTitle(doc, y, txt) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(C.teal[0], C.teal[1], C.teal[2]);
    doc.text(S(txt), PAGE.margin, y);
    return y + 6;
  }
  /* Bloc libellé/valeur sur deux colonnes, fond clair + cadre fin. */
  function infoGrid(doc, y, items, ctx) {
    var gap = 6;
    var colW = (PAGE.right - PAGE.margin - gap) / 2;
    var rows = [];
    for (var i = 0; i < items.length; i += 2) rows.push([items[i], items[i + 1] || null]);
    var rowsData = rows.map(function (r) {
      return r.map(function (it) {
        if (!it) return null;
        var lines = doc.splitTextToSize(val(it[1]), colW - 4);
        return { label: S(it[0]), lines: lines };
      });
    });
    var heights = rowsData.map(function (r) {
      var maxL = r.reduce(function (m, c) { return c ? Math.max(m, c.lines.length) : m; }, 1);
      return 9.4 + (maxL - 1) * LH + 3.2;
    });
    var totalH = heights.reduce(function (a, b) { return a + b; }, 0);
    y = newPageIfNeeded(doc, y, totalH + 2, ctx);
    doc.setFillColor(C.boxBg[0], C.boxBg[1], C.boxBg[2]);
    doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
    doc.setLineWidth(0.2);
    doc.rect(PAGE.margin, y, PAGE.right - PAGE.margin, totalH, 'FD');
    var cy = y;
    rowsData.forEach(function (r, ri) {
      r.forEach(function (cell, ci) {
        if (!cell) return;
        var x = PAGE.margin + ci * (colW + gap);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(C.slate[0], C.slate[1], C.slate[2]);
        doc.text(cell.label, x + 2, cy + 4.6);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(C.navy[0], C.navy[1], C.navy[2]);
        cell.lines.forEach(function (ln, k) {
          doc.text(ln, x + 2, cy + 9.4 + k * LH);
        });
      });
      cy += heights[ri];
    });
    return y + totalH;
  }
  /* Boîte d'information (note, commentaire, conclusion) : fond zébré + cadre fin. */
  function infoBox(doc, y, text, ctx) {
    var lines = doc.splitTextToSize(S(text), PAGE.right - PAGE.margin - 8);
    var h = lines.length * LH + 6;
    y = newPageIfNeeded(doc, y, h + 2, ctx);
    doc.setFillColor(C.zebra[0], C.zebra[1], C.zebra[2]);
    doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
    doc.setLineWidth(0.2);
    doc.rect(PAGE.margin, y, PAGE.right - PAGE.margin, h, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(C.slate[0], C.slate[1], C.slate[2]);
    lines.forEach(function (ln, k) {
      doc.text(ln, PAGE.margin + 4, y + 5.5 + k * LH);
    });
    return y + h;
  }
  /* Rendu de tableau réutilisable : saut de page + répétition de l'en-tête. */
  /* cols : [{ header, width, align }] ; rows : [[cellule,…]] avec cellule = texte ou { text, color } */
  function drawTable(doc, cfg) {
    var ctx = cfg.ctx || {};
    var cols = cfg.cols;
    var startX = PAGE.margin;
    var totalW = cols.reduce(function (a, c) { return a + c.width; }, 0);
    function colX(i) {
      var x = startX;
      for (var k = 0; k < i; k++) x += cols[k].width;
      return x;
    }
    function textX(i) {
      var c = cols[i];
      if (c.align === 'right') return colX(i) + c.width - 2;
      if (c.align === 'center') return colX(i) + c.width / 2;
      return colX(i) + 2;
    }
    function alignOf(i) {
      var c = cols[i];
      return c.align === 'right' ? { align: 'right' } : (c.align === 'center' ? { align: 'center' } : {});
    }
    function tableHead(y) {
      var wrapped = cols.map(function (c) { return doc.splitTextToSize(S(c.header), c.width - 4); });
      var maxL = wrapped.reduce(function (m, l) { return Math.max(m, l.length); }, 1);
      var hH = maxL * LH + 4;
      doc.setFillColor(C.teal[0], C.teal[1], C.teal[2]);
      doc.rect(startX, y, totalW, hH, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(C.white[0], C.white[1], C.white[2]);
      wrapped.forEach(function (lines, i) {
        lines.forEach(function (ln, k) {
          doc.text(ln, colX(i) + cols[i].width / 2, y + 4.0 + k * LH, { align: 'center' });
        });
      });
      return y + hH;
    }
    var y = tableHead(cfg.y);
    (cfg.rows || []).forEach(function (row, idx) {
      var cells = cols.map(function (c, i) {
        var raw = row[i];
        var cell = (raw !== null && typeof raw === 'object') ? raw : { text: raw };
        var txt = cell.text == null || S(cell.text) === '' ? '-' : S(cell.text);
        return { lines: doc.splitTextToSize(txt, c.width - 4), color: cell.color || null };
      });
      var maxL = cells.reduce(function (m, c) { return Math.max(m, c.lines.length); }, 1);
      var rH = maxL * LH + 3;
      if (y + rH > PAGE.bottom) {
        doc.addPage();
        y = drawHeader(doc, ctx.lab, ctx.docType);
        y = tableHead(y);
      }
      if (idx % 2 === 1) {
        doc.setFillColor(C.zebra[0], C.zebra[1], C.zebra[2]);
        doc.rect(startX, y, totalW, rH, 'F');
      }
      cells.forEach(function (cell, i) {
        var col = cell.color || (i === 0 ? C.navy : C.slate);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(col[0], col[1], col[2]);
        cell.lines.forEach(function (ln, k) {
          doc.text(ln, textX(i), y + 3.6 + k * LH, alignOf(i));
        });
      });
      y += rH;
      doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
      doc.setLineWidth(0.2);
      doc.line(startX, y, startX + totalW, y);
    });
    return y + 2;
  }

  /* ============================================================
     1) BON DE RENDEZ-VOUS
     ============================================================ */
  async function buildAppointmentVoucher(payload, lab, lang) {
    /* lang est ignoré volontairement : document toujours en français (les polices
       de base de jsPDF ne peuvent pas restituer les glyphes arabes). */
    var JsPDF = await ensureJsPDF();
    await loadLogo();
    var p = payload || {};
    var ctx = { lab: lab, docType: DOC_TYPE_VOUCHER };
    var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    doc.setProperties({
      title: 'Bon de rendez-vous',
      subject: 'Laboratoire - document de démonstration',
      author: labText(lab).name
    });

    var y = drawHeader(doc, lab, DOC_TYPE_VOUCHER);
    y = docTitle(doc, y, 'BON DE RENDEZ-VOUS');
    y = demoMark(doc, y) + 1;

    /* Cadre « Référence » mis en évidence (grande valeur, aucune invention). */
    var ref = S(firstOf(p.reference, p.ref, p.id) || '-');
    y = newPageIfNeeded(doc, y, 22, ctx);
    doc.setFillColor(C.tealLight[0], C.tealLight[1], C.tealLight[2]);
    doc.setDrawColor(C.teal[0], C.teal[1], C.teal[2]);
    doc.setLineWidth(0.4);
    doc.rect(PAGE.margin, y, PAGE.right - PAGE.margin, 18, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(C.slate[0], C.slate[1], C.slate[2]);
    doc.text('Référence', PAGE.margin + 4, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(C.navy[0], C.navy[1], C.navy[2]);
    doc.text(ref, PAGE.margin + 4, y + 14);
    y += 18 + 6;

    /* Bloc patient. */
    y = sectionTitle(doc, y, 'Patient');
    var patientItems = [
      ['Nom', firstOf(p.name, p.patientName, p.nom)],
      ['Téléphone', firstOf(p.phone, p.telephone)]
    ];
    if (p.mutuelle) patientItems.push(['Mutuelle', p.mutuelle]);
    y = infoGrid(doc, y, patientItems, ctx);
    y += 3;

    /* Bloc rendez-vous. */
    y = sectionTitle(doc, y, 'Rendez-vous');
    var lieu = firstOf(p.locationLabel);
    if (lieu == null) {
      if (p.lieu === 'À domicile' || p.home) {
        lieu = 'À domicile' + (p.zone ? ' - ' + p.zone : '') + (p.adresse ? ' - ' + p.adresse : '');
      } else {
        lieu = p.lieu;
      }
    }
    y = infoGrid(doc, y, [
      ['Date', fmtLong(firstOf(p.date))],
      ['Horaire', firstOf(p.time, p.creneau)],
      ['Lieu', lieu]
    ], ctx);
    y += 3;

    /* Liste des analyses prévues (tableau OU chaîne unique, défensivement). */
    y = sectionTitle(doc, y, 'Analyses prévues');
    var list = Array.isArray(p.analyses) ? p.analyses : (p.analyses ? [p.analyses] : []);
    if (!list.length) {
      y = infoBox(doc, y, 'Aucune analyse renseignée pour ce rendez-vous.', ctx);
    } else {
      list.forEach(function (a) {
        var txt = (a && typeof a === 'object') ? firstOf(a.name, a.label) : a;
        var lines = doc.splitTextToSize(val(txt), PAGE.right - PAGE.margin - 8);
        var h = lines.length * LH + 1.4;
        y = newPageIfNeeded(doc, y, h, ctx);
        doc.setFillColor(C.teal[0], C.teal[1], C.teal[2]);
        doc.circle(PAGE.margin + 3, y + 2.4, 0.7, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(C.navy[0], C.navy[1], C.navy[2]);
        lines.forEach(function (ln, k) {
          doc.text(ln, PAGE.margin + 8, y + 3.4 + k * LH);
        });
        y += h;
      });
    }
    y += 3;

    /* Informations pratiques. */
    y = newPageIfNeeded(doc, y, 24, ctx);
    y = infoBox(doc, y,
      'Présentez-vous 10 minutes avant l\u2019heure convenue. Apportez votre ordonnance et votre carte ' +
      'd\u2019assurance (CNSS, CNOPS, AMO). Pour toute question, contactez le laboratoire au ' +
      val(firstOf(lab && lab.phone)) + '.', ctx);

    /* Cachet du laboratoire : cadre vide, aucune signature fictive. */
    y = newPageIfNeeded(doc, y + 2, 34, ctx) + 2;
    doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
    doc.setLineWidth(0.3);
    doc.rect(PAGE.right - 60, y, 60, 25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(C.slate[0], C.slate[1], C.slate[2]);
    doc.text('Cachet du laboratoire', PAGE.right - 58, y + 5);

    drawFooters(doc);
    return doc.output('blob');
  }

  /* ============================================================
     2) COMPTE RENDU D'ANALYSES MÉDICALES
     ============================================================ */
  async function buildResultReport(dossier, lab, lang) {
    /* lang est ignoré volontairement : document toujours en français (les polices
       de base de jsPDF ne peuvent pas restituer les glyphes arabes). */
    var JsPDF = await ensureJsPDF();
    await loadLogo();
    var d = dossier || {};
    var ctx = { lab: lab, docType: DOC_TYPE_REPORT };
    var doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
    doc.setProperties({
      title: 'Compte rendu d\u2019analyses médicales',
      subject: 'Laboratoire - document de démonstration',
      author: labText(lab).name
    });

    var y = drawHeader(doc, lab, DOC_TYPE_REPORT);
    y = docTitle(doc, y, 'COMPTE RENDEU D\u2019ANALYSES MÉDICALES');
    y = demoMark(doc, y) + 1;

    /* Bloc patient (deux colonnes, fond clair). */
    var sample = firstOf(d.sampleDate, d.date, d.createdAt ? String(d.createdAt).slice(0, 10) : null);
    var today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    y = infoGrid(doc, y, [
      ['Dossier', d.id],
      ['Patient', d.patientName],
      ['Téléphone', d.phone],
      ['Date de prélèvement', sample],
      ['Date d\u2019édition', today],
      ['Médecin prescripteur', d.prescriber]
    ], ctx);
    y += 4;

    /* Tableau des résultats — aucune valeur inventée :
       analyse sans résultat → « - » dans Résultat / Unité / Intervalles. */
    var analyses = Array.isArray(d.analyses) ? d.analyses : [];
    var results = Array.isArray(d.results) ? d.results : [];
    var byName = {};
    results.forEach(function (r) {
      if (r && r.analysis != null) byName[String(r.analysis).trim().toLowerCase()] = r;
    });
    var rows = [];
    var pending = 0;
    var source = analyses.length ? analyses : results.map(function (r) { return r && r.analysis; }).filter(Boolean);
    source.forEach(function (a) {
      var name = (a && typeof a === 'object') ? firstOf(a.name, a.label) : a;
      var r = byName[String(name == null ? '' : name).trim().toLowerCase()];
      var valueTxt = '-', unitTxt = '-', rangeTxt = '-', valueColor = null;
      if (r) {
        valueTxt = firstOf(r.value) != null ? S(firstOf(r.value)) : '-';
        unitTxt = firstOf(r.unit) != null ? S(firstOf(r.unit)) : '-';
        rangeTxt = firstOf(r.range) != null ? S(firstOf(r.range)) : '-';
        var flag = r.flag ? FLAG_LABELS[String(r.flag).toLowerCase()] : null;
        if (flag && valueTxt !== '-') {
          valueTxt = valueTxt + ' ' + flag;
          valueColor = C.red; // rouge réservé aux valeurs hors intervalle
        }
        if (valueTxt === '-') pending++;
      } else {
        pending++;
      }
      rows.push([
        { text: name },
        { text: valueTxt, color: valueColor || C.navy },
        { text: unitTxt },
        { text: rangeTxt }
      ]);
    });

    if (!rows.length) {
      y = infoBox(doc, y, 'Aucune analyse enregistrée pour ce dossier.', ctx);
    } else {
      y = drawTable(doc, {
        y: y,
        ctx: ctx,
        cols: [
          { header: 'Analyse', width: 78, align: 'left' },
          { header: 'Résultat', width: 34, align: 'center' },
          { header: 'Unité', width: 26, align: 'center' },
          { header: 'Intervalles de référence', width: 42, align: 'left' }
        ],
        rows: rows
      });
      if (pending > 0) {
        y = infoBox(doc, y + 2, 'Résultats en attente de validation biologique.', ctx);
      }
    }

    /* Commentaires / Conclusion — uniquement si réellement présents. */
    if (d.comments) {
      y += 2;
      y = sectionTitle(doc, y, 'Commentaires');
      y = infoBox(doc, y, d.comments, ctx);
    }
    if (d.conclusion) {
      y += 2;
      y = sectionTitle(doc, y, 'Conclusion');
      y = infoBox(doc, y, d.conclusion, ctx);
    }

    /* Biologiste + zone de cachet (vide — jamais de signature simulée). */
    y = newPageIfNeeded(doc, y + 2, 36, ctx) + 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(C.navy[0], C.navy[1], C.navy[2]);
    doc.text(S('Biologiste médical : ' + firstOf(lab && lab.biologistName, '________________________')), PAGE.margin, y + 4);
    doc.setDrawColor(C.line[0], C.line[1], C.line[2]);
    doc.setLineWidth(0.3);
    doc.rect(PAGE.right - 60, y, 60, 25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(C.slate[0], C.slate[1], C.slate[2]);
    doc.text('Cachet et signature', PAGE.right - 58, y + 5);

    drawFooters(doc);
    return doc.output('blob');
  }

  /* ---------- API publique ---------- */
  window.LabPDF = {
    /* true si la bibliothèque jsPDF vendue est déjà disponible (window.jspdf.jsPDF). */
    available: function () {
      return !!(window.jspdf && window.jspdf.jsPDF);
    },
    buildAppointmentVoucher: buildAppointmentVoucher,
    buildResultReport: buildResultReport
  };
})();
