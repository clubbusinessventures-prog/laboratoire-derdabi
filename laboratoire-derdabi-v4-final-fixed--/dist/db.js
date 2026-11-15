(function (global) {
  'use strict';

  var PREFIX = 'derdabi_v1_';
  var DB_VERSION = 1;
  var CHANNEL = 'derdabi';
  var PIN_HASH = '4e9b3e5b0d3fa8346e5a7493a3f4938282983065d1dd73de340be5e8c039f2b3';
  var COLLECTIONS = ['appointments', 'patients', 'dossiers', 'settings', 'analysesCatalog', 'messages', 'pageViews', 'auditLog'];
  var OPEN_END = { 0: 0, 1: 16, 2: 16, 3: 16, 4: 16, 5: 16, 6: 13 };
  var STATUS = ['pending', 'confirmed', 'cancelled', 'completed'];
  var RESULT_FLAGS = ['', 'low', 'high', 'abnormal'];
  var DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var listeners = [];
  var channel = null;
  var storageOk = true;
  var lastError = null;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function clone(value) {
    if (value === undefined) return undefined;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return null;
    }
  }

  function key(name) {
    return PREFIX + name;
  }

  function read(name, fallback) {
    var raw = null;
    try {
      raw = global.localStorage.getItem(key(name));
    } catch (error) {
      storageOk = false;
    }
    if (!raw && memory[name] !== undefined) return clone(memory[name]);
    if (!raw) return clone(fallback);
    try {
      return JSON.parse(raw);
    } catch (error) {
      try {
        global.localStorage.removeItem(key(name));
      } catch (removeError) {
        storageOk = false;
      }
      console.warn('LabDB: collection corrompue réinitialisée — ' + name);
      logAudit('system', 'storage_corrupt', name, name);
      return clone(fallback);
    }
  }

  var memory = {};

  function write(name, value) {
    var copy = clone(value);
    if (copy && typeof copy === 'object') {
      try { Object.freeze(copy); } catch (error) { /* ignore */ }
    }
    memory[name] = copy;
    try {
      global.localStorage.setItem(key(name), JSON.stringify(value));
      storageOk = true;
      lastError = null;
    } catch (error) {
      storageOk = false;
      lastError = 'quota';
      emit(name, 'error', { reason: 'quota' });
    }
    return value;
  }

  function remove(name) {
    delete memory[name];
    try {
      global.localStorage.removeItem(key(name));
    } catch (error) {
      storageOk = false;
    }
  }

  function readRaw(name) {
    try {
      return global.localStorage.getItem(key(name));
    } catch (error) {
      return null;
    }
  }

  // Réécrit une collection en relisant d'abord la valeur BRUTE du stockage (hors
  // cache mémoire) : deux onglets qui écrivent en parallèle ne s'écrasent plus.
  function mutate(name, fn, fallback) {
    var fresh = null;
    var raw = readRaw(name);
    if (raw !== null) {
      try { fresh = JSON.parse(raw); } catch (error) { fresh = null; }
    }
    if (fresh === null) fresh = read(name, fallback === undefined ? [] : fallback);
    var result = fn(fresh);
    write(name, fresh);
    return result;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function todayYmd() {
    var d = new Date();
    return ymd(d);
  }

  function ymd(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  function parseYmd(value) {
    var parts = String(value || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(function (n) { return isNaN(n); })) return new Date(NaN);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function addDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function sanitize(value, max) {
    return String(value == null ? '' : value)
      .replace(/<[^>]*>/g, ' ')
      .replace(/[\u0000-\u001F\u007F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max || 500);
  }

  function normalizePhone(value) {
    var digits = String(value == null ? '' : value).replace(/[\s\-\.\(\)]/g, '');
    if (digits.indexOf('+212') === 0) digits = '0' + digits.slice(4);
    if (digits.indexOf('00212') === 0) digits = '0' + digits.slice(5);
    return digits;
  }

  function validPhone(value) {
    return /^0[5-7]\d{8}$/.test(normalizePhone(value));
  }

  function formatPhone(value) {
    var digits = normalizePhone(value);
    if (!/^0\d{9}$/.test(digits)) return String(value || '');
    return digits.slice(0, 2) + ' ' + digits.slice(2, 4) + ' ' + digits.slice(4, 6) + ' ' + digits.slice(6, 8) + ' ' + digits.slice(8);
  }

  function timeToMinutes(value) {
    var m = String(value || '').match(/^(\d{1,2}):(\d{2})/);
    return m ? Number(m[1]) * 60 + Number(m[2]) : -1;
  }

  function minutesToTime(minutes) {
    return pad(Math.floor(minutes / 60)) + ':' + pad(minutes % 60);
  }

  function slotLabel(start) {
    var minutes = typeof start === 'number' ? start : timeToMinutes(start);
    if (minutes < 0) return '';
    return minutesToTime(minutes) + '–' + minutesToTime(minutes + 30);
  }

  function parseSlot(value) {
    var text = String(value || '').replace('–', '-').replace('—', '-');
    var m = text.match(/^(\d{1,2}):(\d{2})(?:\s*-\s*(\d{1,2}):(\d{2}))?/);
    if (!m) return null;
    var start = Number(m[1]) * 60 + Number(m[2]);
    var end = m[3] ? Number(m[3]) * 60 + Number(m[4]) : start + 30;
    return { start: start, end: end, time: minutesToTime(start), endTime: minutesToTime(end), label: slotLabel(start) };
  }

  function slotsForDate(value) {
    var date = typeof value === 'string' ? parseYmd(value) : value;
    if (isNaN(date.getTime())) return [];
    var end = OPEN_END[date.getDay()];
    if (!end) return [];
    var slots = [];
    for (var minutes = 8 * 60; minutes < end * 60; minutes += 30) slots.push(minutes);
    return slots;
  }

  function uid(prefix) {
    if (global.crypto && global.crypto.randomUUID) return prefix + '-' + global.crypto.randomUUID();
    return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function nextNumbered(list, pattern, width) {
    var max = 0;
    list.forEach(function (item) {
      var m = String(item.reference || item.id || '').match(pattern);
      if (m) max = Math.max(max, Number(m[1]));
    });
    return String(max + 1).padStart(width, '0');
  }

  // Compteur monotone stocké dans meta.counters : un numéro n'est plus réutilisé
  // après suppression du dernier enregistrement, et deux onglets ne peuvent plus
  // générer le même numéro. À appeler DANS le callback mutate de la création,
  // afin que le compteur et l'enregistrement soient persistés ensemble.
  function bumpCounter(kind, subKey, list, pattern, width) {
    var meta = read('meta', {});
    if (!meta.counters || typeof meta.counters !== 'object') meta.counters = {};
    if (!meta.counters[kind] || typeof meta.counters[kind] !== 'object') meta.counters[kind] = {};
    var max = 0;
    list.forEach(function (item) {
      var m = String(item.reference || item.id || '').match(pattern);
      if (m) max = Math.max(max, Number(m[1]));
    });
    var next = Math.max(max, Number(meta.counters[kind][subKey]) || 0) + 1;
    meta.counters[kind][subKey] = next;
    write('meta', meta);
    return String(next).padStart(width || 4, '0');
  }

  function emit(collection, type, detail) {
    var payload = { collection: collection, type: type, detail: detail || null, at: nowIso() };
    listeners.slice().forEach(function (fn) {
      try { fn(payload); } catch (error) { console.error('LabDB listener', error); }
    });
    if (channel) {
      try { channel.postMessage(payload); } catch (error) { /* ignore */ }
    }
  }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
    return function () {
      var index = listeners.indexOf(fn);
      if (index >= 0) listeners.splice(index, 1);
    };
  }

  function logAudit(actor, action, entity, entityId, details) {
    var entry = null;
    mutate('auditLog', function (fresh) {
      fresh.unshift({
        id: uid('AUD'),
        at: nowIso(),
        actor: sanitize(actor || 'système', 60),
        action: sanitize(action, 80),
        entity: sanitize(entity, 40),
        entityId: sanitize(entityId, 80),
        details: sanitize(details, 300)
      });
      if (fresh.length > 600) fresh.length = 600;
      entry = fresh[0];
    });
    emit('auditLog', 'log', { action: action, entity: entity, entityId: entityId });
    return entry;
  }

  function defaultSettings() {
    return {
      pinHash: PIN_HASH,
      pinHashAlgo: 'sha256',
      pinUpdatedAt: null,
      sessionMinutes: 30,
      slotCapacity: 2,
      maxPerPhonePerDay: 3,
      bookingWindowDays: 60,
      closedDays: [0],
      resultValidityDays: 30,
      maxResultAttempts: 5,
      resultLockMinutes: 10,
      biologistName: 'Dr. Samira El Fassi',
      labName: 'Laboratoire Derdabi',
      phone: '05 00 05 55 05',
      whatsapp: '06 48 55 83 66',
      address: 'Avenue des FAR, Tétouan, Maroc',
      hoursWeekdays: '08:00–16:00',
      hoursSaturday: '08:00–13:00',
      hoursSunday: 'Fermé',
      announcement: '',
      showDemoBanner: true,
      seededAt: null,
      updatedAt: null
    };
  }

  function settings() {
    var value = read('settings', null);
    if (!value || typeof value !== 'object') return defaultSettings();
    return Object.assign(defaultSettings(), value);
  }

  var SETTINGS_TEXT_KEYS = ['labName', 'labPhone', 'labWhatsapp', 'labAddress', 'announcement', 'hoursWeekdays', 'hoursSaturday', 'biologistName', 'homeZones'];
  var SETTINGS_NUMERIC_RANGES = {
    slotCapacity: [1, 10],
    maxPerPhonePerDay: [1, 10],
    bookingWindowDays: [1, 365],
    resultValidityDays: [1, 365],
    maxResultAttempts: [1, 10],
    resultLockMinutes: [1, 120],
    sessionMinutes: [5, 480]
  };

  function saveSettings(patch, actor) {
    var next = null;
    mutate('settings', function (fresh) {
      if (!fresh || typeof fresh !== 'object') return;
      // Complète les clés manquantes depuis les valeurs par défaut, comme settings().
      var defaults = defaultSettings();
      Object.keys(defaults).forEach(function (field) {
        if (fresh[field] === undefined) fresh[field] = defaults[field];
      });
      var allowed = Object.keys(defaults);
      Object.keys(patch || {}).forEach(function (field) {
        // pinHash / pinHashAlgo ne sont modifiables que via auth.setPin.
        if (field === 'pinHash' || field === 'pinHashAlgo') return;
        var isKnown = SETTINGS_TEXT_KEYS.indexOf(field) >= 0 ||
          SETTINGS_NUMERIC_RANGES[field] !== undefined ||
          allowed.indexOf(field) >= 0;
        if (!isKnown) return;
        var value = patch[field];
        if (SETTINGS_NUMERIC_RANGES[field]) {
          var range = SETTINGS_NUMERIC_RANGES[field];
          var numeric = Number(value);
          if (!isFinite(numeric) || numeric < range[0] || numeric > range[1]) return;
          fresh[field] = numeric;
          return;
        }
        fresh[field] = value;
      });
      fresh.updatedAt = nowIso();
      next = fresh;
    }, defaultSettings());
    emit('settings', 'update', null);
    if (actor) logAudit(actor, 'settings.update', 'settings', 'global', 'Paramètres mis à jour');
    return { ok: true, settings: clone(next) };
  }

  var ANALYSES = [
    ['glycemie', 'Glycémie à jeun', 'سكر الدم على الريق', 'Biochimie', 'الكيمياء الحيوية', '50 DH', 'yes', '2 heures', 'ساعتان'],
    ['nfs', 'Numération Formule Sanguine (NFS)', 'تعداد الدم الكامل (NFS)', 'Hématologie', 'أمراض الدم', '70 DH', 'no', '2 heures', 'ساعتان'],
    ['tsh', 'TSH ultra-sensible (Thyroïde)', 'هرمون الغدة الدرقية (TSH)', 'Hormonologie', 'الهرمونات', '120 DH', 'no', '3 heures', '3 ساعات'],
    ['bilan-lipidique', 'Bilan lipidique complet', 'ملف الدهون الكامل', 'Biochimie', 'الكيمياء الحيوية', '120 DH', 'yes', '3 heures', '3 ساعات'],
    ['hba1c', 'Hémoglobine glyquée HbA1c', 'الهيموغلوبين السكري HbA1c', 'Biochimie', 'الكيمياء الحيوية', '110 DH', 'no', '2 heures', 'ساعتان'],
    ['bilan-renal', 'Bilan rénal (Urée, Créatinine)', 'وظائف الكلى', 'Biochimie', 'الكيمياء الحيوية', '100 DH', 'no', '3 heures', '3 ساعات'],
    ['ecbu', 'ECBU — Examen urinaire complet', 'تحليل البول الكامل', 'Microbiologie', 'الأحياء الدقيقة', '90 DH', 'no', '48 heures', '48 ساعة'],
    ['tp-inr', 'TP / INR — Coagulation', 'زمن البروثرومبين INR', 'Hématologie', 'أمراض الدم', '80 DH', 'no', '2 heures', 'ساعتان'],
    ['vitamine-d', 'Vitamine D (25-OH)', 'فيتامين د', 'Biochimie', 'الكيمياء الحيوية', '250 DH', 'no', '24 heures', '24 ساعة'],
    ['ferritine', 'Fer sérique & Ferritine', 'الحديد والفيريتين', 'Biochimie', 'الكيمياء الحيوية', '150 DH', 'no', '4 heures', '4 ساعات'],
    ['psa', 'PSA Total', 'مستضد البروستاتا PSA', 'Immunologie', 'المناعة', '180 DH', 'no', '24 heures', '24 ساعة'],
    ['crp', 'CRP — Protéine C réactive', 'بروتين سي التفاعلي CRP', 'Immunologie', 'المناعة', '60 DH', 'no', '2 heures', 'ساعتان'],
    ['groupe-rh', 'Groupe sanguin & Rhésus', 'فصيلة الدم وعامل RH', 'Hématologie', 'أمراض الدم', '50 DH', 'no', '1 heure', 'ساعة واحدة'],
    ['serologie', 'Sérologie (Hépatites B/C)', 'التحاليل المصلية (فيروسات الكبد)', 'Immunologie', 'المناعة', '220 DH', 'no', '24 heures', '24 ساعة'],
    ['tsh-t3-t4', 'Bilan thyroïdien complet (TSH, T3, T4)', 'ملف الغدة الدرقية الكامل', 'Hormonologie', 'الهرمونات', '280 DH', 'no', '1 jour', 'يوم واحد'],
    ['fer-hormone', 'FSH / LH / Œstradiol', 'هرمونات الخصوبة', 'Hormonologie', 'الهرمونات', '300 DH', 'no', '24 heures', '24 ساعة'],
    ['bilan-prenuptial', 'Bilan prénuptial', 'فحص ما قبل الزواج', 'Bilans', 'الفحوصات الشاملة', '350 DH', 'yes', '24 heures', '24 ساعة'],
    ['pack-diabete', 'Pack Suivi Diabète', 'باقة متابعة السكري', 'Bilans', 'الفحوصات الشاملة', '250 DH', 'yes', '4 heures', '4 ساعات']
  ];

  function defaultAnalyses() {
    return ANALYSES.map(function (row, index) {
      return {
        id: row[0],
        name: { fr: row[1], ar: row[2] },
        discipline: { fr: row[3], ar: row[4] },
        price: row[5],
        fasting: row[6],
        delay: { fr: row[7], ar: row[8] },
        prep: { fr: row[6] === 'yes' ? 'Jeûne strict de 10 à 12 h' : 'Pas de jeûne obligatoire', ar: row[6] === 'yes' ? 'صيام صارم من 10 إلى 12 ساعة' : 'الصيام غير إلزامي' },
        active: true,
        order: index
      };
    });
  }

  var SEED_NAMES = [
    'Amina Benkirane', 'Youssef Kadiri', 'Salma Tazi', 'Karim Mansouri', 'Hiba Rifi', 'Omar Senhaji',
    'Lina Amrani', 'Mehdi Ziani', 'Sara El Idrissi', 'Anas Lahlou', 'Nour Haddad', 'Imane Chraibi',
    'Rachid Berrada', 'Meryem Fassi', 'Adil Ghali', 'Kenza Naciri', 'Hamza Ouazzani', 'Yasmine Pinto',
    'Bilal Qorchi', 'Aya Doukkali', 'Tarik Belhaj', 'Sofia Mekouar', 'Reda Alaoui', 'Nadia Sbaa'
  ];
  var SEED_ANALYSES = [
    'Bilan de Santé Général', 'Glycémie à jeun', 'NFS', 'TSH ultra-sensible', 'Bilan Lipidique',
    'HbA1c', 'Bilan Rénal', 'ECBU', 'TP / INR', 'Vitamine D', 'Fer sérique & Ferritine',
    'PSA Total', 'Pack Suivi Diabète', 'Pack Thyroïde Complet', 'Bilan Prénuptial'
  ];
  var MUTUELLES = ['CNSS', 'CNOPS', 'AMO', 'Assurance privée', 'Aucune'];
  var ZONES = ['Tétouan centre', 'Martil', "M'diq", 'Fnideq'];
  var SEED_NOTES = [
    'Prélèvement à domicile — appeler avant le déplacement.',
    'Patient à jeun depuis 12 h.',
    'Ordonnance à apporter le jour du prélèvement.',
    'Renouvellement de bilan annuel.',
    'Prévoir un accompagnant.',
    ''
  ];

  function seedPhone(index) {
    return '06 11 00 00 ' + pad(index + 1);
  }

  function buildSeedCalendar() {
    var out = [];
    for (var offset = -16; offset <= 26; offset += 1) {
      var date = addDays(startOfDay(new Date()), offset);
      if (date.getDay() === 0) continue;
      var count = Math.abs(offset) % 4 === 0 ? 2 : 1;
      if (offset === 0 || offset === 1) count = 2;
      for (var k = 0; k < count; k += 1) out.push({ offset: offset, indexInDay: k, global: out.length });
    }
    return out.slice(0, 40);
  }

  function seedAppointments() {
    var schedule = buildSeedCalendar();
    var year = new Date().getFullYear();
    var appointments = [];
    var patientSeeds = {};
    var now = new Date();
    var byDateSlot = {};
    schedule.forEach(function (item, i) {
      var date = addDays(startOfDay(now), item.offset);
      var dateKey = ymd(date);
      var slots = slotsForDate(date);
      var startIndex = (Math.abs(item.offset) * 3 + item.indexInDay * 5 + i) % slots.length;
      var slot = slots[startIndex];
      var slotKey = dateKey + '-' + slot;
      while (byDateSlot[slotKey] >= 2 && slots.length) {
        startIndex = (startIndex + 1) % slots.length;
        slot = slots[startIndex];
        slotKey = dateKey + '-' + slot;
      }
      byDateSlot[slotKey] = (byDateSlot[slotKey] || 0) + 1;

      var status;
      if (item.offset < 0) status = i % 9 === 0 ? 'cancelled' : (i % 5 === 0 ? 'completed' : 'confirmed');
      else if (item.offset === 0) status = ['pending', 'confirmed', 'pending', 'confirmed'][item.indexInDay % 4];
      else status = i % 7 === 0 ? 'cancelled' : (i % 3 === 0 ? 'confirmed' : 'pending');

      var patientIndex = i % SEED_NAMES.length;
      var name = SEED_NAMES[patientIndex];
      var phone = seedPhone(patientIndex);
      var isHome = i % 5 === 0;
      var analysisCount = 1 + (i % 3);
      var analyses = [];
      for (var a = 0; a < analysisCount; a += 1) {
        var analysis = SEED_ANALYSES[(i + a * 4) % SEED_ANALYSES.length];
        if (analyses.indexOf(analysis) === -1) analyses.push(analysis);
      }

      var createdAt = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 3 - (i % 5), 9 + (i % 5), (i % 4) * 15, 0, 0);
      var reference = 'RDV-' + year + '-' + String(i + 1).padStart(4, '0');
      var appointment = {
        id: 'apt-seed-' + String(i + 1).padStart(3, '0'),
        reference: reference,
        date: dateKey,
        time: minutesToTime(slot),
        endTime: minutesToTime(slot + 30),
        status: status,
        patient: {
          name: name,
          phone: phone,
          mutuelle: MUTUELLES[i % MUTUELLES.length],
          id: 'PAT-' + String(patientIndex + 1).padStart(4, '0')
        },
        location: {
          type: isHome ? 'home' : 'lab',
          zone: isHome ? ZONES[i % ZONES.length] : '',
          address: isHome ? 'Rue de démonstration, ' + ZONES[i % ZONES.length] : 'Avenue des FAR, Tétouan'
        },
        analyses: analyses,
        notes: SEED_NOTES[i % SEED_NOTES.length],
        consent: true,
        source: 'seed-demo',
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
        events: [
          { type: 'created', at: createdAt.toISOString(), label: 'Créé depuis le site public' }
        ]
      };
      if (status === 'confirmed' || status === 'completed') {
        appointment.events.push({ type: 'confirmed', at: new Date(createdAt.getTime() + 3600000).toISOString(), label: 'Confirmé par le secrétariat' });
      }
      if (status === 'cancelled') {
        appointment.events.push({ type: 'cancelled', at: new Date(createdAt.getTime() + 7200000).toISOString(), label: 'Annulé à la demande du patient' });
      }
      appointments.push(appointment);
      // createdAt du patient = date (minuit local) de son plus ancien RDV semé.
      var patientId = appointment.patient.id;
      if (!patientSeeds[patientId]) {
        patientSeeds[patientId] = { name: name, phone: phone, mutuelle: appointment.patient.mutuelle, earliest: dateKey };
      } else if (dateKey < patientSeeds[patientId].earliest) {
        patientSeeds[patientId].earliest = dateKey;
      }
    });

    var patients = Object.keys(patientSeeds).map(function (id) {
      var info = patientSeeds[id];
      var stamp = (info.earliest ? parseYmd(info.earliest) : startOfDay(new Date())).toISOString();
      return {
        id: id,
        name: info.name,
        phone: info.phone,
        mutuelle: info.mutuelle,
        notes: '',
        createdAt: stamp,
        updatedAt: stamp
      };
    });
    return { appointments: appointments, patients: patients };
  }

  function seedDossiers(appointments) {
    var year = String(new Date().getFullYear()).slice(-2);
    var sources = [
      appointments[2],
      appointments[7] || appointments[3],
      appointments[12] || appointments[5]
    ].filter(Boolean);
    return sources.map(function (appointment, index) {
      var published = index === 2 ? null : addDays(startOfDay(new Date()), index === 0 ? -4 : -1);
      var status = index === 2 ? 'pending' : 'ready';
      return {
        id: 'D' + year + '-' + String(index + 1).padStart(4, '0'),
        patientId: appointment.patient.id,
        patientName: appointment.patient.name,
        phone: appointment.patient.phone,
        appointmentId: appointment.reference,
        analyses: appointment.analyses.slice(),
        status: status,
        accessCode: ['DEMO01', 'DEMO02', 'DEMO03'][index],
        createdAt: appointment.createdAt,
        updatedAt: nowIso(),
        sampleDate: appointment.date,
        publishedAt: published ? published.toISOString() : null,
        expiresAt: published ? addDays(published, 30).toISOString() : null,
        failedAttempts: 0,
        lockedUntil: null,
        accessLog: [],
        pdfName: null,
        pdfSize: null,
        pdfKey: null,
        demo: true
      };
    });
  }

  function seed() {
    var data = seedAppointments();
    var dossiers = seedDossiers(data.appointments);
    var views = [];
    var today = startOfDay(new Date());
    for (var i = 29; i >= 0; i -= 1) {
      var d = addDays(today, -i);
      views.push({ date: ymd(d), count: 22 + ((i * 17) % 61), source: 'seed-demo' });
    }
    var messages = [
      ['Sofia Mekouar', '06 11 00 00 22', 'Question préparation', 'Bonjour, faut-il être à jeun pour le bilan lipidique ?', false],
      ['Tarik Belhaj', '06 11 00 00 21', 'Prélèvement à domicile', 'Est-il possible de passer demain matin à Martil ?', false],
      ['Nadia Sbaa', '06 11 00 00 24', 'Résultats', 'Je n’arrive pas à ouvrir mon dossier, pouvez-vous m’aider ?', true],
      ['Omar Senhaji', '06 11 00 00 06', 'Remerciements', 'Merci pour votre accueil et votre rapidité.', true]
    ].map(function (row, index) {
      return {
        id: 'MSG-' + String(index + 1).padStart(4, '0'),
        name: row[0],
        phone: row[1],
        subject: row[2],
        body: row[3],
        read: row[4],
        status: row[4] ? 'read' : 'new',
        createdAt: addDays(new Date(), -(index + 1)).toISOString(),
        updatedAt: addDays(new Date(), -(index + 1)).toISOString()
      };
    });
    var s = defaultSettings();
    s.seededAt = nowIso();
    s.updatedAt = nowIso();
    write('appointments', data.appointments);
    write('patients', data.patients);
    write('dossiers', dossiers);
    write('analysesCatalog', defaultAnalyses());
    write('settings', s);
    write('messages', messages);
    write('pageViews', views);
    write('auditLog', [
      { id: uid('AUD'), at: nowIso(), actor: 'système', action: 'seed', entity: 'database', entityId: 'initial', details: data.appointments.length + ' rendez-vous et ' + dossiers.length + ' dossiers fictifs créés' }
    ]);
    write('meta', { version: DB_VERSION, seeded: true, seededAt: s.seededAt, lastChange: nowIso() });
    emit('database', 'seed', { appointments: data.appointments.length, dossiers: dossiers.length });
  }

  function ensureSeed() {
    var meta = read('meta', null);
    var appointments = read('appointments', null);
    if (!meta || !meta.seeded || !Array.isArray(appointments)) seed();
  }

  function touch() {
    var meta = read('meta', {});
    meta.version = DB_VERSION;
    meta.seeded = true;
    meta.lastChange = nowIso();
    write('meta', meta);
  }

  function appointmentsList() {
    return read('appointments', []);
  }

  function findAppointment(id) {
    return appointmentsList().find(function (appointment) {
      return appointment.id === id || appointment.reference === id;
    }) || null;
  }

  function nowMinutes() {
    var d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function closedDaysMessage(closedDays) {
    var names = (closedDays || []).slice().sort(function (a, b) { return a - b; }).map(function (day) {
      return DAY_NAMES[day] || String(day);
    });
    var label = names.length > 1
      ? names.slice(0, -1).join(', ') + ' et ' + names[names.length - 1]
      : (names[0] || 'ce jour');
    return 'Le laboratoire est fermé le ' + label + '.';
  }

  // Règles partagées par la prise de rendez-vous publique, la reprogrammation
  // et la mise à jour manuelle : fenêtre, jour fermé, créneau passé, capacité
  // et quota par numéro. `excludeId` évite de compter le rendez-vous lui-même.
  function validateSlot(dateObj, slot, excludeId, phone, phoneLimitCode) {
    var s = settings();
    var today = startOfDay(new Date());
    if (dateObj < today) return { ok: false, code: 'past_date', message: 'La date ne peut pas être dans le passé.' };
    if (dateObj > addDays(today, s.bookingWindowDays)) return { ok: false, code: 'date_window', message: 'Date trop éloignée.' };
    if ((s.closedDays || []).indexOf(dateObj.getDay()) >= 0) return { ok: false, code: 'sunday', message: closedDaysMessage(s.closedDays) };
    if (!slot) return { ok: false, code: 'invalid_slot', message: 'Créneau invalide.' };
    if (slotsForDate(dateObj).indexOf(slot.start) === -1) return { ok: false, code: 'closed_slot', message: 'Ce créneau est en dehors des horaires d’ouverture.' };
    if (dateObj.getTime() === today.getTime() && slot.end <= nowMinutes()) {
      return { ok: false, code: 'past_slot', message: 'Ce créneau est déjà passé. Choisissez un créneau à venir.' };
    }
    var dateKey = ymd(dateObj);
    var occupied = appointmentsList().filter(function (appointment) {
      return appointment.id !== excludeId && appointment.date === dateKey && appointment.time === slot.time && appointment.status !== 'cancelled';
    }).length;
    if (occupied >= s.slotCapacity) return { ok: false, code: 'slot_full', message: 'Ce créneau est complet.' };
    var phoneCount = appointmentsList().filter(function (appointment) {
      return appointment.id !== excludeId && appointment.date === dateKey && normalizePhone(appointment.patient.phone) === phone && appointment.status !== 'cancelled';
    }).length;
    if (phoneCount >= s.maxPerPhonePerDay) return { ok: false, code: phoneLimitCode || 'phone_limit', message: 'Trop de rendez-vous pour ce numéro ce jour-là.' };
    return { ok: true };
  }

  function appointmentFromPublic(payload) {
    var name = sanitize(payload.nom || payload.name, 90);
    var phone = normalizePhone(payload.telephone || payload.phone);
    var analysesText = sanitize(payload.analyses, 400);
    var date = String(payload.date || '');
    var slot = parseSlot(payload.creneau || payload.time);
    var isHome = String(payload.lieu || '').toLowerCase().indexOf('domicile') >= 0 || payload.location === 'home';
    if (name.length < 2) return { ok: false, code: 'invalid_name', message: 'Nom invalide.' };
    if (!validPhone(phone)) return { ok: false, code: 'invalid_phone', message: 'Numéro de téléphone invalide.' };
    if (!analysesText) return { ok: false, code: 'invalid_analyses', message: 'Sélectionnez au moins une analyse.' };
    var parsedDate = parseYmd(date);
    if (isNaN(parsedDate.getTime())) return { ok: false, code: 'invalid_date', message: 'Date invalide.' };
    var validated = validateSlot(parsedDate, slot, null, phone, 'too_many');
    if (!validated.ok) return validated;
    if (payload.consentement === false) return { ok: false, code: 'consent', message: 'Le consentement est obligatoire.' };

    var year = new Date().getFullYear();
    var timestamp = nowIso();
    var patientRef = null;
    mutate('patients', function (fresh) {
      var patient = fresh.find(function (p) { return normalizePhone(p.phone) === phone; });
      if (!patient) {
        patient = {
          id: 'PAT-' + nextNumbered(fresh, /^PAT-(\d{4})$/, 4),
          name: name,
          phone: phone,
          mutuelle: sanitize(payload.mutuelle, 60) || 'Aucune',
          notes: '',
          createdAt: timestamp,
          updatedAt: timestamp
        };
        fresh.push(patient);
      } else {
        patient.name = name;
        patient.mutuelle = sanitize(payload.mutuelle, 60) || patient.mutuelle;
        patient.updatedAt = timestamp;
        if (!patient.createdAt) patient.createdAt = timestamp;
      }
      patientRef = patient;
    });

    var appointment = {
      id: uid('apt'),
      reference: null,
      date: date,
      time: slot.time,
      endTime: slot.endTime,
      status: 'pending',
      patient: { id: patientRef ? patientRef.id : null, name: name, phone: phone, mutuelle: patientRef ? patientRef.mutuelle : 'Aucune' },
      location: {
        type: isHome ? 'home' : 'lab',
        zone: isHome ? sanitize(payload.zone, 80) : '',
        address: isHome ? sanitize(payload.adresse, 200) : 'Avenue des FAR, Tétouan'
      },
      analyses: analysesText.split(/\s*[,;]\s*/).filter(Boolean),
      notes: '',
      consent: payload.consentement !== false,
      source: sanitize(payload.source || 'site-public', 40),
      prescription: !!payload.ordonnance,
      createdAt: timestamp,
      updatedAt: timestamp,
      events: [{ type: 'created', at: timestamp, label: 'Créé depuis le site public' }]
    };
    // La référence est générée en relisant les données à jour (mutate) :
    // le compteur est persisté dans la même écriture que le rendez-vous.
    mutate('appointments', function (fresh) {
      var number = bumpCounter('rdv', String(year), fresh, new RegExp('^RDV-' + year + '-(\\d{4})$'), 4);
      appointment.reference = 'RDV-' + year + '-' + number;
      fresh.push(appointment);
    });
    touch();
    logAudit('site public', 'appointment.create', 'appointment', appointment.reference, name + ' — ' + date + ' ' + slot.label);
    emit('appointments', 'create', { id: appointment.id, reference: appointment.reference });
    return { ok: true, reference: appointment.reference, appointment: clone(appointment) };
  }

  function saveAppointment(next, action, auditDetails) {
    var saved = mutate('appointments', function (fresh) {
      var index = fresh.findIndex(function (appointment) { return appointment.id === next.id; });
      if (index === -1) return false;
      next.updatedAt = nowIso();
      fresh[index] = next;
      return true;
    });
    if (!saved) return false;
    touch();
    if (action) logAudit('admin', action, 'appointment', next.reference, auditDetails || '');
    emit('appointments', 'update', { id: next.id, reference: next.reference });
    return true;
  }

  function confirmAppointment(id, actor) {
    var appointment = findAppointment(id);
    if (!appointment) return { ok: false, code: 'not_found' };
    appointment.status = 'confirmed';
    appointment.events = appointment.events || [];
    appointment.events.push({ type: 'confirmed', at: nowIso(), label: 'Rendez-vous confirmé' });
    saveAppointment(appointment, 'appointment.confirm', appointment.reference + ' confirmé');
    return { ok: true, appointment: clone(appointment) };
  }

  function cancelAppointment(id, reason, actor) {
    var appointment = findAppointment(id);
    if (!appointment) return { ok: false, code: 'not_found' };
    appointment.status = 'cancelled';
    appointment.events = appointment.events || [];
    appointment.events.push({ type: 'cancelled', at: nowIso(), label: 'Rendez-vous annulé' + (reason ? ' — ' + reason : '') });
    saveAppointment(appointment, 'appointment.cancel', appointment.reference + (reason ? ' — ' + reason : ''));
    return { ok: true, appointment: clone(appointment) };
  }

  function rescheduleAppointment(id, date, slotValue) {
    var appointment = findAppointment(id);
    if (!appointment) return { ok: false, code: 'not_found', message: 'Rendez-vous introuvable.' };
    var dateObj = parseYmd(date);
    var slot = parseSlot(slotValue);
    if (isNaN(dateObj.getTime()) || !slot) return { ok: false, code: 'invalid_date', message: 'Date ou créneau invalide.' };
    var validated = validateSlot(dateObj, slot, appointment.id, normalizePhone(appointment.patient.phone), 'phone_limit');
    if (!validated.ok) return validated;
    var previous = appointment.date + ' à ' + appointment.time;
    appointment.date = date;
    appointment.time = slot.time;
    appointment.endTime = slot.endTime;
    if (appointment.status === 'cancelled') appointment.status = 'pending';
    appointment.events = appointment.events || [];
    appointment.events.push({ type: 'rescheduled', at: nowIso(), label: 'Rendez-vous reprogrammé', note: 'Créneau précédent : ' + previous });
    saveAppointment(appointment, 'appointment.reschedule', appointment.reference + ' → ' + date + ' ' + slot.label);
    return { ok: true, appointment: clone(appointment) };
  }

  function updateAppointment(id, patch) {
    var appointment = findAppointment(id);
    if (!appointment) return { ok: false, code: 'not_found' };
    patch = patch || {};
    if (patch.status !== undefined && STATUS.indexOf(patch.status) === -1) {
      return { ok: false, code: 'invalid_status', message: 'Statut invalide.' };
    }
    if (patch.date !== undefined || patch.time !== undefined || patch.endTime !== undefined) {
      var date = patch.date !== undefined ? String(patch.date) : appointment.date;
      var slotText;
      if (patch.time !== undefined && patch.endTime !== undefined) slotText = patch.time + '-' + patch.endTime;
      else if (patch.time !== undefined) slotText = patch.time;
      else slotText = appointment.time + '-' + appointment.endTime;
      var dateObj = parseYmd(date);
      var slot = parseSlot(slotText);
      if (isNaN(dateObj.getTime()) || !slot) return { ok: false, code: 'invalid_date', message: 'Date ou créneau invalide.' };
      var validated = validateSlot(dateObj, slot, appointment.id, normalizePhone(appointment.patient.phone), 'phone_limit');
      if (!validated.ok) return validated;
      // Cohérence horaire : si seul l'heure de début change, on recalcule la fin.
      if (patch.time !== undefined && patch.endTime === undefined) patch.endTime = slot.endTime;
    }
    var allowed = ['date', 'time', 'endTime', 'status', 'analyses', 'notes'];
    allowed.forEach(function (field) { if (patch[field] !== undefined) appointment[field] = patch[field]; });
    if (patch.patient) appointment.patient = Object.assign({}, appointment.patient, patch.patient);
    if (patch.location) appointment.location = Object.assign({}, appointment.location, patch.location);
    saveAppointment(appointment, 'appointment.update', appointment.reference);
    return { ok: true, appointment: clone(appointment) };
  }

  function deleteAppointment(id) {
    var removed = null;
    var deleted = mutate('appointments', function (fresh) {
      var index = fresh.findIndex(function (appointment) { return appointment.id === id || appointment.reference === id; });
      if (index === -1) return false;
      removed = fresh.splice(index, 1)[0];
      return true;
    });
    if (!deleted) return false;
    touch();
    logAudit('admin', 'appointment.delete', 'appointment', removed.reference, removed.patient.name);
    emit('appointments', 'delete', { id: removed.id, reference: removed.reference });
    return true;
  }

  function fullSlots(date) {
    var counts = {};
    appointmentsList().forEach(function (appointment) {
      if (appointment.date === date && appointment.status !== 'cancelled') {
        counts[appointment.time] = (counts[appointment.time] || 0) + 1;
      }
    });
    return Object.keys(counts).filter(function (time) {
      return counts[time] >= settings().slotCapacity;
    }).map(function (time) { return slotLabel(time); });
  }

  function patientsList() {
    return read('patients', []);
  }

  function getPatient(id) {
    return patientsList().find(function (p) { return p.id === id; }) || null;
  }

  function savePatient(patient) {
    var index = -1;
    mutate('patients', function (fresh) {
      index = fresh.findIndex(function (p) { return p.id === patient.id; });
      patient.updatedAt = nowIso();
      if (index === -1) fresh.push(patient); else fresh[index] = patient;
    });
    touch();
    emit('patients', index === -1 ? 'create' : 'update', { id: patient.id });
    return clone(patient);
  }

  function createPatient(input) {
    var name = sanitize(input.name, 90);
    var phone = normalizePhone(input.phone);
    if (!name) return { ok: false, message: 'Nom obligatoire.' };
    if (!validPhone(phone)) return { ok: false, message: 'Téléphone invalide.' };
    var patient = null;
    var duplicate = null;
    mutate('patients', function (fresh) {
      duplicate = fresh.find(function (p) { return normalizePhone(p.phone) === phone; }) || null;
      if (duplicate) return;
      patient = {
        id: 'PAT-' + nextNumbered(fresh, /^PAT-(\d{4})$/, 4),
        name: name,
        phone: phone,
        mutuelle: sanitize(input.mutuelle, 60) || 'Aucune',
        notes: sanitize(input.notes, 400),
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      fresh.push(patient);
    });
    if (duplicate) {
      return { ok: false, code: 'duplicate', message: 'Un patient avec ce numéro existe déjà.', patient: clone(duplicate) };
    }
    logAudit('admin', 'patient.create', 'patient', patient.id, name);
    return { ok: true, patient: clone(patient) };
  }

  function updatePatient(id, patch) {
    var patient = patientsList().find(function (p) { return p.id === id; });
    if (!patient) return { ok: false, message: 'Patient introuvable.' };
    if (patch.name !== undefined) patient.name = sanitize(patch.name, 90);
    if (patch.phone !== undefined) {
      if (!validPhone(patch.phone)) return { ok: false, message: 'Téléphone invalide.' };
      patient.phone = normalizePhone(patch.phone);
    }
    if (patch.mutuelle !== undefined) patient.mutuelle = sanitize(patch.mutuelle, 60);
    if (patch.notes !== undefined) patient.notes = sanitize(patch.notes, 400);
    if (!patient.createdAt) patient.createdAt = nowIso();
    savePatient(patient);
    logAudit('admin', 'patient.update', 'patient', patient.id, patient.name);
    return { ok: true, patient: clone(patient) };
  }

  function deletePatient(id) {
    var removed = null;
    var deleted = mutate('patients', function (fresh) {
      var patient = fresh.find(function (p) { return p.id === id; });
      if (!patient) return false;
      removed = patient;
      fresh.splice(fresh.indexOf(patient), 1);
      return true;
    });
    if (!deleted) return false;
    touch();
    logAudit('admin', 'patient.delete', 'patient', id, removed.name);
    emit('patients', 'delete', { id: id });
    return true;
  }

  function dossiersList() {
    return read('dossiers', []);
  }

  function generateCode() {
    var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    var bytes = new Uint8Array(6);
    if (global.crypto && global.crypto.getRandomValues) global.crypto.getRandomValues(bytes);
    else for (var i = 0; i < 6; i += 1) bytes[i] = Math.floor(Math.random() * 256);
    for (var j = 0; j < 6; j += 1) out += alphabet[bytes[j] % alphabet.length];
    return out;
  }

  // Les codes d'accès sont stockés SANS espaces : verifyDossierAccess retire
  // les espaces de la saisie, un code mémorisé avec espaces ne matcherait jamais.
  function normalizeAccessCode(value) {
    return sanitize(value, 20).replace(/\s+/g, '').toUpperCase();
  }

  function saveDossier(dossier) {
    var index = -1;
    mutate('dossiers', function (fresh) {
      index = fresh.findIndex(function (d) { return d.id === dossier.id; });
      dossier.updatedAt = nowIso();
      if (index === -1) fresh.unshift(dossier); else fresh[index] = dossier;
    });
    touch();
    emit('dossiers', index === -1 ? 'create' : 'update', { id: dossier.id });
    return clone(dossier);
  }

  function createDossier(input) {
    var patientName = sanitize(input.patientName, 90);
    if (!patientName) return { ok: false, message: 'Nom du patient obligatoire.' };
    var year = String(new Date().getFullYear()).slice(-2);
    var dossier = null;
    mutate('dossiers', function (fresh) {
      var number = bumpCounter('dossier', year, fresh, new RegExp('^D' + year + '-(\\d{4})$'), 4);
      dossier = {
        id: 'D' + year + '-' + number,
        patientId: input.patientId || null,
        patientName: patientName,
        phone: normalizePhone(input.phone),
        appointmentId: sanitize(input.appointmentId, 40),
        analyses: Array.isArray(input.analyses) ? input.analyses.map(function (a) { return sanitize(a, 120); }) : [],
        status: 'pending',
        accessCode: normalizeAccessCode(input.accessCode) || generateCode(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        sampleDate: input.sampleDate || todayYmd(),
        publishedAt: null,
        expiresAt: null,
        failedAttempts: 0,
        lockedUntil: null,
        accessLog: [],
        pdfName: null,
        pdfSize: null,
        pdfKey: null,
        demo: true
      };
      fresh.unshift(dossier);
    });
    logAudit('admin', 'dossier.create', 'dossier', dossier.id, dossier.patientName);
    emit('dossiers', 'create', { id: dossier.id });
    return { ok: true, dossier: clone(dossier) };
  }

  function updateDossier(id, patch) {
    var dossier = dossiersList().find(function (d) { return d.id === id; });
    if (!dossier) return { ok: false, message: 'Dossier introuvable.' };
    ['patientName', 'phone', 'appointmentId', 'sampleDate'].forEach(function (field) {
      if (patch[field] !== undefined) dossier[field] = sanitize(patch[field], 120);
    });
    if (patch.accessCode !== undefined) {
      var code = normalizeAccessCode(patch.accessCode);
      if (code && dossiersList().some(function (d) { return d.id !== id && d.accessCode === code; })) {
        return { ok: false, message: 'Ce code d’accès est déjà utilisé.' };
      }
      if (code) dossier.accessCode = code;
    }
    if (Array.isArray(patch.analyses)) dossier.analyses = patch.analyses.map(function (a) { return sanitize(a, 120); });
    if (patch.phone !== undefined) dossier.phone = normalizePhone(patch.phone);
    saveDossier(dossier);
    logAudit('admin', 'dossier.update', 'dossier', dossier.id, dossier.patientName);
    return { ok: true, dossier: clone(dossier) };
  }

  function publishDossier(id, actor) {
    var dossier = dossiersList().find(function (d) { return d.id === id; });
    if (!dossier) return { ok: false, message: 'Dossier introuvable.' };
    var s = settings();
    dossier.status = 'ready';
    dossier.publishedAt = nowIso();
    dossier.expiresAt = addDays(new Date(), s.resultValidityDays).toISOString();
    if (!dossier.accessCode) dossier.accessCode = generateCode();
    dossier.failedAttempts = 0;
    dossier.lockedUntil = null;
    saveDossier(dossier);
    logAudit(actor || 'admin', 'dossier.publish', 'dossier', dossier.id, dossier.patientName);
    return { ok: true, dossier: clone(dossier) };
  }

  function revokeDossier(id) {
    var dossier = dossiersList().find(function (d) { return d.id === id; });
    if (!dossier) return { ok: false, message: 'Dossier introuvable.' };
    dossier.status = 'revoked';
    saveDossier(dossier);
    logAudit('admin', 'dossier.revoke', 'dossier', dossier.id, dossier.patientName);
    return { ok: true, dossier: clone(dossier) };
  }

  function deleteDossier(id) {
    var removed = null;
    var deleted = mutate('dossiers', function (fresh) {
      var dossier = fresh.find(function (d) { return d.id === id; });
      if (!dossier) return false;
      removed = dossier;
      fresh.splice(fresh.indexOf(dossier), 1);
      return true;
    });
    if (!deleted) return false;
    // Supprime aussi le PDF associé (sans attendre le résultat).
    try {
      files.remove('pdf-' + id).catch(function () { /* ignore */ });
    } catch (error) { /* ignore */ }
    touch();
    logAudit('admin', 'dossier.delete', 'dossier', id, removed.patientName);
    emit('dossiers', 'delete', { id: id });
    return true;
  }

  function regenerateCode(id) {
    var dossier = dossiersList().find(function (d) { return d.id === id; });
    if (!dossier) return { ok: false, message: 'Dossier introuvable.' };
    dossier.accessCode = normalizeAccessCode(generateCode());
    saveDossier(dossier);
    logAudit('admin', 'dossier.code', 'dossier', dossier.id, 'Code d’accès régénéré');
    return { ok: true, code: dossier.accessCode };
  }

  function saveDossierResults(id, results) {
    var dossier = dossiersList().find(function (d) { return d.id === id; });
    if (!dossier) return { ok: false, message: 'Dossier introuvable.' };
    if (!Array.isArray(results) || results.length > 60) {
      return { ok: false, message: 'Résultats invalides : liste de 60 lignes maximum attendue.' };
    }
    var clean = [];
    for (var i = 0; i < results.length; i += 1) {
      var row = results[i];
      if (!row || typeof row !== 'object' || Array.isArray(row)) {
        return { ok: false, message: 'Ligne de résultat invalide.' };
      }
      var analysis = sanitize(row.analysis, 80);
      if (!analysis) {
        return { ok: false, message: 'Chaque ligne doit indiquer une analyse (80 caractères maximum).' };
      }
      var flag = row.flag === undefined || row.flag === null ? '' : String(row.flag);
      if (RESULT_FLAGS.indexOf(flag) === -1) {
        return { ok: false, message: 'Anomalie invalide (valeurs acceptées : vide, low, high, abnormal).' };
      }
      clean.push({
        analysis: analysis,
        value: sanitize(row.value, 30),
        unit: sanitize(row.unit, 20),
        range: sanitize(row.range, 40),
        flag: flag
      });
    }
    var saved = null;
    mutate('dossiers', function (fresh) {
      var record = fresh.find(function (d) { return d.id === id; });
      if (!record) return;
      record.results = clean;
      record.resultsUpdatedAt = nowIso();
      saved = record;
    });
    if (!saved) return { ok: false, message: 'Dossier introuvable.' };
    touch();
    logAudit('admin', 'results_save', 'dossier', id, clean.length + ' ligne(s) de résultats');
    return { ok: true, dossier: clone(saved) };
  }

  function maskCode(value) {
    var code = String(value || '');
    return code.length < 3 ? '•••' : code.slice(0, 2) + '••' + code.slice(-1);
  }

  function verifyDossierAccess(dossierInput, codeInput) {
    var dossierId = sanitize(dossierInput, 40).toUpperCase();
    var code = sanitize(codeInput, 20).toUpperCase().replace(/\s/g, '');
    var list = dossiersList();
    var dossier = list.find(function (d) { return d.id.toUpperCase() === dossierId; });
    if (!dossier || dossier.status !== 'ready') {
      return { ok: false, code: 'not_found', message: 'Dossier introuvable ou non publié.' };
    }
    if (dossier.lockedUntil && new Date(dossier.lockedUntil).getTime() > Date.now()) {
      var wait = Math.ceil((new Date(dossier.lockedUntil).getTime() - Date.now()) / 60000);
      return { ok: false, code: 'locked', message: 'Accès temporairement bloqué. Réessayez dans ' + wait + ' minute(s).', retryAfter: wait };
    }
    if (dossier.lockedUntil && new Date(dossier.lockedUntil).getTime() <= Date.now()) {
      dossier.lockedUntil = null;
      dossier.failedAttempts = 0;
    }
    if (dossier.expiresAt && new Date(dossier.expiresAt).getTime() < Date.now()) {
      return { ok: false, code: 'expired', message: 'L’accès à ce résultat a expiré.' };
    }
    if (String(dossier.accessCode).toUpperCase() !== code) {
      dossier.failedAttempts = (dossier.failedAttempts || 0) + 1;
      var s = settings();
      if (dossier.failedAttempts >= s.maxResultAttempts) {
        dossier.lockedUntil = new Date(Date.now() + s.resultLockMinutes * 60000).toISOString();
        dossier.failedAttempts = 0;
        saveDossier(dossier);
        logAudit('site public', 'dossier.lock', 'dossier', dossier.id, 'Trop de tentatives');
        return { ok: false, code: 'locked', message: 'Trop de tentatives. Accès bloqué pendant ' + s.resultLockMinutes + ' minutes.' };
      }
      saveDossier(dossier);
      return { ok: false, code: 'invalid', message: 'Code d’accès incorrect.', attemptsRemaining: s.maxResultAttempts - dossier.failedAttempts };
    }
    dossier.failedAttempts = 0;
    dossier.lockedUntil = null;
    dossier.accessLog = dossier.accessLog || [];
    dossier.accessLog.unshift({ at: nowIso(), action: 'access', result: 'success' });
    if (dossier.accessLog.length > 100) dossier.accessLog.length = 100;
    saveDossier(dossier);
    logAudit('site public', 'dossier.access', 'dossier', dossier.id, 'Accès autorisé');
    return { ok: true, dossier: clone(dossier), hasPdf: !!(dossier.pdfKey || dossier.demo) };
  }

  var fileDbPromise = null;

  function fileDb() {
    if (!global.indexedDB) return Promise.reject(new Error('IndexedDB indisponible'));
    if (fileDbPromise) return fileDbPromise;
    fileDbPromise = new Promise(function (resolve, reject) {
      var request = global.indexedDB.open(PREFIX + 'files', 1);
      request.onupgradeneeded = function () {
        var db = request.result;
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
    // En cas d'échec d'ouverture, on réinitialise le cache pour retenter
    // au prochain appel au lieu de rejeter indéfiniment.
    fileDbPromise.catch(function () { fileDbPromise = null; });
    return fileDbPromise;
  }

  var files = {
    put: function (keyValue, blob) {
      return fileDb().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction('files', 'readwrite');
          tx.objectStore('files').put(blob, keyValue);
          tx.oncomplete = function () { resolve(keyValue); };
          tx.onerror = function () { reject(tx.error); };
          tx.onabort = function () { reject(tx.error || new Error('Transaction abandonnée')); };
        });
      });
    },
    get: function (keyValue) {
      return fileDb().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction('files', 'readonly');
          var req = tx.objectStore('files').get(keyValue);
          req.onsuccess = function () { resolve(req.result || null); };
          req.onerror = function () { reject(req.error); };
        });
      });
    },
    list: function () {
      return fileDb().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction('files', 'readonly');
          var req = tx.objectStore('files').openCursor();
          var keys = [];
          req.onsuccess = function () {
            var cursor = req.result;
            if (cursor) {
              keys.push({ key: cursor.key });
              cursor.continue();
            } else {
              resolve(keys);
            }
          };
          req.onerror = function () { reject(req.error); };
        });
      }).catch(function () { return []; });
    },
    remove: function (keyValue) {
      return fileDb().then(function (db) {
        return new Promise(function (resolve) {
          var tx = db.transaction('files', 'readwrite');
          tx.objectStore('files').delete(keyValue);
          tx.oncomplete = function () { resolve(true); };
          tx.onerror = function () { resolve(false); };
          tx.onabort = function () { resolve(false); };
        });
      }).catch(function () { return false; });
    },
    clear: function () {
      return fileDb().then(function (db) {
        return new Promise(function (resolve) {
          var tx = db.transaction('files', 'readwrite');
          tx.objectStore('files').clear();
          tx.oncomplete = function () { resolve(true); };
          tx.onerror = function () { resolve(false); };
          tx.onabort = function () { resolve(false); };
        });
      }).catch(function () { return false; });
    }
  };

  function attachDossierPdf(id, file) {
    var dossier = dossiersList().find(function (d) { return d.id === id; });
    if (!dossier) return Promise.resolve({ ok: false, message: 'Dossier introuvable.' });
    if (!file) return Promise.resolve({ ok: false, message: 'Aucun fichier sélectionné.' });
    var isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
    if (!isPdf) return Promise.resolve({ ok: false, message: 'Le fichier doit être un PDF.' });
    if (file.size > 5 * 1024 * 1024) return Promise.resolve({ ok: false, message: 'PDF trop volumineux (5 Mo maximum).' });
    var fileKey = 'pdf-' + id;
    return files.put(fileKey, file).then(function () {
      if (dossier.pdfKey && dossier.pdfKey !== fileKey) files.remove(dossier.pdfKey);
      dossier.pdfKey = fileKey;
      dossier.pdfName = sanitize(file.name || ('Resultats-' + id + '.pdf'), 120);
      dossier.pdfSize = file.size;
      dossier.demo = false;
      saveDossier(dossier);
      logAudit('admin', 'dossier.pdf', 'dossier', id, dossier.pdfName + ' (' + Math.round(file.size / 1024) + ' Ko)');
      return { ok: true, dossier: clone(dossier) };
    }).catch(function () {
      return { ok: false, message: 'Impossible d’enregistrer le PDF dans le stockage local.' };
    });
  }

  function getDossierPdf(id) {
    var dossier = dossiersList().find(function (d) { return d.id === id; });
    if (!dossier) return Promise.resolve(null);
    if (dossier.pdfKey) {
      return files.get(dossier.pdfKey).then(function (blob) {
        return blob || repairMissingPdf(dossier);
      }).catch(function () { return repairMissingPdf(dossier); });
    }
    return Promise.resolve(dossier.demo ? buildDemoPdf(dossier) : null);
  }

  // Le PDF annoncé par les métadonnées est introuvable dans IndexedDB :
  // on répare la fiche (pdfKey/pdfName/pdfSize réinitialisés) et on renvoie null.
  function repairMissingPdf(dossier) {
    if (dossier.demo) return buildDemoPdf(dossier);
    mutate('dossiers', function (fresh) {
      var record = fresh.find(function (d) { return d.id === dossier.id; });
      if (record) {
        record.pdfKey = null;
        record.pdfName = null;
        record.pdfSize = null;
      }
    });
    logAudit('system', 'dossier.pdf_missing', 'dossier', dossier.id, 'Métadonnées PDF réinitialisées');
    return null;
  }

  function pdfEscape(text) {
    return String(text).replace(/[^\x20-\x7E]/g, '?').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  function buildDemoPdf(dossier) {
    var lines = [
      'LABORATOIRE DERDABI - DEMONSTRATION',
      'Avenue des FAR, Tetouan - Maroc',
      '',
      'DOCUMENT FICTIF - PROJET UNIVERSITAIRE',
      'Aucune valeur medicale - aucune donnee reelle',
      '',
      'Dossier : ' + dossier.id,
      'Patient : ' + dossier.patientName,
      'Date de prelevement : ' + dossier.sampleDate,
      'Analyses : ' + (dossier.analyses || []).join(', '),
      '',
      'Resultats de demonstration :',
      'Glycemie a jeun ........ 0,92 g/L',
      'Hemoglobine ............ 13,8 g/dL',
      'Leucocytes ............. 6 400 /mm3',
      'Plaquettes ............. 245 000 /mm3',
      'Creatinine ............. 0,84 mg/dL',
      '',
      'Ce document est genere automatiquement pour la',
      'demonstration. Il ne doit jamais etre utilise',
      'dans un contexte medical reel.',
      '',
      'Laboratoire Derdabi - 05 00 05 55 05'
    ];
    var content = 'BT /F1 12 Tf 50 790 Td 16 TL ' + lines.map(function (line) { return '(' + pdfEscape(line) + ') Tj T*'; }).join(' ') + ' ET';
    var objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream'
    ];
    var pdf = '%PDF-1.4\n';
    var offsets = [0];
    objects.forEach(function (object, index) {
      offsets.push(pdf.length);
      pdf += (index + 1) + ' 0 obj\n' + object + '\nendobj\n';
    });
    var xref = pdf.length;
    pdf += 'xref\n0 ' + (objects.length + 1) + '\n0000000000 65535 f \n';
    for (var i = 1; i < offsets.length; i += 1) pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    pdf += 'trailer\n<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
    var bytes = new Uint8Array(pdf.length);
    for (var j = 0; j < pdf.length; j += 1) bytes[j] = pdf.charCodeAt(j) & 0xFF;
    return new Blob([bytes], { type: 'application/pdf' });
  }

  function messagesList() {
    return read('messages', []);
  }

  function createMessage(input) {
    var list = messagesList();
    var message = {
      id: 'MSG-' + nextNumbered(list, /^MSG-(\d{4})$/, 4),
      name: sanitize(input.name, 90),
      phone: normalizePhone(input.phone),
      subject: sanitize(input.subject, 140),
      body: sanitize(input.body, 1500),
      read: false,
      status: 'new',
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    if (!message.name || !message.body) return { ok: false, message: 'Nom et message obligatoires.' };
    mutate('messages', function (fresh) {
      fresh.unshift(message);
    });
    touch();
    logAudit('site public', 'message.create', 'message', message.id, message.subject);
    emit('messages', 'create', { id: message.id });
    return { ok: true, message: clone(message) };
  }

  function updateMessage(id, patch) {
    var updated = null;
    mutate('messages', function (fresh) {
      var message = fresh.find(function (m) { return m.id === id; });
      if (!message) return;
      if (patch.read !== undefined) message.read = !!patch.read;
      if (patch.status !== undefined) message.status = sanitize(patch.status, 20);
      message.updatedAt = nowIso();
      updated = message;
    });
    if (!updated) return null;
    logAudit('admin', 'message_update', 'message', id, 'Statut : ' + updated.status);
    emit('messages', 'update', { id: id });
    return clone(updated);
  }

  function deleteMessage(id) {
    var deleted = false;
    mutate('messages', function (fresh) {
      var index = fresh.findIndex(function (m) { return m.id === id; });
      if (index === -1) return;
      fresh.splice(index, 1);
      deleted = true;
    });
    if (!deleted) return false;
    touch();
    logAudit('admin', 'message.delete', 'message', id, '');
    emit('messages', 'delete', { id: id });
    return true;
  }

  function analysesList() {
    return read('analysesCatalog', defaultAnalyses());
  }

  function saveAnalysis(input) {
    var nameFr = sanitize(input.nameFr || input.name, 120);
    if (!nameFr) return { ok: false, message: 'Nom obligatoire.' };
    var record = null;
    var isNew = false;
    mutate('analysesCatalog', function (fresh) {
      var id = sanitize(input.id || '', 60) || 'analysis-' + Date.now().toString(36);
      var existing = fresh.find(function (a) { return a.id === id; });
      record = existing || { id: id, order: fresh.length };
      record.name = { fr: nameFr, ar: sanitize(input.nameAr || input.name, 120) };
      record.discipline = { fr: sanitize(input.disciplineFr || input.discipline, 80), ar: sanitize(input.disciplineAr || input.discipline, 80) };
      record.price = sanitize(input.price, 30);
      record.fasting = input.fasting === true || input.fasting === 'yes' ? 'yes' : 'no';
      record.delay = { fr: sanitize(input.delayFr || input.delay, 40), ar: sanitize(input.delayAr || input.delay, 40) };
      record.prep = { fr: sanitize(input.prepFr || record.prep && record.prep.fr, 200), ar: sanitize(input.prepAr || record.prep && record.prep.ar, 200) };
      record.active = input.active !== false;
      if (existing) fresh[fresh.indexOf(existing)] = record; else { fresh.push(record); isNew = true; }
    });
    touch();
    logAudit('admin', isNew ? 'analysis.create' : 'analysis.update', 'analysis', record.id, record.name.fr);
    emit('analysesCatalog', isNew ? 'create' : 'update', { id: record.id });
    return { ok: true, analysis: clone(record) };
  }

  function deleteAnalysis(id) {
    var deleted = false;
    mutate('analysesCatalog', function (fresh) {
      var index = fresh.findIndex(function (a) { return a.id === id; });
      if (index === -1) return;
      fresh.splice(index, 1);
      deleted = true;
    });
    if (!deleted) return false;
    touch();
    logAudit('admin', 'analysis.delete', 'analysis', id, '');
    emit('analysesCatalog', 'delete', { id: id });
    return true;
  }

  function trackPageView() {
    var count = 1;
    mutate('pageViews', function (fresh) {
      var today = todayYmd();
      var entry = fresh.find(function (v) { return v.date === today; });
      if (entry) entry.count = (entry.count || 0) + 1;
      else fresh.push({ date: today, count: 1, source: 'live' });
      if (fresh.length > 180) fresh.splice(0, fresh.length - 180);
      var current = fresh.find(function (v) { return v.date === today; });
      count = current ? (current.count || 1) : 1;
    });
    emit('pageViews', 'track', { date: todayYmd() });
    return count;
  }

  function summary() {
    var appointments = appointmentsList();
    var dossiers = dossiersList();
    var patients = patientsList();
    var messages = messagesList();
    var views = read('pageViews', []);
    var today = todayYmd();
    var counts = { total: appointments.length, pending: 0, confirmed: 0, cancelled: 0, completed: 0, home: 0, today: 0, patients: patients.length, dossiers: dossiers.length, ready: 0, unread: 0, viewsToday: 0 };
    appointments.forEach(function (appointment) {
      if (counts[appointment.status] !== undefined) counts[appointment.status] += 1;
      if (appointment.location && appointment.location.type === 'home') counts.home += 1;
      if (appointment.date === today && appointment.status !== 'cancelled') counts.today += 1;
    });
    dossiers.forEach(function (dossier) { if (dossier.status === 'ready') counts.ready += 1; });
    messages.forEach(function (message) { if (!message.read) counts.unread += 1; });
    views.forEach(function (view) { if (view.date === today) counts.viewsToday = view.count; });
    return counts;
  }

  function subtleAvailable() {
    return !!(global.crypto && global.crypto.subtle && global.TextEncoder);
  }

  // algo optionnel : 'sha256' | 'simple'. Sans algo, comportement historique
  // (SHA-256 si disponible, sinon empreinte simple).
  function hashPin(pin, algo) {
    if (algo === 'simple' || !subtleAvailable()) {
      return Promise.resolve(simpleHash(String(pin)));
    }
    return global.crypto.subtle.digest('SHA-256', new global.TextEncoder().encode(String(pin))).then(function (buffer) {
      return Array.prototype.map.call(new Uint8Array(buffer), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  function simpleHash(input) {
    var h1 = 0xdeadbeef;
    var h2 = 0x41c6ce57;
    for (var i = 0; i < input.length; i += 1) {
      var ch = input.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
  }

  function verifyPin(pin) {
    var s = settings();
    var target = s.pinHash;
    var recorded = s.pinHashAlgo;
    function matches(hash) { return hash === target; }
    var first = recorded === 'simple' ? hashPin(pin, 'simple') : hashPin(pin, 'sha256');
    return first.then(function (hash) {
      if (matches(hash)) return true;
      // Données héritées sans algorithme enregistré (ou algo sha256 mais
      // crypto indisponible) : on tente l'empreinte simple en secours.
      if (recorded === 'sha256' && subtleAvailable()) return false;
      return hashPin(pin, 'simple').then(matches);
    });
  }

  function setPin(pin) {
    var value = String(pin == null ? '' : pin);
    if (value.length < 4 || value.length > 32) return Promise.resolve(false);
    var algo = subtleAvailable() ? 'sha256' : 'simple';
    return hashPin(value, algo).then(function (hash) {
      var next = settings();
      next.pinHash = hash;
      next.pinHashAlgo = algo;
      next.pinUpdatedAt = nowIso();
      write('settings', next);
      emit('settings', 'update', null);
      logAudit('admin', 'settings.update', 'settings', 'global', 'PIN mis à jour');
      return true;
    });
  }

  function restoreRecord(collection, record) {
    if (COLLECTIONS.indexOf(collection) === -1 || !record || !record.id) return false;
    var list = read(collection, []);
    if (list.some(function (item) { return item.id === record.id; })) return false;
    list.unshift(clone(record));
    write(collection, list);
    touch();
    logAudit('admin', 'restore', collection, record.id, 'Action annulée');
    emit(collection, 'create', { id: record.id });
    return true;
  }

  function exportAll() {
    var out = { version: DB_VERSION, exportedAt: nowIso(), data: {} };
    COLLECTIONS.forEach(function (name) { out.data[name] = read(name, name === 'settings' ? defaultSettings() : []); });
    return out;
  }

  function importAll(payload) {
    if (!payload || !payload.data) return Promise.resolve({ ok: false, message: 'Fichier invalide.' });
    var data = payload.data;
    COLLECTIONS.forEach(function (name) {
      if (data[name] !== undefined) write(name, data[name]);
    });
    if (!data.settings) write('settings', Object.assign(defaultSettings(), data.settings || {}));
    touch();
    logAudit('admin', 'database.import', 'database', 'global', 'Import JSON');
    emit('database', 'import', null);
    return Promise.resolve({ ok: true });
  }

  function reset() {
    COLLECTIONS.forEach(function (name) { remove(name); });
    remove('meta');
    files.clear();
    seed();
    emit('database', 'reset', null);
    return true;
  }

  function ensureStorageNotice() {
    if (storageOk) return;
    if (global.document && document.readyState !== 'loading') showNotice(); else document.addEventListener('DOMContentLoaded', showNotice);
    function showNotice() {
      if (document.getElementById('labdb-storage-notice')) return;
      var div = document.createElement('div');
      div.id = 'labdb-storage-notice';
      div.className = 'labdb-storage-notice';
      div.setAttribute('role', 'alert');
      div.textContent = 'Stockage local indisponible : les modifications seront perdues au rechargement.';
      document.body.appendChild(div);
    }
  }

  function init() {
    try {
      global.localStorage.setItem(PREFIX + 'test', '1');
      global.localStorage.removeItem(PREFIX + 'test');
      storageOk = true;
      lastError = null;
    } catch (error) {
      storageOk = false;
    }
    ensureSeed();
    // Chaque objet de collection exposé via LabDB.memory est gelé : le code
    // externe ne peut plus le muter en silence (les écritures passent par write()).
    COLLECTIONS.forEach(function (name) {
      if (memory[name] && typeof memory[name] === 'object') {
        try { Object.freeze(memory[name]); } catch (error) { /* ignore */ }
      }
    });
    if (global.BroadcastChannel) {
      try {
        channel = new global.BroadcastChannel(CHANNEL);
        channel.onmessage = function (event) {
          var msg = event.data || {};
          listeners.slice().forEach(function (fn) {
            try { fn({ collection: msg.collection, type: msg.type, detail: msg.detail, at: msg.at, external: true }); } catch (error) { /* ignore */ }
          });
        };
      } catch (error) { channel = null; }
    }
    global.addEventListener('storage', function (event) {
      if (!event.key || event.key.indexOf(PREFIX) !== 0) return;
      var name = event.key.slice(PREFIX.length);
      listeners.slice().forEach(function (fn) {
        try { fn({ collection: name, type: 'storage', detail: null, at: nowIso(), external: true }); } catch (error) { /* ignore */ }
      });
    });
    ensureStorageNotice();
  }

  var api = {
    VERSION: DB_VERSION,
    PREFIX: PREFIX,
    memory: memory,
    init: init,
    seed: seed,
    reset: reset,
    onChange: onChange,
    storageAvailable: function () { return storageOk && !lastError; },
    summary: summary,
    audit: {
      list: function () { return read('auditLog', []); },
      log: logAudit
    },
    settings: {
      get: settings,
      save: saveSettings,
      reset: function () {
        mutate('settings', function (fresh) {
          var current = fresh && typeof fresh === 'object' ? fresh : {};
          var pinHash = current.pinHash;
          var pinHashAlgo = current.pinHashAlgo;
          Object.keys(current).forEach(function (field) { delete current[field]; });
          var defaults = defaultSettings();
          Object.keys(defaults).forEach(function (field) { current[field] = defaults[field]; });
          // La réinitialisation des paramètres ne doit pas invalider le PIN.
          if (pinHash !== undefined) current.pinHash = pinHash;
          current.pinHashAlgo = pinHashAlgo || 'sha256';
        }, defaultSettings());
        emit('settings', 'update', null);
        logAudit('admin', 'settings_reset', 'settings', null);
      }
    },
    appointments: {
      list: appointmentsList,
      get: findAppointment,
      create: appointmentFromPublic,
      update: updateAppointment,
      confirm: confirmAppointment,
      cancel: cancelAppointment,
      reschedule: rescheduleAppointment,
      remove: deleteAppointment,
      fullSlots: fullSlots,
      references: function () { return appointmentsList().map(function (appointment) { return appointment.reference; }); }
    },
    patients: {
      list: patientsList,
      get: getPatient,
      create: createPatient,
      update: updatePatient,
      remove: deletePatient
    },
    dossiers: {
      list: dossiersList,
      get: function (id) { return dossiersList().find(function (d) { return d.id === id; }) || null; },
      create: createDossier,
      update: updateDossier,
      publish: publishDossier,
      revoke: revokeDossier,
      remove: deleteDossier,
      regenerateCode: regenerateCode,
      verify: verifyDossierAccess,
      saveResults: saveDossierResults,
      attachPdf: attachDossierPdf,
      getPdf: getDossierPdf,
      demoPdf: buildDemoPdf,
      maskCode: maskCode,
      generateCode: generateCode
    },
    messages: {
      list: messagesList,
      create: createMessage,
      update: updateMessage,
      remove: deleteMessage
    },
    analyses: {
      list: analysesList,
      save: saveAnalysis,
      remove: deleteAnalysis
    },
    pageViews: {
      list: function () { return read('pageViews', []); },
      track: trackPageView
    },
    files: files,
    auth: {
      hashPin: hashPin,
      verifyPin: verifyPin,
      setPin: setPin
    },
    exportAll: exportAll,
    importAll: importAll,
    restore: restoreRecord,
    utils: {
      sanitize: sanitize,
      normalizePhone: normalizePhone,
      validPhone: validPhone,
      formatPhone: formatPhone,
      slotLabel: slotLabel,
      parseSlot: parseSlot,
      slotsForDate: slotsForDate,
      ymd: ymd,
      parseYmd: parseYmd,
      today: todayYmd,
      addDays: addDays
    }
  };

  global.LabDB = api;
  init();
})(window);
