/**
 * HEADCONAN — 调度器（W2.1）集成测试
 *
 * 覆盖 docs/W2_PLAN.md §4 W2.1 退出门（5 项）：
 *   once 延迟 / periodic 周期 / 预算上限 / 拒绝即事件（attempts/maxAttempts）/ seed 重放一致
 * 另附 1 项内核→调度器接线：概率级联命中 → 入队 → 下一 turn tick 执行（"世界自己动"闭环）。
 */

import { describe, it, expect } from 'vitest';
import { instantiate } from './instantiate';
import { applyEvent, tickScheduler, type KernelOptions } from './kernel2';
import { enqueueScheduled, seededRandom } from './scheduler';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../spyFamily/spyFamilyMin';
import { spyFamilyRelationResolver, spyFamilyRoleOf, spyFamilyReaction } from '../spyFamily/spyFamilyReactions';
import type { WorldDefinition } from '../representation/types/definition';

const KERNEL_OPTS: KernelOptions = {
  relationResolver: spyFamilyRelationResolver,
  roleOf: spyFamilyRoleOf,
  reactions: spyFamilyReaction,
};

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

describe('W2.1 调度器：once 延迟', () => {
  it('dueTurn 之前不触发，到期当 turn 触发一次后移除', () => {
    const s = breakfastState();
    enqueueScheduled(s, {
      actionId: 'act:spyf:miss_parent_meeting',
      actorId: SPYF.loid,
      targetIds: [],
      kind: 'once',
      dueTurn: 5,
      narrativeLabel: '家长会',
    });
    // 事件 ID 确定性：turn:seq:actionId
    expect(s.scheduler.queue[0].id).toBe('sch:1:0:act:spyf:miss_parent_meeting');

    // turn 1 与 turn 4 均未到期
    expect(tickScheduler(s, SPY_FAMILY_MIN, KERNEL_OPTS).executed).toHaveLength(0);
    s.clock.turnNumber = 4;
    expect(tickScheduler(s, SPY_FAMILY_MIN, KERNEL_OPTS).executed).toHaveLength(0);

    // turn 5 到期 → 执行一次；once 不再重排
    s.clock.turnNumber = 5;
    const r = tickScheduler(s, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r.executed).toHaveLength(1);
    expect(r.executed[0].rejected).toBeFalsy();
    expect(r.nextState.scheduler.queue).toHaveLength(0);
    expect(tickScheduler(r.nextState, SPY_FAMILY_MIN, KERNEL_OPTS).executed).toHaveLength(0);
  });
});

describe('W2.1 调度器：periodic 周期重排', () => {
  it('每 intervalTurns 重排并继续触发', () => {
    const s = breakfastState();
    enqueueScheduled(s, {
      actionId: 'act:spyf:miss_parent_meeting',
      actorId: SPYF.loid,
      targetIds: [],
      kind: 'periodic',
      dueTurn: 1,
      intervalTurns: 2,
      narrativeLabel: '家长会提醒',
    });

    const r1 = tickScheduler(s, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r1.executed).toHaveLength(1);
    // 执行后时钟推进 1 → 重排 dueTurn = 当前 turn + 2
    const requeued = r1.nextState.scheduler.queue[0];
    expect(requeued.kind).toBe('periodic');
    expect(requeued.dueTurn).toBe(4);

    // 未到期不触发
    expect(tickScheduler(r1.nextState, SPY_FAMILY_MIN, KERNEL_OPTS).executed).toHaveLength(0);

    // 到期后再触发一次，仍保留在队列
    r1.nextState.clock.turnNumber = 4;
    const r2 = tickScheduler(r1.nextState, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r2.executed).toHaveLength(1);
    expect(r2.nextState.scheduler.queue).toHaveLength(1);
  });
});

describe('W2.1 调度器：预算上限', () => {
  it('超预算事件本 turn 顺延，不丢不重排', () => {
    const s = breakfastState();
    s.scheduler.budgetPerTurn = 2;
    for (let i = 0; i < 4; i++) {
      enqueueScheduled(s, {
        actionId: 'act:spyf:miss_parent_meeting',
        actorId: SPYF.loid,
        targetIds: [],
        dueTurn: s.clock.turnNumber, // 立即到期
      });
    }

    const r1 = tickScheduler(s, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r1.executed).toHaveLength(2);                    // 预算内执行 2 个
    expect(r1.nextState.scheduler.queue).toHaveLength(2);   // 其余顺延未丢

    // 续跑：剩余 2 个全部执行完
    const r2 = tickScheduler(r1.nextState, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r2.executed).toHaveLength(2);
    expect(r2.nextState.scheduler.queue).toHaveLength(0);
  });
});

describe('W2.1 调度器：拒绝即事件（attempts / maxAttempts）', () => {
  it('前提不满足 → 记 [rejected]，attempts+1 顺延重试，耗尽移除', () => {
    const s = breakfastState(); // Loid 在起居室，不在走廊
    enqueueScheduled(s, {
      actionId: 'act:spyf:inspect_pen', // requires_location corridor
      actorId: SPYF.loid,
      targetIds: [SPYF.pen],
      dueTurn: 1,
      maxAttempts: 2,
    });

    // 第 1 次：拒绝，attempts 0→1，顺延到下一 turn 重试
    const r1 = tickScheduler(s, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r1.executed).toHaveLength(1);
    expect(r1.executed[0].rejected).toBe(true);
    expect(r1.nextState.eventChronicleLog.at(-1)?.title).toContain('[rejected]');
    expect(r1.nextState.scheduler.queue).toHaveLength(1);
    expect(r1.nextState.scheduler.queue[0].attempts).toBe(1);

    // 第 2 次（仍不在走廊）：拒绝，attempts 达上限 → 移除，不再重试
    const s2 = r1.nextState;
    s2.clock.turnNumber = 2;
    const r2 = tickScheduler(s2, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r2.executed).toHaveLength(1);
    expect(r2.executed[0].rejected).toBe(true);
    expect(r2.nextState.scheduler.queue).toHaveLength(0);
  });

  it('重试前条件满足则成功，不再顺延', () => {
    const s = breakfastState();
    enqueueScheduled(s, {
      actionId: 'act:spyf:inspect_pen',
      actorId: SPYF.loid,
      targetIds: [SPYF.pen],
      dueTurn: 1,
      maxAttempts: 3,
    });
    // 先让 Loid 抵达走廊（行动推进时钟）
    const moved = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'action',
      actionId: 'act:spyf:travel',
      actorId: SPYF.loid,
      targetIds: [SPYF.corridor],
    }, KERNEL_OPTS);
    expect(moved.rejected).toBeFalsy();

    const r = tickScheduler(moved.nextState, SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(r.executed).toHaveLength(1);
    expect(r.executed[0].rejected).toBeFalsy();
    expect(r.nextState.scheduler.queue).toHaveLength(0);
    expect(r.nextState.epistemics.entityKnownFacts[SPYF.loid]?.includes(SPYF.factPenSurveillance)).toBe(true);
  });
});

describe('W2.1 调度器：seed 重放一致', () => {
  it('seeded RNG：同 seed 同序列 → 同结果，且确实在推进', () => {
    const a = seededRandom(0xdeadbeef);
    const b = seededRandom(0xdeadbeef);
    const seqA = [a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
    expect(seqA).not.toEqual([seqA[0], seqA[0], seqA[0], seqA[0]]);
  });

  it('同一初始状态 + 同一调度序列 → 两次 tick 终态一致', () => {
    function makeState() {
      const s = breakfastState();
      s.scheduler.seed = 0x1234abcd;
      enqueueScheduled(s, {
        actionId: 'act:spyf:miss_parent_meeting',
        actorId: SPYF.loid,
        targetIds: [],
        kind: 'periodic',
        dueTurn: 1,
        intervalTurns: 2,
        narrativeLabel: '家长会提醒',
      });
      enqueueScheduled(s, {
        actionId: 'act:spyf:inspect_pen', // 不在走廊 → 拒绝路径也被确定性覆盖
        actorId: SPYF.loid,
        targetIds: [SPYF.pen],
        dueTurn: 1,
        maxAttempts: 2,
      });
      return s;
    }

    const ta = tickScheduler(makeState(), SPY_FAMILY_MIN, KERNEL_OPTS);
    const tb = tickScheduler(makeState(), SPY_FAMILY_MIN, KERNEL_OPTS);
    expect(JSON.parse(JSON.stringify(ta.nextState))).toEqual(JSON.parse(JSON.stringify(tb.nextState)));
  });
});

describe('W2.1 内核→调度器接线：概率级联命中 → 入队 → 下一 turn 执行', () => {
  it('0<p<1 命中 → spawnEvent 入调度队列 → tick 触发（世界自己动）', () => {
    const s = breakfastState();
    // 用与默认 seed 相同的 RNG 首值，保证 rollChance 必然命中（确定性）
    const hitProbability = Math.min(0.99, seededRandom(s.scheduler.seed)() + 0.001);
    const probWorld = {
      actions: [
        {
          id: 'act:test:probe',
          name: '测试探查',
          category: 'social' as const,
          description: '触发概率级联的世界事件',
          actorEligibilityRoles: [],
          preconditions: [],
          directEffects: [],
          potentialConsequences: [
            {
              triggerProbability: hitProbability,
              conditionDescription: '命中即生成世界事件',
              consequenceSummary: '世界自行推进',
              secondaryEffects: [],
              spawnEvent: {
                title: 'act:test:spawned',
                description: '世界自发生成的事件',
                urgency: 'low' as const,
              },
            },
          ],
        },
        {
          id: 'act:test:spawned',
          name: '世界事件',
          category: 'social' as const,
          description: '由概率级联生成',
          actorEligibilityRoles: [],
          preconditions: [],
          directEffects: [],
          potentialConsequences: [],
        },
      ],
    } as unknown as WorldDefinition;

    const r = applyEvent(probWorld, s, {
      type: 'action',
      actionId: 'act:test:probe',
      actorId: SPYF.loid,
      targetIds: [],
    }, KERNEL_OPTS);
    expect(r.rejected).toBeFalsy();
    // 级联命中 → 事件已入队（下一 turn 的 once）
    expect(r.spawnedEvents).toHaveLength(1);
    expect(r.nextState.scheduler.queue).toHaveLength(1);
    expect(r.nextState.scheduler.queue[0].actionId).toBe('act:test:spawned');

    // tick 触发世界自发事件
    const tick = tickScheduler(r.nextState, probWorld, KERNEL_OPTS);
    expect(tick.executed).toHaveLength(1);
    expect(tick.executed[0].rejected).toBeFalsy();
    expect(tick.nextState.scheduler.queue).toHaveLength(0);
  });
});
