/**
 * HEADCONAN — 定义驱动内核（kernel2）集成测试
 *
 * 覆盖 docs/EXECUTION_PLAN.md §3 W1 退出门：
 *   最小 SPY×FAMILY 定义在定义驱动内核下可跑 10 分钟体验的 Step 2/4/8/9，
 *   且信息不对称成立、重放确定。
 */

import { describe, it, expect } from 'vitest';
import { instantiate } from './instantiate';
import { applyEvent, type KernelEvent, type KernelOptions } from './kernel2';
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

function runSequence(state: ReturnType<typeof breakfastState>, events: KernelEvent[]) {
  let s = state;
  for (const ev of events) {
    const r = applyEvent(SPY_FAMILY_MIN, s, ev, KERNEL_OPTS);
    if (r.rejected) throw new Error(`序列被拒：${r.reason}`);
    s = r.nextState;
  }
  return s;
}

const complimentYor: KernelEvent = {
  type: 'speech_act',
  actorId: SPYF.loid,
  targetIds: [SPYF.yor],
  utterance: '你今天看起来真好看。',
  intentTag: 'compliment',
};

describe('W1 实例化（Step 1：进入早餐场景）', () => {
  it('早餐场景全员就位', () => {
    const s = breakfastState();
    expect(s.scenarioId).toBe('scn:spyf:breakfast');
    for (const id of [SPYF.loid, SPYF.yor, SPYF.anya, SPYF.bond]) {
      expect(s.entityStates[id].currentLocationId).toBe(SPYF.living);
    }
    expect(s.entityStates[SPYF.damian].currentLocationId).toBe(SPYF.corridor);
  });

  it('认知账本按投影隔离播种（Anya 知道所有人的秘密）', () => {
    const s = breakfastState();
    const knows = (id: string, fact: string) => s.epistemics.entityKnownFacts[id]?.includes(fact) ?? false;
    // Anya 读心：知道 Loid 是间谍 + Yor 是杀手
    expect(knows(SPYF.anya, SPYF.factLoidTwilight)).toBe(true);
    expect(knows(SPYF.anya, SPYF.factYorAssassin)).toBe(true);
    // 信息不对称：Loid 不知道 Yor 是杀手；Yor 不知道 Loid 是间谍
    expect(knows(SPYF.loid, SPYF.factYorAssassin)).toBe(false);
    expect(knows(SPYF.yor, SPYF.factLoidTwilight)).toBe(false);
    // 公开事实人人皆知
    expect(knows(SPYF.yor, SPYF.factYorClerk)).toBe(true);
    expect(knows(SPYF.mrSmith, SPYF.factDamianDesmond)).toBe(true);
  });
});

describe('W1 Step 2：夸奖约尔', () => {
  it('约尔按自己的视角回应，且不泄露杀手身份', () => {
    const s = breakfastState();
    const r = applyEvent(SPY_FAMILY_MIN, s, complimentYor, KERNEL_OPTS);

    expect(r.rejected).toBeFalsy();
    // 关系好感提升（compliment 意图 +3）
    expect(r.nextState.relationshipStates[SPYF.relMarriage].currentAffinity).toBe(43);
    // 约尔情绪变化
    expect(r.nextState.entityStates[SPYF.yor].emotionalState).toBe('温暖而意外');
    // 回应存在
    expect(r.responses.some(x => x.from === SPYF.yor)).toBe(true);
    // 信息不对称：秘密未泄露给 Loid
    expect(r.nextState.epistemics.entityKnownFacts[SPYF.loid]?.includes(SPYF.factYorAssassin)).toBe(false);
    // 日志
    expect(r.nextState.eventChronicleLog.at(-1)?.description).toContain('说');
  });
});

describe('W1 Step 4：询问安雅学校', () => {
  it('安雅回应，但读心秘密不泄露', () => {
    const s = breakfastState();
    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'speech_act',
      actorId: SPYF.loid,
      targetIds: [SPYF.anya],
      utterance: '学校今天怎么样？',
      intentTag: 'ask',
    }, KERNEL_OPTS);

    expect(r.rejected).toBeFalsy();
    const response = r.responses.find(x => x.from === SPYF.anya)?.text ?? '';
    expect(response).toContain('史密斯老师');
    // 读心秘密不泄露
    expect(r.nextState.epistemics.entityKnownFacts[SPYF.loid]?.includes(SPYF.factAnyaTelepath)).toBe(false);
    // 关系（loid→anya）+1
    expect(r.nextState.relationshipStates[SPYF.relLoidAnya].currentAffinity).toBe(56);
  });
});

describe('W1 询问"昨晚去向"（怀疑的种子）', () => {
  it('约尔用市政厅掩护回应；Loid 的怀疑上升', () => {
    const s = breakfastState();
    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'speech_act',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
      utterance: '昨晚去哪了？',
      intentTag: 'ask',
      topic: 'last night',
    }, KERNEL_OPTS);

    expect(r.rejected).toBeFalsy();
    expect(r.nextState.entityStates[SPYF.yor].emotionalState).toBe('警觉（cover 反应）');
    expect(r.nextState.entityStates[SPYF.loid].dynamicAttributes.suspicionOfYor).toBe(2);
    const response = r.responses.find(x => x.from === SPYF.yor)?.text ?? '';
    expect(response).toContain('市政厅');
  });
});

describe('W1 Step 8：检查钢笔（前提 + 资格 + 知识写入）', () => {
  it('不在走廊 → 拒绝（requires_location）', () => {
    const s = breakfastState();
    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'action',
      actionId: 'act:spyf:inspect_pen',
      actorId: SPYF.loid,
      targetIds: [SPYF.pen],
    }, KERNEL_OPTS);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('不在伊甸学园走廊');
  });

  it('抵达走廊后检查成功 → 钢笔秘密进入 Loid 认知账本', () => {
    const s = runSequence(breakfastState(), [
      { type: 'action', actionId: 'act:spyf:travel', actorId: SPYF.loid, targetIds: [SPYF.corridor] },
      { type: 'action', actionId: 'act:spyf:inspect_pen', actorId: SPYF.loid, targetIds: [SPYF.pen] },
    ]);
    expect(s.entityStates[SPYF.loid].currentLocationId).toBe(SPYF.corridor);
    expect(s.epistemics.entityKnownFacts[SPYF.loid]?.includes(SPYF.factPenSurveillance)).toBe(true);
  });
});

describe('W1 Step 9：错过家长会（确定性级联）', () => {
  it('声誉 -10，与 Anya 的关系 -5', () => {
    const s = breakfastState();
    const beforeRep = s.entityStates[SPYF.loid].reputationScore;
    const beforeAff = s.relationshipStates[SPYF.relLoidAnya].currentAffinity;
    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'action',
      actionId: 'act:spyf:miss_parent_meeting',
      actorId: SPYF.loid,
      targetIds: [],
    }, KERNEL_OPTS);

    expect(r.rejected).toBeFalsy();
    expect(r.nextState.entityStates[SPYF.loid].reputationScore).toBe(beforeRep - 10);
    expect(r.nextState.relationshipStates[SPYF.relLoidAnya].currentAffinity).toBe(beforeAff - 5);
  });
});

describe('W1 信息不对称强制（摊牌需要知识）', () => {
  it('Loid 不知道约尔是杀手 → 摊牌被拒绝', () => {
    const s = breakfastState();
    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'action',
      actionId: 'act:spyf:confront',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
    }, KERNEL_OPTS);
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('这个秘密并没有对你开放');
  });

  it('主持人用 reveal_fact 注入后，摊牌可执行', () => {
    let s = runSequence(breakfastState(), [
      {
        type: 'reveal_fact',
        actorId: SPYF.yor,
        targetId: SPYF.loid,
        factId: SPYF.factYorAssassin,
        source: 'host',
      },
    ]);
    expect(s.epistemics.entityKnownFacts[SPYF.loid]?.includes(SPYF.factYorAssassin)).toBe(true);
    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'action',
      actionId: 'act:spyf:confront',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
    }, KERNEL_OPTS);
    expect(r.rejected).toBeFalsy();
    expect(r.nextState.entityStates[SPYF.yor].emotionalState).toBe('惊骇、绝望、准备逃离');
  });
});

describe('W1 重放确定性（同一日志前缀 → 同一终态）', () => {
  it('两次独立运行得到完全一致的终态', () => {
    const events: KernelEvent[] = [
      complimentYor,
      { type: 'speech_act', actorId: SPYF.loid, targetIds: [SPYF.yor], utterance: '昨晚去哪了？', intentTag: 'ask', topic: 'last night' },
      { type: 'action', actionId: 'act:spyf:travel', actorId: SPYF.loid, targetIds: [SPYF.corridor] },
      { type: 'action', actionId: 'act:spyf:inspect_pen', actorId: SPYF.loid, targetIds: [SPYF.pen] },
    ];
    const a = runSequence(breakfastState(), events);
    const b = runSequence(breakfastState(), events);
    expect(JSON.parse(JSON.stringify(a))).toEqual(JSON.parse(JSON.stringify(b)));
    // 事件 ID 确定性（turn:seq:type）
    expect(a.eventChronicleLog[0].id).toBe('evt:2:0:speech_act');
  });
});
