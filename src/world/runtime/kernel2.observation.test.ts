/**
 * HEADCONAN — 观察闭环（W2.3）集成测试
 *
 * 覆盖 docs/W2_REST_PLAN.md §3 W2.3 退出门：
 *   公开指控 / 秘密披露 → 在场者知道、缺席者不知道，且投影隔离不变（W2 主退出门 #1）。
 *
 * 4 项验证：
 *   1. reveal_fact 广播：导演注入 → 目标 + 在场证人认知更新；异地者不知。
 *   2. 公开话语披露：命中秘密短语的话语 → 在场听者认知更新；异地者不知。
 *   3. 投影隔离回读：广播后 legacyAdapter 投影——获知者看到、未获知者看不到。
 *   4. cosmic_truth 不传播：仅目标知晓，在场者不更新（对照 singular_secret 传播）。
 */

import { describe, it, expect } from 'vitest';
import { instantiate } from './instantiate';
import { applyEvent, type KernelOptions } from './kernel2';
import { projectLegacyWorld } from './legacyAdapter';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF, SPY_FAMILY_SECRET_UTTERANCES } from '../spyFamily/spyFamilyMin';
import { spyFamilyRelationResolver, spyFamilyRoleOf, spyFamilyReaction } from '../spyFamily/spyFamilyReactions';
import type { WorldDefinition } from '../representation/types/definition';
import type { EntityId, FactId } from '../representation/types/primitives';

// 与 App.tsx 完全同源的 resolver（短语表单一来源）
const KERNEL_OPTS: KernelOptions = {
  relationResolver: spyFamilyRelationResolver,
  roleOf: spyFamilyRoleOf,
  reactions: spyFamilyReaction,
  discloseFactResolver: (_world, event) =>
    SPY_FAMILY_SECRET_UTTERANCES.filter(({ pattern }) => pattern.test(event.utterance)).map(({ factId }) => factId),
};

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

function knows(state: ReturnType<typeof breakfastState>, entityId: EntityId, factId: FactId): boolean {
  return state.epistemics.entityKnownFacts[entityId]?.includes(factId) ?? false;
}

/** 把贝琪移动到洛德的起居室，使其成为"在场证人" */
function moveBeckyIn(s: ReturnType<typeof breakfastState>) {
  s.entityStates[SPYF.becky].currentLocationId = SPYF.living;
  return s;
}

describe('W2.3 观察闭环：reveal_fact 广播', () => {
  it('导演注入秘密 → 洛德（目标）与贝琪（在场证人）认知更新；校长（异地）不知', () => {
    const s = moveBeckyIn(breakfastState());

    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'reveal_fact',
      targetId: SPYF.loid,
      factId: SPYF.factYorAssassin,
      source: 'host',
    }, KERNEL_OPTS);

    expect(r.rejected).toBeFalsy();
    // 目标知道
    expect(knows(r.nextState, SPYF.loid, SPYF.factYorAssassin)).toBe(true);
    // 在场证人（贝琪）知道 —— 观察闭环核心
    expect(knows(r.nextState, SPYF.becky, SPYF.factYorAssassin)).toBe(true);
    // 异地校长不知道 —— 信息不对称保持
    expect(knows(r.nextState, SPYF.headmaster, SPYF.factYorAssassin)).toBe(false);
    // 贝琪收到确定性的观察记录
    expect(
      r.observations.some(
        o => o.observerId === SPYF.becky && o.factIdsRevealed.includes(SPYF.factYorAssassin)
      )
    ).toBe(true);
  });

  it('重复 reveal 幂等：已持有者不产生新观察记录', () => {
    const s = moveBeckyIn(breakfastState());
    // 贝琪先在别处被注入（成为已持有者）
    const r1 = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'reveal_fact',
      targetId: SPYF.becky,
      factId: SPYF.factYorAssassin,
      source: 'host',
    }, KERNEL_OPTS);

    // 再向洛德注入，贝琪已持有 → 无新增记录
    const r2 = applyEvent(SPY_FAMILY_MIN, r1.nextState, {
      type: 'reveal_fact',
      targetId: SPYF.loid,
      factId: SPYF.factYorAssassin,
      source: 'host',
    }, KERNEL_OPTS);
    expect(
      r2.observations.filter(o => o.observerId === SPYF.becky && o.factIdsRevealed.includes(SPYF.factYorAssassin))
    ).toHaveLength(0);
  });
});

describe('W2.3 观察闭环：公开话语披露', () => {
  it('洛德在贝琪面前说出命中秘密短语 → 贝琪认知更新；异地角色不知', () => {
    const s = moveBeckyIn(breakfastState());

    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'speech_act',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
      utterance: '约尔是杀手，我全都知道了。',
      intentTag: 'say',
    }, KERNEL_OPTS);

    expect(r.rejected).toBeFalsy();
    expect(knows(r.nextState, SPYF.becky, SPYF.factYorAssassin)).toBe(true);
    expect(knows(r.nextState, SPYF.headmaster, SPYF.factYorAssassin)).toBe(false);
  });

  it('普通闲聊不披露任何秘密（在场者听到但不认知更新）', () => {
    const s = moveBeckyIn(breakfastState());

    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'speech_act',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
      utterance: '今天的早餐真不错。',
      intentTag: 'compliment',
    }, KERNEL_OPTS);

    expect(r.rejected).toBeFalsy();
    expect(knows(r.nextState, SPYF.becky, SPYF.factYorAssassin)).toBe(false);
    expect(knows(r.nextState, SPYF.bond, SPYF.factYorAssassin)).toBe(false);
  });
});

describe('W2.3 观察闭环：投影隔离回读', () => {
  it('广播后按洛德视角投影 → 看到约尔的秘密；异地者视角 → 仍不可见', () => {
    const s = breakfastState();

    // 初始（洛德视角）：约尔的杀手身份不可见（洛德只知"伪装家庭"）
    const before = projectLegacyWorld(SPY_FAMILY_MIN, s, SPYF.loid);
    const yorBefore = before.characters.find(c => c.id === SPYF.yor);
    expect(yorBefore?.secretAgenda).toBeDefined();
    expect(yorBefore?.secretAgenda).not.toContain('杀手');

    const r = applyEvent(SPY_FAMILY_MIN, s, {
      type: 'reveal_fact',
      targetId: SPYF.loid,
      factId: SPYF.factYorAssassin,
      source: 'host',
    }, KERNEL_OPTS);

    // 洛德视角：约尔的杀手身份现可见
    const afterLoid = projectLegacyWorld(SPY_FAMILY_MIN, r.nextState, SPYF.loid);
    const yorAfterLoid = afterLoid.characters.find(c => c.id === SPYF.yor);
    expect(yorAfterLoid?.secretAgenda).toContain('杀手');

    // 异地校长视角：仍未获知 → 不可见
    const afterHead = projectLegacyWorld(SPY_FAMILY_MIN, r.nextState, SPYF.headmaster);
    const yorAfterHead = afterHead.characters.find(c => c.id === SPYF.yor);
    expect(yorAfterHead?.secretAgenda).toBeUndefined();
  });
});

describe('W2.3 观察闭环：cosmic_truth 不传播', () => {
  it('宇宙级真相 reveal 后仅目标知晓，在场者不更新（对照 singular_secret 在场者更新）', () => {
    const cosmicWorld: WorldDefinition = {
      ...SPY_FAMILY_MIN,
      groundTruthFacts: [
        ...SPY_FAMILY_MIN.groundTruthFacts,
        {
          id: 'fact:test:cosmic',
          statement: '宇宙真相：这个世界本身是模拟的。',
          domain: 'historical_event',
          visibilityScope: 'cosmic_truth',
          provenance: { source: 'authored', sourceConfidence: 1, createdTurn: 0 },
          falsifiability: false,
        },
      ],
    };
    const s = instantiate(cosmicWorld, { scenario: SPY_FAMILY_SCENARIOS.breakfast });

    // cosmic_truth：仅目标知晓，在场者（邦德）不更新
    const r1 = applyEvent(cosmicWorld, s, {
      type: 'reveal_fact',
      targetId: SPYF.loid,
      factId: 'fact:test:cosmic',
      source: 'host',
    }, KERNEL_OPTS);
    expect(r1.rejected).toBeFalsy();
    expect(knows(r1.nextState, SPYF.loid, 'fact:test:cosmic')).toBe(true);
    expect(knows(r1.nextState, SPYF.bond, 'fact:test:cosmic')).toBe(false);

    // 对照：singular_secret 在场者（邦德）确实更新
    const r2 = applyEvent(cosmicWorld, r1.nextState, {
      type: 'reveal_fact',
      targetId: SPYF.loid,
      factId: SPYF.factYorAssassin,
      source: 'host',
    }, KERNEL_OPTS);
    expect(r2.rejected).toBeFalsy();
    expect(knows(r2.nextState, SPYF.loid, SPYF.factYorAssassin)).toBe(true);
    expect(knows(r2.nextState, SPYF.bond, SPYF.factYorAssassin)).toBe(true);
  });
});
