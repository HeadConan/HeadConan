import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { LayoutGrid, Crown, Sparkles, Compass, AlertCircle } from 'lucide-react';

export const DashboardBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  return (
    <div id="block-dashboard-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col p-5">
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center space-x-2">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono uppercase text-amber-400/90 tracking-wider">
            {world.userRole.title} // {world.userRole.authority}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400">{world.genre}</span>
      </div>

      <h3 className="text-xl font-serif font-bold text-slate-100 mb-2">{world.name}</h3>
      <p className="text-xs text-slate-300 leading-relaxed mb-4">{world.premise}</p>

      <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 mb-4">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-300 mb-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Active Operational Reality</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{world.currentSituation}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <div className="p-3 rounded bg-white/[0.02] border border-white/5">
          <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Core Objective</div>
          <p className="text-xs text-slate-300">{world.userRole.objective}</p>
        </div>
        <div className="p-3 rounded bg-white/[0.02] border border-white/5">
          <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Player Authority Traits</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {world.userRole.traits.map((t, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
