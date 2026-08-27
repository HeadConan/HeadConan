# HeadConan Implementation Roadmap (IMPLEMENTATION_ROADMAP)

> Goal: make "implementation" intellectually straightforward. Draw the dependency graph first, then sequence the phases. If any phase depends on an unverified assumption, go back to [`ARCHITECTURAL_EXPERIMENTS.md`](./ARCHITECTURAL_EXPERIMENTS.md) first.

---

## 1. Dependency Graph (DAG)

```
                        ┌─────────────────────────────┐
                        │ P0 Architecture Validation   │
                        │ Experiments (prerequisite,   │
                        │ minimal)                     │
                        └─────────────┬───────────────┘
                                      ▼
                        ┌─────────────────────────────┐
                        │ P1 Runtime Wiring (bringing  │
                        │ the representation system to │
                        │ life)                       │ ← without it, everything is dead code
                        └─────────────┬───────────────┘
                                      ▼
             ┌────────────────────────┴────────────────────────┐
             ▼                                                 ▼
  ┌──────────────────────┐                       ┌──────────────────────────┐
  │ P2 Event Kernel +     │                       │ P8a Persistence (log +   │
  │ Event Log             │                       │ snapshot)                │
  │ (sole writer)         │                       │ (can run in parallel     │
  └──────────┬───────────┘                       │ once P2 is done)         │
             ▼                                     └────────────┬─────────────┘
  ┌──────────────────────┐                                     │
  │ P3 Action Resolution  │                                     │
  │ + Intervention Channel │                                     │
  └──────────┬───────────┘                                     │
             ▼                                                 │
  ┌──────────────────────┐                                     │
  │ P4 Agent Binding +    │ ◄──────────────────────────────────┘
  │ Decision Loop         │ (P4 needs session restore → P8a is a soft dependency)
  └──────────┬───────────┘
             ▼
  ┌──────────────────────┐
  │ P5 Player Interaction │
  │ (multimodal)          │
  └──────────┬───────────┘
             ▼
  ┌──────────────────────┐        ┌──────────────────────────┐
  │ P6 Experience Service │ ──────► │ P7 Dynamic Layout Engine │
  │ (salience)            │        │ (5 primitives)           │
  └──────────────────────┘        └──────────┬───────────────┘
                                             ▼
                                  ┌──────────────────────────┐
                                  │ P8b Full Persistence      │
                                  │ (branching / sessions)    │
                                  └──────────┬───────────────┘
                                             ▼
                                  ┌──────────────────────────┐
                                  │ P9 World Authoring        │
                                  │ (host tools)              │
                                  └──────────────────────────┘
```

---

## 2. Phase Details

### PHASE 0 — Architecture Validation (minimal experiments)
| Item | Content |
| :--- | :--- |
| Goal | Kill the highest-risk assumptions (definition/state separation, cascade, cognition, layout derivation, Host channel); each experiment ≤ 1 day |
| Output | 5 micro-experiments (see ARCHITECTURAL_EXPERIMENTS) + a keep-or-drop decision |
| Exit Criteria | E1–E5 all have clear conclusions; any failure → return to this document to revise the dependency graph |
| **Blocked By** | None (pure code experiments, independent of the existing UI) |

### PHASE 1 — Runtime Wiring (RUNTIME BINDING)
| Item | Content |
| :--- | :--- |
| Goal | Turn `representation/` from "pure types" into "live state" |
| Content | ① Replace the legacy `WorldState` in `App.tsx` with `WorldStateInstance` + `WorldDefinition`; ② Definition/state loading and validation (`validateWorldDefinition`); ③ Projector hooked in before rendering (**project before rendering every frame**); ④ The four baseline worlds can be instantiated and driven through the UI |
| Exit Criteria | Switching characters → view content actually changes (not just the console); legacy `world/types.ts` removed from the App path |
| **Blocked By** | None |
| Key Risk | Representation types don't match the data contract of existing Block components → an adaptation layer is needed (briefly) |

### PHASE 2 — Event Kernel + Event Log (EVENT KERNEL)
| Item | Content |
| :--- | :--- |
| Goal | Establish the sole writer |
| Content | ① `applyEvent` kernel (precondition/effect/observation derivation/consequence queueing/log append); ② Scheduling queue (delayed/periodic events, with budget caps); ③ Rejection is an event; ④ Regression tests using baseline-world action definitions (`evaluateWorldAction` evolves into the kernel) |
| Exit Criteria | Same log prefix replayed → same state (unit tests covering representative events of all four baseline worlds); cascading consequences are bounded |
| **Blocked By** | P1 (needs live state) |
| Parallel | P8a persistence (log-append writes can be implemented independently) |

### PHASE 3 — Action Resolution + Host Intervention Channel (ACTION RESOLUTION)
| Item | Content |
| :--- | :--- |
| Goal | Player text/click → structured candidate events; host intervention becomes a legitimate event |
| Content | ① Intent parser (LLM-assisted: text → verb/target/payload + deterministic entity resolution and correction); ② Action category and character-permission validation; ③ `directorial_intervention` event (traces `player_directive`, permission check); ④ Remove the `[DIRECTOR INTERVENTION]` prefix mechanism |
| Exit Criteria | "Publicly accuse the minister" walks the full chain (see WORLD_RUNTIME 4.3); intervention and player actions go through the same kernel |
| **Blocked By** | P2 |
| Key Risk | LLM parsing ambiguity (unclear target reference) → a clarification feedback channel is needed (handled by P5) |

### PHASE 4 — Agent Binding + Decision Loop (AGENT LOOP)
| Item | Content |
| :--- | :--- |
| Goal | NPCs become true agents; NPCs and players share the action/observation interface |
| Content | ① `AgentBinding` (controller: player/ai/script/none); ② Perception → decision → candidate-event loop (LLM decision + deterministic bookkeeping); ③ World tick (triggered by scheduler + initiative threshold); ④ NPC context = that agent's projected view (leak prevention) |
| Exit Criteria | "Loid and Yor converse without knowing each other's secrets" runs: each one's LLM context independently lacks the other's secret; SPY×FAMILY baseline test passes |
| **Blocked By** | P2 (weak dependency on P3 — agent actions need not go through the player parser) |
| Parallel | P8a (session restore) |

### PHASE 5 — Player Interaction (PLAYER INTERACTION)
| Item | Content |
| :--- | :--- |
| Goal | Upgrade interaction from "text box" to "multimodal intent" |
| Content | ① Entity targeting (click character → interrogate, click map node → dispatch); ② Dialogue as first-class (speech_act event + dialogue stage); ③ Clarification feedback flow (on parsing ambiguity); ④ Suggestion tokens driven by the presentation plan (replacing the hardcoded list) |
| Exit Criteria | University-world walkthrough: miss a class → reputation change → professor email (delayed) → library encounter |
| **Blocked By** | P3 (parsing) + P4 (NPC reaction) |
| Parallel | P6 design can begin (salience computation does not depend on all of P5) |

### PHASE 6 — Experience Service (EXPERIENCE SERVICE)
| Item | Content |
| :--- | :--- |
| Goal | "What happened in the world" → "What the user should see" |
| Content | ① Salience computation (FocusScore four factors); ② `ExperienceState` (focus object, salience delta, tension metric); ③ `PresentationPlan` (stage mode / satellite content / ambient metric / tokens / tone); ④ Narrative phrasing (LLM generated from the observer's view, not an omniscient perspective) |
| Exit Criteria | Same state, player view and host view produce different presentation plans (scaled validation of E4) |
| **Blocked By** | P4 (needs event stream) |

### PHASE 7 — Dynamic Layout Engine (LAYOUT ENGINE)
| Item | Content |
| :--- | :--- |
| Goal | 5 primitives + focus → serializable layout tree → render |
| Content | ① `Focus` object (sticky lock); ② Layout engine (Stage form switching + Satellite filtering + Ambient contraction); ③ FLIP transitions; ④ Replace the 3-column grid and `computeUIPlan` |
| Exit Criteria | All six-scenario layout matrix renders; player↔host switch = smooth layout morph, not a page swap |
| **Blocked By** | P6 (presentation plan) |
| Key Risk | FLIP animation cost in React → can ship an animation-free version first, then add transitions later |

### PHASE 8 — Persistence (PERSISTENCE)
| Item | Content |
| :--- | :--- |
| Goal | Layered persistence of definitions / logs / snapshots / player data / artifacts |
| Content | ① P8a: log append + periodic snapshot + session restore (can run in parallel after P2); ② P8b: branching (instance copy + divergent log), export/import of world archives |
| Exit Criteria | Refresh page restores session; branches can be rolled back; `restore()` rebuilds state from log (E2 validation) |
| **Blocked By** | P8a blocks P4's session restore; P8b blocks P9 |

### PHASE 9 — World Authoring (WORLD AUTHORING / HOST TOOLS)
| Item | Content |
| :--- | :--- |
| Goal | Productize the host/author channel |
| Content | ① Definition editor (entity/fact/rule/character/experience-signal forms); ② Runtime intervention panel (inject events / change rules, all via the `define_modification` event); ③ Atlas import (WorldAtlas entries → definition templates); ④ Definition validation and versioning |
| Exit Criteria | Host can change the world without touching code; all interventions go through the kernel and log |
| **Blocked By** | P3 (intervention channel) + P8b (definition version store) |

---

## 3. Blocked / Critical Path / Parallelizable / Deferrable

| Category | Content |
| :--- | :--- |
| **Blocked chain (critical path)** | P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 (8 steps); the gap between P2 and P3 is the highest-risk window (kernel correctness) |
| **Single largest blocker** | **P2 Event Kernel** — the convergence point of all correctness; prefer slow over sloppy |
| **Parallelizable** | P8a (can start after P2); P6 design can begin early; WorldAtlas cleanup and baseline expansion (can be done before P1) |
| **Deferrable (DEFERRED)** | Semantic memory / long-text summarization (see DO_NOT_BUILD_YET); multi-device sync; multi-user; VR/native render stack; plugin system |
| **Every phase exit** | must have a "user-verifiable effect" (see §4) |

---

## 4. Per-Phase "User-Perspective Effect" Validation Table

> Per user working preference: every change must be verifiable on the user side; no verification, no build.

| Phase | What the user sees / feels | How the user verifies |
| :--- | :--- | :--- |
| P1 | After switching characters, the interface content (not just the tools) changes accordingly | From the player view you cannot see "the minister's secret agenda"; switching to host you can |
| P2 | Action consequences start to be "logical" and rollbackable | Do a public accusation: those present know, those absent don't |
| P3 | Clicking targets is more precise than typing; host intervention no longer shows the "[DIRECTOR]" prefix | Click a character to launch an interrogation; the world stays self-consistent before and after intervention |
| P4 | NPCs proactively advance the plot; the offline world still evolves | University world: take no action, then after a while see schedule/messages change |
| P5 | Dialogue has subtext / mind-reading layers; the system asks back to clarify on ambiguity | Can press a suspect for more during interrogation; say "go find him" and the system confirms who you mean |
| P6 | The interface highlights only "what matters right now," not piling up cards | During interrogation the map disappears, dialogue and dossier take the main stage |
| P7 | Layout morphs fluidly with activity, no flicker | Smooth transition of the same world when switching player↔host |
| P8 | Refresh doesn't lose progress; can return to an old divergence point | Refresh the browser to continue; branch-replay from turn 3 |
| P9 | Host can change rules / inject events without code | Change one axiom via a form → world behavior changes accordingly |

---

## 5. Alternative Phase Orderings (Why the Current Order)

| Alternative | Reason rejected |
| :--- | :--- |
| Build the layout engine first (P7 early) | Without an event stream and salience, the layout engine has no input; and the existing 3-column grid "works," so it isn't a blocker |
| Build persistence first (P8 early) | Without the event-log kernel, persistence doesn't know what to store; storing "old-world JSON" equals freezing the error in place |
| Build the agent society first (P4 early) | Without the kernel and parser, agent actions have nowhere to live; "NPC autonomy" is icing on the cake, the kernel is the foundation |
| Build author tools first (P9 early) | Without a definition-driven runtime, author-tool output cannot be verified |

> Guiding principle: **First make "how the world changes" correct, then make "how the world is seen" smart, and finally make "how the world is authored" convenient.**
