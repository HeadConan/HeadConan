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
    <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-2xl flex flex-col overflow-hidden text-zinc-800">
      {/* 1. Header Bar */}
      <div className="h-16 border-b border-zinc-200 px-6 flex items-center justify-between bg-zinc-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
                HeadConan Layout Lab
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900/20 text-indigo-600 border border-indigo-200">
                Dynamic Information Space Research
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Evaluating 6 distinct spatial compositions against the 5-Primitive Layout Grammar
            </p>
          </div>
        </div>

        {/* Mode Selector Chips */}
        <div className="flex items-center space-x-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          {EXPERIMENTS.map((exp) => {
            const Icon = exp.icon;
            const isSelected = activeLayout === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveLayout(exp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-lg shadow-purple-500/20'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-100'
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
          className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-500 hover:text-white hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Sub-Bar: Rationale & Architecture Pill */}
      <div className="px-6 py-2.5 bg-purple-50 border-b border-purple-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-purple-700 flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-purple-700 animate-pulse" />
            <span>{currentExp.title}</span>
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-700">
            <strong className="text-zinc-800">Domain Target:</strong> {currentExp.archetype}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              activeTab === 'preview' ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Live Stage Preview
          </button>
          <button
            onClick={() => setActiveTab('rationale')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
              activeTab === 'rationale' ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'text-zinc-500 hover:text-white'
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
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <h3 className="text-base font-semibold text-white">Spatial Composition Theory</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                HeadConan rejects the monolithic 3-column dashboard. In <strong>{currentExp.title}</strong>, the screen dynamically prioritizes the primary cognitive task while demoting or docking peripheral data.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
                <div className="p-3.5 rounded-xl bg-purple-900/10 border border-purple-100">
                  <h4 className="text-xs font-mono font-bold text-purple-700 uppercase">1. Primary Stage (65%)</h4>
                  <p className="text-xs text-zinc-700 mt-1.5">{currentExp.primaryFocus}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-900/10 border border-indigo-100">
                  <h4 className="text-xs font-mono font-bold text-indigo-600 uppercase">2. Satellite Rail (25%)</h4>
                  <p className="text-xs text-zinc-700 mt-1.5">{currentExp.secondaryContext}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-200">
                  <h4 className="text-xs font-mono font-bold text-zinc-700 uppercase">3. Ambient Monitor (10%)</h4>
                  <p className="text-xs text-zinc-700 mt-1.5">{currentExp.ambientContext}</p>
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
                <div className="lg:col-span-8 bg-white border border-indigo-200 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900/20 border border-indigo-200 flex items-center justify-center font-serif text-lg text-indigo-600 font-bold">
                          Y
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">Yor Forger (Thorn Princess)</h3>
                          <p className="text-xs text-zinc-500">Domestic Camouflage • Berlint City Hall Clerk</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Trust: 88% (High Vulnerability)
                      </span>
                    </div>

                    {/* Dialogue Feed */}
                    <div className="space-y-4 my-6">
                      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-indigo-600 font-bold">Yor Forger</span>
                        <p className="text-sm text-zinc-800 leading-relaxed font-serif italic">
                          "Loid-san... Yuri mentioned he might drop by for dinner tonight. He said he has questions about your psychiatric clinic patients..."
                        </p>
                        <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-100 text-xs text-purple-700 font-mono">
                          <Eye className="w-3.5 h-3.5 inline mr-1 text-purple-700" />
                          <strong>Psychic Subtext (Anya reading minds):</strong> <em>Yor is terrified her brother will discover her assassination client contracts.</em>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-indigo-600 font-bold">You (Loid Forger / Agent Twilight)</span>
                        <p className="text-sm text-zinc-900 leading-relaxed font-serif">
                          "Of course, Yor. I will prepare an impeccable meal. Tell your brother he is always welcome in our home."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dialogue Choice Affordance Bar */}
                  <div className="pt-4 border-t border-zinc-100 space-y-2">
                    <span className="text-xs font-mono uppercase text-zinc-500">Conversational Action Chips:</span>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 border border-indigo-200 text-xs text-indigo-700">
                        💬 "Offer to brew herbal chamomile tea to soothe her nerves"
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-800">
                        🔍 "Carefully probe if Yuri's secret police unit conducted raids today"
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-100 border border-zinc-200 text-xs text-zinc-700">
                        🛡️ "Ensure all WISE coded transmission microfilm is secured"
                      </button>
                    </div>
                  </div>
                </div>

                {/* Satellite Rail: Interpersonal Dossier & Ambient Monitor (4 cols) */}
                <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>Context Satellite: Speaker Dossier</span>
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">Cover Persona:</span>
                        <span className="text-zinc-800 font-medium">Mild-mannered municipal clerk</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">Secret Reality:</span>
                        <span className="text-rose-700 font-mono font-semibold">Garden Assassin (Thorn Princess)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">Relationship Dynamic:</span>
                        <span className="text-indigo-600 font-medium">Mutual protective affection</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider flex items-center space-x-1.5">
                      <Activity className="w-4 h-4 text-purple-700" />
                      <span>Ambient Monitor: Cover Camouflage</span>
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-500">Neighbor Suspicion:</span>
                        <span className="text-emerald-700 font-mono">14% (Very Safe)</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
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
                <div className="lg:col-span-8 bg-cyan-50/60 border border-cyan-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-cyan-600" />
                      <h3 className="text-sm font-semibold text-white uppercase font-mono">
                        King’s Landing & Blackwater Bay Tactical Theater
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      Garrison Readiness: 92%
                    </span>
                  </div>

                  {/* Interactive Vector Map Canvas */}
                  <div className="my-4 h-72 rounded-xl bg-zinc-100 border border-zinc-200 relative flex items-center justify-center p-4">
                    {/* Simulated Map Nodes */}
                    <div className="absolute top-8 left-12 p-3 rounded-xl bg-red-950/60 border border-red-500/50 cursor-pointer hover:scale-105 transition-all text-xs">
                      <div className="font-bold text-red-300">🏰 Red Keep (Throne Room)</div>
                      <div className="text-[10px] text-zinc-500">Lannister Guards: 450 sworn swords</div>
                    </div>

                    <div className="absolute bottom-10 left-32 p-3 rounded-xl bg-cyan-50 border border-cyan-200 cursor-pointer hover:scale-105 transition-all text-xs">
                      <div className="font-bold text-cyan-700">⚓ Mud Gate & Blackwater Quay</div>
                      <div className="text-[10px] text-zinc-500">Royal Fleet: 30 warships anchored</div>
                    </div>

                    <div className="absolute top-16 right-16 p-3 rounded-xl bg-purple-50 border border-purple-200 cursor-pointer hover:scale-105 transition-all text-xs">
                      <div className="font-bold text-purple-700">🧪 Guildhall of the Alchemists</div>
                      <div className="text-[10px] text-zinc-500">Wildfire Vessels: 8,000 jars ready</div>
                    </div>

                    <div className="text-center pointer-events-none opacity-20">
                      <Globe className="w-32 h-32 text-cyan-600 mx-auto" />
                    </div>
                  </div>

                  {/* Spatial Affordances */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100">
                    <button className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-xs text-cyan-800">
                      🛡️ "Dispatch 100 City Watch to fortify King's Gate"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 border border-purple-200 text-xs text-purple-800">
                      🔥 "Inspect subterranean wildfire storage beneath Great Sept"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Location Inspector (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider flex items-center space-x-1.5">
                      <MapIcon className="w-4 h-4" />
                      <span>Targeted Outpost: Red Keep</span>
                    </h4>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      The seat of the Iron Throne overlooking Blackwater Bay. High stone parapets, secret Targaryen tunnels beneath the foundations.
                    </p>
                    <div className="pt-2 border-t border-zinc-100 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Threat Level:</span>
                        <span className="text-amber-700 font-mono">Elevated (Whispers of Coup)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Controlling House:</span>
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
                <div className="lg:col-span-8 bg-amber-50/60 border border-amber-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                    <div className="flex items-center space-x-2">
                      <Pin className="w-4 h-4 text-amber-700" />
                      <h3 className="text-sm font-semibold text-amber-800 uppercase font-mono">
                        Baker Street Forensic Case Board (The Study Murder)
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Deduction Progress: 67%
                    </span>
                  </div>

                  {/* Pinned Exhibit Cards */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="p-3.5 rounded-xl bg-zinc-100 border border-amber-200 space-y-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200">
                        Physical Exhibit #1
                      </span>
                      <h4 className="text-xs font-bold text-white">Shattered Turkish Tobacco Pipe</h4>
                      <p className="text-[11px] text-zinc-700">
                        Found under the library rug. Burn pattern indicates it was crushed under a heavy cavalry boot.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-100 border border-cyan-200 space-y-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-50 text-cyan-700 border border-cyan-200">
                        Witness Statement #2
                      </span>
                      <h4 className="text-xs font-bold text-white">Housekeeper’s Alibi Contradiction</h4>
                      <p className="text-[11px] text-zinc-700">
                        Claims she was in the scullery at 10:15 PM, but the carriage clock downstairs stopped at 10:08 PM.
                      </p>
                    </div>
                  </div>

                  {/* Deductive Action Bar */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-100">
                    <button className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-800">
                      🧪 "Perform chemical assay on tobacco residue"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-xs text-cyan-800">
                      ⚖️ "Confront Col. Moran with contradictory train timetable"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Suspect Roster (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1.5">
                      <Users className="w-4 h-4" />
                      <span>Primary Suspect: Col. Sebastian Moran</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">Motive:</span>
                        <span className="text-rose-700 font-medium">Gambling debt of £4,000</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-100">
                        <span className="text-zinc-500">Suspicion Index:</span>
                        <span className="text-amber-700 font-mono font-bold">85% (High)</span>
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
                <div className="lg:col-span-8 bg-rose-50/60 border border-rose-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-rose-700" />
                      <h3 className="text-sm font-semibold text-rose-800 uppercase font-mono">
                        Seven Kingdoms Geopolitical Power Tensor
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Realm Stability: 42% (Critical Tension)
                    </span>
                  </div>

                  {/* Faction Ledger */}
                  <div className="space-y-3 my-4">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">House Lannister of Casterly Rock</div>
                        <div className="text-[11px] text-zinc-500">Economic Leverage: 3M Gold Dragons Crown Debt</div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Influence: 90%
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">House Stark of Winterfell</div>
                        <div className="text-[11px] text-zinc-500">Military Strength: 20,000 Northern Banners</div>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                        Influence: 75%
                      </span>
                    </div>
                  </div>

                  {/* Strategic Action Chips */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-100">
                    <button className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs text-rose-800">
                      👑 "Convene Emergency Small Council in Tower of the Hand"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-800">
                      💰 "Request emergency loan deferral from Iron Bank of Braavos"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Treasury & Alliances (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider">
                      Royal Treasury & Crown Debt
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Total Crown Debt:</span>
                        <span className="text-rose-700 font-mono font-bold">6,000,000 Dragons</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Grain Stores:</span>
                        <span className="text-amber-700 font-mono">18 Months Remaining</span>
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
                <div className="lg:col-span-8 bg-purple-50/60 border border-purple-200 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                    <div className="flex items-center space-x-2">
                      <Wand2 className="w-4 h-4 text-purple-700" />
                      <h3 className="text-sm font-semibold text-purple-800 uppercase font-mono">
                        World Director & Axiom Rule Matrix
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Ontological Stability: 100%
                    </span>
                  </div>

                  {/* Axiom Rules Tree */}
                  <div className="space-y-3 my-4">
                    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Axiom: Feudal Royal Succession</span>
                        <span className="text-[10px] font-mono text-purple-700">Invariant: Active</span>
                      </div>
                      <p className="text-xs text-zinc-700">
                        Crown passes strictly to legitimate male heirs of the royal bloodline unless overthrown by conquest.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Crisis Trigger: Wildfire Synthesis</span>
                        <span className="text-[10px] font-mono text-amber-700">State: Ready</span>
                      </div>
                      <p className="text-xs text-zinc-700">
                        Chemical instability accelerates during heat waves. Directorial injection can trigger mass explosion.
                      </p>
                    </div>
                  </div>

                  {/* Directorial Command Chips */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-100">
                    <button className="px-3 py-1.5 rounded-lg bg-zinc-900/40 hover:bg-zinc-900/60 border border-purple-200 text-xs text-purple-800 font-mono">
                      ⚡ [SPAWN CRISIS] "Inject leaked cipher exposing Queen's lineage fraud"
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs text-rose-800 font-mono">
                      🔥 [MUTATE AXIOM] "Legalize trial by seven combatants across all High Courts"
                    </button>
                  </div>
                </div>

                {/* Satellite Rail: Entity Memory Inspector (4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-purple-700 uppercase tracking-wider">
                      Raw Agent Deliberation Monitor
                    </h4>
                    <p className="text-xs text-zinc-700">
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
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase">
                        Dynamic Attention Planner Simulator
                      </h4>
                      <p className="text-xs text-zinc-500">
                        Select an emergent stimulus below to watch the stage adaptively morph its primary focus:
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAdaptiveFocus('dialogue')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        adaptiveFocus === 'dialogue' ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      Stimulus: Interrogation
                    </button>
                    <button
                      onClick={() => setAdaptiveFocus('map')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        adaptiveFocus === 'map' ? 'bg-cyan-600 text-white font-bold' : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      Stimulus: Border Alarm
                    </button>
                    <button
                      onClick={() => setAdaptiveFocus('clues')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        adaptiveFocus === 'clues' ? 'bg-amber-600 text-white font-bold' : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      Stimulus: Clue Discovered
                    </button>
                  </div>
                </div>

                {/* Morphing Stage */}
                <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex-1 flex flex-col justify-between transition-all duration-500">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                      <span className="text-xs font-mono text-indigo-600 uppercase tracking-widest font-bold">
                        {adaptiveFocus === 'dialogue' && 'Active Stage: Intimate Dialogue Chamber'}
                        {adaptiveFocus === 'map' && 'Active Stage: Tactical Border Map & Garrison Dispatch'}
                        {adaptiveFocus === 'clues' && 'Active Stage: Forensic Evidence Board & Contradiction Thread'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-500">
                        Layout Morphing: FLIP Smooth Transition
                      </span>
                    </div>

                    <div className="py-8 text-center space-y-3">
                      {adaptiveFocus === 'dialogue' && (
                        <div className="max-w-md mx-auto p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-left space-y-2">
                          <p className="text-xs font-serif italic text-zinc-800">
                            "You question my allegiance, my Lord? Check the seal on the dispatch yourself."
                          </p>
                          <span className="text-[10px] font-mono text-indigo-600">→ Screen real-estate prioritized for dialogue subtext & facial reaction.</span>
                        </div>
                      )}

                      {adaptiveFocus === 'map' && (
                        <div className="max-w-md mx-auto p-4 rounded-xl bg-cyan-50 border border-cyan-100 text-left space-y-2">
                          <p className="text-xs font-serif text-zinc-800">
                            🚨 Warning: 500 Ironborn reavers spotted entering the bay.
                          </p>
                          <span className="text-[10px] font-mono text-cyan-600">→ Screen real-estate automatically expands the coordinate theater.</span>
                        </div>
                      )}

                      {adaptiveFocus === 'clues' && (
                        <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-50 border border-amber-100 text-left space-y-2">
                          <p className="text-xs font-serif text-zinc-800">
                            📌 Exhibit Linked: The wax seal matches Lord Baelish's private signet ring.
                          </p>
                          <span className="text-[10px] font-mono text-amber-700">→ Screen real-estate summons the corkboard and suspect alibi cards.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-center text-xs text-zinc-500 font-mono">
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
