# HeadConan Architectural Experiments

> Goal: **Kill the most dangerous assumptions with the smallest possible experiments.** Each experiment ≤ 1 day, pure code (fully decoupled from the existing UI); the conclusion is either "assumption holds" or "assumption falsified → go back to ARCHITECTURAL_DECISIONS to revise".
> Precondition: `src/world/representation/*` is usable (four baseline worlds + projector + evaluator).

---

## E1 — Can a single world representation support both "canon" and "parallel scenarios" simultaneously?

- **Assumption (ADR-1 / Kernel §5)**: `WorldDefinition + ScenarioSeed → WorldInstance`, with multiple instances not polluting each other.
- **Setup**: Using the GAME OF THRONES definition, construct three seeds: `canon` (canonical opening), `voldemort_wins` ("what if Ned refused to go south"), `player_minister` (the player becomes the magic minister / lord). After each `instantiate()`, run 3 events per instance.
- **Kill Criteria**:
  - ✅ Holds: The three instances' states do not affect each other; the same event produces different results in different instances (due to different initial states).
  - ❌ Falsified: Any reference leakage between instances (shared array/reference); or the seed cannot express "divergence".
- **Output**: The formal interface signature of `instantiate(world, scenario) → WorldInstance`.

---

## E2 — Can a single action produce bounded cascading consequences?

- **Assumption (ADR-2 / ADR-3)**: "Publicly accuse the minister" → effects + observation (council members learn) + queued consequences (minister responds, faction takes a stance).
- **Setup**: SPY×FAMILY or GoT definition; write rules for `public_accusation` (direct effects + 2 delayed consequences); after `applyEvent`, manually trigger the scheduler queue for 3 rounds.
- **Kill Criteria**:
  - ✅ Holds: Cascade depth ≤ budget cap; every consequence originates from an explicit rule; the log can replay the same trajectory in order.
  - ❌ Falsified: The cascade cannot terminate (needs hardcoded depth); or consequences contradict each other (faction A takes a stance, then flips due to event B).
- **Output**: The specification of the scheduler queue + drain budget; evidence for whether the rule "consequence" field needs `delayInTurns` / `afterInUniverseTime`.

---

## E3 — Can two characters hold different cognition of the same fact, without leakage?

- **Assumption (ADR-4)**: `Fact(loid_is_twilight)` is visible to Loid but not to Yor; the projector outputs different views; the LLM context contains only each one's own projection.
- **Setup**: Using the SPY×FAMILY definition; project Loid / Yor / Anya / god perspective separately; compare the four views; then inject an `observation` event (Anya reads minds) and re-project.
- **Kill Criteria**:
  - ✅ Holds: All four views are each correct (Anya's view contains Loid+Yor's secrets, Loid's view does not contain Yor's secret); the cognitive record updates precisely after the observation event and does not ripple to others.
  - ❌ Falsified: Any path that "directly reads the full state" is accidentally used by the UI/LLM; or the observation side effect leaks a secret to someone not present.
- **Output**: A performance baseline for the projector (cost per projection); the formal definition of the "observation side effect" write channel.

---

## E4 — Can the same world state produce different UI layouts?

- **Assumption (ADR-7 / ADR-8)**: Layout is derived from state + character lens + focus; the player and the host see the same world and get different presentation plans.
- **Setup**: Construct a medium-complexity state (containing one public accusation event); feed the same input to the "player lens" and "host lens" significance + presentation planning; compare the two `PresentationPlan`s.
- **Kill Criteria**:
  - ✅ Holds: The two plans differ significantly in stage mode / focus / visible content, and both are "reasonable" (player: dialogue + suspicion; host: full map + intervention controls).
  - ❌ Falsified: The two plans are nearly identical (the lens had no effect) → indicates the cognitive projection is not wired into salience, or the salience formula degraded into static rules.
- **Output**: An implementable version of `significance(state, perspective, profile) → ExperienceState`; initial weights for the FocusScore four factors.

---

## E5 — Can the host modify the world without bypassing the runtime?

- **Assumption (ADR-6)**: Intervention = an ordinary event with provenance, through the same kernel; changing rules = a `define_modification` versioned event.
- **Setup**: On the instance from E1, the host performs: ① inject a crisis event; ② change one character's relationship affinity toward another character to -50; ③ modify an axiom (e.g., "communication delay doubled"); all through `applyEvent`, then verify the log is complete, the rules take effect, and the player view changes naturally after projection.
- **Kill Criteria**:
  - ✅ Holds: All three interventions enter the log; no bypass API needed; undo = rollback to the pre-intervention snapshot.
  - ❌ Falsified: The intervention must bypass precondition validation to take effect (indicates the permission model is wrong); or existing state becomes invalid after the definition change (version incompatibility).
- **Output**: The permission validator (who can submit what event) + the specification of the definition versioned diff.

---

## E6 (supplementary) — Is a failed action itself a meaningful event?

- **Assumption**: "Attempted but failed" should enter the log and be presentable ("You tried to sneak in, spotted by the guard").
- **Setup**: In the GoT definition, have the player perform an action on an unauthorized object (e.g., a commoner commanding the king).
- **Kill Criteria**:
  - ✅ Holds: The rejection is logged; if there is a witness, the observation side effect occurs normally (the guard noticed); the experience layer can present "failure is also a result".
  - ❌ Falsified: The rejection must silently disappear (no narrative value).
- **Output**: The logging / observation / presentation specification for `rejected` events.

---

## Experiment Execution Rules

1. **Each experiment is independently runnable** (not dependent on other experiments' code), but shares the `representation/` foundation.
2. **All kill criteria are written as assertions** (even if in a temporary script): the conclusion is decided by tests, not by impressions.
3. **A failed experiment is a result**: record "why the assumption was wrong, which ADR to revise", then continue — this is precisely the meaning of architectural falsifiability.
4. After completion, summarize into `docs/EXPERIMENTS.md` (a continuation of the existing experiment log).
