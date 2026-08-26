import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { Radio, AlertTriangle, Info, Zap, Sparkles } from 'lucide-react';

export const EventBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  return (
    <div id="block-events-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'Live Ticker & Urgent Dispatches'}</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Live Wire
        </span>
      </div>

      {/* Events List */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
        {world.events.map((evt) => {
          const isCritical = evt.urgency === 'critical';
          const isHigh = evt.urgency === 'high';
          const badgeColor = isCritical
            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            : isHigh
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';

          return (
            <div
              key={evt.id}
              id={`event-item-${evt.id}`}
              className={`p-3 rounded-lg border transition-all ${
                isCritical 
                  ? 'bg-rose-950/20 border-rose-500/30' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                  {evt.urgency} // {evt.category}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{evt.timestamp}</span>
              </div>

              <h4 className="text-xs font-semibold text-slate-100 leading-snug">{evt.title}</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{evt.description}</p>

              {onAction && (
                <button
                  id={`act-event-${evt.id}`}
                  onClick={() => onAction(`Respond immediately to alert: "${evt.title}"`)}
                  className="mt-2.5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-slate-100 bg-white/5 hover:bg-white/10 border border-white/5 rounded transition-colors w-full text-left flex items-center justify-between"
                >
                  <span>Dispatch Response Directive</span>
                  <Zap className="w-3 h-3 text-amber-400" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
