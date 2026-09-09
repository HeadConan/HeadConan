/**
 * HeadConan Routing — Stage A3: constraint-bounded validator.
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A3.
 * Positioning alignment: POSITIONING.md §4.3 — "the world does not forget
 * itself": constraints preserve continuity, not replace intelligence.
 *
 * The validator is a pure, read-only gate between interpretation and commit:
 *   PROPOSE → [VALIDATE] → COMMIT | REJECT
 * It checks a `ProposedReality` (events only — change-arrays are kernel-derived
 * at commit, Stage A2-2) against six constraint families plus well-formedness.
 *
 * Reuse, not rewrite (§1.1): action preconditions are evaluated with the
 * kernel's own `checkPrecondition` (exported from kernel2 for this stage);
 * this file only maps precondition types to constraint families and reason
 * codes. It never writes state and never proposes alternatives.
 *
 * Family → reasonCode (frozen vocabulary, types.ts):
 *   malformed           → MALFORMED            (unknown ids, unparseable events)
 *   contradiction       → CONTRADICTION        (contradicts established facts)
 *   impossible          → IMPOSSIBLE           (cannot happen in this world)
 *   rule_violation      → RULE_VIOLATION       (violates explicit world rules)
 *   no_knowledge_path   → NO_KNOWLEDGE_PATH    (knowledge without plausible path)
 *   out_of_circumstance → OUT_OF_CIRCUMSTANCE  (entity outside its circumstances)
 *   permission          → PERMISSION           (outside the actor's envelope)
 *
 * Privileged scope: an input arriving as `host_intervention` bypasses all
 * constraint families (the permission envelope of the Host) — recorded, not
 * silent: its results note the bypass.
 */

import type { WorldDefinition } from '../world/representation/types/definition';
import type { WorldStateInstance } from '../world/representation/types/state';
import type { KernelEvent } from '../world/runtime/kernel2';
import { checkPrecondition } from '../world/runtime/kernel2';
import type { EntityId } from '../world/representation/types/primitives';
import type { RouteInputClass, ReasonCode, ValidatorResult, ProposedReality } from './types';

/* ------------------------------------------------------------------ */
/* Constraint families (fixed order — first failing family wins)       */
/* ------------------------------------------------------------------ */

export const CONSTRAINT_FAMILIES = [
  'malformed',
  'contradiction',
  'impossible',
  'rule_violation',
  'no_knowledge_path',
  'out_of_circumstance',
  'permission',
] as const;

export type ConstraintFamily = (typeof CONSTRAINT_FAMILIES)[number];

const FAMILY_REASON: Record<ConstraintFamily, ReasonCode> = {
  malformed: 'MALFORMED',
  contradiction: 'CONTRADICTION',
  impossible: 'IMPOSSIBLE',
  rule_violation: 'RULE_VIOLATION',
  no_knowledge_path: 'NO_KNOWLEDGE_PATH',
  out_of_circumstance: 'OUT_OF_CIRCUMSTANCE',
  permission: 'PERMISSION',
};

/** Which constraint family an action precondition maps to when it fails. */
const PRECONDITION_FAMILY: Record<string, ConstraintFamily> = {
  requires_location: 'out_of_circumstance',
  requires_co_presence: 'out_of_circumstance',
  requires_min_trust: 'out_of_circumstance',
  requires_capability: 'impossible',
  requires_resource: 'impossible',
  requires_knowledge: 'no_knowledge_path',
  requires_authority: 'permission',
};

export interface ValidationOptions {
  /** entityId → roles, for `actorEligibilityRoles`; default = allow-all (mirrors kernel2). */
  roleOf?: (entityId: EntityId) => string[];
  /** Input class decides the permission envelope; `host_intervention` is privileged. */
  inputClass?: RouteInputClass;
}

export interface ValidationOutcome {
  /** One result per constraint family, in family order. */
  results: ValidatorResult[];
  outcome: 'commit' | 'reject';
  /** Frozen reason code — present iff outcome === 'reject'. */
  reasonCode?: ReasonCode;
  /** First failing family's detail (additional to reasonCode, never instead). */
  detail?: string;
}

/* ------------------------------------------------------------------ */
/* Lookups (definition-backed; absent ⇒ malformed)                     */
/* ------------------------------------------------------------------ */

function entityOf(world: WorldDefinition, id: string) {
  return world.characters.find((c) => c.id === id);
}

function knownEntity(world: WorldDefinition, id: string): boolean {
  return (
    world.characters.some((c) => c.id === id) ||
    world.locations.some((l) => l.id === id) ||
    world.objects.some((o) => o.id === id)
  );
}

function isDead(state: WorldStateInstance, id: string): boolean {
  return state.entityStates[id]?.physicalStatus === 'dead';
}

function isCoLocated(state: WorldStateInstance, a: string, b: string): boolean {
  return state.entityStates[a]?.currentLocationId === state.entityStates[b]?.currentLocationId;
}

/* ------------------------------------------------------------------ */
/* Accumulator: first failure per family, inserted in family order     */
/* ------------------------------------------------------------------ */

interface Failure {
  family: ConstraintFamily;
  detail: string;
}

interface Accum {
  failures: Failure[];
}

function fail(acc: Accum, family: ConstraintFamily, detail: string): void {
  if (!acc.failures.some((f) => f.family === family)) {
    acc.failures.push({ family, detail });
  }
}

/* ------------------------------------------------------------------ */
/* Per-event validation                                                 */
/* ------------------------------------------------------------------ */

function validateEvent(
  world: WorldDefinition,
  state: WorldStateInstance,
  event: KernelEvent,
  opts: ValidationOptions,
  acc: Accum
): void {
  switch (event.type) {
    case 'speech_act': {
      const actor = entityOf(world, event.actorId);
      if (!actor) {
        fail(acc, 'malformed', `actor ${event.actorId} does not exist`);
        return;
      }
      for (const t of event.targetIds) {
        if (!entityOf(world, t)) {
          fail(acc, 'malformed', `target ${t} does not exist`);
          return;
        }
      }
      if (isDead(state, event.actorId) || event.targetIds.some((t) => isDead(state, t))) {
        fail(acc, 'contradiction', 'interaction with a dead entity contradicts established facts');
        return;
      }
      if (event.targetIds.length > 0 && event.targetIds.some((t) => !isCoLocated(state, event.actorId, t))) {
        fail(acc, 'out_of_circumstance', "target is not present at the actor's location");
      }
      return;
    }
    case 'action': {
      const def = world.actions.find((a) => a.id === event.actionId);
      if (!def) {
        fail(acc, 'malformed', `unknown action ${event.actionId}`);
        return;
      }
      if (!entityOf(world, event.actorId)) {
        fail(acc, 'malformed', `actor ${event.actorId} does not exist`);
        return;
      }
      for (const t of event.targetIds) {
        if (!knownEntity(world, t)) {
          fail(acc, 'malformed', `target ${t} does not exist`);
          return;
        }
      }
      if (isDead(state, event.actorId)) {
        fail(acc, 'contradiction', 'a dead entity cannot act');
        return;
      }
      const roles = opts.roleOf ? opts.roleOf(event.actorId) : ['*'];
      if (def.actorEligibilityRoles.length > 0 && !def.actorEligibilityRoles.some((r) => roles.includes(r))) {
        fail(acc, 'rule_violation', `action ${def.id} is restricted to roles [${def.actorEligibilityRoles.join(', ')}]`);
      }
      for (const p of def.preconditions) {
        const r = checkPrecondition(world, state, p, event.actorId, event.targetIds);
        if (!r.ok) {
          fail(acc, PRECONDITION_FAMILY[p.type] ?? 'malformed', r.message ?? p.failureMessage);
        }
      }
      return;
    }
    case 'reveal_fact': {
      const fact = world.groundTruthFacts.find((f) => f.id === event.factId);
      if (!fact) {
        fail(acc, 'malformed', `unknown fact ${event.factId}`);
        return;
      }
      if (!entityOf(world, event.targetId)) {
        fail(acc, 'malformed', `target ${event.targetId} does not exist`);
        return;
      }
      if (isDead(state, event.targetId)) {
        fail(acc, 'contradiction', 'cannot reveal a fact to a dead entity');
        return;
      }
      // Non-host revelations must have a plausible knowledge path.
      if (event.source !== 'host' && event.actorId) {
        const actorId = event.actorId;
        if (!entityOf(world, actorId)) {
          fail(acc, 'malformed', `actor ${actorId} does not exist`);
          return;
        }
        const known = state.epistemics.entityKnownFacts[actorId] ?? [];
        if (!known.includes(event.factId) && fact.visibilityScope !== 'universal_public') {
          fail(acc, 'no_knowledge_path', `actor ${actorId} has no plausible path to know ${event.factId}`);
        }
      }
      return;
    }
  }
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

/**
 * Validate a proposal against the world's current commitments.
 * Read-only: never mutates `world` or `state`.
 */
export function validateProposal(
  world: WorldDefinition,
  state: WorldStateInstance,
  proposal: ProposedReality,
  opts: ValidationOptions = {}
): ValidationOutcome {
  // Privileged host scope: the Host's permission envelope is unbounded by the
  // constraint families — recorded explicitly, never silent.
  if (opts.inputClass === 'host_intervention') {
    const results: ValidatorResult[] = CONSTRAINT_FAMILIES.map((family) =>
      family === 'permission'
        ? { constraint: family, passed: true, detail: 'privileged host scope — constraint families bypassed' }
        : { constraint: family, passed: true }
    );
    return { results, outcome: 'commit' };
  }

  const acc: Accum = { failures: [] };
  for (const event of proposal.events) {
    validateEvent(world, state, event, opts, acc);
  }

  acc.failures.sort((a, b) => CONSTRAINT_FAMILIES.indexOf(a.family) - CONSTRAINT_FAMILIES.indexOf(b.family));

  const results: ValidatorResult[] = CONSTRAINT_FAMILIES.map((family) => {
    const f = acc.failures.find((x) => x.family === family);
    return f ? { constraint: family, passed: false, detail: f.detail } : { constraint: family, passed: true };
  });

  const first = acc.failures[0];
  if (first) {
    return { results, outcome: 'reject', reasonCode: FAMILY_REASON[first.family], detail: first.detail };
  }
  return { results, outcome: 'commit' };
}
