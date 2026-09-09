/**
 * HeadConan Routing — Stage A4 orchestrator: the single adjudication path into the kernel.
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A4 (commit & rejection semantics) + A5 (fallback chain).
 *
 * Pipeline:  INPUT → [CLASSIFY] → [INTERPRET] → [VALIDATE] → COMMIT | CLARIFY | REJECT
 *
 * Invariants enforced here (not assumed):
 *   - single writer: world state is mutated ONLY by the kernel's `applyEvent`. The router
 *     never writes state; it only folds validated proposals through the kernel and records
 *     an append-only RouteDecisionRecord (Stage A6) on the audit side-channel.
 *   - no traceId → no commit: every attempt carries one end-to-end traceId, propagated into
 *     the interpretation (A6 "traceId propagates").
 *   - rejection is an event: every reject/clarify returns a structured, projector-ready
 *     reasonCode + detail — nothing is ever dropped silently (strictness §4).
 *   - the validator is the gate to `applyEvent`: `applyEvent` is never called for a proposal
 *     that did not validate.
 *
 * Degradation chain (Stage A5): LLM ok & confident → commit | deterministic fallback → commit |
 * clarify (ask user) → reject-as-event. Every degraded hop sets `fallbackUsed` and is logged.
 */

import type { WorldDefinition } from '../world/representation/types/definition';
import type { WorldStateInstance } from '../world/representation/types/state';
import type { EntityId } from '../world/representation/types/primitives';
import type { KernelOptions, ApplyResult } from '../world/runtime/kernel2';
import { applyEvent } from '../world/runtime/kernel2';
import type { AIProviderId } from '../ai/client';
import { classifyDeterministic, choosePath, DEFAULT_THRESHOLD } from './classifier';
import { interpret } from './interpreter';
import type { InterpretationResult } from './interpreter';
import { validateProposal } from './validator';
import type { ValidationOutcome } from './validator';
import { addRecord } from './routeLog';
import type {
  RouteDecisionRecord,
  RouteInputClass,
  RoutePath,
  ReasonCode,
  RouteOutcome,
} from './types';

/* ------------------------------------------------------------------ */
/* Injected dependencies (testability: the classifier/interpreter may be stubbed) */
/* ------------------------------------------------------------------ */

export type InterpreterFn = typeof interpret;

export interface RouteAttemptContext {
  world: WorldDefinition;
  state: WorldStateInstance;
  actorId: EntityId;
  /** Which model path runs this attempt ('procedural' = offline deterministic). */
  provider: AIProviderId;
  /** Explicit dialogue target (click-injected); text naming still wins downstream. */
  targetId?: EntityId;
  /** Classification override (e.g. open-ended input forced to the LLM path). */
  inputClass?: RouteInputClass;
  /** Confidence threshold θ for the classification→path decision. */
  theta?: number;
  /** Observer whose projection bounds the proposal; default = actorId. */
  observerId?: EntityId;
  /** Kernel options — roleOf MUST mirror validation to avoid divergence after commit. */
  kernel?: KernelOptions;
  /** Audit sink for the terminal record; default appends to the session route log. */
  log?: (record: RouteDecisionRecord) => void;
  /** Injected interpreter for tests. */
  interpret?: InterpreterFn;
}

export type RoutedAction =
  | {
      outcome: 'commit';
      routeId: string;
      traceId: string;
      nextState: WorldStateInstance;
      eventsCommitted: number;
      applied: ApplyResult[];
      record: RouteDecisionRecord;
    }
  | {
      outcome: 'clarify';
      routeId: string;
      traceId: string;
      notice: string;
      reasonCode: 'LOW_CONFIDENCE';
      detail: string;
      record: RouteDecisionRecord;
    }
  | {
      outcome: 'reject';
      routeId: string;
      traceId: string;
      reasonCode: ReasonCode;
      detail: string;
      record: RouteDecisionRecord;
    };

/* ------------------------------------------------------------------ */
/* The single adjudication path                                        */
/* ------------------------------------------------------------------ */

let seq = 0;
function genId(prefix: string): string {
  seq += 1;
  return `${prefix}:${Date.now().toString(36)}:${seq.toString(36)}`;
}

const CLASSIFICATION_LABEL: Partial<Record<RouteInputClass, string>> = {
  user_open: 'open-ended user action',
  user_structured: 'structured user action',
  npc: 'character-policy action',
  host_intervention: 'privileged host intervention',
  scheduled: 'scheduled / world tick',
  definition_change: 'definition change',
};

export async function routeUserAction(
  text: string,
  ctx: RouteAttemptContext
): Promise<RoutedAction> {
  const t0 = performance.now();
  const routeId = genId('route');
  const traceId = genId('trace');
  const theta = ctx.theta ?? DEFAULT_THRESHOLD;
  const log = ctx.log ?? addRecord;
  const override = ctx.inputClass;

  // CLASSIFY — decide which interpretation path (never fabricate: open stays open).
  const classified = override
    ? { inputClass: override, classification: CLASSIFICATION_LABEL[override] ?? override, confidence: 1, rationale: 'classification override' }
    : classifyDeterministic(text);
  const { inputClass, classification: classificationLabel } = classified;
  const path: RoutePath = choosePath(classified, theta);

  // INTERPRET — produce a proposed reality under the shared traceId.
  const interp = await (ctx.interpret ?? interpret)(text, ctx.world, ctx.state, ctx.actorId, {
    provider: ctx.provider,
    targetId: ctx.targetId,
    traceId,
  });

  // CLARIFY — the interpretation-layer disambiguation; an observable event, never a commit.
  if (interp.source === 'clarify') {
    const notice = interp.clarify?.notice ?? '意图不够明确，请说得更具体一些。';
    const record = buildRecord({
      routeId,
      traceId,
      generatedAt: performance.now() - t0,
      inputClass,
      classificationLabel,
      confidence: interp.reality.confidence,
      path,
      interp,
      validator: undefined,
      outcome: 'clarify',
      reasonCode: 'LOW_CONFIDENCE',
      fallbackUsed: true,
      modelId: modelIdFor(ctx.provider),
    });
    record.detail = notice;
    log(record);
    return { outcome: 'clarify', routeId, traceId, notice, reasonCode: 'LOW_CONFIDENCE', detail: notice, record };
  }

  // A degenerate proposal (no events, not clarify) is malformed — never a silent empty commit.
  if (interp.reality.events.length === 0) {
    const record = buildRecord({
      routeId, traceId, generatedAt: performance.now() - t0, inputClass, classificationLabel,
      confidence: interp.reality.confidence, path, interp, validator: undefined,
      outcome: 'reject', reasonCode: 'MALFORMED', fallbackUsed: path === 'llm_interpretation',
      modelId: modelIdFor(ctx.provider),
    });
    record.detail = '提议不含任何事件，无法提交。';
    log(record);
    return { outcome: 'reject', routeId, traceId, reasonCode: 'MALFORMED', detail: record.detail, record };
  }

  // VALIDATE — the gate to applyEvent. A rejected proposal never reaches the kernel.
  const validator = validateProposal(ctx.world, ctx.state, interp.reality, {
    roleOf: ctx.kernel?.roleOf,
    inputClass,
  });
  if (validator.outcome === 'reject') {
    const record = buildRecord({
      routeId, traceId, generatedAt: performance.now() - t0, inputClass, classificationLabel,
      confidence: interp.reality.confidence, path, interp, validator,
      outcome: 'reject', reasonCode: validator.reasonCode, fallbackUsed: path === 'llm_interpretation',
      modelId: modelIdFor(ctx.provider),
    });
    if (validator.detail) record.detail = validator.detail;
    log(record);
    return {
      outcome: 'reject',
      routeId,
      traceId,
      reasonCode: validator.reasonCode as ReasonCode,
      detail: validator.detail ?? '',
      record,
    };
  }

  // COMMIT — single writer: fold validated events through the kernel's applyEvent.
  let nextState = ctx.state;
  const applied: ApplyResult[] = [];
  for (const event of interp.reality.events) {
    const r = applyEvent(ctx.world, nextState, event, ctx.kernel);
    if (r.rejected) {
      const fallbackUsed = path === 'llm_interpretation';
      const reason: ReasonCode = kernelSurpriseReason(r.reason);
      const record = buildRecord({
        routeId, traceId, generatedAt: performance.now() - t0, inputClass, classificationLabel,
        confidence: interp.reality.confidence, path, interp, validator,
        outcome: 'reject', reasonCode: reason, fallbackUsed, modelId: modelIdFor(ctx.provider),
      });
      record.detail = r.reason ?? '内核拒绝该事件。';
      log(record);
      return { outcome: 'reject', routeId, traceId, reasonCode: reason, detail: record.detail, record };
    }
    nextState = r.nextState;
    applied.push(r);
  }

  const fallbackUsed = path === 'llm_interpretation' && interp.source !== 'llm';
  const record = buildRecord({
    routeId, traceId, generatedAt: performance.now() - t0, inputClass, classificationLabel,
    confidence: interp.reality.confidence, path, interp, validator,
    outcome: 'commit', reasonCode: undefined, fallbackUsed, modelId: modelIdFor(ctx.provider),
  });
  log(record);
  return {
    outcome: 'commit',
    routeId,
    traceId,
    nextState,
    eventsCommitted: applied.length,
    applied,
    record,
  };
}

/* ------------------------------------------------------------------ */
/* Helpers (pure)                                                      */
/* ------------------------------------------------------------------ */

function modelIdFor(provider: AIProviderId): string | undefined {
  return provider === 'procedural' ? undefined : provider;
}

interface RecordSeed {
  routeId: string;
  traceId: string;
  generatedAt: number;
  inputClass: RouteInputClass;
  classificationLabel: string;
  confidence: number;
  path: RoutePath;
  interp: InterpretationResult;
  validator: ValidationOutcome | undefined;
  outcome: RouteOutcome;
  reasonCode: ReasonCode | undefined;
  fallbackUsed: boolean;
  modelId?: string;
}

/** Assemble a valid, immutable RouteDecisionRecord for THIS attempt (one record per attempt). */
function buildRecord(seed: RecordSeed): RouteDecisionRecord {
  const record: RouteDecisionRecord = {
    routeId: seed.routeId,
    traceId: seed.traceId,
    timestamp: new Date().toISOString(),
    inputClass: seed.inputClass,
    classification: seed.classificationLabel,
    confidence: seed.confidence,
    pathTaken: seed.path,
    modelId: seed.modelId,
    latencyMs: Math.max(0, seed.generatedAt),
    fallbackUsed: seed.fallbackUsed,
    validatorResults: seed.validator?.results ?? [],
    outcome: seed.outcome,
  };
  if (seed.reasonCode) record.reasonCode = seed.reasonCode;
  return record;
}

/**
 * Map a (post-validation, defensive) kernel rejection onto a frozen reason code.
 * After a passing validation this is near-impossible; we still never leave a rejection
 * without a reasonCode (strictness §9). Keyword preconditions are mapped; fallback = RULE_VIOLATION.
 */
function kernelSurpriseReason(reason?: string): ReasonCode {
  const text = reason ?? '';
  if (/前提不满足|共现|not present|not co/i.test(text)) return 'OUT_OF_CIRCUMSTANCE';
  if (/资格|authority|权限/i.test(text)) return 'PERMISSION';
  if (/未定义|未知|不存在|unknown/i.test(text)) return 'MALFORMED';
  return 'RULE_VIOLATION';
}