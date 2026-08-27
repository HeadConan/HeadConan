import React, { useState, useEffect } from 'react';
import { WorldState } from '../../world/types';
import { ChevronDown, History, Compass, Layers, StickyNote, Wand2 as Wand2Icon, Plus as PlusIcon } from 'lucide-react';
import { DEMO_PRESETS } from '../../data/mockWorlds';
import { RoleSlot, getRoleBadgeStyle } from '../../roles/model';

interface HeaderProps {
  world: WorldState;
  onResetToPrompt: () => void;
  onSelectPreset: (presetId: string) => void;
  onOpenFeedModal: () => void;
  onOpenNotesModal: () => void;
  onOpenAtlas?: () => void;
  onOpenLayoutLab?: () => void;
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
  onOpenAtlas,
  onOpenLayoutLab,
  activeRole,
  onSelectRole,
  isDirectorOverlayOpen,
  onToggleDirectorOverlay,
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const roleStyle = getRoleBadgeStyle(activeRole.type);
  const roles = world.roles || [];

  // Scroll-aware divider (§7.2): hairline + soft shadow fade in only after scrolling
  useEffect(() => {
    const el = document.getElementById('main-scroll-container');
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 4);
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 h-14 bg-zinc-50/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-[border-color,box-shadow] duration-200 border-b ${
        scrolled ? 'border-zinc-200 shadow-sm' : 'border-transparent'
      }`}
    >
      {/* Left: Brand & World Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onResetToPrompt}
          className="flex items-center gap-2 text-left cursor-pointer group"
          title="Return to creative space"
        >
          <div className="flex size-7 items-center justify-center rounded-lg bg-zinc-900 transition-colors group-hover:bg-zinc-800">
            <span className="size-2.5 rotate-45 rounded-[3px] bg-zinc-100" />
          </div>
          <span className="hidden text-xs font-semibold tracking-widest text-zinc-900 uppercase md:inline">
            HeadConan
          </span>
        </button>

        <div className="hidden h-4 w-px bg-zinc-200 md:block" />

        {/* Current World Name & Temporal Stamp */}
        <div className="flex items-center gap-2">
          <h2 className="truncate max-w-[130px] text-sm font-semibold text-zinc-900 sm:max-w-xs">
            {world.name}
          </h2>
          <span className="hidden rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-medium tabular-nums text-zinc-500 lg:inline">
            {world.style?.temporalGrammar?.timeDisplayPrefix || 'Turn'} #{world.turnCount || 1}
          </span>
        </div>
      </div>

      {/* Right: Role Slot Selector + actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Role Selector Pill */}
        <div className="relative">
          <button
            id="btn-role-selector"
            onClick={() => setShowRolesMenu(!showRolesMenu)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all hover:opacity-90 sm:px-3 ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}`}
            title="Shift Agency / Occupy another role in this world"
          >
            <span className="text-sm leading-none">{activeRole.avatar || roleStyle.icon}</span>
            <span className="hidden text-left sm:block">
              <span className="font-semibold">{activeRole.name}</span>
            </span>
            <ChevronDown className="size-3 opacity-60" />
          </button>

          {showRolesMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRolesMenu(false)} />
              <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  Select Role Slot (Agency Shift)
                </div>
                <div className="space-y-1 py-1.5">
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
                        className={`w-full rounded-lg p-2.5 text-left text-xs transition-all flex items-start gap-2.5 ${
                          isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <span className="mt-0.5 text-lg leading-none">{role.avatar || rStyle.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-semibold ${isSelected ? 'text-zinc-900' : 'text-zinc-800'}`}>
                              {role.name}
                            </span>
                            <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] ${rStyle.bg} ${rStyle.text} ${rStyle.border}`}>
                              {role.type}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 font-sans text-[10px] text-zinc-500">
                            {role.description}
                          </p>
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
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            isDirectorOverlayOpen
              ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
              : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100'
          }`}
          title="Toggle Director intervention & spawning overlay"
        >
          <Wand2Icon className="size-4" strokeWidth={1.75} />
          <span className="hidden md:inline">Director</span>
        </button>

        {/* Narrative Log Button */}
        <button
          id="btn-open-narrative-log"
          onClick={onOpenFeedModal}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          title="Review narrative chronicle"
        >
          <History className="size-4 text-zinc-500" strokeWidth={1.75} />
          <span className="hidden xl:inline">Chronicle</span>
        </button>

        {/* World Atlas Button */}
        {onOpenAtlas && (
          <button
            id="btn-open-atlas"
            onClick={onOpenAtlas}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
            title="Browse World Atlas & Portfolio"
          >
            <Compass className="size-4 text-zinc-500" strokeWidth={1.75} />
            <span className="hidden lg:inline">Atlas</span>
          </button>
        )}

        {/* Layout Lab Research Button */}
        {onOpenLayoutLab && (
          <button
            id="btn-open-layout-lab"
            onClick={onOpenLayoutLab}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
            title="Open HeadConan Layout Lab"
          >
            <Layers className="size-4 text-zinc-500" strokeWidth={1.75} />
            <span className="hidden lg:inline">Layout Lab</span>
          </button>
        )}

        {/* Notes quick button */}
        <button
          id="btn-open-notes"
          onClick={onOpenNotesModal}
          className="relative flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
          title="Open deduction scratchpad"
        >
          <StickyNote className="size-4 text-zinc-500" strokeWidth={1.75} />
          <span className="hidden xl:inline">Notes</span>
          {world.notes && world.notes.length > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-medium tabular-nums text-zinc-700">
              {world.notes.length}
            </span>
          )}
        </button>

        {/* Preset Switcher Dropdown */}
        <div className="relative">
          <button
            id="btn-switch-world"
            onClick={() => setShowPresetsMenu(!showPresetsMenu)}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800 sm:px-3"
          >
            Worlds
            <ChevronDown className="size-3 text-zinc-400" />
          </button>

          {showPresetsMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowPresetsMenu(false)} />
              <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
                <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                  Archetype Demo Worlds
                </div>
                <div className="space-y-1 py-1.5">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset.id);
                        setShowPresetsMenu(false);
                      }}
                      className="flex w-full flex-col rounded-lg p-2.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-zinc-900">{preset.title}</span>
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
                          {preset.tag}
                        </span>
                      </div>
                      <span className="mt-0.5 truncate font-sans text-[11px] text-zinc-500">{preset.subtitle}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-zinc-100 pt-1.5">
                  <button
                    onClick={() => {
                      onResetToPrompt();
                      setShowPresetsMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <PlusIcon className="size-3.5" strokeWidth={1.75} />
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
