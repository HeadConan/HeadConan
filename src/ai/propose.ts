/**
 * HEADCONAN AI — LLM 提议意图解析（W3.2，第一提议者）
 *
 * 目的（docs/W3_PLAN.md §3 W3.2）：自由文本意图由 LLM 理解并提议结构化候选事件，
 * 经内核校验后真实生效；LLM 不可用/低置信时自动回退确定性解析，体验永不硬阻塞。
 *
 * 红线（ADR-008）：LLM 只提议，内核只写入。
 *   - 服务端校验 schema；客户端校验实体 ID/动作 ID；内核 applyEvent 为最终门（拒绝即事件）。
 *   - 投影纪律：stateSummary 只含 actor 自身已知事实 + 各实体位置 + 最近事件，
 *     绝不把其他实体的认知账本送入 LLM 上下文（W3.4 投影隔离的同一原则）。
 */

import type { WorldDefinition } from '../world/representation/types/definition';
import type { WorldStateInstance } from '../world/representation/types/state';
import type { EntityId } from '../world/representation/types/primitives';
import type { KernelEvent, SpeechIntentTag } from '../world/runtime/kernel2';
import type { ResolvedKernelAction, resolveUserAction } from '../world/runtime/kernel2Resolver';
import type { SceneIntentHint } from '../world/runtime/scene';
import { AI_PROVIDERS, type AIProviderId } from './client';

export interface ProposedAction {
  events: KernelEvent[];
  /** 0-1；LLM 提议置信 / 确定性规则置信 */
  confidence: number;
  source: 'llm' | 'deterministic' | 'clarify';
  /** 人类可读说明（供调试与澄清反馈） */
  resolution: string;
  /** 澄清/未支持提示（不硬拒绝） */
  notice?: string;
  /** W3.1：场景切换意图（由提议事件推导） */
  sceneHint?: SceneIntentHint;
}

const SPEECH_INTENT_TAGS: readonly SpeechIntentTag[] = ['ask', 'compliment', 'say', 'confess', 'probe', 'insult'];

/** LLM 低置信阈值：低于此 → 澄清提示而非硬拒绝/猜测 */
const CLARIFY_THRESHOLD = 0.6;

function buildWorldSummary(world: WorldDefinition) {
  return {
    name: world.name,
    premise: world.premise,
    characters: world.characters.map(c => ({ id: c.id, name: c.name, aliases: c.aliases ?? [] })),
    locations: world.locations.map(l => ({ id: l.id, name: l.name, type: l.type })),
    objects: world.objects.map(o => ({ id: o.id, name: o.name })),
    facts: world.groundTruthFacts.map(f => ({ id: f.id, statement: f.statement })),
    actions: world.actions.map(a => ({ id: a.id, name: a.name, description: a.description })),
  };
}

/** 投影纪律：只含 actor 自身已知事实 + 各实体位置 + 最近事件（不泄漏他者认知账本） */
function buildStateSummary(world: WorldDefinition, state: WorldStateInstance, actorId: EntityId) {
  return {
    turn: state.clock.turnNumber,
    actor: {
      id: actorId,
      locationId: state.entityStates[actorId]?.currentLocationId,
      knownFactIds: state.epistemics.entityKnownFacts[actorId] ?? [],
    },
    entities: Object.entries(state.entityStates).map(([id, s]) => ({
      id,
      locationId: s.currentLocationId,
    })),
    recentEvents: state.recentEvents.slice(0, 5).map(e => e.description),
  };
}

/** 客户端校验：实体 ID / 动作 ID / 事件形状；非法事件拒绝，不进入内核 */
function validateProposedEvents(world: WorldDefinition, events: unknown[]): KernelEvent[] {
  const charIds = new Set(world.characters.map(c => c.id));
  const locIds = new Set(world.locations.map(l => l.id));
  const objIds = new Set(world.objects.map(o => o.id));
  const entityIds = new Set([...charIds, ...locIds, ...objIds]);
  const actionIds = new Set(world.actions.map(a => a.id));

  const valid: KernelEvent[] = [];
  for (const raw of events) {
    const ev = raw as Record<string, unknown>;
    if (!ev || typeof ev !== 'object') continue;
    switch (ev.type) {
      case 'action': {
        const actionId = ev.actionId;
        const actorId = ev.actorId;
        const targetIds = ev.targetIds;
        if (
          typeof actionId === 'string' &&
          actionIds.has(actionId) &&
          typeof actorId === 'string' &&
          entityIds.has(actorId) &&
          Array.isArray(targetIds) &&
          targetIds.every(t => typeof t === 'string' && entityIds.has(t))
        ) {
          valid.push({
            type: 'action',
            actionId,
            actorId,
            targetIds,
            params: ev.params as Record<string, unknown> | undefined,
          });
        }
        break;
      }
      case 'speech_act': {
        const actorId = ev.actorId;
        const targetIds = ev.targetIds;
        const utterance = ev.utterance;
        const intentTag = ev.intentTag;
        if (
          typeof actorId === 'string' &&
          entityIds.has(actorId) &&
          Array.isArray(targetIds) &&
          targetIds.every(t => typeof t === 'string' && entityIds.has(t)) &&
          typeof utterance === 'string' &&
          utterance.length > 0 &&
          typeof intentTag === 'string' &&
          (SPEECH_INTENT_TAGS as readonly string[]).includes(intentTag)
        ) {
          valid.push({
            type: 'speech_act',
            actorId,
            targetIds,
            utterance,
            intentTag: intentTag as SpeechIntentTag,
            topic: typeof ev.topic === 'string' ? ev.topic : undefined,
          });
        }
        break;
      }
      case 'reveal_fact':
        // 玩家提议路径不写入 reveal_fact（导演通道专用；内核为最终门）
        break;
      default:
        break;
    }
  }
  return valid;
}

/** 由提议事件推导场景意图（W3.1 接线：speech_act→conversation / travel→exploration / inspect→exploration） */
function sceneHintFromEvents(events: KernelEvent[]): SceneIntentHint | undefined {
  for (const ev of events) {
    if (ev.type === 'speech_act') return { type: 'talk', targetId: ev.targetIds[0] };
    if (ev.type === 'action') {
      if (ev.actionId.includes('travel')) return { type: 'travel', targetId: ev.targetIds[0] };
      if (ev.actionId.includes('inspect')) return { type: 'inspect' };
    }
  }
  return undefined;
}

function toDeterministic(r: ResolvedKernelAction): ProposedAction {
  return {
    events: r.events,
    confidence: r.confidence,
    source: 'deterministic',
    resolution: r.resolution,
    sceneHint: r.sceneHint,
  };
}

/**
 * LLM 提议为主通道；确定性解析器为回退/测试路径（共享同一 resolve→validate→apply 接口）。
 * 流程：
 *   1. procedural → 确定性回退（无网络）。
 *   2. 尝试 LLM 提议（/api/propose-events）。
 *   3. 低置信 → clarify（不产生事件，提示澄清而非硬拒绝）。
 *   4. 客户端校验候选事件（实体/动作 ID）；全部非法 → 落入确定性回退。
 *   5. LLM 不可用 / 解析失败 → 确定性回退（体验永不硬阻塞）。
 */
export async function proposeUserEvents(
  text: string,
  world: WorldDefinition,
  state: WorldStateInstance,
  actorId: EntityId,
  opts: { provider: AIProviderId; fallback: typeof resolveUserAction }
): Promise<ProposedAction> {
  if (opts.provider === 'procedural') {
    return toDeterministic(opts.fallback(text, world, actorId, state));
  }

  const targetConfig = AI_PROVIDERS.find(p => p.id === opts.provider) || AI_PROVIDERS[0];

  try {
    const res = await fetch('/api/propose-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: text,
        worldSummary: buildWorldSummary(world),
        stateSummary: buildStateSummary(world, state, actorId),
        provider: opts.provider === 'auto' ? 'auto' : targetConfig.provider,
        model: targetConfig.model,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && Array.isArray(data.events) && typeof data.confidence === 'number') {
        if (data.confidence < CLARIFY_THRESHOLD) {
          return {
            events: [],
            confidence: data.confidence,
            source: 'clarify',
            resolution: typeof data.resolution === 'string' ? data.resolution : '意图不够明确',
            notice: '意图不够明确——请说得更具体一些（例如对谁说、做什么、去哪里）。',
          };
        }
        const validated = validateProposedEvents(world, data.events);
        if (validated.length > 0) {
          return {
            events: validated,
            confidence: data.confidence,
            source: 'llm',
            resolution: typeof data.resolution === 'string' ? data.resolution : 'LLM 提议',
            sceneHint: sceneHintFromEvents(validated),
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Propose] LLM 提议不可用，回退确定性解析:', err);
  }

  return toDeterministic(opts.fallback(text, world, actorId, state));
}
