/**
 * Laboratoire Derdabi — Tétouan, Maroc
 * Script applicatif complet : Three.js ADN réactif, Lenis, i18n bilingue (FR/AR RTL),
 * Recherche d'analyses, Packs Check-up, Espace Résultats, Thème Sombre &
 * Wizard de Prise de Rendez-vous en 4 étapes avec intégration Google Apps Script.
 */

/* ==========================================================================
   BLOC CONFIG UNIQUE (Toutes les informations modifiables ici)
   ========================================================================== */
const CONFIG = {
  labName: "Laboratoire Derdabi",
  labSubtitle: "Biologie Médicale Spécialisée",
  city: "Tétouan, Maroc",
  address: "Avenue des FAR, Tétouan, Maroc",
  addressShort: "Avenue des FAR, Tétouan",
  phone: "05 00 05 55 05",
  phoneRaw: "+212500055505",
  whatsappNumber: "212648558366",
  whatsappDisplay: "06 48 55 83 66",
  // STRICTEMENT AUCUN EMAIL (selon consignes formelles)
  
  // Année d'ouverture (2009) -> Calcule dynamiquement les années d'expérience (17 ans en 2026)
  openingYear: 2009,

  // Capacité par créneau : gérée par LabDB.settings.get().slotCapacity (db.js)

  // Affichage des prix : false par défaut -> affiche "Prix sur demande" avec lien WhatsApp
  showPrices: false,

  // Section témoignages masquée par défaut conformément aux instructions
  showTestimonials: false,

  // Délai anti-spam minimal (en secondes)
  minFillTimeSeconds: 3,

  // Mode de débogage et vérification i18n désactivés par défaut en production
  debugI18n: false,
  debugMode: false,

  // URL canonique du site
  siteUrl: "https://laboratoirederdabi.ma",

  // Backend réseau optionnel : la démonstration utilise le stockage local LabDB
  appointmentEndpoint: "",

  // Chemins des médias et images
  assets: {
    logo: "assets/logo/logo.png",
    logoWhite: "assets/logo/logo-white.png",
    heroBg: "assets/img/hero-bg.webp",
    labInterior: "assets/img/lab-interior.webp",
    homeSampling: "assets/img/home-sampling.webp",
    tubes: "assets/img/tubes.webp",
    microscope: "assets/img/microscope.webp",
    ogImage: "assets/img/og-image.webp",
    pattern: "assets/img/pattern.webp"
  },

  // Configuration analytique respectueuse de la vie privée (sans cookies)
  analytics: {
    enabled: false,
    provider: "plausible",
    domain: ""
  },

  // Horaires et jours de fermeture : gérés par LabDB.settings.get()
  // (hoursWeekdays / hoursSaturday / closedDays — db.js)

  // Tarifs de déplacement à domicile (bilingue)
  homeSamplingRates: [
    {
      zone: { fr: "Tétouan centre", ar: "تطوان المركز" },
      rate: "30 DH",
      note: { fr: "Gratuit dès 300 DH d'analyses", ar: "مجاناً للتحاليل ابتداءً من 300 درهم" }
    },
    {
      zone: { fr: "Martil", ar: "مرتيل" },
      rate: "50 DH",
      note: { fr: "Sur rendez-vous", ar: "بموعد مسبق" }
    },
    {
      zone: { fr: "M'diq", ar: "المضيق" },
      rate: "70 DH",
      note: { fr: "Sur rendez-vous", ar: "بموعد مسبق" }
    },
    {
      zone: { fr: "Fnideq", ar: "الفنيدق" },
      rate: "80 DH",
      note: { fr: "Sur rendez-vous", ar: "بموعد مسبق" }
    },
    {
      zone: { fr: "Autres zones", ar: "مناطق أخرى" },
      rate: "Sur demande",
      note: { fr: "Contact via WhatsApp", ar: "تواصل عبر الواتساب" }
    }
  ],

  // Personas de démonstration (fictives) — à remplacer par l'équipe réelle avant publication
  team: [
    {
      name: "Dr. Samira El Fassi", /* Persona de démonstration — fictive */
      initials: "SF",
      title: {
        fr: "Pharmacien Biologiste, Directrice",
        ar: "صيدلانية إحيائية، المديرة الطبية"
      },
      desc: {
        fr: "Docteur en Pharmacie, spécialisée en biologie médicale et biochimie clinique.",
        ar: "دكتوراه في الصيدلة، متخصصة في البيولوجيا الطبية والكيمياء الحيوية السريرية."
      }
    },
    {
      name: "Dr. Youssef Zniber", /* Persona de démonstration — fictive */
      initials: "YZ",
      title: {
        fr: "Médecin Biologiste",
        ar: "طبيب إحيائي"
      },
      desc: {
        fr: "Spécialiste des hémopathies, cytologie sanguine et hémostase clinique.",
        ar: "متخصص في أمراض الدم، الفحص الخلوي وتخثر الدم السريري."
      }
    },
    {
      name: "Dr. Imane Bennani", /* Persona de démonstration — fictive */
      initials: "IB",
      title: {
        fr: "Biologiste Responsable Qualité",
        ar: "إحيائية مسؤولة الجودة"
      },
      desc: {
        fr: "Responsable du management de la qualité analytique et des cultures microbiologiques.",
        ar: "مسؤولة إدارة الجودة التحليلية والمزارع الميكروبيولوجية."
      }
    }
  ],

  // Base d'analyses pour la recherche instantanée (bilingue)
  analysesDatabase: [
    {
      id: "glycemie",
      name: { fr: "Glycémie à jeun", ar: "سكر الدم على الريق" },
      discipline: { fr: "Biochimie", ar: "الكيمياء الحيوية" },
      fasting: "yes",
      delay: { fr: "2 heures", ar: "ساعتان" },
      prep: { fr: "Jeûne strict de 10 à 12h (eau autorisée)", ar: "صيام صارم من 10 إلى 12 ساعة (الماء مسموح به)" },
      price: "50 DH"
    },
    {
      id: "nfs",
      name: { fr: "Numération Formule Sanguine (NFS)", ar: "تعداد الدم الكامل (NFS)" },
      discipline: { fr: "Hématologie", ar: "أمراض الدم" },
      fasting: "no",
      delay: { fr: "2 heures", ar: "ساعتان" },
      prep: { fr: "Pas de jeûne obligatoire", ar: "الصيام غير إلزامي" },
      price: "70 DH"
    },
    {
      id: "tsh",
      name: { fr: "TSH ultra-sensible (Thyroïde)", ar: "هرمون الغدة الدرقية (TSH)" },
      discipline: { fr: "Hormonologie", ar: "الهرمونات" },
      fasting: "no",
      delay: { fr: "3 heures", ar: "3 ساعات" },
      prep: { fr: "Prélèvement le matin recommandé", ar: "يُفضل أخذ العينة صباحاً" },
      price: "120 DH"
    },
    {
      id: "cholesterol",
      name: { fr: "Bilan Lipidique (Cholestérol & Triglycérides)", ar: "فحص الدهون والكوليسترول الشامل" },
      discipline: { fr: "Biochimie", ar: "الكيمياء الحيوية" },
      fasting: "yes",
      delay: { fr: "2 heures", ar: "ساعتان" },
      prep: { fr: "Jeûne strict de 12 heures", ar: "صيام صارم لمدة 12 ساعة" },
      price: "100 DH"
    },
    {
      id: "hba1c",
      name: { fr: "Hémoglobine Glyquée (HbA1c)", ar: "السكر التراكمي (HbA1c)" },
      discipline: { fr: "Biochimie", ar: "الكيمياء الحيوية" },
      fasting: "no",
      delay: { fr: "2 heures", ar: "ساعتان" },
      prep: { fr: "Reflet du diabète sur 3 mois", ar: "يعكس معدل السكر خلال 3 أشهر الماضية" },
      price: "90 DH"
    },
    {
      id: "uree_creat",
      name: { fr: "Bilan Rénal (Urée, Créatinine, DFG)", ar: "فحص وظائف الكلى (يوريا، كرياتينين)" },
      discipline: { fr: "Biochimie", ar: "الكيمياء الحيوية" },
      fasting: "no",
      delay: { fr: "2 heures", ar: "ساعتان" },
      prep: { fr: "Bien s'hydrater avant l'examen", ar: "شرب كمية كافية من الماء قبل الفحص" },
      price: "80 DH"
    },
    {
      id: "ecbu",
      name: { fr: "ECBU (Examen des urines + Antibiogramme)", ar: "فحص البول الجرثومي مع اختبار المضادات (ECBU)" },
      discipline: { fr: "Microbiologie", ar: "علم الأحياء الدقيقة" },
      fasting: "no",
      delay: { fr: "24 à 48 heures", ar: "24 إلى 48 ساعة" },
      prep: { fr: "Premières urines du matin au réveil", ar: "أول عينة بول في الصباح الباكر" },
      price: "110 DH"
    },
    {
      id: "tp_inr",
      name: { fr: "TP / INR (Coagulation sanguine)", ar: "اختبار تخثر الدم (TP / INR)" },
      discipline: { fr: "Hématologie", ar: "أمراض الدم" },
      fasting: "no",
      delay: { fr: "2 heures", ar: "ساعتان" },
      prep: { fr: "Signaler la prise d'anticoagulants", ar: "إبلاغ الممرض بالأدوية المسيلة للدم" },
      price: "60 DH"
    },
    {
      id: "vitamine_d",
      name: { fr: "Vitamine D (25-OH)", ar: "فيتامين د (25-OH)" },
      discipline: { fr: "Hormonologie", ar: "الهرمونات" },
      fasting: "no",
      delay: { fr: "4 heures", ar: "4 ساعات" },
      prep: { fr: "Pas de condition spécifique", ar: "لا توجد شروط خاصة" },
      price: "180 DH"
    },
    {
      id: "fer_ferritine",
      name: { fr: "Fer sérique & Ferritine", ar: "الحديد ومخزون الحديد (فيريتين)" },
      discipline: { fr: "Biochimie", ar: "الكيمياء الحيوية" },
      fasting: "yes",
      delay: { fr: "3 heures", ar: "3 ساعات" },
      prep: { fr: "Jeûne recommandé le matin", ar: "يُفضل الصيام صباحاً" },
      price: "130 DH"
    },
    {
      id: "hepatites",
      name: { fr: "Sérologies Hépatites B & C", ar: "أمصال التهاب الكبد الفيروسي (B & C)" },
      discipline: { fr: "Immunologie", ar: "علم المناعة" },
      fasting: "no",
      delay: { fr: "3 heures", ar: "3 ساعات" },
      prep: { fr: "Dépistage viral sécurisé", ar: "كشف فيروسي دقيق" },
      price: "150 DH"
    },
    {
      id: "psa",
      name: { fr: "PSA Total (Prostate)", ar: "دلالات البروستات (PSA Total)" },
      discipline: { fr: "Hormonologie", ar: "الهرمونات" },
      fasting: "no",
      delay: { fr: "3 heures", ar: "3 ساعات" },
      prep: { fr: "Éviter le vélo 48h avant", ar: "تجنب ركوب الدراجة 48 ساعة قبل الفحص" },
      price: "140 DH"
    }
  ],

  // Packs check-up préventifs (bilingue)
  packs: [
    {
      id: "pack-general",
      name: { fr: "Bilan de Santé Général", ar: "الفحص الصحي العام والشامل" },
      badge: { fr: "Recommandé", ar: "موصى به" },
      price: "290 DH",
      items: {
        fr: ["NFS complète", "Glycémie à jeun", "Cholestérol & Triglycérides", "Urée & Créatinine", "Bilan hépatique (Transaminases)"],
        ar: ["تعداد الدم الكامل (NFS)", "سكر الدم الصائم", "الكوليسترول والدهون الثلاثية", "اليوريا والكرياتينين (الكلى)", "وظائف الكبد (الإنزيمات)"]
      }
    },
    {
      id: "pack-diabete",
      name: { fr: "Pack Suivi Diabète", ar: "باقة متابعة مرض السكري" },
      badge: { fr: "Spécifique", ar: "مخصص" },
      price: "220 DH",
      items: {
        fr: ["Glycémie à jeun", "Hémoglobine glyquée (HbA1c)", "Microalbuminurie urinaire", "Bilan rénal (Créatinine)"],
        ar: ["سكر الدم على الريق", "السكر التراكمي (HbA1c)", "فحص الزلال بالبول", "وظائف الكلى (الكرياتينين)"]
      }
    },
    {
      id: "pack-thyroide",
      name: { fr: "Pack Thyroïde Complet", ar: "باقة فحص الغدة الدرقية" },
      badge: { fr: "Endocrino", ar: "هرموني" },
      price: "280 DH",
      items: {
        fr: ["TSH ultra-sensible", "T3 libre (FT3)", "T4 libre (FT4)", "Anticorps anti-TPO (si prescrit)"],
        ar: ["هرمون TSH الدقيق", "هرمون FT3 الحر", "هرمون FT4 الحر", "الأجسام المضادة (حسب الوصفة)"]
      }
    },
    {
      id: "pack-femme",
      name: { fr: "Bilan Vitalité Femme", ar: "باقة صحة وحيوية المرأة" },
      badge: { fr: "Check-up", ar: "فحص دوري" },
      price: "380 DH",
      items: {
        fr: ["NFS & Ferritine (dépistage anémie)", "Vitamine D", "Bilan lipidique & glycémique", "TSH thyroïdienne"],
        ar: ["تعداد الدم ومخزون الحديد (كشف فقر الدم)", "فيتامين د", "الدهون وسكر الدم", "فحص الغدة الدرقية TSH"]
      }
    },
    {
      id: "pack-sportif",
      name: { fr: "Bilan Sportif & Aptitude", ar: "باقة الرياضة واللياقة البدنية" },
      badge: { fr: "Performance", ar: "أداء رياضي" },
      price: "310 DH",
      items: {
        fr: ["NFS complète", "Ionogramme sanguin", "Bilan cardiaque (CPK, LDH)", "Créatinine & Urée", "Glycémie"],
        ar: ["تعداد الدم الشامل", "الأملاح والمعادن بالدم", "إنزيمات القلب والعضلات (CPK)", "الكلى والسكر"]
      }
    },
    {
      id: "pack-prenuptial",
      name: { fr: "Bilan Prénuptial Réglementaire", ar: "الفحص الطبي الإجباري للزواج" },
      badge: { fr: "Réglementaire", ar: "قانوني" },
      price: "350 DH",
      items: {
        fr: ["Groupage sanguin & Rhésus", "Sérologie Rubéole & Toxoplasmose", "Sérologie Syphilis (TPHA / VDRL)", "Électrophorèse de l'hémoglobine"],
        ar: ["فصيلة الدم وعامل ريسوس", "أمصال الحصبة الألمانية وداء المقوسات", "كشف داء الزهري (TPHA/VDRL)", "فحص خضاب الدم الوراثي"]
      }
    }
  ]
};

/* ==========================================================================
   ÉTAT GLOBAL & INITIALISATION
   ========================================================================== */
function getInitialLanguage() {
  try {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam === 'ar' || langParam === 'fr') {
      return langParam;
    }
  } catch (e) {
    // ignore
  }
  const saved = localStorage.getItem('lab_derdabi_lang');
  if (saved === 'ar' || saved === 'fr') {
    return saved;
  }
  return 'fr';
}

let currentLang = getInitialLanguage();
let currentTheme = localStorage.getItem('lab_derdabi_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
let lenisInstance = null;
let threeDnaApp = null;
let currentWizardStep = 1;
let wizardFormStartTime = Date.now();

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initDynamicExperience();
  initImageFallbacks();
  initLenisSmoothScroll();
  initNavbar();
  initThreeJsDna();
  initAnalysisSearch();
  initPacksSection();
  initHomeRatesTable();
  initDisciplinesModal();
  initResultsPortal();
  initContactMessageForm();
  initAppointmentWizard();
  initFaqAccordion();
  initTestimonialsVisibility();
  if (window.LabDB) LabDB.pageViews.track();

  if (CONFIG.debugI18n) {
    checkI18nDebug();
  }
});

/* ==========================================================================
   HELPER DE TRADUCTION t(key, params)
   ========================================================================== */
function t(key, params = {}) {
  const dict = I18N[currentLang] || I18N.fr;
  let str = (dict && dict[key] !== undefined) ? dict[key] : (I18N.fr && I18N.fr[key] !== undefined ? I18N.fr[key] : key);
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return str;
}

/* ==========================================================================
   GESTION DU THÈME CLAIR / SOMBRE
   ========================================================================== */
function initTheme() {
  // Appel initial sans persistance : la préférence système reste vivante
  setTheme(currentTheme, false);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(newTheme, true);
    });
  }

  // Écoute des préférences système si non forcé par l'utilisateur
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('lab_derdabi_theme')) {
        setTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }
}

function setTheme(theme, persist = true) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (persist) {
    localStorage.setItem('lab_derdabi_theme', theme);
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeText = document.getElementById('theme-toggle-text');
  if (themeBtn) {
    themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  if (themeText) {
    themeText.textContent = theme === 'dark' ? t('themeToggleLight') : t('themeToggleDark');
  }

  // Notifie Three.js de la modification de thème sans recréer la scène
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/* ==========================================================================
   GESTION DE LA LANGUE & RTL
   ========================================================================== */
function initLanguage() {
  applyLanguage(currentLang);

  document.querySelectorAll('.lang-switcher-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextLang = currentLang === 'fr' ? 'ar' : 'fr';
      applyLanguage(nextLang);
    });
  });
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lab_derdabi_lang', lang);

  // Synchronisation avec l'URL (?lang=) sans recharger
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== lang) {
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  } catch (e) {
    // ignore
  }

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Mise à jour de tous les éléments data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    // Si l'élément contient des enfants (SVG, spans), ne jamais écraser par textContent
    if (el.children.length === 0) {
      el.textContent = translated;
    } else {
      // Met à jour uniquement le premier span interne dédié
      const innerSpan = el.querySelector(':scope > span:not([aria-hidden])');
      if (innerSpan) {
        innerSpan.textContent = translated;
      } else {
        // Préserve les SVGs en ne modifiant que les nœuds texte directs
        for (let node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
            node.nodeValue = ` ${translated} `;
            break;
          }
        }
      }
    }
  });

  // Titre de page traduit (index)
  document.title = t('pageTitle');

  // Mise à jour des placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });

  // Mise à jour des aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    el.setAttribute('aria-label', t(key));
  });

  // Mise à jour des attributs title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', t(key));
  });

  // Mise à jour des attributs alt
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    el.setAttribute('alt', t(key));
  });

  // Mise à jour du texte de bascule de thème
  const themeText = document.getElementById('theme-toggle-text');
  if (themeText) {
    themeText.textContent = currentTheme === 'dark' ? t('themeToggleLight') : t('themeToggleDark');
  }

  // Re-génération des composants dynamiques
  renderAnalysisSearch();
  renderPacks();
  renderHomeRates();
  renderTeam();
  updateExperienceStats();
  updateHomeRateNotice();
  renderSlotsForCurrentDate();
}

/* ==========================================================================
   IMAGE FALLBACK HANDLER (Zéro espace vide ou image brisée)
   ========================================================================== */
function initImageFallbacks() {
  document.querySelectorAll('img[data-img-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      const frame = img.closest('.img-frame') || img.parentElement;
      if (frame) {
        frame.classList.add('img-failed');
      }
    });
  });
}

/* ==========================================================================
   ANNÉES D'EXPÉRIENCE DYNAMIQUES
   ========================================================================== */
function initDynamicExperience() {
  updateExperienceStats();
}

function updateExperienceStats() {
  const currentYear = new Date().getFullYear();
  const years = currentYear - CONFIG.openingYear;
  const statEl = document.getElementById('stat-years-exp');
  if (statEl) {
    statEl.textContent = years;
  }
  const badgeEl = document.getElementById('stat-years-badge');
  if (badgeEl) badgeEl.textContent = years;
}

/* ==========================================================================
   SMOOTH SCROLL (LENIS VIA JSDELIVR PINNED)
   ========================================================================== */
function initLenisSmoothScroll() {
  if (typeof window.Lenis === 'undefined') return;

  try {
    lenisInstance = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    function raf(time) {
      if (lenisInstance) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
    }
    requestAnimationFrame(raf);

    // Synchronisation avec GSAP ScrollTrigger si présent
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  } catch (err) {
    console.warn("Lenis initialization skipped:", err);
  }
}

/* ==========================================================================
   NAVBAR & MENU MOBILE
   ========================================================================== */
function initNavbar() {
  const menuBtn = document.getElementById('menu-toggle-btn');
  const navLinks = document.getElementById('main-nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Liens d'ancrage avec défilement fluide
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(target, { offset: -70 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   THREE.JS : DOUBLE HÉLICE ADN 3D GLASS / GLOW (AVEC EVENT THEMECHANGE)
   ========================================================================== */
function initThreeJsDna() {
  const container = document.getElementById('dna-container');
  const canvas = document.getElementById('dna-canvas');
  const fallback = document.getElementById('dna-fallback');

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSaveData = navigator.connection && navigator.connection.saveData;

  if (!container || !canvas || typeof THREE === 'undefined' || prefersReducedMotion || isSaveData) {
    if (fallback) fallback.classList.add('active');
    return;
  }

  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x67E8F9, 1.4);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x14B8A6, 1.2, 50);
    pointLight.position.set(-10, -10, 10);
    scene.add(pointLight);

    // Groupe ADN
    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Matériaux réactifs au thème
    const isDark = currentTheme === 'dark';
    const strand1Material = new THREE.MeshPhongMaterial({
      color: isDark ? 0x2DD4BF : 0x0E8F8A,
      emissive: isDark ? 0x0D9488 : 0x044E4A,
      shininess: 90,
      transparent: true,
      opacity: 0.92
    });

    const strand2Material = new THREE.MeshPhongMaterial({
      color: isDark ? 0x38BDF8 : 0x3BA7F5,
      emissive: isDark ? 0x0284C7 : 0x0C4A6E,
      shininess: 90,
      transparent: true,
      opacity: 0.92
    });

    const rungMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x7EE2C8 : 0x94A3B8,
      transparent: true,
      opacity: 0.55
    });

    // Construction de la double hélice
    const nodeCount = 38;
    const radius = 3.6;
    const heightSpan = 22;
    const twistFactor = 0.32;
    const sphereGeo = new THREE.SphereGeometry(0.38, 16, 16);

    for (let i = 0; i < nodeCount; i++) {
      const tNorm = i / (nodeCount - 1);
      const y = (tNorm - 0.5) * heightSpan;
      const angle = i * twistFactor;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const node1 = new THREE.Mesh(sphereGeo, strand1Material);
      node1.position.set(x1, y, z1);
      dnaGroup.add(node1);

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      const node2 = new THREE.Mesh(sphereGeo, strand2Material);
      node2.position.set(x2, y, z2);
      dnaGroup.add(node2);

      // Barre de liaison tous les 2 nœuds
      if (i % 2 === 0) {
        const rungPoints = [new THREE.Vector3(x1, y, z1), new THREE.Vector3(x2, y, z2)];
        const rungGeo = new THREE.BufferGeometry().setFromPoints(rungPoints);
        const rung = new THREE.Line(rungGeo, rungMaterial);
        dnaGroup.add(rung);
      }
    }

    // Particules flottantes d'ambiance
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 32;
      particlePositions[i + 1] = (Math.random() - 0.5) * 28;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0x67E8F9 : 0x0E8F8A,
      size: 0.22,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Parallaxe souris et défilement
    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let scrollRot = 0;
    let isIntersecting = true;
    let isTabVisible = !document.hidden;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 1.2;
    });

    window.addEventListener('scroll', () => {
      scrollRot = window.scrollY * 0.002;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
    });

    // Pause du rendu quand le canvas est hors écran
    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    // Adaptation des matériaux au changement de thème SANS recréer la scène
    document.addEventListener('themechange', (e) => {
      const dark = e.detail.theme === 'dark';
      strand1Material.color.setHex(dark ? 0x2DD4BF : 0x0E8F8A);
      strand1Material.emissive.setHex(dark ? 0x0D9488 : 0x044E4A);
      strand2Material.color.setHex(dark ? 0x38BDF8 : 0x3BA7F5);
      strand2Material.emissive.setHex(dark ? 0x0284C7 : 0x0C4A6E);
      rungMaterial.color.setHex(dark ? 0x7EE2C8 : 0x94A3B8);
      particleMat.color.setHex(dark ? 0x67E8F9 : 0x0E8F8A);
      ambientLight.intensity = dark ? 0.95 : 0.85;
    });

    // Boucle d'animation
    function animate() {
      requestAnimationFrame(animate);
      if (!isIntersecting || !isTabVisible) return;

      targetRotY = mouseX * 0.4 + scrollRot;
      targetRotX = mouseY * 0.25;

      dnaGroup.rotation.y += 0.008;
      dnaGroup.rotation.x += (targetRotX - dnaGroup.rotation.x) * 0.05;
      dnaGroup.rotation.y += (targetRotY - dnaGroup.rotation.y) * 0.05;

      particles.rotation.y += 0.002;

      renderer.render(scene, camera);
    }
    animate();

    // Redimensionnement
    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    threeDnaApp = { scene, renderer, camera };
  } catch (err) {
    console.warn("WebGL initialization failed:", err);
    if (fallback) fallback.style.display = 'flex';
  }
}

/* ==========================================================================
   2. RECHERCHE D'ANALYSES
   ========================================================================== */
function initAnalysisSearch() {
  const input = document.getElementById('analysis-search-input');
  if (input) {
    input.addEventListener('input', () => {
      renderAnalysisSearch();
    });
  }
  renderAnalysisFilterPills();
  renderAnalysisSearch();
}

let activeDisciplineFilter = "all";

function renderAnalysisFilterPills() {
  const container = document.getElementById('discipline-filter-pills');
  if (!container) return;

  const disciplines = ["all", "Biochimie", "Hématologie", "Hormonologie", "Microbiologie", "Immunologie"];
  container.innerHTML = "";

  disciplines.forEach(disc => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `filter-pill ${activeDisciplineFilter === disc ? 'active' : ''}`;
    
    let label = disc;
    if (disc === 'all') {
      label = t('filterAll');
    } else {
      label = currentLang === 'ar' ? getDisciplineArName(disc) : disc;
    }
    btn.textContent = label;

    btn.addEventListener('click', () => {
      activeDisciplineFilter = disc;
      renderAnalysisFilterPills();
      renderAnalysisSearch();
    });

    container.appendChild(btn);
  });
}

function getDisciplineArName(discFr) {
  const map = {
    "Biochimie": "الكيمياء الحيوية",
    "Hématologie": "أمراض الدم",
    "Hormonologie": "الهرمونات",
    "Microbiologie": "الأحياء الدقيقة",
    "Immunologie": "المناعة والأمصال"
  };
  return map[discFr] || discFr;
}

function renderAnalysisSearch() {
  const tbody = document.getElementById('analyses-table-body');
  const input = document.getElementById('analysis-search-input');
  if (!tbody) return;

  const query = (input ? input.value : "").trim().toLowerCase();
  tbody.innerHTML = "";

  const filtered = CONFIG.analysesDatabase.filter(item => {
    const nameFr = item.name.fr.toLowerCase();
    const nameAr = item.name.ar.toLowerCase();
    const discFr = item.discipline.fr.toLowerCase();
    const discAr = item.discipline.ar.toLowerCase();

    const matchesQuery = !query || nameFr.includes(query) || nameAr.includes(query) || discFr.includes(query) || discAr.includes(query);
    const matchesFilter = activeDisciplineFilter === 'all' || item.discipline.fr.toLowerCase() === activeDisciplineFilter.toLowerCase();

    return matchesQuery && matchesFilter;
  });

  if (filtered.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" class="text-center table-empty-message">${t('noResultsFound')}</td>`;
    tbody.appendChild(tr);
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    const name = currentLang === 'ar' ? item.name.ar : item.name.fr;
    const prep = currentLang === 'ar' ? item.prep.ar : item.prep.fr;
    const disc = currentLang === 'ar' ? item.discipline.ar : item.discipline.fr;
    const delay = currentLang === 'ar' ? item.delay.ar : item.delay.fr;
    const fastingBadgeClass = item.fasting === 'yes' ? 'fasting-yes' : 'fasting-no';
    const fastingLabel = item.fasting === 'yes' ? t('fastingYes') : t('fastingNo');

    tr.innerHTML = `
      <td class="analysis-name-cell">
        <strong>${name}</strong>
        <span class="analysis-prep-note">${prep}</span>
      </td>
      <td>
        <span class="discipline-badge">${disc}</span>
      </td>
      <td>
        <span class="fasting-badge ${fastingBadgeClass}">
          ${fastingLabel}
        </span>
      </td>
      <td>
        <span>${delay}</span>
      </td>
      <td class="text-center">
        <button type="button" class="btn btn-primary btn-sm btn-select-analysis" data-analysis-name="${name}">
          <span>${t('btnBookThisTest')}</span>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Liaison bouton "Réserver" pour pré-remplir l'étape 1 du Wizard
  tbody.querySelectorAll('.btn-select-analysis').forEach(btn => {
    btn.addEventListener('click', function() {
      const testName = this.getAttribute('data-analysis-name');
      const wizardInput = document.getElementById('custom-analysis-select');
      if (wizardInput) {
        wizardInput.value = testName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        if (lenisInstance) {
          lenisInstance.scrollTo(contactSection, { offset: -70 });
        } else {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   4. PACKS CHECK-UP
   ========================================================================== */
function initPacksSection() {
  renderPacks();
}

function renderPacks() {
  const container = document.getElementById('packs-container');
  if (!container) return;

  container.innerHTML = "";

  CONFIG.packs.forEach(pack => {
    const card = document.createElement('div');
    card.className = 'pack-card';

    const name = currentLang === 'ar' ? pack.name.ar : pack.name.fr;
    const badge = currentLang === 'ar' ? pack.badge.ar : pack.badge.fr;
    const items = currentLang === 'ar' ? pack.items.ar : pack.items.fr;

    // Affichage prix ou "Prix sur demande"
    let priceHtml = '';
    if (CONFIG.showPrices) {
      priceHtml = `<div class="pack-price-box"><strong class="pack-price-value">${pack.price}</strong></div>`;
    } else {
      priceHtml = `
        <div class="pack-price-box">
          <span class="price-on-request-pill">${t('priceOnRequest')}</span>
        </div>
      `;
    }

    const itemsHtml = items.map(it => `
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${it}</span>
      </li>
    `).join('');

    card.innerHTML = `
      <div>
        <span class="pack-badge">${badge}</span>
        <h3>${name}</h3>
        ${priceHtml}
        <ul class="pack-items-list">
          ${itemsHtml}
        </ul>
      </div>
      <button type="button" class="btn btn-secondary btn-full btn-select-pack" data-pack-name="${name}">
        <span>${t('btnBookPack')}</span>
      </button>
    `;

    container.appendChild(card);
  });

  // Liaison bouton "Réserver ce pack" pour pré-remplir l'étape 1 du Wizard
  container.querySelectorAll('.btn-select-pack').forEach(btn => {
    btn.addEventListener('click', function() {
      const packName = this.getAttribute('data-pack-name');
      const wizardInput = document.getElementById('custom-analysis-select');
      if (wizardInput) {
        wizardInput.value = packName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        if (lenisInstance) {
          lenisInstance.scrollTo(contactSection, { offset: -70 });
        } else {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   6. PRÉLÈVEMENT À DOMICILE & TARIFS
   ========================================================================== */
function initHomeRatesTable() {
  renderHomeRates();

  const directBtn = document.getElementById('btn-home-sampling-direct');
  if (directBtn) {
    directBtn.addEventListener('click', () => {
      // Pré-sélectionne le mode domicile dans le wizard
      const homeRadio = document.querySelector('input[name="wizardLocation"][value="domicile"]');
      if (homeRadio) {
        homeRadio.checked = true;
        const homeFields = document.getElementById('wizard-home-fields');
        if (homeFields) homeFields.style.display = 'block';
      }
      goToWizardStep(2);

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        if (lenisInstance) {
          lenisInstance.scrollTo(contactSection, { offset: -70 });
        } else {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}

function renderHomeRates() {
  const tbody = document.getElementById('home-rates-table-body');
  if (!tbody) return;

  tbody.innerHTML = "";

  CONFIG.homeSamplingRates.forEach((item, index) => {
    const tr = document.createElement('tr');
    const zoneName = currentLang === 'ar' ? item.zone.ar : item.zone.fr;
    const note = currentLang === 'ar' ? item.note.ar : item.note.fr;

    const isTetouan = index === 0;
    const freeNoticeHtml = isTetouan ? `<div class="free-zone-pill">${t('homeFreeNotice')}</div>` : '';

    tr.innerHTML = `
      <td>
        <strong>${zoneName}</strong>
        ${freeNoticeHtml}
      </td>
      <td class="rate-amount"><bdi class="bidi-isolate">${item.rate}</bdi></td>
    `;

    tbody.appendChild(tr);
  });
}

function updateHomeRateNotice() {
  const select = document.getElementById('wizard-zone-select');
  const noticeEl = document.getElementById('wizard-zone-rate-notice');
  if (!select || !noticeEl) return;

  const val = select.value;
  if (val === 'Tétouan centre') {
    noticeEl.textContent = currentLang === 'ar' 
      ? "واجب التنقل التقديري : 30 درهم (مجاناً للتحاليل التي تفوق 300 درهم)" 
      : "Tarif estimé : 30 DH (Gratuit dès 300 DH d'analyses)";
  } else if (val === 'Martil') {
    noticeEl.textContent = currentLang === 'ar' ? "واجب التنقل التقديري : 50 درهم" : "Tarif estimé : 50 DH";
  } else if (val === 'M\'diq') {
    noticeEl.textContent = currentLang === 'ar' ? "واجب التنقل التقديري : 70 درهم" : "Tarif estimé : 70 DH";
  } else if (val === 'Fnideq') {
    noticeEl.textContent = currentLang === 'ar' ? "واجب التنقل التقديري : 80 درهم" : "Tarif estimé : 80 DH";
  } else {
    noticeEl.textContent = currentLang === 'ar' ? "واجب التنقل : على الطلب عبر الواتساب" : "Tarif déplacement : Sur demande via WhatsApp";
  }
}

/* ==========================================================================
   8. ÉQUIPE
   ========================================================================== */
function createTeamAvatarSvg(initials) {
  return `
    <svg class="team-avatar-svg" viewBox="0 0 68 68" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="grad-${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0D9488"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
      </defs>
      <rect width="68" height="68" rx="34" fill="url(#grad-${initials})"/>
      <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>
  `;
}

function renderTeam() {
  const container = document.getElementById('team-cards-container');
  if (!container) return;

  container.innerHTML = "";

  CONFIG.team.forEach(member => {
    const card = document.createElement('div');
    card.className = 'team-card';

    const title = currentLang === 'ar' ? member.title.ar : member.title.fr;
    const desc = currentLang === 'ar' ? member.desc.ar : member.desc.fr;
    const avatarSvg = createTeamAvatarSvg(member.initials || "LD");

    card.innerHTML = `
      <div class="team-avatar" aria-hidden="true">
        ${avatarSvg}
      </div>
      <h3>${member.name}</h3>
      <div class="team-role">${title}</div>
      <p class="team-bio">${desc}</p>
    `;

    container.appendChild(card);
  });
}

/* ==========================================================================
   MODALES : OUVERTURE/FERMETURE ACCESSIBLE + FOCUS TRAP (Tab / Échap)
   ========================================================================== */
const MODAL_FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initModalFocusTrap(modal) {
  if (!modal || modal.__focusTrapReady) return;
  modal.__focusTrapReady = true;

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModalAccessible(modal);
      return;
    }
    if (e.key !== 'Tab') return;

    const focusables = Array.from(modal.querySelectorAll(MODAL_FOCUSABLE_SELECTOR))
      .filter(el => el.offsetParent !== null);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === modal)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

function openModalAccessible(modal) {
  if (!modal) return;
  modal.__lastFocused = document.activeElement;
  modal.classList.add('active');
  initModalFocusTrap(modal);
  const first = modal.querySelector(MODAL_FOCUSABLE_SELECTOR);
  if (first && typeof first.focus === 'function') first.focus();
}

function closeModalAccessible(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  const previous = modal.__lastFocused;
  if (previous && typeof previous.focus === 'function') previous.focus();
  modal.__lastFocused = null;
}

/* ==========================================================================
   MODALE DÉTAILS DISCIPLINE
   ========================================================================== */
function initDisciplinesModal() {
  const modal = document.getElementById('discipline-modal');
  const titleEl = document.getElementById('discipline-modal-title');
  const contentEl = document.getElementById('discipline-modal-content');
  if (!modal) return;

  document.querySelectorAll('.bento-card[data-discipline]').forEach(card => {
    card.addEventListener('click', () => {
      const discKey = card.getAttribute('data-discipline');
      let titleKey = 'disc1Title';
      let descKey = 'disc1Details';

      switch (discKey) {
        case 'biochimie': titleKey = 'disc1Title'; descKey = 'disc1Details'; break;
        case 'hematologie': titleKey = 'disc2Title'; descKey = 'disc2Details'; break;
        case 'hormonologie': titleKey = 'disc3Title'; descKey = 'disc3Details'; break;
        case 'microbiologie': titleKey = 'disc4Title'; descKey = 'disc4Details'; break;
        case 'immunologie': titleKey = 'disc5Title'; descKey = 'disc5Details'; break;
        case 'bilans': titleKey = 'disc6Title'; descKey = 'disc6Details'; break;
      }

      if (titleEl) titleEl.textContent = t(titleKey);
      if (contentEl) contentEl.innerHTML = `<p class="modal-prose">${t(descKey)}</p>`;

      openModalAccessible(modal);
    });
  });

  modal.querySelectorAll('.close-modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModalAccessible(modal);
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalAccessible(modal);
  });
}

/* ==========================================================================
   7. ESPACE RÉSULTATS (GESTION BIENTÔT DISPONIBLE & MODE DÉMO)
   ========================================================================== */
function resultErrorMessage(result) {
  if (!result) return t('resErrGeneric');
  if (result.code === 'locked' || result.code === 'too_many') return t('resErrRate');
  if (result.code === 'expired') return t('resErrExpired');
  if (result.code === 'invalid' || result.code === 'not_found') return t('resErrNotFound');
  return result.message || t('resErrGeneric');
}

function showResultsMessage(form, text, isError) {
  let box = document.getElementById('portal-live-msg');
  if (!box) {
    box = document.createElement('div');
    box.id = 'portal-live-msg';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    form.insertAdjacentElement('afterend', box);
  }
  box.className = 'portal-live-msg' + (isError ? ' is-error' : ' is-ok');
  box.textContent = text;
  return box;
}

function downloadBlobFile(blob, filename) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'resultats.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function openResultModal(dossier) {
  const modal = document.getElementById('results-demo-modal');
  if (!modal) return;
  document.getElementById('demo-res-dossier').textContent = dossier.id;
  document.getElementById('demo-res-date').textContent = dossier.publishedAt
    ? new Date(dossier.publishedAt).toLocaleDateString(currentLang === 'ar' ? 'ar-MA' : 'fr-FR')
    : '—';
  const patientEl = document.getElementById('demo-res-patient');
  if (patientEl) patientEl.textContent = dossier.patientName || '—';
  const titleEl = document.getElementById('modal-res-title');
  if (titleEl) titleEl.textContent = t('modalResTitle');

  const downloadPdfBtn = document.getElementById('btn-download-pdf-demo');
  if (downloadPdfBtn) {
    downloadPdfBtn.disabled = false;
    downloadPdfBtn.onclick = async () => {
      const original = downloadPdfBtn.innerHTML;
      downloadPdfBtn.disabled = true;
      downloadPdfBtn.textContent = t('modalResDownloading');
      try {
        let blob = await LabDB.dossiers.getPdf(dossier.id);
        // Dossier réel sans PDF téléversé : on préfère le rapport A4 généré
        // depuis les résultats réellement saisis (jamais de données inventées).
        if (!blob && !dossier.demo && window.LabPDF && typeof window.LabPDF.buildResultReport === 'function') {
          try {
            blob = await window.LabPDF.buildResultReport(dossier, LabDB.settings.get(), 'fr');
          } catch (e) { console.warn('LabPDF indisponible — repli PDF démo', e); }
        }
        if (!blob) throw new Error('PDF indisponible');
        downloadBlobFile(blob, 'Resultats-' + dossier.id + '.pdf');
        downloadPdfBtn.textContent = t('modalResDownloaded');
      } catch (err) {
        downloadPdfBtn.textContent = t('resErrGeneric');
      }
      setTimeout(() => {
        downloadPdfBtn.innerHTML = original;
        downloadPdfBtn.disabled = false;
      }, 2200);
    };
  }
  openModalAccessible(modal);
}

function initResultsPortal() {
  updateResultsPortalView();

  const form = document.getElementById('results-portal-form');
  const demoModal = document.getElementById('results-demo-modal');
  if (form && demoModal) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dossierEl = document.getElementById('portal-dossier-num');
      const codeEl = document.getElementById('portal-code-num');
      const dossierNum = dossierEl.value.trim().toUpperCase();
      const codeNum = codeEl.value.trim().toUpperCase();
      clearFieldErrors();
      if (!dossierNum) { showFieldError(dossierEl, 'errorRequiredField'); return; }
      if (!codeNum) { showFieldError(codeEl, 'errorRequiredField'); return; }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = t('resChecking');
      showResultsMessage(form, '', false);
      const box = document.getElementById('portal-live-msg');
      if (box) box.className = 'portal-live-msg hidden';

      await new Promise(resolve => setTimeout(resolve, 250));
      let result;
      try {
        result = LabDB.dossiers.verify(dossierNum, codeNum);
      } catch (err) {
        result = { ok: false, code: 'error', message: t('resErrGeneric') };
      }
      btn.innerHTML = original;
      btn.disabled = false;

      if (result.ok) {
        showResultsMessage(form, t('modalResDownload') + ' — ' + result.dossier.id, false);
        openResultModal(result.dossier);
      } else {
        showResultsMessage(form, resultErrorMessage(result), true);
      }
    });

    demoModal.querySelectorAll('.close-modal-trigger').forEach(btn => {
      btn.addEventListener('click', () => closeModalAccessible(demoModal));
    });
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModalAccessible(demoModal);
    });
  }
}

function updateResultsPortalView() {
  const demoView = document.getElementById('portal-demo-view');
  if (!demoView) return;
  demoView.classList.remove('hidden');
  const d = document.getElementById('portal-dossier-num');
  const c = document.getElementById('portal-code-num');
  if (d && !d.value) d.value = 'D26-0001';
  if (c && !c.value) c.value = 'DEMO01';
}

/* ==========================================================================
   11. FAQ ACCORDÉON
   ========================================================================== */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Ferme les autres items
        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            const otherAns = other.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });
}

function initTestimonialsVisibility() {
  const section = document.getElementById('temoignages');
  if (section) {
    if (CONFIG.showTestimonials) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  }
}

/* ==========================================================================
   WIZARD DE RENDEZ-VOUS EN 4 ÉTAPES (AVEC INTÉGRATION SÉCURISÉE GOOGLE APPS SCRIPT)
   ========================================================================== */
function initContactMessageForm() {
  const form = document.getElementById('contact-message-form');
  const statusEl = document.getElementById('contact-message-status');
  const submitBtn = document.getElementById('contact-message-submit');
  if (!form || !statusEl || !submitBtn) return;

  function setStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || t('contactSubjectDefault');
    const body = document.getElementById('contact-message').value.trim();
    if (name.length < 2 || body.length < 5) {
      setStatus(t('contactError'), true);
      return;
    }
    // Téléphone optionnel : validé uniquement s'il est renseigné (même regex que le wizard)
    if (phone) {
      const phoneVal = phone.replace(/[\s\-\.\(\)]/g, '');
      const phoneRegex = /^(?:(?:\+212)|(?:00212)|0)[5-7]\d{8}$/;
      if (!phoneRegex.test(phoneVal)) {
        showFieldError(document.getElementById('contact-phone'), 'errorInvalidPhone');
        return;
      }
    }
    if (!window.LabDB) {
      setStatus(t('contactError'), true);
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = t('contactSending');
    const result = window.LabDB.messages.create({ name: name, phone: phone, subject: subject, body: body });
    submitBtn.disabled = false;
    submitBtn.textContent = t('contactSend');
    if (!result.ok) {
      setStatus(result.message || t('contactError'), true);
      return;
    }
    form.reset();
    setStatus(t('contactSuccess'), false);
  });
}

/* Helpers locaux : date AAAA-MM-JJ en heure locale + jours de fermeture (LabDB) */
function ymdLocal(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getClosedDays() {
  try {
    if (window.LabDB && LabDB.settings && typeof LabDB.settings.get === 'function') {
      const s = LabDB.settings.get();
      if (s && Array.isArray(s.closedDays) && s.closedDays.length > 0) return s.closedDays;
    }
  } catch (e) {
    // ignore
  }
  return [0]; // Dimanche fermé par défaut
}

function initAppointmentWizard() {
  const form = document.getElementById('appointment-wizard-form');
  const btnPrev = document.getElementById('wizard-btn-prev');
  const btnNext = document.getElementById('wizard-btn-next');
  const btnConfirm = document.getElementById('wizard-btn-confirm');
  const dateInput = document.getElementById('wizard-date');
  const zoneSelect = document.getElementById('wizard-zone-select');

  // Initialisation date minimale (aujourd'hui) et maximale (+60 jours) en heure locale
  if (dateInput) {
    const today = new Date();
    dateInput.min = ymdLocal(today);

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);
    dateInput.max = ymdLocal(maxDate);

    // Fixe la date de demain par défaut si aujourd'hui est un jour fermé
    const defaultDate = new Date();
    if (getClosedDays().includes(defaultDate.getDay())) {
      defaultDate.setDate(defaultDate.getDate() + 1);
    }
    dateInput.value = ymdLocal(defaultDate);

    dateInput.addEventListener('change', () => {
      clearFieldErrors();
      // Un créneau choisi ne doit jamais survivre à un changement de date
      const slotHiddenInput = document.getElementById('wizard-selected-slot');
      if (slotHiddenInput) slotHiddenInput.value = '';
      document.querySelectorAll('#wizard-slots-container .slot-btn.active')
        .forEach(btn => btn.classList.remove('active'));
      renderSlotsForCurrentDate();
    });
  }

  // Bascule lieu : Laboratoire vs Domicile
  document.querySelectorAll('input[name="wizardLocation"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const homeFields = document.getElementById('wizard-home-fields');
      if (homeFields) {
        homeFields.style.display = e.target.value === 'domicile' ? 'block' : 'none';
      }
      clearFieldErrors();
    });
  });

  // Mise à jour du tarif de zone
  if (zoneSelect) {
    zoneSelect.addEventListener('change', updateHomeRateNotice);
    updateHomeRateNotice();
  }

  // Navigation Étape Précédente
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentWizardStep > 1) {
        goToWizardStep(currentWizardStep - 1);
      }
    });
  }

  // Navigation Étape Suivante
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateWizardStep(currentWizardStep)) {
        goToWizardStep(currentWizardStep + 1);
      }
    });
  }

  // Clic direct sur les nœuds indicateurs d'étape
  document.querySelectorAll('.wizard-node').forEach(node => {
    node.addEventListener('click', function() {
      const targetStep = parseInt(this.getAttribute('data-step'), 10);
      if (targetStep < currentWizardStep) {
        goToWizardStep(targetStep);
      } else if (targetStep > currentWizardStep) {
        // Valide les étapes intermédiaires
        let canAdvance = true;
        for (let s = currentWizardStep; s < targetStep; s++) {
          if (!validateWizardStep(s)) {
            canAdvance = false;
            break;
          }
        }
        if (canAdvance) {
          goToWizardStep(targetStep);
        }
      }
    });
  });

  // Soumission finale du rendez-vous
  if (form) {
    form.addEventListener('submit', handleWizardFormSubmit);
  }

  // Rendu initial des créneaux
  renderSlotsForCurrentDate();
}

function goToWizardStep(stepNumber) {
  currentWizardStep = stepNumber;
  clearFieldErrors();

  // Mise à jour des nœuds indicateurs
  document.querySelectorAll('.wizard-node').forEach(node => {
    const s = parseInt(node.getAttribute('data-step'), 10);
    node.classList.remove('active', 'completed');
    if (s === stepNumber) {
      node.classList.add('active');
    } else if (s < stepNumber) {
      node.classList.add('completed');
    }
  });

  // Affichage du bon panneau
  document.querySelectorAll('.wizard-panel').forEach(panel => {
    const s = parseInt(panel.getAttribute('data-step'), 10);
    if (s === stepNumber) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Gestion des boutons
  const btnPrev = document.getElementById('wizard-btn-prev');
  const btnNext = document.getElementById('wizard-btn-next');
  const btnConfirm = document.getElementById('wizard-btn-confirm');

  if (btnPrev) {
    btnPrev.classList.toggle('hidden', stepNumber === 1);
  }

  if (btnNext) {
    btnNext.classList.toggle('hidden', stepNumber === 4);
  }

  if (btnConfirm) {
    btnConfirm.classList.toggle('hidden', stepNumber !== 4);
  }
}

function validateWizardStep(step) {
  clearFieldErrors();
  let valid = true;

  if (step === 1) {
    const analysisInput = document.getElementById('custom-analysis-select');
    if (!analysisInput.value.trim()) {
      showFieldError(analysisInput, 'errorRequiredField');
      valid = false;
    }
  } else if (step === 2) {
    const isHome = document.querySelector('input[name="wizardLocation"]:checked').value === 'domicile';
    if (isHome) {
      const addressInput = document.getElementById('wizard-address');
      if (!addressInput.value.trim()) {
        showFieldError(addressInput, 'errorRequiredField');
        valid = false;
      }
    }
  } else if (step === 3) {
    const dateInput = document.getElementById('wizard-date');
    const slotInput = document.getElementById('wizard-selected-slot');

    if (!dateInput.value) {
      showFieldError(dateInput, 'errorInvalidDate');
      valid = false;
    } else {
      const selectedDate = new Date(dateInput.value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const closedDays = getClosedDays();
      if (selectedDate < today) {
        showFieldError(dateInput, 'errorPastDate');
        valid = false;
      } else if (closedDays.includes(selectedDate.getDay())) {
        showFieldError(dateInput, selectedDate.getDay() === 0 ? 'errorSundayDate' : 'errorClosedDay');
        valid = false;
      }
    }

    if (!slotInput.value) {
      const slotsContainer = document.getElementById('wizard-slots-container');
      showFieldError(slotsContainer, 'errorSlotRequired');
      valid = false;
    }
  } else if (step === 4) {
    const nameInput = document.getElementById('patient-name');
    const phoneInput = document.getElementById('patient-phone');
    const consentInput = document.getElementById('chk-consent');

    if (!nameInput.value.trim()) {
      showFieldError(nameInput, 'errorRequiredField');
      valid = false;
    }

    const phoneVal = phoneInput.value.replace(/[\s\-\.\(\)]/g, '');
    const phoneRegex = /^(?:(?:\+212)|(?:00212)|0)[5-7]\d{8}$/;
    if (!phoneRegex.test(phoneVal)) {
      showFieldError(phoneInput, 'errorInvalidPhone');
      valid = false;
    }

    if (!consentInput.checked) {
      showFieldError(consentInput, 'errorConsentRequired');
      valid = false;
    }
  }

  return valid;
}

/* ==========================================================================
   RÉCUPÉRATION & RENDU DES CRÉNEAUX 30 MIN (AVEC GESTION DE CAPACITÉ)
   ========================================================================== */
async function renderSlotsForCurrentDate() {
  const container = document.getElementById('wizard-slots-container');
  const dateInput = document.getElementById('wizard-date');
  const slotHiddenInput = document.getElementById('wizard-selected-slot');
  if (!container || !dateInput) return;

  const dateVal = dateInput.value;
  if (!dateVal) {
    container.innerHTML = `<div class="slot-empty-notice">${t('chooseSlotSelectDateFirst')}</div>`;
    return;
  }

  const selectedDate = new Date(dateVal + 'T00:00:00');
  const isSaturday = selectedDate.getDay() === 6;

  const closedDays = getClosedDays();
  if (closedDays.includes(selectedDate.getDay())) {
    const closedKey = selectedDate.getDay() === 0 ? 'errorSundayDate' : 'errorClosedDay';
    container.innerHTML = `<div class="slot-empty-notice slot-error-notice">${t(closedKey)}</div>`;
    return;
  }

  // Liste standard des créneaux
  // Samedi : 08:00 - 13:00 | Semaine : 08:00 - 16:00
  const allSlots = [
    "08:00–08:30", "08:30–09:00", "09:00–09:30", "09:30–10:00",
    "10:00–10:30", "10:30–11:00", "11:00–11:30", "11:30–12:00",
    "12:00–12:30", "12:30–13:00"
  ];

  if (!isSaturday) {
    allSlots.push(
      "13:00–13:30", "13:30–14:00", "14:00–14:30", "14:30–15:00",
      "15:00–15:30", "15:30–16:00"
    );
  }

  container.innerHTML = `<div class="slot-empty-notice">${t('chooseSlotLoading')}</div>`;

  let fullSlots = [];
  try {
    if (window.LabDB) {
      fullSlots = LabDB.appointments.fullSlots(dateVal);
    }
  } catch (err) {
    console.error('Créneaux indisponibles', err);
  }

  container.innerHTML = "";
  let preselectDone = false;

  allSlots.forEach(slot => {
    const isFull = fullSlots.includes(slot);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `slot-btn ${isFull ? 'disabled' : ''}`;
    btn.disabled = isFull;

    const displaySlot = isFull ? `${slot} (${t('slotFullLabel')})` : slot;
    btn.innerHTML = `<bdi class="bidi-isolate">${displaySlot}</bdi>`;

    if (!isFull) {
      if (!preselectDone && !slotHiddenInput.value) {
        btn.classList.add('active');
        slotHiddenInput.value = slot;
        preselectDone = true;
      } else if (slotHiddenInput.value === slot) {
        btn.classList.add('active');
        preselectDone = true;
      }

      btn.addEventListener('click', () => {
        container.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        slotHiddenInput.value = slot;
        clearFieldErrors();
      });
    }

    container.appendChild(btn);
  });
}

/* ==========================================================================
   SOUMISSION RÉELLE DU RENDEZ-VOUS (SANS no-cors, TIMEOUT 10S, FEEDBACK COMPLET)
   ========================================================================== */
/* Message d'erreur anti-spam (bannière du wizard, jamais silencieux) */
function showWizardSpamError() {
  const banner = document.getElementById('wizard-error-banner');
  if (!banner) return;
  banner.innerHTML = `<div>${t('wizardSpam')}</div>`;
  banner.classList.remove('hidden');
  banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function handleWizardFormSubmit(e) {
  e.preventDefault();

  // Valide l'étape actuellement active (pas uniquement l'étape 4) :
  // la touche Entrée ne doit jamais court-circuiter les étapes intermédiaires
  const activePanel = document.querySelector('.wizard-panel.active');
  const activeStep = activePanel ? parseInt(activePanel.getAttribute('data-step'), 10) : 4;
  if (!validateWizardStep(activeStep)) return;

  // Vérification honeypot
  const hpField = document.getElementById('hp_check_field');
  if (hpField && hpField.value.trim().length > 0) {
    console.warn("Honeypot filled - form rejected");
    showWizardSpamError();
    return;
  }

  // Vérification temps anti-spam
  const fillTime = (Date.now() - wizardFormStartTime) / 1000;
  if (fillTime < CONFIG.minFillTimeSeconds) {
    console.warn("Spam submission too fast");
    showWizardSpamError();
    return;
  }

  const btnConfirm = document.getElementById('wizard-btn-confirm');
  const errorBanner = document.getElementById('wizard-error-banner');
  errorBanner.classList.add('hidden');
  errorBanner.innerHTML = "";

  const consentChecked = document.getElementById('chk-consent') ? document.getElementById('chk-consent').checked : true;

  const payload = {
    nom: document.getElementById('patient-name').value.trim(),
    telephone: document.getElementById('patient-phone').value.trim(),
    analyses: document.getElementById('custom-analysis-select').value.trim(),
    lieu: document.querySelector('input[name="wizardLocation"]:checked').value === 'domicile' ? 'À domicile' : 'Au laboratoire',
    zone: document.querySelector('input[name="wizardLocation"]:checked').value === 'domicile' ? document.getElementById('wizard-zone-select').value : 'N/A',
    adresse: document.querySelector('input[name="wizardLocation"]:checked').value === 'domicile' ? document.getElementById('wizard-address').value.trim() : 'Avenue des FAR, Tétouan',
    date: document.getElementById('wizard-date').value,
    creneau: document.getElementById('wizard-selected-slot').value,
    mutuelle: document.getElementById('patient-mutuelle').value,
    ordonnance: document.getElementById('chk-prescription').checked,
    consentement: consentChecked,
    source: "web-wizard"
  };

  // Préparation du message WhatsApp en cas de validation ou de fallback
  const waMessage = formatWhatsAppMessage(payload, "ATTENTE-CONFIRMATION");

  // État de chargement (sans style inline)
  const originalBtnHtml = btnConfirm.innerHTML;
  btnConfirm.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-flip spin-loader" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
    <span>${t('btnSubmitting')}</span>
  `;
  btnConfirm.disabled = true;

  let result;
  try {
    result = LabDB.appointments.create(payload);
  } catch (err) {
    console.error("Submission failed:", err);
    result = { ok: false, message: t('resErrGeneric') };
  }

  btnConfirm.innerHTML = originalBtnHtml;
  btnConfirm.disabled = false;

  if (result && result.ok && result.reference) {
    showConfirmationModal(payload, result.reference, false);
  } else {
    const waFallbackUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
    errorBanner.innerHTML = `
      <div>${(result && result.message) ? result.message : t('errorSubmissionFailed')}</div>
      <div>
        <a href="${waFallbackUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-action btn-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.158.577 4.183 1.583 5.928l-1.683 6.149 6.306-1.654c1.7 1.002 3.688 1.577 5.794 1.577 6.627 0 12-5.373 12-12s-5.373-12-12-12z"></path></svg>
          <span>${t('btnFallbackWhatsapp')}</span>
        </a>
      </div>
    `;
    errorBanner.classList.remove('hidden');
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ==========================================================================
   MODALE DE CONFIRMATION RDV (AVEC LIEN WHATSAPP OFFICIEL & FICHIER .ICS)
   ========================================================================== */
/* Date longue localisée (fr-FR / ar-MA) pour la modale et le message WhatsApp */
function formatLongDateLabel(ymd) {
  const parts = String(ymd || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some(n => isNaN(n))) return String(ymd || '');
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString(currentLang === 'ar' ? 'ar-MA' : 'fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function showConfirmationModal(payload, reference, isDemo = false) {
  const modal = document.getElementById('wizard-confirmation-modal');
  if (!modal) return;

  const demoNotice = document.getElementById('modal-demo-notice');
  if (demoNotice) {
    if (isDemo) {
      demoNotice.classList.remove('hidden');
      demoNotice.textContent = t('demoModeWarning') || "Mode Démonstration – Non enregistré";
    } else {
      demoNotice.classList.add('hidden');
    }
  }

  document.getElementById('modal-conf-ref').textContent = reference;
  document.getElementById('modal-conf-name').textContent = payload.nom;
  document.getElementById('modal-conf-lieu').textContent = payload.lieu === 'À domicile' ? `${payload.lieu} (${payload.zone})` : payload.lieu;
  const dateSeparator = currentLang === 'ar' ? ' الساعة ' : ' à ';
  document.getElementById('modal-conf-date').textContent = `${formatLongDateLabel(payload.date)}${dateSeparator}${payload.creneau}`;
  document.getElementById('modal-conf-analyses').textContent = payload.analyses;

  // Lien WhatsApp prérempli
  const waText = formatWhatsAppMessage(payload, reference);
  const waLink = document.getElementById('modal-whatsapp-link');
  if (waLink) {
    waLink.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;
  }

  // Téléchargement du fichier .ics
  const calBtn = document.getElementById('modal-cal-download');
  if (calBtn) {
    calBtn.onclick = () => {
      downloadIcsCalendar(payload, reference);
    };
  }

  const pdfBtn = document.getElementById('modal-pdf-download');
  if (pdfBtn) {
    pdfBtn.disabled = !!isDemo;
    pdfBtn.onclick = () => downloadBookingPdf(payload, reference, pdfBtn);
  }

  openModalAccessible(modal);

  modal.querySelectorAll('.close-modal-trigger').forEach(btn => {
    btn.onclick = () => closeModalAccessible(modal);
  });

  modal.onclick = (e) => {
    if (e.target === modal) closeModalAccessible(modal);
  };
}

function formatWhatsAppMessage(payload, ref) {
  const isAr = currentLang === 'ar';
  const intro = isAr ? I18N.ar.waMsgIntro : I18N.fr.waMsgIntro;
  const header = isAr ? I18N.ar.waMsgRdv : I18N.fr.waMsgRdv;
  const outro = isAr ? I18N.ar.waMsgOutro : I18N.fr.waMsgOutro;
  const dateLabel = formatLongDateLabel(payload.date);

  return `${intro}
${header}
${isAr ? I18N.ar.waMsgRef : I18N.fr.waMsgRef} ${ref}
${isAr ? I18N.ar.waMsgName : I18N.fr.waMsgName} ${payload.nom}
${isAr ? I18N.ar.waMsgPhone : I18N.fr.waMsgPhone} ${payload.telephone}
${isAr ? I18N.ar.waMsgDate : I18N.fr.waMsgDate} ${dateLabel}
${isAr ? I18N.ar.waMsgSlot : I18N.fr.waMsgSlot} ${payload.creneau}
${isAr ? I18N.ar.waMsgLocation : I18N.fr.waMsgLocation} ${payload.lieu}
${isAr ? I18N.ar.waMsgAnalyses : I18N.fr.waMsgAnalyses} ${payload.analyses}
${isAr ? I18N.ar.waMsgMutuelle : I18N.fr.waMsgMutuelle} ${payload.mutuelle}
${payload.ordonnance ? (isAr ? I18N.ar.waMsgPrescription : I18N.fr.waMsgPrescription) : ''}

${outro}`;
}

function downloadIcsCalendar(payload, reference) {
  try {
    const [startHour, startMin] = payload.creneau.split('–')[0].split(':');
    const [year, month, day] = payload.date.split('-');

    const dtStart = `${year}${month}${day}T${startHour}${startMin}00`;
    const endMinutes = parseInt(startMin, 10) + 30;
    const endHour = endMinutes >= 60 ? String(parseInt(startHour, 10) + 1).padStart(2, '0') : startHour;
    const endMinStr = String(endMinutes % 60).padStart(2, '0');
    const dtEnd = `${year}${month}${day}T${endHour}${endMinStr}00`;

    const summary = currentLang === 'ar' ? `موعد تحاليل طبية - مختبر دردابي (${reference})` : `RDV Analyses Médicales - Laboratoire Derdabi (${reference})`;
    const location = payload.lieu === 'À domicile' ? `${payload.adresse}, ${payload.zone}` : CONFIG.address;
    const description = `Rendez-vous Laboratoire Derdabi - ${payload.analyses} - Ref: ${reference}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Laboratoire Derdabi//RDV Medical//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${reference}-${Date.now()}@derdabi.ma`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RDV-Laboratoire-Derdabi-${reference}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Calendar generation error:", err);
  }
}

/* ==========================================================================
   GESTION DES ERREURS INLINE SANS AUCUN ALERT()
   ========================================================================== */
function showFieldError(element, errorKey, customMessage) {
  if (!element) return;

  const msg = customMessage || t(errorKey);
  element.classList.add('is-invalid');

  // Recherche ou création du conteneur d'erreur
  let errEl = null;
  const parent = element.closest('.form-group') || element.parentElement;
  if (parent) {
    errEl = parent.querySelector('.field-error-msg');
  }

  if (errEl) {
    errEl.textContent = msg;
    errEl.classList.remove('hidden');
    errEl.setAttribute('role', 'alert');
  }

  // Focus fluide sur le premier champ invalide
  if (typeof element.focus === 'function') {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function clearFieldErrors() {
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.field-error-msg').forEach(el => {
    el.classList.add('hidden');
    el.textContent = '';
  });
  const banner = document.getElementById('wizard-error-banner');
  if (banner) {
    banner.classList.add('hidden');
    banner.innerHTML = '';
  }
}

/* ==========================================================================
   VÉRIFICATION AUTOMATISÉE i18n (DEBUG SCAN)
   ========================================================================== */
function checkI18nDebug() {
  const missingInFr = [];
  const missingInAr = [];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!I18N.fr || I18N.fr[key] === undefined) missingInFr.push(key);
    if (!I18N.ar || I18N.ar[key] === undefined) missingInAr.push(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (!I18N.fr || I18N.fr[key] === undefined) missingInFr.push(key);
    if (!I18N.ar || I18N.ar[key] === undefined) missingInAr.push(key);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (!I18N.fr || I18N.fr[key] === undefined) missingInFr.push(key);
    if (!I18N.ar || I18N.ar[key] === undefined) missingInAr.push(key);
  });

  if (missingInFr.length > 0) {
    console.warn(`[i18n Debug] Clés manquantes en Français (${missingInFr.length}) :`, missingInFr);
  }
  if (missingInAr.length > 0) {
    console.warn(`[i18n Debug] Clés manquantes en Arabe (${missingInAr.length}) :`, missingInAr);
  }
  if (missingInFr.length === 0 && missingInAr.length === 0) {
    console.log(`[i18n Debug] 100% des clés vérifiées et validées dans les deux langues (FR et AR).`);
  }
}
