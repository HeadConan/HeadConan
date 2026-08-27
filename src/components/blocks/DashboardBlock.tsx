import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { LayoutGrid, Crown, Sparkles, Compass, AlertCircle } from 'lucide-react';

export const DashboardBlock: React.FC<UIBlockProps> = ({ block, world, onAction }) => {
  return (
    <div id="block-dashboard-view" className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <Crown className="size-4 text-amber-600" strokeWidth={1.75} />
          <span className="font-mono text-xs uppercase tracking-wider text-amber-700">
            {world.userRole.title} // {world.userRole.authority}
          </span>
        </div>
        <span className="font-mono text-xs text-zinc-500">{world.genre}</span>
      </div>

      <h3 className="mb-2 font-serif text-xl font-bold text-zinc-900">{world.name}</h3>
      <p className="mb-4 text-xs leading-relaxed text-zinc-600">{world.premise}</p>

      <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
          <AlertCircle className="size-3.5 text-zinc-500" strokeWidth={1.75} />
          <span>Active Operational Reality</span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-600">{world.currentSituation}</p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-zinc-100 bg-white p-3">
          <div className="mb-1 font-mono text-[10px] uppercase text-zinc-500">Core Objective</div>
          <p className="text-xs text-zinc-700">{world.userRole.objective}</p>
        </div>
        <div className="rounded-lg border border-zinc-100 bg-white p-3">
          <div className="mb-1 font-mono text-[10px] uppercase text-zinc-500">Player Authority Traits</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {world.userRole.traits.map((t, idx) => (
              <span key={idx} className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
