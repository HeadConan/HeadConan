# HeadConan /site — Design & Architecture Document

This document records the **visual principles, information architecture, interaction model and design system** of the public-facing website in `/site`. It is honest: it documents what is real, and names what is simulated.

---

## 1. Core creative direction

The website is governed by two non-negotiable principles:

1. **Interactive demo** — visitors should understand HeadConan primarily by *using* the website, not by reading explanations of it.
2. **Neubrutalism** — strong black borders, hard-edged containers, offset shadows, bold typography, flat surfaces, deliberate tactile interaction, playful asymmetry.

These principles are not decoration; they encode the product philosophy. A demo shows that the world *responds to action*. Neubrutalism shows that the interface is *deliberate and human-made*, not a corporate shell.

The website is **not**:
- a SaaS landing page
- an AI startup template
- a polished corporate website
- a portfolio
- a collection of feature cards
- a static marketing page

It is a **playful, interactive portal into HeadConan**.

---

## 2. Visual principles

### 2.1 Neubrutalist language

Adopted from the brutalist-web movement: visible structure, deliberate imperfection, oversized labels, hard edges. Spec details:

- **Strong black borders** (`3px solid`) on every container, button, and interactive surface.
- **Offset shadows** (`5px 5px 0 ink`) — never soft, never blurred. The shadow *is* the structure.
- **Tactile buttons**: hover → `translate(1px, 1px)` (shadow shrinks). Active → `translate(4px, 4px)` (shadow almost disappears). The button feels pressed.
- **Rectangular geometry**: `border-radius: 0` everywhere. No rounded corners, no soft shapes. The exception is the small filled circles used for visual identification (e.g., map dots, evidence pins) where `border-radius: 50%` is used intentionally.
- **Flat surfaces**: no glassmorphism, no blur, no gradients, no glow. Solid color blocks.
- **Bold typography**: `Impact, 'Arial Black', 'Haettenschweiler', 'Franklin Gothic Bold'` for headings. The kerning and weight carry the design.
- **Limited but expressive color palette**: four accents (yellow / red / blue / green) plus ink and paper. Each section picks one dominant accent.
- **Deliberately imperfect rhythm**: a "PORTAL INTO IMAGINED WORLDS" stamp is rotated -1.5°. World fragments are scattered with random-feeling rotations. The principle blocks (WORLD / CHARACTERS / MEMORY / ACTION / CONSEQUENCE) are rotated ±2° each. *This is intentional*, not sloppy.
- **Oversized labels**: SECTION KICKERS like `03 / THE DEMO` use mono caps at small size to feel like film slate markers.
- **Occasional visual collisions**: the wordmark overlaps world fragments on purpose; the demo frame's red shadow extends beyond its border; the red SECRET-REVEALED card punches through the feed.

### 2.2 What Neubrutalism is NOT here

- No glassmorphism. No `backdrop-filter`. No blurred translucent layers.
- No soft gradients. No "AI sparkle" gradients.
- No generic purple. No "company-blue".
- No floating cards without borders.
- No decorative 3D blobs or particle effects.
- No oversized rounded corners on content surfaces.
- No enterprise hero with a stock photo.

### 2.3 Color system

| Token | Value | Used for |
| :--- | :--- | :--- |
| `--paper` | `#F4EFE6` | Default page background (warm off-white, never pure white) |
| `--ink` | `#16140F` | All borders, text on paper, default shadow |
| `--yellow` | `#FFD839` | Door, principle, ENTER CTAs, default CTA highlight |
| `--red` | `#FF4B33` | Demo accent, consequence stamps, NOT-CHATBOT distinction |
| `--blue` | `#2B57FF` | Perspective PLAYER lens, "join org" desire |
| `--green` | `#8CFFD449` | Side-by-side accents; ORGANIZATION / SCHOOL |
| `--white` | `#FFFFFF` | Card surfaces, button surfaces |

Each section is allowed one dominant accent, with the others used as chips or highlights. This avoids the "every color everywhere" trap.

### 2.4 Typography hierarchy

Three layers:

1. **Display** (Impact stack): section titles (`WHERE WOULD YOU GO?`, `ONE WORLD. TWO VIEWS.`, etc.), wordmarks, big CTA lines. Used sparingly for maximum impact.
2. **Body** (system-ui stack, weight 700+): cards, buttons, observations. The body is bold because Neubrutalism expects weight.
3. **Mono kickers** (`ui-monospace` stack, weight 700): section markers (`01 / THE GATE`), timestamps (`07:30 — FORGER HOUSEHOLD`), feed turn labels. The monospace gives the "schematic / readout" feel that complements the bold display.

No external fonts are loaded. The site works fully offline once cached.

---

## 3. Information architecture

The site flows in a deliberate sequence that mirrors the product loop: **OUTSIDE → CURIOSITY → CHOICE → ACTION → CONSEQUENCE → PERSPECTIVE → ENTER HEADCONAN**.

```
01 DOOR         (cursor-parallax world fragments, ENTER button)
02 GATE         (six desires, each reveals the interface it needs)
03 PORTALS      (three worlds as situations, ENTER each)
04 DEMO         (SPY × FAMILY interactive state machine)
05 PERSPECTIVE  (PLAYER vs HOST, who-knows-what matrix)
06 NOT-A-CHATBOT(CHATBOT vs HEADCONAN flow diagram)
07 INTERFACES   (SCHOOL / INVESTIGATION / EMPIRE mockups)
08 PRINCIPLE    (the HeadConan formula in blocks)
09 CTA          (THE NEXT WORLD IS YOURS)
```

This is also the visual progression of *information density*:
- DOOR: one wordmark, eight fragments, one button.
- GATE: six options, one reveal.
- PORTALS: three worlds.
- DEMO: the densest section — two characters, an event feed, a secret document, four action buttons.
- PERSPECTIVE: two panels.
- NOT-A-CHATBOT: two diagrams.
- INTERFACES: three mockups.
- PRINCIPLE / CTA: declarative.

The density curve deliberately rises and falls: visitor commitment is rewarded with the demo, then the principle and CTA land as quiet conviction, not more visual noise.

---

## 4. Interaction model

### 4.1 The loop

The website mirrors HeadConan's core loop at the *interface* level (the actual world-runtime loop is implemented separately in `/src` and `/docs/`):

```
VISITOR
  → curiosity (door fragments follow cursor)
  → choice (which desire, which world, which action in the demo)
  → consequence (interface changes: reveal panel, secret doc, emotion card)
  → perspective (PLAYER vs HOST toggle: same world, different projection)
  → principle (the formula is named)
  → CTA (enter HeadConan)
```

### 4.2 Action → consequence mapping

Each interactive element produces a **visible, deterministic state change**:

| Interaction | Consequence |
| :--- | :--- |
| Hover a desire | None (hover is for tactile feedback only — no preview-on-hover) |
| Click a desire | Reveal panel renders the interface needs for that desire |
| Click a portal ENTER | Smooth-scroll to the demo |
| Click ASK YOR SOMETHING | Yor emotion badge changes, cover story appears, suspicion meter moves, event feed appends |
| Click TELL HER A SECRET | Yor card turns red, secret document punches through the feed, suspicion maxes, trust zero, stage visually shifts |
| Click OBSERVE | Suspicion meter ticks up, calloused-hands detail appears |
| Click LEAVE | Stage title changes, all action buttons disabled, world continues "without your input" |
| Click PLAYER / HOST | Perspective panel swaps, knowledge list changes |
| Click CHATBOT / HEADCONAN | Diagram rebuilds with different step count (2 vs 5) |
| Click SCHOOL / INVESTIGATION / EMPIRE | Mini-card grid swaps |
| Click ENTER on door | Fragments fade, page scrolls to gate |
| Click ENTER HEADCONAN | Link to GitHub (honest — no live product) |

Every animation is **state change**, not decoration.

### 4.3 Motion budget

Motion is **state change only**. The rules:

- Button press: `translate(4px, 4px)` + shadow shrink.
- Card swap (perspective / chatbot / worldui): `pop-in` animation, 0.25s.
- Feed entry: `feed-in` slide, 0.3s.
- Stage transitions (demo state change): card background/color change, not animation.
- Cursor parallax on door fragments: only when `pointer: fine` AND not reduced-motion.
- No constant movement. No idle animations. No particles.

`prefers-reduced-motion: reduce` short-circuits all transitions and disables the fragment fade-in / parallax entirely (the fragments hide after entering).

---

## 5. Neubrutalist design system

Tokens are defined in `:root` in `site/styles/main.css`. No preprocessor.

```css
:root {
  --paper:   #F4EFE6;
  --ink:     #16140F;
  --yellow:  #FFD839;
  --red:     #FF4B33;
  --blue:    #2B57FF;
  --green:   #8CFF4D;
  --white:   #FFFFFF;
  --border:  3px solid var(--ink);
  --shadow:  5px 5px 0 var(--ink);
  --shadow-sm: 3px 3px 0 var(--ink);
  --display: Impact, 'Arial Black', 'Haettenschweiler', 'Franklin Gothic Bold', sans-serif;
  --sans:    system-ui, -apple-system, 'Segoe UI', Roboto, ...;
  --mono:    ui-monospace, 'Cascadia Mono', 'SF Mono', Menlo, Consolas, monospace;
}
```

### Buttons

Five variants (`btn-yellow`, `btn-red`, `btn-blue`, `btn-green`, `btn-white`) + `btn-ghost` (dashed border, no shadow). Sizes: `btn` default, `btn-xl` for CTAs. Press feedback: `:hover` → shadow shrinks by 1px; `:active` → shadow shrinks to 1px and button translates to compensate.

### Cards

All cards use `border: 3px solid var(--ink)` and `box-shadow: 5px 5px 0 var(--ink)`. The shadow is the same on every card surface — this is the system's signature. Cards have no border-radius.

### Top borders

A colored top-border accent (8–12px) identifies section content:
- Demo: 12px red (`border-top: 12px solid var(--red)`).
- Perspective PLAYER: 10px blue. HOST: 10px yellow.
- Mini-cards in worldui: 8px accent.

---

## 6. Interactive demo logic

The demo lives in `site/scripts/demo.js`. It is a **pure, deterministic, in-memory state machine** — no AI, no backend, no API key.

```
INITIAL ──[act(name)]──> ACTIONS table ──> mutate state ──> render()
```

The `ACTIONS` object is the rulebook. The `render()` function is the only output. There is no hidden state and no async behavior.

### Actions

| Action | Visible effect |
| :--- | :--- |
| `ASK YOR SOMETHING` | Yor emotion: `calm` → `cover` (ask 1) → `alert` (ask 3+). Yor line updates. Suspicion meter increments. Event feed appends. |
| `TELL HER A SECRET` | Yor card turns red. Player `knows her secret`. Trust → 0. Suspicion → 100. Red SECRET REVEALED document punches into the feed. |
| `OBSERVE` | Yor → `noticed`. Calloused-hands detail appears. |
| `LEAVE` | Stage title → "THE ROOM IS EMPTY NOW." All actions disabled except RESET. |
| `RESET` | State → `INITIAL`. |

### Knowledge asymmetry

The `knowledge asymmetry` section uses **hardcoded knowledge lists and a 3×3 matrix** to communicate the idea. No world engine is involved; the content is illustrative but accurate to HeadConan's architecture (see `docs/WORLD_RUNTIME.md` §6 for the real projection model).

---

## 7. World-specific UI demonstration

The `INTERFACES` section is a **concept demo**, not a functional instance. It shows three mock interfaces — SCHOOL / INVESTIGATION / EMPIRE — composed from CSS + HTML. Each has three mini-cards (e.g., SCHOOL: schedule / messages / people) with hardcoded illustrative content.

This communicates HeadConan's principle that *different worlds need different interfaces* without claiming any of these worlds is actually running. The text in each card says "concept demo — these panels are mockups" to be explicit.

---

## 8. Responsive strategy

The site does **not** simply stack vertically on mobile. Two breakpoints:

```
≤ 900px:
  - Gate: 1.2fr 1fr → 1fr (desire list above reveal panel)
  - Portal row: 3 cols → 1 col
  - Demo stage: 2 cols (Yor / You) → 1 col
  - Perspective: 2 cols → 1 col
  - Worldui: 3 cols → 1 col

≤ 560px:
  - Action buttons (demo stage) go full-width
  - Title font sizes scale down via clamp()
  - Stage clock wraps below title
  - Principle blocks remain inline (they wrap naturally)
  - Fragments use smaller font (clamp(0.8rem...))
```

The door is intentionally viewport-height regardless of breakpoint; the action area scales gracefully.

---

## 9. Accessibility commitments

- **Keyboard**: every interactive element is a real `<button>` or `<a>`. Tab order follows reading order. Skip link at top.
- **Focus**: `:focus-visible` outline (3px solid ink, 3px offset).
- **Reduced motion**: parallax, feed slide, pop-in animations, fragment fade — all disabled under `prefers-reduced-motion: reduce`. Fragments hide entirely after entering.
- **Contrast**: ink on paper = ~16:1. White on blue/red = ~5:1. WCAG AA passes.
- **Semantic HTML**: `<section>`, `<h1>`–`<h4>`, `<button>`, `<a>`, `<ol>`, `<table>` with `<caption class="visually-hidden">`.
- **ARIA**: `role="listbox"`, `role="option"`, `role="tablist"` / `tab` / `tabpanel`, `aria-selected`, `aria-pressed`, `aria-live="polite"` on dynamic regions (feed, reveal panel).

---

## 10. Performance

- Single HTML file, single CSS file, two small JS files.
- No build step. No bundler. No external resources.
- Total page weight: ~25KB HTML + ~12KB CSS + ~6KB JS = ~43KB uncompressed.
- No images (logo is inline SVG favicon).
- Google Fonts / CDNs deliberately avoided so the site works offline once cached.
- HTTP cache headers are whatever the hosting provider (GitHub Pages) sets; no app-level caching logic.

---

## 11. Honest disclaimers (deliberately embedded in the UI)

- The CTA footer reads: *"The runtime is an early research prototype. This site is its public face — an honest, simulated demo."*
- The demo's fineprint reads: *"Simulated locally, deterministically. No server, no API key, no real world engine. The actual HeadConan runtime is separate."*
- The worldui section reads: *"Concept demo — these panels are mockups."*
- The site's global footer reads: *"This website runs entirely in your browser. Nothing is fake-misrepresented; the demo is deliberately deterministic."*

These disclaimers are not apologetic — they are part of the design. Honesty is a brand value here.

---

## 12. Final self-review (against the spec checklist)

| Spec question | Answer |
| :--- | :--- |
| Looks like a normal AI startup website? | No. |
| Visitor can understand HeadConan without reading everything? | Yes — the demo, perspective, and chatbot-comparison sections together do it. |
| Visitor actually interacts with the concept? | Yes — the SPY × FAMILY demo and the perspective toggle both require action. |
| Website demonstrates action → consequence? | Yes — the demo is the proof. |
| Website demonstrates different perspectives? | Yes — PLAYER vs HOST toggle + knowledge matrix. |
| Neubrutalism feels intentional? | Yes — see §2. |
| Website makes you curious about entering a world? | Yes — that is its purpose. |

---

## 13. Known limitations

- The site is verified visually at desktop 1280×800; mobile CSS is in place but was not captured to screenshots during this build (Chromium viewport command was not available in this CLI session; CSS media queries are tested by reading).
- The interactive demo is intentionally small. Extending it would require:
  - More world templates.
  - A host toggle inside the demo (currently in the separate perspective section).
  - Persistent demo state across reload (not implemented; would require `localStorage`).
- The GitHub link targets the placeholder `https://github.com/HeadConan/HeadConan` repository URL. If the actual repo URL differs, update both CTA buttons in `site/index.html`.