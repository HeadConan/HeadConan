# HeadConan First-Month Implementation Plan (MONTH_1_PLAN)

> Time window: 2026-08-31 ~ 2026-09-27 (pre-launch window: 08-27 ~ 08-30).
> Stages correspond to: the P0→P7 critical path of `IMPLEMENTATION_ROADMAP.md` + P8a in parallel.
> Sole objective: **deliver a complete experience loop for a baseline world (vertical slice)** — action → event kernel → cognitive asymmetry → salience → dynamic layout.

---

## 1. Monthly Goals and Exits

| Item | Content |
| :--- | :--- |
| Goal | Vertical slice: a baseline world (candidates: SPY×FAMILY / university) runs the complete loop |
| Exit criteria | ① player actions become events and take effect via the kernel; ② cognitive asymmetry is genuinely in effect (character switching changes visible content); ③ there is one autonomous NPC; ④ layout changes with focus; ⑤ refresh does not lose progress |
| Out of scope | semantic memory, multi-agent society, quest lines, vector store, cloud sync, authoring-tool productization, FLIP animation, world-specific UI |

## 2. Four-Week Structure

| Week | Theme | Stage | Exit verification (user-perceptible) |
| :--- | :--- | :--- | :--- |
| W1 8.31–9.6 | Experimentation + wiring | P0+P1 | After switching characters, interface content genuinely changes (player cannot see hidden agendas; host can) |
| W2 9.7–9.13 | Event kernel | P2 (+P8a in parallel) | Public accusation → those present are informed, those absent are not; consequences are rollbackable and replayable |
| W3 9.14–9.20 | Actions and agents | P3+P4 | NPC proactively advances; delayed event (email) appears; Loid/Yor are mutually unaware of each other's secrets |
| W4 9.21–9.27 | Experience and layout | P6+P7 subset+P5 subset | Map withdraws during interrogation; vertical slice demo is usable |

## 3. Daily Cadence (mandatory)

1. **One verifiable increment per day**: any change must be annotated with "user-perspective effect" + verification method; no verification means no work.
2. **If the day's experiment/task is unfinished, the first thing next day is to make it up; do not skip.**
3. **Weekend retrospective**: check against the exit verification; if not achieved, make it up early the following week.
4. Experiment conclusions are always written as assertions (green/red is decided by tests, not by impressions).

---

## 4. Today's Plan (2026-08-27, launch day)

> Nature: pre-launch — solidify the monthly plan, set up the experimental infrastructure, and run the first experiment, to pave the way for the official start on Monday.

| Time block | Task | User-perspective effect | Verification |
| :--- | :--- | :--- | :--- |
| 09:00–09:30 | Solidify `docs/MONTH_1_PLAN.md` (this file) | Monthly/weekly/daily plan is documented and traceable | File persisted; exit criteria complete |
| 09:30–11:00 | Experiment scaffolding: introduce test facilities (vitest or tsx assertion script, TBD) | Subsequent experiments/kernel regressions runnable with one command | Smoke test passes |
| 11:00–12:00 | Read through the GoT / SPY×FAMILY sample definitions; write the `instantiate(world, scenario)` primitive | E1 has runnable code | Interface signature determined and recorded |
| 14:00–16:00 | **Run E1 end-to-end**: three seeds (canon / divergence / player character) instance isolation | Obtain the E1 conclusion (holds / falsified) | All assertions green + conclusion written to EXPERIMENTS.md |
| 16:00–17:30 | **Launch E2** (time-boxed; if not completed, carry over to W1-D1): `public_accusation` rule + delayed consequence | E2 has preliminary results | Cascade is bounded + log is replayable |
| 17:30–18:00 | Retrospective: experiment results into `docs/EXPERIMENTS.md`; update working memory | Clear starting point for tomorrow | Experiment log updated |

### Today's Red Lines
- Do not write any production UI code; do not touch the `App.tsx` live path (that is the latter half of W1).
- E1/E2 depend only on `src/world/representation/*` and run independently.
- If an experiment conclusion is falsified → immediately record "which ADR to revise"; do not force through.

---

## 5. Pre-launch Window (8.27–8.30, flexible)

| Date | Content |
| :--- | :--- |
| 08-27 (today) | This plan + scaffolding + E1 |
| 08-28 (Fri) | E2 + E3 (cognitive asymmetry, highest-risk assumption) |
| 08-29~30 (weekend, optional) | E4–E6 or rest |

> If no weekend investment, then execute E2–E6 sequentially within W1 (each ≤1 day; W1 has sufficient capacity).

---

## 6. Daily Increment Checklist (template, copy at the start of each day)

- [ ] Today's goal (one sentence)
- [ ] Change list (each item with user-perspective effect)
- [ ] Verification result (assertion / demo)
- [ ] Experiment conclusion (holds / falsified + affected ADR)
- [ ] Starting point for tomorrow
