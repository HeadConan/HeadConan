import { WorldState, UIBlock, UIPlanning } from '../world/types';
import { RoleSlot } from '../roles/model';
import type { SceneType } from '../world/representation/types/state';
import { DIRECTOR_REVEAL_DIRECTIVES } from '../world/spyFamily/spyFamilyMin';
import { suggestedUtterances } from '../world/runtime/dialogue';

export interface UIDirectorOptions {
  activeRole: RoleSlot;
  focusedEntityId?: string;
  isDirectorOverlayActive?: boolean;
  /** W3.1：当前场景类型（conversation→角色主面 / exploration→地图主面） */
  scene?: SceneType;
  /** W3.3：对话目标名（conversation 场景内点击角色卡片后，建议话语定向该角色） */
  dialogueTargetName?: string;
}

export function computeUIPlan(
  world: WorldState,
  options: UIDirectorOptions
): UIPlanning {
  const { activeRole, isDirectorOverlayActive, scene, dialogueTargetName } = options;
  const style = world.style;
  const isDirector = activeRole.type === 'DIRECTOR' || activeRole.type === 'ARCHITECT' || isDirectorOverlayActive;
  const isObserver = activeRole.type === 'OBSERVER';

  const plannedBlocks: UIBlock[] = [];
  const maxSurfaces = style.attentionBudget?.maxVisibleSurfaces || 6;

  // 1. Primary Centerpiece Surface according to World Grammar
  //    W3.1：场景驱动主面——conversation 以角色为主面，exploration 以地图为主面
  if (scene === 'conversation' && world.characters && world.characters.length > 0) {
    plannedBlocks.push({
      id: 'surface-characters-main',
      type: 'character',
      title: style.visualLanguage === 'archival-investigative'
        ? 'Suspects & Persons of Interest'
        : style.visualLanguage === 'personal-social'
        ? 'Social Circle & Active Encounters'
        : 'Imperial Cabinet & Key Figures',
      priority: 'primary',
      colSpan: 2,
    });
  } else if (scene === 'exploration' && world.locations && world.locations.length > 0) {
    plannedBlocks.push({
      id: 'surface-tactical-map',
      type: 'map',
      title: style.visualLanguage === 'institutional-bureaucratic'
        ? 'Strategic Theater & Garrison Territories'
        : 'Spatial Layout & Key Locations',
      priority: 'primary',
      colSpan: 2,
    });
  } else if (style.primarySurfaceType === 'evidence-board' && world.clues && world.clues.length > 0) {
    plannedBlocks.push({
      id: 'surface-evidence-board',
      type: 'evidence-board',
      title: 'Active Evidence Board & Thread Analysis',
      priority: 'primary',
      colSpan: 2,
    });
  } else if (style.primarySurfaceType === 'map' && world.locations && world.locations.length > 0) {
    plannedBlocks.push({
      id: 'surface-tactical-map',
      type: 'map',
      title: style.visualLanguage === 'institutional-bureaucratic'
        ? 'Strategic Theater & Garrison Territories'
        : 'Spatial Layout & Key Locations',
      priority: 'primary',
      colSpan: 2,
    });
  } else {
    // Default primary: Character/Dossier or Map
    plannedBlocks.push({
      id: 'surface-characters-main',
      type: 'character',
      title: style.visualLanguage === 'archival-investigative'
        ? 'Suspects & Persons of Interest'
        : style.visualLanguage === 'personal-social'
        ? 'Social Circle & Active Encounters'
        : 'Imperial Cabinet & Key Figures',
      priority: 'primary',
      colSpan: 2,
    });
  }

  // 2. Director / Architect Exclusive Surface if Director agency is active
  if (isDirector) {
    plannedBlocks.push({
      id: 'surface-director-console',
      type: 'director-console',
      title: activeRole.type === 'ARCHITECT' ? 'World Ontological Rules & Axiom Editor' : 'World Director & Narrative Spawning Matrix',
      priority: 'primary',
      colSpan: 1,
    });
  } else {
    // Standard Player or Observer: Key Vitals / System Stats
    if (world.stats && world.stats.length > 0) {
      plannedBlocks.push({
        id: 'surface-stats',
        type: 'stats',
        title: style.visualLanguage === 'archival-investigative'
          ? 'Case Parameters & Threat Gauges'
          : style.visualLanguage === 'personal-social'
          ? 'Student Vitals & Academic Standing'
          : 'Imperial Stability & Resource Vitals',
        priority: 'primary',
        colSpan: 1,
      });
    }
  }

  // 3. Secondary Context Surfaces (Character roster, Documents, Timeline, Events)
  // Add Characters if not already primary
  if (plannedBlocks.every(b => b.type !== 'character') && world.characters && world.characters.length > 0) {
    plannedBlocks.push({
      id: 'surface-characters',
      type: 'character',
      title: style.visualLanguage === 'archival-investigative'
        ? 'Suspects & Interrogation Roster'
        : style.visualLanguage === 'personal-social'
        ? 'Peers & Academic Network'
        : 'Imperial Cabinet & Figures',
      priority: 'secondary',
      colSpan: style.primarySurfaceType === 'evidence-board' ? 1 : 2,
    });
  }

  // Add Spatial Map if not already primary
  if (plannedBlocks.every(b => b.type !== 'map') && world.locations && world.locations.length > 0 && plannedBlocks.length < maxSurfaces) {
    plannedBlocks.push({
      id: 'surface-map-secondary',
      type: 'map',
      title: 'Geographic / Structural Locations',
      priority: 'secondary',
      colSpan: 1,
    });
  }

  // Add Documents (Classified cables, personal diaries, or forensic evidence)
  if (world.documents && world.documents.length > 0 && plannedBlocks.length < maxSurfaces) {
    plannedBlocks.push({
      id: 'surface-documents',
      type: 'document',
      title: style.narrativeGrammar?.documentClassificationDefault || 'Intelligence & Archives',
      priority: 'secondary',
      colSpan: 1,
    });
  }

  // Add Chronology / Timeline / Alibis
  if (world.timeline && world.timeline.length > 0 && plannedBlocks.length < maxSurfaces) {
    plannedBlocks.push({
      id: 'surface-timeline',
      type: 'timeline',
      title: style.visualLanguage === 'archival-investigative'
        ? 'Murder Night Alibi Chronology'
        : style.visualLanguage === 'personal-social'
        ? 'Class Schedule & Deadlines'
        : 'Strategic Campaign Sequence',
      priority: 'secondary',
      colSpan: 1,
    });
  }

  // Add Emergent Events / Dispatches
  if (world.events && world.events.length > 0 && plannedBlocks.length < maxSurfaces) {
    plannedBlocks.push({
      id: 'surface-events',
      type: 'event',
      title: style.narrativeGrammar?.dispatchLabel || 'Urgent World Dispatches',
      priority: 'secondary',
      colSpan: 1,
    });
  }

  // Add Relationship Network if collegiate / intrigue
  if (world.relationships && world.relationships.length > 0 && plannedBlocks.length < maxSurfaces) {
    plannedBlocks.push({
      id: 'surface-relationships',
      type: 'relationship',
      title: 'Factions & Relational Tension Matrix',
      priority: 'secondary',
      colSpan: 1,
    });
  }

  // Determine suggested interactions based on active Role
  let suggestedInteractions = style.interactionGrammar?.defaultActions || [];

  if (activeRole.type === 'DIRECTOR') {
    suggestedInteractions = DIRECTOR_REVEAL_DIRECTIVES.map((d) => d.command);
  } else if (activeRole.type === 'ARCHITECT') {
    suggestedInteractions = [
      'Rewrite axiom: Prohibit all direct telegraph communications',
      'Add new faction: The Obsidian Syndicate',
      'Alter timeline constraint: Accelerate deadline by 48 hours',
      'Reveal hidden subterranean laboratory under Sector 4'
    ];
  } else if (activeRole.type === 'OBSERVER') {
    suggestedInteractions = [
      'Observe Imperial Cabinet reaction to recent decrees',
      'Track movement of Northern Garrison over time',
      'Review complete chronological causality chain'
    ];
  } else if (scene === 'conversation') {
    // W3.3：场景绑定话语——conversation 场景建议对话；点击目标后定向该角色
    suggestedInteractions = suggestedUtterances('conversation', dialogueTargetName);
  } else if (scene === 'exploration') {
    // W3.3：exploration 场景建议探索类动作
    suggestedInteractions = suggestedUtterances('exploration');
  } else if (activeRole.suggestedPrompts && activeRole.suggestedPrompts.length > 0) {
    suggestedInteractions = activeRole.suggestedPrompts;
  }

  return {
    activeLayout: style.spatialArchetype || 'workspace',
    suggestedInteractions,
    blocks: plannedBlocks,
  };
}
