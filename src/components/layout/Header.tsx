import React, { useState } from 'react';
import { WorldState } from '../../world/types';
import { 
  Layers, 
  Plus, 
  ChevronDown, 
  StickyNote,
  History
} from 'lucide-react';
import { DEMO_PRESETS } from '../../data/mockWorlds';
import { AIProviderId } from '../../ai/client';
import { EngineSelector } from './EngineSelector';

interface HeaderProps {
  world: WorldState;
  onResetToPrompt: () => void;
  onSelectPreset: (presetId: string) => void;
  onOpenFeedModal: () => void;
  onOpenNotesModal: () => void;
  selectedEngine: AIProviderId;
  onSelectEngine: (engine: AIProviderId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  world,
  onResetToPrompt,
  onSelectPreset,
  onOpenFeedModal,
  onOpenNotesModal,
  selectedEngine,
  onSelectEngine,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  return (
    <header className="h-16 border-b border-white/10 bg-[#090b12]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Brand & World Title */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onResetToPrompt}
          className="flex items-center space-x-2 text-left group cursor-pointer"
          title="Return to creative space"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center group-hover:bg-indigo-600/50 transition-colors">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-300 transform rotate-45" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase hidden sm:inline">
            HeadConan
          </span>
        </button>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        {/* Current World Name & Genre */}
        <div className="flex items-center space-x-2.5">
          <h2 className="text-sm font-serif font-semibold text-slate-100 truncate max-w-[160px] sm:max-w-xs md:max-w-md">
            {world.name}
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 hidden md:inline">
            {world.genre}
          </span>
        </div>
      </div>

      {/* Right: AI Engine Selector, Chronicle, Deductions, World Switcher */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5">
        {/* AI Engine Switcher (DeepSeek / Gemini / Procedural) */}
        <EngineSelector
          selectedEngine={selectedEngine}
          onSelectEngine={onSelectEngine}
          compact
        />

        {/* Turn indicator */}
        <span className="text-[11px] font-mono text-slate-400 bg-white/[0.03] px-2 py-1 rounded border border-white/5 hidden lg:inline">
          Turn #{world.turnCount || 1}
        </span>

        {/* Narrative Log Button */}
        <button
          id="btn-open-narrative-log"
          onClick={onOpenFeedModal}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-medium text-slate-300 transition-colors flex items-center space-x-1.5"
          title="Review narrative chronicles"
        >
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Chronicle</span>
        </button>

        {/* Notes quick button */}
        <button
          id="btn-open-notes"
          onClick={onOpenNotesModal}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-medium text-slate-300 transition-colors flex items-center space-x-1.5 relative"
        >
          <StickyNote className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Deductions</span>
          {world.notes && world.notes.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono flex items-center justify-center">
              {world.notes.length}
            </span>
          )}
        </button>

        {/* Preset Switcher Dropdown */}
        <div className="relative">
          <button
            id="btn-switch-world"
            onClick={() => setShowPresetsMenu(!showPresetsMenu)}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium text-indigo-200 transition-colors flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch</span>
            <ChevronDown className="w-3 h-3 text-indigo-300" />
          </button>

          {showPresetsMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPresetsMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-[#0e111a] border border-white/10 rounded-xl shadow-2xl py-2 z-50 divide-y divide-white/5">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Preset Environments
                </div>
                <div className="py-1">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        setShowPresetsMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex flex-col"
                    >
                      <span className="font-semibold text-indigo-300">{preset.title}</span>
                      <span className="text-[10px] text-slate-500 truncate">{preset.subtitle}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      onResetToPrompt();
                      setShowPresetsMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-amber-300 hover:bg-white/5 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Imagined World</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
