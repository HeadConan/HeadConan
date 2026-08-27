# HeadConan Decision Record — Next Version (DECISIONS)

> Focuses on product decisions for the next iteration. Format: question / options / decision / rationale / cost / what would change our mind.
> Complements `ARCHITECTURAL_DECISIONS.md` (architecture-layer ADR-1~12); this document targets "the next 10-minute experience".

---

## D-1 Primary Test World for the Next Version

- **Question**: Which world should validate the core experience?
- **Options**: A) Keep all three existing presets (Empire/University/Mystery); B) Only SPY×FAMILY; C) SPY×FAMILY as primary + keep University walkthrough.
- **Decision**: **C**. SPY×FAMILY as the primary test world; modern University as a secondary world for "daily / schedule" stress testing. Empire and the 1928 mystery are **frozen as demo presets**, no R&D investment.
- **Rationale**: SPY×FAMILY covers all key mechanics at once — information asymmetry (double life), family/society dual scenes, daily life and sudden events, multi-character relationships. The University world specifically tests "time / schedule" and "interesting without grand narrative".
- **Cost**: IP copyright restriction (cannot publicly showcase to outsiders); need to hand-write a minimal but complete Spy×Family definition.
- **What would change our mind**: If validation finds that the "daily world (University)" attracts users more than the dramatic world, shift focus to University.

## D-2 Core Experience Form: Scene-Driven, Not Dashboard

- **Question**: What exactly does the user face inside the "world"?
- **Options**: A) Dashboard card grid (status quo); B) Conversation flow (chat-style); C) **Scene** — a composite configuration of "what is happening right now" (main content + context + actions + present characters).
- **Decision**: **C** (see [`SCENE_MODEL.md`](./SCENE_MODEL.md)).
- **Rationale**: "what the player is doing right now" is the only stable organizing principle; scenes naturally support switching between dialogue / investigation / daily life / world editing, and align with "information asymmetry" (the scene determines what you see).
- **Cost**: Requires a scene state machine and transitions between scenes; more complex than rendering a grid.
- **What would change our mind**: If user testing shows that "automatic scene switching" frequently causes disorientation (user does not know where they are), degrade to a hybrid of "user manually selects scene + default scene".

## D-3 Layout Direction: Stable Spatial Framework + Dynamic Content Composition

- **Question**: Is the layout fixed, dynamic, or hybrid?
- **Options**: A) Fixed layout (sidebar + main + right column); B) Fully dynamic (re-arrange every turn); C) **Stable framework + dynamic content**.
- **Decision**: **C**. Stable parts: brand / world name / turn, main input dock (bottom), navigation (sidebar). Dynamic parts: main stage form (dialogue / spatial / investigation / daily / editing), context rail content, ambient metrics. **New**: add the "current focus" concept — the interface is organized around "what the user is looking at right now" (see [`LAYOUT_DIRECTION.md`](./LAYOUT_DIRECTION.md)).
- **Rationale**: Fully dynamic makes the user lose spatial orientation (LAYOUT_RESEARCH Q3); fixed layout compresses murder mystery and campus life into the same form. C is the only path to "different worlds but consistent tools".
- **Cost**: The main stage needs 4-5 forms (dialogue / spatial / investigation / schedule / editing), each a real piece of work.
- **What would change our mind**: If one form (e.g. dialogue) occupies 80% of usage time, cut the other forms and do dialogue thoroughly first.

## D-4 Conversation-First: Primary Interaction Carrier Is "Conversation + In-Scene Action", Not a Free Text Box

- **Question**: How does the user interact with characters / world?
- **Options**: A) Free text box (status quo: anything goes, all shallow); B) Option-style dialogue tree; C) **Conversation-first (free input still available) + clickable in-scene targets**.
- **Decision**: **C**. Primary interaction = speaking and acting toward people / objects in the current scene (click target → action), free input retained as an advanced path. Conversation needs "first-order speech": `{speaker, addressee, utterance, subtext?}`.
- **Rationale**: Free text = ChatGPT feel (contrast in section 4); pure option tree = visual novel. C retains the magic of "say whatever you want", while letting the world know who you are talking to.
- **Cost**: Requires target resolution (click → action binding) and a speech event model.
- **What would change our mind**: If users prefer pure free text (testing shows clicking is a burden), downgrade clicking to "suggested actions" rather than mandatory.

## D-5 Information Asymmetry Is the First Promise This Version Must Deliver

- **Question**: Player, character, and world have inconsistent knowledge — to what extent should we deliver?
- **Options**: A) Continue not delivering (status quo: role switching only swaps tools); B) Player-perspective filtering only (player cannot see secrets, host can); C) Full tripartite (incl. characters not knowing about each other).
- **Decision**: **B (do first)**. Player perspective = strict filtering; host perspective = omniscient. Cognitive differences between characters are done **later** (D-8).
- **Rationale**: Player vs host is the easiest to demo and the most impressive difference; inter-character cognition needs an agent system (deferred).
- **Cost**: SPY×FAMILY's core irony (Loid does not know Yor is an assassin) can only be partially presented this version.
- **What would change our mind**: If after implementing "player-perspective filtering" players complain heavily "I can't see information anymore" (guessing, suspicion), adjust to "visible but tagged as rumor".

## D-6 Consequences Must Be Perceptible: Events Enter the Log and Change Visible State

- **Question**: How to make "the world will respond" not just narrative text?
- **Options**: A) Narrative paragraph (status quo); B) Narrative + visible state change + event log entry; C) Hardcoded state-machine branches.
- **Decision**: **B**. Every action: narrative (short) + visible state change (relationship value / reputation / presence / new event) + log entry + character reaction (one line in scene).
- **Rationale**: "text says it changed" vs "numbers / relationship graph really changed" is one of the dividing lines between HeadConan and ChatGPT.
- **Cost**: Requires a minimal state model (relationship / reputation / presence / event queue).
- **What would change our mind**: If users are insensitive to numeric changes (think "another dashboard"), switch to a more focused "relationship + event" presentation, cutting redundant numbers.

## D-7 Minimal System Boundary (What This Version Does / Does Not Do)

- **Question**: Which systems are required for the 10-minute experience?
- **Options**: Full architecture vs minimal set.
- **Decision**: **Do**: WorldInstance (state + log), Action→Event (incl. precondition), dialogue (speech_act), relationship state, knowledge record (player / host perspective), Scene (scene configuration), presentation (scene stage). **Do not do**: autonomous agent loop (NPC driven by scripts), full memory, persistent branching, world editor (see [`DO_NOT_BUILD_YET.md`](./DO_NOT_BUILD_YET.md)).
- **Rationale**: The 10-minute experience only needs "I speak → world understands → character reacts → state changes → interface changes".
- **What would change our mind**: If testing finds that a world "feels dead" when NPCs do not act autonomously becomes the biggest complaint, bring the agent loop forward.

## D-8 Inter-Character Cognitive Difference (SPY×FAMILY Irony) — Explicitly Deferred This Version

- **Question**: Loid does not know Yor is an assassin — this is the soul of the IP, do we do it?
- **Options**: A) Do full tripartite cognition this version; B) Fake it with "narrative isolation" tricks (avoidance at the line level); C) Explicitly defer, do player/host two-party first.
- **Decision**: **C** (consistent with D-5). This version's player perspective only exposes information the player should know; inter-character cognitive difference is done next iteration together with the agent system.
- **Rationale**: Inter-character cognition needs "each character has independent knowledge + decides only using its own knowledge" — that equals an agent system, beyond the version's scope.
- **What would change our mind**: None — this is a sequencing issue, not a direction issue.

## D-9 Persistence: This Version Only Needs "Survives Refresh"

- **Question**: Do we need a database?
- **Options**: A) localStorage single object (status quo); B) log + snapshot (event sourcing); C) cloud database.
- **Decision**: **Lightweight version of B** — each turn serialize `{world state, log, scene, player role}` to localStorage; **do not do** replay / branching / multi-device.
- **Rationale**: The 10-minute experience cannot allow "lost on refresh"; but branching and cloud are clearly premature (DO_NOT_BUILD_YET).
- **What would change our mind**: If users explicitly express "I want to go back to an old branch", then upgrade to log + snapshot.

## D-10 Presentation: World Differences Go Through "Experience Signals", Not Hardcoded World UI

- **Question**: How do SPY×FAMILY and University differ in interface language without writing two applications?
- **Options**: A) One set of pages per world; B) Shared components + world theme + scene form.
- **Decision**: **B**. World definition declares experience signals (modal preference / tone / information density); scene form is selected from the shared stage set; theme (color / typography / wording) is driven by signals.
- **Rationale**: A contradicts "world independent of interface" and is unmaintainable.
- **What would change our mind**: If a world is found to need a brand-new interaction mode (existing stage set cannot express it), first extend the stage set, then consider world-specific components.

---

## Known but Unresolved (keep explicitly unknown)

1. What UI should present the conversation's "subtext layer"? (subtext visibility — left to dialogue-form prototype testing)
2. The exact weights of scene auto-switch trigger rules (user action vs world event vs manual).
3. The presentation density of numbers (relationship value / reputation) — primary or background information.
4. Whether the 10-minute experience's "irony moment" must depend on inter-character cognition (if so, D-8 needs re-evaluation).
