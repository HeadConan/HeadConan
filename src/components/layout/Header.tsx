import React, { useState } from 'react';
import { WorldState } from '../../world/types';
import { 
  Layers, 
  Plus, 
  ChevronDown, 
  StickyNote,
  History,
  UserCheck,
  Wand2,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { DEMO_PRESETS } from '../../data/mockWorlds';
import { AIProviderId } from '../../ai/client';
import { EngineSelector } from './EngineSelector';
import { RoleSlot, getRoleBadgeStyle } from '../../roles/model';

interface HeaderProps {
  world: WorldState;
  onResetToPrompt: () => void;
  onSelectPreset: (presetId: string) => void;
  onOpenFeedModal: () => void;
  onOpenNotesModal: () => void;
  selectedEngine: AIProviderId;
  onSelectEngine: (engine: AIProviderId) => void;
  activeRole: RoleSlot;
  onSelectRole: (roleId: string) => void;
  isDirectorOverlayOpen: boolean;
  onToggleDirectorOverlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  world,
  onResetToPrompt,
  onSelectPreset,
  onOpenFeedModal,
  onOpenNotesModal,
  selectedEngine,
  onSelectEngine,
  activeRole,
  onSelectRole,
  isDirectorOverlayOpen,
  onToggleDirectorOverlay,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showRolesMenu, setShowRolesMenu] = useState(false);

  const roleStyle = getRoleBadgeStyle(activeRole.type);
  const roles = world.roles || [];

  return (
    <header className="h-16 border-b border-white/10 bg-[#090b12]/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
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
          <span className="text-xs font-mono font-bold tracking-widest text-slate-300 uppercase hidden md:inline">
            HeadConan
          </span>
        </button>

        <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

        {/* Current World Name & Temporal Stamp */}
        <div className="flex items-center space-x-2">
          <h2 className="text-xs sm:text-sm font-serif font-semibold text-slate-100 truncate max-w-[130px] sm:max-w-xs">
            {world.name}
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5 hidden lg:inline">
            {world.style?.temporalGrammar?.timeDisplayPrefix || 'Turn'} #{world.turnCount || 1}
          </span>
        </div>
      </div>

      {/* Center / Right: Role Slot Selector (Agency Shifting) */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Role Selector Pill */}
        <div className="relative">
          <button
            id="btn-role-selector"
            onClick={() => setShowRolesMenu(!showRolesMenu)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center space-x-1.5 ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text} hover:opacity-90 shadow-sm`}
            title="Shift Agency / Occupy another role in this world"
          >
            <span className="text-sm">{activeRole.avatar || roleStyle.icon}</span>
            <div className="text-left hidden sm:block">
              <span className="font-semibold">{activeRole.name}</span>
              <span className="text-[9px] font-mono block opacity-70 uppercase tracking-wider -mt-0.5">
                {activeRole.type} • {activeRole.agency}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
          </button>

          {showRolesMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRolesMenu(false)}
              />
              <div className="absolute right-0 sm:left-0 mt-2 w-72 bg-[#0d101a] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-white/5 backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Select Role Slot (Agency Shift)
                </div>
                <div className="py-1.5 space-y-1">
                  {roles.map((role) => {
                    const isSelected = role.id === activeRole.id;
                    const rStyle = getRoleBadgeStyle(role.type);
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          onSelectRole(role.id);
                          setShowRolesMenu(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start space-x-2.5 ${
                          isSelected
                            ? 'bg-white/10 border border-white/20'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="text-lg mt-0.5">{role.avatar || rStyle.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                              {role.name}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${rStyle.bg} ${rStyle.text} ${rStyle.border}`}>
                              {role.type}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
                            {role.description}
                          </p>
                          <div className="text-[9px] font-mono text-slate-500 mt-1 flex items-center space-x-2">
                            <span>Agency: <b className="text-slate-400">{role.agency}</b></span>
                            <span>•</span>
                            <span>Sight: <b className="text-slate-400">{role.knowledge}</b></span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Director Quick Intervention Overlay Button */}
        <button
          id="btn-toggle-director-overlay"
          onClick={onToggleDirectorOverlay}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center space-x-1.5 ${
            isDirectorOverlayOpen
              ? 'bg-purple-600/30 border-purple-400/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)] font-bold'
              : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-slate-300'
          }`}
          title="Toggle Director intervention & spawning overlay"
        >
          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">Director</span>
        </button>

        {/* AI Engine Switcher (DeepSeek / Gemini / Procedural) */}
        <EngineSelector
          selectedEngine={selectedEngine}
          onSelectEngine={onSelectEngine}
          compact
        />

        {/* Narrative Log Button */}
        <button
          id="btn-open-narrative-log"
          onClick={onOpenFeedModal}
          className="px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-medium text-slate-300 transition-colors flex items-center space-x-1.5"
          title="Review narrative chronicle"
        >
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden xl:inline">Chronicle</span>
        </button>

        {/* Notes quick button */}
        <button
          id="btn-open-notes"
          onClick={onOpenNotesModal}
          className="px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-medium text-slate-300 transition-colors flex items-center space-x-1.5 relative"
          title="Open deduction scratchpad"
        >
          <StickyNote className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xl:inline">Notes</span>
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
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium text-indigo-200 transition-colors flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Worlds</span>
            <ChevronDown className="w-3 h-3 text-indigo-300" />
          </button>

          {showPresetsMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPresetsMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-[#0e111a] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-white/5 backdrop-blur-xl">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Archetype Demo Worlds
                </div>
                <div className="py-1.5 space-y-1">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        setShowPresetsMenu(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex flex-col group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-indigo-300 group-hover:text-indigo-200">{preset.title}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                          {preset.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">{preset.subtitle}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-1.5">
                  <button
                    onClick={() => {
                      onResetToPrompt();
                      setShowPresetsMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs text-amber-300 hover:bg-white/5 transition-colors flex items-center space-x-2 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom World from Prompt</span>
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
