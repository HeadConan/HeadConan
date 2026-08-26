import React, { useState } from 'react';
import { WorldState, UIBlock } from '../../world/types';
import { RoleSlot } from '../../roles/model';
import { 
  Wand2, 
  PlusCircle, 
  Flame, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Sliders, 
  Send,
  Zap,
  Lock,
  Layers,
  BookOpen
} from 'lucide-react';

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
    onAction(`[DIRECTOR OVERRIDE] ${directorPrompt.trim()}`);
    setDirectorPrompt('');
  };

  const handleSpawnAction = (actionText: string) => {
    if (onAction) {
      onAction(`[DIRECTOR INTERVENTION] ${actionText}`);
    }
  };

  return (
    <div className="bg-[#120e1c]/95 border border-purple-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-purple-500/20 pb-3 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-purple-200 uppercase tracking-wider flex items-center space-x-2">
              <span>{isArchitect ? 'World Ontological Rules & Axioms' : 'World Director & Narrative Spawning'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                {isArchitect ? 'SYSTEM ARCHITECT' : 'WORLD-LEVEL AGENCY'}
              </span>
            </h3>
            <p className="text-xs text-purple-300/60 font-sans mt-0.5">
              Direct narrative tension, mutate global variables, or spawn emergent crises
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-purple-500/20">
          <button
            onClick={() => setActiveTab('spawn')}
            className={`text-xs font-mono px-3 py-1 rounded-lg transition-all ${
              activeTab === 'spawn'
                ? 'bg-purple-600/40 text-purple-200 font-bold border border-purple-500/40'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Spawn
          </button>
          <button
            onClick={() => setActiveTab('factions')}
            className={`text-xs font-mono px-3 py-1 rounded-lg transition-all ${
              activeTab === 'factions'
                ? 'bg-purple-600/40 text-purple-200 font-bold border border-purple-500/40'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Factions
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`text-xs font-mono px-3 py-1 rounded-lg transition-all ${
              activeTab === 'rules'
                ? 'bg-purple-600/40 text-purple-200 font-bold border border-purple-500/40'
                : 'text-purple-300/60 hover:text-purple-200'
            }`}
          >
            Axioms
          </button>
        </div>
      </div>

      {/* Directorial Command Input */}
      <form onSubmit={handleDirectorSubmit} className="mb-4 relative z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={directorPrompt}
            onChange={(e) => setDirectorPrompt(e.target.value)}
            placeholder="Direct the world: 'Spawn a midnight assassination attempt on the Chancellor'..."
            className="w-full bg-[#181226] text-purple-100 placeholder-purple-400/40 text-xs px-4 py-3 pr-24 rounded-xl border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!directorPrompt.trim()}
            className="absolute right-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg text-xs font-mono transition-colors flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cast</span>
          </button>
        </div>
      </form>

      {/* Tab 1: Spawning Quick Interventions */}
      {activeTab === 'spawn' && (
        <div className="space-y-2.5 relative z-10">
          <div className="text-[11px] font-mono text-purple-300/70 uppercase tracking-wider mb-1">
            Pre-Engineered Directorial Interventions:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleSpawnAction('Spawn an immediate communications blackout across all outer regions')}
              className="p-3 text-left rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/40 transition-all group"
            >
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-200 group-hover:text-purple-100">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Sector Blackout</span>
              </div>
              <p className="text-[10px] text-purple-300/60 font-sans mt-0.5">
                Cut off telegraphs and intelligence dispatches for 24 hours.
              </p>
            </button>

            <button
              onClick={() => handleSpawnAction('Inject a leaked incriminating transcript compromising High Command')}
              className="p-3 text-left rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/40 transition-all group"
            >
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-200 group-hover:text-purple-100">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Leaked Treason Cable</span>
              </div>
              <p className="text-[10px] text-purple-300/60 font-sans mt-0.5">
                Create a high-urgency intelligence file in the dossier.
              </p>
            </button>

            <button
              onClick={() => handleSpawnAction('Trigger sudden violent border skirmish forcing emergency defense mobilization')}
              className="p-3 text-left rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/40 transition-all group"
            >
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-200 group-hover:text-purple-100">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span>Border Skirmish</span>
              </div>
              <p className="text-[10px] text-purple-300/60 font-sans mt-0.5">
                Escalate regional tension metric by +25 points.
              </p>
            </button>

            <button
              onClick={() => handleSpawnAction('Reveal an underground conspirator safehouse under the capital')}
              className="p-3 text-left rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/40 transition-all group"
            >
              <div className="flex items-center space-x-2 text-xs font-bold text-purple-200 group-hover:text-purple-100">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reveal Secret Location</span>
              </div>
              <p className="text-[10px] text-purple-300/60 font-sans mt-0.5">
                Adds a hidden facility to the spatial map.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Factions Balance Controller */}
      {activeTab === 'factions' && (
        <div className="space-y-3 relative z-10">
          <div className="text-[11px] font-mono text-purple-300/70 uppercase tracking-wider mb-1">
            Mutate Faction Equilibrium:
          </div>
          <div className="space-y-2">
            {world.factions?.map((fac) => (
              <div
                key={fac.id}
                className="p-3 rounded-xl bg-black/40 border border-purple-500/20 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-purple-200">{fac.name}</div>
                  <div className="text-[10px] font-mono text-purple-300/60">
                    Stance: <span className="text-purple-300 uppercase">{fac.stance}</span> • Influence: {fac.influence}%
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleSpawnAction(`Shift ${fac.name} stance to hostile and decrease loyalty by 15`)}
                    className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-mono transition-colors"
                  >
                    Antagonize
                  </button>
                  <button
                    onClick={() => handleSpawnAction(`Grant diplomatic concessions to ${fac.name}, boosting loyalty by 15`)}
                    className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono transition-colors"
                  >
                    Appease
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Ontological Axioms / Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-2.5 relative z-10">
          <div className="text-[11px] font-mono text-purple-300/70 uppercase tracking-wider mb-1">
            Active World Axioms & Constraints:
          </div>
          <div className="space-y-2">
            {(world.rules && world.rules.length > 0 ? world.rules : [
              { id: 'r1', name: 'Information Delay', description: 'Cables from the frontier take 1 full turn to arrive at the capital.', active: true, category: 'physics' },
              { id: 'r2', name: 'Imperial Decree Binding', description: 'Ministers cannot openly defy an imperial seal without risking arrest.', active: true, category: 'society' },
              { id: 'r3', name: 'Severe Winter Frost', description: 'Mountain passes blocked by heavy snow until next season.', active: true, category: 'constraint' }
            ]).map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-xl bg-black/40 border border-purple-500/20 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-300">{rule.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 uppercase">
                      {rule.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200/70 font-sans mt-0.5">
                    {rule.description}
                  </p>
                </div>
                <button
                  onClick={() => handleSpawnAction(`Invert / toggle world rule "${rule.name}"`)}
                  className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-mono shrink-0 transition-colors"
                >
                  Modify Rule
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
