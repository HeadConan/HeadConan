import { describe, it, expect } from 'vitest';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../spyFamily/spyFamilyMin';
import { spyFamilyRelationResolver, spyFamilyReaction, spyFamilyAgentReaction } from '../spyFamily/spyFamilyReactions';
import { instantiate } from './instantiate';
import { applyEvent, type KernelEvent } from './kernel2';
import { perceiveFor, decideNpc, runAgentLoop } from './agentLoop';

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

/** 玩家问 Yor 昨晚去向的刺激（Step 2 的怀疑种子） */
function askYorAboutLastNight(): KernelEvent {
  return {
    type: 'speech_act',
    actorId: SPYF.loid,
    targetIds: [SPYF.yor],
    utterance: '你昨晚去哪了？',
    intentTag: 'ask',
    topic: 'last night',
  };
}

describe('W3.4 代理循环：投影隔离断言（泄漏即证伪）', () => {
  it('Yor 的感知只含自身认知账本（不含 factLoidTwilight）', () => {
    const s = breakfastState();
    const p = perceiveFor(SPYF.yor, SPY_FAMILY_MIN, s);
    expect(p.knownFactIds).not.toContain(SPYF.factLoidTwilight);
    expect(p.knownFactIds).toContain(SPYF.factYorAssassin);
  });

  it('Loid 的感知不含 factYorAssassin（互不知晓秘密）', () => {
    const s = breakfastState();
    const p = perceiveFor(SPYF.loid, SPY_FAMILY_MIN, s);
    expect(p.knownFactIds).not.toContain(SPYF.factYorAssassin);
    expect(p.knownFactIds).toContain(SPYF.factLoidTwilight);
  });

  it('Anya 的感知含 factYorAssassin（她知道自己妈妈是杀手）', () => {
    const s = breakfastState();
    const p = perceiveFor(SPYF.anya, SPY_FAMILY_MIN, s);
    expect(p.knownFactIds).toContain(SPYF.factYorAssassin);
  });

  it('感知包含现场共现实体与自身参与的关系快照', () => {
    const s = breakfastState();
    const p = perceiveFor(SPYF.yor, SPY_FAMILY_MIN, s);
    expect(p.coPresent).toContain(SPYF.loid);
    expect(p.coPresent).toContain(SPYF.anya);
    expect(p.relationshipSnapshot[SPYF.relMarriage]).toBeDefined();
    // 不包含非参与关系（Anya–Damian 与 Yor 无关）
    expect(p.relationshipSnapshot[SPYF.relAnyaDamian]).toBeUndefined();
  });
});

describe('W3.4 代理循环：Anya 自主插话（Step 3）', () => {
  it('Anya 在 Yor 被问及昨晚去向时自主插话', async () => {
    const s = breakfastState();
    const decision = await decideNpc(
      { npcId: SPYF.anya, world: SPY_FAMILY_MIN, state: s, stimulus: askYorAboutLastNight(), budget: 1 },
      { propose: async () => null, fallback: spyFamilyAgentReaction }
    );
    expect(decision.source).toBe('deterministic');
    expect(decision.events).toHaveLength(1);
    const ev = decision.events[0];
    expect(ev.type).toBe('speech_act');
    if (ev.type === 'speech_act') {
      expect(ev.actorId).toBe(SPYF.anya);
      expect(ev.targetIds).toEqual([SPYF.yor]);
      expect(ev.utterance).toContain('妈妈又杀人');
    }
  });

  it('Anya 在无关刺激下不插话', async () => {
    const s = breakfastState();
    const stimulus: KernelEvent = {
      type: 'speech_act',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
      utterance: '今天的晚餐真棒',
      intentTag: 'compliment',
    };
    const decision = await decideNpc(
      { npcId: SPYF.anya, world: SPY_FAMILY_MIN, state: s, stimulus, budget: 1 },
      { propose: async () => null, fallback: spyFamilyAgentReaction }
    );
    expect(decision.events).toHaveLength(0);
  });

  it('非 Anya NPC 不产生自主动作（仅对话决策点）', async () => {
    const s = breakfastState();
    const decision = await decideNpc(
      { npcId: SPYF.yor, world: SPY_FAMILY_MIN, state: s, stimulus: askYorAboutLastNight(), budget: 1 },
      { propose: async () => null, fallback: spyFamilyAgentReaction }
    );
    expect(decision.events).toHaveLength(0);
  });
});

describe('W3.4 代理循环：确定性回退（LLM 不可用不硬阻塞）', () => {
  it('LLM 提议抛错 → 确定性回退（source=deterministic）', async () => {
    const s = breakfastState();
    const decision = await decideNpc(
      { npcId: SPYF.anya, world: SPY_FAMILY_MIN, state: s, stimulus: askYorAboutLastNight(), budget: 1 },
      {
        propose: async () => {
          throw new Error('LLM 不可用');
        },
        fallback: spyFamilyAgentReaction,
      }
    );
    expect(decision.source).toBe('deterministic');
    expect(decision.events).toHaveLength(1);
  });

  it('Step 2/4 节拍回归：Yor 对"昨晚去哪"的 cover 回应与 W1 一致', () => {
    const s = breakfastState();
    const r = applyEvent(
      SPY_FAMILY_MIN,
      s,
      {
        type: 'speech_act',
        actorId: SPYF.loid,
        targetIds: [SPYF.yor],
        utterance: '你昨晚去哪了？',
        intentTag: 'ask',
      },
      { relationResolver: spyFamilyRelationResolver, reactions: spyFamilyReaction }
    );
    expect(r.responses[0].text).toContain('市政厅加班');
  });
});

describe('W3.4 代理循环：预算上限', () => {
  it('budget<=0 → 不决策', async () => {
    const s = breakfastState();
    const decision = await decideNpc(
      { npcId: SPYF.anya, world: SPY_FAMILY_MIN, state: s, stimulus: askYorAboutLastNight(), budget: 0 },
      { propose: async () => null, fallback: spyFamilyAgentReaction }
    );
    expect(decision.events).toHaveLength(0);
  });

  it('runAgentLoop 总预算限制决策数（多 NPC 场景）', async () => {
    const s = breakfastState();
    const result = await runAgentLoop(s, SPY_FAMILY_MIN, SPYF.loid, askYorAboutLastNight(), {
      propose: async () => null,
      fallback: spyFamilyAgentReaction,
      totalBudget: 1,
    });
    // 早餐场景中 Loid 共现 NPC = [Yor, Anya, Bond]；总预算 1 → 仅 1 次决策
    expect(result.decisions.length).toBe(1);
  });

  it('runAgentLoop 端到端：Anya 插话经内核接受并写入日志', async () => {
    const s = breakfastState();
    const result = await runAgentLoop(s, SPY_FAMILY_MIN, SPYF.loid, askYorAboutLastNight(), {
      propose: async () => null,
      fallback: spyFamilyAgentReaction,
    });
    const anyaSpeech = result.nextState.eventChronicleLog.find(
      e => e.description.includes('安雅') && e.description.includes('妈妈又杀人')
    );
    expect(anyaSpeech).toBeDefined();
  });
});
