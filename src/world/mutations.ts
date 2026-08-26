import { WorldState, WorldInteractionResult } from './types';

/**
 * Pure state reducer that applies mutation changes to the current WorldState
 */
export function applyWorldMutations(
  currentWorld: WorldState,
  result: WorldInteractionResult
): WorldState {
  const nextWorld: WorldState = JSON.parse(JSON.stringify(currentWorld));
  nextWorld.turnCount = (nextWorld.turnCount || 1) + 1;

  const changes = result.stateChanges;
  if (!changes) return nextWorld;

  // 1. Situation Update
  if (changes.situationUpdate) {
    nextWorld.currentSituation = changes.situationUpdate;
  }

  // 2. Stats Updates
  if (changes.updatedStats && changes.updatedStats.length > 0) {
    for (const statUpdate of changes.updatedStats) {
      const match = nextWorld.stats.find(
        s => s.id === statUpdate.id || s.label.toLowerCase().includes(statUpdate.id.toLowerCase())
      );
      if (match) {
        if (typeof statUpdate.newValue === 'number') {
          match.value = Math.max(0, Math.min(match.max || 100, statUpdate.newValue));
        } else if (typeof statUpdate.delta === 'number') {
          match.value = Math.max(0, Math.min(match.max || 100, match.value + statUpdate.delta));
        }
        if (statUpdate.trend) match.trend = statUpdate.trend;
        if (match.value < 30) match.status = 'critical';
        else if (match.value < 60) match.status = 'warning';
        else match.status = 'good';
      }
    }
  }

  // 3. Character Updates
  if (changes.updatedCharacters && changes.updatedCharacters.length > 0) {
    for (const charUpdate of changes.updatedCharacters) {
      const match = nextWorld.characters.find(
        c => c.id === charUpdate.id || c.name.toLowerCase().includes(charUpdate.id.toLowerCase())
      );
      if (match) {
        if (typeof charUpdate.newLoyalty === 'number') {
          match.loyalty = Math.max(0, Math.min(100, charUpdate.newLoyalty));
        } else if (typeof charUpdate.loyaltyDelta === 'number') {
          match.loyalty = Math.max(0, Math.min(100, match.loyalty + charUpdate.loyaltyDelta));
        }
        if (typeof charUpdate.suspicionDelta === 'number' && typeof match.suspicionLevel === 'number') {
          match.suspicionLevel = Math.max(0, Math.min(100, match.suspicionLevel + charUpdate.suspicionDelta));
        }
        if (charUpdate.status) match.status = charUpdate.status;
      }
    }
  }

  // 4. Faction Updates
  if (changes.updatedFactions && changes.updatedFactions.length > 0) {
    for (const facUpdate of changes.updatedFactions) {
      const match = nextWorld.factions.find(
        f => f.id === facUpdate.id || f.name.toLowerCase().includes(facUpdate.id.toLowerCase())
      );
      if (match) {
        if (typeof facUpdate.newInfluence === 'number') {
          match.influence = Math.max(0, Math.min(100, facUpdate.newInfluence));
        } else if (typeof facUpdate.influenceDelta === 'number') {
          match.influence = Math.max(0, Math.min(100, match.influence + facUpdate.influenceDelta));
        }
        if (facUpdate.stance) match.stance = facUpdate.stance;
        if (facUpdate.agenda) match.agenda = facUpdate.agenda;
      }
    }
  }

  // 5. New Events
  if (changes.newEvents && changes.newEvents.length > 0) {
    nextWorld.events = [...changes.newEvents, ...nextWorld.events].slice(0, 15);
  }

  // 6. New Timeline Items
  if (changes.newTimelineItems && changes.newTimelineItems.length > 0) {
    nextWorld.timeline = [...changes.newTimelineItems, ...nextWorld.timeline].slice(0, 15);
  }

  // 7. New Documents
  if (changes.newDocuments && changes.newDocuments.length > 0) {
    nextWorld.documents = [...changes.newDocuments, ...nextWorld.documents];
  }

  // 8. New Clues
  if (changes.newClues && changes.newClues.length > 0) {
    nextWorld.clues = [...(nextWorld.clues || []), ...changes.newClues];
  }

  // 9. New Rules / Axioms
  if (changes.newRules && changes.newRules.length > 0) {
    nextWorld.rules = [...(nextWorld.rules || []), ...changes.newRules];
  }

  return nextWorld;
}
