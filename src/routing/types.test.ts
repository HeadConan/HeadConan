/**
 * HeadConan Routing — Stage A0 contract tests (RED-FIRST).
 *
 * Gate-Out for Stage A0 (docs/ROUTING_PLAN.md):
 *   - schema compiles
 *   - 100% of RouteDecisionRecord fields documented
 *   - zero `any` in routing types
 *   - a record missing traceId / outcome is rejected (type-level + runtime)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  ROUTE_INPUT_CLASSES,
  ROUTE_PATHS,
  ROUTE_OUTCOMES,
  REASON_CODES,
  isRouteDecisionRecord,
  isProposedReality,
} from './types';
import type {
  RouteInputClass,
  RoutePath,
  RouteOutcome,
  ReasonCode,
  RouteRequest,
  RouteDecisionRecord,
  ProposedReality,
} from './types';

const src = readFileSync(path.join(__dirname, 'types.ts'), 'utf8');

/** a fully valid record used as the "happy path" baseline */
const validRecord: RouteDecisionRecord = {
  routeId: 'route:1',
  traceId: 'trace:abc',
  timestamp: '2026-08-31T00:00:00.000Z',
  inputClass: 'user_open',
  classification: 'open-ended request',
  confidence: 0.82,
  pathTaken: 'llm_interpretation',
  latencyMs: 412,
  fallbackUsed: false,
  validatorResults: [{ constraint: 'contradiction', passed: true }],
  outcome: 'commit',
};

describe('A0 · frozen vocabulary', () => {
  it('input classes are exactly the six routing classes', () => {
    expect([...ROUTE_INPUT_CLASSES].sort()).toEqual(
      ['definition_change', 'host_intervention', 'npc', 'scheduled', 'user_open', 'user_structured'].sort()
    );
  });

  it('paths cover interpretation, parsing, policy, privileged, rule and ledger', () => {
    expect(ROUTE_PATHS).toContain('llm_interpretation');
    expect(ROUTE_PATHS).toContain('deterministic_parse');
    expect(ROUTE_PATHS).toContain('policy_proposal');
    expect(ROUTE_PATHS).toContain('privileged_interpretation');
    expect(ROUTE_PATHS).toContain('rule_emit');
    expect(ROUTE_PATHS).toContain('version_ledger');
  });

  it('outcomes are commit / clarify / reject / skip / requeue only', () => {
    expect([...ROUTE_OUTCOMES].sort()).toEqual(['clarify', 'commit', 'reject', 'requeue', 'skip']);
  });

  it('reason codes are the frozen enum (no ad-hoc strings)', () => {
    expect([...REASON_CODES].sort()).toEqual(
      [
        'CONTRADICTION',
        'IMPOSSIBLE',
        'LOW_CONFIDENCE',
        'MALFORMED',
        'NO_KNOWLEDGE_PATH',
        'OUT_OF_CIRCUMSTANCE',
        'PERMISSION',
        'RULE_VIOLATION',
        'TIMEOUT',
      ].sort()
    );
  });
});

describe('A0 · type-level rejection (compile-time contract)', () => {
  it('a record without traceId must not typecheck', () => {
    // @ts-expect-error — traceId is required
    const bad: RouteDecisionRecord = { ...validRecord, traceId: undefined };
    expect(bad).toBeDefined();
  });

  it('a record without outcome must not typecheck', () => {
    const { outcome: _omitted, ...rest } = validRecord;
    // @ts-expect-error — outcome is required
    const bad: RouteDecisionRecord = rest;
    expect(bad).toBeDefined();
  });

  it('an unknown input class must not typecheck', () => {
    // @ts-expect-error — 'guest_action' is not a routing input class
    const bad: RouteInputClass = 'guest_action';
    expect(bad).toBeDefined();
  });

  it('an unknown reason code must not typecheck', () => {
    // @ts-expect-error — reason codes are frozen
    const bad: ReasonCode = 'BECAUSE_I_SAID_SO';
    expect(bad).toBeDefined();
  });

  it('unknown path / outcome must not typecheck', () => {
    // @ts-expect-error — path vocabulary is frozen
    const p: RoutePath = 'vibes';
    // @ts-expect-error — outcome vocabulary is frozen
    const o: RouteOutcome = 'maybe';
    expect([p, o]).toBeDefined();
  });
});

describe('A0 · runtime guard (rejects incomplete records)', () => {
  it('accepts a complete record', () => {
    expect(isRouteDecisionRecord(validRecord)).toBe(true);
  });

  it('rejects a record missing traceId', () => {
    const { traceId: _drop, ...rest } = validRecord;
    expect(isRouteDecisionRecord(rest)).toBe(false);
  });

  it('rejects a record missing outcome', () => {
    const { outcome: _drop, ...rest } = validRecord;
    expect(isRouteDecisionRecord(rest)).toBe(false);
  });

  it('rejects a record with an illegal enum value', () => {
    expect(isRouteDecisionRecord({ ...validRecord, outcome: 'maybe' })).toBe(false);
    expect(isRouteDecisionRecord({ ...validRecord, inputClass: 'guest' })).toBe(false);
    expect(isRouteDecisionRecord({ ...validRecord, reasonCode: 'NOPE' })).toBe(false);
  });

  it('rejects a record whose validatorResults are malformed', () => {
    expect(isRouteDecisionRecord({ ...validRecord, validatorResults: [{ constraint: 'x' }] })).toBe(false);
  });

  it('rejects non-objects', () => {
    expect(isRouteDecisionRecord(null)).toBe(false);
    expect(isRouteDecisionRecord('route:1')).toBe(false);
    expect(isRouteDecisionRecord(undefined)).toBe(false);
  });
});

describe('A0 · ProposedReality guard', () => {
  const valid: ProposedReality = {
    traceId: 'trace:abc',
    events: [],
    stateChanges: [],
    knowledgeChanges: [],
    observations: [],
    confidence: 0.7,
    rationale: 'user mentioned a fact only the assassin could know',
  };

  it('accepts a complete proposal', () => {
    expect(isProposedReality(valid)).toBe(true);
  });

  it('rejects a proposal without traceId (no trace → no commit)', () => {
    const { traceId: _drop, ...rest } = valid;
    expect(isProposedReality(rest)).toBe(false);
  });

  it('rejects a proposal missing the change arrays', () => {
    const { events: _e, ...rest } = valid;
    expect(isProposedReality(rest)).toBe(false);
  });
});

describe('A0 · hygiene gates', () => {
  it('routing types contain zero `any`', () => {
    expect(src).not.toMatch(/:\s*any\b/);
    expect(src).not.toMatch(/as\s+any\b/);
    expect(src).not.toMatch(/<any>/);
  });

  it('RouteRequest and RouteDecisionRecord are documented with a field comment', () => {
    expect(src).toMatch(/RouteRequest\s*\{/);
    expect(src).toMatch(/RouteDecisionRecord\s*\{/);
    expect(src).toMatch(/ProposedReality\s*\{/);
  });
});
