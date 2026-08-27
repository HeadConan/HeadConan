/**
 * E1 — 单一世界表示能否同时支撑「正典」与「平行场景」？
 * 假设（ADR-1 / HEADCONAN_KERNEL §5）：WorldDefinition + ScenarioSeed → WorldInstance，
 * 多个实例互不污染；分歧种子能表达「同一个世界，不同的起始现实」。
 * 判据（ARCHITECTURAL_EXPERIMENTS.md E1）：
 *   ✅ 三个实例的状态互不影响；同一事件在不同实例产生不同结果（因初始状态不同）。
 *   ❌ 任何实例间引用泄漏（共享数组/引用）；或种子无法表达「分歧」。
 */

import { describe, it, expect } from 'vitest';
import { GAME_OF_THRONES_WORLD_DEFINITION as GoT } from '../representation/examples/gameOfThrones';
import { GAME_OF_THRONES_INITIAL_STATE as GoTBase } from '../representation/examples/gameOfThrones';
import { instantiate, applyStateEffect } from './instantiate';
import { evaluateWorldAction } from '../representation/dynamics/evaluator';
import type { ScenarioSeed } from '../representation/types/scenarios';
import type { WorldStateInstance } from '../representation/types/state';

// ---------- 三个场景种子 ----------

const s1Canon: ScenarioSeed = {
  id: 'scenario:got:canon',
  worldDefinitionId: GoT.id,
  title: '正典 — 奈德抵达君临',
  initialSituation: '奈德·史塔克在首相之塔比对家谱，劳勃国王已出发前往御林狩猎。',
  recommendedRoles: [GoT.possibilitySpace.availableRoles[0]],
};

const s2Divergence: ScenarioSeed = {
  id: 'scenario:got:cersei_strikes_first',
  worldDefinitionId: GoT.id,
  title: '分歧 — 瑟曦抢先摊牌',
  divergencePoint: 'What if Cersei confronted Ned in the Tower of the Hand before Robert returned?',
  initialSituation: '瑟曦未经通报闯入首相之塔，与奈德面对面。',
  initialStateMutations: [
    {
      targetDomain: 'entity',
      targetId: 'char:cersei_lannister',
      mutationType: 'set',
      fieldKey: 'currentLocationId',
      payload: 'loc:tower_of_the_hand',
      narrativeDescription: '瑟曦移动到首相之塔，与奈德共处一室。',
    },
    {
      targetDomain: 'relationship',
      targetId: 'rel:ned_cersei_standoff',
      mutationType: 'set',
      fieldKey: 'currentAffinity',
      payload: -95,
      narrativeDescription: '对峙提前，敌意升至顶点。',
    },
  ],
  recommendedRoles: [GoT.possibilitySpace.availableRoles[0]],
};

const s3PlayerLens: ScenarioSeed = {
  id: 'scenario:got:treasury_crisis',
  worldDefinitionId: GoT.id,
  title: '玩家视角 — 财政大臣的深渊',
  initialSituation: '你接管王室财政，发现窟窿比账面上更深。',
  initialStateMutations: [
    {
      targetDomain: 'resource',
      targetId: 'iron_throne_treasury',
      mutationType: 'set',
      fieldKey: '',
      payload: -9000000,
      narrativeDescription: '王室债务恶化至九百万金龙。',
    },
    {
      targetDomain: 'entity',
      targetId: 'char:ned_stark',
      mutationType: 'set',
      fieldKey: 'reputationScore',
      payload: 50,
      narrativeDescription: '财政丑闻波及奈德的朝堂声望。',
    },
  ],
  recommendedRoles: [GoT.possibilitySpace.availableRoles[0]],
};

// ---------- 合成路径 vs 手写基态路径 ----------

describe('E1 实例隔离与场景分歧', () => {
  it('合成路径：从定义直接合成可用的初始状态', () => {
    const inst = instantiate(GoT, { scenario: s1Canon, instanceId: 'inst:e1:synth' });
    expect(inst.entityStates['char:ned_stark']).toBeDefined();
    // 认知种子：universal_public 事实自动进入所有角色
    expect(inst.epistemics.entityKnownFacts['char:ned_stark']).toContain('fact:crown_is_massively_in_debt');
    // 手写基态携带的秘密，在合成路径下不存在（合成路径不注入 SecretItem，属预期）
    expect(inst.epistemics.activeSecrets).toEqual([]);
    expect(inst.clock.turnNumber).toBe(1);
  });

  it('基态路径：手写初始状态可作为正典种子深拷贝', () => {
    const inst = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:base' });
    expect(inst.entityStates['char:cersei_lannister'].currentLocationId).toBe('loc:red_keep_royal_apartments');
    // 手写基态的秘密被保留
    expect(inst.epistemics.activeSecrets.map(s => s.factId)).toContain('fact:cersei_children_bastards');
  });

  it('三个实例获得独立 ID 且互不共享引用', () => {
    const a = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:a' });
    const b = instantiate(GoT, { scenario: s2Divergence, baseState: GoTBase, instanceId: 'inst:e1:b' });
    const c = instantiate(GoT, { scenario: s3PlayerLens, baseState: GoTBase, instanceId: 'inst:e1:c' });

    expect(a.instanceId).not.toBe(b.instanceId);
    expect(b.instanceId).not.toBe(c.instanceId);

    // 引用级隔离：实体/关系/认知数组/资源池均非同一对象
    expect(a.entityStates['char:ned_stark']).not.toBe(b.entityStates['char:ned_stark']);
    expect(a.relationshipStates['rel:ned_cersei_standoff']).not.toBe(c.relationshipStates['rel:ned_cersei_standoff']);
    expect(a.epistemics.entityKnownFacts['char:ned_stark']).not.toBe(b.epistemics.entityKnownFacts['char:ned_stark']);
    expect(a.epistemics.activeSecrets).not.toBe(b.epistemics.activeSecrets);
    expect(a.resourcePools).not.toBe(c.resourcePools);
    // 定义对象未被任何实例占用为同一引用
    expect(a.epistemics.entityKnownFacts['char:ned_stark']).not.toBe(GoT.characters[0].knownFactIds);
  });

  it('种子能表达分歧：位置 / 关系 / 资源 / 声誉各不相同', () => {
    const a = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:a' });
    const b = instantiate(GoT, { scenario: s2Divergence, baseState: GoTBase, instanceId: 'inst:e1:b' });
    const c = instantiate(GoT, { scenario: s3PlayerLens, baseState: GoTBase, instanceId: 'inst:e1:c' });

    expect(b.entityStates['char:cersei_lannister'].currentLocationId).toBe('loc:tower_of_the_hand');
    expect(a.entityStates['char:cersei_lannister'].currentLocationId).toBe('loc:red_keep_royal_apartments');
    expect(b.relationshipStates['rel:ned_cersei_standoff'].currentAffinity).toBe(-95);
    expect(c.resourcePools['iron_throne_treasury']).toBe(-9000000);
    expect(c.entityStates['char:ned_stark'].reputationScore).toBe(50);
    expect(a.entityStates['char:ned_stark'].reputationScore).toBe(92);
  });

  it('突变隔离：修改实例 A 不波及其他实例，也不污染定义', () => {
    const a = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:a' });
    const b = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:b' });
    const nedReputationBefore = b.entityStates['char:ned_stark'].reputationScore;
    const defBefore = GoT.characters[0].knownFactIds;

    applyStateEffect(a, {
      targetDomain: 'entity',
      targetId: 'char:ned_stark',
      mutationType: 'increment',
      fieldKey: 'reputationScore',
      payload: 20,
      narrativeDescription: '',
    });
    applyStateEffect(a, {
      targetDomain: 'epistemic',
      targetId: 'char:ned_stark',
      mutationType: 'reveal_fact',
      fieldKey: 'knownFactIds',
      payload: 'fact:cersei_children_bastards',
      narrativeDescription: '',
    });

    expect(a.entityStates['char:ned_stark'].reputationScore).toBe(112);
    expect(b.entityStates['char:ned_stark'].reputationScore).toBe(nedReputationBefore);
    expect(a.epistemics.entityKnownFacts['char:ned_stark']).toContain('fact:cersei_children_bastards');
    expect(b.epistemics.entityKnownFacts['char:ned_stark']).not.toContain('fact:cersei_children_bastards');
    expect(GoT.characters[0].knownFactIds).toBe(defBefore);
  });

  it('【发现】现有求值器未实现 requires_knowledge：认知前提被静默忽略', () => {
    const canon = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:gap' });
    // 奈德并不知情，但求值器仍放行动作 —— requires_knowledge 未被执行
    expect(canon.epistemics.entityKnownFacts['char:ned_stark']).not.toContain('fact:cersei_children_bastards');
    const res = evaluateWorldAction(GoT, canon, 'act:confront_cersei_with_truth', 'char:ned_stark', 'char:cersei_lannister');
    expect(res.isPreconditionSatisfied).toBe(true);
    // P2 事件内核必须实现全部 7 类前提；否则「不知情也能摊牌」构成认知泄漏
  });

  it('同一动作在不同实例产生不同结果（共现前提随初始状态差异）', () => {
    // 测试局部动作：需要共现（求值器已实现的前提类型）；不污染基准定义
    const testAction = {
      ...GoT.actions[0],
      id: 'act:e1:confront_when_present',
      preconditions: [
        {
          type: 'requires_co_presence' as const,
          targetKey: 'char:cersei_lannister',
          expectedValue: true,
          failureMessage: 'Cersei is not present in this location.',
        },
      ],
      potentialConsequences: [],
    };
    const worldWithTestAction = { ...GoT, actions: [...GoT.actions, testAction] };

    // 正典：瑟曦在红堡寝宫，奈德在首相之塔 → 非共现 → 拒绝
    const canon = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:action_canon' });
    // 分歧：瑟曦已到首相之塔 → 共现 → 通过
    const divergent = instantiate(GoT, { scenario: s2Divergence, baseState: GoTBase, instanceId: 'inst:e1:action_div' });

    const resCanon = evaluateWorldAction(worldWithTestAction, canon, testAction.id, 'char:ned_stark', 'char:cersei_lannister');
    const resDiv = evaluateWorldAction(worldWithTestAction, divergent, testAction.id, 'char:ned_stark', 'char:cersei_lannister');

    expect(resCanon.isPreconditionSatisfied).toBe(false);
    expect(resDiv.isPreconditionSatisfied).toBe(true);
    // 分歧实例推进了一回合，正典实例保持不动
    expect(resDiv.nextState.clock.turnNumber).toBe(2);
    expect(canon.clock.turnNumber).toBe(1);
  });

  it('定义动作在分歧实例中触发级联事件（劳勃之死入日志）', () => {
    const divergent = instantiate(GoT, { scenario: s2Divergence, baseState: GoTBase, instanceId: 'inst:e1:action_cascade' });
    const res = evaluateWorldAction(GoT, divergent, 'act:confront_cersei_with_truth', 'char:ned_stark', 'char:cersei_lannister');
    expect(res.spawnedEvents.some(e => e.title.includes('King Robert'))).toBe(true);
    expect(res.nextState.eventChronicleLog.length).toBeGreaterThan(0);
  });

  it('同一状态效果在不同初始值下产生不同绝对结果', () => {
    const a = instantiate(GoT, { scenario: s1Canon, baseState: GoTBase, instanceId: 'inst:e1:fx_a' });
    const c = instantiate(GoT, { scenario: s3PlayerLens, baseState: GoTBase, instanceId: 'inst:e1:fx_c' });

    const effect = {
      targetDomain: 'entity' as const,
      targetId: 'char:ned_stark',
      mutationType: 'decrement' as const,
      fieldKey: 'reputationScore',
      payload: 10,
      narrativeDescription: '',
    };
    applyStateEffect(a, effect);
    applyStateEffect(c, effect);

    expect(a.entityStates['char:ned_stark'].reputationScore).toBe(82); // 92 - 10
    expect(c.entityStates['char:ned_stark'].reputationScore).toBe(40); // 50 - 10
  });
});

// 实验结论记录（供 EXPERIMENTS.md 汇总）
export const E1_VERDICT: { hypothesis: string; result: 'confirmed' | 'falsified' | 'partial'; notes: string[] } = {
  hypothesis: '单一 WorldDefinition + ScenarioSeed 可派生多个互不污染、可表达分歧的 WorldInstance',
  result: 'confirmed',
  notes: [
    'structuredClone 深拷贝保证实例零共享引用（实体/关系/认知数组/资源池均已验证）。',
    '场景种子可表达位置、关系、资源、声誉四类分歧；同动作在正典/分歧实例中产生 拒绝 vs 通过+级联 的差异。',
    '【关键发现】现有 evaluateWorldAction 仅实现 requires_co_presence / requires_capability 两类前提（7 类中 2 类）；requires_knowledge 被静默忽略——「不知情的奈德也能摊牌」构成认知泄漏，P2 内核必须实现全部前提类型。',
  ],
};
