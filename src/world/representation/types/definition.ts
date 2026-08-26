/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: World Definition (A. WHAT KIND OF WORLD IS THIS?)
 * 
 * Defines the immutable template and ground-truth structure of a universe before runtime simulation.
 */

import { WorldVersion } from './primitives';
import { CapabilityDefinition, PropertyDefinition } from './ontology';
import { WorldAxiom } from './axioms';
import { BaseEntity, CharacterEntity, OrganizationEntity, LocationEntity, ObjectEntity, ResourceEntity } from './entity';
import { RelationshipDefinition } from './relationships';
import { SocialNorm, LawOrStatute, SocialHierarchyLevel } from './social';
import { PowerRelation, InstitutionalPowerMatrix } from './power';
import { Fact } from './information';
import { WorldActionDefinition } from './dynamics';
import { PlayerPossibilitySpace } from './player';
import { ExperienceProfile } from './experience';

export interface WorldDefinition {
  id: string;
  name: string;
  tagline: string;
  premise: string;
  version: WorldVersion;
  
  // 1. Philosophical & Physical Axioms
  axioms: WorldAxiom[];
  
  // 2. Ontological Capabilities & Dynamic Properties
  capabilities: CapabilityDefinition[];
  customProperties?: PropertyDefinition[];
  
  // 3. Ground Truth Baseline Entities
  characters: CharacterEntity[];
  organizations: OrganizationEntity[];
  locations: LocationEntity[];
  objects: ObjectEntity[];
  resources: ResourceEntity[];
  
  // 4. Relational & Social Fabric
  relationships: RelationshipDefinition[];
  socialNorms: SocialNorm[];
  lawsAndStatutes: LawOrStatute[];
  hierarchyLevels?: SocialHierarchyLevel[];
  
  // 5. Power & Institutional Architecture
  powerRelations: PowerRelation[];
  institutionalMatrices?: InstitutionalPowerMatrix[];
  
  // 6. Objective Ground-Truth Facts & Initial Secrets
  groundTruthFacts: Fact[];
  
  // 7. Dynamic Action Rules & Mechanics
  actions: WorldActionDefinition[];
  
  // 8. Player Possibility Space
  possibilitySpace: PlayerPossibilitySpace;
  
  // 9. Experience & Presentation Signals
  experienceProfile: ExperienceProfile;
}
