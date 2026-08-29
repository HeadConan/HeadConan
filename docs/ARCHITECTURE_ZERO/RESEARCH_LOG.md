# HeadConan — Architecture Zero Research Log

> Method: focused literature review across 8 fields (A–H) + precedent mapping + adversarial testing.
> Principle: primary sources over blog posts; every load-bearing claim logged below.
> Date range: 2026-08-29.

---

## 1. Research Table (claim → source → evidence → implication)

| # | Claim | Source | Evidence | Implication for HeadConan |
|---|-------|--------|----------|---------------------------|
| 1 | Common knowledge is unattainable in any practical distributed system and is required for true coordination | Halpern & Moses, "Knowledge and Common Knowledge in a Distributed Environment", JACM 37(3):549–587, 1990 (Gödel Prize 1997) | Formal proof via coordinated-attack; hierarchy of distributed/everyone/common knowledge; possible-worlds model with indistinguishability | Do not build common-knowledge reasoning. Use per-observer fact sets; "everyone knows" = on-demand intersection (ADR-005) |
| 2 | Agents act on local state (indistinguishability), never global truth | Halpern & Moses 1990 (above) | Knowledge defined by the runs consistent with an agent's local history | Characters + player act on their projection, not raw state (ADR-005) |
| 3 | Social practices as affordances (not controls) produce replayable, authorable social drama | Evans & Short, "Versu — A Simulationist Storytelling System", IEEE TCIAIG 6(2):113–125, 2014 | Practices are reactive joint plans that *suggest* actions; agents choose by utility; strong autonomy, no drama-manager puppetry | Character policy = layered: rules → utility over practice affordances → LLM at decision (ADR-006) |
| 4 | Unconstrained autonomous agents produce "strange behavior" that shatters believability | Evans & Short 2014 (Sims critique, same paper) | Practice coordination solves the frame problem; exclusion logic manages fluents | Constrain autonomy with practices/norms; never free-run agents (ADR-006; DO-NOT-BUILD-YET) |
| 5 | Social exchanges are a reusable "social physics": preconditions/effects over social state | McCoy, Treanor, Samuel, Mateas, Wardrip-Fruin, "Prom Week / Comme il Faut", FDG 2011/TCIAIG 2013 | Social exchange = typed operation; acceptance/rejection selection from alternatives | Model social actions as typed events with preconditions/effects (ADR-004) |
| 6 | Story is not a primitive; it is a derived interpretation over a simulation's history | Dwarf Fortress (Adams); Aylett 1999 on emergent narrative; storylet literature | DF generates thousands of years of history from simulation; the "story" is the reader's projection | Story = derived layer over event log (ADR-001) |
| 7 | Narration must be subordinate to a single source of truth to prevent LLM contradiction | Vezhnevets et al., "Generative Agent Simulations of 1,000 People" / Concordia (DeepMind), arXiv 2023/2024 | Game Master anchors each action to canonical world state | Kernel = deterministic Game Master; LLM proposes, kernel commits (ADR-008) |
| 8 | LLM memory pipelines drift and are expensive; user-visible truth must come from canonical state, not agent memory | Park et al., "Generative Agents: Interactive Simulacra of Human Behavior", UIST 2023 | Memory stream + reflection + planning gives emergence but cost/drift | Canonical log is truth; agent memory is a derived convenience (ADR-008/010) |
| 9 | Deterministic replay is achieved by recording non-deterministic inputs, not by eliminating them | O'Callahan et al., "Engineering Record and Replay for Deployability" (rr), USENIX ATC 2017 | Record syscall boundary; replay is deterministic despite non-determinism | Record LLM outputs as inputs in the log → replay is deterministic (ADR-008/010) |
| 10 | Situation awareness is architecture, not UX polish | Endsley, "Toward a Theory of Situation Awareness", Human Factors 37(1):32–64, 1995 | SA = perception/comprehension/projection; SA support is a design contract | Runtime exposes S (state) + Δ (delta/causality) + pre-computed projection (ADR-009) |
| 11 | Working memory holds ~4 chunks; the runtime must chunk and gate change rate | Cowan, Behavioral and Brain Sciences 24(1), 2001; Miller, Psychological Review 63, 1956 | 7±2 chunks (Miller), ~4 activated (Cowan) | Keep active entities small; chunk micro-facts into macro-relations; gate per-turn change rate (ADR-009; DO-NOT-BUILD-YET) |
| 12 | Contradiction is the strongest immersion breaker | Green & Brock, "The Role of Transportation in the Persuasiveness of Public Narratives", JPSP 79(5), 2000 | High-transportation readers notice fewer false notes, but when noticed they are ejected | Enforce consistency at the simulation layer; patch at the source, not the prose (ADR-008) |
| 13 | Presence has two components: place illusion (PI) and plausibility (Psi) | Slater, "Place illusion and plausibility can lead to realistic behaviour in immersive virtual environments", Phil. Trans. R. Soc. B 364, 2009 | Psi requires direct response to participant actions + general credibility of off-screen behavior | Every user action must produce an observable consequence chain; off-screen agents must respect established norms (ADR-001) |
| 14 | Declarative relations scale for authoring but struggle with dynamic runtime state | Inform 7 / TADS (mature IF systems) | I7's world model is a relational rule engine; runtime dynamics under autonomous agents are its weak spot | Declarative relations for authoring; typed state + kernel for runtime (ADR-002) |
| 15 | Branching authored narratives have exponential authoring cost | Twine ecosystem | Every branch written by hand | LLM fills branch space, but constrained by canonical state (ADR-008) |
| 16 | A director/storyteller layer should modulate change rate, not script the story | RimWorld storyteller system | Pacing layer adjusts event pressure to narrative curve | Optional derived "curator" layer later; never in the causal core (ADR-001/DO-NOT-BUILD-YET) |
| 17 | Adaptive interfaces help but unpredictable adaptation breaks the mental model | Gajos et al., model-based adaptive UI (IUI) literature | Adaptation must be predictable and rationalized | Stable frame + dynamic content + explicit rationale + pinning (ADR-009) |
| 18 | Bitemporal modeling separates "what was true" (valid) from "when it was known" (transaction) | Snodgrass, "Developing Time-Oriented Database Applications in SQL", 1999 | Valid vs transaction time axes | Bitemporal knowledge store: valid_from (world) + learned_at (log) (ADR-010) |
| 19 | Event sourcing makes state rebuildable from the log; snapshot+fold bounds cost | Fowler, event sourcing bliki; Marten (JasperFx) | `AggregateStreamAsync(stream, version)`; state is a projection of the log | Causal hybrid: working state + append-only log + snapshots (ADR-003/010) |
| 20 | Deterministic core + rollback requires a recorded boundary | GGPO / Bettner & Terrano, "Linking Game Design and Netcode", GDC 2001 | Determinism + recorded command stream enables rollback netcode | Kernel pure; LLM inputs recorded (ADR-003/008) |

## 2. External research performed

- **Primary sources located (URLs):**
  - Halpern & Moses 1990 — https://groups.csail.mit.edu/tds/papers/Halpern/JACM90.pdf (Gödel Prize: https://eatcs.org/index.php/component/content/article/511)
  - Evans & Short 2014, Versu — https://cs.uky.edu/~sgware/reading/papers/evans2014versu.pdf
  - Prom Week / CiF (social physics) — https://scholar.tecnico.ulisboa.pt/.../Social_Agents_in_Minecraft.pdf (review w/ CiF & Versu detail)
  - Endsley 1995 — https://doi.org/10.1518/001872095779049543
  - Cowan 2001 — https://doi.org/10.1017/S0140525X01003922
  - Green & Brock 2000 — https://doi.org/10.1037/0022-3514.79.5.701
  - Slater 2009 — https://doi.org/10.1098/rstb.2009.0138
  - Park et al. 2023 (Generative Agents) — UIST 2023 (Stanford)
  - O'Callahan et al. 2017 (rr) — USENIX ATC 2017
  - Fowler event sourcing — https://martinfowler.com/eaaDev/EventSourcing.html
  - Snodgrass 1999 bitemporal — textbook (Morgan Kaufmann)
  - Bettner & Terrano 2001 (GGPO determinism) — GDC 2001
  - Aylett 1999 "Narrative in Virtual Environments" — emergent narrative foundations
  - Kreminski & Wardrip-Fruin 2018 "Storylets" (survey) — interactive narrative theory

- **Research agents (parallel) used:**
  - Agent R1: cognitive science (SA, WM, cognitive load, transportation, presence, theory of mind) + precedent mapping (Inform7/TADS, Twine, Façade, Versu, Prom Week, DF, RimWorld, Sims, Generative Agents, Concordia, Voyager, Bloomberg/adaptive UI) → 12 architectural lessons + 6-row precedent table (see table rows 3–4, 6–17).
  - Agent R2 (prior session, tasks #17–20): game engines/simulation (ECS, DES, determinism, rollback, save-state), distributed/temporal (event sourcing, CQRS, bitemporal, replay, causality), knowledge graphs / world models (KG vs scene graph vs relational state, temporal KG, RL world-models).

## 3. What changed the architecture

| Research finding | Change |
|------------------|--------|
| Common knowledge unattainable (Halpern–Moses) | Removed any common-knowledge/broadcast model → per-observer fact sets + on-demand intersection (ADR-005) |
| Versu practices-as-affordances | Character = layered policy; social practices supply affordances, never control (ADR-006) |
| rr recorded-input determinism | LLM outputs recorded as log inputs → replay deterministic despite stochasticity (ADR-008) |
| Bitemporal (Snodgrass) | Knowledge store gains valid_from + learned_at — answers "who knew at t" (ADR-005/010) |
| SA as contract (Endsley) | Runtime API must expose S/Δ/projection; UI renders all three SA levels (ADR-009) |
| ECS is a performance artifact | Rejected ECS for truth layer; typed entities + relations + facts (ADR-002) |
| Story is derived (DF/Aylett) | Story/drama-manager is an optional derived layer, never core (ADR-001) |

## 4. Confidence ledger

| Item | Type | Confidence |
|------|------|-----------|
| Causal hybrid state (snapshot+log) | DESIGN CHOICE | HIGH |
| Per-observer knowledge + observation-only writes | RESEARCH FINDING → design | HIGH |
| Layered character policy (rule→utility→LLM) | DESIGN CHOICE | HIGH |
| LLM-as-recorded-input replay | RESEARCH FINDING (rr) | HIGH |
| Scene-driven UI over projection contract | DESIGN CHOICE | HIGH |
| Bitemporal knowledge granularity | DESIGN CHOICE | MEDIUM |
| Definition-change migration semantics | SPECULATION | LOW |
| Scene-type set for v1 | SPECULATION | MEDIUM |
