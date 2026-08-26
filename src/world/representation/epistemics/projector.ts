/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Epistemic Perspective Projector
 * 
 * Projects the objective World Definition and State into a subjective observer lens.
 * Resolves Information Asymmetry:
 * WORLD TRUTH != CHARACTER KNOWLEDGE != PLAYER KNOWLEDGE != PUBLIC INFORMATION
 */

import { WorldDefinition } from '../types/definition';
import { WorldStateInstance } from '../types/state';
import { Fact, EpistemicPerspective, SecretItem, RumorItem, Belief } from '../types/information';
import { EntityId } from '../types/primitives';

export function projectEpistemicPerspective(
  world: WorldDefinition,
  state: WorldStateInstance,
  observerEntityId?: EntityId
): EpistemicPerspective {
  // 1. Omniscient / Host / Cosmic Perspective
  if (!observerEntityId) {
    return {
      observerRoleTitle: 'Cosmic / Omniscient Host Perspective',
      knownFactIds: world.groundTruthFacts.map(f => f.id),
      beliefs: [],
      activeSecrets: state.epistemics.activeSecrets,
      knownRumors: state.epistemics.activeRumors,
      fogOfWarLocations: []
    };
  }

  // 2. Specific Inhabited Character Perspective
  const character = world.characters.find(c => c.id === observerEntityId);
  const knownFactIdArray = state.epistemics.entityKnownFacts[observerEntityId] || character?.knownFactIds || [];
  const knownFactSet = new Set<string>(knownFactIdArray);

  // Add universal public facts automatically
  for (const fact of world.groundTruthFacts) {
    if (fact.visibilityScope === 'universal_public') {
      knownFactSet.add(fact.id);
    }
  }

  // Secrets: which secrets does this character hold or are targeted by?
  const visibleSecrets: SecretItem[] = state.epistemics.activeSecrets.filter(secret => {
    return secret.holdingEntityIds.includes(observerEntityId);
  });

  // Rumors known by this character
  const visibleRumors: RumorItem[] = state.epistemics.activeRumors.filter(rumor => {
    return rumor.knownByEntityIds.includes(observerEntityId);
  });

  // Beliefs
  const characterBeliefs: Belief[] = character?.beliefs || [];

  return {
    observerEntityId,
    observerRoleTitle: character ? `${character.name} (${character.archetypeRole})` : 'Unknown Observer',
    knownFactIds: Array.from(knownFactSet),
    beliefs: characterBeliefs,
    activeSecrets: visibleSecrets,
    knownRumors: visibleRumors,
    fogOfWarLocations: []
  };
}

/**
 * Compares what two different entities know about a specific Fact or Secret.
 * Highlights dramatic irony and information asymmetry.
 */
export interface AsymmetryComparison {
  factId: string;
  statement: string;
  groundTruthVisibility: string;
  entityAKnowledge: { entityName: string; knows: boolean };
  entityBKnowledge: { entityName: string; knows: boolean };
  isAsymmetric: boolean;
  dramaticIronyDescription?: string;
}

export function compareEpistemicAsymmetry(
  world: WorldDefinition,
  state: WorldStateInstance,
  entityIdA: EntityId,
  entityIdB: EntityId,
  factId: string
): AsymmetryComparison | null {
  const fact = world.groundTruthFacts.find(f => f.id === factId);
  if (!fact) return null;

  const charA = world.characters.find(c => c.id === entityIdA);
  const charB = world.characters.find(c => c.id === entityIdB);

  const persA = projectEpistemicPerspective(world, state, entityIdA);
  const persB = projectEpistemicPerspective(world, state, entityIdB);

  const knowsA = (persA.knownFactIds as string[]).includes(factId);
  const knowsB = (persB.knownFactIds as string[]).includes(factId);

  let irony = '';
  if (knowsA && !knowsB) {
    irony = `${charA?.name || entityIdA} knows "${fact.statement}", while ${charB?.name || entityIdB} remains completely unaware.`;
  } else if (!knowsA && knowsB) {
    irony = `${charB?.name || entityIdB} holds this leverage, concealing it from ${charA?.name || entityIdA}.`;
  } else if (knowsA && knowsB) {
    irony = `Both parties share this knowledge, though they may not know the other knows.`;
  } else {
    irony = `Neither party is aware of this ground-truth reality.`;
  }

  return {
    factId,
    statement: fact.statement,
    groundTruthVisibility: fact.visibilityScope,
    entityAKnowledge: { entityName: charA?.name || entityIdA, knows: knowsA },
    entityBKnowledge: { entityName: charB?.name || entityIdB, knows: knowsB },
    isAsymmetric: knowsA !== knowsB,
    dramaticIronyDescription: irony
  };
}
