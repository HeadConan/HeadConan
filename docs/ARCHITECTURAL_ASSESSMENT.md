# HeadConan Architectural Assessment

> Phase: Pre-implementation planning (Phase 0).
> Purpose: Before writing any production code, determine what HeadConan *actually is*, what the prototype *actually does*, what is *pretended*, and which abstractions are worth keeping versus which must be discarded.
> Basis: A full read-through of all repository source and documentation (`src/**`, `server.ts`, 15 root-level docs, 21 docs in `docs/**`, `docs/layout/*`, `docs/world-atlas/*`).

---

## 1. What HeadConan Is Right Now

Cross-validating the code and documentation, HeadConan is currently a **research prototype for "generative interface + text interaction"**, not a world runtime:

- **Interface layer (real)**: A refined dark-mode UI in React 19 + Tailwind, with 11 semantic UI Blocks (map, evidence board, dossier, timeline, events, relationships, stats, document, director console, etc.), orchestrated by a rule-based `computeUIPlan` into a fixed 3-column CSS grid.
- **State layer (partly real)**: The flat `WorldState` in `src/world/types.ts` (arrays of characters/locations/factions/events/stats/documents), held by `App.tsx` via `useState` and written to `localStorage`.
- **AI layer (real but misused)**: `server.ts` is a robust Express proxy (Gemini + DeepSeek + image generation + procedural fallback). But the prompts force the LLM to emit, in a single turn, a giant JSON of "complete world state + UI layout plan".
- **World representation layer (real but unwired)**: `src/world/representation/*` is a formal typed representation system (Definition/State/Dynamics/Presentation four-layer separation, cognition projector, validators, action evaluator, four baseline worlds), but it is **entirely disconnected** from `App.tsx`'s real-time loop.

In one sentence: **the prototype is a "generative dashboard that looks like a world simulator"; a genuine world runtime does not yet exist — only its building material (the representation system) and its display skin (the UI blocks).**

---

## 2. What the Prototype Implements (REAL)

| Subsystem | Location | Authenticity | Notes |
| :--- | :--- | :--- | :--- |
| World representation foundation | `src/world/representation/*` | **REAL** | Definition/State/Dynamics/Presentation four-layer separation; Fact/Belief/Secret/Rumor cognition model; relationships and power vectors; `projectEpistemicPerspective`, `validateWorldDefinition`, `evaluateWorldAction`; four baseline worlds. Passes type checking. |
| AI gateway proxy | `server.ts` | **REAL** | Gemini 3.7 Flash, DeepSeek V3/R1, image generation, JSON extraction and fallback chain. |
| World atlas | `src/data/worldAtlas.ts` + `WorldAtlasExplorer` | **REAL** | 400+ world classification library, 50 gold-standard worlds, radar charts and filtering. |
| Interaction shell | `ActionDock`, `Header`, `EngineSelector` | **REAL** | Suggested terms, engine switching, character switching. |
| Pure visual components | `StatsBlock`, `TimelineBlock`, `DocumentBlock`, etc. | **REAL (visual only)** | Renders existing data well, but no interactive depth. |
| Layout research | `docs/LAYOUT_*`, `docs/layout/*`, `docs/PRESENTATION_MODEL.md` | **REAL (design assets)** | 5 spatial primitives, attention scoring, FLIP transitions, 6 scenario layout analyses — among the most valuable design assets. |

---

## 3. What the Prototype Pretends to Implement (FAKE / MOCKED)

| Pretended implementation | Evidence | Truth |
| :--- | :--- | :--- |
| **World generation** | `src/world/engine.ts` returns a static seed via keyword matching such as `prompt.includes('mystery')` | Template matching, not synthesis. Any prompt not in the seed library falls back to a generic template. |
| **Causal simulation** | `simulateWorldInteraction` guesses sentiment by string checks like `includes('attack')/includes('talk')` | Keyword heuristics + hardcoded numeric drift; validates no preconditions and produces no genuine cascading consequences. |
| **Director / god intervention** | `DirectorConsoleBlock` prefixes submitted text with `[DIRECTOR INTERVENTION]` | Uses a text prefix to fake authority, bypassing any permission/rule system. |
| **Information asymmetry** | `Header` switching characters only changes `activeRoleId` and recomputes the UI plan | World state reaches the UI **without** epistemic filtering; the `representation` projector sits idle. |
| **Adaptive UI** | `computeUIPlan` returns a fixed Block array based on `style.primarySurfaceType` | A rules tree — no attention model, no focus object, no spatial persistence. |
| **Persistence** | `localStorage` saves world JSON + chronicle | Recoverable across refreshes in the same browser, but no event log, no branching, no snapshot versioning, no multi-device support. |
| **Evidence board / map interaction** | Hardcoded SVG coordinates and connectors | Users cannot drag, connect, or reason; purely presentational. |

---

## 4. Existing Major Abstractions (worth reviewing and keeping / evolving)

Ordered by "architectural importance":

1. **Definition / State / Dynamics / Presentation four-layer separation** (`representation/`) — the direction is correct; the most important existing asset of the project.
2. **Cognition model**: `Fact` (6-level visibility domain), `Belief` (confidence + truth value), `SecretItem` (holder/target/exposure threshold), `RumorItem`, `projectEpistemicPerspective` projector — solves the minimal viable modeling of information asymmetry.
3. **First-order relationships and multi-dimensional power**: `RelationshipDefinition` (affinity/trust/powerBalance/visibility/coverStory), `PowerRelation` (7-domain vector: political/economic/military/informational/social/supernatural/forensic).
4. **Player possibility space**: `InhabitedRoleSlot` (5 inhabitation modes, 4 agency levels, 3 epistemic fog-of-war levels) — the key abstraction that player ≠ NPC.
5. **Type skeleton for scenarios and branches**: `ScenarioSeed`, `TimelineBranch` (types only, no runtime semantics).
6. **Experience signals**: `ExperienceProfile` (dominant fantasy archetype, tension gradient, information density, `recommendedModalities`) — the correct interface where the world drives the UI without hardcoding components.
7. **Action declaration model**: `WorldActionDefinition` (preconditions/directEffects/potentialConsequences) + `evaluateWorldAction` evaluator — already exists but is not wired into the player input path.
8. **Layout syntax**: 5 spatial primitives (Anchor/Stage/Satellite/Ambient/Dock) + draft `PresentationPlan` type.
9. **Namespaced IDs and provenance**: `entity:spy_family:loid_forger`, `ProvenanceMeta` (authored/derived/observed/inferred/simulated/temporary) — key to distinguishing canon from hallucination.
10. **Validator**: `validateWorldDefinition` (dangling references, duplicate IDs, character bindings).

---

## 5. Missing Abstractions (MISSING)

| Missing abstraction | Why it is necessary | Current state |
| :--- | :--- | :--- |
| **Event kernel (single writer)** | All state changes must pass through a single, replayable, verifiable pure function; otherwise determinism, rollback, and branching cannot be guaranteed | None; state is directly mutated by `mutations.ts` and the LLM |
| **Action resolution layer** | Free-form user text → structured candidate events → precondition validation → event | None; text goes straight to the LLM or keyword matching |
| **Side-effecting of cognition updates** | Observations must be written back to `knownFacts`/`beliefs` as an effect of an event, to guarantee no leakage | The `projector` is a pure read function (correct), but there is no "observation → knowledge" write channel |
| **Focus / salience computation** | Decides "what matters right now" — the entry point of the experience layer | None; `computeUIPlan` is just a rules tree |
| **Agent binding model** | Who controls a character (player/AI/script) should be a runtime binding, not an entity attribute | Only an `AgentBehavior` type shell, no binding or decision loop |
| **Scheduler (time / pending event queue)** | Cascading consequences, "the minister's reaction tomorrow", campus schedules all need deferred execution | None; events are applied fully and immediately |
| **Persistence layering** | Definitions/instances/state/event logs/player data each have their own home | Only a single localStorage object |
| **Dialogue as a first-class object** | Lies, subtext, and mind-reading all require utterance records rather than narrative text | None |
| **Layout engine** | Implementation of the 5 primitives: focus → stage mode → satellite/ambient/dock orchestration | Documentation only |
| **Real channel for creator / director tools** | Interventions should become events with provenance, through the same kernel | Faked with text prefixes |

---

## 6. Dangerous Assumptions (DANGEROUS ASSUMPTIONS)

1. **"The LLM can output complete and consistent world-state JSON in a single turn"** — schema drift and hallucination have already occurred repeatedly; the larger the state, the less reliable; token cost explodes linearly with rounds. This is the most dangerous assumption in the current architecture.
2. **"The LLM should design the UI"** — the prompt asks the LLM to return `uiPlanning.blocks`. This contradicts the fundamental claim that "the world is independent of the interface".
3. **"All worlds fit the same dashboard grid"** — the 3-column grid compresses political simulation, murder mystery, spy family, and campus life into the same shape.
4. **"Beliefs belong to the definition rather than the state"** — `CharacterEntity.beliefs` is a static array; but beliefs change over time (suspicion, misunderstanding, disillusionment). Static beliefs will conflict with the simulation.
5. **`knownFactIds` dual source** — `char.knownFactIds` on the definition and `epistemics.entityKnownFacts` on the state coexist. Which is authoritative? There must be a single source at runtime.
6. **"The representation system is pure math and can be wired up slowly"** — if it cannot be connected to the real-time loop, `representation/` becomes "pretty but useless" dead code. The risk is that its correctness is never validated by a real path.
7. **"A turn = a user action"** — no temporal semantics: a campus world needs calendar pressure, a suspense world needs a countdown, yet `inUniverseTime` is just a string.
8. **"Switching characters does not change state"** — currently switching to the director just shows an extra console; a true director perspective should change "what is visible", not "what tools are owned".
9. **`currentSituationNarrative` string blob** — as the sole narrative anchor of state, it is unstructured and cannot compute salience.

---

## 7. Keep (PRESERVE)

| Keep | Reason |
| :--- | :--- |
| `src/world/representation/*` as a whole | Four-layer separation, cognition model, relationship/power, role space, scenario/branch skeleton, validator, four baseline worlds — the foundation of the future kernel's data contract |
| `server.ts` proxy architecture | Multi-provider routing, fallback chain, image generation endpoints; only the prompts and request/response contracts need replacement |
| `src/data/worldAtlas.ts` | High-value baseline catalog; note that its `rightsStatus` field provides an entry point for copyright risk |
| Layout research docs (`docs/LAYOUT_*`, `docs/layout/*`, `PRESENTATION_MODEL.md`) | The 5 primitives and the 14-question research are the specification for the layout engine |
| `ActionDock` interaction shell and suggested-terms mechanism | The only mature human-machine channel |
| Pure visual components (Stats/Timeline/Document/Event) | Cheaply reusable once the data contract is clarified |
| `ProvenanceMeta` and namespaced IDs | Provenance is the cornerstone of distinguishing canon/hallucination/intervention |
| The reducer spirit of `evaluateWorldAction` | `(State, Action) → NextState` is the right direction, only the evaluation is too shallow and unwired |

---

## 8. Discard (DISCARD)

| Discard | Reason |
| :--- | :--- |
| `src/world/types.ts` (legacy `WorldState`) | A flat lore+UI mixture (`colSpan` inside domain types). Superseded by migration to `representation/` |
| `src/world/engine.ts` keyword matching | Pseudo-synthesis. Replace with: genuine world synthesis (LLM produces **definition** JSON + deterministic instantiation) + deterministic fallback |
| `src/world/mutations.ts` scalar clamping | No preconditions, no rules, no cascade. Replace with the event kernel |
| `src/ai/prompts.ts` and the single-turn giant JSON prompt in `server.ts` | Violates every separation principle. Replace with: structured tool calls / small-step state increments |
| `src/interface/director.ts` rules tree | Replace with an attention/salience-driven `PresentationPlanner` |
| `src/ui/renderer.tsx` 3-column grid | Replace with the 5-primitive layout engine |
| The `[DIRECTOR INTERVENTION]` text-prefix mechanism | Replace with provenance-bearing intervention events, through the same kernel with permission validation |
| Layout attributes hardcoded onto Blocks (`colSpan`) | Layout belongs to the experience layer, not domain data |
| Static seed worlds' UI plans (`uiPlanning` in `mockWorlds`) | Worlds should not carry UI plans |

---

## 9. Conclusion

The prototype is **halfway down two directions**: the representation system (correct mathematical/cognitive contract) and the presentation layer (a refined visual shell) both already exist, but the heart in between — the **event-driven world transition kernel, action resolution, cognitive side effects, salience computation, and agent binding** — is entirely missing. The next phase is not "keep piling on UI", but wiring the representation system into a runtime, and establishing the single write channel between the two.

Related documents:
- Kernel definition → [`HEADCONAN_KERNEL.md`](./HEADCONAN_KERNEL.md)
- System boundaries → [`SYSTEM_ARCHITECTURE.md`](./SYSTEM_ARCHITECTURE.md)
- Runtime details → [`WORLD_RUNTIME.md`](./WORLD_RUNTIME.md)
