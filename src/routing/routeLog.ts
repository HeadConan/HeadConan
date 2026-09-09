/**
 * HeadConan Routing — Stage A6: route decision record registry (observability).
 *
 * Source plan: docs/ROUTING_PLAN.md Stage A6.
 * The route log is an in-memory, append-only registry of immutable RouteDecisionRecords —
 * the same append-only discipline as the event log (ROUTING_PLAN.md §6).
 *
 * It is a session-lifecycle audit side-channel: it holds NO world authority. The kernel
 * (applyEvent) remains the single writer of world state; this module only remembers what
 * path each routing attempt took so that any traceId is reconstructible afterwards.
 *
 * Query surface: byTrace / byPath / byReasonCode / byFallback / outcomeMix / latencyPercentiles.
 */

import type { RouteDecisionRecord, RouteOutcome, RoutePath, ReasonCode } from './types';
import { isRouteDecisionRecord } from './types';

const records: RouteDecisionRecord[] = [];

/** Clear the registry (session boundary; the plan scopes the log per session). */
export function resetRouteLog(): void {
  records.length = 0;
}

/** Append one route decision record. Records are treated as immutable once added. */
export function addRecord(record: RouteDecisionRecord): void {
  records.push(record);
}

/** Snapshot of every record in arrival order. Copy-on-read: never expose the backing array. */
export function allRouteRecords(): readonly RouteDecisionRecord[] {
  return records.slice();
}

/** Full path for one attempt — the terminal record carries classification/path/results/outcome. */
export function byTrace(traceId: string): RouteDecisionRecord[] {
  return records.filter((r) => r.traceId === traceId);
}

export function byPath(path: RoutePath): RouteDecisionRecord[] {
  return records.filter((r) => r.pathTaken === path);
}

export function byReasonCode(code: ReasonCode): RouteDecisionRecord[] {
  return records.filter((r) => r.reasonCode === code);
}

export function byFallback(): RouteDecisionRecord[] {
  return records.filter((r) => r.fallbackUsed);
}

/** Route outcome mix (dashboards: commit/clarify/reject/skip/requeue). */
export function outcomeMix(): Record<RouteOutcome, number> {
  const mix: Record<RouteOutcome, number> = { commit: 0, clarify: 0, reject: 0, skip: 0, requeue: 0 };
  for (const r of records) {
    mix[r.outcome] += 1;
  }
  return mix;
}

/** Routing overhead percentiles (excludes model call time by convention — p95 ≤ 5 ms gate). */
export function latencyPercentiles(): { p50: number; p95: number } {
  if (records.length === 0) return { p50: 0, p95: 0 };
  const sorted = records.map((r) => r.latencyMs).sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(Math.max(0, Math.ceil(q * sorted.length) - 1), sorted.length - 1)];
  return { p50: at(0.5), p95: at(0.95) };
}

export { isRouteDecisionRecord };