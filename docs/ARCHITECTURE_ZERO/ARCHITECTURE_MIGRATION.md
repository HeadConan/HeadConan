# HeadConan — Architecture Migration Map

> Maps the current repository to the Architecture Zero model (ARCHITECTURE.md).
> No code rewritten yet — this is a decision map. Priority: P0=blocker, P1=high, P2=medium, P3=low.

## Legend

- **KEEP** — works as-is (possibly move).
- **REFACTOR** — same responsibility, new shape.
- **MOVE** — relocate into a different layer.
- **DELETE** — obsolete / replaced.
- **UNKNOWN** — needs a decision.

---

## 1. Core runtime

| Current module | Current responsibility | Architectural problem | Proposed responsibility | Verdict | Priority |
|----------------|------------------------|------------------------|-------------------------|---------|----------|
| `src/world/runtime/kernel.ts` | P0 `applyEvent` (3 event types, 3/7 preconditions, inline rules) | Matches ADR-004 — good start; rules inline, preconditions partial | Kernel per ARCHITECTURE §8: full precondition set, storylet-shaped rules data-driven | REFACTOR | P0 |
| `src/world/runtime/resolver.ts` | Deterministic intent→candidate event | Correct shape (LLM-propose/validator); needs LLM proposal path | Intent interpretation per ADR-008 | REFACTOR | P0 |
| `src/world/runtime/instantiate.ts` | Definition+scenario→instance (synthesis + deep copy) | Correct; move into runtime core | World instantiation (ADR-002/006) | KEEP | P0 |
| `src/world/runtime/instantiate.test.ts` | E1 + P0 tests | Correct | Test suite for kernel | KEEP | P0 |
| `src/world/representation/**` | Typed world representation (definition/state/dynamics/player/information/relationships/power/experience) | Strong foundation; some concepts over-built (power matrices, institutional matrices) vs minimal primitives | Adopt as the typed truth layer; prune unused fields | REFACTOR | P0 |
| `src/world/representation/epistemics/projector.ts` | `projectEpistemicPerspective` | Correct — the only read path | Keep as projection API (ADR-005) | KEEP | P0 |
| `src/world/representation/dynamics/evaluator.ts` | Legacy action evaluator (2/7 preconditions) | Superseded by kernel | Fold into kernel validation | MOVE/DELETE | P0 |
| `src/world/representation/validation/validator.ts` | Definition sanity checks | Correct | Keep; extend for knowledge seeds | KEEP | P1 |
| `src/world/types.ts` (legacy `WorldState`) | Flat lore+UI blob (`colSpan` in domain) | Violates separation | DELETE (replaced by representation + scene) | DELETE | P0 |
| `src/world/engine.ts` | Keyword-matched procedural world synthesis | Fake synthesis | DELETE; replace with definition synthesis (LLM proposal + validate) | DELETE | P0 |
| `src/world/mutations.ts` | Scalar clamping reducer | No validation/causality | DELETE (kernel owns mutation) | DELETE | P0 |

## 2. AI layer

| Current module | Current responsibility | Problem | Proposed | Verdict | Priority |
|----------------|------------------------|---------|----------|---------|----------|
| `src/ai/client.ts` | Provider routing + fallback | Correct gateway; world JSON monolithic | Split: intent proposals, dialogue proposals, narration, definition synthesis (ADR-008) | REFACTOR | P1 |
| `src/ai/prompts.ts` | Monolithic world JSON prompts | Violates recorded-input determinism | Replace with typed proposal schemas | DELETE/REWRITE | P1 |
| `src/ai/imageService.ts` | Image generation | OK as service | Keep (authoring aid) | KEEP | P3 |
| `server.ts` | Express proxy (Gemini/DeepSeek/image) | Correct gateway; prompts need replacing | Keep gateway; adopt typed proposal endpoints | REFACTOR | P1 |

## 3. UI layer

| Current module | Responsibility | Problem | Proposed | Verdict | Priority |
|----------------|----------------|---------|----------|---------|----------|
| `src/app/App.tsx` | Orchestrates phase + world state | Owns mutable world directly | Runtime instance lives outside React; App = render of projections + action submission | REFACTOR | P1 |
| `src/interface/director.ts` | Rule-tree UI plan | No significance/focus; fixed blocks | Replace with scene/situation projection (ADR-009) | DELETE/REWRITE | P1 |
| `src/ui/renderer.tsx` | 3-column grid | SaaS dashboard pattern | Scene-driven composition over stable frame | DELETE/REWRITE | P1 |
| `src/ui/registry.ts` | Data-type→component registry | Useful capability set | Keep as the stable capability set (ADR-009) | KEEP | P1 |
| `src/ui/types.ts` | UIBlock types | `colSpan` etc. in UI types is fine (UI layer) | Keep; align with scene contract | REFACTOR | P2 |
| `src/components/blocks/**` | 11 semantic block renderers | Real renderers; used inside grid | Move under scene surfaces (dialogue/evidence/dossier/etc.) | MOVE | P2 |
| `src/components/layout/*` (Header/Sidebar/ActionDock) | Stable frame | Good per ADR-009 stable frame | Keep; ActionDock affordances from runtime `A` | KEEP | P1 |
| `src/components/world/*` (Notes/Chronicle/Genesis) | Supporting UI | Notes should link to entities; chronicle to log | Refactor to runtime-backed data | REFACTOR | P2 |
| `src/components/atlas/*`, `LayoutLab`, `VisualSynthesisStudio` | Catalog / lab / image studio | Useful authoring aids | Keep as tools outside core loop | KEEP | P3 |

## 4. Data

| Current module | Responsibility | Problem | Proposed | Verdict | Priority |
|----------------|----------------|---------|----------|---------|----------|
| `src/data/mockWorlds.ts` | Static seed worlds + `uiPlanning` | `uiPlanning` in world data violates separation | Delete `uiPlanning`; keep seeds as scenario baselines | REFACTOR | P1 |
| `src/data/worldAtlas.ts` | World catalog (400+, 50 golden, rights status) | Excellent discovery/testing asset | Keep for testing/benchmarks (respect rightsStatus) | KEEP | P3 |
| `src/styles/*`, `src/components/ui/*` | Light zinc design system | Real | Keep | KEEP | — |
| `src/world/p0/**` | P0 slice (SPY×FAMILY definition + tests) | Correct seed; superseded by full kernel | Keep as first test world definition + scenario | KEEP | P0 |

## 5. Docs

| Doc | Status |
|-----|--------|
| `docs/ARCHITECTURE_ZERO/**` (this set) | NEW — the convergence target |
| `docs/adr/ADR-001..010` | NEW — decisions with evidence |
| Root `ARCHITECTURE.md`, `docs/ARCHITECTURAL_*`, `docs/WORLD_RUNTIME.md`, etc. | Superseded — keep as historical evidence; do not maintain in parallel (avoid two truths). Migrate key content into ARCHITECTURE_ZERO as needed. |
| `site/**` | Independent public demo (no runtime dependency) — keep, honest about being simulated |

## 6. Migration order (dependency)

```
P0 (kernel + typed truth + projection + P0 slice world)  ← the vertical slice already proven
  → P1 (LLM proposal APIs; App runtime detachment; scene-driven UI)
  → P2 (blocks under scenes; world/chronicle runtime-backed)
  → P3 (atlas as benchmark; image studio; authoring aids)
```

Rule: do not delete/refactor a module until its replacement exists and is tested (each change carries a user-visible verification — see MONTH_1_PLAN discipline).
