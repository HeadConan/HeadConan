import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { Radio, AlertTriangle, Info, Zap, Sparkles } from 'lucide-react';

export const EventBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  return (
    <div id="block-events-view" className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Radio className="size-4 animate-pulse text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'Live Ticker & Urgent Dispatches'}</h3>
        </div>
        <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 font-mono text-[10px] text-rose-700">
          Live Wire
        </span>
      </div>

      {/* Events List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3.5">
        {world.events.map((evt) => {
          const isCritical = evt.urgency === 'critical';
          const isHigh = evt.urgency === 'high';
          const badgeColor = isCritical
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : isHigh
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : 'border-zinc-200 bg-zinc-50 text-zinc-600';

          return (
            <div
              key={evt.id}
              id={`event-item-${evt.id}`}
              className={`rounded-lg border p-3 transition-all ${
                isCritical
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-zinc-100 bg-white hover:border-zinc-200'
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${badgeColor}`}>
                  {evt.urgency} // {evt.category}
                </span>
                <span className="font-mono text-[10px] text-zinc-400">{evt.timestamp}</span>
              </div>

              <h4 className="text-xs font-semibold leading-snug text-zinc-900">{evt.title}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{evt.description}</p>

              {onAction && (
                <button
                  id={`act-event-${evt.id}`}
                  onClick={() => onAction(`Respond immediately to alert: "${evt.title}"`)}
                  className="mt-2.5 flex w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-left text-[11px] font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  <span>Dispatch Response Directive</span>
                  <Zap className="size-3 text-amber-600" strokeWidth={1.75} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
