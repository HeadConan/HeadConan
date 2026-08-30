# HeadConan Positioning

## Status

**Foundational positioning document.**

This document defines what HeadConan is, what problem it is trying to solve, and the architectural principles that should guide future changes.

When an existing document, implementation, feature, or architectural decision conflicts with this document, the conflict should be explicitly examined.

This document does not define the complete architecture.

It defines the direction against which the architecture should be judged.

> Canonical placement: this file is the **authoritative product positioning**. `docs/VISION.md` carries the brand-level vision and language. `docs/ARCHITECTURE_ZERO/` carries the architecture. If any of them conflict with this file, this file wins.

---

# 1. What is HeadConan?

HeadConan is an **AI-native imagined world engine**.

It allows a user to enter, inhabit, interact with, and influence an imagined world.

The world may come from:

* an existing fictional universe
* an original world created by a human
* an AI-assisted world
* a hybrid of canonical and original material

However, HeadConan is not primarily a worldbuilding tool.

It is not a wiki.

It is not a chatbot.

It is not a visual novel.

It is not a traditional RPG engine.

Its central goal is to create the feeling that:

> **The world exists beyond the current response.**

The user should feel that characters remember things, information is unevenly distributed, actions have consequences, and events continue to matter after the current interaction ends.

---

# 2. The Core Product Promise

The central promise of HeadConan is not:

> "You can talk to fictional characters."

It is:

> **"You can enter a world that can understand what you do, interpret what it means, and continue to exist after you do it."**

A successful HeadConan experience should create moments such as:

> "Wait, this character remembered that."

> "I didn't know they knew that."

> "That decision actually changed something."

> "I thought nobody noticed."

> "I did that earlier, and now it came back."

These moments are more important than feature count, visual complexity, world size, or architectural sophistication.

---

# 3. The Fundamental Problem

Traditional software systems are good at controlling predefined possibilities.

Traditional game engines are good at simulating explicitly designed rules.

LLMs are good at interpreting open-ended human behavior, language, social context, ambiguity, and meaning.

HeadConan requires both.

A user should be able to do something unexpected:

> "I deliberately mention something I should not know and watch the character's reaction."

The system should not require a predefined action called:

```text
test_secret()
```

Instead, it must be able to reason about:

* what the user actually did
* what the action means in context
* who noticed
* what different entities infer
* what may change as a result

This cannot be fully predefined.

Therefore, HeadConan should not be designed as a traditional Runtime with an LLM attached to it.

---

# 4. Core Architectural Position

HeadConan is:

# **LLM-first, State-grounded, Constraint-bounded.**

These three principles define the intended balance of power.

---

## 4.1 LLM-first

The LLM is the primary system responsible for interpreting an open-ended world.

It may reason about:

* what an action means
* what likely happened
* social implications
* character interpretation
* possible consequences
* emotional reactions
* implicit meaning
* ambiguous behavior
* new events that emerge from interaction

The LLM is not merely a response generator.

It is part of the world's **interpretive intelligence**.

The system should not attempt to enumerate all possible human actions, social behaviors, or semantic relationships through deterministic code.

The world must remain open to unexpected interaction.

---

## 4.2 State-grounded

The world cannot exist only inside the LLM's context window.

Important things that become true must be represented and remembered.

The system requires persistent continuity for things such as:

* entities
* relationships
* established facts
* important events
* knowledge changes
* consequences
* current circumstances

The exact representation may evolve.

The principle should not.

> **The world must be able to remember what has become true.**

State is not intended to simulate every atom of reality.

State exists to preserve the continuity required for experience.

---

## 4.3 Constraint-bounded

The LLM should have broad freedom to interpret the world.

It should not have unrestricted authority to rewrite established reality.

A proposed change should be checked against the world's current commitments.

Examples include:

* contradictions with established facts
* impossible actions
* violations of explicit world rules
* knowledge appearing without a plausible path
* entities acting outside their available circumstances

The purpose of constraints is not to predict the world.

The purpose of constraints is to prevent the world from forgetting itself.

Therefore:

> **Constraints should preserve continuity, not replace intelligence.**

---

# 5. The Distribution of Authority

HeadConan should distinguish between two forms of authority.

## Interpretive Authority

The authority to answer:

> **What does this mean?**

This should primarily belong to the LLM.

For example:

* Is the user threatening Yor?
* Is the user joking?
* Did a character notice an implication?
* Does this conversation create suspicion?
* Is a character likely to interpret something as evidence?

These questions are contextual, semantic, and often ambiguous.

They should not be reduced prematurely to hardcoded rules.

---

## Ontological Authority

The authority to answer:

> **What officially becomes true in this world?**

This belongs to the world system.

The LLM may propose:

```text
Yor becomes suspicious of the player.
```

The world system determines whether this can be committed, based on the existing world and its constraints.

The LLM may imagine the next possible reality.

The world determines whether to remember it.

---

# 6. The Fundamental Loop

The core HeadConan loop should be understood as:

```text
USER ACTION
     ↓
WORLD CONTEXT
     ↓
AI INTERPRETATION

What happened?
What does it mean?
Who is affected?
What may change?

     ↓
PROPOSED REALITY

events
state changes
knowledge changes
observations
possible consequences

     ↓
WORLD COMMIT

consistency
constraints
continuity
persistence

     ↓
COMMITTED WORLD

     ↓
EXPERIENCE

What does the user perceive now?
```

The important idea is:

> **Interpretation is a first-class stage between action and state change.**

HeadConan should not be reduced to:

```text
Action → Response
```

Nor should it be reduced to:

```text
Action → Hardcoded State Transition
```

The intended model is:

```text
Action
→ Interpretation
→ Proposed Reality
→ Commitment
→ Experience
```

---

# 7. What the Runtime Is and Is Not

The Runtime should not be treated as the brain of the world.

It should not attempt to determine every consequence through deterministic logic.

The Runtime exists primarily to provide:

* persistence
* continuity
* validation
* constraints
* event history
* state transitions
* replayability where useful
* reliable world memory

The Runtime should answer questions such as:

> "Can this proposed change coexist with what is already true?"

It should not attempt to answer every question such as:

> "What does this socially ambiguous human action mean?"

The first question is primarily structural.

The second is primarily interpretive.

HeadConan should use the right system for each.

---

# 8. What Counts as Reality?

Not everything generated by an LLM should become part of the world.

HeadConan should distinguish between:

```text
GENERATED POSSIBILITY
```

and:

```text
COMMITTED REALITY
```

For example:

An LLM may infer that:

```text
Loid suspects the player may know something unusual.
```

This is initially a proposed interpretation.

Once accepted and committed, it may become part of the world's evolving reality.

This distinction allows the system to remain imaginative without allowing every generated sentence to mutate the world.

---

# 9. The World Is Not a Static Database

A HeadConan world should not be understood as:

```text
Characters
Locations
Lore
Rules
```

stored as a large encyclopedia.

Those things may exist.

But they are not the product experience by themselves.

A useful world is one in which information can participate in future interactions.

A character description matters if it affects how the character behaves.

A secret matters if different entities know different things.

A historical event matters if it can influence present interpretation.

A rule matters if it can constrain possible reality.

Therefore:

> **World information should exist because it can participate in experience.**

Not merely because it is interesting to store.

---

# 10. The World Should Have Depth, Not Just Volume

HeadConan should prefer:

```text
3 characters
1 meaningful secret
1 location
5 persistent events
```

over:

```text
500 characters
200 locations
10,000 disconnected facts
```

The goal is not encyclopedic completeness.

The goal is causal and experiential depth.

A small world that remembers, reacts, hides, and changes is more valuable than a massive world that only describes itself.

---

# 11. The Importance of Perspective

Different entities should not necessarily experience the same world.

There may be an underlying committed reality.

But each participant may possess a different:

* knowledge state
* belief
* observation history
* interpretation
* uncertainty
* perspective

This is essential for:

* secrets
* discovery
* misunderstanding
* deception
* investigation
* dramatic irony
* social interaction

The user should not simply query the world.

The user should occupy a position inside it.

---

# 12. The Product Is Not a Story Generator

HeadConan should not assume a predetermined narrative.

The system may generate narrative.

But narrative is an expression of world evolution, not necessarily the underlying control structure.

The user is not choosing branches from a predefined story tree.

Instead:

```text
World
+
Current Reality
+
User Action
+
Entity Interpretation
+
Emerging Consequences
```

may produce events that were not explicitly designed in advance.

The goal is not infinite randomness.

It is:

> **Emergent continuity.**

---

# 13. The Product Is Not a Chatbot With Memory

A chatbot primarily maintains a conversation.

HeadConan must maintain a world.

The distinction is critical.

A conversation remembers:

```text
What was said.
```

A world remembers:

```text
What happened.

What changed.

Who knows.

Who believes.

What may matter later.
```

The interface may sometimes look conversational.

The underlying system should not be designed around conversation alone.

---

# 14. Design Principle: Experience Before Architecture

Every proposed abstraction should answer:

> **What concrete user experience requires this?**

If the answer is unclear:

> Do not build it yet.

HeadConan should avoid:

* universal schemas
* speculative infrastructure
* abstractions for hypothetical worlds
* complete simulation systems
* exhaustive ontologies
* large multi-agent architectures without demonstrated need

The preferred sequence is:

```text
Desired Experience
        ↓
Concrete Experiment
        ↓
Observed Failure
        ↓
Identify Missing Capability
        ↓
Add Minimum Structure
        ↓
Repeat
```

Not:

```text
Imagine Every Future
        ↓
Design Universal Architecture
        ↓
Build Infrastructure
        ↓
Hope Experience Fits
```

---

# 15. The Primary Evaluation Question

Every feature, model, API, subsystem, or architectural change should eventually be evaluated against one question:

> **Does this make the user more likely to feel that they have entered a world that exists beyond the current AI response?**

If yes, investigate it.

If not, treat it as suspicious.

---

# 16. The HeadConan Thesis

The core thesis of HeadConan is:

> **LLMs are capable of interpreting the meaning of open-ended human interaction in ways that traditional software cannot fully predefine.**

But:

> **Interpretation alone does not create a world.**

A world requires continuity.

Something must preserve what has become true.

Something must prevent established reality from being casually overwritten.

Therefore, the HeadConan hypothesis is:

> **An imagined world can be created by combining open-ended AI interpretation with persistent state and minimal continuity constraints.**

The architecture should maximize the first without sacrificing the second.

---

# 17. The Simplest Description

If HeadConan had to be described in one sentence:

> **HeadConan is an AI-native system for entering imagined worlds that can interpret what you do, remember what happened, and let the consequences continue.**

---

# 18. The Short Architectural Thesis

```text
LLM imagines and interprets.

The world remembers.

Constraints preserve continuity.

The user experiences the result.
```

Or:

> **The LLM imagines the next possible reality.
> The world decides whether to remember it.**

---

# 19. Non-Goals

At the current stage, HeadConan is not trying to build:

* a universal simulation engine
* a complete AGI society
* a full autonomous NPC civilization
* a general-purpose game engine
* a perfect worldbuilding ontology
* an encyclopedia for every fictional universe
* an infinitely scalable multi-agent system

Those may become relevant later.

They are not requirements for proving the core experience.

The immediate objective is much smaller:

> **Create one experience where a user genuinely feels that the world understood what they did, remembered it, and allowed it to matter later.**

Everything else must earn its place.

---

## Appendix A — Explicit conflict check against existing docs

This section records the explicit examination required by the Status block. Evaluated 2026-08-30.

| Existing document | Relationship | Notes |
|-------------------|--------------|-------|
| `docs/VISION.md` (product vision) | **Compatible — complementary** | VISION = brand/vision layer ("imagination runtime for interactive worlds", "World × Agency × Perspective", "Make imagination executable"). This file = authoritative definition ("AI-native imagined world engine"). World × Agency × Perspective maps 1:1 to §11 (perspective), §1-3 (world), §2 (agency/consequences). No conflict. |
| `docs/ARCHITECTURE_ZERO/ARCHITECTURE.md` | **Compatible — confirms** | "LLM proposes, kernel commits" (ADR-008) == Interpretive vs Ontological authority (§5). Pipeline in §13 includes interpretation as a step; this file upgrades it to a *first-class stage* (Action → Interpretation → Proposed Reality → Commitment → Experience) — aligned, wording strengthened. |
| `docs/WORLD_MODEL_PHASE1.md` (minimal model) | **Compatible — confirms** | 5-concept model (Definition/Instance/Fact/Event/Projection) is the *state-grounded + constraint-bounded* spine; Projection = §11 perspective enforcement; Event = committed-reality record (§8). |
| `docs/adr/ADR-001..010` | **Compatible** | No principle-level conflicts found. |
| Root `README.md` | **Updated** | Definition line updated to "AI-native imagined world engine"; canonical link now points here. |
| `site/` (public demo) | **Compatible** | Marketing copy already claims no more than a deterministic demo; positioning does not require site changes. |

**Net result:** no conflicts requiring architecture reversal. Two upgrades applied: (1) README definition; (2) ARCHITECTURE.md §13 pipeline wording to make interpretation first-class.
