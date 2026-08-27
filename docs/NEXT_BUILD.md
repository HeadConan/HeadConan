# HeadConan Next Build (MVP Dependency Graph) (NEXT_BUILD)

> Goal: make [`10_MINUTE_EXPERIENCE.md`](./10_MINUTE_EXPERIENCE.md) run end-to-end, **and do nothing else**.

---

## 1. Dependency Graph (DAG)

```
                          ┌────────────────────────────┐
                          │ 0. SPY×FAMILY World Definition (hand-written) │
                          │    10 characters + 4 locations + 3 relationships + │
                          │    2 secrets + 8 rules (minimum set)  │
                          └─────────────┬──────────────┘
                                        │
                                        ▼
                          ┌────────────────────────────┐
                          │ 1. WorldInstance + Log     │
                          │    (incl. instantiate, empirically proven)   │
                          └─────────────┬──────────────┘
                                        │
                                        ▼
                          ┌────────────────────────────┐
                          │ 2. Event Kernel applyEvent       │
                          │    precondition / effect / cascade / observation / log  │
                          │    ※ implement all 7 precondition types        │
                          └─────────────┬──────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
        ┌────────────────┐    ┌────────────────────┐    ┌────────────────────┐
        │ 3. First-order dialogue      │    │ 4. Knowledge ledger + projection    │    │ 5. Agent decision (NPC)    │
        │   speech_act    │    │    (representation │    │  perception → reaction (template)   │
        │   + subtext optional  │    │     already exists, strengthen writes)  │    │  ※ no full multi-agent │
        └────────┬───────┘    └─────────┬──────────┘    └─────────┬──────────┘
                 │                       │                        │
                 └───────────────────────┼────────────────────────┘
                                        ▼
                          ┌────────────────────────────┐
                          │ 6. Scene state machine (4 types)     │
                          │   conversation / everyday / │
                          │   exploration / world_edit │
                          └─────────────┬──────────────┘
                                        │
                                        ▼
                          ┌────────────────────────────┐
                          │ 7. 5-primitive layout engine + Focus   │
                          │    scene → main stage shape         │
                          └─────────────┬──────────────┘
                                        │
                                        ▼
                          ┌────────────────────────────┐
                          │ 8. Persistence (localStorage)   │
                          │    world + log + sceneState │
                          └─────────────┬──────────────┘
                                        │
                                        ▼
                          ┌────────────────────────────┐
                          │ 9. [Verification] 10-minute walkthrough     │
                          │    see 10_MINUTE_EXPERIENCE  │
                          └────────────────────────────┘
```

Parallel items (run in parallel with the critical path):
- **P2a**: Image assets (10 static portraits, 3 static evidence images) — use placeholders or Gemini procedural fallback, **does not block the experience**.
- **P2b**: Director Console real channel (with traced events) — can be done after step 4, demonstrable earliest.

---

## 2. Critical Path and Greatest Risks

| Risk | Location | Mitigation |
| :--- | :--- | :--- |
| **MUST**: the precondition implementation in applyEvent must be **complete across all 7 types** | Stage 2 | Reuse and adapt `evaluator.ts`, **explicitly record the failure reason for each precondition type** (avoid the "cognition leak" discovered in E1) |
| **MUST**: knowledge side effects must be **triggered from events**, UI / LLM must not read state directly | Stage 4 | Rendering must pass through `projectEpistemicPerspective` — add unit tests (mock E1-style "player cannot see X" / "Anya sees X") |
| **MUST**: speech_act is a **structured** event, containing `utterance/intentTag/subtext?` | Stage 3 | UI must be able to display subtext (e.g., a character is a mind-reader), and subtext is shown only when the projection permits |
| **HIGH**: NPC reactions are not templates — must be based on character state (emotion / relationship / secret) | Stage 5 | Use an LLM call but **only based on that NPC's projected view** as context (prevent leak) |
| **HIGH**: scene auto-switching must have a **clear trigger** | Stage 6 | Rule definition: time-of-day + significant event + user intent — 3 sources, combinable |

---

## 3. Stage Exits (must be verified after each stage completes)

| Stage | Exit verification (user-perceptible) |
| :--- | :--- |
| 0 | SPY×FAMILY definition passes `validateWorldDefinition` (0 errors) |
| 1 | Instantiate two SPY×FAMILY instances, canon + one divergence, no cross-contamination (reuse E1) |
| 2 | A test: `act:confront_truth_without_knowledge` must be rejected by `requires_knowledge` (fix the bug found in E1) |
| 3 | `speech_act(Loid, Yor, "care")` enters the log; Yor's response is based on her own knowledge (does not know Loid is a spy) |
| 4 | After the player switches characters, viewing Anya's "knows" (log): can see the fact ID that Loid is a spy; the player perspective cannot |
| 5 | Anya interjects proactively at Step 3 (even if the player did not ask her) |
| 6 | Clock advances to 8:45, scene auto-switches from family to commute |
| 7 | Focus changes (click Damian), stage morphs from "family dialogue" to "hallway investigation" |
| 8 | After refresh, Step 9's "reputation -10" still persists |
| 9 | Full 10 minutes runs through with no break (see `10_MINUTE_EXPERIENCE.md` §6) |

---

## 4. Rationale Check for the Order

| Alternative | Reason to reject |
| :--- | :--- |
| Build the layout engine first | Without scenes and events, the layout has no content to present |
| Build LLM integration first | The presentation layer is fine with mocks; does not block the experience core |
| Build the cloud first | localStorage satisfies single-user; premature |
| Build multi-world first | The 10-minute experience needs only 1; evaluate multi-world after it runs |
| Build the world editor first | The host perspective is "inspect + intervene", no full editing needed |

---

## 5. Relationship to the Previous Architecture Review

This graph and `IMPLEMENTATION_ROADMAP.md` (P0→P9) are **the same work** seen from different angles:
- IMPLEMENTATION_ROADMAP = time dimension (monthly plan + stage exits)
- NEXT_BUILD = dependency dimension (what must be done first)

**The only difference**: NEXT_BUILD shifts the focus from "validating the architecture" to "validating the product". Architecture E1–E6 is still good early steps, but the **product priority this month** is: running the 10-minute experience > completing the theoretical completeness of the kernel.

---

## 6. The First Code to Write (the only one)

See `RECOMMENDATION.md` §"The First Code to Write" — **minimal usable version of the event kernel `applyEvent`**: accepts `WorldInstance + Event`, returns `{ nextInstance, spawnedEvents[], observations[], rejected? }`. Can correctly handle:
- `requires_co_presence`
- `requires_knowledge` (fix the bug found in E1)
- `requires_capability`
- one atomic `set` effect
- one `reveal_fact` effect
- side effects → `entityKnownFacts`

**Why this one**: it is the **minimal common denominator** of the three promises "perceptible consequence" / "information asymmetry" / "event-driven" — everything else (dialogue, agent, scene, layout) is built on top of it.
