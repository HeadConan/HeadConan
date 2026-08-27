import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { Clock, CheckCircle2, Circle, AlertCircle, ChevronRight } from 'lucide-react';

export const TimelineBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  return (
    <div id="block-timeline-view" className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'World Chronology & Schedule'}</h3>
        </div>
        <span className="font-mono text-xs tabular-nums text-zinc-500">Turn {world.turnCount || 1}</span>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {world.timeline.map((item, index) => {
          const isActive = item.status === 'active';
          const isCompleted = item.status === 'completed';

          return (
            <div key={item.id} id={`tl-item-${item.id}`} className="group relative pb-2 pl-6">
              {/* Vertical connecting line */}
              {index < world.timeline.length - 1 && (
                <div className="absolute bottom-0 left-2.5 top-5 w-px bg-zinc-200 transition-colors group-hover:bg-zinc-300" />
              )}

              {/* Status node */}
              <div className="absolute left-0 top-1">
                {isActive ? (
                  <div className="flex size-5 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900">
                    <span className="size-2 animate-ping rounded-full bg-zinc-100" />
                  </div>
                ) : isCompleted ? (
                  <CheckCircle2 className="size-5 text-emerald-600" strokeWidth={1.75} />
                ) : (
                  <Circle className="size-5 text-zinc-300" strokeWidth={1.75} />
                )}
              </div>

              {/* Card content */}
              <div className={`rounded-lg border p-3 transition-all ${
                isActive
                  ? 'border-zinc-900 bg-zinc-50'
                  : 'border-zinc-100 bg-white hover:border-zinc-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-medium text-zinc-600">
                    {item.time}
                  </span>
                  <span className={`rounded font-mono text-[10px] uppercase px-1.5 py-0.5 ${
                    isActive ? 'bg-zinc-900 text-zinc-50' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h4 className="mt-1 text-xs font-semibold text-zinc-900">{item.title}</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{item.description}</p>

                {isActive && onAction && (
                  <button
                    id={`action-timeline-${item.id}`}
                    onClick={() => onAction(`Address the immediate situation at "${item.title}"`)}
                    className="mt-2.5 flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                  >
                    <span>Execute Next Directive</span>
                    <ChevronRight className="size-3 text-zinc-400" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
