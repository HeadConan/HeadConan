/* ============================================================
   HEADCONAN /site — bilingual dictionary (en / zh)
   ------------------------------------------------------------
   Single source of truth for every visible string on the site.
   Static text is applied by applyI18n() (see main.js) via
   [data-i18n] (textContent) and [data-i18n-html] (innerHTML).
   Dynamic text (desires, not-a-chatbot diagram, demo state
   machine) is read directly from I18N[lang] inside main.js /
   demo.js. Keep both trees in sync.
   ============================================================ */

window.I18N = {
  en: {
    meta: {
      title: 'HEADCONAN — Some worlds never leave your head',
      desc: 'HeadConan is a portal into the worlds already living in your head. This website is an interactive demonstration.'
    },
    door: {
      skip: 'Skip to content',
      stamp: 'A PORTAL INTO IMAGINED WORLDS',
      tagline: 'Some worlds never leave your head.',
      enter: 'ENTER',
      hint: '— move your cursor. the fragments follow —'
    },
    gate: {
      kicker: '01 / THE GATE',
      title: 'WHERE WOULD YOU GO?',
      sub: 'Desires, not features. Pick one and watch what it demands from an interface.',
      desires: {
        ruler: 'BECOME A RULER',
        murder: 'SOLVE A MURDER',
        school: 'GO BACK TO SCHOOL',
        org: 'JOIN A SECRET ORGANIZATION',
        love: 'FALL IN LOVE',
        impossible: 'LIVE SOMEWHERE IMPOSSIBLE'
      },
      desireDetail: {
        ruler: { line: 'An empire is fracturing. The interface you need is a war room.', chips: ['MAP', 'FACTIONS', 'MESSAGES', 'POWER', 'CONFLICT', 'DECREE'] },
        murder: { line: 'A locked room. A deadline. The interface you need is a case board.', chips: ['EVIDENCE', 'SUSPECTS', 'TIMELINE', 'CASE FILES', 'ALIBIS'] },
        school: { line: 'You are already late. The interface you need is a semester.', chips: ['CLASSROOM', 'MESSAGES', 'SCHEDULE', 'PEOPLE', 'DEADLINES'] },
        org: { line: 'Nothing you say to anyone is safe. The interface you need hides in plain sight.', chips: ['COVER IDENTITY', 'DROP POINTS', 'CODES', 'WATCH LIST', 'EXFIL'] },
        love: { line: 'Small talk, stolen glances, one wrong word. The interface you need is a conversation.', chips: ['DIALOGUE', 'SUBTEXT', 'MEMORIES', 'GIFTS', 'PROMISES'] },
        impossible: { line: 'A city that should not exist. The interface you need is a map that lies.', chips: ['MAP', 'ANOMALIES', 'EXPEDITION LOG', 'CURFEW', 'RUMORS'] }
      },
      revealEmpty: 'Choose a desire.<br>The interface it needs will appear here.',
      footnote: 'Different worlds demand different interfaces.<br>HeadConan renders them — it does not explain them.'
    },
    portals: {
      kicker: '02 / THE WORLDS',
      title: 'WORLDS',
      sub: 'Every portal is a situation, not a description. Choose one to enter.',
      situations: {
        spy: 'Anya is waiting for you.',
        imperium: 'Your empire is becoming unstable.',
        campus: 'You are already late for class.'
      },
      enter: 'ENTER'
    },
    demo: {
      kicker: '03 / THE DEMO',
      title: 'ENTER A WORLD',
      sub: 'SPY × FAMILY, 7:30 AM. This is a deterministic demo — no AI is running. Everything you see is state, and every action changes it.',
      clock: '07:30 — FORGER HOUSEHOLD',
      stageEmpty: 'THE ROOM IS EMPTY NOW.',
      stageRoom: 'YOR IS IN THE ROOM.',
      charNames: { yor: 'YOR', loid: 'YOU (LOID)' },
      emotion: { calm: 'calm', cover: 'cover', alert: 'alert', noticed: 'noticed', quiet: 'quiet' },
      loidState: { covering: 'covering', knows: 'knows her secret' },
      meter: { trust: 'TRUST', suspicion: 'SUSPICION' },
      rel: 'RELATIONSHIP',
      feedTitle: 'WORLD EVENT FEED',
      secret: {
        title: 'WORLD EVENT — SECRET REVEALED',
        body: 'YOR IS THORN PRINCESS.<br>YOU KNOW NOW.',
        fine: 'A surveillance file surfaces in the household records.'
      },
      actions: { ask: 'ASK YOR SOMETHING', tell: 'TELL HER A SECRET', observe: 'OBSERVE', leave: 'LEAVE', reset: 'RESET DEMO' },
      fine: 'Simulated locally, deterministically. No server, no API key, no real world engine. The actual HeadConan runtime is separate.',
      initial: {
        yorLine: 'She is pouring tea. She looks up and smiles.',
        loidLine: 'You are a spy. She does not know. You do not know what she is.',
        loidKnowsLine: 'You know what she is. The room has changed temperature.'
      },
      events: {
        ask: 'You asked Yor about last night.',
        askCover: 'Yor answered with her cover story.',
        askShaky: 'Her story is getting shakier.',
        askPush: 'She noticed you are pushing.',
        tellReveal: 'WORLD EVENT — SECRET REVEALED',
        tellKnows: 'Yor knows you know. She is deciding what to do next.',
        obsCallous: 'Observation: calloused hands, quick eye contact, then nothing.',
        obsBack: 'Observation: she is watching you back.',
        left: 'You left the room.',
        continues: 'The world continues without your input.'
      },
      lines: {
        ask1: '"City Hall overtime, don\'t worry." She answers a little too fast.',
        ask2: '"Overtime again. It\'s nothing." Her fingers tighten on the cup.',
        ask3: 'She stops pouring. The silence is loud.',
        tell: 'She goes very still. The cup never reaches the table.',
        obsNotKnows: 'Her hands are calloused. She notices you noticing and looks away.',
        obsKnows: 'She is watching you watch her. Neither of you blinks.',
        leave: 'You step out. Behind you, the household keeps humming along — unchanged, or so it pretends.'
      }
    },
    persp: {
      kicker: '04 / THE PERSPECTIVE',
      title: 'ONE WORLD. TWO VIEWS.',
      sub: 'The world has one truth. What you are allowed to see depends on who you are.',
      player: 'PLAYER',
      host: 'HOST',
      playerObs: 'Yor looks nervous.',
      hostObs: 'Yor knows that you discovered her secret.',
      knowCaption: 'Who knows which secret',
      colThorn: 'YOR IS THORN',
      colTwilight: 'LOID IS TWILIGHT',
      colTelepath: 'ANYA IS TELEPATH',
      rowLoid: 'Loid',
      rowYor: 'Yor',
      rowAnya: 'Anya',
      note: 'Same simulation. Different projection. Nothing else changes.',
      playerList: [
        '<li><span class="know-yes">✔</span> Yor works at City Hall</li>',
        '<li><span class="know-no">✘</span> Yor is Thorn Princess <em>(unknown to you)</em></li>',
        '<li><span class="know-no">✘</span> Anya can read minds <em>(unknown to you)</em></li>'
      ].join(''),
      hostList: [
        '<li><span class="know-yes">✔</span> Yor is Thorn Princess</li>',
        '<li><span class="know-yes">✔</span> Loid is a spy named Twilight</li>',
        '<li><span class="know-yes">✔</span> Anya is a telepath — and she knows everything</li>'
      ].join('')
    },
    nc: {
      kicker: '05 / THE DIFFERENCE',
      title: 'NOT A CHATBOT',
      sub: 'One responds to words. The other responds to actions — and remembers what happened.',
      chat: 'CHATBOT',
      headconan: 'HEADCONAN',
      roles: { you: 'YOU', it: 'IT', world: 'WORLD' },
      chatSteps: ['You say something.', 'It responds.'],
      headconanSteps: [
        'You act.',
        'Something happens.',
        'Someone notices.',
        'The world changes.',
        'You continue from the new situation.'
      ]
    },
    wui: {
      kicker: '06 / THE INTERFACES',
      title: 'WORLDS WEAR DIFFERENT CLOTHES',
      sub: 'A classroom, a crime scene and a throne room do not share a layout. Concept demo — these panels are mockups.',
      tabs: { school: 'SCHOOL', invest: 'INVESTIGATION', empire: 'EMPIRE' },
      schoolSched: '<h5>SCHEDULE</h5><ul><li>08:30 LECTURE — CHEM 201</li><li>10:00 LAB — BIOLOGY</li><li>14:00 SEMINAR</li><li>17:00 CLUB MEETING</li></ul>',
      schoolMsg: '<h5>MESSAGES</h5><ul><li>Prof. Kim: "Where is your lab report?"</li><li>Min: "You missed the study group!!"</li><li>You: "On my way."</li></ul>',
      schoolPeople: '<h5>PEOPLE</h5><ul><li>MIN — study partner <em>trust 71</em></li><li>PROF. KIM — advisor <em>trust 55</em></li><li>JAE — dorm rival <em>trust 22</em></li></ul>',
      investEvidence: '<h5>EVIDENCE</h5><ul><li>■ Bloodstained glove — corridor</li><li>■ Cyanide vial — cellar</li><li>■ Torn letter — fireplace</li></ul>',
      investSuspects: '<h5>SUSPECTS</h5><ul><li>BUTLER — motive: inheritance</li><li>COUSIN — alibi: thin</li><li>DRIVER — seen near cellar</li></ul>',
      investTimeline: '<h5>TIMELINE</h5><ul><li>21:00 dinner</li><li>21:40 poison</li><li>22:15 body found</li></ul>',
      empireTerr: '<h5>TERRITORY</h5><div class="map-cells"><span class="cell cell-1"></span><span class="cell cell-2"></span><span class="cell cell-3"></span><span class="cell cell-4"></span></div>',
      empireFactions: '<h5>FACTIONS</h5><ul><li>MILITARY — influence 78</li><li>OLIGARCHS — influence 64</li><li>OPPOSITION — influence 41</li></ul>',
      empireRes: '<h5>RESOURCES</h5><ul><li>TREASURY — 32%</li><li>GRAIN — 58%</li><li>LOYALTY — 61%</li></ul>'
    },
    principle: {
      title: 'You already have the worlds.',
      line: 'HeadConan lets you enter them.',
      world: 'WORLD',
      chars: 'CHARACTERS',
      mem: 'MEMORY',
      act: 'ACTION',
      conseq: 'CONSEQUENCE'
    },
    cta: {
      title: 'THE NEXT WORLD IS YOURS.',
      enter: 'ENTER HEADCONAN',
      view: 'VIEW ON GITHUB',
      fine: 'The runtime is an early research prototype. This site is its public face — an honest, simulated demo.'
    },
    foot: {
      line1: 'HEADCONAN — an experiment in inhabiting imagined worlds.',
      line2: 'This website runs entirely in your browser. Nothing is fake-misrepresented; the demo is deliberately deterministic.'
    },
    toggle: { toZh: '中文', toEn: 'EN' }
  },

  zh: {
    meta: {
      title: 'HEADCONAN — 有些世界永远不会离开你的脑海',
      desc: 'HeadConan 是一扇通往那些早已活在你脑海中的世界的入口。本网站是一个交互式演示。'
    },
    door: {
      skip: '跳到正文',
      stamp: '通往想象世界的入口',
      tagline: '有些世界永远不会离开你的脑海。',
      enter: '进入',
      hint: '— 移动光标，碎片随你而动 —'
    },
    gate: {
      kicker: '01 / 之门',
      title: '你想去哪里？',
      sub: '是欲望，不是功能。选一个，看看它需要怎样的界面。',
      desires: {
        ruler: '成为统治者',
        murder: '侦破一桩谋杀',
        school: '重返校园',
        org: '加入秘密组织',
        love: '坠入爱河',
        impossible: '栖身于不可能之地'
      },
      desireDetail: {
        ruler: { line: '一个帝国正在崩裂。你需要的界面是一间作战室。', chips: ['地图', '派系', '消息', '权力', '冲突', '敕令'] },
        murder: { line: '一间密室。一个期限。你需要的界面是一块案情板。', chips: ['证据', '嫌疑人', '时间线', '案卷', '不在场证明'] },
        school: { line: '你已经迟到了。你需要的界面是一个学期。', chips: ['教室', '消息', '日程', '人物', '截止日期'] },
        org: { line: '你对任何人说的话都不安全。你需要的界面藏在显眼处。', chips: ['伪装身份', '投放点', '暗号', '监视名单', '撤离'] },
        love: { line: '闲聊、偷瞄、一句错话。你需要的界面是一场对话。', chips: ['对话', '潜台词', '回忆', '礼物', '承诺'] },
        impossible: { line: '一座不该存在的城市。你需要的界面是一张会撒谎的地图。', chips: ['地图', '异常', '远征日志', '宵禁', '谣言'] }
      },
      revealEmpty: '选择一个欲望。<br>它所需的界面将在此显现。',
      footnote: '不同的世界需要不同的界面。<br>HeadConan 只是呈现它们——而非解释。'
    },
    portals: {
      kicker: '02 / 世界',
      title: '世界',
      sub: '每个传送门都是一种情境，而非一段描述。选一个进入。',
      situations: {
        spy: '阿尼亚在等你。',
        imperium: '你的帝国开始动荡。',
        campus: '你已经上课迟到了。'
      },
      enter: '进入'
    },
    demo: {
      kicker: '03 / 演示',
      title: '进入一个世界',
      sub: '《间谍过家家》，早上 7:30。这是一个确定性的演示——没有运行任何 AI。你看到的一切都是状态，每个动作都会改变它。',
      clock: '07:30 — 福杰家',
      stageEmpty: '房间现在空了。',
      stageRoom: '约尔在房间里。',
      charNames: { yor: '约尔', loid: '你（劳埃德）' },
      emotion: { calm: '平静', cover: '掩饰', alert: '警觉', noticed: '被察觉', quiet: '安静' },
      loidState: { covering: '掩饰', knows: '知道她的秘密' },
      meter: { trust: '信任', suspicion: '怀疑' },
      rel: '关系',
      feedTitle: '世界事件流',
      secret: {
        title: '世界事件——秘密揭晓',
        body: '约尔是荆棘公主。<br>你现在已经知道。',
        fine: '一份监视档案出现在了家庭记录中。'
      },
      actions: { ask: '问约尔点什么', tell: '告诉她一个秘密', observe: '观察', leave: '离开', reset: '重置演示' },
      fine: '本地确定性模拟。无服务器、无 API 密钥、无真实世界引擎。真正的 HeadConan 运行时是独立的。',
      initial: {
        yorLine: '她正在倒茶。她抬起头，微笑。',
        loidLine: '你是个间谍。她不知道。你也不知道她是谁。',
        loidKnowsLine: '你已知道她是谁。房间的温度变了。'
      },
      events: {
        ask: '你向约尔问起昨晚的事。',
        askCover: '约尔用她的伪装故事作答。',
        askShaky: '她的说辞越来越站不住脚。',
        askPush: '她注意到你在步步紧逼。',
        tellReveal: '世界事件——秘密揭晓',
        tellKnows: '约尔知道你已知晓。她正在决定下一步。',
        obsCallous: '观察：布满老茧的手、短暂的眼神交汇，然后归于虚无。',
        obsBack: '观察：她也在回看你。',
        left: '你离开了房间。',
        continues: '世界在没有你输入的情况下继续。'
      },
      lines: {
        ask1: '“市政厅加班，别担心。”她回答得有点太快了。',
        ask2: '“又加班了。没什么的。”她的手指攥紧了杯子。',
        ask3: '她停下倒茶。沉默震耳欲聋。',
        tell: '她僵住了。杯子始终没有落到桌上。',
        obsNotKnows: '她的手布满老茧。她察觉你在注意，便移开目光。',
        obsKnows: '她在看你看她。你们谁都没有眨眼。',
        leave: '你走出门。身后，这个家继续运转——一成不变，或假装如此。'
      }
    },
    persp: {
      kicker: '04 / 视角',
      title: '同一个世界。两种视角。',
      sub: '世界只有一种真相。你被允许看到的，取决于你是谁。',
      player: '玩家',
      host: '主持人',
      playerObs: '约尔看起来很紧张。',
      hostObs: '约尔知道你发现了她的秘密。',
      knowCaption: '谁知道哪个秘密',
      colThorn: '约尔是荆棘',
      colTwilight: '劳埃德是黄昏',
      colTelepath: '阿尼亚是读心者',
      rowLoid: '劳埃德',
      rowYor: '约尔',
      rowAnya: '阿尼亚',
      note: '同样的模拟。不同的投射。其余一切不变。',
      playerList: [
        '<li><span class="know-yes">✔</span> 约尔在市政厅工作</li>',
        '<li><span class="know-no">✘</span> 约尔是荆棘公主 <em>（你还不知道）</em></li>',
        '<li><span class="know-no">✘</span> 阿尼亚能读心 <em>（你还不知道）</em></li>'
      ].join(''),
      hostList: [
        '<li><span class="know-yes">✔</span> 约尔是荆棘公主</li>',
        '<li><span class="know-yes">✔</span> 劳埃德是个代号黄昏的间谍</li>',
        '<li><span class="know-yes">✔</span> 阿尼亚是读心者——她什么都知道</li>'
      ].join('')
    },
    nc: {
      kicker: '05 / 区别',
      title: '不是聊天机器人',
      sub: '一个回应言语。另一个回应行动——并记得发生过什么。',
      chat: '聊天机器人',
      headconan: 'HEADCONAN',
      roles: { you: '你', it: '它', world: '世界' },
      chatSteps: ['你说点什么。', '它回应。'],
      headconanSteps: [
        '你行动。',
        '发生了什么事。',
        '有人注意到了。',
        '世界改变了。',
        '你从新的情境继续。'
      ]
    },
    wui: {
      kicker: '06 / 界面',
      title: '世界穿着不同的外衣',
      sub: '教室、犯罪现场与御座厅不共用一种布局。概念演示——这些面板只是模型。',
      tabs: { school: '校园', invest: '调查', empire: '帝国' },
      schoolSched: '<h5>日程</h5><ul><li>08:30 讲座 — 化学 201</li><li>10:00 实验 — 生物</li><li>14:00 研讨课</li><li>17:00 社团会议</li></ul>',
      schoolMsg: '<h5>消息</h5><ul><li>金教授：“你的实验报告呢？”</li><li>敏：“你错过了学习小组！！”</li><li>你：“马上到。”</li></ul>',
      schoolPeople: '<h5>人物</h5><ul><li>敏 — 学习伙伴 <em>信任 71</em></li><li>金教授 — 导师 <em>信任 55</em></li><li>在赫 — 宿舍对手 <em>信任 22</em></li></ul>',
      investEvidence: '<h5>证据</h5><ul><li>■ 带血手套 — 走廊</li><li>■ 氰化物小瓶 — 地窖</li><li>■ 撕碎的信 — 壁炉</li></ul>',
      investSuspects: '<h5>嫌疑人</h5><ul><li>管家 — 动机：遗产</li><li>表亲 — 不在场证明：薄弱</li><li>司机 — 曾在地窖附近出现</li></ul>',
      investTimeline: '<h5>时间线</h5><ul><li>21:00 晚餐</li><li>21:40 下毒</li><li>22:15 发现尸体</li></ul>',
      empireTerr: '<h5>疆域</h5><div class="map-cells"><span class="cell cell-1"></span><span class="cell cell-2"></span><span class="cell cell-3"></span><span class="cell cell-4"></span></div>',
      empireFactions: '<h5>派系</h5><ul><li>军方 — 影响力 78</li><li>寡头 — 影响力 64</li><li>反对派 — 影响力 41</li></ul>',
      empireRes: '<h5>资源</h5><ul><li>国库 — 32%</li><li>粮食 — 58%</li><li>忠诚 — 61%</li></ul>'
    },
    principle: {
      title: '你早已拥有那些世界。',
      line: 'HeadConan 让你进入它们。',
      world: '世界',
      chars: '角色',
      mem: '记忆',
      act: '行动',
      conseq: '后果'
    },
    cta: {
      title: '下一个世界属于你。',
      enter: '进入 HEADCONAN',
      view: '在 GITHUB 查看',
      fine: '该运行时还只是早期研究原型。本网站是它的门面——一个诚实的、模拟的演示。'
    },
    foot: {
      line1: 'HEADCONAN——一场栖居于想象世界的实验。',
      line2: '本网站完全在你的浏览器中运行。没有任何虚假误导；这个演示是有意确定性的。'
    },
    toggle: { toZh: '中文', toEn: 'EN' }
  }
};
