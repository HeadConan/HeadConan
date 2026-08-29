# ADR-006 — Character Architecture

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH (grounded in Versu, Prom Week/CiF, Generative Agents, Concordia)

## Context

What is a HeadConan character computationally? LLM agent? State machine? Goal-directed actor? Policy?

## Problem

Choose a character architecture balancing believability, cost, latency, consistency, controllability, and reproducibility.

## Alternatives

1. **Full LLM agent** (Generative Agents, Park et al. 2023: memory stream + reflection + planning). Believable emergence but: cost explosion, memory drift, "over-polite" behavior, hard to control.
2. **State machine** — cheap, deterministic, but flat and unexpressive; cannot improvise.
3. **Goal-directed actor (GOAP/BDI-lite)** — goal selection + planning; good structure, heavy authoring for open worlds.
4. **Hybrid: stateful social model + reactive policy + LLM-at-decision.** **(Accepted.)**

## Decision

Character = **Entity + State + Knowledge + Policy**, where policy is layered and the LLM is *one decision service among several*, invoked only where language/craft matters:

```
CHARACTER = {
  entity  (identity, attributes, location, inventory)
  state   (emotionalState, physicalStatus, goals[], needs[], reputation, dynamicAttributes)
  knowledge (knownFactIds + beliefs — see ADR-005)
  policy  (layered, first applicable wins):
    1. RULE LAYER        — hard preconditions/effects (physics, permissions, canon) — deterministic
    2. UTILITY/REACTIVE  — affordances suggested by social practices (Versu lesson): practices never
                           control the character, they propose options; character picks by utility
    3. GOAL LAYER (BDI-lite) — if belief changes violate an active goal → re-plan (deterministic scripts
                           or LLM plan decomposition)
    4. LLM LAYER         — dialogue, improvisation, open-ended response; grounded in THIS character's
                           projection + belief layer; output is a *proposed event*, validated downstream
}
```

- **Social practices as affordances** (Versu, Evans & Short 2014): a "practice" (family dinner, interrogation, greeting) supplies the available action vocabulary for a situation and the expected role behavior — but the character decides whether to participate. This solves the Sims "strange behavior" failure (Sims characters autonomously bathe in the neighbor's house).
- **Social exchanges as typed operations with preconditions/effects** (Prom Week/CiF): exchanges are the unit of social computation — deterministic validation, LLM flavor.
- **The LLM never writes state**: it proposes an action/speech; the kernel validates and applies effects. This is the Concordia lesson (narrator/agent subordinate to the simulation's single source of truth).
- Reproducibility: LLM decisions are **recorded as inputs** (see ADR-008), so the *recorded* history is deterministic even though the *decision* is stochastic.

## Reasoning

- Versu (Evans & Short, IEEE TCIAIG 6(2) 2014): practices-as-affordances + utility selection produced replayable, authorable drama without a puppet master — the most relevant precedent for HeadConan's social worlds.
- CiF/Prom Week: reusable "social physics" — explicit preconditions/effects for social exchanges; directly analogous to our storylet-shaped rules.
- Park et al. (2023) Generative Agents: demonstrates LLM believability but with cost/drift problems — HeadConan v1 uses the LLM only at decision points, with the stateful social model doing the bookkeeping.
- Concordia (Vezhnevets et al. 2024): agents live in a world governed by a "Game Master" that anchors every action to canonical state — our kernel plays that role deterministically.

## Consequences

- NPCs can be fully reactive in v1 (rule + utility + optional LLM at dialogue). No full autonomous loop required (DO_NOT_BUILD-YET #1).
- Characters are inspectable: goals, beliefs, emotional state are data (theory-of-mind cheap).
- The player-as-character uses the same policy interface with the "human controller" at the LLM layer position.
- Authoring cost is contained: authors write practices/rules + character traits; they do not script dialogue trees (Twine failure mode).

## Rejected Alternatives

- Pure LLM agent (cost/drift; Park et al.).
- Pure state machine (no improvisation).
- Pure BDI with full planning (heavy authoring; open worlds).
- Drama-manager puppeteering (Façade fragility; single script; breaks replayability — Evans & Short 2014).

## Open Questions

- How many "practices" does the SPY × FAMILY slice need? MEDIUM confidence: ~4 (family_meal, conversation, interrogation, everyday).
- When to upgrade NPCs to autonomous scheduling (world tick)? LOW confidence: only after the reactive layer feels "dead" (RimWorld storyteller may be the right pace-controller, not raw autonomy).
