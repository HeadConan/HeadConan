import React from 'react';
import { UIBlockProps } from '../../ui/types';
import { Activity, TrendingUp, TrendingDown, Minus, ShieldCheck, AlertTriangle } from 'lucide-react';

export const StatsBlock: React.FC<UIBlockProps> = ({ block, world }) => {
  return (
    <div id="block-stats-view" className="flex h-[480px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-zinc-500" strokeWidth={1.75} />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900">{block.title || 'System Indicators & Vitals'}</h3>
        </div>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] text-emerald-700">
          Equilibrium Sync
        </span>
      </div>

      {/* Metrics List */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {world.stats.map((stat) => {
          const percentage = Math.min(100, Math.max(0, (stat.value / (stat.max || 100)) * 100));
          const isWarning = stat.status === 'warning' || percentage < 50;
          const isCritical = stat.status === 'critical' || percentage < 25;

          const barColor = isCritical
            ? 'bg-rose-500'
            : isWarning
            ? 'bg-amber-500'
            : 'bg-zinc-900';

          return (
            <div
              key={stat.id}
              id={`stat-card-${stat.id}`}
              className="rounded-lg border border-zinc-100 bg-white p-3.5 transition-colors hover:border-zinc-200"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-800">{stat.label}</span>
                  {stat.trend === 'up' && <TrendingUp className="size-3.5 text-emerald-600" strokeWidth={1.75} />}
                  {stat.trend === 'down' && <TrendingDown className="size-3.5 text-rose-600" strokeWidth={1.75} />}
                  {stat.trend === 'stable' && <Minus className="size-3.5 text-zinc-400" strokeWidth={1.75} />}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-bold tabular-nums text-zinc-900">
                    {stat.value}{stat.unit || ''}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">
                    / {stat.max}{stat.unit || ''}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {stat.description && (
                <p className="text-[11px] leading-snug text-zinc-500">{stat.description}</p>
              )}
            </div>
          );
        })}

        {/* Faction Stances Quick Glance */}
        {world.factions && world.factions.length > 0 && (
          <div className="border-t border-zinc-100 pt-2">
            <div className="mb-2 font-mono text-[10px] uppercase text-zinc-500">Faction Alignments</div>
            <div className="space-y-1.5">
              {world.factions.map(f => (
                <div key={f.id} className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1 text-xs">
                  <span className="max-w-[140px] truncate font-medium text-zinc-700">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums text-zinc-500">{f.influence}%</span>
                    <span className={`rounded font-mono text-[10px] px-1.5 py-0.5 ${
                      f.stance === 'supportive' ? 'bg-emerald-50 text-emerald-700' :
                      f.stance === 'hostile' ? 'bg-rose-50 text-rose-700' :
                      'bg-amber-50 text-amber-700'
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
