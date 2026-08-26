# System Architecture — HeadConan

## 1. Architectural Philosophy: Decoupled World & UI

A core principle of HeadConan is the strict separation between:
1. **World State**: The underlying simulation truth (Characters, Locations, Factions, Timelines, Documents, Tensions).
2. **UI Representation**: The dynamic projection of that state onto interactive UI blocks.

```
┌─────────────────────────────────────────────────────────────┐
│                         USER INPUT                          │
│         "Move the northern garrison to the capital"         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     AI SIMULATION ENGINE                     │
│    Intent Interpretation → State Mutation → UI Planning     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         WORLD STATE                         │
│   • Factions (Influence & Loyalty shifts)                   │
│   • Characters (Reactions & Status)                         │
│   • Timeline & Events (New emergent reports)                │
│   • Intelligence Documents & User Notes                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    UI PLANNING & REGISTRY                   │
│  Selects semantic UI Blocks (Map, Dossier, Gauge, Timeline) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  DETERMINISTIC UI RENDERER                  │
│       React Components render structured JSON blocks         │
└─────────────────────────────────────────────────────────────┘
```

## 2. Minimum Sufficient Reality

HeadConan does not overwhelm the user with thousands of procedurally generated boilerplate entities. It generates **only enough structure** to ground the experience and provide meaningful affordances, leaving the rest for the user's imagination.

## 3. Controlled Generative UI

The AI does **not** generate arbitrary HTML or unstable React code on the fly. 
- The **AI decides what should exist** (the semantic entity and block type).
- The **Frontend decides how that thing is rendered** (the deterministic, accessible React component).

## 4. State Synchronization & Mutability

- **State Store (`src/world/state.ts`)**: Manages the in-memory active world, history snapshots, and user-authored notes.
- **Mutation Engine (`src/world/mutations.ts`)**: Applies incremental diffs (delta stats, loyalty updates, new log items).
- **Persistence (`localStorage`)**: Saves session state locally without mandatory remote DB lock-in during prototype research.
