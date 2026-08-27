# HeadConan Layout Direction (LAYOUT_DIRECTION)

> One of the highest-priority design questions. This file answers two questions: **What should the user be looking at this moment?** and **How should the interface adapt around it?**

---

## 1. Core Decision: Stable Spatial Framework + Dynamic Content Composition

**Hypothesis (D-3)**: HeadConan should have a stable spatial framework, but content should compose dynamically around the "current focus". Attempt to falsify:

| Alternative | Attempt to falsify | Conclusion |
| :--- | :--- | :--- |
| A. Fixed layout (sidebar + main area + right column always isomorphic) | Can a murder-mystery evidence board and a campus schedule share the same main-area shape? → **No** (the evidence board needs a large canvas; the schedule needs a vertical timeline) | ❌ Falsified |
| B. Fully dynamic (rearrange everything each turn) | Can the user stay oriented without navigation anchors? → **No** (LAYOUT_RESEARCH Q3: spatial orientation must be stable) | ❌ Falsified |
| C. Stable framework + dynamic content | Stable: brand / world name, main input dock, navigation. Dynamic: stage shape, context rail, ambient metrics | ✅ Retained |

**Stable (never moves)**: brand and world identity (top / side), main input dock (bottom), navigation (sidebar), current scene identifier.
**Dynamic (composes with focus)**: main stage shape, context rail content, ambient metric set, action verb set.
**Appears temporarily**: modals (character profile, evidence detail, event popup), host overlay.
**Disappears**: data irrelevant to the current scene (the "hidden context" of information asymmetry).

---

## 2. Four-Layer Information Hierarchy (replaces the "three-column" mindset)

> **Do not** default to "sidebar + main content + right column". Use four layers instead:

```
PRIMARY FOCUS     —— the object / activity the user is looking at this moment (the sole protagonist)
SECONDARY CONTEXT —— information directly related to the primary focus and needed on hand at all times
BACKGROUND        —— ambient atmosphere / world state / pressure metrics (silently present)
HIDDEN            —— exists but is not currently visible (retrievable, can be summoned by events)
```

### Four-layer configuration per activity type (initial hypothesis, needs testing)

| Activity | PRIMARY | SECONDARY | HIDDEN |
| :--- | :--- | :--- | :--- |
| Social / dialogue | Conversation (utterance stream + speaker) | The other party's profile and relationships | The broader world picture |
| Exploration | Environment / map | Nearby entities and clues | Deep world information |
| Investigation | Evidence / exhibits | Suspects / timeline | Irrelevant world state |
| Everyday | Schedule / to-do | Contacts / notifications | Grand narrative |
| Political / strategy | Decision table / faction map | Faction ledger | Private trivia |
| World editing (Host) | Definitions / rules / entities | Omniscient data inspector | None (omniscient) |

> These are **hypotheses**, not conclusions: whether the "relationship profile" sits in the second layer or in a popover within a `conversation` scene needs real user testing.

---

## 3. Minimum Rules for the Layout Engine

1. **One Primary Stage**: the interface has a single focus stage; everything else is its satellite. No "six cards side by side".
2. **Context Rail**: only show content with a **direct relationship / spatial / causal edge** to the primary focus (character profiles, nearby clues, related events).
3. **Ambient Strip**: time / weather / pressure / relationship metrics — silent, collapsible, never steals focus.
4. **Action Dock**: always pinned to the bottom; the verb set changes with the scene (dialogue → "interrogate / confess / small-talk"; investigation → "analyze / interrogate").
5. **Transitions**: focus switch = smooth morph (stage content replaced + old content recedes into the rail), not a page jump.

---

## 4. Relationship between Focus and Scene

```
event / intent → salience → Focus (what the user is looking at this moment)
                          │
                          ▼
                    Scene (experience configuration: primary / context / actions / present)
                          │
                          ▼
                    Layout (stage shape + rail + ambient + dock)
```

- Focus is the "object of attention"; Scene is "the experience configuration corresponding to that object"; Layout is "the visualization of that configuration".
- The user can **lock focus** (sticky): I just want to keep staring at this piece of evidence; world events must not automatically steal the interface.

---

## 5. What Should Become What (Modal Mapping)

| Data nature | Presentation form |
| :--- | :--- |
| Relationships and networks | Graph / matrix (relationship graph) |
| Space and location | Map / floor plan |
| Forensic and clues | Evidence board (pins + string) |
| Interpersonal and emotion | Conversation stream + expression / subtext |
| Time and schedule | Timeline / calendar |
| System health | Ambient-strip metrics (silent) |
| World rules | Editor form (Host only) |

---

## 6. Implementation Requirements for the Next Version

- [ ] The primary stage supports at least 4 shapes: dialogue, spatial, everyday, editing (investigation may be deferred to the second iteration).
- [ ] The context rail filters by focus (character / clue / event).
- [ ] Minimum ambient-strip set: time + 1 relationship metric + 1 crisis metric.
- [ ] Focus is lockable (sticky) — events do not interrupt the user's current activity.
- [ ] Player / host view switching = stage morph within the same framework, not a page swap.
