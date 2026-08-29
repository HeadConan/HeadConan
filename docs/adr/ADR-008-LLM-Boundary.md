# ADR-008 — LLM Boundary

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH (recorded-input determinism: rr, O'Callahan 2017; Concordia 2024)

## Context

Where do LLMs belong in a runtime that must be replayable, auditable, and epistemically sealed?

## Decision

**Deterministic core + generative layer.** The LLM is a producer of *proposals and prose*; the kernel is the sole writer.

```
LLM MAY (generative layer):
  - interpret user intent into a candidate action   (LLM proposes, validator confirms)
  - propose character dialogue / improvisation      (grounded in that character's projection)
  - narrate the log into prose                       (derived; never stored as truth)
  - synthesize world definitions / storylets         (authoring aid; validated before commit)

LLM NEVER (deterministic core):
  - write authoritative state
  - enforce rules, permissions, or knowledge boundaries
  - update knowledge/beliefs directly (only observation side-effects do)
  - log events, or design UI layout directly
```

**Recorded-input determinism (the critical rule):** the LLM's output is appended to the event log as an *input record* (like rr records syscalls; like deterministic engines record RNG seeds). Replay replays the recorded output, not a re-generation:

- Replaying "what happened" is deterministic even though generation is stochastic.
- Re-generation (for "what *would* happen if…") may differ — explicitly non-goal for v1.

## Reasoning

- rr (O'Callahan, USENIX ATC 2017): deterministic replay is achieved by recording non-deterministic inputs, not by eliminating them. Our LLM decisions are the RNG of the story — record them.
- Concordia (Vezhnevets et al. 2024): LLM agents in a simulated world need a "Game Master" that anchors every action to canonical state; without it, models hallucinate/contradict. Our kernel plays Game Master deterministically.
- Generative Agents (Park et al. 2023): LLM memory pipelines drift; therefore user-visible history and truth must come from the canonical log, not from agent memory.

## Consequences

- Validation is a **hard contract**: LLM outputs are parsed into typed candidate events; unparseable/impossible proposals are rejected with a reason (rejection is an event).
- LLM context is always a **projection** (ADR-005) — no raw state, so no epistemic leakage by construction.
- The log becomes the single audit trail for both human and LLM actions.

## Rejected Alternatives

- LLM writes state directly (no invariants; the pre-Zero `mutations.ts` + `engine.ts` pattern).
- Pure deterministic rules, no LLM (loses improvisation; Twine-style authoring cost).
- "Ask the LLM to fix consistency" (narrative-transportation research: contradictions are the strongest immersion breakers; Green & Brock 2000 — patch at the source, not the prose).

## Open Questions

- Structured function-calling vs free-text-proposal+validator for intent. HIGH confidence validator-first; exact schema TBD.
- Latency budget for LLM decision points in an interactive loop. LOW confidence; measured empirically in the slice.
