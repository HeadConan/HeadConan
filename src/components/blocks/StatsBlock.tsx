import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { Activity, TrendingUp, TrendingDown, Minus, ShieldCheck, AlertTriangle } from 'lucide-react';

export const StatsBlock: React.FC<UIBlockProps> = ({ block, world }) => {
  return (
    <div id="block-stats-view" className="bg-[#0d101a] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-medium tracking-wider uppercase text-slate-200">{block.title || 'System Indicators & Vitals'}</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          Equilibrium Sync
        </span>
      </div>

      {/* Metrics List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {world.stats.map((stat) => {
          const percentage = Math.min(100, Math.max(0, (stat.value / (stat.max || 100)) * 100));
          const isWarning = stat.status === 'warning' || percentage < 50;
          const isCritical = stat.status === 'critical' || percentage < 25;

          const barColor = isCritical
            ? 'bg-rose-500'
            : isWarning
            ? 'bg-amber-500'
            : 'bg-indigo-500';

          return (
            <div
              key={stat.id}
              id={`stat-card-${stat.id}`}
              className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-slate-200">{stat.label}</span>
                  {stat.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                  {stat.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                  {stat.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-500" />}
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-mono font-bold text-slate-100">
                    {stat.value}{stat.unit || ''}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    / {stat.max}{stat.unit || ''}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {stat.description && (
                <p className="text-[11px] text-slate-400 leading-snug">{stat.description}</p>
              )}
            </div>
          );
        })}

        {/* Faction Stances Quick Glance */}
        {world.factions && world.factions.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <div className="text-[10px] uppercase font-mono text-slate-500 mb-2">Faction Alignments</div>
            <div className="space-y-1.5">
              {world.factions.map(f => (
                <div key={f.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white/[0.015]">
                  <span className="text-slate-300 font-medium truncate max-w-[140px]">{f.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-400">{f.influence}%</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      f.stance === 'supportive' ? 'bg-emerald-500/10 text-emerald-300' :
                      f.stance === 'hostile' ? 'bg-rose-500/10 text-rose-300' :
                      'bg-amber-500/10 text-amber-300'
                    }`}>
                      {f.stance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
