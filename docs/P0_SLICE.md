# P0 — FIRST REAL VERTICAL SLICE Acceptance Report

> **Proposition**: User natural-language action → deterministic event → real world change → inspectable.
> **Goal**: Not to build HeadConan, but to prove HeadConan can exist.
> **Status**: ✅ Passed (21/21 tests, including E1 9 items + P0 12 items; `npm run lint` passes)

---

## 1. Deliverables

| File | Responsibility |
| :--- | :--- |
| `src/world/p0/world.ts` | SPY×FAMILY minimal world definition (3 characters / 2 locations / 1 relationship / 4 facts / 2 axioms / 2 character slots) + breakfast-scenario seed |
| `src/world/runtime/kernel.ts` | Event kernel `applyEvent` (P0 inline rule set: speech_act / confront_secret / reveal_fact; 3/7 precondition classes; observation side effects; deterministic log) |
| `src/world/runtime/resolver.ts` | Deterministic intent parsing `resolveUserAction` (NL → candidate event; LLM-replaceable interface) |
| `src/world/p0/p0.test.ts` | 12 acceptance tests |
| `src/world/runtime/instantiate.ts` | (improved) the synthesizer now copies the `currentActivity/emotionalState` baseline |
| `docs/P0_SLICE.md` | This report |

---

## 2. Acceptance Tests (12 items, all passing)

### 2.1 Information Asymmetry (world truth ≠ player knowledge ≠ omniscience)
| Test | Assertion |
| :--- | :--- |
| World truth | `fact:yor_is_assassin` exists, visibility domain `singular_secret` |
| Player (Loid) projection | **cannot see** `yor_is_assassin`; **sees** `yor_cover_clerk` |
| Anya / Host | Anya sees both secrets; Host is omniscient (equals all facts) |

### 2.2 Intent Parsing (deterministic, no LLM)
| Input | Parse result |
| :--- | :--- |
| "Yor, where did you go last night?" | `speech_act(ask, topic=last night)` confidence 1 |
| "I accuse you of being that assassin!" | `confront_secret(fact:yor_is_assassin)` |
| "Nice weather today." | fallback `speech_act(say)` |

### 2.3 Main Loop (intent → event → perceptible consequence)
| Assertion | Value |
| :--- | :--- |
| Turn advances after asking about last night | turn 1 → 2 |
| Yor's emotion | 'calm' → 'alert (cover reaction)' |
| Loid's suspicion | `dynamicAttributes.suspicionOfYor` 0 → 2 |
| Relationship affinity | 30 → 31 |
| Observation side effect | Yor / Anya present hear it; player hears Yor's cover response |
| Log | `evt:2:0:speech_act` (deterministic ID) |

### 2.4 Rejection Semantics (E1 vulnerability fix)
- Player `confront_secret` when unaware → **rejected** (`requires_knowledge` enforced)
- Reason includes "knowledge precondition not met" / "visibility domain not open to you"
- World not corrupted: turn doesn't advance, emotion/relationship unchanged; the rejection itself enters the log (rejection is an event)

### 2.5 Host Channel + Cascade
- Host `reveal_fact` → Loid's knowledge ledger +1 → projection visible → showdown succeeds
- Showdown consequence: relationship affinity 30→0, trust 10→0, Yor's emotion 'horrified, despairing, ready to flee', Anya learns the secret, cascade events enqueued

### 2.6 Determinism / Replayability
- Same input run twice → after stripping instanceId, state is **exactly identical**
- Full sequence (ask → reveal → confront) replays identically twice; log IDs don't depend on time / random numbers

---

## 3. What This Proves / Doesn't Prove

### ✅ Proved
1. **A user's single sentence can cause a real, deterministic, inspectable world change** (not templated narrative).
2. **Information asymmetry can land**: same state, three projections (Loid / Anya / Host) each correct.
3. **Cognition leak can be plugged**: `requires_knowledge` is enforced, unaware showdown is rejected.
4. **Host channel doesn't bypass the kernel**: Host injects via the `reveal_fact` event, going through the same `applyEvent` as the player.
5. **Determinism holds**: no `Date.now`/`Math.random`, log is replayable.

### ❌ Not Proved
1. Dialogue experience (UI presentation of `speech_act`, subtext layer) — no interface yet.
2. Autonomous NPC (Yor's reaction is a deterministic template, not agent decision).
3. Scene switching (scene state machine not yet implemented).
4. Full rule engine (7 precondition classes, only 3 implemented; rules inline rather than data-driven).
5. Hybrid with LLM (parser is purely deterministic; "LLM proposes + deterministic validation" not yet verified).

---

## 4. Known Limitations (honest disclosure)

| Limitation | Note |
| :--- | :--- |
| Rules inline | kernel hardcodes by event type, not data-driven; P2 migrates to `WorldActionDefinition`-driven |
| Preconditions 3/7 | `requires_location / requires_resource / requires_authority / requires_min_trust` are TODO (constant declarations already exported) |
| NPC reaction template | Yor has only 3 deterministic reactions; no autonomy |
| No scheduler | `spawnedEvents` returns but does not delay-execute |
| No UI | The vertical slice is pure runtime validation; UI wiring belongs to the next phase |
| Single scene | Only breakfast-scenario seed; no scene state machine |

---

## 5. Next Step (dependency)

```
✅ Done              → Next step
Event kernel applyEvent → ① speech_act wired into scene UI (dialogue form)
                       → ② Scene state machine (conversation / everyday / exploration / world_editing)
                       → ③ NPC reaction upgraded to "perceive → decide" (agent layer)
                       → ④ Rules data-driven (WorldActionDefinition drives the kernel)
```

Per the `NEXT_BUILD.md` dependency graph, the next concrete implementation is **② scene state machine** (or ① dialogue UI, depending on whether to validate experience or architecture first).
