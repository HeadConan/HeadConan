/* ============================================================
   HEADCONAN /site — page interactions
   ------------------------------------------------------------
   Sections: door (parallax + enter), gate (desires), portals,
   perspective (player/host), not-a-chatbot, world-specific UI.
   All local, deterministic, keyboard-accessible, motion-minimal.
   ============================================================ */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

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
    // clear inline parallax transforms so CSS can settle them; stop following cursor
    frags.forEach(function (f) { f.style.transform = ''; });
    if (door.removeEventListener) {
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

  var DESIRES = {
    ruler: {
      title: 'BECOME A RULER',
      line: 'An empire is fracturing. The interface you need is a war room.',
      chips: ['MAP', 'FACTIONS', 'MESSAGES', 'POWER', 'CONFLICT', 'DECREE']
    },
    murder: {
      title: 'SOLVE A MURDER',
      line: 'A locked room. A deadline. The interface you need is a case board.',
      chips: ['EVIDENCE', 'SUSPECTS', 'TIMELINE', 'CASE FILES', 'ALIBIS']
    },
    school: {
      title: 'GO BACK TO SCHOOL',
      line: 'You are already late. The interface you need is a semester.',
      chips: ['CLASSROOM', 'MESSAGES', 'SCHEDULE', 'PEOPLE', 'DEADLINES']
    },
    org: {
      title: 'JOIN A SECRET ORGANIZATION',
      line: 'Nothing you say to anyone is safe. The interface you need hides in plain sight.',
      chips: ['COVER IDENTITY', 'DROP POINTS', 'CODES', 'WATCH LIST', 'EXFIL']
    },
    love: {
      title: 'FALL IN LOVE',
      line: 'Small talk, stolen glances, one wrong word. The interface you need is a conversation.',
      chips: ['DIALOGUE', 'SUBTEXT', 'MEMORIES', 'GIFTS', 'PROMISES']
    },
    impossible: {
      title: 'LIVE SOMEWHERE IMPOSSIBLE',
      line: 'A city that should not exist. The interface you need is a map that lies.',
      chips: ['MAP', 'ANOMALIES', 'EXPEDITION LOG', 'CURFEW', 'RUMORS']
    }
  };

  var activeDesire = null;

  function showDesire(id) {
    activeDesire = id;
    var data = DESIRES[id];
    document.querySelectorAll('.desire').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.desire === id);
    });
    $('reveal-empty').hidden = true;
    $('reveal-body').hidden = false;
    $('reveal-title').textContent = data.title;
    $('reveal-line').textContent = data.line;
    var chips = $('reveal-chips');
    chips.innerHTML = '';
    data.chips.forEach(function (c) {
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

  var NC = {
    chat: [
      { k: 'YOU', text: 'You say something.' },
      { k: 'IT', text: 'It responds.' }
    ],
    headconan: [
      { k: 'YOU', text: 'You act.' },
      { k: 'WORLD', text: 'Something happens.' },
      { k: 'WORLD', text: 'Someone notices.' },
      { k: 'WORLD', text: 'The world changes.', conseq: true },
      { k: 'YOU', text: 'You continue from the new situation.' }
    ]
  };

  function renderNC(mode) {
    var box = $('nc-diagram');
    box.innerHTML = '';
    NC[mode].forEach(function (step, i) {
      if (i > 0) {
        var arrow = document.createElement('div');
        arrow.className = 'nc-arrow';
        arrow.textContent = '\u2193';
        arrow.setAttribute('aria-hidden', 'true');
        box.appendChild(arrow);
      }
      var d = document.createElement('div');
      d.className = 'nc-step' + (step.conseq ? ' step-conseq' : '');
      var k = document.createElement('span');
      k.className = 'nc-k';
      k.textContent = step.k;
      var tx = document.createElement('span');
      tx.textContent = step.text;
      d.appendChild(k);
      d.appendChild(tx);
      box.appendChild(d);
    });
  }

  document.querySelectorAll('.nc-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var mode = b.dataset.nc;
      document.querySelectorAll('.nc-toggle').forEach(function (x) {
        x.classList.toggle('is-active', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      renderNC(mode);
    });
  });

  /* ================= 07 / WORLD-SPECIFIC UI ================= */

  document.querySelectorAll('.wui-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var id = tab.dataset.tab;
      document.querySelectorAll('.wui-tab').forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      document.querySelectorAll('.wui-panel').forEach(function (p) {
        var show = p.id === 'wui-' + id;
        p.hidden = !show;
        p.classList.toggle('is-visible', show);
      });
    });
  });

  /* ---------- init ---------- */
  renderNC('chat');
})();
