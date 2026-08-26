# HEADCONAN WORLD MODEL

The world model in HeadConan represents the persistent, objective state of an imagined universe, completely decoupled from visual representation.

---

## 1. Domain Schema

```typescript
export interface WorldState {
  id: string;
  name: string;
  genre: string;
  premise: string;
  atmosphere: string;
  currentSituation: string;

  // Roles System
  roles: RoleSlot[];
  activeRoleId: string;

  // Domain Entities
  characters: Character[];
  locations: WorldLocation[];
  factions: Faction[];
  events: WorldEvent[];
  timeline: TimelineEvent[];
  stats: StatMetric[];
  documents: WorldDocument[];
  relationships?: Relationship[];
  clues?: ClueItem[];
  rules?: RuleAxiom[];
  notes: UserNote[];

  // World Interface Grammar Constitution
  style: WorldStyle;

  createdAt: string;
  turnCount: number;
}
```

---

## 2. Key Entities

1. **RoleSlot**: Defines the lenses through which the user interacts with the world (Player, Director, Architect, Observer).
2. **ClueItem**: Forensic or investigative leads with categories (`physical`, `testimony`, `documentary`, `environmental`), status (`unsolved`, `connected`, `refuted`), and relational thread linkages.
3. **RuleAxiom**: Ontological constraints governing physics, communication latency, and social law.
4. **Faction**: Political, military, or social blocs with influence meters and stance indicators (`hostile`, `suspicious`, `neutral`, `supportive`, `allied`).
5. **Character**: Agents with loyalty, secret agendas, and alibis.
