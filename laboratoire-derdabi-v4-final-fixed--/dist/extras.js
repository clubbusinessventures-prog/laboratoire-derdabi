/* extras.js — Bon de RDV en PDF (LabPDF puis repli html2canvas), test de connexion ?debug=1. Chargé après script.js (CONFIG, t, currentLang). */
(function () {
  'use strict';
  const LAB = { phone: '05 00 05 55 05', wa: '06 48 55 83 66' };
  const isConfigured = () => !!CONFIG.appointmentEndpoint && !CONFIG.appointmentEndpoint.includes('PLACEHOLDER');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- PDF du bon de RDV (module LabPDF si présent, sinon html2canvas + jsPDF chargés à la demande) ---------- */
  const loadScript = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
  async function ensurePdfLibs() {
    if (!window.html2canvas) await loadScript('vendor/html2canvas.min.js');
    if (!window.jspdf) await loadScript('vendor/jspdf.umd.min.js');
  }
  function buildSheet(p, ref) {
    const ar = currentLang === 'ar';
    const row = (k, v) => `<div class="pdf-row"><span class="pdf-k">${t(k)}</span><span class="pdf-v"><bdi>${esc(v)}</bdi></span></div>`;
    const home = p.lieu === 'À domicile';
    const place = home ? `${t('pdfHome')} — ${p.zone || ''}${p.adresse ? ' — ' + p.adresse : ''}` : t('pdfLab');
    const el = document.createElement('div');
    el.id = 'pdf-sheet'; el.className = 'pdf-sheet'; el.dir = ar ? 'rtl' : 'ltr'; el.lang = ar ? 'ar' : 'fr';
    el.innerHTML = `
      <div class="pdf-head"><img src="${esc(CONFIG.assets.logo)}" alt="" class="pdf-logo"><div class="pdf-title">${t('pdfTitle')}</div></div>
      <div class="pdf-ref"><span>${t('pdfRef')}</span><strong><bdi>${esc(ref)}</bdi></strong></div>
      ${row('pdfPatient', p.nom)}${row('pdfPhone', p.telephone)}${row('pdfDateSlot', `${p.date} — ${p.creneau}`)}
      ${row('pdfPlace', place)}${row('pdfAnalyses', p.analyses)}${p.mutuelle ? row('pdfInsurer', p.mutuelle) : ''}
      <div class="pdf-box"><h4>${t('pdfPrepTitle')}</h4><p>${t('pdfPrepText')}</p></div>
      <div class="pdf-box"><h4>${t('pdfBringTitle')}</h4><p>${t('pdfBringText')}</p></div>
      <div class="pdf-foot"><div>${t('pdfAddress')}</div><div><bdi>${LAB.phone}</bdi> · WhatsApp <bdi>${LAB.wa}</bdi></div><div>${t('pdfHours')}</div><p>${t('pdfNote')}</p></div>`;
    return el;
  }
  window.downloadBookingPdf = async function (payload, ref, btn) {
    const label = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.textContent = t('pdfGenerating'); }

    /* 1) Module dédié pdf.js (window.LabPDF) : bon de RDV vectoriel */
    if (window.LabPDF && typeof window.LabPDF.buildAppointmentVoucher === 'function') {
      try {
        let lab = null;
        try { lab = window.LabDB && LabDB.settings ? LabDB.settings.get() : null; } catch (e) { /* ignore */ }
        const blob = await window.LabPDF.buildAppointmentVoucher(payload, lab, currentLang === 'ar' ? 'ar' : 'fr');
        if (!blob) throw new Error('LabPDF a renvoyé un blob vide');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `Bon-RDV-${ref}.pdf`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        if (btn) { btn.innerHTML = label; btn.disabled = false; }
        return;
      } catch (err) {
        console.warn('LabPDF indisponible — repli html2canvas', err); // poursuit vers le repli ci-dessous
      }
    }

    /* 2) Repli : rendu html2canvas + jsPDF */
    const sheet = buildSheet(payload, ref);
    document.body.appendChild(sheet);
    let fallback = false;
    try {
      await ensurePdfLibs();
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await Promise.all([...sheet.querySelectorAll('img')].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; })));
      const canvas = await html2canvas(sheet, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
      const h = Math.min(297, canvas.height * 210 / canvas.width);
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, h);
      pdf.save(`Bon-RDV-${ref}.pdf`);
    } catch (err) {
      console.error('PDF', err);           // repli : impression navigateur -> « Enregistrer au format PDF »
      fallback = true;
      document.body.classList.add('printing-pdf');
      window.addEventListener('afterprint', () => { document.body.classList.remove('printing-pdf'); sheet.remove(); }, { once: true });
      window.print();
    } finally {
      if (!fallback) sheet.remove();
      if (btn) { btn.innerHTML = label; btn.disabled = false; }
    }
  };

  /* ---------- Test de connexion : ajoutez ?debug=1 à l'URL, ou tapez testBackend() dans la console ---------- */
  window.testBackend = async function () {
    let b = document.getElementById('debug-panel');
    if (!b) { b = document.createElement('div'); b.id = 'debug-panel'; document.body.appendChild(b); }
    b.textContent = 'Test du backend…';
    if (!isConfigured()) { b.textContent = '❌ appointmentEndpoint = PLACEHOLDER. Déployez apps-script.gs puis collez l’URL /exec dans CONFIG (voir README).'; return; }
    try {
      const j = JSON.parse(await (await fetch(CONFIG.appointmentEndpoint + '?action=ping')).text());
      b.textContent = j.status === 'success'
        ? `✅ Backend OK. Résultats PDF : ${j.resultsReady ? 'configurés' : 'NON configurés (lancez « Derdabi > Configurer » dans le Google Sheet)'}`
        : '❌ Réponse inattendue : ' + JSON.stringify(j);
    } catch (e) { b.textContent = '❌ Pas de réponse JSON. Vérifiez : URL se terminant par /exec, accès « Tout le monde », nouvelle version déployée.'; }
  };
  if (new URLSearchParams(location.search).get('debug') === '1') window.addEventListener('load', window.testBackend);
})();
