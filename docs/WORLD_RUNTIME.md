# HeadConan World Runtime (WORLD RUNTIME)

> This file is the implementation specification of the kernel ([`HEADCONAN_KERNEL.md`](./HEADCONAN_KERNEL.md)): it defines structure, instance semantics, the source of truth for state, the transition abstraction, the event model, information asymmetry, the agent/player/host model, and the ownership of memory and persistence.

---

## 1. WorldDefinition — Compositional Structure

**Principle**: not one class per category. A definition is composed of "a few minimal compositions." The existing types in `representation/` are already close to correct; this file makes three corrections (see 1.2).

### 1.1 Compositional Structure

```
WorldDefinition
├── Identity & version (id, name, tagline, premise, version)
├── Axioms (invariants: immutable laws)   —— physical/social contract/institutional norms
├── Ontology                              —— CapabilityDefinition + PropertyDefinition
├── Baseline (canonical base)             —— entities (char/org/loc/object/resource) + relationships + groundTruthFacts
├── Dynamics                              —— WorldActionDefinition[] (precondition/effects/consequences)
├── PossibilitySpace                      —— InhabitedRoleSlot[] (mode/agent level/cognitive fog/taboos)
└── ExperienceProfile (experience signals)—— fantasy archetype/tension gradient/density/recommended modalities
```

**Culture / institution / geography need no dedicated class**:
- Institution = `OrganizationEntity` (doctrine/cohesion/prestige) + norms attached to the organization (`SocialNorm`).
- Culture = an emergence of axioms + norms + experience signals (e.g. `dominantTone`), not modeled separately.
- Geography = `LocationEntity` (accessibility/spatialAffordances) + relationships between locations (e.g. `adjacency` can be expressed via Relationship or a custom attribute).

### 1.2 Corrections to Existing Types

| # | Correction | Reason |
| :--- | :--- | :--- |
| 1 | **Beliefs move from definition to state**: remove the static `CharacterEntity.beliefs` array, replace with runtime `BeliefRecord[]` (evolves with state) | Beliefs change over time; static beliefs conflict with simulation (dangerous assumption #4) |
| 2 | **Single source for `knownFactIds`**: runtime cognition records use `epistemics.entityKnownFacts` as authoritative; the `knownFactIds` retained in the definition serves only as **initial cognition** (seed) | Dual sources inevitably drift (dangerous assumption #5) |
| 3 | **Three action-definition specializations added**: `speech_act` category, delayed consequences (`spawnEvent.delayInTurns`/`afterInUniverseTime`), organization-level effects (`targetDomain: organization`) | Pressure points from the four-world stress test (see kernel 3.5) |
| 4 | **Remove `currentSituationNarrative` from state**: replace with the latest summary of the event log (derived) | String blob cannot be used to compute salience (dangerous assumption #9) |

### 1.3 Definition Invariants (must be enforced by the validator)

1. All references (character/organization/location/fact/action/relationship) must exist (already largely covered by `validateWorldDefinition`).
2. Every character must resolve to: character ↔ entity binding, cognitive fog level, available action categories (already present).
3. The definition must not contain any runtime value (turn count, current time, current state, UI plan).
4. `groundTruthFacts` must not contain two records of the same fact that contradict each other in a visible domain (new validation).

---

## 2. World Instance / Scenario / Timeline / Branch

| Concept | Definition | Storage Form |
| :--- | :--- | :--- |
| **WorldInstance** | A concrete run: `definitionId + scenarioId + current state + event log + clock + agent bindings` | State snapshot (periodic) + append-only log |
| **ScenarioSeed** | Starting configuration: initial situation + initial state mutations (`StateEffect[]`) + recommended characters | Definition-side data (seed library) |
| **Timeline** | A chronological projection of the event log | Not stored (derived view) |
| **TimelineBranch** | A new instance forked at some point in the log (`parentTimelineId + forkedAtTurn + divergenceReason`) | A branch is "copy the instance + continue from the divergence point" |

**Instantiation flow** (deterministic):
1. `instantiate(definition, scenario)` → deep-copy the definition baseline → apply `initialStateMutations` → initialize cognition records (a character's initial `knownFactIds` comes from the definition) → zero the clock → empty log.
2. At any time `restore(instanceId, snapshotOrLog)` can rebuild it.

> The operational cost of a branch = one instance copy + afterwards only writing the new log. Do not build a separate database for branches (over-engineering).

---

## 3. World State — Separation of Source of Truth from Derived

### 3.1 Source of Truth (MUST be persisted)

| Data | Description |
| :--- | :--- |
| Entity state | `entityStates[id] = { currentLocationId, currentActivity, emotionalState, reputationScore, physicalStatus, dynamicAttributes, inventory }` |
| Relationship state | `relationshipStates[id] = { affinity, trust, powerBalance, recentInteractions, brokenPromises }` |
| Clock | `turnNumber + inUniverseTime + elapsedSimulatedSeconds` |
| Cognition records | `epistemics = { entityKnownFacts, beliefs, activeSecrets, activeRumors, publicExposedFactIds }` |
| Resource pools | `resourcePools[id] = number` |
| Event log | All `SimulationEvent` (append-only writes) |
| Scheduling queue | Queued events pending execution (including trigger time) |
| Agent bindings | `agentBindings[entityId] = { controller: player|ai|script|none, policy?, playerId? }` |

### 3.2 Derived (NEVER stored as truth)

| Derived | Source |
| :--- | :--- |
| Observer view | `projectEpistemicPerspective(state, observer)` |
| Belief truth/false marker | Belief vs. fact comparison (computed at comparison time) |
| Salience/attention | Experience Service |
| Presentation plan | Experience Service |
| Reputation aggregation / relationship summary | Derived from state values |
| Narrative prose | Event → LLM wording (cached by presentation layer, not truth) |
| Timeline / branch graph | Event log projection |

**Discipline**: any field that can be rebuilt from log + rules must not enter the state snapshot (snapshots serve only as a performance cache).

---

## 4. World Transitions (TRANSITIONS)

### 4.1 Abstraction

```
ACTOR_INTENT + STATE + RULES
        │  resolution & validation
        ▼
  CANDIDATE EVENT
        │  kernel application
        ▼
  NEW STATE + SPAWNED EVENTS + OBSERVATIONS + (REJECTED?)
```

**Core signature**:

```
applyEvent(state, definition, event)
  → { nextState, spawnedEvents[], observations[], rejected? , reason? }
```

### 4.2 Transition Pipeline (inside the kernel)

1. **Precondition validation** (deterministic): co-presence, capability, knowledge, resources, permissions, trust threshold, host permission (intervention events require `player_directive` provenance + character permission).
2. **Effect application** (deterministic): atomic mutations (set/increment/decrement/reveal_fact/create_entity/modify_status), supports `$actor`/`$target` placeholder resolution.
3. **Observation derivation**: an event carries "who was present / who could see" → generate an observation record for each observer → update their `knownFacts`/`beliefs`/`rumors`. **This is the write channel for information asymmetry.**
4. **Consequence queueing**: `EmergentConsequence` whose trigger conditions are met → immediate effects + delayed/periodic events enter the scheduling queue.
5. **Log append**: the event + observations + rejection records all enter the log (rejections are also log entries, supporting "attempted" narrative).

### 4.3 "Publicly Accuse the Minister" Walkthrough

| Step | Content |
| :--- | :--- |
| Intent | Player: "I publicly accuse the minister." |
| Resolution | `intent(accuse, target=minister, claim=fact_ref)` → candidate event `public_accusation` |
| Precondition | ① Player is present (council hall); ② has the ability to speak; ③ the accusation target is present; ④ host/character permission permits |
| Effect | Minister reputation −15; player↔minister relationship (hostility); council faction stance shifts |
| Observation | 12 council members present → each gets `knownFacts += accusation content (as rumor/belief)`; media event queued |
| Consequence | `scheduled_event(minister response, +1 turn)`; `scheduled_event(faction A statement, +2 turns)` |
| Salience | This is a high-drama event → experience layer promotes it to focus |

---

## 5. Event Model (EVENT MODEL)

### 5.1 Five concepts are not merged, but there is only one layer of storage

| Concept | Definition | Storage |
| :--- | :--- | :--- |
| **Action** | Intent: `{ actor, verb, target, payload, context }` | Not stored (input) |
| **Event** | A fact that occurred: `{ id, type, turn, time, actor, targets, content, publicKnowledgeLevel }` | **Log (the only storage)** |
| **StateChange** | The set of effects of an event | Derived from event + rules (can be materialized as a snapshot) |
| **Observation** | What someone perceived | The observation side-effect carried by an event → written to cognition records |
| **Consequence** | Subsequent event (immediate or delayed) | Scheduling queue / log |

> Conclusion: **the event log is the only spine.** Actions are its input, state changes and observations are its projections, consequences are queued events. The five concepts differ semantically but are not physically stored twice — this satisfies the "do not auto-merge" requirement while avoiding redundancy.

### 5.2 Event Types (initial set, extended per world)

| Type | Example | Description |
| :--- | :--- | :--- |
| `speech_act` | dialogue/interrogation/lie/confession | Includes `utterance`, `subtext?`, `intentTag`; feeds mind-reading/deduction/subtext |
| `physical_action` | attack/move/search | Preconditions mostly location/capability |
| `political_action` | ally/declare war/promulgate decree | Triggers organization-level effects and delayed consequences |
| `forensic_action` | examine/discover evidence/interrogate | Triggers `reveal_fact` cognition write |
| `institutional_action` | coursework/appointment/discipline | Triggers schedule and routines |
| `directorial_intervention` | host-injected event | Provenance `player_directive`, still requires precondition validation (permission) |
| `scheduled_trigger` | timed consequence/deadline | Auto-submitted by the scheduler |
| `world_tick` | daily routine/environment change | Minimal step of autonomous world advancement |

### 5.3 Event Discipline

1. Events are immutable (append-only writes). Correction = a new event (`retraction` type), not in-place editing.
2. Events must be serializable (pure data). Narrative prose is not part of an event.
3. Events must have a `publicKnowledgeLevel` (universal / witnesses_only / covert); observation derivation depends on it.

---

## 6. Information Asymmetry (INFORMATION ASYMMETRY)

### 6.1 Minimal Viable Architecture (not a full cognition logic)

```
WORLD TRUTH (fact layer, with visibility domain + provenance)
        │ observation side-effect (projection of the event, the only write channel)
        ▼
KNOWLEDGE (cognition records: entityKnownFacts[entity]=[factID]; beliefs: with confidence/true-false)
        │ projection (pure read function)
        ▼
PERCEPTION (projectEpistemicPerspective(observer) → observer view)
```

### 6.2 Three Principles

1. **Truth and cognition stored separately**: facts live in the fact layer of definition/state; cognition records only store "which fact IDs are known + subjective beliefs". The true/false marker is a derived value computed at comparison time.
2. **Cognition changes only via events**: the `reveal_fact` / `observation` effect is the only write channel. No character/player/presentation layer can possibly read unauthorized truth directly — because what is read is always the projection result.
3. **Projection executed at presentation time**: after each user turn ends, project by character (including `epistemicFogOfWar`). The projection result does not flow back into state.

### 6.3 Secrets and Dramatic Irony

- `SecretItem`: `{ factId, holdingEntityIds, targetEntityIds, consequencesIfExposed, exposureThreshold }`.
- Exposure trigger: the threshold is pushed up by events (e.g. evidence is discovered) → triggers an exposure event (consequence enters the scheduling queue).
- Irony detection: `compareEpistemicAsymmetry(world, state, A, B, factId)` (already exists) — feeds the experience layer hints about moments "the audience knows but the character doesn't".

### 6.4 Leak Protection Checklist

| Scenario | Protection |
| :--- | :--- |
| Player switches character / switches to host | Re-project before each render (host = omniscient projection, player = strict single-viewpoint projection) |
| LLM agent context injection | Context given to the agent = that agent's projected view, **not** the full state |
| Event content contains a secret | Event `publicKnowledgeLevel` determines the observation derivation scope; covert events have no observers by default |
| Narrative prose leak | Narrative wording is generated from "that observer's view", not from a god's-eye perspective |

---

## 7. Character / Agent / Player / Host Model

### 7.1 Conceptual Separation (not class inheritance, but binding)

```
Entity (base: everything)
  └─ Character = Entity + mind (personality/goals/needs/capability/cognition records)
        └─ Agent = Character (or any entity) + decision binding (who drives it)
               binding controller: 'player' | 'ai' | 'script' | 'none'
Player    = a kind of viewpoint + agency + control binding + cognitive boundary (may control 0..n characters)
Host      = a kind of role/permission + omniscient cognition lens + intervention permission (may simultaneously be a Player)
```

| Concept | Essence | Implementation |
| :--- | :--- | :--- |
| Entity | What exists | `CoreEntityKind` (including character/agent/organization/location/object/resource/concept) |
| Character | Entity with a mind | `CharacterEntity` (mind fields + initial cognition seed) |
| Agent | Entity + decision process | Runtime `AgentBinding` (controller + policy reference) |
| NPC | Agent driven by AI/script | `controller: 'ai' | 'script'` |
| Player | Viewpoint + agency + binding + cognitive boundary | `InhabitedRoleSlot` (already exists) + `PlayerSession` (user side) |
| Host | Role + permission + omniscient lens | `InhabitedRoleSlot(host)` + intervention event channel |

### 7.2 Unified Action/Observation Interface (key)

All "controllers" — player, AI agent, script, host — interact with the world through **the same interface**:

```
interface Controller {
  perceive(view: EpistemicPerspective): void;      // sees only the projection
  decide(context): CandidateEvent[];               // produces candidate events
}
applyEvent(state, def, candidate) → result         // the only write path
```

This lets NPC agents, player agents, and host agents share all infrastructure: precondition validation, observation side-effects, logging, salience. **The idea "the player is an NPC controlled by a human" is firmly rejected** — the player is one instance of a binding.

### 7.3 Host Design

| Question | Decision |
| :--- | :--- |
| Is it a role, a permission, a mode, or a viewpoint? | **A combination of all four**: role (Host role slot) + permission (intervention/review/rule-change) + mode (editing surface in the UI) + viewpoint (omniscient projection) |
| Does it have a separate engine? | **No.** Intervention = a `directorial_intervention` event (provenance `player_directive`), going through the same kernel and validation. The only differences: source is permitted, permission checks are relaxed, observations default to covert |
| Can it see hidden information? | Yes — the host projection = omniscient projection (`observerEntityId` empty); this is a **viewpoint**, it does not change state |
| Can it change definition/rules? | Yes — a `define_modification` event (versioned diff), also enters the log and is rollback-able. The runtime does not open a bypass for this |

---

## 8. Ownership of Memory and Persistence

### 8.1 Placement of the Five Kinds of Memory

| Memory | What it is | Where it lives | Truth status |
| :--- | :--- | :--- | :--- |
| **World memory** | Event log + state (everything that has happened) | Runtime (log is truth) | Truth |
| **Character memory** | That entity's `knownFacts` + beliefs + interaction summary | State cognition records (structured) + derived summary (semantic) | Fact IDs are truth; summary is not truth |
| **Player memory** | User notes + content the player has perceived (derived from character + log) | User data | User notes are user assets |
| **Event history** | The log itself | Runtime | Truth |
| **Derived knowledge** | Long-text summaries / retrieval index (semantic memory) | Asynchronously built derived layer | **Not truth** — always defer to the log; summary is context only |

### 8.2 Memory Outside the Hot Loop

- **Hot loop uses only structured data**: state, cognition records, events (small and deterministic).
- **Long-text memory derived asynchronously**: summaries/indexes built from the log, used for agent context and the presentation layer; any "memory" an LLM receives is annotated with its source (`ProvenanceMeta`) and must not override the fact layer.
- **Anti-contamination rule**: an LLM may generate new events (observation/reasoning), but **cannot rewrite existing facts**; correction = a new event.

### 8.3 Persistence Layering

| Layer | Content | Owner | Storage form |
| :--- | :--- | :--- | :--- |
| Definition | WorldDefinition + version | Author | Versioned document |
| Instance | Snapshot + event log + branch | Runtime | Append-only log + periodic snapshot |
| Player | Notes/bindings/preferences | User | User data |
| Artifact | Images/documents (content-addressed) | Runtime + user | Content-addressed storage, referenced by events |

---

## 9. Connecting to the Definition's Experience Signals

```
WorldDefinition.ExperienceProfile
  ├─ primaryFantasy / dominantTone / tensionGradient
  ├─ socialDensity / informationAsymmetry / consequenceLethality / investigativeDepth
  └─ recommendedModalities (dialogue_focused / forensic_evidence_board / territorial_tactical_map / relationship_web_graph / academic_schedule_timeline / dossier_matrix)
        │
        ▼ (experience service interprets signals, world-agnostic)
ExperienceState + PresentationPlan (see LAYOUT_ARCHITECTURE.md)
```

**Discipline**: the world declares "which modalities matter", the experience service decides "which modality to use now", the presentation layer decides "how to lay it out". None of the three layers may hard-code world-specific UI like a "SPY×FAMILY interface".
