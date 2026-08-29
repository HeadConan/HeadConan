# ADR-002 — Core World Representation

- **Status:** Accepted (Architecture Zero)
- **Date:** 2026-08-29
- **Confidence:** HIGH

## Context

What is the *truth* of a world made of? Graph? Typed objects? Components? Facts?

## Problem

Choose the representation of world truth such that it is (a) complete for a simulator (unlike a knowledge graph, which is built for *incomplete* knowledge — Hogan et al. 2021), (b) cheap at HeadConan scale (10³–10⁴ entities), (c) declarative enough for authoring (Inform 7 lesson), (d) queryable for UI/authoring.

## Alternatives

1. **ECS** — components + systems. Rejected: ECS is a performance artifact (SoA/cache); its semantics are "informal and implementation-dependent" (Tasnim & Zhao). At HeadConan scale it adds machinery without meaning.
2. **Knowledge graph** — RDF-style triples + inference. Rejected for the *authoritative* world: KGs model incompleteness; a simulator is complete about its own world. KG-shaped stores belong only in belief/UI projections.
3. **Typed entities + relations + facts (property graph, in-memory)** — **(Accepted.)** Entities are typed objects with attributes; relations are typed, directed, stateful edges; facts are atomic truth-bearing propositions with a visibility label.

## Decision

World truth = **typed entities + typed relations + typed facts**, held in memory as a property graph with strict identity (`entity:world:id`), plus a `kind` tag per node. No component masks. No RDF inference engine.

```
Entity { id, kind (character|organization|location|object|resource|concept), attributes }
Relation { id, kind, source, target, dynamicState }        // stateful edge, can change
Fact { id, statement, visibilityLabel, provenance }        // atomic truth, immutable except visibility
```

## Reasoning

- Hogan et al. (2021): KGs are for incomplete, dynamic, large knowledge; simulation truth is complete — typed objects suffice.
- Inform 7: declarative relations make authoring scale; runtime dynamics are the hard part, so keep relations first-class but avoid natural-language parsing in the runtime.
- Storylet formalism (Kreminski & Wardrip-Fruin 2018): content gated by preconditions over state, with effects — requires a queryable state model, which typed entities + relations give cheaply.
- Scene-graph vs knowledge-graph term collision resolved by not using either name.

## Consequences

- Authoring schema = entities + relations + facts + rules + initial situation (see ADR-009/world authoring).
- UI and belief layers may *project* into KG-like structures, but never write back to truth.
- Identity is namespace-qualified; references are validated (no dangling ids).

## Rejected Alternatives

- ECS (performance artifact).
- KG as truth (built for incompleteness).
- Plain JSON blobs (no queryability, no referential integrity).

## Open Questions

- Whether `concept` (institutions, norms) is a distinct kind or sugar over organization+facts. Tentative: distinct kind for authoring ergonomics; LOW confidence.
