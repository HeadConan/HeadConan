/**
 * HeadConan Routing — Stage A3 tests: constraint-bounded validator (RED-FIRST).
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A3.
 * Positioning alignment: POSITIONING.md §4.3 — constraints preserve continuity,
 * not replace intelligence: contradictions with established facts, impossible
 * actions, rule violations, knowledge without a plausible path, entities acting
 * outside their circumstances, permission envelopes.
 *
 * Gate-Out (quantified):
 *   - 100% pass on the adversarial set (≥ 20 cases); every rejection carries a reasonCode
 *   - false-reject rate on valid actions ≤ 2% (golden set below: 12 valid actions)
 *   - each constraint family has ≥ 3 tests (pass + reject + boundary)
 *
 * RED-FIRST: this file is written before `validator.ts` exists.
 */

import { describe, it, expect } from 'vitest';
import { validateProposal, CONSTRAINT_FAMILIES } from './validator';
import { REASON_CODES } from './types';
import type { ProposedReality, ValidatorResult, RouteInputClass } from './types';
import type { KernelEvent, SpeechIntentTag } from '../world/runtime/kernel2';
import type { WorldDefinition } from '../world/representation/types/definition';
import type { WorldActionDefinition } from '../world/representation/types/dynamics';
import { SPY_FAMILY_MIN, SPY_FAMILY_SCENARIOS, SPYF } from '../world/spyFamily/spyFamilyMin';
import { instantiate } from '../world/runtime/instantiate';

/* ------------------------------------------------------------------ */
/* Fixtures                                                           */
/* ------------------------------------------------------------------ */

function breakfastState() {
  return instantiate(SPY_FAMILY_MIN, { scenario: SPY_FAMILY_SCENARIOS.breakfast });
}

function proposal(events: KernelEvent[], confidence = 0.95): ProposedReality {
  return {
    traceId: 'trace:test',
    events,
    stateChanges: [],
    knowledgeChanges: [],
    observations: [],
    confidence,
    rationale: 'A3 test proposal',
  };
}

/** Realistic role resolution for the SPY×FAMILY slice (mirrors spyFamilyRoleOf). */
function spyRoles(id: string): string[] {
  if (id === SPYF.loid) return ['spy', 'player_loid', 'parent'];
  if (id === SPYF.yor) return ['assassin', 'clerk'];
  if (id === SPYF.anya) return ['telepath', 'student'];
  return [];
}

function speech(actorId: string, targetIds: string[], utterance: string, intentTag: SpeechIntentTag): KernelEvent {
  return { type: 'speech_act', actorId, targetIds, utterance, intentTag };
}

function action(actionId: string, actorId: string, targetIds: string[]): KernelEvent {
  return { type: 'action', actionId, actorId, targetIds };
}

function reveal(source: 'host' | 'observation' | 'discovery', actorId: string | undefined, targetId: string, factId: string): KernelEvent {
  return { type: 'reveal_fact', actorId, targetId, factId, source };
}

/** World with extra test-only actions that exercise authority/resource/trust/knowledge preconditions. */
function worldWith(...extra: WorldActionDefinition[]): WorldDefinition {
  return { ...SPY_FAMILY_MIN, actions: [...SPY_FAMILY_MIN.actions, ...extra] };
}

const EXTRA_ACTIONS: WorldActionDefinition[] = [
  {
    id: 'act:test:enter_vault',
    name: '进入金库',
    category: 'physical',
    description: '',
    actorEligibilityRoles: [],
    preconditions: [
      { type: 'requires_authority', targetKey: '', expectedValue: 'enter:vault', failureMessage: '没有金库权限。' },
    ],
    directEffects: [],
    potentialConsequences: [],
  },
  {
    id: 'act:test:enter_city_hall',
    name: '进入市政厅',
    category: 'physical',
    description: '',
    actorEligibilityRoles: [],
    preconditions: [
      { type: 'requires_authority', targetKey: '', expectedValue: 'enter:city_hall', failureMessage: '没有市政厅权限。' },
    ],
    directEffects: [],
    potentialConsequences: [],
  },
  {
    id: 'act:test:enter_eden',
    name: '进入伊甸',
    category: 'physical',
    description: '',
    actorEligibilityRoles: [],
    preconditions: [
      { type: 'requires_authority', targetKey: '', expectedValue: 'enter:eden', failureMessage: '没有伊甸权限。' },
    ],
    directEffects: [],
    potentialConsequences: [],
  },
  {
    id: 'act:test:spend_budget',
    name: '支取预算',
    category: 'physical',
    description: '',
    actorEligibilityRoles: [],
    preconditions: [
      { type: 'requires_resource', targetKey: 'res:spyf:family_budget', expectedValue: 10, failureMessage: '预算不足。' },
    ],
    directEffects: [],
    potentialConsequences: [],
  },
  {
    id: 'act:test:borrow_trust',
    name: '借用信任',
    category: 'social',
    description: '',
    actorEligibilityRoles: [],
    preconditions: [
      { type: 'requires_min_trust', targetKey: SPYF.relMarriage, expectedValue: 80, failureMessage: '婚姻信任不足。' },
    ],
    directEffects: [],
    potentialConsequences: [],
  },
  {
    id: 'act:test:say_secret',
    name: '说出秘密',
    category: 'social',
    description: '',
    actorEligibilityRoles: [],
    preconditions: [
      { type: 'requires_knowledge', targetKey: '', expectedValue: SPYF.factPenSurveillance, failureMessage: '你不知道钢笔的秘密。' },
    ],
    directEffects: [],
    potentialConsequences: [],
  },
  {
    id: 'act:test:open_vault',
    name: '打开金库',
    category: 'physical',
    description: '',
    actorEligibilityRoles: [],
    preconditions: [
      { type: 'requires_capability', targetKey: '', expectedValue: 'forensic', failureMessage: '没有痕迹勘察能力。' },
    ],
    directEffects: [],
    potentialConsequences: [],
  },
  {
    id: 'act:test:admin_order',
    name: '发布校长令',
    category: 'directorial',
    description: '',
    actorEligibilityRoles: ['teacher'],
    preconditions: [],
    directEffects: [],
    potentialConsequences: [],
  },
];

const ALL_WORLD = worldWith(...EXTRA_ACTIONS);

/* ------------------------------------------------------------------ */
/* Golden set — valid actions (false-reject rate ≤ 2%)                 */
/* ------------------------------------------------------------------ */

interface GoldenCase {
  name: string;
  world?: WorldDefinition;
  events: KernelEvent[];
  prepare?: (s: ReturnType<typeof breakfastState>) => void;
  inputClass?: RouteInputClass;
}

const GOLDEN: GoldenCase[] = [
  { name: 'loid compliments yor (co-present)', events: [speech(SPYF.loid, [SPYF.yor], '夸奖约尔', 'compliment')] },
  { name: 'yor greets loid', events: [speech(SPYF.yor, [SPYF.loid], '早安', 'say')] },
  { name: 'anya asks loid', events: [speech(SPYF.anya, [SPYF.loid], '爸爸，花生酱还有吗', 'ask')] },
  { name: 'self-talk with no target', events: [speech(SPYF.loid, [], '今天也要加油', 'say')] },
  { name: 'travel loid → street', events: [action('act:spyf:travel', SPYF.loid, [SPYF.street])] },
  { name: 'travel yor → street', events: [action('act:spyf:travel', SPYF.yor, [SPYF.street])] },
  { name: 'travel anya → corridor', events: [action('act:spyf:travel', SPYF.anya, [SPYF.corridor])] },
  {
    name: 'inspect pen in corridor (forensic, spy role)',
    events: [action('act:spyf:inspect_pen', SPYF.loid, [])],
    prepare: (s) => { s.entityStates[SPYF.loid].currentLocationId = SPYF.corridor; },
  },
  {
    name: 'confront yor knowing the secret (co-present)',
    events: [action('act:spyf:confront', SPYF.loid, [SPYF.yor])],
    prepare: (s) => { s.epistemics.entityKnownFacts[SPYF.loid].push(SPYF.factYorAssassin); },
  },
  { name: 'host reveals pen surveillance', events: [reveal('host', SPYF.loid, SPYF.yor, SPYF.factPenSurveillance)] },
  { name: 'yor reveals her own secret to loid', events: [reveal('observation', SPYF.yor, SPYF.loid, SPYF.factYorAssassin)] },
  { name: 'anya reveals telepath secret to loid', events: [reveal('discovery', SPYF.anya, SPYF.loid, SPYF.factAnyaTelepath)] },
];

describe('A3 · golden set — valid actions (false-reject ≤ 2%)', () => {
  for (const c of GOLDEN) {
    it(`commits: ${c.name}`, () => {
      const s = breakfastState();
      c.prepare?.(s);
      const r = validateProposal(c.world ?? SPY_FAMILY_MIN, s, proposal(c.events), { roleOf: spyRoles, inputClass: c.inputClass });
      expect(r.outcome, r.detail).toBe('commit');
    });
  }

  it('false-reject rate over the golden set is 0% (≤ 2%)', () => {
    let rejected = 0;
    for (const c of GOLDEN) {
      const s = breakfastState();
      c.prepare?.(s);
      const r = validateProposal(c.world ?? SPY_FAMILY_MIN, s, proposal(c.events), { roleOf: spyRoles, inputClass: c.inputClass });
      if (r.outcome === 'reject') rejected += 1;
    }
    expect(rejected / GOLDEN.length).toBeLessThanOrEqual(0.02);
  });
});

/* ------------------------------------------------------------------ */
/* Adversarial set — every rejection carries a reasonCode (≥ 20)       */
/* ------------------------------------------------------------------ */

interface AdversarialCase {
  name: string;
  world?: WorldDefinition;
  events: KernelEvent[];
  prepare?: (s: ReturnType<typeof breakfastState>) => void;
  reasonCode: string;
  roleOf?: (entityId: string) => string[];
}

const ADVERSARIAL: AdversarialCase[] = [
  /* malformed */
  { name: 'unknown action id', events: [action('act:does_not_exist', SPYF.loid, [])], reasonCode: 'MALFORMED' },
  { name: 'unknown speech actor', events: [speech('char:ghost', [SPYF.yor], '嗨', 'say')], reasonCode: 'MALFORMED' },
  { name: 'unknown speech target', events: [speech(SPYF.loid, ['char:ghost'], '嗨', 'say')], reasonCode: 'MALFORMED' },
  { name: 'unknown action actor', events: [action('act:spyf:travel', 'char:ghost', [SPYF.street])], reasonCode: 'MALFORMED' },
  { name: 'unknown reveal fact', events: [reveal('host', SPYF.loid, SPYF.yor, 'fact:nope')], reasonCode: 'MALFORMED' },
  { name: 'unknown reveal target', events: [reveal('host', SPYF.loid, 'char:ghost', SPYF.factLoidTwilight)], reasonCode: 'MALFORMED' },
  { name: 'action with unknown target', events: [action('act:spyf:travel', SPYF.loid, ['loc:ghost'])], reasonCode: 'MALFORMED' },
  { name: 'reveal by an unknown actor', events: [reveal('observation', 'char:ghost', SPYF.yor, SPYF.factYorAssassin)], reasonCode: 'MALFORMED' },
  {
    name: 'action with an unknown precondition type',
    events: [action('act:test:mystery', SPYF.loid, [])],
    world: ALL_WORLD,
    reasonCode: 'MALFORMED',
  },

  /* contradiction */
  {
    name: 'speech to a dead entity',
    events: [speech(SPYF.loid, [SPYF.yor], '醒醒', 'say')],
    prepare: (s) => { s.entityStates[SPYF.yor].physicalStatus = 'dead'; },
    reasonCode: 'CONTRADICTION',
  },
  {
    name: 'a dead entity cannot act',
    events: [action('act:spyf:travel', SPYF.loid, [SPYF.street])],
    prepare: (s) => { s.entityStates[SPYF.loid].physicalStatus = 'dead'; },
    reasonCode: 'CONTRADICTION',
  },
  {
    name: 'non-host reveal to a dead entity',
    events: [reveal('observation', SPYF.loid, SPYF.yor, SPYF.factLoidTwilight)],
    prepare: (s) => { s.entityStates[SPYF.yor].physicalStatus = 'dead'; },
    reasonCode: 'CONTRADICTION',
  },

  /* impossible */
  {
    name: 'action beyond actor capability',
    events: [action('act:spyf:inspect_pen', SPYF.bond, [])],
    prepare: (s) => { s.entityStates[SPYF.bond].currentLocationId = SPYF.corridor; },
    reasonCode: 'IMPOSSIBLE',
  },
  {
    name: 'action requiring a missing capability',
    events: [action('act:test:open_vault', SPYF.bond, [])],
    world: ALL_WORLD,
    reasonCode: 'IMPOSSIBLE',
  },
  {
    name: 'resource below the minimum',
    events: [action('act:test:spend_budget', SPYF.loid, [])],
    world: ALL_WORLD,
    prepare: (s) => { s.resourcePools['res:spyf:family_budget'] = 5; },
    reasonCode: 'IMPOSSIBLE',
  },

  /* rule_violation */
  {
    name: 'action restricted to roles the actor lacks',
    events: [action('act:spyf:inspect_pen', SPYF.loid, [])],
    prepare: (s) => { s.entityStates[SPYF.loid].currentLocationId = SPYF.corridor; },
    roleOf: () => ['parent'], // loid present, but not a 'spy'
    reasonCode: 'RULE_VIOLATION',
  },
  {
    name: 'directorial action outside eligible roles',
    events: [action('act:test:admin_order', SPYF.loid, [])],
    world: ALL_WORLD,
    reasonCode: 'RULE_VIOLATION',
  },

  /* no_knowledge_path */
  {
    name: 'reveal a secret the actor cannot know',
    events: [reveal('observation', SPYF.loid, SPYF.yor, SPYF.factYorAssassin)],
    reasonCode: 'NO_KNOWLEDGE_PATH',
  },
  {
    name: 'bond reveals a secret it cannot know',
    events: [reveal('discovery', SPYF.bond, SPYF.loid, SPYF.factLoidTwilight)],
    reasonCode: 'NO_KNOWLEDGE_PATH',
  },
  {
    name: 'action requiring knowledge the actor lacks',
    events: [action('act:test:say_secret', SPYF.loid, [])],
    world: ALL_WORLD,
    reasonCode: 'NO_KNOWLEDGE_PATH',
  },

  /* out_of_circumstance */
  {
    name: 'action requiring a location the actor is not at',
    events: [action('act:spyf:inspect_pen', SPYF.loid, [])],
    reasonCode: 'OUT_OF_CIRCUMSTANCE',
  },
  {
    name: 'confront without co-presence (target elsewhere)',
    events: [action('act:spyf:confront', SPYF.loid, [SPYF.yor])],
    prepare: (s) => {
      s.entityStates[SPYF.yor].currentLocationId = SPYF.street;
      s.epistemics.entityKnownFacts[SPYF.loid].push(SPYF.factYorAssassin);
    },
    reasonCode: 'OUT_OF_CIRCUMSTANCE',
  },
  {
    name: 'speech to a target in a different location',
    events: [speech(SPYF.loid, [SPYF.yor], '你在哪', 'ask')],
    prepare: (s) => { s.entityStates[SPYF.yor].currentLocationId = SPYF.street; },
    reasonCode: 'OUT_OF_CIRCUMSTANCE',
  },
  {
    name: 'action requiring trust the relationship lacks',
    events: [action('act:test:borrow_trust', SPYF.loid, [])],
    world: ALL_WORLD,
    prepare: (s) => { s.relationshipStates[SPYF.relMarriage].currentTrust = 50; },
    reasonCode: 'OUT_OF_CIRCUMSTANCE',
  },

  /* permission */
  {
    name: 'action outside the permission envelope',
    events: [action('act:test:enter_vault', SPYF.loid, [])],
    world: ALL_WORLD,
    reasonCode: 'PERMISSION',
  },
  {
    name: 'permission scoped to another institution',
    events: [action('act:test:enter_city_hall', SPYF.loid, [])],
    world: ALL_WORLD,
    reasonCode: 'PERMISSION',
  },
];

describe('A3 · adversarial set — every rejection carries a frozen reasonCode', () => {
  it('adversarial set size ≥ 20', () => {
    expect(ADVERSARIAL.length).toBeGreaterThanOrEqual(20);
  });

  for (const c of ADVERSARIAL) {
    it(`rejects: ${c.name} → ${c.reasonCode}`, () => {
      const s = breakfastState();
      c.prepare?.(s);
      const r = validateProposal(c.world ?? SPY_FAMILY_MIN, s, proposal(c.events), { roleOf: c.roleOf ?? spyRoles });
      expect(r.outcome).toBe('reject');
      expect(r.reasonCode).toBe(c.reasonCode);
      expect(REASON_CODES).toContain(r.reasonCode as never);
    });
  }

  it('100% of adversarial rejections carry a reasonCode', () => {
    for (const c of ADVERSARIAL) {
      const s = breakfastState();
      c.prepare?.(s);
      const r = validateProposal(c.world ?? SPY_FAMILY_MIN, s, proposal(c.events), { roleOf: c.roleOf ?? spyRoles });
      expect(r.reasonCode, c.name).toBeTruthy();
    }
  });
});

/* ------------------------------------------------------------------ */
/* Boundary — each family: exactly-satisfied passes                    */
/* ------------------------------------------------------------------ */

describe('A3 · boundary — exactly-satisfied constraints pass', () => {
  it('contradiction boundary: healthy target is not a contradiction', () => {
    const s = breakfastState();
    const r = validateProposal(SPY_FAMILY_MIN, s, proposal([speech(SPYF.loid, [SPYF.yor], '早', 'say')]), { roleOf: spyRoles });
    expect(r.outcome).toBe('commit');
  });

  it('impossible boundary: resource exactly at minimum passes', () => {
    const s = breakfastState();
    s.resourcePools['res:spyf:family_budget'] = 10;
    const r = validateProposal(ALL_WORLD, s, proposal([action('act:test:spend_budget', SPYF.loid, [])]), { roleOf: spyRoles });
    expect(r.outcome).toBe('commit');
  });

  it('rule_violation boundary: matching role passes', () => {
    const s = breakfastState();
    s.entityStates[SPYF.loid].currentLocationId = SPYF.corridor;
    const r = validateProposal(SPY_FAMILY_MIN, s, proposal([action('act:spyf:inspect_pen', SPYF.loid, [])]), { roleOf: spyRoles });
    expect(r.outcome).toBe('commit');
  });

  it('no_knowledge_path boundary: knowledge acquired passes', () => {
    const s = breakfastState();
    s.epistemics.entityKnownFacts[SPYF.loid].push(SPYF.factPenSurveillance);
    const r = validateProposal(ALL_WORLD, s, proposal([action('act:test:say_secret', SPYF.loid, [])]), { roleOf: spyRoles });
    expect(r.outcome).toBe('commit');
  });

  it('out_of_circumstance boundary: trust exactly at threshold passes', () => {
    const s = breakfastState();
    s.relationshipStates[SPYF.relMarriage].currentTrust = 80;
    const r = validateProposal(ALL_WORLD, s, proposal([action('act:test:borrow_trust', SPYF.loid, [])]), { roleOf: spyRoles });
    expect(r.outcome).toBe('commit');
  });

  it('permission boundary: granted permission passes', () => {
    const s = breakfastState();
    const r = validateProposal(ALL_WORLD, s, proposal([action('act:test:enter_eden', SPYF.loid, [])]), { roleOf: spyRoles });
    expect(r.outcome).toBe('commit');
  });

  it('malformed boundary: well-formed empty proposal passes', () => {
    const s = breakfastState();
    const r = validateProposal(SPY_FAMILY_MIN, s, proposal([]), { roleOf: spyRoles });
    expect(r.outcome).toBe('commit');
  });
});

/* ------------------------------------------------------------------ */
/* Privileged host scope                                               */
/* ------------------------------------------------------------------ */

describe('A3 · privileged host scope (permission envelope)', () => {
  it('host_intervention bypasses constraints — even a malformed action commits', () => {
    const s = breakfastState();
    const r = validateProposal(SPY_FAMILY_MIN, s, proposal([action('act:does_not_exist', SPYF.loid, [])]), {
      roleOf: spyRoles,
      inputClass: 'host_intervention',
    });
    expect(r.outcome).toBe('commit');
    const perm = r.results.find((x) => x.constraint === 'permission');
    expect(perm?.passed).toBe(true);
  });

  it('non-host input never bypasses constraints', () => {
    const s = breakfastState();
    const r = validateProposal(SPY_FAMILY_MIN, s, proposal([action('act:does_not_exist', SPYF.loid, [])]), {
      roleOf: spyRoles,
      inputClass: 'user_open',
    });
    expect(r.outcome).toBe('reject');
    expect(r.reasonCode).toBe('MALFORMED');
  });
});

/* ------------------------------------------------------------------ */
/* Purity & contract                                                   */
/* ------------------------------------------------------------------ */

describe('A3 · purity — validation never mutates state', () => {
  it('state is deep-equal before/after validation (incl. prepare mutations)', () => {
    const s = breakfastState();
    s.epistemics.entityKnownFacts[SPYF.loid].push(SPYF.factYorAssassin);
    const before = structuredClone(s);
    validateProposal(SPY_FAMILY_MIN, s, proposal([action('act:spyf:confront', SPYF.loid, [SPYF.yor])]), { roleOf: spyRoles });
    expect(s).toEqual(before);
  });
});

describe('A3 · contract — results shape and family coverage', () => {
  it('results contain exactly one entry per constraint family, in family order', () => {
    const s = breakfastState();
    s.entityStates[SPYF.yor].physicalStatus = 'dead';
    const r = validateProposal(SPY_FAMILY_MIN, s, proposal([speech(SPYF.loid, [SPYF.yor], '嗨', 'say')]), { roleOf: spyRoles });
    expect(r.results).toHaveLength(CONSTRAINT_FAMILIES.length);
    expect(r.results.map((x) => x.constraint)).toEqual([...CONSTRAINT_FAMILIES]);
    for (const x of r.results) {
      expect(typeof x.passed).toBe('boolean');
      expect(typeof x.constraint).toBe('string');
    }
  });

  it('every result passes the ValidatorResult shape', () => {
    const s = breakfastState();
    const r = validateProposal(ALL_WORLD, s, proposal([action('act:test:enter_vault', SPYF.loid, [])]), { roleOf: spyRoles });
    for (const x of r.results as ValidatorResult[]) {
      expect(x.constraint.length).toBeGreaterThan(0);
      expect([true, false]).toContain(x.passed);
    }
  });

  it('reasonCode for a rejection is the first failing family in order', () => {
    // dead actor + missing capability + missing location → contradiction wins
    const s = breakfastState();
    s.entityStates[SPYF.loid].physicalStatus = 'dead';
    const r = validateProposal(SPY_FAMILY_MIN, s, proposal([action('act:spyf:inspect_pen', SPYF.loid, [])]), { roleOf: spyRoles });
    expect(r.outcome).toBe('reject');
    expect(r.reasonCode).toBe('CONTRADICTION');
  });
});
