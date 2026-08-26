import { WorldState, UIPlanning, WorldInteractionResult, Character, WorldLocation, Faction, WorldEvent, TimelineEvent, StatMetric, WorldDocument } from './types';
import { EMPIRE_SEED_WORLD, UNIVERSITY_SEED_WORLD } from '../data/mockWorlds';

/**
 * High-quality client-side world procedural synthesizer
 * Ensures immediate responsiveness, rich world state generation, and graceful offline fallback.
 */
export function synthesizeWorldFromPrompt(prompt: string): { world: WorldState; uiPlanning: UIPlanning } {
  const lower = prompt.toLowerCase();

  // Match predefined rich seeds if prompt closely aligns
  if (lower.includes('empire') || lower.includes('ruler') || lower.includes('emperor') || lower.includes('authoritarian') || lower.includes('kingdom') || lower.includes('conan')) {
    return JSON.parse(JSON.stringify(EMPIRE_SEED_WORLD));
  }

  if (lower.includes('university') || lower.includes('college') || lower.includes('semester') || lower.includes('student') || lower.includes('campus')) {
    return JSON.parse(JSON.stringify(UNIVERSITY_SEED_WORLD));
  }

  // Derive dynamic procedural world from prompt
  const worldId = `world-${Date.now()}`;
  const title = extractTitleFromPrompt(prompt);
  const genre = detectGenre(lower);

  const characters: Character[] = [
    {
      id: 'char-1',
      name: genre.char1Name,
      role: genre.char1Role,
      faction: genre.faction1Name,
      status: 'Observing recent developments closely; guarded demeanor.',
      loyalty: 75,
      summary: 'A primary counterpart who holds crucial leverage over your next decisions.'
    },
    {
      id: 'char-2',
      name: genre.char2Name,
      role: genre.char2Role,
      faction: genre.faction2Name,
      status: 'Managing critical resources; quietly pushing a personal objective.',
      loyalty: 58,
      summary: 'Pragmatic and calculating. Will align with whoever demonstrates strength.'
    },
    {
      id: 'char-3',
      name: genre.char3Name,
      role: genre.char3Role,
      faction: genre.faction1Name,
      status: 'Relaying urgent communications from the perimeter.',
      loyalty: 88,
      summary: 'Your direct subordinate and primary intelligence conduit.'
    }
  ];

  const locations: WorldLocation[] = [
    {
      id: 'loc-1',
      name: genre.loc1Name,
      type: 'Command Center',
      status: 'Active operations underway.',
      significance: 'The nexus of your immediate authority and decision-making.',
      coordinates: { x: 50, y: 50 }
    },
    {
      id: 'loc-2',
      name: genre.loc2Name,
      type: 'Outer Perimeter',
      status: 'Heightened vigilance reported.',
      significance: 'Critical boundary separating secure space from the unknown.',
      coordinates: { x: 80, y: 25 }
    },
    {
      id: 'loc-3',
      name: genre.loc3Name,
      type: 'Underground Assembly',
      status: 'Whispers of unrest.',
      significance: 'Where civilian and dissident factions congregate.',
      coordinates: { x: 30, y: 70 }
    }
  ];

  const factions: Faction[] = [
    {
      id: 'fac-1',
      name: genre.faction1Name,
      influence: 75,
      stance: 'supportive',
      agenda: 'Maintain stability, protect core assets, and support leadership.'
    },
    {
      id: 'fac-2',
      name: genre.faction2Name,
      influence: 62,
      stance: 'suspicious',
      agenda: 'Push for structural reforms and greater operational autonomy.'
    }
  ];

  const events: WorldEvent[] = [
    {
      id: 'evt-1',
      timestamp: 'Initial Event',
      title: 'Initial Incident Report',
      category: 'crisis',
      description: `An unexpected development regarding "${prompt.slice(0, 45)}..." has triggered emergency protocols.`,
      urgency: 'high'
    },
    {
      id: 'evt-2',
      timestamp: 'Just In',
      title: 'Confidential Transmission',
      category: 'whisper',
      description: 'An intercepted signal suggests hidden alignments between opposing sectors.',
      urgency: 'medium'
    }
  ];

  const timeline: TimelineEvent[] = [
    {
      id: 'tl-1',
      time: '09:00',
      title: 'Orientation & Initial Briefing',
      description: 'Review immediate status and establish baseline objectives.',
      status: 'active'
    },
    {
      id: 'tl-2',
      time: '13:00',
      title: 'Council & Stakeholder Review',
      description: 'First formal confrontation with departmental leaders.',
      status: 'upcoming'
    },
    {
      id: 'tl-3',
      time: '18:00',
      title: 'Operational Deadline',
      description: 'Decisions made today will determine next cycle outcomes.',
      status: 'upcoming'
    }
  ];

  const stats: StatMetric[] = [
    {
      id: 'stat-order',
      label: genre.stat1Name,
      value: 70,
      max: 100,
      unit: '%',
      trend: 'stable',
      status: 'good',
      description: 'Baseline metric for systemic balance.'
    },
    {
      id: 'stat-tension',
      label: genre.stat2Name,
      value: 55,
      max: 100,
      unit: '%',
      trend: 'up',
      status: 'warning',
      description: 'Environmental and factional friction levels.'
    },
    {
      id: 'stat-readiness',
      label: genre.stat3Name,
      value: 80,
      max: 100,
      unit: '%',
      trend: 'stable',
      status: 'good',
      description: 'Capacity to respond to emergent crises.'
    }
  ];

  const documents: WorldDocument[] = [
    {
      id: 'doc-1',
      title: 'Initial Dossier & Field Summary',
      classification: 'CLASSIFIED // CONFIDENTIAL',
      date: 'Cycle 1 — 08:00',
      author: genre.char3Name,
      content: `Executive summary regarding: "${prompt}". Early analysis indicates fragile equilibrium. Action is required within the first cycle to prevent escalation.`
    }
  ];

  const world: WorldState = {
    id: worldId,
    name: title,
    genre: genre.label,
    premise: prompt,
    atmosphere: genre.atmosphere,
    currentSituation: `The environment is forming around your presence. ${genre.char1Name} awaits your instructions regarding current tensions.`,
    userRole: {
      title: genre.userTitle,
      authority: genre.userAuthority,
      objective: 'Establish control, resolve emergent tensions, and expand your sphere of influence.',
      traits: ['Decisive Action', 'Strategic Vision', 'Field Authority']
    },
    characters,
    locations,
    factions,
    events,
    timeline,
    stats,
    documents,
    notes: [],
    createdAt: new Date().toISOString(),
    turnCount: 1
  };

  const uiPlanning: UIPlanning = {
    activeLayout: 'workspace',
    suggestedInteractions: [
      `Convene an immediate briefing with ${genre.char1Name}`,
      `Dispatch an investigative detachment to ${genre.loc2Name}`,
      `Review classified records regarding ${genre.faction2Name}`,
      `Enact emergency stability measures`
    ],
    blocks: [
      { id: 'b-map', type: 'map', title: 'Spatial Sector Map', priority: 'primary', colSpan: 2 },
      { id: 'b-stats', type: 'stats', title: 'System Diagnostics', priority: 'primary', colSpan: 1 },
      { id: 'b-chars', type: 'character', title: 'Key Personnel & Factions', priority: 'primary', colSpan: 2 },
      { id: 'b-events', type: 'event', title: 'Live Alerts & Incidents', priority: 'secondary', colSpan: 1 },
      { id: 'b-doc', type: 'document', title: 'Primary Field Dossier', priority: 'secondary', colSpan: 2 },
      { id: 'b-timeline', type: 'timeline', title: 'Operational Schedule', priority: 'secondary', colSpan: 1 }
    ]
  };

  return { world, uiPlanning };
}

/**
 * Procedural simulation engine for computing natural language interaction consequences
 */
export function simulateWorldInteraction(
  action: string,
  world: WorldState,
  notes: string[]
): WorldInteractionResult {
  const turn = world.turnCount + 1;
  const actionLower = action.toLowerCase();

  // Determine sentiment / impact
  const isHostileOrAssertive = actionLower.includes('attack') || actionLower.includes('arrest') || actionLower.includes('freeze') || actionLower.includes('confront') || actionLower.includes('force') || actionLower.includes('move');
  const isDiplomatic = actionLower.includes('talk') || actionLower.includes('meet') || actionLower.includes('negotiate') || actionLower.includes('diplomatic') || actionLower.includes('peace') || actionLower.includes('offer');
  const isInvestigative = actionLower.includes('investigate') || actionLower.includes('spy') || actionLower.includes('wiretap') || actionLower.includes('read') || actionLower.includes('search') || actionLower.includes('audit');

  let narrativeOutcome = '';
  const updatedStats = world.stats.map(s => ({ ...s }));
  const updatedFactions = world.factions.map(f => ({ ...f }));
  const updatedCharacters = world.characters.map(c => ({ ...c }));
  const newEvents: WorldEvent[] = [];
  const newTimelineItems: TimelineEvent[] = [];
  const newDocuments: WorldDocument[] = [];

  if (isHostileOrAssertive) {
    narrativeOutcome = `Your decisive order to "${action}" was executed immediately. Shockwaves rippled through the administration. Couriers raced across corridors with sealed envelopes, and armed detachments mobilized to reinforce key perimeters. While authority was asserted, friction among rival factions has intensified noticeably.`;
    
    // Shift stats
    if (updatedStats[0]) {
      updatedStats[0].value = Math.max(10, updatedStats[0].value - 5);
      updatedStats[0].trend = 'down';
    }
    if (updatedStats[1]) {
      updatedStats[1].value = Math.min(100, updatedStats[1].value + 12);
      updatedStats[1].trend = 'up';
    }

    // Impact character
    if (updatedCharacters[1]) {
      updatedCharacters[1].loyalty = Math.max(15, updatedCharacters[1].loyalty - 10);
      updatedCharacters[1].status = 'Deeply shaken by recent assertive mandates; conferring with allies in secret.';
    }

    newEvents.push({
      id: `evt-dyn-${Date.now()}`,
      timestamp: `Turn ${turn} — Just Now`,
      title: `Emergency Response to: ${action.slice(0, 32)}...`,
      category: 'crisis',
      description: `Immediate security cordons established following high-level sovereign directive.`,
      urgency: 'high'
    });
  } else if (isDiplomatic) {
    narrativeOutcome = `You initiated dialogue: "${action}". The tense atmosphere softened slightly as representatives took their seats. Diplomatic channels buzzed with guarded optimism, though all parties kept their true leverage concealed beneath refined pleasantries.`;
    
    if (updatedStats[0]) {
      updatedStats[0].value = Math.min(100, updatedStats[0].value + 8);
      updatedStats[0].trend = 'up';
    }
    if (updatedCharacters[0]) {
      updatedCharacters[0].loyalty = Math.min(100, updatedCharacters[0].loyalty + 6);
      updatedCharacters[0].status = 'Reassured by measured diplomatic overtures; preparing concession drafts.';
    }

    newEvents.push({
      id: `evt-dyn-${Date.now()}`,
      timestamp: `Turn ${turn} — Just Now`,
      title: `Diplomatic Protocol Established`,
      category: 'opportunity',
      description: `Formal talks underway with key emissaries and ministerial representatives.`,
      urgency: 'medium'
    });
  } else if (isInvestigative) {
    narrativeOutcome = `Covert operations commenced in response to "${action}". Within hours, a sealed courier arrived bearing decrypted transcripts, financial ledger anomalies, and confidential surveillance summaries confirming key underlying suspicions.`;

    newDocuments.push({
      id: `doc-dyn-${Date.now()}`,
      title: `Intelligence Dossier: Inquiry into "${action.slice(0, 24)}"`,
      classification: 'RESTRICTED INTELLIGENCE',
      date: `Turn ${turn} — Intercepted`,
      author: 'Special Investigations Bureau',
      content: `Audit log results for subject investigation: Surveillance confirms unusual cipher exchanges and private transactions. Further action recommended before the next council vote.`
    });

    newEvents.push({
      id: `evt-dyn-${Date.now()}`,
      timestamp: `Turn ${turn} — Just Now`,
      title: `Covert Intelligence Harvested`,
      category: 'whisper',
      description: `New dossier added to intelligence files detailing private communications.`,
      urgency: 'medium'
    });
  } else {
    narrativeOutcome = `You commanded: "${action}". The machinery of the world shifted into motion. Observers in each sector took note of your initiative, recalibrating their stances and anticipating your next move.`;
  }

  newTimelineItems.push({
    id: `tl-dyn-${Date.now()}`,
    time: `Turn ${turn} - +01:30`,
    title: `Execution: ${action.slice(0, 30)}`,
    description: `Consequences of your directive are rippling through the environment.`,
    status: 'active'
  });

  return {
    narrativeOutcome,
    stateChanges: {
      situationUpdate: `Following your directive "${action}", regional telemetry indicates new operational dynamics.`,
      updatedStats: updatedStats.map(s => ({ id: s.id, newValue: s.value, trend: s.trend })),
      updatedCharacters: updatedCharacters.map(c => ({ id: c.id, newLoyalty: c.loyalty, status: c.status })),
      newEvents,
      newTimelineItems,
      newDocuments
    },
    suggestedNextActions: [
      `Review intelligence reports resulting from your last order`,
      `Summon key advisors to evaluate counter-responses`,
      `Inspect perimeter security and resource stockpiles`,
      `Record a new observation in your private notes`
    ]
  };
}

function extractTitleFromPrompt(prompt: string): string {
  const clean = prompt.replace(/^I want to (experience|become|be|explore|live as) /i, '').trim();
  const words = clean.split(' ').slice(0, 5).join(' ');
  return words ? `Realm of ${words.charAt(0).toUpperCase() + words.slice(1)}` : 'The Imagined World';
}

function detectGenre(text: string) {
  if (text.includes('space') || text.includes('star') || text.includes('cyber') || text.includes('sci-fi') || text.includes('city')) {
    return {
      label: 'Sci-Fi / Anomaly Frontier',
      atmosphere: 'Humming plasma conduits, sodium streetlights through toxic fog, encrypted telemetry, and heavy blast doors.',
      userTitle: 'Sector Overseer',
      userAuthority: 'Station Command Clearance',
      char1Name: 'Commander Jax Vance',
      char1Role: 'Head of Security & Tactical Operations',
      char2Name: 'Chief Engineer Linnea Karr',
      char2Role: 'Core Reactor Administrator',
      char3Name: 'Operator Ren',
      char3Role: 'Communications & Sensor Specialist',
      loc1Name: 'Central Command Spire',
      loc2Name: 'Sector 7 Extraction Gate',
      loc3Name: 'Undercity Hydroponics',
      faction1Name: 'The Citadel Directorate',
      faction2Name: 'Scavenger Union',
      stat1Name: 'Grid Integrity',
      stat2Name: 'Anomaly Flux',
      stat3Name: 'Station Morale'
    };
  }

  return {
    label: 'Atmospheric World Simulation',
    atmosphere: 'Intrigue in stone halls, whispered warnings, flickering lanterns, and fateful decisions.',
    userTitle: 'Sovereign Leader',
    userAuthority: 'Supreme Mandate',
    char1Name: 'Lord Chancellor Rowan',
    char1Role: 'Chief Executive Minister',
    char2Name: 'Marshal Diana Sterling',
    char2Role: 'Defense Commander',
    char3Name: 'Scholar Gideon',
    char3Role: 'Chief Archivist & Advisor',
    loc1Name: 'Grand Council Sanctum',
    loc2Name: 'Borderlands Garrison',
    loc3Name: 'Merchant Lower Docks',
    faction1Name: 'High Council Loyalists',
    faction2Name: 'Guild Alliance',
    stat1Name: 'Stability',
    stat2Name: 'Tension',
    stat3Name: 'Treasury'
  };
}
