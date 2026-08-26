# WORLD INTERFACE GRAMMAR (CONSTITUTION OF PERCEPTION)

> **Insight**: *Different worlds should not merely contain different content. They should have different ways of being perceived and interacted with.*

A political empire, a university campus, and a locked-room murder mystery require fundamentally distinct visual and spatial languages. In HeadConan, this is encoded via **WorldStyle** and the **UI Director**.

---

## 1. The Six Dimensions of World Interface Grammar

```typescript
export interface WorldStyle {
  id: string;
  name: string;
  visualLanguage: VisualLanguageType;
  spatialArchetype: SpatialArchetype;
  primarySurfaceType: PrimarySurfaceType;
  informationHierarchy: InformationHierarchy;
  interactionGrammar: InteractionGrammar;
  narrativeGrammar: NarrativeGrammar;
  temporalGrammar: TemporalGrammar;
  typography: TypographyStyle;
  density: 'dense' | 'comfortable' | 'spacious';
  tokens: ColorTokens;
  attentionBudget: AttentionBudget;
}
```

### 1. Spatial Archetype & Primary Surface
* **Theater of Power (Political Empire)**: Centerpiece is the **Strategic Territory Map** with garrison movements, ministerial corridors, and executive decree consoles.
* **Social Campus Mosaic (Collegiate Life)**: Centerpiece is the **Social Sphere & Lab Network**, peer interaction feeds, and weekly deadline schedules.
* **Detective Corkboard (1928 Mystery)**: Centerpiece is the **Interactive Evidence Corkboard** with pushpins, red yarn links, and suspect alibi cards.

### 2. Information Hierarchy & Attention Budget
* Rather than flooding the user with endless dashboards, the **UI Director** enforces generative restraint:
  - Caps max simultaneous surfaces (typically 5–6).
  - Prioritizes high-urgency dispatches and active role affordances.
  - Subordinates secondary dossiers unless explicitly queried.

### 3. Interaction Grammar
* Changes command verbs, placeholder prompts, and affordance styles:
  - *Empire*: `"Issue Sovereign Decree"`
  - *University*: `"Send Message / Lab Action"`
  - *Mystery*: `"Examine Forensics / Interrogate"`
  - *Director*: `"Cast Directorial Intervention"`

### 4. Temporal & Narrative Grammar
* **Time**: Turns vs. Days vs. Ticking Murder Clock (Hours).
* **Dispatches**: Classified State Cable vs. Campus Buzz vs. Forensic Discovery.
* **Documents**: Imperial Intelligence Memoranda vs. Lab Theses vs. Coroner Autopsies.

---

## 2. World Style Presets

1. `style-empire` — **Imperial Statecraft & Bureaucracy** (Institutional, Serif/Sans, Obsidian & Indigo).
2. `style-university` — **Collegiate Life & Social Sphere** (Clean, Modern Sans, Emerald & Amber).
3. `style-mystery` — **Noir Investigation & Forensic Case** (Corkboard texture, Serif, Warm Sepia & Amber).
