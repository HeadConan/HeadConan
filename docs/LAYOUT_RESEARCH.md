# HeadConan — First-Principles Layout Research & Information Space Theory

> **Core Research Question:**  
> *"Is HeadConan fundamentally an application with many screens, or is it a dynamic information space that continuously reconfigures itself around the user's current experience?"*

---

## 1. The Fundamental UX Problem of HeadConan

The fundamental UX problem of HeadConan is **The Inhabited Multiverse Representation Crisis**:

When a human user inhabits an imagined universe—whether as a detective interrogating a murder suspect in Victorian London, an emperor weighing troop movements along a contested border, a spy maintaining a fabricated marriage in Berlint, or a PhD candidate disputing paper authorship in an academic department—the relevant reality contains hundreds of simultaneous dimensions:
1. Physical geometry and immediate spatial proximity.
2. Interpersonal dialogue, subtext, and emotional tension.
3. Secret identities, dramatic irony, and epistemic fog-of-war.
4. Macro-political power balances, treaties, and resource vitals.
5. In-universe evidence exhibits, chemical assays, and classified memos.
6. Temporal milestones, deadlines, and historical event chronicles.

**The Failure of Conventional Paradigms:**
* **The Chatbot Fallback** (e.g., ChatGPT, Character.ai): Collapses high-dimensional world state into a 1D vertical stream of text bubbles. The user loses all spatial orientation, structural leverage, and holistic awareness.
* **The SaaS Dashboard Fallback** (e.g., Jira, Salesforce, Grafana): Collapses reality into a static grid of equal-sized cards. Every card screams for attention simultaneously, turning a dramatic story into an administrative spreadsheet.
* **The Game HUD Fallback** (e.g., RPGs, MMOs): Hardcodes fixed health bars, minimaps, and skill toolbars to screen corners. This works for fixed-genre 3D action games, but violently breaks when switching between an intimate romance dialogue, a tactical troop dispatch, and a forensic deduction board.

**The First-Principles Truth:**
> **HeadConan is NOT an application with many screens.**  
> An application with screens forces the user to mentally leave their current reality to "navigate to the Map screen" or "go to the Suspects page". This destroys immersion and fractures working memory.  
> **HeadConan IS a dynamic information space.** It is an adaptive spatial stage that fluidly promotes, demotes, docks, and dissolves surfaces in response to the user's focus, the simulation's emergent tension, and the active epistemic perspective.

---

## 2. The 14 Foundational Research Inquiries

### Question 1: What is the fundamental UX problem of HeadConan?
**Answer:** Translating high-dimensional world simulation states into a low-cognitive-load, visually intuitive interface without reducing the experience to a text chat or an overwhelming administrative dashboard.

---

### Question 2: Why is a fixed layout insufficient?
**Answer:** A fixed layout assumes an invariant relationship between information types. But in an inhabited world, information relevance is radically dynamic:
* During a tense interrogation, the suspect's micro-expressions, speech quirks, and contradictory statements are 95% of reality; the global kingdom economy is 0%.
* During a border crisis, the tactical map and supply lines are 85% of reality; personal small talk is 0%.
* A fixed layout either starves the primary task of canvas space or clutters the screen with irrelevant background noise.

---

### Question 3: What should remain spatially stable?
**Answer:** To preserve user orientation and prevent visual vertigo during dynamic layout transitions, the following anchors must remain invariant:
1. **The Temporal Anchor (Header / Chrono Bar)**: World identity, active role badge, in-universe clock, turn counter, and global system controls.
2. **The Agency Anchor (Action Dock)**: The primary input channel, suggestion affordances, and interaction trigger must remain anchored at the bottom edge.
3. **The Spatial Cardinality**: Primary focus remains anchored in the central/dominant stage; contextual references remain anchored to flanking or collapsible peripheral rails.

---

### Question 4: What should be dynamically composed?
**Answer:** The **Stage Surface** and **Context Rails**:
* **Primary Stage**: Transforms between a Dialogue View, a Canvas Map, an Evidence Corkboard, a Strategic Faction Matrix, or an Ontological Rule Editor based on the active activity.
* **Contextual Satellites**: Dynamically surface only those entities, clues, or vitals directly linked to the current stage topic.
* **Ambient Feeds**: Shrink to subtle status badges or peripheral pulse meters.

---

### Question 5: What determines the primary focus?
**Answer:** Primary focus is computed by the **Presentation Planner** via a deterministic scoring function:

$$\text{FocusScore}(S) = w_1 \cdot \text{UserIntent}(S) + w_2 \cdot \text{ActivityWeight}(S) + w_3 \cdot \text{SimulationUrgency}(S) + w_4 \cdot \text{RoleAffordance}(S)$$

* If the user says "Examine the torn bloodstained letter", the Primary Focus immediately becomes the **Document / Forensic Exhibit Inspector**.
* If an emergency dispatch reports "The Northern Wall has fallen", the Primary Focus automatically transitions to the **Tactical Crisis Theater**.

---

### Question 6: How should secondary context behave?
**Answer:** Secondary context acts as a "satellite orbit":
* It is visually adjacent to the primary stage (split-screen rail or floating sheet).
* It dynamically filters its content to only display items that have direct relational, spatial, or causal edges to the primary focus item.
* When the primary focus changes, secondary context smoothly cross-fades or morphs rather than abruptly jumping.

---

### Question 7: What information should be hidden?
**Answer:** Information must be hidden if:
1. **Epistemically Inaccessible**: The character/role does not know it (e.g. secret assassination orders the player has not intercepted).
2. **Attentively Irrelevant**: It has zero causal or spatial proximity to the active turn.
3. **Cognitively Redundant**: Unchanged background axioms or historical events older than the current working memory window.
*Hidden information remains retrievable via search, drawer inspection, or omniscient host toggle.*

---

### Question 8: What is the smallest layout grammar?
**Answer:** Any inhabited universe layout can be expressed using exactly **5 Spatial Primitives**:

```
+-----------------------------------------------------------------------------+
| 1. ANCHOR (Header & Clock)                                                  |
+-----------------------------------------------------------------------------+
|                                  |                                          |
|                                  | 3. CONTEXT SATELLITE (Drawer / Rail)     |
| 2. STAGE (Primary Surface)       |    • Targeted Entity Inspector           |
|    • Canvas / Dialogue / Board   |    • Linked Clues / Relationship Edges   |
|                                  |                                          |
|                                  +------------------------------------------+
|                                  | 4. AMBIENT MONITOR (Vitals / Status)     |
+----------------------------------+------------------------------------------+
| 5. DOCK (Agency Input & Action Controls)                                    |
+-----------------------------------------------------------------------------+
```

---

### Question 9: How should world-specific presentation work?
**Answer:** A `WorldDefinition` should declare **Experience Signals** and **Visual Modality Preferences**, NOT hardcoded React component code.
* `SPY × FAMILY` declares `{ preferredStage: 'dialogue_and_dossier', tone: 'clandestine_domestic', informationDensity: 'high_irony' }`.
* `SHERLOCK HOLMES` declares `{ preferredStage: 'evidence_corkboard', tone: 'forensic_analytical', informationDensity: 'dense_clues' }`.
* The frontend layout engine interprets these signals to theme and arrange the 5 spatial primitives.

---

### Question 10: How should Player and Host affect presentation?
**Answer:** Player and Host are **Epistemic Perspectives**, not separate web pages:
* **Player Perspective**: Renders the world through strict first-person fog-of-war, showing sensory perceptions, personal inventory, and conversational dialogue.
* **Host / Director Perspective**: Unlocks the omniscient stage, revealing hidden entity agendas, axiom sliders, crisis injection triggers, and global graph nodes on the same underlying universe.

---

### Question 11: How should multimodal information be composed?
**Answer:** Information modality must match semantic cognitive load:
* **Relational Power**: Rendered as a node-link network graph or comparative matrix.
* **Spatial Geography**: Rendered as an interactive SVG / Canvas coordinate map.
* **Forensic Evidence**: Rendered as physical pinboards with string connections.
* **Interpersonal Tension**: Rendered as character portraits with emotive subtext and dialogue bubbles.
* **Systemic Health**: Rendered as sparkline meters and equilibrium bars.

---

### Question 12: How should transitions between activities work?
**Answer:** Transitions must use **FLIP (First, Last, Invert, Play) Layout Transitions**:
* When zooming from a global map into an interrogation room, the map smoothly shrinks into the Context Satellite rail while the Character Interrogation Stage expands from the selected coordinate pin.
* Elements never vanish abruptly; they morph, dock, or fade gracefully.

---

### Question 13: What existing products / games / interfaces provide useful precedents?
**Answer:**
1. **Disco Elysium**: Masterclass in thought-cabinet and psychological dialogue prioritization over static inventory grids.
2. **Crusader Kings III**: Seamless hierarchical zoom from realm-level geopolitical map to intimate character assassination plots.
3. **Figma / FigJam / Miro**: Infinite spatial canvas where documents, sticky notes, and diagrams coexist freely with minimaps and inspectors.
4. **Ableton Live**: Split-view architecture alternating between Session View (macro composition) and Arrangement View (linear timeline) without losing state.
5. **Bloomberg Terminal / Linear**: Ultra-high-density information management with strict keyboard navigation and contextual command palettes.

---

### Question 14: Which precedents should we explicitly NOT copy?
**Answer:**
1. **ChatGPT / Claude Vertical Stream**: Destroys spatial memory; turns deep simulation into disposable chat scrollback.
2. **Jira / Linear Issue Boards**: Turns dramatic storytelling into monotonous task card backlog grooming.
3. **Generic MMO Game HUDs**: Static, non-responsive screen borders that waste 40% of viewport area on unused widgets.
4. **SaaS Analytics Dashboards**: Equal-weight 3x3 card grids with no cognitive focal hierarchy.

---

## 3. The Final Verdict: Application vs. Dynamic Information Space

HeadConan must be built as a **Dynamic Information Space**:
* It maintains a single continuous spatial context.
* It composes its stage around the active interaction.
* It preserves the user's mental model across domain switches.
* It respects the player's epistemic horizon while allowing instant directorial elevation.
