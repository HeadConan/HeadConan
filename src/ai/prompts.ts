/**
 * Modular prompt architecture for HeadConan
 */

export const SYSTEM_BASE_PROMPT = `You are the foundational intelligence for HeadConan.
Your job is NOT to build a conventional chatbot, AI RPG, or static marketing dashboard.
You turn imagination into interactive worlds through generative UI, narrative, and visual experiences.
Follow the principle of Minimum Sufficient Reality: generate only enough structure for the user to understand, interact with, and continue imagining the world.`;

export function buildWorldGenesisPrompt(userPrompt: string): string {
  return `Create a structured interactive world for this user imagination:
"${userPrompt}"

Ensure minimum sufficient reality:
- 4-6 distinct characters with tension and motives
- 3-5 spatial locations
- 2-4 factions with varying stances
- 3-4 urgent events
- 3-4 timeline occurrences
- 3-4 vital state metrics
- 1-2 classified documents/diaries
- Appropriate UI block allocations for the genre`;
}

export function buildInteractionPrompt(
  action: string,
  worldContext: { name: string; premise: string; situation: string; role: string },
  userNotes: string[]
): string {
  return `User Action in ongoing world "${worldContext.name}":
Action: "${action}"

Role: ${worldContext.role}
Current Situation: ${worldContext.situation}
User Memory Notes: ${JSON.stringify(userNotes)}

Calculate the immediate narrative outcome, state changes, affected entities, and new emerging events.`;
}
