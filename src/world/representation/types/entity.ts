/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Entity Models (Character, Agent, Organization, Location, Object, Resource)
 * 
 * Core Invariant:
 * Explicitly separate:
 * PERSONALITY, BELIEFS, GOALS, NEEDS, KNOWLEDGE, CAPABILITIES, SECRETS, ROLES, CURRENT STATE.
 * Do not collapse character into a single narrative prose blob.
 */

import { EntityId, FactId, LocationId, OrganizationId, ProvenanceMeta } from './primitives';
import { CoreEntityKind } from './ontology';
import { Belief } from './information';

export interface BaseEntity {
  id: EntityId;
  kind: CoreEntityKind;
  name: string;
  aliases?: string[];
  description: string;
  tags: string[];
  provenance: ProvenanceMeta;
  createdAtTurn: number;
}

export interface CharacterGoal {
  id: string;
  description: string;
  priority: 'survival' | 'primary' | 'secondary' | 'covert' | 'idealistic';
  targetEntityId?: EntityId;
  completionCriteria?: string;
  progressPercent: number; // 0 - 100
  isSecret: boolean;
}

export interface CharacterNeed {
  type: 'safety' | 'social_belonging' | 'status' | 'epistemic_truth' | 'autonomy' | 'purpose' | 'affection';
  urgency: number; // 0 - 100
  satisfactionStatus: 'deprived' | 'strained' | 'adequate' | 'fulfilled';
}

export interface CharacterPersonality {
  temperament: 'analytical' | 'impulsive' | 'stoic' | 'charismatic' | 'neurotic' | 'protective' | 'machiavellian' | 'volatile';
  moralAlignment: 'principled' | 'pragmatic' | 'loyalist' | 'self_serving' | 'destructive' | 'machiavellian';
  primaryValues: string[]; // e.g. ["Peace between East and West", "Family Security", "Scientific Rigor"]
  fatalFlaw?: string;      // e.g. "Over-calculates", "Terrified of emotional attachment", "Pride"
  socialMask?: string;     // Outwardly presented persona vs true inner nature
}

export interface CharacterEntity extends BaseEntity {
  kind: 'character';
  
  // 1. Social & Biological Identity
  canonStatus: 'canonical' | 'original' | 'alternate' | 'historical';
  archetypeRole: string; // e.g. "Undercover Master Spy", "Feudal Lord", "Consulting Detective", "Graduate Student"
  organizationIds: OrganizationId[];
  primaryLocationId: LocationId;

  // 2. Psychological & Behavioral Engine
  personality: CharacterPersonality;
  goals: CharacterGoal[];
  needs: CharacterNeed[];
  
  // 3. Epistemic State & Secrets
  knownFactIds: FactId[];
  beliefs: Belief[];
  secretFactIds: FactId[]; // Things this character knows that must remain hidden
  
  // 4. Capabilities & Permissions
  capabilities: string[]; // references to CapabilityDefinition.id
  socialPermissions: string[]; // e.g. ["enter:faculty_lounge", "order:Praetorian_arrest"]

  // 5. Dynamic Runtime State (Mutable during simulation)
  currentLocationId: LocationId;
  currentActivity: string;
  emotionalState: string; // e.g. "Guarded", "Hyper-vigilant", "Exhausted", "Triumphant"
  publicReputationScore: number; // 0 - 100
  physicalStatus: 'healthy' | 'fatigued' | 'injured' | 'incapacitated' | 'dead';
}

export interface AgentBehavior {
  isAutonomous: boolean;
  decisionModel: 'rule_based' | 'llm_agent' | 'deterministic_script' | 'player_inhabited';
  reactivityThreshold: 'passive' | 'responsive' | 'proactive' | 'volatile';
  riskTolerance: number; // 0.0 (safe) to 1.0 (reckless)
}

export interface OrganizationEntity extends BaseEntity {
  kind: 'organization';
  category: 'government' | 'clandestine_agency' | 'noble_house' | 'academic_institution' | 'guild' | 'corporation' | 'family';
  leaderEntityId?: EntityId;
  memberEntityIds: EntityId[];
  headquartersLocationId?: LocationId;
  resources: Record<string, number>; // e.g. { "budget": 85, "influence": 90, "military_strength": 60 }
  doctrineOrCharter: string;
  internalCohesionScore: number; // 0 - 100
  publicPrestigeScore: number; // 0 - 100
}

export interface LocationEntity extends BaseEntity {
  kind: 'location';
  type: 'residence' | 'office' | 'palace' | 'crime_scene' | 'campus_hall' | 'wilderness' | 'frontier' | 'public_square';
  controllingOrganizationId?: OrganizationId;
  accessibility: 'public' | 'restricted' | 'secret' | 'hazardous';
  containmentObjectIds?: EntityId[];
  residentEntityIds?: EntityId[];
  atmosphere: string;
  spatialAffordances: string[]; // e.g. ["listen_through_walls", "hide_evidence", "deliver_public_speech"]
}

export interface ObjectEntity extends BaseEntity {
  kind: 'object';
  type: 'document' | 'weapon' | 'evidence_clue' | 'device' | 'ledger' | 'relic';
  currentLocationId?: LocationId;
  holderEntityId?: EntityId;
  associatedFactIds?: FactId[];
  isTamperedOrForged?: boolean;
  physicalProperties?: Record<string, any>;
}

export interface ResourceEntity extends BaseEntity {
  kind: 'resource';
  resourceType: 'currency' | 'information_asset' | 'political_capital' | 'grain' | 'intellectual_property';
  quantity: number;
  unit: string;
  ownerEntityId?: EntityId;
  isFungible: boolean;
}
