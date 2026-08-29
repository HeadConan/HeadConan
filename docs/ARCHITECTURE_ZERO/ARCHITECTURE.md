# HeadConan — Architecture Zero (Implementation-Ready Architecture)

> Supersedes the prototype-era architecture docs. Existing docs are *evidence*, not truth (see `ARCHITECTURE_MIGRATION.md`).
> Companion files: `RESEARCH_LOG.md`, `docs/adr/ADR-001..010`.

---

## 1. Executive Summary

**Positioning:** HeadConan is an **imagination runtime for interactive worlds** — a system for turning imagination into explorable, stateful, interactive worlds (canonical product definition: `docs/VISION.md`). Its core formula is **World × Agency × Perspective**; its North Star is *make imagination executable*. Every concept in this document must answer: *which part of the loop Imagine → Enter → Act → Change → Perceive does it serve?*

HeadConan is a **causal, discrete-event world simulation** with an **epistemic layer** (who knows what) and a **projection-driven experience layer** (what you see). It is not a chatbot, not a dashboard, not a story engine, and not a game engine: it is a runtime that makes *actions have consequences, people have different perspectives, and the system remember what happened*.

```
CAUSAL CORE     typed state + append-only event log + rules        (what is true / happened)
EPISTEMIC       per-observer knowledge & beliefs, observation-only writes   (who knows)
EXPERIENCE      derived projection: situation → perspective → significance → UI  (what you see)
```

The single most important architectural fact: **the LLM is a producer of proposals and prose; the kernel is the only writer.** Determinism comes from recording LLM outputs as log inputs, not from eliminating them (rr).

---

## 2. System Definition

Precise definitions (honesty rule):

- **World** — a versioned `WorldDefinition` (ontology, entities, relations, facts, rules/practices, initial situation, experience signals) + a set of running `WorldInstance`s.
- **WorldInstance** — one execution: authoritative state + event log + knowledge store + clock + scheduler + active perspective bindings.
- **Situation** — the live configuration the user is in: focal entity/relation, co-present observers, available affordances. **Derived** from state+perspective.
- **Scene** — the UI-facing projection of a situation (which surfaces, which data, which actions). **Derived.**
- **Perspective** — a projection parameter: `{ observerId?, access: visibleFacts, controller }`. Player/Host are perspectives + permission scopes over one instance (ADR-007).
- **Knowledge** — per observer: `knownFactIds ⊆ Facts` + tagged beliefs. Not truth; observation-updated only (ADR-005).
- **Agent** — an entity + a policy binding (controller = human | reactive | llm | script). A character is an agent-shaped entity with knowledge.
- **Story** — a derived interpretation over the event log. Never stored.

---

## 3. Design Principles

1. **Single writer.** All state change enters through `applyEvent`. No exceptions, no Host bypass.
2. **Projection-only reads.** UI, LLM context, and tools receive projections, never raw truth.
3. **Recorded-input determinism.** Non-deterministic inputs (LLM, user, RNG) are recorded in the log; replay is deterministic.
4. **Derived never authoritative.** Story, significance, prose, UI plans are recomputed, not trusted stores.
5. **Small, typed, queryable.** 10³–10⁴ entities: typed objects + relations + facts; no ECS, no KG, no ontology engine.
6. **Mental-model respect.** Stable frame, progressive disclosure, gated change rate (SA: Endsley 1995; WM: Cowan 2001).
7. **The simplest architecture that makes the world feel real** — actions have consequences, people have perspectives, the system remembers.

---

## 4. Invariants

1. **A player cannot know information their perspective does not permit** — enforced by projection-only reads.
2. **World-changing actions are causally represented** — every mutation traces to an event with provenance.
3. **Rendering cannot alter truth** — UI is a pure projection; reading never writes.
4. **Host and Player observe the same underlying reality** through different projections.
5. **Knowledge changes only via observation side-effects of events.**
6. **The log is immutable** — corrections are new events (`retraction`), never edits.
7. **Determinism of the recorded history** — replay of the log yields identical state.
8. **LLM outputs never enter authoritative state except as recorded, validated events.**

---

## 5. Core Primitives

Reduced to a minimum set (see ADR-002/004/005 for derivations):

| Primitive | Definition | Authoritative | Derived |
|-----------|-----------|:---:|:---:|
| **Entity** | typed identity + attributes (`entity:world:id`, kind) | ✓ | |
| **Relation** | typed, directed, stateful edge between entities | ✓ | |
| **Fact** | atomic truth statement + visibility label + provenance | ✓ | |
| **Event** | immutable causal record; the only mutator | ✓ (log) | |
| **Time** | two axes: valid time (world clock) + transaction time (log offset) | ✓ | |
| **Observer** | projection parameter: identity + access + controller | ✓ (binding) | |
| **Policy** | decision function bound to an entity (human/reactive/LLM/script) | ✓ (binding) | |
| **Belief** | tagged per-observer proposition (source, confidence, may be false) | ✓ | accuracy ✓ |
| **Situation / Scene / Story / UI / Significance** | derived projections | | ✓ |

Everything else (character, relationship, scene, story, UI, knowledge as "access") is a composition or projection of these (ADR-001/002).

---

## 6. World Model

`WorldDefinition` (versioned, immutable per version):

```
axioms           — invariants of the world (physics/social law) — advisory for rules
ontology         — entity kinds, property definitions, capability definitions (no reasoner)
baseline         — entities, relations, ground-truth facts (with visibility), initial knowledge seeds
practices        — social practice definitions (affordance vocabularies; ADR-006)
rules            — storylet-shaped: (precondition, effects, consequences) over state
scenarios        — initial situations (state mutations + recommended perspective)
experience       — experience signals (dominant tone, information density, affordance preference)
```

- Facts have `visibilityLabel` (public→secret) + provenance; the epistemic layer enforces access at projection.
- World vs instance: definition is the law; instance is the run (ADR-001/002).

---

## 7. State Model

`WorldStateInstance` (authoritative):

```
clock          — turnNumber + inUniverseTime (+ elapsed seconds)
entityStates   — entityId → { location, activity, emotion, reputation, physicalStatus, dynamicAttrs, inventory }
relationStates — relationId → { affinity, trust, powerBalance, summary, brokenPromises }
facts          — truth layer (id, statement, visibility, provenance, valid_from)
knowledge      — observerId → { knownFactIds[], beliefs[] } (bitemporal stamps)
resources      — id → amount
scheduler      — queued events (trigger time/offset)
```

Derived (never stored): situation, scene, significance, story, prose, UI plan, summaries.

State is the **working projection** of the log (ADR-003): recomputable from `snapshot + log-suffix`.

---

## 8. Event Model

```
applyEvent(world, state, event)
  → { nextState, spawnedEvents[], observations[], rejected?, reason? }
```

- Event carries `{ id (deterministic), type, turn, source (player|agent|host|rule|scheduler), payload, provenance, recordedInputs? }`.
- Types: `action`, `speech_act`, `intervention` (host), `definition_change` (host meta), `scheduled_trigger`, `world_tick`, `retraction`.
- Pipeline inside the kernel: validate preconditions → apply effects → derive observations → queue consequences (bounded drain) → append log.
- **Rejection is an event** (logged, observable).
- Consequences are queued events; drain budget caps cascade depth.
- Deterministic IDs: `evt:{turn}:{seq}:{type}`; kernel is pure (no I/O, no clock reads).

---

## 9. Temporal Model

Hybrid: **event-sourced history + snapshot state + bitemporal knowledge** (ADR-010):

| Question | Answer |
|----------|--------|
| What happened? | query eventLog |
| What is true? | state |
| What was true at t? | snapshot before t + fold suffix |
| Why is this true? | provenance chain (last-mutating event) |
| Who caused this? | event.source / provenance |
| What did the player know at t? | knowledgeStore.knownFactIds with valid_from ≤ t |
| What did Yor believe at t? | belief entries stamped (valid_from, learned_at) |

World time vs turn: the scheduler advances the world clock; user turns and world ticks are both event producers (dual-cadence, single kernel).

---

## 10. Knowledge Model

- Truth layer (facts) is authoritative; **no read-up** — a projection never widens access.
- `projectPerspective(world, state, observer)` is the only read path (ADR-005).
- Knowledge updates ONLY via observation side-effects inside `applyEvent`.
- Beliefs: tagged items `{ statement, sourceType, confidence, may-be-false }`; accuracy is a derived comparison, never stored.
- No common-knowledge machinery (Halpern & Moses: unattainable). "Everyone knows p" = on-demand intersection of knownFactIds.
- Dramatic irony = projection difference (host vs player), computed.

---

## 11. Character Model

`Character = Entity + State + Knowledge + Policy` (ADR-006), policy layered:

1. **Rule layer** (deterministic): hard preconditions/effects, permissions, canon.
2. **Practice/utility layer**: social practices propose affordances; character selects by utility.
3. **Goal layer (BDI-lite)**: belief changes may re-trigger goal pursuit (scripted or LLM-decomposed plans).
4. **LLM layer**: dialogue & improvisation — grounded in THIS character's projection; output is a proposed event, kernel-validated.

NPC autonomy for v1 = reactive (rules + utility) with LLM at dialogue decision points. No full autonomous loop.

---

## 12. Host Model

Host = perspective (omniscient projection) + permission set (privileged `intervention` + meta `definition_change` events) over the same instance (ADR-007). No second engine, no second truth. Host tools render the omniscient projection and submit privileged events through the same kernel.

---

## 13. Runtime Pipeline

One action traced (user: "I secretly follow Yor"):

```
USER INTENT
  → intent interpretation (LLM proposes; deterministic entity/verb resolution; low-confidence → clarify)
  → candidate event action(follow, target=yor, mode=covert)
  → VALIDATE (deterministic: location, capability, permission, secrecy rules)   [sync, deterministic]
  → applyEvent: effects (player location/activity; yor unaware)                 [sync, deterministic]
  → observations: witnesses/visibility → knowledge updates (only via side-effects) [sync, deterministic]
  → consequences queued (e.g., scheduled_trigger: yor's next contact)          [async, scheduler]
  → log append (+ record LLM inputs if any)                                    [sync]
  → derive: situation + significance + story fragment                         [derived]
  → projectPerspective(player) → scene → UI plan → render                     [derived]
  → world tick may interleave (other agents act; same kernel)                  [async]
```

**Sync/deterministic:** validate, transition, observe, log, replay.
**Async:** scheduler, world tick.
**Probabilistic/LLM:** intent interpretation, character dialogue, prose. All recorded.

---

## 14. LLM Boundary

| LLM MAY | LLM NEVER |
|---------|-----------|
| interpret intent (propose) | write authoritative state |
| propose character dialogue/improvisation | enforce rules/permissions |
| narrate the log into prose | update knowledge/beliefs directly |
| synthesize world definitions (authoring aid) | log events |
| | design UI layout |

All LLM outputs are **recorded inputs**; replay replays them, not re-generation (ADR-008).

---

## 15. Persistence

Snapshot + append-only log + bitemporal knowledge + definition versions (ADR-010). v1 adapter = localStorage; abstraction portable. Store layers are owned: definitions (author), instance (runtime), player data (user).

---

## 16. Replay

`restore(snapshot) + fold(logTail)` — deterministic because recorded. Branch = fork at offset. Debug = explain any state from the log ("you are here because events 12→19").

---

## 17. UI Contract

Runtime exposes (read-only, per perspective): `S` state query, `Δ` per-turn delta+causality, `K` knowledge/beliefs, `A` affordances (valid actions), `E` environment signals. UI's only write: `submitAction(candidate)`.

- **Scene-driven**: `scene = project(state, perspective, affordances)`; UI composes from a stable capability set; never generative-from-scratch.
- **Stable frame + dynamic content**; adaptation is additive, rationalized, pinnable (Gajos; ADR-009).
- SA contract: S (perception), Δ (comprehension), precomputed projection (projection).
- World-specific identity via theme tokens + scene type; never hardcoded world apps.

---

## 18. World Authoring

Minimum schema: typed entities + relations + facts (with visibility) + practices + rules (storylet-shaped) + scenarios + experience signals. No ontology engine. Host edits = `definition_change` meta-events (versioned). Authoring aid = LLM synthesis validated before commit (ADR-008/002).

---

## 19. Error Handling

- LLM output unparseable/invalid → reject with reason (rejection is an event); never crash.
- Precondition failure → rejection event with cause.
- Kernel invariant violations → assert + roll back to last snapshot (debug aid).
- Scheduler storm → drain budget; overflow logged as throttled events.
- Persistence corruption → rebuild state from last good snapshot + log (audit).

---

## 20. Security / Integrity Boundaries

- Epistemic integrity: projection-only reads; no read-up; knowledge writes only via observation.
- Integrity: single-writer kernel; immutable log; deterministic IDs; provenance on every event/fact.
- Host authority: privileged events still validated (permission envelope) and logged; definition edits versioned (rollback-able).
- Inputs: never trust the client; kernel validates all candidate events.
- No secrets in client: no API keys (site and runtime are separate).

---

## 21. Scaling Considerations

- 10³–10⁴ entities: typed in-memory state is fine; indexes for entity/relation lookups.
- Millions of historical events: snapshots bound replay; bitemporal index for knowledge queries.
- Many observers (N): projections computed on demand; cache per-perspective.
- Not a goal: 10⁶+ entities, distributed simulation, multiplayer.

---

## 22. Open Problems

1. Definition-change migration semantics when Host edits rules live (LOW confidence).
2. Bitemporal knowledge granularity and pruning (MEDIUM).
3. Scene-type set for v1; exact scene→surface mapping (MEDIUM).
4. Latency budget for LLM decision points; streaming narrative (LOW).
5. When to materialize higher-order beliefs ("A believes B believes p") (LOW).
6. Whether a derived "curator/drama-manager" layer is worth adding later (LOW; RimWorld precedent).

---

## 23. Non-Goals (v1)

- Full epistemic logic / common-knowledge reasoning.
- Learned world models as truth.
- ECS / custom game engine / physics.
- Quest/story engine; drama-manager puppetry.
- Autonomous NPC societies, economy sims, advanced relationship psychology.
- Multiplayer, cloud sync, semantic memory, vector DB.
- Generative UI (LLM-designed layout).
- A giant world database; more than one hand-written test world.

---

## 24. Implementation Roadmap

```
PHASE 0 — Vertical slice (SPY×FAMILY, ~2 weeks)
  world definition (typed) + instantiate + kernel (validate→event→transition→observe)
  + knowledge store + projection + affordances + minimal scene + UI contract + localStorage
  → "I act → the world changes → I see it from my perspective" PROVEN.

PHASE 1 — Reactive characters + practices
  character policy (rule + utility + LLM-at-dialogue); speech_act; scheduler.

PHASE 2 — Host + temporal queries + definition versioning.

PHASE 3 — Authoring aid + richer scene set + curator experiment (optional).
```

---

## Appendix A — Competing Architectures

| Dimension | A. Event-Sourced Runtime | B. Stateful Simulation Graph | C. Agent-Oriented (actors) | D. Causal Hybrid (chosen) |
|-----------|--------------------------|------------------------------|----------------------------|---------------------------|
| Conceptual model | state = fold(log) | in-place mutation + causal annotations | message passing between agents | state + log + knowledge + policy |
| Replay/audit | excellent | weak | weak | excellent |
| Temporal queries | natural | hard | hard | natural (snapshot+fold+bitemporal) |
| Epistemic integrity | good (per-observer rebuild) | poor (mutation leaks) | poor (agent-local) | good (projection-only) |
| Simplicity | medium | high | low | high |
| LLM compatibility | good (recorded inputs) | medium | medium | good |
| Cost at 10⁴ entities | high if rebuilt every read | low | medium | low |

## Appendix B — Decision Matrix (weights explained)

Weights favor the product goal ("world feels real: consequences, perspectives, memory") and developer ergonomics; not manipulated to force a result — the matrix was scored before the final choice.

| Dimension | weight | A | B | C | D |
|-----------|:---:|---|---|---|---|
| correctness | 0.10 | 3 | 3 | 2 | 4 |
| simplicity | 0.10 | 2 | 4 | 2 | 4 |
| extensibility | 0.10 | 4 | 3 | 3 | 4 |
| determinism/replay | 0.10 | 5 | 2 | 2 | 5 |
| epistemic integrity | 0.10 | 4 | 1 | 2 | 5 |
| character expressiveness | 0.10 | 3 | 3 | 4 | 4 |
| world authoring | 0.08 | 4 | 3 | 3 | 4 |
| UI adaptability | 0.08 | 4 | 3 | 2 | 4 |
| computational cost | 0.08 | 2 | 5 | 2 | 4 |
| LLM compatibility | 0.08 | 4 | 2 | 3 | 4 |
| developer ergonomics | 0.06 | 3 | 4 | 2 | 4 |
| scalability | 0.02 | 3 | 4 | 3 | 4 |
| **Weighted total** | 1.0 | **3.52** | **2.87** | **2.61** | **4.25** |

## Appendix C — Adversarial Stress Tests (20+)

| # | Scenario | Verdict |
|---|----------|---------|
| 1 | Player lies to Yor | speech_act with intent; belief delta for Yor (may-be-false). ✓ |
| 2 | Player secretly follows Yor | covert action; observation set = {}; Yor's projection unchanged. ✓ |
| 3 | Anya reads the player's thoughts | LLM proposes a belief; kernel writes belief with provenance "telepathy"; player never sees it. ✓ |
| 4 | Player burns an important document | object entity destroyed via event; log records; all knowers updated via observation. ✓ |
| 5 | Host teleports a character | `intervention` event (privileged); logged; observers updated. ✓ |
| 6 | Host changes a world rule | `definition_change` meta-event; versioned diff; migration policy (open). ⚠ |
| 7 | Two characters act simultaneously | serialized through kernel order (DES conservative); both logged. ✓ |
| 8 | NPC learns without player seeing | observation side-effect on NPC only. ✓ |
| 9 | Player discovers a secret accidentally | discovery event → reveal_fact to player only. ✓ |
| 10 | Character believes something false | belief item with source/confidence; truth unaffected. ✓ |
| 11 | A relationship changes | relation dynamic state via event. ✓ |
| 12 | Player returns to previous location | location is state; no special case. ✓ |
| 13 | Same event replayed | idempotent semantics for `applyEvent` (pure function). ✓ |
| 14 | World saved and loaded | snapshot+log restore. ✓ |
| 15 | LLM proposes impossible action | validator rejects with reason; rejection is an event. ✓ |
| 16 | Two LLM agents disagree | both proposals logged; kernel applies in order; no conflict resolution magic needed (causality is order). ✓ |
| 17 | UI accidentally exposes hidden info | impossible by construction: UI only receives projections. ✓ |
| 18 | World with 10,000 entities | typed state + indexes; projections computed on demand. ✓ |
| 19 | Millions of historical events | snapshots bound replay; bitemporal index for knowledge queries. ✓ |
| 20 | User switches Player→Host | perspective+permission swap; state untouched. ✓ |
| 21 | Player says "I know you're an assassin" without evidence | requires_knowledge precondition rejects (E1 lesson preserved). ✓ |
| 22 | Yor's cover story vs truth | belief(cover, accurate=false) for Loid; truth layer intact. ✓ |

## Appendix D — Impossible-Case Boundaries

Cases that strain (not necessarily break) the architecture, used to find boundaries:

- **Time travel** → represent as a *new instance/branch*, not a mutation of history. Boundary: no in-log retroactive edits.
- **Unreliable narrators** → supported via belief layer (narrator's belief ≠ truth). ✓ supported.
- **Contradictory beliefs** → supported: beliefs are tagged per observer; two observers may hold contradictions. ✓
- **Dreams / nested realities** → nested WorldInstance (world-in-world) with projection isolation; cost boundary.
- **Multiple timelines** → branches (instance forks). ✓
- **Worlds where stories alter reality** → Host meta-events / rules with narrative causality (deliberately exotic; LOW confidence).
- **User changes ontology live** → definition_change + migration (open problem #1).
- **Worlds with inconsistent physics** → axioms are advisory; rules may contradict → **documented boundary**: HeadConan trusts its rules, not its axioms; consistency must be authored.

**Honest boundary statement:** HeadConan is *not* a general model of any conceivable world; it is a runtime for *causal, observer-structured, rule-governed* worlds. Exotic structures are supported by nesting instances and by authored rules — not by generalizing the core.
