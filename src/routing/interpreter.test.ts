/**
 * HeadConan Routing — Stage A2 tests: interpretation → Proposed Reality (RED-FIRST).
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A2.
 * Contract amendments under test:
 *   A2-1  ProposedReality.events: string[] → KernelEvent[] (routing/types.ts).
 *   A2-2  change-arrays (stateChanges / knowledgeChanges / observations) are
 *         kernel-derived at commit — the interpreter emits them empty.
 *   A2-3  the interpreter is provably pure: same input + recorded model output
 *         ⇒ same ProposedReality content; state is never read-modify-write.
 *
 * Gate-Out:
 *   - 100% of interpreter outputs pass isProposedReality with a non-empty traceId
 *   - purity: deep-equal state before/after in every test
 *   - procedural p95 ≤ 50 ms
 *   - zero derived changes emitted by the interpreter
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { interpret } from './interpreter';
import { isProposedReality, REASON_CODES } from './types';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../world/spyFamily/spyFamilyMin';
import { instantiate } from '../world/runtime/instantiate';

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

function mockFetchResponse(data: unknown) {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => data,
  })));
}

function mockFetchMalformed() {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => {
      throw new SyntaxError('invalid JSON');
    },
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

describe('A2 · purity (interpretation never mutates state)', () => {
  it('procedural interpret leaves state deep-equal before/after', async () => {
    const s = breakfastState();
    const before = structuredClone(s);
    await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'procedural' });
    expect(s).toEqual(before);
  });
});

describe('A2 · envelope (ProposedReality + traceId)', () => {
  it('output passes isProposedReality and carries a non-empty traceId', async () => {
    const s = breakfastState();
    const r = await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'procedural' });
    expect(r.traceId.length).toBeGreaterThan(0);
    expect(r.reality.traceId).toBe(r.traceId);
    expect(isProposedReality(r.reality)).toBe(true);
  });
});

describe('A2 · deterministic path', () => {
  it("provider 'procedural' → source 'deterministic', events match kernel2Resolver shape, confidence 0–1", async () => {
    const s = breakfastState();
    const r = await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'procedural' });
    expect(r.source).toBe('deterministic');
    expect(r.reality.events).toHaveLength(1);
    expect(r.reality.events[0]).toMatchObject({
      type: 'speech_act',
      actorId: SPYF.loid,
      targetIds: [SPYF.yor],
      intentTag: 'compliment',
    });
    expect(r.reality.confidence).toBeGreaterThanOrEqual(0);
    expect(r.reality.confidence).toBeLessThanOrEqual(1);
  });
});

describe('A2 · LLM path (offline mock)', () => {
  it('mock /api/propose-events → valid events → source llm', async () => {
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
    const r = await interpret('昨晚你去哪了', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'deepseek-chat' });
    expect(r.source).toBe('llm');
    expect(r.reality.events).toHaveLength(1);
    expect(r.reality.events[0]).toMatchObject({ type: 'speech_act', actorId: SPYF.loid });
    expect(r.reality.confidence).toBe(0.95);
  });
});

describe('A2 · clarify propagation', () => {
  it('low-confidence LLM → source clarify, events [], notice present, reasonCode LOW_CONFIDENCE', async () => {
    const s = breakfastState();
    mockFetchResponse({
      events: [{ type: 'speech_act', actorId: SPYF.loid, targetIds: [SPYF.yor], utterance: '嗯', intentTag: 'say' }],
      confidence: 0.4,
      resolution: '意图不明确。',
    });
    const r = await interpret('嗯', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'deepseek-chat' });
    expect(r.source).toBe('clarify');
    expect(r.reality.events).toHaveLength(0);
    expect(r.clarify?.notice).toBeTruthy();
    expect(r.reasonCode).toBe('LOW_CONFIDENCE');
    expect(REASON_CODES).toContain('LOW_CONFIDENCE');
  });
});

describe('A2 · malformed LLM output never blocks', () => {
  it('invalid JSON → deterministic fallback', async () => {
    const s = breakfastState();
    mockFetchMalformed();
    const r = await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'deepseek-chat' });
    expect(r.source).toBe('deterministic');
    expect(r.reality.events.length).toBeGreaterThan(0);
  });

  it('empty / non-array events → deterministic fallback', async () => {
    const s = breakfastState();
    mockFetchResponse({ fallback: true, events: null, confidence: 0.9 });
    const r = await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'deepseek-chat' });
    expect(r.source).toBe('deterministic');
    expect(r.reality.events.length).toBeGreaterThan(0);
  });
});

describe('A2 · timeout LLM', () => {
  it('rejected fetch → deterministic fallback with latencyMs recorded', async () => {
    const s = breakfastState();
    mockFetchFailure();
    const r = await interpret('前往伊甸学园走廊', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'deepseek-chat' });
    expect(r.source).toBe('deterministic');
    expect(r.reality.events[0]).toMatchObject({ type: 'action', actionId: 'act:spyf:travel' });
    expect(r.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

describe('A2 · no derived changes (interpretation proposes, kernel derives)', () => {
  it('every source emits empty stateChanges / knowledgeChanges / observations', async () => {
    const s = breakfastState();
    // deterministic
    const det = await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'procedural' });
    // llm
    mockFetchResponse({
      events: [{ type: 'speech_act', actorId: SPYF.loid, targetIds: [SPYF.yor], utterance: '你好', intentTag: 'say' }],
      confidence: 0.9,
      resolution: '打招呼。',
    });
    const llm = await interpret('你好', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'deepseek-chat' });
    // clarify
    mockFetchResponse({ events: [], confidence: 0.3, resolution: '不清楚。' });
    const clarify = await interpret('嗯', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'deepseek-chat' });

    for (const r of [det, llm, clarify]) {
      expect(r.reality.stateChanges).toEqual([]);
      expect(r.reality.knowledgeChanges).toEqual([]);
      expect(r.reality.observations).toEqual([]);
    }
  });
});

describe('A2 · schema purity (deterministic reproducibility)', () => {
  it('same input twice (procedural) ⇒ deep-equal reality content', async () => {
    const s = breakfastState();
    const a = await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'procedural' });
    const b = await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'procedural' });
    expect(a.reality.events).toEqual(b.reality.events);
    expect(a.reality.confidence).toEqual(b.reality.confidence);
    expect(a.reality.rationale).toEqual(b.reality.rationale);
    // each attempt is its own trace — never shared
    expect(a.traceId).not.toBe(b.traceId);
    expect(a.traceId.length).toBeGreaterThan(0);
    expect(b.traceId.length).toBeGreaterThan(0);
  });
});

describe('A2 · offline latency budget', () => {
  it('procedural path p95 ≤ 50 ms', async () => {
    const s = breakfastState();
    const latencies: number[] = [];
    for (let i = 0; i < 100; i += 1) {
      const t0 = performance.now();
      await interpret('夸奖约尔', SPY_FAMILY_MIN, s, SPYF.loid, { provider: 'procedural' });
      latencies.push(performance.now() - t0);
    }
    latencies.sort((x, y) => x - y);
    const p95 = latencies[Math.min(94, latencies.length - 1)];
    expect(p95).toBeLessThanOrEqual(50);
  });
});
