/**
 * HEADCONAN P0 — 事件内核（最小可用版）
 *
 * P0 目标（NEXT_BUILD.md §6 / RECOMMENDATION.md §9）：
 *   让「玩家自然语言动作 → 确定性事件 → 世界真实变化 → 可检查」成立。
 *
 * 本文件是垂直切片的核心，承担三大承诺的最小共同分母：
 *   - 可感知后果：状态真的变化（不只叙事文字）。
 *   - 信息不对称：认知只经观察副作用写入；`requires_knowledge` 被强制（修复 E1 发现的泄漏）。
 *   - 事件驱动：所有变化经 `applyEvent`，事件日志可重放。
 *
 * P0 诚实声明：
 *   - 规则按事件类型内联（speech_act / confront_secret / reveal_fact），非数据驱动——这是切片，不是完整引擎。
 *   - 前提实现 3/7 类（co_presence / capability / knowledge）；其余 4 类（location / resource / authority / min_trust）标记 TODO。
 *   - NPC 反应是确定性模板（基于角色状态），非 LLM 决策——后续由代理层接管。
 *   - 全确定性：无 Date.now() / Math.random()；事件 ID 由 turn+seq 派生，可重放。
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { WorldStateInstance } from '../representation/types/state';
import type { SimulationEvent } from '../representation/types/dynamics';
import type { EntityId, FactId } from '../representation/types/primitives';
import { applyStateEffect } from './instantiate';
import type { StateEffect } from '../representation/types/dynamics';

// ---------------------------------------------------------------------------
// 事件类型（P0 最小集）
// ---------------------------------------------------------------------------

export type SpeechIntentTag = 'ask' | 'compliment' | 'say' | 'confess';

export type KernelEvent =
  | {
      type: 'speech_act';
      actorId: EntityId;
      targetIds: EntityId[];
      utterance: string;
      intentTag: SpeechIntentTag;
      topic?: string;
    }
  | {
      type: 'confront_secret';
      actorId: EntityId;
      targetId: EntityId;
      secretFactId: FactId;
      /** 主持人/全知权限：豁免 requires_knowledge（仍记录日志） */
      authority?: boolean;
    }
  | {
      type: 'reveal_fact';
      actorId?: EntityId;
      targetId: EntityId;
      factId: FactId;
      source: 'host' | 'observation' | 'discovery';
    };

export interface ObservationRecord {
  observerId: EntityId;
  factIdsRevealed: FactId[];
  /** 听到的话语（含 NPC 回应），供叙事/关系摘要使用 */
  utteranceHeard?: string;
  turn: number;
}

export interface ApplyResult {
  nextState: WorldStateInstance;
  spawnedEvents: KernelEvent[];
  observations: ObservationRecord[];
  rejected?: boolean;
  reason?: string;
}

// ---------------------------------------------------------------------------
// 确定性小工具
// ---------------------------------------------------------------------------

function isCoPresent(state: WorldStateInstance, a: EntityId, b: EntityId): boolean {
  const sa = state.entityStates[a];
  const sb = state.entityStates[b];
  return !!sa && !!sb && sa.currentLocationId === sb.currentLocationId;
}

function coPresentEntities(state: WorldStateInstance, at: EntityId): EntityId[] {
  const loc = state.entityStates[at]?.currentLocationId;
  if (!loc) return [];
  return Object.entries(state.entityStates)
    .filter(([id, s]) => id !== at && s.currentLocationId === loc)
    .map(([id]) => id);
}

function pushKnownFact(state: WorldStateInstance, entityId: EntityId, factId: FactId): boolean {
  const list = (state.epistemics.entityKnownFacts[entityId] ??= []);
  if (!list.includes(factId)) {
    list.push(factId);
    return true;
  }
  return false;
}

/** 确定性事件 ID：turn + 日志序，可重放 */
function makeEventId(state: WorldStateInstance, type: string): string {
  return `evt:${state.clock.turnNumber}:${state.eventChronicleLog.length}:${type}`;
}

function toLogEntry(state: WorldStateInstance, type: string, desc: string, initiator?: EntityId, affected: EntityId[] = [], rejected = false, reason?: string): SimulationEvent {
  return {
    id: makeEventId(state, type),
    turnOccurred: state.clock.turnNumber,
    timestampStr: `Turn ${state.clock.turnNumber}`,
    title: rejected ? `[rejected] ${type}` : type,
    category: type === 'confront_secret' ? 'crime' : type === 'reveal_fact' ? 'discovery' : 'social_shift',
    description: rejected ? `REJECTED: ${reason ?? '前提不满足'}` : desc,
    initiatorEntityId: initiator,
    affectedEntityIds: affected,
    publicKnowledgeLevel: 'witnesses_only',
  };
}

// ---------------------------------------------------------------------------
// Yor 的确定性反应模板（P0 最小集；后续由代理层接管）
// ---------------------------------------------------------------------------

interface ReactionResult {
  effects: StateEffect[];
  response: string;
}

function yorReaction(event: Extract<KernelEvent, { type: 'speech_act' }>): ReactionResult {
  if (event.intentTag === 'ask' && event.topic === 'last night') {
    return {
      effects: [
        {
          targetDomain: 'entity',
          targetId: 'char:p0:yor_forger',
          mutationType: 'set',
          fieldKey: 'emotionalState',
          payload: '警觉（cover 反应）',
          narrativeDescription: 'Yor 神色微变，随即恢复。',
        },
      ],
      response: '去市政厅加班了，别担心。（她垂下目光，指尖无意识地摩挲茶杯边缘）',
    };
  }
  if (event.intentTag === 'compliment') {
    return {
      effects: [
        {
          targetDomain: 'entity',
          targetId: 'char:p0:yor_forger',
          mutationType: 'set',
          fieldKey: 'emotionalState',
          payload: '温暖而意外',
          narrativeDescription: 'Yor 有些不好意思地笑了。',
        },
      ],
      response: '谢谢你，洛德……（她似乎不太习惯被夸奖）',
    };
  }
  return {
    effects: [],
    response: '嗯？怎么了？（她停下动作，看着你）',
  };
}

function applyDynamicAttributeIncrement(state: WorldStateInstance, entityId: EntityId, key: string, delta: number): void {
  const es = state.entityStates[entityId];
  if (!es) return;
  es.dynamicAttributes[key] = (es.dynamicAttributes[key] ?? 0) + delta;
}

// ---------------------------------------------------------------------------
// 内核主体：applyEvent
// ---------------------------------------------------------------------------

export function applyEvent(
  world: WorldDefinition,
  state: WorldStateInstance,
  event: KernelEvent
): ApplyResult {
  const next: WorldStateInstance = structuredClone(state);
  const observations: ObservationRecord[] = [];
  const spawnedEvents: KernelEvent[] = [];

  // 1. 按事件类型执行（P0 内联规则集）
  switch (event.type) {
    case 'speech_act': {
      // 前提：actor 与所有 target 共现
      for (const targetId of event.targetIds) {
        if (!isCoPresent(next, event.actorId, targetId)) {
          return reject(next, event, `共现前提不满足：${event.actorId} 与 ${targetId} 不在同一地点。`);
        }
      }

      // 效果 1：对话对关系的影响（确定性意图增量）
      const intentDelta: Record<SpeechIntentTag, number> = { ask: 1, say: 1, compliment: 3, confess: 5 };
      const relId = 'rel:p0:loid_yor_marriage';
      const rel = next.relationshipStates[relId];
      if (rel && event.targetIds.includes('char:p0:yor_forger')) {
        rel.currentAffinity = Math.max(-100, Math.min(100, rel.currentAffinity + intentDelta[event.intentTag]));
      }

      // 效果 2：Yor 的确定性反应（仅当目标是 Yor）
      if (event.targetIds.includes('char:p0:yor_forger')) {
        const reaction = yorReaction(event);
        for (const eff of reaction.effects) {
          applyStateEffect(next, eff);
        }
        // 「昨晚去哪」追问 → Loid 的怀疑上升（可感知的状态变化）
        if (event.intentTag === 'ask' && event.topic === 'last night') {
          applyDynamicAttributeIncrement(next, 'char:p0:loid_forger', 'suspicionOfYor', 2);
        }
        // 观察：玩家听到 Yor 的回应（写入认知的旁证，不写入真相）
        observations.push({
          observerId: event.actorId,
          factIdsRevealed: [],
          utteranceHeard: `Yor回应: "${reaction.response}"`,
          turn: next.clock.turnNumber,
        });
      }

      // 观察副作用：在场者听到话语（含 Anya——她听到的与 Loid 相同，但她知道更多）
      const witnesses = coPresentEntities(next, event.actorId);
      for (const w of witnesses) {
        observations.push({
          observerId: w,
          factIdsRevealed: [],
          utteranceHeard: `${event.actorId} 说: "${event.utterance}"`,
          turn: next.clock.turnNumber,
        });
      }
      break;
    }

    case 'confront_secret': {
      // 前提 1：共现
      if (!isCoPresent(next, event.actorId, event.targetId)) {
        return reject(next, event, `共现前提不满足：${event.actorId} 与 ${event.targetId} 不在同一地点。`);
      }
      // 前提 2：知识（E1 修复——不知情不能摊牌；主持人可用 authority 豁免）
      const knows = next.epistemics.entityKnownFacts[event.actorId]?.includes(event.secretFactId) ?? false;
      if (!knows && !event.authority) {
        const fact = world.groundTruthFacts.find(f => f.id === event.secretFactId);
        return reject(
          next,
          event,
          `知识前提不满足：${event.actorId} 不知道「${fact?.statement ?? event.secretFactId}」（可见域 ${fact?.visibilityScope ?? '未知'}，未对你开放）。`
        );
      }

      // 效果：摊牌对关系与情绪的破坏
      const rel = next.relationshipStates['rel:p0:loid_yor_marriage'];
      if (rel) {
        rel.currentAffinity = Math.max(-100, rel.currentAffinity - 30);
        rel.currentTrust = Math.max(0, rel.currentTrust - 25);
        rel.recentInteractionsSummary = '一场摊牌发生在这个家里。';
      }
      const targetState = next.entityStates[event.targetId];
      if (targetState) {
        targetState.emotionalState = '惊骇、绝望、准备逃离';
      }
      // 暴露副作用：在场者（若在场）得知秘密 → 写入认知账本
      for (const w of coPresentEntities(next, event.actorId)) {
        if (pushKnownFact(next, w, event.secretFactId)) {
          observations.push({ observerId: w, factIdsRevealed: [event.secretFactId], turn: next.clock.turnNumber });
        }
      }
      // 级联：被摊牌者考虑逃离（排队事件，P0 立即入队返回，无调度器）
      spawnedEvents.push({
        type: 'reveal_fact',
        actorId: event.actorId,
        targetId: event.targetId,
        factId: event.secretFactId,
        source: 'observation',
      });
      break;
    }

    case 'reveal_fact': {
      // 主持人/发现注入：把事实写入目标认知账本（唯一的知识写入通道之一）
      if (pushKnownFact(next, event.targetId, event.factId)) {
        observations.push({ observerId: event.targetId, factIdsRevealed: [event.factId], turn: next.clock.turnNumber });
      }
      break;
    }

    default: {
      const never: never = event;
      return reject(next, never as KernelEvent, `未知事件类型。`);
    }
  }

  // 2. 时钟推进（仅成功的事件）
  next.clock.turnNumber += 1;

  // 3. 日志追加（确定性 ID）
  const desc = buildDescription(event);
  const logEntry = toLogEntry(next, event.type, desc, event.actorId, collectAffected(event));
  next.eventChronicleLog.push(logEntry);
  next.recentEvents = [logEntry, ...next.recentEvents].slice(0, 10);

  // 4. 情境摘要（确定性、非 LLM）
  next.currentSituationNarrative = `Turn ${next.clock.turnNumber}: ${logEntry.description}`;

  return { nextState: next, spawnedEvents, observations };
}

// ---------------------------------------------------------------------------
// 拒绝路径
// ---------------------------------------------------------------------------

function reject(state: WorldStateInstance, event: KernelEvent, reason: string): ApplyResult {
  const logEntry = toLogEntry(state, event.type, '', event.actorId, collectAffected(event), true, reason);
  state.eventChronicleLog.push(logEntry);
  state.recentEvents = [logEntry, ...state.recentEvents].slice(0, 10);
  state.currentSituationNarrative = `Turn ${state.clock.turnNumber}: 尝试 ${event.type} 被拒绝——${reason}`;
  return { nextState: state, spawnedEvents: [], observations: [], rejected: true, reason };
}

// ---------------------------------------------------------------------------
// 日志辅助
// ---------------------------------------------------------------------------

function collectAffected(event: KernelEvent): EntityId[] {
  switch (event.type) {
    case 'speech_act':
      return event.targetIds;
    case 'confront_secret':
      return [event.targetId];
    case 'reveal_fact':
      return [event.targetId];
  }
}

function buildDescription(event: KernelEvent): string {
  switch (event.type) {
    case 'speech_act':
      return `${event.actorId} 对 ${event.targetIds.join(', ')} 说: "${event.utterance}"（意图: ${event.intentTag}${event.topic ? ` / 话题: ${event.topic}` : ''}）`;
    case 'confront_secret':
      return `${event.actorId} 就秘密 ${event.secretFactId} 向 ${event.targetId} 摊牌。`;
    case 'reveal_fact':
      return `事实 ${event.factId} 注入 ${event.targetId} 的认知（来源: ${event.source}）。`;
  }
}

/** TODO（P2 完整内核）：requires_location / requires_resource / requires_authority / requires_min_trust */
export const UNIMPLEMENTED_PRECONDITIONS = [
  'requires_location',
  'requires_resource',
  'requires_authority',
  'requires_min_trust',
] as const;
