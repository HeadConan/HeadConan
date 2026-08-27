import React from 'react';
import {
  LayoutDashboard,
  History,
  StickyNote,
  Compass,
  Layers,
  Wand2,
  Plus,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { AIProviderId } from '../../ai/client';
import { EngineSelector } from './EngineSelector';

export type SidebarItemId =
  | 'overview'
  | 'chronicle'
  | 'notes'
  | 'atlas'
  | 'layout-lab'
  | 'director'
  | 'new-world';

interface NavItem {
  id: SidebarItemId;
  label: string;
  icon: LucideIcon;
  hint?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, hint: 'World canvas' },
  { id: 'chronicle', label: 'Chronicle', icon: History, hint: 'Turn history' },
  { id: 'notes', label: 'Notes', icon: StickyNote, hint: 'Deduction scratchpad' },
  { id: 'atlas', label: 'Atlas', icon: Compass, hint: 'World portfolio' },
  { id: 'layout-lab', label: 'Layout Lab', icon: Layers, hint: 'Spatial compositions' },
  { id: 'director', label: 'Director', icon: Wand2, hint: 'World-level agency' },
  { id: 'new-world', label: 'New World', icon: Plus, hint: 'Reset to creation' },
];

interface AppSidebarProps {
  activeItem: SidebarItemId;
  onNavigate: (id: SidebarItemId) => void;
  noteCount: number;
  isDirectorOpen: boolean;
  selectedEngine: AIProviderId;
  onSelectEngine: (engine: AIProviderId) => void;
  worldName: string;
  turnCount: number;
}

/**
 * SidebarItem spec (Lemma AI style guide §7.1):
 * 36px tall (h-9), rounded-sm, 18px lucide icon at strokeWidth 1.75.
 * Active: bg-zinc-200/80 text-black. Inactive: text-black hover:bg-zinc-200/70.
 */
const sidebarItemClasses = (isActive: boolean) =>
  `flex h-9 w-full items-center gap-2 rounded-sm px-3 text-sm transition-colors ${
    isActive ? 'bg-zinc-200/80 text-black font-medium' : 'text-black hover:bg-zinc-200/70'
  }`;

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeItem,
  onNavigate,
  noteCount,
  isDirectorOpen,
  selectedEngine,
  onSelectEngine,
  worldName,
  turnCount,
}) => {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col rounded-xl bg-sidebar p-2">
      {/* Brand */}
      <button
        onClick={() => onNavigate('overview')}
        className="flex h-11 items-center gap-2.5 px-3 text-left"
        title="HeadConan"
      >
        <div className="flex size-6 items-center justify-center rounded-md bg-zinc-900">
          <Sparkles className="size-3.5 text-zinc-100" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-tight text-black">HeadConan</div>
          <div className="truncate text-[11px] leading-tight text-zinc-500">{worldName}</div>
        </div>
      </button>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto scrollbar-hidden px-1" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.id === 'director'
              ? isDirectorOpen
              : item.id === activeItem;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={sidebarItemClasses(isActive)}
              title={item.hint}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.id === 'notes' && noteCount > 0 && (
                <span className="rounded-sm bg-zinc-200 px-1.5 text-[11px] font-medium tabular-nums text-zinc-700">
                  {noteCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: engine + turn */}
      <div className="space-y-2 border-t border-zinc-200 px-1 pt-2">
        <div className="flex items-center justify-between px-2 text-[11px] text-zinc-500">
          <span className="font-medium">Turn #{turnCount || 1}</span>
        </div>
        <EngineSelector selectedEngine={selectedEngine} onSelectEngine={onSelectEngine} compact />
      </div>
    </aside>
  );
};
