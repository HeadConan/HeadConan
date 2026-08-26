import { WorldState, UIPlanning, WorldInteractionResult } from '../world/types';
import { synthesizeWorldFromPrompt, simulateWorldInteraction } from '../world/engine';

export type AIProviderId = 'auto' | 'deepseek-chat' | 'deepseek-reasoner' | 'gemini-3.7-flash' | 'procedural';

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  badge: string;
  description: string;
  provider: 'deepseek' | 'gemini' | 'procedural';
  model?: string;
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'auto',
    name: 'Auto Intelligent Gateway',
    badge: 'AUTO',
    description: 'Prioritizes DeepSeek-V3 / R1 when configured, seamlessly falling back to Gemini or Procedural Engine.',
    provider: 'deepseek',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek-V3',
    badge: 'DeepSeek V3',
    description: '671B MoE model optimized for creative, rich roleplay, and rapid JSON world synthesis.',
    provider: 'deepseek',
    model: 'deepseek-chat',
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek-R1',
    badge: 'DeepSeek R1',
    description: 'Chain-of-Thought reasoning model for deep strategic calculations and consequence matrices.',
    provider: 'deepseek',
    model: 'deepseek-reasoner',
  },
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    badge: 'Gemini 3.7',
    description: 'High-speed multimodel reasoning engine by Google.',
    provider: 'gemini',
    model: 'gemini-3.7-flash',
  },
  {
    id: 'procedural',
    name: 'Procedural Engine (Offline)',
    badge: 'Procedural',
    description: 'Deterministic rule-based simulator running purely in browser without external API calls.',
    provider: 'procedural',
  },
];

export interface ServerHealthResponse {
  status: string;
  providers: {
    deepseek: {
      available: boolean;
      models: string[];
    };
    gemini: {
      available: boolean;
      models: string[];
    };
  };
  defaultProvider: string;
}

export async function checkServerAIHealth(): Promise<ServerHealthResponse | null> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[AI Client] Health check failed:', e);
  }
  return null;
}

export interface GenerateWorldResponse {
  world: WorldState;
  uiPlanning: UIPlanning;
  source: 'deepseek' | 'gemini' | 'procedural_engine';
  model?: string;
  message?: string;
}

export async function generateWorldFromAI(
  prompt: string,
  selectedEngine: AIProviderId = 'auto'
): Promise<GenerateWorldResponse> {
  if (selectedEngine === 'procedural') {
    const procedural = synthesizeWorldFromPrompt(prompt);
    return {
      world: procedural.world,
      uiPlanning: procedural.uiPlanning,
      source: 'procedural_engine',
    };
  }

  const targetConfig = AI_PROVIDERS.find(p => p.id === selectedEngine) || AI_PROVIDERS[0];

  try {
    const res = await fetch('/api/generate-world', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        provider: selectedEngine === 'auto' ? 'auto' : targetConfig.provider,
        model: targetConfig.model,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.world && data.uiPlanning) {
        return {
          world: data.world,
          uiPlanning: data.uiPlanning,
          source: data.provider || (targetConfig.provider as any),
          model: data.model || targetConfig.model,
          message: data.message,
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
    source: 'procedural_engine',
  };
}

export async function interactWorldWithAI(
  action: string,
  currentWorld: WorldState,
  userNotes: string[] = [],
  selectedEngine: AIProviderId = 'auto'
): Promise<WorldInteractionResult & { provider?: string; model?: string }> {
  if (selectedEngine === 'procedural') {
    return simulateWorldInteraction(action, currentWorld, userNotes);
  }

  const targetConfig = AI_PROVIDERS.find(p => p.id === selectedEngine) || AI_PROVIDERS[0];

  try {
    const res = await fetch('/api/interact-world', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        currentWorld,
        userNotes,
        provider: selectedEngine === 'auto' ? 'auto' : targetConfig.provider,
        model: targetConfig.model,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.narrativeOutcome && data.stateChanges) {
        return data as WorldInteractionResult & { provider?: string; model?: string };
      }
    }
  } catch (err) {
    console.warn('[AI Client] Server interaction unavailable, using procedural simulation:', err);
  }

  return simulateWorldInteraction(action, currentWorld, userNotes);
}
