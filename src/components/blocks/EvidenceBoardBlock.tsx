import React, { useState } from 'react';
import { WorldState, UIBlock, ClueItem } from '../../world/types';
import {
  Pin,
  Search,
  Plus,
  FileText,
  User,
  MapPin,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Link as LinkIcon
} from 'lucide-react';

interface EvidenceBoardBlockProps {
  block: UIBlock;
  world: WorldState;
  onAction?: (action: string) => void;
  onAddNote?: (content: string) => void;
}

export const EvidenceBoardBlock: React.FC<EvidenceBoardBlockProps> = ({
  block,
  world,
  onAction,
  onAddNote,
}) => {
  const [selectedClue, setSelectedClue] = useState<ClueItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const clues = world.clues || [];

  const filteredClues = clues.filter((c) => {
    if (filterCategory === 'all') return true;
    return c.category === filterCategory;
  });

  const getCategoryBadge = (cat: ClueItem['category']) => {
    switch (cat) {
      case 'physical':
        return <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] text-amber-700">Physical Exhibit</span>;
      case 'testimony':
        return <span className="rounded border border-cyan-200 bg-cyan-50 px-1.5 py-0.5 font-mono text-[10px] text-cyan-700">Witness Statement</span>;
      case 'documentary':
        return <span className="rounded border border-purple-200 bg-purple-50 px-1.5 py-0.5 font-mono text-[10px] text-purple-700">Archival Document</span>;
      case 'environmental':
        return <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700">Crime Scene Anomaly</span>;
    }
  };

  const getStatusIcon = (status: ClueItem['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span title="Key Linked Clue">
            <CheckCircle2 className="size-3.5 text-emerald-600" strokeWidth={1.75} />
          </span>
        );
      case 'refuted':
        return (
          <span title="Refuted / False Lead">
            <XCircle className="size-3.5 text-rose-600" strokeWidth={1.75} />
          </span>
        );
      default:
        return (
          <span title="Unresolved Lead">
            <HelpCircle className="size-3.5 text-zinc-400" strokeWidth={1.75} />
          </span>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-card">
      {/* Background subtle texture effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#a1a1aa_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex flex-col justify-between gap-3 border-b border-zinc-100 pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700">
            <Pin className="size-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-serif text-sm font-bold text-zinc-900">
              <span>{block.title || 'Case Evidence & Deduction Board'}</span>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] text-amber-700">
                {clues.length} Exhibits Tracked
              </span>
            </h3>
            <p className="mt-0.5 font-sans text-xs text-zinc-500">
              Pinned forensic leads, red yarn connections, and witness testimony
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'physical', 'testimony', 'documentary', 'environmental'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-all ${
                filterCategory === cat
                  ? 'border-zinc-900 bg-zinc-900 font-bold text-zinc-50'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Evidence Grid */}
      <div className="relative z-10 mb-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {filteredClues.map((clue) => {
          const isSelected = selectedClue?.id === clue.id;
          const relatedSuspect = world.characters.find((c) => c.id === clue.relatedSuspectId);
          const relatedLoc = world.locations.find((l) => l.id === clue.relatedLocationId);

          return (
            <div
              key={clue.id}
              onClick={() => setSelectedClue(isSelected ? null : clue)}
              className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all ${
                isSelected
                  ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                  : 'border-zinc-100 bg-white hover:border-zinc-300'
              }`}
            >
              {/* Pushpin visual header */}
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full border border-rose-300 bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                  {getCategoryBadge(clue.category)}
                </div>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(clue.status)}
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-3">
                <h4 className="mb-1 font-serif text-xs font-bold leading-snug text-zinc-900 group-hover:text-zinc-950">
                  {clue.title}
                </h4>
                <p className="line-clamp-2 font-sans text-[11px] leading-relaxed text-zinc-500">
                  {clue.description}
                </p>
              </div>

              {/* Connected Meta (Suspect / Location / Thread) */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-2 font-mono text-[10px] text-zinc-500">
                <div className="flex items-center gap-2 truncate">
                  {relatedSuspect && (
                    <span className="flex items-center gap-1 truncate text-zinc-600">
                      <User className="size-3 shrink-0 text-zinc-400" strokeWidth={1.75} />
                      <span>{relatedSuspect.name}</span>
                    </span>
                  )}
                  {relatedLoc && (
                    <span className="flex items-center gap-1 truncate text-zinc-500">
                      <MapPin className="size-3 shrink-0 text-zinc-400" strokeWidth={1.75} />
                      <span>{relatedLoc.name}</span>
                    </span>
                  )}
                </div>
                {clue.connectedTo && clue.connectedTo.length > 0 && (
                  <span className="flex shrink-0 items-center gap-1 font-bold text-rose-700">
                    <LinkIcon className="size-3" strokeWidth={1.75} />
                    <span>{clue.connectedTo.length} threads</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Clue Inspector & Fast Interrogation Actions */}
      {selectedClue && (
        <div className="relative z-10 animate-in fade-in space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Exhibit Inspection • {selectedClue.title}
              </div>
              <p className="font-sans text-xs leading-relaxed text-zinc-700">
                {selectedClue.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedClue(null)}
              className="p-1 text-xs text-zinc-400 hover:text-zinc-900"
            >
              ✕
            </button>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 font-mono text-xs text-amber-800">
            <span className="font-bold text-amber-900">Investigative Significance:</span> {selectedClue.significance}
          </div>

          {/* Quick Deduction Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => onAction && onAction(`Examine forensic traces on "${selectedClue.title}" under magnifying glass`)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
            >
              <Search className="size-3.5" strokeWidth={1.75} />
              <span>Forensic Analysis</span>
            </button>

            {selectedClue.relatedSuspectId && (
              <button
                onClick={() => {
                  const s = world.characters.find(c => c.id === selectedClue.relatedSuspectId);
                  if (onAction) onAction(`Confront ${s?.name || 'suspect'} with evidence: "${selectedClue.title}"`);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100"
              >
                <User className="size-3.5" strokeWidth={1.75} />
                <span>Confront Linked Suspect</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onAddNote) onAddNote(`Deduction on ${selectedClue.title}: ${selectedClue.significance}`);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <FileText className="size-3.5" strokeWidth={1.75} />
              <span>Pin Note to Dossier</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
