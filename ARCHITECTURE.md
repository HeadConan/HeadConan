# HEADCONAN ARCHITECTURE (ITERATION 2)

HeadConan is a runtime for inhabiting, directing, and transforming imagined worlds.

---

## 1. System Overview

```
 ┌─────────────────────────────────────────────────────────────┐
 │                 WORLD RUNTIME & STATE                      │
 │   - Characters, Factions, Locations, Events, Clues, Rules   │
 │   - Causality Resolution Engine (DeepSeek / Gemini)         │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                      UI DIRECTOR                            │
 │   - Inputs: WorldState + Active RoleSlot + WorldStyle       │
 │   - Attention Budget Allocator (Caps cognitive load)        │
 │   - Composes active layers for the World Canvas             │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                      WORLD CANVAS                           │
 │   Layer 0: World Frame (Header, Role Slot Selector, Chrono) │
 │   Layer 1: Primary Surface (Map / Evidence Board / Roster)  │
 │   Layer 2: Context Surfaces (Docs, Timeline, Stats, Alerts) │
 │   Layer 3: Interaction Surface (Context-Aware Action Dock)  │
 └─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### 1. Multi-Model AI Gateway (`server.ts` & `src/ai/client.ts`)
* Provides intelligent model routing across:
  - **DeepSeek-V3** (`deepseek-chat`): Fast, rich simulation and world synthesis.
  - **DeepSeek-R1** (`deepseek-reasoner`): Deep chain-of-thought causality analysis.
  - **Gemini 2.5 / Flash**: High-speed multimodal intelligence.
  - **Procedural Engine**: Sub-millisecond deterministic fallback.

### 2. Role Slot Engine (`src/roles/model.ts`)
* Defines inhabitant identity, agency (character-level vs. world-level vs. system-level), perspective, knowledge fog-of-war, and permissions.
* Enables instant, seamless agency shifting without page reloads.

### 3. UI Director & Attention Budget (`src/interface/director.ts`)
* Analyzes the active world state, current role, and world style grammar.
* Allocates visual real estate dynamically to prevent interface bloat.

### 4. World Canvas & UI Capabilities (`src/ui/` & `src/components/blocks/`)
* Modular surface blocks including:
  - `EvidenceBoardBlock`: Interactive detective corkboard with pins and red yarn links.
  - `DirectorConsoleBlock`: Directorial intervention matrix and world axiom modifier.
  - `MapBlock`: Interactive SVG spatial and territorial map.
  - `CharacterBlock`: Dossiers with loyalty and suspicion gauges.
  - `StatsBlock`: System vitals and equilibrium meters.
  - `DocumentBlock`: In-universe classified memos and autopsy records.
  - `TimelineBlock`: Chronological schedules and crime timelines.
  - `EventBlock`: Urgent crisis and alert dispatches.
