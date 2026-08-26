/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Primitives, Identity, Provenance & Meta Types
 * 
 * Core architectural principle:
 * "Describe what must be true for a world to behave like itself, not everything that can be said about it."
 */

export type UUID = string;

/**
 * Universal Entity Identifier Strategy:
 * Format: `<domain>:<namespace>:<local_id>` (e.g. `entity:spy_family:loid_forger`, `fact:got:cersei_secret_father`)
 * Supports canonical definitions, instances, historical forks, and original player characters.
 */
export type EntityId = string;
export type FactId = string;
export type RuleId = string;
export type ActionId = string;
export type RoleId = string;
export type LocationId = string;
export type OrganizationId = string;
export type EventId = string;
export type ScenarioId = string;
export type TimelineId = string;

/**
 * Provenance / Source of Truth:
 * Distinguishes hard author canon from AI inferences, simulations, and temporary observations.
 */
export type InformationProvenance = 
  | 'authored'     // Hard author canonical truth (Human Host or Source Canon)
  | 'derived'      // Deterministically derived from axioms or rules
  | 'observed'     // Direct sensory observation by an agent during simulation
  | 'inferred'     // AI hypothesis or epistemic deduction (not guaranteed ground truth)
  | 'simulated'    // Emergent result from dynamic state execution
  | 'temporary';   // Ephemeral situational condition

export interface ProvenanceMeta {
  source: InformationProvenance;
  authorId?: string;
  sourceConfidence?: number; // 0.0 - 1.0 (1.0 for hard authored canon)
  createdTurn?: number;
  timestamp?: string;
  historicalRationale?: string;
}

/**
 * Semantic Versioning for World Definition, Scenarios, and State
 */
export interface WorldVersion {
  schemaVersion: '1.0.0';
  definitionVersion: string; // e.g. "1.2.0"
  revision: number;
  lastUpdated: string;
}
