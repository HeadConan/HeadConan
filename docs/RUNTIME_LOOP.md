# HeadConan Runtime Loop (RUNTIME_LOOP)

> Answers: how does the world "take a step"? Why the dual cadence? Why were the alternatives rejected?

---

## 1. Conclusion: Dual-Cadence, Single Kernel

- **One kernel** (sole writer): `applyEvent(state, def, event) → { nextState, spawnedEvents, observations, rejected? }`.
- **Two cadences**:
  1. **User cycle** (reactive): user intent → event → kernel → drain → presentation.
  2. **World tick** (autonomous): agent perceives → decides → acts (can advance independently of user input, triggered by the scheduler).

Both share the kernel; they differ only in "who produces the candidate event" and "how many times it advances".

---

## 2. User Cycle — Detailed Steps

```
① Capture user intent
   text/click/drag (multimodal goal)
        │
② Intent parsing (LLM-assisted + deterministic correction)
   free text → { verb, target (entity resolution), payload, context }
   failure → clarification feedback (no event produced)
        │
③ Construct candidate event (action → event)
   intent → CandidateEvent (validate character permission, action category availability)
        │
④ Kernel application (sole write)
   precondition validation → effect → observation derivation → consequence queueing → log append
   rejected → rejection reason goes to experience layer ("because you weren't present" is also an experience)
        │
⑤ Drain scheduling queue (bounded)
   process delayed events triggered this round until the queue stabilizes or the budget is hit (prevent cascade explosion)
        │
⑥ Cognition side-effects settle
   observations written back to entityKnownFacts / beliefs / rumors
        │
⑦ Compute salience (experience service)
   event delta + projected view + ExperienceProfile → ExperienceState
   (what changed / what is urgent / what is dramatic / what is uncertain)
        │
⑧ Project observer view
   projectEpistemicPerspective(state, activeRole)
        │
⑨ Generate presentation plan
   focus object + stage mode + satellite content + ambient metrics + suggested lexemes + tone
        │
⑩ Layout engine renders (FLIP transition)
        │
⑪ Wait for next user input
```

**Budget discipline**: ⑤ must have an upper bound (e.g. at most 8 chained events per turn + at most 3 levels of depth), otherwise "I publicly accuse the minister" would cascade infinitely.

---

## 3. World Tick — Autonomous Advancement

When it happens:

| Trigger | Example |
| :--- | :--- |
| Scheduler trigger | Countdown expires, deadline, pre-arranged schedule (professor sends email in 2 hours) |
| Routine advancement | Campus world every morning: NPCs attend class, cafeteria encounters |
| Agent initiative | High-initiative NPC advances its own goals while the user is silent |
| Consequence reflux | Events queued in the previous turn come due |

```
tick(state, def, budget):
  for i in budget:
    stimulus = scheduling_queue.next() ∪ initiative_agent_proposals
    if no stimulus: break
    event = agent.perceive(projection) → decide() → candidate event
    state = applyEvent(...)
  user cycle resumes (if user online: present the salient changes produced by the tick)
```

**Key point**: the world tick also goes through the same kernel, the same log, the same salience computation. **The world can continue while the player is offline, but when online, the tick results must be able to "pick the important ones" for presentation** — this is the purpose of the salience layer's existence.

---

## 4. Alternative Model Analysis (why rejected)

| Model | What it is | Advantage | Fatal flaw |
| :--- | :--- | :--- | :--- |
| **Pure event-driven** (only event→handler) | Events dispatched to handlers | Loose coupling | ① No determinism for "who goes first"; ② handlers implicitly mutate state, hard to replay; ③ no unified candidate-event validation entry point |
| **Pure actor/message passing** | Entities message each other, each autonomous | Intuitive | ① Non-deterministic ordering, unreliable branching/replay; ② debugging and testing difficult; ③ needs a message bus, over-engineering |
| **Single-loop state machine** (user action→transition) | One step transition per user input | Simple | ① cannot express autonomous world (NPCs don't move); ② cannot express delayed consequences; ③ everything user-driven, distorts campus/conspiracy worlds |
| **Dual-cadence single kernel (adopted)** | User cycle + world tick sharing a reducer kernel | ① separates deterministic bookkeeping from non-deterministic decisions; ② replayable/branchable/testable; ③ unified player/Host/agent; ④ supports autonomous world | Needs a clear scheduler and budget control (already incorporated into the design) |

> In one sentence: **event-driven is "who notifies whom", actor is "who drives whom", the reducer kernel is "how the world changes". Of the three, only the reducer kernel can bear the "sole truth writer"; events and actors are merely its producers.**

---

## 5. Loop Boundary Conditions and Invariants

1. **No state writes outside the kernel.** No subsystem (including the AI gateway and presentation layer) may directly modify state.
2. **Events are immutable.** Correction = a new event.
3. **Rejection is an event.** Precondition unmet → rejection record enters the log → experience layer can present "attempt failed".
4. **Drain is bounded.** Prevents cascade explosion (budget configured in the definition or runtime config).
5. **Projection executed before presentation.** Any data an UI/LLM receives first passes through the cognition projection.
6. **Deterministic bookkeeping**: given the same log prefix, replay yields the same state (non-determinism in agent decisions only affects the "future log", not the "already happened").
