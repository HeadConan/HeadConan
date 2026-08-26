# HeadConan — Prototype Component Audit & Engineering Honesty Report

> **Auditor Notice for Next Engineering Team:**  
> This audit provides an unvarnished, line-by-line inspection of what is actually functional versus what is simulated, hardcoded, or merely visual in the HeadConan prototype codebase. Do not infer architectural viability or production readiness from UI polish.

---

## 1. Executive Summary Table

| Component / Subsystem | Status | Code Evidence | Production Suitability | Honest Assessment & Technical Debt |
| :--- | :--- | :--- | :--- | :--- |
| **World Representation Foundation** (`src/world/representation/*`) | **REAL** | Fully typed TS schema, graph validators (`validator.ts`), epistemic projector (`projector.ts`), dynamic evaluator (`evaluator.ts`), 4 benchmark worlds. Passes all tests. | **HIGH (Core Reference)** | Pure mathematical and epistemic data contracts. Does not yet drive live React state in the main loop (currently decoupled from legacy `world/types.ts`). |
| **Legacy World State Types** (`src/world/types.ts`) | **PARTIAL** | Flat structure mixing entity records with UI directives (`UIBlockType`, `colSpan`). | **REQUIRES REPLACEMENT** | Monolithic interface coupling lore with UI grid layout flags. Must be migrated to `src/world/representation/`. |
| **Client Procedural Engine** (`src/world/engine.ts`) | **MOCKED / PARTIAL** | Keyword heuristics (`prompt.includes('mystery')`) returning static presets (`MYSTERY_SEED_WORLD`, `EMPIRE_SEED_WORLD`, `UNIVERSITY_SEED_WORLD`). | **DO NOT TRUST / REPLACE** | Procedural synthesis is hardcoded template matching. Simulates world generation when AI is offline or prompt matches keywords. |
| **State Mutation Reducer** (`src/world/mutations.ts`) | **PARTIAL** | Basic scalar mutations on stats (`delta`), loyalty (`loyaltyDelta`), and string appending for events. | **INCOMPLETE / REPLACE** | Naive scalar clamping. Does not enforce ontology invariants, capability gates, power dependencies, or epistemic fog-of-war. |
| **AI Integration Server** (`server.ts`) | **REAL** | Express server with real `@google/genai` (Gemini 3.7 Flash) and DeepSeek-V3/R1 HTTP clients with JSON validation and retry fallback. | **REAL (API Proxy Only)** | Robust API gateway, but prompt templates (`src/ai/prompts.ts`) force the LLM into generating monolithic, fragile JSON payloads. |
| **Prompt Engineering** (`src/ai/prompts.ts`) | **PARTIAL** | Monolithic system prompts forcing LLMs to return both WorldState and UIPlan simultaneously in one turn. | **REQUIRES REPLACEMENT** | Violates separation of concerns. Causes high token latency, schema drift, and hallucinations. AI should simulate world dynamics, not design UI grids. |
| **UI Director / Planner** (`src/interface/director.ts`) | **PARTIAL** | Rule-based heuristics (`style.primarySurfaceType === 'evidence-board'`) generating a fixed array of `UIBlock` objects. | **REPLACE WITH DYNAMIC PLANNER** | Rigid 1D array mapping to 3-column CSS grid. Lacks attention modeling, spatial persistence, progressive disclosure, and contextual affordances. |
| **World Canvas Grid Renderer** (`src/ui/renderer.tsx`) | **VISUAL_ONLY** | Maps `UIBlock[]` to a 3-column Tailwind CSS grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`). | **REPLACE** | Assumes all worlds and activities fit into static dashboard card grids. Broken information density on dense maps or high-context mystery boards. |
| **UI Capability Registry** (`src/ui/registry.ts`) | **PARTIAL** | Static dictionary mapping string keys to React block components. | **KEEP PATTERN / REDESIGN** | Good modular concept, but blocks are monolithic cards rather than flexible spatial surfaces. |
| **Evidence Board Block** (`EvidenceBoardBlock.tsx`) | **VISUAL_ONLY / PARTIAL** | Interactive corkboard with SVG connection lines, category filtering, and clue inspection. | **PARTIAL (Visual Asset)** | Renders clues nicely, but clue linking is pre-authored data. The user cannot draw custom thread links, drag pins freely across a real canvas, or deduce new clues organically. |
| **Tactical Map Block** (`MapBlock.tsx`) | **VISUAL_ONLY** | Static SVG schematic with hardcoded coordinate points and faction territory colors. | **VISUAL ONLY (Replace with Real Stage)** | Nodes are static percentage coordinates. No pathfinding, fog-of-war occlusion, zoom/pan transform canvas, or dynamic territory borders. |
| **Character Dossier Block** (`CharacterBlock.tsx`) | **PARTIAL** | Split pane showing character roster, loyalty bars, secret agendas, and action buttons. | **PARTIAL** | Action buttons simply fill the text input on the ActionDock. Does not support conversational dialog trees, emotional state tracking, or direct epistemic inquiry. |
| **Director Console Block** (`DirectorConsoleBlock.tsx`) | **PARTIAL** | Form interface for injecting crisis events, sliding faction influence, and editing rule text. | **PARTIAL (Prototype Interface)** | Submitting a crisis simply prefixes the user prompt with `[DIRECTOR INTERVENTION]`. Real runtime must support ontological editing and agent steering. |
| **Stats / Vitals Block** (`StatsBlock.tsx`) | **REAL (Visual Widget)** | Standard status bars and trend indicators (`good`, `warning`, `critical`). | **PARTIAL** | Pure visual presentation of numeric scalars. Works reliably for what it is. |
| **Timeline Block** (`TimelineBlock.tsx`) | **REAL (Visual Widget)** | Chronological vertical node list of past events and upcoming milestones. | **PARTIAL** | Pure visual component. Does not support timeline branching, alternate history forks, or scrubbable temporal playback. |
| **Document Archive Block** (`DocumentBlock.tsx`) | **REAL (Visual Widget)** | Reader for in-world treaties, memos, and classified correspondence. | **PARTIAL** | Static document display. Lacks interactive redactions, forgery detection, or signature verification mechanics. |
| **Relationship Matrix Block** (`RelationshipBlock.tsx`) | **VISUAL_ONLY** | Simple tabular view of interpersonal ties and friction scores. | **REQUIRES REPLACEMENT** | Flat list instead of a real force-directed relational graph with multidimensional power leverage vectors. |
| **Action Dock** (`ActionDock.tsx`) | **REAL** | Sticky bottom prompt input with suggestion chips, engine selector indicator, and loading states. | **REAL (Usable UI Shell)** | Fully functional input interface. Needs multimodal input support (file attachments, pin dropping, entity targeting). |
| **World Atlas Explorer** (`WorldAtlasExplorer.tsx`) | **REAL (Rich Data Asset)** | 400+ world taxonomy database with 50 golden benchmark worlds, radar charts, filter criteria, and search. | **REAL (Asset & Exploration Tool)** | Comprehensive reference catalog. Excellent for benchmarking, though world launching triggers prompt templates rather than importing structured `WorldDefinition` objects. |
| **Persistence Layer** | **MOCKED / INCOMPLETE** | `localStorage` used solely for saving chosen AI engine and ephemeral session notes. No backend database. | **NON-EXISTENT (Must Build)** | Closing the browser or refreshing drops the active simulated world state. Zero cloud persistence, zero multi-device sync, zero indexed timeline snapshots. |
| **Chronicle Modal** (`ChronicleModal.tsx`) | **REAL** | Modal displaying turn-by-turn history of actions, narratives, and AI engine metadata. | **PARTIAL** | Captures runtime history in memory. Lost on page refresh. |
| **Notes Drawer** (`NotesDrawer.tsx`) | **PARTIAL** | Simple scratchpad drawer saving text to `localStorage`. | **PARTIAL** | Basic text scratchpad. Not linked to in-world entities, clues, or epistemic knowledge graphs. |
| **Engine Selector** (`EngineSelector.tsx`) | **REAL** | UI dropdown allowing user to switch between Auto, DeepSeek-V3, DeepSeek-R1, Gemini 3.7 Flash, and Procedural. | **REAL** | Works as advertised with real backend status checks. |
| **Header & Role Selector** (`Header.tsx`) | **REAL** | Displays world title, active role pill, role switcher modal, turn counter, and navigation modals. | **REAL** | Switching roles updates `activeRoleId` and triggers UI Plan recomputation, but does not yet filter state through epistemic fog-of-war. |

---

## 2. Granular Codebase Audit by Subsystem

### 2.1 State Management & Architecture
- **Current State**: Centralized in `src/app/App.tsx` using native React `useState` hooks.
- **Flaws**:
  - `world: WorldState | null` holds everything (lore, entities, live metrics, historical chronicle, UI layout preferences).
  - High risk of stale closures and full-tree re-renders on minor metric updates.
  - No deterministic state machine or event-sourcing ledger.

### 2.2 AI Generation & Simulation Pipeline
- **Current State**:
  - Direct endpoint calls to `/api/world/generate` and `/api/world/interact`.
  - Backend uses `@google/genai` (Gemini 3.7 Flash) and DeepSeek API (`deepseek-chat` / `deepseek-reasoner`).
- **Shortcuts & Technical Debt**:
  - The AI is asked to return a complete world state update AND a UI layout plan in a single unconstrained JSON response.
  - When the AI returns broken JSON or missing keys, `server.ts` performs crude regex extraction and fallbacks to procedural mock data.
  - NPC dialogue is generated as part of a monolithic narrative paragraph rather than autonomous agent reasoning loops.

### 2.3 UI & Presentation Layer
- **Current State**:
  - Fixed 3-column CSS grid (`src/ui/renderer.tsx`).
  - Blocks are sized via `colSpan: 1 | 2 | 3`.
- **Architectural Failure**:
  - Treats all world genres identically: a political simulator, an intimate murder mystery, an espionage thriller, and a university campus are all forced into identical dashboard cards.
  - No spatial persistence, no focused investigation canvas, no dialogue-first stage, no ambient background context.

### 2.4 Data Persistence
- **Current State**:
  - Zero database integration.
  - Local state is destroyed on page reload.
  - No timeline branching, serialization verification, or session resumption.

---

## 3. Clear Verification Checklist for Next Agent

- [ ] **Do NOT trust `src/world/engine.ts`**: It is hardcoded string matching. Replace with true simulation orchestrator.
- [ ] **Do NOT keep `src/ui/renderer.tsx` grid**: Replace with dynamic multi-surface layout engine based on first-principles attention modeling.
- [ ] **SAFE to reuse `src/world/representation/*`**: The mathematical types, validators, epistemic projector, and benchmark worlds are sound, robust, and verified.
- [ ] **SAFE to reuse `src/components/atlas/*` and `src/data/worldAtlas.ts`**: High-value domain catalog.
- [ ] **SAFE to reuse backend proxy architecture in `server.ts`**: But replace prompt payloads with decomposed tool-calling and structured outputs.
