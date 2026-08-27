/* ============================================================
   HEADCONAN /site — SPY × FAMILY interactive demo
   ------------------------------------------------------------
   Deterministic local state machine. No AI, no server, no API.
   Every action mutates visible state: emotions, suspicion,
   affinity, world events, and a secret document.
   ============================================================ */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var INITIAL = {
    yorEmotion: 'calm',
    yorLine: 'She is pouring tea. She looks up and smiles.',
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
    render();
  }

  // ---------- event feed ----------
  function pushEvent(text) {
    state.events.unshift({ turn: '07:' + String(30 + state.events.length * 3).padStart(2, '0'), text: text });
    if (state.events.length > 5) state.events.pop();
  }

  // ---------- render ----------
  function render() {
    var yorCard = $('yor-card');
    var yorState = $('yor-state');
    var yorLine = $('yor-line');
    var loidState = $('loid-state');
    var loidLine = $('loid-line');
    var trustFill = $('yor-trust');
    var suspicionFill = $('loid-suspicion');
    var stageTitle = $('stage-title');

    // Yor card
    yorState.textContent = state.yorEmotion;
    yorLine.textContent = state.yorLine;
    yorCard.classList.toggle('is-alert', state.yorEmotion === 'alert');
    yorCard.classList.toggle('is-noticed', state.yorEmotion === 'noticed');
    trustFill.style.width = state.trust + '%';

    // Player card
    loidState.textContent = state.playerKnows ? 'knows her secret' : 'covering';
    loidLine.textContent = state.playerKnows
      ? 'You know what she is. The room has changed temperature.'
      : 'You are a spy. She does not know. You do not know what she is.';
    suspicionFill.style.width = state.suspicion + '%';

    // Stage title
    stageTitle.textContent = state.left ? 'THE ROOM IS EMPTY NOW.' : 'YOR IS IN THE ROOM.';

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
      pushEvent('You asked Yor about last night.');
      if (state.askCount === 1) {
        state.yorEmotion = 'cover';
        state.yorLine = '"City Hall overtime, don\'t worry." She answers a little too fast.';
        pushEvent('Yor answered with her cover story.');
      } else if (state.askCount === 2) {
        state.yorLine = '"Overtime again. It\'s nothing." Her fingers tighten on the cup.';
        state.suspicion = Math.min(100, state.suspicion + 4);
        pushEvent('Her story is getting shakier.');
      } else {
        state.yorEmotion = 'alert';
        state.yorLine = 'She stops pouring. The silence is loud.';
        state.suspicion = Math.min(100, state.suspicion + 6);
        pushEvent('She noticed you are pushing.');
      }
      state.trust = Math.max(0, state.trust - 2);
      state.affinity = Math.max(0, state.affinity - 1);
    },

    tell: function () {
      state.playerKnows = true;
      state.secretsExposed = true;
      state.yorEmotion = 'alert';
      state.yorLine = 'She goes very still. The cup never reaches the table.';
      state.suspicion = 100;
      state.trust = 0;
      state.affinity = 1;
      pushEvent('WORLD EVENT — SECRET REVEALED');
      pushEvent('Yor knows you know. She is deciding what to do next.');
    },

    observe: function () {
      state.suspicion = Math.min(100, state.suspicion + 2);
      if (!state.playerKnows) {
        state.yorEmotion = 'noticed';
        state.yorLine = 'Her hands are calloused. She notices you noticing and looks away.';
        pushEvent('Observation: calloused hands, quick eye contact, then nothing.');
      } else {
        state.yorLine = 'She is watching you watch her. Neither of you blinks.';
        pushEvent('Observation: she is watching you back.');
      }
    },

    leave: function () {
      state.left = true;
      state.yorEmotion = 'quiet';
      state.yorLine = 'You step out. Behind you, the household keeps humming along — unchanged, or so it pretends.';
      pushEvent('You left the room.');
      pushEvent('The world continues without your input.');
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

  reset();
})();
