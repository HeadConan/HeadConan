# /site — README

This is the **public-facing website** for HeadConan.

It is a static, GitHub-Pages-compatible site that demonstrates HeadConan's product philosophy without misrepresenting its implementation.

> **One line:** a playful, interactive portal where you discover HeadConan by *using* it, not by reading about it.

---

## 1. What this website is

- A Neubrutalist, interactive **demo of the product** — not a marketing brochure.
- The centerpiece is a **deterministic SPY × FAMILY mini-scenario** you can actually play.
- A **perspective toggle** (PLAYER / HOST) demonstrates information asymmetry.
- A **comparison diagram** (CHATBOT vs HEADCONAN) demonstrates the core difference.
- A **world-specific UI switch** (SCHOOL / INVESTIGATION / EMPIRE) shows how interfaces differ per world.

## 2. What is simulated vs real

This is the most important section. **Nothing is fake-misrepresented.** Every word on the site matches what is actually there.

| Thing | Real? | Notes |
| :--- | :--- | :--- |
| World fragments (EDEN ACADEMY, 221B BAKER STREET, ...) | Decorative placeholders | They are not connected to any world engine. |
| "WHERE WOULD YOU GO?" desire buttons | **Real, deterministic UI** | Clicking reveals the interface needs for that desire. |
| WORLDS portal cards | **Real, deterministic UI** | Clicking ENTER scrolls to the demo. |
| SPY × FAMILY interactive demo | **Real, deterministic state machine** | Pure JS in `scripts/demo.js`. No AI, no backend, no API key. See [§5](#5-the-demo-state-machine). |
| Character posters (Yor / Loid / Anya / Bond) | **Procedural SVG** — bundled and always shown. **Optional licensed `.png`** — drop a file into `site/assets/worlds/spy-family/` and the PNG replaces the SVG automatically. See [§5.1](#51-image-asset-slots). |
| PLAYER / HOST perspective toggle | **Real, deterministic** | Hardcoded what the player knows vs what the host knows. |
| CHATBOT / HEADCONAN diagram | **Real, hardcoded** | Static content, not generated. |
| World-specific UI switch (SCHOOL / INVESTIGATION / EMPIRE) | **Real, deterministic mockup** | Pure CSS + HTML. Labeled "concept demo" so no one mistakes it for a real instance. |
| ENTER HEADCONAN / VIEW ON GITHUB CTAs | Real links | GitHub link points to `https://github.com/HeadConan/HeadConan`. |

What is **not** here:
- No real HeadConan runtime is running.
- No API calls. No AI model. No backend.
- No persistence beyond the demo's in-memory state (refresh resets it).
- No login. No analytics. No tracking.

## 3. How it works

The site is a single-page, no-framework static site:

```
site/
├── index.html          # semantic HTML, all sections
├── styles/
│   └── main.css        # Neubrutalist design system (no preprocessor)
├── scripts/
│   ├── main.js         # page interactions (door, gate, portals, perspective, notchat, worldui, asset-slot fallback)
│   └── demo.js         # SPY × FAMILY state machine
├── assets/
│   └── worlds/
│       └── spy-family/
│           ├── README.txt      # how to place licensed .png files
│           ├── yor.svg         # procedural poster (bundled fallback)
│           ├── loid.svg
│           ├── anya.svg
│           └── bond.svg
└── README.md
```

### 5.1 Image asset slots

Each character poster in the SPY × FAMILY demo follows a two-step fallback chain:

1. `<name>.png` in `assets/worlds/spy-family/` (optional — place your licensed or commissioned image here).
2. `<name>.svg` bundled with the site (always present, shows if the PNG isn't there).

The slot is wired in `scripts/main.js`:

```js
document.querySelectorAll('img[data-fallback]').forEach(function (img) {
  img.addEventListener('error', function () {
    if (img.src.indexOf(img.dataset.fallback) === -1) img.src = img.dataset.fallback;
  });
});
```

If you want to swap in licensed official art (you must own the rights to redistribute it), drop the PNG in the right folder — no code changes needed. Recommended aspect ratio for replacements: **4:5 portrait** (e.g. 800×1000). See `assets/worlds/spy-family/README.txt` for the full naming convention and copyright notice.

The bundled SVG posters are **stylized, procedural** — they draw on Neubrutalist visual language (hard borders, offset shadows, single-character accent color blocks) rather than copying any official artwork. They keep the site honest even before any third-party image is added.

### Neubrutalist design system

| Token | Value |
| :--- | :--- |
| Paper background | `#F4EFE6` (warm off-white) |
| Ink (borders, text) | `#16140F` (near-black, slightly warm) |
| Yellow accent | `#FFD839` |
| Red accent | `#FF4B33` |
| Blue accent | `#2B57FF` |
| Green accent | `#8CFF4D` |
| Border | `3px solid var(--ink)` |
| Shadow | `5px 5px 0 var(--ink)` |
| Radius | `0` (rectangular — hard edges only) |
| Display font | `Impact, 'Arial Black', 'Haettenschweiler', 'Franklin Gothic Bold'` |
| Body font | `system-ui, -apple-system, 'Segoe UI', Roboto, ...` |

No glass. No gradients. No blur. No floating translucent cards. Motion is restricted to **state changes** (button press offset, panel swap, fragment fade on enter).

### Accessibility

- Skip-link at the top.
- All interactive elements are real `<button>` / `<a>` (keyboard navigable, focusable).
- Visible `:focus-visible` outlines (3px solid ink + offset).
- `prefers-reduced-motion` disables all transitions, parallax, and feed animations.
- Color contrast meets WCAG AA (ink on paper, white on blue/red).
- The interactive demo is a single-column state machine — fully usable with keyboard.

### Responsive

Two breakpoints:
- `≤ 900px`: gate/portal/perspective/worldui columns collapse to single column.
- `≤ 560px`: hero buttons go full-width, type scales down, action buttons stack.

The door fragments hide entirely on reduced-motion preference (and also on `body.entered` to keep the scrolled-to section clean).

## 4. How to run it locally

The site is pure static. Three options:

### a) Open directly
Just open `site/index.html` in a browser. All paths are relative.

### b) Python one-liner
```bash
cd site
python -m http.server 8000
# then visit http://localhost:8000
```

### c) Any static server
```bash
cd site && npx serve .   # or any other static server
```

## 5. The demo state machine

The SPY × FAMILY mini-scenario lives in `scripts/demo.js` and is a **pure, deterministic, in-memory state machine**. There is no AI.

```
INITIAL ──[ask/tell/observe/leave]──> ACTIONS ──> render()
```

Five actions are defined:

| Action | Effect on state |
| :--- | :--- |
| `ASK YOR SOMETHING` | Yor emotion → `cover` (first time), then `cover` → `alert` over multiple asks. Yor gives a cover story. Loid's suspicion increments. |
| `TELL HER A SECRET` | The big one. Yor emotion → `alert`, Loid `knows her secret`, a red **WORLD EVENT — SECRET REVEALED** card appears, suspicion maxes out, trust drops to zero. |
| `OBSERVE` | Yor → `noticed`. Her calloused hands become a clue. Suspicion increments. |
| `LEAVE` | Yor emotion → `quiet`. Stage title changes to "THE ROOM IS EMPTY NOW." All actions except `RESET` are disabled. |
| `RESET` | Returns to `INITIAL`. |

Each action pushes a `WORLD EVENT FEED` entry with a deterministic timestamp and narrative line. The feed is the world's "memory" — what happened in this room.

### Knowledge asymmetry

The demo's perspective section is **hardcoded**: PLAYER sees a partial knowledge list (knows Yor works at City Hall; does *not* know Yor is Thorn Princess). HOST sees the full truth plus a 3×3 matrix of who-knows-what (Loid / Yor / Anya × Yor is Thorn / Loid is Twilight / Anya is telepath).

This is the real information asymmetry, but stated explicitly rather than computed — because no world engine is running here.

## 6. How to deploy to GitHub Pages

1. Push this repo to GitHub.
2. In **Settings → Pages**, set the source to `Deploy from a branch`.
3. Choose the branch that contains `/site`, and set the folder to `/site`.
4. Save. The site will be live at `https://<owner>.github.io/<repo>/`.

If you want the site served from `/site` as a subdirectory of the repo, no further setup is needed (all asset paths are relative).

If you want it served at the **root** of a project page (`https://<owner>.github.io/`), move the contents of `site/` into the repo root, or configure a GitHub Actions workflow.

### A note about GitHub Pages and trailing slashes

GitHub Pages serves `index.html` from directories. The CTAs link to `https://github.com/HeadConan/HeadConan` (the repo). No external resources are loaded — Google Fonts, CDNs, etc. are intentionally avoided so the site works fully offline once cached.

## 7. Known limitations

- The demo state is in-memory; refreshing resets it. (This is correct: the demo is deterministic and per-session.)
- No AI is running. This is intentional — the demo must not misrepresent the runtime.
- The CTA buttons point to the GitHub repository, not a hosted HeadConan instance (because no such instance exists yet).
- `prefers-reduced-motion` users see a static experience (fragments don't parallax, feed doesn't animate, stage panels don't pop in).
- Mobile parity has been verified via CSS; no dedicated mobile screenshots were captured during build (see `docs/SITE_DESIGN.md` for the responsive strategy).

## 8. What connects to the real HeadConan application

**Nothing in `/site` connects to `/src`.** They are deliberately independent:

- `/src` is the live research prototype (React + Vite + Express + Gemini/DeepSeek).
- `/site` is the public face — it tells the story and lets people feel the product philosophy without misrepresenting the runtime.

When the runtime matures enough to be linked, the **VIEW ON GITHUB** / **ENTER HEADCONAN** CTAs in `/site/index.html` can point at it. Until then, those buttons point at the repository and the footer explicitly says the runtime is an early research prototype.

## 9. Final self-review notes

The site was built and visually verified in a real Chromium (via `agent-browser`) at 1280×800. The complete page renders correctly; the demo state machine responds to interaction; the perspective, chatbot-comparison, and world-UI tabs all switch correctly.

`prefers-reduced-motion` is honored throughout.