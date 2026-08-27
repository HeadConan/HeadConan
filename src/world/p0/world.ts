/**
 * HEADCONAN P0 — SPY × FAMILY 最小世界定义（垂直切片专用）
 *
 * 规则（NEXT_BUILD.md）：
 *   - 只构建让 10 分钟体验成立的最小集：3 角色 / 2 地点 / 1 关系 / 4 事实 / 1 场景种子。
 *   - 不建庞大 lore；不建完整规则引擎（P0 规则内联于 kernel，见 runtime/kernel.ts）。
 *   - 核心命题：Yor 是刺客（世界真相）≠ Loid 所知（市政厅文员）≠ 玩家投影（受限）。
 */

import { WorldDefinition } from '../representation/types/definition';
import { ScenarioSeed } from '../representation/types/scenarios';

export const P0_WORLD_ID = 'world:p0:spy_family';

export const P0_FACTS = {
  yor_is_assassin: 'fact:p0:yor_is_assassin',
  loid_is_spy: 'fact:p0:loid_is_spy',
  anya_is_telepath: 'fact:p0:anya_is_telepath',
  yor_cover_clerk: 'fact:p0:yor_cover_clerk',
} as const;

export const P0_ENTITIES = {
  loid: 'char:p0:loid_forger',
  yor: 'char:p0:yor_forger',
  anya: 'char:p0:anya_forger',
} as const;

export const P0_LOCATIONS = {
  forger_living_room: 'loc:p0:forger_living_room',
  berlint_streets: 'loc:p0:berlint_streets',
} as const;

/** 最小 SPY×FAMILY 世界定义（P0 垂直切片） */
export const P0_WORLD_DEFINITION: WorldDefinition = {
  id: P0_WORLD_ID,
  name: 'SPY × FAMILY — Forger 家早餐',
  tagline: '东国与西国之间的冷战谍影，藏在一场假装出来的婚姻里。',
  premise: 'Loid 以「洛德·福杰」身份与 Yor 组成了伪装家庭，双方都不知道对方的真实身份。只有养女 Anya 是读心者，知道一切。',
  version: {
    schemaVersion: '1.0.0',
    definitionVersion: '0.1.0',
    revision: 1,
    lastUpdated: '2026-08-27',
  },

  axioms: [
    {
      id: 'axiom:p0:cover_must_hold',
      statement: '伪装身份是世界的根基：任何人向外人暴露间谍/刺客身份都会立即引发两国危机。',
      type: 'social_contract',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'narrative_gravity',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
    },
    {
      id: 'axiom:p0:secrets_are_facts',
      statement: '秘密是事实的可见域属性，不是叙事修饰：不存在任何 UI/LLM 直读真相的旁路。',
      type: 'forensic_truth',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'institutional_verdict',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
    },
  ],

  capabilities: [],

  characters: [
    {
      id: P0_ENTITIES.loid,
      kind: 'character',
      name: 'Loid Forger',
      aliases: ['洛德·福杰', 'Twilight', '黄昏'],
      description: '西国情报机构 WISE 的头号间谍「黄昏」。以精神科医生身份为掩护，组建了伪装家庭以执行任务 STRIX。',
      tags: ['spy', 'wise', 'fake_husband'],
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 0,
      canonStatus: 'canonical',
      archetypeRole: 'Undercover Master Spy',
      organizationIds: [],
      primaryLocationId: P0_LOCATIONS.forger_living_room,
      personality: {
        temperament: 'analytical',
        moralAlignment: 'principled',
        primaryValues: ['任务成功', '世界和平', '家庭安全'],
        fatalFlaw: '过度计算，无法信任情感',
        socialMask: '温和的精神科医生兼丈夫',
      },
      goals: [
        {
          id: 'goal:p0:strix',
          description: '维持伪装家庭以接近目标，完成 STRIX 任务',
          priority: 'primary',
          progressPercent: 40,
          isSecret: true,
        },
      ],
      needs: [{ type: 'affection', urgency: 40, satisfactionStatus: 'strained' }],
      knownFactIds: [P0_FACTS.yor_cover_clerk, P0_FACTS.loid_is_spy],
      beliefs: [
        {
          id: 'belief:p0:loid_about_yor',
          statement: 'Yor 只是个普通的市政厅文员，毫无危险。',
          confidence: 0.9,
          correspondingFactId: P0_FACTS.yor_cover_clerk,
          isFactuallyAccurate: false,
          sourceType: 'testimony',
        },
      ],
      secretFactIds: [P0_FACTS.loid_is_spy],
      capabilities: [],
      socialPermissions: ['enter:forger_home', 'speak_to:family'],
      currentLocationId: P0_LOCATIONS.forger_living_room,
      currentActivity: '吃早餐',
      emotionalState: '警觉但克制',
      publicReputationScore: 80,
      physicalStatus: 'healthy',
    },
    {
      id: P0_ENTITIES.yor,
      kind: 'character',
      name: 'Yor Forger',
      aliases: ['约尔·福杰', 'Thorn Princess', '荆棘公主'],
      description: '职业杀手「荆棘公主」。以市政厅文员为掩护，与 Loid 组成了约定婚姻——她不知道 Loid 是间谍。',
      tags: ['assassin', 'cover', 'fake_wife'],
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 0,
      canonStatus: 'canonical',
      archetypeRole: 'Assassin Under Cover',
      organizationIds: [],
      primaryLocationId: P0_LOCATIONS.forger_living_room,
      personality: {
        temperament: 'impulsive',
        moralAlignment: 'pragmatic',
        primaryValues: ['保护家人', '完成委托'],
        fatalFlaw: '不擅长说谎，却在被迫不断说谎',
        socialMask: '笨拙而温柔的妻子',
      },
      goals: [
        {
          id: 'goal:p0:hide_identity',
          description: '绝不暴露自己的杀手身份，同时维持家庭',
          priority: 'survival',
          progressPercent: 70,
          isSecret: true,
        },
      ],
      needs: [{ type: 'social_belonging', urgency: 60, satisfactionStatus: 'strained' }],
      knownFactIds: [P0_FACTS.yor_is_assassin, P0_FACTS.yor_cover_clerk],
      beliefs: [
        {
          id: 'belief:p0:yor_about_loid',
          statement: 'Loid 是个温和的普通丈夫。',
          confidence: 0.85,
          correspondingFactId: P0_FACTS.yor_cover_clerk,
          isFactuallyAccurate: false,
          sourceType: 'testimony',
        },
      ],
      secretFactIds: [P0_FACTS.yor_is_assassin],
      capabilities: [],
      socialPermissions: ['enter:forger_home', 'speak_to:family'],
      currentLocationId: P0_LOCATIONS.forger_living_room,
      currentActivity: '倒茶',
      emotionalState: '平静',
      publicReputationScore: 75,
      physicalStatus: 'healthy',
    },
    {
      id: P0_ENTITIES.anya,
      kind: 'character',
      name: 'Anya Forger',
      aliases: ['阿尼亚·福杰'],
      description: '拥有读心能力的养女。知道 Loid 是间谍、Yor 是刺客，但被「保密」规则约束不能说破。',
      tags: ['telepath', 'child', 'knows_all'],
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 0,
      canonStatus: 'canonical',
      archetypeRole: 'Telepathic Daughter',
      organizationIds: [],
      primaryLocationId: P0_LOCATIONS.forger_living_room,
      personality: {
        temperament: 'volatile',
        moralAlignment: 'loyalist',
        primaryValues: ['爸爸妈妈', '世界和平（为了爸爸妈妈）'],
        fatalFlaw: '读心后藏不住表情',
        socialMask: '普通小学生',
      },
      goals: [
        {
          id: 'goal:p0:keep_family',
          description: '帮爸爸妈妈维持这个家，不让任何人拆散',
          priority: 'primary',
          progressPercent: 80,
          isSecret: true,
        },
      ],
      needs: [{ type: 'safety', urgency: 50, satisfactionStatus: 'adequate' }],
      knownFactIds: [
        P0_FACTS.yor_is_assassin,
        P0_FACTS.loid_is_spy,
        P0_FACTS.anya_is_telepath,
        P0_FACTS.yor_cover_clerk,
      ],
      beliefs: [],
      secretFactIds: [P0_FACTS.anya_is_telepath],
      capabilities: [],
      socialPermissions: ['enter:forger_home', 'speak_to:family'],
      currentLocationId: P0_LOCATIONS.forger_living_room,
      currentActivity: '看电视',
      emotionalState: '好奇',
      publicReputationScore: 60,
      physicalStatus: 'healthy',
    },
  ],

  organizations: [],

  locations: [
    {
      id: P0_LOCATIONS.forger_living_room,
      kind: 'location',
      name: 'Forger 家客厅',
      description: '早餐桌、沙发、电视。一家三口每天的起点。',
      tags: ['home', 'breakfast'],
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 0,
      type: 'residence',
      accessibility: 'public',
      residentEntityIds: [P0_ENTITIES.loid, P0_ENTITIES.yor, P0_ENTITIES.anya],
      atmosphere: '温馨但暗流涌动',
      spatialAffordances: ['listen_conversation', 'observe_body_language'],
    },
    {
      id: P0_LOCATIONS.berlint_streets,
      kind: 'location',
      name: '巴林特街',
      description: '上班与上学的必经之路，也是情报接头的场所。',
      tags: ['street', 'commute'],
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 0,
      type: 'public_square',
      accessibility: 'public',
      atmosphere: '日常',
      spatialAffordances: ['follow_target', 'pass_message'],
    },
  ],

  objects: [],

  resources: [],

  relationships: [
    {
      id: 'rel:p0:loid_yor_marriage',
      sourceEntityId: P0_ENTITIES.loid,
      targetEntityId: P0_ENTITIES.yor,
      kind: 'kinship',
      isBidirectional: true,
      affinity: 30,
      trust: 10,
      powerBalance: 0,
      visibility: 'fictitious_cover',
      coverStory: '一对新婚的普通夫妻',
      narrativeDescription: '基于任务与各自隐瞒目的的约定婚姻。',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
    },
  ],

  socialNorms: [],
  lawsAndStatutes: [],
  powerRelations: [],

  groundTruthFacts: [
    {
      id: P0_FACTS.yor_is_assassin,
      statement: 'Yor Forger 是代号「荆棘公主」的职业杀手。',
      subjectEntityId: P0_ENTITIES.yor,
      domain: 'identity',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      falsifiability: true,
    },
    {
      id: P0_FACTS.loid_is_spy,
      statement: 'Loid Forger 是西国情报机构 WISE 的间谍「黄昏」。',
      subjectEntityId: P0_ENTITIES.loid,
      domain: 'identity',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      falsifiability: true,
    },
    {
      id: P0_FACTS.anya_is_telepath,
      statement: 'Anya 拥有读心能力。',
      subjectEntityId: P0_ENTITIES.anya,
      domain: 'identity',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      falsifiability: true,
    },
    {
      id: P0_FACTS.yor_cover_clerk,
      statement: 'Yor Forger 在巴林特市政厅担任文员。',
      subjectEntityId: P0_ENTITIES.yor,
      domain: 'allegiance',
      visibilityScope: 'universal_public',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
    },
  ],

  actions: [],

  possibilitySpace: {
    coreFantasyHook: '在一场互相隐瞒的伪装婚姻里，试探、掩护、守护这个家。',
    primaryInteractionLoop: '与家人对话 → 观察异常 → 决定是否追查 → 承担暴露风险。',
    tabooOrForbiddenActions: ['在不掌握证据时公开指控家人是刺客/间谍'],
    availableRoles: [
      {
        id: 'role:p0:loid',
        title: 'Loid Forger（玩家）',
        name: 'Loid Forger',
        inhabitationMode: 'canonical_character',
        associatedEntityId: P0_ENTITIES.loid,
        socialPosition: '丈夫 / 精神科医生（伪装）',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['social', 'covert'],
        suggestedPromptDirectives: ['向 Yor 问好', '试探 Yor 昨晚的去向', '询问 Anya 今天想做什么'],
        systemConstraints: ['不能暴露自己是间谍', '不能让 Yor 察觉自己在调查她'],
        description: '以 Loid 的第一视角体验这个家庭。',
      },
      {
        id: 'role:p0:host',
        title: 'Host（主持人 / 全知）',
        name: 'World Host',
        inhabitationMode: 'directorial_host',
        socialPosition: '世界观察者',
        agencyLevel: 'narrative_director',
        epistemicFogOfWar: 'omniscient_narrator',
        availableActionCategories: ['directorial'],
        suggestedPromptDirectives: ['揭示一条秘密给玩家', '注入一个突发事件'],
        systemConstraints: ['干预必须经事件内核，不得绕过'],
        description: '全知视角：可查看任何秘密，可向角色注入事实。',
      },
    ],
  },

  experienceProfile: {
    primaryFantasy: 'Relationship',
    secondaryFantasy: 'Mystery & Knowledge',
    dominantTone: 'tense_farce',
    tensionGradient: 'peaks_and_valleys',
    socialDensity: 3,
    informationAsymmetry: 5,
    consequenceLethality: 4,
    investigativeDepth: 3,
    recommendedModalities: ['dialogue_focused', 'relationship_web_graph'],
  },
};

/** P0 场景种子：早餐时刻 */
export const P0_SCENARIO_BREAKFAST: ScenarioSeed = {
  id: 'scenario:p0:breakfast',
  worldDefinitionId: P0_WORLD_ID,
  title: '早餐时刻',
  initialSituation:
    '清晨的 Forger 家客厅。Yor 在倒茶，Anya 盯着电视里的间谍动画，Loid 刚在餐桌前坐下。一切都普通得可疑。',
  recommendedRoles: [P0_WORLD_DEFINITION.possibilitySpace.availableRoles[0]],
};
