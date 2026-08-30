# HeadConan — World Model Design, Phase 1: Anti-Overengineering Review

> **Method:** start from a 10-minute experience, mark the "reality moments", reverse-engineer the minimum requirements, then attack the design with the deletion test.
> **Overriding principle:** user experience first. Architecture exists only to make the experience possible.
> **Scope:** no production code, no universal schema, no hypothetical consumers. This is a discovery review.
> Written 2026-08-30. Relation to prior work: this review is the *minimum-set calibration* of `ARCHITECTURE_ZERO/ARCHITECTURE.md` — it aggressively merges/removes everything the 10-minute experience does not demand. Concepts the ADRs marked LOW/MEDIUM confidence mostly land in **DO NOT BUILD YET** here.

---

## A. The 10-Minute Experience

The user enters a world through one sentence: *"A family breakfast where one member is secretly an assassin."* The system starts them at a table. (SPY × FAMILY, Loid's first person — but the structure generalizes.)

**0:00 — Enter.** A short description: a living room, a woman pouring tea, a child watching TV. The user is told who they are, where they are, who is present. Two or three things they could do are shown. No tutorial.

**0:40 — Talk.** The user compliments Yor. She reacts warmly — *slightly* awkwardly. The user feels the moment was noticed, not scripted.

**2:00 — Ask.** The user asks where Yor was last night. Her answer is a little too fast; the description of her hands tightens on the cup. The user thinks: *she's hiding something.*

**3:30 — Interrupt.** Anya, unprompted, says something that only makes sense if she knows more than a child should. Yor laughs it off. The user files it away.

**4:30 — Decide.** The user decides to follow Yor tonight instead of going to work. The story does not object; it just notes the plan.

**6:00 — Follow.** The scene shifts to evening streets. The user tails Yor and sees her meet a shadowed contact. The user gains one concrete fact: *Yor is not what she says.*

**7:30 — Consequences recur.** Back at the breakfast table, Yor is distant and guarded. The user's earlier question and the tailing are both *present in the room*. The user thinks: *this world remembers what I did.*

**9:30 — Discovery.** A drawer the user opens contains a record that confirms the suspicion — information they were not supposed to have at the start. The user leaves with a secret and knows they know it.

**Feeling:** *I entered a world that exists beyond this AI's response.*

---

## B. Reality Moments

The moments that make the world feel alive, ranked by importance (not by feature value — by how much they create the "world exists" feeling):

| # | Moment | User's thought |
|---|--------|----------------|
| 1 | Yor reacts differently at 7:30 because of what happened at 2:00 and 6:00 | *"This world remembered what I did."* |
| 2 | Anya knows something Loid doesn't, and it leaks through her behavior | *"This character knows something I don't."* |
| 3 | Following Yor produces a *new fact* the user didn't start with | *"I discovered something real."* |
| 4 | The user's choice (follow vs. not) changes later scenes, visibly | *"My decision changed something."* |
| 5 | The user learns they are holding a secret others don't know they hold | *"There is information asymmetry and I'm inside it."* |
| 6 | The world acknowledges absence/downtime (what happened while I wasn't looking) | *"The world continues without me."* (weakest — defer) |

**Ranking note:** #6 is consciously deferred. It is the least load-bearing for the 10-minute loop and the most expensive.

---

## C. Reverse Engineering

For each important reality moment: experience → behavior → information → state → capability.

| Moment | Required behavior | Required information | Minimum state | Minimum capability |
|--------|-------------------|----------------------|---------------|--------------------|
| 1. Memory of actions | Later scenes reference earlier user actions and their effects | What the user did, in order | A **causal record** of actions + their effects | Append-only **event log**; the log *is* the memory |
| 2. Knowledge asymmetry | A character behaves as if knowing something the player doesn't | Which facts each observer actually knows | Per-observer set of **known facts** | **Known-facts sets** per observer, distinct from truth |
| 3. Discovery of new facts | Following / searching yields facts the user didn't start with | The world contains facts not yet revealed to the user | Facts with a **visibility** label vs. the observer's known set | A fact exists independently of who knows it |
| 4. Choices change later scenes | Consequences of a decision appear again later | What the decision was, and its effect | The event log (again) + changed state (location/activity/relationship) | Consequences are real state changes, not text |
| 5. Holding a secret | The user knows something others don't, and it stays hidden | Who knows what, per fact | Known-facts sets + projection | **Projection** is the only read path (no leaks) |
| 6. World continues (deferred) | Off-screen events exist on return | What happened while absent | Scheduled events / world tick | **Deferred to TEST NEXT** — not required for the loop |

**Pattern in the table:** everything reduces to four things — *what is true* (state), *what happened* (events), *who knows what* (knowledge), and *who is looking* (projection). Nothing else appears.

---

## D. Proposed Minimum Model

Five concepts survive the deletion test. Every other concept in the design vocabulary was either merged into these, stored as ordinary state, or deleted.

### 1. World Definition
- **Purpose:** the *content* of a world — who/what exists, initial facts, initial relationships, the opening situation text.
- **What user experience requires it:** without a definition, there is no world to enter; the "table, tea, TV" opening is authored content.
- **What breaks without it:** nothing to instantiate; every session would start from nothing.
- **Why it cannot be derived from another concept:** it is the input, not a computation.
- **Deliberate minimalism:** it is **plain data**, not a schema system. No ontology, no typed-category taxonomy, no rules engine. Fields are whatever the slice needs (a character has: name, description, location, one relationship value, initial known-facts). *Do not design a universal schema.*

### 2. World Instance (the state)
- **Purpose:** "what is true right now" — one mutable object: entity locations/activities, relationship values (a small set of scalars like affinity/trust/suspicion), each observer's known-facts.
- **What user experience requires it:** "Yor is distant and guarded at 7:30" must be *true* now because of earlier events.
- **What breaks without it:** the world cannot change; every turn would re-roll from scratch.
- **Why it cannot be derived from another concept:** it is the projection target of the log — recomputable, but you need the current value at all times; the log is the *why*, the instance is the *what is*.
- **Deliberate minimalism:** entities, relationships, and knowledge are **fields inside the instance**, not separate subsystems. No graph database, no ECS, no entity registry.

### 3. Fact (with visibility)
- **Purpose:** an atomic truth ("Yor is Thorn Princess") that exists independently of who knows it, labeled with a visibility scope (secret → public).
- **What user experience requires it:** discovery (moment 3) and holding-a-secret (moment 5) both require facts that exist *unrevealed*.
- **What breaks without it:** secrets, misunderstanding, and discovery collapse; "I found out something real" becomes fake.
- **Why it cannot be derived from another concept:** truth ≠ knowledge. A fact can be true while zero observers know it; visibility ≠ actual knowledge (a character may know a secret but never tell).
- **Deliberate minimalism:** one visibility label per fact is enough for the slice. Do not build an access-control lattice or an epistemic logic engine.

### 4. Event (the log)
- **Purpose:** the record of every change — "the user asked, Yor answered, the user followed, a fact was revealed". The only writer of the instance.
- **What user experience requires it:** memory of actions (moment 1) and choices affecting later scenes (moment 4) both require a causal record that persists across turns.
- **What breaks without it:** the world forgets; consequences cannot be explained or replayed; debugging is impossible.
- **Why it cannot be derived from another concept:** it is the *causal* dimension that state alone lacks (state says *what*, log says *why* and *in what order*).
- **Deliberate minimalism:** an append-only array of events with a small payload. **No event-sourcing framework, no CQRS, no bitemporal database.** A plain list is the whole mechanism.

### 5. Projection
- **Purpose:** "what a given observer may see right now" — the only read path. Produces: a short situation description, the visible facts, who is present, and a small set of valid actions.
- **What user experience requires it:** knowledge asymmetry (moment 2) and no-leak (moment 5) both require that the user/UI/LLM see the world *through* an observer, never raw truth.
- **What breaks without it:** epistemic leakage; a character's "knowledge" becomes decorative; the player sees what they shouldn't.
- **Why it cannot be derived from another concept:** it is the *function* that turns state + observer into experience; without it nothing can be shown safely.
- **Deliberate minimalism:** Projection absorbs **Perspective, Experience, and Scene** (they are parameters and outputs of this function, not stored systems). No significance engine, no scene state machine.

**What got merged/deleted in this pass:**
- Perspective, Experience, Role, Scene, Situation → parameters/outputs of **Projection**.
- Character, Entity, Relationship, Resource → **ordinary fields of the Instance**.
- Rules, Rules Engine → **validation logic inside the event writer**, not a separate subsystem.
- Knowledge boundary "system" → the **known-facts sets + Projection** (no logic engine).
- Significance, salience, scheduler, NPC autonomy, drama manager → **DO NOT BUILD YET** (below).

---

## E. What We Should NOT Build

Aggressive list of tempting abstractions, deliberately postponed. Reason = "what user experience breaks if we postpone it" → answer: none in the 10-minute loop.

| Abstraction | Why it's tempting | Why postpone |
|-------------|-------------------|--------------|
| Universal world schema / ontology | "Every world is different" | The slice needs ~4 fields per character; a schema system serves no current experience. Write plain data. |
| Rules / storylet engine | "Clean causality" | Validation is a few `if`s in the event writer. Extract only after a second world repeats the pattern. |
| Event-sourcing framework / CQRS / bitemporal DB | "Audit & time travel" | An append-only array delivers memory + replay for the slice. Add machinery only when the log becomes a bottleneck. |
| Scene state machine | "Interfaces differ per world" | Scene = output of Projection. If the UI needs scene *states*, that's a UI problem, discovered by testing. |
| Significance / salience engine | "What matters right now" | The slice can use "present observers + focus" heuristics. No new layer. |
| Scheduler / world tick | "World keeps living" | Reality moment #6 is deferred; the 10-minute loop is player-driven. |
| NPC autonomy loop | "Believable characters" | Reactions (prompt-based, grounded in the NPC's known-facts) are enough; full autonomy is a later experiment. |
| Knowledge access lattice / epistemic logic | "Precise secrecy" | One visibility label + known-facts sets already yields secrets, irony, deception. |
| Relationship/psychology simulation | "Deep NPCs" | A handful of scalars (affinity/trust/suspicion) suffices; simulate only if the user demands more. |
| Memory system (semantic/vector) | "Remembering across sessions" | The event log *is* memory for the session. Cross-session memory is a different product question. |
| World editor / Host tools | "Players create worlds" | The definition is a text file; editing can wait until authoring is an observed need. |
| Multi-world / multi-user / scale | "The platform" | Optimizing for 2+ worlds before one world feels real is premature (Trap D: causal depth > content volume). |
| Plot / quest / drama-manager engine | "Guarantee good stories" | Story is an emergent consequence (VISION.md); a curator layer belongs to a later, evidence-driven phase. |

---

## F. Open Questions

Uncertainties that theory cannot settle. Each has the smallest experiment that resolves it.

| Question | Smallest experiment |
|----------|---------------------|
| Q1. Do NPC knowledge boundaries need an *explicit* known-facts model, or is prompt-only enough? | Create one secret shared asymmetrically between three characters; let the user probe each. If prompt-only reliably leaks or forgets within 5 probes, the explicit model is required (expected: it leaks). |
| Q2. Do relationship values need *explicit scalar state*, or can the LLM track them from context? | Compliment a character, then ask an unrelated question 3 turns later about how they feel. If the LLM doesn't consistently recall the earlier interaction, explicit scalars are required. |
| Q3. Is a single visibility label (secret/public) enough, or do we need graded levels? | Author two secrets with different exposure rules (one known to a bystander, one not). If the single label can't express the cases users actually probe, add one more level. |
| Q4. Is the *event log* necessary, or would a natural-language "session summary" give the same memory? | Run the same 10-minute experience twice: once with a structured log as memory, once with a prose summary as memory. Compare consequence consistency (does the world reference the right details in the right order?). |
| Q5. Does the world need to acknowledge off-screen time for the loop to feel real? | Ship without it; after 3 user sessions, check whether anyone says "nothing happened while I was away". Only then build a scheduler. |

---

## Final Recommendation

**BUILD NOW**
- The 5-concept model: **World Definition** (plain data) + **World Instance** (state) + **Fact** (visibility) + **Event** (append-only log, only writer) + **Projection** (only read path).
- One concrete slice (SPY × FAMILY breakfast) implementing: talk → ask → decide → follow → discover → consequences recur.
- The event writer, the projection function, and the known-facts sets. No other subsystem.

**TEST NEXT**
- Q1 experiment: explicit known-facts vs. prompt-only knowledge boundaries (expect: prompt-only leaks).
- Q2 experiment: explicit relationship scalars vs. LLM-from-context (expect: scalars needed).
- Q4 experiment: structured event log vs. prose summary as memory (expect: log wins on consistency).
- Reality moment #6 (world continues without you) — only if user sessions demand it.

**DO NOT BUILD YET**
- Universal schema / ontology · rules engine · event-sourcing framework · CQRS · bitemporal DB · scene state machine · significance engine · scheduler/world-tick · NPC autonomy loop · knowledge access lattice · psychology simulation · memory system · world editor · multi-world/multi-user · plot/quest/drama-manager · graph database.

> The 10-minute experience demands exactly four data shapes — *state, events, facts+knowledge, projection* — and one content file. Everything else is architecture waiting for evidence.
