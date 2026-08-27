# HEADCONAN EXPERIMENTS & DEMO WORLDS

Iteration 2 provides three fully fleshed-out demo worlds showcasing distinct interface languages and role slots.

---

## 1. The Sovereign Imperium of Valen
* **Genre**: Political Simulation & Authoritarian Intrigue
* **Visual Language**: Institutional Bureaucracy (Obsidian marble, Deep Indigo, Serif headings).
* **Primary Surface**: Strategic Garrison Theater & Territorial Map.
* **Roles**:
  - `Supreme Archon Alexander` (Player — First-person executive decrees)
  - `Imperial Shadow Overseer` (Director — Spawning mutinies & leaking memos)
  - `Cosmic Statecraft Architect` (Architect — Rewriting communication axioms)
  - `Grand Imperial Chronicler` (Observer)

---

## 2. St. Jude's Autumn Semester
* **Genre**: Collegiate Life & Social Sphere
* **Visual Language**: Modern Academic (Warm emerald & amber accents, clean sans typography).
* **Primary Surface**: Social Network & Lab Partner Collaboration.
* **Roles**:
  - `Alex Morgan` (Player — Senior honors scholar balancing thesis & friendships)
  - `Campus Proctor & DM` (Director — Spawning surprise pop-quizzes & protests)
  - `The Campus Chronicler` (Observer)

---

## 3. The Blackwood Manor Poisoning
* **Genre**: 1928 Murder Mystery & Detective Noir
* **Visual Language**: Archival Corkboard & Sepia Noir (Pushpins, evidence exhibits, red yarn links).
* **Primary Surface**: Interactive Case Evidence & Deduction Corkboard.
* **Roles**:
  - `Inspector Arthur Finch` (Player — Scotland Yard forensic investigation)
  - `The Shadow Novelist` (Director — Planting forged notes & triggering storms)
  - `Coroner's Silent Inquest` (Observer)

---

# ARCHITECTURAL EXPERIMENT LOG (from 2026-08-27)

> Experiment protocol: criteria written as assertions (vitest); conclusions decided by tests; on falsification, record "which ADR to revise".
> Test location: `src/world/runtime/instantiate.test.ts` (E1). Run: `npm test`.

## E1 — Can a single world representation simultaneously support "canon" and "parallel scenes"?

- **Hypothesis** (ADR-1 / HEADCONAN_KERNEL §5): `WorldDefinition + ScenarioSeed → WorldInstance`, multiple instances do not cross-contaminate; the seed can express divergence.
- **Result**: ✅ **CONFIRMED** (9/9 assertions passed)
- **Evidence**:
  1. Both paths of `instantiate()` are usable: the synthetic path (synthesize initial state from the definition) and the base-state path (deep-copy the hand-written `*_INITIAL_STATE`).
  2. Three instances (canon / Cersei confronts first / Master of Coin perspective) have independent IDs, zero shared references (entity / relationship / cognition arrays / resource pool); mutating A does not affect B/C and does not contaminate the definition.
  3. The seed can express four kinds of divergence: location, relationship affinity, resource, reputation.
  4. The same action produces different results in different instances: in the canon instance "confront" is rejected (no co-presence), while in the divergent instance it passes and triggers the "Robert's death" cascade event into the log; the same effect (reputation -10) yields different absolute results under different initial values (82 vs 40).
- **Key finding (P2 must-do)**: the existing `evaluateWorldAction` implements only 2 of the 7 precondition types (`requires_co_presence` / `requires_capability`); `requires_knowledge` is silently ignored — "the unaware Ned can also confront Cersei" constitutes a cognition leak. The P2 event kernel must implement all precondition types, otherwise the information-asymmetry architecture fails.
- **Deliverables**: `src/world/runtime/instantiate.ts` (`instantiate` / `synthesizeInitialState` / `applyStateEffect`); `vitest.config.ts` + `npm test` script; no ADR change.
