# HeadConan — Presentation Planning Model & Dynamic Layout Architecture

---

## 1. Architectural Data Flow

The Presentation Planner serves as the bridge between raw mathematical world state and the rendered UI:

```
[WORLD STATE / SIMULATION TICK]
             │
             ▼
   [EPISTEMIC PROJECTOR] ──► Filter reality through Active Inhabited Role (Fog of War)
             │
             ▼
    [ATTENTION SCORER] ──► Identify Primary Focus Entity, Topic, or Crisis
             │
             ▼
   [PRESENTATION PLANNER] ──► Select Stage Mode, Context Satellite, and Action Chips
             │
             ▼
     [LAYOUT ENGINE] ──► Morph Stage Canvas, Animate Transitions (FLIP)
             │
             ▼
      [RENDERED UI] ──► Deliver responsive, accessible, high-contrast interface
```

---

## 2. Dynamic Attention Scoring Engine

The Presentation Planner continuously evaluates the world state to determine the appropriate layout composition:

```typescript
export interface PresentationPlan {
  stageMode: 'dialogue' | 'spatial' | 'investigation' | 'strategy' | 'editor';
  focusedEntityId?: string;
  satelliteDrawerOpen: boolean;
  ambientVitalsVisible: boolean;
  suggestedActionChips: string[];
  toneAtmosphere: {
    accentColor: string;
    ambientSoundscape?: string;
    typographyPairing: string;
  };
}

export function planPresentation(
  worldState: WorldStateInstance,
  activeRole: InhabitedRoleSlot,
  userRecentAction?: string
): PresentationPlan {
  // Evaluates intent, active crises, co-present entities, and role permissions
  // to synthesize the optimal spatial composition.
}
```

---

## 3. Epistemic Perspective Lenses: Player vs. Host

```
+-----------------------------------------------------------------------------+
|                          SAME UNDERLYING SIMULATION                         |
+-----------------------------------------------------------------------------+
               │                                             │
               ▼                                             ▼
+-----------------------------+               +-------------------------------+
|     PLAYER PERSPECTIVE      |               |        HOST PERSPECTIVE       |
|                             |               |                               |
| • Strict First-Person View  |               | • Omniscient Canvas View      |
| • Fog-of-War Obfuscation    |               | • All Secrets & Agendas Shown |
| • Direct Conversational Feed|               | • Axiom & Physics Sliders     |
| • Local Inventory & Senses  |               | • Crisis Injection Matrix     |
| • High Emotional Immersion  |               | • Macro Graph Supervision     |
+-----------------------------+               +-------------------------------+
```

The user can toggle seamlessly between **Inhabitant** (experiencing the world directly) and **Director / Architect** (tuning the world mechanics), transforming the UI from an immersive narrative stage into an authoring workstation without losing state continuity.
