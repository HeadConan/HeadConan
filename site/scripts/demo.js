/* ============================================================
   HEADCONAN /site — SPY × FAMILY interactive demo (bilingual)
   ------------------------------------------------------------
   Deterministic local state machine. No AI, no server, no API.
   Every action mutates visible state: emotions, suspicion,
   affinity, world events, and a secret document.

   All user-facing strings are pulled from window.I18N[lang]
   (see i18n.js). On language switch, main.js dispatches the
   'hc:langchange' event; this module updates its lang and
   re-renders. The feed keeps the language captured at the
   moment each event was pushed (acceptable for a demo).
   ============================================================ */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function getLang() {
    try { return localStorage.getItem('hc-lang') || 'en'; }
    catch (e) { return 'en'; }
  }
  var lang = getLang();
  if (lang !== 'en' && lang !== 'zh') lang = 'en';
  window.HC_LANG = lang;

  var INITIAL = {
    yorEmotion: 'calm',
    playerKnows: false,      // does the player know Yor is an assassin
    suspicion: 0,            // 0 - 100
    trust: 40,               // 0 - 100, displayed on Yor card
    affinity: 6,             // 0 - 10 pips
    secretsExposed: false,
    left: false,
    askCount: 0,
    events: []
  };

  var state = null;

  function reset() {
    state = JSON.parse(JSON.stringify(INITIAL));
    state.yorLine = I18N[lang].demo.initial.yorLine;
    render();
  }

  // ---------- event feed ----------
  function pushEvent(text) {
    state.events.unshift({ turn: '07:' + String(30 + state.events.length * 3).padStart(2, '0'), text: text });
    if (state.events.length > 5) state.events.pop();
  }

  // ---------- render ----------
  function render() {
    var T = I18N[lang];
    var yorCard = $('yor-card');
    var yorState = $('yor-state');
    var yorLine = $('yor-line');
    var loidState = $('loid-state');
    var loidLine = $('loid-line');
    var trustFill = $('yor-trust');
    var suspicionFill = $('loid-suspicion');
    var stageTitle = $('stage-title');

    // Yor card
    yorState.textContent = T.demo.emotion[state.yorEmotion];
    yorLine.textContent = state.yorLine;
    yorCard.classList.toggle('is-alert', state.yorEmotion === 'alert');
    yorCard.classList.toggle('is-noticed', state.yorEmotion === 'noticed');
    trustFill.style.width = state.trust + '%';

    // Player card
    loidState.textContent = state.playerKnows ? T.demo.loidState.knows : T.demo.loidState.covering;
    loidLine.textContent = state.playerKnows
      ? T.demo.initial.loidKnowsLine
      : T.demo.initial.loidLine;
    suspicionFill.style.width = state.suspicion + '%';

    // Stage title
    stageTitle.textContent = state.left ? T.demo.stageEmpty : T.demo.stageRoom;

    // Relationship pips
    var pips = $('rel-pips');
    pips.innerHTML = '';
    for (var i = 0; i < 10; i++) {
      var pip = document.createElement('span');
      if (i < state.affinity) pip.className = 'on';
      pips.appendChild(pip);
    }

    // Feed
    var feed = $('feed-list');
    feed.innerHTML = '';
    state.events.forEach(function (ev) {
      var li = document.createElement('li');
      var t = document.createElement('span');
      t.className = 'feed-turn';
      t.textContent = ev.turn;
      var tx = document.createElement('span');
      tx.textContent = ev.text;
      li.appendChild(t);
      li.appendChild(tx);
      feed.appendChild(li);
    });

    // Secret document
    $('secret-doc').hidden = !state.secretsExposed;

    // Disable actions after leaving
    document.querySelectorAll('[data-demo]').forEach(function (b) {
      if (b.dataset.demo === 'reset') return;
      b.disabled = state.left;
    });
  }

  // ---------- actions ----------
  var ACTIONS = {
    ask: function () {
      state.askCount++;
      pushEvent(I18N[lang].demo.events.ask);
      if (state.askCount === 1) {
        state.yorEmotion = 'cover';
        state.yorLine = I18N[lang].demo.lines.ask1;
        pushEvent(I18N[lang].demo.events.askCover);
      } else if (state.askCount === 2) {
        state.yorLine = I18N[lang].demo.lines.ask2;
        state.suspicion = Math.min(100, state.suspicion + 4);
        pushEvent(I18N[lang].demo.events.askShaky);
      } else {
        state.yorEmotion = 'alert';
        state.yorLine = I18N[lang].demo.lines.ask3;
        state.suspicion = Math.min(100, state.suspicion + 6);
        pushEvent(I18N[lang].demo.events.askPush);
      }
      state.trust = Math.max(0, state.trust - 2);
      state.affinity = Math.max(0, state.affinity - 1);
    },

    tell: function () {
      state.playerKnows = true;
      state.secretsExposed = true;
      state.yorEmotion = 'alert';
      state.yorLine = I18N[lang].demo.lines.tell;
      state.suspicion = 100;
      state.trust = 0;
      state.affinity = 1;
      pushEvent(I18N[lang].demo.events.tellReveal);
      pushEvent(I18N[lang].demo.events.tellKnows);
    },

    observe: function () {
      state.suspicion = Math.min(100, state.suspicion + 2);
      if (!state.playerKnows) {
        state.yorEmotion = 'noticed';
        state.yorLine = I18N[lang].demo.lines.obsNotKnows;
        pushEvent(I18N[lang].demo.events.obsCallous);
      } else {
        state.yorLine = I18N[lang].demo.lines.obsKnows;
        pushEvent(I18N[lang].demo.events.obsBack);
      }
    },

    leave: function () {
      state.left = true;
      state.yorEmotion = 'quiet';
      state.yorLine = I18N[lang].demo.lines.leave;
      pushEvent(I18N[lang].demo.events.left);
      pushEvent(I18N[lang].demo.events.continues);
    },

    reset: function () { reset(); }
  };

  // ---------- wiring (direct click handlers — reliable across automation & a11y) ----------
  function act(name) {
    if (state.left && name !== 'reset') return;
    if (ACTIONS[name]) ACTIONS[name]();
    render();
  }

  document.querySelectorAll('[data-demo]').forEach(function (btn) {
    btn.addEventListener('click', function () { act(btn.dataset.demo); });
  });

  // re-render in the chosen language when the toggle flips
  window.addEventListener('hc:langchange', function (e) {
    lang = (e && e.detail && e.detail.lang) ? e.detail.lang : getLang();
    window.HC_LANG = lang;
    render();
  });

  reset();
})();
