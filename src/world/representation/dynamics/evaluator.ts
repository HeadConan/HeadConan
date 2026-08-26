/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Dynamics & Causality Evaluator
 * 
 * Evaluates: ACTION → PRECONDITIONS → DIRECT EFFECTS → EMERGENT CONSEQUENCES → NEXT STATE
 */

import { WorldDefinition } from '../types/definition';
import { WorldStateInstance, EntityStateSnapshot } from '../types/state';
import { WorldActionDefinition, StateEffect, SimulationEvent } from '../types/dynamics';
import { EntityId } from '../types/primitives';

export interface ActionEvaluationResult {
  actionId: string;
  actorEntityId: EntityId;
  isPreconditionSatisfied: boolean;
  preconditionFailureReason?: string;
  appliedEffects: StateEffect[];
  triggeredConsequences: string[];
  spawnedEvents: SimulationEvent[];
  narrativeSummary: string;
  nextState: WorldStateInstance;
}

export function evaluateWorldAction(
  world: WorldDefinition,
  currentState: WorldStateInstance,
  actionId: string,
  actorEntityId: EntityId,
  targetEntityId?: EntityId
): ActionEvaluationResult {
  const actionDef = world.actions.find(a => a.id === actionId);
  const actor = world.characters.find(c => c.id === actorEntityId);
  const nextState: WorldStateInstance = JSON.parse(JSON.stringify(currentState));
  nextState.clock.turnNumber += 1;

  if (!actionDef) {
    return {
      actionId,
      actorEntityId,
      isPreconditionSatisfied: false,
      preconditionFailureReason: `Action "${actionId}" is not defined in this world.`,
      appliedEffects: [],
      triggeredConsequences: [],
      spawnedEvents: [],
      narrativeSummary: `Action failed: Unknown action definition.`,
      nextState: currentState
    };
  }

  // 1. Evaluate Preconditions
  const actorState = currentState.entityStates[actorEntityId];
  for (const pre of actionDef.preconditions) {
    if (pre.type === 'requires_co_presence' && targetEntityId) {
      const targetState = currentState.entityStates[targetEntityId];
      if (actorState?.currentLocationId !== targetState?.currentLocationId) {
        return {
          actionId,
          actorEntityId,
          isPreconditionSatisfied: false,
          preconditionFailureReason: pre.failureMessage || `Actor and target must be in the same location.`,
          appliedEffects: [],
          triggeredConsequences: [],
          spawnedEvents: [],
          narrativeSummary: `Execution failed: ${pre.failureMessage}`,
          nextState: currentState
        };
      }
    }

    if (pre.type === 'requires_capability' && actor) {
      if (!actor.capabilities.includes(pre.expectedValue)) {
        return {
          actionId,
          actorEntityId,
          isPreconditionSatisfied: false,
          preconditionFailureReason: pre.failureMessage || `Actor lacks capability "${pre.expectedValue}".`,
          appliedEffects: [],
          triggeredConsequences: [],
          spawnedEvents: [],
          narrativeSummary: `Execution failed: ${pre.failureMessage}`,
          nextState: currentState
        };
      }
    }
  }

  // 2. Apply Direct Effects
  const appliedEffects: StateEffect[] = [];
  for (const effect of actionDef.directEffects) {
    appliedEffects.push(effect);
    
    if (effect.targetDomain === 'entity') {
      const resolvedId = effect.targetId === '$target' && targetEntityId ? targetEntityId : (effect.targetId === '$actor' ? actorEntityId : effect.targetId);
      const eState = nextState.entityStates[resolvedId];
      if (eState) {
        if (effect.mutationType === 'set') {
          (eState as any)[effect.fieldKey] = effect.payload;
        } else if (effect.mutationType === 'increment' && typeof (eState as any)[effect.fieldKey] === 'number') {
          (eState as any)[effect.fieldKey] += effect.payload;
        } else if (effect.mutationType === 'decrement' && typeof (eState as any)[effect.fieldKey] === 'number') {
          (eState as any)[effect.fieldKey] -= effect.payload;
        }
      }
    } else if (effect.targetDomain === 'epistemic' && effect.mutationType === 'reveal_fact') {
      const resolvedTarget = effect.targetId === '$actor' ? actorEntityId : effect.targetId;
      if (!nextState.epistemics.entityKnownFacts[resolvedTarget]) {
        nextState.epistemics.entityKnownFacts[resolvedTarget] = [];
      }
      if (!nextState.epistemics.entityKnownFacts[resolvedTarget].includes(effect.payload)) {
        nextState.epistemics.entityKnownFacts[resolvedTarget].push(effect.payload);
      }
    }
  }

  // 3. Evaluate Emergent Consequences
  const triggeredConsequences: string[] = [];
  const spawnedEvents: SimulationEvent[] = [];

  for (const consequence of actionDef.potentialConsequences) {
    // In deterministic run, trigger if probability >= 0.5 or simulated condition met
    if (consequence.triggerProbability >= 0.5) {
      triggeredConsequences.push(consequence.consequenceSummary);
      
      for (const secEffect of consequence.secondaryEffects) {
        appliedEffects.push(secEffect);
        if (secEffect.targetDomain === 'entity') {
          const eState = nextState.entityStates[secEffect.targetId];
          if (eState && secEffect.mutationType === 'increment' && typeof (eState as any)[secEffect.fieldKey] === 'number') {
            (eState as any)[secEffect.fieldKey] += secEffect.payload;
          }
        }
      }

      if (consequence.spawnEvent) {
        const newEvent: SimulationEvent = {
          id: `evt-dyn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          turnOccurred: nextState.clock.turnNumber,
          timestampStr: nextState.clock.inUniverseTime,
          title: consequence.spawnEvent.title,
          category: 'social_shift',
          description: consequence.spawnEvent.description,
          initiatorEntityId: actorEntityId,
          affectedEntityIds: targetEntityId ? [targetEntityId] : [],
          publicKnowledgeLevel: 'universal'
        };
        spawnedEvents.push(newEvent);
        nextState.recentEvents = [newEvent, ...nextState.recentEvents].slice(0, 10);
        nextState.eventChronicleLog.push(newEvent);
      }
    }
  }

  const narrativeSummary = `${actor?.name || actorEntityId} executed "${actionDef.name}". ${appliedEffects.map(e => e.narrativeDescription).join(' ')} ${triggeredConsequences.length > 0 ? 'Consequences emerged: ' + triggeredConsequences.join('; ') : ''}`;
  nextState.currentSituationNarrative = narrativeSummary;

  return {
    actionId,
    actorEntityId,
    isPreconditionSatisfied: true,
    appliedEffects,
    triggeredConsequences,
    spawnedEvents,
    narrativeSummary,
    nextState
  };
}
