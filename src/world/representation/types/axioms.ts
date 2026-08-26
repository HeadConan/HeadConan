/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Axioms & Governing Invariants
 * 
 * Axioms describe what MUST remain true for the world to preserve its fundamental identity and rules.
 * 
 * Crucial Distinction:
 * - Immutable Rules (Laws of physics/magic that cannot be broken)
 * - Default Assumptions (Societal or institutional expectations that hold unless disrupted)
 * - Historical Facts (Past events that established current conditions)
 * - Current State (Mutable present snapshot)
 */

import { ProvenanceMeta, RuleId } from './primitives';

export type AxiomType = 
  | 'metaphysical_law'    // e.g. "Telepathy exists in rare experimental subjects", "FTL is impossible"
  | 'social_contract'     // e.g. "The Cold War between East and West is maintained through deniable espionage"
  | 'institutional_norm'  // e.g. "Tenure review requires unblemished peer-reviewed publications"
  | 'forensic_truth'      // e.g. "Every physical contact leaves a trace; no murder is without evidentiary artifact"
  | 'feudal_allegiance';  // e.g. "Power resides where men believe it resides; bloodlines dictate throne legitimacy"

export interface WorldAxiom {
  id: RuleId;
  statement: string;
  type: AxiomType;
  scope: 'universal' | 'regional' | 'institutional';
  isImmutable: boolean; // If true, even directorial player actions cannot violate it without breaking world coherence
  enforcementMechanism: 'natural_law' | 'social_retribution' | 'institutional_verdict' | 'narrative_gravity';
  violabilityConsequence?: string; // What happens if a player attempts to break it
  provenance: ProvenanceMeta;
}
