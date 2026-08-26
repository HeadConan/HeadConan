import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { GitCommit, ArrowRight, ShieldAlert, Heart, Zap, Shuffle } from 'lucide-react';

export const RelationshipBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  const relationships = world.relationships || [];

  return (
    <div id="block-relationships-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'Interpersonal Dynamics & Friction'}</h3>
        </div>
        <span className="text-xs font-mono text-purple-400/90">{relationships.length} Active Ties</span>
      </div>

      {/* Network List */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {relationships.length > 0 ? (
          relationships.map((rel) => {
            const isTension = rel.type === 'rivalry' || rel.type === 'distrust';
            return (
              <div
                key={rel.id}
                id={`rel-card-${rel.id}`}
                className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs font-medium text-slate-200">
                    <span className="text-indigo-300">{rel.sourceName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-purple-300">{rel.targetName}</span>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                    isTension 
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                  }`}>
                    {rel.type} ({rel.intensity}%)
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{rel.description}</p>

                {onAction && (
                  <button
                    onClick={() => onAction(`Intervene in the dynamic between ${rel.sourceName} and ${rel.targetName}`)}
                    className="mt-2.5 px-2 py-1 text-[11px] font-medium text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 rounded border border-purple-500/20 transition-colors flex items-center space-x-1"
                  >
                    <span>Influence Dynamic</span>
                    <Shuffle className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <p className="text-xs">Dynamic relational network evolving with your actions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
