import { describe, it, expect, vi, afterEach } from 'vitest';
import { proposeUserEvents } from '../../ai/propose';
import { resolveUserAction } from './kernel2Resolver';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../spyFamily/spyFamilyMin';
import { instantiate } from './instantiate';
import { applyEvent } from './kernel2';

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

function mockFetchResponse(data: unknown) {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => data,
  })));
}

function mockFetchFailure() {
  vi.stubGlobal('fetch', vi.fn(async () => {
    throw new Error('network down');
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('W3.2 LLM 提议：LLM 固件 → 候选事件经校验进入内核', () => {
  it('LLM 提议 speech_act → 校验通过 → applyEvent 真实写入', async () => {
    const s = breakfastState();
    mockFetchResponse({
      events: [
        {
          type: 'speech_act',
          actorId: SPYF.loid,
          targetIds: [SPYF.yor],
          utterance: '昨晚你去哪了？',
          intentTag: 'ask',
          topic: 'last night',
        },
      ],
      confidence: 0.95,
      resolution: '洛德询问约尔昨晚去向。',
    });

    const proposed = await proposeUserEvents('昨晚你去哪了', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'deepseek-chat',
      fallback: resolveUserAction,
    });

    expect(proposed.source).toBe('llm');
    expect(proposed.confidence).toBe(0.95);
    expect(proposed.events).toHaveLength(1);
    expect(proposed.events[0]).toMatchObject({
      type: 'speech_act',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
    });
    // W3.1 接线：speech_act → conversation 场景意图
    expect(proposed.sceneHint).toEqual({ type: 'talk', targetId: SPYF.yor });

    const r = applyEvent(SPY_FAMILY_MIN, s, proposed.events[0], {});
    expect(r.rejected).toBeFalsy();
    expect(r.nextState.clock.turnNumber).toBe(s.clock.turnNumber + 1);
  });

  it('LLM 提议 travel 动作 → 校验通过 → 状态真实变化', async () => {
    const s = breakfastState();
    mockFetchResponse({
      events: [
        { type: 'action', actionId: 'act:spyf:travel', actorId: SPYF.loid, targetIds: [SPYF.corridor] },
      ],
      confidence: 0.9,
      resolution: '洛德前往伊甸学园走廊。',
    });

    const proposed = await proposeUserEvents('去走廊', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'deepseek-chat',
      fallback: resolveUserAction,
    });

    expect(proposed.source).toBe('llm');
    expect(proposed.sceneHint).toEqual({ type: 'travel', targetId: SPYF.corridor });

    const r = applyEvent(SPY_FAMILY_MIN, s, proposed.events[0], {});
    expect(r.rejected).toBeFalsy();
    expect(r.nextState.entityStates[SPYF.loid].currentLocationId).toBe(SPYF.corridor);
  });
});

describe('W3.2 LLM 提议：LLM 不可用 → 确定性回退，体验不阻塞', () => {
  it('fetch 失败 → 确定性解析器回退', async () => {
    const s = breakfastState();
    mockFetchFailure();

    const proposed = await proposeUserEvents('前往伊甸学园走廊', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'deepseek-chat',
      fallback: resolveUserAction,
    });

    expect(proposed.source).toBe('deterministic');
    expect(proposed.events.length).toBeGreaterThan(0);
    expect(proposed.events[0]).toMatchObject({
      type: 'action',
      actionId: 'act:spyf:travel',
      targetIds: [SPYF.corridor],
    });
    expect(proposed.sceneHint).toEqual({ type: 'travel', targetId: SPYF.corridor });
  });

  it('procedural 引擎 → 直接确定性回退（无网络）', async () => {
    const s = breakfastState();
    const proposed = await proposeUserEvents('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'procedural',
      fallback: resolveUserAction,
    });
    expect(proposed.source).toBe('deterministic');
    expect(proposed.events[0]).toMatchObject({ type: 'speech_act', intentTag: 'compliment' });
  });
});

describe('W3.2 LLM 提议：低置信 → 澄清提示，不产生事件', () => {
  it('LLM 置信 < 0.6 → source=clarify，events 为空', async () => {
    const s = breakfastState();
    mockFetchResponse({
      events: [
        { type: 'speech_act', actorId: SPYF.loid, targetIds: [SPYF.yor], utterance: '嗯', intentTag: 'say' },
      ],
      confidence: 0.4,
      resolution: '意图不明确。',
    });

    const proposed = await proposeUserEvents('嗯', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'deepseek-chat',
      fallback: resolveUserAction,
    });

    expect(proposed.source).toBe('clarify');
    expect(proposed.events).toHaveLength(0);
    expect(proposed.notice).toBeTruthy();
  });
});

describe('W3.2 LLM 提议：非法事件 → 客户端校验拒绝，不进入内核', () => {
  it('未知实体 ID → 校验拒绝 → 落入确定性回退（合法事件）', async () => {
    const s = breakfastState();
    mockFetchResponse({
      events: [
        {
          type: 'speech_act',
          actorId: 'char:unknown:ghost',
          targetIds: [SPYF.yor],
          utterance: '你好',
          intentTag: 'say',
        },
      ],
      confidence: 0.9,
      resolution: '对幽灵说话。',
    });

    const proposed = await proposeUserEvents('对幽灵说话', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'deepseek-chat',
      fallback: resolveUserAction,
    });

    expect(proposed.source).toBe('deterministic');
    // 非法事件未进入内核：回退产生的事件 actor 必须是合法实体
    expect(proposed.events.every(ev => ev.type === 'speech_act' && ev.actorId === SPYF.loid)).toBe(true);
  });

  it('未知动作 ID → 校验拒绝 → 确定性回退', async () => {
    const s = breakfastState();
    mockFetchResponse({
      events: [
        { type: 'action', actionId: 'act:unknown:fly', actorId: SPYF.loid, targetIds: [SPYF.corridor] },
      ],
      confidence: 0.9,
      resolution: '飞行。',
    });

    const proposed = await proposeUserEvents('飞过去', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'deepseek-chat',
      fallback: resolveUserAction,
    });

    expect(proposed.source).toBe('deterministic');
    expect(proposed.events.every(ev => ev.type === 'action' && ev.actionId === 'act:spyf:travel')).toBe(true);
  });

  it('LLM 提议 reveal_fact → 玩家路径拒绝（导演通道专用）', async () => {
    const s = breakfastState();
    mockFetchResponse({
      events: [
        { type: 'reveal_fact', targetId: SPYF.loid, factId: SPYF.factYorAssassin, source: 'host' },
      ],
      confidence: 0.95,
      resolution: '注入约尔是杀手的秘密。',
    });

    const proposed = await proposeUserEvents('让洛德知道约尔是杀手', SPY_FAMILY_MIN, s, SPYF.loid, {
      provider: 'deepseek-chat',
      fallback: resolveUserAction,
    });

    // reveal_fact 被客户端拒绝 → 确定性回退（不产生 reveal_fact）
    expect(proposed.source).toBe('deterministic');
    expect(proposed.events.some(ev => ev.type === 'reveal_fact')).toBe(false);
  });
});
