# HeadConan Kernel

> This document answers three questions: **What problem does HeadConan solve computationally? What are the minimal primitives? What is the kernel (the center of gravity)?**
> Conclusion up front: HeadConan's kernel is an **event-driven world transition kernel** (a reducer core), on top of which cognitive projection (derived) and presentation planning (derived) are layered. It is not a chatbot, not a state-machine UI, not a knowledge graph — it is a **simulation kernel**.

---

## 1. The Core Problem (Computational Formulation)

### 1.1 First-order Problem

> **Given a world definition D and an initial scenario S, continuously compute: when an entity E (player-controlled or autonomous) issues an action A, what is the world's next state, who perceived what, and what the user should see — such that the world state exists independently of any interface.**

### 1.2 The Loop (Initial Assumption and Its Revisions)

The direction of the loop in the prompt is basically correct, but three points must be revised:

```
(pre-revision) USER INTENT → interpret → ACTION → transition → new state → consequence → present → perceive → new intent
```

Revision 1: **An action must become an event to enter the world.** "User intent" is not the world's input; "the parsed and validated candidate event" is. A failed action is also an event ("tried to steal, got caught").

Revision 2: **Consequences are queued events, not immediate side effects.** "The minister responds tomorrow" must be deferredly triggered by the scheduler; otherwise all causality is instantaneous.

Revision 3: **A "salience" layer must exist before presentation.** The world had 100 things happen; the user can only see 5. Choosing which 5 is the responsibility of the experience layer, not the world kernel.

The fully revised loop is in [`RUNTIME_LOOP.md`](./RUNTIME_LOOP.md).

### 1.3 The Nature of the Problem Domain

HeadConan's problem domain is **"letting a structured world evolve in a self-consistent way under uncertainty, information asymmetry, and time pressure"**. It simultaneously has three computational properties:

| Property | Meaning | Consequence |
| :--- | :--- | :--- |
| **Determinism** | Given state + event + rules, the transition result is unique | Replayable, rollbackable, branchable |
| **Non-determinism** | Agent decisions are produced by LLM/strategy | Decision layer and bookkeeping layer must be separated |
| **Projection** | The same truth looks different in different observers' eyes | Cognition must be derived, not mixed with truth |

---

## 2. Minimal Primitives

**Do not** start from `World / Character / Quest / Inventory`. Below is the derivation and conclusion.

### 2.1 Derivation: What is indivisible?

| Candidate | Primitive? | Reason |
| :--- | :--- | :--- |
| **Entity** | ✅ | The base of everything persistable: identity + mutable attributes. No entity, no world. |
| **Fact** | ✅ | The smallest unit of truth: "Yor is an assassin". Facts attach to entities (subject/related), with a visibility domain and provenance. |
| **Relationship** | ✅ | A directed, state-bearing edge between entities (affinity/trust/power). Not a string attribute of an entity — it is an independent object, because its state changes at a different frequency than the entity. |
| **Event** | ✅ | The single writer. All state changes are the effect of some event. The event is the smallest unit of the chronicle. |
| **Rule** | ✅ | The generation mechanism: precondition validation + effect application + consequence derivation. Without rules, events are just noise. |
| **Time** | ✅ | The ordering principle: event sequence + clock. Branching/causality/countdown all depend on it. |
| State | ❌ Derived | An aggregate snapshot of entity attribute values + relationship values at time T. Do not store a "state class" separately. |
| Knowledge | ❌ Derived | Each observer's projection of a subset of facts + subjective beliefs. Written back via the observation side effect of events, but the **truth** is always derived from facts. |
| Action | ❌ Composite | Intent + precondition validation, resolved into a candidate event (or a failure event). |
| Goal | ❌ Composite | A predicate attached to an agent (completion condition on state). A dynamic attribute, not a separate class. |
| Agent | ❌ Composite | Entity + decision process (binding). |

### 2.2 Conclusion: Six Primitives

> **ENTITY · FACT · RELATIONSHIP · EVENT · RULE · TIME**

Everything else (state, knowledge, goal, action, scenario, world, branch) is a **composition or derivation** of these six. Verification: see the four-world stress test below — if the six primitives can express all four worlds without adding a new primitive, the assumption holds.

### 2.3 Property Table for Each Primitive

| Primitive | Represents | Why fundamental | What depends on it | Persisted? | Derived? | Belongs to |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Entity | Identity and attributes of persistable things | The base of the world | Fact/Relationship/State/Agent | ✅ | No | Definition (prototype) + State (dynamic attributes) |
| Fact | Smallest unit of truth | The boundary of truth and cognition | Knowledge/Secret/Inference | ✅ | Partly (derived provenance type) | Definition (canon fact) + State (instance fact) |
| Relationship | Directed, state-bearing edge between entities | The structural carrier of social/power/emotion | Power simulation / relationship graph / dialogue subtext | ✅ | No (evolves independently) | Definition (baseline) + State (dynamic values) |
| Event | The single writer | The record and replayability of all change | Chronicle / branch / rollback / knowledge side effect | ✅ | No | Runtime (event log) |
| Rule | Precondition + effect + consequence generation mechanism | Makes events causal | Transition kernel | ✅ (within definition) | No | Definition |
| Time | Event sequence and clock | Ordering / deadline / branch | Scheduler / chronicle / timeline | ✅ | No | Runtime (clock + log order) |

### 2.4 Three Design Disciplines Regarding Primitives

1. **State stores nothing derivable.** Salience, attention, reputation aggregation, relationship summaries, UI shape — all derived at runtime.
2. **Knowledge stores no truth.** An entity stores only "which fact IDs are known + beliefs (with confidence and truth markers)"; truth always lives in the fact layer. Verifying a belief's truth is a derived operation.
3. **Events store no conclusions.** An event records "what happened"; state change and observation are its projections — though it may be materialized for performance, it must not serve as a second source of truth.

---

## 3. Four-World Stress Test (Can the same set of primitives express all four worlds?)

For each world, do **representative interaction modeling**, checking whether the six primitives are sufficient and where they are strained.

### 3.1 SPY × FAMILY — Information Asymmetry

> Loid and Yor interact, neither knowing the other's secret.

- **Modeling**: `Fact(loid_is_twilight)` (visibility domain singular_secret, holder Loid); `Fact(yor_is_assassin)` (holder Yor); `SecretItem` (target = the other); Loid's `Belief(yor_normal_clerk, confidence 0.9, accurate=false)` toward Yor; the family `Relationship(kinship, visibility=fictitious_cover, coverStory="normal couple")`.
- **Event**: `speech_act(loid→yor, "Today we must work hard too…")` + observation side effect (Loid observes Yor's words and actions → updates belief confidence).
- **Strain points**: ① **Utterance must be a first-class event type** — subtext, lies, and mind-reading all need "what was said" recorded as structured content rather than narrative prose; ② the **confidence evolution** of beliefs needs rule support (observation → confidence drift). **No new primitive needed**: utterance = an event type (speech_act), belief = an entity attribute.

### 3.2 GAME OF THRONES — Political Alliances and Cascading Consequences

> A lord forges a political alliance, changing faction relationships.

- **Modeling**: `Relationship(fealty/alliance, powerBalance)`; `Organization(house)` + `PowerRelation` (economic debt / military / political domains); `Fact(cersei_children_bastards)` (singular_secret).
- **Event**: `alliance_formed(houseA, houseB)` → rules derive effects (multiple relationship state changes + faction reputation) → **queue** `scheduled_event(king's reaction, +2 days)`, `scheduled_event(hostile family's revenge, +5 days)`.
- **Strain points**: ① **Deferred scheduling** (the minister responds tomorrow) — needs a clocked pending-event queue; ② how faction/organization aggregate state (reputation, cohesion) is derived from members and events — needs "org-level rules" (org-level effects). **No new primitive needed**: scheduling = a queued event produced by rules; organization = an entity.

### 3.3 SHERLOCK HOLMES — The Player Discovers Evidence the Detective Does Not Know

> The player discovers a piece of evidence the detective does not yet know.

- **Modeling**: `ObjectEntity(bloody glove, type=evidence_clue)` + `Fact(glove belongs to suspect)` (visibility domain singular_secret) + `Fact↔Object` association; knowledge gating: player/detective each have different `knownFactIds`.
- **Event**: `discover_evidence(player, glove)` → observation side effect: player's `knownFacts` + glove; detective's `knownFacts` does not → the projector outputs different views for the two → dramatic irony (`compareEpistemicAsymmetry`).
- **Strain points**: **The association between evidence and fact** (`ObjectEntity.associatedFactIds` already exists) and "discovery" as a cognitive write entry (`reveal_fact` effect already exists). **No strain**.

### 3.4 MODERN UNIVERSITY — Daily Life, Missed Classes, Reputation, and Chance Encounters

> The player misses class → reputation changes → receives a message → later meets someone.

- **Modeling**: `Time` as a calendar clock; `scheduled_event(class starts, Mon 09:00)`; `Relationship(mentorship professor)`; `Fact(player absence)` (domain_public); `Resource(research funding)`.
- **Event**: `miss_class(player)` → rules: reputation -5, professor relationship trust -10, **queue** `scheduled_event(professor email, +2h)`, `scheduled_event(library encounter with classmate, +1d)`.
- **Strain points**: **Routine simulation** — the campus world needs the ability for "the world to advance by schedule even when the player does nothing", i.e., an autonomous world tick (see RUNTIME_LOOP). **No new primitive needed**: schedule = a queued event on the scheduler.

### 3.5 Test Conclusion

| Conclusion | Content |
| :--- | :--- |
| ✅ **The six primitives can express all four worlds** | No case requiring a seventh primitive was found |
| ⚠️ **Three kinds of "event/rule specialization" are needed** | ① `speech_act` first-class utterance event; ② a clocked **scheduler** (deferred/periodic events); ③ org-level and relationship-level **composite effects** (one event changes multiple objects) |
| ⚠️ **A runtime mechanism is needed** | **Autonomous world tick** (agents can act even when the user does not) — this is a loop problem, not a primitive problem |
| ❌ Explicitly denied | No separate classes for Quest/Inventory/Scene are needed; they are respectively goal attributes / entity attributes / context-bearing event collections |

---

## 4. Strict Separation of Definition and State (DEFINITION ≠ STATE)

| Layer | Example | Nature | Belongs to |
| :--- | :--- | :--- | :--- |
| **World definition** | "Yor is an assassin." (baseline fact + visibility domain) | Immutable, versioned | Definition (author-owned) |
| **World state** | "Yor is currently at the Forger home." | Mutable, snapshot at time T | Runtime |
| **World dynamics** | "Yor takes assignments through secret channels." (rule) | Not stored, applied | Definition |
| **World observation** | "The player sees Yor leave." (projection + observation side effect) | Derived, per observer | Runtime (derived) |

Disciplines:
1. **The definition does not change with the simulation** (only with version upgrades). State only references IDs in the definition, never copies definition content.
2. **Rules exist only in the definition**; state carries no information about "how it should change".
3. **Observation is always derived**: at the same moment, the player view, Loid view, and god view see different worlds, but there is only one state.
4. **Provenance is pervasive**: `ProvenanceMeta` marks each fact/entity as authored / derived / observed / inferred / simulated / temporary — this is the sole criterion for "canon vs hallucination vs intervention".

---

## 5. World Instance / Scenario / Timeline / Branch

Avoid over-engineering. The relationship among the four concepts:

```
WorldDefinition (the law, one)
      │ instantiate (choose scenario seed + apply initial-state mutation)
      ▼
WorldInstance (one run = state + event log + clock)
      │ event log keeps growing
      ▼
Timeline (sequential view of the event log — derived, not stored)
      │ at some turn, copy the instance → apply divergence
      ▼
Branch (one instance + parent pointer + divergence reason)
```

| Concept | What it is | Key points |
| :--- | :--- | :--- |
| WorldDefinition | The world's laws and canon | Immutable, versioned |
| ScenarioSeed | Starting configuration: initial situation + initial-state mutation + recommended characters | "Voldemort wins" and "user becomes the magic minister" are different seeds |
| WorldInstance | One concrete run | **State is a snapshot, the log is the truth**; the snapshot can be rebuilt from the log |
| Timeline | Sequential projection of the log | Not stored |
| TimelineBranch | A branch = a derived instance at a point in the log | Parent pointer + divergence reason is enough; no branch database needed |

> Anti-pattern warning: Do not design Branch as a complex multi-timeline graph database. A branch is simply "copy the instance + keep appending to the log from the divergence point".

---

## 6. The Kernel: Center of Gravity (THE CENTER OF GRAVITY)

### 6.1 Candidate Center-of-Gravity Analysis

| Candidate | Assessment |
| :--- | :--- |
| World Graph | ❌ It is the **state base** (the shape of entities + relationships), but the graph itself produces no change; a graph with no transition is dead |
| State Machine | ❌ The world is not a finite set of states; the state space is not enumerable |
| Event Engine | ⚠️ Close, but events are passive; there must be producers (agents/players/rules) |
| Agent Society | ❌ The agent is one of the **decision sources**, not the kernel; the kernel must be independent of "who is deciding" |
| Knowledge Graph | ❌ Knowledge is a **projection**; making the knowledge graph the kernel conflates truth with cognition |
| Simulation Runtime | ✅ **The right direction**, but needs precise definition |

### 6.2 Decision: Kernel = World Transition Kernel

> **The kernel is a pure function: `State × Event → { State′, spawnedEvents, observations, rejected? }`**
> Driven by `Rule`, it is the **single writer**. Every change — the player's, the NPC's, the host's, the rule's — must enter it as an event.

Rationale (why it is chosen as the center of gravity):

1. **It is the convergence point of all correctness.** Determinism, precondition validation, cascade, observation side effects, provenance — all questions of "is the world self-consistent" are adjudicated here. Errors elsewhere can be fixed; an error here makes the world fake.
2. **It makes the world independent of the interface hold.** The presentation layer, agent layer, host layer, and persistence layer all take its input/output as their contract; swapping UI, agent, or storage does not touch the kernel.
3. **It makes "falsifiability" possible.** The kernel can be regression-tested with the four baseline worlds; "can one action cascade" and "does cognition leak" can both be written as unit tests.
4. **It unifies Player/Host/Agent.** The three differ only in how events are produced (player parses intent, agent decides, host directly constructs intervention events) and in permissions (who is allowed to submit what event); the path after submission is exactly the same — "do not build a second engine for the Host" follows naturally.

### 6.3 The Kernel's Three Derived Layers

Everything above the kernel is a derived pure function:

```
┌─ Write (single path)────────────────────────────────┐
│  player event │ agent event │ host intervention event │ scheduler event  │
└───────────────────────┬─────────────────────────────┘
                        ▼
        【World Transition Kernel】 State × Event → {State′, Events, Observations}
                        │
        ┌───────────────┼────────────────┬──────────────────┐
        ▼               ▼                ▼                  ▼
   state snapshot    event log      observation→knowledge update   queued event (scheduler)
        └───────────────┼────────────────┴──────────────────┘
                        ▼
      (derived, read-only) cognitive projector → observer view (incl. player/host)
                        ▼
      (derived, read-only) salience/attention → experience state
                        ▼
      (derived, read-only) presentation planning → layout engine → UI
```

---

## 7. What HeadConan Actually Is

HeadConan is a **simulation kernel for fictional worlds + an experience layer**. As a computational system:

- It maintains a **typed world state** (entity attributes, relationship state, clock, cognitive records, resource pools), and the state evolves only through the **event log**.
- Events are produced by three kinds of producers: **player** (intent parsed and validated), **agent** (perceive → decide → act), and **the rules themselves** (consequences/scheduling).
- All events are applied through the **same transition kernel**: validate preconditions → apply effects → derive observations (who perceived what) → queue consequences.
- **Truth, cognition, and perception are separated**: state stores truth (facts + visibility domain); agents store "known fact IDs + beliefs"; what the player sees is always the output of the cognitive projector, not truth itself.
- **Presentation is derived**: salience computation selects "what matters right now" → experience state → presentation plan (stage mode / focus / satellite / ambient / dock) → layout engine renders. The world carries no UI.
- **The host is not a second engine**: intervention is an ordinary event with provenance (`player_directive`) and permission validation.
- **Persistence is layered**: definition (author-owned, versioned) + event log and snapshot (runtime-owned) + player data (user-owned).
- **Deterministic bookkeeping + non-deterministic decision**: the kernel and rules are deterministic (replayable, testable, branchable); agent decisions are the only source of non-determinism (LLM/strategy).

Its computational essence: **a discrete simulation runtime with events at its core, rules as the generation mechanism, and cognition and presentation as derived layers.**

---

## 8. What We Still Don't Know (Top 10 Uncertainties)

1. **Semantics of turns and time**: How much world time does one user action advance? Should the clock-advancing rule be part of the world definition?
2. **Degree of autonomy**: When should NPCs act autonomously (reactive / proactive)? "Daily campus life" needs background routine simulation — how to balance frequency and cost?
3. **Granularity of utterance (speech_act)**: To what structure should dialogue be recorded (quoted text / intent / subtext / lie marker) to support mind-reading and inference without over-design?
4. **Belief evolution rules**: How do observations change confidence? Are explicit belief-update rules needed, or are they naturally carried along when the LLM decides?
5. **Boundary between LLM and determinism**: Which judgments must be deterministic (preconditions, permissions, bookkeeping), and which can be handed to the LLM (agent decisions, narrative phrasing, intent parsing)? Where is the boundary?
6. **Scale inflection point of memory**: At what world size / session length do structured facts fail, forcing the introduction of semantic memory / summarization? How to ensure summarization does not pollute truth (provenance)?
7. **User experience of branching**: How to present parallel timelines in the UI without causing confusion (active-branch switching, divergence markers, rollback experience)?
8. **Explainability of salience computation**: How to calibrate the weights of the attention-scoring formula (`FocusScore`)? Can "what is worth seeing" hold consistently across the four baseline worlds?
9. **Copyright and release constraints**: The 50 gold-standard worlds in the atlas include copyrighted IP (SPY×FAMILY, GoT) — should the official product focus on "original worlds + public domain", or does it need a licensing process?
10. **Latency budget**: What is the end-to-end latency target for parallel multi-agent decision + presentation planning? Can streaming output mitigate the fragmentation of "waiting for the world to react"?

> The above questions require experiments rather than guesswork; see [`ARCHITECTURAL_EXPERIMENTS.md`](./ARCHITECTURAL_EXPERIMENTS.md) and [`OPEN_QUESTIONS.md`](./OPEN_QUESTIONS.md).
