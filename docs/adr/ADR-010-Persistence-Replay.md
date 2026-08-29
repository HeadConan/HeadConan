# ADR-010 — Persistence / Replay

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH (event sourcing + DES + fighting-game replay precedents)

## Context

How do we persist a world so we can answer "what happened", "what is true", "what was true yesterday", "who knew at that moment", and replay/branch/debug?

## Decision

**Causal hybrid persistence** (see ADR-003): snapshots + append-only event log + per-observer knowledge store with a **bitemporal** knowledge axis.

```
PERSISTED:
  snapshot(N)            — authoritative state at log offset N (periodic; also on branch/save)
  eventLog               — append-only causal record; events carry provenance + LLM inputs recorded
  knowledgeStore         — per-observer knownFactIds + beliefs, each entry stamped
                            { valid_from (world time), learned_at (log offset) }  ← bitemporal
  definitionVersions     — versioned world definitions (for Host rule edits)
DERIVED:
  "what happened"      = query eventLog
  "what is true"       = state (snapshot + fold)
  "what was true at t" = snapshot before t + fold suffix
  "who knew at t"      = knowledgeStore entries with valid_from ≤ t < valid_to  (bitemporal query)
  "why is this true"   = provenance chain on the fact / last-mutating event
```

- **Replay** = snapshot + fold recorded log; deterministic because LLM outputs are recorded inputs (ADR-008).
- **Branch** = fork at log offset (copy instance + parent pointer).
- **Save/load** = snapshot + log tail; restore is the fold.
- **The kernel is pure**: `applyEvent(state, event) → nextState` with no hidden I/O, so the fold is reproducible.

## Reasoning

- Fowler's event sourcing (bliki; Marten): state can always be rebuilt from the log — that property is what we keep, but we hold a working state for cost.
- Fighting-game netcode (GGPO; Bettner & Terrano 2001): determinism + rollback needs a deterministic core and a recorded boundary — our LLM-recorded-input rule is that boundary.
- Bitemporal modeling (Snodgrass, "Developing Time-Oriented Database Applications in SQL", 1999): valid time (world) vs transaction time (when known) is exactly the two questions "what was true" vs "who knew" — HeadConan needs both for epistemic audit (ADR-005).

## Consequences

- Debugging: any user-visible state is explainable from the log ("you're here because events 12→19").
- The vertical slice can ship with a simple localStorage adapter; the abstraction (snapshot+log+knowledge) ports to any store.
- No cloud required for v1; multi-device sync is explicitly non-goal.

## Rejected Alternatives

- Single-object JSON world dump (pre-Zero; no history, no branch, no audit).
- Pure log-only (rebuild cost at 10⁴ entities).
- Cloud database first (unnecessary; slows the slice).

## Open Questions

- Snapshot cadence and compaction policy. MEDIUM confidence; empirical.
- Knowledge-store bitemporal granularity (per fact vs per belief). MEDIUM confidence: per-entry stamping is enough.
- Definition-change migration semantics when Host edits rules live. LOW confidence; schema TBD.
