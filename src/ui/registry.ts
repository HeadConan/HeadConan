import { UIBlockDescriptor } from './types';
import { MapBlock } from '../components/blocks/MapBlock';
import { CharacterBlock } from '../components/blocks/CharacterBlock';
import { StatsBlock } from '../components/blocks/StatsBlock';
import { DocumentBlock } from '../components/blocks/DocumentBlock';
import { TimelineBlock } from '../components/blocks/TimelineBlock';
import { EventBlock } from '../components/blocks/EventBlock';
import { NoteBlock } from '../components/blocks/NoteBlock';
import { RelationshipBlock } from '../components/blocks/RelationshipBlock';
import { DashboardBlock } from '../components/blocks/DashboardBlock';
import { EvidenceBoardBlock } from '../components/blocks/EvidenceBoardBlock';
import { DirectorConsoleBlock } from '../components/blocks/DirectorConsoleBlock';

export const UI_CAPABILITY_REGISTRY: Record<string, UIBlockDescriptor> = {
  'evidence-board': {
    type: 'evidence-board',
    name: 'Investigation & Evidence Corkboard',
    description: 'Interactive evidence corkboard with pinned forensic clues, suspect ties, and thread analysis.',
    whatItRepresents: 'Forensic reality, criminal deductions, and investigative progress.',
    whenUsed: 'When mystery, crime scene forensics, or detective work is the primary focus.',
    requiredData: ['clues', 'characters'],
    component: EvidenceBoardBlock
  },
  'director-console': {
    type: 'director-console',
    name: 'World Director & Ontological Console',
    description: 'Directorial interface for spawning emergent crises, altering faction stances, and modifying world axioms.',
    whatItRepresents: 'Directorial and system-level agency over world simulation.',
    whenUsed: 'When user assumes Host, Director, or Architect agency.',
    requiredData: ['factions'],
    component: DirectorConsoleBlock
  },
  map: {
    type: 'map',
    name: 'Tactical & Spatial Map',
    description: 'Interactive SVG geographic and architectural layout showing coordinates, faction control, and route links.',
    whatItRepresents: 'Spatial structure and physical reality of the imagined world.',
    whenUsed: 'When geography, territories, travel, defense, or spatial reconnaissance are relevant.',
    requiredData: ['locations', 'factions'],
    component: MapBlock
  },
  character: {
    type: 'character',
    name: 'Character & Cabinet Dossiers',
    description: 'Roster of key figures with loyalty indexes, faction ties, and direct interaction channels.',
    whatItRepresents: 'Entities, social power brokers, and interpersonal agents.',
    whenUsed: 'When social dynamics, loyalty, intrigue, and negotiations drive the narrative.',
    requiredData: ['characters'],
    component: CharacterBlock
  },
  stats: {
    type: 'stats',
    name: 'System Indicators & Vitals',
    description: 'Quantitative meters, equilibrium bars, and trends representing macro stability.',
    whatItRepresents: 'World state and structural health.',
    whenUsed: 'When resource management, systemic health, economy, or tension metrics matter.',
    requiredData: ['stats'],
    component: StatsBlock
  },
  document: {
    type: 'document',
    name: 'Classified Files & Letters',
    description: 'In-universe classified intelligence memos, letters, decrypted telegrams, and thesis drafts.',
    whatItRepresents: 'Artifacts, evidentiary records, and lore transmission.',
    whenUsed: 'When mystery, secrets, leaked memos, or historical logs emerge.',
    requiredData: ['documents'],
    component: DocumentBlock
  },
  timeline: {
    type: 'timeline',
    name: 'Chronology & Schedule',
    description: 'Temporal sequence of completed, active, and upcoming events.',
    whatItRepresents: 'Temporal structure and persistent progression.',
    whenUsed: 'When deadlines, chronological meetings, and ticking clocks govern reality.',
    requiredData: ['timeline'],
    component: TimelineBlock
  },
  event: {
    type: 'event',
    name: 'Urgent Dispatches & Alerts',
    description: 'Live emergency feed of crisis alerts, rumors, and incoming telegrams.',
    whatItRepresents: 'Emergent real-time occurrences.',
    whenUsed: 'When crises, sudden developments, and time-critical opportunities arise.',
    requiredData: ['events'],
    component: EventBlock
  },
  note: {
    type: 'note',
    name: 'Personal Deductions & Scratchpad',
    description: 'User-created notes and memory reflections that anchor subsequent simulations.',
    whatItRepresents: 'Memory, interpretation, and user deductive cognition.',
    whenUsed: 'To allow the player to externalize suspicions and formulate theories.',
    requiredData: ['notes'],
    component: NoteBlock
  },
  relationship: {
    type: 'relationship',
    name: 'Interpersonal Dynamics Matrix',
    description: 'Relational friction, alliances, distrust, and romantic links between figures.',
    whatItRepresents: 'Societal and psychological networks.',
    whenUsed: 'When multi-party court politics or collegiate friendships collide.',
    requiredData: ['relationships', 'characters'],
    component: RelationshipBlock
  },
  dashboard: {
    type: 'dashboard',
    name: 'World Overview & Authority Console',
    description: 'High-level atmosphere, executive authority mandate, and active situational summary.',
    whatItRepresents: 'Macro world identity and player presence.',
    whenUsed: 'Always relevant as command hub.',
    requiredData: ['premise', 'userRole'],
    component: DashboardBlock
  }
};
