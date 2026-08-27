import { RoleSlot, RoleType } from '../roles/model';
import { WorldStyle } from '../style/worldStyle';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type StanceType = 'supportive' | 'neutral' | 'hostile' | 'suspicious' | 'allied';
export type EventCategory = 'crisis' | 'report' | 'opportunity' | 'whisper' | 'system' | 'clue' | 'discovery';

export type UIBlockType = 
  | 'dashboard'
  | 'map'
  | 'character'
  | 'timeline'
  | 'document'
  | 'note'
  | 'stats'
  | 'relationship'
  | 'event'
  | 'location'
  | 'evidence-board'
  | 'director-console'
  | 'rule-engine'
  | 'gallery'
  | 'chat';

export interface UserRole {
  title: string;
  authority: string;
  objective: string;
  traits: string[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  faction?: string;
  status: string;
  loyalty: number; // 0 - 100
  avatar?: string;
  imageUrl?: string;
  summary: string;
  secretAgenda?: string;
  motive?: string;
  alibi?: string;
  suspicionLevel?: number; // for mysteries (0 - 100)
}

export interface LocationCoordinates {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface WorldLocation {
  id: string;
  name: string;
  type: string;
  status: string;
  significance: string;
  coordinates: LocationCoordinates;
  controllingFaction?: string;
  cluesFound?: string[];
  restricted?: boolean;
  imageUrl?: string;
}

export interface Faction {
  id: string;
  name: string;
  influence: number; // 0 - 100
  stance: StanceType;
  agenda: string;
  leader?: string;
  color?: string;
}

export interface WorldEvent {
  id: string;
  timestamp: string;
  title: string;
  category: EventCategory;
  description: string;
  urgency: UrgencyLevel;
  relatedEntityId?: string;
  imageUrl?: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  impact?: string;
}

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  max: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  description?: string;
}

export interface WorldDocument {
  id: string;
  title: string;
  classification: string;
  date: string;
  author: string;
  content: string;
  isRead?: boolean;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  type: 'alliance' | 'rivalry' | 'distrust' | 'romance' | 'subordinate' | 'suspect-connection';
  intensity: number; // 1-100
  description: string;
}

export interface UserNote {
  id: string;
  content: string;
  createdAt: string;
  category?: string;
  pinned?: boolean;
}

export interface ClueItem {
  id: string;
  title: string;
  category: 'physical' | 'testimony' | 'documentary' | 'environmental';
  description: string;
  significance: string;
  relatedSuspectId?: string;
  relatedLocationId?: string;
  status: 'unsolved' | 'connected' | 'refuted';
  connectedTo?: string[]; // IDs of related clues or suspects
  coordinates?: { x: number; y: number }; // For evidence corkboard layout
  imageUrl?: string;
}

export interface RuleAxiom {
  id: string;
  name: string;
  description: string;
  active: boolean;
  category: 'physics' | 'society' | 'constraint' | 'mystic';
}

export interface UIBlock {
  id: string;
  type: UIBlockType;
  title: string;
  priority: 'primary' | 'secondary' | 'ephemeral';
  colSpan?: 1 | 2 | 3;
  dataRef?: string;
  customData?: any;
  minAttentionRole?: RoleType[];
}

export interface WorldState {
  id: string;
  name: string;
  genre: string;
  premise: string;
  atmosphere: string;
  currentSituation: string;
  
  // Roles System
  roles: RoleSlot[];
  activeRoleId: string;

  // Legacy userRole fallback
  userRole: UserRole;

  // Domain Entities
  characters: Character[];
  locations: WorldLocation[];
  factions: Faction[];
  events: WorldEvent[];
  timeline: TimelineEvent[];
  stats: StatMetric[];
  documents: WorldDocument[];
  relationships?: Relationship[];
  clues?: ClueItem[];
  rules?: RuleAxiom[];
  notes: UserNote[];

  // World Interface Grammar
  style: WorldStyle;

  createdAt: string;
  turnCount: number;
}

export interface UIPlanning {
  activeLayout: string;
  suggestedInteractions: string[];
  blocks: UIBlock[];
}

export interface InterfaceState {
  activeRoleId: string;
  focusedEntityId?: string;
  selectedSurfaceFilter?: string;
  directorOverlayOpen: boolean;
  attentionBudgetUsage: number;
}

export interface DirectorialAction {
  id: string;
  type: 'spawn_event' | 'inject_clue' | 'modify_character' | 'alter_faction' | 'add_rule' | 'custom_prompt';
  title: string;
  description: string;
  payload: any;
}

export interface WorldInteractionResult {
  narrativeOutcome: string;
  stateChanges: {
    situationUpdate?: string;
    updatedStats?: Array<{
      id: string;
      delta?: number;
      newValue?: number;
      trend?: 'up' | 'down' | 'stable';
      reason?: string;
    }>;
    updatedFactions?: Array<{
      id: string;
      influenceDelta?: number;
      newInfluence?: number;
      stance?: StanceType;
      agenda?: string;
    }>;
    updatedCharacters?: Array<{
      id: string;
      loyaltyDelta?: number;
      newLoyalty?: number;
      status?: string;
      reaction?: string;
      suspicionDelta?: number;
    }>;
    newEvents?: WorldEvent[];
    newTimelineItems?: TimelineEvent[];
    newDocuments?: WorldDocument[];
    newClues?: ClueItem[];
    newRules?: RuleAxiom[];
  };
  suggestedNextActions?: string[];
}
