/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: World Validator & Sanity Checker
 * 
 * Inspects a WorldDefinition and WorldStateInstance for structural coherence,
 * broken references, missing invariants, and invalid role bindings.
 */

import { WorldDefinition } from '../types/definition';
import { WorldStateInstance } from '../types/state';

export interface DiagnosticIssue {
  severity: 'error' | 'warning' | 'info';
  code: string;
  domain: 'entity' | 'relationship' | 'fact' | 'axiom' | 'action' | 'role' | 'power' | 'social';
  message: string;
  contextEntityId?: string;
}

export interface ValidationReport {
  isValid: boolean;
  worldId: string;
  worldName: string;
  checkedAt: string;
  summary: {
    totalEntities: number;
    totalFacts: number;
    totalRelationships: number;
    totalAxioms: number;
    totalActions: number;
    totalRoles: number;
    errorsCount: number;
    warningsCount: number;
    infoCount: number;
  };
  issues: DiagnosticIssue[];
}

export function validateWorldDefinition(world: WorldDefinition): ValidationReport {
  const issues: DiagnosticIssue[] = [];
  
  const entityIdMap = new Map<string, string>(); // id -> kind
  const factIdSet = new Set<string>();
  const locationIdSet = new Set<string>();
  const orgIdSet = new Set<string>();
  const roleIdSet = new Set<string>();
  const axiomIdSet = new Set<string>();

  // 1. Index and check Entities for duplicates
  const allEntities = [
    ...world.characters,
    ...world.organizations,
    ...world.locations,
    ...world.objects,
    ...world.resources
  ];

  for (const entity of allEntities) {
    if (!entity.id || entity.id.trim() === '') {
      issues.push({
        severity: 'error',
        code: 'MISSING_ENTITY_ID',
        domain: 'entity',
        message: `Entity with name "${entity.name}" is missing an ID.`
      });
      continue;
    }

    if (entityIdMap.has(entity.id)) {
      issues.push({
        severity: 'error',
        code: 'DUPLICATE_ENTITY_ID',
        domain: 'entity',
        message: `Duplicate Entity ID detected: "${entity.id}".`,
        contextEntityId: entity.id
      });
    } else {
      entityIdMap.set(entity.id, entity.kind);
    }

    if (entity.kind === 'location') {
      locationIdSet.add(entity.id);
    } else if (entity.kind === 'organization') {
      orgIdSet.add(entity.id);
    }
  }

  // 2. Index Facts
  for (const fact of world.groundTruthFacts) {
    if (factIdSet.has(fact.id)) {
      issues.push({
        severity: 'error',
        code: 'DUPLICATE_FACT_ID',
        domain: 'fact',
        message: `Duplicate Fact ID detected: "${fact.id}".`
      });
    } else {
      factIdSet.add(fact.id);
    }

    if (fact.subjectEntityId && !entityIdMap.has(fact.subjectEntityId)) {
      issues.push({
        severity: 'warning',
        code: 'DANGLING_FACT_SUBJECT',
        domain: 'fact',
        message: `Fact "${fact.id}" references non-existent subject entity "${fact.subjectEntityId}".`
      });
    }
  }

  // 3. Index Axioms
  for (const axiom of world.axioms) {
    if (axiomIdSet.has(axiom.id)) {
      issues.push({
        severity: 'error',
        code: 'DUPLICATE_AXIOM_ID',
        domain: 'axiom',
        message: `Duplicate Axiom ID detected: "${axiom.id}".`
      });
    } else {
      axiomIdSet.add(axiom.id);
    }
  }

  // 4. Validate Character References
  for (const char of world.characters) {
    if (char.primaryLocationId && !locationIdSet.has(char.primaryLocationId)) {
      issues.push({
        severity: 'warning',
        code: 'INVALID_PRIMARY_LOCATION',
        domain: 'entity',
        message: `Character "${char.name}" (${char.id}) references missing primary location "${char.primaryLocationId}".`,
        contextEntityId: char.id
      });
    }

    for (const orgId of char.organizationIds) {
      if (!orgIdSet.has(orgId)) {
        issues.push({
          severity: 'warning',
          code: 'INVALID_CHARACTER_ORG',
          domain: 'entity',
          message: `Character "${char.name}" belongs to non-existent organization "${orgId}".`,
          contextEntityId: char.id
        });
      }
    }

    for (const factId of char.knownFactIds) {
      if (!factIdSet.has(factId)) {
        issues.push({
          severity: 'warning',
          code: 'INVALID_KNOWN_FACT',
          domain: 'fact',
          message: `Character "${char.name}" has knownFactId "${factId}" which does not exist in groundTruthFacts.`,
          contextEntityId: char.id
        });
      }
    }
  }

  // 5. Validate Relationships
  const checkedPairs = new Set<string>();
  for (const rel of world.relationships) {
    if (!entityIdMap.has(rel.sourceEntityId)) {
      issues.push({
        severity: 'error',
        code: 'DANGLING_RELATIONSHIP_SOURCE',
        domain: 'relationship',
        message: `Relationship "${rel.id}" references missing source entity "${rel.sourceEntityId}".`
      });
    }

    if (!entityIdMap.has(rel.targetEntityId)) {
      issues.push({
        severity: 'error',
        code: 'DANGLING_RELATIONSHIP_TARGET',
        domain: 'relationship',
        message: `Relationship "${rel.id}" references missing target entity "${rel.targetEntityId}".`
      });
    }

    if (rel.sourceEntityId === rel.targetEntityId) {
      issues.push({
        severity: 'warning',
        code: 'SELF_REFERENTIAL_RELATIONSHIP',
        domain: 'relationship',
        message: `Relationship "${rel.id}" connects an entity to itself.`
      });
    }

    const pairKey = `${rel.sourceEntityId}->${rel.targetEntityId}:${rel.kind}`;
    if (checkedPairs.has(pairKey)) {
      issues.push({
        severity: 'warning',
        code: 'DUPLICATE_RELATIONSHIP_LINK',
        domain: 'relationship',
        message: `Duplicate relationship link detected for ${pairKey}.`
      });
    } else {
      checkedPairs.add(pairKey);
    }
  }

  // 6. Validate Power Relations
  for (const power of world.powerRelations) {
    if (!entityIdMap.has(power.wielderEntityId)) {
      issues.push({
        severity: 'error',
        code: 'DANGLING_POWER_WIELDER',
        domain: 'power',
        message: `Power relation "${power.id}" references non-existent wielder "${power.wielderEntityId}".`
      });
    }
    if (!entityIdMap.has(power.subjectEntityId)) {
      issues.push({
        severity: 'error',
        code: 'DANGLING_POWER_SUBJECT',
        domain: 'power',
        message: `Power relation "${power.id}" references non-existent subject "${power.subjectEntityId}".`
      });
    }
  }

  // 7. Validate Player Roles
  if (!world.possibilitySpace || !world.possibilitySpace.availableRoles || world.possibilitySpace.availableRoles.length === 0) {
    issues.push({
      severity: 'error',
      code: 'NO_ROLES_IN_POSSIBILITY_SPACE',
      domain: 'role',
      message: `World possibility space must define at least one playable role.`
    });
  } else {
    for (const role of world.possibilitySpace.availableRoles) {
      if (roleIdSet.has(role.id)) {
        issues.push({
          severity: 'error',
          code: 'DUPLICATE_ROLE_ID',
          domain: 'role',
          message: `Duplicate Role ID detected: "${role.id}".`
        });
      } else {
        roleIdSet.add(role.id);
      }

      if (role.associatedEntityId && !entityIdMap.has(role.associatedEntityId)) {
        issues.push({
          severity: 'error',
          code: 'DANGLING_ROLE_ENTITY_BINDING',
          domain: 'role',
          message: `Role "${role.title}" is bound to non-existent entity "${role.associatedEntityId}".`
        });
      }
    }
  }

  // Calculate totals
  const errorsCount = issues.filter(i => i.severity === 'error').length;
  const warningsCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return {
    isValid: errorsCount === 0,
    worldId: world.id,
    worldName: world.name,
    checkedAt: new Date().toISOString(),
    summary: {
      totalEntities: allEntities.length,
      totalFacts: world.groundTruthFacts.length,
      totalRelationships: world.relationships.length,
      totalAxioms: world.axioms.length,
      totalActions: world.actions.length,
      totalRoles: world.possibilitySpace?.availableRoles?.length || 0,
      errorsCount,
      warningsCount,
      infoCount
    },
    issues
  };
}
