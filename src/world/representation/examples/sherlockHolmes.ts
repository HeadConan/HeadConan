/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Test World 3: SHERLOCK HOLMES (Victorian Detective Fiction)
 * 
 * Benchmark Stress Tests:
 * - Pure deductive investigation & forensic logic
 * - Objective ground truth vs suspect testimonies & misleading clues
 * - Epistemic uncertainty & scientific reasoning
 * - Intimate intellectual partnership (Holmes & Watson) vs institutional police bureaucracy
 */

import { WorldDefinition } from '../types/definition';
import { WorldStateInstance } from '../types/state';

export const SHERLOCK_HOLMES_WORLD_DEFINITION: WorldDefinition = {
  id: 'world:sherlock_holmes',
  name: 'Sherlock Holmes — Victorian London (1895)',
  tagline: 'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
  premise: 'In late Victorian London, the eccentric consulting detective Sherlock Holmes and Dr. John Watson investigate baffling crimes that confound Scotland Yard. Behind eerie occult rumors or impossible locked rooms lies rigorous chemical, physical, and human causality.',
  version: {
    schemaVersion: '1.0.0',
    definitionVersion: '1.0.0',
    revision: 1,
    lastUpdated: '2026-08-26'
  },

  // 1. Axioms
  axioms: [
    {
      id: 'axiom:sh:locard_exchange',
      statement: 'Every contact leaves a trace; no crime can occur without physical or chemical evidentiary residue.',
      type: 'forensic_truth',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'natural_law',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:sh:naturalist_rationalism',
      statement: 'Supernatural occurrences are psychological illusions, optical tricks, chemical intoxications, or staged deceptions.',
      type: 'metaphysical_law',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'natural_law',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:sh:victorian_class_code',
      statement: 'High society Victorian nobility will pay fortunes to conceal personal scandals from tabloid presses.',
      type: 'social_contract',
      scope: 'regional',
      isImmutable: false,
      enforcementMechanism: 'social_retribution',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    }
  ],

  // 2. Ontological Capabilities
  capabilities: [
    {
      id: 'cap:singular_deduction',
      name: 'Singular Forensic Deduction',
      domain: 'forensic',
      description: 'Reconstruct a suspect’s past 48 hours and trade from soil on boot heels, cigar ash, and cuff wear.'
    },
    {
      id: 'cap:chemical_toxicology_analysis',
      name: 'Chemical & Toxicological Lab Analysis',
      domain: 'cognitive',
      description: 'Isolate rare alkaloids, blood reagents, and synthetic poisons using chemical apparatus.'
    },
    {
      id: 'cap:scotland_yard_constabulary',
      name: 'Metropolitan Police Constabulary Powers',
      domain: 'institutional',
      description: 'Issue official arrest warrants, seal crime scenes, and conduct formal lockups.'
    }
  ],

  // 3. Baseline Entities
  characters: [
    {
      id: 'char:sherlock_holmes',
      kind: 'character',
      name: 'Sherlock Holmes',
      aliases: ['The Great Detective', 'Consulting Detective of 221B'],
      description: 'The world’s only unofficial consulting detective; an intellectual titan driven by obsessive curiosity and chemical empiricism.',
      tags: ['detective', 'chemist', 'baker_street'],
      canonStatus: 'canonical',
      archetypeRole: 'Master Consulting Detective',
      organizationIds: ['org:baker_street_practice'],
      primaryLocationId: 'loc:221b_baker_street',
      personality: {
        temperament: 'analytical',
        moralAlignment: 'principled',
        primaryValues: ['Objective Truth', 'Intellectual Stimulation', 'Justice over Mere Law'],
        fatalFlaw: 'Boredom-induced melancholy and dismissiveness of conventional social niceties',
        socialMask: 'Brilliant, detached, hyper-observant gentleman'
      },
      goals: [
        {
          id: 'goal:solve_blackwood_conspiracy',
          description: 'Demystify the supposed supernatural resurrection of Lord Blackwood and prove scientific fraud',
          priority: 'primary',
          progressPercent: 40,
          isSecret: false
        }
      ],
      needs: [
        { type: 'epistemic_truth', urgency: 100, satisfactionStatus: 'deprived' },
        { type: 'autonomy', urgency: 90, satisfactionStatus: 'fulfilled' }
      ],
      knownFactIds: [
        'fact:rhododendron_toxicology',
        'fact:blackwood_coffin_tampered'
      ],
      beliefs: [],
      secretFactIds: [],
      capabilities: ['cap:singular_deduction', 'cap:chemical_toxicology_analysis'],
      socialPermissions: ['access:scotland_yard_morgue', 'inspect:crime_scenes'],
      currentLocationId: 'loc:221b_baker_street',
      currentActivity: 'Heating a chemical test tube over a Bunsen burner while playing violin',
      emotionalState: 'Feverishly stimulated by a strange case',
      publicReputationScore: 88,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:john_watson',
      kind: 'character',
      name: 'Dr. John H. Watson',
      aliases: ['Watson', 'Dr. Watson'],
      description: 'Former British Army surgeon (5th Northumberland Fusiliers), loyal biographer, and moral compass of 221B Baker Street.',
      tags: ['doctor', 'veteran', 'biographer', 'baker_street'],
      canonStatus: 'canonical',
      archetypeRole: 'Loyal Biographer & Medical Partner',
      organizationIds: ['org:baker_street_practice'],
      primaryLocationId: 'loc:221b_baker_street',
      personality: {
        temperament: 'charismatic',
        moralAlignment: 'principled',
        primaryValues: ['Duty', 'Honor', 'Medical Ethics', 'Protecting Holmes'],
        fatalFlaw: 'Overly conventional Victorian expectations',
        socialMask: 'Courteous, upright British gentleman and physician'
      },
      goals: [
        {
          id: 'goal:record_holmes_chronicles',
          description: 'Faithfully document Holmes’s deductive triumphs for publication in The Strand Magazine',
          priority: 'secondary',
          progressPercent: 70,
          isSecret: false
        }
      ],
      needs: [
        { type: 'social_belonging', urgency: 85, satisfactionStatus: 'fulfilled' },
        { type: 'purpose', urgency: 80, satisfactionStatus: 'fulfilled' }
      ],
      knownFactIds: ['fact:rhododendron_toxicology'],
      beliefs: [],
      secretFactIds: [],
      capabilities: ['cap:chemical_toxicology_analysis'],
      socialPermissions: ['practice_medicine', 'inspect:crime_scenes'],
      currentLocationId: 'loc:221b_baker_street',
      currentActivity: 'Dipping steel pen in ink, drafting case notes for The Strand',
      emotionalState: 'Calm, observant, and supportive',
      publicReputationScore: 82,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:inspector_lestrade',
      kind: 'character',
      name: 'Inspector G. Lestrade',
      aliases: ['Lestrade', 'The Scotland Yard Man'],
      description: 'Diligent Scotland Yard detective inspector who frequently seeks Holmes’s insight when conventional methods fail.',
      tags: ['police', 'scotland_yard', 'inspector'],
      canonStatus: 'canonical',
      archetypeRole: 'Bureaucratic Police Inspector',
      organizationIds: ['org:scotland_yard'],
      primaryLocationId: 'loc:scotland_yard_office',
      personality: {
        temperament: 'stoic',
        moralAlignment: 'loyalist',
        primaryValues: ['Police Procedure', 'Securing Convictions', 'Protecting Public Order'],
        fatalFlaw: 'Lacks imaginative hypothesis formation; leaps to obvious suspects',
        socialMask: 'Gruff, matter-of-fact Scotland Yard official'
      },
      goals: [
        {
          id: 'goal:close_blackwood_case',
          description: 'Arrest the culprits behind the crypt desecration and calm London hysteria',
          priority: 'primary',
          progressPercent: 30,
          isSecret: false
        }
      ],
      needs: [
        { type: 'status', urgency: 80, satisfactionStatus: 'strained' }
      ],
      knownFactIds: ['fact:blackwood_coffin_tampered'],
      beliefs: [
        {
          id: 'belief:grave_robbers_did_it',
          statement: 'Lord Blackwood’s grave was broken open by regular resurrectionist medical body snatchers.',
          confidence: 0.75,
          isFactuallyAccurate: false,
          sourceType: 'inference'
        }
      ],
      secretFactIds: [],
      capabilities: ['cap:scotland_yard_constabulary'],
      socialPermissions: ['order:police_lockup', 'seal_crime_scenes'],
      currentLocationId: 'loc:scotland_yard_office',
      currentActivity: 'Stamping arrest warrants and fielding inquiries from the Daily Telegraph',
      emotionalState: 'Harried and impatient',
      publicReputationScore: 75,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    }
  ],

  organizations: [
    {
      id: 'org:baker_street_practice',
      kind: 'organization',
      name: '221B Baker Street Partnership',
      description: 'The private consulting practice of Sherlock Holmes and Dr. Watson.',
      category: 'guild',
      memberEntityIds: ['char:sherlock_holmes', 'char:john_watson'],
      headquartersLocationId: 'loc:221b_baker_street',
      resources: { 'forensic_clues': 8, 'tobacco_reserves': 90 },
      doctrineOrCharter: 'Eliminate the impossible until only the truth remains.',
      internalCohesionScore: 98,
      publicPrestigeScore: 92,
      tags: ['detective', 'private'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:scotland_yard',
      kind: 'organization',
      name: 'Metropolitan Police Service (Scotland Yard)',
      description: 'The official municipal police force of Victorian London.',
      category: 'government',
      memberEntityIds: ['char:inspector_lestrade'],
      headquartersLocationId: 'loc:scotland_yard_office',
      resources: { 'constabulary_officers': 1200, 'warrants': 50 },
      doctrineOrCharter: 'Preserve the peace and enforce the laws of the Queen.',
      internalCohesionScore: 85,
      publicPrestigeScore: 78,
      tags: ['police', 'london'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  locations: [
    {
      id: 'loc:221b_baker_street',
      kind: 'location',
      name: '221B Baker Street Sitting Room & Lab',
      description: 'Littered with chemistry retorts, stacks of The Times, Persian slipper tobacco pouches, and anatomical charts.',
      type: 'residence',
      accessibility: 'restricted',
      atmosphere: 'Pipe smoke, violin harmonics, crackling coal grate, smell of ether and hydrochloric acid.',
      spatialAffordances: ['analyze_chemical_samples', 'consult_index_dossiers', 'interview_clients'],
      residentEntityIds: ['char:sherlock_holmes', 'char:john_watson'],
      tags: ['baker_street', 'lab'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:blackwood_crypt',
      kind: 'location',
      name: 'Brompton Cemetery Vault of Lord Blackwood',
      description: 'A subterranean Victorian stone crypt where heavy iron slabs were mysteriously shattered from the inside.',
      type: 'crime_scene',
      accessibility: 'restricted',
      atmosphere: 'Cold marble, damp moss, shattered mortar dust, copper smell of spilled embalming salts.',
      spatialAffordances: ['magnify_bootprints', 'sample_mortar_chemicals', 'trace_coffin_scratches'],
      tags: ['crypt', 'crime_scene'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:scotland_yard_office',
      kind: 'location',
      name: 'Scotland Yard Detective Branch',
      description: 'Gaslit rooms filled with ledger desks, wanted posters, and evidence lockboxes.',
      type: 'office',
      accessibility: 'public',
      atmosphere: 'Rustling paperwork, wet umbrellas drying in the corner, shouts of sergeant constables.',
      spatialAffordances: ['interrogate_prisoners', 'issue_warrants'],
      controllingOrganizationId: 'org:scotland_yard',
      tags: ['police', 'government'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  objects: [
    {
      id: 'obj:magnifying_lens',
      kind: 'object',
      name: 'Brass-Rimmed Optical Magnifier',
      description: 'Holmes’s precision 10x optical glass used for examining carpet fiber residues and micro-scratches.',
      type: 'device',
      holderEntityId: 'char:sherlock_holmes',
      tags: ['forensic', 'tool'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'obj:chemical_residue_vial',
      kind: 'object',
      name: 'Vial of Stillwater Glass Residue',
      description: 'Glass shards recovered from the crypt containing traces of synthetic tetrodotoxin poison.',
      type: 'evidence_clue',
      holderEntityId: 'char:sherlock_holmes',
      associatedFactIds: ['fact:rhododendron_toxicology'],
      tags: ['evidence', 'chemistry'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  resources: [
    {
      id: 'res:holmes_case_fees',
      kind: 'resource',
      name: 'Client Honorarium Bankroll',
      resourceType: 'currency',
      quantity: 450,
      unit: 'Guineas',
      ownerEntityId: 'char:sherlock_holmes',
      isFungible: true,
      description: 'Fees paid by kings, dukes, and grateful merchants.',
      tags: ['money'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  // 4. Relationships
  relationships: [
    {
      id: 'rel:holmes_watson_partnership',
      sourceEntityId: 'char:sherlock_holmes',
      targetEntityId: 'char:john_watson',
      kind: 'intimacy',
      isBidirectional: true,
      affinity: 90,
      trust: 95,
      powerBalance: 10,
      visibility: 'public',
      narrativeDescription: 'A legendary intellectual and moral bond. Holmes values Watson’s integrity above all men in London.',
      provenance: { source: 'authored' }
    },
    {
      id: 'rel:holmes_lestrade_collaboration',
      sourceEntityId: 'char:sherlock_holmes',
      targetEntityId: 'char:inspector_lestrade',
      kind: 'mentorship',
      isBidirectional: true,
      affinity: 60,
      trust: 75,
      powerBalance: 25,
      visibility: 'public',
      narrativeDescription: 'Holmes provides deductions; Lestrade takes the official Scotland Yard credit and provides legal muscle.',
      provenance: { source: 'authored' }
    }
  ],

  // 5. Social Norms
  socialNorms: [
    {
      id: 'norm:police_evidence_chain',
      name: 'Judicial Evidence Standard',
      domain: 'academic_integrity',
      prescribedBehavior: 'Evidence submitted to the Old Bailey must have verifiable physical provenance.',
      prohibitedBehavior: 'Convicting on superstitious rumor or hearsay.',
      consequencesOfViolation: {
        socialSanction: 'Case dismissed with prejudice by magistrate.',
        reputationLoss: 40
      },
      enforcementRigidity: 'strict'
    }
  ],

  lawsAndStatutes: [
    {
      id: 'law:offenses_against_person',
      title: 'Offences Against the Person Act (1861)',
      jurisdictionOrgId: 'org:scotland_yard',
      governingCode: 'Section 4: Murder and conspiracy to murder is punishable by penal servitude or death by hanging.',
      violationTriggers: ['premeditated_murder', 'poisoning'],
      punishmentSummary: 'Capital punishment at Newgate Prison.'
    }
  ],

  // 6. Power Structure
  powerRelations: [
    {
      id: 'pwr:holmes_deductive_monopoly',
      wielderEntityId: 'char:sherlock_holmes',
      subjectEntityId: 'char:inspector_lestrade',
      domain: 'forensic',
      mechanism: 'Superior intellectual capacity to unlock mysteries that threaten police legitimacy.',
      leverageIntensity: 80,
      canPunish: false,
      canReward: true,
      dependencyFactor: 'Scotland Yard faces public ridicule if sensational cases remain unsolved.'
    }
  ],

  // 7. Ground Truth Facts
  groundTruthFacts: [
    {
      id: 'fact:rhododendron_toxicology',
      statement: 'The apparent death of Lord Blackwood was induced by a calculated dose of Rhododendron ponticum (mad honey alkaloid) that drops pulse below medical detection.',
      domain: 'crime',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:blackwood_coffin_tampered',
      statement: 'The heavy sandstone slab of the crypt was dissolved using a concealed nitric acid siphon, not supernatural resurrection.',
      domain: 'crime',
      visibilityScope: 'domain_public',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    }
  ],

  // 8. Actions
  actions: [
    {
      id: 'act:perform_chemical_reagent_test',
      name: 'Perform Reagent Assay in Baker St Lab',
      category: 'forensic',
      description: 'Boil recovered glass residue with nitric acid and silver nitrate to isolate poisonous alkaloids.',
      actorEligibilityRoles: ['Sherlock Holmes'],
      preconditions: [
        {
          type: 'requires_location',
          targetKey: 'loc:221b_baker_street',
          expectedValue: 'loc:221b_baker_street',
          failureMessage: 'Must be at the 221B chemical laboratory bench.'
        }
      ],
      directEffects: [
        {
          targetDomain: 'epistemic',
          targetId: '$actor',
          mutationType: 'reveal_fact',
          fieldKey: 'knownFactIds',
          payload: 'fact:rhododendron_toxicology',
          narrativeDescription: 'The precipitate turns vivid crimson, definitively identifying the chemical compound.'
        }
      ],
      potentialConsequences: []
    }
  ],

  // 9. Possibility Space
  possibilitySpace: {
    coreFantasyHook: 'Experience the pure joy of deductive triumph and scientific investigation in Victorian London.',
    primaryInteractionLoop: 'Gather physical clues from crime scenes, chemically analyze residues, interrogate suspects, and construct an airtight chain of logic.',
    tabooOrForbiddenActions: [
      'Accepting magical or supernatural explanations without exhaustive empirical testing'
    ],
    availableRoles: [
      {
        id: 'role:sh_holmes',
        title: 'Sherlock Holmes (Consulting Detective)',
        name: 'Sherlock Holmes',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:sherlock_holmes',
        socialPosition: 'Consulting Detective',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['forensic', 'covert', 'social'],
        suggestedPromptDirectives: [
          'Examine the crypt stone dust under high magnification',
          'Conduct chemical reagent test on the recovered glass vial',
          'Interrogate the prison gravedigger regarding nocturnal visitors',
          'Explain the step-by-step chain of deduction to Watson'
        ],
        systemConstraints: [
          'Must prove claims using physical and forensic evidence'
        ],
        description: 'You are Sherlock Holmes. The game is afoot.'
      },
      {
        id: 'role:sh_watson',
        title: 'Dr. John Watson (Partner & Biographer)',
        name: 'Dr. John Watson',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:john_watson',
        socialPosition: 'Physician & Military Veteran',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['social', 'physical', 'academic'],
        suggestedPromptDirectives: [
          'Perform medical post-mortem check on toxicology symptoms',
          'Provide armed backup with your service revolver',
          'Interview traumatized witnesses with gentle medical bedside manner'
        ],
        systemConstraints: [],
        description: 'You are Dr. Watson. You keep Holmes grounded in humanity while wielding a service revolver when danger strikes.'
      }
    ]
  },

  // 10. Experience Profile
  experienceProfile: {
    primaryFantasy: 'Mystery & Knowledge',
    secondaryFantasy: 'Relationship',
    dominantTone: 'cozy_intellectual',
    tensionGradient: 'episodic_puzzle',
    socialDensity: 3,
    informationAsymmetry: 4,
    consequenceLethality: 3,
    investigativeDepth: 5,
    recommendedModalities: ['forensic_evidence_board', 'dialogue_focused', 'dossier_matrix']
  }
};

export const SHERLOCK_HOLMES_INITIAL_STATE: WorldStateInstance = {
  instanceId: 'inst:sh:001',
  definitionId: 'world:sherlock_holmes',
  timelineId: 'timeline:canonical_1895',
  clock: {
    turnNumber: 1,
    inUniverseTime: 'November 1895 — Foggy Thursday 21:00'
  },
  currentSituationNarrative: 'A pea-souper yellow fog blankets Baker Street. Inside 221B, the fire crackles warmly. Sherlock Holmes has just received a cryptic telegram from Inspector Lestrade regarding a desecrated crypt at Brompton Cemetery. On the side table sits an unopened vial of chemical residue.',
  entityStates: {
    'char:sherlock_holmes': {
      entityId: 'char:sherlock_holmes',
      currentLocationId: 'loc:221b_baker_street',
      currentActivity: 'Examining telegram under magnifying glass',
      emotionalState: 'Keen, energized, and ready for departure',
      reputationScore: 88,
      physicalStatus: 'healthy',
      dynamicAttributes: { deductiveClarity: 95 },
      inventoryObjectIds: ['obj:magnifying_lens', 'obj:chemical_residue_vial']
    },
    'char:john_watson': {
      entityId: 'char:john_watson',
      currentLocationId: 'loc:221b_baker_street',
      currentActivity: 'Checking his pocket watch and fetching heavy overcoats',
      emotionalState: 'Alert and loyal',
      reputationScore: 82,
      physicalStatus: 'healthy',
      dynamicAttributes: { revolverLoaded: true },
      inventoryObjectIds: []
    },
    'char:inspector_lestrade': {
      entityId: 'char:inspector_lestrade',
      currentLocationId: 'loc:scotland_yard_office',
      currentActivity: 'Waiting anxiously for Holmes at his desk',
      emotionalState: 'Impatient and baffled',
      reputationScore: 75,
      physicalStatus: 'healthy',
      dynamicAttributes: {},
      inventoryObjectIds: []
    }
  },
  relationshipStates: {
    'rel:holmes_watson_partnership': {
      relationshipId: 'rel:holmes_watson_partnership',
      currentAffinity: 90,
      currentTrust: 95,
      currentPowerBalance: 10,
      recentInteractionsSummary: 'Discussed the chemical properties of Turkish tobacco ash.',
      brokenPromisesCount: 0
    }
  },
  epistemics: {
    entityKnownFacts: {
      'char:sherlock_holmes': [
        'fact:rhododendron_toxicology',
        'fact:blackwood_coffin_tampered'
      ],
      'char:john_watson': [
        'fact:rhododendron_toxicology'
      ],
      'char:inspector_lestrade': [
        'fact:blackwood_coffin_tampered'
      ]
    },
    activeSecrets: [],
    activeRumors: [
      {
        id: 'rumor:blackwood_resurrection',
        content: 'Lord Blackwood has risen from his sealed grave through dark necromantic arts to seek revenge on London.',
        plausibility: 0.2,
        isTrue: false,
        spreadRate: 9,
        knownByEntityIds: ['char:inspector_lestrade', 'char:john_watson', 'char:sherlock_holmes']
      }
    ],
    publicExposedFactIds: ['fact:blackwood_coffin_tampered']
  },
  resourcePools: {
    'scotland_yard_rewards': 500
  },
  scheduler: {
    queue: [],
    budgetPerTurn: 3,
    seed: 0xc0ffee,
    nextSeq: 0
  },
  recentEvents: [],
  eventChronicleLog: []
};
