(function () {
  'use strict';

  var SESSION_KEY = 'derdabi_admin_session';
  var form = document.getElementById('login-form');
  var input = document.getElementById('login-pin');
  var errorEl = document.getElementById('login-error');
  var submit = document.getElementById('login-submit');

  function setError(message) {
    errorEl.textContent = message || '';
    errorEl.hidden = !message;
  }

  function existingSession() {
    try {
      var session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      return session && session.expiresAt && Date.now() < Number(session.expiresAt) &&
        (Date.now() - Number(session.lastActivity || 0)) < Number(session.idleMinutes || 30) * 60000;
    } catch (error) {
      return false;
    }
  }

  if (existingSession()) {
    window.location.replace('index.html');
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var pin = input.value.trim();
    if (pin.length < 4) {
      setError('Saisissez le code PIN (4 caractères minimum).');
      input.focus();
      return;
    }
    if (!window.LabDB) {
      setError('Base locale indisponible. Vérifiez que db.js est bien chargé.');
      return;
    }
    setError('');
    submit.disabled = true;
    submit.textContent = 'Vérification…';
    var settings = window.LabDB.settings.get();
    window.LabDB.auth.verifyPin(pin).then(function (ok) {
      if (!ok) {
        setError('Code PIN incorrect. PIN de démonstration : derdabi2026.');
        submit.disabled = false;
        submit.textContent = 'Se connecter';
        input.select();
        return;
      }
      var session = {
        actor: 'admin',
        createdAt: Date.now(),
        lastActivity: Date.now(),
        idleMinutes: settings.sessionMinutes || 30,
        expiresAt: Date.now() + (settings.sessionMinutes || 30) * 60000
      };
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch (error) {
        setError('Session impossible : le stockage du navigateur est bloqué.');
        submit.disabled = false;
        submit.textContent = 'Se connecter';
        return;
      }
      window.location.replace('index.html');
    }).catch(function () {
      setError('Vérification impossible. Rechargez la page.');
      submit.disabled = false;
      submit.textContent = 'Se connecter';
    });
  });
})();
