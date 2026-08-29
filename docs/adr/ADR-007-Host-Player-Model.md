# ADR-007 — Host / Player Model

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH

## Context

HeadConan has two fundamental perspectives: PLAYER (inhabits) and HOST (observes/modifies/orchestrates). How do they relate to the runtime without duplicating the application?

## Decision

Player and Host are **perspectives + permission scopes over one runtime**, not separate applications and not separate engines.

```
PLAYER = { perspective: first-person projection (ADR-005), permissions: ordinary actions, controller: human }
HOST   = { perspective: omniscient projection (visibility bypass), permissions: privileged events + definition edits, controller: human }
```

- **Perspective** = projection parameter (what you may see). Player sees its own projection; Host sees the omniscient projection of the *same* state.
- **Permissions** = what event types you may submit:
  - Ordinary: `action`, `speech_act`, ... (validated by rules).
  - Privileged: `intervention` ("I make this happen") — an event like any other, but with Host provenance and relaxed preconditions (still logged, still auditable).
  - Meta: `definition_change` ("I rewrite the rules of reality") — a versioned definition diff, applied as a meta-event.
- **Switching** is instantaneous: swap the active perspective + permission set; the world state does not move. No state loss, no reload.

## Reasoning

- One-kernel principle (ADR-004): if Host had a separate path, we'd have two truths and double the audit surface. Host events are ordinary events with provenance `host` and a wider permission envelope.
- "Make this happen" (privileged event) ≠ "rewrite the rules" (definition change) are **different event types** on the same log — but both are events: loggable, replayable, rollback-able.
- Cognitive science: SA support (Endsley) demands Host tools show *causality and deltas*, not just raw state — same projection contract as the player, just with wider access.

## Consequences

- Host never breaks replay: interventions and rule edits appear in the log like anything else.
- "Player becomes Host" is a session-level switch of `perspective + permissionSet`, not a navigation.
- The UI contract (ADR-009) exposes the same runtime API to both; Host UI simply renders the omniscient projection + privileged affordances.

## Rejected Alternatives

- Separate "Director mode" application (duplicated truth; the pre-Zero prototype's `[DIRECTOR INTERVENTION]` prefix hack).
- Host as pure UI overlay with no runtime semantics (no audit, no causality).

## Open Questions

- Should Host's omniscient projection hide *some* information (e.g., author notes vs simulation truth)? MEDIUM confidence: yes for meta-level, enforce via projection filters.
- Definition-change migration semantics (how live entities survive a rule edit). LOW confidence; see ADR-010.
