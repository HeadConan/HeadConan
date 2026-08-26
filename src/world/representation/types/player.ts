/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Player Possibility Space
 * 
 * Defines what a user can become and what they can meaningfully do within this universe.
 */

import { EntityId, RoleId } from './primitives';

export type InhabitationMode = 
  | 'canonical_character'  // Inhabit an existing canonical figure (e.g. Sherlock Holmes, Loid Forger, Ned Stark)
  | 'original_character'   // Inhabit a newly generated persona within the world's social fabric
  | 'archetypal_slot'      // Inhabit a systemic role (e.g. "Eden Academy Teacher", "Night's Watch Recruit")
  | 'directorial_host'     // High-agency narrative director steering world events
  | 'cosmic_architect';    // System-level modifier of world axioms and physical constants

export interface InhabitedRoleSlot {
  id: RoleId;
  title: string;
  name: string;
  inhabitationMode: InhabitationMode;
  associatedEntityId?: EntityId;
  socialPosition: string;
  
  // Agency Boundaries
  agencyLevel: 'character_ground' | 'institutional_command' | 'narrative_director' | 'ontological_architect';
  epistemicFogOfWar: 'strict_first_person' | 'faction_wide' | 'omniscient_narrator';
  
  // Action Space
  availableActionCategories: string[];
  suggestedPromptDirectives: string[];
  systemConstraints: string[]; // e.g. ["Must conceal assassin identity from family", "Cannot openly defy King without treason trial"]
  
  description: string;
}

export interface PlayerPossibilitySpace {
  availableRoles: InhabitedRoleSlot[];
  coreFantasyHook: string; // e.g. "Balance the tension of keeping a fake family alive while averting international war"
  primaryInteractionLoop: string;
  tabooOrForbiddenActions: string[];
}
