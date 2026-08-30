/**
 * HEADCONAN — 持久化 round-trip（W2.4）测试
 *
 * 覆盖 docs/W2_REST_PLAN.md §3 W2.4 退出门：
 *   恢复后调度事件仍在；续跑不重复、不丢失（验收 A7 落点）。
 *
 * 验证：
 *   1. scheduler（queue/budgetPerTurn/seed/nextSeq）为纯数据，随快照序列化不丢。
 *   2. 序列化→恢复→续跑：once 事件恰好触发一次（不重、不丢），时钟/seed 保持。
 *   3. 拒绝即事件的重试簿记（attempts/dueTurn）跨 round-trip 保持，续跑不重不漏。
 */

import { describe, it, expect } from 'vitest';
import { instantiate } from './instantiate';
import { applyEvent, tickScheduler, type KernelOptions } from './kernel2';
import { enqueueScheduled } from './scheduler';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../spyFamily/spyFamilyMin';
import { spyFamilyRelationResolver, spyFamilyRoleOf, spyFamilyReaction } from '../spyFamily/spyFamilyReactions';

const KERNEL_OPTS: KernelOptions = {
  relationResolver: spyFamilyRelationResolver,
  roleOf: spyFamilyRoleOf,
  reactions: spyFamilyReaction,
};

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

function roundTrip<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

describe('W2.4 持久化：scheduler 为纯数据，随快照序列化', () => {
  it('round-trip 后 scheduler 状态与入队事件完整保留（queue/seed/nextSeq/budget）', () => {
    const s = breakfastState();
    enqueueScheduled(s, {
      actionId: 'act:spyf:miss_parent_meeting',
      actorId: SPYF.loid,
      targetIds: [],
      dueTurn: 3,
      narrativeLabel: '家长会',
    });

    const restored = roundTrip(s);
    expect(restored.scheduler).toEqual(s.scheduler);
    expect(restored.scheduler.seed).toBe(s.scheduler.seed);
    expect(restored.scheduler.nextSeq).toBe(1);
    expect(restored.scheduler.queue).toHaveLength(1);
    expect(restored.scheduler.queue[0]).toEqual(s.scheduler.queue[0]);
    expect(restored.clock).toEqual(s.clock);
  });
});

describe('W2.4 持久化：恢复后续跑不重不丢', () => {
  it('once 延迟事件跨 round-trip 后恰好触发一次', () => {
    // 未序列化基线：fresh → turn 2 → tick
    const base = breakfastState();
    enqueueScheduled(base, {
      actionId: 'act:spyf:miss_parent_meeting',
      actorId: SPYF.loid,
      targetIds: [],
      dueTurn: 2,
      narrativeLabel: '家长会',
    });
    base.clock.turnNumber = 2;
    const baseline = tickScheduler(base, SPY_FAMILY_MIN, KERNEL_OPTS);

    // 序列化→恢复→同一续跑路径
    const fresh = breakfastState();
    enqueueScheduled(fresh, {
      actionId: 'act:spyf:miss_parent_meeting',
      actorId: SPYF.loid,
      targetIds: [],
      dueTurn: 2,
      narrativeLabel: '家长会',
    });
    const restored = roundTrip(fresh);
    restored.clock.turnNumber = 2;
    const cont = tickScheduler(restored, SPY_FAMILY_MIN, KERNEL_OPTS);

    // 恰好触发一次，未被拒绝
    expect(cont.executed).toHaveLength(1);
    expect(cont.executed[0].rejected).toBeFalsy();
    // 队列清空（once 移除）
    expect(cont.nextState.scheduler.queue).toHaveLength(0);
    // 终态与未序列化基线完全一致（重放确定性 + round-trip 无损）
    expect(JSON.parse(JSON.stringify(cont.nextState))).toEqual(JSON.parse(JSON.stringify(baseline.nextState)));
    // 时钟保持推进（成功事件 +1）
    expect(cont.nextState.clock.turnNumber).toBe(3);
  });

  it('拒绝即事件的重试簿记跨 round-trip 保持，耗尽后移除不重放', () => {
    const s = breakfastState(); // Loid 在起居室，不在走廊
    enqueueScheduled(s, {
      actionId: 'act:spyf:inspect_pen', // requires_location corridor
      actorId: SPYF.loid,
      targetIds: [SPYF.pen],
      dueTurn: 1,
      maxAttempts: 2,
    });

    // 第 1 次 tick：拒绝，attempts 0→1，顺延下一 turn
    const r1 = tickScheduler(s, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r1.executed[0].rejected).toBe(true);
    expect(r1.nextState.scheduler.queue[0].attempts).toBe(1);

    // 序列化→恢复：重试簿记仍在
    const restored = roundTrip(r1.nextState);
    expect(restored.scheduler.queue).toHaveLength(1);
    expect(restored.scheduler.queue[0].attempts).toBe(1);
    expect(restored.scheduler.queue[0].dueTurn).toBe(2);

    // 续跑：第 2 次仍拒绝，attempts 达上限 → 移除，不再重试
    restored.clock.turnNumber = 2;
    const r2 = tickScheduler(restored, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r2.executed).toHaveLength(1);
    expect(r2.executed[0].rejected).toBe(true);
    expect(r2.nextState.scheduler.queue).toHaveLength(0);
    // 该动作只入日志两次（拒绝即事件各记一次），无重复触发
    const rejectedLogs = r2.nextState.eventChronicleLog.filter(e => e.title.includes('[rejected]'));
    expect(rejectedLogs).toHaveLength(2);
  });
});

describe('W2.4 持久化：seed 确定性跨 round-trip 保持', () => {
  it('rollChance 消耗的 seed 状态经 round-trip 后保持，续跑结果一致', () => {
    // 触发一次概率级联（消耗 seed）后序列化，对比未序列化的同路径
    const s = breakfastState();
    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'action',
      actionId: 'act:spyf:miss_parent_meeting',
      actorId: SPYF.loid,
      targetIds: [],
    }, KERNEL_OPTS);
    const seedAfter = r.nextState.scheduler.seed;

    const restored = roundTrip(r.nextState);
    expect(restored.scheduler.seed).toBe(seedAfter);
    // 同 seed + 同状态 → 续跑路径终态一致
    const a = tickScheduler(r.nextState, SPY_FAMILY_MIN, KERNEL_OPTS);
    const b = tickScheduler(restored, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(JSON.parse(JSON.stringify(a.nextState))).toEqual(JSON.parse(JSON.stringify(b.nextState)));
  });
});
