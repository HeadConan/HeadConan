/**
 * HEADCONAN WORLD REPRESENTATION FOUNDATION
 * Module: Experience Model & Presentation Signals
 * 
 * Provides psychological, pacing, and tension signals for presentation systems.
 * Invariant: Does NOT hard-code React components or UI layouts inside the world schema.
 */

export type PrimaryFantasyArchetype =
  | 'Identity'
  | 'Power'
  | 'Social'
  | 'Relationship'
  | 'Exploration'
  | 'Mystery & Knowledge'
  | 'Survival'
  | 'Creation & System'
  | 'Political & Intrigue'
  | 'Life & Path'
  | 'Transformation & Causality';

export interface ExperienceProfile {
  primaryFantasy: PrimaryFantasyArchetype;
  secondaryFantasy?: PrimaryFantasyArchetype;
  
  // Emotional & Experiential Registers
  dominantTone: 'tense_farce' | 'grim_foreboding' | 'cozy_intellectual' | 'mundane_academic' | 'epic_heroic' | 'melancholy';
  tensionGradient: 'peaks_and_valleys' | 'steady_escalation' | 'slow_burn' | 'episodic_puzzle';
  
  // Cognitive & Systemic Dimensions (1 - 5)
  socialDensity: number;      // 1 (Isolated lone explorer) to 5 (Dense court intrigue / packed dinner table)
  informationAsymmetry: number; // 1 (Open public cards) to 5 (Extreme fog-of-war and multiple secret agendas)
  consequenceLethality: number; // 1 (Mild social embarrassment) to 5 (Execution, war, total ruin)
  investigativeDepth: number;   // 1 (Action driven) to 5 (Meticulous deductive forensic reasoning)
  
  // Recommended Presentation Affordances (Hints for UI Director)
  recommendedModalities: Array<
    | 'dialogue_focused'
    | 'forensic_evidence_board'
    | 'territorial_tactical_map'
    | 'relationship_web_graph'
    | 'academic_schedule_timeline'
    | 'dossier_matrix'
  >;
}
