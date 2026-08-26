# Architectural Decision Record: HeadConan World Representation

This document records the foundational architectural decisions, rationale, trade-offs, and rejected alternatives for the HeadConan World Representation system.

---

## Decision 1: Strict Decoupling of Definition, State, Dynamics, and Presentation

### Context
Previous world schemas coupled presentation UI elements (such as `UIBlock` or `UIPlanning`), dynamic turn counters, and static world lore into a monolithic interface.

### Decision
Partition the representation into four distinct layers:
1. `WorldDefinition`: Immutable structural template of the world.
2. `WorldStateInstance`: Mutable snapshot of living reality at turn $T$.
3. `WorldDynamics`: Declarative preconditions, effects, and emergent consequences.
4. `WorldPresentation`: Abstract experience signals, tension curves, and epistemic perspective projection.

### Rationale
- Allows a single `WorldDefinition` to serve infinite independent simulation runs and timeline branches without state contamination.
- UI renderers can be swapped, redesigned, or ported across web, native, or VR without changing the underlying world simulation.

---

## Decision 2: Distinct Epistemic Models (Information Asymmetry)

### Context
Most simulation systems store facts as global world attributes or simple character knowledge arrays. This fails when simulating espionage, murder mysteries, court conspiracies, or everyday office politics where characters harbor misunderstandings, delusions, or deliberate cover stories.

### Decision
Introduce first-class `Fact`, `Belief`, `SecretItem`, and `RumorItem` primitives.
- Facts represent objective ontological reality.
- Beliefs represent subjective agent impressions (which may be inaccurate or fabricated).
- Secrets represent facts with targeted concealment boundaries and exposure triggers.
- The `projectEpistemicPerspective` function computes what an observer can see based on their role and situation.

### Rationale
- Enables authentic dramatic irony (e.g. Anya reading Loid and Yor's secrets while both parents remain in the dark).
- Enables forensic deduction where the ground truth is immutable, but the player and investigator must uncover clues to turn suspicions into verified facts.

---

## Decision 3: First-Class Structural Relationships & Multidimensional Power

### Context
Treating relationships as mere strings (e.g. `relationship: "rival"`) prevents simulation engines from computing shifts in trust, leverage, or dependency. Similarly, treating power as a scalar (e.g. `powerLevel: 9000`) fails in social situations where a wealthy merchant has economic power but zero feudal military power.

### Decision
- Relationships are distinct objects with `affinity`, `trust`, `powerBalance`, `visibility`, and `coverStory`.
- Power is modeled as asymmetric `PowerRelation` records categorized by domain (`political`, `economic`, `military`, `informational`, `social`, `supernatural`, `forensic`) with explicit leverage mechanisms.

### Rationale
- In *Game of Thrones*, House Lannister exercises economic power over the Crown via debt, while Ned Stark exercises institutional power via royal appointment. Modeling these as distinct vectors allows realistic political tensions without crude number crunching.

---

## Decision 4: Player Inhabitation Space vs. Autonomous Agents

### Context
Earlier systems treated the user either as an external godlike prompter or as an ordinary NPC with an "isPlayer" boolean.

### Decision
Define a dedicated `PlayerPossibilitySpace` with `InhabitedRoleSlot` configurations.
Each role slot specifies:
- Inhabitation Mode (`canonical_character`, `original_character`, `archetypal_slot`, `directorial_host`, `cosmic_architect`).
- Epistemic Fog of War (`strict_first_person`, `faction_wide`, `omniscient_narrator`).
- Agency Level (`character_ground` to `ontological_architect`).
- Explicit Prompt Directives and Taboo Actions.

### Rationale
- Inhabiting Sherlock Holmes requires strict forensic deduction and respect for Victorian evidence laws, whereas acting as a Host/Director requires high-level narrative steering. Explicit role contracts establish clear expectations for both human players and generative LLMs.

---

## Decision 5: Namespaced IDs and Explicit Provenance

### Context
Simple numeric or random IDs (`"1"`, `"uuid-123"`) obscure entity lineage and make scenario branching prone to collisions. Lack of provenance makes it impossible to distinguish canonical lore from AI hallucinations or player overrides.

### Decision
- Use namespaced IDs: `char:loid_forger`, `loc:221b_baker_street`, `fact:cersei_children_bastards`.
- Attach `ProvenanceMeta` to entities, facts, and axioms (`authored`, `ai_inferred`, `simulated_mutation`, `player_directive`).

### Rationale
- Makes world representations human-readable and inspectable in JSON/YAML.
- Ensures AI simulation engines can prioritize authored ground truth over transient generated rumors.
