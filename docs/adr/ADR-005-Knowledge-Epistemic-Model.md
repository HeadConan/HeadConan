# ADR-005 — Knowledge / Epistemic Model

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH (grounded in Halpern & Moses, JACM 1990, Gödel Prize)

## Context

HeadConan needs: WORLD TRUTH ≠ what the player knows ≠ what character A knows ≠ what character B *believes*. We must represent knowledge without building a full modal-logic reasoner.

## Problem

Choose the minimum epistemic model capable of producing dramatic irony, secrets, misunderstanding, deception, investigation, and hidden information.

## Alternatives

1. **Full epistemic logic / possible-worlds semantics** (Halpern & Moses 1990). Formally powerful but: (a) common knowledge is *impossible in any practical system* — communication cannot establish it; (b) model checking epistemic formulas is expensive; (c) overkill for a game runtime.
2. **Access-control "knowledge as read permission"** — treat facts like a capability matrix. Cheap but cannot represent *belief* (false knowledge), confidence, or suspicion — no misinformation, no "Loid suspects but isn't sure".
3. **Hybrid: per-observer fact-ownership + tagged beliefs + observation-derived updates.** **(Accepted.)**

## Decision

Knowledge = **per-observer, event-derived, layered**:

```
TRUTH LAYER     — facts (visibility label + provenance). Authoritative.
KNOWLEDGE LAYER — per observer: knownFactIds ⊆ Facts. Updated ONLY by observation side-effects of events (the epistemic write path).
BELIEF LAYER    — per observer: tagged belief items { statement, sourceType, confidence, accuracy? }. Can be FALSE (misinformation). Accuracy is a derived comparison, never stored as truth.
```

- Fact visibility is an **access lattice** (public → institutional → restricted → intimate → singular-secret → cosmic), enforced at projection time, not at storage time. No read-up: a projection can never widen the observer's own access.
- **Observers**: player, host, each character, and any future agent. Host = observer with `omniscient` access (visibility bypass), modeled as a projection parameter, not a separate store.
- **No common-knowledge reasoning** (Halpern & Moses: unattainable in practice). "Everyone knows p" is computed on demand as an *intersection* of knownFactIds — an approximation, documented as such.
- Beliefs do not auto-converge; changing a belief is itself an event (observation-derived or LLM-proposed, both logged).

## Reasoning

- Halpern & Moses (1990, JACM 37(3):549–587) prove common knowledge is unattainable with unreliable communication and is required for true coordination — so we never chase it. We keep the useful part: agents act on their **local state** (indistinguishability), i.e., their own knowledge set, never global truth.
- POMDP framing (Kaelbling et al. 1998): an agent's decision uses its observation function, not the true state. Characters and the player must act on their projection.
- The "leak" failure mode is eliminated by making projection the **only read path**: UI and LLM receive projections, never raw truth.

## Consequences

- `projectPerspective(world, state, observer)` is a pure function used everywhere a view is produced (UI, LLM context, host tools).
- Knowledge updates happen only inside `applyEvent` observation side-effects → replay-safe.
- Dramatic irony = `hostView ≠ playerView` (projection difference) — computed, not scripted.
- Character "theory of mind" is *cheap by construction*: the agent's LLM context is its own projection + the belief layer; recursive belief ("I believe she believes…") is only materialized when a rule explicitly creates such a belief item.

## Rejected Alternatives

- Full S5 modal logic (common knowledge impossible; model checking costly).
- Pure access-control (cannot represent false belief / suspicion).
- Knowledge graph as the truth store (KGs are for incomplete knowledge; see ADR-002).

## Open Questions

- Whether suspicion/confidence need a richer representation (continuous vs discrete). MEDIUM confidence: discrete tags + numeric confidence are enough for v1.
- When to materialize higher-order beliefs ("A believes B believes p"). LOW confidence: only on explicit author rules for v1.
