/**
 * HeadConan Routing — Stage A4 (commit & rejection semantics) + Stage A5 (fallback chain) tests.
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A4 / Stage A5.
 * A4 gates:
 *   - single writer: zero world-state mutation outside the kernel's applyEvent.
 *   - rejection is an event: every reject/clarify is observable via the returned record
 *     (reasonCode from the frozen enum, detail for the player/host projection).
 *   - no traceId → no commit: every commit carries a trace; router propagates a single traceId.
 *   - replay determinism: two identical runs ⇒ identical committed final state.
 *   - coverage: every attempt emits exactly one RouteDecisionRecord.
 * A5 gates:
 *   - 4 fault-injection cases (timeout / malformed / 5xx / low-confidence) each assert the
 *     correct next hop AND the recorded fallbackUsed; zero silent failures; zero fabricated state.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { routeUserAction } from './router';
import { resetRouteLog, byFallback, allRouteRecords, byTrace } from './routeLog';
import { isRouteDecisionRecord } from './types';
import type { InterpretationResult } from './interpreter';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../world/spyFamily/spyFamilyMin';
import { instantiate } from '../world/runtime/instantiate';
import type { KernelEvent } from '../world/runtime/kernel2';

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
function mockFetch5xx() {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 })));
}

/** Deterministic stub interpreter: returns a fixed proposal (validator runs for real). */
function stubInterpret(events: KernelEvent[], source: InterpretedSource = 'deterministic', confidence = 0.9, notice?: string) {
  return async (_text: string, _world: unknown, _state: unknown, _actor: string, opts: { traceId?: string }): Promise<InterpretationResult> => {
    const traceId = opts.traceId ?? 'trace:stub';
    return {
      traceId,
      source,
      reality: {
        traceId,
        events,
        stateChanges: [],
        knowledgeChanges: [],
        observations: [],
        confidence,
        rationale: 'stub',
      },
      clarify: source === 'clarify' ? { notice: notice ?? '请说得更具体一些。' } : undefined,
      reasonCode: source === 'clarify' ? 'LOW_CONFIDENCE' : undefined,
      latencyMs: 0,
    };
  };
}
type InterpretedSource = 'llm' | 'deterministic' | 'clarify';

function captureTraceRecorder() {
  let seen: string | undefined;
  const recorder = { seen, record(e: { traceId: string }) { recorder.seen = e.traceId; } };
  return recorder;
}

afterEach(() => {
  vi.unstubAllGlobals();
});
beforeEach(() => {
  resetRouteLog();
});

/* =============================== A4 ================================= */

describe('A4 · commit (validated proposal is the single path into the kernel)', () => {
  it('procedural structured input → commit, state advanced, exactly one valid record', async () => {
    const s = breakfastState();
    const before = structuredClone(s);
    const out = await routeUserAction('夸奖约尔', {
      world: SPY_FAMILY_MIN,
      state: s,
      actorId: SPYF.loid,
      provider: 'procedural',
    });

    expect(out.outcome).toBe('commit');
    if (out.outcome === 'commit') {
      expect(out.nextState.clock.turnNumber).toBe(s.clock.turnNumber + out.applied.length);
      expect(out.applied.every((a) => !a.rejected)).toBe(true);
      expect(out.eventsCommitted).toBeGreaterThanOrEqual(1);
      // single writer: the INPUT state is untouched; only the returned nextState is new
      expect(out.nextState).not.toBe(s);
      expect(s).toEqual(before);
      expect(out.record.outcome).toBe('commit');
      expect(out.record.traceId.length).toBeGreaterThan(0);
      expect(out.record.validatorResults.every((v) => v.passed)).toBe(true);
      expect(isRouteDecisionRecord(out.record)).toBe(true);
      // '夸奖约尔' is open-classified (夸奖 is not a known verb) → LLM path degraded to
      // deterministic → this IS a fallback. The no-fallback case is asserted separately.
      expect(out.record.fallbackUsed).toBe(true);
    }
  });

  it('structured input commits on the deterministic path (no fallback used)', async () => {
    const s = breakfastState();
    const out = await routeUserAction('travel to street', {
      world: SPY_FAMILY_MIN,
      state: s,
      actorId: SPYF.loid,
      provider: 'procedural',
      interpret: stubInterpret([
        { type: 'action', actionId: 'act:spyf:travel', actorId: SPYF.loid, targetIds: [SPYF.street] },
      ]) as never,
    });
    expect(out.outcome).toBe('commit');
    if (out.outcome === 'commit') {
      expect(out.record.pathTaken).toBe('deterministic_parse');
      expect(out.record.fallbackUsed).toBe(false);
      expect(out.eventsCommitted).toBe(1);
      expect(out.nextState.entityStates[SPYF.loid].currentLocationId).toBe(SPYF.street);
    }
  });

  it('no traceId → no commit: every committed record carries the propagated traceId', async () => {
    const s = breakfastState();
    const holder: { traceId?: string } = {};
    // stub interpreter receives the router's traceId
    const stub = async (t: string, w: unknown, st: unknown, a: string, opts: { traceId?: string }): Promise<InterpretationResult> => {
      holder.traceId = opts.traceId;
      return stubInterpret([
        { type: 'speech_act', actorId: SPYF.loid, targetIds: [SPYF.yor], utterance: '你好', intentTag: 'compliment' },
      ])(t, w, st, a, opts);
    };
    const out = await routeUserAction('夸奖约尔', {
      world: SPY_FAMILY_MIN,
      state: s,
      actorId: SPYF.loid,
      provider: 'procedural',
      interpret: stub as never,
    });
    if (out.outcome === 'commit') {
      expect(out.record.traceId).toBe(holder.traceId);
      expect(out.record.traceId.length).toBeGreaterThan(0);
    }
  });
});

describe('A4 · clarify (rejection/proposal gate is observable, no commit)', () => {
  it('low-confidence interpretation → clarify, reasonCode LOW_CONFIDENCE, state untouched', async () => {
    const s = breakfastState();
    const before = structuredClone(s);
    const out = await routeUserAction('嗯', {
      world: SPY_FAMILY_MIN,
      state: s,
      actorId: SPYF.loid,
      provider: 'procedural',
      interpret: stubInterpret([], 'clarify', 0.3, '请说得更具体一些。') as never,
    });

    expect(out.outcome).toBe('clarify');
    if (out.outcome === 'clarify') {
      expect(out.reasonCode).toBe('LOW_CONFIDENCE');
      expect(out.notice.length).toBeGreaterThan(0);
      expect(out.record.outcome).toBe('clarify');
      expect(out.record.reasonCode).toBe('LOW_CONFIDENCE');
      expect(out.record.fallbackUsed).toBe(true);
      expect(isRouteDecisionRecord(out.record)).toBe(true);
    }
    // zero fabricated state: nothing was committed
    expect(s).toEqual(before);
  });
});

describe('A4 · reject (an event, not a silent drop)', () => {
  it('malformed proposal (unknown action) → reject MALFORMED, observable, state untouched', async () => {
    const s = breakfastState();
    const before = structuredClone(s);
    const out = await routeUserAction('x', {
      world: SPY_FAMILY_MIN,
      state: s,
      actorId: SPYF.loid,
      provider: 'procedural',
      interpret: stubInterpret([{ type: 'action', actionId: 'act:spyf:does_not_exist', actorId: SPYF.loid, targetIds: [] }]) as never,
    });

    expect(out.outcome).toBe('reject');
    if (out.outcome === 'reject') {
      expect(out.reasonCode).toBe('MALFORMED');
      expect(out.record.outcome).toBe('reject');
      expect(out.record.reasonCode).toBe('MALFORMED');
      expect(out.record.detail).toBeTruthy(); // projector-ready explanation
      expect(isRouteDecisionRecord(out.record)).toBe(true);
    }
    expect(s).toEqual(before);
  });

  it('proposal with no events (not clarify) → reject MALFORMED (never a silent empty commit)', async () => {
    const s = breakfastState();
    const before = structuredClone(s);
    const out = await routeUserAction('（无有效动作）', {
      world: SPY_FAMILY_MIN,
      state: s,
      actorId: SPYF.loid,
      provider: 'procedural',
      interpret: stubInterpret([], 'deterministic') as never,
    });
    expect(out.outcome).toBe('reject');
    if (out.outcome === 'reject') {
      expect(out.reasonCode).toBe('MALFORMED');
      expect(out.record.outcome).toBe('reject');
    }
    expect(s).toEqual(before);
  });

  it('no_knowledge_path rejection is recorded with its frozen reason code', async () => {
    const s = breakfastState();
    const out = await routeUserAction('让洛德知道约尔是杀手', {
      world: SPY_FAMILY_MIN,
      state: s,
      actorId: SPYF.damian,
      provider: 'procedural',
      interpret: stubInterpret([
        { type: 'reveal_fact', actorId: SPYF.damian, targetId: SPYF.loid, factId: SPYF.factYorAssassin, source: 'observation' },
      ]) as never,
    });
    expect(out.outcome).toBe('reject');
    if (out.outcome === 'reject') {
      expect(out.reasonCode).toBe('NO_KNOWLEDGE_PATH');
    }
  });
});

describe('A4 · replay determinism & single-writer (acceptance)', () => {
  it('two identical runs ⇒ identical committed final state', async () => {
    const s1 = breakfastState();
    const s2 = breakfastState();
    const startTurn = s1.clock.turnNumber;
    const a = await routeUserAction('夸奖约尔', { world: SPY_FAMILY_MIN, state: s1, actorId: SPYF.loid, provider: 'procedural' });
    const b = await routeUserAction('夸奖约尔', { world: SPY_FAMILY_MIN, state: s2, actorId: SPYF.loid, provider: 'procedural' });
    expect(a.outcome).toBe('commit');
    expect(b.outcome).toBe('commit');
    if (a.outcome === 'commit' && b.outcome === 'commit') {
      expect(a.nextState).toEqual(b.nextState);
    }
    // input states were never mutated (single writer)
    expect(s1.clock.turnNumber).toBe(startTurn);
    expect(s2.clock.turnNumber).toBe(startTurn);
  });

  it('route decision coverage: every attempt emits exactly one record', async () => {
    const s = breakfastState();
    const countBefore = allRouteRecords().length;
    await routeUserAction('夸奖约尔', { world: SPY_FAMILY_MIN, state: s, actorId: SPYF.loid, provider: 'procedural' });
    await routeUserAction('夸奖约尔', { world: SPY_FAMILY_MIN, state: s, actorId: SPYF.loid, provider: 'procedural' });
    const added = allRouteRecords().slice(countBefore);
    expect(added).toHaveLength(2);
    // byTrace is able to reconstruct each attempt
    for (const r of added) {
      expect(byTrace(r.traceId)).toHaveLength(1);
    }
  });
});

/* =============================== A5 ================================= */

describe('A5 · fallback & degradation chain (fault injection, real interpreter)', () => {
  // force the open-ended (LLM) path — the fallback trigger we want to observe.
  const ctx = (s: ReturnType<typeof breakfastState>) => ({
    world: SPY_FAMILY_MIN,
    state: s,
    actorId: SPYF.loid,
    provider: 'deepseek-chat' as const,
    inputClass: 'user_open' as const,
  });

  it('timeout (fetch throws) → deterministic hop commits, recorded fallbackUsed', async () => {
    const s = breakfastState();
    mockFetchFailure();
    const out = await routeUserAction('夸奖约尔', ctx(s));
    expect(out.outcome).toBe('commit');
    if (out.outcome === 'commit') {
      expect(out.record.pathTaken).toBe('llm_interpretation');
      expect(out.record.fallbackUsed).toBe(true);
      expect(out.eventsCommitted).toBeGreaterThanOrEqual(1);
    }
  });

  it('malformed JSON → deterministic hop commits, recorded fallbackUsed', async () => {
    const s = breakfastState();
    mockFetchMalformed();
    const out = await routeUserAction('夸奖约尔', ctx(s));
    expect(out.outcome).toBe('commit');
    if (out.outcome === 'commit') {
      expect(out.record.fallbackUsed).toBe(true);
      expect(out.record.pathTaken).toBe('llm_interpretation');
    }
  });

  it('provider 5xx → deterministic hop commits, recorded fallbackUsed', async () => {
    const s = breakfastState();
    mockFetch5xx();
    const out = await routeUserAction('夸奖约尔', ctx(s));
    expect(out.outcome).toBe('commit');
    if (out.outcome === 'commit') {
      expect(out.record.fallbackUsed).toBe(true);
    }
  });

  it('low confidence → clarify (the formal next hop), recorded fallbackUsed, zero committed state', async () => {
    const s = breakfastState();
    mockFetchResponse({ events: [], confidence: 0.3, resolution: '意图不明确。' });
    const before = structuredClone(s);
    const out = await routeUserAction('嗯', ctx(s));
    expect(out.outcome).toBe('clarify');
    if (out.outcome === 'clarify') {
      expect(out.reasonCode).toBe('LOW_CONFIDENCE');
      expect(out.record.fallbackUsed).toBe(true);
    }
    expect(s).toEqual(before);
  });

  it('zero silent failures: every degraded attempt is recorded in the log', async () => {
    const s = breakfastState();
    const before = allRouteRecords().length;
    mockFetchFailure();
    await routeUserAction('夸奖约尔', ctx(s));
    const degraded = byFallback();
    const added = allRouteRecords().slice(before);
    expect(added.length).toBeGreaterThanOrEqual(1);
    // every degraded hop is queryable as a fallback
    expect(degraded.length).toBeGreaterThanOrEqual(added.length);
  });
});