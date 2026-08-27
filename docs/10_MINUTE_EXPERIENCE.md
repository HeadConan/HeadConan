# HeadConan 10-Minute Experience (10_MINUTE_EXPERIENCE)

> **Target world**: SPY×FAMILY (hand-written minimal definition: 10 characters, 4 locations, 3 relationships, 2 core secrets).
> **User identity**: Loid Forger (first-person perspective, the master spy "Twilight").
> **Core thesis**: To validate 5 promises within 10 minutes (information asymmetry / perceptible consequences / scene-based interface / autonomous NPC / persistent world).

---

## 1. Initial State (Player Enters the World)

- **Scene**: Morning family breakfast. Location: Forger living room.
- **Present**: Loid (player), Yor, Anya.
- **Known facts** (player projection): Yor is a "city hall clerk", Anya is "first grade elementary", Bond is a pet.
- **Unknown facts** (outside player projection): Yor is the Thorn Princess (assassin); Anya is a mind-reader; Loid is the WISE spy Twilight; Bond foresees the future.
- **Relationships**: Yor-Loid "fictional married cover" affinity +30 / trust -10 (due to pretense); Loid-Anya suspicion +60 (she is too smart).
- **Time**: 7:30 AM; Loid has an Eden Academy "parent interview" later.

---

## 2. 10-Minute Walkthrough (10 steps, ~1 minute each)

### Step 1 — Entry (0:00)
- Interface enters the "family breakfast" **scene**.
- Main stage: dining table, Yor pouring tea, Anya watching TV, Loid just sat down.
- Context rail (secondary): today's schedule (parent interview 9:00 / contact rendezvous 14:00 / mission deadline tomorrow).
- Ambient band: time 7:30 / mood "calm · slightly tense" / 1 pending intel (from WISE).
- Action dock: three verbs "compliment Yor" / "probe Anya" / "finish eating quietly" (bound to the scene, not free text + suggestions).

### Step 2 — First Choice (0:30)
- Loid chooses: "compliment Yor" → system shows a **first-order speech event**: `speech_act(actor=Loid, addressee=Yor, utterance="The breakfast today is so cozy", intentTag=compliment)`.
- Yor's response (**independent NPC decision**, using her own projection view — she does not know Loid is a spy, but she knows she is an assassin):
  - Yor's text reply: "Oh, thanks… actually I worked late last night, a bit tired" (**subtext**: she is hiding a nocturnal mission)
  - Relationship event: Yor-Loid affinity +2; Yor emotional state → "relieved · wary".
  - **Log**: 1 event enqueued; in-scene state: dialogue turn = 1.

### Step 3 — Anya's Reaction (1:30)
- Anya (mind-reader, **she knows Yor is an assassin, but is bound by secrecy rules**) suddenly interjects: "Did mommy kill someone again?"
- This is **Anya's own utterance** (autonomous NPC action, not player-triggered).
- Yor's reaction: shocked → plays dumb: "What is Anya talking about".
- Loid's reaction: you see an **unexplained signal** — why would Anya say such a thing? Note it down.
- **Scene remains family**, but tension escalates.

### Step 4 — Recording Suspicion (2:30)
- You write in your notes: "Does Anya know something? Need to keep observing." → enters the notes system, associated with the "Anya" entity (not plain text).
- You choose "probe Anya" → say to Anya: "Anya, listen carefully in class today." Intent: probe.
- Anya's inner thought (**invisible**, player does not know she read you): "Does he know that I know?" (her script)
- Anya's outward behavior: obediently nods.
- Relationship event: Anya-Loid trust +3; Anya's "initiate" profile flagged "low exposure risk".

### Step 5 — Scene Transition (3:30)
- System event (**world cadence**): clock advances → time 8:45 → time to leave.
- Scene **automatically** switches to "commute": movement path from home to Eden Academy; rail shows "pedestrians on the road" / "pending intel pickup".
- Loid receives WISE signal: "Cipher 'STRIX' upgraded — watch the new teacher at Eden Academy".
- You click "accept mission", scene switches to "Eden Academy corridor" (focus changes).

### Step 6 — Campus Scene (4:30)
- Main stage: Eden Academy corridor, Damian Desmond chatting at the end of the hall.
- Context rail: "Damian's schedule" / "recent school rumors" / "Daybreak operation codename".
- You choose "approach Damian" → first-order speech event.
- Damian mentions: "The new teacher Mr. Smith has been asking about your daughter's grades lately." (**information injection**: new character clue)
- **Scene state**: dialogue turn +1; you obtain a "point of interest".

### Step 7 — Decision Moment (6:00)
- System prompt: you may choose "go home to continue investigating Yor" or "go to the infirmary to investigate Mr. Smith" or "do nothing, go to the parent interview first".
- You choose "go to the infirmary".
- **Scene transition**: corridor → infirmary. New NPC "Mr. Smith" enters your view, carrying a suspicious prop (a scalpel-shaped pen).

### Step 8 — Evidence Discovery (7:30)
- You click "examine that pen".
- System runs event `forensic_action(actor=Loid, target=pen)` → rule engine checks knowledge precondition (requires forensic_inspection) → passes.
- **State genuinely changes**:
  - Knowledge ledger: `knownFacts(Loid) += "fact:pen_is_surveillance_device"` (**Loid only**)
  - Scene event log: 1 entry "Pen identified as surveillance"
  - Mr. Smith state: emotionalState → 'alert'
- Context rail updates: now shows "evidence map" (pin + thread) + "list of suspicions".

### Step 9 — Note Writing + Scene Recovery (8:30)
- You write in your notes: "Mr. Smith may be an enemy observer. Need to make contact and counter within 24 hours."
- System prompt: time 9:55 → missed the parent interview.
- **Consequence visible**: reputation metric -10 (school notification); relationship event: Damian's mother (Anya's classmate's mother) impression of you -5.
- Scene **automatically** returns to "Eden Academy corridor" — too late, the interview is unrecoverable.

### Step 10 — Host Perspective (9:30)
- You switch to the "Director" (actually Host) perspective.
- Interface becomes "world editing" form: character list on the left, relationship graph on the right, omniscient fact panel.
- You click Anya → see: **Anya already knows Loid is a spy, Yor is an assassin, Mr. Smith is the enemy** — but bound by the "secrecy" rule she cannot say it.
- You click Yor → see: **Yor's "overtime" is an assassination mission; she completed the kill last night but thinks no one knows**.
- These two facts **you absolutely did not see from the player perspective** — but the host saw them.
- **Irony moment**: as a player your "suspicion of Yor/Anya" was a guess; as the host it is **confirmed**.

---

## 3. Promises Validated (cf. `CORE_EXPERIENCE.md` §2)

| Promise | Validation moment |
| :--- | :--- |
| Information asymmetry | Step 2 (Yor hides) / Step 4 (Anya's mind-reading suppressed) / / Step 10 (host sees everything) |
| Perceptible consequences | Step 9 (missed interview → reputation -10 + relationship -5; clickable to see specific changes) |
| Scene-based interface | Step 5 (scene auto-switches to commute) / Step 7 (switches to infirmary) / Step 10 (switches to editing form) |
| Autonomous NPC | Step 3 (Anya interjects on her own) / Step 6 (Damian proactively provides clue — not player-triggered) |
| Persistent world | The whole flow happens within "the same instance"; after refresh the "reputation -10" from Step 9 persists |

---

## 4. Boundaries (What Is NOT Done Within 10 Minutes)

- No NPC backstory expansion
- No 3D scene rendering
- No branch replay (the experience itself is one walkthrough)
- No full-featured open world editor (host can only inspect, not change definitions)
- No full legal/professional system (Eden Academy is background, not a rule engine)

---

## 5. Minimal System Required to Run This Experience

See [`NEXT_BUILD.md`](./NEXT_BUILD.md). Minimal set:

| System | Required | Reason |
| :--- | :--- | :--- |
| World definition (SPY×FAMILY) | ✅ | entity / fact / relationship / rule seeds |
| WorldInstance (state + log) | ✅ | target of player actions and NPC reactions |
| Event kernel `applyEvent` | ✅ | sole writer; precondition / effect / cascade / observation |
| First-order speech event `speech_act` | ✅ | required for Step 2, 4, 6, 7 |
| Agent decision (NPC perception → reaction) | ✅ | required for Step 3, 6 (minimum: emotion/relationship-based reaction templates) |
| Knowledge ledger + projector | ✅ | required for Step 10 (use existing `representation/epistemics/projector.ts`) |
| Scene state machine | ✅ | required for Step 5, 7, 10 (4 scene types) |
| 5-primitive layout + Focus | ✅ | required for scene stage form |
| Persistence (localStorage) | ✅ | survives refresh |
| Full rule engine / consequence engine | ⚠️ partial | only the minimal rules for forensic_action + speech_act needed |
| Relationship evolution engine | ❌ for now | relies on explicit rule effect (+2 affinity), no psychology simulation |
| Full world database | ❌ | only one SPY×FAMILY |
| Complex multi-agent | ❌ | NPC is "emotion/goal-based reaction template" not full decision-making |
| Cloud persistence / branching | ❌ | localStorage is enough |
| World editor | ❌ | host read-only + intervention events |
| Image generation | ❌ | static avatars + static evidence map |

---

## 6. Implementation Signal: Earliest Moment the Experience Breaks

| Moment | User might feel |
| :--- | :--- |
| Step 2 if Yor's response is a template rather than "worked late last night" | "She isn't listening to me" |
| Step 3 if Anya does not interject on her own | "Anya is just decoration" |
| Step 5 if the scene does not auto-switch to commute | "Do I need to switch manually?" |
| Step 8 if "pen_is_surveillance_device" does not enter the knowledge ledger | "This is just plot, nothing really happened" |
| Step 9 if the reputation number does not move | "What I did has no effect" |
| Step 10 if switching to Director shows no Anya omniscience | "Character switching is just a UI gimmick" |

**At ANY of these moments**, if the experience breaks, this iteration has failed.
