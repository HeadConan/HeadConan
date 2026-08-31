# HeadConan — Scene Presentation & Experience Design: Research Report

> **Purpose.** Reduce uncertainty about how HeadConan should decide how a given situation is presented. This is research, not a design proposal. Hypotheses are labelled as hypotheses; where evidence is absent, that is stated rather than papered over.
>
> **Method.** Cross-disciplinary literature review (game UX, cognitive science, HCI, film/theatre, interactive fiction, generative UI) plus six deep system case studies and a twelve-situation stress test. All claims are labelled FACT / INFERENCE / SPECULATION with stated confidence. Where a primary source could not be inspected, this is recorded.
>
> **Date:** 2026-08-31 · **Status:** pre-decision research · **Next action:** §9

---

## Contents

| § | Section | What it settles |
| :-- | :--- | :--- |
| **1** | Executive Summary | The problem, the evidence, the open questions |
| **2** | The Problem Space | A precise formulation, and eight false assumptions currently encoded in the design |
| **3** | Cross-Disciplinary Findings | Game UX · Cognitive Science · HCI · Theatre/Film · Interactive Narrative · Generative UI |
| **4** | Comparative Case Studies | Six systems, deeply analysed: Outer Wilds · Obra Dinn · Inform 7 · Versu · A2UI · CHI research systems |
| **4A** | The Critical Conceptual Investigation | Which of the brief's six categories survive; which are derived; four that are missing |
| **5** | The 10 Situation Stress Test | Twelve situations; which are actually hard and why; six recurring dimensions |
| **6** | The Transition Problem | Eight mechanisms compared; a conditional policy keyed to *what changed* |
| **7** | Candidate Design Hypotheses | Six hypotheses, each with what would falsify it and the smallest test |
| **8** | What HeadConan Should Not Do | Eleven seductive ideas, rejected on stated evidence |
| **9** | Recommended Next Experiment | A static, AI-free harness — and a ten-minute test to run first |

---

## 1. Executive Summary

### The actual problem

HeadConan must present an unbounded variety of situations without either collapsing them into one generic dashboard or hand-building a page type per scene. That framing, however, hides the real difficulty.

The problem is a **function-design problem**: find `f(context) → presentation` satisfying four constraints — bounded implementation, perceptible variety, continuity of orientation, and no per-situation authoring. **The genuine tension is not between the two failure modes; it is between variety and continuity.** Failure Mode A is what happens when continuity wins absolutely; Failure Mode B is what happens when variety is pursued by brute force instead of by composition. The existing HeadConan documents optimise almost exclusively for variety.

Two further confusions compound it. First, **selection** (what should the user attend to?) and **rendering** (how should it be depicted?) are separate problems with separate evidence bases, and they are currently mixed. Second, the brief's candidate categories contain three that are **derived rather than chosen** — "interaction" and "information form" are both entailed by things HeadConan already models — and **omit four that are necessary**: frame, participation, persistence, and tempo.

### What existing disciplines already know

**Games** provide two things. First, a boundary distinction HeadConan lacks and needs: whether an element is *inside the fiction* or *about the world*. A letter you hold is inside; an evidence corkboard is not. Second — and more important — Fagerholt & Lorentzon's *Beyond the HUD* (Chalmers, 2009) proposes presentation as a function of **six continuous factors** rather than a choice from a list. That shape **structurally avoids both failure modes**: differing factor values entail differing presentation (no universal dashboard), and continuous composition needs no extending list (no infinite page types). It is the closest pre-existing answer to the central question that this research found — and it is the same shape as the `(focus, frame)` proposal in §4A. *(Note: the popular four-quadrant "diegetic / spatial / meta / non-diegetic" version of this work misrepresents the original; see Finding A1 for the correction.)* Separately, eye-tracking evidence indicates peripheral interface content is attended far less than designers assume — roughly 88% of fixations fell in the near-centre screen region while HUD regions drew about 2% — which supports bounding the periphery at 3–4 slots.

**Interactive fiction** provides the strongest precedent, and it is the field the existing documents consult least. **Inform 7's scenes have no type at all** — they are cued by conditions, carry entry and exit rulebooks, and change the *world*, not the presentation. Meanwhile Nick Montfort identifies the separation of *what happened* from *how it is told* as IF's central unfinished project — **which HeadConan's four-layer architecture already solves.** HeadConan is ahead of IF on structure and behind on the fourth layer.

**Cognitive science** supports a small working-memory capacity but the famous "four" is contested, and — critically — **cognitive load cannot be measured online**, so any load-adaptive design is unimplementable today. Endsley's three-level situation-awareness model yields one concrete, non-obvious requirement: a high-stakes decision needs a *projection* affordance and a *narrowed* field, not a dramatic new screen.

**HCI** delivers the most uncomfortable finding. Adaptive interfaces help in **routine** situations and degrade performance in **unfamiliar** ones (Lavie & Meyer, 2010); users often prefer customisable to adaptive menus (Findlater & McGrenere, CHI 2004); and mode errors are reduced most effectively when the **user** maintains the mode rather than the system (Sellen et al., 1992). HeadConan is a perpetually non-routine environment that currently plans a system-maintained, auto-morphing layout.

**Generative UI** has already answered "what should AI decide": **A2UI**, an Apache-2.0 protocol from Google, has agents emit declarative component selections from a closed catalogue while the client renders natively. The agent does not decide layout. Both CHI 2025 and CHI 2026 research systems independently converged on a **semantic intermediate layer** between intent and rendering. But every demonstrated case is a disposable, task-shaped artifact — **no evaluated generative-UI system addresses sustained, cumulative experience**, which is HeadConan's actual requirement.

**Film** offers mise-en-scène as the vocabulary for staging attention without instruction — and a hard limit: continuity editing hides the cut because the *audience ceded frame control to the filmmaker*. In an interactive system the *user* holds the frame, so **an invisible transition is a mode error, not elegance.**

### What HeadConan should pay attention to

1. **Focus must be a *(target, aspect)* pair.** A target alone cannot distinguish a character's *words* from their *knowledge* from their *connections*. This is the single most load-bearing correction to the current model.
2. **Build the frame.** Six of twelve stress situations require it. The frame is what persists across focus changes, carrying place, participants, tempo, and pending items — and it is the mechanism that makes Situations 2 and 10 work at all.
3. **Add participation.** Goffman's ratified-participant / bystander / overhearer / eavesdropper distinction is precise, cheap, and absent from every HeadConan document. It determines the verb set almost entirely.
4. **Do not type scenes.** The hardest situations are precisely those where **nothing about the situation changed while the presentation had to** — which no situation taxonomy can express.
5. **Make the override primary, not optional.** Every automatic reconfiguration is a system-maintained mode. Letting the user pin a composition is the intervention the experimental literature supports.
6. **Extend the epistemic projector into the presentation layer.** Outer Wilds' designers worked hard to ensure the ship log "doesn't tell you anything you technically don't know." HeadConan filters state but not summaries or hints.

### What remains genuinely unsolved

- **Whether users want system-initiated transitions at all.** The adaptive-UI evidence does not cover narrative worlds; the generalisation is inference.
- **Whether dramatic salience can be computed.** When the user has no goal, something must drive selection, and neither bottom-up nor top-down salience covers "this matters because it is a secret."
- **Whether variety comes from structure or composition.** This report argues composition. That is the hypothesis most worth trying to falsify.
- **Whether the six dimensions suffice** beyond the twelve situations tested.
- **Nothing examined handles a null focus or a participation dimension.** No system surveyed provides a complete precedent for HeadConan's problem.

### Recommendation

Do not build the layout engine, the planner, or any AI integration yet. Run two things: first, a **ten-minute logging test** of the focus-to-frame change ratio; then, if it holds, a **static, AI-free A/B harness** across six scenarios. Both are described in §9. Every possible outcome changes the plan — including the outcome that saves the most work.
## 2. The Problem Space

### 2.1 Defining the problem without assuming a solution

Strip away the interface vocabulary and the problem is a **function-design problem**:

> Find a function `f` such that
> `f(context) → presentation`
> where `f` must simultaneously satisfy four constraints that pull against each other:

| # | Constraint | What it demands | What it forbids |
| :-- | :--- | :--- | :--- |
| **C1** | **Bounded implementation** | The machinery behind `f` must be finite and maintainable | A new hand-built surface for every new situation (Failure Mode B) |
| **C2** | **Perceptible variety** | Different situations must *feel* different | One universal arrangement (Failure Mode A) |
| **C3** | **Continuity of orientation** | The user must always be able to answer "where am I, who is present, what was I doing" | Any transformation so total that the user loses their place |
| **C4** | **Non-authorship** | Novel situations must be presentable without a human hand-writing a new surface | Per-situation or per-world bespoke screens |

**The central tension is C2 versus C3, not A versus B.** The framing in the brief presents Failure Mode A and Failure Mode B as two poles of one axis. They are not. Distinctiveness (C2) and continuity (C3) are the genuine opposing forces: every increase in presentational distinctiveness costs some continuity of orientation, and vice versa. Failure Mode A is what happens when continuity wins absolutely. Failure Mode B is what happens when distinctiveness is pursued by brute force instead of by composition.

This reframing matters because **the existing HeadConan documents optimise almost exclusively for C2.** `LAYOUT_RESEARCH.md` asks "what should be dynamically composed?" and answers with an extensive list; `SCENE_MODEL.md` enumerates six scene types; the layout grammar defines five stage morphologies. Comparatively little attention is paid to C3 — what must *not* change — beyond three spatial anchors (header, dock, stage centrality). Section 6 of this report argues that the anchors currently specified are necessary but not sufficient.

### 2.2 A second decomposition: selection versus rendering

The brief's candidate category list (`WORLD STATE / USER GOAL / ATTENTION / INTERACTION / INFORMATION FORM / PRESENTATION`) mixes two problems that have **different evidence bases and different failure modes**:

| Problem | Question | Discipline with real evidence | Failure looks like |
| :--- | :--- | :--- | :--- |
| **Selection** | *What* should the user attend to right now? | Cognitive science, HCI relevance modelling, situational awareness | Important things hidden; trivia promoted |
| **Rendering** | *How* should that thing be depicted? | Visual design, game UX, information visualisation, film staging | Correct focus, unreadable or flat depiction |

Conflating them produces a characteristic bug: a system that correctly identifies that the user should be thinking about a letter, then renders it as a dashboard card, and concludes the architecture is wrong. The architecture may be right; the renderer is wrong. Conversely, a system with beautiful renderers and no selection mechanism produces the universal dashboard — every surface equally lit, no hierarchy.

**Recommendation for the research framing: evaluate selection and rendering separately.** Most of the genuinely transferable evidence from cognitive science (Section 3B) bears on selection. Most of the transferable evidence from game UX and film (Sections 3A, 3D) bears on rendering. They are only weakly coupled.

### 2.3 False assumptions currently present in our thinking

The following are stated as assumptions the team currently holds, with the evidence against each. Several are already *encoded in the codebase and design documents*, which makes them expensive to unlearn later — flagging them now is the highest-value output of this section.

---

#### FALSE ASSUMPTION 1 — "There is a decidable mapping from situation to presentation."

There may be no such function. The mapping is at minimum:

```
presentation = f(situation, world_presentational_grammar, epistemic_lens)
```

The same situation — "the user is handed a letter" — should render differently in a Victorian forensic mystery (a physical exhibit to be assayed) than in a Cold War domestic espionage world (a concealed object, risky to be seen holding). The situation is identical; the presentation must differ. HeadConan already intuits this: `WORLD_INTERFACE_GRAMMAR.md` and the `WorldStyle` construct exist precisely to carry this second argument.

**The error is not the omission — it is the ordering.** `WorldStyle` is currently a *theming* layer (tokens, typography, density, surface-type preference). The evidence in Section 3 suggests it should be an *argument to the selection function*, not a skin applied afterwards. A world's grammar determines not only how things look but **what counts as salient in it** — in a forensic world, physical evidence outranks testimony; in a court-intrigue world, the reverse.

> **Confidence: High.** This follows directly from HeadConan's own four benchmark worlds as specified in `WORLD_REPRESENTATION.md`, which differ in exactly this way.

---

#### FALSE ASSUMPTION 2 — "Focus is a single, atomic value."

The current `PresentationPlan` carries `focusedEntityId?: string` — a single entity reference. This is insufficient, and the insufficiency is demonstrable within a single entity:

| Focal target | Aspect A | Aspect B | Aspect C |
| :--- | :--- | :--- | :--- |
| One character | What they are **saying** (dialogue) | What they **know and intend** (dossier) | Who they are **connected to** (relationship graph) |
| One location | Its **layout** (map) | Its **history** (timeline) | Who is **in it** (roster) |
| One document | Its **text** (reader) | Its **provenance** (chain of custody) | Its **implications** (linked entities) |

Same target, three different presentations. A focus model that names only the target cannot distinguish them, so the decision gets pushed somewhere else — typically into a scene-type enum, which is how we arrive at Failure Mode B.

**Focus is at least a pair: `(target, aspect)`.** Section 4 argues this is the single most load-bearing correction to the current model.

> **Confidence: High** that target alone is insufficient. **Medium** that `aspect` is best modelled as a discrete field rather than derived from the triggering action — see Hypothesis H2.

---

#### FALSE ASSUMPTION 3 — "The system should decide, automatically."

The adaptive-interface literature is genuinely mixed, and the specific pattern of the results is unfavourable to HeadConan's current design:

- **Findlater & McGrenere (CHI 2004)** compared static, adaptable, and adaptive split menus and found users generally *preferred* customisable to adaptive versions, with adaptive menus no faster than either alternative.
- **Lavie & Meyer (2010, Int. J. Human-Computer Studies)** found that in **familiar, routine** situations a fully adaptive system was beneficial — but that in **unfamiliar situations to which the system was not adjusted, cognitive workload increased substantially and performance degraded.**
- **Gajos, Wobbrock & Weld** found that *accuracy* of adaptation mattered more than *predictability* for satisfaction, but that predictability reduced visual search time — i.e. there is no free lunch, and the two properties trade off.

HeadConan is, by construction, a **perpetually non-routine environment.** The user is always in a world they have not mastered, doing something they have not done before. This is precisely the regime in which Lavie & Meyer report adaptation *hurting*.

This does not mean "do not adapt." It means the current `PresentationPlanner` design — automatic morphing driven by a scored focus function — sits in the empirically riskiest quadrant, and **the mitigations that the literature supports (user override, predictability, intermediate adaptivity) are not yet specified.** `OPEN_UX_QUESTIONS.md` Q1 identifies the "Sticky Layout Lock" as a hypothesis to test; the literature suggests this is not an optional nicety but the primary risk control.

> **Confidence: High** that the evidence is mixed. **Medium-High** that it generalises from in-vehicle telematics and menus to imagined-world presentation — this is an inference by analogy, flagged as such. **This is the single most important empirical uncertainty in the current design and the strongest candidate for the recommended experiment (Section 9).**

---

#### FALSE ASSUMPTION 4 — "A weighted linear score can determine focus."

`LAYOUT_RESEARCH.md` specifies:

$$\text{FocusScore}(S) = w_1 \cdot \text{UserIntent}(S) + w_2 \cdot \text{ActivityWeight}(S) + w_3 \cdot \text{SimulationUrgency}(S) + w_4 \cdot \text{RoleAffordance}(S)$$

There is nothing wrong with a scoring function as an implementation choice. The problem is **epistemic**: there is no ground truth against which these four weights have been fitted, no evidence that the four terms are the right ones, no evidence that they are additive rather than interacting, and no stated procedure for falsification. As written the formula is **unfalsifiable** — any failure can be absorbed by re-tuning weights.

This is not a criticism of the engineers; it is the normal state of a first-pass design. But it should be recorded plainly: **the focus function is currently an unvalidated speculation, not a finding.** Nothing in the research surveyed for this report supports any particular weighting, and the cognitive-science literature on salience suggests the underlying model is wrong in a specific way — human attention is better modelled as *biased competition* between representations than as a linear utility sum, and it is strongly driven by bottom-up factors (motion, contrast, sudden onset) that a purely semantic scorer does not see at all.

> **Confidence: High** that the weights are unvalidated (self-evident from the documents). **Medium** that the additive form is structurally wrong; see Section 3B.

---

#### FALSE ASSUMPTION 5 — "A situation needs a type."

The strongest available precedent against this comes from interactive fiction. **Inform 7** — the most mature world-model narrative system in existence — has a native `scene` construct (`Writing with Inform`, §10.2–10.3). Its properties are worth stating precisely, because they are almost the opposite of `sceneType`:

- A scene is declared by name and is **cued by a condition**: `Train Stop begins when the player is in the Station for the third turn.`
- A scene **never has a type.** There is no `sceneType` field. There is no taxonomy.
- A scene carries **two rulebooks — entry effects and exit effects** (`When Train Stop begins: ...` / `When Train Stop ends: ...`).
- A scene is **temporal and scoped**, not categorical; there is always a built-in `Entire Game` scene containing all others.
- Scenes are **composable and chainable**: `Brief Encounter begins when Train Stop ends.`
- Inform's own documentation warns of the characteristic authoring bug: a scene with a beginning condition but **no ending condition never ends** ("never ends" is a first-class warning symbol in the Scenes index).

The Inform 7 design says: **a scene is a span of time with entry and exit effects, not a category of screen.** That is a materially different abstraction from the six-member `sceneType` enum in `SCENE_MODEL.md`, and it has survived decades of production use in the most demanding narrative-authoring community in existence.

> **Confidence: High** on the description of Inform 7's model (verified against the primary documentation). **Medium** on the claim that HeadConan should adopt it verbatim — Inform 7's scenes are author-cued, whereas HeadConan's must be inferred at runtime. See Section 4.

---

#### FALSE ASSUMPTION 6 — "We have one taxonomy problem." (We have two overlapping taxonomies.)

This is a concrete finding about the **current state of the codebase**, not a theoretical risk. Two parallel enumerations already exist:

| Source | Enumeration | Members |
| :--- | :--- | :--- |
| `SCENE_MODEL.md` §2 | `sceneType` (6) | `conversation`, `exploration`, `investigation`, `everyday`, `political`, `world_editing` |
| `LAYOUT_GRAMMAR.md` §2 / `PRESENTATION_MODEL.md` | `stageMode` (5) | `dialogue`, `spatial`, `investigation`, `strategy`, `editor` |

They **do not align**:

- `everyday` (a scene) has **no corresponding stage mode.** The diffuse, ambient, no-strong-focus situation is unrepresented in the rendering layer.
- `political` (a scene) maps to `strategy` (a stage) — a rename, not a distinction.
- `conversation` ↔ `dialogue` — a rename.
- `investigation` appears in both under the same name.
- `world_editing` ↔ `editor` — a rename.

So six scene types collapse to roughly **four distinct stage modes plus one unhandled case.** The two enums are not carrying independent information; they are two partially-redundant views of the same underlying distinction, and the mismatch is where bugs will live.

**More importantly: the existence of both is a symptom.** The team reached for a *situation* taxonomy and a *surface* taxonomy because it had not yet separated them. `SCENE_MODEL.md` §3 concedes the coupling explicitly: "Focus decides the scene, the scene decides the layout." That sentence is the assumption under test in this entire report.

> **Confidence: High.** Directly verifiable from the repository documents.

---

#### FALSE ASSUMPTION 7 — "Distinct presentations are the deliverable."

Users do not want distinct presentations. They want experiences that are **legible, absorbing, and not boring**, and they want to not get lost. Distinct presentation is one instrument for achieving that; continuity is another; and continuity is the one that is currently under-specified.

There is a well-established result from HCI on why this matters: **mode errors.** Norman's analysis of mode errors, and Sellen, Kurtenbach & Buxton's experimental work (*Human-Computer Interaction*, 7(2), 1992), demonstrated that mode errors are reduced most effectively when the **user maintains the mode state** rather than the system — and that user-maintained (non-latching, "quasi-mode") states outperform system-maintained ones on both error rate and cognitive load. Raskin's position in *The Humane Interface* is more extreme but points the same way: modes are "a significant source of errors, confusion, unnecessary restrictions, and complexity."

A system that silently reconfigures its own layout is a system in a **system-maintained mode**. Every automatic morph is a potential mode error with no user-maintained state to protect against it.

> **Confidence: High** on the mode-error literature. **Medium** on the strength of the analogy from text-editor modes to presentational modes — the stakes are lower in HeadConan, but the mechanism is the same.

---

#### FALSE ASSUMPTION 8 — "The hard cases are the exotic ones."

The ten stress situations in the brief are not equally hard. Sorting them by difficulty produces a counter-intuitive result, developed in full in Section 5:

- **Easy**: private conversation (1), navigating (4), reading a document (5), managing a group (8). These have clear single foci and well-established renderings.
- **Hard**: noticing an object *during* a conversation (2), a character entering unexpectedly (3), observing without participating (6), casual social immersion (9), sudden focus change (10).

The hard cases are hard for one shared reason: **they are cases where the situation does not change but the presentation must, or where two things are simultaneously true.** Situation 2 is not a new situation — it is the *same* conversation with a second object of attention. Situation 9 is not a situation at all — it is the absence of a focus. Situation 3 changes the *participation structure* while leaving the topic intact.

**A taxonomy of situations cannot express any of these, because nothing about the situation changed.** This is the sharpest available argument against scene-type-based architecture, and it is developed in Section 5.

> **Confidence: High.** This follows from analysis of the situations themselves and does not depend on external evidence.

---

### 2.4 What the problem is *not*

For scope control, three problems are adjacent but out of scope, and should not be allowed to contaminate the design:

1. **Not** "how do we make beautiful interfaces." Visual craft is necessary but is a rendering-layer concern (Section 3A, 3D), separable from the selection problem.
2. **Not** "how do we make the AI smarter about narrative." World simulation quality (`WORLD_REPRESENTATION.md` layers 1–3) is upstream and largely solved in the current architecture.
3. **Not** "how do we let the LLM generate UI." That is a specific and largely separate question, addressed in Section 3F, and already deferred by `DO_NOT_BUILD_YET.md` item 15 and ADR-12. This report finds no evidence that would reverse that deferral.

### 2.5 Restating the question

The brief asks: *how should the system determine how a particular situation should be presented?*

The research suggests the question is better posed as three:

> **Q1 (Selection).** Given a world state, an epistemic lens, a participation structure, and a user's recent actions — what is the object of attention, and which *aspect* of it is live?
>
> **Q2 (Rendering).** Given a focal (target, aspect) pair — which of a small bounded set of surfaces represents it best?
>
> **Q3 (Transition).** Given a change in any of the above — what is the minimum change to the presentation that preserves the user's orientation?

Q1 and Q2 are the two halves of the pipeline already sketched in `PRESENTATION_MODEL.md`. **Q3 is under-specified in every current document and is, on the evidence assembled here, where the design will actually fail or succeed.** Section 6 is devoted to it.
## 3. Cross-Disciplinary Findings

### 3.0 Reading conventions

Every finding is labelled:

- **FACT** — directly supported by a primary source inspected during this research.
- **INFERENCE** — a reasoned conclusion from two or more established facts.
- **SPECULATION** — plausible, but not established by evidence assembled here.

Confidence is stated per finding. Where evidence is contested, the contestation is reported rather than smoothed over. **This report's most useful negative contribution may be the items marked *unknown* or *contested*.**

---

### 3.A Game Design & Game UX

---

#### Finding A1 — *(CORRECTED)* The widely-cited four-quadrant taxonomy misrepresents its own source

> **Erratum.** An earlier draft of this section reproduced the popular four-quadrant account from secondary sources. The **primary thesis was subsequently retrieved and extracted in full**, and the popular account is wrong in three specific ways. The correction is recorded here rather than silently applied, because the error is widespread and because the primary source turns out to be **more useful, not less.**

**Evidence / source.** Fagerholt & Lorentzon, *Beyond the HUD: User Interfaces for Increased Player Immersion in FPS Games* (master's thesis, Chalmers University, 2009) — full text retrieved and extracted during this research. Widely-reproduced secondary accounts consulted include [Game UI Design: A Complete Guide](https://www.uichallenges.design/guides/game-ui-design), [Game UI Design Patterns](http://www.gamedesign.gg/articles/game-ui-design-patterns) and [MonoGame documentation](https://docs.monogame.net/articles/tutorials/building_2d_games/19_user_interface_fundamentals).

**What the secondary literature gets wrong — three corrections:**

1. **The authors explicitly abandoned *diegesis* as an axis.** Their stated reason: *"diegesis proved to be a slightly ambiguous concept."* The actual axes are **fiction × spatiality**. The popular version keeps "diegetic" as a label while quietly using a different construct than the authors did.
2. **There are six categories, not four.** In addition to the four commonly cited, the thesis defines **meta-perception** — perceptual compensation delivered cross-modally (substituting another sense for an unavailable one) — and **signifiers**, a subtype of the diegetic category in which the representation is *separated from its referent*.
3. **Secondary sources systematically conflate two different constructs.** Meta-perception (perceptual substitution) is routinely confused with meta-representation (a fictional effect rendered as screen treatment). They are not the same thing, and the confusion is present even in published textbooks.

**Why this matters beyond accuracy.** The popular four-quadrant version is a **discrete taxonomy** — the very shape that produces Failure Mode B. The primary source is not: see Finding A5, which is the more valuable transfer.

**Relevance to HeadConan.** The underlying insight survives the correction and is still needed, because HeadConan's content straddles the fiction boundary constantly:

- A **letter you are holding** is inside the fiction — your character has it.
- An **evidence corkboard** is outside it — Sherlock does not own a corkboard; it is a reasoning surface *about* the world.
- A **relationship graph** is outside; a **conversation** is inside.

Both are legitimate. The failure mode is **unwitting mixing** — presenting an in-fiction object inside an about-the-world frame, or vice versa, without deciding to. HeadConan's `WorldStyle` is the natural home for this decision, and recording the axis is nearly free.

**Terminology note.** Two widely-used practitioner terms — *"attention budget"* and *"one screen, one question"* — could not be traced to any authoritative source in the game literature surveyed. The term the primary thesis actually uses is **"information on demand."** HeadConan's own `attentionBudget` field (in `WORLD_INTERFACE_GRAMMAR.md`) is a local coinage and is fine as such, but it should not be cited to external authority.

**Confidence: High** on the correction (primary text extracted). **Medium** on the transfer to a text-and-imagination medium (**INFERENCE** — the thesis concerns 3D action games).

---

#### Finding A2 — The amount of interface should track the tightness of the perception-action loop, not the genre

**Evidence / source.** The same practitioner corpus, which converges on a consistent rule: non-diegetic overlays for anything read *during* aiming, driving or dodging; diegetic treatment for low-urgency or atmospheric information; and — the general form — **"start with the player's question, then choose the display that answers it fastest."** The frame is put bluntly in the design literature: the quadrant you choose is a decision about what the player must *decide* with this information, not about aesthetics.

**What it actually means.** UI recedes when the world itself supplies the feedback the user needs, and UI dominates when the user is operating **on a system** rather than **in a world**.

**Relevance to HeadConan.** This yields a principled — rather than conventional — rule for "how much interface," which the current documents leave to genre:

| Situation | User is… | Interface should… |
| :--- | :--- | :--- |
| S1 conversation | *in* a world, talking to a person | Recede |
| S4 navigation | *in* a world, moving | Recede; spatial, minimal |
| S5 reading a document | focused on one object | Narrow sharply |
| S8 commanding a group | operating **on a system** | Dominate — this is legitimate |
| S9 casual social life | ambient | Nearly absent |

Note that S8 is the one case where a heavy interface is *correct*, and the reason is ontological (the focal object is an aggregate with state variables) rather than conventional. This independently corroborates the S8 analysis in §5.

**Confidence: Medium-High.** The underlying principle is well-attested in practitioner literature; the application table is **INFERENCE**.

---

#### Finding A3 — Peripheral interface content is attended far less than designers assume

**Evidence / source.** Eye-tracking study of first-person shooter play ([Maynooth University, ECMS 2005](https://eprints.maynoothuniversity.ie/282/1/Paper04_ECMS_2005.pdf)): approximately **88% of fixations fell within the near-centre region** of the screen (inner 400×300 of an 800×600 display), accounting for 86% of fixation time. The regions containing **health, message and score information received only about 2% of all fixations** — and a single participant contributed 53% of even those. Corroborating: Caroux et al. (2015, *Int. J. Human-Computer Studies*, [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1071581915001779)) found that HUD effects on player experience depend on **composition and spatial organisation** rather than on information quantity, and vary with player expertise and genre.

**What it actually means.** Designers systematically overestimate how much peripheral interface content is read. Adding a sixth peripheral panel adds far less information than it adds code.

**Caveats, stated plainly.** This is a **single small study** in one genre (FPS, twelve datasets), from 2005. FPS play has an unusually strong central fixation point (the crosshair), which inflates the effect. Do not treat "2%" as a universal constant — treat the *direction* as established: peripheral content is under-attended.

**Relevance to HeadConan.** This is the strongest available evidence for **invariant I3** (one stage, periphery bounded at roughly 3–4 slots). The bound is not an aesthetic preference; it is where the evidence points. It also argues against solving the presentation problem by adding surfaces.

**Confidence: Moderate** on the magnitude, **Medium-High** on the direction. **FACT** as to the study's contents; **INFERENCE** as to generalisation.

---

#### Finding A4 — The bounded verb set is a mature, transferable interaction pattern

**Evidence / source.** The interactive-fiction and adventure-game tradition: a fixed set of verbs applied to anything in the scene. Described in the IF literature as the core of the parser contract, and independently present in point-and-click adventure games ("a set of verbs down the bottom of the screen… applied to anything in the scene" — [What is Interactive Fiction?](https://games.brettwitty.net/ifcourse/essays/what-is-if)).

**What it actually means.** Interaction is expressed as `verb × object`, with a small closed verb set and an open object set. The verb set is derived from what is present and what the actor may do — it is **not** a property of the situation type.

**Relevance to HeadConan.** `WORLD_INTERFACE_GRAMMAR.md` already implements an interaction grammar (world-specific command verbs and placeholder prompts). This is correct and should be protected. The one correction from §4: the verb set should be **derived** from `(focal target, participation status, role capabilities, action preconditions)` — and `WORLD_REPRESENTATION.md`'s `WorldDynamics` layer already defines preconditions and capabilities, so the machinery exists.

**Confidence: High.**

---

#### Finding A5 — The thesis's real contribution is a six-factor *continuous* model that structurally avoids both failure modes

**Evidence / source.** The same primary thesis (Fagerholt & Lorentzon, 2009), full text extracted. Beyond the categorical scheme, the thesis proposes **six continuous factors** that together determine presentation strategy:

| Factor | What it measures |
| :--- | :--- |
| **Competition** | How much the interface must compete with the world for attention |
| **Fictional plausibility** | How credibly the element could exist inside the fiction |
| **Spatial interaction fidelity** | How faithfully interaction maps onto space |
| **Navigation importance** | How much the element matters for getting around |
| **Rule transparency** | How visible the game's rules must be |
| **Sensory intensity** | How strong the sensory channel is |

**What it actually means.** Presentation is a **function of six continuous variables**, not a choice from a discrete list. Different factor values produce different presentations as a consequence.

**Why this is the most important transferable finding in the game-design literature surveyed.**

> **A continuous-factor model structurally avoids both of HeadConan's failure modes.**
>
> - **Against Failure Mode A** (universal dashboard): if the factor values differ, the presentation *necessarily* differs. Variety is entailed by the model, not bolted on.
> - **Against Failure Mode B** (infinite page types): the factors are **continuous and compositional**, not discrete and enumerable. There is no list to extend, so there is nothing to maintain and nothing that grows without bound.

This is the closest thing this research found to a **direct, pre-existing answer to the central question** — and notably, it is the same *shape* as the `(focus, frame)` proposal in §4A: a small set of continuously-valued inputs composed by a rule, rather than a taxonomy. Two independent lines of inquiry converging on that shape is meaningful.

**Relevance to HeadConan.** This should be treated as strong corroboration for the compositional approach, and as a warning against any design that reintroduces a discrete enumeration. It also suggests a concrete alternative to the `FocusScore` weighted sum (§2.3, FA4): a **factor model** of the same kind, with the factors being the ones the thesis identifies — which at least have the merit of being derived from an empirical study rather than chosen ad hoc.

**Honest limits.** The six factors were derived for **3D action games**, and each would need re-derivation for a text-and-imagination medium. The thesis is a master's thesis, not a validated instrument; the factors are a design framework, not a measured model. **Do not treat the factor list as validated for HeadConan.**

**Confidence: High** that the thesis proposes these six factors (**FACT**, primary text extracted). **Medium** that they transfer (**INFERENCE**). **Low** that they are the *right* six for HeadConan — that is an open question, and a good one for future work.

---

#### Finding A6 — Blocking affordances must be explicitly amplified; exploratory ones should not

**Evidence / source.** The primary thesis distinguishes **affordance amplifiers** from **affordance suppressors**, and grades affordances by whether they are **progression-critical** or **optional**. The empirical demonstration: in playtesting of *Resident Evil 5*, **five out of five participants failed to discover that a shelf could be pushed** — a progression-critical affordance that was present but not amplified.

**What it actually means.** Discoverability is not a property of the affordance; it is a property of how it is signalled. And the signalling requirement is **asymmetric**: an affordance the user *must* find to progress requires explicit amplification, whereas an optional one is better left as a subtle signifier so it does not clutter the field.

**Relevance to HeadConan.** Three consequences:

1. **It refines the Obra Dinn lesson (Case 2).** Obra Dinn's failure was exact-vocabulary matching; this is the complementary principle. The user needs *both* a forgiving vocabulary *and* amplified signalling for the things that matter.
2. **It is a direct design rule for HeadConan's action chips.** Chips are an affordance amplifier, and their presence in `ActionDock.tsx` is well-motivated. The rule to add: **amplify progression-critical affordances; leave exploratory ones as signifiers.** Amplification applied uniformly is noise — which is a live risk, since chips are cheap to add and tempting to over-fill.
3. **It bears on Situation 11.** When the system cannot resolve an input, the correct response is *not* to suppress the affordance; it is to amplify the disambiguation path.

**Confidence: High** on the thesis's claims (**FACT**, primary text). **Medium** on the application to HeadConan's chips (**INFERENCE**).

---

### 3.B Cognitive Science of Attention

---

#### Finding B1 — Working-memory capacity is limited, but the famous "four" is contested and the contestation matters

**Evidence / source.** Cowan, *The Magical Mystery Four: How is Working Memory Capacity Limited, and Why?*, Current Directions in Psychological Science 19(1), 2010 ([PMC2864034](https://pmc.ncbi.nlm.nih.gov/articles/PMC2864034/) — full text inspected). Cowan's position: a central storage limit of roughly **3–5 meaningful items** in young adults, observed specifically when rehearsal and chunking strategies are prevented (brief simultaneous spatial arrays; unattended auditory channels; articulatory suppression; running span). Miller's 1956 "7±2" is attributed to chunking strategies inflating the estimate.

**The contestation — reported because it is material.** The "four" is not settled. Recent work reports a wider estimate range (4–8), and at least one influential line of work (Ma et al., 2014) **rejects the "limited number of items" framing altogether** in favour of other accounts. Cowan's own 2004 work found chunk *span* stays constant while chunk *content* grows — consistent with his account but not decisive between competing ones.

**What it actually means.** Something in the range of three to five independent items is a defensible planning figure. **It is not a precision constant, and anyone quoting "four" as a hard number is overreading.** The practically useful part is robust regardless of which account wins: **the number of simultaneously-held independent items is small, and adding one more item beyond the limit disrupts the others rather than merely evicting one.**

**Relevance to HeadConan.** Two concrete consequences:
1. Supports **I3** (bounded periphery) — though weakly, given the contestation.
2. **Strongly** supports the S2 analysis: if the conversation is torn down on a focus shift, the user must hold its context in mind, consuming slots the system could have carried in a frame. This argument survives even under a "no fixed item limit" account, because it is about *interference*, not about a specific count.

**Confidence: High** that capacity is limited and small. **Low-Moderate** on the specific number. **FACT** as to Cowan's claims; the contestation is reported from survey rather than from direct inspection of Ma et al. — treat as **INFERENCE**.

---

#### Finding B2 — Cognitive load theory is useful but its founder has revised it, and load cannot be reliably measured online

**Evidence / source.** Sweller, van Merriënboer & Paas, *Cognitive Architecture and Instructional Design: 20 Years Later*, Educational Psychology Review (2019). Reviewed via aggregated evidence summaries ([example](https://www.memletics.com/foundations-cognitive-load-references)). The classical three-way distinction: **intrinsic** load (element interactivity inherent to the material), **extraneous** load (imposed by presentation), **germane** load (effort that builds schemas).

**What is contested.** The 2019 review itself revises the theory: germane load is reconceptualised, the assumption of fixed capacity is relaxed, and the **expertise-reversal effect** is acknowledged — instruction that helps novices can harm experts. Germane load's status and measurement remain unsettled.

**What is well-supported.** Reducing **extraneous** load — clutter, split attention, redundancy, split sources of information — frees capacity. This is among the most robust findings in instructional design.

**Critical negative finding.** **Cognitive load cannot currently be measured reliably online.** Sweller and colleagues acknowledge the measurement problem rather than solving it. Any design that proposes to *measure* the user's cognitive load in real time and adapt to it is building on a capability that does not yet exist.

**Relevance to HeadConan.**
- The positive half is directly actionable: **every element of extraneous load the frame carries instead of the user is capacity returned.** This is a real argument for the frame, independent of the orientation argument.
- The negative half is a hard stop: **do not plan a load-adaptive presentation system.** It is not available. If a future design proposes "reduce surfaces when cognitive load is high," it needs a different proxy.

**Confidence: High** on extraneous load and on the measurement limitation. **Medium** on the rest (reviewed via secondary aggregation, not the primary paper directly).

---

#### Finding B3 — Situational awareness has three levels, and the third one is a distinct design requirement

**Evidence / source.** Endsley's model: *Level 1* perception of the elements in the environment; *Level 2* comprehension of their meaning; *Level 3* projection of their status in the near future. Stated in Endsley (1995) and reproduced in authoritative summaries including [US National Academies, *Modeling Human and Organizational Behavior*](https://www.nationalacademies.org/read/6173/chapter/9) and the standard reference work. The model is among the most cited in the human-factors literature. Measured with SAGAT (Situation Awareness Global Assessment Technique) — a freeze-probe method requiring the simulation to be stopped and masked.

**What it actually means.** SA is not "knowing what's on screen." It is a three-stage construct, and the third stage — projection — is cognitively distinct from the first two and is the one most often unsupported by interfaces.

**Relevance to HeadConan.** Situation 7 (high-stakes decision) is distinguished precisely by demanding **L3**. This yields a concrete design requirement that no layout taxonomy would have produced: a high-stakes decision does not want a dramatic new screen; it wants a **projection affordance** ("if you do X, then…") and a **narrowed field**. See §5, S7.

**Caveat.** SAGAT is a laboratory freeze-probe technique; it is not usable in live interaction. So SA is measurable in studies but not in production — a practical constraint on any claim to "optimise for SA."

**Confidence: High** on the model. **Medium** on the S7 application (**INFERENCE**).

---

#### Finding B4 — People miss far more than they believe, and the mechanism matters for transitions

**Evidence / source.** The inattentional-blindness literature (Simons & Chabris and successors): observers engaged in a demanding task frequently fail to notice entirely unexpected but salient stimuli. The finding generalises: **whether something is noticed depends strongly on mental set, not merely on perceptual salience.**

**What it actually means.** Two separable facts:
1. Users will miss things — including large, obvious things — when their attention is otherwise engaged.
2. Change detection is poor when change coincides with a visual disruption (saccade, blink, cut, or — by extension — a smooth animated transition).

**Relevance to HeadConan.** The second is the actionable one and it cuts against a natural instinct:

- **User-initiated** focus change: smooth morphing is good. The user already knows what happened; the animation carries the eye.
- **System-initiated** focus change: smooth morphing is **actively harmful**, because the user's entire need is to *notice* that the system moved their attention. A transition engineered to be invisible hides exactly what the user must see.

This is the basis for §8.5, and it is a genuinely non-obvious result — it inverts the usual "make transitions seamless" advice.

**Confidence: Medium-High** on inattentional blindness as a phenomenon (**FACT**, extensively replicated). **Medium** on the extension to animated UI transitions — that specific extension is **INFERENCE**, not something the surveyed literature tested directly.

---

#### Finding B5 — Multiple-resource theory: modality is a real, exploitable channel

**Evidence / source.** Wickens' Multiple Resource Theory distinguishes processing resources along several dimensions — notably stage (perception vs. response), modality (visual vs. auditory), and code (spatial vs. verbal).

**What it actually means.** Two tasks interfere more when they draw on the same resource channel than when they draw on different ones. Visual-verbal and auditory-spatial, for example, are partially separable.

**Relevance to HeadConan.** HeadConan is currently a **single-channel visual interface** — every signal competes for the same resource. If the periphery is meant to carry ambient awareness without competing with the stage, **a second modality (sound, or subtle motion in the visual periphery) is the principled way to do it.** This is a design opportunity the current documents do not mention.

**Confidence: Medium.** The theory is well-established; its specific application here was not tested. **SPECULATION** on the practical payoff — noted because it is cheap to explore and potentially valuable, not because it is supported.

---

#### Finding B6 — Salience has two well-studied drivers and misses a third that HeadConan needs

**Evidence / source.** Standard models distinguish **bottom-up** salience (stimulus-driven: motion, contrast, sudden onset — computational saliency-map models) from **top-down** salience (goal- and task-driven).

**What it actually means.** Both drivers are about *perception*: what pops out, and what the task makes relevant.

**The gap.** Neither covers **dramatic or narrative significance** — "this matters because it is a secret, a lie, a turning point, an unanswered question." That is a third driver, and it is not a perceptual property at all.

**Relevance to HeadConan.** This is the missing fallback for USER GOAL (§4.3, Missing 5). When the user has no goal — which in an imagined world is much of the time — selection must be driven by something, and the two studied drivers are insufficient.

**Confidence: High** that the two-driver account is the standard model. **Medium** that a third driver is genuinely needed for narrative contexts — **INFERENCE**, though the stress test (S9 in particular) supports it.

---

#### Finding B7 — Density is not one variable: crowding and search are separate regimes with different levers

**Evidence / source.** Two literatures that are routinely conflated measure different things. **Crowding** is a *local* failure of identification caused by nearby flankers: **Bouma (1970)** and **Pelli et al. (2004)** establish that **critical spacing is roughly 0.5 × target eccentricity**, and that it is **independent of distractor size, distractor contrast, and distractor number (in cases of two or more)**. **Search** is a *global* phenomenon: reaction time scales linearly with **functional set size**, at roughly 20–40 ms per item when no feature guides search, and near **0 ms per item** under pop-out (**Wolfe, 2021**).

**What it actually means.** The two regimes have different levers, and the levers do not transfer:

| | **Crowding** (local) | **Search** (global) |
| :--- | :--- | :--- |
| Governing quantity | Critical spacing (≈ 0.5 × eccentricity) | Functional set size |
| Number of competitors | **Irrelevant (≥ 2)** | **Linear** |
| Effective levers | Spacing · pop-out · temporal preview | Feature guidance (drives set size → 1) · reduce count and heterogeneity |
| Directing attention | **Ineffective** | Effective, but weaker than feature guidance |

**The boundary that keeps this honest.** Number-independence holds **only at two or more competitors**. The sources do not license any claim about the step from one competitor to two, which is where crowding first appears. It is nonetheless the step most worth avoiding: it is the difference between *a target with something beside it* and *a target surrounded*. *(First sentence FACT; the practical emphasis is INFERENCE.)*

**Relevance to HeadConan.** Two consequences, both of which contradict reasonable-sounding instincts. First, **deleting elements is not the lever it appears to be** — going from ten competitors to three leaves critical spacing untouched, so if spacing was already too tight, deletion accomplishes nothing. Second, **dimming the background is not a lever either** — critical spacing is independent of distractor contrast. Spacing is.

**Confidence: High** on the critical-spacing law and its independence claims (**FACT** — Pelli et al. 2004 and Strasburger et al. 1991, as reported in Scolari et al. 2007 and a secondary review; **the primaries were not inspected directly**). **High** on the two-regime distinction. **Medium** on the search slope figures, which are standard but quoted at textbook resolution.

---

#### Finding B8 — The unifying variable is segmentability, not salience — and guidance cannot compensate for crowding

**Evidence / source.** **Scolari, Kohnen, Barton & Awh (2007)**, *Journal of Vision* 7(2):7, produced a **triple dissociation** within a single experiment. The authors' own conclusion:

> "although spatial cueing led to robust improvements in target discrimination, **there was no reduction in critical spacing** for attended stimuli. By contrast, **both preview and popout caused large reductions in critical spacing**. These disparate results indicate that attention improves target discrimination in crowded displays in a **qualitatively different manner** than do the other factors."

And their mechanistic explanation, from the body of the paper rather than the abstract:

> "both preview and popout caused large reductions in critical spacing, **perhaps by reducing the integration of target and distractor representations via Gestalt grouping cues**. … the bottom-up grouping cues between targets and distractors **remained constant** across the valid and invalid spatial cues. … shifts of attention may have enhanced target processing **without directly influencing the tendency to group targets and distractors**."

**What it actually means.** The variable that governs whether a target survives a crowded field is **whether it can be segmented out of its background** — not whether it is salient, and not whether attention has been pointed at it. Three routes produce segmentation: **motion contrast** (target and background temporally out of phase), **an exclusive basic feature** (pop-out), and **temporal separation** (preview: present the target alone, then introduce the competitors).

**Relevance to HeadConan — two rules, one of them free and counter-intuitive.**

1. **Guidance is not a substitute for spacing. This is the finding most likely to be got backwards.** Telling the user where to look — by narrative prompt, plot emphasis, or an explicit indicator — improves discrimination but leaves critical spacing untouched. The resulting failure in a crowded frame is therefore not *the user did not look*; it is **the user looked and still could not tell what they were looking at.** HeadConan's guidance is primarily narrative, which makes this its most exposed failure mode.
   **Scope, stated precisely:** this holds in the **crowding** regime. In the **search** regime guidance *is* the lever — but it works by shrinking the functional set, not by making the target more visible. The two statements are separate rules and must not be merged into "guidance never helps."
2. **Temporal separation is available to HeadConan at no cost.** When a target cannot be distinguished from its competitors — it is one document among identical documents — the instinct is to colour it, outline it, or make it glow, all of which are paid for in world-consistency. **The alternative costs nothing: show it alone first, then add the rest.** HeadConan is a sequential presentation system, so preview is already in its repertoire.

**Confidence: High** (**FACT** — the dissociation is the authors' own reported result, quoted verbatim). **Medium** on the Gestalt-grouping mechanism, which the authors themselves hedge with "perhaps".

---

#### Finding B9 — In natural, task-driven, three-dimensional tasks, gaze is overwhelmingly top-down

**Evidence / source.** **Land & Hayhoe (2001)**, *Vision Research* 41(25):3559–3565, reviewing eye-movement studies of extended real-world tasks. From the abstract, directly:

> "The eye movements during this kind of task are nearly all to task-relevant objects, and thus their control is seen as primarily **'top-down'**, and influenced very little by the **'intrinsic salience'** of objects."

**Hayhoe & Ballard (2005)**, *Trends in Cognitive Sciences* 9(4):188–194, list as the first of its cited advances *"the **pervasive role of the task** in guiding where and when to fixate."*

**What it actually means — and the detail that makes it load-bearing.** The critical manipulation is not that irrelevant objects happen to be rare. It is that **when an experimenter deliberately places salient, task-irrelevant distractors into a real three-dimensional workspace, they are still almost never fixated.** This matters here because the manipulation is performed *in* the medium under discussion — physical, solid, spatial — rather than demonstrated on a screen and argued across by analogy.

**A mechanism considered and rejected.** It is tempting to argue that a physically embodied space is closer to the "motion" case, on the grounds that a moving observer generates optic flow. **This does not follow.** Optic flow is a *global* field: it delivers a continuous gradient, not an **exclusive feature**, and it does not segment a target from its competitors. A second objection is more damaging still — motion parallax segments *depth layers*, not *individuals*, so even where it "segments" at all, it segments at the wrong granularity. Optic flow is therefore not a route to pop-out, and the embodied case is not thereby upgraded.

**Relevance to HeadConan.** For any presentation reaching into a physical or spatially embodied setting, **task goal is the reliable instrument for directing attention; lighting, layout and other exogenous staging are not.** This is a positive result rather than a caution: the dependable instrument is one HeadConan already owns.

**Confidence: High** on the direction (**FACT** — quoted from the abstract of the primary). **Medium** on the strength of the transfer, for two stated reasons: the evidence rests on a single research tradition, and the tasks studied are skilled domestic routines whose ecological distance from an imagined world is real. **The quantitative figures sometimes quoted for this literature — for example "> 99% task-relevant" — are derived from secondary reporting and are deliberately not used here**; the primaries say "nearly all" and "very few."

---

### 3.C HCI & Interaction Design

---

#### Finding C1 — Adaptive interfaces: the evidence is genuinely mixed, and the pattern of the results is unfavourable to HeadConan's context

**Evidence / source.**
- **Lavie & Meyer (2010)**, *Benefits and costs of adaptive user interfaces*, Int. J. Human-Computer Studies 68(8) — [abstract and full reference list inspected](https://www.sciencedirect.com/science/article/pii/S1071581910000145). Findings: adaptivity is **not always beneficial**. In **familiar, routine** situations, a fully adaptive system helped all participants, particularly older ones. In **unfamiliar situations to which the system was not adjusted, cognitive workload increased substantially and performance was adversely affected.** Intermediate adaptivity kept users involved but also carried risks in non-routine situations.
- **Findlater & McGrenere (CHI 2004)** — comparison of static, adaptable and adaptive split menus: users generally **preferred customisable to adaptive**, and adaptive menus were no faster than either alternative.
- **Gajos, Wobbrock & Weld** — [design space paper inspected](https://www.eecs.harvard.edu/~kgajos/papers/2008/kgajos-nectar08.pdf). Counter-intuitive result: **increasing the adaptive algorithm's accuracy had more beneficial effects on satisfaction, performance and utilisation than did improved predictability.** But eye-tracking showed predictability helps users *anticipate* when adaptation occurred, reducing visual search time. So the two properties trade off.

**What it actually means.** Three separate, uncomfortable facts:
1. Adaptation helps in routine contexts and **hurts in unfamiliar ones**.
2. Users often **prefer control to automation**, even when automation is not slower.
3. There is **no free lunch** between accuracy and predictability.

**Relevance to HeadConan — the most important negative finding in this report.** HeadConan is a **perpetually non-routine environment.** Every session is an unfamiliar world doing unfamiliar things. That is precisely the regime in which Lavie & Meyer report adaptation *degrading* performance.

This does not mean "never adapt." It means the current design — an auto-morphing planner with no specified override — sits in the empirically riskiest quadrant, and the mitigations the literature supports (user override, intermediate adaptivity, predictability) are **not yet specified** anywhere in the HeadConan documents. `OPEN_UX_QUESTIONS.md` Q1 gestures at this with the "Sticky Layout Lock"; the literature says it is not a nicety but the primary risk control.

**Confidence: High** on the findings themselves. **Medium-High** on generalisation from in-vehicle telematics and menus to narrative worlds — **INFERENCE by analogy**, flagged as such. **This is the single most important empirical uncertainty in the current design.**

---

#### Finding C2 — Mode errors are real, and user-maintained modes beat system-maintained ones

**Evidence / source.** Sellen, Kurtenbach & Buxton, *The prevention of mode errors through sensory feedback*, Human-Computer Interaction 7(2), 141–164, 1992 ([full transcript inspected](https://doczz.net/doc/8873793/the-prevention-of-mode-errors-through-sensory-feedback)). Experiment 1: both kinesthetic and visual feedback reduced mode errors, but **kinesthetic feedback was more effective on both error rate and the cognitive load associated with mode changes.** Experiment 2 confirmed the mechanism: a **non-latching** foot pedal (requiring the user to actively maintain the mode) outperformed a latching one. The authors conclude: **"user-maintained mode states prevent mode errors more effectively than system-maintained mode states."** Supporting: Norman's analysis of mode errors; Raskin's *The Humane Interface* (quasi-modes / spring-loaded modes); [Nielsen Norman Group on modes](https://www.nngroup.com/articles/modes).

**What it actually means.** When the system changes state without the user holding it there, errors follow. When the user must actively sustain a state, they know where they are.

**Relevance to HeadConan.** A system that silently reconfigures its own layout is a **system-maintained mode** — the worse case, by direct experimental result. Two consequences:
1. **The override is not optional.** Letting the user pin a composition converts a system-maintained mode into a user-maintained one — exactly the intervention the experiment supports.
2. Preference should go to **quasi-modes**: a focus shift that persists only while the user keeps attending (press-and-hold to inspect; release to return) rather than a latching mode the user must later remember to exit.

**Confidence: High** on the experimental result. **Medium** on the strength of the analogy from text-editor modes to presentational modes (**INFERENCE**) — the stakes are lower in HeadConan, but the mechanism transfers cleanly.

---

#### Finding C3 — Mixed-initiative principles: the relevant rule is "when uncertain, do less"

**Evidence / source.** Horvitz, *Principles of Mixed-Initiative User Interfaces* — **correction to the brief's citation: this is CHI '99, not CACM 1999** (flagged by the research assistant; the CHI '99 attribution is the correct one). The principles concern the value, cost, uncertainty and timing of automated action.

**What it actually means.** Automation should act when the expected value of acting clearly exceeds the cost of being wrong, and should defer or ask when uncertainty is high. Timing matters as much as accuracy.

**Relevance to HeadConan.** This gives a decision rule for the system-initiated transition question that §6 and §9 both leave open: **the system should morph on its own only when it is confident the user's focus has moved; when uncertain, it should signal rather than act.** That is a testable policy, and it is cheaper and safer than the alternative.

**Confidence: Medium-High** on the principles. **Medium** on the application (**INFERENCE**).

---

#### Finding C4 — Progressive disclosure is widely advocated and, by its own advocates' admission, thinly evidenced

**Evidence / source.** Progressive disclosure appears throughout the game-UI and HCI practitioner literature as settled advice — "secondary information is hidden until needed; not everything visible all the time" ([Game UI Design patterns](http://www.gamedesign.gg/articles/game-ui-design-patterns)).

**Honest assessment.** Despite its ubiquity, the specific empirical support for progressive disclosure *as a layout strategy* is weaker than its confidence of assertion would suggest. It is well-supported in narrow cases (reducing extraneous load — see B2, which is a robust finding) but the general claim is not backed by a comparably robust literature.

**Relevance to HeadConan.** Progressive disclosure is safe to adopt — it reduces extraneous load, which is well-supported — but it should not be treated as a validated solution to the presentation problem. It addresses *how much* to show, not *what* to show.

**Confidence: High** that the advice is ubiquitous. **Medium** on the strength of its evidence base. **This is a distinction between "proven research finding" and "design speculation" that the brief explicitly asked for.**

---

#### Finding C5 — Direct manipulation: what "directness" actually buys

**Evidence / source.** Shneiderman's direct-manipulation formulation (continuous representation of objects of interest; physical actions rather than complex syntax; rapid incremental reversible operations with immediate visible effect) and Hutchins, Hollan & Norman's elaboration on the *feeling* of directness.

**What it actually means.** The benefit is not efficiency — direct manipulation is frequently *slower* than a command line. The benefit is **comprehensibility and the sense of agency**: the user acts on the object of interest rather than describing an action upon it.

**Relevance to HeadConan.** `OPEN_UX_QUESTIONS.md` Q2 asks whether natural-language input is always fastest. The honest answer from the literature is: **no, and speed is the wrong metric anyway.** Direct spatial manipulation on a map or evidence board buys *agency and comprehension*, which matter more than speed for a system whose entire proposition is "inhabit and influence an imagined world." This argues for supporting both, and for not treating the text dock as the whole answer.

**Confidence: Medium-High.** Well-established theory; the HeadConan application is **INFERENCE**.

---

### 3.D Theatre, Film & Spatial Storytelling

> **Honesty note.** This field yielded the weakest primary-source access of the six. The core concepts are well-documented, but the specific claims about *how attention is directed* are less rigorously evidenced than the cognitive-science literature, and much of the film-studies writing is interpretive rather than experimental. Confidence is marked accordingly, and overclaiming is avoided.

---

#### Finding D1 — Mise-en-scène is the established vocabulary for "what is placed before the audience, and why"

**Evidence / source.** Mise-en-scène (French, "placing on stage") comprises setting, lighting, costume and make-up, **blocking** (the staging and movement of actors), composition and framing, and the use of space. André Bazin's formulation emphasises choreographed movement *within* the scene rather than through editing. [Consolidated reference](http://en.m.wiki.x.io/wiki/Mise_en_sc%C3%A8ne); the canonical primary source is Bordwell & Thompson, *Film Art: An Introduction*.

**What it actually means.** The director's core instrument is **staging** — deciding what is in the frame, in what arrangement, under what light, at what depth. The literature is explicit that this is how attention is directed: lighting "directs each scene, directing the viewers' gaze and attention"; depth of field isolates a subject and pushes everything else away; composition and blocking reveal power dynamics.

**Relevance to HeadConan.** This is the **best available answer to the "how do we avoid a UI that shouts 'look here'" problem.** Attention can be moved by staging rather than by instruction. And HeadConan already has a construct whose job this is: **`WorldStyle`.** The suggestion is not to build a new system but to **reconceive `WorldStyle` as mise-en-scène rather than as theming** — a set of decisions about what is placed before the user, what is lit, what is in depth, what is at the margins.

**Confidence: High** on the concept and its content. **Medium** on the strength of the transfer (**INFERENCE**).

---

#### Finding D2 — The film analogy has a hard limit, and locating it is more useful than extending it

**Evidence / source.** Continuity editing is designed to make the cut **invisible** — the audience is not meant to notice the transition. This is a descriptive fact about the dominant editing practice.

**What it actually means — and why the analogy fails.** The invisible cut works because **the filmmaker controls the frame and the audience has ceded that control.** In an interactive system the user holds the frame.

**Relevance to HeadConan — the single most important limit on the film analogy.** An invisible transition in an interactive system is not elegance. It is a change the user did not author and did not see — which is the definition of a mode error (C2) and is precisely the failure the change-blindness literature (B4) predicts.

**The positive formulation:** **import the staging, not the cut.** Use mise-en-scène to decide what is in the frame. Do **not** use continuity editing to hide the fact that the frame changed.

**Confidence: High** that continuity editing aims at invisibility. **Medium-High** on the conclusion about interactive systems — this is **INFERENCE**, but it is corroborated independently by the change-blindness and mode-error literatures.

---

#### Finding D3 — Environmental storytelling and spatial narrative are established concepts with traceable origins

**Evidence / source.** The concept that narrative can be embedded in *space* rather than in cutscenes is standard in game studies; Henry Jenkins' essay *Game Design as Narrative Architecture* is the commonly cited origin point. Practitioner usage links it to Valve's work on Half-Life and to BioShock's audio diaries.

**Caveat.** **The specific attribution was not verified against primary sources during this research and should be treated as unverified.** The *concept* is well-established; the *genealogy* is not confirmed here.

**Relevance to HeadConan.** Modest, and worth stating carefully: HeadConan's worlds are largely **not** spatial in the 3D-game sense. The transferable part is the principle that **a space can carry narrative without narration** — which is directly applicable to a location's "aspect" being examinable as *history* rather than *layout* (§2.3, FA2), and which supports treating Location as having multiple examinable aspects.

**Confidence: Medium** on the concept; **Low** on the attribution (unverified).

---

### 3.E Interactive Fiction & Narrative Systems

> This field provided the **strongest primary-source access** of the six, and produced the most actionable findings. It is also, in this researcher's assessment, the field most under-consulted in the existing HeadConan documents.

---

#### Finding E1 — The world model and the narration are separate, and separating them is the field's central unfinished project

**Evidence / source.** Nick Montfort, [*Toward a Theory of Interactive Fiction*](http://www.nickm.com/if/toward.html) and [*Interactive Fiction's Fourth Era*](http://www.nickm.com/if/fourth_era.html) — both primary, both inspected. Montfort's argument: narratology distinguishes the **content plane** (the story: what happened, in what order, causally linked) from the **expression plane** (the discourse: how it is told — which may reorder, elide, repeat, or adopt different perspectives). Interactive fiction, Montfort argues, is accomplished at simulating the content plane but **has not been organised to incorporate this distinction**: text fires off as events happen, which makes reordering, flashback, and re-perspectivising extremely difficult. His proposal is a **narrator subsystem** sitting alongside the world model and parser.

**What it actually means.** *What happened* and *how it is told* are different things, and the hard part is the second one.

**Relevance to HeadConan.** This is **exactly** the `WORLD STATE` versus `PRESENTATION` distinction from §4.1, arrived at independently by a different field. HeadConan's four-layer separation (`WORLD_REPRESENTATION.md`: Definition / State / Dynamics / Presentation) is **architecturally ahead of interactive fiction on precisely this point** — Montfort is proposing as a research programme what HeadConan already has as a layering.

**Two consequences:**
1. **Do not regress this.** The separation is HeadConan's structural advantage.
2. **The fourth layer is the one that is under-built.** Layers 1–3 are validated and sound; layer 4 (`WorldPresentation`: "experience signals, modality recommendations, epistemic perspective lens") is the least specified and is where this whole report's concerns live. The existing architecture is not wrong about the problem's shape — it is unfinished at exactly the right layer.

**Confidence: High.** Primary sources inspected.

---

#### Finding E2 — Inform 7's scenes are untyped, condition-cued, and carry entry/exit effects — and this is the strongest precedent against `sceneType`

**Evidence / source.** [*Writing with Inform*, §10.2 "Creating a scene"](http://inform7.com/book/WI_10_2.html) and [§10.3 "Using the Scene index"](https://inform7.com/book/WI_10_3.html) — primary documentation, inspected. Also [Inform 7 Handbook, "Scenes"](http://inform-7-handbook.readthedocs.io/en/latest/chapter_8_time_&_scenes/scenes/).

**What it actually means.** Established in §2.3 (FA5) and restated here as a finding:

- A scene is cued by a **condition**: `Train Stop begins when the player is in the Station for the third turn.`
- Scenes have **no type**. There is no `sceneType` field and no taxonomy.
- Each scene carries **two rulebooks** — entry effects and exit effects.
- There is always a built-in `Entire Game` scene containing all others; scenes are **temporal and nested**, not categorical.
- Scenes **chain**: `Brief Encounter begins when Train Stop ends.`
- Inform documents the characteristic authoring bug — a scene with a start condition but no end condition **never ends**, flagged as a first-class warning in the Scenes index.
- Practical uses documented: rearrange objects on entry ("our imaginary stage-hands wheel in a steam train"), restrict travel during the scene, print atmospheric text, change rules' effects while the scene runs.

**Relevance to HeadConan.** Three direct lessons:
1. **Do not type scenes.** The most mature system in the field does not.
2. **Scenes are for entry/exit effects**, not for layout. "When this scene begins, the Flying Scotsman is in the Station" — that is a *world* effect, not a presentation effect.
3. **HeadConan's scenes must be inferred at runtime, whereas Inform's are author-cued.** This is the one place the analogy genuinely strains, and it is the reason H1 needs empirical testing rather than being adopted on precedent alone.

**Confidence: High.** Primary documentation inspected.

---

#### Finding E3 — Versu demonstrated that Situation 3 is a world-model property, not a presentational one

**Evidence / source.** Emily Short, [*Introducing Versu*](https://emshort.blog/2013/02/14/introducing-versu/) (primary, inspected). Versu (Richard Evans & Emily Short) modelled **social practices** and used expected-value search over possible actions; each character could act autonomously. Short documents an emergent outcome: a character was speaking in confidence when a third party wandered in; because the speaker was uncomfortable around that person, he **fell silent, producing an awkward pause that no author had written.** The behaviour fell out of a model that knew when characters would be willing to discuss topics, and that stopping mid-conversation is awkward.

**What it actually means.** The correct handling of "someone walks in on a private conversation" is a **social-model** property that produces the right presentation as a consequence. It does not need to be authored as a presentational case.

**The honest caveat.** Versu was **shut down by Linden Lab**; its completed games (including *Blood and Laurels*, ~240,000 words of which an estimated <10% appears in any single playthrough) were never released ([Gamasutra / Game Developer interview, 2014](https://www.gamedeveloper.com/business/the-end-of-versu-emily-short-looks-back)). The *demonstration* is real and documented. The **production viability** of the approach is not established, and the authoring toolchain was reportedly difficult — writing dialogue in the Praxis language was "wrapping conversational elements in code," which led to a separate DSL (Prompter).

**Relevance to HeadConan.** Use this as **evidence that the decomposition is right**, not as a blueprint to copy. It is the strongest available proof that the hard situations in §5 are expressible in the world/social model rather than in a presentational taxonomy.

**Confidence: High** on the demonstration. **Low** on production viability.

---

#### Finding E4 — Quality-based narrative offers freedom at the cost of tooling, by its own practitioners' admission

**Evidence / source.** Emily Short, [*Mailbag: High-Agency Narrative Systems*](https://emshort.blog/category/quality-based-narrative/page/2/) (primary, inspected). On quality-based narrative (QBN) / storylets: "Systems like this can achieve a combination of player freedom and agency that is hard to reach in CYOA or any other node-based system… there are often dozens of viable choices available." But: **"the tooling and the design abstractions in this space are not nearly as advanced as they are for parser IF or CYOA/hypertext/stats-based IF, so if you want to work with it, you probably have to build your own."** Corroborated by the practitioner survey [*Notes from the Boundaries of Interactive Storytelling*](https://polarisgamedesign.com/2024/notes-from-the-boundaries-of-interactive-storytelling/), which documents storylets as easy to start but with "devils in the details" — dynamic casting breaks referential specificity ("no longer possible to refer to 'Jimmy, the kidnapping victim from the warehouse mission'"), complicates localisation (pronouns unknown until runtime), and tag-based requirement systems "start to break down" for relational constraints.

**What it actually means.** The most free-form narrative structures are also the least tooled, and the costs show up in authoring, localisation, and referential specificity.

**Genealogy correction.** "Storylet" is Emily Short's term, but the underlying technique is older. **King of Dragon Pass**'s lead programmer, **David Dunham**, documents on his own blog that **"storylets with casting" was invented in 1997**, more than a decade before the term became current — with the real scripting syntax published. *(Reported from the research assistant's verification of Dunham's blog; treated as HIGH confidence but flagged because the blog itself was not directly inspected by this report's author.)* This matters here because it means the technique has nearly thirty years of production use behind it, which raises its credibility as a precedent substantially.

**Relevance to HeadConan.** A caution directly relevant to §8: **the freedom of the underlying representation is not the same as the tractability of authoring for it.** HeadConan's `WorldDefinition` is a highly expressive representation — which means it will inherit exactly these authoring costs. The lesson is to budget for authoring tooling earlier than feels necessary, and to be suspicious of any representation whose expressiveness cannot be authored against.

**Confidence: High** on the Emily Short and practitioner-survey material (primary sources inspected). **Medium-High** on the 1997 genealogy (second-hand verification, flagged above).

---

#### Finding E5 — LLM roleplay systems' characteristic failure is confabulation, not presentation

**Evidence / source.** Practitioner surveys (e.g. [the IF landscape overview](https://games.brettwitty.net/ifcourse/essays/what-is-if)) describe the recurring limitations of the text-adventure form: the "feeling of freedom, simulation and coherency falls apart after the player types LICK for the tenth time and get only a boilerplate vague response." The structural failure of LLM-based systems — inventing a plausible continuation rather than admitting non-comprehension — follows from next-token prediction.

**What it actually means.** The failure mode is **not** that LLM systems present things badly. It is that **they present the wrong thing confidently.**

**Relevance to HeadConan.** Directly supports S11 and §8.3: if the presentation layer has no representation of its own uncertainty, it will render *something* rather than admit it does not know. A deterministic layer fails **visibly and recoverably**; a generative layer fails **invisibly**. This is an independent argument — beyond ADR-12 — for keeping selection out of the LLM's hands.

**Confidence: Medium-High** on the phenomenon (widely reported by practitioners). **Medium** on the specific mechanism (**INFERENCE**).

---

### 3.F Adaptive & Generative UI

---

#### Finding F1 — The industry's answer to "what should AI decide" already exists, and it is a clean intent/rendering split

**Evidence / source.** **A2UI** (Agent-to-UI), Apache 2.0, created by Google with contributions from CopilotKit — [a2ui.org](https://a2ui.org/) and the [specification](https://a2ui.org/introduction/what-is-a2ui), both primary and inspected.

**What it actually is.** A declarative UI protocol. Agents emit **structured JSON** describing components drawn from a **client-defined catalogue**; the client renders them with **its own native components**. Explicitly:
- *"Declarative data format, not executable code. Agents can only use pre-approved components from your catalog — no UI injection attacks."*
- *"Client controls security and styling, agent-generated UI feels native."*
- Design principles: **LLM-friendly** (flat component list with ID references, streamable, incrementally correctable), **framework-agnostic** (same JSON renders on Angular, Flutter, React, native mobile).
- Core message types: `createSurface` / `surfaceUpdate`, `updateComponents`, `updateDataModel` / `dataModelUpdate`, `beginRendering` — i.e. an explicit separation of **structure** from **data**.

**What it actually means.** The semantic-intent/rendering abstraction the brief asks about **is not speculative — it is shipping.** The division is: **agent selects components and supplies data; client renders.** Notably, the agent does *not* decide layout geometry, styling, or hierarchy beyond choosing components and their nesting.

**Relevance to HeadConan.** This is a production-proven instance of exactly the abstraction §4.6 proposes: **AI proposes what matters; deterministic code decides how it looks.** It also validates that such a split is tractable at scale. HeadConan should not invent a competing protocol; if AI ever participates in selection, A2UI-shaped boundaries are the right shape.

**Confidence: High** on what A2UI is (primary spec inspected). **Medium** on the claim that HeadConan should adopt it — HeadConan's needs (sustained narrative experience, cumulative surfaces) are **not** what A2UI was designed for. **INFERENCE.**

---

#### Finding F2 — Generative UI produces genuinely preferred results, in the domains it has been tested in

**Evidence / source.** A Google Research preprint on Generative UI ([generativeui.github.io](https://generativeui.github.io/)) reports that, with appropriate prompting and tools, a modern LLM "can robustly produce high quality custom UIs for virtually any prompt"; that results are "overwhelmingly preferred by humans over the standard LLM markdown output"; and that while worse than human-expert-crafted results, they are "at least comparable in 50% of cases." The work reports an ELO score of 1736.2 against comparison conditions and releases a dataset (PAGEN) of expert-crafted results. *(Note: the cited arXiv identifier and publication year on the source page are inconsistent; cited here by project URL rather than by arXiv ID.)*

**What it actually means.** For **one-shot, self-contained, task-shaped** outputs — explain a concept, compare options, book a table — generative UI is now competitive with hand-built interfaces in human preference.

**The crucial limit.** Every demonstrated case is a **disposable, task-shaped artifact**. None is a sustained, stateful, cumulative experience across a session. **Generative UI has essentially no demonstrated answer for HeadConan's actual problem**, which is not "render a good one-off surface" but "maintain a coherent inhabited experience across hundreds of turns."

**Relevance to HeadConan.** Encouraging but not transferable as-is. It supports H4's *narrow* version (AI may usefully decide what to show) and does **not** support any move toward AI-generated layout for the core experience.

**Confidence: Medium** (vendor preprint; evaluator details and the arXiv/year inconsistency warrant caution; the direction is consistent with the broader industry picture).

---

#### Finding F3 — The research frontier is converging on semantics as the intermediate layer

**Evidence / source.**
- **[Jelly](https://dl.acm.org/doi/abs/10.1145/3706598.3713285)** (Cao, Jiang & Xia, CHI 2025): proposes **task-driven data models** as the foundation for UI generation — AI interprets prompts and generates data models describing the intended task; mapping data models to UI specifications produces generative interfaces; users then modify via natural language *and* direct manipulation, with changes translated back into the underlying model. Reported contributions include effective information organisation for task achievement and persistent-but-malleable structures.
- **[Bridging Gulfs in UI Generation through Semantic Guidance](http://ar5iv.labs.arxiv.org/html/2601.19171)** (CHI 2026): finds that users struggle to articulate design intent and to evaluate generated output, and proposes **explicit semantic representations as an intermediate layer between human intent and AI output** — parsing input semantics, generating interfaces, and analysing output semantics to make requirements explicit and outcomes interpretable. A comparative study suggests improved perceived control and more predictable iteration.

**What it actually means.** Both systems independently arrive at the same architecture: **intent → semantic intermediate representation → UI**, with the semantic layer being the thing that makes generation controllable and interpretable. Neither lets the model go straight from prompt to pixels.

**Relevance to HeadConan.** This is the strongest available corroboration of the report's central structural claim, from a completely different direction: **the abstraction that makes generative UI tractable is a semantic intermediate layer, not a set of rendered outputs.** HeadConan's equivalent intermediate layer is `(focus, frame)` plus `WorldStyle`. The research frontier's independent convergence on this shape is meaningful support for H1.

**Confidence: Medium-High.** Both are peer-reviewed CHI papers; abstracts and structure inspected, full texts not read in detail.

---

#### Finding F4 — What the field genuinely does not know

Stated explicitly, because it is the most decision-relevant output of this section:

1. **No evaluated generative-UI system addresses sustained, stateful, cumulative experience.** Every demonstration is task-shaped and disposable. HeadConan's core requirement is untested territory.
2. **No evidence exists on whether AI-estimated salience beats simple heuristics** for focus selection. H4 is untested, and the honest prior is that it might not.
3. **No established method measures cognitive load online** (B2) — so "adapt to the user's load" is not currently implementable, whatever its appeal.
4. **The adaptive-UI evidence does not cover narrative or fictional contexts.** The generalisation in C1 is inference, not finding.
5. **Quality control at scale for generated interfaces is unsolved** — including accessibility auditing, which was raised as an open concern in the generative-UI literature surveyed.
## 4. Comparative Case Studies

### 4.0 Selection rationale

Six systems were chosen for **maximum contrast**, deliberately including non-games and a dead system. The brief warns against a shallow list of famous products; accordingly, three of the six are not consumer games at all, and one no longer exists.

| # | System | Category | Why this one |
| :-- | :--- | :--- | :--- |
| 1 | **Outer Wilds** (ship log) | Open-world exploration | The strongest available example of a **cumulative, epistemically-constrained** surface |
| 2 | **Return of the Obra Dinn** | Detective / deduction | The strongest example of **withholding** as a design strategy — and of where rigid interaction vocabulary breaks |
| 3 | **Inform 7** | Interactive fiction *authoring* | The most mature **world-model** system in existence; shows the model layer, not the experience layer |
| 4 | **Versu** | Experimental narrative (defunct) | Demonstrates that "hard" social situations are **world-model** properties — and shows what happens when the authoring cost is too high |
| 5 | **A2UI** | Generative UI *protocol* | The production answer to "what should AI decide" — maximum contrast, not a game |
| 6 | **Jelly / semantic guidance** | HCI research systems (CHI 2025/26) | The research frontier's independent convergence on a semantic intermediate layer |

Each is analysed against the nine questions specified in the brief.

---

### Case 1 — Outer Wilds: the Ship Log

*(Mobius Digital, 2019. Analysis focuses on the ship-log system specifically, for which first-hand designer account was available.)*

| Question | Answer |
| :--- | :--- |
| **1. Primary activity** | Exploration of a solar system in a 22-minute time loop. Crucially: **knowledge is the only progression** — the player never gets stronger, only better informed. |
| **2. Primary object of attention** | Whatever the player is currently investigating. Deliberately player-determined. |
| **3. What is visible** | A **diegetic HUD** (oxygen, fuel, health) rendered through the astronaut's helmet — visible only when the suit is worn. A diegetic ship cockpit. And, separately, the **Ship Log**. |
| **4. What is hidden** | Almost everything. There are **no quest markers, no objective list, no waypoint system.** The Ship Log explicitly "doesn't tell you anything you technically don't know." |
| **5. What determines interface structure** | Two things: (a) whether the player is in the world or reasoning about it, and (b) the **aspect** of the accumulated knowledge the player wants — there are **two modes over the same data**. |
| **6. Stable or transforming?** | The HUD and cockpit are stable. The Ship Log is **cumulative** — it grows across the whole game and persists across every loop reset. |
| **7. How does it transition?** | The Ship Log has **two views of one dataset**: *Map mode* organises discoveries by planet; *Rumor mode* draws lines between leads — a detective board. The player switches aspect; the data does not change. |
| **8. What can HeadConan learn?** | Three things, one of them major — see below. |
| **9. What should HeadConan NOT copy?** | The total absence of guidance. See below. |

**Evidence.** First-hand account from creative director Alex Beachum ([interview](https://castro.fm/episode/XU2TVC)):
- The Ship Log was present from the beginning because *"we didn't want players to necessarily have to take pen and paper notes to play the game."*
- *"I tried really hard to make sure the ship log doesn't tell you anything you technically don't know."*
- It has **two modes** — map mode (by planet) and rumor mode (*"the detective board, the crazy conspiracy map"*).
- **Crucially, the playtest history:** originally there was **only map mode**, and a playtest *"went very poorly"* — *"players aren't like… it's not clear to players like what this game is essentially."* The rumor board was added in response, and was modelled on the team's **own internal design documents** — *"lines drawn between things."*
- Beachum doubted it would work at full scale (*"I don't think we can do all four curiosities on the same board without it being a complex nightmare"*) — and was wrong; it did.

Corroborated by secondary analysis: the Ship Log "doesn't give you quest markers… it simply acts as an external hard drive for your own memory" ([Zooz engineering analysis](https://engineering.zooz.com/@claudmohe/how-outer-wilds-transcends-ux-to-become-human-experience-3ff41def8f8c)), and progression is knowledge-based with the log flagging "There's more to explore here" ([walkthrough analysis](https://9puz.com/2423-outer-wilds-walkthrough/)).

**What HeadConan should learn — the major item.**

> **The Ship Log is a direct, shipping, award-winning instance of the `(target, aspect)` hypothesis (H2).**

The same accumulated knowledge is rendered **two ways** — spatially (map mode) and relationally (rumor mode) — and the player chooses. Neither is "the page for this scene." They are **two aspects of one dataset**, which is precisely what §2.3 (FA2) argues focus must be able to express, and precisely what `focusedEntityId?: string` cannot.

**What HeadConan should learn — the second item.**

> **The epistemic constraint is enforced at the presentation layer, not only at the data layer.**

"I tried really hard to make sure the ship log doesn't tell you anything you technically don't know." That is a deliberate, effortful design constraint on *what the interface may show*, distinct from what the world state contains. HeadConan's `projectEpistemicPerspective` does this at the data layer. Outer Wilds shows the constraint must also hold at the **presentation** layer — a summary, a hint, or a "there's more to explore here" flag can leak knowledge the user has not earned. **This is a genuine gap in HeadConan's design**, and it is cheap to close: any summary or hint generated for display must pass the same epistemic filter as raw state.

**What HeadConan should learn — the third item.**

> **Cumulative surfaces are not a nicety; they are the instrument.**

The Ship Log exists because requiring the player to take notes would break the game. HeadConan's investigation worlds have exactly the same property — and §5 S4 identified persistence as the real reason navigation needs a distinct surface.

**What HeadConan should NOT copy.**

Outer Wilds withholds guidance almost entirely, and this is **documented to have failed in playtesting** — the map-only ship log "went very poorly" precisely because players could not tell what kind of game it was. The lesson is not "withhold everything"; it is **withhold answers, but never withhold the shape of the activity.** Outer Wilds fixed this by adding a view that revealed *structure* while still withholding *content*. That is the right target, and it is a more nuanced lesson than "no hand-holding."

**Confidence: High** on the designer's account (first-hand) and on the two-mode structure. **Medium** on the generalisations drawn from it.

---

### Case 2 — Return of the Obra Dinn: the Book of Fates

*(Lucas Pope, 2018. IGF Grand Prize, BAFTA for Game Design.)*

| Question | Answer |
| :--- | :--- |
| **1. Primary activity** | Deduction. Identify 60 crew members and determine how each died, from frozen "death memory" dioramas. |
| **2. Primary object of attention** | Alternates between a **scene** (a frozen 3D tableau the player can walk around inside) and the **ledger** (the Book of Fates). |
| **3. What is visible** | The diorama; the ledger with crew manifest, sketches, and player-filled entries; a chapter structure. |
| **4. What is hidden** | Nearly everything else. No tutorial, no hints, no quest markers. |
| **5. What determines interface structure** | The **activity** — and it alternates cleanly between two: *witness* (explore a frozen scene) and *record* (write deductions into a ledger). |
| **6. Stable or transforming?** | Two stable surfaces that alternate. The ledger is **cumulative**; the dioramas are **ephemeral** (each is visited, mined, and left). |
| **7. How does it transition?** | Via the pocket watch (Memento Mortem): touching a corpse enters that person's death memory. Entering and leaving is cheap and reversible. |
| **8. What can HeadConan learn?** | Two things: the **validation gate**, and — more valuable — a documented **failure** to avoid. |
| **9. What should HeadConan NOT copy?** | The rigid interaction vocabulary. See below. |

**Evidence.** The verification system is well documented: the game *"only reveals correct solutions in groups of three"* to prevent brute-forcing; there is *"no hinting, quest markers, or other out-of-context nudging done by the game"*; *"incorrect guesses are never punished directly"*; and memories unlock through a structured chain, so exploration is less open than it first appears ([bit-tech review](https://bit-tech.net/reviews/return-of-the-obra-dinn-review/1); [games.gg](https://games.gg/it/return-of-the-obra-dinn)).

**What HeadConan should learn — the validation gate.**

Confirming deductions **in batches of three** is a genuinely elegant piece of design. It prevents brute-force guessing without punishing error, and it converts validation into a *rhythm* rather than a per-item ledger. For HeadConan this suggests a concrete pattern for the `investigation` case: **do not confirm deductions one at a time.** Confirm them in clusters, so that a single lucky guess cannot substitute for understanding.

**What HeadConan should learn — the failure.** This is the more valuable lesson, and it is a documented criticism rather than a speculation:

> *"Sometimes the player understands what happened but chooses the wrong verb. This creates friction between understanding and system recognition. Knowledge must match system vocabulary exactly."*
> — [GameCliqs analysis](https://gamecliqs.com/blog/return-of-the-obra-dinn-and-the-limits-of-deductive-freedom--when-logic-becomes-constrained-design)

The ledger requires exact phrasing — *"speared by a beast"* versus *"shot by X"* — and near-misses are rejected. The player has achieved the understanding the game wants and is told they are wrong.

**This is Situation 11 in a shipped, award-winning game, and it is a failure.** It is the strongest available evidence for the S11 claim: **a rigid interaction vocabulary converts comprehension failures into system failures.** A system that must match exact verbs will eventually reject a correct understanding — and because the rejection looks like a wrong answer, it is indistinguishable from an actual error.

**Relevance to HeadConan.** HeadConan's `ActionDock` is natural-language-first, which is the right instinct and largely immunises it against this failure. But the warning should be recorded: **anywhere HeadConan introduces a closed vocabulary — action chips, suggestion chips, structured deduction entry — it inherits Obra Dinn's failure mode.** The mitigation is that chips should *suggest* rather than *constrain*, with free text always available.

**Secondary caution.** Obra Dinn's exploration is gated: *"certain corpses cannot be accessed until prerequisite scenes are discovered,"* which the same analysis calls *"hidden rails."* HeadConan, being AI-driven, has a much worse version of this risk available — an LLM that quietly gates content is far less legible than a designed gate. Prefer legible gating.

**Confidence: High** on the mechanics (widely and consistently documented). **Medium** on the criticism's framing (a single critical analysis, though a well-argued one).

---

### Case 3 — Inform 7: the world model, scenes, and the missing narrator

*(Graham Nelson et al. Analysed as a **system**, not an experience — the contrast is the point.)*

| Question | Answer |
| :--- | :--- |
| **1. Primary activity** | *(For the author)*: declaring a world and its rules. *(For the player)*: issuing commands to a player character. |
| **2. Primary object of attention** | The **model world** — rooms, objects, containment, and the current room description. |
| **3. What is visible** | Whatever the room description and the response to the last command expose. |
| **4. What is hidden** | Everything not yet discovered, by convention rather than by mechanism. |
| **5. What determines interface structure** | **Nothing.** There is no interface structure. Inform 7 produces a text stream. The entire presentational burden is carried by prose. |
| **6. Stable or transforming?** | Entirely stable: one text transcript. |
| **7. How does it transition?** | Scenes — see below. But scenes change the **world**, not the **presentation**. |
| **8. What can HeadConan learn?** | The scene model (§3E2) and the content/expression split (§3E1). |
| **9. What should HeadConan NOT copy?** | The absence of a presentation layer. It is Inform 7's acknowledged central deficiency. |

**Evidence.** Primary documentation inspected: [*Writing with Inform* §10.2](http://inform7.com/book/WI_10_2.html), [§10.3](https://inform7.com/book/WI_10_3.html), and the [Inform 7 Handbook](http://inform-7-handbook.readthedocs.io/en/latest/chapter_8_time_&_scenes/scenes/). Montfort's analyses at [nickm.com](http://www.nickm.com/if/toward.html) and [nickm.com/if/fourth_era.html](http://www.nickm.com/if/fourth_era.html).

**The three lessons, restated compactly because their full treatment is in §3E:**

1. **Scenes are untyped and condition-cued**, carrying entry/exit rulebooks. `Train Stop begins when the player is in the Station for the third turn.` There is no `sceneType`. This is the strongest precedent against HeadConan's six-member enum.
2. **Scenes change the world, not the presentation.** *"When the scene begins, our imaginary stage-hands wheel in a steam train."* Entry effects are world effects. The presentation is not mentioned.
3. **Inform 7's acknowledged weakness is exactly HeadConan's strength.** Montfort: interactive fiction *"has not been organised to incorporate"* the content/expression distinction; text fires off as events happen, making reordering, flashback and re-perspectivising *"extremely difficult."*

**The synthesis — and it is the most important thing in this case study:**

> **HeadConan's four-layer separation is architecturally ahead of interactive fiction.** Montfort proposes as a research programme what HeadConan already has as a layering. The correct response is therefore not to copy IF, but to **recognise that layers 1–3 are validated by a field that spent forty years getting there — and that layer 4 is where all of HeadConan's remaining risk lives.**

**Confidence: High.** Primary sources inspected.

---

### Case 4 — Versu: social practices as a world model

*(Richard Evans & Emily Short, Linden Lab. **Shut down 2014; games never released.**)*

| Question | Answer |
| :--- | :--- |
| **1. Primary activity** | Social interaction with simulated characters. |
| **2. Primary object of attention** | The social situation — who wants what, and who is willing to say what in front of whom. |
| **3. What is visible** | A choice-based interface offering actions *"drawn from the world model at that moment, from taking a bold stand to giving someone a significant sideways glance."* |
| **4. What is hidden** | Characters' internal wants and the evaluation that produced the option list. |
| **5. What determines interface structure** | **The social model**, moment by moment. The option set is computed from what is currently socially possible. |
| **6. Stable or transforming?** | Stable in structure, continuously transforming in content. |
| **7. How does it transition?** | Not by scene — by **social state**. When the social configuration changes, the available actions change. |
| **8. What can HeadConan learn?** | That Situation 3 is a **model** property, not a presentational one. |
| **9. What should HeadConan NOT copy?** | The authoring approach — it was too expensive, and the project died. |

**Evidence.** Emily Short, [*Introducing Versu*](https://emshort.blog/2013/02/14/introducing-versu/) (primary). The emergent behaviour, in her words:

> *"Late in testing, one of my characters was talking to another in confidence when a third party wandered in. Because the speaker didn't feel comfortable around that third person, he fell silent and didn't continue the conversation — there was an awkward pause and dialogue moved on to other things. **I'd never written the 'awkward pause when X walks in on a private conversation' outcome** — just an engine that knew when the characters would be willing to discuss those topics, and also that it was awkward for someone to stop talking about a conversation topic when others were expecting them to go on."*

Post-mortem: Linden Lab shut down development and declined to sell back the codebase; *Blood and Laurels* (~240,000 words, of which Short estimated a single playthrough shows *"something less than 10 percent"*) was never released ([Gamasutra / Game Developer](https://www.gamedeveloper.com/business/the-end-of-versu-emily-short-looks-back)). Authoring was initially done in a language called Praxis, in which writing dialogue was *"essentially wrapping conversational elements in code — a high-friction way to compose, and one that discouraged revision"*; a DSL called Prompter was built to address this, organised around **scenes** with parameters, scene-local dialogue, and defined endings ([Emily Short, mailbag](https://emshort.blog/category/quality-based-narrative/page/2/)).

**What HeadConan should learn.** Two things, and they pull in opposite directions:

1. **The decomposition is validated.** Situation 3 — one of the six hardest in §5 — was produced *emergently* by a social model, not authored as a presentational case. This is the strongest available evidence that the hard situations belong in the world model.
2. **The authoring economics killed it.** Versu's model was expressive enough to be worth building and too expensive to author for. Note that the fix they built — Prompter — organised authoring around **scenes with parameters and scene-local dialogue**, which is, again, the Inform 7 shape.

**The lesson for HeadConan is specifically about AI.** Versu's authoring cost was high because *humans* had to write the social practices. HeadConan has an LLM. **If an LLM can supply social-practice-level judgement at runtime, Versu's economics invert** — which is a real argument for H4 (AI estimates salience) in its narrow form.

**But the caution is equally real:** Versu died. Do not build Versu. Build the *demonstration's implication* (hard social situations are model properties) using cheaper means.

**Confidence: High** on the demonstration (first-hand author account). **Low** on production viability. **SPECULATION** on the claim that LLMs invert the economics — flagged as such.

---

### Case 5 — A2UI: what the industry decided AI should be allowed to decide

*(Google, with CopilotKit. Apache 2.0. Current production release v0.9.x, v1.0 candidate.)*

| Question | Answer |
| :--- | :--- |
| **1. Primary activity** | *(For the agent)*: describing a UI. *(For the user)*: whatever task the UI serves — booking, configuration, data review. |
| **2. Primary object of attention** | The task. The UI is instrumental. |
| **3. What is visible** | Components the client has pre-approved and renders natively. |
| **4. What is hidden** | Everything not in the catalogue. The agent **cannot** invent components. |
| **5. What determines interface structure** | **The client's catalogue.** The agent selects from a closed set; the client owns styling, layout, security, accessibility. |
| **6. Stable or transforming?** | Streaming and progressive — *"users see the interface building in real-time instead of waiting for complete responses."* |
| **7. How does it transition?** | Message-driven: `createSurface` / `updateComponents` / `updateDataModel`. **Structure and data are separate message types.** |
| **8. What can HeadConan learn?** | The intent/rendering split is shipping, and its precise boundaries. |
| **9. What should HeadConan NOT copy?** | The assumption that surfaces are disposable. See below. |

**Evidence.** Primary specification inspected: [a2ui.org](https://a2ui.org/) and [the specification](https://a2ui.org/introduction/what-is-a2ui).

**What HeadConan should learn — the boundaries, precisely.**

A2UI answers "what should AI decide" with unusual clarity, and the answer is narrower than most people assume:

| The agent decides | The client decides |
| :--- | :--- |
| Which components, from a closed catalogue | What components exist |
| Component nesting and ID references | Layout, geometry, styling |
| The data bound to each component | Rendering, accessibility, security |

**The agent does not decide layout, hierarchy, or appearance.** It decides *what components, with what data.* That is a semantic-intent/rendering split in production, at scale, across React / Angular / Flutter / Lit / native.

**This is a direct, shipping corroboration of §4.6 and H4.** It also means HeadConan does not need to invent a protocol — if AI ever participates in selection, **A2UI-shaped boundaries are the right shape.**

**What HeadConan should NOT copy.** Every A2UI example is a **disposable, task-shaped artifact** — a booking form, a restaurant card, a chart. The protocol has no concept of a surface that persists across a session and accumulates user state. HeadConan's evidence board, map, and archive are the opposite: **cumulative and long-lived.** Adopting A2UI's boundaries does not mean adopting its lifecycle assumptions, and the protocol would need extension for cumulative surfaces.

**Confidence: High** on what A2UI is. **Medium** on the recommendation (**INFERENCE**).

---

### Case 6 — Jelly & Semantic Guidance: the research frontier converges on an intermediate layer

*(Cao, Jiang & Xia, CHI 2025; Park et al., CHI 2026.)*

| Question | Answer |
| :--- | :--- |
| **1. Primary activity** | Generating and then iteratively refining a UI for an information task. |
| **2. Primary object of attention** | The user's own intent, made explicit. |
| **3. What is visible** | The generated interface **and** the semantic representation behind it. |
| **4. What is hidden** | Nothing, deliberately — the design goal is to make the intermediate representation inspectable. |
| **5. What determines interface structure** | **A task-driven data model** — entities, relationships and structured data describing the intended task — mapped to UI specifications. |
| **6. Stable or transforming?** | Malleable and persistent: *"malleable but persistent structures."* |
| **7. How does it transition?** | Continuous prompting with traceable history, plus direct manipulation, with both translated into changes in the underlying model. |
| **8. What can HeadConan learn?** | The convergence itself — see below. |
| **9. What should HeadConan NOT copy?** | The assumption that the user must articulate intent explicitly. |

**Evidence.** [Jelly, CHI 2025](https://dl.acm.org/doi/abs/10.1145/3706598.3713285) — proposes task-driven data models as the foundation for UI generation, with users modifying via natural language *and* direct manipulation, changes translated back into the model. [Bridging Gulfs in UI Generation through Semantic Guidance, CHI 2026](http://ar5iv.labs.arxiv.org/html/2601.19171) — identifies that users struggle both to articulate design intent and to evaluate generated output, and proposes **explicit semantic representations as an intermediate layer between human intent and AI output.**

**What HeadConan should learn — the convergence.**

Two independent systems, from different groups, in consecutive years, arrived at the **same architecture**:

```
intent → semantic intermediate representation → UI
```

Neither lets the model go from prompt to pixels. Both found that the intermediate layer is what makes generation *controllable* and *interpretable*.

**This is the strongest available external corroboration of the report's central structural claim** (§4.6): the tractable abstraction is a semantic intermediate layer, not a set of rendered outputs. HeadConan's equivalent is `(focus, frame)` plus `WorldStyle`. That a separate field independently converged on this shape is meaningful support for H1 — **not proof, but more than coincidence.**

**What HeadConan should NOT copy.** Both systems require the user to articulate intent. HeadConan usually *cannot* — the user is exploring, and does not know what they want (§4.1, verdict 2). HeadConan's selection must work when intent is absent, which is why dramatic salience (§4.3, Missing 5) has no counterpart in this research. **This is a genuine gap between the research frontier and HeadConan's requirements, not a gap that HeadConan can close by copying.**

**Confidence: Medium-High.** Peer-reviewed CHI papers; abstracts and structure inspected, full texts not read in detail.

---

### 4.7 Cross-case synthesis

Five findings hold across all six systems:

| Finding | Present in |
| :--- | :--- |
| **Cumulative surfaces are load-bearing, not decorative** | Outer Wilds (ship log), Obra Dinn (ledger), Jelly (persistent structures) |
| **The same data rendered two ways is a real and valuable pattern** | Outer Wilds (map / rumor), Jelly (switching representations) |
| **A bounded component or surface vocabulary is what makes variety tractable** | A2UI (catalogue), Obra Dinn (fixed fate vocabulary), Inform 7 (fixed verb set) |
| **A semantic intermediate layer sits between intent and rendering** | A2UI (structure vs data messages), Jelly & Semantic Guidance (data models / semantics), Inform 7 (world model vs narration) |
| **Rigid vocabularies fail at the boundary of comprehension** | Obra Dinn (exact-verb rejection), IF generally (boilerplate responses to unanticipated verbs), LLM roleplay (confabulation) |

And two notable **absences** across all six:

1. **None supports a null or diffuse focus.** Every system assumes an active object of attention. Situation 9 (casual social immersion) has no precedent in any of them — which corroborates the finding that HeadConan's `everyday` case is genuinely unhandled rather than merely underspecified.
2. **None has a participation dimension.** Goffman's standing appears in none of the six. Versu comes closest, modelling who is willing to say what in front of whom — but as an emergent property of its social model, not as an explicit presentational dimension.

> These two absences are the clearest indication that **HeadConan is attempting something for which no examined system provides a complete precedent.** That is worth stating plainly: the research surveyed here does not contain a solved version of HeadConan's problem. It contains strong partial precedents and one well-validated structural shape.
## 4A. The Critical Conceptual Investigation

> **Placement note.** The brief's deliverables list nine sections; this investigation is not one of them, but the brief calls it "one of the most important parts of the research." It is placed here — after the cross-disciplinary findings and case studies, before the stress test — because that is its logical position: **survey first, then decide which distinctions are real, then test them.**
>
> The brief supplies six candidate categories and asks which are necessary, which merge, which are false, and which are missing. This section answers that directly.

### 4.1 Verdict on the six proposed categories

| # | Proposed category | Verdict | Reasoning |
| :-- | :--- | :--- | :--- |
| 1 | **WORLD STATE** | **Necessary — but not a presentation-layer concern** | Already solved and well-solved. `WORLD_REPRESENTATION.md` layers 1–3 (Definition / State / Dynamics) are the strongest part of the current architecture and the audit confirms them as sound. World state is the **substrate** the presentation layer reads, not a dimension *of* the presentation layer. Keep it, keep it separate, do not let presentation leak back into it. |
| 2 | **USER GOAL** | **Necessary but demoted — and structurally unreliable here** | Goal operates on a slow timescale (minutes) and is one *input* to salience. Critically: **in HeadConan the goal is frequently absent.** The user is exploring, browsing, or idling. A selection function keyed on user goal has no defined behaviour in precisely the situations that most characterise an imagined world (S9). Keep as an input; require an explicit fallback. |
| 3 | **ATTENTION / FOCUS** | **Necessary and under-specified — needs the (target, aspect) split** | The single most load-bearing category, and the one currently modelled most thinly (`focusedEntityId?: string`). A target alone cannot distinguish *what a character is saying* from *what they know* from *who they are connected to*. See §2.3 False Assumption 2. |
| 4 | **INTERACTION** | **Partly false — the verb set is derived, not a state** | "What the user is doing" is not an independent dimension. The available verb set is a function of `(focal target's capabilities, participation status, role capabilities, action preconditions)` — and `WORLD_REPRESENTATION.md`'s `WorldDynamics` layer already defines action preconditions, capabilities, and permissions. Nothing new is needed. **Interaction *modality* (text vs. direct manipulation vs. spatial gesture) is a genuine rendering decision**, but that belongs to Q2, not to the state model. |
| 5 | **INFORMATION FORM** | **Largely a false distinction — it is derived, not chosen** | See §4.2. This is the most consequential finding in this section. |
| 6 | **PRESENTATION** | **Necessary — but it is the *output*, and treating it as an input is the root error** | Presentation is the codomain of the function, not a dimension of its domain. Every time the architecture reaches for a presentation-side label (`sceneType`, `stageMode`) as a way of describing the situation, it re-commits the `scene type = page type` error that this research was commissioned to test. |

### 4.2 "Information form" is derived, not chosen — the key merge

The brief proposes `INFORMATION FORM` as a dimension with values: *Dialogue? Space? Object? Document? Relationship? Timeline?*

**Every one of these is an entity type that already exists in HeadConan's own ontology.** Mapping them:

| Proposed "information form" | Actual referent | Exists in HeadConan's ontology as |
| :--- | :--- | :--- |
| Dialogue | An agent's discourse | `Character` / `Agent` entity |
| Space | A place and its layout | `Location` entity |
| Object | A physical thing | `Object` / artifact entity |
| Document | A text-bearing artifact | `Object` with text, or `WorldDocument` |
| Relationship | A relation between entities | `Relationship` / `PowerRelation` |
| Timeline | A sequence of events | `Event` / `TimelineEvent` collection |
| *(omitted)* | An aggregate with state variables | `Faction` / `Organization` — needed for S8 |

`WORLD_REPRESENTATION.md` §2A already enumerates the ontology as "Character, Agent, Organization, Location, Object, Resource, Concept." **The "information form" list is that ontology, rediscovered.**

**Therefore: information form is not an independent dimension. It is entailed by the ontological type of the focal target.** Merging it removes a whole category from the model and — more importantly — removes the temptation to build one surface per form.

#### The caveat that keeps the merge honest

Type alone does not fully determine form. A character can legitimately be rendered as dialogue, as a dossier, as a portrait, or as a node in a graph. What differs between those is the **aspect** under examination. So the correct entailment is:

```
rendering ≈ g(ontological_type(focal_target), aspect)
```

not `g(ontological_type)` alone. This is why §4.1 verdict 3 insists that focus is a pair. The pair `(target, aspect)` carries everything "information form" was trying to carry, plus more, with one fewer category.

**Residual authorial input:** a world's presentational grammar (`WorldStyle`) may legitimately *prefer* one aspect for a given type — a forensic world defaults documents to "examine," a court-intrigue world defaults characters to "what do they know." That is a **default**, not a category, and it belongs in `WorldStyle` where HeadConan already has a place for it.

### 4.3 Missing dimensions

Four dimensions absent from the brief's list did real work in the stress test (§5), and two more are needed for completeness. These are the highest-value output of this section.

---

#### MISSING 1 — **FRAME** *(the most important omission)*

**Definition.** The slow-changing context within which focus moves: place, participants, tempo, stakes, agency scale, epistemic lens.

**Why it is necessary.** Six of the twelve stress situations are only describable with it (S2, S3, S5, S10, S12 — and S1 by contrast). In each, **the focus changed while the frame did not, and the user's orientation depended entirely on the frame staying put.**

**Why it is not reducible to WORLD STATE.** The frame is not the world state; it is a *selection* from world state — specifically the subset that is (a) relevant to the user's current situation and (b) slow-changing enough to be worth holding constant. Most of world state is neither.

**Testable claim (I1, §5.13.3):** the frame changes an order of magnitude less often than the focus. If that fails empirically, the distinction is not worth its complexity — which is what makes this a falsifiable hypothesis rather than an architectural preference.

**Relationship to the current design.** `SCENE_MODEL.md`'s `scene` is the closest existing construct, and §4.1 argues it is the right *shape* but the wrong *granularity and mechanism*. The frame is what the scene should have been: condition-triggered, temporally scoped, carrying entry/exit effects — **but without a type.**

---

#### MISSING 2 — **PARTICIPATION**

**Definition.** The user's standing in the current encounter: ratified participant, bystander, overhearer, eavesdropper, director, architect.

**Source.** Goffman's participation framework (*Forms of Talk*, 1981) provides the established vocabulary: ratified vs. unratified participants, bystanders, overhearers, eavesdroppers, and the subordinate states of byplay, crossplay and sideplay. [Secondary source with direct quotation of Goffman 1979/1981](https://www.researchgate.net/publication/266149322_Participation_framework_revisited_(New)_media_and_their_audiencesusers).

**Why it is necessary.** Situations 3 and 6 turn entirely on it, and neither is describable as a change in world state, goal, focus, or interaction. In S6 (observing without participating) *nothing changed except standing* — yet the verb set collapses and the dramatic meaning inverts.

**Why it is especially valuable.** It is cheap. Participation status is a small enum with a large effect on the derived verb set, and it makes the transition *out* of a status (intervening, being noticed) a first-class dramatic event rather than an accident.

---

#### MISSING 3 — **PERSISTENCE** (ephemeral vs. cumulative)

**Definition.** Whether a surface accumulates durable user-generated state, or merely renders current world state and discards.

**Why it is necessary.** It is the real reason S4 (navigation) and S8 (command) need distinct surfaces — not genre. A map remembers where you have been; a corkboard remembers the links you drew; a conversation transcript scrolls away. **This is an engineering property with direct presentational consequences**, and it is invisible in every taxonomy built from genre or activity.

**Practical consequence.** Cumulative surfaces need identity, persistence, and spatial memory (where did I put that pin?). Ephemeral surfaces need none of it. Conflating the two is a reliable way to build a system that forgets the user's work.

---

#### MISSING 4 — **TEMPO** (temporal dynamics)

**Definition.** Is time moving? Who advances it — the user, or the world? Can the interface interrupt?

**Why it is necessary.** S5 (reading) and S7 (deciding) are tempo changes more than anything else. Both are correctly handled as tempo modulations rather than scene changes, and both break if tempo is not represented.

**Why it is remarkable that it is missing.** For a system about *inhabited worlds*, the absence of time from the candidate category list is striking. `WORLD_REPRESENTATION.md` models a temporal clock at the data layer; the presentation layer does not consume it.

---

#### MISSING 5 — **DRAMATIC SALIENCE**

**Definition.** What is significant right now, *independent of the user's goal* — because it is a secret, a turning point, a lie, an anomaly, an unanswered question.

**Why it is necessary.** This is the fallback that USER GOAL needs. When the user has no goal (S9, and much of ordinary exploration), selection must still be driven by *something*. Standard salience models from cognitive science offer two drivers: **bottom-up** (motion, contrast, sudden onset — studied in vision science) and **top-down** (goal-directed, task-relevant). Neither covers "this matters because it is a secret."

**Where it comes from.** This third driver is what directors use. It has no home in the cognitive-science literature surveyed here, and it is arguably the defining competence of narrative presentation. It is also where an LLM may genuinely have something to offer — not by generating markup, but by *estimating dramatic significance* from the world state, which is a semantic judgement rather than a design one.

> **Speculation flag.** That an LLM can estimate dramatic significance reliably is **untested**. It is a promising division of labour (AI estimates significance; deterministic code decides layout), but it is a hypothesis, not a finding. See H4.

---

#### MISSING 6 — **AGENCY SCALE**

**Definition.** Individual action versus institutional command.

**Why it is necessary.** S8 (managing a group) is genuinely different, and the reason is that the focal object changed from *entity* to *aggregate/system*. Aggregates have state variables rather than faces; they need a different surface. Scale is the dimension that predicts this jump.

---

### 4.4 EPISTEMIC LENS — present but mis-categorised

HeadConan already models this, and models it well: `WORLD_REPRESENTATION.md`'s six visibility scopes, `Fact` / `Belief` / `SecretItem` / `RumorItem`, and `projectEpistemicPerspective`. The audit flags it as sound. It does not appear in the brief's candidate list at all.

**The correction is not to add it but to re-categorise it.** The epistemic lens is **not a dimension of presentation** — it is a **hard constraint that filters before selection**. `PRESENTATION_MODEL.md` already places it first in the pipeline, ahead of the attention scorer, which is correct.

Restating it here serves one purpose: **it must not be regressed.** If the presentation layer is ever allowed to see unfiltered world state, the information-asymmetry guarantee — described in `NEXT_AGENT_HANDOFF.md` as a "design invariant" — fails, and with it the dramatic-irony capability that most distinguishes HeadConan from a chatbot.

### 4.5 Revised model: from six categories to six dimensions

| | Brief's proposal | Revised proposal |
| :-- | :--- | :--- |
| 1 | World State | *(substrate — unchanged, already correct)* |
| 2 | User Goal | **Salience inputs** = user goal ∪ dramatic salience ∪ bottom-up cues |
| 3 | Attention / Focus | **FOCUS** = *(target, aspect)*, nullable |
| 4 | Interaction | *(derived — verb set = f(target, participation, role, preconditions))* |
| 5 | Information Form | *(derived — from ontological type + aspect)* |
| 6 | Presentation | **PRESENTATION** = *output* of (focus, frame) → composition |
| — | *missing* | **FRAME** |
| — | *missing* | **PARTICIPATION** |
| — | *missing* | **PERSISTENCE** |
| — | *missing* | **TEMPO** |
| — | *missing* | **AGENCY SCALE** |
| — | *mis-categorised* | **EPISTEMIC LENS** → hard pre-filter, not a dimension |

Same count — six — but a materially different cut. The differences that matter:

1. **Two categories collapsed** (Interaction, Information Form) because both are derived.
2. **One category demoted** (User Goal) because it is unreliable in this domain and needs a fallback.
3. **One category promoted to a constraint** (Epistemic Lens) rather than a dimension.
4. **Five dimensions added**, of which FRAME is the one the whole transition story rests on.

### 4.6 The compression this buys

Stated concretely, because this is the practical payoff:

- **Renderers are bounded by ontology.** The number of distinct surfaces scales with the number of *kinds of thing* in the world (agent, place, object, document-as-text, relation, aggregate, sequence) — roughly six or seven — **not** with the number of situations, which is unbounded.
- **Situations are unbounded but free.** Any situation is a `(focus, frame)` pair; no new code is needed for a new situation.
- **Variety comes from composition, not from types.** Identical primitives, differently arranged and differently clothed by `WorldStyle`, produce experiences that read as radically different while sharing all machinery.

That is the escape from both failure modes, and it is the mechanism the hypotheses in §7 are designed to test.

**What would break it:** situations that resist description as `(focus, frame)` pairs. Twelve were tested and none did — but S8 (aggregates) and S12 (split attention) came closest, and S12 was resolved only by *deciding not to support* true split attention. That is a real limit, not a solved case, and it should be recorded as such.
## 5. The 10 Situation Stress Test

### 5.0 Analytic vocabulary

§4A derives the following dimensions from the research. They are stated once here and reused throughout, so that the twelve analyses below are directly comparable:

| Dimension | Question it answers | Change rate | Values observed below |
| :--- | :--- | :--- | :--- |
| **FOCUS** = *(target, aspect)* | What is the user attending to, and *what about it*? | Fast (seconds) | nullable; `(character, discourse)`, `(object, physical)`, `(document, text)`, `(location, layout)`, `(group, system-state)`, … |
| **FRAME** | Stable context: place, participants, tempo, stakes, agency scale, epistemic lens | Slow (minutes) | mostly persists across focus changes |
| **PARTICIPATION** | What is the user's standing in the encounter? | Medium | `ratified participant`, `bystander`, `overhearer`, `eavesdropper`, `director`, `architect` |
| **PERSISTENCE** | Does this surface accumulate user-generated state? | Structural | `ephemeral` / `cumulative` |
| **VERB SET** | What can be done right now? | Derived | computed, never authored per situation |
| **SURFACE HIERARCHY** | One stage + bounded periphery | Structural | 1 stage + ≤3–4 peripheral slots |

Twelve situations are analysed: the ten from the brief, plus two added because they expose limits the original ten do not (S11, S12).

---

### Situation 1 — Private conversation with a character

| | |
| :--- | :--- |
| **What is actually happening?** | Turn-taking dialogue. Two ratified participants, co-present, sharing a private epistemic frame. Real-time tempo. |
| **What dominates attention?** | The character, aspect = *what they are saying and what they mean* (subtext, intent). |
| **What stays peripheral?** | The room, the time of day, the user's inventory, other characters' whereabouts, the world's macro state. |
| **What interaction is available?** | Speak, ask, press, offer, concede, observe their reaction, end the conversation. |
| **Does this need a fundamentally different presentation?** | **No.** |
| **Why?** | Structurally this is `FOCUS = (character, discourse)` inside `FRAME = {2-party, ratified, real-time, private}`. Nothing about it conflicts with reuse. The distinctiveness the user *feels* comes from content and from the world's presentational grammar (`WorldStyle`), not from structural novelty. Building a dedicated `conversation` surface is defensible as a *renderer*, but not because the situation demanded a category. |

**Note on what is genuinely special here:** tempo. Conversation is one of the few situations where the world advances in *turns the user controls*. That is a FRAME property (tempo = user-paced, turn-based), and it is worth capturing because it determines whether the interface may interrupt.

---

### Situation 2 — During the conversation, the user notices a possible-evidence object

| | |
| :--- | :--- |
| **What is actually happening?** | The focus **splits** while the frame **persists**. Critically, the conversation is *suspended, not ended* — the other party still has a pending turn, still holds the floor, and is still watching. |
| **What dominates attention?** | The object, aspect = *its examinable physical properties*. |
| **What stays peripheral?** | The character — but **not gone.** The character must remain perceptibly present and must remain aware that the user has stopped attending. |
| **What interaction is available?** | Examine, pocket, ask the character about it, conceal the examination, or drop it and return to the conversation. |
| **Does this need a fundamentally different presentation?** | **No — and this is the decisive test case in the entire set.** |
| **Why?** | This is the situation that discriminates between architectures. Any design in which `conversation` and `investigation` are two *types* must answer "which one are you in?" — and **both answers are wrong**, because the user is in both simultaneously. The correct description is: *frame unchanged, focus shifted, prior focus retained in suspension.*<br><br>There is a hard cognitive argument as well. Working-memory capacity for independent chunks is approximately **3–5 items in young adults** (Cowan, 2010; see §3B). If the conversation is torn down and replaced by an investigation screen, the user must now hold the conversational context *in their head* — consuming two or three of those precious slots on material the system could have carried in the frame instead. |

> **Design implication (highest confidence in this report): the frame must be able to carry a suspended interaction, and the character must remain visible while attention is elsewhere.** This single requirement eliminates hard scene replacement as a general transition mechanism. See §6.

---

### Situation 3 — Another character enters unexpectedly

| | |
| :--- | :--- |
| **What is actually happening?** | The **participation structure changes from two to three.** The topic does not change. The epistemic frame does: things that were sayable a moment ago are no longer sayable. |
| **What dominates attention?** | Unchanged — still the conversation. But the newcomer captures attention briefly and involuntarily (sudden onset is a powerful bottom-up attention cue — see §3B). |
| **What stays peripheral?** | The newcomer, after the initial orienting response — but they must remain *visibly* present, because their presence is now a constraint on everything said. |
| **What interaction is available?** | Acknowledge, include them, pointedly exclude them, continue as if they were not there, watch their reaction, change topic. |
| **Does this need a fundamentally different presentation?** | **No. This is a FRAME change, not a FOCUS change.** It warrants peripheral expansion and a verb-set change — not stage replacement. |
| **Why?** | Strong direct evidence exists for treating this as a world-model property rather than a presentational one. **Versu** (Richard Evans & Emily Short) produced exactly this behaviour *emergently*: during testing, a character was speaking in confidence when a third party wandered in; because the speaker was not comfortable around that person, he fell silent — producing an awkward pause that **no author had written.** As Emily Short documents, the outcome fell out of a model that knew when characters would be willing to discuss a topic, and that stopping mid-conversation is awkward ([emshort.blog, 2013](https://emshort.blog/2013/02/14/introducing-versu/)).<br><br>That is the strongest available proof that Situation 3 is **expressible in the social model** and does not require a presentational category. The presentation's job is only to make the change in constraints legible. |

**Caveat, stated honestly:** Versu's engine was shut down with Linden Lab and its games were never released; the toolchain was reportedly difficult ([Gamasutra/Game Developer interview, 2014](https://www.gamedeveloper.com/business/the-end-of-versu-emily-short-looks-back)). The *demonstration* is real and documented; the *production viability* of that approach is not established. Do not over-read this as "build Versu."

---

### Situation 4 — Navigating a physical environment

| | |
| :--- | :--- |
| **What is actually happening?** | The user moves through space. Continuous tempo. Partial knowledge: there is known space, unknown space, and space the user merely believes they know. |
| **What dominates attention?** | The location, aspect = *layout — what is where, and where can I go*. |
| **What stays peripheral?** | Entities present, immediate danger, elapsed time, the user's objective. |
| **What interaction is available?** | Move, look closer, enter, approach, avoid, mark, backtrack. |
| **Does this need a fundamentally different presentation?** | **Yes — but the reason is PERSISTENCE, not genre.** |
| **Why?** | This is the first situation where the surface must hold **durable user-generated state**: explored/unexplored regions, dropped pins, annotations, routes taken. The surface is *cumulative*, not a rendering of instantaneous world state. Nothing in the current `UIBlock`/`stageMode` model expresses the distinction between a surface that remembers and a surface that doesn't — and that distinction turns out to matter more than the distinction between a map and a corkboard.<br><br>Note also that this is the clearest case for the *spatial* renderer, and the reason is mundane: the focal entity's aspect (`layout`) has spatial structure, so the representation should too. That is a **rendering** argument (Q2), not a **selection** argument (Q1). |

---

### Situation 5 — The user discovers a secret document

| | |
| :--- | :--- |
| **What is actually happening?** | Two things at once: an **epistemic event** (something becomes known that was not known a moment ago) and a **tempo change** (reading pauses the world). |
| **What dominates attention?** | The document, aspect = *its text* — and, inseparably, *the fact that it was hidden*. |
| **What stays peripheral?** | Deliberately minimised: nearly everything. Reading is one of the few activities where a *narrow* presentation is correct. |
| **What interaction is available?** | Read, re-read, annotate, store, link to other entities, act on it, conceal having read it. |
| **Does this need a fundamentally different presentation?** | **No. It is best modelled as a temporary overlay plus a tempo modulation — not a scene change.** |
| **Why?** | If discovering a document is a *scene change*, then by implication the conversation the user was having has ended. It has not (see S2). The correct model: the world's tempo pauses, the document takes the stage temporarily, and on dismissal the prior composition is restored intact.<br><br>The genuinely new element is **epistemic**: the document should be recorded as acquired knowledge and should alter what is *sayable and discussable* elsewhere. That is a world-state consequence that the presentation must reflect, not a presentational category. `WORLD_REPRESENTATION.md` already models this correctly at the data layer (visibility scopes, `SecretItem`) — the presentation layer simply needs to consume it.<br><br>Secondary property: the document joins a **cumulative** archive (see S4). |

---

### Situation 6 — Observing an event without directly participating

| | |
| :--- | :--- |
| **What is actually happening?** | The user is present at an encounter **in which they are not a ratified participant.** They are watching, not taking part — and may or may not be *supposed* to be watching. |
| **What dominates attention?** | The event itself. |
| **What stays peripheral?** | The participants, the setting, and — importantly — **the user's own concealment status.** |
| **What interaction is available?** | Watch, listen, remember, note, leave, and **intervene** (which is not merely an action but a *change in participation status*). |
| **Does this need a fundamentally different presentation?** | **No — but it requires a dimension the current model entirely lacks: PARTICIPATION.** |
| **Why?** | Goffman's participation framework (*Forms of Talk*, 1981) provides precise, well-established vocabulary for exactly this, and it is absent from every HeadConan document reviewed. Goffman decomposes the naive "speaker/hearer" pair into **ratified participants**, **bystanders**, **overhearers**, and **eavesdroppers**, plus subordinate states of *byplay*, *crossplay*, and *sideplay* ([secondary exposition with direct quotation](https://www.researchgate.net/publication/266149322_Participation_framework_revisited_(New)_media_and_their_audiencesusers)).<br><br>What changes in Situation 6 is **not** the focus and **not** the frame. It is the user's *standing*. And standing determines the verb set almost entirely: an eavesdropper cannot ask a question without becoming a ratified participant, and that transition is itself the dramatic thing.<br><br>This is the cleanest example in the set of a genuinely necessary dimension that the brief's candidate list omitted. |

> **Practical consequence:** the interface must be able to *state* the user's participation status, and must make the transition out of it (intervening, being noticed) legible and consequential. That is a small, cheap, high-value piece of design that no scene taxonomy would have produced.

---

### Situation 7 — The user must make a high-stakes decision

| | |
| :--- | :--- |
| **What is actually happening?** | Tempo dilates. Stakes and irreversibility rise. The user's need shifts from *perceiving* and *comprehending* to **projecting**. |
| **What dominates attention?** | The choice and its **projected consequences**. |
| **What stays peripheral?** | Everything else — and the periphery should **actively contract**, not merely stay put. |
| **What interaction is available?** | Choose, deliberate, seek more information, consult, defer, abstain. |
| **Does this need a fundamentally different presentation?** | **No. It is a *constriction* of the same composition, plus one specific added affordance: consequence projection.** |
| **Why?** | Endsley's situation-awareness model (1995) distinguishes three levels: **L1 perception** of elements, **L2 comprehension** of their meaning, and **L3 projection** of their future status ([Endsley's definition](https://www.nationalacademies.org/read/6173/chapter/9); model summary widely reproduced). Situation 7 is distinguished precisely by demanding **L3**.<br><br>That yields a concrete, non-obvious design requirement that no layout taxonomy would surface: *a high-stakes decision is not a moment for a dramatic new screen; it is a moment for a projection affordance and a narrowed field.* The interface should show "if you do X, then…" — and should remove distractions rather than add emphasis.<br><br>This is a case where the cognitive-science framing produces a better design requirement than the presentational framing does. |

---

### Situation 8 — The user is managing or commanding a group

| | |
| :--- | :--- |
| **What is actually happening?** | The **scale of agency** jumps from individual action to institutional command. |
| **What dominates attention?** | **The group as a system** — an aggregate with state variables (morale, cohesion, resources, disposition) — *not* any individual member. |
| **What stays peripheral?** | Individual members (available on drill-down), resources, opposing groups. |
| **What interaction is available?** | Order, assign, allocate, inspect, promote, dismiss, reorganise, negotiate with the group as a body. |
| **Does this need a fundamentally different presentation?** | **Yes — and this is one of very few cases where a genuinely distinct surface primitive is justified.** |
| **Why?** | The justification is ontological, not generic: **the type of the focal object has changed** from entity to aggregate/system. An aggregate has no portrait, no dialogue, no location in the same sense an individual does. It requires a surface that represents *state variables and their relationships* rather than *a particular*.<br><br>Note carefully what this implies about the shape of the answer: **the set of surfaces is keyed to the ontological type of the focal object, not to the genre of the situation.** That is the mechanism by which HeadConan can escape both failure modes — a bounded set of renderers (one per ontological kind) combined with an unbounded set of situations. |

---

### Situation 9 — The user is casually living inside a social environment

| | |
| :--- | :--- |
| **What is actually happening?** | Nothing in particular. Attention is **diffuse** across many weak signals: ambient chatter, the weather, people passing, small routines. |
| **What dominates attention?** | Nothing — or a very weak composite. **This is the `FOCUS = null` case.** |
| **What stays peripheral?** | Everything, simultaneously, weakly. |
| **What interaction is available?** | Open-ended, low-consequence: linger, chat, browse, people-watch, idle, drift toward something. |
| **Does this need a fundamentally different presentation?** | **No — but it requires the model to admit a null focus, and it currently does not.** |
| **Why?** | `SCENE_MODEL.md` defines an `everyday` scene, but `LAYOUT_GRAMMAR.md` and `PRESENTATION_MODEL.md` define **no corresponding stage mode** (see False Assumption 6, §2.3). The diffuse case is unrepresented in the rendering layer.<br><br>The risk is concrete: a focus-selection architecture that assumes a focus always exists will **thrash** here — promoting and demoting surfaces every turn as weak signals jostle, producing exactly the "everything screams at once" failure that `LAYOUT_RESEARCH.md` correctly identifies as the dashboard failure mode. An explicit ambient/diffuse state with a *high bar for promotion* is the fix, and it is cheap.<br><br>There is also a quality argument: this is the situation where **ambient** signals carry the experience, and where over-structuring destroys precisely the quality being sought. The correct design move is subtraction, not addition. |

---

### Situation 10 — The user suddenly changes focus from a character to an object, relationship, location, or historical event

| | |
| :--- | :--- |
| **What is actually happening?** | Focus moves, discontinuously and under user control. **The frame does not change** — the user is still in the same place, with the same people, at the same moment. |
| **What dominates attention?** | The new target, under its new aspect — which may require a different renderer (a historical event wants a timeline; a relationship wants a graph). |
| **What stays peripheral?** | The previous target, which **must remain reachable** — the user needs a return path. |
| **What interaction is available?** | Derived from the new target and the user's role capabilities. |
| **Does this need a fundamentally different presentation?** | **The stage changes; the composition does not.** |
| **Why?** | This is the load-bearing case for constraint **C3 (continuity of orientation)** from §2.1. The invariant is:<br><br>> **Frame continuity across focus discontinuity.**<br><br>After any focus change, the user must still be able to answer four questions without searching: *where am I, who is present, what was I just doing, and what did I just learn.* If the mechanism for changing focus destroys any of those, the architecture has traded C3 for C2 at an unacceptable rate.<br><br>This is also the direct argument against scene replacement as a general policy: it is only appropriate when the **frame** changes, which is much rarer than focus changes. |

---

### Situation 11 *(added)* — The user does something the system cannot resolve

| | |
| :--- | :--- |
| **What is actually happening?** | The user's action is ambiguous, false-premised, or outside the world's possibility space. The system does not know what is being asked. |
| **What dominates attention?** | **The ambiguity itself**, plus the affordances for resolving it. |
| **What stays peripheral?** | As before — the frame should not be discarded because of an input failure. |
| **What interaction is available?** | Rephrase, disambiguate, select from offered interpretations, ask what is possible here, do something else. |
| **Does this need a fundamentally different presentation?** | **No — but it requires the system to have a representation of its own uncertainty, and that is exactly where current LLM-based systems fail.** |
| **Why this was added** | Interactive fiction has fifty years of hard-won practice here — parser disambiguation ("*What do you want to kill the troll with?*") is a solved, well-documented pattern. LLM roleplay platforms, by contrast, characteristically **confabulate**: they invent a plausible continuation rather than admitting non-comprehension. That failure is widely reported by practitioners and is a structural property of next-token prediction, not a tuning bug.<br><br>The relevance is direct: **if the presentation layer has no state for "I do not know what you mean," it will confidently render the wrong thing.** A disambiguation surface is cheap; a confident hallucinated presentation is expensive and erodes trust. `DO_NOT_BUILD_YET.md` item 15 already defers LLM-driven UI; this is an independent reason to keep the *selection* decision out of the LLM's hands even if rendering eventually becomes more generative. |

---

### Situation 12 *(added)* — Two urgent things happen at once, in different places

| | |
| :--- | :--- |
| **What is actually happening?** | Two high-salience events compete. Genuine split attention is demanded. |
| **What dominates attention?** | Both — irreconcilably. |
| **What stays peripheral?** | Everything else. |
| **What interaction is available?** | Attend to one (accepting a cost for the other), delegate, split resources, ignore one, seek more information. |
| **Does this need a fundamentally different presentation?** | **No — and the model should probably refuse to support true split attention.** |
| **Why this was added** | This situation exposes a limit the original ten do not. Both the cognitive evidence (working-memory capacity ~3–5 chunks) and the current single-stage layout grammar argue against two simultaneous stages. The right answer is almost certainly **one focus plus queued awareness of the other** — a persistent, low-cost reminder that something else is pending and decaying.<br><br>That is a real design decision that no current HeadConan document makes explicitly, and it is better made deliberately than discovered in production. It also generalises: **the frame is the natural home for queued awareness**, which reinforces the frame's role as the continuity-bearing structure. |

---

### 5.13 Cross-situation findings

#### 5.13.1 Which situations are actually hard — and why

Sorting the twelve by difficulty produces a result that inverts the intuition behind the brief's list:

| Difficulty | Situations | Shared property |
| :--- | :--- | :--- |
| **Easy** | S1 conversation · S4 navigation · S5 document · S8 command | One clear focus, one obvious renderer, well-established precedent |
| **Moderate** | S7 decision · S3 third party enters | Focus is clear; the *requirement* is an added affordance or constraint, not a new structure |
| **Hard** | S2 evidence mid-conversation · S6 observing · S9 casual life · S10 focus jump · S11 unresolvable · S12 simultaneous | **Nothing about the situation changed — yet the presentation must.** |

**The hard cases are hard for one shared reason: they are cases where the situation does not change but the presentation must, or where two things are true at once.** A taxonomy of situations is structurally incapable of expressing any of them. That is the sharpest available argument against scene-type architecture, and it emerged from the stress test rather than from theory.

#### 5.13.2 Recurring dimensions (the real ones)

Six dimensions were sufficient to describe all twelve situations, and all six did real work:

| # | Dimension | Situations where it is the *decisive* factor | In the brief's original list? |
| :-- | :--- | :--- | :--- |
| 1 | **FOCUS (target, aspect)** | S1, S4, S7, S8, S10 | Partially — brief has "ATTENTION/FOCUS" but not the aspect split |
| 2 | **FRAME** (place, participants, tempo, stakes, scale, lens) | S2, S3, S5, S10 | **No** — absent |
| 3 | **PARTICIPATION** (ratified / bystander / overhearer / eavesdropper / director) | S3, S6 | **No** — absent |
| 4 | **PERSISTENCE** (ephemeral vs cumulative) | S4, S5, S8 | **No** — absent |
| 5 | **VERB SET** (derived) | S6, S7, S11 | Partially — brief has "INTERACTION" |
| 6 | **SURFACE HIERARCHY** (1 stage + bounded periphery) | S7, S9, S12 | **No** — absent |

Three of the six were missing from the brief's candidate list; a fourth (frame) is the one the current architecture is closest to having, under the name "scene."

#### 5.13.3 Proposed invariants

These are offered as **hypotheses**, not findings; each is falsifiable by the experiment in Section 9.

| # | Invariant | Falsified if… |
| :-- | :--- | :--- |
| **I1** | **The frame changes more slowly than the focus.** Empirically, focus changes several times per minute; the frame changes a few times per session. | Frame and focus change at comparable rates — in which case the distinction is not worth its complexity. |
| **I2** | **The verb set is derived, never authored.** It is a function of (focal target, participation status, role capabilities, action preconditions). | Situations repeatedly demand verbs that no derivation produces — in which case some authoring is unavoidable. |
| **I3** | **At most one stage; periphery bounded at roughly 3–4 slots.** Consistent with working-memory limits and with every successful game interface examined. | Users reliably want two simultaneous stages (S12 probes this). |
| **I4** | **Focus is nullable, and the null case is a first-class state** with a high promotion threshold. | The diffuse state is rare or users find an auto-chosen weak focus preferable. |
| **I5** | **Every focus change leaves a return path.** The prior focus remains reachable for at least one subsequent step. | Users consistently do not return, and the return path costs more attention than it saves. |
| **I6** | **The epistemic lens filters before selection**, not after. *(Already true in HeadConan's design — stated here as a constraint not to regress.)* | — |

#### 5.13.4 What the stress test did *not* settle

Stated plainly, because overclaiming here would be the main risk:

- **Whether the six dimensions are sufficient** for situations outside these twelve. The set was chosen partly to stress the model, but twelve situations is a small sample and adversarial selection was not systematic.
- **Whether "aspect" is best modelled as a discrete field or derived from the triggering action.** Both worked for these twelve; S10 is the discriminating case and would need real users to settle.
- **Whether users actually notice or care about presentational variety.** Every argument in this section assumes they do. That assumption is inherited from the brief and is **not** established by any evidence assembled here. It is worth testing directly, and cheaply — see §9, follow-up probe B.
## 6. The Transition Problem

> This section compares transition mechanisms. It deliberately does **not** select one, because the evidence assembled here points to a different conclusion: no single mechanism is correct, and the policy should be *conditional on what changed.*

### 6.1 Why this is the section that matters

Sections 2 through 5 established that the hard cases (S2, S6, S9, S10, S11, S12) are hard because **nothing about the situation changed while the presentation had to.** That observation relocates the entire problem onto transitions. If situations cannot be typed, then the only remaining question is: *what changed, and how should the presentation respond?*

Three findings make this the highest-risk area of the current design:

1. **The current architecture specifies Q1 (selection) and Q2 (rendering) in detail, and Q3 (transition) essentially not at all.** `LAYOUT_RESEARCH.md` Q12 answers transitions with a rendering technique (FLIP); `SCENE_MODEL.md` §4 gives switching *discipline* but not switching *mechanism*.
2. **The transition policy determines whether C2 (variety) and C3 (continuity) can both be satisfied.** Everything else is downstream of this.
3. **The strongest negative evidence in the whole research base bears directly on automatic, system-initiated reconfiguration** (Lavie & Meyer on non-routine situations; the mode-error literature). This is precisely what an auto-morphing planner does.

### 6.2 The candidate mechanisms, compared

Eight mechanisms were assessed. Ratings are relative and judgement-based, grounded in the cited evidence where evidence exists.

| Mechanism | What it is | Orientation (C3) | Perceptibility | Mode-error risk | Implementation cost | Best suited to |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **M1 Hard mode switching** | Layout swaps wholesale between named modes | ✗ Poor | ● High | ● High | ● Low | Nothing observed in §5 |
| **M2 Scene replacement** | The current `sceneType` model: enter a new scene, save old scene state | ✗ Poor | ● High | ● High | ○ Med | Genuine **frame** changes: travel to another place, act breaks |
| **M3 Progressive transformation** (FLIP / morph) | Elements animate continuously from old to new position | ◐ Good | ✗ **Low** | ○ Med | ○ Med | User-initiated focus changes within a frame |
| **M4 Layered / stacked interfaces** | New surface stacks over the previous one | ◐ Fair | ● High | ○ Med | ● Low | Short detours; **dangerous if unbounded** |
| **M5 Focus shift** (frame retained, stage re-renders) | Frame strip persists; only the stage and periphery change | ● Excellent | ● High | ● Low | ○ Med | **The common case** — S1, S2, S4, S8, S10 |
| **M6 Temporary overlay** | Surface appears over a paused composition, then dismisses back | ● Excellent | ● High | ● Low | ● Low | Tempo changes — S5 (reading), S7 (deciding) |
| **M7 Persistent environmental frame** | A durable context strip carries place / participants / tempo / pending items | ● Excellent | n/a | ● Low | ● Low | **Not a transition — an enabler for all others** |
| **M8 Dynamic composition** | A rule engine composes primitives from (focus, frame) | — | — | — | ○ Med | The general mechanism beneath M5/M6; not itself a policy |

Key: ● favourable · ○ moderate · ◐ mixed · ✗ unfavourable

### 6.3 Per-mechanism assessment

#### M1 — Hard mode switching
Predictable and cheap, and the mode-error literature is unambiguous that predictability helps. But it maximises orientation loss, and §5 showed no situation where wholesale swap is correct. **Not recommended as a general policy.** Its one legitimate use is at genuine discontinuities the user expects — entering or leaving a world, switching between player and architect lenses.

#### M2 — Scene replacement *(the current design)*
The `SCENE_MODEL.md` model. Its stated discipline is sound — scene switching must be explainable, in-scene state persists, user-initiated switches outrank automatic ones. Those are good rules.

The problem is **granularity, not the mechanism.** Scene replacement is correct when the *frame* changes and incorrect when only the *focus* changes, and the current design has no vocabulary for telling those apart — `sceneType` conflates them. Situation 2 (evidence noticed mid-conversation) is the clean refutation: it is not a scene change, and treating it as one either destroys a live conversation or blocks the examination.

**Assessment: keep the mechanism, restrict its trigger.** M2 should fire on frame change only.

#### M3 — Progressive transformation (FLIP)
`LAYOUT_RESEARCH.md` Q12 proposes FLIP transitions, and the instinct is right: elements should morph rather than vanish. But there is a specific, evidence-backed problem.

**Change blindness and inattentional blindness research shows that observers frequently fail to notice substantial changes to a visual scene when the change coincides with a visual disruption** — a saccade, a cut, a blink. Smooth animated transitions are, from the visual system's point of view, a controlled disruption. The risk is that **a beautifully smooth morph makes the change invisible.**

That is only a problem when the *system* initiated the change. If the user clicked the letter, they know the focus moved, and a smooth morph is pure benefit — it carries their eye. If the system decided the focus moved, the user needs to *notice*, and a morph engineered to be seamless is working against them.

**Assessment: excellent for user-initiated transitions; actively counterproductive as the sole mechanism for system-initiated ones.** System-initiated changes need a **perceivable** marker — not necessarily slow, but not masked.

#### M4 — Layered / stacked interfaces
Cheap and preserves the base composition, which makes it tempting for S2 and S5. The failure mode is accumulation: layers stack, the user never dismisses them, and the result is the universal dashboard rebuilt one overlay at a time.

**Assessment: useful only with a hard bound** (at most one transient layer, auto-expiring) **and only for tempo-driven detours.**

#### M5 — Focus shift with frame retention
Frame persists; stage re-renders; periphery re-filters. This matches the largest cluster of situations (S1, S2, S4, S8, S10) and is the only mechanism that satisfies S2, where a conversation must remain live while attention is elsewhere.

It has a prerequisite: **something must persist to be the frame.** That is M7. M5 and M7 are a package, not alternatives.

**Assessment: the leading candidate for the common case.**

#### M6 — Temporary overlay
The correct answer for tempo changes. Reading a document (S5) and making a high-stakes decision (S7) are both cases where the world's tempo changes and the prior composition should be *suspended*, not replaced. Cheap, low-risk, high orientation.

**Assessment: under-used in the current design; should be the default for reading, inspecting, and deciding.**

#### M7 — Persistent environmental frame
**The most important item in this table and the one the current design most nearly lacks.** Not a transition mechanism — the structure that makes every other mechanism safe. The frame is what persists across all focus changes, carrying:

- **Where** the user is
- **Who** is present (participation structure)
- **When** it is, and whether time is moving
- **What** is pending (suspended conversations, queued events — see S2, S12)
- **What** the user recently learned

The existing `Anchor` primitive (P1) carries world identity, turn counter, and role — a subset of this. The gap is **participants** and **pending items**, which are exactly what S2 and S12 require.

**Assessment: the highest-value, lowest-cost addition identified by this research.**

#### M8 — Dynamic composition
The general mechanism, already correctly identified in `LAYOUT_RESEARCH.md`. It is not a transition *policy* — it is the engine that would execute whichever policy is chosen. Listed here to prevent a category error: adopting M8 does not answer the transition question, and a team that believes it has will skip this section.

### 6.4 The proposed policy: select the mechanism by what changed

The synthesis of §5 and §6 is a single conditional rule:

| What changed | Mechanism | Rationale |
| :--- | :--- | :--- |
| **Focus** (target or aspect) changed; frame same | **M5 focus shift** | Frame carries continuity; only the stage re-renders |
| **Tempo** changed (reading, deciding, waiting) | **M6 temporary overlay** | Suspend, don't replace |
| **Participation** changed (someone enters; user becomes an observer) | **Peripheral expansion + verb-set change** — no stage change | S3, S6: the topic is intact, the constraints changed |
| **Epistemic state** changed (something learned) | **Accent only — no layout change** | The change is in what's *sayable*, not in what's *shown* |
| **Scale** changed (entity → aggregate) | **Stage swap** (heavier transition warranted) | S8: genuinely a different kind of object |
| **Frame** changed (place, roster, act) | **M2 scene change** | The one case where wholesale change is honest |
| **System-initiated** any of the above | Same mechanism **plus a perceivable marker**, plus user override | Change-blindness evidence + mode-error evidence |

Two properties of this table are worth stating explicitly:

1. **The expensive transitions are rare.** Frame changes and scale changes are uncommon; focus changes are constant. So the architecture pays for heavy transitions rarely and cheap transitions constantly — which is the right cost distribution.
2. **System-initiation is a cross-cutting modifier, not a mechanism.** Every row gets the same two additions when the system rather than the user caused the change: make it perceivable, and let the user override.

### 6.5 Where the film analogy breaks — and where it holds

The brief asks what theatre and film can teach us. On the specific question of **transitions**, the analogy is instructive mainly because of where it fails.

**Where it holds.** A director controls attention by staging, framing, lighting, and cutting, and the audience's eye follows without being told. The principle that *attention can be moved without an explicit instruction* transfers directly, and it is the best available answer to the "how do we avoid a UI that shouts 'look here'" problem. Mise-en-scène — everything placed before the camera: setting, lighting, costume, blocking, composition — is a well-established descriptive vocabulary for exactly the "what is in the frame and why" question that HeadConan's `WorldStyle` is trying to express ([see the standard account](http://en.m.wiki.x.io/wiki/Mise_en_sc%C3%A8ne); Bordwell & Thompson's *Film Art* is the canonical primary source).

**Where it breaks.** Continuity editing is designed to make the cut *invisible*. That works because **the filmmaker controls the frame and the audience has ceded that control.** In HeadConan the user holds the frame. An invisible transition in an interactive system is not elegance — it is a change the user did not author and did not see, which is the definition of a mode error.

This is the single most important limit on the film analogy, and it inverts the naive reading: **do not import the invisible cut; import the staging.** Use mise-en-scène to decide what is in the frame; do not use continuity editing to hide the fact that the frame changed.

### 6.6 What must NOT transition

For symmetry with §3 of `LAYOUT_RESEARCH.md`, the invariants across *all* transitions:

| Element | Status | Note |
| :--- | :--- | :--- |
| Place | Must persist or transition explicitly | Its change is a frame change, and deserves a real transition |
| Participants & participation status | Must persist | Currently **not** in the `Anchor` primitive — gap |
| Tempo (is time moving?) | Must persist and be visible | Determines interruptibility |
| Pending / suspended items | Must persist | Required by S2 and S12 |
| Epistemic lens | Must persist | Already modelled (`projectEpistemicPerspective`) |
| Recently acquired knowledge | Must persist for at least a few turns | Otherwise discovery has no felt consequence |
| Stage content | Transitions freely | This is where variety lives |
| Peripheral slots (≤3–4) | Transition freely, but bounded | The bound is the anti-dashboard guarantee |

### 6.7 Open question this section cannot close

**Whether users want system-initiated transitions at all.** The mechanism table assumes the answer is "sometimes, with safeguards." But `OPEN_UX_QUESTIONS.md` Q1 poses the question directly and does not answer it, and the adaptive-UI literature is genuinely unhelpful here because it studied menus and in-vehicle telematics, not narrative worlds. The experiment in Section 9 is designed primarily to produce evidence on this point.
## 7. Candidate Design Hypotheses

Six hypotheses are proposed. **None is a finding.** Each is stated with what would falsify it and the smallest experiment that could do so — several of the experiments are small enough to be trivial, which is the point.

---

### H1 — The (Focus, Frame) decomposition is sufficient

**Hypothesis.** Any presentable situation in HeadConan can be described as a `(focus, frame)` pair. Focus changes substantially more often than frame — an order of magnitude would be the expected ratio — and this decomposition is sufficient to drive composition without a taxonomy of scene types.

**Evidence supporting it.**
- All twelve stress situations were described with six dimensions; none resisted the decomposition (§5).
- Six of the twelve (S2, S3, S5, S10, S12, and S1 by contrast) required the **frame** specifically — they are cases where focus moved but context did not.
- The hardest cases are precisely those where *nothing about the situation changed* while the presentation had to (§5.13.1) — which a situation taxonomy cannot express but a frame-plus-focus model can.
- Inform 7's untyped, condition-cued scenes are a production-proven precedent for the frame concept without a type (§2.3, FA5).

**What it would imply.** Delete `sceneType`. Build the frame as a first-class structure. Key transitions to *what changed* (§6.4). The scene concept survives, but as a temporal span with entry/exit effects, not a category.

**What could falsify it.**
- Frame and focus change at comparable rates in real play — in which case the distinction is not worth its complexity.
- Situations appear that resist the decomposition. S8 (aggregates) came closest and was resolved only by adding a renderer, not by changing the model.

**Smallest possible experiment.** Instrument one play session. Log every focus change and every frame change with timestamps. **If the ratio is not at least roughly 5:1, H1 is weak and the frame is unjustified complexity.** Cost: a logging statement and one session. This is the cheapest decisive test available and should be run first.

---

### H2 — Focus must be a *(target, aspect)* pair

**Hypothesis.** A focal target alone under-determines the correct rendering in a substantial fraction of real focus decisions. The aspect under examination is a necessary second component.

**Evidence supporting it.** The aspect tables in §2.3 (FA2): one character can be examined as *what they are saying*, *what they know and intend*, or *who they are connected to* — three different surfaces, one target. S10 (sudden focus jump) is the discriminating case.

**What it would imply.** Add `aspect` to `PresentationPlan` alongside `focusedEntityId`. Renderer selection becomes `g(ontological_type, aspect)` rather than `g(target)`.

**What could falsify it.** In real play, the aspect is predictable from the *triggering action* in almost all cases — the user said "read the letter," so the aspect is *text*. If so, a separate field is redundant and the derivation is simpler.

**Smallest possible experiment.** Log focus decisions as triples `(target, aspect, triggering_action)`. Measure how often the aspect is *not* predictable from the action alone. **If unpredictable in fewer than roughly 20% of cases, drop the field.**

---

### H3 — The renderer set is bounded by ontology, at roughly six

**Hypothesis.** A fixed set of about six surfaces — agent, place, object, text-document, relation, aggregate/system, (sequence) — suffices. New situations require no new renderers.

**Evidence supporting it.** The stress test needed five and justified a sixth only for S8 (aggregates). The mechanism is principled: renderers track *kinds of thing*, which are bounded by the ontology, not *kinds of situation*, which are not. `WORLD_REPRESENTATION.md` §2A already enumerates essentially this ontology.

**What it would imply.** Freeze the renderer set early and treat "add a surface" as a significant architectural event requiring evidence. This is the direct escape from Failure Mode B.

**What could falsify it.** Two or more of the twelve situations demand a seventh renderer; or users report that situations feel wrong or generic when rendered with the existing set.

**Smallest possible experiment.** The harness in §9, instrumented: **count the situations that cannot be rendered acceptably.** Every un-renderable situation is a data point against H3.

---

### H4 — AI should estimate salience, not generate layout

**Hypothesis.** An LLM can provide useful *dramatic-salience* estimates — what matters right now, independent of the user's goal — without generating any markup. This yields better focus selection than an unvalidated deterministic weighted sum. Layout decisions must remain entirely deterministic.

**Evidence supporting it.**
- **A2UI** exists precisely to enforce this split: agents emit declarative component descriptions drawn from a pre-approved catalogue; the client renders with its own native components; no executable code crosses the trust boundary ([a2ui.org](https://a2ui.org/); [specification](https://a2ui.org/introduction/what-is-a2ui)). This is the industry's considered answer to safe generative UI, and it is a *separation of intent from rendering*, which is exactly the abstraction the brief asks about.
- S11: LLM systems confabulate on unresolvable input, so a generative presentation layer fails invisibly.
- The current `FocusScore` weights are unvalidated (§2.3, FA4), so there is a real vacancy where a better salience estimator could go.

**What it would imply.** A two-stage pipeline: LLM → salience judgement over candidate foci (a ranking, not a layout); deterministic composer → surfaces. This preserves ADR-12 and `DO_NOT_BUILD_YET.md` item 15 while still using the AI for what AI is actually good at.

**What could falsify it.** LLM salience estimates are no better than a trivial heuristic (recency plus user-mention), or are inconsistent across runs at a temperature usable in production.

**Smallest possible experiment.** Take thirty logged focus decisions from real sessions. Ask an LLM to rank candidate foci. Compare against (a) a recency heuristic and (b) what the user actually did next. **If the LLM does not beat recency, do not build it.**

> **Speculation flag.** This is the least-supported of the six hypotheses. It is included because it is the most likely way the team will be tempted into generative UI, and it is better to have a tested version of the idea than an untested one.

---

### H5 — Continuity beats distinctiveness for orientation, and distinctiveness does not require structural change

**Hypothesis.** Users' ability to answer *where am I / who is present / what was I doing* after a focus change depends primarily on **persistence of the frame**, not on the distinctiveness of the surface. And perceived variety is achievable through composition plus `WorldStyle` without new structures.

**Evidence supporting it.**
- **Mode-error literature:** Sellen, Kurtenbach & Buxton (1992, *Human-Computer Interaction* 7(2)) showed user-maintained mode states prevent errors better than system-maintained ones, on both error rate and cognitive load. A system that silently reconfigures is a system-maintained mode.
- **Change blindness:** observers miss substantial changes that coincide with visual disruption — so a masked transition hides change from the very user who needs to see it.
- **Eye-tracking:** roughly 88% of fixations fell in the near-centre screen region while HUD regions drew about 2% ([Maynooth, ECMS 2005](https://eprints.maynoothuniversity.ie/282/1/Paper04_ECMS_2005.pdf)) — peripheral content is attended far less than designers assume, which weakens the case that more distinct peripheral structure buys much.
- **Lavie & Meyer (2010):** adaptation degrades performance in non-routine situations — and HeadConan is nothing if not non-routine.

**What it would imply.** Invest in the frame before investing in new surfaces. Prioritise C3 over C2 (§2.1). This inverts the current emphasis in the design documents.

**What could falsify it.** Users rate structurally-different scenes as **more** distinctive **and** do not report disorientation from scene switching. If that happens, presentational variety genuinely does require structural variety, the current `sceneType` model is closer to right than this report argues, and §8.1 should be reconsidered. **This is the hypothesis most worth trying to falsify, because it is the one the whole report leans on.**

**Smallest possible experiment.** The A/B harness in §9.

---

### H6 — Participation status is a necessary dimension

**Hypothesis.** Modelling the user's standing in an encounter (ratified participant / bystander / overhearer / eavesdropper / director / architect) improves the derived verb set and makes Situations 3 and 6 legible. It is cheap relative to its effect.

**Evidence supporting it.**
- Goffman's participation framework (*Forms of Talk*, 1981) supplies precise, established vocabulary.
- **Versu** produced the correct behaviour for S3 *emergently* — a character fell silent when a third party walked in on a private conversation, an outcome no author wrote ([Emily Short, 2013](https://emshort.blog/2013/02/14/introducing-versu/)).
- S6 (observing without participating) is *nothing but* a participation change — no change in world state, focus, or frame.

**What it would imply.** Add a participation enum to the frame. The verb-set derivation consumes it. The transition out of a status (intervening, being noticed) becomes a first-class dramatic event.

**What could falsify it.** Users do not perceive standing as meaningful, or verb sets do not in fact vary with standing.

**Smallest possible experiment.** In the S3 scenario, run with and without an explicit participation indicator, and measure **behaviour**: do users avoid raising secrets in front of the third party? A behavioural measure rather than a self-report — cheap and far more informative.

---

### 7.1 Hypothesis dependency map

Understanding which hypotheses gate which decisions:

```
H1 (focus/frame)  ──┬──► gates: whether to delete sceneType
                    │
H5 (continuity)   ──┴──► gates: whether C3 outranks C2   ◄── MOST IMPORTANT
                                (falsifying this overturns §8.1)

H2 (aspect)       ─────► gates: PresentationPlan shape
H3 (bounded set)  ─────► gates: whether to freeze the renderer set
H6 (participation)─────► gates: frame contents (cheap, low risk)
H4 (AI salience)  ─────► gates: whether AI participates in selection at all
                                (least supported — test last)
```

**Recommended order:** H1 (log the ratio — trivial) → H5/H3 (the §9 harness) → H2, H6 (cheap instrumentation during the harness) → H4 (only if the others hold).
## 8. What HeadConan Should Not Do

Each item below is **seductive** — it is listed because a competent team would plausibly propose it — and each is **rejected on stated evidence**. Items are ordered by how expensive they would be to discover the hard way.

---

### 8.1 Do not build a taxonomy of scene types

**The temptation.** `SCENE_MODEL.md` already has six. It feels like progress, it is easy to explain, and it maps neatly onto stage modes.

**Why not.** Situation 2 refutes it decisively. Noticing a possible-evidence object *during a conversation* is not a scene type; it is the same situation with a shifted focus. Any type-based model must classify it as either `conversation` or `investigation`, and both answers destroy something real — either the live conversation or the chance to examine the object.

**The structural argument.** Scene types classify *situations*. But §5.13.1 showed that the six hardest situations are precisely those where **nothing about the situation changed while the presentation had to.** A taxonomy over situations cannot represent them, no matter how many types it has. Adding a seventh type does not help; the mapping is not merely incomplete, it is the wrong shape.

**The empirical precedent.** Inform 7 — the most mature world-model narrative system in existence — has scenes with **no type field at all**. Scenes are cued by conditions, scoped in time, and carry entry/exit rulebooks ([Inform 7 documentation, §10.2](http://inform7.com/book/WI_10_2.html)). That design has survived decades of use by the most demanding authoring community in the field.

**Severity: High.** This is the central finding.

---

### 8.2 Do not maintain two parallel enumerations

`sceneType` (6) and `stageMode` (5) currently coexist and do not align (§2.3, False Assumption 6). `everyday` has no stage mode; four of the six scene types are renames of stage modes.

**Why not.** Two partially-overlapping taxonomies of the same distinction guarantee drift, and the gaps are where bugs hide. The `everyday` gap is already a live bug: the diffuse-attention case has no renderer.

**Severity: High, and cheap to fix.** Pick one axis — this report argues for the surface/ontology axis — and derive the other.

---

### 8.3 Do not let the LLM generate markup

Already deferred by `DO_NOT_BUILD_YET.md` item 15 and ADR-12. **This research found no evidence that would reverse that deferral, and one additional reason to keep it.**

**The added reason (from S11).** When an LLM cannot resolve an input, it characteristically confabulates. Applied to presentation, that means: when the system does not know what the user is attending to, a generative UI layer will confidently render *something* rather than admit uncertainty. A deterministic layer fails visibly and recoverably; a generative layer fails invisibly.

**Important nuance — do not over-apply this.** Rejecting LLM-generated *markup* is not the same as rejecting LLM *judgement*. There is a defensible division of labour in which the LLM estimates semantic quantities that are hard to compute deterministically — dramatic salience, what a character would find awkward, what counts as a turning point — while all layout decisions stay in deterministic code. Systems like **A2UI** ([a2ui.org](https://a2ui.org/)) exist precisely to enforce that split: agents emit declarative component descriptions from a pre-approved catalogue; the client renders them with its own native components; no executable code crosses the trust boundary.

**Recommended position:** AI proposes *what matters*; deterministic code decides *how it looks*. See H4.

**Severity: High if ignored; the deferral is correct.**

---

### 8.4 Do not deploy fully automatic morphing without user override

**The evidence.** Lavie & Meyer (2010, *Int. J. Human-Computer Studies*) found that adaptive interfaces help in **familiar, routine** situations but that in **unfamiliar situations to which the system was not adjusted, cognitive workload increased substantially and performance degraded**. Findlater & McGrenere (CHI 2004) found users preferred customisable over adaptive menus, with adaptive no faster than static.

**Why it bites HeadConan specifically.** HeadConan is a **perpetually non-routine environment** — the user is always in an unfamiliar world doing something they have not done before. That is the exact regime in which the literature reports adaptation *hurting*.

**The specific gap.** `OPEN_UX_QUESTIONS.md` Q1 identifies a "Sticky Layout Lock" as a hypothesis to test. The literature suggests it is not an optional nicety but **the primary risk control on the entire auto-morphing design**, and it should be built in the first iteration, not deferred.

**Severity: High. Cheapest high-value mitigation available.**

---

### 8.5 Do not make system-initiated transitions invisible

**The evidence.** Change-blindness and inattentional-blindness research shows observers frequently miss substantial visual changes when they coincide with a visual disruption. A smooth animated morph is, to the visual system, a controlled disruption.

**The consequence.** `LAYOUT_RESEARCH.md` Q12 proposes FLIP transitions so that "elements never vanish abruptly." That is right for **user-initiated** changes — the user already knows the focus moved, and the morph carries their eye. It is actively wrong as the sole mechanism for **system-initiated** changes, where the user's entire need is to *notice* that something moved without them.

**Recommended correction:** system-initiated changes get a **perceivable marker** — not slow, but not masked — plus the override from 8.4.

**Severity: Medium-High.** Easy to get wrong while feeling sophisticated.

---

### 8.6 Do not treat the `FocusScore` formula as validated

`LAYOUT_RESEARCH.md` specifies a four-term weighted sum. There is no ground truth behind the weights, no evidence the terms are the right ones, no evidence they are additive, and no stated falsification procedure (§2.3, False Assumption 4).

**Why it matters.** An unfalsifiable scoring function absorbs every failure by re-tuning. It will feel like progress indefinitely while being impossible to validate.

**Recommended correction:** treat it as a placeholder, and instrument it. Log the focus decisions and the user's subsequent behaviour; that log is the dataset from which a real model could eventually be fitted — and it will also reveal whether the four terms are even the right ones.

**Severity: Medium.** Not harmful in itself; harmful if mistaken for a finding.

---

### 8.7 Do not optimise for information density

Concrete eye-tracking evidence: in an FPS study, roughly **88% of fixations fell within the near-centre region of the screen, while the regions containing health, message and score information received only about 2% of fixations** — and a single participant accounted for 53% of even those ([Maynooth University, ECMS 2005](https://eprints.maynoothuniversity.ie/282/1/Paper04_ECMS_2005.pdf)). Caroux et al. (2015, *Int. J. Human-Computer Studies*) similarly found HUD effects on player experience depend strongly on **composition and spatial organisation** rather than on quantity of information.

**Why it matters.** Peripheral panels are looked at far less than designers assume. Adding a sixth peripheral surface adds far less information than it adds code, and it pushes toward the dashboard failure mode.

**The corollary, which is the actionable part:** the bound on peripheral slots (I3: ≤3–4) is not an aesthetic preference. It is where the evidence points.

**Severity: Medium.** A common and expensive mistake.

---

### 8.8 Do not reach for an infinite canvas as the answer to "freedom"

`OPEN_UX_QUESTIONS.md` Q4 poses canvas freedom versus structured layout.

**Why not as a default.** Situation 4 (navigation) needs **persistence** — a surface that remembers where the user has been — far more than it needs freedom of arrangement. An infinite canvas supplies freedom and supplies persistence only with substantial extra work. Meanwhile it performs poorly on small screens and gives the frame nothing to hold on to.

**Recommended position:** persistence is the requirement; freedom is one possible implementation. Do not buy the harder one first.

**Severity: Medium.** Likely to consume a large amount of effort for the wrong property.

---

### 8.9 Do not build world-specific screens or per-world component sets

Already deferred by `DO_NOT_BUILD_YET.md` items 11, 12 and ADR-12. Reaffirmed here: worlds declare **what modality matters and what is salient** (`WorldStyle`); they do not declare components.

**The one correction to the current design:** `WorldStyle` is presently a *theming* layer. §2.3 (False Assumption 1) argues it must become an **argument to the selection function** — a world's grammar determines what counts as salient in it, not only how things look.

**Severity: Medium.** The rule is right; the placement is subtly wrong.

---

### 8.10 Do not support true split attention

Situations 12 probed this, and both the cognitive evidence (working-memory capacity of roughly 3–5 chunks) and the single-stage grammar argue against two simultaneous stages.

**Recommended position:** one focus, plus **queued awareness** of competing demands in the frame. Make this a deliberate decision rather than one discovered in production.

**Severity: Medium.** Cheap to decide now, expensive to retrofit.

---

### 8.11 Two items to *keep*, with corrections

Not everything in the current design is wrong. Two things should be protected:

| Keep | Why | Required correction |
| :--- | :--- | :--- |
| **The epistemic projector as a pre-filter** | It is the source of HeadConan's real differentiator (dramatic irony, information asymmetry) and the audit confirms it as sound | Do not regress it. Never let the presentation layer see unfiltered world state. |
| **The five spatial primitives** (`Anchor`, `Stage`, `Satellite`, `Ambient`, `Dock`) | As a *spatial vocabulary* they are sound and appropriately minimal | **The `Anchor` is missing participants and pending items** — exactly what S2 and S12 require. Extend it into the frame (M7). **The five named stage *morphologies* are the part that should not be frozen.** |

---

### 8.12 The meta-warning

The single most seductive idea in this entire problem space is that **the variety of the experience should come from the variety of the interface.**

Everything surveyed here points the other way: **variety should come from composition, and the interface should stay boringly consistent.** Games that feel most varied — the ones players describe as unlike anything else — are frequently the ones with the *fewest* distinct interface structures and the most disciplined staging. The interface is the frame through which the world is seen, and a frame that keeps changing its own shape is a frame that stops working.
## 9. Recommended Next Experiment

### 9.1 The uncertainty being resolved

Of everything this research could not settle, one question gates the most decisions:

> **When the user's attention moves within a stable situation, does retaining a persistent frame and re-rendering only the stage preserve orientation better than switching scenes — and does it cost perceived distinctiveness?**

This is chosen because it sits at the intersection of the two constraints that actually conflict (C2 variety versus C3 continuity, §2.1), and because **H5 — the hypothesis this report leans on hardest — is the one it can falsify.** A research exercise that cannot overturn its own recommendation is not research.

### 9.2 Question

In an imagined-world interface, when the focus of attention shifts while the surrounding situation stays the same, which transition strategy better serves the user: **scene replacement** (the current `SCENE_MODEL` design) or **frame-retained focus shift** (this report's proposal)?

### 9.3 Hypothesis

**Frame-retained focus shift produces materially better user orientation than scene replacement, at no significant cost in perceived distinctiveness.**

Specifically:
- **H5a (orientation):** users will answer *where am I / who is present / what was I doing* more accurately and more quickly after a frame-retained focus shift than after a scene replacement.
- **H5b (resumption):** users will resume a suspended interaction faster when it remains visible in the frame than when it is hidden and restored.
- **H5c (variety):** perceived distinctiveness will **not** differ significantly between conditions — i.e. continuity can be bought without paying for it in variety.

### 9.4 Prototype

**Deliberately minimal. No AI. No layout engine. No planner.**

| Element | Specification |
| :--- | :--- |
| **World** | One world, hand-authored. SPY×FAMILY is recommended because `DO_NOT_BUILD_YET.md` already commits to it as the single hand-written world. *(Trade-off: a mystery world would exercise investigation harder, but reuses less existing work. Use SPY×FAMILY and build one investigation-flavoured scenario into it.)* |
| **Shell (identical in both conditions)** | Persistent frame strip (place · participants · tempo · pending items) + one stage + ≤3 peripheral slots + action dock |
| **Condition A — scene replacement** | The new focus replaces the stage. Prior context is hidden; its state is saved and restored on return. This is the current `SCENE_MODEL` design. |
| **Condition B — frame-retained focus shift** | The frame strip persists unchanged. The stage re-renders for the new focus. The prior focus appears in the frame as an explicitly *suspended* item, still visibly present. |
| **Scenarios** | The six hard situations: **S2** (evidence noticed mid-conversation), **S3** (third party enters), **S6** (observing without participating), **S9** (casual diffuse life), **S10** (sudden focus jump), **S12** (two urgent things at once) |
| **Focus changes** | Driven by clicking, and in half the trials by a timed event, to compare user-initiated against system-initiated shifts |
| **Design** | Within-subjects, counterbalanced order |
| **Participants** | 8–12. Enough for a directional signal, explicitly **not** enough for publication. |
| **Implementation** | Static React harness with pre-authored scenario data. No backend, no LLM calls, no persistence layer beyond in-memory state. |

**Explicitly out of scope:** the layout engine, the presentation planner, any AI integration, world-authoring tools, and animation polish. If any of these appears in the prototype, the experiment has been over-built.

### 9.5 Success condition

The hypothesis is supported if **all three** hold:

1. **Orientation:** accuracy on the post-transition questions is at least ~20 percentage points higher in Condition B, **or** response latency is materially lower.
2. **Resumption:** time to resume the suspended conversation is materially lower in Condition B.
3. **Variety:** perceived-distinctiveness ratings do **not** differ significantly between conditions (equivalence, not superiority).

Plus, recorded alongside as a free by-product: **at least five of the six scenarios render acceptably using at most five stage renderers** (feeds H3), and the **focus-to-frame change ratio is at least ~5:1** (feeds H1).

### 9.6 Failure condition

Any one of the following is a failure — and each is informative:

| Failure | Meaning | Action |
| :--- | :--- | :--- |
| **No orientation difference** | Frame retention buys nothing. The frame is unjustified complexity. | **Keep the simpler scene model.** Spend the budget elsewhere. This is a *good* outcome — it saves the largest single piece of proposed work. |
| **B scores materially lower on variety** | Distinctiveness genuinely requires structural change. **H5 is falsified.** | Reconsider §8.1. Presentational variety must be bought with structural variety, which means Failure Mode B is partly unavoidable and should be *managed* with a bounded taxonomy rather than eliminated. |
| **Users disoriented in both conditions** | The problem is not the transition mechanism at all. | Look upstream — most likely the world's presentational grammar (`WorldStyle`) is not doing enough work. |

### 9.7 What we learn either way

This is the part that justifies running the experiment at all — **every outcome changes the plan**:

- **B wins** → Build the frame. Adopt focus-shift as the default transition (§6.4). Deprecate `sceneType`. Extend the `Anchor` primitive with participants and pending items. Prioritise C3 over C2 in all subsequent design work.
- **No difference** → Do not build the frame. A simple scene model is sufficient and the team should invest in content and world grammar instead. **This saves the most work of any possible outcome.**
- **B loses on variety** → The report's central recommendation is wrong. Structural variety is required, and the right response is a deliberately *bounded* set of scene structures — accepting some of Failure Mode B and managing its cost, rather than pretending it can be designed away.

There is no outcome in which the experiment leaves the plan unchanged. That is the test of whether an experiment is worth running.

### 9.8 Two cheap follow-up probes

Both can be appended to the same sessions at almost no cost.

**Probe B — Do users notice presentational variety at all?**
Present the same scenario rendered three structurally different ways and ask for a blind preference. **If users cannot reliably distinguish or do not care, the entire C2 axis is over-weighted across the design** — including in this report, and including in `LAYOUT_RESEARCH.md`. Cheap, and potentially the highest-leverage question in the set.

**Probe C — System-initiated change and the override.**
Cross system-initiated versus user-initiated focus shifts with override available versus not. This tests the Lavie & Meyer risk directly (§8.4), resolves `OPEN_UX_QUESTIONS.md` Q1, and determines whether the "Sticky Layout Lock" is a nicety or a requirement.

### 9.9 Run this first: a ten-minute test that costs nothing

Before the harness, run the H1 test: **instrument one play session to log every focus change and every frame change.** Count them.

- If the ratio is not at least roughly 5:1, the frame is not worth building and §9.2 through §9.8 should be skipped in favour of a simpler model.
- If it is, the harness is justified.

This costs one logging statement and one session, and it may eliminate the need for the entire experiment.

### 9.10 What is explicitly not recommended

- Building the layout engine.
- Building the presentation planner.
- Any AI integration into the selection path.
- A multi-world or multi-genre evaluation.
- A longitudinal study.

All of these are premature until H1 and H5 have been tested. The brief's framing is correct on this point: *the most valuable outcome may be discovering that the right abstraction is not yet known.* The experiments above are designed to establish either the abstraction or its absence, at a cost of days.

---

## Appendix A — Research Provenance, Corrections & Known Gaps

Recorded so that the next reader can calibrate trust section by section, and so that errors are visible rather than buried.

### A.1 Corrections made during this research

| # | What was wrong | How it was caught | Status |
| :-- | :--- | :--- | :--- |
| **1** | The popular four-quadrant "diegetic / spatial / meta / non-diegetic" UI taxonomy was reproduced from secondary sources and attributed to Fagerholt & Lorentzon (2009) | The **primary thesis was subsequently retrieved and extracted in full**. The authors explicitly abandoned *diegesis* as an axis; the real axes are fiction × spatiality; there are **six** categories, not four; and secondary sources conflate *meta-perception* with *meta-representation* | **Corrected in Finding A1**, with the error recorded rather than silently fixed |
| **2** | Horvitz's *Principles of Mixed-Initiative User Interfaces* was cited to *CACM* 1999 in the research brief | Flagged by the research assistant | **Corrected to CHI '99** in Finding C3 |
| **3** | "Storylets" implicitly credited to the modern quality-based-narrative discourse | Verified against King of Dragon Pass lead programmer David Dunham's own account | **Genealogy corrected** in Finding E4 (technique dates to 1997) |
| **4** | Mixed-language typo in Finding E4 | Self-caught on review | Fixed |

### A.2 Sources inspected directly (primary)

- Fagerholt & Lorentzon (2009), *Beyond the HUD* — full text extracted
- Inform 7: [*Writing with Inform* §10.2](http://inform7.com/book/WI_10_2.html), [§10.3](https://inform7.com/book/WI_10_3.html), [Inform 7 Handbook](http://inform-7-handbook.readthedocs.io/en/latest/chapter_8_time_&_scenes/scenes/)
- Montfort: [*Toward a Theory of Interactive Fiction*](http://www.nickm.com/if/toward.html), [*Interactive Fiction's Fourth Era*](http://www.nickm.com/if/fourth_era.html)
- Emily Short: [*Introducing Versu*](https://emshort.blog/2013/02/14/introducing-versu/), [*Mailbag: High-Agency Narrative Systems*](https://emshort.blog/category/quality-based-narrative/page/2/)
- A2UI: [a2ui.org](https://a2ui.org/) and [specification](https://a2ui.org/introduction/what-is-a2ui)
- Cowan (2010), *The Magical Mystery Four* — [PMC2864034](https://pmc.ncbi.nlm.nih.gov/articles/PMC2864034/), full text
- Gajos et al., adaptive GUI design space — [Harvard PDF](https://www.eecs.harvard.edu/~kgajos/papers/2008/kgajos-nectar08.pdf)
- Sellen, Kurtenbach & Buxton (1992) — [full transcript](https://doczz.net/doc/8873793/the-prevention-of-mode-errors-through-sensory-feedback)
- Lavie & Meyer (2010) — [ScienceDirect abstract and references](https://www.sciencedirect.com/science/article/pii/S1071581910000145)
- Outer Wilds ship log — [first-hand designer interview (Alex Beachum)](https://castro.fm/episode/XU2TVC)
- Endsley's SA model — [US National Academies](https://www.nationalacademies.org/read/6173/chapter/9)
- FPS eye-tracking — [Maynooth University, ECMS 2005](https://eprints.maynoothuniversity.ie/282/1/Paper04_ECMS_2005.pdf)
- Goffman's participation framework — [secondary source with direct quotation](https://www.researchgate.net/publication/266149322_Participation_framework_revisited_(New)_media_and_their_audiencesusers)
- CHI 2025 [Jelly](https://dl.acm.org/doi/abs/10.1145/3706598.3713285); CHI 2026 [Bridging Gulfs in UI Generation](http://ar5iv.labs.arxiv.org/html/2601.19171)

### A.3 Known gaps — stated plainly

| Gap | Impact | Recommended response |
| :--- | :--- | :--- |
| **Film/theatre had the weakest primary-source access** of the six fields | Findings D1–D3 are sound on concept but thinly evidenced | Treat §3.D as orientation, not evidence. Do not build on it alone |
| **Treisman's Feature Integration Theory** not verified against the original | Omitted rather than guessed | Revisit if salience modelling becomes central |
| **"Attention budget" and "one screen, one question"** have no traceable origin in the game literature | Two popular terms cannot be cited to authority | Use the primary thesis's own term, **"information on demand"** |
| **Cognitive load theory (Sweller 2019)** reviewed via aggregation, not the primary paper | Medium confidence on contested points | Read the primary before relying on the contested items |
| **Single eye-tracking study** (FPS, 2005, twelve datasets) underpins the periphery bound | The "2%" figure should not be treated as a constant | Treat the **direction** as established, not the magnitude |
| **Generative UI preprint** cited has an inconsistent arXiv identifier / year | Medium confidence on its reported figures | Cite by project URL; verify before relying on the numbers |
| **Outer Wilds GDC talk, Her Story token progression** | Marked unverified; not used as load-bearing | — |
| **No system surveyed handles null focus or participation status** | Not a research gap — a genuine absence in the field | HeadConan is without precedent here; expect to invent |

### A.4 What would most improve this research next

1. **Read Fagerholt & Lorentzon's six factors against HeadConan's own four benchmark worlds.** They were derived for 3D action games; re-deriving them for inhabited imagined worlds would be a genuine contribution and is the single highest-value follow-up.
2. **Get primary access to the film/staging literature** (Bordwell & Thompson, Mamet) or drop the field's weight in the analysis.
3. **Run the §9 experiment.** No amount of further literature review will settle H5; it is an empirical question about users.
