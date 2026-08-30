import React from 'react';
import { WorldState, UIBlock } from '../world/types';

export interface UIBlockProps {
  block: UIBlock;
  world: WorldState;
  onAction?: (actionPrompt: string) => void;
  onAddNote?: (content: string) => void;
  onSelectEntity?: (entityType: string, id: string) => void;
  onOpenVisualStudio?: (target?: { type: 'character' | 'location' | 'evidence' | 'event'; id?: string }) => void;
  /** W3.3：点击角色卡片 → 设置对话目标（conversation 场景） */
  onSelectTarget?: (charId: string) => void;
  /** W3.3：当前选中的对话目标（高亮显示） */
  selectedTargetId?: string;
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
