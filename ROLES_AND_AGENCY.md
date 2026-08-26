# ROLES AND AGENCY IN HEADCONAN

HeadConan does not treat the user as a fixed browser visitor. Instead, the user inhabits a **Role Slot** inside the world simulation.

A single world can be perceived and manipulated through fundamentally different lenses depending on the active role slot.

---

## 1. The Role Slot Model

```typescript
export interface RoleSlot {
  id: string;
  name: string;
  type: 'PLAYER' | 'DIRECTOR' | 'ARCHITECT' | 'OBSERVER';
  title: string;
  agency: 'character-level' | 'world-level' | 'system-level' | 'none';
  perspective: 'first-person' | 'third-person' | 'omniscient';
  knowledge: 'limited' | 'fog-of-war' | 'broad' | 'omniscient';
  permissions: RolePermission[];
  controlledEntityId?: string;
  controlledEntityName?: string;
  avatar?: string;
  description: string;
  suggestedPrompts: string[];
}
```

---

## 2. The Four Archetypal Roles

### 1. The Player (Character-Level Agency)
* **Agency**: Inhabits a specific person or office (e.g. *Supreme Archon*, *Senior Scholar Alex*, *Inspector Arthur Finch*).
* **Perspective**: First-person; subject to the world's physical and social constraints.
* **Knowledge**: Limited. Secret ministerial agendas or hidden clues remain concealed until discovered.
* **Interaction**: Dispatches in-universe actions, dialogues, investigations, or sovereign decrees.

### 2. The Director / Host (World-Level Agency)
* **Agency**: Orchestrates narrative tension, pacing, and emergent hazards from above.
* **Perspective**: Omniscient or broad third-person.
* **Knowledge**: Can see background faction plots and hidden evidence.
* **Interaction**: Spawns world events (e.g. *border skirmishes, blackouts*), leaks incriminating memos, and adjusts faction stances.

### 3. The Architect (System-Level Agency)
* **Agency**: Modifies the ontological laws and axioms of reality.
* **Perspective**: System-level / God's eye.
* **Permissions**: Rewriting physical constraints, adding new factions, or altering causality speeds.

### 4. The Observer (Zero Mutation Agency)
* **Agency**: Passive, omniscient observer.
* **Use Case**: Reviewing chronological retrospectives, reading lore documents, and analyzing multi-turn faction equilibria without mutating state.

---

## 3. Agency Shifting vs. Mode Switching

In traditional tools, switching from player to creator requires reloading the page or navigating to an administrative dashboard.

In **HeadConan**, shifting agency is instantaneous:
1. The user clicks the **Role Slot Pill** in the top World Frame.
2. The active Role Slot shifts (e.g., from *Inspector Finch* to *The Shadow Novelist*).
3. The **UI Director** re-evaluates the active Attention Budget and recomposes the World Canvas:
   - Revealing the **Director Console** and spawning tools.
   - Adjusting affordance chips in the bottom Interaction Dock.
4. No state is lost; causality remains persistent.
