# HeadConan — Routing System Execution Plan (Strict)

> **Scope of this plan (user-selected):** full-stack routing, delivered in two phases —
> **Phase A: Intent & Authority Routing** (runtime core) then **Phase B: Web / Deployment / API Routing** (periphery).
> This is an *execution* plan with gates, falsifiable acceptance tests, rollback conditions, and an audit contract.
> Aligns with `docs/POSITIONING.md` (LLM-first, State-grounded, Constraint-bounded; Interpretive vs Ontological authority; Interpretation as a first-class stage).

---

## 0. Definition & Scope

**Routing system** = the adjudication layer that decides *which path an input takes* from arrival to commitment.

It is **not**: prompt engineering, a UI concern, an agent framework, a microservice gateway, or a dialogue manager.

```
INPUT → [CLASSIFY] → [INTERPRET] → [PROPOSE] → [VALIDATE] → COMMIT | CLARIFY | REJECT
              │            │            │           │
              └────────────┴────────────┴───────────┴── every hop emits a RouteDecisionRecord
```

**In scope (Phase A).** User actions, NPC actions, Host interventions, scheduled/world-tick events, definition changes.
**In scope (Phase B).** `site/` page routing, GitHub Pages base-path routing, application routes, server API endpoints, multi-model provider routing.

---

## 1. Routing Topology (Phase A)

| Input class | Classification | Interpretive path | Submit path | Failure path |
|-------------|----------------|-------------------|-------------|--------------|
| User action — open-ended | LLM classifier | **LLM interpretation** → Proposed Reality | kernel validate → commit | clarify → (retry) → reject-as-event |
| User action — structured/known intent | deterministic matcher | deterministic parse | kernel validate → commit | reject-as-event |
| NPC action | policy layer (rule → utility → LLM) | policy-derived proposal | kernel (same writer) | skip (logged) |
| Host intervention | permission envelope | LLM/author interpretation | kernel w/ privileged scope | audit-reject (logged) |
| Scheduled / world tick | rule | deterministic | kernel | requeue with backoff |
| Definition change | meta | host-authored diff | version ledger + migration | rollback to prior version |

**RouteDecisionRecord (every hop, mandatory fields):**
`{ routeId, traceId, timestamp, inputClass, classification, confidence, pathTaken, modelId?, latencyMs, fallbackUsed, validatorResults[], outcome, reasonCode? }`

> Nothing may enter the world without a `routeId` that links it to a `traceId`. No trace → no commit.

---

## 2. Phase A — Stages, Gates, Rollback

Each stage: **objective → deliverable → Gate-In → Gate-Out (quantified) → acceptance tests (written red first) → rollback.**

### Stage A0 — Routing contract — ✅ **COMPLETE (2026-08-31)**

- **Objective:** freeze the types, the record schema, and the path vocabulary.
- **Deliverable:** `src/routing/types.ts` (`RouteRequest`, `RouteDecisionRecord`, `ProposedReality`, `ValidatorResult`, `StateChange`, `KnowledgeChange`, `Observation`, frozen vocabularies + runtime guards `isRouteDecisionRecord` / `isProposedReality`).
- **Gate-In:** POSITIONING.md §5–§6 read and accepted. ✔
- **Gate-Out:**
  - schema compiles ✔ (`tsc --noEmit` clean)
  - 100% of record fields documented ✔ (every field carries a comment)
  - zero `any` in routing types ✔ (asserted by test, not by eye)
- **Acceptance (red first):** 20 tests, written before `types.ts` existed; first run **RED** (module missing), then **GREEN**.
  - type-level: `@ts-expect-error` on missing `traceId`, missing `outcome`, illegal `inputClass`/`path`/`outcome`/`reasonCode`.
  - runtime: guard rejects missing/illegal fields, malformed `validatorResults`, non-objects; "no traceId → no commit" enforced for `ProposedReality`.
  - hygiene: source-level assertion of zero `any`.
- **Evidence:** `src/routing/types.test.ts` (20 passing); full suite **152 tests / 14 files green**; `npm run lint` clean.
- **Rollback:** not needed. Deleting `src/routing/types.ts` returns the repo to its prior state — no runtime module imports it yet (deliberate: A0 is a contract, not a dependency).

> **Discovery during A0 (important):** the repo already contains substantial runtime work (`kernel2`, `kernel2Resolver`, `agentLoop`, `scheduler`, `scene`, `dialogue`, `ai/propose`, `legacyAdapter`). A0 does **not** replace any of it — it supplies the missing cross-cutting vocabulary and audit record. See §1.1.

---

### §1.1 Existing implementation inventory (discovered during A0)

The routing plan must **wrap** what exists, not rebuild it. Mapping of existing modules onto routing paths:

| Existing module | Routing path it already implements | Covered | Gap vs A0 contract |
|-----------------|------------------------------------|---------|--------------------|
| `src/world/runtime/kernel2Resolver.ts` | `deterministic_parse` (NL → candidate `KernelEvent`) | ✔ | no `RouteDecisionRecord`; no `traceId` |
| `src/ai/propose.ts` (`proposeUserEvents`) | `llm_interpretation` + fallback to `deterministic_parse` | ✔ | emits `ProposedAction`, not the A0 `ProposedReality` envelope; no reason codes |
| `src/world/runtime/kernel2.ts` | the commit stage (data-driven preconditions/effects/cascade) | ✔ | rejections not yet recorded as route outcomes with `ReasonCode` |
| `src/world/runtime/agentLoop.ts` | `policy_proposal` (perceive with the NPC's own projection → propose) | ✔ | `traceId` referenced locally; no central routing record |
| `src/world/runtime/scheduler.ts` | `rule_emit` / `requeue` (delayed, periodic, seeded-RNG cascade) | ✔ | no routing record, no `requeue` reason codes |
| `src/world/runtime/scene.ts` | downstream of routing (experience layer) | n/a | consumes committed state; must not route |
| `src/world/runtime/dialogue.ts` | `speech_act` production inside conversation | partial | not yet expressed as a routing path |
| `src/world/runtime/legacyAdapter.ts` | strangles legacy `WorldState` UI onto the new state layer | n/a | must not acquire routing duties (§9 non-goals) |

**Consequence for later stages:** A1–A5 must **adapt** these modules to emit `RouteDecisionRecord`s and use the frozen `ReasonCode`s — not re-implement interpretation, commitment, NPC decisions, or scheduling. Any stage that starts by rewriting one of these modules has violated the plan..

### Stage A1 — Input classification — ✅ **COMPLETE (2026-08-31)**

- **Objective:** split structured vs open-ended input with a calibrated confidence threshold.
- **Deliverable:** `src/routing/classifier.ts` (`classifyDeterministic`, `classifyInput` w/ optional LLM injection, `choosePath`, `DEFAULT_THRESHOLD = 0.7`) + `src/routing/goldenSet.ts` (60 labelled cases).
- **Gate-Out:** golden set (N = 60, balanced 30/30) classification accuracy **100% (60/60)** — Gate ≥ 95% exceeded; every misclassification is a named test case (10 found during development became regression tests); θ recorded with behavior.
- **Acceptance:** red-first — Chinese verb+object misclassifications (`检查抽屉`, `把茶递给约尔`) surfaced as named failing tests first, then fixed: CJK verbs need no delimiter; single-char CJK verbs excluded from mid-text detection to avoid prose over-match ("信用"→"用").
- **Calibration record:** θ = 0.7. Confusion on golden set: structured 30/30, open 30/30. Confidence bands: verb-start 0.90, short verb+entity 0.72, entity-only 0.60, free-form 0.55. Below-θ inputs (all open cases) route to `llm_interpretation` — **never** to a forced deterministic parse.
- **Design correction recorded during execution:** the plan's original "confidence < θ → clarify" semantics belonged to the wrong layer. `clarify` is an *interpretation-layer* concept (A2/A5, where confidence is about meaning). At the *classification* layer, low confidence conservatively routes to `llm_interpretation` (POSITIONING §4.1 LLM-first: spend one LLM request, never parse garbage). `choosePath` replaces the original `decideByThreshold`.
- **Evidence:** `src/routing/classifier.test.ts` (17 tests) + `types.test.ts` (20). Full suite **169 tests / 15 files green**; `tsc --noEmit` clean.
- **Rollback:** not needed. Deleting the classifier returns routing to direct LLM interpretation (the plan's own fallback stance).

### Stage A2 — Interpretation → Proposed Reality — **PLAN (2026-08-31, ready to execute)**

#### Reality check before planning (what exists, what A2 must wrap — §1.1)

| Fact | Consequence for A2 |
|------|--------------------|
| `src/ai/propose.ts` → `proposeUserEvents` already implements: LLM proposal (`/api/propose-events`), client-side validation (`validateProposedEvents`), `clarify` semantics (`CLARIFY_THRESHOLD = 0.6`), and deterministic fallback (`toDeterministic`) | A2 **must not rewrite it** — A2 is an adapter that maps its `ProposedAction` into the A0 envelope and proves purity |
| `KernelEvent` in `kernel2` is structured (`action` / `speech_act` / `reveal_fact`) | A0's `ProposedReality.events: string[]` placeholder must be **corrected to `KernelEvent[]`** (contract amendment, recorded below) |
| `propose.test.ts` already has a `mockFetchResponse` pattern for offline LLM testing | A2 reuses that pattern — no API key needed, tests stay offline |
| Interpretation must never write state | Purity is a first-class A2 Gate |

#### Objective

Make interpretation a first-class, schema-bounded stage (POSITIONING §6): every proposal travels as a `ProposedReality` under a `traceId`, provably pure, with no change derivation inside the interpreter.

#### Deliverable

`src/routing/interpreter.ts`:

```
interpret(text, world, state, actorId, opts { provider, targetId? })
  → InterpretationResult {
      traceId,                       // new: A0 no-trace rule
      source: 'llm' | 'deterministic' | 'clarify',
      reality: ProposedReality,      // events + confidence + rationale only
      clarify?: { notice: string },  // propagated from proposeUserEvents
      latencyMs,
    }
```

- Internals: calls `proposeUserEvents` (reuse, not rewrite), maps `ProposedAction` → `ProposedReality`.
- **Role split (contract amendment):** the interpreter fills ONLY `events / confidence / rationale / traceId`. `stateChanges / knowledgeChanges / observations` stay empty in the proposal and are **derived by the kernel at commit time** (Stage A4) — the Phase-1 "observation side-effects live in the kernel" rule. The interpreter never describes consequences; it proposes actions.

#### Contract amendments to A0 (recorded, deliberate)

1. `ProposedReality.events: string[]` → **`KernelEvent[]`** (import type from `world/runtime/kernel2`; one-way dep — kernel2 never imports routing).
2. `ProposedReality` doc updated: change-arrays are **kernel-derived at commit**, not interpreter-filled (field comments + a guard note).
3. `interpreter.ts` adds a purity contract comment: same input + same recorded model output ⇒ same `ProposedReality`; state is never read-modify-write.

#### Red-first test list (`src/routing/interpreter.test.ts`, written before `interpreter.ts`)

1. **Purity**: `interpret('Follow Yor', procedural)` — deep-equal snapshot of `state` before/after (interpreter never mutates).
2. **Envelope**: output passes `isProposedReality`; `traceId` non-empty (no trace → no commit).
3. **Deterministic path**: `provider: 'procedural'` → `source: 'deterministic'`, events match `kernel2Resolver` output shape, confidence 0–1.
4. **LLM path (offline mock)**: mock `/api/propose-events` → valid events → `source: 'llm'`, events validate against `validateProposedEvents`-style rules.
5. **Clarify propagation**: mocked low-confidence LLM response → `source: 'clarify'`, `reality.events = []`, `clarify.notice` present, `reasonCode` context `LOW_CONFIDENCE` (via A0 constant).
6. **Malformed LLM**: mocked invalid JSON / empty events → falls back to `source: 'deterministic'` (never blocks).
7. **Timeout LLM**: mocked rejected fetch → deterministic fallback; `latencyMs` recorded.
8. **No derived changes**: for every source, `reality.stateChanges / knowledgeChanges / observations` are `[]` (interpretation proposes; kernel derives).
9. **Schema purity**: same input twice (procedural) ⇒ deep-equal realities (deterministic reproducibility).
10. **Offline latency**: procedural path p95 ≤ 50 ms (budget from plan).

#### Gate-Out (quantified)

- 100% of interpreter outputs pass `isProposedReality` and carry a non-empty `traceId`.
- Purity: deep-equal `state` before/after in every test above (asserted, not assumed).
- Procedural (offline) p95 ≤ **50 ms**.
- Zero derived changes emitted by the interpreter (test 8).
- Full suite stays green (169 tests baseline; A2 adds ≥ 10).

#### Explicit non-goals for A2

- No validator (Stage A3), no commit integration (Stage A4), no RouteDecisionRecord emission yet (Stage A6 wires it), no changes inside `kernel2` / `propose.ts` / `kernel2Resolver`.

#### Risks & rollback

| Risk | Mitigation | Rollback trigger |
|------|-----------|------------------|
| `kernel2` import in routing creates a cycle | one-way dep asserted by lint; kernel2 never imports routing | cycle detected → revert amendment, keep `events` opaque |
| Mock LLM tests drift from real `/api/propose-events` shape | reuse the exact `mockFetchResponse` helper pattern from `propose.test.ts` | any real-response mismatch caught in Stage A6 golden runner |
| Purity violated by future edits | purity assertions live in the suite (not just this stage) | failing purity → freeze interpreter changes |

### Stage A3 — Validator (constraint-bounded)
- **Objective:** enforce "the world does not forget itself" (POSITIONING §4.3).
- **Deliverable:** `validator.ts` covering the constraint families: contradiction with established facts, impossible action, rule violation, knowledge without plausible path, entity outside its circumstances, permission envelope.
- **Gate-Out:** 100% pass on the **adversarial set (≥ 20 cases)**; every rejection carries a `reasonCode`; false-reject rate on valid actions ≤ **2%** (golden set).
- **Acceptance:** each constraint family has ≥ 3 tests (pass + reject + boundary).
- **Rollback:** validator read-only mode (log + allow) for one stage while fixing false rejects.

### Stage A4 — Commit & rejection semantics
- **Objective:** single writer; rejection is an event.
- **Deliverable:** kernel integration — `applyEvent` accepts only validated `ProposedReality`; rejections appended with `reasonCode` and observers.
- **Gate-Out:** zero state mutation outside `applyEvent` (verified by static check + test); every rejection observable in the player/host projection as appropriate.
- **Acceptance:** replay determinism holds with rejections in the log; two identical runs ⇒ identical state.
- **Rollback:** revert to last snapshot; kernel remains the only writer.

### Stage A5 — Fallback & degradation chain
- **Objective:** the system must degrade, never invent.
- **Deliverable:** explicit chain — `LLM ok & confidence ≥ θ` → `deterministic fallback` → `clarify (ask user)` → `reject-as-event`.
- **Gate-Out:** simulated failures (timeout 100%, malformed output, low confidence, provider 5xx) each produce the correct next hop; **zero** silent failures; **zero** fabricated state.
- **Acceptance:** 4 fault-injection tests, each asserting the hop and the recorded `fallbackUsed`.
- **Rollback:** hard-stop mode (refuse action, explain) if fallback misroutes.

### Stage A6 — Observability, golden & regression suites
- **Deliverable:** route log query API ("why did this take this path?"), golden set runner, adversarial runner, regression gate in CI.
- **Gate-Out:** route decision coverage **100%**; golden + adversarial suites green in CI; p95 overhead of routing instrumentation ≤ **5 ms**.
- **Acceptance:** for any logged `traceId`, the full path (classify → interpret → validate → commit/reject) is reconstructible.
- **Rollback:** instrumentation only — never blocks commits; disable tracing if overhead exceeds budget.

---

## 3. Phase B — Web / Deployment / API Routing

### Stage B0 — Route inventory audit
- **Deliverable:** `docs/ROUTING_INVENTORY.md` — every page route (`site/`), every app route, every API endpoint, every provider route, with base-path assumptions.
- **Gate-Out:** 100% of routes enumerated; **zero** absolute paths in `site/`; **zero** localhost dependencies.

### Stage B1 — GitHub Pages routing
- **Deliverable:** base-path correctness (project site under `/HeadConan/`), relative links, 404 fallback, SPA-less navigation verified.
- **Gate-Out:** site loads from `https://<owner>.github.io/<repo>/` with **0** broken asset requests (network panel check, 15 sampled routes).
- **Rollback:** revert deploy workflow; keep previous published artifact.

### Stage B2 — API & provider routing
- **Deliverable:** endpoint router + provider router (multi-model, fallback chain), key boundary enforcement (no keys client-side), timeout/retry policy.
- **Gate-Out:** every endpoint has a contract test; provider failover chain exercised (primary down → secondary → deterministic); **0** secrets in client bundles (scanned).
- **Rollback:** disable non-primary providers; deterministic mode only.

### Stage B3 — Contract tests & CI gate
- **Deliverable:** one contract test per route (status, shape, error code); CI blocks merge on failure.
- **Gate-Out:** contract suite green; route inventory updated automatically from tests (drift detector).

---

## 4. Strictness Clauses (non-negotiable)

1. **Red-first.** No stage implementation begins before its failing test exists and is committed.
2. **Gate-Out or stop.** A stage that misses any Gate-Out threshold does **not** advance; it is rolled back or time-boxed for one retry.
3. **No silent paths.** Every route outcome is classified as `commit | clarify | reject | skip | requeue` and logged. Undefined outcome = bug.
4. **No state writes outside the kernel.** Static check + test. Interpretation is pure.
5. **No secrets, no client-side authority.** Provider keys server-side only; client may propose, never commit.
6. **Recorded inputs only.** Any non-deterministic hop (LLM, RNG, clock) is recorded in the route record; replay replays records.
7. **Coverage floor.** Routing modules: line ≥ **85%**, branch ≥ **80%**. Below floor ⇒ stage not done.
8. **Latency budget.** Routing overhead p95 ≤ **5 ms** (excluding model calls); model-call budget declared per stage.
9. **Rejection explainability.** 100% of rejections carry a `reasonCode` from a frozen enum; free-text reasons are additional, never instead.
10. **Anti-drift.** Any change to routing must re-run the POSITIONING/ARCHITECTURE consistency checklist (§8).

---

## 5. Fallback & Rejection Semantics

```
LLM reachable?
  ├─ no  → deterministic fallback (parse + validate)
  │         ├─ parse ok  → validate → commit | reject
  │         └─ parse fail → clarify → (user rephrase) → retry once → reject-as-event
  └─ yes → interpretation produced?
            ├─ no (timeout/malformed) → deterministic fallback (as above)
            └─ yes → confidence ≥ θ?
                     ├─ yes → validate → commit | reject-as-event
                     └─ no  → clarify → retry once → reject-as-event
```

**Rejection is not failure — it is an event** (observable, logged, sometimes witnessed by characters: *"you tried and failed; someone noticed"*). Reason codes are frozen: `CONTRADICTION | IMPOSSIBLE | RULE_VIOLATION | NO_KNOWLEDGE_PATH | OUT_OF_CIRCUMSTANCE | PERMISSION | LOW_CONFIDENCE | MALFORMED | TIMEOUT`.

---

## 6. Observability Contract

- `traceId` propagates: user action → route record → interpretation → validation → commit → experience projection.
- Queryable: `byTrace`, `byRoute(pathTaken)`, `byReasonCode`, `byFallback`, `latencyPercentiles`.
- Every route record is immutable and append-only (same discipline as the event log).
- Dashboards (minimal): route outcome mix, fallback rate, rejection reason mix, p50/p95 latency, false-reject rate.

---

## 7. Test Matrix

| Suite | Content | Gate |
|-------|---------|------|
| Unit | every input class × every outcome path (commit/clarify/reject/skip/requeue) | 100% of paths covered |
| Golden | ≥ 60 labelled inputs → expected route | accuracy ≥ 95% |
| Adversarial | ≥ 20 cases: privilege escalation, knowledge leak, contradiction, malformed, timeout, prompt injection | 100% pass, 0 leaks |
| Property | interpretation purity, replay determinism, no state write outside kernel | all properties hold |
| Fault injection | LLM timeout, 5xx, malformed JSON, low confidence | correct hop + recorded `fallbackUsed` |
| Regression (CI) | golden + adversarial + property on every model/prompt change | green to merge |

---

## 8. Anti-Drift Checklist (run at every routing change)

| Source | Requirement |
|--------|-------------|
| `POSITIONING.md` §4 | LLM-first (interpretation is LLM-led), State-grounded (committed truth persisted), Constraint-bounded (validator, not prediction) |
| `POSITIONING.md` §5 | Interpretive authority = LLM; Ontological authority = world system; routing must not let the interpreter commit |
| `POSITIONING.md` §6 | Interpretation is a first-class stage — never collapsed to `action → response` or `action → hardcoded transition` |
| `POSITIONING.md` §8 | Generated possibility ≠ committed reality — proposals are not truth until committed |
| `ARCHITECTURE_ZERO/ARCHITECTURE.md` | single writer; projection-only reads; recorded inputs; rejection-as-event |
| `WORLD_MODEL_PHASE1.md` | no rules engine, no scene state machine, no scheduler creep into routing; 5-concept model respected |

Any conflict → **POSITIONING.md wins**, and the conflict is recorded in this file's change log.

---

## 9. Explicit Non-Goals

- Universal intent-recognition platform · dialogue manager · agent orchestration framework · plugin routing · microservice gateway · service mesh · multi-tenant routing · semantic router product · vector-based intent index · per-world routing DSL.

---

## 10. Cadence, Ownership, Evidence

| Stage | Time-box | Exit evidence in repo |
|-------|----------|----------------------|
| A0 | 0.5 d | types + schema test |
| A1 | 1.5 d | golden set + calibration curve |
| A2 | 2 d | interpreter tests + purity test |
| A3 | 2 d | adversarial suite + reason-code enum |
| A4 | 1.5 d | kernel integration + replay test |
| A5 | 1.5 d | fault-injection suite |
| A6 | 2 d | route query API + CI gate |
| B0–B3 | 3 d | route inventory + contract tests + deploy verification |

**Evidence rule:** a stage is *done* only when its tests, its gate measurements, and (if a gate was missed) its rollback note are committed. Verbal completion is not completion.

---

## 11. Risk Register

| Risk | Prob. | Impact | Mitigation | Rollback trigger |
|------|-------|--------|------------|------------------|
| Classifier threshold miscalibrated (mass clarify) | Med | High | Calibrate on golden set; start conservative; monitor clarify rate | clarify rate > 20% for 1 session |
| LLM interpretation leaks hidden facts into proposals | Med | Critical | Proposals validated against observer projection; adversarial suite | any leak in adversarial suite |
| Validator false-rejects valid actions (world feels stubborn) | Med | High | false-reject ≤ 2% gate; read-only tuning mode | false-reject > 5% |
| Routing overhead grows into a framework | High | High | §9 non-goals enforced in review | any file outside `src/routing/*` claiming routing duties |
| Provider outage / key misconfiguration | Med | Med | fallback chain; deterministic mode; key boundary scan | provider errors > 10% → deterministic-only |
| Route log grows unbounded | Low | Med | snapshot/compaction policy; size budget per session | log > budget → compact |
| Phase B base-path regression on Pages | Med | Med | contract tests + network-panel check on deploy | any 404 on sampled routes |

---

## 12. Change Log

- **2026-08-31** — Plan created. Scope confirmed by user: full-stack routing, **Phase A (intent & authority) first**, Phase B second. All thresholds are **initial hypotheses** to be calibrated in Stage A1/A6; they are recorded so they can be falsified, not defended.
- **2026-08-31** — **Stage A0 COMPLETE.** Red-first (tests written before `types.ts`; first run failed). 20 routing tests green, full suite 152/152, `tsc --noEmit` clean. Added **§1.1 existing-implementation inventory** after discovering the repo already ships `kernel2`, `kernel2Resolver`, `ai/propose`, `agentLoop`, `scheduler`, `scene`, `dialogue`, `legacyAdapter` — later stages must adapt these to the routing contract, not rebuild them.
- **2026-08-31** — **Stage A1 COMPLETE.** Classifier + golden set (60) + θ=0.7 calibration; golden accuracy 100%; red-first Chinese verb+object fix; **design correction**: `clarify` is an interpretation-layer concept — classification-layer low confidence routes to `llm_interpretation` (LLM-first), `decideByThreshold` replaced by `choosePath`. 37 routing tests green; full suite 169/169.
- **2026-08-31** — **Stage A2 planned (ready to execute).** Plan based on a reality check of `ai/propose.ts` (already implements LLM proposal + validation + clarify + deterministic fallback) and `kernel2` `KernelEvent` (structured). A2 = adapter + purity proof, with two contract amendments to A0: `events: string[]` → `KernelEvent[]`; change-arrays are kernel-derived at commit, not interpreter-filled. 10 red-first tests listed; Gates quantified; risks + rollback recorded.
