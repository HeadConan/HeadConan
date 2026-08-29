# ADR-004 — Event / Causality Model

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH

## Context

What changes the world, and how is causality represented and audited?

## Decision

**The event is the only mutator and the only causal record.** All state changes — player, NPC, Host, scheduler, rule-driven — enter as events through one kernel:

```
applyEvent(world, state, event)
  → { nextState, spawnedEvents[], observations[], rejected?, reason? }
```

- Event types include: `action` (player/agent attempt; may be rejected), `speech_act`, `intervention` (Host; privileged), `scheduled_trigger`, `world_tick`, `definition_change` (meta-event; Host rule edits).
- **Rejection is itself an event** (logged, observable: "you tried and failed; someone noticed").
- **Observations are projections of events**: an event declares witnesses/visibility; observation side-effects are the *only* path that updates knowledge.
- **Consequences are queued events** (immediate or delayed via scheduler) — bounded drain budget prevents cascades.
- Event IDs are deterministic (turn:seq:type); no `Date.now`/`Math.random` inside the kernel (DES discipline; determinism required for replay).

## Reasoning

- Discrete-event simulation (Fujimoto 2000): conservative scheduling — agents see only committed events; causal violations are avoided by ordering, not rollback (important: LLM decisions cannot be cheaply rolled back).
- Dwarf Fortress (Adams, GameAIPro2 ch.41): history is "a record of simulation"; a single log from worldgen through live play.
- Fowler event sourcing: the log answers "what happened", "why is this true", "who caused what" via provenance.
- Storylet model (Kreminski & Wardrip-Fruin): preconditions + effects over state — the kernel is the storylet engine; narrative emerges from the log.

## Consequences

- Single-writer kernel = single place to enforce invariants, permissions, provenance, determinism.
- Branching = fork the log; replay = snapshot + fold.
- Audit ("who knew, who did what") = queries over log + knowledge store.

## Rejected Alternatives

- Actor/message-passing as the core (nondeterministic ordering, hard replay — see ADR-003).
- LLM direct state mutation (no invariants, no audit).
- Separate event paths for player vs Host (one kernel, privileged event types — ADR-007).

## Open Questions

- Drain budget policy (per-world config). MEDIUM confidence.
- Whether `definition_change` needs a separate "definition version" ledger. HIGH confidence it does; schema TBD.
