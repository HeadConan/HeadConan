/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Test World 4: MODERN UNIVERSITY RESEARCH LAB
 * 
 * Benchmark Stress Tests:
 * - Ordinary contemporary life & non-fantastical social systems
 * - Institutional hierarchies, grant funding, tenure tracks & publication incentives
 * - Low-stakes high-intensity drama (authorship disputes, lab gossip, conference deadlines)
 * - Daily schedules, coffee breaks, office politics, and subtle interpersonal power
 */

import { WorldDefinition } from '../types/definition';
import { WorldStateInstance } from '../types/state';

export const MODERN_UNIVERSITY_WORLD_DEFINITION: WorldDefinition = {
  id: 'world:modern_university',
  name: 'St. Jude University — Autonomous Cognition & Ethics Lab',
  tagline: 'Publish or perish in the high-stakes world of modern academic research and AI funding.',
  premise: 'In a premier R1 research university, a high-profile graduate laboratory races toward the NeurIPS paper submission deadline while competing for a $1.8M NSF frontier grant. Intellectual credit disputes, advisor politics, and tenure reviews collide in coffee-fueled lab drama.',
  version: {
    schemaVersion: '1.0.0',
    definitionVersion: '1.0.0',
    revision: 1,
    lastUpdated: '2026-08-26'
  },

  // 1. Axioms
  axioms: [
    {
      id: 'axiom:uni:publish_or_perish',
      statement: 'Academic survival and tenure decisions are determined primarily by high-impact peer-reviewed publications and grant dollars brought into the university.',
      type: 'institutional_norm',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'institutional_verdict',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:uni:first_authorship_prestige',
      statement: 'First-author credit on top-tier conference papers is the decisive currency for a PhD student securing a postdoc or tenure-track faculty job.',
      type: 'social_contract',
      scope: 'institutional',
      isImmutable: false,
      enforcementMechanism: 'social_retribution',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:uni:academic_integrity',
      statement: 'Fabricating simulation data or plagiarizing text results in immediate disciplinary dismissal and permanent career blacklisting.',
      type: 'institutional_norm',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'institutional_verdict',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    }
  ],

  // 2. Ontological Capabilities
  capabilities: [
    {
      id: 'cap:grant_budget_allocation',
      name: 'Principal Investigator (PI) Budget Authority',
      domain: 'economic',
      description: 'Allocate lab computing cluster GPU hours, graduate student stipends, and travel funding.'
    },
    {
      id: 'cap:novel_theoretical_synthesis',
      name: 'Empirical Machine Learning Research',
      domain: 'cognitive',
      description: 'Design novel deep neural network architectures, run GPU ablation studies, and formulate mathematical proofs.'
    },
    {
      id: 'cap:tenure_committee_vote',
      name: 'Academic Senate Voting Power',
      domain: 'institutional',
      description: 'Cast decisive votes on departmental promotions, hiring lines, and tenure grants.'
    }
  ],

  // 3. Baseline Entities
  characters: [
    {
      id: 'char:maya_lin',
      kind: 'character',
      name: 'Maya Lin',
      aliases: ['Maya', 'Lead PhD Researcher'],
      description: '4th-year Computer Science PhD candidate; brilliant, exhausted, and desperately trying to defend her dissertation before her funding runs out.',
      tags: ['student', 'phd', 'researcher', 'lead_author'],
      canonStatus: 'canonical',
      archetypeRole: 'Overworked Senior PhD Candidate',
      organizationIds: ['org:cognition_lab', 'org:dept_cs'],
      primaryLocationId: 'loc:graduate_lab_office',
      personality: {
        temperament: 'analytical',
        moralAlignment: 'principled',
        primaryValues: ['Scientific Rigor', 'Securing First Authorship', 'Graduating in Spring'],
        fatalFlaw: 'Perfectionism and aversion to confronting aggressive academic advisors',
        socialMask: 'Cheerful, hyper-competent, endlessly caffeinated graduate student'
      },
      goals: [
        {
          id: 'goal:submit_neurips_paper',
          description: 'Finalize benchmark ablation figures and submit the Autonomous World Agent paper to NeurIPS by Friday midnight',
          priority: 'primary',
          progressPercent: 85,
          isSecret: false
        },
        {
          id: 'goal:protect_first_authorship',
          description: 'Ensure Dr. Thorne does not award co-first authorship to the department chair’s visiting nephew',
          priority: 'survival',
          progressPercent: 60,
          isSecret: true
        }
      ],
      needs: [
        { type: 'safety', urgency: 90, satisfactionStatus: 'strained' },
        { type: 'epistemic_truth', urgency: 85, satisfactionStatus: 'fulfilled' },
        { type: 'status', urgency: 75, satisfactionStatus: 'deprived' }
      ],
      knownFactIds: [
        'fact:neurips_deadline_friday',
        'fact:nsf_grant_shortfall'
      ],
      beliefs: [
        {
          id: 'belief:thorne_has_my_back',
          statement: 'Dr. Thorne will protect my first authorship because I wrote 90% of the codebase.',
          confidence: 0.7,
          isFactuallyAccurate: false,
          sourceType: 'inference'
        }
      ],
      secretFactIds: [],
      capabilities: ['cap:novel_theoretical_synthesis'],
      socialPermissions: ['access:gpu_cluster', 'access:lab_building_24_7'],
      currentLocationId: 'loc:graduate_lab_office',
      currentActivity: 'Staring at LaTeX compiler errors with four empty cold brew cans on her desk',
      emotionalState: 'Anxious, hyper-focused, sleep-deprived',
      publicReputationScore: 84,
      physicalStatus: 'fatigued',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:dr_aris_thorne',
      kind: 'character',
      name: 'Dr. Aris Thorne',
      aliases: ['Professor Thorne', 'Lab Director'],
      description: 'Tenure-track Associate Professor up for full tenure review this semester; constantly traveling to grant workshops and tech conferences.',
      tags: ['professor', 'pi', 'lab_director'],
      canonStatus: 'canonical',
      archetypeRole: 'Ambitious Lab Director (PI)',
      organizationIds: ['org:cognition_lab', 'org:dept_cs'],
      primaryLocationId: 'loc:faculty_office_thorne',
      personality: {
        temperament: 'charismatic',
        moralAlignment: 'pragmatic',
        primaryValues: ['High H-Index', 'Winning $1.8M NSF Grant', 'Securing Full Tenure'],
        fatalFlaw: 'Over-promises results and offloads stressful manuscript revisions to students at the 11th hour',
        socialMask: 'Visionary, deeply encouraging academic luminary'
      },
      goals: [
        {
          id: 'goal:win_nsf_frontier_grant',
          description: 'Secure the $1.8M NSF grant renewal to guarantee lab funding for 3 more years',
          priority: 'primary',
          progressPercent: 75,
          isSecret: false
        },
        {
          id: 'goal:appease_department_chair',
          description: 'Stay on the good side of Chair Elena Vance ahead of the confidential tenure committee vote',
          priority: 'survival',
          progressPercent: 70,
          isSecret: true
        }
      ],
      needs: [
        { type: 'status', urgency: 95, satisfactionStatus: 'adequate' },
        { type: 'safety', urgency: 80, satisfactionStatus: 'strained' }
      ],
      knownFactIds: [
        'fact:nsf_grant_shortfall',
        'fact:vance_nephew_deal'
      ],
      beliefs: [],
      secretFactIds: ['fact:vance_nephew_deal'],
      capabilities: ['cap:grant_budget_allocation', 'cap:novel_theoretical_synthesis'],
      socialPermissions: ['approve:reimbursements', 'submit:nsf_proposals'],
      currentLocationId: 'loc:faculty_office_thorne',
      currentActivity: 'On a speakerphone call with an NSF program officer while editing a grant PDF',
      emotionalState: 'Polished, strategic, and mildly stressed',
      publicReputationScore: 89,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:prof_elena_vance',
      kind: 'character',
      name: 'Prof. Elena Vance',
      aliases: ['Department Chair Vance'],
      description: 'Department Chair of Computer Science; holds veto power over tenure cases, lab space allocations, and departmental computing grants.',
      tags: ['chair', 'administration', 'tenure_committee'],
      canonStatus: 'canonical',
      archetypeRole: 'Institutional Gatekeeper & Department Chair',
      organizationIds: ['org:dept_cs'],
      primaryLocationId: 'loc:department_chair_suite',
      personality: {
        temperament: 'stoic',
        moralAlignment: 'machiavellian',
        primaryValues: ['Department Prestige', 'Fiscal Solvency', 'Institutional Order'],
        fatalFlaw: 'Treats academic scholarship as pure institutional real estate and politics',
        socialMask: 'Impartial, dignified senior academic administrator'
      },
      goals: [
        {
          id: 'goal:elevate_department_ranking',
          description: 'Push CS department into the national Top 10 by maximizing accepted publications',
          priority: 'primary',
          progressPercent: 80,
          isSecret: false
        }
      ],
      needs: [
        { type: 'status', urgency: 90, satisfactionStatus: 'fulfilled' }
      ],
      knownFactIds: ['fact:vance_nephew_deal', 'fact:nsf_grant_shortfall'],
      beliefs: [],
      secretFactIds: [],
      capabilities: ['cap:tenure_committee_vote'],
      socialPermissions: ['allocate:building_space', 'veto:tenure_cases'],
      currentLocationId: 'loc:department_chair_suite',
      currentActivity: 'Reviewing departmental budget allocations with administrative deans',
      emotionalState: 'Calm and formidable',
      publicReputationScore: 94,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    }
  ],

  organizations: [
    {
      id: 'org:cognition_lab',
      kind: 'organization',
      name: 'Autonomous Cognition & Ethics Research Lab',
      description: 'A 12-person graduate research lab conducting cutting-edge AI world simulation experiments.',
      category: 'academic_institution',
      leaderEntityId: 'char:dr_aris_thorne',
      memberEntityIds: ['char:dr_aris_thorne', 'char:maya_lin'],
      headquartersLocationId: 'loc:graduate_lab_office',
      resources: { 'gpu_cluster_hours': 4500, 'lab_stipend_fund': 120000 },
      doctrineOrCharter: 'Pioneer foundational research in multi-agent cognition with mathematical rigor.',
      internalCohesionScore: 70,
      publicPrestigeScore: 86,
      tags: ['lab', 'ai', 'research'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:dept_cs',
      kind: 'organization',
      name: 'Department of Computer Science',
      description: 'Academic department managing faculty tenure lines, graduate admissions, and teaching assistantships.',
      category: 'academic_institution',
      leaderEntityId: 'char:prof_elena_vance',
      memberEntityIds: ['char:prof_elena_vance', 'char:dr_aris_thorne', 'char:maya_lin'],
      resources: { 'tenure_lines': 4, 'endowment_pool': 45000000 },
      doctrineOrCharter: 'Excellence in computing research and pedagogical stewardship.',
      internalCohesionScore: 75,
      publicPrestigeScore: 91,
      tags: ['department', 'university'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  locations: [
    {
      id: 'loc:graduate_lab_office',
      kind: 'location',
      name: 'Gates Hall Room 304 (Graduate Lab Office)',
      description: 'A glass-walled bullpen packed with dual-monitor workstations, whiteboards covered in loss function equations, and snack wrappers.',
      type: 'office',
      accessibility: 'restricted',
      atmosphere: 'Humming computer fans, aroma of dark roast espresso, squeak of dry-erase markers, subtle hum of panic.',
      spatialAffordances: ['run_gpu_experiments', 'debug_latex_draft', 'discuss_authorship_concerns'],
      residentEntityIds: ['char:maya_lin'],
      tags: ['lab', 'office'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:faculty_office_thorne',
      kind: 'location',
      name: 'Prof. Thorne’s Faculty Office',
      description: 'Bookshelves stacked with hardback symposium proceedings, an Italian espresso machine, and a framed NSF CAREER award.',
      type: 'office',
      accessibility: 'restricted',
      atmosphere: 'Clean, polished, smell of roasted beans and polished cedar wood.',
      spatialAffordances: ['conduct_1_on_1_advising', 'negotiate_authorship', 'review_grant_drafts'],
      residentEntityIds: ['char:dr_aris_thorne'],
      tags: ['faculty', 'office'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:department_chair_suite',
      kind: 'location',
      name: 'Department Chair Suite (Hall of Honors)',
      description: 'Carpeted administrative executive suite with oil portraits of emeritus professors and conference tables.',
      type: 'office',
      accessibility: 'restricted',
      atmosphere: 'Muffled silence, ticking grandfather clock, institutional weight.',
      spatialAffordances: ['petition_chair', 'file_formal_grievance'],
      residentEntityIds: ['char:prof_elena_vance'],
      tags: ['admin', 'chair'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  objects: [
    {
      id: 'obj:neurips_manuscript_draft',
      kind: 'object',
      name: 'NeurIPS 2026 Camera-Ready Manuscript (LaTeX)',
      description: 'The 9-page conference manuscript with 40-page supplementary proofs that will determine Maya’s graduation timeline.',
      type: 'document',
      holderEntityId: 'char:maya_lin',
      associatedFactIds: ['fact:neurips_deadline_friday'],
      tags: ['manuscript', 'latex'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  resources: [
    {
      id: 'res:h100_gpu_compute_credits',
      kind: 'resource',
      name: 'Campus Supercomputer H100 GPU Hours',
      resourceType: 'intellectual_property',
      quantity: 1200,
      unit: 'GPU-Hours',
      ownerEntityId: 'char:dr_aris_thorne',
      isFungible: true,
      description: 'Allocated cluster compute budget expiring at end of quarter.',
      tags: ['compute'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  // 4. Relationships
  relationships: [
    {
      id: 'rel:thorne_maya_advisory',
      sourceEntityId: 'char:dr_aris_thorne',
      targetEntityId: 'char:maya_lin',
      kind: 'mentorship',
      isBidirectional: true,
      affinity: 70,
      trust: 65,
      powerBalance: 60, // Thorne has significant power over Maya’s graduation
      visibility: 'public',
      narrativeDescription: 'Advisor-advisee bond. Thorne appreciates her unmatched technical output but treats her time as infinitely flexible.',
      provenance: { source: 'authored' }
    },
    {
      id: 'rel:vance_thorne_evaluation',
      sourceEntityId: 'char:prof_elena_vance',
      targetEntityId: 'char:dr_aris_thorne',
      kind: 'fealty',
      isBidirectional: false,
      affinity: 50,
      trust: 50,
      powerBalance: 70,
      visibility: 'institutional',
      narrativeDescription: 'Vance holds the decisive chair recommendation letter for Thorne’s tenure case.',
      provenance: { source: 'authored' }
    }
  ],

  // 5. Social Norms
  socialNorms: [
    {
      id: 'norm:author_contribution_order',
      name: 'Author Contribution Precedence',
      domain: 'academic_integrity',
      prescribedBehavior: 'The person who ran the experiments and wrote the primary prose is listed as first author.',
      prohibitedBehavior: 'Awarding honorary or gift authorships to individuals who did not write or contribute code.',
      consequencesOfViolation: {
        socialSanction: 'Whispers of academic misconduct and resentment across graduate student union.',
        reputationLoss: 35
      },
      enforcementRigidity: 'flexible' // Sadly flexible in real academia!
    }
  ],

  lawsAndStatutes: [
    {
      id: 'law:university_code_conduct',
      title: 'University Faculty & Graduate Student Code of Ethics',
      jurisdictionOrgId: 'org:dept_cs',
      governingCode: 'Article 8: Exploitation of graduate student research or coercion is subject to Ombuds review.',
      violationTriggers: ['retaliation_against_students', 'data_falsification'],
      punishmentSummary: 'Revocation of advising privileges and formal censure.'
    }
  ],

  // 6. Power Structure
  powerRelations: [
    {
      id: 'pwr:advisor_dissertation_veto',
      wielderEntityId: 'char:dr_aris_thorne',
      subjectEntityId: 'char:maya_lin',
      domain: 'institutional',
      mechanism: 'Must sign off on dissertation defense scheduling and write faculty reference letters.',
      leverageIntensity: 90,
      canPunish: true,
      canReward: true,
      dependencyFactor: 'Maya cannot graduate or obtain academic employment without her PI’s endorsement.'
    }
  ],

  // 7. Ground Truth Facts
  groundTruthFacts: [
    {
      id: 'fact:neurips_deadline_friday',
      statement: 'The NeurIPS paper submission deadline is this Friday at 23:59 UTC, with zero extensions granted.',
      domain: 'systemic_law',
      visibilityScope: 'universal_public',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:nsf_grant_shortfall',
      statement: 'The lab’s current grant runs out in 4 months; without the new NSF award, two student stipends must be cut.',
      domain: 'social_scandal',
      visibilityScope: 'restricted',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:vance_nephew_deal',
      statement: 'Chair Vance subtly hinted to Thorne that adding her visiting undergrad nephew to Maya’s paper would guarantee unanimous tenure committee approval.',
      domain: 'social_scandal',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    }
  ],

  // 8. Actions
  actions: [
    {
      id: 'act:confront_advisor_authorship',
      name: 'Schedule Closed-Door 1-on-1 on Authorship',
      category: 'academic',
      description: 'Present the Git commit log and LaTeX revision history to firmly assert first-author primacy.',
      actorEligibilityRoles: ['Lead PhD Researcher'],
      preconditions: [
        {
          type: 'requires_location',
          targetKey: 'loc:faculty_office_thorne',
          expectedValue: 'loc:faculty_office_thorne',
          failureMessage: 'Must be in Prof. Thorne’s office.'
        }
      ],
      directEffects: [
        {
          targetDomain: 'entity',
          targetId: 'char:maya_lin',
          mutationType: 'increment',
          fieldKey: 'publicReputationScore',
          payload: 5,
          narrativeDescription: 'Maya laid out the commit log with unwavering professional clarity.'
        }
      ],
      potentialConsequences: []
    }
  ],

  // 9. Possibility Space
  possibilitySpace: {
    coreFantasyHook: 'Navigate the high-stakes human, scientific, and institutional politics of cutting-edge AI research.',
    primaryInteractionLoop: 'Run cluster simulations, refine theoretical arguments, manage collaborator expectations, and survive deadline pressure.',
    tabooOrForbiddenActions: [
      'Fabricating benchmark numbers or falsifying empirical findings'
    ],
    availableRoles: [
      {
        id: 'role:uni_maya',
        title: 'Maya Lin (Senior PhD Candidate)',
        name: 'Maya Lin',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:maya_lin',
        socialPosition: '4th-Year PhD Student & First Author',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['academic', 'social'],
        suggestedPromptDirectives: [
          'Run the final 5 benchmark seeds on the supercomputer cluster',
          'Schedule an urgent 1-on-1 with Prof. Thorne to confirm the author list',
          'Coordinate the LaTeX proof appendix with junior lab mates',
          'Take a 20-minute espresso walk across the campus quad'
        ],
        systemConstraints: [
          'Must submit paper before Friday midnight UTC'
        ],
        description: 'You are Maya Lin. You have put 2,000 hours of your life into this codebase. You are not letting anyone steal your first authorship.'
      },
      {
        id: 'role:uni_thorne',
        title: 'Dr. Aris Thorne (Lab Director / PI)',
        name: 'Dr. Aris Thorne',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:dr_aris_thorne',
        socialPosition: 'Associate Professor & Principal Investigator',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['academic', 'political', 'social'],
        suggestedPromptDirectives: [
          'Polish the introduction narrative of the NeurIPS paper',
          'Balance Department Chair Vance’s subtle pressure with Maya’s morale',
          'Submit the final NSF budget revision to the grants office'
        ],
        systemConstraints: [
          'Must secure lab funding and maintain departmental standing'
        ],
        description: 'You are Prof. Thorne. You want your students to flourish, but without grants and tenure, nobody has a lab.'
      }
    ]
  },

  // 10. Experience Profile
  experienceProfile: {
    primaryFantasy: 'Life & Path',
    secondaryFantasy: 'Mystery & Knowledge',
    dominantTone: 'mundane_academic',
    tensionGradient: 'steady_escalation',
    socialDensity: 4,
    informationAsymmetry: 3,
    consequenceLethality: 1, // High emotional/career stakes, but 0 physical lethality
    investigativeDepth: 4,
    recommendedModalities: ['academic_schedule_timeline', 'dialogue_focused', 'dossier_matrix']
  }
};

export const MODERN_UNIVERSITY_INITIAL_STATE: WorldStateInstance = {
  instanceId: 'inst:uni:001',
  definitionId: 'world:modern_university',
  timelineId: 'timeline:canonical_fall',
  clock: {
    turnNumber: 1,
    inUniverseTime: 'Fall Semester — Tuesday 15:45 (78 hours before deadline)'
  },
  currentSituationNarrative: 'The graduate lab office smells of cold brew coffee and dry-erase cleaner. Maya Lin is monitoring training loss curves on three GPU cluster nodes while editing the manuscript introduction. Down the hall, Prof. Thorne is drafting email replies to the NSF program officer, wondering how to address Chair Vance’s latest email hint.',
  entityStates: {
    'char:maya_lin': {
      entityId: 'char:maya_lin',
      currentLocationId: 'loc:graduate_lab_office',
      currentActivity: 'Compiling LaTeX table comparison with baseline algorithms',
      emotionalState: 'Jittery, highly determined, slightly sleep-deprived',
      reputationScore: 84,
      physicalStatus: 'fatigued',
      dynamicAttributes: { hoursSleptLastNight: 4.5, paperDraftProgress: 88 },
      inventoryObjectIds: ['obj:neurips_manuscript_draft']
    },
    'char:dr_aris_thorne': {
      entityId: 'char:dr_aris_thorne',
      currentLocationId: 'loc:faculty_office_thorne',
      currentActivity: 'Reviewing budget spreadsheet for grant submission',
      emotionalState: 'Strategic, multitasking, under political pressure',
      reputationScore: 89,
      physicalStatus: 'healthy',
      dynamicAttributes: { tenureApprovalProbability: 80 },
      inventoryObjectIds: []
    },
    'char:prof_elena_vance': {
      entityId: 'char:prof_elena_vance',
      currentLocationId: 'loc:department_chair_suite',
      currentActivity: 'Signing teaching assistant appointment letters',
      emotionalState: 'Unflappable and authoritative',
      reputationScore: 94,
      physicalStatus: 'healthy',
      dynamicAttributes: {},
      inventoryObjectIds: []
    }
  },
  relationshipStates: {
    'rel:thorne_maya_advisory': {
      relationshipId: 'rel:thorne_maya_advisory',
      currentAffinity: 70,
      currentTrust: 65,
      currentPowerBalance: 60,
      recentInteractionsSummary: 'Thorne left 14 comments on Section 3 in Overleaf.',
      brokenPromisesCount: 0
    }
  },
  epistemics: {
    entityKnownFacts: {
      'char:maya_lin': [
        'fact:neurips_deadline_friday',
        'fact:nsf_grant_shortfall'
      ],
      'char:dr_aris_thorne': [
        'fact:neurips_deadline_friday',
        'fact:nsf_grant_shortfall',
        'fact:vance_nephew_deal'
      ],
      'char:prof_elena_vance': [
        'fact:neurips_deadline_friday',
        'fact:nsf_grant_shortfall',
        'fact:vance_nephew_deal'
      ]
    },
    activeSecrets: [
      {
        id: 'sec:nephew_authorship_quid_pro_quo',
        factId: 'fact:vance_nephew_deal',
        holdingEntityIds: ['char:dr_aris_thorne', 'char:prof_elena_vance'],
        targetEntityIds: ['char:maya_lin'],
        consequencesIfExposed: 'Outrage among lab graduate students and potential ethics complaint.',
        exposureThreshold: 50
      }
    ],
    activeRumors: [
      {
        id: 'rumor:gpu_cluster_maintenance',
        content: 'IT might restart the university GPU cluster on Thursday night right before the deadline.',
        plausibility: 0.6,
        isTrue: false,
        spreadRate: 8,
        knownByEntityIds: ['char:maya_lin', 'char:dr_aris_thorne']
      }
    ],
    publicExposedFactIds: ['fact:neurips_deadline_friday']
  },
  resourcePools: {
    'nsf_grant_pool': 1800000
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
