# HeadConan — Product Vision & Positioning

> **Canonical positioning document.** This file is the source of truth for *what HeadConan is*.
> If any other document contradicts it, that document is drifting — fix it, not this file.
> Written 2026-08-29. Keep this file updated whenever the positioning changes.

---

## One-Line Definition

**EN:** HeadConan is a system for turning imagination into explorable, stateful, interactive worlds.

> 中文：HeadConan 是一个把人的想象转化为可进入、可行动、会持续变化的互动世界的系统。

**Internal tagline:** *HeadConan turns the worlds in your head into worlds you can enter.*

We deliberately do NOT say: "AI game", "AI NPC", "AI storytelling", "Generative UI", "World simulator". Each of those is too narrow — they describe *one expression* of HeadConan, not HeadConan.

---

## 1. The Problem (user view, not tech view)

If a world suddenly appears in my head — *"I want to experience being a ruler in The Man in the High Castle"* — today's tools fail:

| Tool | What it gives me | What's missing |
|------|------------------|----------------|
| ChatGPT | A conversation | The world never actually exists |
| Games | An already-built world | My imagination must conform to the designer's possibility space |
| Creation tools | I build it myself | Setup, maps, characters, UI, plot, logic — huge cost |

**What HeadConan does:**

```
I imagine a world
  → tell HeadConan
  → the world appears
  → I enter it
  → I act
  → the world responds with real consequences
  → the world keeps running on its own
```

It is not "AI helps you tell a story". It is **"AI helps you turn the world in your head into something you can enter."**

---

## 2. The Core Unit Is Experience — not Story

The most important internal conviction: the core unit is **not** Story, not UI, not Character, and not even World first.

It is **Experience** — not "UX", but:

> A person's *sustainable existence and action* inside one imagined world.

For example:

- SPY × FAMILY is a **World**.
- "Yor's secret is at risk" is a **Situation**.
- "You are Loid's new colleague" is a **Role**.
- But the HeadConan **Experience** is:

> I am here. These people exist. They know different things.
> I can do things. They react. The world remembers.
> Something can happen that I didn't author.

That is the product core.

---

## 3. Positioning: The Imagination Runtime

**HeadConan is an imagination runtime for interactive worlds.**

| Runtime | What it runs |
|---------|--------------|
| Unity | Games |
| Unreal | 3D worlds |
| Browser | Web |
| **HeadConan** | **Imagination → Interactive Reality** |

It is not responsible for "generating a web page", nor "generating a story". It is responsible for:

```
IMAGINATION → WORLD → SIMULATION → EXPERIENCE
```

---

## 4. What HeadConan Is NOT

### ≠ AI Game
AI Game = Game + AI (e.g., game + AI NPC). HeadConan is the inverse: **an AI-native world system that can produce game-like experience**. Games are one experience it can produce, not its body.

### ≠ AI Storyteller
AI Storyteller: `User → Story`. HeadConan: `User → World ← AI`.
The user is not "listening to a story". They **occupy a position in the world**. A story is just *the result of world state changing from their actions*.
Interactive-narrative research has long stressed this: true interactive narrative is not branching text; it is user action influencing a story that unfolds. Therefore:

> **Story is an emergent consequence, not a primary data structure.**

This has huge architectural implications (see §8 and ARCHITECTURE_ZERO).

### ≠ Generative UI
GenUI is one of HeadConan's *expressive capabilities*, not the product. The distinction:

```
Traditional:  World → Fixed UI
GenUI:        Intent → Generated UI
HeadConan:    Imagination → World → Situation → Perspective → Experience → Adaptive UI
```

> **UI is HeadConan's sensory organ for the world — not HeadConan's brain.**

Write this into the architecture principles.

---

## 5. What Makes HeadConan Unique: Three Pillars

Three things must hold **simultaneously**:

**① World** — not a background image. It has state, people, relationships, rules, history, time, secrets, causality.

**② Agency** — the user is not a tourist. The user can change the world.

**③ Perspective** — the most important layer. Different people see different worlds:
- Player: *I know X.*
- Yor: *Yor knows Y.*
- Host: *Host knows X + Y + Z.*

```
ONE WORLD → MULTIPLE MINDS → MULTIPLE EXPERIENCES
```

This is what produces real: secrets, deception, misunderstanding, dramatic irony, investigation, social dynamics.

---

## 6. The Core Formula

**World × Agency × Perspective**

not

**LLM × UI × NPC**

The latter is a tech stack. The former is the product essence.

---

## 7. Vision

**North Star (internal):** Make imagination executable.

> 让想象变得可执行。

**Public Vision:** A future where anything you can imagine can become a world you can enter.

Today, imagination → text / image / video is **representation** — it shows the mind's content. HeadConan's loop is **execution**:

```
imagine → world → act → feedback → change → keep imagining
```

---

## 8. Why the Name

- **Head** = imagination / mental world.
- **Conan** = a figure who enters a world, investigates, acts, and discovers truth.

> HeadConan turns the worlds in your head into worlds you can enter.

---

## 9. Three-Layer Positioning (use everywhere)

**Definition** (what it is): An imagination runtime for interactive worlds.

**Positioning** (where it sits): A platform between imagination, games, and generative interfaces, where AI turns imagined worlds into persistent, interactive experiences.

```
          IMAGINATION
               │
               ▼
        ┌─────────────┐
        │  HEADCONAN  │
        └─────────────┘
         │     │     │
         ▼     ▼     ▼
       GAME  STORY  UI
```

It can produce these, but equals none of them. Not a ChatGPT competitor, not a game-engine competitor.

**Vision** (furthest): *A future where anything you can imagine can become a world you can enter.* (public) / *Make imagination executable.* (North Star, internal)

---

## 10. What This Means for Architecture

If HeadConan is an Imagination Runtime, the architecture core is:

```
        HUMAN IMAGINATION
                │
                ▼
         WORLD DEFINITION
                │
                ▼
          WORLD RUNTIME
                │
      ┌─────────┼─────────┐
      ▼         ▼         ▼
  ENTITIES   RULES    HISTORY
      │         │         │
      └─────────┼─────────┘
                ▼
             STATE
                │
                ▼
          PERSPECTIVE
                │
                ▼
           EXPERIENCE
                │
                ▼
         GENERATIVE UI
                │
                ▼
              HUMAN
                │
                ▼
             ACTION
                │
                └──────────────┐
                               ▼
                              WORLD
```

A beautiful closed loop: **Imagine → Enter → Act → Change → Perceive → Imagine**. This may be HeadConan's *minimum universe*.

**Calibration requirement (applies to all existing concepts):** World / Event / Knowledge / Character / Scene / Layout must each answer: *which part of this loop does it serve?* If it serves none — delete it. See `ARCHITECTURE_ZERO/ARCHITECTURE.md` (the Architecture Zero convergence already encodes: story is derived, UI is derived, LLM is a proposal service, experience/perspective are projections).
