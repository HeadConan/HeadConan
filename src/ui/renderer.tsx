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
    <div id="world-canvas-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {blocks.map((block) => {
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
            className={`${colSpanClass} transition-all duration-300`}
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
