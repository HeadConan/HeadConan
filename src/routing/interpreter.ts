/**
 * HeadConan Routing — Stage A2: interpretation → Proposed Reality.
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A2.
 * Position: second hop of the pipeline —
 *   INPUT → [CLASSIFY] → [INTERPRET] → [PROPOSE] → [VALIDATE] → COMMIT|CLARIFY|REJECT.
 *
 * Purity contract (A2-3):
 *   - interpretation NEVER mutates world state; same input + same recorded
 *     model output ⇒ same ProposedReality content.
 *   - this file is an ADAPTER over `proposeUserEvents` (reuse, not rewrite):
 *     it maps ProposedAction onto the A0 ProposedReality envelope and proves purity.
 *   - the interpreter proposes actions; it never derives consequences.
 *     change-arrays (stateChanges / knowledgeChanges / observations) are
 *     kernel-derived at commit (A2-2) and therefore always empty here.
 *
 * traceId semantics: one fresh, unique traceId per routing attempt ("no trace
 * → no commit"). Deterministic reproducibility applies to the proposal CONTENT
 * (events / confidence / rationale), never to the trace id.
 */

import type { WorldDefinition } from '../world/representation/types/definition';
import type { WorldStateInstance } from '../world/representation/types/state';
import type { EntityId } from '../world/representation/types/primitives';
import type { AIProviderId } from '../ai/client';
import { proposeUserEvents } from '../ai/propose';
import { resolveUserAction } from '../world/runtime/kernel2Resolver';
import type { ProposedReality, ReasonCode } from './types';

export interface InterpretOptions {
  /** Which model path runs this attempt ('procedural' = offline deterministic). */
  provider: AIProviderId;
  /** Explicit dialogue target (click-injected); text naming still wins (kernel2Resolver). */
  targetId?: EntityId;
}

export interface InterpretationResult {
  /** Trace id linking this attempt to its route record. No trace → no commit. */
  traceId: string;
  /** Which interpretive path produced the proposal. */
  source: 'llm' | 'deterministic' | 'clarify';
  /** The proposal envelope. Change-arrays are always empty here (kernel derives them at commit). */
  reality: ProposedReality;
  /** Present iff source === 'clarify' — the notice the user should see. */
  clarify?: { notice: string };
  /** Frozen reason code for the clarify path ('LOW_CONFIDENCE'). */
  reasonCode?: ReasonCode;
  /** Wall-clock latency of this hop in milliseconds. */
  latencyMs: number;
}

let traceSeq = 0;
function nextTraceId(): string {
  traceSeq += 1;
  return `trace:${Date.now()}:${traceSeq.toString(36)}`;
}

export async function interpret(
  text: string,
  world: WorldDefinition,
  state: WorldStateInstance,
  actorId: EntityId,
  opts: InterpretOptions
): Promise<InterpretationResult> {
  const traceId = nextTraceId();
  const t0 = performance.now();

  const proposed = await proposeUserEvents(text, world, state, actorId, {
    provider: opts.provider,
    fallback: resolveUserAction,
    targetId: opts.targetId,
  });

  const latencyMs = performance.now() - t0;

  const reality: ProposedReality = {
    traceId,
    events: proposed.events,
    stateChanges: [],
    knowledgeChanges: [],
    observations: [],
    confidence: proposed.confidence,
    rationale: proposed.resolution,
  };

  return {
    traceId,
    source: proposed.source,
    reality,
    clarify: proposed.source === 'clarify' && proposed.notice ? { notice: proposed.notice } : undefined,
    reasonCode: proposed.source === 'clarify' ? 'LOW_CONFIDENCE' : undefined,
    latencyMs,
  };
}
