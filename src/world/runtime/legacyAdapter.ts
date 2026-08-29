/**
 * HEADCONAN — 遗留表示层适配器（W1 绞杀者模式核心）
 *
 * 绞杀者模式（docs/EXECUTION_PLAN.md §5 R2）：保留视觉外壳（Header / WorldCanvasRenderer /
 * ActionDock / ChronicleModal 等仍消费 legacy `WorldState`），仅替换状态层。
 *
 * 本模块把「内核真相」投影为「外壳可显示」的 legacy `WorldState`：
 *   - 每帧调用（App 在 kernelState / 观察者 / 笔记变化时重新投影）。
 *   - 投影隔离：观察者视角决定哪些秘密可见——
 *       * 玩家（洛德）：只看到自己已知的秘密（看不到约尔是杀手、安雅会读心）。
 *       * 导演（全知）：看到全部秘密。
 *   - 数据全部从 WorldDefinition + WorldStateInstance 派生，不含硬编码叙事。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { WorldStateInstance } from '../representation/types/state';
import type { EntityId } from '../representation/types/primitives';
import type { InhabitedRoleSlot } from '../representation/types/player';
import type { RoleSlot, RoleType } from '../../roles/model';
import type { WorldStyle } from '../../style/worldStyle';
import type {
  WorldState,
  Character,
  WorldLocation,
  Faction,
  WorldEvent,
  TimelineEvent,
  StatMetric,
  ClueItem,
  RuleAxiom,
  Relationship,
  UserNote,
  UserRole,
} from '../types';

export interface LegacyProjectOptions {
  notes?: UserNote[];
  activeRoleId?: string;
}

// ---------------------------------------------------------------------------
// 世界风格（呈现层常量，非内核状态）
// ---------------------------------------------------------------------------

export const SPY_FAMILY_STYLE: WorldStyle = {
  id: 'style-spyfamily',
  name: 'Domestic Espionage & Social Sphere',
  visualLanguage: 'personal-social',
  spatialArchetype: 'social-campus-mosaic',
  primarySurfaceType: 'campus-social-hub',
  informationHierarchy: {
    primaryAxis: '家庭社交圈与关系张力',
    secondaryAxis: '日常行动、信任指标与秘密发现',
    hiddenUnlessTriggered: ['forger-secrets', 'pen-surveillance'],
  },
  interactionGrammar: {
    commandVerb: 'Act',
    placeholder: '和约尔说句话、问安雅学校的事、检查钢笔，或前往一个地点……',
    actionTypeLabel: 'Affordances',
    defaultActions: [
      '问约尔：昨晚去哪了？',
      '夸奖约尔今天很好看',
      '问安雅：学校怎么样？',
      '前往伊甸学园走廊',
      '检查那支黑色钢笔',
      '错过今天的家长会',
    ],
  },
  narrativeGrammar: {
    dispatchLabel: 'Family Buzz & Daily Dispatches',
    chronicleTitle: 'Forger Family Chronicle',
    documentClassificationDefault: 'FAMILY NOTE',
  },
  temporalGrammar: { timeUnit: 'Turn', timeDisplayPrefix: 'Turn' },
  typography: { headingFont: 'font-serif', bodyFont: 'font-sans' },
  density: 'comfortable',
  tokens: {
    canvasBg: 'bg-zinc-100',
    surfaceBg: 'bg-white',
    surfaceHoverBg: 'hover:bg-zinc-50',
    borderColor: 'border-zinc-200',
    accentColor: 'bg-zinc-900',
    accentText: 'text-zinc-900',
    accentBadge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    subtleText: 'text-zinc-500',
    cardBorder: 'border-zinc-200',
    glowAccent: 'shadow-[0_0_20px_rgba(24,24,27,0.06)]',
  },
  attentionBudget: {
    maxVisibleSurfaces: 6,
    priorityBlockTypes: ['character', 'stats', 'map', 'relationship', 'event', 'timeline'],
  },
};

// ---------------------------------------------------------------------------
// 角色槽映射（从定义的玩家可能性空间派生）
// ---------------------------------------------------------------------------

function mapRoleSlot(slot: InhabitedRoleSlot): RoleSlot {
  const isDirector = slot.agencyLevel === 'narrative_director';
  const type: RoleType = isDirector ? 'DIRECTOR' : 'PLAYER';
  const permissions: RoleSlot['permissions'] = isDirector
    ? ['spawn', 'reveal', 'narrate', 'schedule', 'observe']
    : ['talk', 'move', 'decide', 'command'];
  return {
    id: slot.id,
    name: slot.name,
    type,
    title: slot.title,
    agency: isDirector ? 'world-level' : 'character-level',
    perspective: isDirector ? 'omniscient' : 'first-person',
    knowledge: isDirector ? 'omniscient' : 'limited',
    permissions,
    controlledEntityId: slot.associatedEntityId,
    avatar: isDirector ? '🎭' : '🧭',
    description: slot.description,
    suggestedPrompts: slot.suggestedPromptDirectives.length
      ? slot.suggestedPromptDirectives
      : slot.availableActionCategories,
  };
}

// ---------------------------------------------------------------------------
// 投影过滤（信息不对称的呈现层体现）
// ---------------------------------------------------------------------------

function observerKnownFacts(state: WorldStateInstance, observer: EntityId | null): Set<string> {
  if (observer === null) return new Set(); // 全知：不过滤
  return new Set(state.epistemics.entityKnownFacts[observer] ?? []);
}

function secretAgendaFor(
  world: WorldDefinition,
  state: WorldStateInstance,
  charId: string,
  observer: EntityId | null
): string | undefined {
  const char = world.characters.find(c => c.id === charId);
  if (!char || char.secretFactIds.length === 0) return undefined;
  const known = observerKnownFacts(state, observer);
  const visible = char.secretFactIds
    .map(fid => world.groundTruthFacts.find(f => f.id === fid))
    .filter((f): f is NonNullable<typeof f> => !!f && (observer === null || known.has(f.id)))
    .map(f => f.statement)
    .join('；');
  return visible || undefined;
}

// ---------------------------------------------------------------------------
// 主投影入口
// ---------------------------------------------------------------------------

export function projectLegacyWorld(
  world: WorldDefinition,
  state: WorldStateInstance,
  observerEntityId: EntityId | null,
  opts: LegacyProjectOptions = {}
): WorldState {
  const roles: RoleSlot[] = world.possibilitySpace.availableRoles.map(mapRoleSlot);
  const activeRoleId = opts.activeRoleId ?? roles[0]?.id ?? '';
  const isObserverOmniscient = observerEntityId === null;

  const characters: Character[] = world.characters.map(c => {
    const es = state.entityStates[c.id];
    return {
      id: c.id,
      name: c.name,
      role: c.archetypeRole,
      faction: c.organizationIds?.[0]
        ? world.organizations.find(o => o.id === c.organizationIds[0])?.name
        : undefined,
      status: es?.emotionalState || c.physicalStatus || 'healthy',
      loyalty: clamp(es?.reputationScore ?? c.publicReputationScore ?? 50, 0, 100),
      summary: c.description,
      secretAgenda: secretAgendaFor(world, state, c.id, observerEntityId),
      suspicionLevel: typeof es?.dynamicAttributes?.suspicionOfYor === 'number'
        ? es.dynamicAttributes.suspicionOfYor * 10
        : undefined,
    };
  });

  const locations: WorldLocation[] = world.locations.map(l => ({
    id: l.id,
    name: l.name,
    type: l.type,
    status: 'stable',
    significance: l.description,
    coordinates: LOCATION_COORDS[l.id] ?? { x: 50, y: 50 },
    controllingFaction: l.controllingOrganizationId
      ? world.organizations.find(o => o.id === l.controllingOrganizationId)?.name
      : undefined,
    restricted: l.accessibility === 'restricted',
  }));

  const factions: Faction[] = world.organizations.map(o => ({
    id: o.id,
    name: o.name,
    influence: clamp(o.publicPrestigeScore ?? 50, 0, 100),
    stance: 'neutral',
    agenda: o.doctrineOrCharter,
    leader: o.leaderEntityId
      ? world.characters.find(ch => ch.id === o.leaderEntityId)?.name
      : undefined,
  }));

  const events: WorldEvent[] = state.recentEvents.map(e => ({
    id: e.id,
    timestamp: e.timestampStr,
    title: e.title,
    category: mapEventCategory(e.category),
    description: e.description,
    urgency: 'medium',
    relatedEntityId: e.initiatorEntityId,
  }));

  const timeline: TimelineEvent[] = state.eventChronicleLog.map((e, i, arr) => ({
    id: e.id,
    time: e.timestampStr,
    title: e.title,
    description: e.description,
    status: i === arr.length - 1 ? 'active' : 'completed',
  }));

  const stats: StatMetric[] = buildStats(world, state);

  const clues: ClueItem[] = world.objects
    .filter(o => o.associatedFactIds?.some(fid => isObserverOmniscient || observerKnownFacts(state, observerEntityId).has(fid)))
    .map(o => ({
      id: o.id,
      title: o.name,
      category: 'physical' as const,
      description: o.description,
      significance: `与「${factName(world, o.associatedFactIds?.[0])}」相关的物证。`,
      relatedLocationId: o.currentLocationId,
      status: 'unsolved' as const,
    }));

  const rules: RuleAxiom[] = world.axioms.map(a => ({
    id: a.id,
    name: a.statement.length > 24 ? `${a.statement.slice(0, 24)}…` : a.statement,
    description: a.statement,
    active: true,
    category: mapAxiomCategory(a.type),
  }));

  const relationships: Relationship[] = world.relationships.map(r => ({
    id: r.id,
    sourceId: r.sourceEntityId,
    targetId: r.targetEntityId,
    sourceName: entityName(world, r.sourceEntityId),
    targetName: entityName(world, r.targetEntityId),
    type: mapRelationshipKind(r.kind),
    intensity: clamp(state.relationshipStates[r.id]?.currentAffinity ?? r.affinity, 0, 100),
    description: r.narrativeDescription,
  }));

  const genre = world.experienceProfile?.primaryFantasy
    ? `${world.experienceProfile.primaryFantasy} / ${world.experienceProfile.secondaryFantasy ?? ''}`.replace(' / ', ' / ')
    : 'Narrative Simulation';

  const userRole: UserRole = {
    title: isObserverOmniscient ? '全知叙事导演' : '洛德·福杰（玩家）',
    authority: isObserverOmniscient ? 'World Weaver' : '一家之主 / 精神科医生',
    objective: isObserverOmniscient
      ? '注入事件与秘密，一切写入需走内核事件。'
      : (world.possibilitySpace.coreFantasyHook ?? '维持日常，同时推进任务。'),
    traits: isObserverOmniscient
      ? ['omniscient', 'narrative-director', 'reveal']
      : ['spy', 'cover-psychiatrist', 'father'],
  };

  return {
    id: world.id,
    name: world.name,
    genre,
    premise: world.premise,
    atmosphere: world.locations.find(l => l.id === state.entityStates[activeEntityOf(world, observerEntityId)]?.currentLocationId)?.atmosphere
      ?? '温馨而暗流涌动的清晨家庭场景',
    currentSituation: state.currentSituationNarrative,
    roles,
    activeRoleId,
    userRole,
    characters,
    locations,
    factions,
    events,
    timeline,
    stats,
    documents: [],
    relationships,
    clues,
    rules,
    notes: opts.notes ?? [],
    style: SPY_FAMILY_STYLE,
    createdAt: new Date().toISOString(),
    turnCount: state.clock.turnNumber,
  };
}

// ---------------------------------------------------------------------------
// 派生辅助
// ---------------------------------------------------------------------------

const LOCATION_COORDS: Record<string, { x: number; y: number }> = {
  'loc:spyf:forger_home_living': { x: 18, y: 72 },
  'loc:spyf:city_street': { x: 55, y: 85 },
  'loc:spyf:eden_corridor': { x: 30, y: 22 },
  'loc:spyf:eden_infirmary': { x: 68, y: 28 },
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function entityName(world: WorldDefinition, id: string): string {
  return world.characters.find(c => c.id === id)?.name
    ?? world.organizations.find(o => o.id === id)?.name
    ?? world.locations.find(l => l.id === id)?.name
    ?? id;
}

function factName(world: WorldDefinition, factId?: string): string {
  if (!factId) return '未知';
  return world.groundTruthFacts.find(f => f.id === factId)?.statement ?? factId;
}

function activeEntityOf(world: WorldDefinition, observer: EntityId | null): string {
  if (observer === null) return '';
  return observer;
}

function mapEventCategory(cat: string): WorldEvent['category'] {
  switch (cat) {
    case 'crisis': return 'crisis';
    case 'discovery': return 'discovery';
    case 'crime': return 'clue';
    case 'academic_milestone': return 'report';
    case 'political_turn': return 'report';
    case 'social_shift':
    default: return 'report';
  }
}

function mapAxiomCategory(type: string): RuleAxiom['category'] {
  switch (type) {
    case 'metaphysical_law': return 'mystic';
    case 'social_contract': return 'society';
    case 'physical_law': return 'physics';
    default: return 'constraint';
  }
}

function mapRelationshipKind(kind: string): Relationship['type'] {
  switch (kind) {
    case 'intimacy': return 'romance';
    case 'rivalry': return 'rivalry';
    case 'kinship':
    case 'alliance':
    default: return 'alliance';
  }
}

function buildStats(world: WorldDefinition, state: WorldStateInstance): StatMetric[] {
  const actorId = world.possibilitySpace.availableRoles[0]?.associatedEntityId;
  const es = actorId ? state.entityStates[actorId] : undefined;
  const rel = (id: string) => state.relationshipStates[id];

  const items: Array<{ label: string; value: number; description?: string }> = [
    { label: '家庭声誉', value: es?.reputationScore ?? 50 },
    { label: '婚姻亲密', value: rel('rel:spyf:loid_yor_marriage')?.currentAffinity ?? 40 },
    { label: '家庭信任', value: rel('rel:spyf:loid_yor_marriage')?.currentTrust ?? 15 },
    { label: '与安雅亲密', value: rel('rel:spyf:loid_anya_parent')?.currentAffinity ?? 55 },
    {
      label: '对约尔的怀疑',
      value: clamp((es?.dynamicAttributes?.suspicionOfYor as number | undefined) ?? 0, 0, 100),
    },
  ];

  return items.map((it, i) => {
    const v = clamp(it.value, 0, 100);
    return {
      id: `stat:spyf:${i}`,
      label: it.label,
      value: v,
      max: 100,
      trend: 'stable',
      status: v >= 60 ? 'good' : v >= 30 ? 'warning' : 'critical',
      description: it.description,
    };
  });
}
