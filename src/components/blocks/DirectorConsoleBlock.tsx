import React, { useState } from 'react';
import { WorldState, UIBlock } from '../../world/types';
import { RoleSlot } from '../../roles/model';
import {
  Wand2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Zap,
  Sparkles,
} from 'lucide-react';
import { DIRECTOR_REVEAL_DIRECTIVES } from '../../world/spyFamily/spyFamilyMin';

interface DirectorConsoleBlockProps {
  block: UIBlock;
  world: WorldState;
  onAction?: (action: string) => void;
  onAddNote?: (content: string) => void;
}

export const DirectorConsoleBlock: React.FC<DirectorConsoleBlockProps> = ({
  block,
  world,
  onAction,
  onAddNote,
}) => {
  const [directorPrompt, setDirectorPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'spawn' | 'factions' | 'rules'>('spawn');

  const currentRole = world.roles?.find((r) => r.id === world.activeRoleId) || world.roles?.[0];
  const isArchitect = currentRole?.type === 'ARCHITECT';

  const handleDirectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directorPrompt.trim() || !onAction) return;
    onAction(directorPrompt.trim());
    setDirectorPrompt('');
  };

  const handleSpawnAction = (actionText: string) => {
    if (onAction) onAction(actionText);
  };

  const tabButton = (tab: 'spawn' | 'factions' | 'rules', label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`rounded-md px-3 py-1 font-mono text-xs transition-all ${
        activeTab === tab
          ? 'border border-zinc-200 bg-white font-bold text-zinc-900 shadow-sm'
          : 'text-zinc-500 hover:text-zinc-800'
      }`}
    >
      {label}
    </button>
  );

  const w3Badge = () => (
    <span className="ml-1.5 rounded border border-zinc-300 bg-zinc-100 px-1 py-0.5 font-mono text-[9px] uppercase text-zinc-500">
      W3
    </span>
  );

  const directiveIcons = [AlertTriangle, Flame, ShieldAlert, Zap];
  const directiveColors = ['text-amber-600', 'text-rose-600', 'text-indigo-600', 'text-cyan-600'];

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-card">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-0 size-64 rounded-full bg-purple-100/60 blur-[100px]" />

      {/* Header */}
      <div className="relative z-10 mb-4 flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-2 text-purple-700">
            <Wand2 className="size-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-zinc-900">
              <span>{isArchitect ? 'World Ontological Rules & Axioms' : 'World Director & Secret Injection'}</span>
              <span className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 font-mono text-[10px] text-purple-700">
                {isArchitect ? 'SYSTEM ARCHITECT' : 'WORLD-LEVEL AGENCY'}
              </span>
            </h3>
            <p className="mt-0.5 font-sans text-xs text-zinc-500">
              通过确定性内核把秘密注入角色认知（reveal_fact）
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1">
          {tabButton('spawn', 'Inject')}
          {tabButton('factions', 'Factions')}
          {tabButton('rules', 'Axioms')}
        </div>
      </div>

      {/* Directorial Command Input */}
      <form onSubmit={handleDirectorSubmit} className="relative z-10 mb-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={directorPrompt}
            onChange={(e) => setDirectorPrompt(e.target.value)}
            placeholder="把约尔的秘密透露给洛德"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 pr-24 font-sans text-xs text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <button
            type="submit"
            disabled={!directorPrompt.trim()}
            className="absolute right-2 flex items-center gap-1 rounded-md bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-40"
          >
            <Sparkles className="size-3.5" strokeWidth={1.75} />
            <span>Inject</span>
          </button>
        </div>
      </form>

      {/* Tab 1: Secret Injection Quick Actions */}
      {activeTab === 'spawn' && (
        <div className="relative z-10 space-y-2.5">
          <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Secret Injection (reveal_fact):
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DIRECTOR_REVEAL_DIRECTIVES.map((d, i) => {
              const Icon = directiveIcons[i % directiveIcons.length];
              return (
                <button
                  key={d.id}
                  onClick={() => handleSpawnAction(d.command)}
                  className="group rounded-lg border border-purple-100 bg-purple-50/50 p-3 text-left transition-all hover:border-purple-200 hover:bg-purple-50"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
                    <Icon className={`size-3.5 ${directiveColors[i % directiveColors.length]}`} strokeWidth={1.75} />
                    <span>{d.label}</span>
                  </div>
                  <p className="mt-0.5 font-sans text-[10px] text-zinc-500">{d.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Factions Balance Controller（只读 + W3） */}
      {activeTab === 'factions' && (
        <div className="relative z-10 space-y-3">
          <div className="mb-1 flex items-center font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Faction Equilibrium {w3Badge()}
          </div>
          <div className="space-y-2">
            {world.factions?.map((fac) => (
              <div
                key={fac.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3"
              >
                <div>
                  <div className="text-xs font-bold text-zinc-900">{fac.name}</div>
                  <div className="font-mono text-[10px] text-zinc-500">
                    Stance: <span className="uppercase text-zinc-700">{fac.stance}</span> • Influence: {fac.influence}%
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled
                    title="W3 即将支持"
                    className="cursor-not-allowed rounded border border-zinc-200 bg-zinc-100 px-2 py-1 font-mono text-[10px] text-zinc-400"
                  >
                    Antagonize {w3Badge()}
                  </button>
                  <button
                    disabled
                    title="W3 即将支持"
                    className="cursor-not-allowed rounded border border-zinc-200 bg-zinc-100 px-2 py-1 font-mono text-[10px] text-zinc-400"
                  >
                    Appease {w3Badge()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Ontological Axioms / Rules（只读 + W3） */}
      {activeTab === 'rules' && (
        <div className="relative z-10 space-y-2.5">
          <div className="mb-1 flex items-center font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Active World Axioms & Constraints {w3Badge()}
          </div>
          <div className="space-y-2">
            {(world.rules && world.rules.length > 0 ? world.rules : [
              { id: 'r1', name: 'Information Delay', description: 'Cables from the frontier take 1 full turn to arrive at the capital.', active: true, category: 'physics' },
              { id: 'r2', name: 'Imperial Decree Binding', description: 'Ministers cannot openly defy an imperial seal without risking arrest.', active: true, category: 'society' },
              { id: 'r3', name: 'Severe Winter Frost', description: 'Mountain passes blocked by heavy snow until next season.', active: true, category: 'constraint' }
            ]).map((rule) => (
              <div
                key={rule.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-700">{rule.name}</span>
                    <span className="rounded border border-purple-200 bg-purple-50 px-1.5 py-0.5 font-mono text-[9px] uppercase text-purple-700">
                      {rule.category}
                    </span>
                  </div>
                  <p className="mt-0.5 font-sans text-[11px] text-zinc-600">
                    {rule.description}
                  </p>
                </div>
                <button
                  disabled
                  title="W3 即将支持"
                  className="shrink-0 cursor-not-allowed rounded border border-zinc-200 bg-zinc-100 px-2 py-1 font-mono text-[10px] text-zinc-400"
                >
                  Modify Rule {w3Badge()}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
