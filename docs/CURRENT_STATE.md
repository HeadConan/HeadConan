# HeadConan Current State Review (CURRENT_STATE)

> **Method**: full source re-read (incremental since last review) + real run (procedural mode, no API key) + per-flow browser screenshots (`/tmp/shots/01–05*.png`) + prototype audit cross-validation.
> **Baseline**: iteration 2 (incl. UI lightening, AppSidebar, ui/* primitives, commit f0e3211, E1 instantiate prototype and tests).
> **Classification**: WORKING / PARTIAL / MOCKED / FAKE / VISUAL_ONLY / BROKEN / UNNECESSARY / PROMISING / REQUIRES_REDESIGN / REQUIRES_REPLACEMENT.

---

## 1. Executive Verdict (pessimistic version)

| Dimension | Current state |
| :--- | :--- |
| Visual shell | Clean, credible; light zinc + new sidebar + ui/* primitives are real assets |
| Expresses "user has entered a world" | **Failed**. Overall still "dashboard + command box" |
| Information asymmetry promise | **Not delivered**. Role switching only swaps tools, not visible content (screenshot 05 confirms) |
| Authenticity of consequences | **Half**. Turn / numbers / loyalty really change, but narrative is templated (screenshot 03 confirms) |
| "Characters own their own reality" | **Not implemented**. NPCs do not act autonomously; no independent decision loop |
| "Interface responds to what is happening" | **Not implemented**. Layout is a fixed 3-column grid, does not change with focus / activity |

**One sentence**: the prototype looks like a **generative dashboard**, but promises a **living world**. The distance between these two is the work of the next version.

---

## 2. Feature-by-Feature Review

### Entry and first screen
- **EmptyPromptSpace** — **WORKING** (visual) + **UNNECESSARY** (structural). Light zinc is pretty, title "What do you want to experience?", 3 preset buttons (Empire/University/Mystery) + Atlas entry + engine selector. **Problem**: almost no different from the ChatGPT/Claude home page — a text box + some cards. This itself is not HeadConan's differentiation; it is a **generic AI assistant landing page**. Differentiation should be in "user immediately enters a felt experience after choosing a world".

### World generation
- **Synthesis path** — **MOCKED**. `engine.ts` keyword-matches `'mystery'/'empire'/'university'` and returns preset seeds; prompts outside the keyword set fall back to a generic template.
- **AI path** — **PARTIAL**. `server.ts` is a real agent, but requires the LLM to output a complete world JSON + UI plan in one turn; once the API is unavailable (no key or schema drift), it falls back to procedural.
- **Persistence** — **PARTIAL**. Refresh can restore world+chronicle to localStorage; but no event log, no branching, no snapshot.
- **Real world representation** — **PROMISING** (but not wired). `src/world/representation/*` is an excellent typed foundation (see `ARCHITECTURAL_ASSESSMENT.md`), but `App.tsx` still uses `useState<WorldState>` + legacy `world/types.ts`, so the representation system and runtime path are **disconnected**.

### Workspace layout
- **WorldCanvasRenderer** — **REQUIRES_REPLACEMENT**. `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` is a SaaS dashboard pattern, opposite to the conclusion of `LAYOUT_RESEARCH.md` (dynamic information space). Screenshot 02 confirms: the map fills the main area, the rest of the cards pile up folded below. You should not see a strategic map while interrogating a spy.
- **5-primitive layout design** — **PROMISING** (documentation only). `LAYOUT_GRAMMAR.md` defines Anchor/Stage/Satellite/Ambient/Dock, but there is **no layout engine implementation**. `computeUIPlan` is a rule tree, a fixed Block array.
- **Focus concept** — **MISSING**. The most critical missing abstraction — "what the user is looking at this moment" has no first-class representation. See `LAYOUT_DIRECTION.md`.

### Characters and world roles
- **CharacterBlock** — **PARTIAL** (visual) + **FAKE** (interaction depth).
  - Visual: left column character list + right column detailed profile (loyalty, state, faction) + two action buttons. Clean.
  - Interaction: the two buttons "Interrogate Chancellor" "Audit Secret Communications" **only fill template text into the ActionDock input box** — they themselves do not send requests; after clicking, it is completely equivalent to typing in the input box.
  - The "Portrait Studio" button calls up VisualSynthesisStudio (image generation) — this is real, but unrelated to "interacting with a character".
- **DirectorConsoleBlock** — **FAKE** (permission mechanism).
  - Three tabs (Spawn/Factions/Axioms) + 4 director chips + text input.
  - On submit it prefixes the text with `[DIRECTOR INTERVENTION]` (`DirectorConsoleBlock.tsx:41, 47`). This is **using a text string to impersonate permission** — all actions go through the same ordinary Action path, the director and player have no kernel-level difference.
  - The numeric slider (faction influence) is not yet read, but even if adjustable, it passes no validation.
- **Role switching** — **PARTIAL** (UI) + **FAKE** (lens). Modal has 4 roles (Player/Director/Architect/Observer). After selection:
  - A role banner (purple) appears in the header "IMPERIAL SHADOW OVERSEER — Guide the geopolitical simulation from above".
  - A Director Console block appears in the workspace.
  - The action dock chips become "SOVEREIGN DIRECTIVES" (director wording); buttons become "Cast".
  - **But the loyalty numbers, factions, and state in the character panel — are identical to the Player perspective word for word** (screenshot 05 confirms: Vance 68%, Vane 42%, Cross 81%, Thorne 45%, Reed 94%, same as Player perspective). **No secret agenda revealed, no hidden facts, no narrative isolation**. This is one of HeadConan's core promises, and **it is currently fake**.

### Interaction and causality
- **ActionDock** — **WORKING** (UI) + **MOCKED** (depth).
  - UI: 4 suggestion chips + text input + Dispatch button. Chips are filled from the role's `suggestedPrompts`.
  - After submit it goes through `interactWorldWithAI` → server-side LLM or client-side `simulateWorldInteraction`.
  - **procedural is template matching**: `simulateWorldInteraction` detects keywords `attack/arrest/dispatch/mobilize` → scalar drift; `examine/fingerprint/clue` → investigation narrative; `talk/negotiate` → diplomacy narrative. No matter how specific you type, the narrative is the same template. Screenshot 03: the response to "Dispatch Praetorian inspection to the Northern Gate" is "Shockwaves rippled... Couriers raced... Friction has intensified noticeably" — **completely ignoring "Northern Gate"**. The user immediately feels the world did not really listen to what he said.
- **mutations.ts** — **INCOMPLETE**. Scalar clamping (10-unit range), does not validate preconditions, does not derive cascades, does not write cognition.
- **Server prompts** — **PARTIAL** (gateway) + **REQUIRES_REPLACEMENT** (payload).
  - Gateway is solid, multi-provider routing, fallback chain, image generation.
  - The prompt forces the LLM into "single-turn output of complete WorldState + UI plan" — violating all separation principles.

### Map / Evidence Board / Timeline
- **MapBlock** — **VISUAL_ONLY**. 5 static SVG nodes (Imperial/Northern/Grand/Fortress/Obsidian) + percentage coordinates. Clicking a node shows "Survey Imperial" "Reinforce Sector" buttons but they still only fill text.
- **EvidenceBoardBlock** — **VISUAL_ONLY** (partially interactive). Pin + thread layout, but the lines are prefabricated data, user cannot drag.
- **TimelineBlock / StatsBlock / DocumentBlock / EventBlock / RelationshipBlock** — **REAL** (visual only). Reliably display data; no interaction depth.

### Side modes: beyond the player perspective
- **ChronicleModal** — **REAL** (UI) + **PARTIAL** (persistence). Modal shows turn history; restored via localStorage after refresh — same browser only.
- **NotesDrawer** — **REAL** (UI) + **UNNECESSARY** (depth). Simple scratchpad; not linked to world entities or cognition.
- **WorldAtlasExplorer** — **REAL** (data) + **PARTIAL** (export). 400+ world catalog, rich filtering / radar charts; clicking "Experience in HeadConan" triggers the prompt path rather than importing `WorldDefinition`.
- **LayoutLab** — **PARTIAL** (experimental). Layout experiment ground; demonstrates but not connected to runtime.
- **VisualSynthesisStudio** — **REAL** (integration). Gemini image generation + procedural fallback; integrated with character / location / event types.

### Data / representation
- **legacy `world/types.ts`** — **REQUIRES_REPLACEMENT**. UI fields like `colSpan` mixed into domain types.
- **`representation/*`** — **PROMISING** (asset) + **UNUSED** (wiring). World representation foundation (four layers: definition / state / dynamics / presentation, cognition model, 4 baseline worlds, validator, projector, evaluator) — correctly designed, **not connected to runtime**. The E1 experiment verified the `instantiate()` path, but only in tests.
- **My architecture documents (11 docs/ + ARCHITECTURAL_* / WORLD_RUNTIME / RUNTIME_LOOP / LAYOUT_ARCHITECTURE / IMPLEMENTATION_ROADMAP / OPEN_QUESTIONS / DO_NOT_BUILD_YET)** — **PROMISING** (guidance) + **UNIMPLEMENTED**. Proposed the kernel (event transition) + dual-cadence loop + scene + 5 primitives + Focus; only E1 empirically validated.

### Testing
- **vitest** — **REAL** (newly built). E1 (9/9 passed) verifies instance isolation and scene divergence.
- **Type check** (`tsc --noEmit`) — **WORKING**. `npm run lint` passes.

---

## 3. Key Findings (sorted by severity)

| # | Finding | Evidence | Impact |
| :--- | :--- | :--- | :--- |
| F1 | Role switching does not switch the cognition lens | screenshot 03 vs 05, identical loyalty numbers | Information asymmetry promise **completely undelivered** |
| F2 | Director permission is a text prefix | `DirectorConsoleBlock.tsx:41,47` | Host channel is **faked** — no real host path exists |
| F3 | Narrative is template matching | screenshot 03 (Northern Gate → generic "Shockwaves rippled...") | User immediately feels the world did not listen |
| F4 | Layout is a fixed 3-column grid | `renderer.tsx:19`, `computeUIPlan` | "Unique world feel" promise **not implemented** |
| F5 | `representation/*` not wired | `App.tsx` still `useState<WorldState>` | Half a year of design assets are **dead code** (until wired) |
| F6 | Evaluator only implements 2/7 precondition types | `dynamics/evaluator.ts` | Recorded in E1; P2 kernel must-fix |
| F7 | Visual shell real, promise shell fake | whole experience | User attracted by "professional feel", but **huge depth gap** |
| F8 | No autonomous NPC | `engine.ts` does not schedule NPCs; `simulateWorldInteraction` does not call NPC decision | "Characters have their own reality" not implemented |
| F9 | No scene switch / focus | No Scene data type, no Focus | Scene model 9 is documentation only |
| F10 | LLM path fragile | prompts force single-turn giant JSON; schema drift common | High token cost + easy to crash |

---

## 4. Verified-Viable Assets (retention list)

| Asset | State | Why retain |
| :--- | :--- | :--- |
| `src/world/representation/*` | REAL | Representation and cognition model math / cognitive contract verified by E1 |
| `server.ts` multi-provider agent | REAL | Gateway and fallback chain solid; swappable prompts / contract |
| `src/data/worldAtlas.ts` | REAL | 400+ world catalog; baseline / gold-standard / classification are test assets |
| `src/data/mockWorlds.ts` (EMPIRE/UNIVERSITY/MYSTERY) | REAL (static seeds) | For demo; **not** as next-version target worlds |
| `UI_CAPABILITY_REGISTRY` | PARTIAL | Retain "data shape → renderer" mapping pattern; becomes shared Block after scenification |
| `src/components/ui/*` (button/card/badge/...) | REAL | Light zinc primitives, reusable |
| `AppSidebar` | REAL | Stable navigation framework (the "never moves" part in LAYOUT_DIRECTION) |
| `EngineSelector` | REAL | Engine selector can be retained |
| `ActionDock` | REAL | Main input dock (the "stable framework" in LAYOUT_DIRECTION), needs extension |
| `Header` | REAL | Top stable framework, needs extension |
| `ChronicleModal` / `NotesDrawer` | REAL | Time / notes can be in-scene modals |
| `VisualSynthesisStudio` | REAL | Image generation, can be in-scene modal (dialogue avatar / evidence map) |
| My 11 architecture documents | REAL (design assets) | Kernel / scene / layout / roadmap — **guidance** for next version not implementation |
| `instantiate()` + E1 test | REAL | Scene seed → instance isolation empirically validated |

---

## 5. Things to DELETE or Shelve

| Item | Disposition |
| :--- | :--- |
| `src/world/types.ts` (legacy `WorldState` + `colSpan`) | Replace with `representation/`, delete |
| `engine.ts` keyword matching | Replace with "LLM produces definition JSON + deterministic instantiation" |
| `mutations.ts` scalar clamping | Replace with event kernel `applyEvent` |
| All "story paragraph" fields in `engine.ts` + `mutations.ts` | Delete — narrative is wording at the experience layer, not state |
| `[DIRECTOR INTERVENTION]` text prefix | Delete — intervention becomes a sourced event |
| `computeUIPlan` rule tree | Replace with salience-driven presentation planning |
| `renderer.tsx` 3-column grid | Replace with 5-primitive layout engine |
| `uiPlanning` field in static seed `mockWorlds.ts` | Delete — worlds carry no UI plan |
| `colSpan` data in `WorldCanvasRenderer` | Delete — belongs to layout layer, not Block |

---

## 6. Overall Judgment

**The next version is not "adding features to a dashboard", but "replacing the dashboard with a scene-driven experience".** The code foundation (representation system, gateway, UI primitives, component library, documents) is genuinely usable; the problem is not the material, but the **form** — whether to render the world as a row of side-by-side cards, or to organize the interface around "what the user is doing right now".

See [`RECOMMENDATION.md`](./RECOMMENDATION.md) for concrete suggestions; see [`10_MINUTE_EXPERIENCE.md`](./10_MINUTE_EXPERIENCE.md) for the minimal validation slice.
