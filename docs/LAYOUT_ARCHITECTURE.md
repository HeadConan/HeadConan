# HeadConan Layout Architecture (LAYOUT_ARCHITECTURE)

> Pre-reading: `docs/LAYOUT_RESEARCH.md` (14-question research), `docs/LAYOUT_GRAMMAR.md` (5 spatial primitives), `docs/PRESENTATION_MODEL.md`, `docs/layout/*` (6-scenario layout analysis). This file **converges those design assets into an implementable architecture**, and adds the missing key abstraction: **Focus**.

---

## 1. Conclusion: Dynamic Information Space, Not a Collection of Screens

> **HeadConan is not "an app with many screens", but "a dynamic information space that continuously reorganizes around the current activity".**

Reasoning chain (compressed from LAYOUT_RESEARCH):
1. The world's relevance is **dynamic**: during an interrogation, the suspect's micro-expression is 95% of reality and the global economy is 0%; during a border crisis it is exactly the reverse.
2. "Screens" force the user to leave the current reality to "navigate to the map page" — destroying immersion and working memory.
3. A fixed grid (3-column cards) makes every card compete for attention simultaneously — turning drama into a spreadsheet.

Therefore the layout must be driven by **current focus + current activity + character lens**, not by predefined pages.

---

## 2. Presentation Pipeline (from state to pixels)

```
WORLD STATE (truth)
    │
    ▼
Cognition projection (observer view: player/host/agent)
    │
    ▼
SIGNIFICANCE (what matters right now)
    · Focus object (FOCUS: entity/location/event/document)
    · Salient events (high drama / high urgency / high change)
    · Tension and uncertainty metrics
    │
    ▼
EXPERIENCE STATE
    · focusEntityId · activeActivity · salient delta · ambient metrics · tone
    │
    ▼
PRESENTATION PLAN
    · stageMode: dialogue|spatial|investigation|strategy|editor
    · satellite content: entities/clues/documents directly connected to the focus
    · ambient metrics: world stability/pressure/countdown
    · dock lexemes: action suggestions matching the activity
    · world tone: tokens/typography/atmosphere (from ExperienceProfile)
    │
    ▼
LAYOUT ENGINE
    · 5-primitive orchestration (Anchor/Stage/Satellite/Ambient/Dock)
    · FLIP transition (elements morph/dock/fade, no flash-jump)
    │
    ▼
RENDER (Block registry + world theme)
```

---

## 3. Minimal Layout Grammar (5 primitives + Focus)

### 3.1 Primitives (existing design, confirmed for adoption)

| Primitive | Responsibility | Invariance |
| :--- | :--- | :--- |
| **Anchor** | Top: world identity, clock/turn, character badges, global modality entry | Constant |
| **Stage** | Main stage: the five forms of dialogue/spatial/evidence-board/strategy-matrix/editor | Dynamic (switches with focus) |
| **Satellite** | Context track: inspector content directly connected to the focus | Dynamic (filters with focus) |
| **Ambient** | Macro environment metrics: stability/pressure/countdown | Silent (collapsible to a badge) |
| **Dock** | Bottom action channel: input + lexemes + engine hints | Constant |

### 3.2 The Missing Abstraction: Focus

An **explicit central object** is needed to separate "current attention" from "screen state" among the primitives:

```
interface Focus {
  type: 'entity' | 'location' | 'event' | 'document' | 'relationship' | 'group' | 'world';
  targetId: string;
  confidence: number;        // focus clarity
  origin: 'user_selected' | 'significance_computed' | 'crisis_forced' | 'activity_inferred';
  activity: string;          // current activity: interrogate | investigate | command | converse | edit | observe
  sticky: boolean;           // whether the user has locked the focus (prevents auto-jump, see OPEN_UX_QUESTIONS Q1)
}
```

**Stage form is determined by Focus**: focus is a "person" → `dialogue` or `dossier`; focus is a "location" → `spatial`; focus is "evidence" → `investigation`; focus is a "faction" → `strategy`; focus is a "rule" → `editor`.

**Satellite content is filtered by Focus**: only content with a direct relationship/spatial/causal edge to `focus.targetId` is shown.

**Focus source priority**: `crisis_forced` > `user_selected` (including sticky lock) > `significance_computed` > `activity_inferred`.

### 3.3 Attention Scoring (FocusScore, normalized formula)

Reuses the four-factor scoring from LAYOUT_RESEARCH Q5; parameters are calibrated by the world definition's ExperienceProfile:

```
FocusScore(S) = w1·UserIntent(S) + w2·ActivityWeight(S) + w3·SimulationUrgency(S) + w4·RoleAffordance(S)
```

- `w1..w4` are adjusted by the definition-side `ExperienceProfile` (e.g. high consequenceLethality → raise w3 weight) and runtime context.
- Each candidate focus outputs a score → take the highest (or display ties side by side).
- Key property: **explainable** — the presentation layer/debug console can see "why this focus".

---

## 4. World-Specific UI Ownership (WORLD-SPECIFIC UI)

**Principle**: the world declares "which modalities matter", the experience service decides "which modality to use now", the presentation layer decides "how to lay it out". **None of the three layers may hard-code world-specific interfaces.**

| World | ExperienceProfile signal (definition side) | Default stage produced by experience service | Actual presentation layer expression |
| :--- | :--- | :--- | :--- |
| SPY×FAMILY | `recommendedModalities: [dialogue_focused, relationship_web_graph]`; informationAsymmetry 5 | dialogue + satellite shows subtext/secret badges | Dialogue stage + relationship track + family/school environment |
| GoT | `[territorial_tactical_map, dossier_matrix]`; consequenceLethality 5 | strategy/spatial | Map stage + faction ledger satellite + stability environment |
| Sherlock | `[forensic_evidence_board]`; investigativeDepth 5 | investigation | Evidence-board stage + suspect/exhibit satellite + solvability environment |
| University | `[academic_schedule_timeline, relationship_web_graph]`; socialDensity 4 | editor(dialogue)/spatial | Schedule stage + classmate network satellite + pressure/funding environment |

**Landing mechanism**:
1. Definition-side `ExperienceProfile.recommendedModalities` (already exists) → decides the **default stage form** and the **world theme** (tokens/typography).
2. Runtime-side `Focus.activity` → decides the **instantaneous stage form** (higher priority than default).
3. The Block registry (existing `UI_CAPABILITY_REGISTRY` pattern) maps "data form → renderer", **shared** rather than world-specific; world differences are expressed only through theme and data composition.
4. Prohibit conditional rendering branches like `world.id === 'spy-family'`.

---

## 5. Layout Engine Specification (LAYOUT ENGINE)

### 5.1 Input/Output

| Input | Output |
| :--- | :--- |
| PresentationPlan + Focus + projected view + world theme | A layout tree of primitive combinations (serializable), for renderer instantiation |

### 5.2 Core Behavior

1. **Compose**: derive the layout tree from the 5 primitives + focus (Stage mode, Satellite visibility and content, Ambient metric set, Dock lexemes, Anchor state).
2. **Transition**: FLIP — from the old layout to the new layout, elements "morph/dock/fade", no flash-jump. When focus changes, the old stage shrinks into a satellite and the new stage expands from the focus position.
3. **Lock**: `Focus.sticky` (user-locked layout/focus) takes priority over automatic form switching; only content updates, form stays unchanged.
4. **Mobile degradation**: satellite collapses into a drawer / bottom bar (inherits the tension of OPEN_UX_QUESTIONS Q4 — do structured responsive first, not an infinite canvas).
5. **Serializable**: the layout tree is data (`LayoutPlan`), the renderer is merely an interpreter — this guarantees that swapping the rendering stack (native/VR) in the future does not touch the experience layer.

### 5.3 Scenario → Layout Matrix (six scenarios, from docs/layout/*)

| Scenario | Stage | Satellite | Ambient | Dock lexemes |
| :--- | :--- | :--- | :--- | :--- |
| Dialogue/Interrogation | dialogue | target profile + subtext | relationship tension | praise/interrogate/change subject |
| Spatial exploration | spatial | location details + present entities | danger/weather/time of day | move/recon/camp |
| Forensic investigation | investigation | exhibit details + alibi | solvability/countdown | analyze/interrogate/present evidence |
| Geopolitical strategy | strategy | faction diplomatic ledger | stability/debt/grain reserves | embargo/convene meeting/assassination authorization |
| Campus daily life | editor(dialogue) | classmate network + advisor feedback | funding/pressure/tenure | submit paper/confront/attend seminar |
| Host/architect | editor | ontology graph + entity deep inspector | invariant health/delays | trigger crisis/change axiom/reveal lineage |

---

## 6. Continuity with Existing Assets

| Existing asset | Keep/Replace | Use |
| :--- | :--- | :--- |
| `docs/LAYOUT_GRAMMAR.md` 5 primitives | ✅ Keep | Primitive specification for the layout engine |
| `docs/LAYOUT_RESEARCH.md` 14 questions | ✅ Keep | Design rationale (including the FocusScore formula) |
| `docs/layout/*` six scenarios | ✅ Keep | Source of the layout matrix specification |
| `docs/PRESENTATION_MODEL.md` | ✅ Keep (add Focus) | Presentation plan type draft |
| `src/ui/renderer.tsx` 3-column grid | ❌ Replace | Layout engine takes over |
| `src/interface/director.ts` rules tree | ❌ Replace | Experience service's salience computation takes over |
| `UI_CAPABILITY_REGISTRY` | ✅ Evolve | Keep the "data form → renderer" mapping pattern; Blocks become surfaces within primitives |
