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
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">Physical Exhibit</span>;
      case 'testimony':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Witness Statement</span>;
      case 'documentary':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">Archival Document</span>;
      case 'environmental':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Crime Scene Anomaly</span>;
    }
  };

  const getStatusIcon = (status: ClueItem['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span title="Key Linked Clue">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          </span>
        );
      case 'refuted':
        return (
          <span title="Refuted / False Lead">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          </span>
        );
      default:
        return (
          <span title="Unresolved Lead">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </span>
        );
    }
  };

  return (
    <div className="bg-[#110f0b]/95 border border-amber-500/25 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background corkboard subtle texture effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-amber-500/15 pb-4 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <Pin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-100 flex items-center space-x-2">
              <span>{block.title || 'Case Evidence & Deduction Board'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {clues.length} Exhibits Tracked
              </span>
            </h3>
            <p className="text-xs text-amber-200/60 font-sans mt-0.5">
              Pinned forensic leads, red yarn connections, and witness testimony
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'physical', 'testimony', 'documentary', 'environmental'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                filterCategory === cat
                  ? 'bg-amber-500/25 text-amber-200 border-amber-500/40 font-bold'
                  : 'bg-white/[0.02] text-amber-200/50 border-transparent hover:border-amber-500/20'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 relative z-10 mb-4">
        {filteredClues.map((clue) => {
          const isSelected = selectedClue?.id === clue.id;
          const relatedSuspect = world.characters.find((c) => c.id === clue.relatedSuspectId);
          const relatedLoc = world.locations.find((l) => l.id === clue.relatedLocationId);

          return (
            <div
              key={clue.id}
              onClick={() => setSelectedClue(isSelected ? null : clue)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400/60 shadow-[0_0_20px_rgba(217,119,6,0.2)]'
                  : 'bg-[#181510]/80 hover:bg-[#201c15] border-amber-500/20 hover:border-amber-400/40'
              }`}
            >
              {/* Pushpin visual header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] border border-rose-300" />
                  {getCategoryBadge(clue.category)}
                </div>
                <div className="flex items-center space-x-1.5">
                  {getStatusIcon(clue.status)}
                </div>
              </div>

              {/* Title & Description */}
              <div className="mb-3">
                <h4 className="text-xs font-serif font-bold text-amber-100 group-hover:text-amber-200 mb-1 leading-snug">
                  {clue.title}
                </h4>
                <p className="text-[11px] text-amber-200/70 font-sans leading-relaxed line-clamp-2">
                  {clue.description}
                </p>
              </div>

              {/* Connected Meta (Suspect / Location / Thread) */}
              <div className="pt-2 border-t border-amber-500/10 flex items-center justify-between text-[10px] font-mono text-amber-300/80">
                <div className="flex items-center space-x-2 truncate">
                  {relatedSuspect && (
                    <span className="flex items-center space-x-1 text-amber-300 truncate">
                      <User className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{relatedSuspect.name}</span>
                    </span>
                  )}
                  {relatedLoc && (
                    <span className="flex items-center space-x-1 text-amber-400/80 truncate">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{relatedLoc.name}</span>
                    </span>
                  )}
                </div>
                {clue.connectedTo && clue.connectedTo.length > 0 && (
                  <span className="flex items-center space-x-1 text-rose-400 font-bold shrink-0">
                    <LinkIcon className="w-3 h-3" />
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
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-400/40 relative z-10 animate-in fade-in duration-200 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-0.5">
                Exhibit Inspection • {selectedClue.title}
              </div>
              <p className="text-xs text-amber-100 font-sans leading-relaxed">
                {selectedClue.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedClue(null)}
              className="text-xs text-amber-300/60 hover:text-amber-200 p-1"
            >
              ✕
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 text-xs font-mono text-amber-300/90">
            <span className="text-amber-400 font-bold">Investigative Significance:</span> {selectedClue.significance}
          </div>

          {/* Quick Deduction Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => onAction && onAction(`Examine forensic traces on "${selectedClue.title}" under magnifying glass`)}
              className="px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/40 border border-amber-400/40 text-xs font-medium text-amber-200 transition-colors flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Forensic Analysis</span>
            </button>

            {selectedClue.relatedSuspectId && (
              <button
                onClick={() => {
                  const s = world.characters.find(c => c.id === selectedClue.relatedSuspectId);
                  if (onAction) onAction(`Confront ${s?.name || 'suspect'} with evidence: "${selectedClue.title}"`);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/40 border border-rose-400/40 text-xs font-medium text-rose-200 transition-colors flex items-center space-x-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Confront Linked Suspect</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onAddNote) onAddNote(`Deduction on ${selectedClue.title}: ${selectedClue.significance}`);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Pin Note to Dossier</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
