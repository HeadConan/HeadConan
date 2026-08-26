/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Scenarios, Timelines & Branching
 * 
 * Supports canonical timelines, alternate forks, "what-if" divergences, and custom scenario seeds.
 */

import { ScenarioId, TimelineId } from './primitives';
import { StateEffect } from './dynamics';
import { InhabitedRoleSlot } from './player';

export interface ScenarioSeed {
  id: ScenarioId;
  worldDefinitionId: string;
  title: string;
  premiseOverride?: string;
  initialSituation: string;
  divergencePoint?: string; // e.g. "What if Ned Stark refused to travel south to King's Landing?"
  
  initialStateMutations?: StateEffect[];
  recommendedRoles: InhabitedRoleSlot[];
}

export interface TimelineBranch {
  branchId: TimelineId;
  parentTimelineId?: TimelineId;
  forkedAtTurn: number;
  divergenceReason: string;
  createdAt: string;
}
