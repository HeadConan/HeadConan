/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: First-Class Relationship Model
 * 
 * Relationships are living structural bonds between entities, not merely flat strings.
 */

import { EntityId, ProvenanceMeta } from './primitives';

export type RelationshipKind = 
  | 'kinship'            // Family, sibling, parent-child, spouse
  | 'fealty'             // Lord/vassal, employer/employee, commander/subordinate
  | 'intimacy'           // Romantic love, mutual deep affection, deep camaraderie
  | 'rivalry'            // Professional, academic, ideological, or social competition
  | 'hostility'          // Active antagonism, sworn vendetta, blood feud
  | 'distrust'           // Guarded suspicion, watchful paranoia, ideological tension
  | 'alliance'           // Strategic pact, mutual non-aggression, cooperative contract
  | 'dependency'         // Financial, emotional, informational, or security reliance
  | 'mentorship'         // Senior advisor/apprentice, professor/student
  | 'investigative';     // Detective/suspect, surveillance/target

export interface RelationshipDefinition {
  id: string;
  sourceEntityId: EntityId;
  targetEntityId: EntityId;
  kind: RelationshipKind;
  isBidirectional: boolean;
  
  // Relational Dynamics
  affinity: number;      // -100 (Deadly Hatred) to +100 (Unconditional Devotion)
  trust: number;         // 0 (Complete Paranoia) to 100 (Total Vulnerability)
  powerBalance: number;  // -100 (Target completely dominates Source) to +100 (Source dominates Target)
  
  // Visibility & Concealment
  visibility: 'public' | 'institutional' | 'clandestine' | 'fictitious_cover';
  coverStory?: string;   // e.g. "Pretend to be a normal happily married suburban couple"
  
  narrativeDescription: string;
  provenance: ProvenanceMeta;
}

export interface DynamicRelationshipState {
  relationshipId: string;
  currentAffinity: number;
  currentTrust: number;
  currentPowerBalance: number;
  recentInteractionsSummary?: string;
  brokenPromisesCount: number;
}
