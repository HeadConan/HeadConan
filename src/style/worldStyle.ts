export type VisualLanguageType = 
  | 'institutional-bureaucratic'
  | 'personal-social'
  | 'archival-investigative'
  | 'cyberpunk-neon'
  | 'specops-tactical'
  | 'mythic-grimoire';

export type SpatialArchetype = 
  | 'theater-of-power'
  | 'social-campus-mosaic'
  | 'detective-corkboard'
  | 'workspace-grid'
  | 'command-cockpit';

export type PrimarySurfaceType = 
  | 'map'
  | 'evidence-board'
  | 'campus-social-hub'
  | 'character-dossiers'
  | 'crisis-console';

export interface WorldStyle {
  id: string;
  name: string;
  visualLanguage: VisualLanguageType;
  spatialArchetype: SpatialArchetype;
  primarySurfaceType: PrimarySurfaceType;
  
  // Information Hierarchy
  informationHierarchy: {
    primaryAxis: string;
    secondaryAxis: string;
    hiddenUnlessTriggered?: string[];
  };

  // Interaction Grammar
  interactionGrammar: {
    commandVerb: string;
    placeholder: string;
    actionTypeLabel: string;
    defaultActions: string[];
  };

  // Narrative & Dispatch Grammar
  narrativeGrammar: {
    dispatchLabel: string;
    chronicleTitle: string;
    documentClassificationDefault: string;
  };

  // Temporal Grammar
  temporalGrammar: {
    timeUnit: string;
    timeDisplayPrefix: string;
  };

  // Typography & Density
  typography: {
    headingFont: string; // 'font-serif' | 'font-sans' | 'font-mono'
    bodyFont: string;
  };
  density: 'dense' | 'comfortable' | 'spacious';

  // Aesthetic Tokens
  tokens: {
    canvasBg: string;
    surfaceBg: string;
    surfaceHoverBg: string;
    borderColor: string;
    accentColor: string;
    accentText: string;
    accentBadge: string;
    subtleText: string;
    cardBorder: string;
    glowAccent?: string;
  };

  // Attention Budget Constraints
  attentionBudget: {
    maxVisibleSurfaces: number;
    priorityBlockTypes: string[];
  };
}

export const WORLD_STYLE_PRESETS: Record<string, WorldStyle> = {
  empire: {
    id: 'style-empire',
    name: 'Imperial Statecraft & Bureaucracy',
    visualLanguage: 'institutional-bureaucratic',
    spatialArchetype: 'theater-of-power',
    primarySurfaceType: 'map',
    informationHierarchy: {
      primaryAxis: 'Imperial High Command & Territorial Garrisons',
      secondaryAxis: 'Cabinet Loyalties, Faction Balances & Intelligence Intercepts',
      hiddenUnlessTriggered: ['treason-evidence', 'underground-guilds']
    },
    interactionGrammar: {
      commandVerb: 'Issue Imperial Sovereign Decree',
      placeholder: 'Command high command, reallocate treasury, or confront ministerial treason...',
      actionTypeLabel: 'Sovereign Directives',
      defaultActions: [
        'Dispatch Praetorian inspection to the Northern Gate',
        'Audit Chancellor Vance’s ministerial procurement ledger',
        'Summon Ambassador Thorne for emergency diplomatic ultimatum',
        'Declare temporary state of defensive mobilization'
      ]
    },
    narrativeGrammar: {
      dispatchLabel: 'Imperial Intercepts & War Room Cable',
      chronicleTitle: 'Annals of the Imperium',
      documentClassificationDefault: 'TOP SECRET // IMPERIAL RECORD'
    },
    temporalGrammar: {
      timeUnit: 'Imperial Turn',
      timeDisplayPrefix: 'Era Year 742 • Turn'
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans'
    },
    density: 'dense',
    tokens: {
      canvasBg: 'bg-[#08090f]',
      surfaceBg: 'bg-[#0e111c]/90',
      surfaceHoverBg: 'hover:bg-[#131726]',
      borderColor: 'border-indigo-500/20',
      accentColor: 'bg-indigo-600',
      accentText: 'text-indigo-400',
      accentBadge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      subtleText: 'text-slate-400',
      cardBorder: 'border-white/10',
      glowAccent: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]'
    },
    attentionBudget: {
      maxVisibleSurfaces: 6,
      priorityBlockTypes: ['map', 'character', 'stats', 'document', 'event', 'timeline']
    }
  },

  university: {
    id: 'style-university',
    name: 'Collegiate Life & Social Sphere',
    visualLanguage: 'personal-social',
    spatialArchetype: 'social-campus-mosaic',
    primarySurfaceType: 'campus-social-hub',
    informationHierarchy: {
      primaryAxis: 'Peer Social Ties & Study Lab Relationships',
      secondaryAxis: 'Weekly Schedule, Academic Vitals & Personal Letters',
      hiddenUnlessTriggered: ['underground-archive-records']
    },
    interactionGrammar: {
      commandVerb: 'Perform Social or Academic Action',
      placeholder: 'Send a message, walk to the lab, study with Maya, or check the campus noticeboard...',
      actionTypeLabel: 'Campus Affordances',
      defaultActions: [
        'Meet Maya in Studio 4 to discuss the Turing Fellowship',
        'Drop by Black Oak Cafe to read Elena’s underground zine draft',
        'Knock on Professor Sterling’s office door during open hours',
        'Take a late study walk through the Quadrangle to clear head'
      ]
    },
    narrativeGrammar: {
      dispatchLabel: 'Campus Buzz & Student Chatter',
      chronicleTitle: 'Semester Journal & Memories',
      documentClassificationDefault: 'STUDENT NOTE // LAB MEMO'
    },
    temporalGrammar: {
      timeUnit: 'Semester Day',
      timeDisplayPrefix: 'Week 6 • Day'
    },
    typography: {
      headingFont: 'font-sans',
      bodyFont: 'font-sans'
    },
    density: 'comfortable',
    tokens: {
      canvasBg: 'bg-[#0a0d0e]',
      surfaceBg: 'bg-[#0f1517]/90',
      surfaceHoverBg: 'hover:bg-[#141e21]',
      borderColor: 'border-emerald-500/20',
      accentColor: 'bg-emerald-600',
      accentText: 'text-emerald-400',
      accentBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      subtleText: 'text-slate-400',
      cardBorder: 'border-white/10',
      glowAccent: 'shadow-[0_0_20px_rgba(16,185,129,0.12)]'
    },
    attentionBudget: {
      maxVisibleSurfaces: 6,
      priorityBlockTypes: ['character', 'stats', 'map', 'timeline', 'document', 'event']
    }
  },

  mystery: {
    id: 'style-mystery',
    name: 'Noir Investigation & Forensic Case',
    visualLanguage: 'archival-investigative',
    spatialArchetype: 'detective-corkboard',
    primarySurfaceType: 'evidence-board',
    informationHierarchy: {
      primaryAxis: 'Evidence Board, Yarn Connections & Murder Clues',
      secondaryAxis: 'Suspect Dossiers, Autopsy Reports & Ticking Timeline',
      hiddenUnlessTriggered: ['secret-vault-contents', 'blackmail-letters']
    },
    interactionGrammar: {
      commandVerb: 'Conduct Investigation / Interrogate',
      placeholder: 'Cross-examine suspect, search the study for traces, or test forensic samples...',
      actionTypeLabel: 'Investigative Steps',
      defaultActions: [
        'Inspect the poisoned teacup under magnifying lamp',
        'Interrogate Lady Margaret regarding the altered testament',
        'Examine the grandfather clock mechanism for tampering',
        'Compare footprints on the conservatory terrace'
      ]
    },
    narrativeGrammar: {
      dispatchLabel: 'Forensic Discoveries & Police Wire',
      chronicleTitle: 'Case Dossier & Investigation Log',
      documentClassificationDefault: 'EVIDENCE EXHIBIT // CASE NO. 1928-B'
    },
    temporalGrammar: {
      timeUnit: 'Hours Elapsed',
      timeDisplayPrefix: 'Rainy Night • Hour'
    },
    typography: {
      headingFont: 'font-serif',
      bodyFont: 'font-sans'
    },
    density: 'comfortable',
    tokens: {
      canvasBg: 'bg-[#0b0a08]',
      surfaceBg: 'bg-[#14120e]/95',
      surfaceHoverBg: 'hover:bg-[#1c1913]',
      borderColor: 'border-amber-500/20',
      accentColor: 'bg-amber-600',
      accentText: 'text-amber-400',
      accentBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      subtleText: 'text-amber-200/60',
      cardBorder: 'border-amber-500/15',
      glowAccent: 'shadow-[0_0_25px_rgba(217,119,6,0.15)]'
    },
    attentionBudget: {
      maxVisibleSurfaces: 6,
      priorityBlockTypes: ['evidence-board', 'character', 'document', 'timeline', 'stats', 'event']
    }
  }
};
