/**
 * HEADCONAN — 前提判定夹具世界（W2.2）
 *
 * 目的：为 7 类前提提供独立、可判定、不污染 spyFamilyMin 的最小世界。
 * 覆盖：requires_location / requires_co_presence / requires_capability /
 *       requires_knowledge / requires_resource / requires_authority / requires_min_trust。
 *
 * 主体：alice（有 science 能力 + enter:vault 权限，在实验室）、
 *       bob（无能力/权限，在保险库，且知道 alice_secret）。
 * 每个动作一条前提，成功时把 actor 的 emotionalState 置为 '已完成' 作为通过标记。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { CharacterEntity, LocationEntity, ResourceEntity } from '../representation/types/entity';
import type { RelationshipDefinition } from '../representation/types/relationships';
import type { Fact } from '../representation/types/information';
import type { WorldActionDefinition } from '../representation/types/dynamics';
import type { ProvenanceMeta } from '../representation/types/primitives';

const AUTH: ProvenanceMeta = { source: 'authored', sourceConfidence: 1, createdTurn: 0 };

export const PC = {
  alice: 'char:pc:alice',
  bob: 'char:pc:bob',
  lab: 'loc:pc:lab',
  vault: 'loc:pc:vault',
  rel: 'rel:pc:alice_bob',
  cash: 'res:pc:cash',
  fact: 'fact:pc:alice_secret',
} as const;

const characters: CharacterEntity[] = [
  {
    id: PC.alice,
    kind: 'character',
    name: '爱丽丝（Alice）',
    aliases: ['alice'],
    description: '拥有科学能力与保险库权限的研究员。',
    tags: ['scientist'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: 'Researcher',
    organizationIds: [],
    primaryLocationId: PC.lab,
    personality: { temperament: 'analytical', moralAlignment: 'pragmatic', primaryValues: ['科学'] },
    goals: [],
    needs: [],
    knownFactIds: [],
    beliefs: [],
    secretFactIds: [],
    capabilities: ['science'],
    socialPermissions: ['enter:vault'],
    currentLocationId: PC.lab,
    currentActivity: '做实验',
    emotionalState: '专注',
    publicReputationScore: 50,
    physicalStatus: 'healthy',
  },
  {
    id: PC.bob,
    kind: 'character',
    name: '鲍勃（Bob）',
    aliases: ['bob'],
    description: '没有特殊能力或权限，但意外知道爱丽丝的秘密。',
    tags: ['observer'],
    provenance: AUTH,
    createdAtTurn: 0,
    canonStatus: 'canonical',
    archetypeRole: 'Observer',
    organizationIds: [],
    primaryLocationId: PC.vault,
    personality: { temperament: 'impulsive', moralAlignment: 'pragmatic', primaryValues: ['生存'] },
    goals: [],
    needs: [],
    knownFactIds: [PC.fact],
    beliefs: [],
    secretFactIds: [],
    capabilities: [],
    socialPermissions: [],
    currentLocationId: PC.vault,
    currentActivity: '待着',
    emotionalState: '平静',
    publicReputationScore: 50,
    physicalStatus: 'healthy',
  },
];

const locations: LocationEntity[] = [
  {
    id: PC.lab,
    kind: 'location',
    name: '实验室',
    aliases: [],
    description: '爱丽丝的工作场所。',
    tags: ['lab'],
    provenance: AUTH,
    createdAtTurn: 0,
    type: 'office',
    accessibility: 'public',
    atmosphere: '消毒水味',
    spatialAffordances: [],
  },
  {
    id: PC.vault,
    kind: 'location',
    name: '保险库',
    aliases: [],
    description: '需要权限才能进入的房间。',
    tags: ['vault'],
    provenance: AUTH,
    createdAtTurn: 0,
    type: 'office',
    accessibility: 'restricted',
    atmosphere: '阴冷',
    spatialAffordances: [],
  },
];

const relationships: RelationshipDefinition[] = [
  {
    id: PC.rel,
    sourceEntityId: PC.alice,
    targetEntityId: PC.bob,
    kind: 'intimacy',
    isBidirectional: true,
    affinity: 30,
    trust: 5, // 低于 act:pc:deep_trust 的 10 门槛
    powerBalance: 0,
    visibility: 'public',
    narrativeDescription: '爱丽丝与鲍勃的关系。',
    provenance: AUTH,
  },
];

const resources: ResourceEntity[] = [
  {
    id: PC.cash,
    kind: 'resource',
    name: '现金',
    aliases: [],
    description: '可消耗的资金池。',
    tags: ['currency'],
    provenance: AUTH,
    createdAtTurn: 0,
    resourceType: 'currency',
    quantity: 10,
    unit: '金币',
    isFungible: true,
  },
];

const groundTruthFacts: Fact[] = [
  {
    id: PC.fact,
    statement: '爱丽丝在秘密为敌方提供情报。',
    subjectEntityId: PC.alice,
    domain: 'crime',
    visibilityScope: 'singular_secret',
    provenance: AUTH,
    falsifiability: true,
  },
];

const MARK: WorldActionDefinition['directEffects'] = [
  {
    targetDomain: 'entity',
    targetId: '$actor',
    mutationType: 'set',
    fieldKey: 'emotionalState',
    payload: '已完成',
    narrativeDescription: '动作成功执行。',
  },
];

const actions: WorldActionDefinition[] = [
  {
    id: 'act:pc:lab_only',
    name: '使用实验室',
    category: 'academic',
    description: '必须在实验室内执行。',
    actorEligibilityRoles: [],
    preconditions: [
      {
        type: 'requires_location',
        targetKey: 'actor.currentLocationId',
        expectedValue: PC.lab,
        failureMessage: '必须在实验室里才能使用实验室设备。',
      },
    ],
    directEffects: MARK,
    potentialConsequences: [],
  },
  {
    id: 'act:pc:together',
    name: '共同行动',
    category: 'social',
    description: 'actor 必须与全部 target 同地点。',
    actorEligibilityRoles: [],
    preconditions: [
      {
        type: 'requires_co_presence',
        targetKey: '',
        expectedValue: '',
        failureMessage: '共现前提不满足：双方不在同一地点。',
      },
    ],
    directEffects: MARK,
    potentialConsequences: [],
  },
  {
    id: 'act:pc:science_only',
    name: '科学分析',
    category: 'academic',
    description: '需要 science 能力。',
    actorEligibilityRoles: [],
    preconditions: [
      {
        type: 'requires_capability',
        targetKey: '',
        expectedValue: 'science',
        failureMessage: '需要科学分析能力才能执行。',
      },
    ],
    directEffects: MARK,
    potentialConsequences: [],
  },
  {
    id: 'act:pc:know_secret',
    name: '利用情报',
    category: 'covert',
    description: '需要知道爱丽丝的秘密。',
    actorEligibilityRoles: [],
    preconditions: [
      {
        type: 'requires_knowledge',
        targetKey: '',
        expectedValue: PC.fact,
        failureMessage: '你并不知道这个秘密。',
      },
    ],
    directEffects: MARK,
    potentialConsequences: [],
  },
  {
    id: 'act:pc:spend_cash',
    name: '大宗采购',
    category: 'political',
    description: '需要至少 5 枚金币。',
    actorEligibilityRoles: [],
    preconditions: [
      {
        type: 'requires_resource',
        targetKey: PC.cash,
        expectedValue: 5,
        failureMessage: '现金不足，无法完成采购。',
      },
    ],
    directEffects: MARK,
    potentialConsequences: [],
  },
  {
    id: 'act:pc:vault_entry',
    name: '进入保险库',
    category: 'physical',
    description: '需要 enter:vault 权限。',
    actorEligibilityRoles: [],
    preconditions: [
      {
        type: 'requires_authority',
        targetKey: '',
        expectedValue: 'enter:vault',
        failureMessage: '没有进入保险库的权限。',
      },
    ],
    directEffects: MARK,
    potentialConsequences: [],
  },
  {
    id: 'act:pc:deep_trust',
    name: '托付机密',
    category: 'social',
    description: '需要双方信任不低于 10。',
    actorEligibilityRoles: [],
    preconditions: [
      {
        type: 'requires_min_trust',
        targetKey: PC.rel,
        expectedValue: 10,
        failureMessage: '信任不足，无法托付机密。',
      },
    ],
    directEffects: MARK,
    potentialConsequences: [],
  },
];

export const PRECONDITION_WORLD: WorldDefinition = {
  id: 'precondition_min',
  name: '前提判定夹具',
  tagline: '7 类前提全部确定性判定的最小世界。',
  premise: '用于内核前提判定的最小验证世界。',
  version: { schemaVersion: '1.0.0', definitionVersion: '0.1.0', revision: 1, lastUpdated: '2026-08-30' },
  axioms: [],
  capabilities: [],
  characters,
  organizations: [],
  locations,
  objects: [],
  resources,
  relationships,
  socialNorms: [],
  lawsAndStatutes: [],
  powerRelations: [],
  groundTruthFacts,
  actions,
  possibilitySpace: {
    availableRoles: [],
    coreFantasyHook: '',
    primaryInteractionLoop: '',
    tabooOrForbiddenActions: [],
  },
  experienceProfile: {
    primaryFantasy: 'Mystery & Knowledge',
    dominantTone: 'cozy_intellectual',
    tensionGradient: 'episodic_puzzle',
    socialDensity: 2,
    informationAsymmetry: 4,
    consequenceLethality: 2,
    investigativeDepth: 4,
    recommendedModalities: ['dossier_matrix'],
  },
};
