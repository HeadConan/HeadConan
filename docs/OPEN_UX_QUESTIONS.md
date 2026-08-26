# HeadConan — Open UX Questions & Unresolved Design Vectors

> **Notice for Future Architects:**  
> The following questions represent genuine design tensions that should NOT be prematurely hardcoded or dogmatically resolved without empirical user testing.

---

## 1. Top Unresolved Questions

### Question 1: Autonomous AI Morphing vs. User Spatial Agency
* **Tension**: If the Presentation Planner automatically morphs the layout from a Map to an Evidence Board when a clue is found, does this feel delightfully proactive or disorienting and jarring?
* **Hypothesis to Test**: Provide a "Sticky Layout Lock" toggle allowing users to freeze their preferred composition (e.g. "Keep Map pinned on the left") while only updating the contents.

---

### Question 2: Chat Input vs. Spatial Direct Manipulation
* **Tension**: Is natural language text input always the fastest way to interact with an inhabited world?
* **Alternative to Test**: Direct spatial affordances—dragging a suspect's pin onto a crime scene to interrogate them, drawing a path across a map to order a troop march, or clicking an exhibit to initiate a forensic assay.

---

### Question 3: Epistemic Asymmetry Notification Design
* **Tension**: In worlds like *SPY × FAMILY*, where Anya knows secrets that Loid does not, how should the UI signal dramatic irony to the player without breaking role immersion?
* **Approaches**:
  - *Thought Bubble Subtitles*: Transparent secondary text overlaid on NPC dialogue.
  - *Secret dossiers*: Marked with special psychic/whisper badges.
  - *Perspective Split-Screen*: Comparing two characters' minds side-by-side.

---

### Question 4: Canvas Freedom vs. Structured Responsive Layout
* **Tension**: Should the stage be an unconstrained infinite 2D canvas (like Miro/FigJam) where the user can arrange cards anywhere, or a structured responsive grid that adapts across mobile and desktop?
* **Trade-off**: Infinite canvas offers extreme expressive freedom for mystery case boards, but performs poorly on mobile touchscreens without tedious zooming and panning.

---

### Question 5: Timeline Scrubbing and Alternate History Branches
* **Tension**: When the player wants to explore "What if I refused the Queen's command on Turn 4?", how should the UI display parallel timeline branches without confusing the active canonical state?
