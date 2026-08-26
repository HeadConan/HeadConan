/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: World Dynamics & Causality Engine Models
 * 
 * ACTION → PRECONDITIONS → DIRECT EFFECTS → EMERGENT CONSEQUENCES
 */

import { ActionId, EntityId, EventId, LocationId } from './primitives';

export interface ActionPrecondition {
  type: 
    | 'requires_location'         // Actor must be in a specific location
    | 'requires_co_presence'      // Actor must be co-located with target
    | 'requires_capability'       // Actor must possess a specific capability
    | 'requires_knowledge'        // Actor must know a specific fact
    | 'requires_resource'         // Actor or org must hold minimum resource
    | 'requires_authority'        // Actor must possess social permission
    | 'requires_min_trust';       // Relationship must meet minimum trust
  targetKey: string;
  expectedValue: any;
  failureMessage: string;
}

export interface StateEffect {
  targetDomain: 'entity' | 'relationship' | 'epistemic' | 'resource' | 'social_norm' | 'location';
  targetId: string;
  mutationType: 'set' | 'increment' | 'decrement' | 'reveal_fact' | 'create_entity' | 'modify_status';
  fieldKey: string;
  payload: any;
  narrativeDescription: string;
}

export interface EmergentConsequence {
  triggerProbability: number; // 0.0 - 1.0
  conditionDescription: string;
  consequenceSummary: string;
  secondaryEffects: StateEffect[];
  spawnEvent?: {
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface WorldActionDefinition {
  id: ActionId;
  name: string;
  category: 'social' | 'covert' | 'political' | 'forensic' | 'academic' | 'physical' | 'directorial';
  description: string;
  actorEligibilityRoles: string[]; // e.g. ["Detective", "Noble", "Spy", "Student"]
  preconditions: ActionPrecondition[];
  directEffects: StateEffect[];
  potentialConsequences: EmergentConsequence[];
}

export interface SimulationEvent {
  id: EventId;
  turnOccurred: number;
  timestampStr: string;
  title: string;
  category: 'crisis' | 'discovery' | 'social_shift' | 'political_turn' | 'crime' | 'academic_milestone';
  description: string;
  initiatorEntityId?: EntityId;
  affectedEntityIds: EntityId[];
  locationId?: LocationId;
  publicKnowledgeLevel: 'universal' | 'witnesses_only' | 'covert';
}
