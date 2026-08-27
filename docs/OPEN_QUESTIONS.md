# HeadConan Open Questions (OPEN_QUESTIONS)

> These are questions that **require experiments, not assumptions**. They do not block P0/P1, but become "must-answer" questions at their respective phases. Each question is tagged with: owning phase, current lean, and what evidence is needed.

---

## Q1 — Semantics of Turns and Time (blocks P4/P6 scheduling design)

- **Question**: How much world time does one user action advance? Is clock advancement "after action +1 turn" or "by event type" (dialogue +15 min, march +1 day)? How do a countdown world (murder clock) and a schedule world (campus weekly calendar) unify?
- **Current lean**: Clock advancement is determined by **event type + the world's defined timeScale config**; the turn count is merely a user-interaction counter, decoupled from the world clock.
- **Evidence needed**: E2's delayed-consequence experiment (`delayInTurns` vs `afterInUniverseTime` — which is more natural).
- **Blocked phase**: P4 (scheduler), P6 (time pressure in salience).

---

## Q2 — Degree of Autonomy (blocks P4 tick design)

- **Question**: When do NPCs act autonomously? "Everyday campus" needs background routine simulation (NPCs attend class / send messages), while "murder mystery" may only need reactive NPCs. Should the initiative threshold be declared by the world definition or adjusted at runtime?
- **Current lean**: Declare `reactivityThreshold` on the definition side (the `AgentBehavior` type shell already exists), and give tick budget by world type at runtime; first do "scheduler-triggered + high-priority agents," not full always-on simulation.
- **Evidence needed**: In the university-world walkthrough (P5 exit criteria), whether "the world still feels believable when the user does nothing."
- **Blocked phase**: P4.

---

## Q3 — Granularity of Speech (speech_act) (blocks P5 dialogue experience)

- **Question**: To what structure is dialogue recorded? The minimum is `{ speaker, addressee, utterance, turn }`; to support subtext / lies / mind-reading, it may need `{ intentTag, subtext?, truthValue?, knownLie? }`. Over-structuring overloads the LLM generation burden.
- **Current lean**: v1 adds only `intentTag` (interrogate / confess / lie / smalltalk) + optional `subtext` text; mind-reading / deduction are treated as derived (the observer's capability determines whether the subtext layer is visible, see docs/layout/conversation.md).
- **Evidence needed**: In the SPY×FAMILY dialogue walkthrough, whether the LLM can stably produce intent tags; whether the projector can filter subtext by capability.
- **Blocked phase**: P5.

---

## Q4 — Belief Evolution Rules (blocks P3/P4 cognition writes)

- **Question**: How do observations change belief confidence? Need explicit rules ("consistent observation +10% confidence") or let the LLM naturally carry it during decision-making (agent outputs new beliefs)?
- **Current lean**: Structured rules handle **fact-class** cognition (knownFacts add/remove), the LLM handles **subjective-class** cognition (belief content and confidence change); both are written back as event effects.
- **Evidence needed**: E3 extension — after consecutive observations, is the confidence change monotonic and reasonable.
- **Blocked phase**: P3 (cognition write channel), P4 (agent decision).

---

## Q5 — Boundary Between LLM and Determinism (spans P2–P6)

- **Question**: Which judgments must be deterministic (precondition / permission / bookkeeping / validation), and which are handed to the LLM (agent decision / intent parsing / narrative phrasing)? What is the empirical evidence for the boundary?
- **Current lean**: Per ADR-12: bookkeeping fully deterministic, decisions fully LLM; intent parsing is a "LLM proposes + deterministic validation" hybrid.
- **Evidence needed**: Ambiguity rate of intent parsing (byproduct of the E-series experiments); consistency of agent decisions (whether a two-time decision difference in the same situation is acceptable).
- **Blocked phase**: P2 (deterministic parts built first), P3 (hybrid parts).

---

## Q6 — Scale Inflection Point of Memory (blocks "whether to build semantic memory")

- **Question**: At what world size / session length does structured cognition recording fail? When must summarization / semantic retrieval be introduced?
- **Current lean**: Don't build it yet (DO_NOT_BUILD_YET #1); hard-carry with log + cognition records up to ~50 turns, and observe the failure modes.
- **Evidence needed**: Long-session stress test (after P8): the turn at which "character forgot an early agreement" / "context blew up" appears.
- **Blocked phase**: After P8b.

---

## Q7 — Branching User Experience (blocks P8b)

- **Question**: How are parallel timelines presented in the UI without causing confusion? How is the active branch marked? How do the rollback experience (return to turn 3 to replay) and "current progress" coexist?
- **Current lean**: First do the data model of "branch = new instance" (ADR/kernel §5); the UI only presents **a single active branch + a branch list**, not a timeline waterfall diagram.
- **Evidence needed**: Real-user frequency of rollback/branch usage (may be very low — perhaps "start a new instance" is enough).
- **Blocked phase**: P8b.

---

## Q8 — Interpretability and Calibration of Salience Computation (blocks P6)

- **Question**: How are the four FocusScore factor weights calibrated? Can "what's worth seeing" hold consistently across the four baseline worlds? When is automatic focus switching a help, and when is it disorienting?
- **Current lean**: Weights are parameterized by ExperienceProfile + hand-tuned; provide interpretable output of "why this focus"; sticky lock as a fallback (LAYOUT_ARCHITECTURE §3.2).
- **Evidence needed**: User testing of the six-scenario layout matrix (which automatic switch is most counterintuitive).
- **Blocked phase**: P6/P7.

---

## Q9 — Copyright and Release Constraints (product layer, not technical layer)

- **Question**: The 50 gold-standard worlds in the atlas contain copyrighted IP (SPY×FAMILY, GoT, Harry Potter, etc.). Should the official product lean on "original worlds + public domain," or does it need an IP licensing process? Can the baseline test worlds (4 representation baselines) be publicly distributed?
- **Current lean**: Architecture is neutral (IP-world definitions can serve as internal baselines); the product layer releases within original / public-domain scope; the atlas `rightsStatus` field serves as a filter entry point.
- **Evidence needed**: Product positioning discussion (not answerable by experiment).
- **Blocked phase**: None (architecture unaffected).

---

## Q10 — Latency Budget (experience goal spanning P4–P7)

- **Question**: End-to-end latency target for parallel multi-agent decisions + salience + presentation planning? Can the sense of "waiting for the world to react" be eased with streaming output / partial presentation?
- **Current lean**: First establish a baseline of "one LLM call per turn + deterministic bookkeeping"; streamed narrative and parallel agents deferred to post-P4 optimization.
- **Evidence needed**: Measured latency of the P4 baseline; user tolerance for 3s / 5s / 10s latency (quick experiment).
- **Blocked phase**: P4 (baseline), optimization phase (post-P7).

---

## How to Use This File

- This file is **alive**: once an experiment / walkthrough yields an answer, move the conclusion into [`ARCHITECTURAL_DECISIONS.md`](./ARCHITECTURAL_DECISIONS.md) (revise or add an ADR).
- If a question lingers unresolved, it means a corresponding experiment is missing — go back to [`ARCHITECTURAL_EXPERIMENTS.md`](./ARCHITECTURAL_EXPERIMENTS.md) to add the experiment; don't stall with discussion.
