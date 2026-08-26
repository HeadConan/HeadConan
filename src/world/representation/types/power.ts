/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Power Structure & Vectors of Influence
 * 
 * Invariant: Never reduce power to a single flat number (e.g. "power = 90").
 * Represent power as asymmetric relational leverage, resource control, and enforcement capacity.
 */

import { EntityId, OrganizationId } from './primitives';

export type PowerDomain = 
  | 'political'      // Legislative mandate, executive decree, throne authority
  | 'economic'       // Control of debt, capital, supply chains, salaries, funding grants
  | 'military'       // Armed forces, praetorian guard, blades, fleet
  | 'informational'  // Surveillance, espionage networks, classified archives, blackmails
  | 'social'         // Charisma, public popularity, familial legitimacy, caste status
  | 'supernatural'   // Arcane dominance, telepathy, divine right, alchemy
  | 'institutional'  // Academic tenure veto, committee votes, administrative sanction
  | 'forensic';      // Evidentiary proof, deductive monopoly, courtroom standing

export interface PowerRelation {
  id: string;
  wielderEntityId: EntityId;
  subjectEntityId: EntityId; // Whom they hold leverage over
  domain: PowerDomain;
  mechanism: string; // e.g. "Holds incriminating evidence of treason", "Controls grant renewals"
  leverageIntensity: number; // 1 - 100
  canPunish: boolean;
  canReward: boolean;
  dependencyFactor: string; // Why the subject cannot easily walk away
}

export interface InstitutionalPowerMatrix {
  organizationId: OrganizationId;
  governanceType: 'autocracy' | 'feudal_council' | 'bureaucratic_meritocracy' | 'academic_senate' | 'clandestine_cell';
  keyPowerHolders: Array<{
    roleName: string;
    holderEntityId?: EntityId;
    powerDomains: PowerDomain[];
    vetoRights: string[];
  }>;
}
