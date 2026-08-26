# HeadConan — Layout Principles & Attention Theory

---

## 1. The Four Attention Tiers

In any living simulation, human working memory can only comfortably hold **4 ± 1 items** at a single instant (Cowan's Law of Working Memory Capacity). Every screen composition must adhere to the **HeadConan Attention Model**:

```
+-----------------------------------------------------------------------------------+
|  1. PRIMARY FOCUS (60-70% of Viewport)                                            |
|     • The immediate conversation, tactical battle, forensic clue, or axiom editor |
+-----------------------------------------------------------------------------------+
|  2. SECONDARY CONTEXT (20-30% of Viewport)                                        |
|     • Entities directly talking, nearby map nodes, active suspect alibis          |
+-----------------------------------------------------------------------------------+
|  3. BACKGROUND / AMBIENT (5-10% of Viewport)                                      |
|     • Macro vitals, in-universe clock, world equilibrium meters                   |
+-----------------------------------------------------------------------------------+
|  4. HIDDEN (0% of Viewport — On-Demand)                                            |
|     • Deep historical archives, distant geographical zones, secret axioms         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Layout Principles

### Principle 1: Dominant Focal Hierarchy
Every layout composition must have exactly **one unambiguous visual centerpiece** (the Primary Stage). Two equal-sized containers competing for primary attention is a structural bug.

### Principle 2: Progressive Contextual Disclosure
Secondary context must only appear when summoned by primary focus:
- Selecting an NPC opens their dossier and relationship web.
- Selecting a crime scene pin opens forensic exhibits found at that coordinate.
- Selecting nothing relaxes the context rail into an ambient activity summary.

### Principle 3: Spatial Constancy of Anchors
The user must never feel lost. While the central Stage dynamically morphs between modes, the Header (temporal orientation) and the Action Dock (agency invocation) must remain strictly stationary.

### Principle 4: Epistemic Horizon Respect
The layout must physically enforce what the active role is permitted to perceive:
- A player character in a dark alley sees only local sensory dialogue and immediate inventory.
- An omniscient host sees global graph threads, secret intentions, and hidden faction motives.

### Principle 5: Multimodal Appropriateness
Never use text when a diagram communicates faster; never use a diagram when a single sentence captures the emotional nuance better. Match representation directly to semantic category.
