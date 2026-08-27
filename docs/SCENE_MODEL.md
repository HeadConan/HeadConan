# HeadConan Scene Model (SCENE_MODEL)

> **Question**: What does the user actually "face" inside a world? Answer: not a page, not a screen, not a chat stream, not a dashboard — it is the **Scene**.
> A scene = the experience configuration of the world at this moment. It is the structured expression of "what the player is doing".

---

## 1. Why a Scene, not a Page / Chat / Dashboard

| Organizational principle | Defect |
| :--- | :--- |
| Page | Requires navigation; the user must "leave the current reality to go elsewhere"; breaks immersion |
| Chat stream | One-dimensional text; loses spatial / structural / co-presence feel |
| Dashboard | No focus; all cards scream at once; turns drama into a table |
| **Scene** | **Composes information, actions, and present participants around "what is happening now"; can switch with world events / user intent** |

A scene satisfies three hard requirements:
1. **Information-asymmetry alignment**: the scene decides "what you are entitled / need to see this moment".
2. **World differences are expressible**: conversation scenes, investigation scenes, everyday scenes, editing scenes — the same set of scene types presents different content in different worlds, but the structure is consistent.
3. **Stateful**: a scene is serializable (current scene + in-scene state), restorable on refresh.

---

## 2. Definition of a Scene

```
Scene
├── id / type (sceneType)
├── primary content (primary)       —— the user's focus object and interaction surface this moment
├── context (context)               —— auxiliary information directly related to the primary content
├── present (present)               —— which characters / entities are in this scene
├── available actions (actions)     —— what can be done within the scene (verb set)
├── ambient info (ambient)          —— time / weather / atmosphere / pressure metrics
├── scene state (sceneState)        —— scene-specific serializable state (e.g., dialogue turns)
└── entries and exits (transitions) —— what event / intent enters / leaves this scene
```

### Scene types (initial set, drawn from the shared structure of the four worlds)

| Scene type | Primary content | Context | Typical worlds |
| :--- | :--- | :--- | :--- |
| `conversation` | Dialogue (utterance stream + current speaker) | The other party's profile / relationships | SPY×FAMILY, University |
| `exploration` | Space / map / environment | Nearby entities and clues | Mystery, Empire |
| `investigation` | Evidence / clue board / inspected objects | Suspects / timeline | 1928 Mystery, Sherlock |
| `everyday` | Schedule / calendar / tasks | Contacts and events | University |
| `political` | Factions / power / decision table | Map / forces | Empire, GoT |
| `world_editing` | Definitions / rules / entity inspector | Omniscient data | Host perspective (all worlds) |

> A world does **not necessarily** use all types; SPY×FAMILY minimum set = `conversation` + `everyday` + `exploration` + `world_editing` (host).

---

## 3. Relationship between Scenes and Existing Concepts

| Concept | Relationship |
| :--- | :--- |
| WorldState | The scene **references** world state (present participants, relationship values), does not copy it |
| Action / Event | Actions are initiated within a scene; an event may trigger a **scene switch** (e.g., "sudden crisis" → from everyday to political) |
| Role / Perspective | At the same world and same moment, the player perspective and the host perspective **may have different scenes** (the host can always switch to world_editing) |
| UI Block (current state) | The current Block grid → refactored into a renderer of "scene stage + context rail" (Blocks reused as in-stage components) |
| Focus (layout direction) | A scene ≈ the focused experience container; Focus decides the scene, the scene decides the layout |

---

## 4. Scene Lifecycle

```
Enter scene ──► Scene initialization (assemble present / primary / action set)
              │
              ▼
       In-scene interaction (dialogue / action / inspect)
              │
              ├── In-scene state update (dialogue turns, collected clues)
              │
              ├── Event triggers scene switch (crisis → political; discover evidence → investigation)
              │
              └── User-intent switch ("I'll go look at the map" → exploration)
              │
              ▼
         Exit scene (save scene state to instance; record log)
```

**Switching discipline**:
1. A scene switch must be **explainable** (player perspective: a narrative thread + UI transition; host perspective: full-map navigation).
2. In-scene state (where the dialogue has reached) persists with the instance and is restored on return.
3. Automatic switching (triggered by world events) has lower priority than an explicit user switch; what the user is doing is not force-interrupted (consistent with sticky in LAYOUT_DIRECTION).

---

## 5. Scene = The Confluence of Layout and Information Asymmetry

```
world state + event stream
   │
   ▼
[current scene]  ←── decided by user intent / focus / event salience
   │
   ├──► Visibility: the scene decides which data to render (projector filters by role)
   │
   ├──► Layout: scene type → stage shape (PRIMARY / SECONDARY / HIDDEN of LAYOUT_DIRECTION)
   │
   └──► Actions: the scene decides the action verb set (dialogue → "interrogate / confess / small-talk"; investigation → "analyze / interrogate")
```

---

## 6. Anti-patterns (do NOT do)

1. **Do not** do "scene = full page" — a scene is only an experience container, sharing the same stable framework (brand / dock / navigation).
2. **Do not** do "custom scene types per world" — scene types are shared; world differences go through scene content and theme.
3. **Do not** do "scene tree / scene graph database" — a scene is flat state; switching is driven by events / intent, no navigation graph is built.

---

## 7. Implementation Requirements for the Next Version

- [ ] Minimum scene state machine (current scene + scene state + switch rules), serializable.
- [ ] Four scene types usable: `conversation`, `everyday`, `exploration`, `world_editing`.
- [ ] At least two trigger sources for scene switching: user action ("I'll follow him" → exploration) and world event ("alarm sounds" → in-scene crisis state).
- [ ] Player / host perspective scene differences demonstrable.
