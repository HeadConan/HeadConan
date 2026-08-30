/**
 * HEADCONAN RUNTIME — 定义驱动内核（W1，进取版 V1.1）
 *
 * 设计（docs/EXECUTION_PLAN.md §3 W1/W2）：
 *   - 事件按 `WorldActionDefinition` 数据驱动分发（前提/效果/级联从定义读取），
 *     不再硬编码实体 ID（修复 P0 内核 `kernel.ts` 的核心缺陷）。
 *   - 7 类前提全部确定性判定；拒绝即事件（日志可查）。
 *   - LLM 只提议，本内核只写入（ADR-008）；确定性路径保证测试与重放稳定。
 *   - NPC 语音反应通过 ReactionEngine 注入：W1 为确定性脚本（spyFamilyReactions.ts），
 *     W3 由代理循环接管，接口不变。
 *
 * 占位符解析（效果/负载）：
 *   - effect.targetId / effect.payload 中 `$actor` → actorId，`$target` → targetIds[0]。
 *
 * 前提语义（targetKey 契约）：
 *   - requires_location   targetKey='actor.currentLocationId'|'target.currentLocationId'，expectedValue=LocationId
 *   - requires_co_presence actor 与全部 target 同地点；expectedValue 若为 LocationId 则额外限定地点
 *   - requires_capability  expectedValue=capability id（查定义 characters.capabilities）
 *   - requires_knowledge   expectedValue=FactId（查 state.epistemics.entityKnownFacts[actor]）
 *   - requires_resource    targetKey=资源池 id，expectedValue=最低数量
 *   - requires_authority   expectedValue=social permission（查定义 characters.socialPermissions）
 *   - requires_min_trust   targetKey=关系 id，expectedValue=最低 trust
 */

import type { WorldDefinition } from '../representation/types/definition';
import type { WorldStateInstance } from '../representation/types/state';
import type { SimulationEvent, StateEffect } from '../representation/types/dynamics';
import type { EntityId, FactId, ActionId } from '../representation/types/primitives';
import { applyStateEffect } from './instantiate';
import { enqueueScheduled, dueEvents, rollChance, type EnqueueInput } from './scheduler';

// ---------------------------------------------------------------------------
// 事件类型（W1 最小集：action / speech_act / reveal_fact）
// ---------------------------------------------------------------------------

export type SpeechIntentTag = 'ask' | 'compliment' | 'say' | 'confess' | 'probe' | 'insult';

export type KernelEvent =
  | {
      type: 'action';
      actionId: ActionId;
      actorId: EntityId;
      targetIds: EntityId[];
      params?: Record<string, unknown>;
    }
  | {
      type: 'speech_act';
      actorId: EntityId;
      targetIds: EntityId[];
      utterance: string;
      intentTag: SpeechIntentTag;
      topic?: string;
    }
  | {
      type: 'reveal_fact';
      actorId?: EntityId;
      targetId: EntityId;
      factId: FactId;
      source: 'host' | 'observation' | 'discovery';
    };

export interface ResponseLine {
  from: EntityId;
  text: string;
}

export interface ObservationRecord {
  observerId: EntityId;
  factIdsRevealed: FactId[];
  utteranceHeard?: string;
  turn: number;
}

export interface ApplyResult {
  nextState: WorldStateInstance;
  spawnedEvents: KernelEvent[];
  observations: ObservationRecord[];
  responses: ResponseLine[];
  rejected?: boolean;
  reason?: string;
}

// ---------------------------------------------------------------------------
// 反应引擎（W1 确定性脚本；W3 由代理循环接管）
// ---------------------------------------------------------------------------

export interface ReactionContext {
  world: WorldDefinition;
  state: WorldStateInstance;
  event: Extract<KernelEvent, { type: 'speech_act' }>;
}

export interface SpeechReaction {
  effects: StateEffect[];
  response: string;
}

export type ReactionEngine = (ctx: ReactionContext) => SpeechReaction;

export interface KernelOptions {
  /** actor→target 的关系解析；缺省则不应用对话意图的关系增量 */
  relationResolver?: (actor: EntityId, target: EntityId) => string | undefined;
  /** entityId → roles；用于 actorEligibilityRoles 判定；缺省 = 放行 */
  roleOf?: (entityId: EntityId) => string[];
  /** 语音反应引擎；缺省 = 无反应 */
  reactions?: ReactionEngine;
  /** 观察闭环：speech_act 公开话语披露时，判定该话语披露了哪些事实（W2 确定性；W3 由代理循环判定） */
  discloseFactResolver?: (world: WorldDefinition, event: Extract<KernelEvent, { type: 'speech_act' }>) => FactId[];
}

/** 对话意图对关系的确定性增量（对话的"物理"） */
const INTENT_RELATION_DELTA: Record<SpeechIntentTag, number> = {
  ask: 1,
  say: 1,
  compliment: 3,
  confess: 5,
  probe: 1,
  insult: -4,
};

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

/**
 * 观察闭环：事实在披露现场公开后，向共现实体广播（受 visibilityScope 约束）。
 * - cosmic_truth 不传播（无人可知）；其余类型仅在披露现场传播给在场见证者。
 * - 已持有者（pushKnownFact 幂等）与现场实体（coPresentEntities 排除）不重复广播。
 * 返回新增的观察记录。
 */
function propagateFactToCoPresent(
  world: WorldDefinition,
  state: WorldStateInstance,
  factId: FactId,
  atEntityId: EntityId
): ObservationRecord[] {
  const fact = world.groundTruthFacts.find(f => f.id === factId);
  if (!fact || fact.visibilityScope === 'cosmic_truth') return [];
  const records: ObservationRecord[] = [];
  for (const w of coPresentEntities(state, atEntityId)) {
    if (pushKnownFact(state, w, factId)) {
      records.push({ observerId: w, factIdsRevealed: [factId], turn: state.clock.turnNumber });
    }
  }
  return records;
}

function makeEventId(state: WorldStateInstance, type: string): string {
  return `evt:${state.clock.turnNumber}:${state.eventChronicleLog.length}:${type}`;
}

function toLogEntry(
  state: WorldStateInstance,
  type: string,
  desc: string,
  initiator?: EntityId,
  affected: EntityId[] = [],
  rejected = false,
  reason?: string
): SimulationEvent {
  return {
    id: makeEventId(state, type),
    turnOccurred: state.clock.turnNumber,
    timestampStr: `Turn ${state.clock.turnNumber}`,
    title: rejected ? `[rejected] ${type}` : type,
    category: type === 'speech_act' ? 'social_shift' : type === 'reveal_fact' ? 'discovery' : 'social_shift',
    description: rejected ? `REJECTED: ${reason ?? '前提不满足'}` : desc,
    initiatorEntityId: initiator,
    affectedEntityIds: affected,
    publicKnowledgeLevel: 'witnesses_only',
  };
}

/** 占位符解析：`$actor` / `$target` 仅出现在 effect 的 targetId 与 payload 中 */
function resolveToken(token: string, actorId: EntityId, targetIds: EntityId[]): string {
  if (token === '$actor') return actorId;
  if (token === '$target') return targetIds[0] ?? actorId;
  return token;
}

function appendLog(state: WorldStateInstance, entry: SimulationEvent): void {
  state.eventChronicleLog.push(entry);
  state.recentEvents = [entry, ...state.recentEvents].slice(0, 10);
  state.currentSituationNarrative = `Turn ${state.clock.turnNumber}: ${entry.description}`;
}

// ---------------------------------------------------------------------------
// 前提判定（7 类，全部确定性）
// ---------------------------------------------------------------------------

function checkPrecondition(
  world: WorldDefinition,
  state: WorldStateInstance,
  p: { type: string; targetKey: string; expectedValue: unknown; failureMessage: string },
  actorId: EntityId,
  targetIds: EntityId[]
): { ok: boolean; message?: string } {
  const actor = state.entityStates[actorId];
  const target = state.entityStates[targetIds[0]];
  const character = world.characters.find(c => c.id === actorId);
  const fail = () => ({ ok: false, message: p.failureMessage });

  switch (p.type) {
    case 'requires_location': {
      const which = p.targetKey.includes('target.') ? target : actor;
      if (!which) return fail();
      return which.currentLocationId === p.expectedValue ? { ok: true } : fail();
    }
    case 'requires_co_presence': {
      for (const t of targetIds) {
        if (!isCoPresent(state, actorId, t)) return fail();
      }
      // expectedValue 为空串 = 不限地点；否则额外限定为某地点
      if (typeof p.expectedValue === 'string' && p.expectedValue.length > 0 && actor && actor.currentLocationId !== p.expectedValue) {
        return fail();
      }
      return { ok: true };
    }
    case 'requires_capability':
      return character?.capabilities.includes(p.expectedValue as string) ? { ok: true } : fail();
    case 'requires_knowledge': {
      const known = state.epistemics.entityKnownFacts[actorId]?.includes(p.expectedValue as FactId) ?? false;
      return known ? { ok: true } : fail();
    }
    case 'requires_resource': {
      const pool = state.resourcePools[p.targetKey];
      return typeof pool === 'number' && pool >= (p.expectedValue as number) ? { ok: true } : fail();
    }
    case 'requires_authority':
      return character?.socialPermissions.includes(p.expectedValue as string) ? { ok: true } : fail();
    case 'requires_min_trust': {
      const rel = state.relationshipStates[p.targetKey];
      return rel && rel.currentTrust >= (p.expectedValue as number) ? { ok: true } : fail();
    }
    default:
      return { ok: false, message: `未知前提类型：${p.type}` };
  }
}

// ---------------------------------------------------------------------------
// 效果应用（占位符解析 + 复用 instantiate.applyStateEffect）
// ---------------------------------------------------------------------------

function applyEffects(state: WorldStateInstance, effects: StateEffect[], actorId: EntityId, targetIds: EntityId[]): void {
  for (const eff of effects) {
    applyStateEffect(state, {
      ...eff,
      targetId: resolveToken(eff.targetId, actorId, targetIds),
      payload: typeof eff.payload === 'string' ? resolveToken(eff.payload, actorId, targetIds) : eff.payload,
    });
  }
}

// ---------------------------------------------------------------------------
// 事件分发
// ---------------------------------------------------------------------------

export function applyEvent(
  world: WorldDefinition,
  state: WorldStateInstance,
  event: KernelEvent,
  opts: KernelOptions = {}
): ApplyResult {
  const next: WorldStateInstance = structuredClone(state);
  const observations: ObservationRecord[] = [];
  const responses: ResponseLine[] = [];
  const spawnedEvents: KernelEvent[] = [];

  const fail = (reason: string): ApplyResult => {
    const initiator = event.actorId ?? (event.type === 'reveal_fact' ? event.targetId : undefined);
    appendLog(next, toLogEntry(next, event.type, '', initiator, collectAffected(event), true, reason));
    return { nextState: next, spawnedEvents: [], observations, responses, rejected: true, reason };
  };

  switch (event.type) {
    case 'action': {
      const def = world.actions.find(a => a.id === event.actionId);
      if (!def) return fail(`未定义动作：${event.actionId}`);

      // 资格：角色匹配（仅当提供了 roleOf 且定义声明了角色时强制）
      if (opts.roleOf && def.actorEligibilityRoles.length > 0) {
        const roles = opts.roleOf(event.actorId) ?? [];
        if (!roles.some(r => def.actorEligibilityRoles.includes(r))) {
          return fail(`资格不满足：${entityName(world, event.actorId)} 不具有动作所需的角色（${def.actorEligibilityRoles.join('/')}）。`);
        }
      }

      // 前提：全部满足才执行（首个失败即拒绝）
      for (const p of def.preconditions) {
        const r = checkPrecondition(world, next, p, event.actorId, event.targetIds);
        if (!r.ok) return fail(r.message ?? `前提不满足：${p.type}`);
      }

      // 直接效果
      applyEffects(next, def.directEffects, event.actorId, event.targetIds);

      // 级联：确定性级联（triggerProbability===1）立即应用；
      // 概率级联（0<p<1）用 seed RNG 判定（rollChance 推进 state.scheduler.seed，重放一致）；
      //   命中且有 spawnEvent → 入调度队列（下一 turn 的 once 事件，经内核执行→拒绝即事件）；
      //   命中且仅 secondaryEffects → W2 简化：立即应用（纯效果，延迟不影响正确性）。
      for (const c of def.potentialConsequences ?? []) {
        if (c.triggerProbability >= 1) {
          applyEffects(next, c.secondaryEffects ?? [], event.actorId, event.targetIds);
        } else if (c.triggerProbability > 0) {
          const hit = rollChance(next.scheduler, c.triggerProbability);
          if (hit && c.spawnEvent) {
            const input: EnqueueInput = {
              actionId: c.spawnEvent.title as ActionId,
              actorId: event.actorId,
              targetIds: event.targetIds,
              params: { spawnDescription: c.spawnEvent.description, urgency: c.spawnEvent.urgency },
              dueTurn: next.clock.turnNumber + 1,
              narrativeLabel: c.spawnEvent.title,
            };
            const ev = enqueueScheduled(next, input);
            spawnedEvents.push({
              type: 'action',
              actionId: ev.actionId,
              actorId: ev.actorId,
              targetIds: ev.targetIds,
              params: { scheduledId: ev.id, worldSpawned: true },
            });
          } else if (hit) {
            applyEffects(next, c.secondaryEffects ?? [], event.actorId, event.targetIds);
          }
        }
      }
      break;
    }

    case 'speech_act': {
      for (const targetId of event.targetIds) {
        if (!isCoPresent(next, event.actorId, targetId)) {
          return fail(`共现前提不满足：${entityName(world, event.actorId)} 与 ${entityName(world, targetId)} 不在同一地点。`);
        }
      }

      // 通用关系增量（对每个目标，经 relationResolver 定位关系）
      const delta = INTENT_RELATION_DELTA[event.intentTag] ?? 0;
      for (const targetId of event.targetIds) {
        const relId = opts.relationResolver?.(event.actorId, targetId);
        const rel = relId ? next.relationshipStates[relId] : undefined;
        if (rel) {
          rel.currentAffinity = Math.max(-100, Math.min(100, rel.currentAffinity + delta));
          rel.recentInteractionsSummary = `${event.actorId} 对 ${targetId} 说：${event.utterance}`;
        }
      }

      // 反应引擎（W1 确定性脚本；W3 代理循环）
      const reaction = opts.reactions?.({ world, state: next, event });
      if (reaction) {
        applyEffects(next, reaction.effects, event.actorId, event.targetIds);
        for (const targetId of event.targetIds) {
          responses.push({ from: targetId, text: reaction.response });
        }
        observations.push({
          observerId: event.actorId,
          factIdsRevealed: [],
          utteranceHeard: `${event.targetIds[0] ?? '?'}回应: "${reaction.response}"`,
          turn: next.clock.turnNumber,
        });
      }

      // 观察副作用：在场者听到话语（含 NPC——它们听到的与玩家相同，但各自的投影不同）
      for (const w of coPresentEntities(next, event.actorId)) {
        observations.push({
          observerId: w,
          factIdsRevealed: [],
          utteranceHeard: `${event.actorId} 说: "${event.utterance}"`,
          turn: next.clock.turnNumber,
        });
      }

      // 观察闭环：公开话语披露 → 在场听者认知更新（W2 确定性短语判定；W3 代理循环）
      const disclosed = opts.discloseFactResolver?.(world, event) ?? [];
      for (const factId of disclosed) {
        observations.push(...propagateFactToCoPresent(world, next, factId, event.actorId));
      }
      break;
    }

    case 'reveal_fact': {
      // 唯一的知识写入通道（ADR-005）：把事实写入目标认知账本
      if (pushKnownFact(next, event.targetId, event.factId)) {
        observations.push({
          observerId: event.targetId,
          factIdsRevealed: [event.factId],
          turn: next.clock.turnNumber,
        });
      }
      // 观察闭环：披露现场共现者广播（在场者知道 / 缺席者不知道）
      observations.push(...propagateFactToCoPresent(world, next, event.factId, event.targetId));
      break;
    }

    default: {
      const never: never = event;
      return fail(`未知事件类型：${String((never as { type?: string }).type)}`);
    }
  }

  // 时钟推进（仅成功事件）
  next.clock.turnNumber += 1;

  // 日志追加
  const initiator = event.actorId ?? (event.type === 'reveal_fact' ? event.targetId : undefined);
  appendLog(next, toLogEntry(next, event.type, buildDescription(world, event), initiator, collectAffected(event)));

  return { nextState: next, spawnedEvents, observations, responses };
}

// ---------------------------------------------------------------------------
// 日志辅助
// ---------------------------------------------------------------------------

function collectAffected(event: KernelEvent): EntityId[] {
  switch (event.type) {
    case 'action':
      return event.targetIds;
    case 'speech_act':
      return event.targetIds;
    case 'reveal_fact':
      return [event.targetId];
  }
}

/** 实体 ID → 用户可读名（短中文名）；查无则回退原 ID，避免把内部 ID 泄漏给界面 */
function entityName(world: WorldDefinition, id: string): string {
  const ch = world.characters?.find(c => c.id === id);
  if (ch) return ch.name.split('（')[0].split('·')[0];
  const loc = world.locations?.find(l => l.id === id);
  if (loc) return loc.name;
  return id;
}

function buildDescription(world: WorldDefinition, event: KernelEvent): string {
  switch (event.type) {
    case 'action': {
      const def = world.actions.find(a => a.id === event.actionId);
      return `${entityName(world, event.actorId)} 执行「${def?.name ?? event.actionId}」（目标: ${event.targetIds.map(t => entityName(world, t)).join(', ') || '无'}）`;
    }
    case 'speech_act':
      return `${entityName(world, event.actorId)} 对 ${event.targetIds.map(t => entityName(world, t)).join(', ')} 说: "${event.utterance}"（意图: ${event.intentTag}${event.topic ? ` / 话题: ${event.topic}` : ''}）`;
    case 'reveal_fact': {
      const fact = world.groundTruthFacts.find(f => f.id === event.factId);
      return `事实「${fact?.statement ?? event.factId}」注入 ${entityName(world, event.targetId)} 的认知（来源: ${event.source}）。`;
    }
  }
}

// ---------------------------------------------------------------------------
// 调度器执行（W2）：处理全部已到期事件，受预算上限约束
// ---------------------------------------------------------------------------

export interface TickResult {
  nextState: WorldStateInstance;
  executed: ApplyResult[];
}

/**
 * 推进调度队列：处理 all dueTurn<=当前 turn 的事件（受 budgetPerTurn 约束）。
 * 语义：
 *   - 成功（once）→ 执行并从队列移除；
 *   - 成功（periodic）→ 按 intervalTurns 重排；
 *   - 被内核拒绝 → 记 `[rejected]` 日志（applyEvent 已写），attempts+1，未耗尽则顺延下一 turn 重试；
 *   - 预算超限 → 剩余事件原序放回队列（不丢、不重排）。
 * 纯函数：克隆输入状态，返回 nextState；不影响调用方状态。
 */
export function tickScheduler(
  state: WorldStateInstance,
  world: WorldDefinition,
  opts: KernelOptions = {}
): TickResult {
  let working = structuredClone(state);
  const executed: ApplyResult[] = [];
  let budget = working.scheduler.budgetPerTurn;

  while (budget > 0) {
    const due = dueEvents(working);
    if (due.length === 0) break;

    const overflow: typeof due = [];
    for (const ev of due) {
      if (budget <= 0) {
        overflow.push(ev);
        continue;
      }
      budget -= 1;

      const kernelEv: KernelEvent = {
        type: 'action',
        actionId: ev.actionId,
        actorId: ev.actorId,
        targetIds: ev.targetIds,
        params: ev.params,
      };
      const r = applyEvent(world, working, kernelEv, opts);
      working = r.nextState;
      executed.push(r);

      if (r.rejected) {
        const retriesLeft = ev.attempts + 1 < ev.maxAttempts;
        if (retriesLeft) {
          working.scheduler.queue.unshift({
            ...ev,
            attempts: ev.attempts + 1,
            dueTurn: working.clock.turnNumber + 1,
          });
        }
      } else if (ev.kind === 'periodic') {
        working.scheduler.queue.push({
          ...ev,
          dueTurn: working.clock.turnNumber + ev.intervalTurns,
        });
      }
    }
    if (overflow.length > 0) {
      working.scheduler.queue.unshift(...overflow);
    }
  }

  return { nextState: working, executed };
}
