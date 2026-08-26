import { WorldState, UIPlanning, WorldInteractionResult, Character, WorldLocation, Faction, WorldEvent, TimelineEvent, StatMetric, WorldDocument, ClueItem, RuleAxiom } from './types';
import { EMPIRE_SEED_WORLD, UNIVERSITY_SEED_WORLD, MYSTERY_SEED_WORLD } from '../data/mockWorlds';
import { WORLD_STYLE_PRESETS } from '../style/worldStyle';
import { RoleSlot } from '../roles/model';

/**
 * High-quality client-side world procedural synthesizer
 * Ensures immediate responsiveness, rich world state generation, and graceful offline fallback.
 */
export function synthesizeWorldFromPrompt(prompt: string): { world: WorldState; uiPlanning: UIPlanning } {
  const lower = prompt.toLowerCase();

  // Match predefined rich seeds if prompt closely aligns
  if (lower.includes('mystery') || lower.includes('murder') || lower.includes('detective') || lower.includes('blackwood') || lower.includes('poison') || lower.includes('crime') || lower.includes('sherlock') || lower.includes('conan')) {
    return JSON.parse(JSON.stringify(MYSTERY_SEED_WORLD));
  }

  if (lower.includes('empire') || lower.includes('ruler') || lower.includes('emperor') || lower.includes('authoritarian') || lower.includes('kingdom') || lower.includes('valen') || lower.includes('archon')) {
    return JSON.parse(JSON.stringify(EMPIRE_SEED_WORLD));
  }

  if (lower.includes('university') || lower.includes('college') || lower.includes('semester') || lower.includes('student') || lower.includes('campus') || lower.includes('fellowship')) {
    return JSON.parse(JSON.stringify(UNIVERSITY_SEED_WORLD));
  }

  // Derive dynamic procedural world from prompt
  const worldId = `world-${Date.now()}`;
  const title = extractTitleFromPrompt(prompt);
  const genre = detectGenre(lower);

  const roles: RoleSlot[] = [
    {
      id: 'role-player-primary',
      name: genre.userTitle,
      title: genre.userAuthority,
      type: 'PLAYER',
      agency: 'character-level',
      perspective: 'first-person',
      knowledge: 'limited',
      permissions: ['talk', 'move', 'decide', 'command'],
      avatar: '🧭',
      description: `You inhabit this world as ${genre.userTitle}, steering key decisions on the ground.`,
      suggestedPrompts: [
        `Convene an immediate briefing with ${genre.char1Name}`,
        `Dispatch an investigative detachment to ${genre.loc2Name}`,
        `Review classified records regarding ${genre.faction2Name}`,
        `Enact emergency stability measures`
      ]
    },
    {
      id: 'role-director',
      name: 'Narrative Director',
      title: 'World Weaver',
      type: 'DIRECTOR',
      agency: 'world-level',
      perspective: 'omniscient',
      knowledge: 'broad',
      permissions: ['spawn', 'modify', 'reveal', 'schedule', 'narrate'],
      avatar: '🎭',
      description: 'Shape the ongoing narrative, spawn emergent hazards, or test protagonists with unexpected dilemmas.',
      suggestedPrompts: [
        'Spawn an unexpected regional blackout',
        'Inject a leaked memo causing faction distrust',
        'Trigger sudden harsh weather conditions'
      ]
    },
    {
      id: 'role-architect',
      name: 'System Architect',
      title: 'Axiom Architect',
      type: 'ARCHITECT',
      agency: 'system-level',
      perspective: 'omniscient',
      knowledge: 'omniscient',
      permissions: ['architect', 'modify', 'create', 'reveal'],
      avatar: '⚙️',
      description: 'Modify the fundamental laws, physics, and faction mechanics of this universe.',
      suggestedPrompts: [
        'Alter physical travel constraints',
        'Introduce a new governing axiom'
      ]
    },
    {
      id: 'role-observer',
      name: 'Silent Observer',
      title: 'World Chronicler',
      type: 'OBSERVER',
      agency: 'none',
      perspective: 'omniscient',
      knowledge: 'broad',
      permissions: ['observe'],
      avatar: '👁️',
      description: 'Watch the simulation evolve without direct mutation.',
      suggestedPrompts: ['Observe global balance metrics']
    }
  ];

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
      timestamp: '00:00 — Genesis',
      title: 'Initial Operational Briefing',
      category: 'report',
      description: `World simulation initialized. Critical attention requested on ${genre.loc2Name} where anomalous activity was detected.`,
      urgency: 'high'
    }
  ];

  const timeline: TimelineEvent[] = [
    {
      id: 'tl-1',
      time: 'Day 1 — 08:00',
      title: 'Assumption of Authority',
      description: `Formal mandate verified for ${genre.userTitle}.`,
      status: 'completed'
    },
    {
      id: 'tl-2',
      time: 'Day 1 — 12:00',
      title: 'High-Level Strategic Review',
      description: `Convene leaders from ${genre.faction1Name} and ${genre.faction2Name}.`,
      status: 'active'
    }
  ];

  const stats: StatMetric[] = [
    {
      id: 'stat-stability',
      label: genre.stat1Name,
      value: 70,
      max: 100,
      trend: 'stable',
      status: 'good',
      description: 'Overall systemic equilibrium.'
    },
    {
      id: 'stat-tension',
      label: genre.stat2Name,
      value: 55,
      max: 100,
      trend: 'up',
      status: 'warning',
      description: 'Regional friction index.'
    },
    {
      id: 'stat-resources',
      label: genre.stat3Name,
      value: 80,
      max: 100,
      trend: 'stable',
      status: 'good',
      description: 'Available operational reserves.'
    }
  ];

  const documents: WorldDocument[] = [
    {
      id: 'doc-1',
      title: 'Primary Directive & Operational Briefing',
      classification: 'OFFICIAL RECORD',
      date: 'Cycle 01',
      author: genre.char3Name,
      content: `Telemetry confirms shifting alignment in ${genre.loc2Name}. Your mandate is to maintain operational stability and resolve emerging crises.`
    }
  ];

  const worldStyle = WORLD_STYLE_PRESETS.empire;

  const world: WorldState = {
    id: worldId,
    name: title,
    genre: genre.label,
    premise: prompt,
    atmosphere: genre.atmosphere,
    currentSituation: `Operational telemetry active. Key decisions are required regarding ${genre.loc2Name} and ${genre.faction2Name}.`,
    roles,
    activeRoleId: 'role-player-primary',
    userRole: {
      title: genre.userTitle,
      authority: genre.userAuthority,
      objective: `Stabilize the situation in ${title} and navigate complex faction interests.`,
      traits: ['Strategic Vision', 'Decisive Presence']
    },
    characters,
    locations,
    factions,
    events,
    timeline,
    stats,
    documents,
    notes: [],
    style: worldStyle,
    createdAt: new Date().toISOString(),
    turnCount: 1
  };

  const uiPlanning: UIPlanning = {
    activeLayout: 'workspace-grid',
    suggestedInteractions: roles[0].suggestedPrompts,
    blocks: [
      { id: 'b-map', type: 'map', title: 'Spatial Sector Map', priority: 'primary', colSpan: 2 },
      { id: 'b-stats', type: 'stats', title: 'System Diagnostics', priority: 'primary', colSpan: 1 },
      { id: 'b-chars', type: 'character', title: 'Key Personnel & Factions', priority: 'primary', colSpan: 2 },
      { id: 'b-events', type: 'event', title: 'Live Alerts & Incidents', priority: 'secondary', colSpan: 1 },
      { id: 'b-doc', type: 'document', title: 'Primary Field Dossier', priority: 'secondary', colSpan: 1 },
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
  const turn = (world.turnCount || 1) + 1;
  const actionLower = action.toLowerCase();

  // Check for Director Intervention
  const isDirectorAction = action.startsWith('[DIRECTOR') || actionLower.includes('spawn') || actionLower.includes('leak') || actionLower.includes('inject');

  if (isDirectorAction) {
    const rawAction = action.replace(/^\[DIRECTOR[^\]]*\]\s*/i, '');
    const newEvents: WorldEvent[] = [
      {
        id: `evt-dir-${Date.now()}`,
        timestamp: `Directorial Intervention — Turn ${turn}`,
        title: `Director Event: ${rawAction.slice(0, 36)}...`,
        category: 'crisis',
        description: `The director intervened to alter the fabric of this reality: "${rawAction}".`,
        urgency: 'high'
      }
    ];

    const newTimelineItems: TimelineEvent[] = [
      {
        id: `tl-dir-${Date.now()}`,
        time: `Turn ${turn} (Director)`,
        title: `Narrative Shift: ${rawAction.slice(0, 30)}`,
        description: `Directorial intervention injected into world state.`,
        status: 'active'
      }
    ];

    return {
      narrativeOutcome: `[DIRECTORIAL OVERRIDE EXECUTED]\nYou commanded the world simulation: "${rawAction}". The environment shifted dynamically to accommodate the narrative intervention. Factions reacted with heightened alarm and new situational branches have opened.`,
      stateChanges: {
        situationUpdate: `Directorial intervention active: "${rawAction}".`,
        newEvents,
        newTimelineItems,
        updatedStats: world.stats.map((s, idx) => ({
          id: s.id,
          delta: idx === 0 ? -8 : 10,
          trend: idx === 0 ? 'down' : 'up'
        }))
      },
      suggestedNextActions: [
        'Observe how the characters respond to this new crisis',
        'Shift back to Player role to experience the consequences from ground level',
        'Spawn an additional unexpected plot twist'
      ]
    };
  }

  // Determine sentiment / impact for standard gameplay
  const isForensicOrMystery = actionLower.includes('examine') || actionLower.includes('fingerprint') || actionLower.includes('poison') || actionLower.includes('interrogate') || actionLower.includes('clue') || actionLower.includes('confront');
  const isHostileOrAssertive = actionLower.includes('attack') || actionLower.includes('arrest') || actionLower.includes('freeze') || actionLower.includes('force') || actionLower.includes('dispatch') || actionLower.includes('mobilize');
  const isDiplomatic = actionLower.includes('talk') || actionLower.includes('meet') || actionLower.includes('negotiate') || actionLower.includes('diplomatic') || actionLower.includes('peace') || actionLower.includes('offer') || actionLower.includes('study');

  let narrativeOutcome = '';
  const updatedStats = (world.stats || []).map(s => ({ ...s }));
  const updatedCharacters = (world.characters || []).map(c => ({ ...c }));
  const newEvents: WorldEvent[] = [];
  const newTimelineItems: TimelineEvent[] = [];
  const newDocuments: WorldDocument[] = [];
  const newClues: ClueItem[] = [];

  if (isForensicOrMystery && world.clues) {
    narrativeOutcome = `You carried out investigative inquiry: "${action}". Carefully inspecting the scene and testing hypotheses yielded fresh forensic insights. The suspects became visibly unsettled as your deductions began tightening the perimeter of truth.`;

    newEvents.push({
      id: `evt-clue-${Date.now()}`,
      timestamp: `Hour ${turn}:00 — Forensic Discovery`,
      title: `Investigative Discovery: ${action.slice(0, 28)}...`,
      category: 'discovery',
      description: `Deduction confirmed new evidence patterns connecting suspects to key crime exhibits.`,
      urgency: 'high'
    });

    if (updatedCharacters[0]) {
      updatedCharacters[0].status = 'Anxious; avoiding direct eye contact during cross-examination.';
    }
  } else if (isHostileOrAssertive) {
    narrativeOutcome = `Your decisive order to "${action}" was executed immediately. Shockwaves rippled through the administration. Couriers raced across corridors with sealed envelopes, and armed detachments mobilized to reinforce key perimeters. While authority was asserted, friction among rival factions has intensified noticeably.`;
    
    if (updatedStats[0]) {
      updatedStats[0].value = Math.max(10, updatedStats[0].value - 5);
      updatedStats[0].trend = 'down';
    }
    if (updatedStats[1]) {
      updatedStats[1].value = Math.min(100, updatedStats[1].value + 12);
      updatedStats[1].trend = 'up';
    }

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
      newDocuments,
      newClues
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
