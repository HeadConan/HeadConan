# World Scorecard & Evaluation Framework

## 1. Overview & Evaluation Philosophy

The **HeadConan World Scorecard** evaluates candidate worlds across 15 rigorous analytical dimensions. The framework rejects superficial metric inflation; a high score on one axis (*e.g., Cultural Familiarity*) does not imply high interactive viability (*e.g., Player Agency*).

Each dimension is defined by its concrete mechanical meaning in a generative runtime environment, paired with qualitative scoring criteria.

---

## 2. Dimension Definitions & Rubrics

### Dimension 1: Cultural Familiarity & Shared Mental Models (0–100)
- **What it measures**: How readily a new user grasps the rules, aesthetic vocabulary, and stakes of the world without reading an instruction manual.
- **Rubric**:
  - `90–100`: Universal cultural knowledge (*Sherlock Holmes, Rome, Hogwarts, Modern University*). Users know the factions and tropes within 3 seconds.
  - `70–89`: Mainstream pop culture literacy (*Cyberpunk, Game of Thrones, SPY × FAMILY, NASA Apollo*).
  - `40–69`: Established enthusiast/cult literacy (*Disco Elysium, Dune, Steins;Gate, Three-Body Problem*).
  - `<40`: Deeply abstract or niche conceptual worlds (*Library of Babel, Panopticon, Mnemosyne Market*).

### Dimension 2: Player Agency & Freedom of Will (1–5)
- **What it measures**: The degree to which user decisions can genuinely redirect the state machine and steer events without breaking ontological coherence.
- **Rubric**:
  - `5`: Open sandbox causality. User can switch roles, betray factions, establish new institutions, or alter history (*Ancient Rome, The Sims, Silicon Valley Startup, Fallout*).
  - `4`: High structural agency within institutional constraints (*Hogwarts, Disco Elysium, Cyberpunk*).
  - `3`: Bounded scenario agency; strong thematic guardrails (*SPY × FAMILY, Sherlock Holmes*).
  - `2`: Narrow linear corridor; choices primarily flavor text (*Scripted action movies*).
  - `1`: Passive spectator; user actions feel artificial (*Cinematic rollercoasters*).

### Dimension 3: Social Richness & Character Density (1–5)
- **What it measures**: The depth of the multi-agent social web—competing loyalties, hidden agendas, gossip networks, and emotional resonance.
- **Rubric**:
  - `5`: Deep web of overlapping social commitments, private secrets, and asymmetric goals (*SPY × FAMILY, Succession, Heian Court, Elite University*).
  - `3`: Moderate social interaction centered around key quest-givers or rivals (*Outer Wilds, Cyberpunk*).
  - `1`: Solitary, desolate, or environmental survival with minimal dialogue (*Cast Away, Solo Space Probe*).

### Dimension 4: Systemic Simulation Depth & Rule Consistency (1–5)
- **What it measures**: How cleanly the world translates into explicit state variables, mathematical meters, economic levers, or systemic feedback loops.
- **Rubric**:
  - `5`: Deep mathematical or rule-based models (*Startup Burn-rate & Cap Table, Papers Please Bureaucracy, Roman Senate Vote Thresholds, Stardew Economy*).
  - `3`: Mixed qualitative and quantitative systems (*Hogwarts House Points, Westeros Military Supplies*).
  - `1`: Pure narrative hand-waving with no consistent physical or social law.

### Dimension 5: Incomplete Information & Mystery Atmosphere (1–5)
- **What it measures**: The presence of hidden variables, concealed alibis, masked identities, or unmapped territory that rewards deductive reasoning.
- **Rubric**:
  - `5`: Primary gameplay driver is uncovering concealed ground truth (*Sherlock Holmes, Death Note, Severance, Outer Wilds*).
  - `3`: Secrets exist as background flavor or side quests (*Star Wars, Ancient Rome*).
  - `1`: Total information transparency from turn zero.

### Dimension 6: Generative UI Adaptability (1–5)
- **What it measures**: How powerfully the world's thematic essence can be expressed through dedicated, specialized UI controls (*e.g., Evidence Boards, Flight Slates, Kitchen Rails, Senate Tallies*) rather than a generic text box.
- **Rubric**:
  - `5`: Demands unique bespoke interface artifacts (*Sherlock Evidence Board, Apollo Flight Slate, Michelin Expediter Rail, Startup Cap Table*).
  - `4`: Rich standard dashboard affordances (*Political Faction Matrix, Campus Timetable, Spellbook*).
  - `2`: Standard chat interface sufficient with minimal graphical assistance.

### Dimension 7: World Divergence & Counterfactual Elasticity (1–5)
- **What it measures**: The ability of the world to generate wildly divergent "What If?" branches without losing structural plausibility.
- **Rubric**:
  - `5`: Designed for timeline bifurcation (*Steins;Gate, Roman Republic, Succession, Three Kingdoms*).
  - `3`: Moderately flexible within established geographic bounds (*Cyberpunk, Hogwarts*).
  - `1`: Extremely fragile canon; altering one event collapses the entire world logic.

### Dimension 8: Replayability Across Alternative Roles (1–5)
- **What it measures**: How completely the user experience transforms when switching roles (*e.g., Emperor vs. Tribune vs. Gladiator; Student vs. Professor vs. Auror*).
- **Rubric**:
  - `5`: Multi-lens parity. Playing as an opposing faction offers a 100% distinct game loop (*Game of Thrones, Hogwarts, Silicon Valley, SPY × FAMILY*).
  - `3`: Alternate roles offer secondary perspectives with shared core tasks.
  - `1`: Only one valid protagonist perspective exists.

---

## 3. Qualitative Portfolio Tiers

To avoid treating raw arithmetic averages as truth, worlds are grouped into four qualitative strategic tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: GOLDEN LAUNCH CANDIDATES (High Familiarity × High Inhabitability)   │
│ Worlds where user mental models are razor-sharp AND generative agency is    │
│ exceptionally high. These form the primary demo and showcase catalog.       │
│ Examples: Hogwarts, Victorian Sherlock, SPY × FAMILY, Rome, Modern Campus   │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 2: SYSTEMIC & SHOWCASE BENCHMARKS (High Agency × Cult Depth)          │
│ Worlds that demonstrate HeadConan's most advanced simulation and Generative │
│ UI capabilities for power users and design thought-leaders.                 │
│ Examples: Disco Elysium, Outer Wilds, Papers Please, Silicon Valley 1999    │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 3: RIGID CANON TRAPS (High Fame × Low Emergent Agency)                 │
│ Famous IPs that look attractive on paper but frequently disappoint in AI    │
│ runtimes due to scripted hero storylines and passive combat loops.          │
│ Examples: MCU Avengers, Star Wars Trench Run, Lord of the Rings Fellowship  │
├─────────────────────────────────────────────────────────────────────────────┤
│ TIER 4: EXPERIMENTAL FRONTIER (Philosophical & Avant-Garde)                 │
│ High-concept thought experiments testing the outer boundaries of LLM state  │
│ machines and ontological transformation.                                     │
│ Examples: Library of Babel, Mnemosyne Memory Market, Panopticon Colony      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Uncertainty & Calibration Guidelines

When assessing candidate worlds, evaluators must record **Epistemic Uncertainty Flags**:
- `[CONFIDENCE: HIGH]`: Tested extensively in LLM prompt benchmarks and interactive text prototypes.
- `[CONFIDENCE: MEDIUM]`: Systemic rules are clear, but multi-agent LLM memory consistency requires verification.
- `[CONFIDENCE: LOW / SPECULATIVE]`: Highly experimental mechanics (*e.g., simulating real-time audio latency in Apollo Mission Control or high-dimensional geometry in Library of Babel*).
