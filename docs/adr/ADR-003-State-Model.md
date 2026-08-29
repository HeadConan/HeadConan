# ADR-003 — State Model

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH

## Context

How is "what is true right now" represented, and how does it relate to "what happened"?

## Problem

Choose the authoritative state model. Full event sourcing (state = fold of log) vs mutable state vs snapshot-based. And decide what is authoritative vs derived.

## Decision

**Causal hybrid:** an **authoritative mutable state** (the working projection) + an **append-only causal event log** + periodic **snapshots**. The log is the causal record and the audit spine; the state is the efficient projection; snapshots bound replay cost.

- State is recomputable from (snapshot, log-suffix). This is event-sourcing *pragmatics* (Fowler's criterion: "you can discard the state and rebuild from the log"), not a requirement to rebuild on every read.
- **Authoritative:** entity attributes, relation dynamic state, facts (truth layer), per-observer knowledge (fact-id sets + beliefs), clock, scheduler queue.
- **Derived (never stored as truth):** situation/scene, significance, story, narrative prose, UI plan, character "sheets", any summary string.

## Reasoning

- Event sourcing (Fowler bliki; Marten `AggregateStreamAsync(stream, version)`) gives time-travel and audit, but full rebuild on every read is wasteful at 10⁴ entities — keep a working state.
- DES/Fighting-game precedent (Bettner & Terrano GDC'01; GGPO): replay = snapshot + ordered command stream; correctness depends on recording the *boundary* (see ADR-008 for LLM-as-recorded-input).
- rr (O'Callahan ATC'17): determinism is achieved by recording non-deterministic inputs, not by eliminating them — state model must have an explicit "recorded boundary" (user input, RNG seed, LLM outputs).

## Consequences

- Persistence = snapshots + log + knowledge store; restore = snapshot + fold suffix (bounded by snapshot frequency).
- "What was true at t" = snapshot before t + fold to t; "who knew at t" requires the bitemporal knowledge axis (ADR-005).
- Replay and branch (fork instance at log point) are cheap.

## Rejected Alternatives

- Pure event sourcing with state rebuilt every read (cost without benefit at this scale).
- Pure mutable state with no log (no audit, no causality, no branch).
- Snapshot-only (no history, no replay).

## Open Questions

- Snapshot cadence (every N events vs time-based). MEDIUM confidence, tune empirically.
