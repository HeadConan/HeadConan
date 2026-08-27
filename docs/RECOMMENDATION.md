# HeadConan Next-Version Recommendation (RECOMMENDATION)

> Final judgment synthesizing `CURRENT_STATE.md` / `CORE_EXPERIENCE.md` / `10_MINUTE_EXPERIENCE.md` / `NEXT_BUILD.md` / `SCENE_MODEL.md` / `LAYOUT_DIRECTION.md` / `DECISIONS.md` / `DO_NOT_BUILD_YET.md`.
> Does not protect existing decisions. Treat the status quo as an experiment that tells us "what HeadConan should become".

---

## 1. The Problem With the Status Quo

### 1.1 Current HeadConan

- A React app that looks like an "AI dashboard".
- LLM generates lore + card grid + command box.
- Visually pretty (light zinc + new sidebar + 11 kinds of Block), but **all promises are fake**.
- The selling point of "generative UI" = a pile of cards screaming at once; the user feels SaaS, not a world.

### 1.2 The User's Real Experience (chronological)

| Moment | User feeling |
| :--- | :--- |
| Enter app | "Clean ChatGPT-style home page" (no differentiation) |
| Select Empire | See the name "Sovereign Imperium of Valen" (interesting) |
| Enter workspace | "Wow, map, characters, documents… so many cards" |
| Click "Dispatch Praetorian inspection" | Receive a **template narrative unrelated to the command's specifics** (break) |
| Look at numbers | Stability 62→57, loyalty 52→42 (numbers changed — good) |
| Switch to Director | Director Console appears; **but character loyalty numbers identical to player perspective word for word** (break) |
| Explore Atlas | See a rich world catalog, but clicking in still goes through the same dashboard flow |

---

## 2. The Most Valuable Parts of the Status Quo

| Asset | Assessment |
| :--- | :--- |
| `representation/*` representation system | Typed foundation is real; E1 instantiate verified; **should be the kernel's data contract** |
| `server.ts` gateway | Multi-provider + fallback chain solid; swappable contract |
| `UI_CAPABILITY_REGISTRY` pattern | "Data shape → renderer" mapping can be retained as in-scene Block pool |
| `AppSidebar` / `Header` / `ActionDock` | Stable framework elements |
| `WorldAtlasExplorer` | 480+ world catalog is a discovery tool, not core |
| `VisualSynthesisStudio` | Image generation can be an in-scene modal |
| 11 architecture documents | Guide the next version (**not implementation**) |

---

## 3. Parts to DELETE

| Category | Content | Reason |
| :--- | :--- | :--- |
| Type | `src/world/types.ts` (incl. `colSpan`) | Domain types mixed with UI fields |
| Module | `engine.ts` keyword synthesis | Pseudo-synthesis, replaced by LLM + deterministic fallback |
| Module | `mutations.ts` scalar clamping | Replaced by event kernel |
| Mechanism | `[DIRECTOR INTERVENTION]` text prefix | Faked permission, replaced by sourced events |
| Module | `computeUIPlan` rule tree | Replaced by salience + scene |
| Module | `renderer.tsx` 3-column grid | Replaced by 5-primitive layout engine |
| Data | `uiPlanning` field in `mockWorlds.ts` | Worlds should not carry UI plans |
| Experience | The implicit template of "sidebar + top + main + right column" | Replaced by "stable framework + dynamic scene" |

---

## 4. Parts to RETAIN and Evolve

| Category | Evolution direction |
| :--- | :--- |
| `representation/*` | Wire into runtime (connect P2 kernel + scene state) |
| `AppSidebar` | Retain as stable navigation; add "current scene" indicator |
| `Header` | Retain as top stable area; scene identity as title rather than world name |
| `ActionDock` | Retain as bottom action dock; verb set comes **from the scene** not `role.suggestedPrompts` |
| `Block` renderer | Retain mapping pattern; enter "in-scene stage internal components" |
| `LayoutLab` | Rework into "scene stage experiment ground" |
| `NotesDrawer` | Link to entities — each note can bind a character / event |
| `ChronicleModal` | Link to event log — not a string array |
| `WorldAtlasExplorer` | Retain as discovery tool, **not** a next-version target |
| `EngineSelector` | Retain as bottom-bar engine selector |
| `EmptyPromptSpace` | Major change — from "ChatGPT landing page" to "world selection + character preview" |

---

## 5. Core Experience (Not a Feature)

> A user enters SPY×FAMILY and within 10 minutes can experience:
> 1. In conversation with Yor, a hint of last night's mission **really** appears (not a template).
> 2. Anya interjects on her own (NPC spontaneous action).
> 3. Reputation **really** drops after **missing** the parent interview.
> 4. In the infirmary, discovering that pen **really** gets recorded as evidence (your knowledge ledger +1).
> 5. Switch to host perspective, see Anya **really** knows everything about you.

None of these 5 things can be done today. They are the **only** goal of the next version.

---

## 6. How the Next Version Should Feel

- The user opens the app and **immediately enters a world** (not a ChatGPT-style landing page).
- The interface has only one **main stage**, organized around "what is being done right now" (dialogue / investigation / daily / editing).
- The user types a line, the world **really hears it** (NPC responds with its own knowledge, no template).
- The user makes a choice, **really changes state** (numbers, relationships, event entries, scene switches — all visible).
- The user switches to host, sees facts the player **absolutely cannot see** — **irony** holds.

**Not**: "super dashboard", "ChatGPT enhanced", "dynamically generated story".

---

## 7. Layout Direction (minimal execution version)

- **Stable**: left navigation (world identity / current scene / entry), bottom action dock (verbs change with scene).
- **Dynamic**: main stage form (dialogue / spatial / investigation / schedule / editing), context rail content (only relevant to focus), ambient band (time + 1 relationship + 1 crisis metric).
- **Key concept Focus**: what the user is currently looking at — drives stage form and rail content.
- **Scene types (minimal set of 4)**: conversation / everyday / exploration / world_editing (host).

See [`LAYOUT_DIRECTION.md`](./LAYOUT_DIRECTION.md) / [`SCENE_MODEL.md`](./SCENE_MODEL.md).

---

## 8. Minimal Technical Foundation

- **Hand-write one SPY×FAMILY definition** (minimal set: 10 characters, 4 locations, 3 relationships, 2 secrets, 8 rules).
- **Event kernel `applyEvent`** (all 7 precondition types implemented + cognition side-effects + log).
- **First-order `speech_act` event** (incl. `intentTag/subtext`).
- **NPC reaction template** (reaction based on emotion + relationship + knowledge, **not a full agent**).
- **Scene state machine** (4 types + switch rules).
- **5-primitive layout engine** + Focus.
- **localStorage persistence** (world + log + sceneState).
- **Knowledge projector wired before rendering** (every UI frame passes through `projectEpistemicPerspective`).

Explicitly **not building**: see [`DO_NOT_BUILD_YET.md`](./DO_NOT_BUILD_YET.md).

---

## 9. What to Build Next

### The First Code to Write (the only one)

**Minimal usable version of the event kernel `applyEvent`**:

```
applyEvent(state, definition, event)
  → { nextState, spawnedEvents[], observations[], rejected?, reason? }
```

**Why this one**:
- It is the **minimal common denominator** of the three promises "perceptible consequences" / "information asymmetry" / "event-driven".
- Everything else (dialogue, agents, scenes, layout) is built on top of it.
- Fixing the "cognition leak" bug found in E1 must be completed in this version.

**What it proves**:
- The player's specific command really affects the world (not template matching).
- State really changes (not just narrative paragraph changes).
- The knowledge ledger really updates (information asymmetry demonstrable).

**What it does NOT prove**:
- Dialogue experience (needs speech_act + NPC decision).
- Autonomous NPC (needs agent layer).
- Scene switching (needs scene state machine + trigger rules).
- Real irony (needs knowledge projection + host lens).

**Signs of success**:
- E1's `[DIRECTOR INTERVENTION]` hole fixed: `requires_knowledge` is truly enforced.
- Player action → state serializable → log replayable → replaying with the same log prefix yields the same state.
- Knowledge ledger writes happen **only** through the `reveal_fact` effect; no path for "directly reading full state".

---

## 10. Pitfalls to Avoid

| Pitfall | Manifestation |
| :--- | :--- |
| "Optimizing architecture while ignoring experience" | Pretty documents + stalled product |
| "Multiple worlds in parallel" | 6 shallow worlds < 1 deep world |
| "Writing a full decision loop for NPC" | Time runs out, player never plays |
| "Finishing the editor first" | Host tools complete, player experience missing |
| "Polishing visuals for another week" | FLIP animations can wait; the 10-minute experience cannot |
| "Adding full subtext UI for dialogue" | A text hint "(Anya thinks: she knows)" is enough; full UI deferred |

---

## 11. Stop Conditions (restated)

**Do not start large-scale implementation until these are clearly answered**:

1. **WHAT IS THE CORE EXPERIENCE?** → see §5.
2. **WHAT IS THE CORE USER LOOP?** → see `CORE_EXPERIENCE.md` §3.
3. **WHAT IS THE CORRECT LAYOUT DIRECTION?** → see §7 + `LAYOUT_DIRECTION.md`.
4. **WHAT IS THE MINIMUM SYSTEM REQUIRED?** → see §8 + `NEXT_BUILD.md`.
5. **WHAT ARE WE DELIBERATELY NOT BUILDING?** → see `DO_NOT_BUILD_YET.md`.
6. **WHAT SINGLE EXPERIMENT SHOULD WE BUILD NEXT?** → §9 (`applyEvent` minimal version).

All are answered in this review. The next step is to **execute according to the dependency graph in `NEXT_BUILD.md`**, validating each phase with a "user-perceptible" exit criterion.
