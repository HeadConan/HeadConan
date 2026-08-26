# The 4 Benchmark Worlds & Product Hypotheses

## 1. Purpose of the Benchmark Suite

In software engineering, benchmarks evaluate compiler speed or database throughput. In **HeadConan**, benchmarks evaluate **fundamental capabilities of the Generative World Runtime**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HEADCONAN BENCHMARK QUADRANT                          │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ BENCHMARK A: SOCIAL WORLD    │ BENCHMARK B: POLITICAL WORLD                 │
│ World: SPY × FAMILY          │ World: Game of Thrones / Ancient Rome        │
│ Capability: Multi-Agent      │ Capability: Faction Balance, Asymmetric      │
│             Hidden Goals &   │             Power & Cascading Policy         │
│             Social Masking   │             Consequences                     │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ BENCHMARK C: EXPLORATION     │ BENCHMARK D: MYSTERY WORLD                   │
│ World: Outer Wilds Loop      │ World: Victorian Sherlock London             │
│ Capability: Spatial Wonder,  │ Capability: Incomplete Information, Evidence │
│             Physics & Rules, │             Graph & Deductive Inference      │
│             Time & Causality │             Gameplay                         │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

These four benchmarks test distinct LLM cognitive operations and Generative UI architectures.

---

## 2. Benchmark A: Social World — Multi-Agent Concealment & Social Camouflage

### Primary Case: SPY × FAMILY (Berlint 1960s)
*Alternative / Complementary Case: Modern Elite University*

### 1. Capability Under Test
- **Multi-Agent Asymmetric Knowledge**: Can the runtime maintain separate cognitive models for multiple characters who each have secret identities, private agendas, and distinct partial views of the truth?
- **Subtext & Social Camouflage**: Can the AI simulate conversations where what is *said aloud* contradicts what is *intended*, with conversational tension tracked in UI meters?

### 2. Product Hypothesis
> **Hypothesis A**:
> *"HeadConan can generate an emotionally compelling, high-tension social world where characters maintain secret agendas, interpret user actions through their private biases, and react dynamically to changes in domestic and public suspicion without breaking character coherence."*

### 3. Concrete Experimental Scenario
- **The Setup**: You are Twilight (Loid Forger), having dinner at home with Yor (secret assassin) and Anya (telepathic child), while hosting a surprise visit from Yuri Briar (State Security Service secret police officer and Yor's brother).
- **The Test**: The user must steer dinner conversation to distract Yuri from noticing blood on Yor's sleeve or wiretapping equipment in Loid's briefcase, while Anya's telepathic reactions create chaotic conversational shifts.

### 4. Evaluation Metrics & Success vs. Failure Criteria

| Metric | Target | Failure Mode (AI Slop / Hallucination) |
| :--- | :--- | :--- |
| **Epistemic Isolation** | Yuri never references Loid's spy identity unless clues are explicitly uncovered. | Yuri casually blurts out *"Since you are a WISE agent, Loid..."* despite having zero proof. |
| **Conversational Subtext** | Dialogue contains dual-layered meaning (diplomacy vs. suspicion). | NPCs recite flat exposition or immediately fight with weapons. |
| **State Machine Linkage** | Slips of the tongue increase Yuri's `Suspicion Meter` on the UI. | UI meters remain static regardless of conversation tone. |

---

## 3. Benchmark B: Political World — Institutional Factions & Cascading Statecraft

### Primary Case: Game of Thrones (Westeros / War of the Five Kings)
*Alternative / Complementary Case: Ancient Rome (Late Republic 63 BCE)*

### 1. Capability Under Test
- **Multi-Faction Asymmetric Statecraft**: Can the runtime maintain 5+ competing institutions (houses, guilds, senate factions) whose relationships, military leverage, and economic resources adjust dynamically to user decrees?
- **Cascading Unintended Consequences**: When the user executes a policy (e.g., executing a prisoner or debasing currency), does the simulation trigger second- and third-order ripple effects across the realm?

### 2. Product Hypothesis
> **Hypothesis B**:
> *"HeadConan can maintain a persistent political simulation where macro decrees alter multi-faction power balances, economic resources, and military stances, producing emergent diplomatic crises rather than scripted narrative dead-ends."*

### 3. Concrete Experimental Scenario
- **The Setup**: You are Lord Regent in King's Landing. The treasury is bankrupt, the Iron Bank of Braavos demands immediate loan repayment, food riots erupt in Flea Bottom, and House Tyrell threatens to halt grain shipments if their vassal is not granted a seat on the Small Council.
- **The Test**: The user issues three executive orders: (1) Seize church gold from the High Septon, (2) Offer a royal marriage pact to House Tyrell, and (3) Execute an Iron Bank envoy for insolence.

### 4. Evaluation Metrics & Success vs. Failure Criteria

| Metric | Target | Failure Mode |
| :--- | :--- | :--- |
| **Institutional Memory** | The Iron Bank immediately retaliates by funding the player's northern rival. | The Iron Bank forgets the execution on the next turn. |
| **Economic Continuity** | Seizing church gold resolves short-term cash flow but spikes Faith Militant unrest from 20% to 85%. | Gold increases without any religious or social backlash. |
| **UI Faction Visualization** | Faction stance icons transition from `Neutral` → `Hostile` on the SVG Realm Map. | Map and stat meters fail to update in sync with narrative output. |

---

## 4. Benchmark C: Exploration World — Spatial Wonder, Physics & Causality

### Primary Case: Outer Wilds (The 22-Minute Solar Loop)
*Alternative / Complementary Case: Deep Space Research Colony / Elden Ring*

### 1. Capability Under Test
- **Systemic Environmental Rules & Physical Causality**: Can the runtime enforce ontological physical laws (quantum entanglement rules, sand flowing between hour-glass twins, orbital trajectories, time loop countdowns) without developer hand-coding?
- **Epistemic Progression**: Progression driven purely by what the *player learns*, not by artificial arbitrary XP gates.

### 2. Product Hypothesis
> **Hypothesis C**:
> *"HeadConan can simulate a geographically and physically coherent world where environmental rules remain constant, exploration is driven by user curiosity, and discovered lore directly unlocks solutions to physical environmental puzzles."*

### 3. Concrete Experimental Scenario
- **The Setup**: You land your probe on the Quantum Moon. Looking at the moon's shrine while blinking or looking away causes the moon to change planetary orbits.
- **The Test**: The user takes a picture of the quantum shrine with their Scout Camera to lock its quantum state in place before walking inside.

### 4. Evaluation Metrics & Success vs. Failure Criteria

| Metric | Target | Failure Mode |
| :--- | :--- | :--- |
| **Rule Axiom Persistence** | Quantum rule (*"Observing a quantum object locks its position"*) is upheld consistently across all turns. | The AI forgets the rule and moves the shrine even while the camera is focused on it. |
| **Spatial Graph Integrity** | Navigating from Brittle Hollow to Giant's Deep adheres to planetary orbital coordinates. | Travel destinations teleport randomly with no spatial relationship. |
| **Interactive Ship Log** | UI Knowledge-Web connects discovered Nomai runes to planetary coordinates. | UI displays generic quest checklists with checkboxes. |

---

## 5. Benchmark D: Mystery World — Forensic Deduction & Incomplete Information

### Primary Case: Victorian Sherlock London (Baker Street 1895)
*Alternative / Complementary Case: Death Note Tokyo / Severance Lumon*

### 1. Capability Under Test
- **Incomplete Information & Forensic Consistency**: Can the runtime generate a crime or conspiracy with a single, immutable ground truth, and distribute subtle, partial clues across scenes without giving away the solution prematurely?
- **Deductive Hypothesis Testing**: Can the user formulate theories, link evidence nodes on a board, refute false alibis, and confront suspects using deductive logic?

### 2. Product Hypothesis
> **Hypothesis D**:
> *"HeadConan can maintain a sealed ground truth for complex mysteries, allowing users to discover clues incrementally, connect evidence nodes on an interactive pinboard, and deduce perpetrators through valid inference rather than forced scripted reveals."*

### 3. Concrete Experimental Scenario
- **The Setup**: Lord Harrington is found poisoned in his locked study. Three suspects were present: the estranged nephew with gambling debts, the personal physician who prepared his medicine, and the French diplomat who arrived unannounced.
- **The Test**: The user discovers mud on the windowsill, an empty vial in the garden, and an encoded train timetable in the coat pocket. The user must link these clues on the Evidence Board to deduce who entered the room from the garden before confronting the suspect.

### 4. Evaluation Metrics & Success vs. Failure Criteria

| Metric | Target | Failure Mode |
| :--- | :--- | :--- |
| **Ground Truth Invariance** | The murderer's identity is locked at genesis and does not change mid-investigation to fit user guesses. | The AI opportunistically changes the killer to whoever the user suspects first. |
| **Clue Consistency** | Physical details (mud composition, poison chemical properties) remain consistent across multiple interrogations. | Clue descriptions mutate contradictions turn-to-turn. |
| **Evidence Board Affordance** | UI Pinboard allows dragging yarn connections between `[Muddy Bootprint]` and `[Garden Window]`. | User is forced to type everything into chat with no visual deduction aids. |
