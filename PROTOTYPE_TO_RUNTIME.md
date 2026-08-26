# Architectural Gap Report: Prototype to Production Runtime

> **Auditor Note:** This report maps the exact architectural transformation required to transition HeadConan from an experimental UI prototype into a production-grade, multi-agent world simulation platform.

---

## 1. End-to-End Architectural Pipeline Comparison

```
+---------------------------------------------------------------------------------------------------+
|                                      CURRENT PROTOTYPE PIPELINE                                   |
|                                                                                                   |
|  User Prompt                                                                                      |
|       │                                                                                           |
|       ▼                                                                                           |
|  Monolithic LLM Call ──────► Flat WorldState JSON (with UI layout hints)                          |
|                                   │                                                               |
|                                   ▼                                                               |
|                              computeUIPlan() ──► 3-Column CSS Grid ──► Monolithic Cards           |
+---------------------------------------------------------------------------------------------------+

                                                 ▼
                                        MIGRATION REQUIREMENT
                                                 ▼

+---------------------------------------------------------------------------------------------------+
|                                   INTENDED PRODUCTION ARCHITECTURE                                |
|                                                                                                   |
|  [1. USER INTENT] ──► [2. INTERACTION ENGINE] ──► [3. SIMULATION ORCHESTRATOR]                    |
|                                                               │                                   |
|                                                               ▼                                   |
|                                                   [4. WORLD REPRESENTATION]                       |
|                                                       • Canonical Ontology & Axioms               |
|                                                       • Living Entity State Store                 |
|                                                       • Multidimensional Power Tensors            |
|                                                       • Epistemic Fog of War & Secrets            |
|                                                               │                                   |
|                                                               ▼                                   |
|  [8. PERSISTENCE] ◄─── State Delta Event Ledger ──► [5. AGENT ORCHESTRATION]                      |
|  • Firestore/IndexedDB                                • Multi-Agent Thought Chains                |
|  • Timeline Branching                                 • Autonomous NPC Deliberations              |
|                                                               │                                   |
|                                                               ▼                                   |
|  [6. PRESENTATION PLANNER] ◄──────────────────────────────────┘                                   |
|  • Attention Model (Primary / Secondary / Ambient / Hidden)                                       |
|  • Dynamic Layout Engine (Canvas, Stage, Dock, Inspector, Overlays)                               |
|                               │                                                                   |
|                               ▼                                                                   |
|  [7. ADAPTIVE COMPOSITIONAL UI] ◄── Epistemic Perspective Lens (Player vs Host)                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Layer-by-Layer Architectural Audit

### Layer 1: User Interface (UI)
* **What exists now**: A 3-column Tailwind CSS grid rendering 11 pre-built card components (`src/ui/renderer.tsx`, `src/components/blocks/*`).
* **What is missing**: Dynamic multi-surface composition, continuous zoom/pan spatial canvases, draggable inspector sheets, contextual split-screen views, and world-specific styling engines.
* **What should remain**: Individual visual components that render domain data well (e.g. `StatsBlock`, `EvidenceBoardBlock` visual styling, `ActionDock` ergonomics).
* **What should be replaced**: The static 3-column CSS grid container.
* **What should NOT be carried into production**: Hardcoded layout attributes on block entities (e.g., `block.colSpan = 2`).

---

### Layer 2: Interaction Layer
* **What exists now**: A bottom text input bar (`ActionDock.tsx`) that submits raw natural language strings to `/api/world/interact`.
* **What is missing**: Multimodal entity targeting (clicking a character to interrogate them, clicking a map node to dispatch an agent), intent classification before LLM invocation, action precondition validation, and rollback/undo capabilities.
* **What should remain**: The fast suggestion chip interaction and keyboard shortcut bindings.
* **What should be replaced**: Submitting unstructured raw text prompts as the sole interaction vehicle.
* **What should NOT be carried into production**: Prefixing actions with hacky text tags like `[DIRECTOR INTERVENTION]` to simulate authority.

---

### Layer 3: Presentation State & Layout Planning
* **What exists now**: `computeUIPlan` in `src/interface/director.ts`—a static heuristic that checks `style.primarySurfaceType` and returns an array of blocks.
* **What is missing**: Attention budgeting, spatial persistence tracking, adaptive layout grammar (Stage + Context + Ambient), and dynamic progressive disclosure based on simulation events.
* **What should remain**: The concept of an explicit, separate Presentation Planning phase between World State and UI Rendering.
* **What should be replaced**: The hardcoded rule tree assigning static colSpans.
* **What should NOT be carried into production**: UI block configurations generated inside LLM world simulation prompts.

---

### Layer 4: World Runtime & Dynamics
* **What exists now**: `applyWorldMutations` in `src/world/mutations.ts`—a scalar clamping reducer that increments turn numbers and adjusts loyalty/influence values.
* **What is missing**: Deterministic rule execution, capability checking, spatial adjacency constraints, probabilistic emergent consequence calculation, crisis triggers, and timeline branching.
* **What should remain**: The pure state reducer pattern `(State, Action) => NextState`.
* **What should be replaced**: Naive integer mutations.
* **What should NOT be carried into production**: Client-side procedural seed matching (`src/world/engine.ts`).

---

### Layer 5: World State & Representation
* **What exists now**:
  - Legacy `src/world/types.ts` (flat array of characters, locations, factions, stats).
  - Foundation `src/world/representation/*` (formal ontology, axioms, relationships, power vectors, epistemic projector, facts, secrets, validation).
* **What is missing**: Active integration bridging `src/world/representation/*` into the live React application loop.
* **What should remain**: The newly compiled `src/world/representation/*` foundation (types, validators, epistemic projector, evaluator).
* **What should be replaced**: Legacy `src/world/types.ts` must be completely deprecated and removed.
* **What should NOT be carried into production**: Flat `Character` objects with inline `loyalty: number` without directed relationship edges.

---

### Layer 6: AI & Agent Orchestration
* **What exists now**: Two monolithic HTTP endpoints in `server.ts` asking Gemini or DeepSeek to output an entire world state in one shot.
* **What is missing**:
  - Multi-agent orchestration (independent Character Agents with private memories and agendas).
  - Chain-of-Thought deliberation (NPC decides goal -> checks knowledge -> picks action).
  - Tool-calling for discrete state mutations (rather than dumping full JSON snapshots).
  - Structured output schemas with deterministic validation.
* **What should remain**: The robust Express server proxy with dual Gemini/DeepSeek provider support.
* **What should be replaced**: Monolithic one-shot prompts in `src/ai/prompts.ts`.
* **What should NOT be carried into production**: Asking LLMs to invent arbitrary CSS block configurations.

---

### Layer 7: Persistence & Storage
* **What exists now**: `localStorage` used solely for ephemeral engine selection and scratchpad notes.
* **What is missing**: Cloud database persistence (Firestore or PostgreSQL), event sourcing ledger, snapshot indexing, session resumption, branching timeline trees, and export/import of binary world cartridges.
* **What should remain**: Local client caching for offline resilience.
* **What should be replaced**: Pure in-memory state in `App.tsx`.
* **What should NOT be carried into production**: Unversioned state objects without migration schemas.

---

## 3. Migration Roadmap for the Next Agent

1. **Step 1: Wire Core Representation to Live State**: Replace `WorldState` in `App.tsx` with `WorldDefinition` + `WorldStateInstance` from `src/world/representation/`.
2. **Step 2: Implement Epistemic Filtering**: Run all state through `projectEpistemicPerspective()` before it reaches UI components.
3. **Step 3: Replace Grid with Dynamic Layout Engine**: Implement the minimal layout grammar (Stage, Context, Ambient, Dock, Sheet).
4. **Step 4: Decompose LLM Prompts into Agent Tools**: Move from one-shot JSON generation to structured action evaluation and NPC dialogue synthesis.
5. **Step 5: Add Durable Persistence**: Hook into Firestore/IndexedDB with event-sourced turn snapshots.
