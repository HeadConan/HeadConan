# HeadConan — Engineering Handoff & Technical Briefing for the Next Coding Agent

> **CONFIDENTIAL ENGINEERING BRIEFING:**  
> This document is your primary map to this repository. It tells you what is real, what is fake, what is dangerous, and exactly what to build next.

---

## 1. Ground Truth Code Inventory

### 🟢 CURRENTLY WORKING (Real & Tested)
1. **World Representation Foundation (`src/world/representation/*`)**:
   - Fully typed TypeScript mathematical representations (`ontology`, `entity`, `relationships`, `social`, `power`, `axioms`, `information`, `dynamics`, `player`, `experience`, `definition`, `state`, `scenarios`).
   - Structural graph validator (`validator.ts`).
   - Epistemic perspective projection & dramatic irony analyzer (`projector.ts`).
   - Action evaluation & dynamic state mutation engine (`evaluator.ts`).
   - Four complete benchmark world definitions (SPY × FAMILY, Game of Thrones, Sherlock Holmes, Modern University).
   - 100% clean TypeScript compile and test passes (`npm run lint`, `npm run build`).
2. **Server-Side AI Proxy (`server.ts`)**:
   - Secure proxy routes `/api/health`, `/api/world/generate`, and `/api/world/interact`.
   - Dual-engine integration: Google GenAI (`@google/genai` with Gemini 3.7 Flash) and DeepSeek (`deepseek-chat` and `deepseek-reasoner`).
   - Robust JSON extraction and fallback sanitization.
3. **World Atlas Database (`src/data/worldAtlas.ts` & `WorldAtlasExplorer.tsx`)**:
   - 400+ world taxonomy database with 50 golden benchmark worlds across 10 fantasy/narrative dimensions.
   - Rich filtering, search, radar charts, and comparative analytics.
4. **UI Action Dock (`ActionDock.tsx`)**:
   - Responsive sticky bottom prompt input with suggestion chips, engine badge indicators, and loading feedback.

---

### 🟡 CURRENTLY MOCKED (Simulated Behavior)
1. **Procedural Fallback Engine (`src/world/engine.ts`)**:
   - Uses basic string keyword matching (e.g. `prompt.includes('mystery')`) to return static JSON presets (`MYSTERY_SEED_WORLD`, etc.).
2. **Evidence Corkboard Yarn & Pins (`EvidenceBoardBlock.tsx`)**:
   - Clue connection lines and pins are hardcoded SVG vectors; the user cannot freely drag nodes on a physical physics canvas.
3. **Tactical Map (`MapBlock.tsx`)**:
   - Coordinates are static percentage values on a decorative SVG graphic. No dynamic pathfinding or spatial collision logic.
4. **Persistence**:
   - Uses browser `localStorage` solely for the chosen AI engine ID and temporary notes. World simulation state is lost on browser refresh.

---

### 🔴 DO NOT TRUST (Fragile or Obsolete)
1. **`src/world/types.ts`**:
   - Legacy monolithic type file that conflated lore with UI layout attributes (`colSpan`).
   - **Action**: Deprecate and replace with `src/world/representation/index.ts`.
2. **`src/ai/prompts.ts`**:
   - Single-turn monolithic system prompts asking the LLM to generate both World Lore AND a 3-column UI plan simultaneously. Causes schema drift and high latency.
   - **Action**: Replace with decomposed agent tools and structured state-delta updates.
3. **`src/ui/renderer.tsx`**:
   - Hardcoded 3-column Tailwind CSS grid. Does not support adaptive focal stages or dynamic attention planning.

---

## 2. Safe vs. Must Replace Matrix

| Subsystem | File Path | Verdict | Next Action |
| :--- | :--- | :--- | :--- |
| **World Representation** | `src/world/representation/*` | **SAFE TO REUSE** | Connect to live React state and persistence. |
| **World Atlas** | `src/data/worldAtlas.ts` | **SAFE TO REUSE** | Keep as reference benchmark library. |
| **AI Server Gateway** | `server.ts` | **SAFE TO REUSE** | Keep proxy; update request/response schemas. |
| **Legacy World Types** | `src/world/types.ts` | **MUST REPLACE** | Migrate to `src/world/representation/`. |
| **Procedural Fallback** | `src/world/engine.ts` | **MUST REPLACE** | Replace with deterministic rule evaluation. |
| **Legacy UI Planner** | `src/interface/director.ts`| **MUST REPLACE** | Replace with dynamic `PresentationPlanner`. |
| **Static Grid Renderer** | `src/ui/renderer.tsx` | **MUST REPLACE** | Replace with 5-primitive Layout Grammar. |

---

## 3. Recommended Next Implementation Order

```
[PHASE 1: RUNTIME BINDING]
├── 1. Wire `src/world/representation/` as the primary live state store in React.
├── 2. Implement `projectEpistemicPerspective()` into the render loop so characters only see permitted facts.
└── 3. Implement durable persistence (Firestore or IndexedDB event ledger).

[PHASE 2: DYNAMIC LAYOUT ENGINE]
├── 4. Replace 3-column grid with the 5-Primitive Layout Engine (Anchor, Stage, Satellite, Ambient, Dock).
├── 5. Implement the Layout Lab compositions (Dialogue, Spatial, Evidence, Strategy, Host).
└── 6. Implement smooth FLIP layout transitions between focus modes.

[PHASE 3: MULTI-AGENT SIMULATION]
├── 7. Decompose monolithic LLM prompts into individual Character Agent deliberation loops.
├── 8. Add structured tool-calling for discrete state mutations (inventory, location, trust).
└── 9. Connect the Director Console to real-time axiom mutation and crisis injection.
```

---

## 4. Key Design Invariants to Remember

1. **Information Asymmetry is Sacred**: Never allow an NPC or the player to read secrets they do not epistemically own.
2. **Layout is Dynamic**: The screen must reconfigure around the primary task (Dialogue vs. Map vs. Corkboard vs. Matrix), not force every universe into a fixed 3-column dashboard.
3. **Player vs. Host are Lenses**: Do not build two separate apps for Player and Host; they are two epistemic perspective lenses on the same continuous simulation.
