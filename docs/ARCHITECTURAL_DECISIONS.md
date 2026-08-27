# HeadConan Architectural Decisions

> Each decision follows a fixed format: **Problem / Options / Decision / Rationale / Cost / What would change our mind**.
> The last item is crucial: the architecture must remain falsifiable.

---

## ADR-1 Kernel Shape: Event Transition Kernel (not graph / state machine / agent society)

- **Problem**: What should be the center of gravity of HeadConan? A world graph, a state machine, an event engine, an agent society, or a simulation runtime?
- **Options**: A) World graph (entities + relationships as kernel); B) State machine; C) Event engine; D) Agent society; E) Simulation runtime (precisely defined).
- **Decision**: **E, precisely defined as the "world transition kernel"**: the pure function `State × Event → { State′, Events, Observations, rejected? }`, rule-driven and the single writer.
- **Rationale**: ① It is the convergence point of all correctness (determinism/preconditions/cascade/observation/provenance are all adjudicated here); ② It makes "the world is independent of the interface" hold (all subsystems are bounded by its contract); ③ It unifies Player/Host/Agent (the only difference is in how events are produced and permissions); ④ It is testable (regression over the four baseline worlds).
- **Cost**: Requires investment to get the rules engine right; the scheduler and budget control are extra complexity; resisting the temptation of the "graph/agent" intuition.
- **What would change our mind**: If in real scenarios "out-of-rule inference" (fully free-form LLM causality) occupies too large a share, deterministic bookkeeping becomes a bottleneck, and event-log replay/rollback is never actually used — then degrade to "LLM writes state directly + pure audit log".

---

## ADR-2 Runtime Cadence: Dual-cadence (user loop + world tick), sharing one kernel

- **Problem**: How does the world advance? Pure user-driven, pure event-driven, pure actor, or hybrid?
- **Options**: A) Single loop (user input → one transition); B) Pure event-driven (dispatch handlers); C) Pure actor (message passing); D) Dual-cadence single kernel.
- **Decision**: **D**. The user loop (intent → event → kernel → drain → present) and the world tick (agent perceives → decides → acts) share `applyEvent`.
- **Rationale**: A cannot express an autonomous world and delayed consequences; B/C have non-deterministic timing and are hard to replay; D separates "deterministic bookkeeping" from "non-deterministic decision", supporting offline evolution and online incremental presentation.
- **Cost**: Scheduler + drain budget (to prevent cascade explosion); "present only the important results of a tick" needs the salience layer (P6) to cooperate.
- **What would change our mind**: If autonomous ticks cause the user to lose a sense of control (the world drifts while the user isn't looking), and "user-turn-based" proves to be the better experience — then revert to A, using ticks only for delayed consequences.

---

## ADR-3 Event Model: Five-concept distinction, but the event log is the sole storage spine

- **Problem**: Should Action / Event / StateChange / Observation / Consequence be merged?
- **Options**: A) Merge all into one "change object"; B) Store each independently; C) Semantic distinction, single physical layer (the log).
- **Decision**: **C**. Action is input, event is a log record, state change and observation are projections of the event, consequence is a queued event. **Only the event log is persisted.**
- **Rationale**: Semantics are not merged (otherwise one cannot express "the attack failed but was seen"); physically not duplicated (avoids multiple sources of truth).
- **Cost**: Requires an event type system and projection rules; materializing observations (writing back into cognitive records) must be carefully designed to stay consistent with the log.
- **What would change our mind**: If observation/state derivation is too expensive to replay and cannot be done incrementally, then allow "materialized snapshot + log verification", but the snapshot must be provably a function of the log.

---

## ADR-4 Information Asymmetry: Cognition Ledger + Projection Function (no full cognitive logic)

- **Problem**: How to handle truth ≠ cognition ≠ perception?
- **Options**: A) Full cognitive logic (possible worlds / knowledge operators); B) Cognition ledger (knownFacts attribution) + pure-read projection; C) Character visibility mask.
- **Decision**: **B**. The fact layer carries visibility domain and provenance; the cognitive record stores only "entity → known fact IDs + beliefs"; observation is the sole write channel; projection happens at presentation time.
- **Rationale**: A is over-engineered; C cannot express beliefs (false cognition) and the exposure dynamics of secrets; B balances expressiveness and complexity, and is already partly implemented by `representation/`.
- **Cost**: Belief evolution rules are not yet defined (see OPEN_QUESTIONS); "leak" bugs may hide in direct-read paths that bypass the projection result — requires discipline and testing.
- **What would change our mind**: If a scenario arises where "the same fact on the same entity needs two contradictory belief versions, both important", upgrade Belief to a context-bearing list.

---

## ADR-5 Character / Agent / Player / Host: Binding Model, not class inheritance

- **Problem**: How should Entity / Character / Agent / NPC / Player / Host be separated?
- **Options**: A) Six separate class hierarchies; B) Entity (with mind) + runtime control binding; C) Player is "an NPC controlled by a human".
- **Decision**: **B**. Character = entity with a mind; Agent = entity + `AgentBinding(controller: player|ai|script|none)`; Player/Host = perspective + agency + binding + cognitive boundary; a unified `Controller` interface (perceive → decide → candidate event).
- **Rationale**: A creates a jungle of special cases; C is the wrong metaphor (the player is a perspective, not an NPC); B makes "one player controls multiple characters", "an NPC temporarily taken over by a player", "a host who is also a character" require zero special-case code.
- **Cost**: Binding state must persist with the instance; switching bindings (takeover/release) is a runtime operation that must be clearly defined in P4.
- **What would change our mind**: If a scenario arises where "the controller itself needs an in-world identity" (e.g., an AI character must be treated as a character by other AIs), extend the Controller rather than breaking the binding model.

---

## ADR-6 Host: Character + Permission + Lens, through the same kernel (no second engine)

- **Problem**: Is the Host a character, a permission, a mode, or a perspective? Does it need a separate engine?
- **Options**: A) Independent host engine; B) Text-prefix disguise (current state); C) Character + permission + omniscient lens, with intervention as a provenance-bearing event.
- **Decision**: **C**. Intervention = `directorial_intervention` / `define_modification` event (provenance `player_directive`), through the same kernel with permission validation; omniscience = a projection parameter (observer empty), does not change state.
- **Rationale**: A creates two sources of truth; B is a known defect; C preserves the "single writer" invariant, and all host capabilities are fully loggable and rollbackable.
- **Cost**: Requires a permission model (who can intervene in what scope); "changing rules" needs a defined versioned diff.
- **What would change our mind**: If the host's operational throughput (batch-editing dozens of entities) makes the event approach unacceptable, add a "batch event" primitive, but it must still be an event.

---

## ADR-7 Experience Layer: An independent salience abstraction (not an alias for the UI plan)

- **Problem**: Is a "meaning/salience" layer needed before presentation?
- **Options**: A) Render state directly; B) UI plan generated by a rules tree (current state); C) Salience → experience state → presentation plan, a three-stage derivation.
- **Decision**: **C**. `Significance` (what changed / what is urgent / what is dramatic) → `ExperienceState` → `PresentationPlan` → layout engine.
- **Rationale**: A would dump the whole world on the user; B has no attention model; C makes "how the world changes" orthogonal to "what the user should see", and is explainable (FocusScore four factors).
- **Cost**: One extra layer of computation; salience calibration (weights) needs tuning over the four baseline worlds.
- **What would change our mind**: If salience output frequently conflicts with user intuition and cannot be fixed via weights, switch to a hybrid driven by "explicit user focus + event stream".

---

## ADR-8 Layout: Dynamic information space + 5 primitives + explicit focus (not a set of screens)

- **Problem**: Is HeadConan a set of screens or a dynamic information space? What is the minimal layout syntax?
- **Options**: A) Screen routing; B) Fixed grid (current state); C) Dynamic information space: 5 primitives + focus object.
- **Decision**: **C**. Anchor/Stage/Satellite/Ambient/Dock + explicit `Focus` (type/targetId/activity/sticky/origin); Stage mode and Satellite content are driven by focus, with FLIP transitions.
- **Rationale**: The full reasoning of the LAYOUT_RESEARCH 14 questions (see that document); the missing focus is why the existing 5-primitive design cannot be realized.
- **Cost**: High cost of implementing the layout engine; automatic mode switching may cause user dizziness (mitigated with sticky lock).
- **What would change our mind**: If the six-scenario matrix proves 5 primitives insufficient (a scenario requiring a sixth primitive appears), extend the primitive set rather than reverting to screens.

---

## ADR-9 World Definition: Compositional structure, no new culture/institution/geography classes

- **Problem**: Does WorldDefinition need a separate class for culture, institution, geography, character, organization, etc.?
- **Options**: A) One class per category; B) Minimal composition (axioms + ontology + baseline + dynamics + possibility space + experience signals).
- **Decision**: **B**. Institution = OrganizationEntity + norms; culture = emergence of axioms + norms + experience signals; geography = LocationEntity + relationships.
- **Rationale**: Category growth ends in class explosion; the compositional approach is already validated as sufficient by the four baseline worlds.
- **Cost**: Some "cultural intuitions" (e.g., clothing, diet) need to be explicitly expressed as objects/attributes/axioms, slightly increasing author burden.
- **What would change our mind**: If multiple worlds show "the same cultural structure needing to be re-declared repeatedly", extract it into a reusable definition snippet rather than a new class.

---

## ADR-10 Belief Attribution: Migrate from definition to state

- **Problem**: Should `CharacterEntity.beliefs` stay in the definition or move into the state?
- **Options**: A) Static definition array (current state); B) Runtime state, with the definition keeping only the initial seed.
- **Decision**: **B**. Beliefs evolve with observations/events; `knownFactIds`/`beliefs` in the definition serve only as instantiation seeds; at runtime `epistemics` is authoritative (eliminating the dual source).
- **Rationale**: Static beliefs conflict with the simulation (Loid's beliefs must be able to drift with evidence).
- **Cost**: Requires a migration and a data-migration rule (upgrading old world data).
- **What would change our mind**: None — this is a correction, not a probe; if it turns out "beliefs never change", it could degrade, but that is not expected.

---

## ADR-11 Persistence: Event log + snapshot + player-data layering (not a single object, nor jumping to cloud)

- **Problem**: What needs to be persisted, and in what form?
- **Options**: A) Single-object JSON (current state); B) Event log + periodic snapshots + player-data layering; C) Immediate cloud database.
- **Decision**: **B**. The log is the truth (replayable/branchable/rollbackable), snapshots are for performance, and player data (notes/bindings/preferences) is independent of world state; cloud sync is deferred (after P8b).
- **Rationale**: A cannot express history/branching/rollback; C is premature before the session model is validated (and single-machine validation is cheaper).
- **Cost**: Log growth needs a compaction strategy (snapshot merging); the storage layer abstraction must be stable (swappable for cloud later).
- **What would change our mind**: If real user sessions run very long and snapshot compaction frequently fails, introduce segmented logs (epoch) — but the layering principle remains.

---

## ADR-12 LLM Responsibility Boundary: Decisions are LLM, bookkeeping is deterministic; the world carries no UI

- **Problem**: What role does the LLM play in the world runtime?
- **Options**: A) LLM writes complete state + UI plan directly (current state); B) LLM decides (agent intent / narrative phrasing / definition synthesis), bookkeeping and layout fully deterministic; C) Fully deterministic, no LLM.
- **Decision**: **B**. The LLM produces: intent-parse candidates, agent decisions, narrative phrasing, definition synthesis fragments; **must not**: write state directly, design layout, or hold truth.
- **Rationale**: A is a known source of schema drift and cost, and violates "the world is independent of the interface"; C lacks expressiveness.
- **Cost**: Requires a "candidate event" validator to convert LLM output into legal events (P3); requires guarding against "narrative leakage" (phrasing generated by the projection view).
- **What would change our mind**: If structured tool calls chronically fail at intent parsing (ambiguity that cannot converge), introduce an "LLM event proposal + human confirmation" mode, but the boundary remains.
