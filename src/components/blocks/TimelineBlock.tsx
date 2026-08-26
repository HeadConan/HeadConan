import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { Clock, CheckCircle2, Circle, AlertCircle, ChevronRight } from 'lucide-react';

export const TimelineBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  return (
    <div id="block-timeline-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'World Chronology & Schedule'}</h3>
        </div>
        <span className="text-xs font-mono text-cyan-400/90">Turn {world.turnCount || 1}</span>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {world.timeline.map((item, index) => {
          const isActive = item.status === 'active';
          const isCompleted = item.status === 'completed';

          return (
            <div key={item.id} id={`tl-item-${item.id}`} className="relative pl-6 pb-2 group">
              {/* Vertical connecting line */}
              {index < world.timeline.length - 1 && (
                <div className="absolute left-2.5 top-5 bottom-0 w-[1px] bg-white/10 group-hover:bg-white/20 transition-colors" />
              )}

              {/* Status node */}
              <div className="absolute left-0 top-1">
                {isActive ? (
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                ) : isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>

              {/* Card content */}
              <div className={`p-3 rounded-lg border transition-all ${
                isActive 
                  ? 'bg-cyan-950/20 border-cyan-500/30' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-cyan-300">
                    {item.time}
                  </span>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-cyan-400/10 text-cyan-300' : 'bg-white/5 text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-100 mt-1">{item.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>

                {isActive && onAction && (
                  <button
                    id={`action-timeline-${item.id}`}
                    onClick={() => onAction(`Address the immediate situation at "${item.title}"`)}
                    className="mt-2.5 px-2.5 py-1 text-[11px] font-medium text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded flex items-center space-x-1 transition-colors"
                  >
                    <span>Execute Next Directive</span>
                    <ChevronRight className="w-3 h-3 text-cyan-400" />
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
