/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: World State (B. WHAT IS TRUE RIGHT NOW?)
 * 
 * Represents a living snapshot of reality at a specific temporal moment in simulation.
 */

import { EntityId, FactId, LocationId, ScenarioId, TimelineId } from './primitives';
import { DynamicRelationshipState } from './relationships';
import { SecretItem, RumorItem } from './information';
import { SimulationEvent } from './dynamics';

export interface EntityStateSnapshot {
  entityId: EntityId;
  currentLocationId: LocationId;
  currentActivity: string;
  emotionalState: string;
  reputationScore: number;
  physicalStatus: string;
  dynamicAttributes: Record<string, any>;
  inventoryObjectIds: string[];
}

export interface EpistemicStateInstance {
  entityKnownFacts: Record<EntityId, FactId[]>; // EntityId -> Array of known FactIds
  activeSecrets: SecretItem[];
  activeRumors: RumorItem[];
  publicExposedFactIds: FactId[];
}

export interface WorldClock {
  turnNumber: number;
  inUniverseTime: string; // e.g. "Year 298 AC, 3rd Moon", "1895-11-14 21:30 GMT", "Fall Semester, Week 7, Tuesday 14:00"
  elapsedSimulatedSeconds?: number;
}

export interface WorldStateInstance {
  instanceId: string;
  definitionId: string;
  scenarioId?: ScenarioId;
  timelineId: TimelineId;
  
  clock: WorldClock;
  currentSituationNarrative: string;
  
  // Dynamic Slices of State
  entityStates: Record<EntityId, EntityStateSnapshot>;
  relationshipStates: Record<string, DynamicRelationshipState>;
  epistemics: EpistemicStateInstance;
  
  // Resource Balances
  resourcePools: Record<string, number>;
  
  // History & Incidents
  recentEvents: SimulationEvent[];
  eventChronicleLog: SimulationEvent[];
}
