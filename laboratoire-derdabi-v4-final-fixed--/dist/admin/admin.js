/**
 * Laboratoire Derdabi — Administration (démonstration)
 * Routeur, vues, filtres, calendrier, modales et statistiques.
 * Aucune connexion réseau, aucune persistance, données 100% synthétiques.
 */
(function () {
  'use strict';

  var ICONS = {
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    check: '<path d="m5 12 4 4 10-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    building: '<path d="M4 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M2 21h20M8 7h3M8 11h3M8 15h3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
    alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
    inbox: '<path d="M3 12h5l2 3h4l2-3h5"/><path d="M5.5 5h13l2.5 7v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M8.5 14h7"/>',
    activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-5"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="m11 12 9-9M15 8l3 3M18 5l3 3"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  };

  var STATUS = {
    pending: { label: 'En attente', cls: 'is-pending', order: 0 },
    confirmed: { label: 'Confirmé', cls: 'is-confirmed', order: 1 },
    completed: { label: 'Terminé(s)', cls: 'is-completed', order: 2 },
    cancelled: { label: 'Annulé', cls: 'is-cancelled', order: 3 }
  };

  var ROUTES = {
    dashboard: { title: 'Tableau de bord', subtitle: "Vue d'ensemble de l'activité du laboratoire" },
    calendar: { title: 'Calendrier', subtitle: 'Planning mensuel des rendez-vous' },
    appointments: { title: 'Rendez-vous', subtitle: 'Rechercher, filtrer et gérer les rendez-vous' },
    patients: { title: 'Patients', subtitle: 'Répertoire des patients de la démonstration' },
    results: { title: 'Résultats', subtitle: 'Dossiers, codes d’accès, PDF et journal de consultation' },
    analyses: { title: 'Analyses & tarifs', subtitle: 'Catalogue des examens et prestations' },
    messages: { title: 'Messages', subtitle: 'Demandes reçues depuis le site public' },
    statistics: { title: 'Statistiques', subtitle: "Indicateurs d'activité du laboratoire" },
    settings: { title: 'Paramètres', subtitle: 'Configuration du laboratoire et de la démonstration' },
    audit: { title: 'Journal d’audit', subtitle: 'Traçabilité des actions de démonstration' },
    backup: { title: 'Sauvegarde', subtitle: 'Export, import et réinitialisation des données locales' }
  };

  var PAGE_SIZE = 8;
  var DEFAULT_FILTERS = {
    q: '', status: 'all', location: 'all', period: 'all', sort: 'date-asc', page: 1
  };
  var DB = window.LabDB;
  var SESSION_KEY = 'derdabi_admin_session';

  function readSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (error) { return null; }
  }

  function sessionValid() {
    var session = readSession();
    if (!session || !session.expiresAt) return false;
    var last = Number(session.lastActivity || 0);
    var idleLimit = Number(session.idleMinutes || 30) * 60000;
    return Date.now() < Number(session.expiresAt) && (Date.now() - last) < idleLimit;
  }

  function touchSession() {
    // Correction : ne jamais « ressusciter » une session expirée en réécrivant
    // le stockage. Si la session est invalide, on la purge et on renvoie vers
    // la page de connexion (même comportement que guardSession).
    if (!sessionValid()) {
      if (readSession()) {
        try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { /* ignore */ }
        window.location.replace('login.html');
      }
      return;
    }
    var session = readSession();
    if (!session) return;
    session.lastActivity = Date.now();
    session.expiresAt = Date.now() + Number(session.idleMinutes || 30) * 60000;
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (error) { /* ignore */ }
  }

  function guardSession() {
    if (!sessionValid()) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { /* ignore */ }
      window.location.replace('login.html');
      return false;
    }
    return true;
  }

  function svg(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return [];
    }
  }

  function norm(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function today() {
    return startOfDay(new Date());
  }

  function addDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function parseYmd(value) {
    var parts = String(value || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(function (part) { return isNaN(part); })) {
      return new Date(NaN);
    }
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function ymd(date) {
    return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate());
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function cap(value) {
    var text = String(value || '');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function fmtLongDate(date) {
    return cap(new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(date));
  }

  function fmtShortDate(date) {
    return cap(new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short', day: '2-digit', month: 'short'
    }).format(date));
  }

  function fmtMonth(date) {
    return cap(new Intl.DateTimeFormat('fr-FR', {
      month: 'long', year: 'numeric'
    }).format(date));
  }

  function fmtDateTime(iso) {
    var date = new Date(iso);
    if (isNaN(date.getTime())) {
      return '—';
    }
    return cap(new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date));
  }

  function timeToMinutes(value) {
    var match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
      return -1;
    }
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function minutesToTime(minutes) {
    return pad2(Math.floor(minutes / 60)) + ':' + pad2(minutes % 60);
  }

  function slotsFor(date) {
    var day = date.getDay();
    if (day === 0) {
      return [];
    }
    var end = day === 6 ? 13 * 60 : 16 * 60;
    var slots = [];
    for (var minutes = 8 * 60; minutes < end; minutes += 30) {
      slots.push(minutes);
    }
    return slots;
  }

  function nextOpenDay(date) {
    var next = startOfDay(date);
    while (next.getDay() === 0) {
      next = addDays(next, 1);
    }
    return next;
  }

  function readData() {
    if (!DB) return [];
    try {
      return DB.appointments.list();
    } catch (error) {
      return [];
    }
  }

  function reloadData() {
    state.all = readData();
    state.missingData = !state.all.length;
    return state.all;
  }

  var state = {
    route: 'dashboard',
    all: readData(),
    missingData: !DB || readData().length === 0,
    filters: Object.assign({}, DEFAULT_FILTERS),
    calendar: { cursor: startOfMonth(today()), selected: today() },
    statsPeriod: 30,
    patientQuery: '',
    dossierQuery: '',
    dossierStatus: 'all',
    analysesQuery: '',
    messagesFilter: 'all',
    statsChartMode: 'day',
    simulateEmpty: false,
    simulateError: false,
    sidebarOpen: false,
    modalOpen: false,
    modalRecord: null,
    modalReturnFocus: null
  };

  function effectiveAppointments() {
    return state.simulateEmpty ? [] : state.all;
  }

  function findAppointment(id) {
    for (var i = 0; i < state.all.length; i += 1) {
      if (state.all[i].id === id) {
        return state.all[i];
      }
    }
    return null;
  }

  function countStatus(list) {
    var counts = { total: list.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0, home: 0, analyses: 0 };
    list.forEach(function (appointment) {
      if (counts[appointment.status] !== undefined) {
        counts[appointment.status] += 1;
      }
      if (appointment.location && appointment.location.type === 'home') {
        counts.home += 1;
      }
      counts.analyses += Array.isArray(appointment.analyses) ? appointment.analyses.length : 0;
    });
    return counts;
  }

  function initials(name) {
    return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join('') || '—';
  }

  function avatarClass(name) {
    var classes = ['', 'is-sky', 'is-amber', 'is-green'];
    var code = String(name || 'A').charCodeAt(0);
    return classes[code % classes.length];
  }

  function statusBadge(status) {
    var meta = STATUS[status] || STATUS.pending;
    return '<span class="adm-badge ' + meta.cls + '">' + meta.label + '</span>';
  }

  function typeBadge(appointment) {
    if (appointment.location && appointment.location.type === 'home') {
      return '<span class="adm-type">' + svg('home') + 'Domicile</span>';
    }
    return '<span class="adm-type">' + svg('building') + 'Laboratoire</span>';
  }

  function typeLabel(appointment) {
    return appointment.location && appointment.location.type === 'home'
      ? 'Prélèvement à domicile'
      : 'Au laboratoire';
  }

  function byDateAsc(a, b) {
    if (a.date === b.date) {
      return String(a.time).localeCompare(String(b.time));
    }
    return a.date < b.date ? -1 : 1;
  }

  function byDateDesc(a, b) {
    if (a.date === b.date) {
      return String(b.time).localeCompare(String(a.time));
    }
    return a.date > b.date ? -1 : 1;
  }

  function render(options) {
    options = options || {};
    var route = ROUTES[state.route] ? state.route : 'dashboard';
    state.route = route;

    document.getElementById('adm-page-title').textContent = ROUTES[route].title;
    document.getElementById('adm-page-subtitle').textContent = ROUTES[route].subtitle;
    document.getElementById('adm-today-date').textContent = fmtLongDate(today());

    var navLinks = document.querySelectorAll('.adm-nav a[data-route]');
    Array.prototype.forEach.call(navLinks, function (link) {
      var isActive = link.getAttribute('data-route') === route;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    var html;
    if (state.simulateError) {
      html = renderErrorState();
    } else if (state.missingData) {
      html = renderMissingDataState();
    } else if (route === 'calendar') {
      html = renderCalendar();
    } else if (route === 'appointments') {
      html = renderAppointments();
    } else if (route === 'patients') {
      html = renderPatients();
    } else if (route === 'results') {
      html = renderDossiers();
    } else if (route === 'analyses') {
      html = renderAnalyses();
    } else if (route === 'messages') {
      html = renderMessages();
    } else if (route === 'statistics') {
      html = renderStatistics();
    } else if (route === 'settings') {
      html = renderSettings();
    } else if (route === 'audit') {
      html = renderAudit();
    } else if (route === 'backup') {
      html = renderBackup();
    } else {
      html = renderDashboard();
    }

    var view = document.getElementById('adm-view');
    view.innerHTML = html;

    // Transition de vue : fondu + légère élévation, sauf pendant la saisie
    // (re-renders avec focusId) pour ne pas faire scintiller les champs.
    if (!options.focusId && view.classList) {
      view.classList.remove('adm-view-anim');
      void view.offsetWidth; /* force le redémarrage de l'animation */
      view.classList.add('adm-view-anim');
    }

    refreshTopbarIndicators();

    var sidebar = document.getElementById('adm-sidebar');
    var backdrop = document.getElementById('adm-backdrop');
    var menuButton = document.querySelector('[data-action="toggle-sidebar"]');
    if (sidebar && backdrop && menuButton) {
      sidebar.classList.toggle('is-open', state.sidebarOpen);
      backdrop.hidden = !state.sidebarOpen;
      menuButton.setAttribute('aria-expanded', state.sidebarOpen ? 'true' : 'false');
      menuButton.setAttribute('aria-label', state.sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    }

    if (options.focusId) {
      var focusEl = document.getElementById(options.focusId);
      if (focusEl) {
        focusEl.focus();
        if (focusEl.setSelectionRange && typeof focusEl.value === 'string') {
          var length = focusEl.value.length;
          try {
            focusEl.setSelectionRange(length, length);
          } catch (error) {
            /* certains types d'input ne supportent pas setSelectionRange */
          }
        }
      }
    }
  }

  function emptyState(options) {
    return '<div class="adm-state">' +
      '<div class="adm-state-icon">' + svg(options.icon || 'inbox') + '</div>' +
      '<h2>' + esc(options.title) + '</h2>' +
      '<p>' + esc(options.text) + '</p>' +
      (options.actions ? '<div class="adm-state-actions">' + options.actions + '</div>' : '') +
      '</div>';
  }

  function renderErrorState() {
    return '<div class="adm-state">' +
      '<div class="adm-state-icon is-error">' + svg('alert') + '</div>' +
      '<h2>Impossible de charger les rendez-vous</h2>' +
      '<p>Une erreur de démonstration a été simulée. Aucune donnée réelle n’est concernée. Vous pouvez réessayer ou réinitialiser le jeu de données.</p>' +
      '<div class="adm-state-actions">' +
        '<button type="button" class="adm-btn adm-btn-primary" data-action="retry">' + svg('refresh') + 'Réessayer</button>' +
        '<button type="button" class="adm-btn adm-btn-secondary" data-action="reset-demo">' + svg('inbox') + 'Réinitialiser la démo</button>' +
      '</div>' +
    '</div>';
  }

  function renderMissingDataState() {
    return '<div class="adm-state">' +
      '<div class="adm-state-icon is-error">' + svg('alert') + '</div>' +
      '<h2>Données de démonstration indisponibles</h2>' +
      '<p>La base locale <strong>db.js</strong> n’a pas pu être chargée ou initialisée. Vérifiez qu’elle se trouve à la racine du projet, puis rechargez la page.</p>' +
      '<div class="adm-state-actions">' +
        '<button type="button" class="adm-btn adm-btn-primary" data-action="reload">' + svg('refresh') + 'Recharger la page</button>' +
      '</div>' +
    '</div>';
  }

  function emptyInline(title, text) {
    return '<div class="adm-empty-inline"><strong>' + esc(title) + '</strong>' + esc(text) + '</div>';
  }

  function kpiCard(options) {
    return '<article class="adm-kpi">' +
      '<div class="adm-kpi-top">' +
        '<span class="adm-kpi-label">' + esc(options.label) + '</span>' +
        '<span class="adm-kpi-icon ' + (options.tone || '') + '">' + svg(options.icon) + '</span>' +
      '</div>' +
      '<div class="adm-kpi-value">' + esc(options.value) + '</div>' +
      '<div class="adm-kpi-note">' + esc(options.note) + '</div>' +
    '</article>';
  }

  function barRow(label, value, total, tone) {
    var percent = total > 0 ? Math.round((value / total) * 100) : 0;
    return '<div class="adm-bar-row">' +
      '<span class="adm-label"><span>' + esc(label) + '</span><strong>' + value + ' · ' + percent + '%</strong></span>' +
      '<div class="adm-bar-track"><div class="adm-bar-fill ' + (tone || '') + '" style="width:' + percent + '%"></div></div>' +
    '</div>';
  }

  function rankRow(label, value, max) {
    var percent = max > 0 ? Math.round((value / max) * 100) : 0;
    return '<div class="adm-bar-row">' +
      '<span class="adm-label"><span>' + esc(label) + '</span><strong>' + value + '</strong></span>' +
      '<div class="adm-bar-track"><div class="adm-bar-fill" style="width:' + Math.max(percent, value > 0 ? 4 : 0) + '%"></div></div>' +
    '</div>';
  }

  function chartColumns(data, useWeekday) {
    var max = 1;
    data.forEach(function (item) {
      if (item.count > max) {
        max = item.count;
      }
    });
    return data.map(function (item) {
      var height = Math.max(5, Math.round((item.count / max) * 118));
      var label = useWeekday
        ? new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(item.date)
        : String(item.date.getDate());
      var isToday = sameDay(item.date, today());
      return '<div class="adm-chart-col' + (isToday ? ' is-today' : '') + '" title="' + esc(fmtLongDate(item.date) + ' : ' + item.count + ' rendez-vous') + '">' +
        '<span class="adm-chart-value">' + item.count + '</span>' +
        '<span class="adm-chart-bar" style="height:' + height + 'px"></span>' +
        '<span class="adm-chart-label">' + esc(label) + '</span>' +
      '</div>';
    }).join('');
  }

  function iconAction(action, id, label, iconName, extra) {
    return '<button type="button" class="adm-icon-btn adm-icon-btn-sm ' + (extra || '') + '" data-action="' + action + '" data-id="' + esc(id) + '" aria-label="' + esc(label) + '" title="' + esc(label) + '">' + svg(iconName) + '</button>';
  }

  function renderDashboard() {
    var all = effectiveAppointments();
    var current = today();
    var counts = countStatus(all);
    var todayList = all.filter(function (appointment) {
      return appointment.date === ymd(current);
    }).sort(byDateAsc);
    var todayActive = todayList.filter(function (appointment) {
      return appointment.status !== 'cancelled';
    });
    var upcoming = all.filter(function (appointment) {
      return parseYmd(appointment.date) > current && appointment.status !== 'cancelled';
    }).sort(byDateAsc).slice(0, 6);

    var week = [];
    for (var i = 6; i >= 0; i -= 1) {
      var day = addDays(current, -i);
      week.push({
        date: day,
        count: all.filter(function (appointment) {
          return appointment.date === ymd(day) && appointment.status !== 'cancelled';
        }).length
      });
    }
    var weekTotal = week.reduce(function (sum, item) { return sum + item.count; }, 0);

    var hero = '<section class="adm-hero">' +
      '<div class="adm-hero-copy">' +
        '<span class="adm-hero-eyebrow">Données de démonstration</span>' +
        '<h2>Bonjour, l’équipe du Laboratoire Derdabi</h2>' +
        '<p>Retrouvez les rendez-vous du jour, confirmez les demandes en attente et suivez l’activité du laboratoire. Toutes les données sont synthétiques et restent dans ce navigateur jusqu’à réinitialisation.</p>' +
      '</div>' +
      '<div class="adm-hero-actions">' +
        '<a class="adm-btn adm-btn-primary" href="#/appointments">' + svg('calendar') + 'Gérer les rendez-vous</a>' +
        '<a class="adm-btn adm-btn-secondary" href="#/statistics">' + svg('activity') + 'Voir les statistiques</a>' +
      '</div>' +
    '</section>';

    var kpis = '<div class="adm-kpis">' +
      kpiCard({ label: 'Rendez-vous', value: counts.total, note: 'sur l’ensemble de la démo', icon: 'users' }) +
      kpiCard({ label: 'En attente', value: counts.pending, note: 'demandes à confirmer', icon: 'clock', tone: 'is-amber' }) +
      kpiCard({ label: 'Confirmés', value: counts.confirmed, note: 'dont ' + counts.completed + ' terminé(s)', icon: 'checkCircle', tone: 'is-green' }) +
      kpiCard({ label: 'Annulés', value: counts.cancelled, note: 'sur la période de démonstration', icon: 'xCircle', tone: 'is-red' }) +
    '</div>';

    var todayPanel = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head">' +
        '<div><h2>Rendez-vous du jour</h2><p>' + esc(fmtLongDate(current)) + ' · ' + todayActive.length + ' rendez-vous actifs</p></div>' +
        '<a class="adm-btn adm-btn-ghost adm-btn-sm" href="#/appointments">Tout voir ' + svg('arrowRight') + '</a>' +
      '</div>' +
      (todayList.length
        ? '<div class="adm-list">' + todayList.map(dashboardRow).join('') + '</div>'
        : emptyInline(current.getDay() === 0 ? 'Laboratoire fermé' : 'Aucun rendez-vous aujourd’hui',
            current.getDay() === 0 ? 'Le laboratoire est fermé le dimanche.' : 'Les prochains rendez-vous sont visibles ci-contre.')) +
    '</section>';

    var upcomingPanel = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head">' +
        '<div><h2>Prochains rendez-vous</h2><p>Les 6 prochaines demandes actives</p></div>' +
        '<a class="adm-btn adm-btn-ghost adm-btn-sm" href="#/calendar">Calendrier ' + svg('arrowRight') + '</a>' +
      '</div>' +
      (upcoming.length
        ? '<div class="adm-list">' + upcoming.map(upcomingRow).join('') + '</div>'
        : emptyInline('Aucun rendez-vous à venir', 'Le planning est libre pour le moment.')) +
    '</section>';

    var activity = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head">' +
        '<div><h2>Activité — 7 derniers jours</h2><p>' + weekTotal + ' rendez-vous actifs sur la période</p></div>' +
        '<a class="adm-btn adm-btn-ghost adm-btn-sm" href="#/statistics">Détail ' + svg('arrowRight') + '</a>' +
      '</div>' +
      '<div class="adm-chart" role="img" aria-label="Nombre de rendez-vous actifs par jour sur les 7 derniers jours">' + chartColumns(week, true) + '</div>' +
    '</section>';

    var distribution = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head"><div><h2>Répartition des statuts</h2><p>Ensemble du jeu de démonstration</p></div></div>' +
      '<div class="adm-bars">' +
        barRow('Confirmés', counts.confirmed, counts.total, 'is-green') +
        barRow('Terminés', counts.completed, counts.total) +
        barRow('En attente', counts.pending, counts.total, 'is-amber') +
        barRow('Annulés', counts.cancelled, counts.total, 'is-red') +
      '</div>' +
    '</section>';

    return hero + kpis +
      '<div class="adm-grid adm-grid-2 adm-gap-lg">' + todayPanel + upcomingPanel + '</div>' +
      '<div class="adm-grid adm-grid-2-1 adm-gap-lg">' + activity + distribution + '</div>';
  }

  function dashboardRow(appointment) {
    return '<div class="adm-list-row">' +
      '<span class="adm-list-time">' + esc(appointment.time) + '</span>' +
      '<span class="adm-avatar ' + avatarClass(appointment.patient.name) + '">' + esc(initials(appointment.patient.name)) + '</span>' +
      '<div class="adm-list-main">' +
        '<div class="adm-list-title">' + esc(appointment.patient.name) + statusBadge(appointment.status) + '</div>' +
        '<div class="adm-list-meta"><span>' + esc(appointment.analyses[0] || '—') + (appointment.analyses.length > 1 ? ' +' + (appointment.analyses.length - 1) : '') + '</span><span>' + (appointment.location.type === 'home' ? 'Domicile — ' + esc(appointment.location.zone) : 'Laboratoire') + '</span></div>' +
      '</div>' +
      '<div class="adm-list-actions">' +
        iconAction('view-appt', appointment.id, 'Voir le rendez-vous', 'eye') +
        (appointment.status === 'pending' ? iconAction('confirm-appt', appointment.id, 'Confirmer le rendez-vous', 'check', 'is-success') : '') +
        (appointment.status !== 'cancelled' ? iconAction('cancel-appt', appointment.id, 'Annuler le rendez-vous', 'x', 'is-danger') : '') +
      '</div>' +
    '</div>';
  }

  function upcomingRow(appointment) {
    return '<div class="adm-list-row">' +
      '<span class="adm-list-time">' + esc(appointment.time) + '</span>' +
      '<span class="adm-avatar ' + avatarClass(appointment.patient.name) + '">' + esc(initials(appointment.patient.name)) + '</span>' +
      '<div class="adm-list-main">' +
        '<div class="adm-list-title">' + esc(appointment.patient.name) + statusBadge(appointment.status) + '</div>' +
        '<div class="adm-list-meta"><span>' + esc(fmtShortDate(parseYmd(appointment.date))) + '</span><span>' + esc(appointment.analyses[0] || '—') + '</span></div>' +
      '</div>' +
      '<div class="adm-list-actions">' + iconAction('view-appt', appointment.id, 'Voir le rendez-vous', 'eye') + '</div>' +
    '</div>';
  }

  function renderCalendar() {
    var cursor = state.calendar.cursor;
    var selected = state.calendar.selected;
    var all = effectiveAppointments();
    var monthStart = startOfMonth(cursor);
    var gridStart = addDays(monthStart, -((monthStart.getDay() + 6) % 7));
    var monthActive = all.filter(function (appointment) {
      var date = parseYmd(appointment.date);
      return date.getFullYear() === cursor.getFullYear() &&
        date.getMonth() === cursor.getMonth() &&
        appointment.status !== 'cancelled';
    }).length;

    var cells = [];
    for (var i = 0; i < 42; i += 1) {
      cells.push(calendarCell(addDays(gridStart, i), cursor, selected, all));
    }

    var dayAppointments = all.filter(function (appointment) {
      return appointment.date === ymd(selected);
    }).sort(byDateAsc);
    var dayActive = dayAppointments.filter(function (appointment) {
      return appointment.status !== 'cancelled';
    }).length;
    var dayPending = dayAppointments.filter(function (appointment) {
      return appointment.status === 'pending';
    }).length;

    return '<div class="adm-cal-toolbar">' +
      '<div>' +
        '<h2 class="adm-cal-title">' + esc(fmtMonth(cursor)) + '</h2>' +
        '<p class="adm-cal-sub">' + monthActive + ' rendez-vous actifs ce mois-ci</p>' +
      '</div>' +
      '<div class="adm-cal-nav">' +
        '<button type="button" class="adm-icon-btn" data-action="cal-prev" aria-label="Mois précédent">' + svg('chevronLeft') + '</button>' +
        '<button type="button" class="adm-btn adm-btn-secondary adm-btn-sm" data-action="cal-today">Aujourd’hui</button>' +
        '<button type="button" class="adm-icon-btn" data-action="cal-next" aria-label="Mois suivant">' + svg('chevronRight') + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="adm-cal-layout">' +
      '<div class="adm-card adm-cal">' +
        '<div class="adm-cal-dow" aria-hidden="true">' +
          '<span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>' +
        '</div>' +
        '<div class="adm-cal-grid" role="grid" aria-label="Calendrier de ' + esc(fmtMonth(cursor)) + '">' + cells.join('') + '</div>' +
      '</div>' +
      '<div class="adm-cal-side">' +
        '<div class="adm-card adm-card-pad">' +
          '<div class="adm-day-detail-head">' +
            '<h2>' + esc(fmtLongDate(selected)) + '</h2>' +
            '<p>' + dayAppointments.length + ' rendez-vous · ' + dayActive + ' actifs · ' + dayPending + ' en attente</p>' +
          '</div>' +
          (dayAppointments.length
            ? '<div class="adm-day-list">' + dayAppointments.map(dayDetailItem).join('') + '</div>'
            : emptyInline('Aucun rendez-vous', 'Cette journée est libre dans la démonstration.')) +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function calendarCell(date, cursor, selected, all) {
    var dateStr = ymd(date);
    var dayAll = all.filter(function (appointment) {
      return appointment.date === dateStr;
    });
    var active = dayAll.filter(function (appointment) {
      return appointment.status !== 'cancelled';
    }).sort(byDateAsc);
    var classes = ['adm-cal-day'];
    if (date.getMonth() !== cursor.getMonth()) {
      classes.push('is-outside');
    }
    if (sameDay(date, today())) {
      classes.push('is-today');
    }
    if (sameDay(date, selected)) {
      classes.push('is-selected');
    }

    var preview = active.slice(0, 2).map(function (appointment) {
      var tone = appointment.status === 'pending' ? ' is-pending' : '';
      return '<span class="adm-cal-ev' + tone + '"><span>' + esc(appointment.time + ' ' + appointment.patient.name) + '</span></span>';
    }).join('');
    var more = active.length > 2 ? '<span class="adm-cal-more">+' + (active.length - 2) + '</span>' : '';

    return '<button type="button" class="' + classes.join(' ') + '" data-action="select-day" data-date="' + dateStr + '" aria-pressed="' + (sameDay(date, selected) ? 'true' : 'false') + '" aria-label="' + esc(fmtLongDate(date) + ' — ' + active.length + ' rendez-vous') + '">' +
      '<span class="adm-cal-daytop">' +
        '<span class="adm-cal-daynum">' + date.getDate() + '</span>' +
        (active.length ? '<span class="adm-cal-count">' + active.length + '</span>' : '') +
      '</span>' +
      preview + more +
    '</button>';
  }

  function dayDetailItem(appointment) {
    return '<div class="adm-day-item">' +
      '<div class="adm-day-item-top">' +
        '<span class="adm-day-item-time">' + esc(appointment.time + ' – ' + appointment.endTime) + '</span>' +
        statusBadge(appointment.status) +
      '</div>' +
      '<div class="adm-day-item-name">' + esc(appointment.patient.name) + '</div>' +
      '<div class="adm-day-item-meta">' + esc(appointment.analyses[0] || '—') + (appointment.analyses.length > 1 ? ' +' + (appointment.analyses.length - 1) : '') + ' · ' + (appointment.location.type === 'home' ? 'Domicile — ' + esc(appointment.location.zone) : 'Laboratoire') + '</div>' +
      '<div class="adm-day-item-actions">' +
        iconAction('view-appt', appointment.id, 'Voir le rendez-vous', 'eye') +
        (appointment.status === 'pending' ? iconAction('confirm-appt', appointment.id, 'Confirmer le rendez-vous', 'check', 'is-success') : '') +
        (appointment.status !== 'cancelled' ? iconAction('reschedule-appt', appointment.id, 'Reprogrammer le rendez-vous', 'calendar') : '') +
        (appointment.status !== 'cancelled' ? iconAction('cancel-appt', appointment.id, 'Annuler le rendez-vous', 'x', 'is-danger') : '') +
      '</div>' +
    '</div>';
  }

  function renderAppointments() {
    var all = effectiveAppointments();
    var filtered = filterAppointments(all);
    var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (state.filters.page > totalPages) {
      state.filters.page = totalPages;
    }
    if (state.filters.page < 1) {
      state.filters.page = 1;
    }
    var page = state.filters.page;
    var start = (page - 1) * PAGE_SIZE;
    var pageItems = filtered.slice(start, start + PAGE_SIZE);

    var toolbar = '<div class="adm-toolbar">' +
      '<label class="adm-search">' +
        '<span class="adm-sr-only">Rechercher un rendez-vous</span>' +
        svg('search') +
        '<input id="adm-search" class="adm-input" type="search" placeholder="Rechercher un patient, une référence, un téléphone…" autocomplete="off" data-filter="q" value="' + esc(state.filters.q) + '">' +
      '</label>' +
      '<label class="adm-field"><span class="adm-label">Statut</span>' +
        '<select id="adm-filter-status" class="adm-select" data-filter="status">' +
          selectOption('all', 'Tous les statuts', state.filters.status) +
          selectOption('pending', 'En attente', state.filters.status) +
          selectOption('confirmed', 'Confirmés', state.filters.status) +
          selectOption('completed', 'Terminés', state.filters.status) +
          selectOption('cancelled', 'Annulés', state.filters.status) +
        '</select>' +
      '</label>' +
      '<label class="adm-field"><span class="adm-label">Type</span>' +
        '<select id="adm-filter-location" class="adm-select" data-filter="location">' +
          selectOption('all', 'Tous les types', state.filters.location) +
          selectOption('lab', 'Au laboratoire', state.filters.location) +
          selectOption('home', 'À domicile', state.filters.location) +
        '</select>' +
      '</label>' +
      '<label class="adm-field"><span class="adm-label">Période</span>' +
        '<select id="adm-filter-period" class="adm-select" data-filter="period">' +
          selectOption('all', 'Toute la période', state.filters.period) +
          selectOption('today', 'Aujourd’hui', state.filters.period) +
          selectOption('week', '7 prochains jours', state.filters.period) +
          selectOption('upcoming', 'À venir', state.filters.period) +
          selectOption('past', 'Passés', state.filters.period) +
          selectOption('month', 'Ce mois-ci', state.filters.period) +
        '</select>' +
      '</label>' +
      '<label class="adm-field"><span class="adm-label">Trier par</span>' +
        '<select id="adm-filter-sort" class="adm-select" data-filter="sort">' +
          selectOption('date-asc', 'Date (croissante)', state.filters.sort) +
          selectOption('date-desc', 'Date (décroissante)', state.filters.sort) +
          selectOption('name-asc', 'Patient (A–Z)', state.filters.sort) +
          selectOption('status', 'Statut (en attente d’abord)', state.filters.sort) +
        '</select>' +
      '</label>' +
      '<div class="adm-toolbar-actions">' +
        '<button type="button" class="adm-btn adm-btn-primary" data-action="appointment-create">' + svg('plus') + 'Nouveau rendez-vous</button>' +
        '<button type="button" class="adm-btn adm-btn-secondary" data-action="filter-reset">' + svg('refresh') + 'Réinitialiser</button>' +
      '</div>' +
    '</div>';

    if (!filtered.length) {
      var isFiltered = state.filters.q || state.filters.status !== 'all' || state.filters.location !== 'all' || state.filters.period !== 'all';
      var actions = '<button type="button" class="adm-btn adm-btn-primary" data-action="filter-reset">' + svg('refresh') + 'Réinitialiser les filtres</button>' +
        '<button type="button" class="adm-btn adm-btn-secondary" data-action="reset-demo">' + svg('inbox') + 'Recharger la démo</button>';
      return toolbar + emptyState({
        icon: 'search',
        title: state.simulateEmpty ? 'Aucun rendez-vous dans la démonstration' : (isFiltered ? 'Aucun résultat pour ces filtres' : 'Aucun rendez-vous'),
        text: state.simulateEmpty
          ? 'Le mode « données vides » est actif. Réinitialisez la démonstration pour retrouver les rendez-vous synthétiques.'
          : (isFiltered ? 'Essayez une autre recherche ou réinitialisez les filtres pour afficher tous les rendez-vous.' : 'Le jeu de démonstration ne contient aucun rendez-vous.'),
        actions: actions
      });
    }

    var rows = pageItems.map(function (appointment) {
      var date = parseYmd(appointment.date);
      var analyses = appointment.analyses;
      var extra = analyses.length > 1 ? ' <span class="adm-muted">+' + (analyses.length - 1) + '</span>' : '';
      return '<tr>' +
        '<td data-label="Référence"><span class="adm-ref">' + esc(appointment.reference) + '</span></td>' +
        '<td data-label="Date & heure" class="adm-cell-date"><strong>' + esc(fmtShortDate(date)) + '</strong><span>' + esc(appointment.time + ' – ' + appointment.endTime) + '</span></td>' +
        '<td data-label="Patient" class="adm-cell-patient">' +
          '<span class="adm-avatar ' + avatarClass(appointment.patient.name) + '">' + esc(initials(appointment.patient.name)) + '</span>' +
          '<div class="adm-cell-patient-body"><strong>' + esc(appointment.patient.name) + '</strong><span>' + esc(appointment.patient.phone) + ' · ' + esc(appointment.patient.mutuelle) + '</span></div>' +
        '</td>' +
        '<td data-label="Analyses"><span class="adm-cell-analyses" title="' + esc(analyses.join(', ')) + '">' + esc(analyses[0] || '—') + extra + '</span></td>' +
        '<td data-label="Type">' + typeBadge(appointment) + '</td>' +
        '<td data-label="Statut">' + statusBadge(appointment.status) + '</td>' +
        '<td data-label="Actions" class="adm-cell-actions">' + appointmentActions(appointment) + '</td>' +
      '</tr>';
    }).join('');

    var table = '<div class="adm-card adm-table-card">' +
      '<div class="adm-table-wrap">' +
        '<table class="adm-table">' +
          '<caption class="adm-sr-only">Liste des rendez-vous filtrés</caption>' +
          '<thead><tr>' +
            '<th scope="col">Référence</th>' +
            '<th scope="col">Date &amp; heure</th>' +
            '<th scope="col">Patient</th>' +
            '<th scope="col">Analyses</th>' +
            '<th scope="col">Type</th>' +
            '<th scope="col">Statut</th>' +
            '<th scope="col" class="adm-cell-actions">Actions</th>' +
          '</tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>' +
      pagination(filtered.length, page, totalPages, start, pageItems.length) +
    '</div>';

    return toolbar +
      '<div class="adm-results-head">' +
        '<p class="adm-results-count"><strong>' + filtered.length + '</strong> rendez-vous ' + (filtered.length > 1 ? 'trouvés' : 'trouvé') + '</p>' +
        '<span class="adm-muted">Page ' + page + ' sur ' + totalPages + '</span>' +
      '</div>' +
      table;
  }

  function selectOption(value, label, current) {
    return '<option value="' + value + '"' + (value === current ? ' selected' : '') + '>' + label + '</option>';
  }

  function appointmentActions(appointment) {
    var html = iconAction('view-appt', appointment.id, 'Voir le rendez-vous', 'eye');
    if (appointment.status === 'pending') {
      html += iconAction('confirm-appt', appointment.id, 'Confirmer le rendez-vous', 'check', 'is-success');
    }
    if (appointment.status !== 'cancelled') {
      html += iconAction('reschedule-appt', appointment.id, 'Reprogrammer le rendez-vous', 'calendar');
      html += iconAction('cancel-appt', appointment.id, 'Annuler le rendez-vous', 'x', 'is-danger');
    }
    return html;
  }

  function pagination(total, page, totalPages, start, count) {
    var range = total ? (start + 1) + '–' + (start + count) : '0';
    return '<div class="adm-pagination">' +
      '<span class="adm-pagination-info">Affichage de ' + range + ' sur ' + total + '</span>' +
      '<div class="adm-pagination-controls">' +
        '<button type="button" class="adm-btn adm-btn-secondary adm-btn-sm" data-action="page-prev"' + (page <= 1 ? ' disabled' : '') + '>' + svg('chevronLeft') + 'Précédent</button>' +
        '<span class="adm-page-indicator">Page ' + page + ' / ' + totalPages + '</span>' +
        '<button type="button" class="adm-btn adm-btn-secondary adm-btn-sm" data-action="page-next"' + (page >= totalPages ? ' disabled' : '') + '>Suivant' + svg('chevronRight') + '</button>' +
      '</div>' +
    '</div>';
  }

  function filterAppointments(list) {
    var filters = state.filters;
    var query = norm(String(filters.q || '').trim());
    var result = list.slice();

    if (query) {
      result = result.filter(function (appointment) {
        var haystack = [
          appointment.reference,
          appointment.patient.name,
          appointment.patient.phone,
          appointment.patient.mutuelle,
          appointment.location.zone,
          appointment.analyses.join(' ')
        ].join(' ');
        return norm(haystack).indexOf(query) !== -1;
      });
    }

    if (filters.status !== 'all') {
      result = result.filter(function (appointment) { return appointment.status === filters.status; });
    }

    if (filters.location !== 'all') {
      result = result.filter(function (appointment) { return appointment.location.type === filters.location; });
    }

    if (filters.period !== 'all') {
      var current = today();
      result = result.filter(function (appointment) {
        var date = parseYmd(appointment.date);
        if (filters.period === 'today') {
          return sameDay(date, current);
        }
        if (filters.period === 'week') {
          return date >= current && date < addDays(current, 7);
        }
        if (filters.period === 'upcoming') {
          return date > current;
        }
        if (filters.period === 'past') {
          return date < current;
        }
        if (filters.period === 'month') {
          return date.getFullYear() === current.getFullYear() && date.getMonth() === current.getMonth();
        }
        return true;
      });
    }

    return result.sort(function (a, b) {
      if (filters.sort === 'date-desc') {
        return byDateDesc(a, b);
      }
      if (filters.sort === 'name-asc') {
        return String(a.patient.name).localeCompare(String(b.patient.name), 'fr');
      }
      if (filters.sort === 'status') {
        var orderA = (STATUS[a.status] || STATUS.pending).order;
        var orderB = (STATUS[b.status] || STATUS.pending).order;
        return orderA - orderB || byDateAsc(a, b);
      }
      return byDateAsc(a, b);
    });
  }

  function sectionHeading(title, description, actions) {
    return '<div class="adm-panel-head"><div><h2>' + esc(title) + '</h2><p>' + esc(description) + '</p></div>' +
      (actions ? '<div class="adm-toolbar-actions">' + actions + '</div>' : '') + '</div>';
  }

  function toolbarSearch(id, value, placeholder) {
    return '<div class="adm-toolbar-search">' + svg('search') +
      '<input id="' + id + '" class="adm-input" type="search" value="' + esc(value) + '" placeholder="' + esc(placeholder) + '" autocomplete="off">' +
    '</div>';
  }

  function dossierBadge(dossier) {
    var map = {
      ready: ['is-green', 'Publié'],
      pending: ['is-amber', 'En attente'],
      revoked: ['is-red', 'Révoqué']
    };
    var meta = map[dossier.status] || map.pending;
    return '<span class="adm-badge ' + meta[0] + '">' + meta[1] + '</span>';
  }

  function renderPatients() {
    var patients = DB ? DB.patients.list() : [];
    var appointments = DB ? DB.appointments.list() : [];
    var q = state.patientQuery.trim().toLowerCase();
    var list = patients.filter(function (patient) {
      return !q || (patient.name + ' ' + patient.phone + ' ' + patient.mutuelle).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'fr'); });

    function statsFor(patient) {
      var phone = DB.utils.normalizePhone(patient.phone);
      var related = appointments.filter(function (a) { return DB.utils.normalizePhone(a.patient.phone) === phone; });
      var last = related.slice().sort(byDateDesc)[0];
      return { count: related.length, last: last ? last.date : '—' };
    }

    var rows = list.map(function (patient) {
      var stats = statsFor(patient);
      return '<tr>' +
        '<td><div class="adm-person"><span class="adm-avatar ' + avatarClass(patient.name) + '">' + esc(initials(patient.name)) + '</span><div><strong>' + esc(patient.name) + '</strong><span class="adm-muted">' + esc(patient.id) + '</span></div></div></td>' +
        '<td>' + esc(patient.phone) + '</td>' +
        '<td>' + esc(patient.mutuelle || 'Aucune') + '</td>' +
        '<td>' + stats.count + '</td>' +
        '<td>' + esc(stats.last === '—' ? '—' : fmtShortDate(parseYmd(stats.last))) + '</td>' +
        '<td class="adm-cell-actions">' +
          '<button type="button" class="adm-icon-btn" data-action="patient-view" data-id="' + esc(patient.id) + '" aria-label="Voir ' + esc(patient.name) + '">' + svg('eye') + '</button>' +
          '<button type="button" class="adm-icon-btn" data-action="patient-edit" data-id="' + esc(patient.id) + '" aria-label="Modifier ' + esc(patient.name) + '">' + svg('edit') + '</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    var body = list.length
      ? '<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th>Patient</th><th>Téléphone</th><th>Mutuelle</th><th>RDV</th><th>Dernier RDV</th><th class="adm-cell-actions">Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      : emptyState({ icon: 'users', title: 'Aucun patient', text: q ? 'Aucun patient ne correspond à cette recherche.' : 'Créez le premier patient de la démonstration.', actions: '<button type="button" class="adm-btn adm-btn-primary" data-action="patient-create">' + svg('plus') + 'Ajouter un patient</button>' });

    return '<section class="adm-card adm-card-pad">' +
      sectionHeading('Répertoire patients', list.length + ' patient(s) affiché(s) — données fictives',
        '<button type="button" class="adm-btn adm-btn-primary" data-action="patient-create">' + svg('plus') + 'Nouveau patient</button>') +
      '<div class="adm-toolbar">' + toolbarSearch('adm-patient-search', state.patientQuery, 'Rechercher un nom, téléphone, mutuelle…') + '</div>' +
      body +
    '</section>';
  }

  function renderDossiers() {
    var dossiers = DB ? DB.dossiers.list() : [];
    var q = state.dossierQuery.trim().toLowerCase();
    var list = dossiers.filter(function (dossier) {
      var matchQ = !q || (dossier.id + ' ' + dossier.patientName + ' ' + dossier.phone + ' ' + dossier.analyses.join(' ')).toLowerCase().indexOf(q) >= 0;
      return matchQ && (state.dossierStatus === 'all' || dossier.status === state.dossierStatus);
    });

    var rows = list.map(function (dossier) {
      return '<tr>' +
        '<td><strong>' + esc(dossier.id) + '</strong><span class="adm-muted">' + esc(dossier.patientName) + '</span></td>' +
        '<td>' + esc(dossier.phone || '—') + '</td>' +
        '<td>' + esc(dossier.analyses.join(', ') || '—') + '</td>' +
        '<td>' + esc(fmtShortDate(parseYmd(dossier.sampleDate))) + '</td>' +
        '<td>' + dossierBadge(dossier) + '</td>' +
        '<td><code class="adm-code">' + esc(DB.dossiers.maskCode(dossier.accessCode)) + '</code></td>' +
        '<td class="adm-cell-actions"><button type="button" class="adm-icon-btn" data-action="dossier-view" data-id="' + esc(dossier.id) + '" aria-label="Ouvrir le dossier ' + esc(dossier.id) + '">' + svg('eye') + '</button></td>' +
      '</tr>';
    }).join('');

    var options = ['all', 'ready', 'pending', 'revoked'].map(function (value) {
      var labels = { all: 'Tous', ready: 'Publiés', pending: 'En attente', revoked: 'Révoqués' };
      return '<option value="' + value + '"' + (state.dossierStatus === value ? ' selected' : '') + '>' + labels[value] + '</option>';
    }).join('');

    var body = list.length
      ? '<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th>Dossier</th><th>Téléphone</th><th>Analyses</th><th>Prélèvement</th><th>Statut</th><th>Code</th><th class="adm-cell-actions">Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
      : emptyState({ icon: 'file', title: 'Aucun dossier', text: 'Créez un dossier de résultats fictif pour la démonstration.', actions: '<button type="button" class="adm-btn adm-btn-primary" data-action="dossier-create">' + svg('plus') + 'Créer un dossier</button>' });

    return '<section class="adm-card adm-card-pad">' +
      sectionHeading('Dossiers de résultats', dossiers.length + ' dossier(s) — PDF fictifs stockés dans ce navigateur',
        '<button type="button" class="adm-btn adm-btn-primary" data-action="dossier-create">' + svg('plus') + 'Nouveau dossier</button>') +
      '<div class="adm-toolbar">' + toolbarSearch('adm-dossier-search', state.dossierQuery, 'Rechercher un dossier, patient, analyse…') +
        '<label class="adm-inline-field"><span class="adm-label">Statut</span><select class="adm-select" data-filter="dossier-status">' + options + '</select></label>' +
      '</div>' + body +
    '</section>';
  }

  function renderAnalyses() {
    var analyses = DB ? DB.analyses.list() : [];
    var q = state.analysesQuery.trim().toLowerCase();
    var list = analyses.filter(function (item) {
      return !q || (item.name.fr + ' ' + item.name.ar + ' ' + item.discipline.fr).toLowerCase().indexOf(q) >= 0;
    });
    var rows = list.map(function (item) {
      return '<tr>' +
        '<td><strong>' + esc(item.name.fr) + '</strong><span class="adm-muted" dir="rtl">' + esc(item.name.ar) + '</span></td>' +
        '<td>' + esc(item.discipline.fr) + '</td>' +
        '<td>' + esc(item.price) + ' MAD</td>' +
        '<td>' + (item.fasting === 'yes' ? '<span class="adm-badge is-amber">À jeun</span>' : '—') + '</td>' +
        '<td>' + (item.active !== false ? '<span class="adm-badge is-green">Actif</span>' : '<span class="adm-badge">Inactif</span>') + '</td>' +
        '<td class="adm-cell-actions">' +
          '<button type="button" class="adm-icon-btn" data-action="analysis-edit" data-id="' + esc(item.id) + '" aria-label="Modifier ' + esc(item.name.fr) + '">' + svg('edit') + '</button>' +
          '<button type="button" class="adm-icon-btn" data-action="analysis-delete" data-id="' + esc(item.id) + '" aria-label="Supprimer ' + esc(item.name.fr) + '">' + svg('trash') + '</button>' +
        '</td>' +
      '</tr>';
    }).join('');

    return '<section class="adm-card adm-card-pad">' +
      sectionHeading('Catalogue des analyses', analyses.length + ' examen(s) configuré(s)',
        '<button type="button" class="adm-btn adm-btn-primary" data-action="analysis-create">' + svg('plus') + 'Nouvelle analyse</button>') +
      '<div class="adm-toolbar">' + toolbarSearch('adm-analysis-search', state.analysesQuery, 'Rechercher une analyse…') + '</div>' +
      (list.length
        ? '<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th>Analyse</th><th>Discipline</th><th>Tarif</th><th>Jeûne</th><th>Statut</th><th class="adm-cell-actions">Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
        : emptyState({ icon: 'flask', title: 'Aucune analyse', text: 'Ajoutez une analyse au catalogue.', actions: '<button type="button" class="adm-btn adm-btn-primary" data-action="analysis-create">' + svg('plus') + 'Créer une analyse</button>' })) +
    '</section>';
  }

  function renderMessages() {
    var messages = DB ? DB.messages.list() : [];
    var list = messages.filter(function (message) {
      if (state.messagesFilter === 'unread') return !message.read;
      if (state.messagesFilter === 'archived') return message.status === 'archived';
      return message.status !== 'archived';
    });
    var unread = messages.filter(function (message) { return !message.read; }).length;

    var cards = list.map(function (message) {
      return '<button type="button" class="adm-message' + (message.read ? '' : ' is-unread') + '" data-action="message-view" data-id="' + esc(message.id) + '">' +
        '<span class="adm-message-dot" aria-hidden="true"></span>' +
        '<span class="adm-message-main"><strong>' + esc(message.name) + '</strong><span class="adm-message-subject">' + esc(message.subject || 'Sans objet') + '</span><span class="adm-muted">' + esc(message.body.slice(0, 120)) + (message.body.length > 120 ? '…' : '') + '</span></span>' +
        '<span class="adm-message-meta">' + esc(fmtDateTime(message.createdAt)) + (message.status === 'archived' ? '<span class="adm-badge">Archivé</span>' : '') + '</span>' +
      '</button>';
    }).join('');

    var tabs = [['all', 'Boîte de réception'], ['unread', 'Non lus'], ['archived', 'Archivés']].map(function (pair) {
      return '<button type="button" class="adm-tab' + (state.messagesFilter === pair[0] ? ' is-active' : '') + '" data-action="messages-filter" data-filter-value="' + pair[0] + '">' + pair[1] + '</button>';
    }).join('');

    return '<section class="adm-card adm-card-pad">' +
      sectionHeading('Messages du site', unread + ' message(s) non lu(s)', '<div class="adm-tabs">' + tabs + '</div>') +
      (list.length ? '<div class="adm-message-list">' + cards + '</div>' : emptyState({ icon: 'message', title: 'Aucun message', text: 'Les demandes envoyées depuis le formulaire public apparaîtront ici.' })) +
    '</section>';
  }

  function renderSettings() {
    var settings = DB ? DB.settings.get() : {};
    var field = function (id, label, value, type) {
      return '<label class="adm-field"><span class="adm-label">' + esc(label) + '</span><input id="' + id + '" class="adm-input" type="' + (type || 'text') + '" value="' + esc(value) + '"></label>';
    };
    return '<div class="adm-grid adm-grid-2 adm-gap-lg">' +
      '<section class="adm-card adm-card-pad">' +
        sectionHeading('Informations du laboratoire', 'Affichées sur le site public et les documents') +
        '<form id="adm-settings-form" novalidate>' +
          field('set-lab-name', 'Nom du laboratoire', settings.labName) +
          field('set-biologist', 'Biologiste responsable', settings.biologistName) +
          field('set-phone', 'Téléphone fixe', settings.phone) +
          field('set-whatsapp', 'WhatsApp', settings.whatsapp) +
          field('set-address', 'Adresse', settings.address) +
          field('set-announcement', 'Message d’annonce', settings.announcement) +
          '<div class="adm-form-grid">' + field('set-capacity', 'Capacité par créneau', settings.slotCapacity, 'number') + field('set-max-phone', 'RDV max / téléphone / jour', settings.maxPerPhonePerDay, 'number') + '</div>' +
          '<div class="adm-form-grid">' + field('set-window', 'Fenêtre de réservation (jours)', settings.bookingWindowDays, 'number') + field('set-validity', 'Validité résultats (jours)', settings.resultValidityDays, 'number') + '</div>' +
          '<div class="adm-form-grid">' + field('set-attempts', 'Tentatives avant blocage', settings.maxResultAttempts, 'number') + field('set-lock', 'Durée du blocage (minutes)', settings.resultLockMinutes, 'number') + '</div>' +
          '<p class="adm-form-error" id="adm-settings-error" role="alert" hidden></p>' +
          '<div class="adm-modal-actions adm-mt-14"><button type="submit" class="adm-btn adm-btn-primary">' + svg('check') + 'Enregistrer les paramètres</button></div>' +
        '</form>' +
      '</section>' +
      '<div class="adm-stack">' +
        '<section class="adm-card adm-card-pad" id="adm-pin-card">' +
          sectionHeading('Code PIN administrateur', 'Stocké sous forme de hash SHA-256 dans ce navigateur') +
          '<form id="adm-pin-form" novalidate>' +
            '<label class="adm-field"><span class="adm-label">PIN actuel (démo : derdabi2026)</span><input id="pin-current" class="adm-input" type="password" autocomplete="current-password"></label>' +
            '<label class="adm-field"><span class="adm-label">Nouveau PIN (4 à 12 caractères)</span><input id="pin-next" class="adm-input" type="password" autocomplete="new-password"></label>' +
            '<label class="adm-field"><span class="adm-label">Confirmer le nouveau PIN</span><input id="pin-confirm" class="adm-input" type="password" autocomplete="new-password"></label>' +
            '<p class="adm-form-error" id="adm-pin-error" role="alert" hidden></p>' +
            '<div class="adm-modal-actions adm-mt-14"><button type="submit" class="adm-btn adm-btn-primary">' + svg('key') + 'Changer le PIN</button></div>' +
          '</form>' +
        '</section>' +
        '<section class="adm-card adm-card-pad">' +
          sectionHeading('Zone sensible', 'Actions irréversibles sur la démonstration') +
          '<p class="adm-muted">La réinitialisation restaure les données de démonstration et supprime les dossiers créés.</p>' +
          '<button type="button" class="adm-btn adm-btn-danger adm-mt-14" data-action="reset-confirm">' + svg('refresh') + 'Réinitialiser toute la démonstration</button>' +
        '</section>' +
      '</div>' +
    '</div>';
  }

  function renderAudit() {
    var entries = DB ? DB.audit.list().slice().reverse() : [];
    var rows = entries.slice(0, 300).map(function (entry) {
      return '<tr><td>' + esc(fmtDateTime(entry.at)) + '</td><td>' + esc(entry.actor || '—') + '</td><td><code>' + esc(entry.action) + '</code></td><td>' + esc(entry.entity || '—') + (entry.entityId ? ' · ' + esc(entry.entityId) : '') + '</td><td>' + esc(entry.details || '—') + '</td></tr>';
    }).join('');
    return '<section class="adm-card adm-card-pad">' +
      sectionHeading('Journal d’audit', entries.length + ' entrée(s) — les 300 plus récentes sont affichées') +
      '<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th>Date</th><th>Auteur</th><th>Action</th><th>Entité</th><th>Détail</th></tr></thead><tbody>' +
        (rows || '<tr><td colspan="5">Aucune entrée.</td></tr>') +
      '</tbody></table></div>' +
    '</section>';
  }

  function renderBackup() {
    var payload = DB ? DB.exportAll() : { data: {} };
    var counts = payload.data || {};
    var size = 0;
    try { size = JSON.stringify(payload).length; } catch (error) { size = 0; }
    return '<div class="adm-grid adm-grid-2 adm-gap-lg">' +
      '<section class="adm-card adm-card-pad">' +
        sectionHeading('Exporter les données', 'Sauvegarde JSON locale, sans les fichiers PDF') +
        '<p class="adm-muted">' + Object.keys(counts).map(function (name) { return esc(name) + ' : ' + (Array.isArray(counts[name]) ? counts[name].length : '—'); }).join(' · ') + '</p>' +
        '<p class="adm-muted">Taille estimée de l’export : ' + Math.ceil(size / 1024) + ' Ko.</p>' +
        '<button type="button" class="adm-btn adm-btn-primary adm-mt-14" data-action="backup-export">' + svg('download') + 'Télécharger la sauvegarde JSON</button>' +
      '</section>' +
      '<section class="adm-card adm-card-pad">' +
        sectionHeading('Importer une sauvegarde', 'Remplace les données actuelles') +
        '<p class="adm-muted">Sélectionnez un fichier JSON exporté depuis cette démonstration. Attention : les PDF ne sont pas inclus dans les sauvegardes JSON, ils ne sont pas restaurés par l’import.</p>' +
        '<input type="file" id="adm-import-file" class="adm-input adm-mt-14" accept="application/json,.json">' +
        '<p class="adm-form-error" id="adm-import-error" role="alert" hidden></p>' +
        '<button type="button" class="adm-btn adm-btn-secondary adm-mt-14" data-action="backup-import">' + svg('upload') + 'Importer le fichier</button>' +
      '</section>' +
      '<section class="adm-card adm-card-pad">' +
        sectionHeading('Réinitialiser', 'Retour aux données de démonstration d’origine') +
        '<p class="adm-muted">Les rendez-vous, patients, dossiers, messages et journaux créés seront supprimés.</p>' +
        '<button type="button" class="adm-btn adm-btn-danger adm-mt-14" data-action="reset-confirm">' + svg('refresh') + 'Réinitialiser la démonstration</button>' +
      '</section>' +
      '<section class="adm-card adm-card-pad">' +
        sectionHeading('Limites de la démonstration', 'À rappeler pendant la soutenance') +
        '<ul class="adm-list">' +
          '<li>Les données restent dans ce navigateur et ne sont pas partagées entre appareils.</li>' +
          '<li>Les PDF sont stockés localement (IndexedDB) et ne sont pas inclus dans l’export JSON.</li>' +
          '<li>Le PIN et le chiffrement sont pédagogiques : ce n’est pas une sécurité de production.</li>' +
        '</ul>' +
      '</section>' +
    '</div>';
  }

  function renderStatistics() {
    var all = effectiveAppointments();
    var period = state.statsPeriod;
    var current = today();
    var from = period === 'all' ? null : addDays(current, -(Number(period) - 1));
    var list = all.filter(function (appointment) {
      var date = parseYmd(appointment.date);
      if (date > current) {
        return false;
      }
      return !from || date >= from;
    });
    // Rendez-vous actifs : annulés exclus des indicateurs de volume
    // (analyses, zones, répartition laboratoire/domicile).
    var active = list.filter(function (appointment) { return appointment.status !== 'cancelled'; });

    var tabs = '<div class="adm-tabs" role="group" aria-label="Période analysée">' +
      statsTab(30, '30 jours') +
      statsTab(90, '90 jours') +
      statsTab('all', 'Tout') +
    '</div>';

    var heading = '<div class="adm-panel-head">' +
      '<div><h2>Statistiques</h2><p>Période analysée : ' + esc(period === 'all' ? 'tout l’historique de démonstration' : 'les ' + period + ' derniers jours') + '.</p></div>' +
      tabs +
    '</div>';

    if (!list.length) {
      return heading + emptyState({
        icon: 'activity',
        title: 'Aucune donnée sur cette période',
        text: 'Aucun rendez-vous passé n’est disponible pour la période sélectionnée. Élargissez la période ou réinitialisez la démonstration.',
        actions: '<button type="button" class="adm-btn adm-btn-primary" data-action="stats-period" data-days="all">' + svg('activity') + 'Voir tout l’historique</button>' +
          '<button type="button" class="adm-btn adm-btn-secondary" data-action="reset-demo">' + svg('refresh') + 'Réinitialiser la démo</button>'
      });
    }

    var counts = countStatus(list);
    var confirmedRate = counts.total
      ? Math.round(((counts.confirmed + counts.completed) / counts.total) * 100)
      : 0;
    var homeRate = counts.total ? Math.round((counts.home / counts.total) * 100) : 0;
    var avgAnalyses = counts.total ? (counts.analyses / counts.total).toFixed(1).replace('.', ',') : '0';

    var patients = DB && DB.patients ? DB.patients.list() : [];
    var dossiers = DB && DB.dossiers ? DB.dossiers.list() : [];
    var messages = DB && DB.messages ? DB.messages.list() : [];
    var views = DB && DB.pageViews ? DB.pageViews.list() : [];
    var summaryCounts = DB && DB.summary ? DB.summary() : { viewsToday: 0 };
    var periodEnd = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 23, 59, 59);

    function inPeriod(iso) {
      if (!iso) return from === null;
      var date = new Date(iso);
      if (isNaN(date.getTime())) return false;
      return !from || (date >= from && date <= periodEnd);
    }

    var patientsOnPeriod = patients.filter(function (patient) { return inPeriod(patient.createdAt); }).length;
    var dossiersOnPeriod = dossiers.filter(function (dossier) { return inPeriod(dossier.createdAt); }).length;
    var unreadMessages = messages.filter(function (message) { return !message.read; }).length;
    var viewsTotal = views.reduce(function (sum, view) { return sum + (Number(view && view.count) || 0); }, 0);

    var statGrid = '<div class="adm-stat-grid adm-gap-lg">' +
      '<div class="adm-stat"><div class="adm-stat-value">' + counts.total + '</div><div class="adm-stat-label">Rendez-vous sur la période</div><div class="adm-stat-note">' + esc(period === 'all' ? 'tout l’historique' : period + ' derniers jours') + '</div></div>' +
      '<div class="adm-stat"><div class="adm-stat-value">' + confirmedRate + '%</div><div class="adm-stat-label">Taux de confirmation</div><div class="adm-stat-note">' + (counts.confirmed + counts.completed) + ' confirmés ou terminés</div></div>' +
      '<div class="adm-stat"><div class="adm-stat-value">' + counts.home + '</div><div class="adm-stat-label">Prélèvements à domicile</div><div class="adm-stat-note">' + homeRate + '% des rendez-vous</div></div>' +
      '<div class="adm-stat"><div class="adm-stat-value">' + esc(avgAnalyses) + '</div><div class="adm-stat-label">Analyses par rendez-vous</div><div class="adm-stat-note">' + counts.analyses + ' lignes au total</div></div>' +
      '<div class="adm-stat"><div class="adm-stat-value">' + patientsOnPeriod + '</div><div class="adm-stat-label">Nouveaux patients</div><div class="adm-stat-note">' + patients.length + ' patients au total</div></div>' +
      '<div class="adm-stat"><div class="adm-stat-value">' + dossiersOnPeriod + '</div><div class="adm-stat-label">Nouveaux dossiers</div><div class="adm-stat-note">' + dossiers.length + ' dossiers au total</div></div>' +
      '<div class="adm-stat"><div class="adm-stat-value">' + unreadMessages + '</div><div class="adm-stat-label">Messages non lus</div><div class="adm-stat-note">depuis la création de la démo</div></div>' +
      '<div class="adm-stat"><div class="adm-stat-value">' + (Number(summaryCounts.viewsToday) || 0) + '</div><div class="adm-stat-label">Vues du site aujourd’hui</div><div class="adm-stat-note">' + viewsTotal + ' vues enregistrées au total</div></div>' +
    '</div>';

    var series = appointmentSeries(all);
    var seriesTotal = series.items.reduce(function (sum, item) { return sum + item.count; }, 0);
    var activityCard = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head">' +
        '<div><h2>Rendez-vous dans le temps</h2><p>Rendez-vous actifs (annulés exclus) · ' + seriesTotal + ' sur la période affichée</p></div>' +
        '<div class="adm-tabs" role="group" aria-label="Granularité du graphique">' +
          chartTab('day', 'Jour') + chartTab('week', 'Semaine') + chartTab('month', 'Mois') +
        '</div>' +
      '</div>' +
      svgBarChart(series.items, {
        ariaLabel: 'Nombre de rendez-vous actifs par ' + (series.mode === 'day' ? 'jour sur les 14 derniers jours' : series.mode === 'week' ? 'semaine sur les 8 dernières semaines' : 'mois sur les 12 derniers mois'),
        emptyText: 'Aucun rendez-vous actif sur la période affichée.'
      }) +
      '<p class="adm-chart-caption">' + esc(series.caption) + '</p>' +
    '</section>';

    var segments = [
      { key: 'confirmed', label: 'Confirmés', count: counts.confirmed, color: '#059669' },
      { key: 'completed', label: 'Terminés', count: counts.completed, color: '#0E8F8A' },
      { key: 'pending', label: 'En attente', count: counts.pending, color: '#D97706' },
      { key: 'cancelled', label: 'Annulés', count: counts.cancelled, color: '#DC2626' }
    ];
    var percents = distributionPercents(segments);
    var donutCard = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head"><div><h2>Répartition des statuts</h2><p>' + counts.total + ' rendez-vous analysés</p></div></div>' +
      '<div class="adm-donut">' +
        svgDonut(segments, counts.total) +
        donutLegend(segments, percents, counts.total) +
      '</div>' +
      '<p class="adm-chart-caption">Somme des parts : 100 % de ' + counts.total + ' rendez-vous.</p>' +
    '</section>';

    var labCount = active.filter(function (appointment) { return !appointment.location || appointment.location.type !== 'home'; }).length;
    var homeCount = active.length - labCount;
    var splitCard = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head"><div><h2>Laboratoire vs domicile</h2><p>' + active.length + ' rendez-vous actifs sur la période</p></div></div>' +
      '<div class="adm-splitbar" role="img" aria-label="Répartition : ' + labCount + ' au laboratoire, ' + homeCount + ' à domicile sur ' + active.length + ' rendez-vous actifs">' +
        '<span class="is-lab" style="width:' + (active.length ? Math.round((labCount / active.length) * 100) : 0) + '%"></span>' +
        '<span class="is-home" style="width:' + (active.length ? Math.round((homeCount / active.length) * 100) : 0) + '%"></span>' +
      '</div>' +
      '<div class="adm-split-legend">' +
        '<span>' + svg('building') + 'Au laboratoire : <strong>' + labCount + '</strong></span>' +
        '<span>' + svg('home') + 'À domicile : <strong>' + homeCount + '</strong></span>' +
      '</div>' +
      '<p class="adm-chart-caption">Rendez-vous annulés exclus du calcul.</p>' +
    '</section>';

    var analysisMap = {};
    active.forEach(function (appointment) {
      (appointment.analyses || []).forEach(function (name) {
        analysisMap[name] = (analysisMap[name] || 0) + 1;
      });
    });
    var topAnalyses = Object.keys(analysisMap).map(function (name) {
      return { name: name, count: analysisMap[name] };
    }).sort(function (a, b) {
      return b.count - a.count || a.name.localeCompare(b.name, 'fr');
    }).slice(0, 6);
    var topMax = topAnalyses.length ? topAnalyses[0].count : 1;

    var analysesCard = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head"><div><h2>Analyses les plus demandées</h2><p>Top 6 sur la période analysée — annulés exclus</p></div></div>' +
      '<div class="adm-bars">' +
        (topAnalyses.length
          ? topAnalyses.map(function (item) { return rankRow(item.name, item.count, topMax); }).join('')
          : emptyInline('Aucune analyse', 'Aucune analyse n’est associée à cette période.')) +
      '</div>' +
    '</section>';

    var zoneMap = {};
    active.filter(function (appointment) {
      return appointment.location && appointment.location.type === 'home';
    }).forEach(function (appointment) {
      var zone = appointment.location.zone || 'Zone non précisée';
      zoneMap[zone] = (zoneMap[zone] || 0) + 1;
    });
    var zones = Object.keys(zoneMap).map(function (zone) {
      return { zone: zone, count: zoneMap[zone] };
    }).sort(function (a, b) {
      return b.count - a.count || a.zone.localeCompare(b.zone, 'fr');
    });
    var zoneMax = zones.length ? zones[0].count : 1;

    var zonesCard = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head"><div><h2>Prélèvements à domicile par zone</h2><p>' + active.filter(function (appointment) { return appointment.location && appointment.location.type === 'home'; }).length + ' déplacements sur la période — annulés exclus</p></div></div>' +
      '<div class="adm-bars">' +
        (zones.length
          ? zones.map(function (item) { return rankRow(item.zone, item.count, zoneMax); }).join('')
          : emptyInline('Aucun déplacement', 'Aucun prélèvement à domicile sur cette période.')) +
      '</div>' +
    '</section>';

    var growth = patientGrowthSeries(patients, from, current);
    var growthCard = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head"><div><h2>Croissance du fichier patients</h2><p>Patients cumulés par mois (créés depuis le site ou l’administration)</p></div></div>' +
      svgLineChart(growth.points, {
        ariaLabel: 'Nombre cumulé de patients par mois, de ' + esc(growth.points[0].label) + ' à ' + esc(growth.points[growth.points.length - 1].label),
        emptyText: 'Aucun patient enregistré sur la période.'
      }) +
      '<p class="adm-chart-caption">Total actuel : ' + patients.length + ' patients. Les fiches sans date de création sont comptées comme antérieures à la période.</p>' +
    '</section>';

    var viewItems = pageViewSeries(views, current);
    var viewsTotal30 = viewItems.reduce(function (sum, item) { return sum + item.count; }, 0);
    var viewsCard = '<section class="adm-card adm-card-pad">' +
      '<div class="adm-panel-head"><div><h2>Visites du site public</h2><p><strong>' + (Number(summaryCounts.viewsToday) || 0) + '</strong> vues aujourd’hui · ' + viewsTotal30 + ' vues sur les 30 derniers jours</p></div></div>' +
      svgBarChart(viewItems, {
        ariaLabel: 'Nombre de visites du site public par jour sur les 30 derniers jours',
        emptyText: 'Aucune visite enregistrée sur les 30 derniers jours.',
        labelEvery: 5
      }) +
      '<p class="adm-chart-caption">Compteur local de la démonstration (page d’accueil du site public).</p>' +
    '</section>';

    return heading + statGrid +
      '<div class="adm-grid adm-grid-2 adm-gap-lg">' + activityCard + donutCard + '</div>' +
      '<div class="adm-grid adm-grid-2 adm-gap-lg">' + splitCard + growthCard + '</div>' +
      '<div class="adm-grid adm-grid-2 adm-gap-lg">' + analysesCard + zonesCard + '</div>' +
      '<div class="adm-grid adm-grid-2 adm-gap-lg">' + viewsCard + '</div>';
  }

  function statsTab(days, label) {
    var isActive = String(state.statsPeriod) === String(days);
    return '<button type="button" class="adm-tab' + (isActive ? ' is-active' : '') + '" data-action="stats-period" data-days="' + days + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' + label + '</button>';
  }

  function chartTab(mode, label) {
    var isActive = (state.statsChartMode || 'day') === mode;
    return '<button type="button" class="adm-tab' + (isActive ? ' is-active' : '') + '" data-action="stats-chart-mode" data-mode="' + mode + '" aria-pressed="' + (isActive ? 'true' : 'false') + '">' + label + '</button>';
  }

  /* Répartition des pourcentages : la somme vaut toujours 100 (méthode du
     plus grand reste simplifiée — l'écart d'arrondi est reporté sur la
     part la plus élevée). */
  function distributionPercents(segments) {
    var total = segments.reduce(function (sum, segment) { return sum + segment.count; }, 0);
    var percents = segments.map(function (segment) {
      return total ? Math.round((segment.count / total) * 100) : 0;
    });
    var diff = 100 - percents.reduce(function (sum, value) { return sum + value; }, 0);
    if (diff !== 0 && percents.length) {
      var maxIndex = 0;
      percents.forEach(function (value, index) {
        if (value > percents[maxIndex]) maxIndex = index;
      });
      percents[maxIndex] += diff;
    }
    return percents;
  }

  function countAppointmentsBetween(list, start, end) {
    var count = 0;
    list.forEach(function (appointment) {
      var date = parseYmd(appointment.date);
      if (!isNaN(date.getTime()) && date >= start && date <= end && appointment.status !== 'cancelled') {
        count += 1;
      }
    });
    return count;
  }

  function appointmentSeries(list) {
    var mode = state.statsChartMode || 'day';
    var current = today();
    var items = [];
    var caption = '';
    var i;
    var start;
    var end;
    var count;
    if (mode === 'week') {
      start = addDays(current, -((current.getDay() + 6) % 7) - 49);
      for (i = 0; i < 8; i += 1) {
        var weekStart = addDays(start, i * 7);
        var weekEnd = addDays(weekStart, 6);
        count = countAppointmentsBetween(list, weekStart, weekEnd);
        items.push({
          label: cap(new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(weekStart)),
          count: count,
          isToday: i === 7,
          title: 'Semaine du ' + new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(weekStart) + ' : ' + count + ' rendez-vous'
        });
      }
      caption = '8 dernières semaines, une barre par semaine (semaine en cours incluse).';
    } else if (mode === 'month') {
      var firstMonth = new Date(current.getFullYear(), current.getMonth() - 11, 1);
      for (i = 0; i < 12; i += 1) {
        var monthStart = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + i, 1);
        var monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        count = countAppointmentsBetween(list, monthStart, monthEnd);
        items.push({
          label: monthLabel(monthStart),
          count: count,
          isToday: i === 11,
          title: cap(fmtMonth(monthStart)) + ' : ' + count + ' rendez-vous'
        });
      }
      caption = '12 derniers mois, une barre par mois (mois en cours inclus).';
    } else {
      for (i = 13; i >= 0; i -= 1) {
        var day = addDays(current, -i);
        var dayStr = ymd(day);
        var dayCount = list.filter(function (appointment) {
          return appointment.date === dayStr && appointment.status !== 'cancelled';
        }).length;
        items.push({
          label: String(day.getDate()),
          count: dayCount,
          isToday: i === 0,
          title: fmtLongDate(day) + ' : ' + dayCount + ' rendez-vous'
        });
      }
      caption = '14 derniers jours, une barre par jour — aujourd’hui en corail.';
    }
    return { mode: mode, items: items, caption: caption };
  }

  function monthLabel(date) {
    var label = new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(date);
    label = label.replace(/\./g, '');
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function pageViewSeries(views, current) {
    var byDate = {};
    views.forEach(function (view) {
      if (view && view.date) byDate[view.date] = Number(view.count) || 0;
    });
    var items = [];
    for (var i = 29; i >= 0; i -= 1) {
      var day = addDays(current, -i);
      var dayStr = ymd(day);
      var count = byDate[dayStr] || 0;
      items.push({
        label: String(day.getDate()),
        count: count,
        isToday: i === 0,
        title: fmtLongDate(day) + ' : ' + count + ' visites'
      });
    }
    return items;
  }

  function patientGrowthSeries(patients, from, current) {
    var endMonth = new Date(current.getFullYear(), current.getMonth(), 1);
    var months = [];
    var cursor = endMonth;
    var i;
    for (i = 0; i < 12; i += 1) {
      months.unshift(cursor);
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    }
    if (from) {
      var startMonth = new Date(from.getFullYear(), from.getMonth(), 1);
      while (months.length > 1 && months[0] < startMonth) {
        months.shift();
      }
    }
    var created = [];
    var unknown = 0;
    patients.forEach(function (patient) {
      var date = patient.createdAt ? new Date(patient.createdAt) : null;
      if (date && !isNaN(date.getTime())) {
        created.push(date);
      } else {
        // Fiche sans date de création : comptée comme antérieure à la période.
        unknown += 1;
      }
    });
    var running = unknown + created.filter(function (date) { return date < months[0]; }).length;
    var points = [{ label: monthLabel(months[0]), value: running }];
    months.forEach(function (month) {
      created.forEach(function (date) {
        if (date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()) {
          running += 1;
        }
      });
      points.push({ label: monthLabel(month), value: running });
    });
    return { points: points, total: patients.length };
  }

  /* Graphique en barres SVG minimaliste, sans librairie externe.
     items : [{ label, count, title, isToday }] */
  function svgBarChart(items, options) {
    options = options || {};
    var width = 720;
    var height = 190;
    var padTop = 18;
    var padBottom = 24;
    var padX = 4;
    var plotHeight = height - padTop - padBottom;
    var max = 1;
    var total = 0;
    items.forEach(function (item) {
      if (item.count > max) max = item.count;
      total += item.count;
    });
    var html = '<svg class="adm-svg-chart" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(options.ariaLabel || 'Graphique en barres') + '">';
    if (!total) {
      html += '<text x="' + (width / 2) + '" y="' + (height / 2) + '" text-anchor="middle" class="adm-svg-empty">' + esc(options.emptyText || 'Aucune donnée sur la période.') + '</text>';
      return html + '</svg>';
    }
    var slot = (width - padX * 2) / items.length;
    var barWidth = Math.min(38, slot * 0.62);
    items.forEach(function (item, index) {
      var x = padX + slot * index + (slot - barWidth) / 2;
      var barHeight = item.count > 0 ? Math.max(3, Math.round((item.count / max) * plotHeight)) : 0;
      var y = padTop + plotHeight - barHeight;
      html += '<rect class="adm-svg-bar' + (item.isToday ? ' is-today' : '') + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + barHeight + '" rx="3"><title>' + esc(item.title || (item.label + ' : ' + item.count)) + '</title></rect>';
      if (item.count > 0 && barHeight > 14) {
        html += '<text x="' + (x + barWidth / 2).toFixed(1) + '" y="' + (y - 5).toFixed(1) + '" text-anchor="middle" class="adm-svg-value">' + item.count + '</text>';
      }
      var labelEvery = options.labelEvery || (items.length <= 14 ? 2 : 5);
      if (index % labelEvery === 0 || item.isToday) {
        html += '<text x="' + (x + barWidth / 2).toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle" class="adm-svg-label">' + esc(item.label) + '</text>';
      }
    });
    return html + '</svg>';
  }

  /* Anneau de répartition (segments en arc de cercle, stroke-dasharray). */
  function svgDonut(segments, total) {
    var size = 150;
    var center = size / 2;
    var radius = 56;
    var circumference = 2 * Math.PI * radius;
    var html = '<svg class="adm-svg-donut" viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Répartition des ' + total + ' rendez-vous par statut : ' +
      segments.map(function (segment) { return segment.label.toLowerCase() + ' ' + segment.count; }).join(', ') + '">';
    html += '<circle cx="' + center + '" cy="' + center + '" r="' + radius + '" fill="none" stroke="#EEF4F7" stroke-width="17"/>';
    if (total > 0) {
      var offset = 0;
      segments.forEach(function (segment) {
        if (segment.count <= 0) return;
        var fraction = segment.count / total;
        var dash = fraction * circumference;
        html += '<circle cx="' + center + '" cy="' + center + '" r="' + radius + '" fill="none" stroke="' + segment.color + '" stroke-width="17" ' +
          'stroke-dasharray="' + dash.toFixed(2) + ' ' + (circumference - dash).toFixed(2) + '" ' +
          'stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 ' + center + ' ' + center + ')">' +
          '<title>' + esc(segment.label + ' : ' + segment.count + ' (' + Math.round(fraction * 100) + '%)') + '</title></circle>';
        offset += dash;
      });
    } else {
      html += '<text x="' + center + '" y="' + (center + 4) + '" text-anchor="middle" class="adm-svg-empty">Aucune donnée</text>';
    }
    if (total > 0) {
      html += '<text x="' + center + '" y="' + (center - 2) + '" text-anchor="middle" class="adm-svg-donut-total">' + total + '</text>';
      html += '<text x="' + center + '" y="' + (center + 16) + '" text-anchor="middle" class="adm-svg-donut-caption">rendez-vous</text>';
    }
    return html + '</svg>';
  }

  function donutLegend(segments, percents, total) {
    return '<ul class="adm-legend">' + segments.map(function (segment, index) {
      return '<li>' +
        '<span class="adm-legend-dot" style="background:' + segment.color + '"></span>' +
        '<span class="adm-legend-label">' + esc(segment.label) + '</span>' +
        '<strong>' + segment.count + ' · ' + percents[index] + '%</strong>' +
      '</li>';
    }).join('') + '</ul>';
  }

  /* Courbe d'évolution (polyline + aire) pour la croissance patients. */
  function svgLineChart(points, options) {
    options = options || {};
    var width = 720;
    var height = 190;
    var padTop = 18;
    var padBottom = 24;
    var padLeft = 36;
    var padRight = 12;
    var plotWidth = width - padLeft - padRight;
    var plotHeight = height - padTop - padBottom;
    var maxValue = 1;
    points.forEach(function (point) {
      if (point.value > maxValue) maxValue = point.value;
    });
    var html = '<svg class="adm-svg-chart" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(options.ariaLabel || 'Évolution cumulée') + '">';
    if (!points.length || points.every(function (point) { return !point.value; })) {
      html += '<text x="' + (width / 2) + '" y="' + (height / 2) + '" text-anchor="middle" class="adm-svg-empty">' + esc(options.emptyText || 'Aucune donnée sur la période.') + '</text>';
      return html + '</svg>';
    }
    var step = points.length > 1 ? plotWidth / (points.length - 1) : 0;
    var coords = points.map(function (point, index) {
      var x = padLeft + step * index;
      var y = padTop + plotHeight - (point.value / maxValue) * plotHeight;
      return { x: x, y: y, point: point };
    });
    var line = coords.map(function (coord, index) {
      return (index === 0 ? 'M' : 'L') + coord.x.toFixed(1) + ' ' + coord.y.toFixed(1);
    }).join(' ');
    var area = line + ' L' + coords[coords.length - 1].x.toFixed(1) + ' ' + (padTop + plotHeight).toFixed(1) +
      ' L' + coords[0].x.toFixed(1) + ' ' + (padTop + plotHeight).toFixed(1) + ' Z';
    html += '<path class="adm-svg-area" d="' + area + '"/>';
    html += '<path class="adm-svg-line" d="' + line + '"/>';
    var labelEvery = Math.ceil(points.length / 7);
    coords.forEach(function (coord, index) {
      html += '<circle class="adm-svg-dot" cx="' + coord.x.toFixed(1) + '" cy="' + coord.y.toFixed(1) + '" r="3.5"><title>' + esc(coord.point.label + ' : ' + coord.point.value + ' patients') + '</title></circle>';
      if (index % labelEvery === 0 || index === coords.length - 1) {
        html += '<text x="' + coord.x.toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle" class="adm-svg-label">' + esc(coord.point.label) + '</text>';
      }
    });
    html += '<text x="' + (padLeft - 6) + '" y="' + (padTop + 4) + '" text-anchor="end" class="adm-svg-axis">' + maxValue + '</text>';
    return html + '</svg>';
  }

  function summaryHtml(appointment) {
    return '<div class="adm-summary"><dl>' +
      '<dt>Référence</dt><dd>' + esc(appointment.reference) + '</dd>' +
      '<dt>Date</dt><dd>' + esc(fmtLongDate(parseYmd(appointment.date))) + '</dd>' +
      '<dt>Heure</dt><dd>' + esc(appointment.time + ' – ' + appointment.endTime) + '</dd>' +
      '<dt>Patient</dt><dd>' + esc(appointment.patient.name) + '</dd>' +
      '<dt>Type</dt><dd>' + esc(appointment.location.type === 'home' ? 'Domicile — ' + appointment.location.zone : 'Au laboratoire') + '</dd>' +
    '</dl></div>';
  }

  function openModal(options) {
    var root = document.getElementById('adm-modal-root');
    state.modalReturnFocus = document.activeElement;
    state.modalOpen = true;
    root.innerHTML = '<div class="adm-modal-overlay" data-action="modal-backdrop">' +
      '<div class="adm-modal' + (options.wide ? ' is-wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="adm-modal-title" aria-describedby="adm-modal-subtitle" tabindex="-1">' +
        '<div class="adm-modal-head">' +
          '<div>' +
            '<h2 id="adm-modal-title">' + esc(options.title) + '</h2>' +
            '<p id="adm-modal-subtitle">' + esc(options.subtitle || '') + '</p>' +
          '</div>' +
          '<button type="button" class="adm-icon-btn" data-action="modal-close" aria-label="Fermer la fenêtre">' + svg('close') + '</button>' +
        '</div>' +
        '<div class="adm-modal-body">' + options.body + '</div>' +
        (options.footer ? '<div class="adm-modal-foot">' + options.footer + '</div>' : '') +
      '</div>' +
    '</div>';
    document.body.classList.add('adm-modal-open');
    var dialog = root.querySelector('.adm-modal');
    if (dialog) {
      dialog.focus();
    }
  }

  function closeModal() {
    var root = document.getElementById('adm-modal-root');
    if (!root || !state.modalOpen) {
      return;
    }
    root.innerHTML = '';
    document.body.classList.remove('adm-modal-open');
    state.modalOpen = false;
    state.modalRecord = null;
    var target = state.modalReturnFocus;
    state.modalReturnFocus = null;
    if (target && typeof target.focus === 'function' && document.body.contains(target)) {
      try {
        target.focus();
      } catch (error) {
        /* ignore */
      }
    }
  }

  function openDetails(id) {
    var appointment = findAppointment(id);
    if (!appointment) {
      return;
    }
    state.modalRecord = { kind: 'appointment', id: appointment.id };
    var settingsData = DB ? DB.settings.get() : {};
    var labAddress = settingsData.labAddress || settingsData.address || 'Avenue des FAR, Tétouan';
    var events = appointment.events.slice().sort(function (a, b) {
      return new Date(a.at) - new Date(b.at);
    }).map(function (event) {
      var eventClass = event.type === 'cancelled' ? ' is-cancelled' : (event.type === 'created' ? ' is-created' : '');
      return '<li class="' + eventClass + '">' +
        '<div class="adm-timeline-label">' + esc(event.label) + '</div>' +
        '<div class="adm-timeline-date">' + esc(fmtDateTime(event.at)) + '</div>' +
        (event.note ? '<div class="adm-timeline-note">' + esc(event.note) + '</div>' : '') +
      '</li>';
    }).join('');

    var body = '<div class="adm-detail-top">' +
        '<div>' +
          '<span class="adm-ref">' + esc(appointment.reference) + '</span>' +
          '<strong>' + esc(fmtLongDate(parseYmd(appointment.date))) + '</strong>' +
          '<span class="adm-detail-date">' + esc(appointment.time + ' – ' + appointment.endTime) + ' · ' + esc(typeLabel(appointment)) + '</span>' +
        '</div>' +
        statusBadge(appointment.status) +
      '</div>' +
      '<div class="adm-detail-grid">' +
        '<div><span class="adm-label">Patient</span><strong>' + esc(appointment.patient.name) + '</strong></div>' +
        '<div><span class="adm-label">Téléphone</span><strong>' + esc(appointment.patient.phone) + '</strong></div>' +
        '<div><span class="adm-label">Mutuelle</span><strong>' + esc(appointment.patient.mutuelle) + '</strong></div>' +
        '<div><span class="adm-label">Lieu</span><strong>' + esc(appointment.location.type === 'home' ? 'Domicile — ' + appointment.location.zone : 'Laboratoire — ' + labAddress) + '</strong></div>' +
      '</div>' +
      '<div class="adm-detail-block">' +
        '<span class="adm-label">Analyses demandées</span>' +
        '<ul class="adm-chip-list">' + appointment.analyses.map(function (name) {
          return '<li class="adm-chip">' + esc(name) + '</li>';
        }).join('') + '</ul>' +
      '</div>' +
      (appointment.notes ? '<div class="adm-detail-block"><span class="adm-label">Notes internes</span><p>' + esc(appointment.notes) + '</p></div>' : '') +
      '<div class="adm-detail-block"><span class="adm-label">Historique</span><ol class="adm-timeline">' + events + '</ol></div>';

    var footer = '';
    footer += '<button type="button" class="adm-btn adm-btn-secondary" data-action="appt-voucher" data-id="' + esc(appointment.id) + '">' + svg('download') + 'Bon de rendez-vous (PDF A4)</button>';
    if (appointment.status === 'pending') {
      footer += '<button type="button" class="adm-btn adm-btn-primary" data-action="confirm-appt" data-id="' + esc(appointment.id) + '">' + svg('check') + 'Confirmer</button>';
    }
    if (appointment.status !== 'cancelled') {
      footer += '<button type="button" class="adm-btn adm-btn-secondary" data-action="reschedule-appt" data-id="' + esc(appointment.id) + '">' + svg('calendar') + 'Reprogrammer</button>';
      footer += '<button type="button" class="adm-btn adm-btn-danger" data-action="cancel-appt" data-id="' + esc(appointment.id) + '">' + svg('x') + 'Annuler</button>';
    }
    footer += '<button type="button" class="adm-btn adm-btn-ghost" data-action="delete-confirm" data-kind="appointment" data-id="' + esc(appointment.id) + '">' + svg('trash') + 'Supprimer</button>';
    footer += '<button type="button" class="adm-btn adm-btn-ghost" data-action="modal-close">Fermer</button>';

    openModal({
      title: 'Détail du rendez-vous',
      subtitle: appointment.reference + ' · ' + appointment.patient.name,
      wide: true,
      body: body,
      footer: footer
    });
  }

  function openConfirm(id) {
    var appointment = findAppointment(id);
    if (!appointment) {
      return;
    }
    openModal({
      title: 'Confirmer le rendez-vous',
      subtitle: appointment.reference,
      body: '<p class="adm-modal-copy">Vous êtes sur le point de confirmer le rendez-vous de <strong>' + esc(appointment.patient.name) + '</strong>.</p>' +
        summaryHtml(appointment) +
        '<p class="adm-form-note">Cette action met à jour le statut et ajoute une entrée dans l’historique du rendez-vous.</p>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Retour</button>' +
        '<button type="button" class="adm-btn adm-btn-primary" data-action="do-confirm" data-id="' + esc(appointment.id) + '">' + svg('check') + 'Confirmer le rendez-vous</button>'
    });
  }

  function openCancel(id) {
    var appointment = findAppointment(id);
    if (!appointment) {
      return;
    }
    openModal({
      title: 'Annuler le rendez-vous',
      subtitle: appointment.reference,
      body: '<p class="adm-modal-copy">Confirmez-vous l’annulation du rendez-vous de <strong>' + esc(appointment.patient.name) + '</strong> ?</p>' +
        summaryHtml(appointment) +
        '<div class="adm-field adm-mt-14">' +
          '<label class="adm-label" for="adm-cancel-reason">Motif de l’annulation (optionnel)</label>' +
          '<select id="adm-cancel-reason" class="adm-select">' +
            '<option value="">Non précisé</option>' +
            '<option value="Patient indisponible">Patient indisponible</option>' +
            '<option value="Report à une date ultérieure">Report à une date ultérieure</option>' +
            '<option value="Erreur de saisie">Erreur de saisie</option>' +
            '<option value="Autre">Autre</option>' +
          '</select>' +
        '</div>' +
        '<p class="adm-form-note">Le rendez-vous restera visible dans l’historique avec le statut « Annulé ».</p>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Retour</button>' +
        '<button type="button" class="adm-btn adm-btn-danger" data-action="do-cancel" data-id="' + esc(appointment.id) + '">' + svg('x') + 'Confirmer l’annulation</button>'
    });
  }

  function openReschedule(id) {
    var appointment = findAppointment(id);
    if (!appointment) {
      return;
    }
    var slotCapacity = DB && DB.settings ? Number(DB.settings.get().slotCapacity) || 2 : 2;
    var appointmentDate = parseYmd(appointment.date);
    var defaultDate = appointmentDate > today() ? appointmentDate : addDays(today(), 1);
    defaultDate = nextOpenDay(defaultDate);
    var dateValue = ymd(defaultDate);

    openModal({
      title: 'Reprogrammer le rendez-vous',
      subtitle: appointment.reference + ' · ' + appointment.patient.name,
      body: '<form id="adm-resched-form" data-id="' + esc(appointment.id) + '" novalidate>' +
        '<div class="adm-form-grid">' +
          '<div class="adm-field">' +
            '<label class="adm-label" for="adm-resched-date">Nouvelle date</label>' +
            '<input id="adm-resched-date" class="adm-input" type="date" min="' + ymd(today()) + '" value="' + dateValue + '">' +
          '</div>' +
          '<div class="adm-field">' +
            '<label class="adm-label" for="adm-resched-time">Nouveau créneau</label>' +
            '<select id="adm-resched-time" class="adm-select"></select>' +
          '</div>' +
        '</div>' +
        '<p class="adm-form-error adm-mt-14" id="adm-resched-error" role="alert" hidden></p>' +
        '<p class="adm-form-note">Créneau actuel : ' + esc(fmtLongDate(appointmentDate) + ' à ' + appointment.time) + '. Capacité maximale : ' + slotCapacity + ' rendez-vous par créneau de 30 minutes. Le laboratoire est fermé le dimanche.</p>' +
      '</form>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Retour</button>' +
        '<button type="submit" form="adm-resched-form" class="adm-btn adm-btn-primary">' + svg('calendar') + 'Enregistrer le créneau</button>'
    });

    updateRescheduleTimes('', appointment.id);
  }

  function rescheduleTimeOptions(dateStr, appointmentId, currentTime) {
    var date = parseYmd(dateStr);
    var slotCapacity = DB && DB.settings ? Number(DB.settings.get().slotCapacity) || 2 : 2;
    var slots = slotsFor(date);
    if (!slots.length) {
      return '<option value="">Laboratoire fermé ce jour</option>';
    }
    return slots.map(function (minutes) {
      var time = minutesToTime(minutes);
      var occupied = state.all.filter(function (other) {
        return other.id !== appointmentId &&
          other.date === dateStr &&
          other.time === time &&
          other.status !== 'cancelled';
      }).length;
      var full = occupied >= slotCapacity;
      return '<option value="' + time + '"' + (full ? ' disabled' : '') + (time === currentTime ? ' selected' : '') + '>' +
        time + (full ? ' — complet' : '') +
      '</option>';
    }).join('');
  }

  function updateRescheduleTimes(preferredTime, appointmentId) {
    var dateInput = document.getElementById('adm-resched-date');
    var timeSelect = document.getElementById('adm-resched-time');
    var form = document.getElementById('adm-resched-form');
    var errorEl = document.getElementById('adm-resched-error');
    if (!dateInput || !timeSelect || !form) {
      return;
    }
    var id = appointmentId || form.getAttribute('data-id');
    var appointment = findAppointment(id);
    var dateValue = dateInput.value;
    var currentTime = preferredTime ||
      (appointment && appointment.date === dateValue ? appointment.time : '');
    timeSelect.innerHTML = rescheduleTimeOptions(dateValue, id, currentTime);
    if (!timeSelect.value) {
      var firstEnabled = Array.prototype.find.call(timeSelect.options, function (option) {
        return !option.disabled && option.value;
      });
      if (firstEnabled) {
        timeSelect.value = firstEnabled.value;
      }
    }
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
  }

  function setErrorById(id, message) {
    var errorEl = document.getElementById(id);
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.hidden = !message;
    }
  }

  function setFormError(message) {
    setErrorById('adm-resched-error', message);
  }

  function watHref(phone) {
    var digits = String(phone || '').replace(/\D/g, '');
    if (digits.indexOf('0') === 0) digits = '212' + digits.slice(1);
    return 'https://wa.me/' + digits;
  }

  function patientHistory(patient) {
    if (!DB) return [];
    var phone = DB.utils.normalizePhone(patient.phone);
    return DB.appointments.list().filter(function (appointment) {
      return DB.utils.normalizePhone(appointment.patient.phone) === phone;
    }).sort(byDateDesc);
  }

  function openPatient(id) {
    var patient = DB.patients.list().find(function (item) { return item.id === id; });
    if (!patient) return;
    state.modalRecord = { kind: 'patient', id: patient.id };
    var history = patientHistory(patient);
    var rows = history.map(function (appointment) {
      return '<tr><td><span class="adm-ref">' + esc(appointment.reference) + '</span></td><td>' + esc(fmtShortDate(parseYmd(appointment.date)) + ' · ' + appointment.time) + '</td><td>' + statusBadge(appointment.status) + '</td></tr>';
    }).join('');
    openModal({
      title: patient.name,
      subtitle: patient.id + ' · ' + patient.phone,
      wide: true,
      body: '<div class="adm-detail-grid">' +
          '<div><span class="adm-label">Téléphone</span><strong>' + esc(patient.phone) + '</strong></div>' +
          '<div><span class="adm-label">Mutuelle</span><strong>' + esc(patient.mutuelle || 'Aucune') + '</strong></div>' +
          '<div><span class="adm-label">Créé le</span><strong>' + esc(fmtDateTime(patient.createdAt)) + '</strong></div>' +
          '<div><span class="adm-label">Rendez-vous</span><strong>' + history.length + '</strong></div>' +
        '</div>' +
        (patient.notes ? '<div class="adm-detail-block"><span class="adm-label">Notes</span><p>' + esc(patient.notes) + '</p></div>' : '') +
        '<div class="adm-detail-block"><span class="adm-label">Historique des rendez-vous</span>' +
          (history.length ? '<div class="adm-table-wrap"><table class="adm-table"><thead><tr><th>Référence</th><th>Date</th><th>Statut</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="adm-muted">Aucun rendez-vous.</p>') +
        '</div>',
      footer: '<a class="adm-btn adm-btn-secondary" href="tel:' + esc(patient.phone.replace(/\s/g, '')) + '">Appeler</a>' +
        '<a class="adm-btn adm-btn-secondary" href="' + esc(watHref(patient.phone)) + '" target="_blank" rel="noopener">WhatsApp</a>' +
        '<button type="button" class="adm-btn adm-btn-secondary" data-action="patient-edit" data-id="' + esc(patient.id) + '">' + svg('edit') + 'Modifier</button>' +
        '<button type="button" class="adm-btn adm-btn-ghost" data-action="delete-confirm" data-kind="patient" data-id="' + esc(patient.id) + '">' + svg('trash') + 'Supprimer</button>'
    });
  }

  function openPatientForm(id) {
    var patient = id ? DB.patients.list().find(function (item) { return item.id === id; }) : null;
    openModal({
      title: patient ? 'Modifier le patient' : 'Nouveau patient',
      subtitle: patient ? patient.id : 'Fiche fictive de démonstration',
      body: '<form id="adm-patient-form" data-id="' + esc(patient ? patient.id : '') + '" novalidate>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Nom complet</span><input id="pat-name" class="adm-input" value="' + esc(patient ? patient.name : '') + '" required></label>' +
          '<label class="adm-field"><span class="adm-label">Téléphone</span><input id="pat-phone" class="adm-input" value="' + esc(patient ? patient.phone : '') + '" placeholder="06 12 34 56 78" required></label>' +
        '</div>' +
        '<label class="adm-field"><span class="adm-label">Mutuelle</span><input id="pat-mutuelle" class="adm-input" value="' + esc(patient ? patient.mutuelle : '') + '"></label>' +
        '<label class="adm-field"><span class="adm-label">Notes internes</span><textarea id="pat-notes" class="adm-input" rows="3">' + esc(patient ? patient.notes : '') + '</textarea></label>' +
        '<p class="adm-form-error" id="adm-patient-error" role="alert" hidden></p>' +
      '</form>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Annuler</button>' +
        '<button type="submit" form="adm-patient-form" class="adm-btn adm-btn-primary">' + svg('check') + 'Enregistrer</button>'
    });
  }

  function executePatientForm(form) {
    var id = form.getAttribute('data-id');
    var payload = {
      name: document.getElementById('pat-name').value,
      phone: document.getElementById('pat-phone').value,
      mutuelle: document.getElementById('pat-mutuelle').value,
      notes: document.getElementById('pat-notes').value
    };
    var result = id ? DB.patients.update(id, payload) : DB.patients.create(payload);
    if (!result.ok) return setErrorById('adm-patient-error', result.message);
    closeModal();
    render();
    showToast('Patient enregistré.', 'success');
  }

  function openAppointmentForm() {
    var date = nextOpenDay(addDays(today(), 1));
    openModal({
      title: 'Nouveau rendez-vous',
      subtitle: 'Création manuelle depuis l’administration',
      wide: true,
      body: '<form id="adm-appt-form" novalidate>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Nom du patient</span><input id="appt-name" class="adm-input" required></label>' +
          '<label class="adm-field"><span class="adm-label">Téléphone</span><input id="appt-phone" class="adm-input" placeholder="06 12 34 56 78" required></label>' +
        '</div>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Date</span><input id="adm-appt-date" class="adm-input" type="date" min="' + ymd(today()) + '" value="' + ymd(date) + '"></label>' +
          '<label class="adm-field"><span class="adm-label">Créneau</span><select id="adm-appt-time" class="adm-select"></select></label>' +
        '</div>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Lieu</span><select id="appt-location" class="adm-select"><option value="lab">Au laboratoire</option><option value="home">À domicile</option></select></label>' +
          '<label class="adm-field"><span class="adm-label">Mutuelle</span><input id="appt-mutuelle" class="adm-input" value="Aucune"></label>' +
        '</div>' +
        '<label class="adm-field"><span class="adm-label">Zone (si domicile)</span><input id="appt-zone" class="adm-input" placeholder="Ex. M’hannech"></label>' +
        '<label class="adm-field"><span class="adm-label">Analyses (séparées par des virgules)</span><input id="appt-analyses" class="adm-input" placeholder="NFS, Glycémie à jeun" required></label>' +
        '<p class="adm-form-error" id="adm-appt-error" role="alert" hidden></p>' +
      '</form>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Annuler</button>' +
        '<button type="submit" form="adm-appt-form" class="adm-btn adm-btn-primary">' + svg('plus') + 'Créer le rendez-vous</button>'
    });
    updateAppointmentTimes();
  }

  function updateAppointmentTimes() {
    var dateInput = document.getElementById('adm-appt-date');
    var select = document.getElementById('adm-appt-time');
    if (!dateInput || !select) return;
    var date = parseYmd(dateInput.value);
    var slots = slotsFor(date);
    select.innerHTML = slots.length
      ? slots.map(function (minutes) {
        var time = minutesToTime(minutes);
        var full = DB.appointments.fullSlots(dateInput.value).indexOf(time + '–' + minutesToTime(minutes + 30)) >= 0;
        return '<option value="' + time + '"' + (full ? ' disabled' : '') + '>' + time + ' – ' + minutesToTime(minutes + 30) + (full ? ' (complet)' : '') + '</option>';
      }).join('')
      : '<option value="">Laboratoire fermé</option>';
  }

  function executeAppointmentForm() {
    var location = document.getElementById('appt-location').value;
    var payload = {
      name: document.getElementById('appt-name').value,
      phone: document.getElementById('appt-phone').value,
      date: document.getElementById('adm-appt-date').value,
      time: document.getElementById('adm-appt-time').value,
      analyses: document.getElementById('appt-analyses').value,
      lieu: location === 'home' ? 'domicile' : 'laboratoire',
      zone: document.getElementById('appt-zone').value,
      mutuelle: document.getElementById('appt-mutuelle').value,
      consentement: true,
      source: 'administration'
    };
    var result = DB.appointments.create(payload);
    if (!result.ok) return setErrorById('adm-appt-error', result.message);
    reloadData();
    closeModal();
    render();
    showToast('Rendez-vous ' + result.reference + ' créé.', 'success');
  }

  function openDossierForm() {
    var options = DB.appointments.list().slice().sort(byDateDesc).slice(0, 60).map(function (appointment) {
      return '<option value="' + esc(appointment.reference) + '">' + esc(appointment.reference + ' · ' + appointment.patient.name + ' · ' + appointment.date) + '</option>';
    }).join('');
    openModal({
      title: 'Nouveau dossier de résultats',
      subtitle: 'Un code d’accès aléatoire sera généré',
      wide: true,
      body: '<form id="adm-dossier-form" novalidate>' +
        '<label class="adm-field"><span class="adm-label">Rendez-vous associé (optionnel)</span><select id="dos-appointment" class="adm-select"><option value="">Aucun</option>' + options + '</select></label>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Nom du patient</span><input id="dos-name" class="adm-input" required></label>' +
          '<label class="adm-field"><span class="adm-label">Téléphone</span><input id="dos-phone" class="adm-input" placeholder="06 12 34 56 78"></label>' +
        '</div>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Date de prélèvement</span><input id="dos-date" class="adm-input" type="date" value="' + ymd(today()) + '"></label>' +
          '<label class="adm-field"><span class="adm-label">Code d’accès (laisser vide pour générer)</span><input id="dos-code" class="adm-input" placeholder="Ex. DEMO04"></label>' +
        '</div>' +
        '<label class="adm-field"><span class="adm-label">Analyses (séparées par des virgules)</span><input id="dos-analyses" class="adm-input" placeholder="NFS, Glycémie à jeun" required></label>' +
        '<p class="adm-form-error" id="adm-dossier-error" role="alert" hidden></p>' +
      '</form>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Annuler</button>' +
        '<button type="submit" form="adm-dossier-form" class="adm-btn adm-btn-primary">' + svg('plus') + 'Créer le dossier</button>'
    });
  }

  function executeDossierForm(form) {
    var selected = document.getElementById('dos-appointment').value;
    var appointment = selected ? DB.appointments.list().find(function (a) { return a.reference === selected; }) : null;
    var code = document.getElementById('dos-code').value.trim().toUpperCase();
    var result = DB.dossiers.create({
      patientId: appointment ? appointment.patient.id : null,
      patientName: document.getElementById('dos-name').value || (appointment ? appointment.patient.name : ''),
      phone: document.getElementById('dos-phone').value || (appointment ? appointment.patient.phone : ''),
      appointmentId: selected,
      sampleDate: document.getElementById('dos-date').value,
      analyses: document.getElementById('dos-analyses').value.split(/\s*[,;]\s*/).filter(Boolean),
      accessCode: code
    });
    if (!result.ok) return setErrorById('adm-dossier-error', result.message);
    closeModal();
    render();
    showToast('Dossier ' + result.dossier.id + ' créé. Code : ' + result.dossier.accessCode, 'success');
  }

  function resultRow(analysis, previous) {
    var flagOptions = [['', '—'], ['low', 'Bas'], ['high', 'Haut'], ['abnormal', 'Anormal']];
    var selectedFlag = previous && previous.flag || '';
    return '<div class="adm-result-row" data-analysis="' + esc(analysis) + '">' +
      '<span class="adm-result-name" title="' + esc(analysis) + '">' + esc(analysis) + '</span>' +
      '<input class="adm-input adm-input-sm" data-field="value" placeholder="Valeur" aria-label="Valeur pour ' + esc(analysis) + '" value="' + esc(previous && previous.value || '') + '">' +
      '<input class="adm-input adm-input-sm" data-field="unit" placeholder="Unité" aria-label="Unité pour ' + esc(analysis) + '" value="' + esc(previous && previous.unit || '') + '">' +
      '<input class="adm-input adm-input-sm" data-field="range" placeholder="Intervalles de référence" aria-label="Intervalles de référence pour ' + esc(analysis) + '" value="' + esc(previous && previous.range || '') + '">' +
      '<select class="adm-select adm-input-sm" data-field="flag" aria-label="Drapeau pour ' + esc(analysis) + '">' +
        flagOptions.map(function (option) {
          return '<option value="' + option[0] + '"' + (selectedFlag === option[0] ? ' selected' : '') + '>' + option[1] + '</option>';
        }).join('') +
      '</select>' +
    '</div>';
  }

  function openDossier(id) {
    var dossier = DB.dossiers.get(id);
    if (!dossier) return;
    state.modalRecord = { kind: 'dossier', id: dossier.id };
    var log = (dossier.accessLog || []).slice().reverse().map(function (entry) {
      return '<li><span class="adm-timeline-label">' + esc(entry.result || entry.status || 'Tentative') + '</span><span class="adm-timeline-date">' + esc(fmtDateTime(entry.at)) + '</span></li>';
    }).join('');
    var pdfInfo = dossier.pdfName
      ? esc(dossier.pdfName) + ' · ' + Math.round((dossier.pdfSize || 0) / 1024) + ' Ko'
      : 'PDF fictif généré automatiquement';
    // Pré-remplissage des résultats saisis, appariés par nom d'analyse
    // (comparaison insensible à la casse et aux espaces).
    var resultsByAnalysis = {};
    (dossier.results || []).forEach(function (result) {
      if (result && result.analysis) {
        resultsByAnalysis[String(result.analysis).trim().toLowerCase()] = result;
      }
    });
    var resultRows = (dossier.analyses || []).map(function (analysis) {
      var key = String(analysis).trim().toLowerCase();
      return resultRow(analysis, resultsByAnalysis[key]);
    }).join('');
    openModal({
      title: 'Dossier ' + dossier.id,
      subtitle: dossier.patientName + ' · ' + dossier.status,
      wide: true,
      body: '<div class="adm-detail-top"><div><span class="adm-ref">' + esc(dossier.id) + '</span><strong>' + esc(dossier.patientName) + '</strong><span class="adm-detail-date">' + esc(dossier.phone || '—') + '</span></div>' + dossierBadge(dossier) + '</div>' +
        '<div class="adm-detail-grid">' +
          '<div><span class="adm-label">Prélèvement</span><strong>' + esc(fmtLongDate(parseYmd(dossier.sampleDate))) + '</strong></div>' +
          '<div><span class="adm-label">Publié le</span><strong>' + esc(dossier.publishedAt ? fmtDateTime(dossier.publishedAt) : '—') + '</strong></div>' +
          '<div><span class="adm-label">Expire le</span><strong>' + esc(dossier.expiresAt ? fmtDateTime(dossier.expiresAt) : '—') + '</strong></div>' +
          '<div><span class="adm-label">Rendez-vous</span><strong>' + esc(dossier.appointmentId || '—') + '</strong></div>' +
        '</div>' +
        '<div class="adm-detail-block"><span class="adm-label">Code d’accès</span><div class="adm-code-row"><code class="adm-code" id="adm-dossier-code" data-code="' + esc(dossier.accessCode) + '">' + esc(DB.dossiers.maskCode(dossier.accessCode)) + '</code><button type="button" class="adm-btn adm-btn-secondary adm-btn-sm" data-action="dossier-reveal">Afficher</button><button type="button" class="adm-btn adm-btn-secondary adm-btn-sm" data-action="dossier-copy" data-code="' + esc(dossier.accessCode) + '">' + svg('copy') + 'Copier</button></div></div>' +
        '<div class="adm-detail-block"><span class="adm-label">Analyses</span><ul class="adm-chip-list">' + dossier.analyses.map(function (name) { return '<li class="adm-chip">' + esc(name) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="adm-detail-block"><span class="adm-label">Résultats biologiques</span>' +
          (resultRows
            ? '<form id="adm-results-form" data-id="' + esc(dossier.id) + '" novalidate>' +
              '<div class="adm-result-head"><span>Analyse</span><span>Valeur</span><span>Unité</span><span>Références</span><span>Drapeau</span></div>' +
              resultRows +
              '<p class="adm-form-note">Laissez la ligne vide si l’analyse n’a pas encore de résultat. Les lignes partiellement remplies sont enregistrées telles quelles.</p>' +
              '<button type="submit" form="adm-results-form" class="adm-btn adm-btn-primary adm-mt-14">' + svg('check') + 'Enregistrer les résultats</button>' +
            '</form>'
            : '<p class="adm-muted">Aucune analyse associée à ce dossier.</p>') +
        '</div>' +
        '<div class="adm-detail-block"><span class="adm-label">PDF</span><p class="adm-muted">' + pdfInfo + '</p><input type="file" id="adm-dossier-file" class="adm-input" accept="application/pdf,.pdf"><button type="button" class="adm-btn adm-btn-secondary adm-mt-14" data-action="dossier-upload" data-id="' + esc(dossier.id) + '">' + svg('upload') + 'Téléverser le PDF</button> <button type="button" class="adm-btn adm-btn-secondary adm-mt-14" data-action="dossier-download" data-id="' + esc(dossier.id) + '">' + svg('download') + 'Télécharger</button> <button type="button" class="adm-btn adm-btn-secondary adm-mt-14" data-action="dossier-pdf-generate" data-id="' + esc(dossier.id) + '">' + svg('file') + 'Générer le PDF A4</button></div>' +
        '<div class="adm-detail-block"><span class="adm-label">Journal de consultation</span>' + (log ? '<ol class="adm-timeline">' + log + '</ol>' : '<p class="adm-muted">Aucune consultation enregistrée.</p>') + '</div>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="dossier-regenerate" data-id="' + esc(dossier.id) + '">' + svg('refresh') + 'Nouveau code</button>' +
        (dossier.status === 'ready'
          ? '<button type="button" class="adm-btn adm-btn-danger" data-action="dossier-revoke" data-id="' + esc(dossier.id) + '">Révoquer</button>'
          : '<button type="button" class="adm-btn adm-btn-primary" data-action="dossier-publish" data-id="' + esc(dossier.id) + '">' + svg('check') + 'Publier</button>') +
        '<button type="button" class="adm-btn adm-btn-ghost" data-action="delete-confirm" data-kind="dossier" data-id="' + esc(dossier.id) + '">' + svg('trash') + 'Supprimer</button>'
    });
  }

  function openAnalysisForm(id) {
    var item = id ? DB.analyses.list().find(function (entry) { return entry.id === id; }) : null;
    openModal({
      title: item ? 'Modifier l’analyse' : 'Nouvelle analyse',
      subtitle: 'Catalogue public et tarifs',
      wide: true,
      body: '<form id="adm-analysis-form" data-id="' + esc(item ? item.id : '') + '" novalidate>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Nom (français)</span><input id="ana-name-fr" class="adm-input" value="' + esc(item ? item.name.fr : '') + '" required></label>' +
          '<label class="adm-field"><span class="adm-label">Nom (arabe)</span><input id="ana-name-ar" class="adm-input" dir="rtl" value="' + esc(item ? item.name.ar : '') + '"></label>' +
        '</div>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Discipline (français)</span><input id="ana-discipline-fr" class="adm-input" value="' + esc(item ? item.discipline.fr : '') + '"></label>' +
          '<label class="adm-field"><span class="adm-label">Discipline (arabe)</span><input id="ana-discipline-ar" class="adm-input" dir="rtl" value="' + esc(item ? item.discipline.ar : '') + '"></label>' +
        '</div>' +
        '<div class="adm-form-grid">' +
          '<label class="adm-field"><span class="adm-label">Tarif</span><input id="ana-price" class="adm-input" value="' + esc(item ? item.price : '') + '" placeholder="80 DH"></label>' +
          '<label class="adm-field"><span class="adm-label">Délai</span><input id="ana-delay-fr" class="adm-input" value="' + esc(item ? item.delay.fr : '') + '"></label>' +
        '</div>' +
        '<label class="adm-inline-field"><input type="checkbox" id="ana-fasting"' + (item && item.fasting === 'yes' ? ' checked' : '') + '><span class="adm-label">À jeun obligatoire</span></label>' +
        '<label class="adm-inline-field"><input type="checkbox" id="ana-active"' + (!item || item.active !== false ? ' checked' : '') + '><span class="adm-label">Visible sur le site public</span></label>' +
        '<p class="adm-form-error" id="adm-analysis-error" role="alert" hidden></p>' +
      '</form>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Annuler</button>' +
        '<button type="submit" form="adm-analysis-form" class="adm-btn adm-btn-primary">' + svg('check') + 'Enregistrer</button>'
    });
  }

  function executeAnalysisForm(form) {
    var id = form.getAttribute('data-id');
    var result = DB.analyses.save({
      id: id,
      nameFr: document.getElementById('ana-name-fr').value,
      nameAr: document.getElementById('ana-name-ar').value || document.getElementById('ana-name-fr').value,
      disciplineFr: document.getElementById('ana-discipline-fr').value,
      disciplineAr: document.getElementById('ana-discipline-ar').value || document.getElementById('ana-discipline-fr').value,
      price: document.getElementById('ana-price').value,
      delayFr: document.getElementById('ana-delay-fr').value,
      delayAr: document.getElementById('ana-delay-fr').value,
      fasting: document.getElementById('ana-fasting').checked,
      active: document.getElementById('ana-active').checked
    });
    if (!result.ok) return setErrorById('adm-analysis-error', result.message);
    closeModal();
    render();
    showToast('Analyse enregistrée.', 'success');
  }

  function openMessage(id) {
    var message = DB.messages.list().find(function (item) { return item.id === id; });
    if (!message) return;
    state.modalRecord = { kind: 'message', id: message.id };
    if (!message.read) {
      var updated = DB.messages.update(id, { read: true });
      if (!updated) showToast('Mise à jour du message impossible.', 'error');
    }
    openModal({
      title: message.subject || 'Message',
      subtitle: message.name + ' · ' + fmtDateTime(message.createdAt),
      wide: true,
      body: '<div class="adm-detail-grid"><div><span class="adm-label">Nom</span><strong>' + esc(message.name) + '</strong></div><div><span class="adm-label">Téléphone</span><strong>' + esc(message.phone || '—') + '</strong></div></div>' +
        '<div class="adm-detail-block"><span class="adm-label">Message</span><p class="adm-message-body">' + esc(message.body).replace(/\n/g, '<br>') + '</p></div>',
      footer: (message.phone ? '<a class="adm-btn adm-btn-secondary" href="' + esc(watHref(message.phone)) + '" target="_blank" rel="noopener">' + svg('send') + 'Répondre sur WhatsApp</a>' : '') +
        '<button type="button" class="adm-btn adm-btn-secondary" data-action="message-archive" data-id="' + esc(message.id) + '">' + (message.status === 'archived' ? 'Désarchiver' : 'Archiver') + '</button>' +
        '<button type="button" class="adm-btn adm-btn-ghost" data-action="delete-confirm" data-kind="message" data-id="' + esc(message.id) + '">' + svg('trash') + 'Supprimer</button>'
    });
    render();
  }

  function openDeleteConfirm(kind, id) {
    var labels = { appointment: 'ce rendez-vous', patient: 'ce patient', dossier: 'ce dossier', analysis: 'cette analyse', message: 'ce message' };
    openModal({
      title: 'Confirmer la suppression',
      subtitle: labels[kind] || 'cet élément',
      body: '<p class="adm-modal-copy">Vous êtes sur le point de supprimer ' + esc(labels[kind] || 'cet élément') + '. Cette action est réversible pendant 5 secondes.</p>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Annuler</button>' +
        '<button type="button" class="adm-btn adm-btn-danger" data-action="do-delete" data-kind="' + esc(kind) + '" data-id="' + esc(id) + '">' + svg('trash') + 'Supprimer</button>'
    });
  }

  function executeDelete(kind, id) {
    var record = null;
    var collection = { appointment: 'appointments', patient: 'patients', dossier: 'dossiers', analysis: 'analysesCatalog', message: 'messages' }[kind];
    if (!collection) return;
    if (kind === 'appointment') record = DB.appointments.get(id);
    if (kind === 'patient') record = DB.patients.list().find(function (item) { return item.id === id; });
    if (kind === 'dossier') record = DB.dossiers.get(id);
    if (kind === 'analysis') record = DB.analyses.list().find(function (item) { return item.id === id; });
    if (kind === 'message') record = DB.messages.list().find(function (item) { return item.id === id; });

    var ok = false;
    if (kind === 'appointment') ok = DB.appointments.remove(id);
    if (kind === 'patient') ok = DB.patients.remove(id);
    if (kind === 'dossier') ok = DB.dossiers.remove(id);
    if (kind === 'analysis') ok = DB.analyses.remove(id);
    if (kind === 'message') ok = DB.messages.remove(id);
    if (!ok) return;
    reloadData();
    closeModal();
    render();
    showToast('Suppression effectuée.', 'warning', function () {
      if (record) DB.restore(collection, record);
      reloadData();
      render();
      showToast('Suppression annulée.', 'success');
    });
  }

  function openResetConfirm() {
    openModal({
      title: 'Réinitialiser la démonstration',
      subtitle: 'Toutes les données locales seront remplacées',
      body: '<p class="adm-modal-copy">Les rendez-vous, patients, dossiers, messages et journaux seront remplacés par le jeu de démonstration d’origine. Cette action est immédiate.</p>',
      footer: '<button type="button" class="adm-btn adm-btn-secondary" data-action="modal-close">Annuler</button>' +
        '<button type="button" class="adm-btn adm-btn-danger" data-action="do-reset">' + svg('refresh') + 'Réinitialiser</button>'
    });
  }

  function saveSettingsForm() {
    var patch = {
      labName: document.getElementById('set-lab-name').value,
      phone: document.getElementById('set-phone').value,
      whatsapp: document.getElementById('set-whatsapp').value,
      address: document.getElementById('set-address').value,
      announcement: document.getElementById('set-announcement').value,
      slotCapacity: Number(document.getElementById('set-capacity').value),
      maxPerPhonePerDay: Number(document.getElementById('set-max-phone').value),
      bookingWindowDays: Number(document.getElementById('set-window').value),
      resultValidityDays: Number(document.getElementById('set-validity').value),
      maxResultAttempts: Number(document.getElementById('set-attempts').value),
      resultLockMinutes: Number(document.getElementById('set-lock').value)
    };
    var biologistField = document.getElementById('set-biologist');
    if (biologistField) patch.biologistName = biologistField.value;
    ['slotCapacity', 'maxPerPhonePerDay', 'bookingWindowDays', 'resultValidityDays', 'maxResultAttempts', 'resultLockMinutes'].forEach(function (field) {
      if (!patch[field] || patch[field] < 1) patch[field] = DB.settings.get()[field];
    });
    var saved = DB.settings.save(patch, 'admin');
    render();
    if (saved && saved.ok === false) {
      showToast(saved.message || 'Paramètres invalides.', 'error');
      return;
    }
    showToast('Paramètres enregistrés.', 'success');
  }

  function savePinForm() {
    var current = String(document.getElementById('pin-current').value || '').trim();
    var next = String(document.getElementById('pin-next').value || '').trim();
    var confirmValue = String(document.getElementById('pin-confirm').value || '').trim();
    if (next.length < 4 || next.length > 12) return setErrorById('adm-pin-error', 'Le nouveau PIN doit contenir 4 à 12 caractères.');
    if (next !== confirmValue) return setErrorById('adm-pin-error', 'Les deux nouveaux PIN ne correspondent pas.');
    var fail = function () {
      setErrorById('adm-pin-error', 'Vérification impossible. Rechargez la page.');
    };
    DB.auth.verifyPin(current).then(function (ok) {
      if (!ok) {
        setErrorById('adm-pin-error', 'PIN actuel incorrect.');
        return;
      }
      DB.auth.setPin(next).then(function () {
        document.getElementById('adm-pin-form').reset();
        setErrorById('adm-pin-error', '');
        showToast('PIN administrateur mis à jour.', 'success');
      }).catch(fail);
    }).catch(fail);
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function exportBackup() {
    var payload = DB.exportAll();
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'derdabi-demo-' + ymd(today()) + '.json');
    showToast('Sauvegarde JSON téléchargée. Les PDF ne sont pas inclus.', 'success');
  }

  /* Validation minimale d'une sauvegarde avant import : `data` doit être un
     objet et les collections principales (si présentes) des tableaux d'objets. */
  function importPayloadValid(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) return false;
    var names = ['appointments', 'patients', 'dossiers', 'messages'];
    return names.every(function (name) {
      var value = payload.data[name];
      if (value === undefined || value === null) return true;
      if (!Array.isArray(value)) return false;
      return value.every(function (item) {
        return item && typeof item === 'object' && !Array.isArray(item);
      });
    });
  }

  function importBackup() {
    var input = document.getElementById('adm-import-file');
    var file = input && input.files ? input.files[0] : null;
    if (!file) return setErrorById('adm-import-error', 'Sélectionnez un fichier JSON.');
    var reader = new FileReader();
    reader.onload = function () {
      var payload;
      try { payload = JSON.parse(reader.result); } catch (error) { payload = null; }
      if (!importPayloadValid(payload)) {
        setErrorById('adm-import-error', 'Fichier invalide : la sauvegarde doit être un export JSON de cette démonstration (objet « data » contenant des tableaux).');
        return;
      }
      DB.importAll(payload).then(function (result) {
        if (!result.ok) {
          setErrorById('adm-import-error', result.message || 'Import impossible.');
          return;
        }
        reloadData();
        render();
        showToast('Sauvegarde importée. Les PDF ne sont pas inclus dans les sauvegardes JSON.', 'success');
      });
    };
    reader.onerror = function () { setErrorById('adm-import-error', 'Lecture du fichier impossible.'); };
    reader.readAsText(file);
  }

  function downloadDossier(id) {
    DB.dossiers.getPdf(id).then(function (blob) {
      if (!blob) {
        showToast('Aucun PDF disponible.', 'error');
        return;
      }
      downloadBlob(blob, 'resultats-' + id + '.pdf');
      showToast('PDF téléchargé.', 'success');
    });
  }

  /* Génération du PDF A4 des résultats via le module optionnel pdf.js.
     Contracte attendue : window.LabPDF.buildResultReport(dossier, settings, 'fr')
     → Promise<Blob>. Les PDF sont des documents en français : la langue 'fr'
     est volontairement fixe. */
  function generateDossierPdf(id) {
    var dossier = DB.dossiers.get(id);
    if (!dossier) return;
    if (!(window.LabPDF && typeof window.LabPDF.buildResultReport === 'function')) {
      showToast('Module PDF indisponible (pdf.js manquant).', 'error');
      return;
    }
    Promise.resolve(window.LabPDF.buildResultReport(dossier, DB.settings.get(), 'fr')).then(function (blob) {
      if (!blob) {
        showToast('Génération du PDF impossible.', 'error');
        return;
      }
      downloadBlob(blob, 'Resultats-' + id + '.pdf');
      showToast('PDF A4 généré.', 'success');
    }).catch(function () {
      showToast('Génération du PDF impossible.', 'error');
    });
  }

  /* Bon de rendez-vous A4 via le module optionnel pdf.js.
     Contracte attendue : window.LabPDF.buildAppointmentVoucher(payload, settings, 'fr')
     → Promise<Blob>, payload = { reference, name, phone, date, time,
     analyses, locationLabel, mutuelle }. */
  function generateAppointmentVoucher(id) {
    var appointment = findAppointment(id);
    if (!appointment) return;
    if (!(window.LabPDF && typeof window.LabPDF.buildAppointmentVoucher === 'function')) {
      showToast('Module PDF indisponible (pdf.js manquant).', 'error');
      return;
    }
    var settingsData = DB.settings.get();
    var labAddress = settingsData.labAddress || settingsData.address || 'Avenue des FAR, Tétouan';
    var isHome = appointment.location && appointment.location.type === 'home';
    var payload = {
      reference: appointment.reference,
      name: appointment.patient.name,
      phone: appointment.patient.phone,
      date: appointment.date,
      time: appointment.time,
      endTime: appointment.endTime || '',
      analyses: Array.isArray(appointment.analyses) ? appointment.analyses.slice() : [],
      locationLabel: isHome
        ? ('À domicile — ' + (appointment.location.zone || 'zone à préciser'))
        : ('Au laboratoire — ' + labAddress),
      mutuelle: appointment.patient.mutuelle || ''
    };
    Promise.resolve(window.LabPDF.buildAppointmentVoucher(payload, settingsData, 'fr')).then(function (blob) {
      if (!blob) {
        showToast('Génération du PDF impossible.', 'error');
        return;
      }
      downloadBlob(blob, 'Bon-RDV-' + appointment.reference + '.pdf');
      showToast('Bon de rendez-vous généré.', 'success');
    }).catch(function () {
      showToast('Génération du PDF impossible.', 'error');
    });
  }

  /* Enregistrement des résultats biologiques saisis dans la fiche dossier.
     Contracte attendue : DB.dossiers.saveResults(id, results) avec
     results = [{ analysis, value, unit, range, flag }] (flag dans
     '', 'low', 'high', 'abnormal') → { ok:true, dossier } | { ok:false, message }. */
  function saveResultsForm(id) {
    var dossier = DB.dossiers.get(id);
    if (!dossier) return;
    var rows = document.querySelectorAll('#adm-results-form .adm-result-row');
    var results = [];
    var invalid = false;
    var flags = ['', 'low', 'high', 'abnormal'];
    Array.prototype.forEach.call(rows, function (row) {
      var analysis = String(row.getAttribute('data-analysis') || '').trim();
      var value = row.querySelector('[data-field="value"]').value.trim();
      var unit = row.querySelector('[data-field="unit"]').value.trim();
      var range = row.querySelector('[data-field="range"]').value.trim();
      var flag = row.querySelector('[data-field="flag"]').value;
      if (!analysis) {
        invalid = true;
        return;
      }
      if (!value && !unit && !range && !flag) return;
      if (flags.indexOf(flag) === -1) flag = '';
      results.push({ analysis: analysis, value: value, unit: unit, range: range, flag: flag });
    });
    if (invalid) {
      showToast('Chaque ligne doit correspondre à une analyse nommée.', 'error');
      return;
    }
    if (!DB.dossiers.saveResults) {
      showToast('Fonction indisponible : mettez à jour db.js.', 'error');
      return;
    }
    var result = DB.dossiers.saveResults(id, results);
    if (!result || !result.ok) {
      showToast((result && result.message) || 'Enregistrement des résultats impossible.', 'error');
      return;
    }
    showToast('Résultats enregistrés.', 'success');
    render();
    openDossier(id);
  }

  function uploadDossierPdf(id) {
    var input = document.getElementById('adm-dossier-file');
    var file = input && input.files ? input.files[0] : null;
    if (!file) return showToast('Sélectionnez un PDF.', 'warning');
    DB.dossiers.attachPdf(id, file).then(function (result) {
      if (!result.ok) return showToast(result.message || 'Téléversement impossible.', 'error');
      showToast('PDF associé au dossier.', 'success');
      openDossier(id);
    });
  }

  function executeConfirm(id) {
    var appointment = findAppointment(id);
    if (!appointment) return;
    var result = DB.appointments.confirm(id);
    reloadData();
    closeModal();
    render();
    showToast(result.ok ? 'Rendez-vous ' + appointment.reference + ' confirmé.' : 'Confirmation impossible.', result.ok ? 'success' : 'error');
  }

  function executeCancel(id) {
    var appointment = findAppointment(id);
    if (!appointment) {
      return;
    }
    var reasonEl = document.getElementById('adm-cancel-reason');
    var reason = reasonEl ? reasonEl.value : '';
    var result = DB.appointments.cancel(id, reason);
    reloadData();
    render();
    if (result && result.ok) {
      closeModal();
      showToast('Rendez-vous ' + appointment.reference + ' annulé.', 'warning');
    } else {
      showToast((result && result.message) || 'Annulation impossible.', 'error');
    }
  }

  function executeReschedule(id) {
    var appointment = findAppointment(id);
    if (!appointment) {
      return;
    }
    var dateInput = document.getElementById('adm-resched-date');
    var timeSelect = document.getElementById('adm-resched-time');
    if (!dateInput || !timeSelect) {
      return;
    }
    var dateValue = dateInput.value;
    var timeValue = timeSelect.value;
    if (!dateValue) {
      setFormError('Choisissez une nouvelle date.');
      return;
    }
    var date = parseYmd(dateValue);
    if (isNaN(date.getTime())) {
      setFormError('La date saisie n’est pas valide.');
      return;
    }
    if (date < today()) {
      setFormError('La nouvelle date ne peut pas être dans le passé.');
      return;
    }
    if (date.getDay() === 0) {
      setFormError('Le laboratoire est fermé le dimanche. Choisissez un autre jour.');
      return;
    }
    var minutes = timeToMinutes(timeValue);
    if (slotsFor(date).indexOf(minutes) === -1) {
      setFormError('Choisissez un créneau valide entre 08:00 et la fermeture.');
      return;
    }
    if (appointment.date === dateValue && appointment.time === timeValue) {
      setFormError('Choisissez un créneau différent du créneau actuel.');
      return;
    }
    var slotCapacity = DB && DB.settings ? Number(DB.settings.get().slotCapacity) || 2 : 2;
    var occupied = state.all.filter(function (other) {
      return other.id !== appointment.id &&
        other.date === dateValue &&
        other.time === timeValue &&
        other.status !== 'cancelled';
    }).length;
    if (occupied >= slotCapacity) {
      setFormError('Ce créneau est complet (' + slotCapacity + ' rendez-vous maximum).');
      return;
    }

    var result = DB.appointments.reschedule(appointment.id, dateValue, timeValue);
    if (!result.ok) {
      setFormError(result.message || 'Reprogrammation impossible.');
      return;
    }
    reloadData();
    closeModal();
    render();
    showToast('Rendez-vous reprogrammé le ' + fmtShortDate(date) + ' à ' + timeValue + '.', 'success');
  }

  function showToast(message, type, undo) {
    var container = document.getElementById('adm-toasts');
    if (!container) {
      return;
    }
    var iconName = type === 'success' ? 'checkCircle' : type === 'warning' ? 'alert' : type === 'error' ? 'xCircle' : 'info';
    var toast = document.createElement('div');
    toast.className = 'adm-toast is-' + (type || 'info') + (undo ? ' has-action' : '');
    toast.innerHTML = svg(iconName) + '<span></span>' + (undo ? '<button type="button" class="adm-toast-action">Annuler</button>' : '');
    toast.querySelector('span').textContent = message;
    if (undo) {
      var undoBtn = toast.querySelector('.adm-toast-action');
      undoBtn.addEventListener('click', function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        undo();
      });
    }
    container.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add('is-out');
      window.setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 240);
    }, undo ? 5000 : 3800);
  }

  function resetDemo() {
    if (!DB) return;
    DB.reset();
    reloadData();
    state.simulateEmpty = false;
    state.simulateError = false;
    state.filters = Object.assign({}, DEFAULT_FILTERS);
    state.calendar = { cursor: startOfMonth(today()), selected: today() };
    state.statsPeriod = 30;
    state.sidebarOpen = false;
    render();
    showToast('Données de démonstration réinitialisées.', 'info');
  }

  function resetFilters() {
    state.filters = Object.assign({}, DEFAULT_FILTERS);
    render();
  }

  function changePage(delta) {
    var filtered = filterAppointments(effectiveAppointments());
    var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.filters.page = Math.min(totalPages, Math.max(1, state.filters.page + delta));
    render();
  }

  function selectCalendarDay(dateStr) {
    var date = parseYmd(dateStr);
    if (isNaN(date.getTime())) {
      return;
    }
    state.calendar.selected = date;
    if (date.getFullYear() !== state.calendar.cursor.getFullYear() || date.getMonth() !== state.calendar.cursor.getMonth()) {
      state.calendar.cursor = startOfMonth(date);
    }
    render();
  }

  function navigate(route) {
    if (!ROUTES[route]) {
      return;
    }
    if (window.location.hash === '#/' + route) {
      render();
    } else {
      window.location.hash = '#/' + route;
    }
  }

  function handleAction(actionEl, event) {
    var action = actionEl.getAttribute('data-action');
    var id = actionEl.getAttribute('data-id');

    switch (action) {
      case 'toggle-sidebar':
        state.sidebarOpen = !state.sidebarOpen;
        render();
        break;
      case 'close-sidebar':
        if (state.sidebarOpen) {
          state.sidebarOpen = false;
          render();
        }
        break;
      case 'retry':
        state.simulateError = false;
        render();
        showToast('Données de démonstration rechargées.', 'success');
        break;
      case 'reload':
        window.location.reload();
        break;
      case 'reset-demo':
        resetDemo();
        break;
      case 'filter-reset':
        resetFilters();
        break;
      case 'cal-prev':
        state.calendar.cursor = new Date(state.calendar.cursor.getFullYear(), state.calendar.cursor.getMonth() - 1, 1);
        render();
        break;
      case 'cal-next':
        state.calendar.cursor = new Date(state.calendar.cursor.getFullYear(), state.calendar.cursor.getMonth() + 1, 1);
        render();
        break;
      case 'cal-today':
        state.calendar.cursor = startOfMonth(today());
        state.calendar.selected = today();
        render();
        break;
      case 'select-day':
        selectCalendarDay(actionEl.getAttribute('data-date'));
        break;
      case 'page-prev':
        changePage(-1);
        break;
      case 'page-next':
        changePage(1);
        break;
      case 'stats-period':
        var days = actionEl.getAttribute('data-days');
        state.statsPeriod = days === 'all' ? 'all' : Number(days);
        render();
        break;
      case 'stats-chart-mode':
        state.statsChartMode = actionEl.getAttribute('data-mode') || 'day';
        render();
        break;
      case 'view-appt':
        closeMenus();
        openDetails(id);
        break;
      case 'confirm-appt':
        openConfirm(id);
        break;
      case 'cancel-appt':
        openCancel(id);
        break;
      case 'reschedule-appt':
        openReschedule(id);
        break;
      case 'do-confirm':
        executeConfirm(id);
        break;
      case 'do-cancel':
        executeCancel(id);
        break;
      case 'modal-close':
        closeModal();
        break;
      case 'modal-backdrop':
        if (event.target === actionEl) {
          closeModal();
        }
        break;
      case 'appointment-create':
        openAppointmentForm();
        break;
      case 'patient-create':
        openPatientForm('');
        break;
      case 'patient-view':
        openPatient(id);
        break;
      case 'patient-edit':
        openPatientForm(id);
        break;
      case 'dossier-create':
        openDossierForm();
        break;
      case 'dossier-view':
        openDossier(id);
        break;
      case 'dossier-reveal':
        var codeEl = document.getElementById('adm-dossier-code');
        if (codeEl) {
          codeEl.textContent = codeEl.getAttribute('data-code');
          actionEl.disabled = true;
        }
        break;
      case 'dossier-copy':
        var copyValue = actionEl.getAttribute('data-code') || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyValue).then(function () { showToast('Code copié.', 'success'); }, function () { showToast('Copie impossible.', 'error'); });
        } else {
          showToast('Code : ' + copyValue, 'info');
        }
        break;
      case 'dossier-publish':
        var published = DB.dossiers.publish(id);
        if (published && published.ok) {
          render();
          openDossier(id);
          showToast('Dossier publié.', 'success');
        } else {
          showToast((published && published.message) || 'Publication impossible.', 'error');
        }
        break;
      case 'dossier-revoke':
        var revoked = DB.dossiers.revoke(id);
        if (revoked && revoked.ok) {
          render();
          openDossier(id);
          showToast('Dossier révoqué.', 'warning');
        } else {
          showToast((revoked && revoked.message) || 'Révocation impossible.', 'error');
        }
        break;
      case 'dossier-regenerate':
        var regen = DB.dossiers.regenerateCode(id);
        render();
        openDossier(id);
        if (regen && regen.ok) {
          showToast('Nouveau code : ' + regen.code, 'success');
        } else {
          showToast((regen && regen.message) || 'Génération du code impossible.', 'error');
        }
        break;
      case 'dossier-pdf-generate':
        generateDossierPdf(id);
        break;
      case 'appt-voucher':
        generateAppointmentVoucher(id);
        break;
      case 'dossier-upload':
        uploadDossierPdf(id);
        break;
      case 'dossier-download':
        downloadDossier(id);
        break;
      case 'analysis-create':
        openAnalysisForm('');
        break;
      case 'analysis-edit':
        openAnalysisForm(id);
        break;
      case 'analysis-delete':
        openDeleteConfirm('analysis', id);
        break;
      case 'message-view':
        closeMenus();
        openMessage(id);
        break;
      case 'message-archive':
        var msg = DB.messages.list().find(function (item) { return item.id === id; });
        if (!msg) break;
        // Le libellé est calculé AVANT la mise à jour : l'ancien statut
        // détermine si le message est archivé ou désarchivé.
        var previousStatus = msg.status;
        var updateResult = DB.messages.update(id, { status: previousStatus === 'archived' ? 'new' : 'archived' });
        if (updateResult) {
          render();
          closeModal();
          showToast('Message ' + (previousStatus === 'archived' ? 'désarchivé' : 'archivé') + '.', 'info');
        } else {
          showToast('Mise à jour du message impossible.', 'error');
        }
        break;
      case 'messages-filter':
        state.messagesFilter = actionEl.getAttribute('data-filter-value') || 'all';
        render();
        break;
      case 'delete-confirm':
        openDeleteConfirm(actionEl.getAttribute('data-kind'), id);
        break;
      case 'do-delete':
        executeDelete(actionEl.getAttribute('data-kind'), id);
        break;
      case 'reset-confirm':
        openResetConfirm();
        break;
      case 'do-reset':
        resetDemo();
        closeModal();
        break;
      case 'backup-export':
        exportBackup();
        break;
      case 'backup-import':
        importBackup();
        break;
      case 'toggle-bell': {
        var bellPop = document.getElementById('adm-bell-popover');
        var bellBtn = document.getElementById('adm-bell-btn');
        if (!bellPop || !bellBtn) break;
        if (!bellPop.hidden) {
          closeMenus();
          break;
        }
        closeMenus();
        renderBellPopover();
        bellPop.hidden = false;
        bellBtn.setAttribute('aria-expanded', 'true');
        break;
      }
      case 'toggle-account': {
        var accountMenu = document.getElementById('adm-account-menu');
        var accountBtn = document.getElementById('adm-account-btn');
        if (!accountMenu || !accountBtn) break;
        if (!accountMenu.hidden) {
          closeMenus();
          break;
        }
        closeMenus();
        accountMenu.hidden = false;
        accountBtn.setAttribute('aria-expanded', 'true');
        break;
      }
      case 'goto-settings':
        closeMenus();
        goToSettings(false);
        break;
      case 'goto-pin':
        closeMenus();
        goToSettings(true);
        break;
      case 'goto-messages':
        closeMenus();
        navigate('messages');
        break;
      case 'goto-appointments':
        closeMenus();
        navigate('appointments');
        break;
      case 'logout':
        closeMenus();
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('login.html');
        break;
      default:
        break;
    }
  }

  /* ==========================================================================
     Barre supérieure : notifications (cloche) et menu du compte
     ========================================================================== */

  function notificationCounts() {
    var messages = DB && DB.messages ? DB.messages.list() : [];
    var appointments = DB && DB.appointments ? DB.appointments.list() : [];
    var unread = messages.filter(function (message) {
      return !message.read && message.status !== 'archived';
    }).length;
    var pending = appointments.filter(function (appointment) {
      return appointment.status === 'pending';
    }).length;
    return { unread: unread, pending: pending, total: unread + pending };
  }

  function refreshTopbarIndicators() {
    var badge = document.getElementById('adm-bell-badge');
    if (!badge) return;
    var counts = notificationCounts();
    badge.textContent = counts.total > 9 ? '9+' : String(counts.total);
    badge.hidden = counts.total === 0;
  }

  function bellItem(iconName, title, meta, action, id) {
    return '<button type="button" class="adm-popover-item adm-popover-row" data-action="' + action + '" data-id="' + esc(id) + '">' +
      '<span class="adm-popover-row-icon">' + svg(iconName) + '</span>' +
      '<span class="adm-popover-row-main"><strong>' + esc(title) + '</strong><span>' + esc(meta) + '</span></span>' +
    '</button>';
  }

  function renderBellPopover() {
    var pop = document.getElementById('adm-bell-popover');
    if (!pop || !DB) return;
    var messages = DB.messages.list().filter(function (message) {
      return !message.read && message.status !== 'archived';
    }).sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    var pending = DB.appointments.list().filter(function (appointment) {
      return appointment.status === 'pending';
    }).sort(byDateAsc);

    var html = '<p class="adm-popover-title">Notifications</p>';
    html += '<p class="adm-popover-section">Messages non lus (' + messages.length + ')</p>';
    if (messages.length) {
      html += messages.slice(0, 5).map(function (message) {
        return bellItem('message', message.name, message.subject || 'Sans objet', 'message-view', message.id);
      }).join('');
    } else {
      html += '<p class="adm-popover-empty">Aucun message non lu.</p>';
    }
    html += '<a class="adm-popover-link" href="#/messages" data-action="goto-messages">Tout voir ' + svg('arrowRight') + '</a>';
    html += '<p class="adm-popover-section">Rendez-vous en attente (' + pending.length + ')</p>';
    if (pending.length) {
      html += pending.slice(0, 5).map(function (appointment) {
        return bellItem('clock', appointment.patient.name, appointment.reference + ' · ' + fmtShortDate(parseYmd(appointment.date)) + ' ' + appointment.time, 'view-appt', appointment.id);
      }).join('');
    } else {
      html += '<p class="adm-popover-empty">Aucun rendez-vous en attente.</p>';
    }
    html += '<a class="adm-popover-link" href="#/appointments" data-action="goto-appointments">Tout voir ' + svg('arrowRight') + '</a>';
    pop.innerHTML = html;
  }

  function menusOpen() {
    var bellPop = document.getElementById('adm-bell-popover');
    var accountMenu = document.getElementById('adm-account-menu');
    return !!(bellPop && !bellPop.hidden) || !!(accountMenu && !accountMenu.hidden);
  }

  function closeMenus() {
    ['adm-bell-popover', 'adm-account-menu'].forEach(function (id) {
      var element = document.getElementById(id);
      if (element) element.hidden = true;
    });
    ['adm-bell-btn', 'adm-account-btn'].forEach(function (id) {
      var button = document.getElementById(id);
      if (button) button.setAttribute('aria-expanded', 'false');
    });
  }

  function closeMenusIfOutside(event) {
    if (!menusOpen()) return;
    var inside = event.target && event.target.closest && event.target.closest('#adm-bell-wrap, #adm-account-wrap');
    if (!inside) closeMenus();
  }

  function goToSettings(pin) {
    var target = pin ? '#/settings?pin=1' : '#/settings';
    if (window.location.hash === target) {
      state.route = 'settings';
      render();
      if (pin) focusPinForm();
      return;
    }
    window.location.hash = target;
  }

  function focusPinForm() {
    var card = document.getElementById('adm-pin-card');
    var input = document.getElementById('pin-current');
    if (card) {
      card.classList.remove('is-highlight');
      void card.offsetWidth;
      card.classList.add('is-highlight');
    }
    if (input) {
      try {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (error) {
        try { input.scrollIntoView(); } catch (ignored) { /* ignore */ }
      }
      window.setTimeout(function () { input.focus(); }, 220);
    }
  }

  function maybeFocusPin() {
    if (state.route !== 'settings') return;
    if (String(window.location.hash || '').indexOf('pin=1') === -1) return;
    focusPinForm();
  }

  /* ==========================================================================
     Synchronisation multi-onglets (BroadcastChannel / storage)
     ========================================================================== */

  function findRecordById(kind, id) {
    if (!DB) return true;
    if (kind === 'appointment') return !!findAppointment(id);
    if (kind === 'patient') return DB.patients.list().some(function (item) { return item.id === id; });
    if (kind === 'dossier') return !!DB.dossiers.get(id);
    if (kind === 'message') return DB.messages.list().some(function (item) { return item.id === id; });
    return true;
  }

  function handleExternalChange() {
    reloadData();
    // Ferme la modale si l'enregistrement ouvert a été supprimé ailleurs.
    if (state.modalOpen && state.modalRecord && !findRecordById(state.modalRecord.kind, state.modalRecord.id)) {
      closeModal();
      showToast('Élément supprimé dans un autre onglet.', 'warning');
    }
    closeMenus();
    render();
  }

  function routeFromHash() {
    var match = String(window.location.hash || '').match(/^#\/([a-z]+)/);
    return match && ROUTES[match[1]] ? match[1] : 'dashboard';
  }

  document.addEventListener('click', function (event) {
    touchSession();
    closeMenusIfOutside(event);
    var navLink = event.target.closest ? event.target.closest('.adm-nav a[data-route]') : null;
    if (navLink) {
      state.sidebarOpen = false;
      var targetRoute = navLink.getAttribute('data-route');
      if (state.route === targetRoute && window.location.hash === '#/' + targetRoute) {
        render();
      }
      return;
    }

    var actionEl = event.target.closest ? event.target.closest('[data-action]') : null;
    if (!actionEl) {
      return;
    }
    handleAction(actionEl, event);
  });

  document.addEventListener('input', function (event) {
    touchSession();
    if (!event.target) return;
    if (event.target.id === 'adm-search') {
      state.filters.q = event.target.value;
      state.filters.page = 1;
      render({ focusId: 'adm-search' });
      return;
    }
    var map = {
      'adm-patient-search': 'patientQuery',
      'adm-dossier-search': 'dossierQuery',
      'adm-analysis-search': 'analysesQuery'
    };
    if (map[event.target.id]) {
      state[map[event.target.id]] = event.target.value;
      render({ focusId: event.target.id });
    }
  });

  document.addEventListener('change', function (event) {
    var target = event.target;
    if (!target) {
      return;
    }
    if (target.id === 'adm-resched-date') {
      updateRescheduleTimes('', null);
      return;
    }
    if (target.id === 'adm-appt-date') {
      updateAppointmentTimes();
      return;
    }
    if (target.id === 'dos-appointment') {
      var selected = target.value;
      var appointment = selected ? DB.appointments.list().find(function (a) { return a.reference === selected; }) : null;
      if (appointment) {
        document.getElementById('dos-name').value = appointment.patient.name;
        document.getElementById('dos-phone').value = appointment.patient.phone;
        document.getElementById('dos-analyses').value = appointment.analyses.join(', ');
        document.getElementById('dos-date').value = appointment.date;
      }
      return;
    }
    var filter = target.getAttribute ? target.getAttribute('data-filter') : null;
    if (filter === 'dossier-status') {
      state.dossierStatus = target.value;
      render({ focusId: target.id || undefined });
      return;
    }
    if (filter) {
      state.filters[filter] = target.value;
      state.filters.page = 1;
      render({ focusId: target.id || undefined });
    }
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form) return;
    if (form.id === 'adm-resched-form') {
      event.preventDefault();
      executeReschedule(form.getAttribute('data-id'));
    } else if (form.id === 'adm-patient-form') {
      event.preventDefault();
      executePatientForm(form);
    } else if (form.id === 'adm-appt-form') {
      event.preventDefault();
      executeAppointmentForm();
    } else if (form.id === 'adm-dossier-form') {
      event.preventDefault();
      executeDossierForm(form);
    } else if (form.id === 'adm-analysis-form') {
      event.preventDefault();
      executeAnalysisForm(form);
    } else if (form.id === 'adm-results-form') {
      event.preventDefault();
      saveResultsForm(form.getAttribute('data-id'));
    } else if (form.id === 'adm-settings-form') {
      event.preventDefault();
      saveSettingsForm();
    } else if (form.id === 'adm-pin-form') {
      event.preventDefault();
      savePinForm();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!state.modalOpen) {
      if (event.key === 'Escape') {
        if (menusOpen()) {
          closeMenus();
          return;
        }
        if (state.sidebarOpen) {
          state.sidebarOpen = false;
          render();
        }
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    var root = document.getElementById('adm-modal-root');
    var nodes = root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
    var focusable = Array.prototype.filter.call(nodes, function (element) {
      return element.offsetParent !== null || element === document.activeElement;
    });
    if (!focusable.length) {
      return;
    }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('hashchange', function () {
    if (!guardSession()) return;
    state.route = routeFromHash();
    state.sidebarOpen = false;
    closeMenus();
    closeModal();
    render();
    window.scrollTo(0, 0);
    maybeFocusPin();
  });

  // Outils de démonstration réservés au mode debug (?debug=1).
  if (String(window.location.search || '').indexOf('debug=1') !== -1) {
    window.DerdabiAdminTools = {
      resetDemo: resetDemo,
      simulateError: function () {
        state.simulateError = true;
        state.simulateEmpty = false;
        render();
      },
      simulateEmpty: function () {
        state.simulateEmpty = true;
        state.simulateError = false;
        state.filters = Object.assign({}, DEFAULT_FILTERS);
        render();
      },
      getState: function () {
        return {
          route: state.route,
          filters: Object.assign({}, state.filters),
          calendar: { cursor: ymd(state.calendar.cursor), selected: ymd(state.calendar.selected) },
          statsPeriod: state.statsPeriod,
          statsChartMode: state.statsChartMode,
          simulateEmpty: state.simulateEmpty,
          simulateError: state.simulateError,
          modalOpen: state.modalOpen,
          total: state.all.length,
          counts: countStatus(effectiveAppointments())
        };
      },
      getAppointment: function (id) {
        return clone(findAppointment(id));
      },
      navigate: navigate,
      openAppointment: function (id) {
        openDetails(id);
      },
      render: render
    };
  }

  function init() {
    if (!guardSession()) return;
    state.route = routeFromHash();
    render();
    maybeFocusPin();
    window.setInterval(function () {
      if (!guardSession()) return;
    }, 60000);
    // Vérification de session sur les événements qui réactivent l'onglet.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) guardSession();
    });
    window.addEventListener('focus', guardSession);
    window.addEventListener('storage', function (event) {
      if (event.key && event.key.indexOf('derdabi_v1_') === 0) {
        handleExternalChange();
      }
    });
    // Sync BroadcastChannel : complète l'événement storage quand il ne se
    // déclenche pas (même page, iframes, navigateurs sans storage event).
    if (DB && typeof DB.onChange === 'function') {
      DB.onChange(function (event) {
        if (event && event.external) {
          handleExternalChange();
        } else {
          refreshTopbarIndicators();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
