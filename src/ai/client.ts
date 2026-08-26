import { WorldState, UIPlanning, WorldInteractionResult } from '../world/types';
import { synthesizeWorldFromPrompt, simulateWorldInteraction } from '../world/engine';

export interface GenerateWorldResponse {
  world: WorldState;
  uiPlanning: UIPlanning;
  source: 'gemini' | 'procedural_engine';
  message?: string;
}

export async function generateWorldFromAI(prompt: string): Promise<GenerateWorldResponse> {
  try {
    const res = await fetch('/api/gemini/generate-world', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.world && data.uiPlanning) {
        return {
          world: data.world,
          uiPlanning: data.uiPlanning,
          source: 'gemini',
          message: data.message
        };
      }
    }
  } catch (err) {
    console.warn('[AI Client] Server generation unavailable, using procedural synthesis:', err);
  }

  // Graceful fallback to procedural synthesis
  const procedural = synthesizeWorldFromPrompt(prompt);
  return {
    world: procedural.world,
    uiPlanning: procedural.uiPlanning,
    source: 'procedural_engine'
  };
}

export async function interactWorldWithAI(
  action: string,
  currentWorld: WorldState,
  userNotes: string[] = []
): Promise<WorldInteractionResult> {
  try {
    const res = await fetch('/api/gemini/interact-world', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        currentWorld,
        userNotes,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.narrativeOutcome && data.stateChanges) {
        return data as WorldInteractionResult;
      }
    }
  } catch (err) {
    console.warn('[AI Client] Server interaction unavailable, using procedural simulation:', err);
  }

  return simulateWorldInteraction(action, currentWorld, userNotes);
}
