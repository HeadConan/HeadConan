/**
 * HEADCONAN RUNTIME — 世界自发事件调度器（W2）
 *
 * 目的（docs/W2_PLAN.md §4 W2.1）：让世界在玩家不输入时也有后续。
 *   - 延迟 once / 周期 periodic / 概率级联（seeded RNG）统一经调度队列执行。
 *   - 确定性红线（docs/EXECUTION_PLAN.md §1.3）：seed 持久化于 state.scheduler，
 *     同一 seed + 同一事件序列 → 完全一致的结果；本模块禁用 Math.random。
 *   - 执行（tickScheduler）在 kernel2.ts（可复用 applyEvent 走"拒绝即事件"）。
 *     本模块只提供类型、确定性 RNG、入队，避免与 kernel2 循环依赖。
 */

import type { WorldStateInstance, ScheduledEvent, SchedulerState } from '../representation/types/state';
import type { EntityId, ActionId } from '../representation/types/primitives';

/** mulberry32 seeded RNG（确定性伪随机） */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 确定性概率判定：消耗 scheduler.seed（LCG 推进），返回是否命中 */
export function rollChance(scheduler: SchedulerState, probability: number): boolean {
  const rng = seededRandom(scheduler.seed);
  const v = rng();
  scheduler.seed = (scheduler.seed * 1664525 + 1013904223) >>> 0;
  return v < probability;
}

/** 默认调度器初始状态（固定 seed 保证重放一致） */
export function defaultScheduler(): SchedulerState {
  return { queue: [], budgetPerTurn: 3, seed: 0xc0ffee, nextSeq: 0 };
}

export interface EnqueueInput {
  actionId: ActionId;
  actorId: EntityId;
  targetIds: EntityId[];
  params?: Record<string, unknown>;
  kind?: 'once' | 'periodic';
  dueTurn?: number;          // 缺省 = 当前 turn + 1
  intervalTurns?: number;    // periodic 重排间隔；once 忽略
  maxAttempts?: number;      // 缺省 3
  narrativeLabel?: string;
}

/** 入队（确定性 ID：`sch:{turn}:{seq}:{actionId}`）；直接变更传入状态 */
export function enqueueScheduled(state: WorldStateInstance, input: EnqueueInput): ScheduledEvent {
  const s = state.scheduler;
  const ev: ScheduledEvent = {
    id: `sch:${state.clock.turnNumber}:${s.nextSeq}:${input.actionId}`,
    actionId: input.actionId,
    actorId: input.actorId,
    targetIds: input.targetIds,
    params: input.params,
    kind: input.kind ?? 'once',
    dueTurn: input.dueTurn ?? state.clock.turnNumber + 1,
    intervalTurns: input.kind === 'periodic' ? (input.intervalTurns ?? 1) : 0,
    attempts: 0,
    maxAttempts: input.maxAttempts ?? 3,
    narrativeLabel: input.narrativeLabel ?? input.actionId,
  };
  s.nextSeq += 1;
  s.queue.push(ev);
  return ev;
}

/** 从队列中取出所有已到期（dueTurn <= 当前 turn）的事件 */
export function dueEvents(state: WorldStateInstance): ScheduledEvent[] {
  const turn = state.clock.turnNumber;
  const due = state.scheduler.queue.filter(e => e.dueTurn <= turn);
  state.scheduler.queue = state.scheduler.queue.filter(e => e.dueTurn > turn);
  return due;
}
