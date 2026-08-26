export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type StanceType = 'supportive' | 'neutral' | 'hostile' | 'suspicious' | 'allied';
export type EventCategory = 'crisis' | 'report' | 'opportunity' | 'whisper' | 'system';
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
  summary: string;
  secretAgenda?: string;
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
}

export interface Faction {
  id: string;
  name: string;
  influence: number; // 0 - 100
  stance: StanceType;
  agenda: string;
  leader?: string;
}

export interface WorldEvent {
  id: string;
  timestamp: string;
  title: string;
  category: EventCategory;
  description: string;
  urgency: UrgencyLevel;
  relatedEntityId?: string;
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
  type: 'alliance' | 'rivalry' | 'distrust' | 'romance' | 'subordinate';
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

export interface UIBlock {
  id: string;
  type: UIBlockType;
  title: string;
  priority: 'primary' | 'secondary' | 'ephemeral';
  colSpan?: 1 | 2 | 3;
  dataRef?: string;
  customData?: any;
}

export interface WorldState {
  id: string;
  name: string;
  genre: string;
  premise: string;
  atmosphere: string;
  currentSituation: string;
  userRole: UserRole;
  characters: Character[];
  locations: WorldLocation[];
  factions: Faction[];
  events: WorldEvent[];
  timeline: TimelineEvent[];
  stats: StatMetric[];
  documents: WorldDocument[];
  relationships?: Relationship[];
  notes: UserNote[];
  createdAt: string;
  turnCount: number;
}

export interface UIPlanning {
  activeLayout: string;
  suggestedInteractions: string[];
  blocks: UIBlock[];
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
    }>;
    newEvents?: WorldEvent[];
    newTimelineItems?: TimelineEvent[];
    newDocuments?: WorldDocument[];
  };
  suggestedNextActions?: string[];
}
