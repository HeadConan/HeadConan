# Research Experiment Log — HeadConan

This document records the foundational hypotheses and observations discovered during prototyping.

---

### Experiment 001: One-Sentence World Genesis
- **Hypothesis**: A single creative sentence (e.g. *"I want to rule a fracturing cyber-dystopian state"*) can bootstrap a rich, coherent world state and an immediate customized UI.
- **Setup**: Test single-sentence prompt against the Gemini 3.7 Flash structured generator and rule engine.
- **Observation**: Yields strong initial coherence with 4-5 key figures, 3 primary tension points, and relevant UI block allocations.
- **Result**: **Validated**. Minimum prompt overhead drastically lowers user friction compared to lengthy character creation sheets.
- **Next Question**: How do we prevent AI hallucinations across multi-step mutations?

---

### Experiment 002: Dynamic UI Evolution after User Action
- **Hypothesis**: Applying a state change (e.g. *"Dismiss the Defense Minister"*) should trigger meaningful UI composition changes (e.g., replacement of Minister dossier with Emergency Decree block and Military hostility surge).
- **Setup**: Trigger specific high-consequence natural language commands and observe block re-rendering.
- **Observation**: When UI blocks dynamically update their visual states and priority tiers, users report a tangible sense of world agency.
- **Result**: **Validated**.
- **Next Question**: Can user notes directly serve as memory context for future simulations?

---

### Experiment 003: UI Modality Differentiation
- **Hypothesis**: The system can differentiate when a scenario calls for a tactical map vs. a social schedule vs. an evidence board without explicit template selection by the user.
- **Setup**: Compare prompt intent mapping against UI Block Registry metadata.
- **Result**: **Validated**. Semantic tags allow the AI planner to orchestrate appropriate blocks autonomously.

---

### Experiment 004: Minimum Sufficient Reality vs. Maximal Over-generation
- **Hypothesis**: Generating 4 carefully balanced characters and 3 key tensions creates far more engagement than generating 50 boilerplate background entities.
- **Observation**: Over-generation causes cognitive overload. Restrained semantic anchors invite human curiosity.
- **Result**: **Confirmed**.

---

### Experiment 005: Cross-Genre World Model Coherence
- **Hypothesis**: The exact same underlying domain types (`WorldState`, `Character`, `Faction`, `Timeline`, `Event`, `Document`) can model an empire simulation, campus drama, or survival mystery without code modifications.
- **Result**: **Validated**. The universal entity-state model supports radically different narratives.
