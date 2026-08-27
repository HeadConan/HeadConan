# HeadConan Core Experience (CORE_EXPERIENCE)

> Answers one question: **What must HeadConan be, to make people "want to keep playing"?**

---

## 1. Rejection: Answers Too Broad

- ❌ "AI-driven interactive world" — ChatGPT could say the same.
- ❌ "Generative UI + story" — marketing jargon.
- ❌ "Users can play any character" — role-playing games already exist, and do it better.

These answers do not explain "why HeadConan and not someone else".

---

## 2. The 5 Things HeadConan Must Do That ChatGPT Cannot

| # | Capability | ChatGPT | HeadConan should have |
| :--- | :--- | :--- | :--- |
| 1 | **Persistent world state** | No real persistence across turns (unless externally wired) | A single ongoing world, survives refresh, branches replayable |
| 2 | **Information asymmetry** | Assistant knows everything | Player does not know certain things; characters do not know about each other |
| 3 | **Perceptible consequences** | "You could do this" but it does not really change the world | Action → state genuinely changes (relationship / reputation / presence / event) |
| 4 | **Scene-based interface** | Always one chat box | Interface organized around "what is happening right now" |
| 5 | **Characters with agency** | Assistant replies passively | NPC has its own knowledge / goals / reactions, can act proactively |

> Of these 5, the current prototype has **delivered none for real** (see key findings F1–F8 in `CURRENT_STATE.md`).
> They are the **acceptance criteria** for the next version.

---

## 3. Core Loop: Rejecting the Simplification "User → Intent → World"

The loop given by the prompt:
USER INTENT → interpretation → ACTION → transition → new state → consequence → presentation → perception → new intent

**Problems**:
1. Treats "player" as the world's only input — ignores NPC autonomy.
2. "Consequence" is immediate — ignores delayed consequences (the minister replies tomorrow).
3. "Presentation" happens directly — ignores the filtering (salience) between "what happened in the world" and "what the user should see".
4. No time — turns decoupled from the world's clock.

**The real loop (dual cadence)**:

```
【User cadence】(reactive)
   user intent ──► parse ──► candidate events ──► kernel ──► drain ──► salience ──► projection ──► scene ──► interface

【World cadence】(autonomous)
   scheduler / agent ──► candidate events ──► kernel ──► (same drain chain) ──► events accumulate ──► trigger scene switch

【Convergence point】
   event stream (any source) ──► single event kernel (applyEvent)
                         ──► state + log (single source of truth)
                         ──► observation side-effects (cognition ledger writes)
                         ──► salience ──► scene ──► render
```

**Key invariants**:
- **State changes only go through the single event kernel** (Player / NPC / Host / rules are all event producers; the only difference is production method and permissions).
- **Cognition is written only via observation side-effects** (avoid leaks).
- **Scenes are dynamically composed around the current focus** (not a set of pages).

---

## 4. Minimal Experience (Happens Within 10 Minutes)

> Full walkthrough in [`10_MINUTE_EXPERIENCE.md`](./10_MINUTE_EXPERIENCE.md). Summary:

1. Enter SPY×FAMILY.
2. Morning family scene: have breakfast with Yor and Anya.
3. Choose to say a line — there are several latent intents (care / probe / joke).
4. Yor's response hints that she "worked late" again last night (Loid does not know what she did).
5. System hint: Anya's reaction makes you feel she knows something (she reads minds but you do not know).
6. You want to go to school — scene switches from home to campus.
7. An event appears: receive an encrypted text message requesting an urgent meeting.
8. You click the meeting target — he carries intel you had not seen before.
9. You write your suspicion in notes.
10. Switch to the host perspective — you see Anya really knows everything, but is bound by secrecy rules.

**Why this is "worth playing" and not "reading a story"**:
- Every turn has **real state change** (relationship values / event entries / scene switches), not just a block of text.
- What you **suspected** (Anya knows) is **confirmed** after you switch to the host perspective — this is not the narrative telling you, this is you **seeing it yourself**.
- The **scene switches** from morning → campus → secret meeting have reasons (you make a choice, the world responds, not a random page change).

---

## 5. Counterexample: If We Lose These Traits, What Does It Become?

| Missing | → experience degrades to |
| :--- | :--- |
| No persistent state | ChatGPT long conversation: context scrolls away and is forgotten |
| No information asymmetry | Visual novel: you know everything, no suspense |
| No perceptible consequences | Text adventure game: you type, but the numbers do not move |
| No scene-based interface | One super-long chat box, impossible to locate after 150 turns |
| No autonomous NPC | RPG scripted drama: NPC waits for you to trigger, never comes to you |

**HeadConan's moat = possessing all five at once**. Losing any one immediately becomes something else.

---

## 6. Beyond the Core Loop: What Is NOT Core

| Not core | Reason |
| :--- | :--- |
| Perfect image generation | Icing on the cake; SPY×FAMILY works with existing avatars + static evidence map |
| Huge world database | 60+ candidates are a discovery tool; next version needs only one hand-written SPY×FAMILY |
| Complex multi-agent society | NPC autonomous advancement can degrade to "simple reaction + scheduled trigger" |
| Multi-device / cloud sync | Standalone localStorage satisfies "survives refresh" |
| Full world editor | Host perspective only needs basic fact / character / rule inspection |
| Hundreds of component libraries | 5 primitives + shared Block registry |

---

## 7. Minimal Metrics to Measure "Success"

After the 10-minute experience runs, these should **hold naturally** rather than be deliberately verified:

| Metric | Evidence of natural holding |
| :--- | :--- |
| "I was heard" | Your specific line triggered the character's reaction to **that line** (not a template) |
| "There are things I do not know" | You saw an unexplained event; after switching to host perspective you **understood** |
| "The world keeps going" | Without input, NPCs move within their own scenes (visible change after 30 seconds) |
| "Scenes respond" | You took an action, focus switched from "family" to "campus" or "secret meeting" |
| "I want to do it again" | Replaying the same world's opening (different scene) gives a different experience; switching worlds gives a different "feel" |
