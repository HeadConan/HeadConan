# HeadConan — Minimal Layout Grammar

> **Objective:** Define the smallest possible set of spatial primitives required to express any universe composition across all human storytelling genres.

---

## 1. The Five Spatial Primitives

```
+---------------------------------------------------------------------------------------+
|  [P1: ANCHOR]  Header, Chronometer, Role Indicator, Perspective Switcher               |
+---------------------------------------------------------------------------------------+
|                                                   |                                   |
|                                                   |  [P3: SATELLITE RAIL]             |
|  [P2: PRIMARY STAGE]                              |  Contextual Inspector / Dossier   |
|  • Dialogue Chamber                               |  • Linked Clues                   |
|  • Tactical Map                                   |  • Interpersonal Tension Meter    |
|  • Evidence Board                                 |  • Spatial Affordance List        |
|  • Macro Strategy Matrix                          |                                   |
|  • Host Ontological Editor                        +-----------------------------------+
|                                                   |  [P4: AMBIENT MONITOR]            |
|                                                   |  World Equilibrium / Vitals       |
+---------------------------------------------------+-----------------------------------+
|  [P5: DOCK]  Natural Language Input, Action Chips, Multimodal Attachment Trigger      |
+---------------------------------------------------------------------------------------+
```

---

## 2. Primitive Definitions & Specifications

### 1. `Anchor` (Fixed Persistent Navigation)
* **Role**: Provides continuous temporal and role orientation.
* **Contains**: World Title, Timeline Turn/Epoch, Active Inhabited Role, Lens Mode (Player vs Host), Global Modals (Atlas, Chronicle, Notes).
* **Location**: Top viewport edge (sticky).

### 2. `Stage` (The Primary Experiential Surface)
* **Role**: Where 70% of user interaction and cognitive processing occurs.
* **Morphologies**:
  - `Stage.Dialogue`: Two-speaker or multi-party conversation feed with emotive portrait markers.
  - `Stage.Spatial`: Zoomable 2D SVG or Canvas coordinate theater.
  - `Stage.Investigation`: Corkboard with pins, yarn links, and forensic specimen trays.
  - `Stage.Strategy`: Faction power tensor matrix and geopolitical ledger.
  - `Stage.Editor`: Axiom tree, crisis spawner, and ontological rule graph.

### 3. `SatelliteRail` (Secondary Contextual Inspector)
* **Role**: Dynamically inspects the entity, location, or clue actively selected in the Stage.
* **Behavior**: Expands when an entity is targeted; collapses or docks when focus returns to macro stage.

### 4. `AmbientMonitor` (Macro Environmental Vitals)
* **Role**: Subtly communicates macro pressure, public suspicion, resource stability, or tension gradients without demanding active user interaction.

### 5. `Dock` (Persistent Action & Agency Bar)
* **Role**: The universal command channel.
* **Contains**: Natural language prompt field, context-sensitive quick action chips, AI engine indicator, and voice/multimodal attachment triggers.

---

## 3. Composition Matrix

| Scenario Archetype | Primary Stage Mode | Satellite Rail Content | Ambient Monitor Focus | Dock Action Chips |
| :--- | :--- | :--- | :--- | :--- |
| **Social Conversation** | `Stage.Dialogue` | Selected Speaker Dossier & Subtext | Conversation Mood / Tension | Dialogue Replies, Social Probes |
| **Tactical Exploration** | `Stage.Spatial` | Location Details & Entities Present | Regional Danger Level | Travel, Reconnoiter, Secure Area |
| **Forensic Investigation** | `Stage.Investigation` | Clue Exhibit Details & Suspect Alibis | Case Solvability Gauge | Interrogate Suspect, Run Assay |
| **Geopolitical Strategy** | `Stage.Strategy` | Targeted Faction Diplomatic Ledger | Realm Stability / Debt Meter | Dispatch Envoy, Enact Sanctions |
| **World Host / Architect** | `Stage.Editor` | Ontology Graph & Entity Property Inspector | Simulation Invariant Health | Spawn Crisis, Mutate Axiom |
