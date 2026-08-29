/**
 * HEADCONAN WORLD RUNTIME — Instantiation
 *
 * E1 实验交付物（ARCHITECTURAL_EXPERIMENTS.md）：
 *   instantiate(world, scenario) → WorldInstance 的正式接口签名。
 *
 * 职责：
 *   1. 从 WorldDefinition 合成初始 WorldStateInstance（无手写基态时）。
 *   2. 基于手写基态（如各基准世界的 *_INITIAL_STATE）深拷贝实例化。
 *   3. 应用 ScenarioSeed.initialStateMutations，使「正典 / 分歧 / 角色视角」
 *      从同一份定义派生出互不污染的实例。
 * 纪律：
 *   - 实例间零共享引用（structuredClone 深拷贝）。
 *   - 定义永不被实例修改（只读引用）。
 *   - 认知记录以运行时为准，定义中的 knownFactIds 仅作初始种子（ADR-10）。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { WorldStateInstance, EntityStateSnapshot } from '../representation/types/state';
import type { ScenarioSeed } from '../representation/types/scenarios';
import type { StateEffect } from '../representation/types/dynamics';
import type { DynamicRelationshipState } from '../representation/types/relationships';

export interface InstantiateOptions {
  /** 场景种子：初始情境 + 状态突变 + 推荐角色。缺省 = 正典。 */
  scenario?: ScenarioSeed;
  /** 可选的手写基态（如 GAME_OF_THRONES_INITIAL_STATE）。缺省 = 从定义合成。 */
  baseState?: WorldStateInstance;
  /** 显式实例 ID（实验/测试用确定性 ID）。缺省 = 由定义+场景派生。 */
  instanceId?: string;
  timelineId?: string;
}

/**
 * 实例化：Definition + Scenario → 独立可变的 WorldStateInstance。
 */
export function instantiate(world: WorldDefinition, opts: InstantiateOptions = {}): WorldStateInstance {
  const state = opts.baseState ? structuredClone(opts.baseState) : synthesizeInitialState(world);

  state.instanceId = opts.instanceId ?? `inst:${world.id}:${opts.scenario?.id ?? 'canon'}`;
  state.definitionId = world.id;
  state.timelineId = opts.timelineId ?? state.timelineId ?? `timeline:${world.id}:1`;
  if (opts.scenario) {
    state.scenarioId = opts.scenario.id;
    if (opts.scenario.initialSituation) {
      state.currentSituationNarrative = opts.scenario.initialSituation;
    }
    // 重置时钟与日志：每个实例从自身起点开始，不继承基态历史
    state.clock = { turnNumber: 1, inUniverseTime: state.clock.inUniverseTime };
    state.recentEvents = [];
    state.eventChronicleLog = [];
    for (const effect of opts.scenario.initialStateMutations ?? []) {
      applyStateEffect(state, effect);
    }
  }
  return state;
}

/**
 * 从定义合成初始状态（无手写基态时的确定性默认）。
 * 覆盖：实体快照（primaryLocationId / currentActivity / emotionalState /
 *       publicReputationScore / physicalStatus → 状态字段）、
 *       关系动态值（基线 → current*）、认知种子（knownFactIds + universal_public）、
 *       资源池（quantity → pool）。
 */
export function synthesizeInitialState(world: WorldDefinition): WorldStateInstance {
  const entityStates: Record<string, EntityStateSnapshot> = {};
  for (const c of world.characters) {
    entityStates[c.id] = {
      entityId: c.id,
      currentLocationId: c.primaryLocationId,
      currentActivity: c.currentActivity ?? '',
      emotionalState: c.emotionalState ?? '',
      reputationScore: c.publicReputationScore ?? 50,
      physicalStatus: c.physicalStatus ?? 'healthy',
      dynamicAttributes: {},
      inventoryObjectIds: [],
    };
  }

  const relationshipStates: Record<string, DynamicRelationshipState> = {};
  for (const r of world.relationships) {
    relationshipStates[r.id] = {
      relationshipId: r.id,
      currentAffinity: r.affinity,
      currentTrust: r.trust,
      currentPowerBalance: r.powerBalance,
      recentInteractionsSummary: r.narrativeDescription,
      brokenPromisesCount: 0,
    };
  }

  const entityKnownFacts: Record<string, string[]> = {};
  for (const c of world.characters) {
    const seed = new Set<string>(c.knownFactIds ?? []);
    for (const f of world.groundTruthFacts) {
      if (f.visibilityScope === 'universal_public') seed.add(f.id);
    }
    entityKnownFacts[c.id] = [...seed];
  }

  return {
    instanceId: '',
    definitionId: world.id,
    timelineId: `timeline:${world.id}:1`,
    clock: { turnNumber: 1, inUniverseTime: 'Turn 1 — Genesis' },
    currentSituationNarrative: world.premise,
    entityStates,
    relationshipStates,
    epistemics: {
      entityKnownFacts,
      activeSecrets: [],
      activeRumors: [],
      publicExposedFactIds: world.groundTruthFacts
        .filter(f => f.visibilityScope === 'universal_public')
        .map(f => f.id),
    },
    resourcePools: Object.fromEntries(world.resources.map(r => [r.id, r.quantity])),
    recentEvents: [],
    eventChronicleLog: [],
  };
}

/**
 * 原子状态效果应用器（纯函数副作用于传入状态）。
 * 供实例化、E1 实验使用；P2 事件内核将复用同一语义。
 * 注意：占位符（$actor/$target）解析由内核层负责，此处只接受绝对 ID。
 */
export function applyStateEffect(state: WorldStateInstance, effect: StateEffect): void {
  switch (effect.targetDomain) {
    case 'entity': {
      const es = state.entityStates[effect.targetId];
      if (!es) return;
      // `dynamic.<key>` 前缀 → 写入 dynamicAttributes（运行时可变属性），而非快照顶层字段
      if (effect.fieldKey.startsWith('dynamic.')) {
        const key = effect.fieldKey.slice('dynamic.'.length);
        const cur = es.dynamicAttributes[key];
        if (effect.mutationType === 'set') {
          es.dynamicAttributes[key] = effect.payload;
        } else if ((effect.mutationType === 'increment' || effect.mutationType === 'decrement') && typeof cur === 'number') {
          const delta = effect.mutationType === 'increment' ? effect.payload : -effect.payload;
          es.dynamicAttributes[key] = cur + delta;
        } else if (effect.mutationType === 'increment' || effect.mutationType === 'decrement') {
          es.dynamicAttributes[key] = (effect.mutationType === 'increment' ? effect.payload : -effect.payload);
        }
        break;
      }
      applyNumericOrSet(es, effect);
      break;
    }
    case 'relationship': {
      const rs = state.relationshipStates[effect.targetId];
      if (!rs) return;
      applyNumericOrSet(rs, effect);
      break;
    }
    case 'resource': {
      const pool = state.resourcePools;
      if (effect.mutationType === 'set') {
        pool[effect.targetId] = effect.payload;
      } else if (effect.mutationType === 'increment') {
        pool[effect.targetId] = (pool[effect.targetId] ?? 0) + effect.payload;
      } else if (effect.mutationType === 'decrement') {
        pool[effect.targetId] = (pool[effect.targetId] ?? 0) - effect.payload;
      }
      break;
    }
    case 'epistemic': {
      if (effect.mutationType === 'reveal_fact') {
        const list = (state.epistemics.entityKnownFacts[effect.targetId] ??= []);
        if (!list.includes(effect.payload)) list.push(effect.payload);
      }
      break;
    }
    default:
      // social_norm / location / create_entity / modify_status：P2 内核阶段实现
      break;
  }
}

function applyNumericOrSet(obj: object, effect: StateEffect): void {
  const target = obj as Record<string, unknown>;
  const current = target[effect.fieldKey];
  if (effect.mutationType === 'set') {
    target[effect.fieldKey] = effect.payload;
  } else if (
    (effect.mutationType === 'increment' || effect.mutationType === 'decrement') &&
    typeof current === 'number'
  ) {
    const delta = effect.mutationType === 'increment' ? effect.payload : -effect.payload;
    target[effect.fieldKey] = current + delta;
  }
}
