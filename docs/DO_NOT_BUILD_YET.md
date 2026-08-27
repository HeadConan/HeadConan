# HeadConan DO NOT BUILD YET (next-version edition)

> Companion to `../docs/DO_NOT_BUILD_YET.md` (architecture layer, retained). This document is the **product-layer** deferral list — which tempting features would kill the next version.
> Criteria (build only if any one is met): **proven needed by real user behavior / proven a bottleneck by real data / the 10-minute experience already runs end-to-end completely.**

---

## 1. Must Defer (absolutely do NOT build within the next version)

| # | Deferred Item | Temptation | Why it can't be built (next version) | When to build |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Complex multi-agent society** | "NPCs have their own lives" | The core experience is "the player perceives NPCs taking action" — a single reactive NPC template demonstrates that; a full agent society (P4 in IMPLEMENTATION_ROADMAP) would devour the next version's budget | Only when "reactive NPCs feel lifeless" is proven by testing |
| 2 | **Full world editor** | Host is one of HeadConan's killer features | The 10-minute experience **only** needs the host to be able to "inspect + intervene," not full CRUD; CRUD is P9 and doesn't block validation | Only when the host feels the tools are insufficient |
| 3 | **Persistent world database** | "60+ candidate worlds are assets" | It's a discovery tool, not the core; the next version only needs one hand-written SPY×FAMILY | After multi-world switching becomes the dominant daily-active behavior |
| 4 | **Massive lore management** | Detail of IP worlds | Hand-writing a minimum of 10 characters + 4 locations is enough to run 10 minutes; anything beyond that exceeds the current product stage | When users start asking "for more worlds" |
| 5 | **Multi-user / multiplayer** | "Be spies together" | Would break the information-asymmetry core (what you don't know — why should others not know either); introduces extremely high sync cost | Re-evaluate after a single world is played simultaneously by 100+ users |
| 6 | **Complex economy system** | "Resource management is fun" | The spy family has mission pay; that's background, not the simulation goal | Only when users actively attempt resource games |
| 7 | **Advanced relationship-evolution simulation** | "They'll grow" | Explicit rules "+2/-5" are enough; psychological modeling is paper-level effort | Only when the core experience is tested as "emotionally thin" |
| 8 | **Full dialogue language (subtext / lie / mind-reading UI suite)** | "The irony of SPY×FAMILY" | A first-class `speech_act` with `intentTag/subtext` suffices; letting Anya "know but not say" in different scenes demonstrates irony, the irony UI is follow-up | When in-scene dialogue can already support Anya's perspective switching |
| 9 | **Cloud database / multi-device sync** | "Want to continue on phone" | localStorage satisfies "refresh doesn't lose"; sync introduces concurrent writers, breaking the "single world" | When refresh + exit can no longer retain state |
| 10 | **Plugin system** | "Open world extension" | No stable kernel contract yet; adding a shell is premature; and the next version has only one world | After the kernel interface has been stable for at least 2 iterations |
| 11 | **Dozens of UI components** | "One panel set per world" | Contradicts the fundamental claim "world is independent of interface"; 5 primitives + shared Blocks are enough | When some scene cannot be expressed with the existing stage |
| 12 | **World-specific hardcoded screens** | "Harry Potter interface" | Opposes ADR-12: the world declares "what modality matters," not which component | Never |
| 13 | **Full real-time image-generation integration** | "Every frame AI-generated" | VisualSynthesisStudio is already usable for "portrait / evidence" generation; integrating into the scene loop would add 5–10s latency, breaking the rhythm | When the scene rhythm is long enough (>30s/scene) to absorb the latency |
| 14 | **Complex realism (wound healing, weather, hunger)** | "Make the world real" | The 10-minute experience doesn't care about these; once introduced, all NPCs must implement them | When users report "this world feels like a dead thing" |
| 15 | **LLM directly designs UI** | "Let AI write the interface" | Already rejected by ADR-12; LLM outputting UI = uncontrollable + hard to test | Never |

---

## 2. Easily Misjudged "Deferrals"

| Misjudgment | Reality |
| :--- | :--- |
| "Memory system is foundational" | State + log are enough; memory is an optimization needed only at scale (see `OPEN_QUESTIONS.md` Q6) |
| "NPC autonomy is mandatory" | "Perceiving NPCs taking action" ≠ "NPC is a full agent"; a minimal reactive NPC (emotion + relationship → reaction template) suffices |
| "Persistent branching is foundational" | localStorage satisfies single-user; add branching when the user feels the need |
| "Need a library of dozens of components" | 5 primitives + shared Blocks; call the subset of the existing 11 Block types within a scene |
| "Must support LLM omniscience" | Host view = omniscient projection (`observerEntityId` empty), unrelated to the LLM |

---

## 3. What Happens If You Accidentally Start Building

| Mis-start | Risk |
| :--- | :--- |
| Build the world editor fully | Host tools exhaust resources, the **player-experience core** gets left unfinished |
| Multiple worlds in parallel | 6 shallow worlds in 6 months is far worse than 1 deep world in 1 month |
| Fully automatic NPCs | Reaction templates + simple rules suffice for the 10-minute experience; full automation introduces scheduling / priority / conflict-resolution problems |
| Cloud sync | Sync logic (OT/CRDT) would reshape the kernel contract; better to define the kernel first |
| Multi-user | Breaks the information-asymmetry core assumption — degrades into an ordinary multiplayer game |

---

## 4. Relationship to the Architecture-Layer DO_NOT_BUILD_YET

`../docs/DO_NOT_BUILD_YET.md` (architecture layer) defers: giant memory, multi-agent society engine, ontology reasoning engine, vector database, quest-line engine, production auth, plugin system, world-specific UI, custom ECS.

**This document (product layer)**: supplements deferrals from the product-experience angle — world database, lore, multi-user, economy, relationship evolution, full dialogue language, cloud sync.

**The two lists combined** = the true taboos of the next version.
