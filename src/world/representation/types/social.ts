/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Social Structure, Norms, Institutions & Law
 * 
 * Culture and society must connect directly to observable behaviors, incentives, and sanctions.
 */

import { EntityId, OrganizationId } from './primitives';

export interface SocialNorm {
  id: string;
  name: string;
  domain: 'decorum' | 'academic_integrity' | 'feudal_etiquette' | 'state_security' | 'family_roles';
  prescribedBehavior: string;
  prohibitedBehavior: string;
  consequencesOfViolation: {
    socialSanction: string; // e.g. "Public ostracization", "Loss of tenure", "Execution for treason"
    reputationLoss: number; // 0 - 100
    institutionalPenaltyId?: string;
  };
  enforcementRigidity: 'flexible' | 'strict' | 'draconian';
}

export interface LawOrStatute {
  id: string;
  title: string;
  jurisdictionOrgId: OrganizationId;
  governingCode: string;
  violationTriggers: string[];
  enforcementAgencyOrgId?: OrganizationId;
  punishmentSummary: string;
}

export interface SocialHierarchyLevel {
  tier: number; // 1 (Supreme elite / King / Department Chair) down to 5 (Outsider / Serf / Undergrad)
  title: string;
  prestigeWeight: number;
  entitlements: string[];
  vulnerabilities: string[];
}
