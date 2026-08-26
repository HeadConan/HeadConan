/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Information Model & Epistemics
 * 
 * Fundamental Principle:
 * WORLD TRUTH != CHARACTER KNOWLEDGE != PLAYER KNOWLEDGE != PUBLIC INFORMATION
 */

import { EntityId, FactId, ProvenanceMeta } from './primitives';

export type FactVisibilityScope = 
  | 'universal_public'   // Common knowledge known to everyone in the setting
  | 'domain_public'      // Known to all members of a profession/institution (e.g. all doctors or all nobles)
  | 'restricted'         // Known only to specific organizations or role clearances
  | 'intimate'           // Known to a tiny inner circle (e.g. family secret)
  | 'singular_secret'    // Known only to one individual
  | 'cosmic_truth';      // Objective truth of the universe, currently known to nobody

export interface Fact {
  id: FactId;
  statement: string; // The canonical objective proposition
  subjectEntityId?: EntityId;
  relatedEntityIds?: EntityId[];
  domain: 'identity' | 'crime' | 'allegiance' | 'vulnerability' | 'historical_event' | 'systemic_law' | 'social_scandal';
  visibilityScope: FactVisibilityScope;
  provenance: ProvenanceMeta;
  falsifiability?: boolean; // Whether this fact can be proven false or verified with evidence
}

/**
 * An Agent's subjective belief or known fact.
 * Note: A belief may be TRUE (knowledge) or FALSE (misinformation/delusion).
 */
export interface Belief {
  id: string;
  statement: string;
  confidence: number; // 0.0 - 1.0 (subjective certainty)
  correspondingFactId?: FactId; // If grounded in an actual fact
  isFactuallyAccurate: boolean; // Computed by comparing with world truth
  sourceType: 'direct_observation' | 'testimony' | 'rumor' | 'inference' | 'indoctrination';
  sourceEntityId?: EntityId;
  emotionalCharge?: 'reassuring' | 'terrifying' | 'motivating' | 'neutral';
}

export interface SecretItem {
  id: string;
  factId: FactId;
  holdingEntityIds: EntityId[]; // Who knows this secret
  targetEntityIds: EntityId[];  // Who must NEVER find out
  consequencesIfExposed: string;
  exposureThreshold: number; // 0 - 100 risk meter
  camouflageStrategy?: string; // e.g. "Pose as a mild-mannered psychiatrist"
}

export interface RumorItem {
  id: string;
  content: string;
  plausibility: number; // 0.0 - 1.0
  isTrue: boolean;
  spreadRate: number; // how fast it circulates
  knownByEntityIds: EntityId[];
  originEntityId?: EntityId;
}

export interface EpistemicPerspective {
  observerEntityId?: EntityId; // undefined = Public Observer / Player Omniscient
  observerRoleTitle: string;
  knownFactIds: Set<FactId> | FactId[];
  beliefs: Belief[];
  activeSecrets: SecretItem[];
  knownRumors: RumorItem[];
  fogOfWarLocations: string[];
}
