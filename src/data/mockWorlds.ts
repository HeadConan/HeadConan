import { WorldState, UIPlanning } from '../world/types';

export const EMPIRE_SEED_WORLD: { world: WorldState; uiPlanning: UIPlanning } = {
  world: {
    id: 'world-empire-01',
    name: 'The Sovereign Imperium of Valen',
    genre: 'Political Simulation & Authoritarian Intrigue',
    premise: 'A vast fictional empire is beginning to fracture beneath silent institutional conspiracies, rising border skirmishes, and shadow cabinet rivalries. You have just assumed supreme sovereign power.',
    atmosphere: 'Ominous marble corridors, suppressed telegrams, rain-swept border watchtowers, and whispered court loyalties.',
    currentSituation: 'General Vane reports unusual armored division movements along the Northern Border without direct imperial clearance. Meanwhile, the industrial consortium threatens labor lockouts in the outer provinces.',
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
        name: 'Parliamentary Assembly',
        influence: 64,
        stance: 'neutral',
        agenda: 'Limit Archon decree authority and reduce military spending.'
      },
      {
        id: 'fac-intel',
        name: 'Directorate of Intelligence',
        influence: 75,
        stance: 'supportive',
        agenda: 'Expand nationwide wiretap networks and purge corrupt governors.'
      },
      {
        id: 'fac-industrial',
        name: 'Industrial Consortium',
        influence: 58,
        stance: 'hostile',
        agenda: 'Protect private arms contracts and suppress rail-worker strikes.'
      },
      {
        id: 'fac-opposition',
        name: 'Clandestine Opposition',
        influence: 40,
        stance: 'hostile',
        agenda: 'Distribute underground pamphlets calling for general disobedience.'
      }
    ],
    events: [
      {
        id: 'evt-01',
        timestamp: '06:30 Today',
        title: 'Unsanctioned Troop Movement on Northern Perimeter',
        category: 'crisis',
        description: 'Two mechanized regiments under Marshal Vane relocated toward Sector 4 without ministerial war orders.',
        urgency: 'critical'
      },
      {
        id: 'evt-02',
        timestamp: '08:15 Today',
        title: 'Confidential Cable: Ostrava Embassy Arms Deal',
        category: 'whisper',
        description: 'Director Cross intercepted encrypted bank transfers linking Ambassador Thorne to private accounts in Parliament.',
        urgency: 'high'
      },
      {
        id: 'evt-03',
        timestamp: '09:45 Today',
        title: 'Industrial Rail Strike Threat in Sector 9',
        category: 'report',
        description: 'Consortium factory chiefs warn that weapons manufacturing will stall unless coal subsidies are doubled.',
        urgency: 'medium'
      }
    ],
    timeline: [
      {
        id: 'tl-01',
        time: '08:00',
        title: 'Imperial Council Assembly',
        description: 'Closed-door meeting with Chancellor Vance and General Vane.',
        status: 'active'
      },
      {
        id: 'tl-02',
        time: '11:30',
        title: 'Northern Border Telemetry Briefing',
        description: 'Director Cross submits intercepted telegraph decryption files.',
        status: 'upcoming'
      },
      {
        id: 'tl-03',
        time: '14:00',
        title: 'Private Audience with Ambassador Thorne',
        description: 'Diplomatic showdown regarding trade blockades and border guarantees.',
        status: 'upcoming'
      },
      {
        id: 'tl-04',
        time: '19:30',
        title: 'Secret Praetorian Intelligence Review',
        description: 'Audit of loyalty pledges across the five ministerial bureaus.',
        status: 'upcoming'
      }
    ],
    stats: [
      {
        id: 'stat-stability',
        label: 'Imperial Stability',
        value: 62,
        max: 100,
        unit: '%',
        trend: 'down',
        status: 'warning',
        description: 'Civilian order throughout metropolitan provinces.'
      },
      {
        id: 'stat-military-loyalty',
        label: 'Military Loyalty',
        value: 54,
        max: 100,
        unit: '%',
        trend: 'down',
        status: 'warning',
        description: 'High Command allegiance to the Archon throne.'
      },
      {
        id: 'stat-treasury',
        label: 'Imperial Treasury',
        value: 78,
        max: 100,
        unit: 'M',
        trend: 'stable',
        status: 'good',
        description: 'Liquid reserves for defense and social subsidies.'
      },
      {
        id: 'stat-intel-control',
        label: 'Surveillance Reach',
        value: 84,
        max: 100,
        unit: '%',
        trend: 'up',
        status: 'good',
        description: 'Network interception efficiency across key infrastructure.'
      }
    ],
    documents: [
      {
        id: 'doc-01',
        title: 'EYES ONLY: Memo on High Command Maneuvers',
        classification: 'TOP SECRET // IMPERIAL EYES ONLY',
        date: 'Day 1 — 06:12 Hours',
        author: 'Director Evelyn Cross (Bureau of Intelligence)',
        content: 'Your Sovereignty: At 04:00 hours, telegraph lines to Northern Border Outpost 7 went dead for 42 minutes. Satellite and carrier surveillance indicates Marshal Vane authorized the re-deployment of 4,000 elite vanguard legionnaires. Chancellor Vance signed the fuel requisition without forwarding copies to your desk. We suspect an imminent ultimatum.'
      },
      {
        id: 'doc-02',
        title: 'Intercepted Ostrava Diplomatic Pouch',
        classification: 'CONFIDENTIAL // DECRYPTED',
        date: 'Day 1 — 07:30 Hours',
        author: 'Ambassador Sola Thorne',
        content: 'To the Ostrava High Chancellery: The new Archon is untested. If we squeeze the grain transit routes now while Vane pressures the frontier, the throne will concede sovereign tariffs within a fortnight.'
      }
    ],
    relationships: [
      {
        id: 'rel-1',
        sourceId: 'char-defense-minister',
        targetId: 'char-chancellor',
        sourceName: 'General Vane',
        targetName: 'Chancellor Vance',
        type: 'distrust',
        intensity: 75,
        description: 'Vane views Vance as a weak bean-counter; Vance fears a military coup.'
      },
      {
        id: 'rel-2',
        sourceId: 'char-intel-director',
        targetId: 'char-foreign-ambassador',
        sourceName: 'Director Cross',
        targetName: 'Ambassador Thorne',
        type: 'rivalry',
        intensity: 90,
        description: 'Cross has bugged Thorne’s embassy; Thorne knows and feeds false dispatches.'
      }
    ],
    notes: [
      {
        id: 'note-1',
        content: 'Vane’s loyalty is fragile. Do not confront him publicly without securing the Praetorian Guard first.',
        createdAt: 'Day 1 — Initial Thought'
      }
    ],
    createdAt: new Date().toISOString(),
    turnCount: 1
  },
  uiPlanning: {
    activeLayout: 'workspace',
    suggestedInteractions: [
      'Summon General Vane to the Obsidian Palace for direct questioning',
      'Order Director Cross to freeze Chancellor Vance’s ministerial accounts',
      'Deploy the Praetorian Guard to secure the Grand Assembly Hall',
      'Send a diplomatic courier offering terms to Ambassador Thorne'
    ],
    blocks: [
      {
        id: 'block-map',
        type: 'map',
        title: 'Strategic Realm & Frontier Telemetry',
        priority: 'primary',
        colSpan: 2
      },
      {
        id: 'block-stats',
        type: 'stats',
        title: 'Imperial State Indicators',
        priority: 'primary',
        colSpan: 1
      },
      {
        id: 'block-chars',
        type: 'character',
        title: 'Cabinet & Sovereign Council',
        priority: 'primary',
        colSpan: 2
      },
      {
        id: 'block-events',
        type: 'event',
        title: 'Urgent Tensions & Live Dispatches',
        priority: 'secondary',
        colSpan: 1
      },
      {
        id: 'block-doc',
        type: 'document',
        title: 'Classified Intelligence Briefing',
        priority: 'secondary',
        colSpan: 2
      },
      {
        id: 'block-timeline',
        type: 'timeline',
        title: 'Imperial Schedule & Active Clock',
        priority: 'secondary',
        colSpan: 1
      }
    ]
  }
};

export const UNIVERSITY_SEED_WORLD: { world: WorldState; uiPlanning: UIPlanning } = {
  world: {
    id: 'world-university-02',
    name: 'St. Jude’s Autumn Semester',
    genre: 'Campus Drama & High-Stakes Collegiate Life',
    premise: 'One crucial university semester. Prestigious scholarship deadlines, mysterious secret societies, intense late-night studio crits, and romantic ambiguities collide.',
    atmosphere: 'Ivy-covered brick arches, rain on library stained glass, espresso vapor, late night chalkboard drafts, and whispered rumors in the courtyard.',
    currentSituation: 'Midterm project assignments were announced alongside the exclusive Turing Fellowship candidates. Maya seems distant after last night’s lab disagreement, while Professor Sterling hinted at an unannounced evaluation.',
    userRole: {
      title: 'Senior Honors Student',
      authority: 'Lab Co-Lead & Student Journal Editor',
      objective: 'Balance your capstone thesis, maintain your top GPA, navigate friendships and romance, and uncover what happened to last semester’s archive records.',
      traits: ['Analytical Insight', 'High Workload', 'Campus Social Networker']
    },
    characters: [
      {
        id: 'char-maya',
        name: 'Maya Lin',
        role: 'Research Partner & Violinist',
        faction: 'Acoustic AI Lab',
        status: 'Working late in Studio 4; avoiding eye contact after yesterday.',
        loyalty: 78,
        summary: 'Brilliant, fiercely competitive, yet secretly burnt out. You two share the capstone lead.'
      },
      {
        id: 'char-julian',
        name: 'Julian Thorne',
        role: 'Rowing Captain & Campus Politician',
        faction: 'Student Senate & Varsity',
        status: 'Campaigning for Student Union President; hosting a mixer tonight.',
        loyalty: 60,
        summary: 'Charming, well-connected, but prone to taking credit for group lab efforts.'
      },
      {
        id: 'char-prof-sterling',
        name: 'Prof. Arthur Sterling',
        role: 'Head of Department & Thesis Advisor',
        faction: 'Faculty Directorate',
        status: 'Demanding draft revision by 17:00; reviewing Turing nominees.',
        loyalty: 70,
        summary: 'Old-school academic legend. Has high expectations and rarely offers praise.'
      },
      {
        id: 'char-elena',
        name: 'Elena Rostova',
        role: 'Underground Zine Publisher & Barista',
        faction: 'Arts Collective',
        status: 'Holding copies of the banned campus exposé article.',
        loyalty: 88,
        summary: 'Knows every secret door on campus. Tells you the university is quietly selling the heritage library.'
      }
    ],
    locations: [
      {
        id: 'loc-lab',
        name: 'Patterson Neural & Audio Lab (Rm 304)',
        type: 'Research Facility',
        status: 'Oscilloscopes running overnight sound synthesis runs.',
        significance: 'Primary capstone research site and workbench.',
        coordinates: { x: 42, y: 35 },
        controllingFaction: 'Acoustic AI Lab'
      },
      {
        id: 'loc-library',
        name: 'St. Jude Old Quadrangle Library',
        type: 'Heritage Study Hall',
        status: 'Whisper-only protocol; archive basement locked.',
        significance: 'Quiet sanctuary and location of historic student journals.',
        coordinates: { x: 65, y: 48 },
        controllingFaction: 'Faculty Directorate'
      },
      {
        id: 'loc-cafe',
        name: 'The Black Oak Cafe & Roastery',
        type: 'Social Hub',
        status: 'Crowded; student debate on upcoming Senate election.',
        significance: 'Casual meeting point, rumors, and coffee sustenance.',
        coordinates: { x: 30, y: 68 },
        controllingFaction: 'Arts Collective'
      },
      {
        id: 'loc-dorm',
        name: 'Ashdown Hall (Suite 4B)',
        type: 'Student Residence',
        status: 'Sticky notes on the corkboard; messy desk lamp on.',
        significance: 'Your private retreat, journal writing, and sleep recovery.',
        coordinates: { x: 75, y: 72 },
        controllingFaction: 'Student Senate'
      }
    ],
    factions: [
      {
        id: 'fac-lab',
        name: 'The Senior Thesis Cohort',
        influence: 75,
        stance: 'supportive',
        agenda: 'Deliver a breakthrough conference paper before the November deadline.'
      },
      {
        id: 'fac-senate',
        name: 'Student Senate Council',
        influence: 65,
        stance: 'neutral',
        agenda: 'Secure university funding for the new sports pavilion over humanities.'
      },
      {
        id: 'fac-faculty',
        name: 'Academic Advisory Board',
        influence: 85,
        stance: 'neutral',
        agenda: 'Uphold strict grading curves and select the single Turing Fellow.'
      },
      {
        id: 'fac-collective',
        name: 'The Midnight Arts Collective',
        influence: 50,
        stance: 'supportive',
        agenda: 'Expose administrative privatization plans in the underground zine.'
      }
    ],
    events: [
      {
        id: 'evt-u1',
        timestamp: '09:00 Morning',
        title: 'Turing Fellowship Shortlist Leaked',
        category: 'whisper',
        description: 'A flyer on the bulletin board lists you and Maya as the top two finalists.',
        urgency: 'high'
      },
      {
        id: 'evt-u2',
        timestamp: '11:15 Morning',
        title: 'Audio Lab Machine Glitch',
        category: 'crisis',
        description: 'Server partition 3 experienced an unexpected file overwrite during Maya’s run.',
        urgency: 'medium'
      },
      {
        id: 'evt-u3',
        timestamp: '13:00 Afternoon',
        title: 'Midnight Coffee Mixer Invitation',
        category: 'opportunity',
        description: 'Elena left a cryptic handwritten note inside your locker with an address.',
        urgency: 'low'
      }
    ],
    timeline: [
      {
        id: 'tl-u1',
        time: '10:00',
        title: 'Neural Audio Capstone Review',
        description: 'Live demonstration with Professor Sterling and Maya.',
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
      },
      {
        id: 'tl-u4',
        time: '21:00',
        title: 'Late Night Library Study Session',
        description: 'Prepare revision for the Turing Fellowship panel.',
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
        label: 'Sleep & Energy Reserves',
        value: 48,
        max: 100,
        unit: '%',
        trend: 'down',
        status: 'warning',
        description: 'Cognitive endurance and focus buffer.'
      },
      {
        id: 'stat-social',
        label: 'Social Standing & Trust',
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
    createdAt: new Date().toISOString(),
    turnCount: 1
  },
  uiPlanning: {
    activeLayout: 'workspace',
    suggestedInteractions: [
      'Meet Maya in Studio 4 to talk openly about the fellowship',
      'Head to Black Oak Cafe to read Elena’s underground zine draft',
      'Schedule a private office hour meeting with Professor Sterling',
      'Take a breather at the dorm to recharge sleep and review lab logs'
    ],
    blocks: [
      {
        id: 'block-chars-u',
        type: 'character',
        title: 'Social Circle & Key Figures',
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
        title: 'Campus Geography & Key Sites',
        priority: 'primary',
        colSpan: 2
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
        colSpan: 2
      },
      {
        id: 'block-events-u',
        type: 'event',
        title: 'Campus Ticker & Active Buzz',
        priority: 'secondary',
        colSpan: 1
      }
    ]
  }
};

export const DEMO_PRESETS = [
  {
    id: 'empire',
    title: 'BECOME A RULER',
    subtitle: 'A fictional empire is beginning to fracture.',
    tag: 'Political Simulation',
    preset: EMPIRE_SEED_WORLD
  },
  {
    id: 'university',
    title: 'A SEMESTER TO REMEMBER',
    subtitle: 'One university semester. Too many people. Too little time.',
    tag: 'Collegiate Life',
    preset: UNIVERSITY_SEED_WORLD
  },
  {
    id: 'last-city',
    title: 'THE LAST CITY',
    subtitle: 'Humanity survives inside a citadel surrounded by unknown territory.',
    tag: 'Sci-Fi Survival',
    prompt: 'Humanity lives in The Last City surrounded by an unmapped anomaly storm called The Veil. Energy cores are failing and the expedition guild seeks volunteers.'
  },
  {
    id: 'alternate-history',
    title: 'A WORLD THAT NEVER EXISTED',
    subtitle: 'Explore an alternate-history civilization where technology evolved differently.',
    tag: 'Alternate History',
    prompt: 'An alternate 1920s where atmospheric ether telegraphy and vacuum-tube mechanical automata govern European diplomacy.'
  }
];
