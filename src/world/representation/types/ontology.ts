/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Ontology & Type Classification
 * 
 * Defines what categories of existence are recognized within a world.
 */

import { EntityId } from './primitives';

export type CoreEntityKind = 
  | 'character'     // Socially/behaviorally responsive individual
  | 'agent'         // Autonomous decision maker (AI or autonomous process)
  | 'organization'  // Structured group, institution, government, or faction
  | 'location'      // Spatial node or region with affordances
  | 'object'        // Physical artifact, clue, tool, or document
  | 'resource'      // Fungible or measurable asset (wealth, secrets, energy, food)
  | 'concept';      // Abstract social institution, law, religion, or ideology

export interface CapabilityDefinition {
  id: string;
  name: string;
  domain: 'physical' | 'social' | 'cognitive' | 'supernatural' | 'institutional' | 'forensic' | 'economic' | 'informational';
  description: string;
  prerequisites?: string[]; // e.g. ["requires:high_magic_affinity", "requires:noble_blood"]
  riskLevel?: 'none' | 'low' | 'high' | 'existential';
}

export interface PropertyDefinition {
  key: string;
  label: string;
  valueType: 'string' | 'number' | 'boolean' | 'enum' | 'entity_ref' | 'array';
  unit?: string;
  allowedValues?: string[];
  defaultValue?: any;
  isMutableBySimulation: boolean;
  description: string;
}
