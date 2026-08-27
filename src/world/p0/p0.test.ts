/**
 * HEADCONAN P0 — 垂直切片验收测试
 *
 * 命题：用户自然语言动作 → 确定性事件 → 世界真实变化 → 可检查。
 * 覆盖 5 个承诺的最小验证：
 *   1. 信息不对称（玩家投影看不到 Yor 是刺客；主持人/Anya 能看到）
 *   2. 可感知后果（询问昨晚 → Yor 情绪变化 + Loid 怀疑上升 + 日志条目）
 *   3. 确定性（同输入两次运行 → 同状态；可重放）
 *   4. 拒绝语义（不知情摊牌被 requires_knowledge 拒绝——E1 漏洞修复）
 *   5. 主持人通道（reveal_fact 注入 → 玩家获得知识 → 摊牌成功 → 级联）
 */

import { describe, it, expect } from 'vitest';
import { instantiate } from '../runtime/instantiate';
import { applyEvent, type KernelEvent } from '../runtime/kernel';
import { resolveUserAction } from '../runtime/resolver';
import { projectEpistemicPerspective } from '../representation/epistemics/projector';
import {
  P0_WORLD_DEFINITION as WORLD,
  P0_SCENARIO_BREAKFAST as SCENARIO,
  P0_ENTITIES as E,
  P0_FACTS as F,
} from './world';

/** 从同一定义+种子构造一个全新的初始实例（隔离性由 E1 保证） */
function freshInstance(instanceId: string) {
  return instantiate(WORLD, { scenario: SCENARIO, instanceId });
}

const askAboutLastNight = (): KernelEvent => ({
  type: 'speech_act',
  actorId: E.loid,
  targetIds: [E.yor],
  utterance: 'Yor，你昨晚去哪了？',
  intentTag: 'ask',
  topic: 'last night',
});

describe('P0 垂直切片 — 信息不对称', () => {
  it('世界真相：Yor 是刺客（groundTruthFacts 存在且为 singular_secret）', () => {
    const fact = WORLD.groundTruthFacts.find(f => f.id === F.yor_is_assassin);
    expect(fact?.statement).toContain('荆棘公主');
    expect(fact?.visibilityScope).toBe('singular_secret');
  });

  it('玩家（Loid）投影看不到 Yor 是刺客', () => {
    const state = freshInstance('p0:asym:loid');
    const loidView = projectEpistemicPerspective(WORLD, state, E.loid);
    expect(loidView.knownFactIds).not.toContain(F.yor_is_assassin);
    expect(loidView.knownFactIds).toContain(F.yor_cover_clerk);
  });

  it('Anya 知道 Loid 是间谍、Yor 是刺客；Host 全知', () => {
    const state = freshInstance('p0:asym:all');
    const anyaView = projectEpistemicPerspective(WORLD, state, E.anya);
    expect(anyaView.knownFactIds).toContain(F.yor_is_assassin);
    expect(anyaView.knownFactIds).toContain(F.loid_is_spy);
    const hostView = projectEpistemicPerspective(WORLD, state);
    expect(hostView.knownFactIds).toEqual(WORLD.groundTruthFacts.map(f => f.id));
  });
});

describe('P0 垂直切片 — 意图解析', () => {
  it('「Yor，你昨晚去哪了？」 → speech_act(ask, topic=last night)', () => {
    const r = resolveUserAction('Yor，你昨晚去哪了？', WORLD, E.loid);
    expect(r.event.type).toBe('speech_act');
    if (r.event.type === 'speech_act') {
      expect(r.event.targetIds).toContain(E.yor);
      expect(r.event.intentTag).toBe('ask');
      expect(r.event.topic).toBe('last night');
    }
    expect(r.confidence).toBe(1);
  });

  it('「我指控你就是那个刺客！」 → confront_secret(fact:yor_is_assassin)', () => {
    const r = resolveUserAction('我指控你就是那个刺客！', WORLD, E.loid);
    expect(r.event.type).toBe('confront_secret');
    if (r.event.type === 'confront_secret') {
      expect(r.event.secretFactId).toBe(F.yor_is_assassin);
      expect(r.event.targetId).toBe(E.yor);
    }
  });

  it('无法解析目标时兜底为对 Yor 说一句话', () => {
    const r = resolveUserAction('今天天气不错。', WORLD, E.loid);
    expect(r.event.type).toBe('speech_act');
    if (r.event.type === 'speech_act') expect(r.event.intentTag).toBe('say');
  });
});

describe('P0 垂直切片 — 主循环（意图 → 事件 → 后果）', () => {
  it('询问昨晚 → Yor 警觉 + Loid 怀疑上升 + 关系/日志变化', () => {
    const state = freshInstance('p0:loop:ask');
    const result = applyEvent(WORLD, state, askAboutLastNight());

    expect(result.rejected).toBeUndefined();
    expect(result.nextState.clock.turnNumber).toBe(2);
    expect(result.nextState.entityStates[E.yor].emotionalState).toBe('警觉（cover 反应）');
    expect(result.nextState.entityStates[E.loid].dynamicAttributes.suspicionOfYor).toBe(2);
    expect(result.nextState.relationshipStates['rel:p0:loid_yor_marriage'].currentAffinity).toBe(31);
    expect(result.nextState.eventChronicleLog.length).toBe(1);
    expect(result.nextState.eventChronicleLog[0].id).toMatch(/^evt:2:0:speech_act$/);
    // 观察副作用：Yor 与 Anya 在场听到；玩家听到 Yor 的回应
    const witnessIds = result.observations.map(o => o.observerId);
    expect(witnessIds).toContain(E.yor);
    expect(witnessIds).toContain(E.anya);
    expect(result.observations.some(o => o.observerId === E.loid && o.utteranceHeard?.includes('市政厅加班'))).toBe(true);
  });

  it('确定性：同输入两次运行 → 状态完全一致（可重放）', () => {
    const run1 = applyEvent(WORLD, freshInstance('p0:det:a'), askAboutLastNight());
    const run2 = applyEvent(WORLD, freshInstance('p0:det:b'), askAboutLastNight());
    // instanceId 由调用方注入，不属于内核产物——剥离后比对
    const { instanceId: _a, ...s1 } = run1.nextState;
    const { instanceId: _b, ...s2 } = run2.nextState;
    expect(s1).toEqual(s2);
    // 事件 ID 确定性（不依赖时间/随机数）
    expect(run1.nextState.eventChronicleLog[0].id).toBe(run2.nextState.eventChronicleLog[0].id);
  });

  it('夸奖 Yor → 关系亲和上升（确定性意图增量）', () => {
    const state = freshInstance('p0:loop:compliment');
    const result = applyEvent(WORLD, state, {
      type: 'speech_act',
      actorId: E.loid,
      targetIds: [E.yor],
      utterance: '今天的早餐真温馨。',
      intentTag: 'compliment',
    });
    expect(result.nextState.relationshipStates['rel:p0:loid_yor_marriage'].currentAffinity).toBe(33);
    expect(result.nextState.entityStates[E.yor].emotionalState).toBe('温暖而意外');
  });
});

describe('P0 垂直切片 — 拒绝语义（E1 漏洞修复）', () => {
  it('玩家不知情时摊牌被拒绝（requires_knowledge 强制）', () => {
    const state = freshInstance('p0:reject:confront');
    const result = applyEvent(WORLD, state, {
      type: 'confront_secret',
      actorId: E.loid,
      targetId: E.yor,
      secretFactId: F.yor_is_assassin,
    });
    expect(result.rejected).toBe(true);
    expect(result.reason).toContain('知识前提不满足');
    // 世界未被破坏：回合不推进、情绪不变、关系不变
    expect(result.nextState.clock.turnNumber).toBe(1);
    expect(result.nextState.entityStates[E.yor].emotionalState).toBe('平静');
    expect(result.nextState.relationshipStates['rel:p0:loid_yor_marriage'].currentAffinity).toBe(30);
    // 但拒绝本身入日志（拒绝即事件）
    expect(result.nextState.eventChronicleLog.length).toBe(1);
    expect(result.nextState.eventChronicleLog[0].title).toBe('[rejected] confront_secret');
  });
});

describe('P0 垂直切片 — 主持人通道 + 级联', () => {
  it('Host 注入事实 → 玩家获得知识 → 摊牌成功 → 关系崩溃 + 级联事件', () => {
    let state = freshInstance('p0:host:full');

    // 1. Host 向 Loid 揭示「Yor 是刺客」
    const reveal = applyEvent(WORLD, state, {
      type: 'reveal_fact',
      targetId: E.loid,
      factId: F.yor_is_assassin,
      source: 'host',
    });
    expect(reveal.nextState.epistemics.entityKnownFacts[E.loid]).toContain(F.yor_is_assassin);
    state = reveal.nextState;

    // 2. 现在 Loid 的投影能看到该事实（知识账本 → 投影）
    const loidView = projectEpistemicPerspective(WORLD, state, E.loid);
    expect(loidView.knownFactIds).toContain(F.yor_is_assassin);

    // 3. 摊牌成功
    const confront = applyEvent(WORLD, state, {
      type: 'confront_secret',
      actorId: E.loid,
      targetId: E.yor,
      secretFactId: F.yor_is_assassin,
    });
    expect(confront.rejected).toBeUndefined();
    expect(confront.nextState.relationshipStates['rel:p0:loid_yor_marriage'].currentAffinity).toBe(0);
    expect(confront.nextState.relationshipStates['rel:p0:loid_yor_marriage'].currentTrust).toBe(0);
    expect(confront.nextState.entityStates[E.yor].emotionalState).toBe('惊骇、绝望、准备逃离');
    // 级联事件被排入
    expect(confront.spawnedEvents.length).toBeGreaterThan(0);
    // 在场目击者（Anya）得知秘密
    expect(confront.nextState.epistemics.entityKnownFacts[E.anya]).toContain(F.yor_is_assassin);
    // 日志连续可重放（ID = turn:logLength:type；追加序 = 时间正序）
    expect(confront.nextState.eventChronicleLog.map(l => l.id)).toEqual([
      'evt:2:0:reveal_fact',
      'evt:3:1:confront_secret',
    ]);
  });

  it('完整序列重放一致：ask → reveal → confront 两次运行结果相同', () => {
    const sequence = (): KernelEvent[] => [
      askAboutLastNight(),
      { type: 'reveal_fact', targetId: E.loid, factId: F.yor_is_assassin, source: 'host' },
      { type: 'confront_secret', actorId: E.loid, targetId: E.yor, secretFactId: F.yor_is_assassin },
    ];

    const run = (tag: string) => {
      let state = freshInstance(`p0:replay:${tag}`);
      for (const ev of sequence()) {
        const r = applyEvent(WORLD, state, ev);
        state = r.nextState;
      }
      return state;
    };

    const s1 = run('a');
    const s2 = run('b');
    // instanceId 由调用方注入，剥离后比对内核产物
    const { instanceId: _ia, ...core1 } = s1;
    const { instanceId: _ib, ...core2 } = s2;
    expect(core1).toEqual(core2);
    expect(s1.clock.turnNumber).toBe(4);
    expect(s1.relationshipStates['rel:p0:loid_yor_marriage'].currentAffinity).toBe(1); // 30 +1(ask) -30(confront)
  });
});
