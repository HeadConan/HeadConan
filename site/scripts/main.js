/* ============================================================
   HEADCONAN /site — page interactions + bilingual i18n
   ------------------------------------------------------------
   Sections: door (parallax + enter), gate (desires), portals,
   perspective (player/host), not-a-chatbot, world-specific UI.
   All local, deterministic, keyboard-accessible, motion-minimal.

   i18n: applyI18n() swaps every [data-i18n] (textContent) and
   [data-i18n-html] (innerHTML) node from window.I18N[lang].
   Dynamic content (desires reveal, not-a-chatbot diagram) is
   rendered from I18N[lang] and re-rendered on language switch.
   The chosen language persists in localStorage ('hc-lang').
   ============================================================ */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ================= language state ================= */

  var lang = (function () {
    try { return localStorage.getItem('hc-lang') || 'en'; }
    catch (e) { return 'en'; }
  })();
  if (lang !== 'en' && lang !== 'zh') lang = 'en';
  window.HC_LANG = lang;

  // resolve a dotted key inside an object, with en fallback
  function resolve(obj, key) {
    var parts = key.split('.');
    var v = obj;
    for (var i = 0; i < parts.length; i++) {
      if (v && typeof v === 'object') v = v[parts[i]]; else return undefined;
    }
    return v;
  }
  function t(key) {
    var v = resolve(I18N[lang], key);
    if (v === undefined) v = resolve(I18N.en, key);
    return (v === undefined) ? key : v;
  }

  /* ================= 01 / DOOR ================= */

  // subtle cursor parallax on world fragments (disabled for reduced motion / touch)
  var parallax = null;
  if (finePointer && !reduceMotion) {
    var frags = document.querySelectorAll('.frag');
    var door = $('door');
    parallax = function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      frags.forEach(function (f, i) {
        var depth = 4 + (i % 3) * 3;
        f.style.transform = 'rotate(' + (i % 2 ? 3 : -3) * 0.5 + 'deg) translate(' + (x * depth) + 'px,' + (y * depth * 0.6) + 'px)';
      });
    };
    door.addEventListener('mousemove', parallax);
  }

  // ENTER: fragments settle, page opens, scroll to gate
  $('enter-btn').addEventListener('click', function () {
    document.body.classList.add('entered');
    if (typeof frags !== 'undefined') {
      frags.forEach(function (f) { f.style.transform = ''; });
    }
    if (door && door.removeEventListener) {
      door.removeEventListener('mousemove', parallax);
    }
    document.querySelector('#gate').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // portal ENTER buttons jump to the demo
  document.querySelectorAll('.portal-enter').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelector('#demo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ================= asset slots: png → svg fallback ================= */
  // Try the licensed/official .png first; if missing (404), swap to the bundled .svg poster.
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.src.indexOf(img.dataset.fallback) === -1) {
        img.src = img.dataset.fallback;
      }
    });
  });

  /* ================= 02 / GATE (desires) ================= */

  var activeDesire = null;

  function showDesire(id) {
    activeDesire = id;
    var d = I18N[lang].gate.desireDetail[id];
    document.querySelectorAll('.desire').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.desire === id);
    });
    $('reveal-empty').hidden = true;
    $('reveal-body').hidden = false;
    $('reveal-title').textContent = t('gate.desires.' + id);
    $('reveal-line').textContent = d.line;
    var chips = $('reveal-chips');
    chips.innerHTML = '';
    d.chips.forEach(function (c) {
      var s = document.createElement('span');
      s.textContent = c;
      chips.appendChild(s);
    });
  }

  document.querySelectorAll('.desire').forEach(function (b) {
    b.addEventListener('click', function () { showDesire(b.dataset.desire); });
  });

  /* ================= 05 / PERSPECTIVE ================= */

  document.querySelectorAll('.persp-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var mode = b.dataset.persp;
      document.querySelectorAll('.persp-toggle').forEach(function (x) {
        x.classList.toggle('is-active', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      $('persp-player').classList.toggle('is-visible', mode === 'player');
      $('persp-host').classList.toggle('is-visible', mode === 'host');
    });
  });

  /* ================= 06 / NOT A CHATBOT ================= */

  var ncMode = 'chat';

  function renderNC(mode) {
    var box = $('nc-diagram');
    box.innerHTML = '';
    var steps = (mode === 'headconan') ? I18N[lang].nc.headconanSteps : I18N[lang].nc.chatSteps;
    var conseqIndex = (mode === 'headconan') ? 3 : -1;
    steps.forEach(function (text, i) {
      if (i > 0) {
        var arrow = document.createElement('div');
        arrow.className = 'nc-arrow';
        arrow.textContent = '↓';
        arrow.setAttribute('aria-hidden', 'true');
        box.appendChild(arrow);
      }
      var d = document.createElement('div');
      d.className = 'nc-step' + (i === conseqIndex ? ' step-conseq' : '');
      var k = document.createElement('span');
      k.className = 'nc-k';
      k.textContent = (mode === 'headconan')
        ? (i === 0 ? t('nc.roles.you') : (i === conseqIndex ? t('nc.roles.world') : t('nc.roles.world')))
        : (i === 0 ? t('nc.roles.you') : t('nc.roles.it'));
      var tx = document.createElement('span');
      tx.textContent = text;
      d.appendChild(k);
      d.appendChild(tx);
      box.appendChild(d);
    });
  }

  document.querySelectorAll('.nc-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      ncMode = b.dataset.nc;
      document.querySelectorAll('.nc-toggle').forEach(function (x) {
        x.classList.toggle('is-active', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      renderNC(ncMode);
    });
  });

  /* ================= 07 / WORLD-SPECIFIC UI ================= */

  document.querySelectorAll('.wui-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var id = tab.dataset.tab;
      document.querySelectorAll('.wui-tab').forEach(function (t2) {
        t2.classList.toggle('is-active', t2 === tab);
        t2.setAttribute('aria-selected', String(t2 === tab));
      });
      document.querySelectorAll('.wui-panel').forEach(function (p) {
        var show = p.id === 'wui-' + id;
        p.hidden = !show;
        p.classList.toggle('is-visible', show);
      });
    });
  });

  /* ================= language toggle ================= */

  function applyI18n() {
    document.documentElement.lang = (lang === 'zh') ? 'zh-CN' : 'en';
    document.title = t('meta.title');
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('meta.desc'));

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.dataset.i18nHtml);
    });

    // toggle label shows the language you can switch TO
    var btn = $('lang-toggle');
    if (btn) btn.textContent = (lang === 'en') ? I18N.en.toggle.toZh : I18N.zh.toggle.toEn;

    // re-render dynamic sections in the new language
    if (activeDesire) showDesire(activeDesire);
    renderNC(ncMode);
  }

  function setLang(next) {
    lang = next;
    window.HC_LANG = lang;
    try { localStorage.setItem('hc-lang', lang); } catch (e) {}
    applyI18n();
    // notify demo.js so its state machine re-renders in the new language
    window.dispatchEvent(new CustomEvent('hc:langchange', { detail: { lang: lang } }));
  }

  $('lang-toggle').addEventListener('click', function () {
    setLang(lang === 'en' ? 'zh' : 'en');
  });

  /* ---------- init ---------- */
  applyI18n();
  renderNC(ncMode);
})();
