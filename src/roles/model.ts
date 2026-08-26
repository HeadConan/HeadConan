export type RoleType = 'PLAYER' | 'DIRECTOR' | 'ARCHITECT' | 'OBSERVER';

export type AgencyLevel = 'character-level' | 'world-level' | 'system-level' | 'none';

export type PerspectiveType = 'first-person' | 'third-person' | 'omniscient';

export type KnowledgeScope = 'limited' | 'fog-of-war' | 'broad' | 'omniscient';

export type RolePermission = 
  | 'move'
  | 'talk'
  | 'decide'
  | 'command'
  | 'create'
  | 'modify'
  | 'reveal'
  | 'spawn'
  | 'schedule'
  | 'narrate'
  | 'architect'
  | 'observe';

export interface RoleSlot {
  id: string;
  name: string;
  type: RoleType;
  title: string;
  agency: AgencyLevel;
  perspective: PerspectiveType;
  knowledge: KnowledgeScope;
  permissions: RolePermission[];
  controlledEntityId?: string; // e.g. Character ID or Faction ID
  controlledEntityName?: string;
  avatar?: string;
  description: string;
  suggestedPrompts: string[];
}

export function hasPermission(role: RoleSlot, permission: RolePermission): boolean {
  return role.permissions.includes(permission) || role.type === 'ARCHITECT';
}

export function isDirectorOrArchitect(role: RoleSlot): boolean {
  return role.type === 'DIRECTOR' || role.type === 'ARCHITECT';
}

export function getRoleBadgeStyle(type: RoleType): { bg: string; text: string; border: string; icon: string } {
  switch (type) {
    case 'PLAYER':
      return {
        bg: 'bg-indigo-500/15',
        text: 'text-indigo-300',
        border: 'border-indigo-500/30',
        icon: '👑',
      };
    case 'DIRECTOR':
      return {
        bg: 'bg-purple-500/15',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
        icon: '🎭',
      };
    case 'ARCHITECT':
      return {
        bg: 'bg-amber-500/15',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        icon: '⚙️',
      };
    case 'OBSERVER':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        icon: '👁️',
      };
  }
}
