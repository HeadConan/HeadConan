import React from 'react';
import { WorldState, UIBlock } from '../world/types';

export interface UIBlockProps {
  block: UIBlock;
  world: WorldState;
  onAction?: (actionPrompt: string) => void;
  onAddNote?: (content: string) => void;
  onSelectEntity?: (entityType: string, id: string) => void;
  onOpenVisualStudio?: (target?: { type: 'character' | 'location' | 'evidence' | 'event'; id?: string }) => void;
}

export interface UIBlockDescriptor {
  type: string;
  name: string;
  description: string;
  whatItRepresents: string;
  whenUsed: string;
  requiredData: string[];
  component: React.ComponentType<UIBlockProps>;
}
