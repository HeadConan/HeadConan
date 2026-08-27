# HeadConan System Architecture (SYSTEM ARCHITECTURE)

> This file defines the system boundaries: the responsibility, inputs, outputs, ownership, and dependencies of each subsystem. Implementation details are in [`WORLD_RUNTIME.md`](./WORLD_RUNTIME.md) and [`RUNTIME_LOOP.md`](./RUNTIME_LOOP.md).

---

## 1. System Overview

```
                        ┌─────────────────────────┐
                        │      WORLD ATLAS        │ World catalog/baseline (discovery & testing)
                        └────────────┬────────────┘
                                     │ import/instantiation
┌────────────────────────────────────▼────────────────────────────────────┐
│                        WORLD DEFINITION SERVICE                        │
│        Author (human/LLM) produces and validates the WorldDefinition:  │
│        laws + canon + rules + characters + experience signals          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ versioned definition
┌────────────────────────────────────▼────────────────────────────────────┐
│                          WORLD RUNTIME (kernel)                        │
│  · transition kernel State×Event→{State′,Events,Observations} (sole writer)│
│  · state storage + event log + clock + scheduling queue                │
│  · action resolution (player text→candidate events) · agent binding & decisions · host intervention channel│
└───────┬───────────────────────────────┬─────────────────────────────────┘
        │ observer view (cognition ledger)│ changes/event stream
┌───────▼────────────────────────┐  ┌───▼─────────────────────────────────┐
│      EXPERIENCE SERVICE        │  │           PERSISTENCE              │
│  salience/attention → experience state → presentation plan│  │  event log + snapshots + player data + artifact references│
└───────┬────────────────────────┘  └────────────────────────────────────┘
        │ presentation plan (stage mode/focus/satellite/ambient/dock)
┌───────▼────────────────────────┐
│      PRESENTATION LAYER        │
│  layout engine (5 primitives) + Block registry + theme │
└────────────────────────────────┘

Bypass (does not enter the kernel's data plane):
┌────────────────────────────────┐
│           AI GATEWAY           │  LLM provider routing: agent decisions/intent parsing/narrative/images
└────────────────────────────────┘
```

> Key boundary: **The world runtime is the only subsystem permitted to write world state.** The experience layer, presentation layer, and atlas are read-only. The AI gateway does not mutate state directly — it submits candidate events through the runtime-provided "agent decision / intent parsing" interfaces.

---

## 2. Subsystem Specifications

### 2.1 WORLD DEFINITION SERVICE

| Item | Content |
| :--- | :--- |
| **Responsibility** | Production, validation, versioning, and serialization of definitions. Supports human hosts (forms) and AI authors (structured output). |
| **Input** | Author intent (text/form); existing definitions (upgrades); atlas entries (as author templates). |
| **Output** | Versioned `WorldDefinition` (including `ProvenanceMeta`); validation report. |
| **Ownership** | World author (the world definition is an author asset, not a runtime asset). |
| **Dependencies** | Validator (`representation/validation`); AI gateway (AI author mode); persistence (storing definitions). |
| **Not responsible for** | Running, rendering, or acting as an agent. |

### 2.2 WORLD RUNTIME (World Runtime — Kernel Host)

| Item | Content |
| :--- | :--- |
| **Responsibility** | ① Transition kernel (sole writer); ② state and event log maintenance; ③ clock and scheduling queue; ④ action resolution; ⑤ agent binding and decision loop; ⑥ host intervention channel (with permissions). |
| **Input** | Candidate events (player/agent/host/scheduled); world definition; current state. |
| **Output** | New state; new events (including observation records); rejected events (including reasons). |
| **Ownership** | Runtime (state and log are assets of the running instance). |
| **Dependencies** | Definition (read-only reference); AI gateway (agent decisions and intent parsing are callbacks, not inlined); persistence (writing log). |
| **Not responsible for** | Deciding what the UI looks like; deciding what the user should see; generating narrative prose (narrative is presentation-layer wording, not state). |

### 2.3 EXPERIENCE SERVICE

| Item | Content |
| :--- | :--- |
| **Responsibility** | Computing "what the user should attend to right now" from "what happened in the world": salience scoring, attention allocation, drama/uncertainty identification, experience state (ExperienceState) and presentation plan (PresentationPlan). |
| **Input** | State snapshot + event delta + user's recent actions + observer view after cognition ledger projection + the definition's ExperienceProfile. |
| **Output** | `ExperienceState` (focus entity, salient events, change summary, tension metrics); `PresentationPlan` (stage mode, focus, satellite content, ambient metrics, suggested action lexemes, tone). |
| **Ownership** | Derived layer (computed after each user turn, not stored or cached in world state). |
| **Dependencies** | Cognition ledger projector; definition (experience signals); AI gateway (optional: LLM assistance for narrative wording/salience explanation). |
| **Not responsible for** | Pixel-level layout rendering; writing world state. |

### 2.4 PRESENTATION LAYER

| Item | Content |
| :--- | :--- |
| **Responsibility** | Instantiating the presentation plan into the actual UI: layout engine (5 spatial primitives orchestration), Block registry (renderer mapping), world theme (tokens/typography/atmosphere). |
| **Input** | PresentationPlan; observer view (projected data subset); world definition experience signals. |
| **Output** | Rendered interface (React / any future frontend). |
| **Ownership** | Frontend team / platform layer; domain-agnostic. |
| **Dependencies** | Experience service (plan); registry (renderers). |
| **Not responsible for** | World simulation; content generation (Blocks only render already-projected data, they do not generate domain content themselves). |

### 2.5 PERSISTENCE

| Item | Content |
| :--- | :--- |
| **Responsibility** | Event log (append-only writes), periodic snapshots, player data (bindings/notes/preferences), generated artifacts (images/documents, content-addressed references), world definition version repository. |
| **Input** | Events and snapshots produced by the kernel; user notes; artifact URLs. |
| **Output** | Resuming sessions, branching, exporting (world archive). |
| **Ownership** | Layered: definitions → author; log + state → runtime; player data → user; artifacts → jointly owned by runtime and user. |
| **Dependencies** | Kernel (subscribes to event stream). |
| **Not responsible for** | Computation, rendering. |

### 2.6 AI GATEWAY

| Item | Content |
| :--- | :--- |
| **Responsibility** | Multi-provider routing (DeepSeek/Gemini/local fallback); four task classes: ① agent decisions (perceive→intent→action); ② intent parsing (player text→structured candidate event); ③ narrative wording (turning events into text); ④ world definition synthesis (AI author). |
| **Input** | Task type + context (projected view, definition, events). |
| **Output** | Decisions / candidate events / text / definition fragments. |
| **Ownership** | Infrastructure layer. |
| **Dependencies** | Provider APIs. |
| **Not responsible for** | **Writing world state.** All outputs must enter the world as candidate events through the kernel. |

### 2.7 WORLD ATLAS

| Item | Content |
| :--- | :--- |
| **Responsibility** | World catalog (400+), gold-standard baselines (50), test baselines (4 representative baseline worlds), scoring framework. |
| **Input** | User queries/filters. |
| **Output** | Entries → author templates (a starting point for producing a WorldDefinition); baselines → kernel regression tests. |
| **Ownership** | Data asset. |
| **Dependencies** | None (consumed by the definition service and tests). |
| **Not responsible for** | Running; does not contain instance state. |

---

## 3. Dependency Rules

1. **Dependency direction**: presentation layer → experience service → runtime → definition service; runtime → AI gateway (callbacks only). No subsystem may depend in the reverse direction.
2. **Write permission**: only the runtime writes world state. The experience service, presentation layer, atlas, and AI gateway are read-only.
3. **Data contracts**: the boundaries between subsystems are types (`WorldDefinition`, `WorldStateInstance`, `SimulationEvent`, `EpistemicPerspective`, `PresentationPlan`), not free-form JSON or text prefixes.
4. **Narrative/truth separation**: LLM-generated prose (narrative wording) is input to the presentation layer and is never treated as part of state; narrative fields in state (such as `currentSituationNarrative`) must be derived summaries of events and must be reconstructable from the log.
5. **Replaceability**: the UI is replaceable (swap frontends without swapping the kernel); agents are replaceable (swap decision policies without swapping the kernel); storage is replaceable (swap databases without swapping the kernel). The kernel is the anchor of the contract.

---

## 4. Migration Map (MIGRATION MAP)

| Current State | Migrate To |
| :--- | :--- |
| `useState<WorldState>` in `App.tsx` | Runtime state storage (a `WorldStateInstance` updated via the event kernel) |
| Monolithic single-turn JSON endpoint in `server.ts` | Tool-oriented endpoints for the AI gateway's four task classes |
| `computeUIPlan` rules tree | Experience Service's salience + presentation plan |
| `renderer.tsx` 3-column grid | Presentation Layer's layout engine |
| `localStorage` world + chronicle | Layered persistence of event log + snapshots + player data |
| `[DIRECTOR INTERVENTION]` prefix | Host intervention event (with permissions and provenance) |
| `engine.ts` keyword matching | Definition synthesis (LLM-produced definition) + deterministic instantiation + deterministic fallback |
