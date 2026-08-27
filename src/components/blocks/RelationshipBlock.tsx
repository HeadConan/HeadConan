import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { GitCommit, ArrowRight, ShieldAlert, Heart, Zap, Shuffle } from 'lucide-react';

export const RelationshipBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  const relationships = world.relationships || [];

  return (
    <div id="block-relationships-view" className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <GitCommit className="size-4 text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'Interpersonal Dynamics & Friction'}</h3>
        </div>
        <span className="font-mono text-xs tabular-nums text-zinc-500">{relationships.length} Active Ties</span>
      </div>

      {/* Network List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {relationships.length > 0 ? (
          relationships.map((rel) => {
            const isTension = rel.type === 'rivalry' || rel.type === 'distrust';
            return (
              <div
                key={rel.id}
                id={`rel-card-${rel.id}`}
                className="rounded-lg border border-zinc-100 bg-white p-3.5 transition-all hover:border-zinc-300"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-800">
                    <span className="text-zinc-900">{rel.sourceName}</span>
                    <ArrowRight className="size-3.5 text-zinc-400" strokeWidth={1.75} />
                    <span className="text-zinc-900">{rel.targetName}</span>
                  </div>

                  <span className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase ${
                    isTension
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}>
                    {rel.type} ({rel.intensity}%)
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-zinc-500">{rel.description}</p>

                {onAction && (
                  <button
                    onClick={() => onAction(`Intervene in the dynamic between ${rel.sourceName} and ${rel.targetName}`)}
                    className="mt-2.5 flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                  >
                    <span>Influence Dynamic</span>
                    <Shuffle className="size-3" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-zinc-400">
            <p className="text-xs">Dynamic relational network evolving with your actions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
