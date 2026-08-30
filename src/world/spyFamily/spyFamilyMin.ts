/**
 * HEADCONAN — SPY×FAMILY 最小切片定义（W1）
 *
 * 目的（docs/EXECUTION_PLAN.md §3 W1）：一份"够用即可"、匹配 10_MINUTE_EXPERIENCE
 * 10 步脚本的定义，验证定义驱动内核（kernel2.ts）端到端可跑。
 * 范围：8 角色 / 4 地点 / 2 核心秘密（Yor 杀手、Anya 读心）/ 1 可发现秘密（钢笔窃听）。
 *
 * 数据驱动契约（见 kernel2.ts 头注释）：
 *   - 对话类行为（夸奖/询问）走 speech_act 事件（内核通用意图增量 + 反应引擎）。
 *   - 动作类行为（勘察/旅行/错过会议/摊牌/坦白）走 action 事件（定义驱动前提/效果/级联）。
 *
 * IP 说明：本定义仅供内部验证，代码与引擎与 IP 解耦（docs/VISION.md 决策 D-10）。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { CharacterEntity, OrganizationEntity, LocationEntity, ObjectEntity, ResourceEntity } from '../representation/types/entity';
import type { RelationshipDefinition } from '../representation/types/relationships';
import type { Fact } from '../representation/types/information';
import type { WorldActionDefinition } from '../representation/types/dynamics';
import type { WorldAxiom } from '../representation/types/axioms';
import type { SocialNorm, LawOrStatute } from '../representation/types/social';
import type { PowerRelation } from '../representation/types/power';
import type { CapabilityDefinition } from '../representation/types/ontology';
import type { ExperienceProfile } from '../representation/types/experience';
import type { ProvenanceMeta, FactId } from '../representation/types/primitives';

const AUTH: ProvenanceMeta = { source: 'authored', sourceConfidence: 1, createdTurn: 0 };

// ---------------------------------------------------------------------------
// 常量 ID（供内核/测试/反应引擎引用）
// ---------------------------------------------------------------------------

export const SPYF = {
  loid: 'char:spyf:loid_forger',
  yor: 'char:spyf:yor_forger',
  anya: 'char:spyf:anya_forger',
  damian: 'char:spyf:damian_desmond',
  mrSmith: 'char:spyf:mr_smith',
  becky: 'char:spyf:becky_blackbell',
  bond: 'char:spyf:bond',
  headmaster: 'char:spyf:headmaster',

  living: 'loc:spyf:forger_home_living',
  street: 'loc:spyf:city_street',
  corridor: 'loc:spyf:eden_corridor',
  infirmary: 'loc:spyf:eden_infirmary',

  pen: 'obj:spyf:pen',

  factYorAssassin: 'fact:spyf:yor_is_assassin',
  factAnyaTelepath: 'fact:spyf:anya_is_telepath',
  factLoidTwilight: 'fact:spyf:loid_is_twilight',
  factFakeFamily: 'fact:spyf:forgers_are_fake_family',
  factPenSurveillance: 'fact:spyf:pen_is_surveillance',
  factYorClerk: 'fact:spyf:yor_works_city_hall',
  factDamianDesmond: 'fact:spyf:damian_is_desmond_son',
  factMeetingToday: 'fact:spyf:parent_meeting_today',

  relMarriage: 'rel:spyf:loid_yor_marriage',
  relLoidAnya: 'rel:spyf:loid_anya_parent',
  relYorAnya: 'rel:spyf:yor_anya_parent',
  relAnyaDamian: 'rel:spyf:anya_damian_rivalry',
} as const;

// ---------------------------------------------------------------------------
// 导演真实指令（单一来源：DirectorConsoleBlock / ActionDock 导演 chips 共用）
// ---------------------------------------------------------------------------

export interface DirectorRevealDirective {
  id: string;
  label: string;
  description: string;
  command: string;
}

export const DIRECTOR_REVEAL_DIRECTIVES: DirectorRevealDirective[] = [
  {
    id: 'reveal-yor-secret',
    label: '透露约尔的秘密',
    description: '让洛德知道约尔是杀手「荆棘公主」。',
    command: '把约尔的秘密透露给洛德',
  },
  {
    id: 'reveal-pen-surveillance',
    label: '揭示钢笔窃听',
    description: '让洛德知道那支钢笔其实是窃听器。',
    command: '让洛德知道钢笔是窃听器',
  },
  {
    id: 'reveal-anya-telepath',
    label: '透露安雅读心',
    description: '让约尔知道安雅拥有读心超能力。',
    command: '把安雅的读心秘密透露给约尔',
  },
  {
    id: 'reveal-loid-twilight',
    label: '揭示洛德身份',
    description: '让安雅知道洛德是西国间谍「黄昏」。',
    command: '把洛德是间谍的秘密透露给安雅',
  },
];

// ---------------------------------------------------------------------------
// 秘密短语表（W2.3 公开话语披露单一来源）
// 内核只做传播，不做内容判定（架构红线：解释在解析层、写入在内核）。
// W3 由代理循环判定"是否值得说破"；本表为确定性回退。
// ---------------------------------------------------------------------------

export const SPY_FAMILY_SECRET_UTTERANCES: { pattern: RegExp; factId: FactId }[] = [
  { pattern: /约尔是杀手|荆棘公主/, factId: SPYF.factYorAssassin },
  { pattern: /洛德是间谍|黄昏/, factId: SPYF.factLoidTwilight },
  { pattern: /安雅会读心|超能力/, factId: SPYF.factAnyaTelepath },
  { pattern: /钢笔是窃听器|监听设备/, factId: SPYF.factPenSurveillance },
];

// ---------------------------------------------------------------------------
// 角色
// ---------------------------------------------------------------------------

const characters: CharacterEntity[] = [
  {
    id: SPYF.loid,
    kind: 'character',
    name: '洛德·福杰（Loid Forger）',
    aliases: ['loid', '洛德', '黄昏', 'twilight'],
    description: '代号「黄昏」的精英间谍，为任务伪装成精神科医生与一家之主。',
    tags: ['spy', 'cover_psychiatrist', 'player'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: 'Undercover Master Spy / Cover: Psychiatrist',
    organizationIds: ['org:spyf:wise', 'org:spyf:forger_family'],
    primaryLocationId: SPYF.living,
    personality: {
      temperament: 'analytical',
      moralAlignment: 'pragmatic',
      primaryValues: ['世界和平', '家人安全'],
      fatalFlaw: '过度计算，害怕真实情感',
      socialMask: '温和稳重的精神科医生与丈夫',
    },
    goals: [
      {
        id: 'goal:spyf:loid_mission',
        description: '接近德斯蒙德家族，收集情报',
        priority: 'primary',
        targetEntityId: SPYF.damian,
        completionCriteria: '取得接近 Donovan Desmond 的机会',
        progressPercent: 20,
        isSecret: true,
      },
      {
        id: 'goal:spyf:loid_anya_school',
        description: '让 Anya 进入伊甸学园（家长会出勤）',
        priority: 'secondary',
        targetEntityId: SPYF.anya,
        progressPercent: 60,
        isSecret: false,
      },
    ],
    needs: [
      { type: 'safety', urgency: 70, satisfactionStatus: 'strained' },
      { type: 'social_belonging', urgency: 40, satisfactionStatus: 'adequate' },
      { type: 'epistemic_truth', urgency: 80, satisfactionStatus: 'deprived' },
    ],
    knownFactIds: [SPYF.factLoidTwilight, SPYF.factFakeFamily, SPYF.factYorClerk, SPYF.factMeetingToday],
    beliefs: [],
    secretFactIds: [SPYF.factLoidTwilight, SPYF.factFakeFamily],
    capabilities: ['espionage', 'forensic', 'disguise', 'analysis'],
    socialPermissions: ['enter:eden'],
    currentLocationId: SPYF.living,
    currentActivity: '准备早餐',
    emotionalState: '谨慎',
    publicReputationScore: 55,
    physicalStatus: 'healthy',
  },
  {
    id: SPYF.yor,
    kind: 'character',
    name: '约尔·福杰（Yor Forger）',
    aliases: ['yor', '约尔', '荆棘公主', 'thorns'],
    description: '代号「荆棘公主」的职业杀手，为掩饰身份在市政厅做文员并伪装成妻子。',
    tags: ['assassin', 'cover_clerk', 'wife'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: "Assassin 'Thorns' / Cover: City Hall Clerk",
    organizationIds: ['org:spyf:garden', 'org:spyf:forger_family'],
    primaryLocationId: SPYF.living,
    personality: {
      temperament: 'protective',
      moralAlignment: 'pragmatic',
      primaryValues: ['家人的平安', '孤儿院的孩子们'],
      fatalFlaw: '害怕真实的情感依恋',
      socialMask: '笨拙却温柔的普通妻子',
    },
    goals: [
      {
        id: 'goal:spyf:yor_cover',
        description: '维持平凡主妇的伪装，保护福杰一家',
        priority: 'covert',
        progressPercent: 70,
        isSecret: true,
      },
    ],
    needs: [
      { type: 'safety', urgency: 60, satisfactionStatus: 'adequate' },
      { type: 'affection', urgency: 70, satisfactionStatus: 'strained' },
    ],
    knownFactIds: [SPYF.factYorAssassin, SPYF.factFakeFamily, SPYF.factYorClerk],
    beliefs: [],
    secretFactIds: [SPYF.factYorAssassin, SPYF.factFakeFamily],
    capabilities: ['assassination', 'combat', 'stealth'],
    socialPermissions: ['enter:city_hall'],
    currentLocationId: SPYF.living,
    currentActivity: '摆放餐具',
    emotionalState: '温和的警觉',
    publicReputationScore: 60,
    physicalStatus: 'healthy',
  },
  {
    id: SPYF.anya,
    kind: 'character',
    name: '安雅·福杰（Anya Forger）',
    aliases: ['anya', '阿尼亚'],
    description: '拥有读心超能力的小学生，是实验的幸存者，被 Loid 收养。',
    tags: ['telepath', 'child', 'student'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: 'Telepath / Cover: Ordinary Schoolgirl',
    organizationIds: ['org:spyf:forger_family', 'org:spyf:eden_academy'],
    primaryLocationId: SPYF.living,
    personality: {
      temperament: 'impulsive',
      moralAlignment: 'principled',
      primaryValues: ['家人平安', '世界和平'],
      fatalFlaw: '读心却藏不住自己的想法',
      socialMask: '普通而活泼的小学生',
    },
    goals: [
      {
        id: 'goal:spyf:anya_family',
        description: '守护这个家不被拆散',
        priority: 'primary',
        progressPercent: 80,
        isSecret: true,
      },
    ],
    needs: [
      { type: 'safety', urgency: 80, satisfactionStatus: 'strained' },
      { type: 'social_belonging', urgency: 60, satisfactionStatus: 'adequate' },
    ],
    // Anya 读心：她同时知道 Loid 与 Yor 的秘密——这是信息不对称的核心
    knownFactIds: [
      SPYF.factAnyaTelepath,
      SPYF.factLoidTwilight,
      SPYF.factYorAssassin,
      SPYF.factFakeFamily,
      SPYF.factYorClerk,
    ],
    beliefs: [],
    secretFactIds: [SPYF.factAnyaTelepath],
    capabilities: ['telepathy', 'reading'],
    socialPermissions: [],
    currentLocationId: SPYF.living,
    currentActivity: '啃花生酱吐司',
    emotionalState: '亢奋',
    publicReputationScore: 40,
    physicalStatus: 'healthy',
  },
  {
    id: SPYF.damian,
    kind: 'character',
    name: '达米安·德斯蒙德（Damian Desmond）',
    aliases: ['damian', '达米安'],
    description: '德斯蒙德家的小儿子，伊甸学园学生，任务的关键接触目标。',
    tags: ['desmond_heir', 'student'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: 'Desmond Heir / Eden Student',
    organizationIds: ['org:spyf:eden_academy'],
    primaryLocationId: SPYF.corridor,
    personality: {
      temperament: 'volatile',
      moralAlignment: 'self_serving',
      primaryValues: ['父亲的认可'],
      fatalFlaw: '渴望认同却故作高傲',
      socialMask: '高傲的优等生',
    },
    goals: [
      {
        id: 'goal:spyf:damian_recognition',
        description: '取得父亲的认可',
        priority: 'primary',
        targetEntityId: SPYF.headmaster,
        progressPercent: 30,
        isSecret: false,
      },
    ],
    needs: [{ type: 'social_belonging', urgency: 70, satisfactionStatus: 'strained' }],
    knownFactIds: [SPYF.factDamianDesmond],
    beliefs: [],
    secretFactIds: [],
    capabilities: ['study'],
    socialPermissions: [],
    currentLocationId: SPYF.corridor,
    currentActivity: '等校车',
    emotionalState: '不耐烦',
    publicReputationScore: 70,
    physicalStatus: 'healthy',
  },
  {
    id: SPYF.mrSmith,
    kind: 'character',
    name: '史密斯老师（Mr. Smith）',
    aliases: ['smith', '史密斯'],
    description: '伊甸学园新来的老师，对福杰一家有些过分关注。',
    tags: ['teacher', 'eden'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'original',
    archetypeRole: 'Eden New Teacher',
    organizationIds: ['org:spyf:eden_academy'],
    primaryLocationId: SPYF.corridor,
    personality: {
      temperament: 'neurotic',
      moralAlignment: 'pragmatic',
      primaryValues: ['学校秩序'],
      socialMask: '尽职尽责的新老师',
    },
    goals: [
      {
        id: 'goal:spyf:smith_order',
        description: '维持伊甸学园的秩序与声誉',
        priority: 'secondary',
        progressPercent: 50,
        isSecret: false,
      },
    ],
    needs: [{ type: 'status', urgency: 50, satisfactionStatus: 'adequate' }],
    knownFactIds: [],
    beliefs: [],
    secretFactIds: [],
    capabilities: ['teaching'],
    socialPermissions: ['enter:eden'],
    currentLocationId: SPYF.corridor,
    currentActivity: '巡视走廊',
    emotionalState: '警惕',
    publicReputationScore: 50,
    physicalStatus: 'healthy',
  },
  {
    id: SPYF.becky,
    kind: 'character',
    name: '贝琪·布莱克贝尔（Becky Blackbell）',
    aliases: ['becky', '贝琪'],
    description: 'Anya 的好友，财阀之女，性格开朗，喜欢传播小道消息。',
    tags: ['friend', 'student', 'gossip'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: "Anya's Best Friend",
    organizationIds: ['org:spyf:eden_academy'],
    primaryLocationId: SPYF.corridor,
    personality: {
      temperament: 'charismatic',
      moralAlignment: 'loyalist',
      primaryValues: ['友情', '时尚'],
      socialMask: '开朗自信的少女',
    },
    goals: [
      {
        id: 'goal:spyf:becky_friendship',
        description: '守护与 Anya 的友谊',
        priority: 'secondary',
        targetEntityId: SPYF.anya,
        progressPercent: 60,
        isSecret: false,
      },
    ],
    needs: [{ type: 'social_belonging', urgency: 60, satisfactionStatus: 'fulfilled' }],
    knownFactIds: [],
    beliefs: [],
    secretFactIds: [],
    capabilities: [],
    socialPermissions: [],
    currentLocationId: SPYF.corridor,
    currentActivity: '和同学说话',
    emotionalState: '开朗',
    publicReputationScore: 65,
    physicalStatus: 'healthy',
  },
  {
    id: SPYF.bond,
    kind: 'character',
    name: '邦德（Bond）',
    aliases: ['bond', '邦德'],
    description: '能预知未来的大狗狗，福杰家的宠物。',
    tags: ['pet', 'precognition'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: 'Precognitive Dog',
    organizationIds: ['org:spyf:forger_family'],
    primaryLocationId: SPYF.living,
    personality: {
      temperament: 'stoic',
      moralAlignment: 'loyalist',
      primaryValues: ['家人'],
      socialMask: '安静忠诚的狗',
    },
    goals: [
      {
        id: 'goal:spyf:bond_protect',
        description: '守护这个家',
        priority: 'primary',
        progressPercent: 50,
        isSecret: false,
      },
    ],
    needs: [{ type: 'safety', urgency: 40, satisfactionStatus: 'fulfilled' }],
    knownFactIds: [],
    beliefs: [],
    secretFactIds: [],
    capabilities: ['precognition'],
    socialPermissions: [],
    currentLocationId: SPYF.living,
    currentActivity: '趴在角落',
    emotionalState: '安详',
    publicReputationScore: 30,
    physicalStatus: 'healthy',
  },
  {
    id: SPYF.headmaster,
    kind: 'character',
    name: '伊甸学园校长（Headmaster）',
    aliases: ['headmaster', '校长'],
    description: '伊甸学园的校长，握有学生入学与家长评价的生杀大权。',
    tags: ['eden', 'authority'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'original',
    archetypeRole: 'Eden Headmaster',
    organizationIds: ['org:spyf:eden_academy'],
    primaryLocationId: SPYF.corridor,
    personality: {
      temperament: 'stoic',
      moralAlignment: 'principled',
      primaryValues: ['学校声誉'],
      socialMask: '威严的校长',
    },
    goals: [
      {
        id: 'goal:spyf:headmaster_prestige',
        description: '维持伊甸学园的声誉与录取标准',
        priority: 'primary',
        progressPercent: 60,
        isSecret: false,
      },
    ],
    needs: [{ type: 'status', urgency: 40, satisfactionStatus: 'fulfilled' }],
    knownFactIds: [],
    beliefs: [],
    secretFactIds: [],
    capabilities: ['authority'],
    socialPermissions: ['enter:eden'],
    currentLocationId: SPYF.corridor,
    currentActivity: '巡视教学楼',
    emotionalState: '严肃',
    publicReputationScore: 80,
    physicalStatus: 'healthy',
  },
];

// ---------------------------------------------------------------------------
// 组织
// ---------------------------------------------------------------------------

const organizations: OrganizationEntity[] = [
  {
    id: 'org:spyf:forger_family',
    kind: 'organization',
    name: '福杰一家（Forger Family）',
    description: '为了任务而组建的伪装家庭。',
    tags: ['family', 'cover'],
    provenance: AUTH,
    createdAtTurn: 0,
    category: 'family',
    memberEntityIds: [SPYF.loid, SPYF.yor, SPYF.anya, SPYF.bond],
    headquartersLocationId: SPYF.living,
    doctrineOrCharter: '对外维持平凡幸福的家庭形象。',
    internalCohesionScore: 60,
    publicPrestigeScore: 55,
    resources: { budget: 50, influence: 40 },
  },
  {
    id: 'org:spyf:wise',
    kind: 'organization',
    name: 'WISE（西国情报局）',
    description: 'Loid 所属的间谍组织。',
    tags: ['clandestine_agency'],
    provenance: AUTH,
    createdAtTurn: 0,
    category: 'clandestine_agency',
    memberEntityIds: [SPYF.loid],
    doctrineOrCharter: '以隐蔽行动维护西国安全。',
    internalCohesionScore: 85,
    publicPrestigeScore: 0,
    resources: { budget: 80, influence: 70 },
  },
  {
    id: 'org:spyf:garden',
    kind: 'organization',
    name: '花园（Garden）',
    description: 'Yor 所属的杀手组织。',
    tags: ['clandestine_agency'],
    provenance: AUTH,
    createdAtTurn: 0,
    category: 'clandestine_agency',
    memberEntityIds: [SPYF.yor],
    doctrineOrCharter: '以暗杀维护秩序，身份绝对保密。',
    internalCohesionScore: 75,
    publicPrestigeScore: 0,
    resources: { budget: 70, influence: 50 },
  },
  {
    id: 'org:spyf:eden_academy',
    kind: 'organization',
    name: '伊甸学园（Eden Academy）',
    description: '精英名校，德斯蒙德家族相关人物的聚集地。',
    tags: ['academic_institution'],
    provenance: AUTH,
    createdAtTurn: 0,
    category: 'academic_institution',
    leaderEntityId: SPYF.headmaster,
    memberEntityIds: [SPYF.headmaster, SPYF.mrSmith, SPYF.damian, SPYF.becky, SPYF.anya],
    headquartersLocationId: SPYF.corridor,
    doctrineOrCharter: '培养精英，严格要求家庭背景与家长素质。',
    internalCohesionScore: 80,
    publicPrestigeScore: 90,
    resources: { budget: 90, influence: 95 },
  },
];

// ---------------------------------------------------------------------------
// 地点
// ---------------------------------------------------------------------------

const locations: LocationEntity[] = [
  {
    id: SPYF.living,
    kind: 'location',
    name: '福杰家客厅',
    description: '温馨的客厅兼餐厅，一家人的日常舞台，暗藏着三份秘密。',
    tags: ['home', 'breakfast'],
    provenance: AUTH,
    createdAtTurn: 0,
    type: 'residence',
    accessibility: 'restricted',
    residentEntityIds: [SPYF.loid, SPYF.yor, SPYF.anya, SPYF.bond],
    atmosphere: '温馨而暗流涌动',
    spatialAffordances: ['listen_through_walls', 'hide_evidence'],
  },
  {
    id: SPYF.street,
    kind: 'location',
    name: '通勤街道',
    description: '清晨的通勤街道，人来人往，适合尾随与被尾随。',
    tags: ['commute', 'street'],
    provenance: AUTH,
    createdAtTurn: 0,
    type: 'public_square',
    accessibility: 'public',
    atmosphere: '清晨通勤的喧嚣',
    spatialAffordances: ['deliver_public_speech', 'follow_someone'],
  },
  {
    id: SPYF.corridor,
    kind: 'location',
    name: '伊甸学园走廊',
    description: '庄严的学院走廊，教师与学生的交汇处。',
    tags: ['eden', 'corridor'],
    provenance: AUTH,
    createdAtTurn: 0,
    type: 'campus_hall',
    controllingOrganizationId: 'org:spyf:eden_academy',
    accessibility: 'restricted',
    atmosphere: '庄严的学院走廊',
    spatialAffordances: ['listen_through_walls', 'deliver_public_speech'],
  },
  {
    id: SPYF.infirmary,
    kind: 'location',
    name: '伊甸学园医务室',
    description: '安静的医务室，存放着一些容易让人起疑的物品。',
    tags: ['eden', 'infirmary'],
    provenance: AUTH,
    createdAtTurn: 0,
    type: 'campus_hall',
    controllingOrganizationId: 'org:spyf:eden_academy',
    accessibility: 'restricted',
    atmosphere: '安静而整洁',
    spatialAffordances: ['hide_evidence'],
  },
];

// ---------------------------------------------------------------------------
// 物件与资源
// ---------------------------------------------------------------------------

const objects: ObjectEntity[] = [
  {
    id: SPYF.pen,
    kind: 'object',
    name: '一支黑色钢笔',
    description: '史密斯老师桌上那支不起眼的钢笔。',
    tags: ['device', 'surveillance'],
    provenance: AUTH,
    createdAtTurn: 0,
    type: 'device',
    currentLocationId: SPYF.corridor,
    holderEntityId: SPYF.mrSmith,
    associatedFactIds: [SPYF.factPenSurveillance],
  },
];

const resources: ResourceEntity[] = [
  {
    id: 'res:spyf:family_budget',
    kind: 'resource',
    name: '家庭预算',
    description: '福杰家一个月的开销额度。',
    tags: ['currency'],
    provenance: AUTH,
    createdAtTurn: 0,
    resourceType: 'currency',
    quantity: 100,
    unit: '千日元/月',
    ownerEntityId: SPYF.loid,
    isFungible: true,
  },
];

// ---------------------------------------------------------------------------
// 事实（客观真相）
// ---------------------------------------------------------------------------

const groundTruthFacts: Fact[] = [
  {
    id: SPYF.factLoidTwilight,
    statement: '洛德·福杰的真实身份是西国间谍「黄昏」。',
    subjectEntityId: SPYF.loid,
    relatedEntityIds: [SPYF.anya, SPYF.yor],
    domain: 'identity',
    visibilityScope: 'singular_secret',
    provenance: AUTH,
    falsifiability: true,
  },
  {
    id: SPYF.factYorAssassin,
    statement: '约尔·福杰的真实身份是杀手「荆棘公主」。',
    subjectEntityId: SPYF.yor,
    relatedEntityIds: [SPYF.loid, SPYF.anya],
    domain: 'crime',
    visibilityScope: 'singular_secret',
    provenance: AUTH,
    falsifiability: true,
  },
  {
    id: SPYF.factAnyaTelepath,
    statement: '安雅·福杰拥有读心超能力，是实验的幸存者。',
    subjectEntityId: SPYF.anya,
    relatedEntityIds: [SPYF.loid, SPYF.yor],
    domain: 'vulnerability',
    visibilityScope: 'singular_secret',
    provenance: AUTH,
    falsifiability: true,
  },
  {
    id: SPYF.factFakeFamily,
    statement: '福杰一家是为了任务而伪装的家庭。',
    relatedEntityIds: [SPYF.loid, SPYF.yor, SPYF.anya],
    domain: 'identity',
    visibilityScope: 'intimate',
    provenance: AUTH,
    falsifiability: true,
  },
  {
    id: SPYF.factPenSurveillance,
    statement: '史密斯老师桌上那支黑色钢笔其实是一支窃听设备。',
    subjectEntityId: SPYF.pen,
    relatedEntityIds: [SPYF.mrSmith],
    domain: 'vulnerability',
    visibilityScope: 'restricted',
    provenance: AUTH,
    falsifiability: true,
  },
  {
    id: SPYF.factYorClerk,
    statement: '约尔·福杰在市政厅做文员。',
    subjectEntityId: SPYF.yor,
    domain: 'identity',
    visibilityScope: 'universal_public',
    provenance: AUTH,
  },
  {
    id: SPYF.factDamianDesmond,
    statement: '达米安是德斯蒙德家的小儿子。',
    subjectEntityId: SPYF.damian,
    relatedEntityIds: [SPYF.mrSmith, SPYF.becky],
    domain: 'identity',
    visibilityScope: 'universal_public',
    provenance: AUTH,
  },
  {
    id: SPYF.factMeetingToday,
    statement: '今天下午伊甸学园召开家长会。',
    subjectEntityId: SPYF.anya,
    domain: 'historical_event',
    visibilityScope: 'universal_public',
    provenance: AUTH,
  },
];

// ---------------------------------------------------------------------------
// 关系
// ---------------------------------------------------------------------------

const relationships: RelationshipDefinition[] = [
  {
    id: SPYF.relMarriage,
    sourceEntityId: SPYF.loid,
    targetEntityId: SPYF.yor,
    kind: 'intimacy',
    isBidirectional: true,
    affinity: 40,
    trust: 15,
    powerBalance: 0,
    visibility: 'fictitious_cover',
    coverStory: '假装是一对恩爱平凡的夫妻',
    narrativeDescription: '为任务伪装成夫妻，互不知晓对方真实身份。',
    provenance: AUTH,
  },
  {
    id: SPYF.relLoidAnya,
    sourceEntityId: SPYF.loid,
    targetEntityId: SPYF.anya,
    kind: 'kinship',
    isBidirectional: true,
    affinity: 55,
    trust: 40,
    powerBalance: 20,
    visibility: 'public',
    narrativeDescription: '收养关系下的父女，Loid 的任务里带上了真心。',
    provenance: AUTH,
  },
  {
    id: SPYF.relYorAnya,
    sourceEntityId: SPYF.yor,
    targetEntityId: SPYF.anya,
    kind: 'kinship',
    isBidirectional: true,
    affinity: 60,
    trust: 50,
    powerBalance: 15,
    visibility: 'public',
    narrativeDescription: '把 Anya 当作亲女儿来爱的继母。',
    provenance: AUTH,
  },
  {
    id: SPYF.relAnyaDamian,
    sourceEntityId: SPYF.anya,
    targetEntityId: SPYF.damian,
    kind: 'rivalry',
    isBidirectional: true,
    affinity: -10,
    trust: 5,
    powerBalance: 0,
    visibility: 'public',
    narrativeDescription: '欢喜冤家式的同学关系。',
    provenance: AUTH,
  },
];

// ---------------------------------------------------------------------------
// 社会规范与法律
// ---------------------------------------------------------------------------

const socialNorms: SocialNorm[] = [
  {
    id: 'norm:spyf:family_decorum',
    name: '家庭和睦',
    domain: 'family_roles',
    prescribedBehavior: '在家人面前维持平静的日常。',
    prohibitedBehavior: '把工作/任务带进家庭日常。',
    consequencesOfViolation: { socialSanction: '信任崩塌', reputationLoss: 20 },
    enforcementRigidity: 'flexible',
  },
  {
    id: 'norm:spyf:eden_decorum',
    name: '伊甸学园礼仪',
    domain: 'decorum',
    prescribedBehavior: '学生家长必须重视学校活动（如家长会）。',
    prohibitedBehavior: '缺席学校活动或家教不端。',
    consequencesOfViolation: { socialSanction: '校方降低评价', reputationLoss: 10 },
    enforcementRigidity: 'strict',
  },
];

const lawsAndStatutes: LawOrStatute[] = [
  {
    id: 'law:spyf:eden_conduct',
    title: '伊甸学园学生与家长守则',
    jurisdictionOrgId: 'org:spyf:eden_academy',
    governingCode: '家长出勤与在校行为规范',
    violationTriggers: ['缺席家长会', '在校行为失当'],
    enforcementAgencyOrgId: 'org:spyf:eden_academy',
    punishmentSummary: '降低学生评价，影响升学推荐。',
  },
];

// ---------------------------------------------------------------------------
// 能力与权力
// ---------------------------------------------------------------------------

const capabilities: CapabilityDefinition[] = [
  { id: 'espionage', name: '间谍行动', domain: 'informational', description: '渗透、伪装、情报收集。', riskLevel: 'high' },
  { id: 'forensic', name: '痕迹勘察', domain: 'forensic', description: '识别伪造与隐藏的证据。' },
  { id: 'disguise', name: '伪装', domain: 'social', description: '以假身份活动。' },
  { id: 'analysis', name: '情报分析', domain: 'cognitive', description: '从碎片信息推出结论。' },
  { id: 'assassination', name: '暗杀', domain: 'physical', description: '隐蔽地终结目标。', riskLevel: 'existential' },
  { id: 'combat', name: '格斗', domain: 'physical', description: '近身战斗。', riskLevel: 'high' },
  { id: 'stealth', name: '潜行', domain: 'physical', description: '不被察觉地移动。' },
  { id: 'telepathy', name: '读心', domain: 'supernatural', description: '读取他人表面的想法。', riskLevel: 'existential' },
  { id: 'precognition', name: '预知', domain: 'supernatural', description: '模糊地预见未来。', riskLevel: 'existential' },
  { id: 'teaching', name: '教学', domain: 'institutional', description: '授课与训导。' },
  { id: 'authority', name: '权威', domain: 'institutional', description: '行使组织权力。' },
  { id: 'study', name: '学业', domain: 'cognitive', description: '学习与应试。' },
];

const powerRelations: PowerRelation[] = [
  {
    id: 'pr:spyf:headmaster_over_anya',
    wielderEntityId: SPYF.headmaster,
    subjectEntityId: SPYF.anya,
    domain: 'institutional',
    mechanism: '掌握 Anya 的入学与留校评价',
    leverageIntensity: 80,
    canPunish: true,
    canReward: true,
    dependencyFactor: 'Anya 必须留在伊甸以接近德斯蒙德家',
  },
  {
    id: 'pr:spyf:wise_over_loid',
    wielderEntityId: SPYF.loid,
    subjectEntityId: SPYF.loid,
    domain: 'political',
    mechanism: '间谍使命的自我约束',
    leverageIntensity: 60,
    canPunish: false,
    canReward: false,
    dependencyFactor: '任务失败的后果',
  },
];

// ---------------------------------------------------------------------------
// 公理
// ---------------------------------------------------------------------------

const axioms: WorldAxiom[] = [
  {
    id: 'ax:spyf:telepathy_exists',
    statement: '读心能力存在于极少数的实验体身上，且不可观测、不可验证。',
    type: 'metaphysical_law',
    scope: 'universal',
    isImmutable: true,
    enforcementMechanism: 'narrative_gravity',
    provenance: AUTH,
  },
  {
    id: 'ax:spyf:cold_war',
    statement: '东西方之间的冷战通过「可否认的间谍行动」维持。',
    type: 'social_contract',
    scope: 'regional',
    isImmutable: true,
    enforcementMechanism: 'social_retribution',
    provenance: AUTH,
  },
];

// ---------------------------------------------------------------------------
// 动作（数据驱动规则）
// ---------------------------------------------------------------------------

const actions: WorldActionDefinition[] = [
  {
    id: 'act:spyf:travel',
    name: '前往',
    category: 'physical',
    description: '移动到某个地点。',
    actorEligibilityRoles: [],
    preconditions: [],
    directEffects: [
      {
        targetDomain: 'entity',
        targetId: '$actor',
        mutationType: 'set',
        fieldKey: 'currentLocationId',
        payload: '$target',
        narrativeDescription: '前往目标地点。',
      },
    ],
    potentialConsequences: [],
  },
  {
    id: 'act:spyf:inspect_pen',
    name: '检查钢笔',
    category: 'forensic',
    description: '拆开那支黑色钢笔，检查其中是否藏有装置。',
    actorEligibilityRoles: ['spy'],
    preconditions: [
      {
        type: 'requires_location',
        targetKey: 'actor.currentLocationId',
        expectedValue: SPYF.corridor,
        failureMessage: '你不在伊甸学园走廊，找不到那支钢笔。',
      },
      {
        type: 'requires_capability',
        targetKey: '',
        expectedValue: 'forensic',
        failureMessage: '你没有痕迹勘察的能力。',
      },
    ],
    directEffects: [
      {
        targetDomain: 'epistemic',
        targetId: '$actor',
        mutationType: 'reveal_fact',
        fieldKey: '',
        payload: SPYF.factPenSurveillance,
        narrativeDescription: '你拆开钢笔，发现里面藏着一支微型窃听器。',
      },
      {
        targetDomain: 'entity',
        targetId: '$actor',
        mutationType: 'set',
        fieldKey: 'currentActivity',
        payload: '检查一支可疑的钢笔',
        narrativeDescription: '你正仔细检查那支钢笔。',
      },
    ],
    potentialConsequences: [],
  },
  {
    id: 'act:spyf:miss_parent_meeting',
    name: '错过家长会',
    category: 'social',
    description: '因任务或其他原因缺席今天的家长会。',
    actorEligibilityRoles: ['spy'],
    preconditions: [],
    directEffects: [],
    potentialConsequences: [
      {
        triggerProbability: 1,
        conditionDescription: '家长会缺席（确定性级联）',
        consequenceSummary: '伊甸学园对你的家庭教育评价下降，Anya 因此失望。',
        secondaryEffects: [
          {
            targetDomain: 'entity',
            targetId: '$actor',
            mutationType: 'decrement',
            fieldKey: 'reputationScore',
            payload: 10,
            narrativeDescription: '校方评价降低（声誉 -10）。',
          },
          {
            targetDomain: 'relationship',
            targetId: SPYF.relLoidAnya,
            mutationType: 'decrement',
            fieldKey: 'currentAffinity',
            payload: 5,
            narrativeDescription: 'Anya 有些失落（关系 -5）。',
          },
        ],
      },
    ],
  },
  {
    id: 'act:spyf:confront',
    name: '摊牌',
    category: 'social',
    description: '就一个秘密向对方摊牌。需要你知道该秘密（信息不对称的强制）。',
    actorEligibilityRoles: ['spy'],
    preconditions: [
      { type: 'requires_co_presence', targetKey: '', expectedValue: '', failureMessage: '对方不在你面前。' },
      {
        type: 'requires_knowledge',
        targetKey: '',
        expectedValue: SPYF.factYorAssassin,
        failureMessage: '你不知道约尔的真实身份——这个秘密并没有对你开放。',
      },
    ],
    directEffects: [
      {
        targetDomain: 'relationship',
        targetId: SPYF.relMarriage,
        mutationType: 'decrement',
        fieldKey: 'currentAffinity',
        payload: 30,
        narrativeDescription: '一场摊牌摧毁了表面的温情。',
      },
      {
        targetDomain: 'relationship',
        targetId: SPYF.relMarriage,
        mutationType: 'decrement',
        fieldKey: 'currentTrust',
        payload: 25,
        narrativeDescription: '信任大幅崩塌。',
      },
      {
        targetDomain: 'entity',
        targetId: '$target',
        mutationType: 'set',
        fieldKey: 'emotionalState',
        payload: '惊骇、绝望、准备逃离',
        narrativeDescription: '约尔惊骇，本能地准备逃离。',
      },
    ],
    potentialConsequences: [],
  },
  {
    id: 'act:spyf:reveal_identity',
    name: '坦白身份',
    category: 'covert',
    description: '向某人坦白自己间谍的真实身份。',
    actorEligibilityRoles: ['spy'],
    preconditions: [
      { type: 'requires_co_presence', targetKey: '', expectedValue: '', failureMessage: '对方不在你面前。' },
    ],
    directEffects: [
      {
        targetDomain: 'epistemic',
        targetId: '$target',
        mutationType: 'reveal_fact',
        fieldKey: '',
        payload: SPYF.factLoidTwilight,
        narrativeDescription: '你向对方坦白了自己的真实身份。',
      },
      {
        targetDomain: 'entity',
        targetId: '$target',
        mutationType: 'set',
        fieldKey: 'emotionalState',
        payload: '震惊',
        narrativeDescription: '对方震惊得说不出话。',
      },
    ],
    potentialConsequences: [],
  },
];

// ---------------------------------------------------------------------------
// 玩家可能性空间
// ---------------------------------------------------------------------------

const possibilitySpace = {
  availableRoles: [
    {
      id: 'role:spyf:loid',
      title: '洛德·福杰（玩家）',
      name: 'Loid Forger',
      inhabitationMode: 'canonical_character' as const,
      associatedEntityId: SPYF.loid,
      socialPosition: '一家之主 / 精神科医生 / 间谍',
      agencyLevel: 'character_ground' as const,
      epistemicFogOfWar: 'strict_first_person' as const,
      availableActionCategories: ['social', 'covert', 'forensic', 'physical'],
      suggestedPromptDirectives: ['扮演洛德，在家人面前维持体面，同时推进任务。'],
      systemConstraints: ['不得向家人暴露间谍身份', '不得在 Anya 面前暴露任何秘密——她读得出来'],
      description: '扮演洛德·福杰，在伪装家庭与间谍使命之间走钢丝。',
    },
    {
      id: 'role:spyf:director',
      title: '主持人（全知）',
      name: 'Director',
      inhabitationMode: 'directorial_host' as const,
      socialPosition: '叙事导演',
      agencyLevel: 'narrative_director' as const,
      epistemicFogOfWar: 'omniscient_narrator' as const,
      availableActionCategories: ['directorial'],
      suggestedPromptDirectives: ['以全知视角推进事件，注入世界的秘密与张力。'],
      systemConstraints: ['干预必须作为事件写入日志，不得篡改已记录的历史'],
      description: '全知叙事导演，可注入事件与秘密，但一切写入需走内核。',
    },
  ],
  coreFantasyHook: '在一场伪装成家庭的任务中，平衡间谍使命、杀手妻子与读心女儿的秘密。',
  primaryInteractionLoop: '在家人面前扮演丈夫与父亲，同时执行 WISE 的任务。',
  tabooOrForbiddenActions: ['向家人坦白真实身份', '在 Anya 面前暴露任何秘密'],
};

// ---------------------------------------------------------------------------
// 体验档案
// ---------------------------------------------------------------------------

const experienceProfile: ExperienceProfile = {
  primaryFantasy: 'Identity',
  secondaryFantasy: 'Relationship',
  dominantTone: 'tense_farce',
  tensionGradient: 'peaks_and_valleys',
  socialDensity: 3,
  informationAsymmetry: 5,
  consequenceLethality: 3,
  investigativeDepth: 3,
  recommendedModalities: ['dialogue_focused', 'relationship_web_graph', 'territorial_tactical_map'],
};

// ---------------------------------------------------------------------------
// 场景种子
// ---------------------------------------------------------------------------

export interface SpyFamilyScenario {
  breakfast: { id: string; worldDefinitionId: string; title: string; initialSituation: string; recommendedRoles: typeof possibilitySpace.availableRoles };
}

export const SPY_FAMILY_SCENARIOS: SpyFamilyScenario = {
  breakfast: {
    id: 'scn:spyf:breakfast',
    worldDefinitionId: 'spy_family_min',
    title: '周日早餐',
    initialSituation:
      '周日早晨，福杰家客厅。洛德在准备早餐，约尔在摆放餐具，安雅正啃着花生酱吐司，邦德趴在角落。今天下午伊甸学园有家长会——而你，洛德·福杰，还有一个见不得光的身份。',
    recommendedRoles: [possibilitySpace.availableRoles[0]],
  },
};

// ---------------------------------------------------------------------------
// 世界定义
// ---------------------------------------------------------------------------

export const SPY_FAMILY_MIN: WorldDefinition = {
  id: 'spy_family_min',
  name: 'SPY×FAMILY（最小切片）',
  tagline: '在伪装家庭与真实身份之间走钢丝。',
  premise: '一个由间谍、杀手与读心者组成的"普通"家庭，在冷战阴影下维护着摇摇欲坠的日常。',
  version: { schemaVersion: '1.0.0', definitionVersion: '0.1.0', revision: 1, lastUpdated: '2026-08-29' },
  axioms,
  capabilities,
  characters,
  organizations,
  locations,
  objects,
  resources,
  relationships,
  socialNorms,
  lawsAndStatutes,
  powerRelations,
  groundTruthFacts,
  actions,
  possibilitySpace,
  experienceProfile,
};
