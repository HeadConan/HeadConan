# World Model Domain Ontology — HeadConan

## 1. Domain Types Overview

The internal world representation is strictly typed in TypeScript (`src/world/types.ts`):

- **`WorldState`**: Root entity containing world metadata, premise, atmosphere, and constituent collections.
- **`UserRole`**: Player identity, authority rank, active objectives, and personal capabilities.
- **`Character`**: Individuals with loyalty scores, faction alignment, status, portraits, and secret motives.
- **`Location`**: Spatial landmarks with coordinates, tactical significance, and alert status.
- **`Faction`**: Societal powers with influence ratings (0-100), diplomatic stance, and hidden agendas.
- **`Event`**: Active incidents, crisis alerts, reports, and whispers sorted by urgency.
- **`TimelineEvent`**: Sequential progression ticks providing a sense of persistent, moving time.
- **`StatMetric`**: Quantitative meters (e.g. Treasury, Stability, Morale, Stress) with trends.
- **`WorldDocument`**: Intelligence memos, classified files, diaries, letters, and intercepted broadcasts.
- **`UserNote`**: User-authored reflections, suspicions, and observations stored directly into the world memory.
