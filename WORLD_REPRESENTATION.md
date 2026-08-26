# HeadConan World Representation Foundation

> **Foundational Mandate:** *"Describe what must be true for a world to behave like itself, not everything that can be said about it."*

---

## 1. Core Architectural Overview

The HeadConan World Representation Foundation provides a minimal, expressive, extensible, and mathematically coherent system for describing, reasoning about, instantiating, simulating, and eventually rendering any inhabited universe.

### The Four Pillars of Separation

```
+---------------------------------------------------------------------------------+
|                                 1. WORLD DEFINITION                             |
|       (Ontology, Axioms, Entities, Relationships, Norms, Power, Facts)          |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                                  2. WORLD STATE                                 |
|            (Clock, Dynamic Entity Snapshots, Live Relations, Epistemics)        |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                                 3. WORLD DYNAMICS                               |
|        (Actions, Preconditions, State Effects, Emergent Consequences)           |
+---------------------------------------------------------------------------------+
                                         |
                                         v
+---------------------------------------------------------------------------------+
|                               4. WORLD PRESENTATION                             |
|   (Experience Signals, Modality Recommendations, Epistemic Perspective Lens)    |
+---------------------------------------------------------------------------------+
```

---

## 2. Structural Separation of Concerns

### A. World Definition (What kind of world is this?)
- **Identity & Provenance**: Author canonical baseline, versioned schemas (`WorldVersion`).
- **Axioms**: Metaphysical laws, social contracts, institutional norms that govern what is invariant.
- **Ontology & Capabilities**: Recognizable categories of existence (Character, Agent, Organization, Location, Object, Resource, Concept).
- **Ground Truth Baseline**: Canonical characters, organizations, locations, artifacts, baseline relationships, and objective facts.
- **Social & Power Architecture**: Norms, sanctions, legal statutes, influence matrices.
- **Player Possibility Space**: Playable roles, agency boundaries, forbidden taboos.
- **Experience Profile**: Psychological registers, tension gradients, information density, presentation hints.

### B. World State (What is true right now?)
- **Temporal Clock**: Turn counters, in-universe date/time strings, elapsed simulation time.
- **Entity State Snapshots**: Live positions, activities, emotions, reputations, physical statuses, inventory.
- **Dynamic Relational State**: Live trust, affinity, power balances, and broken promise counts.
- **Epistemic State**: Who knows which facts, active secrets, rumors, and public disclosures.
- **Simulation Chronicle**: Log of events, crises, and milestones.

### C. World Dynamics (How does change happen?)
- **Action Preconditions**: Spatial co-presence, required capabilities, epistemic clearance, social permissions.
- **Direct State Effects**: Atomic mutations to entity attributes, inventory, relationships, or known facts.
- **Emergent Consequences**: Probabilistic secondary reactions, systemic backlash, and spawned world events.

### D. World Presentation (How does this feel to experience?)
- **Epistemic Projection**: Filtering reality through a specific observer lens (Character vs. Public vs. Cosmic Host).
- **Modality Signals**: Evidence boards, tactical maps, dialogue feeds, academic schedules, relationship graphs.
- **Tone & Tension Signals**: Preserving domain-specific pacing without hard-coding front-end React components inside the world definition.

---

## 3. The Information & Epistemic Model

A central breakthrough of HeadConan is the rigorous decoupling of knowledge:

$$\text{World Truth} \neq \text{Character Knowledge} \neq \text{Player Knowledge} \neq \text{Public Information}$$

### Visibility Scopes
1. `universal_public`: Common knowledge known to all citizens.
2. `domain_public`: Known to members of a profession, guild, or social stratum.
3. `restricted`: Known only to cleared organizations (e.g. SSS secret police, WISE intelligence).
4. `intimate`: Known only to a closed circle (e.g. family secret).
5. `singular_secret`: Known to exactly one individual.
6. `cosmic_truth`: Ground truth of the cosmos, currently discovered by nobody.

### Dramatic Irony & Secrets
Secrets are represented with explicit `holdingEntityIds`, `targetEntityIds`, `consequencesIfExposed`, and `exposureThreshold`.
The `EpistemicProjector` enables instantaneous comparison of asymmetries (e.g., comparing what Loid knows vs. what Yor knows vs. what Anya reads from their minds).

---

## 4. First-Class Relationship & Power Models

### Relational Dynamics
Relationships are living structural bonds defined with:
- **Source & Target** entities (directed or bidirectional).
- **Affinity**: Scale of $-100$ (Deadly Hatred) to $+100$ (Unconditional Devotion).
- **Trust**: Scale of $0$ (Complete Paranoia) to $100$ (Total Vulnerability).
- **Power Balance**: Scale of $-100$ to $+100$.
- **Visibility & Cover Stories**: Distinguishing genuine clandestine bonds from outward public masks (e.g. Forger marriage of convenience).

### Vectors of Power
Power is never a flat scalar. It is decomposed into distinct domains:
- `political`, `economic`, `military`, `informational`, `social`, `supernatural`, `forensic`.
Each power relation defines the concrete enforcement mechanism, punishment leverage, reward leverage, and dependency factors.

---

## 5. Player Possibility Space & Agency

The player is **not** simply an NPC with a player tag. The player inhabits a `RoleSlot` that defines:
- **Inhabitation Mode**: `canonical_character`, `original_character`, `archetypal_slot`, `directorial_host`, or `cosmic_architect`.
- **Agency Level**: `character_ground` (first-person constraints), `institutional_command`, `narrative_director`, or `ontological_architect`.
- **Epistemic Fog of War**: `strict_first_person`, `faction_wide`, or `omniscient_narrator`.
- **Prompt Directives & Constraints**: Specific boundary conditions that keep the character authentic to the world.

---

## 6. Benchmark Validation Worlds

The representation foundation is empirically validated across four diverse universe archetypes:

| Benchmark World | Setting Domain | Primary Stresses Tested |
| :--- | :--- | :--- |
| **SPY × FAMILY** | Cold War Clandestine / Domestic | Severe information asymmetry, fake family camouflage, hidden assassin/spy identities, telepathy. |
| **Game of Thrones** | Low-Fantasy Feudal Politics | Institutional succession, Great House leverage, crown debt, brutal consequence lethality, feudal norms. |
| **Sherlock Holmes** | Victorian Forensic Mystery | Pure empirical deduction, physical crime scene evidence, chemical assays, objective ground truth vs rumor. |
| **Modern University** | Contemporary Academic Lab | Non-fantastical ordinary life, grant competitions, tenure votes, authorship precedence, deadline pressure. |

---

## 7. Extensibility & Future Evolution

The architecture is built to support:
- **AI-Native Authoring**: LLMs can generate structured JSON definitions conforming to `WorldDefinition`.
- **Human Host Authoring**: Clean UI forms can inspect and configure definitions without touching TypeScript code.
- **Time Branching**: `TimelineBranch` and `ScenarioSeed` permit branching "what-if" forks from any turn snapshot.
