/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Test World 2: GAME OF THRONES (A Song of Ice and Fire)
 * 
 * Benchmark Stress Tests:
 * - Political power & institutional hierarchy (Iron Throne, Small Council, Feudal Houses)
 * - Factions, alliances, and shifting loyalty dynamics
 * - Long-term macro consequences (Civil war, bankruptcy, winter famine)
 * - Brutal consequence lethality & asymmetric leverage
 */

import { WorldDefinition } from '../types/definition';
import { WorldStateInstance } from '../types/state';

export const GAME_OF_THRONES_WORLD_DEFINITION: WorldDefinition = {
  id: 'world:game_of_thrones',
  name: 'A Game of Thrones — The Seven Kingdoms of Westeros',
  tagline: 'When you play the game of thrones, you win or you die. There is no middle ground.',
  premise: 'King Robert Baratheon sits atop the Iron Throne, deeply indebted to House Lannister. Lord Eddard Stark arrives in King’s Landing as Hand of the King to investigate the suspicious death of his predecessor, Jon Arryn, surrounded by court conspirators and whisperers.',
  version: {
    schemaVersion: '1.0.0',
    definitionVersion: '1.0.0',
    revision: 1,
    lastUpdated: '2026-08-26'
  },

  // 1. Axioms
  axioms: [
    {
      id: 'axiom:got:power_belief',
      statement: 'Power resides where men believe it resides; authority is maintained through blood legitimacy, coin, and fear of military violence.',
      type: 'feudal_allegiance',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'social_retribution',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:got:winter_is_coming',
      statement: 'Seasons last for unpredictable years; winter brings catastrophic agricultural famine and ancient threats from beyond the Wall.',
      type: 'metaphysical_law',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'natural_law',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:got:iron_bank_debt',
      statement: 'The Iron Bank of Braavos will fund a realm’s political rivals to overthrow any debtor king who defaults on interest payments.',
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
      id: 'cap:hand_of_the_king_decree',
      name: 'The King’s Voice (Hand of the King)',
      domain: 'institutional',
      description: 'Supreme executive authority to convene the Small Council, issue royal writs, and command the City Watch.'
    },
    {
      id: 'cap:littlefinger_financial_leverage',
      name: 'Master of Coin Manipulation',
      domain: 'economic',
      description: 'Control of treasury loans, brothels, crown debt, and fiscal appointments.'
    },
    {
      id: 'cap:varys_whispers',
      name: 'Spider’s Whisperer Network',
      domain: 'informational',
      description: 'Clandestine network of little birds delivering palace secrets and foreign intelligence.'
    },
    {
      id: 'cap:northern_martial_honor',
      name: 'Northern Feudal Command',
      domain: 'physical',
      description: 'Uncompromising battlefield leadership, execution rites, and unyielding honor.'
    }
  ],

  // 3. Baseline Entities
  characters: [
    {
      id: 'char:ned_stark',
      kind: 'character',
      name: 'Lord Eddard (Ned) Stark',
      aliases: ['The Quiet Wolf', 'Hand of the King', 'Lord of Winterfell'],
      description: 'Warden of the North and newly appointed Hand of the King; fiercely principled, honorable, and unaccustomed to court duplicity.',
      tags: ['stark', 'north', 'hand_of_king', 'noble'],
      canonStatus: 'canonical',
      archetypeRole: 'Honorable Feudal Lord & Reluctant Investigator',
      organizationIds: ['org:house_stark', 'org:small_council'],
      primaryLocationId: 'loc:tower_of_the_hand',
      personality: {
        temperament: 'stoic',
        moralAlignment: 'principled',
        primaryValues: ['Honor', 'Duty to Robert', 'Northern Justice', 'Protecting Family'],
        fatalFlaw: 'Assumes political adversaries share his standard of honor and honesty',
        socialMask: 'Austere, uncompromising Northern judge'
      },
      goals: [
        {
          id: 'goal:uncover_jon_arryn_death',
          description: 'Determine what Jon Arryn discovered before he was poisoned in King’s Landing',
          priority: 'primary',
          progressPercent: 30,
          isSecret: false
        },
        {
          id: 'goal:protect_stark_house',
          description: 'Keep his children safe from the toxic viper pit of the capital',
          priority: 'survival',
          progressPercent: 60,
          isSecret: false
        }
      ],
      needs: [
        { type: 'epistemic_truth', urgency: 90, satisfactionStatus: 'deprived' },
        { type: 'safety', urgency: 85, satisfactionStatus: 'strained' },
        { type: 'purpose', urgency: 95, satisfactionStatus: 'fulfilled' }
      ],
      knownFactIds: [
        'fact:jon_arryn_poisoned',
        'fact:crown_is_massively_in_debt'
      ],
      beliefs: [
        {
          id: 'belief:robert_will_listen',
          statement: 'If Robert is presented with undeniable evidence of treason, he will act justly.',
          confidence: 0.8,
          isFactuallyAccurate: false,
          sourceType: 'inference'
        }
      ],
      secretFactIds: ['fact:jon_snow_origin'],
      capabilities: ['cap:hand_of_the_king_decree', 'cap:northern_martial_honor'],
      socialPermissions: ['order:small_council', 'command:kings_guard', 'condemn_criminals'],
      currentLocationId: 'loc:tower_of_the_hand',
      currentActivity: 'Examining the Grand Maester’s genealogy lineage tome: "The Lineages of the Great Houses of Westeros"',
      emotionalState: 'Troubled; uneasy with the suffocating humidity and whispers of the Red Keep',
      publicReputationScore: 92,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:cersei_lannister',
      kind: 'character',
      name: 'Queen Cersei Lannister',
      aliases: ['The Queen Regent', 'Lioness of the Rock'],
      description: 'Queen of the Seven Kingdoms; fiercely ambitious, ruthlessly protective of her children, and deeply resentful of patriarchal constraints.',
      tags: ['lannister', 'queen', 'court'],
      canonStatus: 'canonical',
      archetypeRole: 'Ruthless Royal Matriarch & Conspirator',
      organizationIds: ['org:house_lannister', 'org:iron_throne_court'],
      primaryLocationId: 'loc:red_keep_royal_apartments',
      personality: {
        temperament: 'machiavellian',
        moralAlignment: 'self_serving',
        primaryValues: ['Lannister Supremacy', 'Protecting Joffrey/Myrcella/Tommen', 'Total Power'],
        fatalFlaw: 'Paranoid overconfidence; underestimates adversaries while overestimating her own strategic genius',
        socialMask: 'Regal, haughty, immaculate monarch'
      },
      goals: [
        {
          id: 'goal:secure_joffrey_throne',
          description: 'Ensure Prince Joffrey succeeds Robert without dispute or challenge to his legitimacy',
          priority: 'primary',
          progressPercent: 75,
          isSecret: false
        },
        {
          id: 'goal:conceal_incest_secret',
          description: 'Silence anyone who investigates the true biological paternity of her children',
          priority: 'survival',
          progressPercent: 50,
          isSecret: true
        }
      ],
      needs: [
        { type: 'status', urgency: 95, satisfactionStatus: 'fulfilled' },
        { type: 'safety', urgency: 90, satisfactionStatus: 'strained' },
        { type: 'autonomy', urgency: 85, satisfactionStatus: 'adequate' }
      ],
      knownFactIds: [
        'fact:cersei_children_bastards',
        'fact:lannister_gold_financing_realm',
        'fact:jon_arryn_poisoned'
      ],
      beliefs: [
        {
          id: 'belief:ned_stark_is_weak',
          statement: 'Ned Stark’s Northern honor makes him rigid, predictable, and simple to outmaneuver or eliminate.',
          confidence: 0.95,
          isFactuallyAccurate: true,
          sourceType: 'inference'
        }
      ],
      secretFactIds: ['fact:cersei_children_bastards'],
      capabilities: ['cap:hand_of_the_king_decree'],
      socialPermissions: ['summon:kings_guard', 'expel_courtiers'],
      currentLocationId: 'loc:red_keep_royal_apartments',
      currentActivity: 'Conferring with Grand Maester Pycelle regarding royal correspondence',
      emotionalState: 'Vigilant, sharp, and contemptuous',
      publicReputationScore: 70,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:petyr_baelish',
      kind: 'character',
      name: 'Lord Petyr Baelish (Littlefinger)',
      aliases: ['Littlefinger', 'Master of Coin'],
      description: 'Master of Coin on the Small Council; born to a minor fingerling house, rose through cunning economic manipulation, brothel cartels, and orchestrated chaos.',
      tags: ['small_council', 'coin', 'conspirator', 'broker'],
      canonStatus: 'canonical',
      archetypeRole: 'Machiavellian Political Broker & Chaos Architect',
      organizationIds: ['org:small_council', 'org:iron_throne_court'],
      primaryLocationId: 'loc:baelish_brothel',
      personality: {
        temperament: 'machiavellian',
        moralAlignment: 'self_serving',
        primaryValues: ['Upward Mobility', 'Chaos as a Ladder', 'Possessing Catelyn/Sansa Stark'],
        fatalFlaw: 'Hubris and assumption that everyone has a transactional price',
        socialMask: 'Helpful, humble, indispensable financial bureaucrat'
      },
      goals: [
        {
          id: 'goal:ignite_stark_lannister_war',
          description: 'Prowl between Starks and Lannisters, inciting mutual slaughter so he can seize high feudal lordship',
          priority: 'primary',
          progressPercent: 65,
          isSecret: true
        }
      ],
      needs: [
        { type: 'status', urgency: 99, satisfactionStatus: 'strained' },
        { type: 'purpose', urgency: 90, satisfactionStatus: 'fulfilled' }
      ],
      knownFactIds: [
        'fact:cersei_children_bastards',
        'fact:crown_is_massively_in_debt',
        'fact:jon_arryn_poisoned'
      ],
      beliefs: [],
      secretFactIds: ['fact:jon_arryn_poisoned'],
      capabilities: ['cap:littlefinger_financial_leverage'],
      socialPermissions: ['allocate_treasury', 'inspect_city_watch_payroll'],
      currentLocationId: 'loc:baelish_brothel',
      currentActivity: 'Reviewing gold tallies and listening to reports from City Watch Commander Janos Slynt',
      emotionalState: 'Amused and predatory',
      publicReputationScore: 68,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    }
  ],

  organizations: [
    {
      id: 'org:house_stark',
      kind: 'organization',
      name: 'House Stark of Winterfell',
      description: 'Ancient rulers of the North whose words are "Winter is Coming".',
      category: 'noble_house',
      leaderEntityId: 'char:ned_stark',
      memberEntityIds: ['char:ned_stark'],
      resources: { 'honor': 95, 'military_infantry': 75, 'treasury': 40 },
      doctrineOrCharter: 'Honor, ancient pacts of the First Men, and justice.',
      internalCohesionScore: 92,
      publicPrestigeScore: 90,
      tags: ['north', 'stark', 'feudal'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:house_lannister',
      kind: 'organization',
      name: 'House Lannister of Casterly Rock',
      description: 'The wealthiest Great House in the realm, masters of gold mines and ruthless statecraft. "Hear Me Roar!"',
      category: 'noble_house',
      memberEntityIds: ['char:cersei_lannister'],
      resources: { 'gold': 100, 'military_knights': 90, 'court_influence': 95 },
      doctrineOrCharter: 'Wealth, pride, and total eradication of rebellious vassals ("The Rains of Castamere").',
      internalCohesionScore: 82,
      publicPrestigeScore: 85,
      tags: ['westerlands', 'lannister', 'gold'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:small_council',
      kind: 'organization',
      name: 'The Small Council of the Realm',
      description: 'The executive advisory board administering royal justice, coin, whispers, and fleet for the Iron Throne.',
      category: 'government',
      memberEntityIds: ['char:ned_stark', 'char:petyr_baelish'],
      resources: { 'political_decrees': 90, 'crown_debt_burden': 95 },
      doctrineOrCharter: 'Govern the Seven Kingdoms under the authority of the King.',
      internalCohesionScore: 30,
      publicPrestigeScore: 80,
      tags: ['government', 'red_keep'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:iron_throne_court',
      kind: 'organization',
      name: 'The Royal Court of King’s Landing',
      description: 'The assembled nobility, kingsguard, and courtiers surrounding King Robert and Queen Cersei.',
      category: 'government',
      memberEntityIds: ['char:cersei_lannister', 'char:petyr_baelish'],
      resources: { 'court_prestige': 95 },
      doctrineOrCharter: 'Serve the sovereign will of the Iron Throne.',
      internalCohesionScore: 40,
      publicPrestigeScore: 90,
      tags: ['court', 'red_keep'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  locations: [
    {
      id: 'loc:red_keep_royal_apartments',
      kind: 'location',
      name: 'Royal Apartments of Queen Cersei',
      description: 'Lavishly draped private quarters overlooking Blackwater Bay with Lannister crimson silks and guarded by sworn knights.',
      type: 'residence',
      accessibility: 'restricted',
      atmosphere: 'Heavy perfumed incense, velvet canopies, whispers of serving maidens, clank of armor outside.',
      spatialAffordances: ['confer_with_maester', 'issue_private_commands', 'secure_royal_children'],
      residentEntityIds: ['char:cersei_lannister'],
      tags: ['red_keep', 'royal'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:tower_of_the_hand',
      kind: 'location',
      name: 'Tower of the Hand, Red Keep',
      description: 'The private fortress and bedchamber of the Hand of the King within the Red Keep.',
      type: 'residence',
      accessibility: 'restricted',
      atmosphere: 'Heavy stonework, flickering tallow candles, crackling hearth, and constant feeling of hidden peepholes in walls.',
      spatialAffordances: ['study_lineage_tomes', 'convene_private_advisors', 'station_household_guards'],
      residentEntityIds: ['char:ned_stark'],
      tags: ['red_keep', 'hand'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:red_keep_throne_room',
      kind: 'location',
      name: 'The Great Hall & The Iron Throne',
      description: 'A cavernous hall dominated by the monstrous, jagged Iron Throne forged from a thousand surrendered swords.',
      type: 'palace',
      accessibility: 'public',
      atmosphere: 'Echoing bootsteps, cold iron barbs, whispering courtiers against stained-glass windows.',
      spatialAffordances: ['hold_court', 'demand_royal_justice', 'issue_sovereign_decrees'],
      tags: ['iron_throne', 'red_keep'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:baelish_brothel',
      kind: 'location',
      name: 'Littlefinger’s High-End Establishment',
      description: 'An opulent pleasure house in the Street of Silk where nobles trade coin and blurt state secrets in bed.',
      type: 'public_square',
      accessibility: 'public',
      atmosphere: 'Incense, silk curtains, clinking wine goblets, and discreet doorways leading to private counting rooms.',
      spatialAffordances: ['bribe_officers', 'acquire_blackmail', 'negotiate_shadow_loans'],
      controllingOrganizationId: 'org:small_council',
      tags: ['brothel', 'underworld'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  objects: [
    {
      id: 'obj:lineage_tome',
      kind: 'object',
      name: 'The Lineages of the Great Houses of Westeros',
      description: 'Thick leather-bound compendium detailing hair and eye color heredity of all noble bloodlines.',
      type: 'ledger',
      holderEntityId: 'char:ned_stark',
      associatedFactIds: ['fact:cersei_children_bastards'],
      tags: ['evidence', 'genealogy'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  resources: [
    {
      id: 'res:crown_debt',
      kind: 'resource',
      name: 'Crown Royal Debt',
      resourceType: 'currency',
      quantity: 6000000,
      unit: 'Gold Dragons',
      ownerEntityId: 'char:petyr_baelish',
      isFungible: true,
      description: 'Six million gold dragons owed to House Lannister, the Tyrells, and the Iron Bank of Braavos.',
      tags: ['debt', 'treasury'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  // 4. Relationships
  relationships: [
    {
      id: 'rel:ned_cersei_standoff',
      sourceEntityId: 'char:ned_stark',
      targetEntityId: 'char:cersei_lannister',
      kind: 'hostility',
      isBidirectional: true,
      affinity: -80,
      trust: 5,
      powerBalance: 10,
      visibility: 'public',
      narrativeDescription: 'A deadly clash of Northern honor against Southern court ruthlessness.',
      provenance: { source: 'authored' }
    },
    {
      id: 'rel:littlefinger_ned_feigned_ally',
      sourceEntityId: 'char:petyr_baelish',
      targetEntityId: 'char:ned_stark',
      kind: 'alliance',
      isBidirectional: false,
      affinity: 20,
      trust: 60, // Ned mistakenly trusts him due to Catelyn
      powerBalance: 50,
      visibility: 'fictitious_cover',
      coverStory: 'Littlefinger pledges loyalty to Ned because of his childhood love for Catelyn Stark.',
      narrativeDescription: 'Littlefinger promises to deliver the City Watch to Ned while secretly preparing to betray him to Cersei.',
      provenance: { source: 'authored' }
    }
  ],

  // 5. Social Norms & Laws
  socialNorms: [
    {
      id: 'norm:feudal_guest_right',
      name: 'The Sacred Laws of Guest Right',
      domain: 'feudal_etiquette',
      prescribedBehavior: 'Once a guest eats bread and salt under a host’s roof, neither may harm the other.',
      prohibitedBehavior: 'Murdering guests or breaking guest hospitality, which curses the perpetrator in the eyes of gods and men.',
      consequencesOfViolation: {
        socialSanction: 'Universal eternal condemnation and loss of legitimacy across all Seven Kingdoms.',
        reputationLoss: 90
      },
      enforcementRigidity: 'draconian'
    }
  ],

  lawsAndStatutes: [
    {
      id: 'law:high_treason',
      title: 'Crown Statute on High Treason & Regicide',
      jurisdictionOrgId: 'org:small_council',
      governingCode: 'Article 1: Defying the royal decree of the King or questioning royal blood succession is high treason.',
      violationTriggers: ['allegations_of_bastardy', 'refusing_king_summons', 'raising_levies_against_the_throne'],
      punishmentSummary: 'Public beheading at the Great Sept of Baelor and attaintment of all ancestral lands.'
    }
  ],

  // 6. Power Structure
  powerRelations: [
    {
      id: 'pwr:lannister_debt_leverage',
      wielderEntityId: 'char:cersei_lannister',
      subjectEntityId: 'char:ned_stark',
      domain: 'economic',
      mechanism: 'House Lannister has financed half the Crown’s six-million dragon deficit.',
      leverageIntensity: 90,
      canPunish: true,
      canReward: true,
      dependencyFactor: 'The realm collapses into immediate bankruptcy if Tywin Lannister recalls royal loans.'
    }
  ],

  // 7. Ground Truth Facts
  groundTruthFacts: [
    {
      id: 'fact:cersei_children_bastards',
      statement: 'Joffrey, Myrcella, and Tommen are the incestuous biological children of Cersei and Jaime Lannister, with zero royal Baratheon blood.',
      subjectEntityId: 'char:cersei_lannister',
      domain: 'identity',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:jon_arryn_poisoned',
      statement: 'Jon Arryn was poisoned with Tears of Lys by his wife Lysa at Littlefinger’s instruction, not by Queen Cersei.',
      domain: 'crime',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:crown_is_massively_in_debt',
      statement: 'The Crown owes six million gold dragons, primarily to Casterly Rock and the Iron Bank of Braavos.',
      domain: 'social_scandal',
      visibilityScope: 'domain_public',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:lannister_gold_financing_realm',
      statement: 'House Lannister holds 3 million gold dragons of Crown debt, effectively giving Lord Tywin economic leverage over royal policy.',
      subjectEntityId: 'char:cersei_lannister',
      domain: 'allegiance',
      visibilityScope: 'domain_public',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:jon_snow_origin',
      statement: 'Jon Snow is the legitimate son of Rhaegar Targaryen and Lyanna Stark, the rightful heir to the Iron Throne.',
      domain: 'identity',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    }
  ],

  // 8. Actions
  actions: [
    {
      id: 'act:confront_cersei_with_truth',
      name: 'Confront the Queen in the Godswood',
      category: 'political',
      description: 'Warn Cersei that you know her secret and offer her mercy to flee with her children before you tell King Robert.',
      actorEligibilityRoles: ['Lord Eddard Stark'],
      preconditions: [
        {
          type: 'requires_knowledge',
          targetKey: 'fact:cersei_children_bastards',
          expectedValue: true,
          failureMessage: 'Must have uncovered the truth about Joffrey’s parentage.'
        }
      ],
      directEffects: [
        {
          targetDomain: 'entity',
          targetId: 'char:cersei_lannister',
          mutationType: 'set',
          fieldKey: 'emotionalState',
          payload: 'Desperate and mobilized for immediate preemptive regicide',
          narrativeDescription: 'Cersei looks at you coldly: "When you play the game of thrones, you win or you die. There is no middle ground."'
        }
      ],
      potentialConsequences: [
        {
          triggerProbability: 0.95,
          conditionDescription: 'Cersei accelerates King Robert’s hunting accident',
          consequenceSummary: 'King Robert suffers a fatal wound while hunting in the Kingswood.',
          secondaryEffects: [],
          spawnEvent: {
            title: 'King Robert Baratheon Mortally Wounded in Kingswood',
            description: 'The King was gored by a boar after drinking fortified Lannister wine.',
            urgency: 'critical'
          }
        }
      ]
    }
  ],

  // 9. Possibility Space
  possibilitySpace: {
    coreFantasyHook: 'Maneuver the ruthless feudal politics of Westeros where every mistake is paid in blood.',
    primaryInteractionLoop: 'Gather intelligence, forge or break alliances on the Small Council, and secure military leverage before war ignites.',
    tabooOrForbiddenActions: [
      'Expecting adversaries to honor agreements when self-interest dictates betrayal'
    ],
    availableRoles: [
      {
        id: 'role:got_ned',
        title: 'Lord Eddard Stark (Hand of the King)',
        name: 'Lord Eddard Stark',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:ned_stark',
        socialPosition: 'Hand of the King & Warden of the North',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['political', 'forensic', 'social'],
        suggestedPromptDirectives: [
          'Question Grand Maester Pycelle regarding Jon Arryn’s final words',
          'Summon Littlefinger to secure the loyalty of the City Watch',
          'Review the lineage archives regarding King Robert’s bastard children',
          'Confront Queen Cersei in the Red Keep Godswood'
        ],
        systemConstraints: [
          'Bound by northern honor; cannot assassinate political rivals in secret'
        ],
        description: 'You are Ned Stark. You hold the royal seal, but you are swimming among sharks who have spent their lives trading blood for crowns.'
      },
      {
        id: 'role:got_cersei',
        title: 'Queen Cersei Lannister',
        name: 'Queen Cersei',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:cersei_lannister',
        socialPosition: 'Queen of the Seven Kingdoms',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['political', 'covert', 'social'],
        suggestedPromptDirectives: [
          'Order Grand Maester Pycelle to intercept correspondence from Winterfell',
          'Coordinate with Lancel Lannister regarding the King’s wineskins',
          'Bribe or intimidate key city watch commanders'
        ],
        systemConstraints: [
          'Must protect Joffrey’s ascension at all costs'
        ],
        description: 'You are Cersei. Your father rules through gold, your husband drinks through grief, and you will burn cities to protect your children.'
      }
    ]
  },

  // 10. Experience Profile
  experienceProfile: {
    primaryFantasy: 'Political & Intrigue',
    secondaryFantasy: 'Power',
    dominantTone: 'grim_foreboding',
    tensionGradient: 'steady_escalation',
    socialDensity: 5,
    informationAsymmetry: 4,
    consequenceLethality: 5,
    investigativeDepth: 3,
    recommendedModalities: ['territorial_tactical_map', 'relationship_web_graph', 'dialogue_focused']
  }
};

export const GAME_OF_THRONES_INITIAL_STATE: WorldStateInstance = {
  instanceId: 'inst:got:001',
  definitionId: 'world:game_of_thrones',
  timelineId: 'timeline:canonical_298_ac',
  clock: {
    turnNumber: 1,
    inUniverseTime: '298 AC — Month of the Harvest Moon'
  },
  currentSituationNarrative: 'King Robert has ridden out to the Kingswood on a grand royal hunt with his squires. Lord Eddard Stark sits in the Tower of the Hand with the ancient book of lineages open on his mahogany desk. In the Street of Silk, Littlefinger tallies debts, while Queen Cersei watches the courtyard with cold golden eyes.',
  entityStates: {
    'char:ned_stark': {
      entityId: 'char:ned_stark',
      currentLocationId: 'loc:tower_of_the_hand',
      currentActivity: 'Comparing Baratheon and Lannister lineage records',
      emotionalState: 'Shocked; realizing black-of-hair vs gold-of-hair pattern',
      reputationScore: 92,
      physicalStatus: 'healthy',
      dynamicAttributes: { honorIntegrity: 100, kingInfluence: 65 },
      inventoryObjectIds: ['obj:lineage_tome']
    },
    'char:cersei_lannister': {
      entityId: 'char:cersei_lannister',
      currentLocationId: 'loc:red_keep_royal_apartments',
      currentActivity: 'Writing an urgent raven scroll to Lord Tywin at Casterly Rock',
      emotionalState: 'Coiled and predatory',
      reputationScore: 70,
      physicalStatus: 'healthy',
      dynamicAttributes: { royalGuardControl: 80 },
      inventoryObjectIds: []
    },
    'char:petyr_baelish': {
      entityId: 'char:petyr_baelish',
      currentLocationId: 'loc:baelish_brothel',
      currentActivity: 'Counting gold coins and meeting City Watch officers',
      emotionalState: 'Anticipating total chaos',
      reputationScore: 68,
      physicalStatus: 'healthy',
      dynamicAttributes: { cityWatchControl: 90 },
      inventoryObjectIds: []
    }
  },
  relationshipStates: {
    'rel:ned_cersei_standoff': {
      relationshipId: 'rel:ned_cersei_standoff',
      currentAffinity: -80,
      currentTrust: 5,
      currentPowerBalance: 10,
      recentInteractionsSummary: 'Spoke briefly at the tournament banquet.',
      brokenPromisesCount: 0
    }
  },
  epistemics: {
    entityKnownFacts: {
      'char:ned_stark': [
        'fact:jon_arryn_poisoned',
        'fact:crown_is_massively_in_debt',
        'fact:jon_snow_origin'
      ],
      'char:cersei_lannister': [
        'fact:cersei_children_bastards',
        'fact:crown_is_massively_in_debt'
      ],
      'char:petyr_baelish': [
        'fact:cersei_children_bastards',
        'fact:jon_arryn_poisoned',
        'fact:crown_is_massively_in_debt'
      ]
    },
    activeSecrets: [
      {
        id: 'sec:royal_bastardy',
        factId: 'fact:cersei_children_bastards',
        holdingEntityIds: ['char:cersei_lannister', 'char:petyr_baelish'],
        targetEntityIds: ['char:ned_stark'],
        consequencesIfExposed: 'Civil war, immediate execution of Cersei and children by King Robert.',
        exposureThreshold: 40
      }
    ],
    activeRumors: [
      {
        id: 'rumor:stark_lannister_bad_blood',
        content: 'House Stark and House Lannister are on the brink of open bloodshed following the arrest of the Imp.',
        plausibility: 0.9,
        isTrue: true,
        spreadRate: 8,
        knownByEntityIds: ['char:ned_stark', 'char:cersei_lannister', 'char:petyr_baelish']
      }
    ],
    publicExposedFactIds: ['fact:crown_is_massively_in_debt']
  },
  resourcePools: {
    'iron_throne_treasury': -6000000,
    'casterly_rock_gold_reserves': 50000000
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
