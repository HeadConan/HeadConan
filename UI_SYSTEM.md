# UI System & Semantic Component Registry — HeadConan

## 1. UI Block Schema

Each UI block rendered on the World Canvas follows a standardized schema:

```typescript
export interface UIBlock {
  id: string;
  type: UIBlockType;
  title: string;
  priority: 'primary' | 'secondary' | 'ephemeral';
  colSpan?: 1 | 2 | 3;
  dataRef?: string;
  customData?: any;
}
```

## 2. Supported UI Block Modalities

| Block Type | Semantic Purpose | Typical Scenarios |
|---|---|---|
| `dashboard` | High-level situational summary & overview | World entry, command central |
| `map` | Interactive SVG storytelling & spatial positioning | Political realms, campus grounds, wasteland sectors |
| `character` | Character roster, loyalty meters, interaction dialog | Royal courts, university cliques, suspect lineups |
| `timeline` | Temporal ticks and upcoming scheduled occurrences | Council meetings, class schedules, ticking threats |
| `document` | In-universe classified files, letters, memos | Intelligence reports, love letters, scientific logs |
| `stats` | Vital metrics, systemic equilibrium bars, trend indicators | Stability, Economy, Sanity, GPA, Morale |
| `relationship`| Inter-entity loyalty, friction, and alliance matrix | Court conspiracies, social networks |
| `event` | Critical urgent broadcasts and emergency decision points | Rebellions, sudden exams, anomaly outbreaks |
| `note` | User-authored tactical scratchpad & deductive memory | Player notes, suspicion lists |
| `chat` | Direct conversation stream with specific characters | Interrogations, private meetings, whispers |
