/**
 * HeadConan Routing — Stage A6 tests: observability via the route record registry (RED-FIRST).
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A6.
 *   - route log is an append-only in-memory registry of immutable RouteDecisionRecords.
 *   - queryable: byTrace / byPath / byReasonCode / byFallback / outcomeMix / latencyPercentiles.
 *   - "for any logged traceId, the full path is reconstructible" — byTrace returns the record
 *     whose fields (classification / pathTaken / validatorResults / outcome / reasonCode) carry it.
 *   - Gate-Out: route decision coverage 100% (every attempt emits exactly one record);
 *     latency p95 ≤ 5 ms is asserted at the router layer (proc. overhead, excludes model calls).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { isRouteDecisionRecord } from './types';
import type { RouteDecisionRecord, RoutePath, ReasonCode, RouteOutcome } from './types';
import {
  addRecord,
  byTrace,
  byPath,
  byReasonCode,
  byFallback,
  outcomeMix,
  latencyPercentiles,
  resetRouteLog,
  allRouteRecords,
} from './routeLog';

function rec(
  over: Partial<RouteDecisionRecord> & { traceId: string; routeId: string }
): RouteDecisionRecord {
  return {
    timestamp: '2026-09-09T00:00:00.000Z',
    inputClass: 'user_open',
    classification: 'free-form utterance',
    confidence: 0.9,
    pathTaken: 'llm_interpretation',
    latencyMs: 1,
    fallbackUsed: false,
    validatorResults: [],
    outcome: 'commit',
    ...over,
  };
}

beforeEach(() => {
  resetRouteLog();
});

describe('A6 · route record registry (append-only)', () => {
  it('addRecord appends; allRouteRecords returns them', () => {
    addRecord(rec({ traceId: 'a', routeId: '1', outcome: 'commit' }));
    addRecord(rec({ traceId: 'b', routeId: '2', outcome: 'reject', reasonCode: 'PERMISSION' }));
    expect(allRouteRecords()).toHaveLength(2);
    expect(allRouteRecords()[0].routeId).toBe('1');
    expect(allRouteRecords()[1].routeId).toBe('2');
  });

  it('records added to the log are immutable — the returned snapshot cannot mutate the log', () => {
    addRecord(rec({ traceId: 'a', routeId: '1' }));
    // allRouteRecords() is copy-on-read; mutating the returned (cast) array must not touch the log
    const leak = allRouteRecords() as RouteDecisionRecord[];
    leak.push(rec({ traceId: 'x', routeId: '9' }));
    leak[0] = { ...leak[0], outcome: 'reject' };
    expect(allRouteRecords()).toHaveLength(1);
    expect(allRouteRecords()[0].outcome).toBe('commit');
  });

  it('every record in the log passes isRouteDecisionRecord (100% route decision coverage baseline)', () => {
    addRecord(rec({ traceId: 'a', routeId: '1' }));
    addRecord(rec({ traceId: 'b', routeId: '2', outcome: 'reject', reasonCode: 'MALFORMED', validatorResults: [] }));
    addRecord(rec({ traceId: 'c', routeId: '3', outcome: 'clarify', reasonCode: 'LOW_CONFIDENCE', fallbackUsed: true }));
    for (const r of allRouteRecords()) {
      expect(isRouteDecisionRecord(r)).toBe(true);
    }
  });
});

describe('A6 · query API', () => {
  it('byTrace reconstructs the full record for a traceId', () => {
    addRecord(rec({ traceId: 't1', routeId: '1', outcome: 'reject', reasonCode: 'NO_KNOWLEDGE_PATH', pathTaken: 'llm_interpretation' }));
    addRecord(rec({ traceId: 't2', routeId: '2' }));
    expect(byTrace('t1')).toHaveLength(1);
    expect(byTrace('t1')[0].reasonCode).toBe('NO_KNOWLEDGE_PATH');
    expect(byTrace('nope')).toEqual([]);
  });

  it('byPath filters by pathTaken', () => {
    addRecord(rec({ traceId: 'a', routeId: '1', pathTaken: 'deterministic_parse' }));
    addRecord(rec({ traceId: 'b', routeId: '2', pathTaken: 'llm_interpretation' }));
    addRecord(rec({ traceId: 'c', routeId: '3', pathTaken: 'llm_interpretation' }));
    expect(byPath('llm_interpretation')).toHaveLength(2);
    const paths = allRouteRecords().map((r) => r.pathTaken) as RoutePath[];
    expect(paths).toContain('deterministic_parse');
  });

  it('byReasonCode filters the frozen reason codes', () => {
    addRecord(rec({ traceId: 'a', routeId: '1', outcome: 'reject', reasonCode: 'PERMISSION' }));
    addRecord(rec({ traceId: 'b', routeId: '2', outcome: 'reject', reasonCode: 'TIMEOUT' }));
    addRecord(rec({ traceId: 'c', routeId: '3', outcome: 'commit' }));
    expect(byReasonCode('TIMEOUT' as ReasonCode)).toHaveLength(1);
    expect(byReasonCode('PERMISSION' as ReasonCode)[0].routeId).toBe('1');
  });

  it('byFallback returns only degraded attempts', () => {
    addRecord(rec({ traceId: 'a', routeId: '1', fallbackUsed: true, outcome: 'clarify', reasonCode: 'LOW_CONFIDENCE' }));
    addRecord(rec({ traceId: 'b', routeId: '2', fallbackUsed: false }));
    expect(byFallback()).toHaveLength(1);
    expect(byFallback()[0].traceId).toBe('a');
  });

  it('outcomeMix tallies the full outcome vocabulary', () => {
    addRecord(rec({ traceId: 'a', routeId: '1', outcome: 'commit' }));
    addRecord(rec({ traceId: 'b', routeId: '2', outcome: 'commit' }));
    addRecord(rec({ traceId: 'c', routeId: '3', outcome: 'reject', reasonCode: 'IMPOSSIBLE' }));
    addRecord(rec({ traceId: 'd', routeId: '4', outcome: 'clarify', reasonCode: 'LOW_CONFIDENCE' }));
    const mix = outcomeMix();
    expect(mix.commit).toBe(2);
    expect(mix.reject).toBe(1);
    expect(mix.clarify).toBe(1);
    const keys = Object.keys(mix) as RouteOutcome[];
    expect(new Set(keys)).toEqual(new Set(['commit', 'clarify', 'reject', 'skip', 'requeue']));
  });

  it('latencyPercentiles returns p50/p95 over appended latencies', () => {
    for (let i = 1; i <= 20; i += 1) {
      addRecord(rec({ traceId: `t${i}`, routeId: String(i), latencyMs: i }));
    }
    const p = latencyPercentiles();
    // nearest-rank percentiles over 20 → p50 = 10th (idx 9), p95 = 19th (idx 18)
    expect(p.p50).toBe(10);
    expect(p.p95).toBe(19);
  });

  it('latencyPercentiles is zero on an empty log (no fabricated data)', () => {
    expect(latencyPercentiles()).toEqual({ p50: 0, p95: 0 });
  });
});