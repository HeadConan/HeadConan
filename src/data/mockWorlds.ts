import { WorldState, UIPlanning } from '../world/types';
import { WORLD_STYLE_PRESETS } from '../style/worldStyle';

// ==========================================
// WORLD 1: AUTHORITARIAN EMPIRE
// ==========================================
export const EMPIRE_SEED_WORLD: { world: WorldState; uiPlanning: UIPlanning } = {
  world: {
    id: 'world-empire-01',
    name: 'The Sovereign Imperium of Valen',
    genre: 'Political Simulation & Authoritarian Intrigue',
    premise: 'A vast fictional empire is beginning to fracture beneath silent institutional conspiracies, rising border skirmishes, and shadow cabinet rivalries. You have just assumed supreme sovereign power.',
    atmosphere: 'Ominous marble corridors, suppressed telegrams, rain-swept border watchtowers, and whispered court loyalties.',
    currentSituation: 'General Vane reports unusual armored division movements along the Northern Border without direct imperial clearance. Meanwhile, the industrial consortium threatens labor lockouts in the outer provinces.',
    
    // Roles System
    roles: [
      {
        id: 'role-emperor',
        name: 'Supreme Archon Alexander',
        title: 'Imperial Sovereign & Commander-in-Chief',
        type: 'PLAYER',
        agency: 'character-level',
        perspective: 'first-person',
        knowledge: 'limited',
        permissions: ['command', 'decide', 'talk', 'move'],
        controlledEntityId: 'char-sovereign',
        controlledEntityName: 'Archon Alexander',
        avatar: '👑',
        description: 'You wield absolute executive decree, yet your cabinet is deeply divided and ministers whisper treason.',
        suggestedPrompts: [
          'Dispatch Praetorian inspection to the Northern Gate',
          'Audit Chancellor Vance’s ministerial procurement ledger',
          'Summon Ambassador Thorne for emergency diplomatic ultimatum',
          'Declare temporary state of defensive mobilization'
        ]
      },
      {
        id: 'role-director',
        name: 'Imperial Shadow Overseer',
        title: 'Narrative & World Director',
        type: 'DIRECTOR',
        agency: 'world-level',
        perspective: 'omniscient',
        knowledge: 'broad',
        permissions: ['spawn', 'modify', 'reveal', 'schedule', 'narrate'],
        avatar: '🎭',
        description: 'Guide the geopolitical simulation from above. Trigger border skirmishes, leak ministerial telegrams, or test the sovereign with sudden coups.',
        suggestedPrompts: [
          'Spawn an unsanctioned military mutiny in Sector 4',
          'Leak an incriminating transcript compromising Chancellor Vance',
          'Trigger sudden severe winter storm across the Northern Pass',
          'Shift parliamentary faction to open hostility'
        ]
      },
      {
        id: 'role-architect',
        name: 'Cosmic Statecraft Architect',
        title: 'Ontological Rules Modifier',
        type: 'ARCHITECT',
        agency: 'system-level',
        perspective: 'omniscient',
        knowledge: 'omniscient',
        permissions: ['architect', 'modify', 'create', 'reveal'],
        avatar: '⚙️',
        description: 'Rewrite the fundamental physics, historical axioms, and faction economies of the Imperium.',
        suggestedPrompts: [
          'Rewrite axiom: Prohibit all telegraph communication lines',
          'Add new faction: The Iron Guild Consortium',
          'Alter timeline rule: Frontier messages take 2 full turns to arrive'
        ]
      },
      {
        id: 'role-observer',
        name: 'Grand Imperial Chronicler',
        title: 'Imperial Archivist',
        type: 'OBSERVER',
        agency: 'none',
        perspective: 'omniscient',
        knowledge: 'broad',
        permissions: ['observe'],
        avatar: '👁️',
        description: 'Watch the collapse or ascendance of the Valen Imperium without intervention.',
        suggestedPrompts: [
          'Analyze cabinet loyalty shifts across turns',
          'Observe military mobilization along the northern frontier'
        ]
      }
    ],
    activeRoleId: 'role-emperor',

    userRole: {
      title: 'Supreme Archon',
      authority: 'Imperial Sovereign & Commander-in-Chief',
      objective: 'Consolidate power, root out treason in the ministries, and stabilize the northern frontier before open civil war erupts.',
      traits: ['Absolute Executive Decree', 'Divided Cabinet', 'Imperial Intelligence Access']
    },

    characters: [
      {
        id: 'char-chancellor',
        name: 'Chancellor Marcus Vance',
        role: 'Head of Civil Administration & Finance',
        faction: 'Parliamentary Moderates',
        status: 'Polite, calculating; subtly delaying emergency budget sanctions.',
        loyalty: 68,
        summary: 'A veteran bureaucrat who knows where every coin flows. Believes the throne needs economic checks.'
      },
      {
        id: 'char-defense-minister',
        name: 'General Corvus Vane',
        role: 'Defense Minister & High Command Marshal',
        faction: 'The Imperial Military High Command',
        status: 'Standoffish; conducting unsanctioned tactical drills.',
        loyalty: 52,
        summary: 'Commands the 3rd and 7th Legions. Resents civilian interference and whispers of defense budget cuts.'
      },
      {
        id: 'char-intel-director',
        name: 'Director Evelyn Cross',
        role: 'Director of the State Surveillance Bureau',
        faction: 'Intelligence Service',
        status: 'Subtle, ubiquitous; intercepting private cables across ministries.',
        loyalty: 81,
        summary: 'Operates in shadows. Brings you transcripts of private conversations from the ministers’ dinner tables.'
      },
      {
        id: 'char-foreign-ambassador',
        name: 'Ambassador Sola Thorne',
        role: 'High Envoy of the Ostrava Confederation',
        faction: 'Foreign Diplomatic Corps',
        status: 'Pressuring for tariff exemptions along trade corridors.',
        loyalty: 45,
        summary: 'An elegant diplomat with sharp teeth. Her home nation secretly funds border insurgencies.'
      },
      {
        id: 'char-personal-advisor',
        name: 'Archivist Jonathan Reed',
        role: 'Personal Imperial Advisor & Historian',
        faction: 'Sovereign Household',
        status: 'Steadfast, weary; analyzing historical rebellion precedents.',
        loyalty: 94,
        summary: 'Your most faithful confidant since your youth. Unafraid to deliver grim, unvarnished truths.'
      }
    ],

    locations: [
      {
        id: 'loc-capital',
        name: 'Imperial Capital (Solaris Core)',
        type: 'Imperial Seat & Urban Center',
        status: 'Heightened security protocols active.',
        significance: 'Seat of executive power and imperial ministries.',
        coordinates: { x: 50, y: 52 },
        controllingFaction: 'Sovereign Guard'
      },
      {
        id: 'loc-northern-border',
        name: 'Northern Border Gate (Iron Bastion)',
        type: 'Fortified Frontier Zone',
        status: 'Unregistered armored columns spotted near Sector 4.',
        significance: 'Critical buffer separating the empire from the Ostrava Steppes.',
        coordinates: { x: 78, y: 18 },
        controllingFaction: 'The Imperial Military'
      },
      {
        id: 'loc-parliament',
        name: 'Grand Assembly Hall (Parliament)',
        type: 'Legislative Chamber',
        status: 'Emergency budget debate in session.',
        significance: 'Center of civilian faction disputes and ministerial votes.',
        coordinates: { x: 38, y: 58 },
        controllingFaction: 'Parliamentary Moderates'
      },
      {
        id: 'loc-military-hq',
        name: 'Fortress Citadel (High Command)',
        type: 'Military Bastion',
        status: 'Restricted communications blackout enacted.',
        significance: 'Headquarters of the General Staff and war room.',
        coordinates: { x: 62, y: 40 },
        controllingFaction: 'The Imperial Military'
      },
      {
        id: 'loc-royal-residence',
        name: 'Obsidian Palace (Sovereign Sanctum)',
        type: 'Imperial Estate',
        status: 'Under elite Praetorian watch.',
        significance: 'Your personal quarters, private archives, and war console.',
        coordinates: { x: 48, y: 46 },
        controllingFaction: 'Sovereign Household'
      }
    ],

    factions: [
      {
        id: 'fac-military',
        name: 'Imperial Military High Command',
        influence: 82,
        stance: 'suspicious',
        agenda: 'Demand full martial autonomy and immediate border re-armament.'
      },
      {
        id: 'fac-parliament',
        name: 'Parliamentary Moderates',
        influence: 64,
        stance: 'neutral',
        agenda: 'Curtail crown spending and demand civilian ministerial oversight.'
      },
      {
        id: 'fac-confederation',
        name: 'Ostrava Confederation',
        influence: 75,
        stance: 'hostile',
        agenda: 'Exploit internal imperial fractures to seize the Northern Mineral Basin.'
      },
      {
        id: 'fac-household',
        name: 'Praetorian Guard & Household',
        influence: 90,
        stance: 'supportive',
        agenda: 'Safeguard the Archon’s sovereign supremacy at all costs.'
      }
    ],

    events: [
      {
        id: 'ev-1',
        timestamp: '06:30 — Dawn Briefing',
        title: 'Unsanctioned Troop Movement at Northern Gate',
        category: 'crisis',
        description: 'Two mechanized regiments under General Vane’s command broke radio silence and occupied Outpost 9 without Imperial High Command sign-off.',
        urgency: 'high'
      },
      {
        id: 'ev-2',
        timestamp: '04:15 — Intercept',
        title: 'Decrypted Cable from Ostrava High Embassy',
        category: 'whisper',
        description: 'Surveillance Bureau intercepted an encoded telegram mentioning “The Iron Hour approaches; ensure Vance holds the budget.”',
        urgency: 'critical'
      },
      {
        id: 'ev-3',
        timestamp: 'Yesterday — 22:00',
        title: 'Consortium Labor Strike Threat in Outer Provinces',
        category: 'report',
        description: 'Mining guild syndicates issued a 48-hour ultimatum demanding reduction in imperial war tithes.',
        urgency: 'medium'
      }
    ],

    timeline: [
      {
        id: 'tl-1',
        time: 'Turn 1 — 06:00',
        title: 'Ascension & State of the Sovereign Address',
        description: 'You assumed supreme sovereign authority following the late Emperor’s sudden passing.',
        status: 'completed'
      },
      {
        id: 'tl-2',
        time: 'Turn 1 — 12:00',
        title: 'Emergency Imperial War Cabinet Review',
        description: 'Confront General Vane and Chancellor Vance over border movements and blocked grain shipments.',
        status: 'active'
      },
      {
        id: 'tl-3',
        time: 'Turn 2 — Tomorrow',
        title: 'Parliamentary Vote on Emergency Defense Tithes',
        description: 'Ministers will cast ballots on whether to approve emergency military mobilization funding.',
        status: 'upcoming'
      }
    ],

    stats: [
      {
        id: 'stat-stability',
        label: 'Empire Stability Index',
        value: 62,
        max: 100,
        unit: '%',
        trend: 'down',
        status: 'warning',
        description: 'Macro social and ministerial harmony.'
      },
      {
        id: 'stat-military',
        label: 'Military High Command Loyalty',
        value: 52,
        max: 100,
        unit: '%',
        trend: 'down',
        status: 'critical',
        description: 'Allegiance of the field marshals and Praetorian cohorts.'
      },
      {
        id: 'stat-treasury',
        label: 'Imperial Treasury Reserves',
        value: 78,
        max: 100,
        unit: 'M Gold',
        trend: 'stable',
        status: 'good',
        description: 'Liquid state capital available for emergency mobilization.'
      },
      {
        id: 'stat-frontier',
        label: 'Northern Frontier Defense Readiness',
        value: 45,
        max: 100,
        unit: '%',
        trend: 'down',
        status: 'critical',
        description: 'Garrison fortifications against Ostrava incursions.'
      }
    ],

    documents: [
      {
        id: 'doc-1',
        title: 'Classified Surveillance Cable #891-B',
        classification: 'TOP SECRET // IMPERIAL EYES ONLY',
        date: '04:15 Intercept',
        author: 'Director Evelyn Cross',
        content: '“Transcript summary: Chancellor Vance met Ambassador Thorne at a private estate outside the south wall at 02:30. Money was not exchanged, but diplomatic pouch #4 was handed to Vance’s private secretary. Contents unknown.”'
      },
      {
        id: 'doc-2',
        title: 'Imperial Defense Directive 04',
        classification: 'WAR CABINET MEMORANDUM',
        date: 'Three Days Ago',
        author: 'General Corvus Vane',
        content: '“The throne must understand that modern warfare cannot wait for parliamentary votes. If border garrisons are starved of ammunition, High Command will take unilateral action to secure our sovereignty.”'
      }
    ],

    relationships: [
      {
        id: 'rel-1',
        sourceId: 'char-defense-minister',
        targetId: 'char-chancellor',
        sourceName: 'General Vane',
        targetName: 'Chancellor Vance',
        type: 'rivalry',
        intensity: 85,
        description: 'Bitter institutional feud over defense spending allocations and civilian oversight.'
      },
      {
        id: 'rel-2',
        sourceId: 'char-intel-director',
        targetId: 'char-foreign-ambassador',
        sourceName: 'Director Cross',
        targetName: 'Ambassador Thorne',
        type: 'distrust',
        intensity: 90,
        description: 'Active counter-espionage surveillance operation targeting the embassy.'
      }
    ],

    notes: [
      {
        id: 'note-1',
        content: 'Vance and Thorne are coordinating behind my back. Must discover what was inside pouch #4 before the 12:00 cabinet meeting.',
        createdAt: 'Turn #1'
      }
    ],

    rules: [
      { id: 'r1', name: 'Imperial Decree Binding', description: 'Ministers cannot openly defy an imperial seal without facing treason charges.', active: true, category: 'society' },
      { id: 'r2', name: 'Information Delay', description: 'Cables from the frontier take 1 full turn to arrive at the capital.', active: true, category: 'physics' }
    ],

    style: WORLD_STYLE_PRESETS.empire,
    createdAt: new Date().toISOString(),
    turnCount: 1
  },
  uiPlanning: {
    activeLayout: 'theater-of-power',
    suggestedInteractions: [
      'Dispatch Praetorian inspection to the Northern Gate',
      'Audit Chancellor Vance’s ministerial procurement ledger',
      'Summon Ambassador Thorne for emergency diplomatic ultimatum',
      'Declare temporary state of defensive mobilization'
    ],
    blocks: [
      {
        id: 'block-map',
        type: 'map',
        title: 'Strategic Theater & Garrison Territories',
        priority: 'primary',
        colSpan: 2
      },
      {
        id: 'block-stats',
        type: 'stats',
        title: 'Imperial Stability & Resource Vitals',
        priority: 'primary',
        colSpan: 1
      },
      {
        id: 'block-chars',
        type: 'character',
        title: 'Imperial Cabinet & Key Figures',
        priority: 'secondary',
        colSpan: 2
      },
      {
        id: 'block-doc',
        type: 'document',
        title: 'Classified Intelligence Intercepts',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-timeline',
        type: 'timeline',
        title: 'Strategic Campaign Sequence',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-events',
        type: 'event',
        title: 'War Room Dispatches & Alerts',
        priority: 'secondary',
        colSpan: 1
      }
    ]
  }
};

// ==========================================
// WORLD 2: UNIVERSITY CAMPUS
// ==========================================
export const UNIVERSITY_SEED_WORLD: { world: WorldState; uiPlanning: UIPlanning } = {
  world: {
    id: 'world-university-02',
    name: 'St. Jude’s Autumn Semester',
    genre: 'Collegiate Life & Social Sphere',
    premise: 'It is the decisive autumn term of your senior year at an elite historic university. You are juggling a high-stakes acoustics research fellowship, complex friendships, secret societies, and late-night deadlines.',
    atmosphere: 'Amber foliage on stone courtyards, rain-mottled library windows, warm cafe steam, and high-stakes academic pressure.',
    currentSituation: 'Your lab partner Maya hasn’t submitted her chapter of the Turing Fellowship application. Rumor has it the Dean is cutting laboratory grant funding for the music synthesis department.',
    
    // Roles System
    roles: [
      {
        id: 'role-scholar',
        name: 'Alex Morgan',
        title: 'Senior Honors Scholar in Neural Acoustics',
        type: 'PLAYER',
        agency: 'character-level',
        perspective: 'first-person',
        knowledge: 'limited',
        permissions: ['talk', 'move', 'decide'],
        controlledEntityId: 'char-player-scholar',
        controlledEntityName: 'Alex Morgan',
        avatar: '🎓',
        description: 'You are racing against deadlines, maintaining friendships, and trying to secure the department fellowship.',
        suggestedPrompts: [
          'Meet Maya in Studio 4 to discuss the Turing Fellowship',
          'Drop by Black Oak Cafe to read Elena’s underground zine draft',
          'Knock on Professor Sterling’s office door during open hours',
          'Take a late study walk through the Quadrangle to clear head'
        ]
      },
      {
        id: 'role-proctor',
        name: 'Campus Proctor & Dungeon Master',
        title: 'Campus Social Director',
        type: 'DIRECTOR',
        agency: 'world-level',
        perspective: 'omniscient',
        knowledge: 'broad',
        permissions: ['spawn', 'modify', 'reveal', 'schedule', 'narrate'],
        avatar: '🎭',
        description: 'Introduce campus drama, schedule unexpected surprise pop-quizzes, or leak student election rumors.',
        suggestedPrompts: [
          'Spawn an unexpected midnight power blackout in the acoustic lab',
          'Inject a leaked memo from the Dean canceling department funding',
          'Trigger sudden student protest in the Quadrangle'
        ]
      },
      {
        id: 'role-observer',
        name: 'The Campus Chronicler',
        title: 'University Archivist',
        type: 'OBSERVER',
        agency: 'none',
        perspective: 'omniscient',
        knowledge: 'broad',
        permissions: ['observe'],
        avatar: '👁️',
        description: 'Silently observe the social friendships, academic triumphs, and collegiate memories.',
        suggestedPrompts: [
          'Review the week’s completed schedule and social ties'
        ]
      }
    ],
    activeRoleId: 'role-scholar',

    userRole: {
      title: 'Senior Honors Scholar',
      authority: 'Department Lab Lead',
      objective: 'Submit the Turing Capstone Thesis with Maya, protect department funding, and maintain your core friendships.',
      traits: ['Analytical Mind', 'Socially Minded', 'Sleep Deprived']
    },

    characters: [
      {
        id: 'char-maya',
        name: 'Maya Lin',
        role: 'Research Partner & Lab Co-Author',
        faction: 'Acoustics Lab Cohort',
        status: 'Stressed; working late hours on acoustic synthesis code.',
        loyalty: 88,
        summary: 'Your closest academic collaborator. Brilliant, perfectionist, but quietly worried about family tuition debts.'
      },
      {
        id: 'char-sterling',
        name: 'Prof. Arthur Sterling',
        role: 'Department Chair & Fellowship Judge',
        faction: 'Faculty Senate',
        status: 'Demanding, formal; reviewing draft submissions with red pen.',
        loyalty: 70,
        summary: 'A legendary researcher who can make or break academic careers with a single recommendation letter.'
      },
      {
        id: 'char-elena',
        name: 'Elena Rostova',
        role: 'Student Journalist & Editor of The Inkwell',
        faction: 'Campus Press Guild',
        status: 'Investigating rumors of administrative budget redirection.',
        loyalty: 82,
        summary: 'Fearless friend who writes scathing editorials on university tuition hikes and secret donor endowments.'
      },
      {
        id: 'char-julian',
        name: 'Julian Thorne',
        role: 'Student Body President Candidate',
        faction: 'The Quadrangle Society',
        status: 'Campaigning vigorously; promising 24-hour library espresso bars.',
        loyalty: 55,
        summary: 'Charismatic, ambitious rival from the economics department who wants to redirect science grants to business clubs.'
      }
    ],

    locations: [
      {
        id: 'loc-quad',
        name: 'Central Quadrangle & Clocktower',
        type: 'Campus Center',
        status: 'Foliage turning golden; campaign flyers covering the noticeboards.',
        significance: 'Heart of campus life, spontaneous encounters, and open debates.',
        coordinates: { x: 48, y: 50 },
        controllingFaction: 'Student Body'
      },
      {
        id: 'loc-lab',
        name: 'Studio 4 (Neural Acoustics Laboratory)',
        type: 'Research Facility',
        status: 'Oscilloscopes running overnight synthesis passes.',
        significance: 'Where your capstone thesis and fellowship experiments live.',
        coordinates: { x: 70, y: 35 },
        controllingFaction: 'Acoustics Lab Cohort'
      },
      {
        id: 'loc-library',
        name: 'Old Wren Memorial Library',
        type: 'Historic Archive',
        status: 'Quiet study rooms packed with finals prep students.',
        significance: 'Deep stacks containing century-old university records and rare manuscripts.',
        coordinates: { x: 30, y: 40 },
        controllingFaction: 'Faculty Senate'
      },
      {
        id: 'loc-cafe',
        name: 'The Black Oak Cafe',
        type: 'Coffeehouse & Social Hub',
        status: 'Warm espresso steam and acoustic indie music.',
        significance: 'Where drafts are peer-reviewed and secrets are spilled.',
        coordinates: { x: 45, y: 75 },
        controllingFaction: 'Campus Press Guild'
      }
    ],

    factions: [
      {
        id: 'fac-lab',
        name: 'Acoustics Lab Cohort',
        influence: 75,
        stance: 'supportive',
        agenda: 'Deliver a groundbreaking thesis and win the Turing Department Grant.'
      },
      {
        id: 'fac-faculty',
        name: 'Faculty Senate',
        influence: 85,
        stance: 'neutral',
        agenda: 'Enforce strict academic rigor and balance tight departmental budgets.'
      },
      {
        id: 'fac-press',
        name: 'Campus Press Guild',
        influence: 60,
        stance: 'supportive',
        agenda: 'Uncover administrative transparency and support student causes.'
      },
      {
        id: 'fac-quad',
        name: 'The Quadrangle Society',
        influence: 68,
        stance: 'suspicious',
        agenda: 'Win the student election and commercialize campus incubator spaces.'
      }
    ],

    events: [
      {
        id: 'ev-u1',
        timestamp: '08:45 — Noticeboard',
        title: 'Turing Fellowship Shortlist Announced',
        category: 'opportunity',
        description: 'Your project with Maya was officially selected for the final panel review this Friday at 15:00.',
        urgency: 'high'
      },
      {
        id: 'ev-u2',
        timestamp: '07:30 — Campus Buzz',
        title: 'The Inkwell Leaks Memo on Budget Cuts',
        category: 'report',
        description: 'Elena’s front page article exposes administrative plans to cut graduate arts and acoustics lab funding by 30%.',
        urgency: 'medium'
      }
    ],

    timeline: [
      {
        id: 'tl-u1',
        time: '10:00',
        title: 'Neural Audio Capstone Review',
        description: 'Live demonstration with Professor Sterling and Maya in Studio 4.',
        status: 'active'
      },
      {
        id: 'tl-u2',
        time: '13:30',
        title: 'Lunch at Black Oak with Elena',
        description: 'Review the archive draft before zine printing.',
        status: 'upcoming'
      },
      {
        id: 'tl-u3',
        time: '16:00',
        title: 'Student Senate Campaign Debate',
        description: 'Julian addresses student body in the Great Hall.',
        status: 'upcoming'
      }
    ],

    stats: [
      {
        id: 'stat-gpa',
        label: 'Academic Standing (GPA)',
        value: 92,
        max: 100,
        unit: '%',
        trend: 'stable',
        status: 'good',
        description: 'Thesis quality and coursework marks.'
      },
      {
        id: 'stat-energy',
        label: 'Sleep & Energy Buffer',
        value: 48,
        max: 100,
        unit: '%',
        trend: 'down',
        status: 'warning',
        description: 'Cognitive endurance and focus capacity.'
      },
      {
        id: 'stat-social',
        label: 'Peer Social Standing',
        value: 76,
        max: 100,
        unit: '%',
        trend: 'up',
        status: 'good',
        description: 'Goodwill among peers and cohort friends.'
      },
      {
        id: 'stat-curiosity',
        label: 'Archive Investigation',
        value: 65,
        max: 100,
        unit: '%',
        trend: 'up',
        status: 'good',
        description: 'Progress in uncovering university secret records.'
      }
    ],

    documents: [
      {
        id: 'doc-u1',
        title: 'Handwritten Note Found in Lab Coat',
        classification: 'PERSONAL NOTE',
        date: 'Today — 08:45',
        author: 'Maya Lin',
        content: '“I know you saw the fellowship list. I didn’t apply to compete against you, I applied because my family can’t afford next term’s tuition without it. Can we talk after lab?”'
      },
      {
        id: 'doc-u2',
        title: 'Draft Chapter: The Echo Architecture',
        classification: 'THESIS WORKING DRAFT',
        date: 'Draft v4.2',
        author: 'You & Maya',
        content: 'Experimental observations on acoustic resonance models. Sterling marked red ink on page 14: “Brilliant thesis, but who contributed the neural tensor implementation?”'
      }
    ],

    relationships: [
      {
        id: 'rel-u1',
        sourceId: 'char-maya',
        targetId: 'char-julian',
        sourceName: 'Maya',
        targetName: 'Julian',
        type: 'distrust',
        intensity: 60,
        description: 'Maya thinks Julian is using lab data for his Senate campaign pitch.'
      }
    ],

    notes: [
      {
        id: 'note-u1',
        content: 'Maya needs the scholarship for tuition. Must find a way where we both win the department grant.',
        createdAt: 'Morning Reflection'
      }
    ],

    style: WORLD_STYLE_PRESETS.university,
    createdAt: new Date().toISOString(),
    turnCount: 1
  },
  uiPlanning: {
    activeLayout: 'social-campus-mosaic',
    suggestedInteractions: [
      'Meet Maya in Studio 4 to discuss the Turing Fellowship',
      'Drop by Black Oak Cafe to read Elena’s underground zine draft',
      'Knock on Professor Sterling’s office door during open hours',
      'Take a late study walk through the Quadrangle to clear head'
    ],
    blocks: [
      {
        id: 'block-chars-u',
        type: 'character',
        title: 'Social Circle & Academic Cohort',
        priority: 'primary',
        colSpan: 2
      },
      {
        id: 'block-stats-u',
        type: 'stats',
        title: 'Student Vitals & Academic Standing',
        priority: 'primary',
        colSpan: 1
      },
      {
        id: 'block-map-u',
        type: 'map',
        title: 'Campus Grounds & Key Sites',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-timeline-u',
        type: 'timeline',
        title: 'Today’s Schedule & Deadlines',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-doc-u',
        type: 'document',
        title: 'Personal Letters & Lab Logs',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-events-u',
        type: 'event',
        title: 'Campus Buzz & Student Chatter',
        priority: 'secondary',
        colSpan: 1
      }
    ]
  }
};

// ==========================================
// WORLD 3: DETECTIVE MYSTERY
// ==========================================
export const MYSTERY_SEED_WORLD: { world: WorldState; uiPlanning: UIPlanning } = {
  world: {
    id: 'world-mystery-03',
    name: 'The Blackwood Manor Poisoning',
    genre: '1928 Murder Mystery & Detective Noir',
    premise: 'On a stormy autumn night in 1928, eccentric industrialist Lord Reginald Blackwood is found dead in his locked study. The telephone wires are severed, and six suspects with dark secrets remain trapped inside the manor.',
    atmosphere: 'Rain beating against stained glass, flickering candelabras, smelling of bitter almonds and wet wool, ticking grandfather clocks.',
    currentSituation: 'Lord Blackwood collapsed at 22:15 during the reading of his revised will. The room was locked from the inside, but a window latch was found unhooked. Scotland Yard detective Arthur Finch has taken charge.',
    
    // Roles System
    roles: [
      {
        id: 'role-detective',
        name: 'Inspector Arthur Finch',
        title: 'Lead Detective, Scotland Yard',
        type: 'PLAYER',
        agency: 'character-level',
        perspective: 'first-person',
        knowledge: 'limited',
        permissions: ['talk', 'move', 'decide'],
        controlledEntityId: 'char-finch',
        controlledEntityName: 'Inspector Finch',
        avatar: '🔍',
        description: 'Examine clues, question suspects, cross-reference alibis on the evidence board, and identify the killer.',
        suggestedPrompts: [
          'Inspect the poisoned teacup under magnifying lamp',
          'Interrogate Lady Margaret regarding the altered testament',
          'Examine the grandfather clock mechanism for tampering',
          'Compare footprints on the conservatory terrace'
        ]
      },
      {
        id: 'role-novelist',
        name: 'The Shadow Novelist',
        title: 'Mystery & Crime Director',
        type: 'DIRECTOR',
        agency: 'world-level',
        perspective: 'omniscient',
        knowledge: 'broad',
        permissions: ['spawn', 'modify', 'reveal', 'schedule', 'narrate'],
        avatar: '🎭',
        description: 'Plant fake red herrings, trigger another murder attempt, or force a suspect into a nervous confession.',
        suggestedPrompts: [
          'Plant a forged suicide note in Lord Blackwood’s coat pocket',
          'Trigger a sudden thunder strike knocking out all electricity in the manor',
          'Make Butler Higgins attempt to burn a secret ledger in the hearth'
        ]
      },
      {
        id: 'role-observer',
        name: 'Coroner’s Silent Inquest',
        title: 'Forensic Observer',
        type: 'OBSERVER',
        agency: 'none',
        perspective: 'omniscient',
        knowledge: 'omniscient',
        permissions: ['observe'],
        avatar: '👁️',
        description: 'Review the evidence board and chronological events without altering the criminal timeline.',
        suggestedPrompts: [
          'Review all autopsy logs and physical clues'
        ]
      }
    ],
    activeRoleId: 'role-detective',

    userRole: {
      title: 'Scotland Yard Lead Detective',
      authority: 'Full Criminal Investigative Jurisdiction',
      objective: 'Solve the locked-room poisoning of Lord Blackwood before dawn arrives and the killer escapes.',
      traits: ['Deductive Genius', 'Forensic Eye', 'High Skepticism']
    },

    characters: [
      {
        id: 'char-margaret',
        name: 'Lady Margaret Blackwood',
        role: 'Widow of the Deceased',
        faction: 'Blackwood Household',
        status: 'Composed, pale; wearing black pearls and clutching a handkerchief.',
        loyalty: 40,
        suspicionLevel: 75,
        summary: 'Stood to be disinherited under the new testament drafted this afternoon. Claims she was in the library reading poetry at 22:00.'
      },
      {
        id: 'char-edgar',
        name: 'Edgar Blackwood (Nephew)',
        role: 'Disgraced Heir & Gambler',
        faction: 'Heirs & Beneficiaries',
        status: 'Nervous; hands shaking as he drinks whiskey.',
        loyalty: 35,
        suspicionLevel: 85,
        summary: 'Heavily indebted to London underground bookmakers. Seen arguing fiercely with Lord Blackwood over debts at 21:30.'
      },
      {
        id: 'char-higgins',
        name: 'Archibald Higgins',
        role: 'Head Butler of Blackwood Manor',
        faction: 'Manor Staff',
        status: 'Impeccable, guarded; holds the master ring of keys.',
        loyalty: 70,
        suspicionLevel: 50,
        summary: 'Served Lord Blackwood for 32 years. Prepared the evening chamomile tea tray delivered to the locked study at 22:00.'
      },
      {
        id: 'char-dr-hall',
        name: 'Dr. Alistair Hall',
        role: 'Family Physician & Toxicologist',
        faction: 'Professional Associates',
        status: 'Performing emergency preliminary autopsy in the salon.',
        loyalty: 65,
        suspicionLevel: 60,
        summary: 'Confirmed potassium cyanide poisoning. Was carrying medical satchel with restricted narcotics.'
      }
    ],

    locations: [
      {
        id: 'loc-study',
        name: 'The Locked Study (Crime Scene)',
        type: 'Crime Scene',
        status: 'Sealed off by police tape. Fireplace still smoldering.',
        significance: 'Where Lord Blackwood collapsed at his mahogany desk.',
        coordinates: { x: 52, y: 38 },
        controllingFaction: 'Scotland Yard'
      },
      {
        id: 'loc-conservatory',
        name: 'The Glass Conservatory',
        type: 'Manor Wing',
        status: 'Rain hammering against glass panes. Fresh muddy boots marks near door.',
        significance: 'Direct outdoor access path to the study window terrace.',
        coordinates: { x: 80, y: 65 },
        controllingFaction: 'Manor Staff'
      },
      {
        id: 'loc-salon',
        name: 'Grand Drawing Room',
        type: 'Common Area',
        status: 'Suspects detained by police constable for questioning.',
        significance: 'Where the heirs gathered when the scream was heard.',
        coordinates: { x: 40, y: 60 },
        controllingFaction: 'Blackwood Household'
      },
      {
        id: 'loc-kitchen',
        name: 'The Butler’s Pantry & Kitchen',
        type: 'Service Area',
        status: 'Tea kettle and porcelain cups inspected for chemical traces.',
        significance: 'Where the fatal cup of chamomile tea was brewed.',
        coordinates: { x: 25, y: 75 },
        controllingFaction: 'Manor Staff'
      }
    ],

    factions: [
      {
        id: 'fac-heirs',
        name: 'Heirs & Beneficiaries',
        influence: 70,
        stance: 'hostile',
        agenda: 'Protect inheritance claims and deflect suspicion onto the household staff.'
      },
      {
        id: 'fac-staff',
        name: 'Manor Household Staff',
        influence: 55,
        stance: 'suspicious',
        agenda: 'Preserve their reputation and avoid being scapegoated by the wealthy heirs.'
      },
      {
        id: 'fac-police',
        name: 'Scotland Yard Investigation Team',
        influence: 90,
        stance: 'supportive',
        agenda: 'Uncover the truth and secure admissible physical evidence before sunrise.'
      }
    ],

    clues: [
      {
        id: 'clue-1',
        title: 'Poisoned Chamomile Teacup',
        category: 'physical',
        description: 'Fine porcelain teacup found next to the victim. Faint scent of bitter almonds and blue chemical residue along the rim.',
        significance: 'Delivered cyanide vehicle. Dr. Hall estimates ingestion happened 10 minutes prior to collapse.',
        relatedSuspectId: 'char-higgins',
        relatedLocationId: 'loc-study',
        status: 'connected',
        connectedTo: ['clue-2', 'char-higgins']
      },
      {
        id: 'clue-2',
        title: 'Torn Testament Draft in Hearth',
        category: 'documentary',
        description: 'Partially burned sheet of legal parchment retrieved from fireplace embers: “I hereby revoke all previous bequests to Lady Margaret and Edgar...”',
        significance: 'Direct financial motive established for both widow and nephew.',
        relatedSuspectId: 'char-margaret',
        relatedLocationId: 'loc-study',
        status: 'connected',
        connectedTo: ['char-margaret', 'char-edgar']
      },
      {
        id: 'clue-3',
        title: 'Unhooked Window Latch & Muddy Print',
        category: 'environmental',
        description: 'The study window was unlatched from inside. A fresh size 9 mud smudge was found on the outside marble terrace.',
        significance: 'Shows potential escape route or staging to fake a locked-room scenario.',
        relatedSuspectId: 'char-edgar',
        relatedLocationId: 'loc-conservatory',
        status: 'unsolved',
        connectedTo: ['loc-conservatory']
      },
      {
        id: 'clue-4',
        title: 'Grandfather Clock Stopped at 22:15',
        category: 'physical',
        description: 'The pendulum clock in the hallway stopped abruptly at 22:15 due to a thin wire wedged into the gear cog.',
        significance: 'Possible attempt to fabricate or manipulate alibi timing.',
        relatedLocationId: 'loc-study',
        status: 'unsolved'
      }
    ],

    events: [
      {
        id: 'ev-m1',
        timestamp: '22:15 — The Murder',
        title: 'Lord Blackwood Collapses in Locked Study',
        category: 'crisis',
        description: 'A loud crash of porcelain was heard. Higgins and Edgar broke down the oak door to find Lord Blackwood dead at his desk.',
        urgency: 'critical'
      },
      {
        id: 'ev-m2',
        timestamp: '22:45 — Discovery',
        title: 'Severed Telephone Lines Found in Cellar',
        category: 'discovery',
        description: 'Constable Miller discovered the main copper telephone line was deliberately cut with pruning shears.',
        urgency: 'high'
      }
    ],

    timeline: [
      {
        id: 'tl-m1',
        time: '21:00',
        title: 'Dinner Concludes in Dining Room',
        description: 'Heirs disperse; Lord Blackwood announces he will finalize his new testament in private.',
        status: 'completed'
      },
      {
        id: 'tl-m2',
        time: '21:45',
        title: 'Tea Tray Prepared by Butler Higgins',
        description: 'Chamomile tea steeped in kitchen and carried upstairs to the study.',
        status: 'completed'
      },
      {
        id: 'tl-m3',
        time: '22:15',
        title: 'Lethal Collapse & Door Breached',
        description: 'Victim discovered dead; Dr. Hall pronounces cyanide poisoning.',
        status: 'completed'
      },
      {
        id: 'tl-m4',
        time: 'Now — 23:00',
        title: 'Scotland Yard Interrogations Begin',
        description: 'Inspector Finch begins formal suspect cross-examination in the Drawing Room.',
        status: 'active'
      }
    ],

    stats: [
      {
        id: 'stat-case-solvability',
        label: 'Case Evidence Integrity',
        value: 75,
        max: 100,
        unit: '%',
        trend: 'up',
        status: 'good',
        description: 'Percentage of physical clues securely documented.'
      },
      {
        id: 'stat-suspect-panic',
        label: 'Suspect Nervousness / Friction',
        value: 82,
        max: 100,
        unit: '%',
        trend: 'up',
        status: 'warning',
        description: 'Psychological tension under interrogation.'
      },
      {
        id: 'stat-storm',
        label: 'Time Until Dawn Escape Window',
        value: 5,
        max: 8,
        unit: 'Hours',
        trend: 'down',
        status: 'critical',
        description: 'Hours remaining before the storm clears and roads open.'
      }
    ],

    documents: [
      {
        id: 'doc-m1',
        title: 'Preliminary Toxicology Report',
        classification: 'CORONER’S PRELIMINARY AUTOPSY',
        date: '22:45 — Tonight',
        author: 'Dr. Alistair Hall, MD',
        content: '“Subject: Lord Reginald Blackwood. Cause of death: Acute respiratory arrest from lethal ingestion of potassium cyanide. Cyanide concentration suggests fast-acting solution mixed directly into hot liquid.”'
      },
      {
        id: 'doc-m2',
        title: 'Telegram from London Solicitors',
        classification: 'LEGAL CORRESPONDENCE',
        date: 'Yesterday — 14:20',
        author: 'Finch & Gable Barristers',
        content: '“To Lord Blackwood: We confirm receipt of your instructions to disinherit Edgar Blackwood and transfer the estate endowment to the Royal Botanical Society.”'
      }
    ],

    relationships: [
      {
        id: 'rel-m1',
        sourceId: 'char-margaret',
        targetId: 'char-edgar',
        sourceName: 'Lady Margaret',
        targetName: 'Edgar',
        type: 'distrust',
        intensity: 80,
        description: 'Suspicious of each other; each claims the other had more reason to poison the tea.'
      }
    ],

    notes: [
      {
        id: 'note-m1',
        content: 'The study window was unlatched from INSIDE. The killer was already in the room when the tea was delivered, or Higgins let them in with his key.',
        createdAt: '23:00 — Finch Diary'
      }
    ],

    style: WORLD_STYLE_PRESETS.mystery,
    createdAt: new Date().toISOString(),
    turnCount: 1
  },
  uiPlanning: {
    activeLayout: 'detective-corkboard',
    suggestedInteractions: [
      'Inspect the poisoned teacup under magnifying lamp',
      'Interrogate Lady Margaret regarding the altered testament',
      'Examine the grandfather clock mechanism for tampering',
      'Compare footprints on the conservatory terrace'
    ],
    blocks: [
      {
        id: 'block-evidence',
        type: 'evidence-board',
        title: 'Case Evidence & Deduction Board',
        priority: 'primary',
        colSpan: 2
      },
      {
        id: 'block-suspects',
        type: 'character',
        title: 'Suspects & Interrogation Roster',
        priority: 'primary',
        colSpan: 1
      },
      {
        id: 'block-doc-m',
        type: 'document',
        title: 'Autopsy & Case Records',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-map-m',
        type: 'map',
        title: 'Blackwood Manor Floor Plan',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-timeline-m',
        type: 'timeline',
        title: 'Murder Night Alibi Chronology',
        priority: 'secondary',
        colSpan: 1
      }
    ]
  }
};

export const DEMO_PRESETS = [
  {
    id: 'empire',
    title: 'THE SOVEREIGN IMPERIUM',
    subtitle: 'A vast authoritarian empire begins to fracture from within.',
    tag: 'Political Intrigue',
    genre: 'Political Simulation',
    preset: EMPIRE_SEED_WORLD
  },
  {
    id: 'university',
    title: 'ST. JUDE’S AUTUMN SEMESTER',
    subtitle: 'Senior year honors thesis, secret societies, and collegiate friendships.',
    tag: 'Collegiate Life',
    genre: 'Collegiate Social Drama',
    preset: UNIVERSITY_SEED_WORLD
  },
  {
    id: 'mystery',
    title: 'THE BLACKWOOD POISONING',
    subtitle: 'A locked-room cyanide mystery in a rain-swept 1928 manor.',
    tag: 'Detective Mystery',
    genre: '1928 Murder Mystery',
    preset: MYSTERY_SEED_WORLD
  }
];
