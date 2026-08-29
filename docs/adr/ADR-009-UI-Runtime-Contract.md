# ADR-009 — UI / Runtime Contract

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH (grounded in SA theory, adaptive-interface literature, scene-driven UI)

## Context

What does the UI receive from the runtime, what may it request, and what is authoritative vs derived? Fixed / template / capability / generative / scene-driven UI?

## Decision

**Scene-driven UI over a projection contract.** The runtime exposes a read-only API of *projections*; the UI renders them; the UI's only write path is *submitting actions*.

```
RUNTIME EXPOSES (read-only, per active perspective):
  S — canonical state query (entities, relations, facts within the projection)
  Δ — per-turn delta + causality chain ("what changed, why")
  K — the observer's knowledge/belief layer
  A — affordances: valid actions for the current situation (from practices/rules)
  E — environment signals (time, tension, invariants-health)
UI REQUESTS:
  submitAction(candidate) — the only write; validated by the kernel
```

- **A scene is a derived projection of situation + perspective**: `scene = project(state, perspective, affordances)` — not an authored page, not a stored screen.
- **The UI is never generative-from-scratch.** It selects/composes from a **stable capability set** (map, dialogue, evidence board, schedule, dossier, graph, ...) driven by scene type + world experience signals. Content is data; layout is derived from scene + affordances; world-specific identity comes from theme tokens, not from separate apps.
- **Stable frame + dynamic content** (falsified alternatives below): navigation, input dock, world identity stay fixed; the stage and its satellites change with the scene.
- **Adaptation must not destroy the user's mental model**: adaptive-interface research shows unpredictable adaptation breaks comprehension — so the frame is stable, content changes are *additive/progressive*, the user can pin/lock a view, and adaptation exposes its rationale ("why am I seeing the evidence board now").
- **Situation awareness is a contract, not polish** (Endsley 1995): the runtime must provide L1 (perception: canonical state), L2 (comprehension: deltas + causality), L3 (projection: pre-computed consequences/trajectories) — the UI renders all three levels, never forcing the user to reconstruct the world mentally.

## Reasoning

- Scene-driven UI = "represent the current reality and afford the right actions", not "generate beautiful interfaces".
- Adaptive-interface literature (Gajos et al.): model-based adaptation helps, but unpredictable adaptation breaks the user's mental model — hence stable frame + explicit rationale + pinning.
- Endsley SA three levels map 1:1 to the contract's S/Δ/plus-precomputed-projection — SA support is architectural.
- Storylet/practice model gives a clean affordance source: A comes from rules/practices whose preconditions hold in the current state.

## Consequences

- The UI never reads raw truth (ADR-005 projection-only) → epistemic leakage is impossible by construction.
- UI is replaceable: same contract renders web today, native later.
- World-specific UI emerges from scene type + experience signals + theme — no hardcoded "Spy×Family screen".
- Affordances are always valid (kernel-validated), so buttons never fire impossible actions.

## Rejected Alternatives

- Fixed UI (SaaS dashboard failure mode; the pre-Zero 3-column grid).
- Full generative UI (LLM designs layout: unreproducible, unmaintainable, violates recorded-input determinism).
- Template-driven only (insufficient for radically different worlds).
- Capability-driven only (registry without scene semantics = palette, not composition).

## Open Questions

- Exact scene-type set for v1 (conversation / everyday / investigation / political / world-edit?) — MEDIUM confidence; lock after the slice.
- How much adaptation rationale to surface without adding noise. LOW confidence; user-test.
