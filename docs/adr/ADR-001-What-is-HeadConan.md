# ADR-001 — What is HeadConan?

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH (converged from 8 research fields)

## Context

HeadConan lets a user enter, act inside, and shape an imagined world; the interface adapts; characters have private knowledge; the world persists. Prior docs oscillate between "generative UI platform", "world runtime", "simulation engine", "interactive narrative". We must decide what the system fundamentally *is* before designing modules.

## Problem

What kind of system is HeadConan? (game engine / narrative engine / simulation / agent environment / UI runtime / epistemic simulation / ...)

## Alternatives

1. **Narrative engine** — story is the primitive, world serves plot. (Rejected: research shows story is emergent, not stored — Aylett 1999; Dwarf Fortress; storylet theory.)
2. **Chatbot/LLM wrapper** — the LLM is the system. (Rejected: no persistent causal state, no epistemic integrity; Ai-Dungeon drift shows raw generation is insufficient.)
3. **Game engine** — render loop, ECS, physics-first. (Rejected: HeadConan's worlds are ~10³–10⁴ entities, not 10⁶; ECS is a performance artifact, not semantics.)
4. **Simulation runtime with epistemic + projection layers** — the world is causal state + events; knowledge is per-observer; UI is a projection. **(Accepted.)**

## Decision

HeadConan is a **causal, discrete-event world simulation** with three subordinate layers:

```
CAUSAL CORE   — typed world state + append-only event log + rules (what is true, what happened)
EPISTEMIC     — per-observer knowledge/belief, updated only by observation side-effects (who knows)
EXPERIENCE    — derived projection: situation → perspective → significance → UI (what you see)
```

Story is **derived** (an interpretation over the log). UI is **derived** (a projection of situation + perspective). Characters are **hybrid actors** (entity + state + policy + knowledge). The LLM is a **decision/generation service** inside the causal core's producers — never the world.

## Reasoning

- Endsley's situation awareness (1995) treats perception/comprehension/projection as architecture-level responsibilities; the runtime must maintain canonical state, per-turn deltas, and pre-computed projections.
- Dwarf Fortress + Generative Agents show believable worlds come from *simulation + memory*, not authored narrative; the "story" emerges when a reader projects over the log.
- Concordia's Game Master lesson: narration must be subordinate to a single source of truth to prevent LLM contradiction.
- Halpern & Moses (1990) + POMDP framing show agents must act on observation functions, never global state — this is the epistemic spine.

## Consequences

- The event log is the causal record; state is the working projection; knowledge is per-observer; UI never reads raw truth (only projections).
- "Interactive narrative" becomes an *optional derived layer* (a curator/drama-manager that ranks content by tension), not part of the core.
- We explicitly do NOT build: a quest/story engine, a full modal-logic reasoner, a learned "world model", or an ECS.

## Rejected Alternatives

- Story-first narrative engine (story is emergent, not primitive).
- LLM-as-the-system (no causal integrity).
- Full epistemic logic / common-knowledge reasoning (provably expensive; Halpern & Moses).
- Learned world model as truth (Dreamer/VWM drift over long horizons; Ha & Schmidhuber 2018).

## Open Questions

- How much autonomous agent behavior is justified for v1? (See ADR-006.)
- Where exactly does the drama-manager/curator layer belong if we add it? (Deferred.)
