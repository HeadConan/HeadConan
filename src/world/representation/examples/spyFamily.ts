/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Test World 1: SPY × FAMILY
 * 
 * Benchmark Stress Tests:
 * - Social simulation & domestic camouflage
 * - Hidden identities & secret agendas
 * - Severe information asymmetry (Twilight != Yor != Anya != Yuri)
 * - Everyday school & neighborhood life vs cold war geopolitical stakes
 */

import { WorldDefinition } from '../types/definition';
import { WorldStateInstance } from '../types/state';

export const SPY_FAMILY_WORLD_DEFINITION: WorldDefinition = {
  id: 'world:spy_family',
  name: 'SPY × FAMILY — Cold War Berlint',
  tagline: 'Maintain a makeshift camouflage family while averting an East-West nuclear war.',
  premise: 'In 1960s-era Ostania (Berlint), Westalis intelligence agent Twilight creates the counterfeit Forger family to infiltrate Eden Academy and approach the reclusive National Unity Party leader Donovan Desmond. Unknown to him, his adopted daughter is a telepath, and his fake wife is a lethal assassin.',
  version: {
    schemaVersion: '1.0.0',
    definitionVersion: '1.0.0',
    revision: 1,
    lastUpdated: '2026-08-26'
  },

  // 1. Axioms
  axioms: [
    {
      id: 'axiom:sf:cold_war',
      statement: 'Ostania (East) and Westalis (West) maintain a fragile peace governed by deniable clandestine espionage.',
      type: 'social_contract',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'social_retribution',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:sf:sss_paranoia',
      statement: 'The State Security Service (Secret Police / SSS) arrests and interrogates anyone suspected of espionage or treason without trial.',
      type: 'institutional_norm',
      scope: 'regional',
      isImmutable: true,
      enforcementMechanism: 'institutional_verdict',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:sf:telepathy_singularity',
      statement: 'Anya possesses genuine telepathic mind-reading abilities due to clandestine lab experiments, which she must keep secret to avoid being reclaimed.',
      type: 'metaphysical_law',
      scope: 'universal',
      isImmutable: true,
      enforcementMechanism: 'natural_law',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'axiom:sf:eden_elitism',
      statement: 'Eden Academy social standing is strictly governed by Stella Stars and Tonitrus Bolts; Imperial Scholars hold immense national prestige.',
      type: 'institutional_norm',
      scope: 'institutional',
      isImmutable: false,
      enforcementMechanism: 'institutional_verdict',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    }
  ],

  // 2. Ontological Capabilities
  capabilities: [
    {
      id: 'cap:master_espionage',
      name: 'Master Espionage & Disguise',
      domain: 'cognitive',
      description: 'Flawless disguise, lockpicking, behavioral deduction, and counter-surveillance.'
    },
    {
      id: 'cap:lethal_assassination',
      name: 'Superhuman Assassination Arts',
      domain: 'physical',
      description: 'Lethal martial prowess, blade accuracy, extreme physical durability, and poison resistance.'
    },
    {
      id: 'cap:telepathic_reading',
      name: 'Telepathic Mind Reading',
      domain: 'supernatural',
      description: 'Passive and active reception of surface thoughts from any nearby human or animal.'
    },
    {
      id: 'cap:sss_interrogation',
      name: 'State Security Authority',
      domain: 'institutional',
      description: 'Warrantless search, wiretapping clearance, and interrogation power.'
    }
  ],

  // 3. Baseline Entities
  characters: [
    {
      id: 'char:loid_forger',
      kind: 'character',
      name: 'Loid Forger (Agent Twilight)',
      aliases: ['Twilight', 'Dr. Loid Forger'],
      description: 'Westalis top spy posing as a mild-mannered psychiatrist at Berlint General Hospital.',
      tags: ['spy', 'westalis', 'father', 'psychiatrist'],
      canonStatus: 'canonical',
      archetypeRole: 'Undercover Master Spy',
      organizationIds: ['org:wise', 'org:forger_family'],
      primaryLocationId: 'loc:forger_apartment',
      personality: {
        temperament: 'analytical',
        moralAlignment: 'principled',
        primaryValues: ['Peace for children', 'Flawless mission execution', 'Protecting disguise'],
        fatalFlaw: 'Over-calculates and struggles to accept genuine personal affection',
        socialMask: 'Devoted, slightly stressed middle-class father and hospital doctor'
      },
      goals: [
        {
          id: 'goal:op_strix',
          description: 'Achieve Operation Strix by making Anya an Imperial Scholar to contact Donovan Desmond',
          priority: 'primary',
          progressPercent: 25,
          isSecret: true
        },
        {
          id: 'goal:maintain_disguise',
          description: 'Ensure neighbors, SSS, and school administrators believe the Forger family is perfectly normal',
          priority: 'survival',
          progressPercent: 80,
          isSecret: true
        }
      ],
      needs: [
        { type: 'safety', urgency: 75, satisfactionStatus: 'strained' },
        { type: 'purpose', urgency: 90, satisfactionStatus: 'fulfilled' },
        { type: 'social_belonging', urgency: 60, satisfactionStatus: 'deprived' }
      ],
      knownFactIds: [
        'fact:loid_is_twilight',
        'fact:op_strix_objective',
        'fact:desmond_recluse'
      ],
      beliefs: [
        {
          id: 'belief:yor_normal_clerk',
          statement: 'Yor is just a shy, clumsy Berlint City Hall clerk who needed a marriage of convenience to stop gossiping coworkers.',
          confidence: 0.9,
          isFactuallyAccurate: false,
          sourceType: 'testimony'
        },
        {
          id: 'belief:anya_normal_orphan',
          statement: 'Anya is an ordinary, slightly dim orphan who loves spy cartoons.',
          confidence: 0.85,
          isFactuallyAccurate: false,
          sourceType: 'direct_observation'
        }
      ],
      secretFactIds: ['fact:loid_is_twilight', 'fact:op_strix_objective'],
      capabilities: ['cap:master_espionage'],
      socialPermissions: ['enter:berlint_hospital', 'attend:eden_pta'],
      currentLocationId: 'loc:forger_apartment',
      currentActivity: 'Reviewing Anya’s math homework while preparing dinner',
      emotionalState: 'Mildly stressed; calculating contingency plans',
      publicReputationScore: 82,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:yor_forger',
      kind: 'character',
      name: 'Yor Forger (Thorn Princess)',
      aliases: ['Thorn Princess', 'Yor Briar'],
      description: 'Berlint City Hall clerk and deadly assassin for the secret Ostanian syndicate Garden.',
      tags: ['assassin', 'garden', 'mother', 'clerk'],
      canonStatus: 'canonical',
      archetypeRole: 'Deadly Assassin & Camouflage Wife',
      organizationIds: ['org:garden', 'org:forger_family', 'org:city_hall'],
      primaryLocationId: 'loc:forger_apartment',
      personality: {
        temperament: 'protective',
        moralAlignment: 'principled',
        primaryValues: ['Protecting her brother Yuri', 'Cleaning Ostania of corruption', 'Being a good mother'],
        fatalFlaw: 'Severe social insecurity and explosive physical reflexes when startled',
        socialMask: 'Polite, sweet, extraordinarily clumsy city hall administrative clerk'
      },
      goals: [
        {
          id: 'goal:cleanse_traitors',
          description: 'Eliminate Garden assassination targets assigned by the Shopkeeper',
          priority: 'primary',
          progressPercent: 70,
          isSecret: true
        },
        {
          id: 'goal:be_good_wife',
          description: 'Learn to cook edible meals and avoid raising suspicion from SSS or neighbors',
          priority: 'secondary',
          progressPercent: 35,
          isSecret: false
        }
      ],
      needs: [
        { type: 'social_belonging', urgency: 80, satisfactionStatus: 'adequate' },
        { type: 'safety', urgency: 65, satisfactionStatus: 'adequate' },
        { type: 'affection', urgency: 70, satisfactionStatus: 'adequate' }
      ],
      knownFactIds: [
        'fact:yor_is_assassin',
        'fact:yuri_in_foreign_ministry'
      ],
      beliefs: [
        {
          id: 'belief:loid_is_doctor',
          statement: 'Loid is a genuinely dedicated, overworked psychiatrist who lost his first wife.',
          confidence: 0.95,
          isFactuallyAccurate: false,
          sourceType: 'testimony'
        }
      ],
      secretFactIds: ['fact:yor_is_assassin'],
      capabilities: ['cap:lethal_assassination'],
      socialPermissions: ['enter:city_hall', 'attend:eden_pta'],
      currentLocationId: 'loc:forger_apartment',
      currentActivity: 'Practicing chopping vegetables with terrifying surgical precision',
      emotionalState: 'Warm and flustered; wondering if dinner will poison someone',
      publicReputationScore: 78,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:anya_forger',
      kind: 'character',
      name: 'Anya Forger (Subject 007)',
      aliases: ['Subject 007', 'Starlight Anya'],
      description: 'Telepathic orphan girl who knows everyone’s secret identities and wants world peace and peanuts.',
      tags: ['telepath', 'child', 'student', 'forger'],
      canonStatus: 'canonical',
      archetypeRole: 'Telepathic Catalyst Child',
      organizationIds: ['org:forger_family', 'org:eden_academy'],
      primaryLocationId: 'loc:forger_apartment',
      personality: {
        temperament: 'impulsive',
        moralAlignment: 'principled',
        primaryValues: ['Peanuts', 'Spy Wars Cartoons', 'Keeping Papa and Mama together', 'World Peace'],
        fatalFlaw: 'Easily distracted, struggles with school tests, misunderstands adult motives',
        socialMask: 'Cheerful, slightly quirky 6-year-old child'
      },
      goals: [
        {
          id: 'goal:earn_stellas',
          description: 'Collect 8 Stella Stars at Eden Academy to help Papa with his spy mission',
          priority: 'primary',
          progressPercent: 12,
          isSecret: false
        },
        {
          id: 'goal:keep_family_together',
          description: 'Prevent Papa and Mama from discovering each other’s secrets and breaking up',
          priority: 'survival',
          progressPercent: 90,
          isSecret: true
        }
      ],
      needs: [
        { type: 'affection', urgency: 95, satisfactionStatus: 'fulfilled' },
        { type: 'safety', urgency: 85, satisfactionStatus: 'adequate' }
      ],
      knownFactIds: [
        'fact:loid_is_twilight',
        'fact:yor_is_assassin',
        'fact:anya_telepath',
        'fact:yuri_is_sss'
      ],
      beliefs: [
        {
          id: 'belief:world_peace_peanuts',
          statement: 'If Anya gets 8 Stellas, Papa saves the world and buys infinite peanuts.',
          confidence: 1.0,
          isFactuallyAccurate: true,
          sourceType: 'inference'
        }
      ],
      secretFactIds: ['fact:anya_telepath'],
      capabilities: ['cap:telepathic_reading'],
      socialPermissions: ['enter:eden_classroom'],
      currentLocationId: 'loc:forger_apartment',
      currentActivity: 'Watching Spy Wars on television with huge starry eyes',
      emotionalState: 'Thrilled; munching peanuts',
      publicReputationScore: 60,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    },
    {
      id: 'char:yuri_briar',
      kind: 'character',
      name: 'Yuri Briar',
      aliases: ['Lieutenant Briar', 'SSS Officer'],
      description: 'Yor’s overprotective younger brother; secretly an elite officer in the Ostanian State Security Service (Secret Police).',
      tags: ['sss', 'secret_police', 'brother', 'ostania'],
      canonStatus: 'canonical',
      archetypeRole: 'Secret Police Interrogator & Suspicious In-Law',
      organizationIds: ['org:sss', 'org:foreign_ministry_cover'],
      primaryLocationId: 'loc:sss_headquarters',
      personality: {
        temperament: 'volatile',
        moralAlignment: 'loyalist',
        primaryValues: ['Sister Yor’s happiness', 'Crushing Westalis spies', 'Protecting Ostania'],
        fatalFlaw: 'Blinded by extreme sister complex and irrational hatred of Loid',
        socialMask: 'Earnest young diplomat in the Ministry of Foreign Affairs'
      },
      goals: [
        {
          id: 'goal:catch_twilight',
          description: 'Hunt down and execute Westalis master spy Twilight',
          priority: 'primary',
          progressPercent: 30,
          isSecret: true
        },
        {
          id: 'goal:expose_loid',
          description: 'Catch Loid Forger cheating or slipping up so Yor divorces him',
          priority: 'secondary',
          progressPercent: 40,
          isSecret: false
        }
      ],
      needs: [
        { type: 'affection', urgency: 90, satisfactionStatus: 'strained' },
        { type: 'status', urgency: 75, satisfactionStatus: 'adequate' }
      ],
      knownFactIds: [
        'fact:yuri_is_sss',
        'fact:hunting_twilight'
      ],
      beliefs: [
        {
          id: 'belief:loid_suspicious_husband',
          statement: 'Loid is a pretentious, smooth-talking phony who doesn’t appreciate Yor enough.',
          confidence: 0.9,
          isFactuallyAccurate: true,
          sourceType: 'direct_observation'
        },
        {
          id: 'belief:yor_pure_clerk',
          statement: 'Yor is the purest, sweetest girl in Ostania who could never hurt a fly.',
          confidence: 1.0,
          isFactuallyAccurate: false,
          sourceType: 'indoctrination'
        }
      ],
      secretFactIds: ['fact:yuri_is_sss'],
      capabilities: ['cap:sss_interrogation'],
      socialPermissions: ['order:sss_raid', 'enter:foreign_ministry'],
      currentLocationId: 'loc:sss_headquarters',
      currentActivity: 'Reviewing intercepted Westalis telegraph ciphers',
      emotionalState: 'Suspicious and irritable; plotting a surprise home visit',
      publicReputationScore: 85,
      physicalStatus: 'healthy',
      provenance: { source: 'authored', sourceConfidence: 1.0 },
      createdAtTurn: 1
    }
  ],

  organizations: [
    {
      id: 'org:forger_family',
      kind: 'organization',
      name: 'The Forger Household',
      description: 'A counterfeit nuclear family created for Operation Strix, rapidly becoming emotionally authentic.',
      category: 'family',
      memberEntityIds: ['char:loid_forger', 'char:yor_forger', 'char:anya_forger'],
      headquartersLocationId: 'loc:forger_apartment',
      resources: { 'cohesion': 85, 'domestic_stability': 70 },
      doctrineOrCharter: 'Maintain the illusion of a happy, prestigious, normal Berlint family.',
      internalCohesionScore: 85,
      publicPrestigeScore: 72,
      tags: ['household', 'camouflage'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:wise',
      kind: 'organization',
      name: 'WISE (Westalis Intelligence Services)',
      description: 'The premier clandestine intelligence network of Westalis dedicated to preventing war.',
      category: 'clandestine_agency',
      memberEntityIds: ['char:loid_forger'],
      resources: { 'intelligence_assets': 90, 'funding': 80 },
      doctrineOrCharter: 'Preserve the peace between East and West at all personal costs.',
      internalCohesionScore: 90,
      publicPrestigeScore: 10,
      tags: ['westalis', 'espionage'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:garden',
      kind: 'organization',
      name: 'Garden (The Shopkeeper’s Syndicate)',
      description: 'An ancient, semi-mythical Ostanian assassin organization pruning traitors and corrupt elements.',
      category: 'clandestine_agency',
      memberEntityIds: ['char:yor_forger'],
      resources: { 'lethality': 98, 'secrecy': 95 },
      doctrineOrCharter: 'Prune the diseased branches of Ostania for the beauty of the nation.',
      internalCohesionScore: 95,
      publicPrestigeScore: 5,
      tags: ['assassins', 'garden'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:sss',
      kind: 'organization',
      name: 'State Security Service (Secret Police)',
      description: 'The internal security apparatus of Ostania, mercilessly rooting out dissidents and foreign spies.',
      category: 'government',
      memberEntityIds: ['char:yuri_briar'],
      headquartersLocationId: 'loc:sss_headquarters',
      resources: { 'surveillance_coverage': 92, 'draconian_power': 96 },
      doctrineOrCharter: 'Absolute security and eradication of Westalis espionage.',
      internalCohesionScore: 88,
      publicPrestigeScore: 65,
      tags: ['police', 'interrogation'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:eden_academy',
      kind: 'organization',
      name: 'Eden Academy',
      description: 'The most prestigious preparatory school in Ostania, attended exclusively by high society and political elites.',
      category: 'academic_institution',
      memberEntityIds: ['char:anya_forger'],
      headquartersLocationId: 'loc:eden_academy_campus',
      resources: { 'prestige': 100, 'political_leverage': 90 },
      doctrineOrCharter: 'Cultivate elegance, discipline, and national leadership.',
      internalCohesionScore: 80,
      publicPrestigeScore: 99,
      tags: ['school', 'elites'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:city_hall',
      kind: 'organization',
      name: 'Berlint Municipal City Hall',
      description: 'The administrative bureaucracy of the city of Berlint where Yor works as a clerk.',
      category: 'government',
      memberEntityIds: ['char:yor_forger'],
      resources: { 'civic_records': 85 },
      doctrineOrCharter: 'Orderly municipal governance and citizen registration.',
      internalCohesionScore: 75,
      publicPrestigeScore: 70,
      tags: ['civic', 'berlint'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'org:foreign_ministry_cover',
      kind: 'organization',
      name: 'Ministry of Foreign Affairs (Diplomatic Bureau)',
      description: 'Ostanian government department used as official civilian cover by SSS officers.',
      category: 'government',
      memberEntityIds: ['char:yuri_briar'],
      resources: { 'diplomatic_cables': 80 },
      doctrineOrCharter: 'Manage international statecraft and foreign diplomatic missions.',
      internalCohesionScore: 80,
      publicPrestigeScore: 85,
      tags: ['diplomacy', 'government'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  locations: [
    {
      id: 'loc:forger_apartment',
      kind: 'location',
      name: 'Forger Apartment, Berlint',
      description: 'A cozy, tasteful middle-class apartment where three people with lethal secrets pretend to be an ordinary family.',
      type: 'residence',
      accessibility: 'restricted',
      atmosphere: 'Warm tea aromas, jazz playing from the radio, slight tension under polite smiles, hidden lockpicks in dressers.',
      spatialAffordances: ['prepare_dinner', 'listen_to_thoughts', 'inspect_hidden_compartments', 'host_guests'],
      residentEntityIds: ['char:loid_forger', 'char:yor_forger', 'char:anya_forger'],
      tags: ['home', 'berlint'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:eden_academy_campus',
      kind: 'location',
      name: 'Eden Academy Main Quad & Classrooms',
      description: 'Gothic towers, manicured lawns, marble statues, and intensely competitive children of ministers and oligarchs.',
      type: 'campus_hall',
      accessibility: 'restricted',
      atmosphere: 'Chilling elitism, elegant uniforms, whispers of peer pedigree, strict proctors observing manners.',
      spatialAffordances: ['compete_for_stella', 'interact_with_desmond', 'pass_written_exams'],
      controllingOrganizationId: 'org:eden_academy',
      tags: ['school', 'campus'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'loc:sss_headquarters',
      kind: 'location',
      name: 'State Security Service Annex',
      description: 'Brutalist concrete interrogation chambers, buzzing fluorescent tubes, and clacking typewriters.',
      type: 'office',
      accessibility: 'secret',
      atmosphere: 'Ominous shadows, iron manacles, cigarette smoke, and steel filing cabinets containing blacklists.',
      spatialAffordances: ['interrogate_suspects', 'review_wiretaps', 'dispatch_raids'],
      controllingOrganizationId: 'org:sss',
      tags: ['police', 'government'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  objects: [
    {
      id: 'obj:strix_dossier',
      kind: 'object',
      name: 'Classified Operation Strix Directive',
      description: 'Top-secret microfiche outlining WISE mission parameters to neutralize Donovan Desmond.',
      type: 'document',
      holderEntityId: 'char:loid_forger',
      associatedFactIds: ['fact:op_strix_objective'],
      tags: ['classified', 'wise'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    },
    {
      id: 'obj:thorn_stilettos',
      kind: 'object',
      name: 'Golden Needle Stilettos',
      description: 'Specialized gold-alloy puncturing needles used by the Thorn Princess for silent eliminations.',
      type: 'weapon',
      holderEntityId: 'char:yor_forger',
      associatedFactIds: ['fact:yor_is_assassin'],
      tags: ['assassin', 'weapon'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  resources: [
    {
      id: 'res:forger_savings',
      kind: 'resource',
      name: 'Forger Household Budget',
      resourceType: 'currency',
      quantity: 1200,
      unit: 'Dalcs',
      ownerEntityId: 'char:loid_forger',
      isFungible: true,
      description: 'Monthly WISE operational expense stipend for disguise maintenance.',
      tags: ['money'],
      provenance: { source: 'authored' },
      createdAtTurn: 1
    }
  ],

  // 4. First-Class Relationships
  relationships: [
    {
      id: 'rel:loid_yor_marriage',
      sourceEntityId: 'char:loid_forger',
      targetEntityId: 'char:yor_forger',
      kind: 'kinship',
      isBidirectional: true,
      affinity: 65,
      trust: 70,
      powerBalance: 0,
      visibility: 'fictitious_cover',
      coverStory: 'A normal, loving suburban marriage between a doctor and city hall worker.',
      narrativeDescription: 'A marriage of convenience where both secretly depend on the other to preserve their camouflage, yet genuine protective instincts are growing.',
      provenance: { source: 'authored' }
    },
    {
      id: 'rel:loid_anya_adoption',
      sourceEntityId: 'char:loid_forger',
      targetEntityId: 'char:anya_forger',
      kind: 'kinship',
      isBidirectional: true,
      affinity: 85,
      trust: 80,
      powerBalance: 40,
      visibility: 'public',
      narrativeDescription: 'Adoptive father and daughter. Loid views her as the lynchpin of world peace, while Anya adores her cool spy papa.',
      provenance: { source: 'authored' }
    },
    {
      id: 'rel:yor_anya_maternal',
      sourceEntityId: 'char:yor_forger',
      targetEntityId: 'char:anya_forger',
      kind: 'kinship',
      isBidirectional: true,
      affinity: 95,
      trust: 90,
      powerBalance: 20,
      visibility: 'public',
      narrativeDescription: 'Fiercely protective motherly bond. Yor will obliterate anyone who threatens Anya’s safety.',
      provenance: { source: 'authored' }
    },
    {
      id: 'rel:yuri_loid_suspicion',
      sourceEntityId: 'char:yuri_briar',
      targetEntityId: 'char:loid_forger',
      kind: 'distrust',
      isBidirectional: false,
      affinity: -40,
      trust: 15,
      powerBalance: 10,
      visibility: 'public',
      narrativeDescription: 'Yuri views Loid with extreme suspicion and jealousy, constantly hunting for proof of infidelity or unworthiness.',
      provenance: { source: 'authored' }
    }
  ],

  // 5. Social Norms & Laws
  socialNorms: [
    {
      id: 'norm:bachelor_suspicion',
      name: 'Ostanian Singlehood Suspicion',
      domain: 'decorum',
      prescribedBehavior: 'Adults above age 25 should be married and settled into productive civilian life.',
      prohibitedBehavior: 'Remaining single past 27, which invites neighbor reports to the SSS as potential foreign spies.',
      consequencesOfViolation: {
        socialSanction: 'Whispers from neighbors and surveillance flagged by SSS.',
        reputationLoss: 30
      },
      enforcementRigidity: 'strict'
    },
    {
      id: 'norm:eden_elegance',
      name: 'Eden Academy Elegance Code',
      domain: 'decorum',
      prescribedBehavior: 'Impeccable poise, aristocratic diction, and deference to tradition.',
      prohibitedBehavior: 'Brawling, crude speech, or academic dishonesty.',
      consequencesOfViolation: {
        socialSanction: 'Immediate awarding of Tonitrus Bolts; 8 bolts equals permanent expulsion.',
        reputationLoss: 50
      },
      enforcementRigidity: 'draconian'
    }
  ],

  lawsAndStatutes: [
    {
      id: 'law:state_security_act',
      title: 'Ostanian Internal Security & Espionage Suppression Act',
      jurisdictionOrgId: 'org:sss',
      governingCode: 'Article 14-B: Espionage against Ostania is punishable by immediate execution.',
      violationTriggers: ['possession_of_westalis_ciphers', 'espionage_activity'],
      punishmentSummary: 'Black site interrogation and summary execution.'
    }
  ],

  // 6. Power Structure
  powerRelations: [
    {
      id: 'pwr:sss_over_citizens',
      wielderEntityId: 'char:yuri_briar',
      subjectEntityId: 'char:loid_forger',
      domain: 'political',
      mechanism: 'State Security police mandate to arrest on suspicion of anti-Ostanian sentiments.',
      leverageIntensity: 85,
      canPunish: true,
      canReward: false,
      dependencyFactor: 'Loid must preserve his civilian cover and avoid armed confrontation with state police.'
    },
    {
      id: 'pwr:anya_epistemic_monopoly',
      wielderEntityId: 'char:anya_forger',
      subjectEntityId: 'char:loid_forger',
      domain: 'informational',
      mechanism: 'Telepathic awareness of Loid’s thoughts and secret identity without his knowledge.',
      leverageIntensity: 95,
      canPunish: true,
      canReward: true,
      dependencyFactor: 'Anya can inadvertently expose the mission or steer events behind his back.'
    }
  ],

  // 7. Ground Truth Facts (Crucial for Asymmetry Testing!)
  groundTruthFacts: [
    {
      id: 'fact:loid_is_twilight',
      statement: 'Loid Forger is actually Agent Twilight, the legendary master spy of Westalis.',
      subjectEntityId: 'char:loid_forger',
      domain: 'identity',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:yor_is_assassin',
      statement: 'Yor Forger is Thorn Princess, the lethal assassin of the clandestine Garden syndicate.',
      subjectEntityId: 'char:yor_forger',
      domain: 'identity',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:anya_telepath',
      statement: 'Anya Forger is Subject 007, capable of hearing anyone’s unfiltered surface thoughts.',
      subjectEntityId: 'char:anya_forger',
      domain: 'vulnerability',
      visibilityScope: 'singular_secret',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:yuri_is_sss',
      statement: 'Yuri Briar is a lieutenant in the State Security Service Secret Police hunting Twilight.',
      subjectEntityId: 'char:yuri_briar',
      domain: 'identity',
      visibilityScope: 'restricted',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:op_strix_objective',
      statement: 'Operation Strix requires making Anya an Imperial Scholar to access the reclusive Donovan Desmond.',
      subjectEntityId: 'char:loid_forger',
      domain: 'allegiance',
      visibilityScope: 'restricted',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:desmond_recluse',
      statement: 'Donovan Desmond only appears in public during Eden Academy Imperial Scholar gatherings.',
      domain: 'social_scandal',
      visibilityScope: 'domain_public',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:yuri_in_foreign_ministry',
      statement: 'Yuri Briar officially works as an administrative officer in the Ministry of Foreign Affairs.',
      subjectEntityId: 'char:yuri_briar',
      domain: 'identity',
      visibilityScope: 'universal_public',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    },
    {
      id: 'fact:hunting_twilight',
      statement: 'The SSS has intercepted encrypted Westalis radio chatter indicating Twilight is operating in Berlint.',
      domain: 'historical_event',
      visibilityScope: 'restricted',
      provenance: { source: 'authored', sourceConfidence: 1.0 }
    }
  ],

  // 8. Dynamic Actions
  actions: [
    {
      id: 'act:prepare_cover_dinner',
      name: 'Host Camouflage Family Dinner',
      category: 'social',
      description: 'Host an intimate dinner at the Forger residence to deflect neighbor and SSS suspicion.',
      actorEligibilityRoles: ['Loid Forger', 'Yor Forger'],
      preconditions: [
        {
          type: 'requires_location',
          targetKey: 'loc:forger_apartment',
          expectedValue: 'loc:forger_apartment',
          failureMessage: 'Must be present at the Forger Apartment.'
        }
      ],
      directEffects: [
        {
          targetDomain: 'entity',
          targetId: 'char:loid_forger',
          mutationType: 'increment',
          fieldKey: 'publicReputationScore',
          payload: 5,
          narrativeDescription: 'The neighbors observed a harmonious, picturesque family through the window.'
        }
      ],
      potentialConsequences: [
        {
          triggerProbability: 0.6,
          conditionDescription: 'If Yuri drops by unannounced',
          consequenceSummary: 'Yuri conducts a high-tension cross-examination of Loid over wine.',
          secondaryEffects: [],
          spawnEvent: {
            title: 'Unannounced Visit by SSS Lieutenant Yuri Briar',
            description: 'Yuri arrives with a bouquet for Yor and intense hostility for Loid.',
            urgency: 'high'
          }
        }
      ]
    },
    {
      id: 'act:telepathic_eavesdrop',
      name: 'Read Target’s Surface Thoughts',
      category: 'covert',
      description: 'Anya focuses her telepathic mind to decipher the hidden motives of an adult in the room.',
      actorEligibilityRoles: ['Anya Forger'],
      preconditions: [
        {
          type: 'requires_capability',
          targetKey: 'cap:telepathic_reading',
          expectedValue: 'cap:telepathic_reading',
          failureMessage: 'Requires telepathic capability.'
        }
      ],
      directEffects: [
        {
          targetDomain: 'epistemic',
          targetId: '$actor',
          mutationType: 'reveal_fact',
          fieldKey: 'knownFactIds',
          payload: 'fact:op_strix_objective',
          narrativeDescription: 'Anya intercepts frantic tactical calculations from Papa’s brain.'
        }
      ],
      potentialConsequences: []
    }
  ],

  // 9. Player Possibility Space
  possibilitySpace: {
    coreFantasyHook: 'Experience the exhilarating comedy and tension of maintaining a fake family while averting world war.',
    primaryInteractionLoop: 'Balance domestic chores, school exams, and high-stakes covert assignments without letting family members discover your true identity.',
    tabooOrForbiddenActions: [
      'Openly confessing assassination or espionage to state authorities',
      'Harm Anya or disrupt the Eden Academy pathway'
    ],
    availableRoles: [
      {
        id: 'role:sf_loid',
        title: 'Master Spy Twilight (Loid Forger)',
        name: 'Agent Twilight',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:loid_forger',
        socialPosition: 'Psychiatrist / Westalis Top Agent / Father',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['social', 'covert', 'academic'],
        suggestedPromptDirectives: [
          'Tutor Anya for tomorrow’s Eden Academy mathematics quiz',
          'Review counter-surveillance wiretaps around Berlint City Hall',
          'Deflect Yuri’s interrogative dinner questions with calm psychiatric charm',
          'Coordinate with handler Sylvia Sherwood regarding Desmond’s appearance'
        ],
        systemConstraints: [
          'Must never reveal Westalis spy allegiance to Yor or Anya',
          'Must keep civilian reputation above 60 to avoid SSS investigation'
        ],
        description: 'You are Twilight. The fate of East-West peace rests on your fake daughter getting good grades and your fake marriage holding together.'
      },
      {
        id: 'role:sf_yor',
        title: 'Thorn Princess (Yor Forger)',
        name: 'Yor Forger',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:yor_forger',
        socialPosition: 'City Hall Clerk / Elite Garden Assassin / Mother',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['social', 'covert', 'physical'],
        suggestedPromptDirectives: [
          'Prepare a home-cooked dinner without accidentally poisoning anyone',
          'Accept a clandestine Garden contract to eliminate an Ostanian traitor',
          'Defend Anya from neighborhood bullies using suppressed martial arts'
        ],
        systemConstraints: [
          'Must conceal Garden assassin identity from Loid and Yuri',
          'Must preserve civilian cover at City Hall'
        ],
        description: 'You are Yor. You can kick a speeding car into a lamppost, but you tremble at the thought of failing a PTA parent interview.'
      },
      {
        id: 'role:sf_anya',
        title: 'Telepathic Child (Anya Forger)',
        name: 'Anya Forger',
        inhabitationMode: 'canonical_character',
        associatedEntityId: 'char:anya_forger',
        socialPosition: 'Eden Academy Student / Secret Telepath',
        agencyLevel: 'character_ground',
        epistemicFogOfWar: 'strict_first_person',
        availableActionCategories: ['social', 'covert', 'academic'],
        suggestedPromptDirectives: [
          'Read Damian Desmond’s mind during recess to become his friend',
          'Secretly guide Papa and Mama to avoid mutual exposure',
          'Eat peanuts and watch the latest episode of Spy Wars'
        ],
        systemConstraints: [
          'Must never reveal telepathic ability or scientists will take you away',
          'Must avoid getting Tonitrus Bolts at school'
        ],
        description: 'You are Anya. You are the only person on Earth who knows Papa is a spy and Mama is an assassin. Heh.'
      }
    ]
  },

  // 10. Experience Profile & Presentation Signals
  experienceProfile: {
    primaryFantasy: 'Relationship',
    secondaryFantasy: 'Identity',
    dominantTone: 'tense_farce',
    tensionGradient: 'peaks_and_valleys',
    socialDensity: 5,
    informationAsymmetry: 5,
    consequenceLethality: 4,
    investigativeDepth: 3,
    recommendedModalities: ['dialogue_focused', 'dossier_matrix', 'relationship_web_graph']
  }
};

export const SPY_FAMILY_INITIAL_STATE: WorldStateInstance = {
  instanceId: 'inst:sf:001',
  definitionId: 'world:spy_family',
  timelineId: 'timeline:canonical',
  clock: {
    turnNumber: 1,
    inUniverseTime: '1962 Autumn — Tuesday 18:30 Berlint Time'
  },
  currentSituationNarrative: 'Evening settles over Berlint. In the Forger apartment, Loid is preparing dinner while discreetly reviewing operation notes. Anya is watching cartoons with peanuts, and Yor is politely washing dishes. In an SSS precinct across town, Yuri Briar has just signed off on an interrogation report and decided to visit his sister.',
  entityStates: {
    'char:loid_forger': {
      entityId: 'char:loid_forger',
      currentLocationId: 'loc:forger_apartment',
      currentActivity: 'Making beef stew and checking homework',
      emotionalState: 'Carefully poised; vigilant for unexpected knocks',
      reputationScore: 82,
      physicalStatus: 'healthy',
      dynamicAttributes: { disguiseIntegrity: 92, strixReadiness: 25 },
      inventoryObjectIds: ['obj:strix_dossier']
    },
    'char:yor_forger': {
      entityId: 'char:yor_forger',
      currentLocationId: 'loc:forger_apartment',
      currentActivity: 'Washing plates with extreme gentleness to avoid crushing porcelain',
      emotionalState: 'Happy and relaxed; grateful for a safe home',
      reputationScore: 78,
      physicalStatus: 'healthy',
      dynamicAttributes: { assassinReadiness: 100, cookingSkill: 15 },
      inventoryObjectIds: ['obj:thorn_stilettos']
    },
    'char:anya_forger': {
      entityId: 'char:anya_forger',
      currentLocationId: 'loc:forger_apartment',
      currentActivity: 'Watching cartoon spy showdowns on television',
      emotionalState: 'Excited; telepathically listening to stew thoughts',
      reputationScore: 60,
      physicalStatus: 'healthy',
      dynamicAttributes: { stellaStars: 1, tonitrusBolts: 1 },
      inventoryObjectIds: []
    },
    'char:yuri_briar': {
      entityId: 'char:yuri_briar',
      currentLocationId: 'loc:sss_headquarters',
      currentActivity: 'Stepping into a staff sedan bound for the Forger apartment',
      emotionalState: 'Intensely suspicious and eager to see Yor',
      reputationScore: 85,
      physicalStatus: 'healthy',
      dynamicAttributes: { suspicionOfLoid: 78 },
      inventoryObjectIds: []
    }
  },
  relationshipStates: {
    'rel:loid_yor_marriage': {
      relationshipId: 'rel:loid_yor_marriage',
      currentAffinity: 65,
      currentTrust: 70,
      currentPowerBalance: 0,
      recentInteractionsSummary: 'Shared a polite conversation over morning coffee.',
      brokenPromisesCount: 0
    }
  },
  epistemics: {
    entityKnownFacts: {
      'char:loid_forger': [
        'fact:loid_is_twilight',
        'fact:op_strix_objective',
        'fact:desmond_recluse',
        'fact:yuri_in_foreign_ministry'
      ],
      'char:yor_forger': [
        'fact:yor_is_assassin',
        'fact:yuri_in_foreign_ministry'
      ],
      'char:anya_forger': [
        'fact:loid_is_twilight',
        'fact:yor_is_assassin',
        'fact:anya_telepath',
        'fact:yuri_is_sss',
        'fact:op_strix_objective'
      ],
      'char:yuri_briar': [
        'fact:yuri_is_sss',
        'fact:hunting_twilight',
        'fact:yuri_in_foreign_ministry'
      ]
    },
    activeSecrets: [
      {
        id: 'sec:twilight_identity',
        factId: 'fact:loid_is_twilight',
        holdingEntityIds: ['char:loid_forger', 'char:anya_forger'],
        targetEntityIds: ['char:yor_forger', 'char:yuri_briar'],
        consequencesIfExposed: 'Immediate SSS military raid and total collapse of Operation Strix.',
        exposureThreshold: 20,
        camouflageStrategy: 'Psychiatrist Dr. Loid Forger'
      },
      {
        id: 'sec:thorn_princess_identity',
        factId: 'fact:yor_is_assassin',
        holdingEntityIds: ['char:yor_forger', 'char:anya_forger'],
        targetEntityIds: ['char:loid_forger', 'char:yuri_briar'],
        consequencesIfExposed: 'Arrest by state or mutual lethal engagement with WISE.',
        exposureThreshold: 25,
        camouflageStrategy: 'Mild-mannered municipal clerk'
      },
      {
        id: 'sec:anya_telepathy',
        factId: 'fact:anya_telepath',
        holdingEntityIds: ['char:anya_forger'],
        targetEntityIds: ['char:loid_forger', 'char:yor_forger', 'char:yuri_briar'],
        consequencesIfExposed: 'Return to underground research laboratory.',
        exposureThreshold: 15,
        camouflageStrategy: 'Quirky cartoon-loving toddler'
      },
      {
        id: 'sec:yuri_secret_police',
        factId: 'fact:yuri_is_sss',
        holdingEntityIds: ['char:yuri_briar', 'char:anya_forger'],
        targetEntityIds: ['char:yor_forger'],
        consequencesIfExposed: 'Yor would be devastated by her sweet brother becoming a violent torturer.',
        exposureThreshold: 35,
        camouflageStrategy: 'Foreign Ministry diplomat'
      }
    ],
    activeRumors: [
      {
        id: 'rumor:westalis_spy_berlint',
        content: 'A top Westalis infiltration agent codenamed Twilight is lurking in Berlint’s upscale districts.',
        plausibility: 0.95,
        isTrue: true,
        spreadRate: 4,
        knownByEntityIds: ['char:yuri_briar', 'char:loid_forger', 'char:anya_forger']
      }
    ],
    publicExposedFactIds: [
      'fact:yuri_in_foreign_ministry',
      'fact:desmond_recluse'
    ]
  },
  resourcePools: {
    'wise_intel_reserves': 88,
    'garden_contracts': 12
  },
  scheduler: {
    queue: [],
    budgetPerTurn: 3,
    seed: 0xc0ffee,
    nextSeq: 0
  },
  recentEvents: [
    {
      id: 'evt:sf:001',
      turnOccurred: 1,
      timestampStr: '1962 Autumn — Tuesday 18:00',
      title: 'Anya Receives 1st Stella Star',
      category: 'academic_milestone',
      description: 'Anya successfully helped save a drowning boy at the municipal pool, earning Eden Academy recognition.',
      initiatorEntityId: 'char:anya_forger',
      affectedEntityIds: ['char:loid_forger', 'char:yor_forger'],
      publicKnowledgeLevel: 'universal'
    }
  ],
  eventChronicleLog: []
};
