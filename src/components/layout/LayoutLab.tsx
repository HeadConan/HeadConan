import React, { useState } from 'react';
import { 
  Layers, 
  MessageSquare, 
  Map as MapIcon, 
  Search, 
  Crown, 
  Wand2, 
  Sparkles, 
  Compass, 
  X, 
  Sliders, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  FileText, 
  Users, 
  ArrowRight,
  Pin,
  Flame,
  Globe,
  Radio,
  Eye,
  Zap
} from 'lucide-react';
import { WorldState } from '../../world/types';

export type LayoutExperimentMode = 
  | 'conversation'
  | 'map'
  | 'investigation'
  | 'strategy'
  | 'host'
  | 'adaptive';

interface LayoutLabProps {
  world: WorldState;
  onClose: () => void;
  onAction?: (action: string) => void;
}

export const LayoutLab: React.FC<LayoutLabProps> = ({
  world,
  onClose,
  onAction
}) => {
  const [activeLayout, setActiveLayout] = useState<LayoutExperimentMode>('adaptive');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('char-1');
  const [adaptiveFocus, setAdaptiveFocus] = useState<'dialogue' | 'map' | 'clues' | 'crisis'>('dialogue');
  const [activeTab, setActiveTab] = useState<'preview' | 'rationale' | 'grammar'>('preview');

  // Layout experiment metadata
  const EXPERIMENTS = [
    {
      id: 'conversation' as const,
      label: 'A. Conversation',
      icon: MessageSquare,
      title: 'Dialogue-Centered Composition',
      archetype: 'SPY × FAMILY / Disco Elysium',
      primaryFocus: 'Speaker emotional subtext, speech choices, and dramatic irony.',
      secondaryContext: 'Speaker dossier, trust gauge, and immediate social circle.',
      ambientContext: 'Social setting etiquette, public surveillance threat.'
    },
    {
      id: 'map' as const,
      label: 'B. Spatial Map',
      icon: MapIcon,
      title: 'Map-Centered Exploration Stage',
      archetype: 'TTRPG Tactical Theater / Elden Ring',
      primaryFocus: 'Interactive coordinate landscape, routes, and territorial control.',
      secondaryContext: 'Selected outpost details, co-present NPCs, and local hazards.',
      ambientContext: 'Weather conditions, time of day, regional danger level.'
    },
    {
      id: 'investigation' as const,
      label: 'C. Investigation',
      icon: Search,
      title: 'Forensic Investigation Corkboard',
      archetype: 'Sherlock Holmes / Ace Attorney',
      primaryFocus: 'Pinned evidence exhibits, yarn link threads, and deductive contradictions.',
      secondaryContext: 'Suspect alibi matrix and chemical/ballistic specimen inspection.',
      ambientContext: 'Case solvability meter, impending press leak timer.'
    },
    {
      id: 'strategy' as const,
      label: 'D. Strategy Matrix',
      icon: Crown,
      title: 'Geopolitical Strategy & Faction Tensor',
      archetype: 'Game of Thrones / Crusader Kings',
      primaryFocus: 'Great House influence ledger, succession stakes, and military garrisons.',
      secondaryContext: 'Imperial cabinet leverage, crown debt balances, and treaty terms.',
      ambientContext: 'Realm stability, treasury deficit, famine threat.'
    },
    {
      id: 'host' as const,
      label: 'E. Host / Architect',
      icon: Wand2,
      title: 'World Director & Ontological Editor',
      archetype: 'World-Builder Workshop / Game Master View',
      primaryFocus: 'Ontological rule graph, metaphysical axioms, and entity state tree.',
      secondaryContext: 'Emergent crisis injector and raw NPC memory inspection.',
      ambientContext: 'Simulation invariant health, AI agent deliberation latency.'
    },
    {
      id: 'adaptive' as const,
      label: 'F. Adaptive Hybrid',
      icon: Sparkles,
      title: 'Attention-Driven Adaptive Hybrid',
      archetype: 'HeadConan Dynamic Information Space',
      primaryFocus: 'Dynamically shifts primary stage based on live attention and simulation events.',
      secondaryContext: 'Fluidly docks and morphs satellite rails without breaking spatial memory.',
      ambientContext: 'Always anchored by constant header chronometer and persistent bottom dock.'
    }
  ];

  const currentExp = EXPERIMENTS.find(e => e.id === activeLayout) || EXPERIMENTS[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#06080e]/98 backdrop-blur-2xl flex flex-col overflow-hidden text-slate-200">
      {/* 1. Header Bar */}
      <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
                HeadConan Layout Lab
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Dynamic Information Space Research
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluating 6 distinct spatial compositions against the 5-Primitive Layout Grammar
            </p>
          </div>
        </div>

        {/* Mode Selector Chips */}
        <div className="flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          {EXPERIMENTS.map((exp) => {
            const Icon = exp.icon;
            const isSelected = activeLayout === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveLayout(exp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{exp.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Sub-Bar: Rationale & Architecture Pill */}
      <div className="px-6 py-2.5 bg-purple-950/20 border-b border-purple-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-purple-300 flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>{currentExp.title}</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">
            <strong className="text-slate-200">Domain Target:</strong> {currentExp.archetype}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              activeTab === 'preview' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Stage Preview
          </button>
          <button
            onClick={() => setActiveTab('rationale')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              activeTab === 'rationale' ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Spatial Grammar Rationale
          </button>
        </div>
      </div>

      {/* 3. Main Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'rationale' ? (
          /* Rationale Explanation */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <h3 className="text-base font-semibold text-white">Spatial Composition Theory</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                HeadConan rejects the monolithic 3-column dashboard. In <strong>{currentExp.title}</strong>, the screen dynamically prioritizes the primary cognitive task while demoting or docking peripheral data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
                <div className="p-3.5 rounded-xl bg-purple-900/10 border border-purple-500/20">
                  <h4 className="text-xs font-mono font-bold text-purple-300 uppercase">1. Primary Stage (65%)</h4>
                  <p className="text-xs text-slate-300 mt-1.5">{currentExp.primaryFocus}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-900/10 border border-indigo-500/20">
                  <h4 className="text-xs font-mono font-bold text-indigo-300 uppercase">2. Satellite Rail (25%)</h4>
                  <p className="text-xs text-slate-300 mt-1.5">{currentExp.secondaryContext}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/10">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">3. Ambient Monitor (10%)</h4>
                  <p className="text-xs text-slate-300 mt-1.5">{currentExp.ambientContext}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live Stage Previews for each layout experiment */
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {activeLayout === 'conversation' && (
              /* Layout A: Conversation-Centered */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px]">
                {/* Primary Stage: Dialogue Chamber (8 cols) */}
                <div className="lg:col-span-8 bg-[#0e111a] border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-serif text-lg text-indigo-300 font-bold">
                          Y
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">Yor Forger (Thorn Princess)</h3>
                          <p className="text-xs text-slate-400">Domestic Camouflage • Berlint City Hall Clerk</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Trust: 88% (High Vulnerability)
                      </span>
                    </div>

                    {/* Dialogue Feed */}
                    <div className="space-y-4 my-6">
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Yor Forger</span>
                        <p className="text-sm text-slate-200 leading-relaxed font-serif italic">
                          "Loid-san... Yuri mentioned he might drop by for dinner tonight. He said he has questions about your psychiatric clinic patients..."
                        </p>
                        <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 font-mono">
                          <Eye className="w-3.5 h-3.5 inline mr-1 text-purple-400" />
                          <strong>Psychic Subtext (Anya reading minds):</strong> <em>Yor is terrified her brother will discover her assassination client contracts.</em>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold">You (Loid Forger / Agent Twilight)</span>
                        <p className="text-sm text-slate-100 leading-relaxed font-serif">
                          "Of course, Yor. I will prepare an impeccable meal. Tell your brother he is always welcome in our home."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dialogue Choice Affordance Bar */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-xs font-mono uppercase text-slate-400">Conversational Action Chips:</span>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-xs text-indigo-200">
                        💬 "Offer to brew herbal chamomile tea to soothe her nerves"
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/30 text-xs text-amber-200">
                        🔍 "Carefully probe if Yuri's secret police unit conducted raids today"
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300">
                        🛡️ "Ensure all WISE coded transmission microfilm is secured"
                      </button>
                    </div>
                  </div>
                </div>

                {/* Satellite Rail: Interpersonal Dossier & Ambient Monitor (4 cols) */}
                <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
                  <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>Context Satellite: Speaker Dossier</span>
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Cover Persona:</span>
                        <span className="text-slate-200 font-medium">Mild-mannered municipal clerk</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Secret Reality:</span>
                        <span className="text-rose-400 font-mono font-semibold">Garden Assassin (Thorn Princess)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Relationship Dynamic:</span>
                        <span className="text-indigo-300 font-medium">Mutual protective affection</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span>Ambient Monitor: Cover Camouflage</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Neighbor Suspicion:</span>
                        <span className="text-emerald-400 font-mono">14% (Very Safe)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[14%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeLayout === 'map' && (
              /* Layout B: Map-Centered */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px]">
                {/* Primary Stage: Spatial Theater (8 cols) */}
                <div className="lg:col-span-8 bg-[#0a0d14] border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-semibold text-white uppercase font-mono">
                        King’s Landing & Blackwater Bay Tactical Theater
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">
                      Garrison Readiness: 92%
                    </span>
                  </div>

                  {/* Interactive Vector Map Canvas */}
                  <div className="my-4 h-72 rounded-xl bg-[#06080e] border border-white/10 relative flex items-center justify-center p-4">
                    {/* Simulated Map Nodes */}
                    <div className="absolute top-8 left-12 p-3 rounded-xl bg-red-950/60 border border-red-500/50 cursor-pointer hover:scale-105 transition-all text-xs">
                      <div className="font-bold text-red-300">🏰 Red Keep (Throne Room)</div>
                      <div className="text-[10px] text-slate-400">Lannister Guards: 450 sworn swords</div>
                    </div>

                    <div className="absolute bottom-10 left-32 p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/50 cursor-pointer hover:scale-105 transition-all text-xs">
                      <div className="font-bold text-cyan-300">⚓ Mud Gate & Blackwater Quay</div>
                      <div className="text-[10px] text-slate-400">Royal Fleet: 30 warships anchored</div>
                    </div>

                    <div className="absolute top-16 right-16 p-3 rounded-xl bg-purple-950/60 border border-purple-500/50 cursor-pointer hover:scale-105 transition-all text-xs">
                      <div className="font-bold text-purple-300">🧪 Guildhall of the Alchemists</div>
                      <div className="text-[10px] text-slate-400">Wildfire Vessels: 8,000 jars ready</div>
                    </div>

                    <div className="text-center pointer-events-none opacity-20">
                      <Globe className="w-32 h-32 text-cyan-400 mx-auto" />
                    </div>
                  </div>

                  {/* Spatial Affordances */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    <button className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/30 text-xs text-cyan-200">
                      🛡️ "Dispatch 100 City Watch to fortify King's Gate"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-xs text-purple-200">
                      🔥 "Inspect subterranean wildfire storage beneath Great Sept"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Location Inspector (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-[#0e111a] border border-white/10 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <MapIcon className="w-4 h-4" />
                      <span>Targeted Outpost: Red Keep</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      The seat of the Iron Throne overlooking Blackwater Bay. High stone parapets, secret Targaryen tunnels beneath the foundations.
                    </p>
                    <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Threat Level:</span>
                        <span className="text-amber-400 font-mono">Elevated (Whispers of Coup)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Controlling House:</span>
                        <span className="text-red-400 font-mono font-semibold">House Lannister / Baratheon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeLayout === 'investigation' && (
              /* Layout C: Investigation-Centered */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px]">
                {/* Primary Stage: Evidence Board (8 cols) */}
                <div className="lg:col-span-8 bg-[#120f0d] border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                    <div className="flex items-center space-x-2">
                      <Pin className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-semibold text-amber-200 uppercase font-mono">
                        Baker Street Forensic Case Board (The Study Murder)
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      Deduction Progress: 67%
                    </span>
                  </div>

                  {/* Pinned Exhibit Cards */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="p-3.5 rounded-xl bg-black/50 border border-amber-500/40 space-y-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Physical Exhibit #1
                      </span>
                      <h4 className="text-xs font-bold text-white">Shattered Turkish Tobacco Pipe</h4>
                      <p className="text-[11px] text-slate-300">
                        Found under the library rug. Burn pattern indicates it was crushed under a heavy cavalry boot.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/40 space-y-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Witness Statement #2
                      </span>
                      <h4 className="text-xs font-bold text-white">Housekeeper’s Alibi Contradiction</h4>
                      <p className="text-[11px] text-slate-300">
                        Claims she was in the scullery at 10:15 PM, but the carriage clock downstairs stopped at 10:08 PM.
                      </p>
                    </div>
                  </div>

                  {/* Deductive Action Bar */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-500/20">
                    <button className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/30 text-xs text-amber-200">
                      🧪 "Perform chemical assay on tobacco residue"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/30 text-xs text-cyan-200">
                      ⚖️ "Confront Col. Moran with contradictory train timetable"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Suspect Roster (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-[#120f0d] border border-amber-500/20 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <Users className="w-4 h-4" />
                      <span>Primary Suspect: Col. Sebastian Moran</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Motive:</span>
                        <span className="text-rose-300 font-medium">Gambling debt of £4,000</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">Suspicion Index:</span>
                        <span className="text-amber-400 font-mono font-bold">85% (High)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeLayout === 'strategy' && (
              /* Layout D: Strategy Matrix */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px]">
                {/* Primary Stage: Faction Tensor Matrix (8 cols) */}
                <div className="lg:col-span-8 bg-[#140f12] border border-rose-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-rose-400" />
                      <h3 className="text-sm font-semibold text-rose-200 uppercase font-mono">
                        Seven Kingdoms Geopolitical Power Tensor
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                      Realm Stability: 42% (Critical Tension)
                    </span>
                  </div>

                  {/* Faction Ledger */}
                  <div className="space-y-3 my-4">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">House Lannister of Casterly Rock</div>
                        <div className="text-[11px] text-slate-400">Economic Leverage: 3M Gold Dragons Crown Debt</div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Influence: 90%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">House Stark of Winterfell</div>
                        <div className="text-[11px] text-slate-400">Military Strength: 20,000 Northern Banners</div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Influence: 75%
                      </span>
                    </div>
                  </div>

                  {/* Strategic Action Chips */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-500/20">
                    <button className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400/30 text-xs text-rose-200">
                      👑 "Convene Emergency Small Council in Tower of the Hand"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/30 text-xs text-amber-200">
                      💰 "Request emergency loan deferral from Iron Bank of Braavos"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Treasury & Alliances (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-[#140f12] border border-rose-500/20 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                      Royal Treasury & Crown Debt
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Crown Debt:</span>
                        <span className="text-rose-400 font-mono font-bold">6,000,000 Dragons</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Grain Stores:</span>
                        <span className="text-amber-400 font-mono">18 Months Remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeLayout === 'host' && (
              /* Layout E: Host / Architect */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[500px]">
                {/* Primary Stage: Ontological Rule Graph (8 cols) */}
                <div className="lg:col-span-8 bg-[#120d1c] border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <Wand2 className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-semibold text-purple-200 uppercase font-mono">
                        World Director & Axiom Rule Matrix
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                      Ontological Stability: 100%
                    </span>
                  </div>

                  {/* Axiom Rules Tree */}
                  <div className="space-y-3 my-4">
                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Axiom: Feudal Royal Succession</span>
                        <span className="text-[10px] font-mono text-purple-300">Invariant: Active</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Crown passes strictly to legitimate male heirs of the royal bloodline unless overthrown by conquest.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Crisis Trigger: Wildfire Synthesis</span>
                        <span className="text-[10px] font-mono text-amber-300">State: Ready</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Chemical instability accelerates during heat waves. Directorial injection can trigger mass explosion.
                      </p>
                    </div>
                  </div>

                  {/* Directorial Command Chips */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-500/20">
                    <button className="px-3 py-1.5 rounded-lg bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 text-xs text-purple-200 font-mono">
                      ⚡ [SPAWN CRISIS] "Inject leaked cipher exposing Queen's lineage fraud"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-rose-600/40 hover:bg-rose-600/60 border border-rose-400/40 text-xs text-rose-200 font-mono">
                      🔥 [MUTATE AXIOM] "Legalize trial by seven combatants across all High Courts"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Entity Memory Inspector (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-[#120d1c] border border-purple-500/20 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                      Raw Agent Deliberation Monitor
                    </h4>
                    <p className="text-xs text-slate-300">
                      Observing Cersei Lannister's internal reasoning loop: Evaluating threat from Littlefinger vs. threat from Stannis Baratheon.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeLayout === 'adaptive' && (
              /* Layout F: Adaptive Hybrid (Dynamic Rebalancing) */
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                {/* Adaptive Stage Controller */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase">
                        Dynamic Attention Planner Simulator
                      </h4>
                      <p className="text-xs text-slate-400">
                        Select an emergent stimulus below to watch the stage adaptively morph its primary focus:
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAdaptiveFocus('dialogue')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        adaptiveFocus === 'dialogue' ? 'bg-indigo-600 text-white font-bold' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      Stimulus: Interrogation
                    </button>
                    <button
                      onClick={() => setAdaptiveFocus('map')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        adaptiveFocus === 'map' ? 'bg-cyan-600 text-white font-bold' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      Stimulus: Border Alarm
                    </button>
                    <button
                      onClick={() => setAdaptiveFocus('clues')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        adaptiveFocus === 'clues' ? 'bg-amber-600 text-white font-bold' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      Stimulus: Clue Discovered
                    </button>
                  </div>
                </div>

                {/* Morphing Stage */}
                <div className="p-6 rounded-2xl bg-[#0b0e17] border border-indigo-500/30 flex-1 flex flex-col justify-between transition-all duration-500">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest font-bold">
                        {adaptiveFocus === 'dialogue' && 'Active Stage: Intimate Dialogue Chamber'}
                        {adaptiveFocus === 'map' && 'Active Stage: Tactical Border Map & Garrison Dispatch'}
                        {adaptiveFocus === 'clues' && 'Active Stage: Forensic Evidence Board & Contradiction Thread'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        Layout Morphing: FLIP Smooth Transition
                      </span>
                    </div>

                    <div className="py-8 text-center space-y-3">
                      {adaptiveFocus === 'dialogue' && (
                        <div className="max-w-md mx-auto p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-left space-y-2">
                          <p className="text-xs font-serif italic text-slate-200">
                            "You question my allegiance, my Lord? Check the seal on the dispatch yourself."
                          </p>
                          <span className="text-[10px] font-mono text-indigo-400">→ Screen real-estate prioritized for dialogue subtext & facial reaction.</span>
                        </div>
                      )}

                      {adaptiveFocus === 'map' && (
                        <div className="max-w-md mx-auto p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-left space-y-2">
                          <p className="text-xs font-serif text-slate-200">
                            🚨 Warning: 500 Ironborn reavers spotted entering the bay.
                          </p>
                          <span className="text-[10px] font-mono text-cyan-400">→ Screen real-estate automatically expands the coordinate theater.</span>
                        </div>
                      )}

                      {adaptiveFocus === 'clues' && (
                        <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-950/40 border border-amber-500/20 text-left space-y-2">
                          <p className="text-xs font-serif text-slate-200">
                            📌 Exhibit Linked: The wax seal matches Lord Baelish's private signet ring.
                          </p>
                          <span className="text-[10px] font-mono text-amber-400">→ Screen real-estate summons the corkboard and suspect alibi cards.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400 font-mono">
                    Dynamic Information Space: Layout reconfigures seamlessly without navigating to separate screens.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
