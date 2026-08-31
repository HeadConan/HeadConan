/**
 * HeadConan — Routing System, Stage A0: contract types.
 *
 * Source plan: docs/ROUTING_PLAN.md (Stage A0 — Routing contract).
 * Positioning alignment:
 *   - POSITIONING.md §5  — Interpretive authority (LLM) vs Ontological authority (world system).
 *   - POSITIONING.md §6  — Interpretation is a first-class stage:
 *                          INPUT → CLASSIFY → INTERPRET → PROPOSE → VALIDATE → COMMIT|CLARIFY|REJECT.
 *   - POSITIONING.md §8  — Generated possibility (ProposedReality) ≠ committed reality (world state).
 *
 * Rules encoded here:
 *   1. No traceId → no commit. Every proposal and decision carries a traceId.
 *   2. Vocabularies are frozen (input classes, paths, outcomes, reason codes).
 *   3. Zero `any`. The contract is the narrowest thing in the system.
 *   4. Interpretation produces ProposedReality; it never mutates state (structural, not enforced here).
 */

/* ============================================================
   Frozen vocabularies
   ============================================================ */

/** Where an input came from — decides which interpretation path is legitimate. */
export type RouteInputClass =
  | 'user_open'          // open-ended human action ("I follow Yor")
  | 'user_structured'    // known/structured intent (button, typed action, known verb)
  | 'npc'                // character-generated action (policy layer)
  | 'host_intervention'  // privileged Host action ("make this happen")
  | 'scheduled'          // scheduler / world tick / delayed consequence
  | 'definition_change'; // meta: Host edits the rules of reality

/** The interpretation path taken. Recorded, never inferred after the fact. */
export type RoutePath =
  | 'llm_interpretation'         // LLM-led interpretation (default for open-ended input)
  | 'deterministic_parse'        // structured match / fallback parser
  | 'policy_proposal'            // character policy (rule → utility → LLM)
  | 'privileged_interpretation'  // Host intervention inside its permission envelope
  | 'rule_emit'                  // world rule / scheduler produced the event
  | 'version_ledger';            // definition change (versioned)

/** Terminal state of a routing attempt. There is no "undefined" outcome. */
export type RouteOutcome =
  | 'commit'   // validated and written by the kernel
  | 'clarify'  // system asks the user to disambiguate (once, then reject)
  | 'reject'   // refused with a reason code — rejection is an event
  | 'skip'     // NPC/agent declined to act (logged)
  | 'requeue'; // scheduled item deferred with backoff

/** Frozen rejection reasons. Free-text explanation is *additional*, never instead. */
export type ReasonCode =
  | 'CONTRADICTION'        // contradicts an established fact
  | 'IMPOSSIBLE'           // cannot happen in this world's circumstances
  | 'RULE_VIOLATION'       // violates an explicit world rule
  | 'NO_KNOWLEDGE_PATH'    // actor could not plausibly know this
  | 'OUT_OF_CIRCUMSTANCE'  // entity is not where/able to do this
  | 'PERMISSION'           // outside the actor's permission envelope
  | 'LOW_CONFIDENCE'       // interpretation confidence below threshold θ
  | 'MALFORMED'            // unparseable input or proposal
  | 'TIMEOUT';             // interpretation step exceeded its budget

export const ROUTE_INPUT_CLASSES = [
  'user_open',
  'user_structured',
  'npc',
  'host_intervention',
  'scheduled',
  'definition_change',
] as const satisfies readonly RouteInputClass[];

export const ROUTE_PATHS = [
  'llm_interpretation',
  'deterministic_parse',
  'policy_proposal',
  'privileged_interpretation',
  'rule_emit',
  'version_ledger',
] as const satisfies readonly RoutePath[];

export const ROUTE_OUTCOMES = ['commit', 'clarify', 'reject', 'skip', 'requeue'] as const satisfies readonly RouteOutcome[];

export const REASON_CODES = [
  'CONTRADICTION',
  'IMPOSSIBLE',
  'RULE_VIOLATION',
  'NO_KNOWLEDGE_PATH',
  'OUT_OF_CIRCUMSTANCE',
  'PERMISSION',
  'LOW_CONFIDENCE',
  'MALFORMED',
  'TIMEOUT',
] as const satisfies readonly ReasonCode[];

/* ============================================================
   Route request (input envelope)
   ============================================================ */

/** What arrives at the router. Carries identity and provenance only — no interpretation. */
export interface RouteRequest {
  /** Unique id for this routing attempt (`route:<n>`). */
  routeId: string;
  /** End-to-end trace id linking action → interpretation → validation → commit. */
  traceId: string;
  /** ISO-8601 arrival time. */
  timestamp: string;
  /** Where the input came from. */
  inputClass: RouteInputClass;
  /** Raw user/system text or structured payload. Never trusted. */
  rawInput: string;
  /** Acting entity (player character, NPC, or Host). */
  actorId?: string;
  /** Observer whose projection bounds what this input may legitimately reference. */
  observerId?: string;
  /** Confidence threshold θ in effect for this attempt (Stage A1 calibrates it). */
  threshold?: number;
}

/* ============================================================
   Proposal (generated possibility — NOT truth)
   ============================================================ */

/** One constraint check performed by the validator. */
export interface ValidatorResult {
  /** Constraint family name (e.g. `contradiction`, `no_knowledge_path`). */
  constraint: string;
  /** Whether the proposal passed this constraint. */
  passed: boolean;
  /** Optional human/LLM-readable detail. */
  detail?: string;
}

/** A proposed state change. Not yet real — the kernel decides whether to remember it. */
export interface StateChange {
  /** Target entity or relation id. */
  targetId: string;
  /** Field being changed. */
  field: string;
  /** New value. */
  value: string | number | boolean;
}

/** A proposed knowledge change: which observer learns (or unlearns) which fact. */
export interface KnowledgeChange {
  /** Observer whose knowledge changes. */
  observerId: string;
  /** Fact being revealed, updated, or retracted. */
  factId: string;
  /** `reveal` adds to known facts; `retract` removes; `belief` records a (possibly false) belief. */
  kind: 'reveal' | 'retract' | 'belief';
  /** Source of the knowledge — required; knowledge must have a plausible path. */
  source: string;
}

/** Who witnessed what — the only legitimate way knowledge changes. */
export interface Observation {
  /** Observer id. */
  observerId: string;
  /** Facts this observer became aware of (may be empty: witnessed an act, learned no fact). */
  factIds?: string[];
  /** What was perceived, if anything was said or shown. */
  perceived?: string;
}

/**
 * Output of the interpretation stage.
 * Purely a proposal: creating it must not mutate world state.
 */
export interface ProposedReality {
  /** Trace this proposal belongs to. No traceId → the kernel must refuse it. */
  traceId: string;
  /** Proposed events (typed, validated in later stages). */
  events: string[];
  /** Proposed state changes. */
  stateChanges: StateChange[];
  /** Proposed knowledge changes (observation-derived). */
  knowledgeChanges: KnowledgeChange[];
  /** Proposed observations — who saw what. */
  observations: Observation[];
  /** Interpreter confidence in [0,1]. Compared against θ. */
  confidence: number;
  /** Why the interpreter proposed this. Recorded for audit. */
  rationale: string;
}

/* ============================================================
   Route decision record (audit spine)
   ============================================================ */

/**
 * One routing hop. Append-only; every hop of every attempt must produce one.
 * Queryable by traceId, pathTaken, reasonCode, fallbackUsed (Stage A6).
 */
export interface RouteDecisionRecord {
  /** Routing attempt id (`route:<n>`). */
  routeId: string;
  /** End-to-end trace id — the join key across the whole pipeline. */
  traceId: string;
  /** ISO-8601 decision time. */
  timestamp: string;
  /** Input classification. */
  inputClass: RouteInputClass;
  /** Short human-readable classification label. */
  classification: string;
  /** Classifier/interpreter confidence in [0,1]. */
  confidence: number;
  /** Path actually taken (not the intended one). */
  pathTaken: RoutePath;
  /** Model id if an LLM was involved — recorded input, replayed not regenerated. */
  modelId?: string;
  /** Latency of this hop in milliseconds. */
  latencyMs: number;
  /** True if a fallback path was used instead of the primary path. */
  fallbackUsed: boolean;
  /** Validator results for this hop (empty if validation not reached). */
  validatorResults: ValidatorResult[];
  /** Terminal outcome. */
  outcome: RouteOutcome;
  /** Frozen reason code — required for `reject`, optional otherwise. */
  reasonCode?: ReasonCode;
  /** Free-text explanation, additional to (never instead of) reasonCode. */
  detail?: string;
}

/* ============================================================
   Runtime guards (reject incomplete or illegal records)
   ============================================================ */

type Dict = Record<string, unknown>;

const isObject = (v: unknown): v is Dict => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const isUnitNumber = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v <= 1;

function isValidatorResult(v: unknown): boolean {
  return isObject(v) && isNonEmptyString(v.constraint) && typeof v.passed === 'boolean';
}

/** Runtime guard for a complete, legally-shaped route decision record. */
export function isRouteDecisionRecord(value: unknown): value is RouteDecisionRecord {
  if (!isObject(value)) return false;
  if (!isNonEmptyString(value.routeId) || !isNonEmptyString(value.traceId) || !isNonEmptyString(value.timestamp)) return false;
  if (!isNonEmptyString(value.classification)) return false;
  if (!isUnitNumber(value.confidence)) return false;
  if (typeof value.latencyMs !== 'number' || value.latencyMs < 0) return false;
  if (typeof value.fallbackUsed !== 'boolean') return false;
  if (!Array.isArray(value.validatorResults) || !value.validatorResults.every(isValidatorResult)) return false;
  if (!(ROUTE_INPUT_CLASSES as readonly string[]).includes(value.inputClass as string)) return false;
  if (!(ROUTE_PATHS as readonly string[]).includes(value.pathTaken as string)) return false;
  if (!(ROUTE_OUTCOMES as readonly string[]).includes(value.outcome as string)) return false;
  if (value.reasonCode !== undefined && !(REASON_CODES as readonly string[]).includes(value.reasonCode as string)) return false;
  return true;
}

/** Runtime guard for a complete proposal. Enforces "no traceId → no commit". */
export function isProposedReality(value: unknown): value is ProposedReality {
  if (!isObject(value)) return false;
  if (!isNonEmptyString(value.traceId)) return false;
  if (!isUnitNumber(value.confidence)) return false;
  if (!isNonEmptyString(value.rationale)) return false;
  for (const key of ['events', 'stateChanges', 'knowledgeChanges', 'observations'] as const) {
    if (!Array.isArray(value[key])) return false;
  }
  return true;
}
