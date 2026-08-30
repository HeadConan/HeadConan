import { describe, it, expect } from 'vitest';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../spyFamily/spyFamilyMin';
import { spyFamilyRelationResolver } from '../spyFamily/spyFamilyReactions';
import { instantiate } from './instantiate';
import { applyEvent, type KernelEvent } from './kernel2';
import { resolveUserAction } from './kernel2Resolver';
import { readDialogueTurn, recordDialogueTurn, suggestedUtterances } from './dialogue';

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

/** 非空转断言：先断言事件类型为 speech_act，再返回窄化事件供目标断言 */
function expectSpeechAct(ev: KernelEvent) {
  expect(ev.type).toBe('speech_act');
  if (ev.type !== 'speech_act') throw new Error('expected speech_act');
  return ev;
}

describe('W3.3 一阶对话：点击目标定向', () => {
  it('显式目标注入 → speech_act 定向该角色（文本未指名时）', () => {
    const s = breakfastState();
    const r = resolveUserAction('你昨晚做什么了？', SPY_FAMILY_MIN, SPYF.loid, s, SPYF.anya);
    const ev = expectSpeechAct(r.events[0]);
    expect(ev.targetIds).toEqual([SPYF.anya]);
  });

  it('文本指名优先于显式目标', () => {
    const s = breakfastState();
    const r = resolveUserAction('问约尔：你昨晚做什么了？', SPY_FAMILY_MIN, SPYF.loid, s, SPYF.anya);
    const ev = expectSpeechAct(r.events[0]);
    expect(ev.targetIds).toEqual([SPYF.yor]);
  });

  it('无显式目标时回退默认目标（约尔）', () => {
    const s = breakfastState();
    const r = resolveUserAction('你昨晚做什么了？', SPY_FAMILY_MIN, SPYF.loid, s);
    const ev = expectSpeechAct(r.events[0]);
    expect(ev.targetIds).toEqual([SPYF.yor]);
  });
});

describe('W3.3 一阶对话：对话轮次记账与持久化', () => {
  it('recordDialogueTurn 递增场景内 dialogueTurn', () => {
    const s = breakfastState();
    s.scene = { current: 'conversation', inScene: {} };
    const next = recordDialogueTurn(s.scene, 1);
    expect(readDialogueTurn(next)).toBe(1);
  });

  it('多次记账累加', () => {
    const s = breakfastState();
    s.scene = { current: 'conversation', inScene: { dialogueTurn: 2 } };
    const next = recordDialogueTurn(recordDialogueTurn(s.scene, 1), 1);
    expect(readDialogueTurn(next)).toBe(4);
  });

  it('非法轮次（0/负数/NaN）不改变状态', () => {
    const s = breakfastState();
    s.scene = { current: 'conversation', inScene: { dialogueTurn: 1 } };
    expect(recordDialogueTurn(s.scene, 0)).toBe(s.scene);
    expect(recordDialogueTurn(s.scene, -1)).toBe(s.scene);
    expect(recordDialogueTurn(s.scene, NaN)).toBe(s.scene);
  });

  it('轮次随快照 round-trip 持久化', () => {
    const s = breakfastState();
    s.scene = recordDialogueTurn({ current: 'conversation', inScene: {} }, 3);
    const restored = JSON.parse(JSON.stringify(s));
    expect(readDialogueTurn(restored.scene)).toBe(3);
  });

  it('缺省轮次为 0', () => {
    const s = breakfastState();
    expect(readDialogueTurn(s.scene)).toBe(0);
  });
});

describe('W3.3 一阶对话：非共现目标拒绝', () => {
  it('目标不在同一地点 → 内核拒绝 speech_act', () => {
    const s = breakfastState();
    const r = applyEvent(
      SPY_FAMILY_MIN,
      s,
      {
        type: 'speech_act',
        actorId: SPYF.loid,
        targetIds: [SPYF.damian],
        utterance: '你好，达米安',
        intentTag: 'say',
      },
      { relationResolver: spyFamilyRelationResolver }
    );
    expect(r.rejected).toBe(true);
    expect(r.reason).toContain('共现前提不满足');
  });

  it('共现目标 → 内核接受 speech_act 并推进时钟', () => {
    const s = breakfastState();
    const r = applyEvent(
      SPY_FAMILY_MIN,
      s,
      {
        type: 'speech_act',
        actorId: SPYF.loid,
        targetIds: [SPYF.yor],
        utterance: '你昨晚做什么了？',
        intentTag: 'ask',
      },
      { relationResolver: spyFamilyRelationResolver }
    );
    expect(r.rejected).toBeUndefined();
    expect(r.nextState.clock.turnNumber).toBe(s.clock.turnNumber + 1);
  });
});

describe('W3.3 一阶对话：场景绑定建议话语', () => {
  it('conversation 场景 → 对话类话语', () => {
    const utts = suggestedUtterances('conversation');
    expect(utts).toHaveLength(3);
    expect(utts[0]).toContain('夸奖');
  });

  it('conversation + 目标名 → 话语定向该角色', () => {
    const utts = suggestedUtterances('conversation', '安雅');
    expect(utts.every(u => u.includes('安雅'))).toBe(true);
  });

  it('exploration 场景 → 探索类话语', () => {
    const utts = suggestedUtterances('exploration');
    expect(utts).toContain('检查那支黑色钢笔');
  });

  it('everyday 场景 → 默认话语集', () => {
    const utts = suggestedUtterances('everyday');
    expect(utts).toContain('问约尔：昨晚去哪了？');
  });
});

describe('W3.3 一阶对话：端到端流程', () => {
  it('点击目标 → 解析 → 内核接受 → 轮次记账', () => {
    const s = breakfastState();
    s.scene = { current: 'conversation', inScene: {} };
    const ev = expectSpeechAct(resolveUserAction('你昨晚做什么了？', SPY_FAMILY_MIN, SPYF.loid, s, SPYF.yor).events[0]);
    const applied = applyEvent(SPY_FAMILY_MIN, s, ev, { relationResolver: spyFamilyRelationResolver });
    expect(applied.rejected).toBeUndefined();
    const scene = recordDialogueTurn(applied.nextState.scene, 1);
    expect(readDialogueTurn(scene)).toBe(1);
  });

  it('非共现目标端到端：解析命中但内核拒绝 → 不计轮次', () => {
    const s = breakfastState();
    s.scene = { current: 'conversation', inScene: {} };
    const ev = expectSpeechAct(resolveUserAction('你昨晚做什么了？', SPY_FAMILY_MIN, SPYF.loid, s, SPYF.damian).events[0]);
    const applied = applyEvent(SPY_FAMILY_MIN, s, ev, { relationResolver: spyFamilyRelationResolver });
    expect(applied.rejected).toBe(true);
    expect(readDialogueTurn(s.scene)).toBe(0);
  });
});
