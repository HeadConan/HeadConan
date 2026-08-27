import React from 'react';
import { WorldState, UIBlock } from '../world/types';
import { UI_CAPABILITY_REGISTRY } from './registry';

interface WorldCanvasRendererProps {
  world: WorldState;
  blocks: UIBlock[];
  onAction: (action: string) => void;
  onAddNote: (content: string) => void;
}

export const WorldCanvasRenderer: React.FC<WorldCanvasRendererProps> = ({
  world,
  blocks,
  onAction,
  onAddNote,
}) => {
  return (
    <div id="world-canvas-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block, index) => {
        const descriptor = UI_CAPABILITY_REGISTRY[block.type];
        if (!descriptor) {
          return null;
        }

        const Component = descriptor.component;

        // Calculate responsive column spans based on block configuration and priority
        const colSpanClass =
          block.colSpan === 3
            ? 'col-span-1 md:col-span-2 lg:col-span-3'
            : block.colSpan === 2
            ? 'col-span-1 md:col-span-2'
            : 'col-span-1';

        return (
          <div
            key={block.id}
            id={`ui-block-container-${block.id}`}
            className={`${colSpanClass} pay-fade-up`}
            style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
          >
            <Component
              block={block}
              world={world}
              onAction={onAction}
              onAddNote={onAddNote}
            />
          </div>
        );
      })}
    </div>
  );
};
